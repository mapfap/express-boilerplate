const path = require('path');
var fs = require('fs');
const logger = require('./logger');


require('dotenv').load({ path: path.join(__dirname, '../../.env') });

const publicKey = fs.readFileSync(path.join(__dirname, './public_key.txt'), 'utf8');

const vars = {
  env: process.env.NODE_ENV,
  ip: process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
  port:  process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080,
  trustedPublicKey: publicKey,
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
};

// Log all Environment Variables.

logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);
logger.info(`OPENSHIFT_NODEJS_IP: ${process.env.OPENSHIFT_NODEJS_IP}`);
logger.info(`OPENSHIFT_NODEJS_PORT: ${process.env.OPENSHIFT_NODEJS_PORT}`);
logger.info(`PORT: ${process.env.PORT}`);

logger.info(`------------------------------------`);

module.exports = vars;
