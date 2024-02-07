const express = require('express');
const editkycDataCtrl = require("../../controllers/editKyc/editKycData.controller");
const { userAuth } = require("../../util/auth");
const { getDetails } = require("../../util/jwt");
const { getNotification } = require('../../util/notify');

const router = express.Router();


router.route('/').get(userAuth, getDetails, getNotification, editkycDataCtrl.editKycDataView);
router.route('/export').get(userAuth, getDetails, editkycDataCtrl.exportEditKYCData);
router.route('/update-status').post(userAuth, getDetails, editkycDataCtrl.updateKYCEditDataStatus);
router.route('/edit-kyc-notification').get(userAuth, getDetails, editkycDataCtrl.editKycNotify);

module.exports = router;