const express = require('express');
const kycStatusCtrl = require("../../controllers/kycStatus/kyc-status.controller");
const { userAuth } = require("../../util/auth");
const { getDetails } = require("../../util/jwt");
const { getNotification } = require('../../util/notify');

const router = express.Router();


router.route('/').get(userAuth, getDetails, getNotification, kycStatusCtrl.kycStatusView);
router.route('/export').get(userAuth, getDetails, kycStatusCtrl.exportKYCStatusData);

module.exports = router;