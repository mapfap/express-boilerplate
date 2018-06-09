const httpStatus = require('http-status');
const { omit } = require('lodash');
const Entity = require('../models/subscription.model');
const { handler: errorHandler } = require('../middlewares/error');

exports.load = async (req, res, next, id) => {
  try {
    const entity = await Entity.get(id);
    req.locals = { entity };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

exports.getById = (req, res) => res.json(req.locals.entity.transform());

exports.create = async (req, res, next) => {
  try {
    const entity = new Entity(omit(req.body, ['_id', 'createdAt', 'updatedAt']));
    const savedEntity = await entity.save();
    res.status(httpStatus.CREATED);
    res.json(savedEntity.transform());
  } catch (error) {
    next(error);
  }
};

exports.patchById = async (req, res, next) => {
  try {
    const updatedEntity = omit(req.body, ['_id', 'createdAt', 'updatedAt']);
    const entity = Object.assign(req.locals.entity, updatedEntity);

    const savedEntity = await entity.save();
    res.json(savedEntity.transform());
  } catch (error) {
    next(error);
  }
};

exports.listAll = async (req, res, next) => {
  try {
    const entities = await Entity.list(req.query);
    const transformedEntities = entities.map(entity => entity.transform());
    res.json(transformedEntities);
  } catch (error) {
    next(error);
  }
};

exports.deleteById = async (req, res, next) => {
  try {
    const { entity } = req.locals;
    await entity.remove()
    res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
};
