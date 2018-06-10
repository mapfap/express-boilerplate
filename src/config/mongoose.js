const mongoose = require('mongoose');
const { mongo, env } = require('./vars');
const logger = require('./logger')

mongoose.Promise = Promise;

mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

if (env === 'development') {
  mongoose.set('debug', true);
}

exports.connect = () => {
  mongoose.connect(mongo.uri, {
    keepAlive: 1
  });
  return mongoose.connection;
};
