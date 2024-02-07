const express = require('express');
const payoutController = require('../../controllers/payout/payout.controller');
const { userAuth } = require("../../util/auth");
const { getDetails } = require("../../util/jwt");
const { getNotification } = require('../../util/notify');

const router = express.Router();

router.route('/').get(userAuth, getDetails, getNotification, payoutController.payoutView);
router.route('/export').get(userAuth, getDetails, getNotification, payoutController.exportPayout);

module.exports = router;