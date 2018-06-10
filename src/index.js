Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, ip, env } = require('./config/vars');
const app = require('./config/express');
const mongoose = require('./config/mongoose');
const logger = require('./config/logger')

mongoose.connect();

app.listen(port, ip, () => {
  logger.info(`server started on ${ip}:${port} (${env})`)
});

module.exports = app;
