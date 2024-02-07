const express = require('express');
const retailermasterdata = require("../../controllers/retailermasterdata/retailermasterdata.controller");
const { userAuth } = require("../../util/auth");
const { getDetails } = require("../../util/jwt");
const { getNotification } = require('../../util/notify');

const router = express.Router();

router.route('/').get(userAuth, getDetails, getNotification, retailermasterdata.retailermasterdataView);
router.route('/export').get(userAuth, getDetails, retailermasterdata.exportKYCMasterData);

module.exports = router;