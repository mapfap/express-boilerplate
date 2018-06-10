const path = require('path');
var fs = require('fs');

// import .env variables
require('dotenv-safe').load({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
});

const publicKey = fs.readFileSync(path.join(__dirname, './public_key.txt'), 'utf8');

module.exports = {
  env: process.env.OPENSHIFT_NODEJS_PORT || process.env.NODE_ENV || 8080,
  port:  process.env.OPENSHIFT_NODEJS_IP || process.env.PORT || '127.0.0.1',
  trustedPublicKey: publicKey,
  mongo: {
    uri: process.env.NODE_ENV === 'test'
      ? process.env.MONGO_URI_TESTS
      : (process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URI),
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
};
