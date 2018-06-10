Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env } = require('./config/vars');
const app = require('./config/express');
const mongoose = require('./config/mongoose');
const logger = require('./config/logger')

mongoose.connect();

app.listen(port, () => logger.info(`server started on port ${port} (${env})`));

module.exports = app;
