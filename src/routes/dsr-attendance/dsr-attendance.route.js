const express = require('express');
const dsr_attendance = require("../../controllers/dsr_attendance/dsr_attendance.controller");
const { userAuth } = require("../../util/auth");
const { getDetails } = require("../../util/jwt");
const { getNotification } = require('../../util/notify');

const router = express.Router();


router.route('/').get(userAuth, getDetails, getNotification, dsr_attendance.attendanceView);
router.route('/export').get(userAuth, getDetails, dsr_attendance.exportattendanceData);
module.exports = router;