import { notify } from './index.js';
await notify();
setTimeout(() => { process.exit(22) }, 5000);