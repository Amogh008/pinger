require('dotenv').config();
const { createApp } = require('./app');
const { startKeepAlive } = require('./keepAlive');

const PORT = process.env.PORT || 4002;

function main() {
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`pinger-api listening on port ${PORT}`);
  });

  // Keep the wordcontrol-api awake by pinging it every 10 minutes.
  startKeepAlive(process.env.WORDCONTROL_URL);
}

main();
