# AGENTS.md

## Cursor Cloud specific instructions

### What this is
This repository is a **single-file, client-side web app** (Arabic / RTL business document generator for "شركة الدعم"). The entire product lives in `index.html` (~25k lines of HTML + inline CSS + inline JS). There is **no backend, no build system, and no package manager**. `README.md` is just a duplicate copy of `index.html`, not real docs.

### Running it (dev)
There is nothing to compile or install. Serve the repo root with any static HTTP server and open `index.html`:

```bash
python3 -m http.server 8000   # then open http://localhost:8000/index.html
```

Internet access to CDNs (cdnjs `html2pdf.js`, jsDelivr `@supabase/supabase-js`, Google Fonts) is needed for PDF export, the Supabase quotes module, and fonts; the core contract/quote form, preview, and print still work offline.

### Login gate (non-obvious)
The app is gated by a **client-side SHA-256 password** (`_PWD_HASH` in `index.html`, var `daam_auth_session`). There is no server auth. A correct login just sets `sessionStorage.setItem('daam_auth_session','1')`. If you don't have the password, you can authenticate for local testing by running that same `sessionStorage` set in the browser console and reloading — this is exactly what `doLogin()` does on success.

### Optional cloud features
Cloud sync is optional and degrades gracefully to `localStorage`: jsonbin.io (saved contracts/repo) and Supabase Storage (quotes repository) require user-supplied keys entered in the UI. Not needed for contract/quote generation, preview, print, or PDF export.

### Lint / test / build
There are no lint, test, or build scripts in this repo (no tooling config of any kind). "Build" = serve the static file.
