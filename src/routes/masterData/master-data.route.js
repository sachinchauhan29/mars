const express = require('express');
const masterDataController = require("../../controllers/masterData/master-data.controller");
const { userAuth } = require("../../util/auth");
const { getDetails } = require("../../util/jwt");
const { getNotification } = require('../../util/notify');

const router = express.Router();

router.route('/').get(userAuth, getDetails, getNotification, masterDataController.masterDataView);
router.route('/export').get(userAuth, getDetails, masterDataController.exportKYCMasterData);

module.exports = router;