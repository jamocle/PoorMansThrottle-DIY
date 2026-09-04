# Poor Man's Throttle Sound Pack Upload API

This is the small upload gateway used by the **Crowdsourcing** area in the PMT Sound Packs UI.

It does only four things:

1. accepts a ZIP submission from the PMT GitHub Pages site;
2. verifies Cloudflare Turnstile;
3. validates and rate-limits the upload;
4. stores the ZIP in a **private GitHub submissions repository** under `sounds/upload/`.

The public PMT installer, firmware, app, documentation, and sound-pack library remain on GitHub Pages. No PMT firmware or application logic is hosted in Cloudflare.

## Why a separate private GitHub repository?

A branch in a public GitHub repository is still public, even when GitHub Pages does not publish that branch.

For that reason, unreviewed community ZIP files should **not** be placed in a branch of the public `PoorMansThrottle-DIY` repository.

The default Worker configuration uses this private repository:

`jamocle/PoorMansThrottle-Sound-Submissions`

Uploaded files are stored here:

```text
sounds/
└── upload/
    └── <submission-id>__<diesel-or-steam>__<original-name>.zip
```

After a ZIP passes your evaluations, copy the approved ZIP into the public repository:

```text
sounds/diesel/
```

or:

```text
sounds/steam/
```

The existing Sound Packs page will discover it automatically through the GitHub API.

## One-time setup

### 1. Create the private GitHub submissions repository

In GitHub, create:

`PoorMansThrottle-Sound-Submissions`

Settings:

- Visibility: **Private**
- Owner: `jamocle`
- Initialize it with a README so the `main` branch exists.

You do not need to manually create `sounds/upload`; the Worker creates the path when the first file is uploaded.

### 2. Create a fine-grained GitHub token

Create a fine-grained personal access token with:

- Repository access: **Only select repositories**
- Repository: `PoorMansThrottle-Sound-Submissions`
- Repository permission: **Contents — Read and write**
- No access to the public PMT repository is required.

Do not put the token in any HTML, JavaScript, JSON, or GitHub Pages file.

### 3. Create a Cloudflare Turnstile widget

In the Cloudflare dashboard:

1. Open **Turnstile**.
2. Create a widget for `jamocle.github.io`.
3. Use the **Managed** widget type.
4. Copy:
   - the public **Site Key**
   - the private **Secret Key**

The PMT page uses Turnstile's `interaction-only` appearance. Most normal users will not see a challenge unless Cloudflare needs interaction.

### 4. Install and log in to Wrangler

From this folder:

```zsh
npm install
npx wrangler login
```

### 5. Store the two secrets in Cloudflare

```zsh
npx wrangler secret put GITHUB_TOKEN
```

Paste the fine-grained GitHub token when prompted.

Then:

```zsh
npx wrangler secret put TURNSTILE_SECRET
```

Paste the Turnstile Secret Key when prompted.

These values are stored as Worker secrets and do not belong in source control.

### 6. Deploy the Worker

```zsh
npm run deploy
```

Wrangler will display a URL similar to:

```text
https://pmt-sound-upload.<your-workers-subdomain>.workers.dev
```

### 7. Enable the upload form on the PMT site

Edit:

```text
Installer/sound-upload-config.js
```

Set:

```javascript
window.PMT_SOUND_UPLOAD_CONFIG = {
    apiUrl: "https://pmt-sound-upload.<your-workers-subdomain>.workers.dev",
    turnstileSiteKey: "<YOUR PUBLIC TURNSTILE SITE KEY>"
};
```

The Turnstile **Site Key is public** and is safe to place in the browser configuration.

The GitHub token and Turnstile Secret Key must remain only in Cloudflare Worker secrets.

Commit/push the updated `sound-upload-config.js` to the public PMT repository.

## Normal user flow

The visitor opens **Sound Packs → Crowdsourcing**, chooses Diesel or Steam, selects a ZIP, and clicks **Submit Sound Pack**.

After a successful upload the page tells the visitor:

> Your sound pack was uploaded successfully. It is not live yet. Every submitted ZIP goes through a series of evaluations before it is approved and added to the public Sound Packs library.

## Your review flow

1. Open the private `PoorMansThrottle-Sound-Submissions` repository.
2. Review files in `sounds/upload/`.
3. Evaluate the ZIP.
4. If approved, copy/commit it into the public PMT repository under:
   - `sounds/diesel/`, or
   - `sounds/steam/`.
5. Remove the reviewed submission from the private repository when you no longer need it.

No Sound Packs manifest needs to be edited.

## Upload protections

The Worker currently enforces:

- requests only from the configured PMT website origin;
- ZIP extension;
- ZIP file signature;
- 20 MB maximum ZIP size;
- Cloudflare Turnstile verification;
- hostname verification for Turnstile;
- five upload attempts per minute per requesting IP/Cloudflare location;
- sanitized filenames;
- unique submission IDs;
- no overwrite of an existing submission;
- GitHub credentials stored only as a Worker secret.

If your sound packs need to exceed 20 MB, adjust both:

- `MAX_UPLOAD_BYTES` in `wrangler.jsonc`;
- `SOUND_UPLOAD_MAX_BYTES` in `Installer/app.js` and its user-facing text.

Do not raise the limit casually. The GitHub upload API requires Base64 encoding, so larger files consume significantly more Worker memory and CPU.

## Local development

```zsh
npm run dev
```

Production CORS is intentionally restricted to `https://jamocle.github.io`.

If you need browser-based local upload testing, temporarily add your local origin to `ALLOWED_ORIGINS` in `wrangler.jsonc`, then remove it before production deployment.

## Health check

After deployment:

```zsh
curl https://pmt-sound-upload.<your-workers-subdomain>.workers.dev/health
```

Expected response:

```json
{
  "ok": true,
  "service": "pmt-sound-upload"
}
```
