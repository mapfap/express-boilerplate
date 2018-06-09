const express = require('express');
const subscriptionRoutes = require('./subscription.route');
const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

router.use('/subscriptions', subscriptionRoutes);

module.exports = router;
