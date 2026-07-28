const { executeKeepAliveQuery, hasAstra } = require('./astra');

const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

function startAstraKeepAlive(intervalMs = TWELVE_HOURS_MS) {
  if (!hasAstra()) {
    console.log('[astra-keep-alive] AstraDB is not configured; skipping scheduled queries');
    return null;
  }

  const run = async () => {
    try {
      await executeKeepAliveQuery();
      console.log('[astra-keep-alive] keep-alive query completed');
    } catch (err) {
      console.warn('[astra-keep-alive] query failed:', err.message);
    }
  };

  const timer = setInterval(run, intervalMs);
  run();
  return timer;
}

module.exports = { startAstraKeepAlive, TWELVE_HOURS_MS };
