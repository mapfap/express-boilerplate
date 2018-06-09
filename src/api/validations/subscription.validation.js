const Joi = require('joi');
const Subscription = require('../models/subscription.model');

const schema = {
  id: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
  name: Joi.string(),
  items: Joi.array().items(
    Joi.object(
      {
        productId: Joi.string().required(),
        quantity: Joi.number().required(),
        unitId: Joi.string().required(),
      }
    )
  ).min(1)
}

module.exports = {

  listAll: {
    // No validation
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