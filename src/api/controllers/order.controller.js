const httpStatus = require('http-status');
const { omit } = require('lodash');
const Order = require('../models/order.model');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const order = await Order.get(id);
    req.locals = { order };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.order.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();
    res.status(httpStatus.CREATED);
    res.json(savedOrder.transform());
  } catch (error) {
    next(Order.checkDuplicateEmail(error));
  }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { order } = req.locals;
    const newOrder = new Order(req.body);
    const ommitStatus = order.status !== 'admin' ? 'role' : '';
    const newOrderObject = omit(newOrder.toObject(), '_id', ommitStatus);

    await order.update(newOrderObject, { override: true, upsert: true });
    const savedOrder = await Order.findById(order._id);

    res.json(savedOrder.transform());
  } catch (error) {
    next(Order.checkDuplicateEmail(error));
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const ommitStatus = req.locals.order.status !== 'admin' ? 'role' : '';
  const updatedOrder = omit(req.body, orderStatus);
  const order = Object.assign(req.locals.order, updatedOrder);

  order.save()
    .then(savedOrder => res.json(savedOrder.transform()))
    .catch(e => next(Order.checkDuplicateEmail(e)));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const orders = await Order.list(req.query);
    const transformedOrders = orders.map(order => order.transform());
    res.json(transformedOrders);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { order } = req.locals;

  order.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};
