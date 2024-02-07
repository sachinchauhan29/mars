const express = require('express');
const retailerkycstatusController = require("../../controllers/retailerkycstatus/retailerkycstatus.controller");
const { userAuth } = require("../../util/auth");
const { getDetails } = require("../../util/jwt");
const { getNotification } = require('../../util/notify');

const router = express.Router();
router.route('/').get(userAuth, getDetails, getNotification, retailerkycstatusController.retailerkycstatusView);


module.exports = router;