const { selectKYCHistory, getAWSMCity } = require("../../models/retailer_kycHistory.model");


const retailerHistoryView = async (req, res, next) => {
    let kycHistoryData = await selectKYCHistory(req.query);
    let awsmCity = await getAWSMCity();
    res.render('retailer-history', { user: res.userDetail, kycHistoryData, QueryData: req.query, awsmCity, notification: res.notification });
}

const exportKYCHistoryData = async (req, res) => {
    let KYCHistoryData = await selectKYCHistory(req.query);
    res.send(KYCHistoryData)
}

module.exports = {
    retailerHistoryView,
    exportKYCHistoryData
}