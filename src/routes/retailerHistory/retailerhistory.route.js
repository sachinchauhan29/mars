const express = require('express');
const retailerHistory = require("../../controllers/retailerHistory/retailerhistory.controller");
const { userAuth } = require("../../util/auth");
const { getDetails } = require("../../util/jwt");
const { getNotification } = require('../../util/notify');

const router = express.Router();


router.route('/').get(userAuth, getDetails, getNotification, retailerHistory.retailerHistoryView);
router.route('/export').get(userAuth, getDetails, retailerHistory.exportKYCHistoryData);

module.exports = router;