const Joi = require('joi');
const Order = require('../models/order.model');

module.exports = {

  // GET /v1/users
  listOrders: {
    query: {
      name: Joi.string(),
      status: Joi.string().valid(Order.statuses),
    },
  },

  // POST /v1/users
  createOrder: {
    body: {
      name: Joi.string(),
      status: Joi.string().valid(Order.statuses),
    },
  },

  // PUT /v1/users/:orderId
  replaceOrder: {
    body: {
      name: Joi.string(),
      status: Joi.string().valid(Order.statuses),
    },
    params: {
      orderId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/users/:orderId
  updateOrder: {
    body: {
      name: Joi.string(),
      status: Joi.string().valid(Order.statuses),
    },
    params: {
      orderId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
