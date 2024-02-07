const express = require('express');
const dataWhitelistingContrl = require("../../controllers/dataWhitelisting/dataWhitelisting.controller");
const { userAuth } = require("../../util/auth");
const { getDetails } = require("../../util/jwt");
const { getNotification } = require('../../util/notify');

const router = express.Router();


router.route('/').get(userAuth, getDetails, getNotification, dataWhitelistingContrl.dataWhitelistingView);
router.route('/save-whitelist-data').post(userAuth, getDetails, dataWhitelistingContrl.saveWhitelisnting);
router.route('/upload-data').post(userAuth, getDetails, dataWhitelistingContrl.uploadData);
router.route('/download-sample').get(userAuth, getDetails, dataWhitelistingContrl.downloadSample);
router.route('/updateStatus').post(userAuth, getDetails, dataWhitelistingContrl.UpdateStatus);
router.route('/export').get(userAuth, getDetails, dataWhitelistingContrl.exportWhitelist);

module.exports = router;