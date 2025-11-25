// Startup script with Node.js v25 compatibility fix
import { Buffer } from 'buffer';

// Set SlowBuffer polyfill before any other imports
globalThis.SlowBuffer = Buffer;
if (typeof global !== 'undefined') {
    global.SlowBuffer = Buffer;
}

// Now import and run the server
import('./server.js');

