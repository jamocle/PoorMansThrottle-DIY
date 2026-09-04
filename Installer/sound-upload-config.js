// Public configuration for the Sound Packs crowdsourcing upload form.
// No secrets belong in this file.
//
// After deploying sound-upload-api/, set:
//   apiUrl            -> your Cloudflare Worker URL, without a trailing slash
//   turnstileSiteKey  -> the public Cloudflare Turnstile site key
//
// Example:
// window.PMT_SOUND_UPLOAD_CONFIG = {
//     apiUrl: "https://pmt-sound-upload.YOUR-SUBDOMAIN.workers.dev",
//     turnstileSiteKey: "0x4AAAAAAA..."
// };

window.PMT_SOUND_UPLOAD_CONFIG = {
    apiUrl: "",
    turnstileSiteKey: ""
};
