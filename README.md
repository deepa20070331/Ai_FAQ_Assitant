# AI FAQ Assistant

A React + Vite client and Express API for searchable FAQs and AI-generated answers.

## Requirements

- Node.js 20 or newer
- MongoDB (optional for browsing the bundled sample FAQs; required to store your own FAQs)
- An OpenAI API key (required for generated answers)

## Run locally

1. Set `MONGO_URI`, `OPENAI_API_KEY`, and optionally `OPENAI_MODEL` in `backend/.env`.
2. Install and start the API:

   ```sh
   cd backend
   npm install
   npm run dev
   ```

3. In another terminal, install and start the client:

   ```sh
   cd frontend
   npm install
   npm run dev
   ```

4. Open the URL printed by Vite (normally http://localhost:5173).

The API listens on port 5000 by default. The client uses the sample FAQ set if the API or database is unavailable. AI answers require a valid OpenAI key and a reachable API server.
