const httpStatus = require('http-status');
const { omit } = require('lodash');
const Entity = require('../models/subscription.model');

exports.load = async (req, res, next, id) => {
  try {
    const entity = await Entity.get(id);
    req.locals = { entity };
    return next();
  } catch (error) {
    next(error);
  }
};

exports.getById = (req, res) => res.json(req.locals.entity);

exports.create = async (req, res, next) => {
  try {
    const entity = new Entity(omit(req.body, ['_id', 'createdAt', 'updatedAt']));
    const savedEntity = await entity.save();
    res.status(httpStatus.CREATED);
    res.json(savedEntity);
  } catch (error) {
    next(error);  
  }
};

exports.patchById = async (req, res, next) => {
  try {
    const updatedEntity = omit(req.body, ['_id', 'createdAt', 'updatedAt']);
    const entity = Object.assign(req.locals.entity, updatedEntity);

    const savedEntity = await entity.save();
    res.json(savedEntity);
  } catch (error) {
    next(error);
  }
};

exports.listAll = async (req, res, next) => {
  try {
    const entities = await Entity.list(req.query);
    res.json(entities);
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
