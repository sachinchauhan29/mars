const express = require('express');
const userController = require("../../controllers/users/users.controller");
const { userAuth } = require("../../util/auth");
const { getDetails } = require("../../util/jwt");
const { getNotification } = require('../../util/notify');

const router = express.Router();


router.route('/').get(userAuth, getDetails, getNotification, userController.userView);
router.route('/add-user').get(userAuth, getDetails, getNotification, userController.addUser);
router.route('/add-new-user').post(userAuth, getDetails, getNotification, userController.addNewUser);
router.route('/add-role').get(userAuth, getDetails, getNotification, userController.addRole);

module.exports = router;