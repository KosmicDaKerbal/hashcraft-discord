import { notify } from './index.js';
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  } 
await notify();
await delay(1000);
process.exit(22);
