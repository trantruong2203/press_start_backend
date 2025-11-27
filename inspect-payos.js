const { PayOS } = require('@payos/node');
console.log('Prototype methods:', JSON.stringify(Object.getOwnPropertyNames(PayOS.prototype)));
console.log('Static methods:', JSON.stringify(Object.getOwnPropertyNames(PayOS)));
