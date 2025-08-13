<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1n69MkPl4xUvrUv_uCnjV7p3o1-l3-r5Q

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Environment Variables & GitHub Secrets

Local development:
1. Copy `.env.example` to `.env` (or `.env.local`).
2. Add your real key: `GEMINI_API_KEY=sk-...`
3. Vite exposes it at build time via the `define` block in `vite.config.ts` as `process.env.GEMINI_API_KEY` (and legacy `process.env.API_KEY`).

GitHub Actions (CI/CD):
1. In the repository settings, add a Repository Secret named `GEMINI_API_KEY`.
2. Reference it in workflows as `${{ secrets.GEMINI_API_KEY }}`.
3. Example job step (see created workflow in `.github/workflows/generate-image.yml`):
```
      env:
         GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

Security notes:
- Never commit `.env` files (they are ignored via `.gitignore`).
- Rotate keys if you suspect leakage.
- Keep the secret name consistent (`GEMINI_API_KEY`).

Runtime behavior:
- The service code (`services/geminiService.ts`) prefers `GEMINI_API_KEY` and falls back to a legacy `API_KEY` if present.
