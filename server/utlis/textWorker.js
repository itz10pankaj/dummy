import { parentPort } from 'worker_threads';

parentPort.on('message', (message) => {
  if (message.type === 'line') {
    const { data: line, index } = message;
    const modified = line.charAt(0).toUpperCase() + line.slice(1);
    parentPort.postMessage({ type: "line", data: modified, index });
  } else if (message.type === 'complete') {
    parentPort.postMessage({ type: 'done' });
  }
});


