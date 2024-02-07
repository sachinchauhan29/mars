const express = require('express');
const dashboardRoute = require('./dashboard/dashboard.route');
const accountRoutes = require("./account/account.route");
const kycRoutes = require("./kyc/kyc.route");
const uploadPayoutRoutes = require('./uploadPayout/uploadPayout.route');
const dataWhitelistingRoutes = require("./dataWhitelisting/dataWhitelisting.route");
const blockASEUserReportRoutes = require('./blockAseUserReport/block-ase-user-report.route');

const editKycDataRoutes = require("./editKyc/editKycData.route");
const kycHistoryRoutes = require('./kycHistory/kycHistory.route');
const authenticationRoutes = require("./authentication/authentication.route");
const payoutRoutes = require("./payout/payout.route");
const masterDataRoutes = require("./masterData/master-data.route");
const kysStatusRoutes = require("./kycStatus/kycStatus.route");
const awsmUpdatioinRoutes = require("./awsmUpdation/awsmUpdation.roue");
const usersRoutes = require("../routes/users/users.routes");
const payoutHistoryRoutes = require("../routes/payoutHistory/payoutHistory.route");
const notificationRoutes = require("../routes/notification/notification.route");



const retailerRouter = require('../routes/retailer/retailer.router');
const retailereditkycRouter = require('../routes/retailereditkyc/retailereditkyc.route');
const retailerHistoryRoutes = require('../routes/retailerHistory/retailerhistory.route');
const distributorRoutes = require('../routes/distributor/distributor.route');
const retailermasterdataRouter = require('../routes/retailermasterdata/retailermasterdata.route');
const retailerkycstatusRoute = require("./retailerkycstatus/retailerkycstatus.route");



const router = express.Router();

const routes = [
    {
        path: '/',
        route: dashboardRoute
    },
    {
        path: '/account',
        route: accountRoutes
    },
    {
        path: '/kyc',
        route: kycRoutes
    },
    {
        path: '/upload-payout',
        route: uploadPayoutRoutes
    },
    {
        path: '/data-whitelisting',
        route: dataWhitelistingRoutes
    },
    {
        path: '/block-ase-user-report',
        route: blockASEUserReportRoutes
    },
    {
        path: '/edit-kyc-data',
        route: editKycDataRoutes
    },
    {
        path: '/kyc-history',
        route: kycHistoryRoutes
    },
    {
        path: '/authentication',
        route: authenticationRoutes
    },
    {
        path: '/payout',
        route: payoutRoutes
    },
    {
        path: '/master-data',
        route: masterDataRoutes
    },
    {
        path: '/kyc-status',
        route: kysStatusRoutes
    },
    {
        path: '/awsm-updation',
        route: awsmUpdatioinRoutes
    },
    {
        path: '/users',
        route: usersRoutes
    },
    {
        path: '/payout-history',
        route: payoutHistoryRoutes
    },
    {
        path: '/notification',
        route: notificationRoutes
    },
    {
        path: '/retailerkycstatus',
        route: retailerkycstatusRoute,
    },
    {
        path: '/retailer',
        route: retailerRouter
    },
    {
        path: '/retailer-edit-kyc',
        route: retailereditkycRouter,
    },
    {
        path: '/retailer-history',
        route: retailerHistoryRoutes,
    },
    {
        path: '/distributor',
        route: distributorRoutes,
    },
    {
        path: '/retailermasterdata',
        route: retailermasterdataRouter,
    }

];
routes.forEach((route) => {
    router.use(route.path, route.route);
});
module.exports = router;