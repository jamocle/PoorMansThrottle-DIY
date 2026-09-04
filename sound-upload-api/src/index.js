const GITHUB_API_VERSION = "2026-03-10";
const DEFAULT_MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
const MAX_MULTIPART_OVERHEAD_BYTES = 1024 * 1024;

function getAllowedOrigins(env) {
    return String(env.ALLOWED_ORIGINS || "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
}

function getCorsHeaders(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigins = getAllowedOrigins(env);

    if (!origin || !allowedOrigins.includes(origin)) {
        return null;
    }

    return {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Accept, Content-Type",
        "Access-Control-Max-Age": "86400",
        "Vary": "Origin"
    };
}

function jsonResponse(request, env, status, payload) {
    const corsHeaders = getCorsHeaders(request, env) || {};

    return new Response(JSON.stringify(payload), {
        status,
        headers: {
            ...corsHeaders,
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff"
        }
    });
}

function getMaxUploadBytes(env) {
    const configured = Number.parseInt(String(env.MAX_UPLOAD_BYTES || ""), 10);

    if (Number.isFinite(configured) && configured > 0) {
        return configured;
    }

    return DEFAULT_MAX_UPLOAD_BYTES;
}

function sanitizeFileName(fileName) {
    const withoutPath = String(fileName || "")
        .replace(/\\/g, "/")
        .split("/")
        .pop()
        .trim();

    const normalized = withoutPath
        .replace(/\s+/g, "_")
        .replace(/[^A-Za-z0-9._()-]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^\.+/, "")
        .slice(0, 120);

    return normalized || "sound_pack.zip";
}

function isZipSignature(bytes) {
    return (
        bytes.length >= 4 &&
        bytes[0] === 0x50 &&
        bytes[1] === 0x4B &&
        (
            (bytes[2] === 0x03 && bytes[3] === 0x04) ||
            (bytes[2] === 0x05 && bytes[3] === 0x06) ||
            (bytes[2] === 0x07 && bytes[3] === 0x08)
        )
    );
}

function formatUtcTimestamp(date) {
    return date
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}Z$/, "Z");
}

function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    let binary = "";

    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
        const chunk = bytes.subarray(offset, Math.min(offset + chunkSize, bytes.length));
        binary += String.fromCharCode(...chunk);
    }

    return btoa(binary);
}

async function verifyTurnstile(request, env, token) {
    if (!token) {
        return false;
    }

    const body = new FormData();
    body.append("secret", env.TURNSTILE_SECRET);
    body.append("response", token);

    const remoteIp = request.headers.get("CF-Connecting-IP");
    if (remoteIp) {
        body.append("remoteip", remoteIp);
    }

    const response = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
            method: "POST",
            body
        }
    );

    if (!response.ok) {
        return false;
    }

    const result = await response.json();

    if (!result.success) {
        return false;
    }

    const expectedHostname = String(env.TURNSTILE_EXPECTED_HOSTNAME || "").trim();
    if (expectedHostname && result.hostname !== expectedHostname) {
        return false;
    }

    return true;
}

async function githubRequest(env, path, init = {}) {
    const response = await fetch(
        "https://api.github.com" + path,
        {
            ...init,
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: "Bearer " + env.GITHUB_TOKEN,
                "X-GitHub-Api-Version": GITHUB_API_VERSION,
                "User-Agent": "PoorMansThrottle-SoundUpload/1.0",
                ...(init.headers || {})
            }
        }
    );

    return response;
}

function buildRepositoryContentsPath(env, filePath) {
    const segments = filePath
        .split("/")
        .filter(Boolean)
        .map((segment) => encodeURIComponent(segment))
        .join("/");

    return (
        "/repos/" +
        encodeURIComponent(env.GITHUB_OWNER) +
        "/" +
        encodeURIComponent(env.GITHUB_REPOSITORY) +
        "/contents/" +
        segments
    );
}

async function uploadToGitHub(env, filePath, fileContent, category, originalName) {
    const content = arrayBufferToBase64(fileContent);
    const branch = String(env.GITHUB_BRANCH || "main");

    const response = await githubRequest(
        env,
        buildRepositoryContentsPath(env, filePath),
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message:
                    "Sound pack submission: " +
                    category +
                    " - " +
                    originalName,
                content,
                branch
            })
        }
    );

    if (!response.ok) {
        let detail = "";
        try {
            const payload = await response.json();
            detail = typeof payload.message === "string" ? payload.message : "";
        } catch {
            detail = "";
        }

        console.error(
            "GitHub upload failed.",
            response.status,
            detail
        );

        throw new Error("The submission could not be stored.");
    }
}

async function handleSubmission(request, env) {
    const corsHeaders = getCorsHeaders(request, env);
    if (!corsHeaders) {
        return jsonResponse(request, env, 403, {
            message: "This upload endpoint does not accept requests from this website."
        });
    }

    const maxUploadBytes = getMaxUploadBytes(env);
    const contentLength = Number.parseInt(request.headers.get("Content-Length") || "0", 10);

    if (
        Number.isFinite(contentLength) &&
        contentLength > maxUploadBytes + MAX_MULTIPART_OVERHEAD_BYTES
    ) {
        return jsonResponse(request, env, 413, {
            message: "The ZIP file is too large."
        });
    }

    const rateLimitKey =
        (request.headers.get("CF-Connecting-IP") || "unknown") + ":sound-upload";
    const rateLimitResult = await env.UPLOAD_RATE_LIMITER.limit({
        key: rateLimitKey
    });

    if (!rateLimitResult.success) {
        return jsonResponse(request, env, 429, {
            message: "Too many upload attempts were received. Please wait a minute and try again."
        });
    }

    let form;
    try {
        form = await request.formData();
    } catch {
        return jsonResponse(request, env, 400, {
            message: "The upload form could not be read."
        });
    }

    const category = String(form.get("category") || "").toLowerCase();
    if (category !== "diesel" && category !== "steam") {
        return jsonResponse(request, env, 400, {
            message: "Choose Diesel or Steam before uploading."
        });
    }

    const turnstileToken = String(form.get("turnstileToken") || "");
    if (!(await verifyTurnstile(request, env, turnstileToken))) {
        return jsonResponse(request, env, 400, {
            message: "Human verification failed. Please try again."
        });
    }

    const file = form.get("file");
    if (!(file instanceof File)) {
        return jsonResponse(request, env, 400, {
            message: "Choose a ZIP file before submitting."
        });
    }

    if (!/\.zip$/i.test(file.name)) {
        return jsonResponse(request, env, 400, {
            message: "Only ZIP files can be submitted."
        });
    }

    if (file.size <= 0 || file.size > maxUploadBytes) {
        return jsonResponse(request, env, 413, {
            message: "The ZIP file must be 20 MB or smaller."
        });
    }

    const signature = new Uint8Array(await file.slice(0, 4).arrayBuffer());
    if (!isZipSignature(signature)) {
        return jsonResponse(request, env, 400, {
            message: "The selected file does not appear to be a valid ZIP file."
        });
    }

    const safeName = sanitizeFileName(file.name);
    const normalizedName = /\.zip$/i.test(safeName) ? safeName : safeName + ".zip";
    const submissionId =
        formatUtcTimestamp(new Date()) +
        "-" +
        crypto.randomUUID().replace(/-/g, "").slice(0, 10);

    const storedName =
        submissionId +
        "__" +
        category +
        "__" +
        normalizedName;

    const uploadDirectory = String(env.GITHUB_UPLOAD_DIRECTORY || "sounds/upload")
        .replace(/^\/+|\/+$/g, "");
    const filePath = uploadDirectory + "/" + storedName;
    const fileBuffer = await file.arrayBuffer();

    try {
        await uploadToGitHub(
            env,
            filePath,
            fileBuffer,
            category,
            normalizedName
        );
    } catch (error) {
        console.error(error);
        return jsonResponse(request, env, 502, {
            message: "The upload service could not store your submission. Please try again later."
        });
    }

    return jsonResponse(request, env, 201, {
        success: true,
        submissionId,
        message:
            "Your sound pack was uploaded successfully. " +
            "It will be evaluated before it becomes part of the public Sound Packs library."
    });
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (request.method === "OPTIONS") {
            const corsHeaders = getCorsHeaders(request, env);
            if (!corsHeaders) {
                return new Response(null, { status: 403 });
            }

            return new Response(null, {
                status: 204,
                headers: corsHeaders
            });
        }

        if (request.method === "GET" && url.pathname === "/health") {
            return jsonResponse(request, env, 200, {
                ok: true,
                service: "pmt-sound-upload"
            });
        }

        if (request.method === "POST" && url.pathname === "/submit") {
            return handleSubmission(request, env);
        }

        return jsonResponse(request, env, 404, {
            message: "Not found."
        });
    }
};
