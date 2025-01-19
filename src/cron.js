import { notify } from './index.js';
await notify();
export async function close() {
    process.exit(22);
}