const crypto = require('crypto');

const genUUID = () => crypto.randomUUID();

module.exports = genUUID;
