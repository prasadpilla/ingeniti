import { TASK_WORKER_PORT } from './config';
import { pool } from './db/client';
import { taskApp } from './taskApp';

const taskWorker = taskApp.listen(TASK_WORKER_PORT, () => {
  console.log(`Task worker server is running on port ${TASK_WORKER_PORT}`);
});

// Graceful shutdown
// eslint-disable-next-line @typescript-eslint/no-var-requires
const httpTerminator = require('lil-http-terminator')({ server: taskWorker });

async function shutdown(signal: string) {
  console.log(`Received ${signal}. Shutting down.`);
  const { success, code, message, error } = await httpTerminator.terminate();
  console.log(`HTTP server closure result: ${success} ${code} ${message} ${error || ''}`);
  await pool.end();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
