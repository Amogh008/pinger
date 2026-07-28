const express = require('express');
const cors = require('cors');
const { executeKeepAliveQuery, hasAstra } = require('./astra');

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/pingtest', (_req, res) => {
    console.log('ping request received');
    res.json({ message: 'server active' });
  });

  app.get('/astra-keepalive', async (_req, res) => {
    if (!hasAstra()) return res.status(503).end();

    try {
      await executeKeepAliveQuery();
      return res.status(204).end();
    } catch (err) {
      console.warn('[astra-keep-alive] route query failed:', err.message);
      return res.status(503).end();
    }
  });

  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = { createApp };
