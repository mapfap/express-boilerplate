const Joi = require('joi');
const Subscription = require('../models/subscription.model');

const schema = {
  id: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
  name: Joi.string(),
  items: Joi.array().items(
    Joi.object(
      {
        productId: Joi.string().required(),
        quantity: Joi.number().min(0).invalid(0).required(),
        unitId: Joi.string().required(),
      }
    )
  ).min(1),
  query_skip: Joi.number().integer().min(0).default(0),
  query_limit: Joi.number().integer().min(1).max(1000),
}

module.exports = {

  listAll: {
    query: {
      skip: schema.query_skip,
      limit: schema.query_limit      
    }
  },

  create: {
    body: {
      name: schema.name.required(),
      items: schema.items.required()
    }
  },

  getById: {
    params: {
      id: schema.id.required(),
    }
  },

  patchById: {
    params: {
      id: schema.id.required(),
    },
    body: {
      name: schema.name,
      items: schema.items
    }
  },

  deleteById: {
    params: {
      id: schema.id.required(),
    }
  },

};