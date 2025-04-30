import { parentPort } from 'worker_threads';

const BATCH_SIZE = 500;
let buffer = [];

parentPort.on('message', async (message) => {
  try {
    if (message.type === 'row') {
      const { row, latitude, longitude } = message;
      const name = row.name.trim();
      const categoryId = row.categoryId.trim();
      buffer.push({ name, latitude, longitude, categoryId });

      if (buffer.length >= BATCH_SIZE) {
        await processBuffer();
      }
    } else if (message.type === 'complete') {
      if (buffer.length > 0) await processBuffer();
      parentPort.postMessage({ type: 'done' });
    }
  } catch (error) {
    console.error("Worker error:", error);
    parentPort.postMessage({ type: 'error', error: error.message });
    process.exit(1);
  }
});

async function processBuffer() {
  parentPort.postMessage({ type: 'batch', data: buffer });
  buffer = [];
}
