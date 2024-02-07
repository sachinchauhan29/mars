const express = require('express');
const kycHistoryCtrl = require("../../controllers/kycHistory/kycHistory.controller");
const { userAuth } = require("../../util/auth");
const { getDetails } = require("../../util/jwt");
const { getNotification } = require('../../util/notify');

const router = express.Router();


router.route('/').get(userAuth, getDetails, getNotification, kycHistoryCtrl.kycHistoryView);
router.route('/export').get(userAuth, getDetails, kycHistoryCtrl.exportKYCHistoryData);

module.exports = router;