const { Magic } = require('@magic-sdk/admin');

// initiating Magic instance for server-side methods
exports.magic = new Magic(process.env.MAGIC_SECRET_KEY);
