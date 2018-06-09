const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/subscription.controller');
const { authorize } = require('../../middlewares/auth');
const { listAll, create, getById, patchById, deleteById } = require('../../validations/subscription.validation');

const router = express.Router();

router.param('id', controller.load);

// /v1/subscriptions/

router
  .route('/')
  .get(authorize(), validate(listAll), controller.listAll)
  .post(authorize(), validate(create), controller.create);

router
  .route('/:id')
  .get(authorize(), validate(getById), controller.getById)
  .patch(authorize(), validate(patchById), controller.patchById)
  .delete(authorize(), validate(deleteById), controller.deleteById);

module.exports = router;