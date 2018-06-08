const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../utils/APIError');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');

/**
* User Roles
*/
const statuses = ['created', 'delivered'];

/**
 * User Schema
 * @private
 */
const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
}, {
  timestamps: true,
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
orderSchema.pre('save', async function save(next) {
  try {
    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
orderSchema.method({
  transform() {
    const transformed = {};
    const fields = ['name'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

});

/**
 * Statics
 */
orderSchema.statics = {

  statuses,

  /**
   * Get user
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async get(id) {
    try {
      let user;

      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await this.findById(id).exec();
      }
      if (user) {
        return user;
      }

      throw new APIError({
        message: 'User does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({
    page = 1, perPage = 30, name, email, role,
  }) {
    const options = omitBy({ name }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  /**
   * Return new validation error
   * if error is a mongoose duplicate key error
   *
   * @param {Error} error
   * @returns {Error|APIError}
   */
  checkDuplicateEmail(error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'email',
          location: 'body',
          messages: ['"email" already exists'],
        }],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  }

}

/**
 * @typedef User
 */
module.exports = mongoose.model('Order', orderSchema);
