const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const uuidv4 = require('uuid/v4');
const APIError = require('../utils/APIError');
const { env } = require('../../config/vars');

/**
* Subscription Statuses
*/
const statuses = ['activated', 'deactivated', 'cancelled'];

const itemSchema = new mongoose.Schema({
  productId: {
    type: String,
    maxlength: 128,
    index: true,
    trim: false
  },
  quantity: {
    type: Number,
    trim: false
  },
  unitId: {
    type: String,
    maxlength: 128,
    trim: false
  }
}, {
  _id: false
});

/**
 * Subscription Schema
 * @private
 */
const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 128,
    index: true,
    trim: false,
  },
  items: {
    type: [itemSchema]
  }
}, {
  timestamps: true,
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
subscriptionSchema.pre('save', async function save(next) {
  try {
    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
subscriptionSchema.method({
  transform() {
    const transformed = {};
    const fields = ['_id', 'name', 'items', 'createdAt', 'updatedAt' ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

});

/**
 * Statics
 */
subscriptionSchema.statics = {

  statuses,

  /**
   * Get subscription
   *
   * @param {ObjectId} id - The id of subscrption.
   * @returns {Promise<Subscription, APIError>}
   */
  async get(id) {
    try {
      let subscription;

      if (mongoose.Types.ObjectId.isValid(id)) {
        subscription = await this.findById(id).exec();
      }
      if (subscription) {
        return subscription;
      }

      throw new APIError({
        message: 'Subscription does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * List subscriptions in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of objects to be skipped.
   * @param {number} limit - Limit number of objects to be returned.
   * @returns {Promise<Subscription[]>}
   */
  list({
    page = 1, perPage = 1000, name, email, role,
  }) {
    const options = omitBy({ name }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  }

}

/**
 * @typedef Subscription
 */
module.exports = mongoose.model('Subscription', subscriptionSchema);
