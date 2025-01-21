import { notify } from './index.js';
const complete = await notify();
Promise.all(complete).then(() => {process.exit(22);});