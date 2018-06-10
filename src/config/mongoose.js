const mongoose = require('mongoose');
const { mongo, env } = require('./vars');
const logger = require('./logger')

mongoose.Promise = Promise;

mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection error: ${JSON.stringify(err)}`);
  process.exit(-1);
});

if (env === 'development') {
  mongoose.set('debug', true);
}

exports.connect = (next) => {
  logger.info('connectting to MongoDB..');
  mongoose.connect(mongo.uri, { keepAlive: 1 });
  logger.info('MongoDB connected');
  return mongoose.connection;
};
