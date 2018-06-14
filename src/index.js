Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, ip, env } = require('./config/vars');
const app = require('./config/express');
const db = require('../db/models/index');
const logger = require('./config/logger')


db.sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
  app.listen(port, ip, () => {
    logger.info(`server started on ${ip}:${port} (${env})`)
  });
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});



module.exports = app;
