import { notify } from './index.js';
await notify();
setTimeout(async () => { process.exit(22) }, 5000);