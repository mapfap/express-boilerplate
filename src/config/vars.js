const path = require('path');
var fs = require('fs');
const logger = require('./logger');


require('dotenv').load({ path: path.join(__dirname, '../../.env') });

const publicKey = fs.readFileSync(path.join(__dirname, './public_key.txt'), 'utf8');

const vars = {
  env: process.env.NODE_ENV,
  ip: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
  port:  process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080,
  trustedPublicKey: publicKey,
  mongo: {
    uri: process.env.NODE_ENV === 'test'
      ? process.env.MONGO_URI_TESTS
      : (process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URI),
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
};

// Log all Environment Variables.

logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);
logger.info(`OPENSHIFT_NODEJS_IP: ${process.env.OPENSHIFT_NODEJS_IP}`);
logger.info(`OPENSHIFT_NODEJS_PORT: ${process.env.OPENSHIFT_NODEJS_PORT}`);
logger.info(`PORT: ${process.env.PORT}`);

// Mask some variables.
const mask = (text) => text ? 'x'.repeat(text.length) : text; 

logger.info(`MONGO_URI_TESTS: ${mask(process.env.MONGO_URI_TESTS)}`);
logger.info(`OPENSHIFT_MONGODB_DB_URL: ${mask(process.env.OPENSHIFT_MONGODB_DB_URL)}`);
logger.info(`MONGO_URI: ${mask(process.env.MONGO_URI)}`);
logger.info(`------------------------------------`);


module.exports = vars;
