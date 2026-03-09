# Venice Model Print

A live dashboard that displays all available Venice AI models with pricing, capabilities, and filtering.

## Stack

- **Frontend:** Single-page `index.html` (vanilla JS, no build step)
- **Backend:** Vercel serverless function at `api/models.js`
- **Deployment:** Vercel (no `vercel.json` or `package.json` — uses convention-based routing)

## How It Works

1. `api/models.js` fetches models from `https://api.venice.ai/api/v1/models` across all types (text, image, video, tts, asr, embedding, upscale, inpaint) in parallel
2. Results are merged and returned as a single JSON response with 5-minute edge caching
3. The frontend renders models in a filterable/searchable table with type tabs, capability badges, and pricing

## Environment

- `VENICE_API_KEY` — required, set in Vercel project settings
- Debug mode: append `?debug=1` to `/api/models` to see diagnostics (key prefix, errors, counts)

## API Type Mapping

The Venice API uses granular types that the UI groups:
- `image` + `upscale` + `inpaint` → **IMAGE** tab
- `tts` + `asr` → **AUDIO** tab
- `text`, `video`, `embedding` → their own tabs

## Development

No local dev server config exists. To run locally, use `vercel dev` (requires Vercel CLI and the env var set).
