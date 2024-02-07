const express = require('express');
const notificationController = require("../../controllers/notification/notification.controller");
const { userAuth } = require("../../util/auth");
const { getDetails } = require("../../util/jwt");
const {getNotification} = require("../../util/notify");

const router = express.Router();

router.route('/').get(userAuth, getDetails, getNotification, notificationController.notification);

module.exports = router;