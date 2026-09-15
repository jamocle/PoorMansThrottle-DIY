const ZIP_LOCAL_FILE_HEADER_SIGNATURE = 0x04034B50;
const ZIP_CENTRAL_DIRECTORY_SIGNATURE = 0x02014B50;
const ZIP_END_OF_CENTRAL_DIRECTORY_SIGNATURE = 0x06054B50;
const ZIP64_END_OF_CENTRAL_DIRECTORY_LOCATOR_SIGNATURE = 0x07064B50;
const ROOT_README_NAME = "README.md";
const textEncoder = new TextEncoder();

function readUint16(view, offset) {
    return view.getUint16(offset, true);
}

function readUint32(view, offset) {
    return view.getUint32(offset, true);
}

function writeUint16(view, offset, value) {
    view.setUint16(offset, value, true);
}

function writeUint32(view, offset, value) {
    view.setUint32(offset, value >>> 0, true);
}

function findEndOfCentralDirectory(bytes) {
    const minimumLength = 22;
    const maximumCommentLength = 0xFFFF;
    const searchStart = Math.max(0, bytes.length - minimumLength - maximumCommentLength);
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

    for (let offset = bytes.length - minimumLength; offset >= searchStart; offset -= 1) {
        if (readUint32(view, offset) !== ZIP_END_OF_CENTRAL_DIRECTORY_SIGNATURE) {
            continue;
        }

        const commentLength = readUint16(view, offset + 20);
        if (offset + minimumLength + commentLength === bytes.length) {
            return offset;
        }
    }

    throw new Error("The ZIP file is missing a valid central directory.");
}

function hasZip64Locator(bytes, eocdOffset) {
    if (eocdOffset < 20) {
        return false;
    }

    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    return readUint32(view, eocdOffset - 20) === ZIP64_END_OF_CENTRAL_DIRECTORY_LOCATOR_SIGNATURE;
}

function isRootReadme(fileNameBytes) {
    const expected = textEncoder.encode(ROOT_README_NAME);

    if (fileNameBytes.length !== expected.length) {
        return false;
    }

    for (let index = 0; index < expected.length; index += 1) {
        const actualByte = fileNameBytes[index];
        const expectedByte = expected[index];

        const normalizedActual =
            actualByte >= 0x41 && actualByte <= 0x5A ? actualByte + 0x20 : actualByte;
        const normalizedExpected =
            expectedByte >= 0x41 && expectedByte <= 0x5A ? expectedByte + 0x20 : expectedByte;

        if (normalizedActual !== normalizedExpected) {
            return false;
        }
    }

    return true;
}

function parseCentralDirectory(bytes, centralDirectoryOffset, centralDirectorySize, entryCount) {
    const centralDirectoryEnd = centralDirectoryOffset + centralDirectorySize;

    if (
        centralDirectoryOffset < 0 ||
        centralDirectorySize < 0 ||
        centralDirectoryEnd > bytes.length
    ) {
        throw new Error("The ZIP central directory is invalid.");
    }

    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const records = [];
    let cursor = centralDirectoryOffset;

    for (let index = 0; index < entryCount; index += 1) {
        if (cursor + 46 > centralDirectoryEnd) {
            throw new Error("The ZIP central directory is truncated.");
        }

        if (readUint32(view, cursor) !== ZIP_CENTRAL_DIRECTORY_SIGNATURE) {
            throw new Error("The ZIP central directory contains an unsupported record.");
        }

        const fileNameLength = readUint16(view, cursor + 28);
        const extraFieldLength = readUint16(view, cursor + 30);
        const fileCommentLength = readUint16(view, cursor + 32);
        const recordLength = 46 + fileNameLength + extraFieldLength + fileCommentLength;
        const recordEnd = cursor + recordLength;

        if (recordEnd > centralDirectoryEnd) {
            throw new Error("The ZIP central directory contains an invalid entry.");
        }

        const fileNameStart = cursor + 46;
        const fileNameBytes = bytes.subarray(fileNameStart, fileNameStart + fileNameLength);

        records.push({
            bytes: bytes.slice(cursor, recordEnd),
            isRootReadme: isRootReadme(fileNameBytes)
        });

        cursor = recordEnd;
    }

    if (cursor !== centralDirectoryEnd) {
        throw new Error("The ZIP contains unsupported central-directory data.");
    }

    return records;
}

function createCrc32Table() {
    const table = new Uint32Array(256);

    for (let value = 0; value < 256; value += 1) {
        let crc = value;

        for (let bit = 0; bit < 8; bit += 1) {
            crc = (crc & 1) !== 0 ? 0xEDB88320 ^ (crc >>> 1) : crc >>> 1;
        }

        table[value] = crc >>> 0;
    }

    return table;
}

const CRC32_TABLE = createCrc32Table();

function calculateCrc32(bytes) {
    let crc = 0xFFFFFFFF;

    for (const byte of bytes) {
        crc = CRC32_TABLE[(crc ^ byte) & 0xFF] ^ (crc >>> 8);
    }

    return (crc ^ 0xFFFFFFFF) >>> 0;
}

function getDosDateTime(date) {
    const year = Math.max(1980, Math.min(2107, date.getFullYear()));

    const dosTime =
        ((date.getHours() & 0x1F) << 11) |
        ((date.getMinutes() & 0x3F) << 5) |
        ((Math.floor(date.getSeconds() / 2)) & 0x1F);

    const dosDate =
        (((year - 1980) & 0x7F) << 9) |
        (((date.getMonth() + 1) & 0x0F) << 5) |
        (date.getDate() & 0x1F);

    return { dosDate, dosTime };
}

function createReadmeRecords(contentBytes, localHeaderOffset) {
    const fileNameBytes = textEncoder.encode(ROOT_README_NAME);
    const crc32 = calculateCrc32(contentBytes);
    const { dosDate, dosTime } = getDosDateTime(new Date());
    const utf8Flag = 0x0800;

    const localHeader = new Uint8Array(30 + fileNameBytes.length);
    const localView = new DataView(
        localHeader.buffer,
        localHeader.byteOffset,
        localHeader.byteLength
    );

    writeUint32(localView, 0, ZIP_LOCAL_FILE_HEADER_SIGNATURE);
    writeUint16(localView, 4, 20);
    writeUint16(localView, 6, utf8Flag);
    writeUint16(localView, 8, 0);
    writeUint16(localView, 10, dosTime);
    writeUint16(localView, 12, dosDate);
    writeUint32(localView, 14, crc32);
    writeUint32(localView, 18, contentBytes.length);
    writeUint32(localView, 22, contentBytes.length);
    writeUint16(localView, 26, fileNameBytes.length);
    writeUint16(localView, 28, 0);
    localHeader.set(fileNameBytes, 30);

    const centralRecord = new Uint8Array(46 + fileNameBytes.length);
    const centralView = new DataView(
        centralRecord.buffer,
        centralRecord.byteOffset,
        centralRecord.byteLength
    );

    writeUint32(centralView, 0, ZIP_CENTRAL_DIRECTORY_SIGNATURE);
    writeUint16(centralView, 4, 0x0314);
    writeUint16(centralView, 6, 20);
    writeUint16(centralView, 8, utf8Flag);
    writeUint16(centralView, 10, 0);
    writeUint16(centralView, 12, dosTime);
    writeUint16(centralView, 14, dosDate);
    writeUint32(centralView, 16, crc32);
    writeUint32(centralView, 20, contentBytes.length);
    writeUint32(centralView, 24, contentBytes.length);
    writeUint16(centralView, 28, fileNameBytes.length);
    writeUint16(centralView, 30, 0);
    writeUint16(centralView, 32, 0);
    writeUint16(centralView, 34, 0);
    writeUint16(centralView, 36, 0);
    writeUint32(centralView, 38, 0);
    writeUint32(centralView, 42, localHeaderOffset);
    centralRecord.set(fileNameBytes, 46);

    return { localHeader, centralRecord };
}

function createEndOfCentralDirectory(entryCount, centralDirectorySize, centralDirectoryOffset, commentBytes) {
    if (entryCount > 0xFFFF) {
        throw new Error("The ZIP contains too many files to update safely.");
    }

    const eocd = new Uint8Array(22 + commentBytes.length);
    const view = new DataView(eocd.buffer, eocd.byteOffset, eocd.byteLength);

    writeUint32(view, 0, ZIP_END_OF_CENTRAL_DIRECTORY_SIGNATURE);
    writeUint16(view, 4, 0);
    writeUint16(view, 6, 0);
    writeUint16(view, 8, entryCount);
    writeUint16(view, 10, entryCount);
    writeUint32(view, 12, centralDirectorySize);
    writeUint32(view, 16, centralDirectoryOffset);
    writeUint16(view, 20, commentBytes.length);
    eocd.set(commentBytes, 22);

    return eocd;
}

export async function addOrReplaceRootReadme(file, metadata) {
    const category = typeof metadata?.category === "string" ? metadata.category.trim() : "";
    const submissionType =
        typeof metadata?.submissionType === "string" ? metadata.submissionType.trim() : "";
    const soundName =
        typeof metadata?.soundName === "string" ? metadata.soundName.trim() : "";
    const originalFileName =
        typeof metadata?.originalFileName === "string" ? metadata.originalFileName.trim() : "";
    const uploadedAtEastern =
        typeof metadata?.uploadedAtEastern === "string" ? metadata.uploadedAtEastern.trim() : "";
    const easternTimeZoneAbbreviation =
        typeof metadata?.easternTimeZoneAbbreviation === "string"
            ? metadata.easternTimeZoneAbbreviation.trim()
            : "";

    if (category !== "diesel" && category !== "steam") {
        throw new Error("A valid sound category is required before README.md can be added.");
    }

    if (submissionType !== "pack" && submissionType !== "individual") {
        throw new Error("A valid submission type is required before README.md can be added.");
    }

    if (!soundName) {
        throw new Error("A sound name is required before README.md can be added.");
    }

    if (!originalFileName) {
        throw new Error("The original ZIP filename is required before README.md can be added.");
    }

    if (!uploadedAtEastern) {
        throw new Error("The Eastern upload timestamp is required before README.md can be added.");
    }

    if (easternTimeZoneAbbreviation !== "EST" && easternTimeZoneAbbreviation !== "EDT") {
        throw new Error("The Eastern time zone abbreviation must be EST or EDT.");
    }

    const originalBytes = new Uint8Array(await file.arrayBuffer());
    const eocdOffset = findEndOfCentralDirectory(originalBytes);
    const view = new DataView(
        originalBytes.buffer,
        originalBytes.byteOffset,
        originalBytes.byteLength
    );

    const diskNumber = readUint16(view, eocdOffset + 4);
    const centralDirectoryDisk = readUint16(view, eocdOffset + 6);
    const entriesOnDisk = readUint16(view, eocdOffset + 8);
    const totalEntries = readUint16(view, eocdOffset + 10);
    const centralDirectorySize = readUint32(view, eocdOffset + 12);
    const centralDirectoryOffset = readUint32(view, eocdOffset + 16);
    const commentLength = readUint16(view, eocdOffset + 20);

    if (diskNumber !== 0 || centralDirectoryDisk !== 0 || entriesOnDisk !== totalEntries) {
        throw new Error("Multi-part ZIP files are not supported.");
    }

    if (
        totalEntries === 0xFFFF ||
        centralDirectorySize === 0xFFFFFFFF ||
        centralDirectoryOffset === 0xFFFFFFFF ||
        hasZip64Locator(originalBytes, eocdOffset)
    ) {
        throw new Error("ZIP64 archives are not supported for sound uploads.");
    }

    const records = parseCentralDirectory(
        originalBytes,
        centralDirectoryOffset,
        centralDirectorySize,
        totalEntries
    );

    const preservedRecords = records
        .filter((record) => !record.isRootReadme)
        .map((record) => record.bytes);

    const readmeText =
        "category = " +
        category +
        "\nsubmissionType = " +
        submissionType +
        "\nsoundName = " +
        soundName +
        "\nfile = " +
        originalFileName +
        "\nuploadedAtEastern = " +
        uploadedAtEastern +
        "\ntimeZone = America/New_York" +
        "\ntimeZoneAbbreviation = " +
        easternTimeZoneAbbreviation +
        "\n";
    const readmeContent = textEncoder.encode(readmeText);
    const readmeOffset = centralDirectoryOffset;
    const readmeRecords = createReadmeRecords(readmeContent, readmeOffset);

    const centralDirectoryStart =
        centralDirectoryOffset + readmeRecords.localHeader.length + readmeContent.length;

    const centralDirectoryParts = [...preservedRecords, readmeRecords.centralRecord];
    const newCentralDirectorySize = centralDirectoryParts.reduce(
        (total, part) => total + part.length,
        0
    );

    const originalComment = originalBytes.slice(
        eocdOffset + 22,
        eocdOffset + 22 + commentLength
    );

    const newEntryCount = preservedRecords.length + 1;
    const newEocd = createEndOfCentralDirectory(
        newEntryCount,
        newCentralDirectorySize,
        centralDirectoryStart,
        originalComment
    );

    const updatedBlob = new Blob(
        [
            originalBytes.slice(0, centralDirectoryOffset),
            readmeRecords.localHeader,
            readmeContent,
            ...centralDirectoryParts,
            newEocd
        ],
        { type: "application/zip" }
    );

    return new File([updatedBlob], file.name, {
        type: file.type || "application/zip",
        lastModified: file.lastModified || Date.now()
    });
}
