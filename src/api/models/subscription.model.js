const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

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
}, { _id: false });

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
  }
);

subscriptionSchema.statics = {
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

  list({ skip = 0, limit = 1000 }) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }
}

module.exports = mongoose.model('Subscription', subscriptionSchema);
