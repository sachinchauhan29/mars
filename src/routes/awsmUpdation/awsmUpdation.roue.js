const express = require('express');
const awsmUpdationCtrl = require("../../controllers/awsmUpdation/awsm-updation.controller");
const { userAuth } = require("../../util/auth");
const { getDetails } = require("../../util/jwt");
const { getNotification } = require('../../util/notify');

const router = express.Router();


router.route('/').get(userAuth, getDetails, getNotification, awsmUpdationCtrl.awsmUpdationView);
router.route('/awsm-updation-restore').post(userAuth, getDetails, awsmUpdationCtrl.awsmUpdationRestore);
router.route('/latest/export').get(userAuth, getDetails, getNotification, awsmUpdationCtrl.awsmLatestUpdation);
router.route('/old/export').get(userAuth, getDetails, getNotification, awsmUpdationCtrl.awsmOldUpdation);

module.exports = router;