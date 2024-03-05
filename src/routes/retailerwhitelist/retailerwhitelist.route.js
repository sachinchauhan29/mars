const express = require('express');
const RetailerWhitelistingContrl = require("../../controllers/retailerwhitelist/retailerwhitelist.controller");
const { userAuth } = require("../../util/auth");
const { getDetails } = require("../../util/jwt");
const { getNotification } = require('../../util/notify');

const router = express.Router();


router.route('/').get(userAuth, getDetails, getNotification, RetailerWhitelistingContrl.dataWhitelistingView);
router.route('/save-whitelist-data').post(userAuth, getDetails, RetailerWhitelistingContrl.saveWhitelisnting);
router.route('/uploaddata').post(userAuth, getDetails, RetailerWhitelistingContrl.uploadData);
router.route('/download-sample').get(userAuth, getDetails, RetailerWhitelistingContrl.downloadSample);
router.route('/updateStatus').post(userAuth, getDetails, RetailerWhitelistingContrl.UpdateStatus);
router.route('/export').get(userAuth, getDetails, RetailerWhitelistingContrl.exportWhitelist);

module.exports = router;