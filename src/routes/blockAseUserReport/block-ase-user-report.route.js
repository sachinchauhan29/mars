const express = require('express');
const blockASEUserReportContrl = require("../../controllers/blockAseUserReport/block-ase-user-report.controller");
const { userAuth } = require("../../util/auth");
const { getDetails } = require("../../util/jwt");

const router = express.Router();


router.route('/').get(userAuth, getDetails, blockASEUserReportContrl.blockASEUserReportView);

module.exports = router;