import { notify } from './index.js';
setTimeout(async () => { await notify(); process.exit(22) }, 15000);