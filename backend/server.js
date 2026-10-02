require('dotenv').config();

const cors = require('cors');
const express = require('express');
const connectDB = require('./config/db');
const faqRoutes = require('./routes/faqRoutes');

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api', faqRoutes);
app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }));
app.use((error, _req, res, _next) => {
  console.error('Request failed:', error.message);
  res.status(500).json({ error: 'An unexpected server error occurred.' });
});

async function startServer() {
  try {
    await connectDB();
  } catch (error) {
    console.warn(`Starting without MongoDB: ${error.message}`);
  }

  app.listen(port, () => console.log(`FAQ API listening on http://localhost:${port}`));
}

startServer();
