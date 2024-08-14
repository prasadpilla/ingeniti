import { app } from './app';
import { APP_PORT } from './config';
import { pool } from './db/client';

const server = app.listen(APP_PORT, () => {
  console.log(`API server is running on port ${APP_PORT}`);
});

// Graceful shutdown
// eslint-disable-next-line @typescript-eslint/no-var-requires
const httpTerminator = require('lil-http-terminator')({ server });

async function shutdown(signal: string) {
  console.log(`Received ${signal}. Shutting down.`);
  const { success, code, message, error } = await httpTerminator.terminate();
  console.log(`HTTP server closure result: ${success} ${code} ${message} ${error || ''}`);
  await pool.end();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
