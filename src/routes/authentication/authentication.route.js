const express = require('express');
const authenticationCtrl = require("../../controllers/authentication/authentication.controller");
const { userAuth } = require("../../util/auth");
const { getDetails } = require("../../util/jwt");
const { getNotification } = require('../../util/notify');

const router = express.Router();


router.route('/').get(userAuth, getDetails, getNotification, authenticationCtrl.authenticationView);
router.route('/export').get(userAuth, getDetails, authenticationCtrl.exporAuthenticationData);

module.exports = router;