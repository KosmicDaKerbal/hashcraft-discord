import { notify } from './index';
await notify();
export async function close() {
    process.exit(22);
}