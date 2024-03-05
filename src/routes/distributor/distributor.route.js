const express = require('express');
const distributorKyc = require("../../controllers/distributor/distributor.controller");
const { userAuth } = require("../../util/auth");
const { getDetails } = require("../../util/jwt");
const { getNotification } = require('../../util/notify');


const router = express.Router();


router.route('/').get(userAuth, getDetails, getNotification, distributorKyc.distributorView);
router.route('/export').get(userAuth, getDetails, distributorKyc.exportKYCData);
// router.route('/filter').get(userAuth, getDetails, getNotification,distributorKyc.filterApply);

module.exports = router;