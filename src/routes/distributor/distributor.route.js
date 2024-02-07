const express = require('express');
const kycCtrl = require("../../controllers/distributor/distributor.controller");
const { userAuth } = require("../../util/auth");
const { getDetails } = require("../../util/jwt");
const { getNotification } = require('../../util/notify');


const router = express.Router();


router.route('/').get(userAuth, getDetails, getNotification, kycCtrl.distributorView);
router.route('/export').get(userAuth, getDetails, kycCtrl.exportKYCData);
router.route('/update-status').post(userAuth, getDetails, kycCtrl.updateKYCStatus);
router.route('/kyc-notification').get(userAuth, getDetails, kycCtrl.kycNotify);

module.exports = router;