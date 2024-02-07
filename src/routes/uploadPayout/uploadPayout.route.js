const express = require('express');
const uploadPayoutController = require("../../controllers/payout/upload-payout.controller");
const { userAuth } = require("../../util/auth");
const { getDetails } = require("../../util/jwt");
const { getNotification } = require('../../util/notify');

const router = express.Router();

router.route('/').get(userAuth, getDetails, getNotification, uploadPayoutController.uploadPayoutView);
router.route('/upload-file').post(userAuth, getDetails, uploadPayoutController.uploadPayoutFile);

module.exports = router;