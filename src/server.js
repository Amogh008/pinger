require('dotenv').config({ path: process.env.ENV_FILE || '.env' });
const { createApp } = require('./app');
const { startKeepAlive } = require('./keepAlive');
const { connectAstra } = require('./astra');
const { startAstraKeepAlive } = require('./astraKeepAlive');

const PORT = process.env.PORT || 4002;

async function main() {
  try {
    await connectAstra();
    console.log('Connected to AstraDB.');
  } catch (err) {
    console.warn('AstraDB not connected; keep-alive query is disabled:', err.message);
  }

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`pinger-api listening on port ${PORT}`);
  });

  // Keep the wordcontrol-api awake by pinging it every 30 seconds.
  startKeepAlive(process.env.WORDCONTROL_URL);

  // Prevent AstraDB from hibernating by executing a minimal read every 12 hours.
  startAstraKeepAlive();
}

main().catch((err) => {
  console.error('Failed to start pinger-api:', err.message);
  process.exit(1);
});
