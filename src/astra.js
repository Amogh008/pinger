const fs = require('fs');
const os = require('os');
const path = require('path');
const cassandra = require('cassandra-driver');

let client = null;

function resolveBundlePath() {
  const explicitPath = process.env.ASTRA_DB_SECURE_BUNDLE_PATH;
  if (explicitPath && fs.existsSync(explicitPath)) return explicitPath;

  const b64 = process.env.ASTRA_DB_SECURE_BUNDLE_B64;
  if (b64) {
    const tmpPath = path.join(os.tmpdir(), 'pinger-astra-secure-connect-bundle.zip');
    fs.writeFileSync(tmpPath, Buffer.from(b64, 'base64'));
    return tmpPath;
  }

  return null;
}

async function connectAstra() {
  const bundlePath = resolveBundlePath();
  const token = process.env.ASTRA_DB_APPLICATION_TOKEN;
  const keyspace = process.env.ASTRA_DB_KEYSPACE;

  if (!bundlePath) {
    throw new Error(
      'AstraDB secure connect bundle not found. Set ASTRA_DB_SECURE_BUNDLE_PATH or ASTRA_DB_SECURE_BUNDLE_B64.',
    );
  }
  if (!token) throw new Error('ASTRA_DB_APPLICATION_TOKEN is not set.');
  if (!keyspace) throw new Error('ASTRA_DB_KEYSPACE is not set.');

  const newClient = new cassandra.Client({
    cloud: { secureConnectBundle: bundlePath },
    credentials: { username: 'token', password: token },
    keyspace,
  });

  await newClient.connect();
  client = newClient;
}

function hasAstra() {
  return client !== null;
}

async function executeKeepAliveQuery() {
  if (!client) throw new Error('AstraDB is not connected.');

  // Intentionally discard the result. This read exists only to keep AstraDB
  // active and never exposes note data through the pinger API.
  await client.execute(
    'SELECT id FROM notes WHERE user_id = ? LIMIT 1',
    ['123'],
    { prepare: true },
  );
}

module.exports = { connectAstra, executeKeepAliveQuery, hasAstra };
