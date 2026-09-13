# HAVEN AI Assistant integration

The HAVEN static website now contains a purple-themed floating assistant with:
- text chat
- browser speech-to-text button
- Gemini Live voice conversation when the backend is connected

## Important
GitHub Pages can host the website but cannot run the included Node/WebSocket backend.

1. Deploy `ai-backend/` to a Node-capable host.
2. Set `GEMINI_API_KEY` in the host's environment variables.
3. Set `FRONTEND_ORIGIN=https://haven.pntr.dev`.
4. Copy the backend's public HTTPS URL.
5. In the root `index.html`, change:
   `window.HAVEN_AI_BACKEND_URL = "";`
   to the backend URL, e.g. `https://your-backend.example.com`.
6. Upload the root HAVEN files to GitHub Pages.

Never put the Gemini API key in `index.html` or `ai-assistant.js`.
