<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1kL5swqo5cdLKvJ8uPGkglnM0BR8ktQhj

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Cloudflare Pages

This project is ready for Cloudflare Pages static hosting.

### 1) Connect repository
- In Cloudflare Dashboard, go to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
- Select this repository and branch (`main`).

### 2) Build settings
- **Framework preset:** `Vite`
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Node version:** `20` (recommended)

### 3) Environment variables (Pages project settings)
Set these in **Settings → Environment variables**:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY` (optional)

### 4) SPA routing support
This repo includes `public/_redirects` with:

`/* /index.html 200`

This ensures direct routes like `/admin` work correctly on refresh.

### 5) Admin URL
After deploy, open:

`https://<your-pages-domain>/admin`

or

`https://<your-pages-domain>/?admin=1`
