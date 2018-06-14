const httpStatus = require('http-status');
const { omit } = require('lodash');
const db = require('../../../db/models/index');

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
    const x = await db.Subscription.create(
      omit(req.body, ['id']), {
        include: [{ model: db.Product, as: 'products' }]
      }    
    );
    res.status(httpStatus.CREATED).end();
  } catch (error) {
    next(error);  
  }
};

// exports.patchById = async (req, res, next) => {
//   try {
//     const updatedEntity = omit(req.body, ['_id', 'createdAt', 'updatedAt']);
//     const entity = Object.assign(req.locals.entity, updatedEntity);

//     const savedEntity = await entity.save();
//     res.json(savedEntity);
//   } catch (error) {
//     next(error);
//   }
// };

exports.listAll = async (req, res, next) => {
  try {
    const entities = await db.Subscription.findAll({
      include: [{model: db.Product, as: 'products', attributes: {exclude: ['id', 'subscriptionId']}}],
      
    });
    res.json(entities);
  } catch (error) {
    next(error);
  }
};

// exports.deleteById = async (req, res, next) => {
//   try {
//     const { entity } = req.locals;
//     await entity.remove()
//     res.status(httpStatus.NO_CONTENT).end();
//   } catch (error) {
//     next(error);
//   }
// };
