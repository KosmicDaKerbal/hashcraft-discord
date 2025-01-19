import { notify } from './index.js';
Promise.all(await notify()).then(process.exit(22));

