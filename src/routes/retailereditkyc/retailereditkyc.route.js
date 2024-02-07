const express = require('express');
const editkycDataCtrl = require("../../controllers/retailereditkyc/retailereditkyc.controller");
const { userAuth } = require("../../util/auth");
const { getDetails } = require("../../util/jwt");
const { getNotification } = require('../../util/notify');

const router = express.Router();


router.route('/').get(userAuth, getDetails, getNotification, editkycDataCtrl.retailereditkyc);
router.route('/export').get(userAuth, getDetails, editkycDataCtrl.exportEditKYCData);
router.route('/update-status').post(userAuth, getDetails, editkycDataCtrl.updateKYCEditDataStatus);
router.route('/edit-kyc-notification').get(userAuth, getDetails, editkycDataCtrl.editKycNotify);

module.exports = router;