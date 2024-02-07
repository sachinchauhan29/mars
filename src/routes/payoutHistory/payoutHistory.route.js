
const express = require('express');
const payoutHistoryController = require("../../controllers/payout/payout-history.controller");
const { userAuth } = require("../../util/auth");
const { getDetails } = require("../../util/jwt");
const { getNotification } = require('../../util/notify');

const router = express.Router();

router.route('/').get(userAuth, getDetails, getNotification, payoutHistoryController.payoutHistoryView);
// router.route('/download-data').get(userAuth, getDetails, getNotification, payoutHistoryController.downloadData);

module.exports = router;