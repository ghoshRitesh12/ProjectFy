const crypto = require('crypto');

const genUUID = () => crypto.randomUUID();

module.exports = genUUID;

// require('crypto').randomBytes(20).toString('hex')
