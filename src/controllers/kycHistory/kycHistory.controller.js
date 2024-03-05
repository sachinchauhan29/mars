const { selectKYCHistory, getAWSMCity, downloadHistoryAllData } = require("../../models/kyc-history.model");


const kycHistoryView = async (req, res, next) => {
  let kycHistoryData = await selectKYCHistory(req.query);
  let awsmCity = await getAWSMCity();
  res.render('kyc-history', { user: res.userDetail, kycHistoryData, QueryData: req.query, awsmCity, notification: res.notification });
}

const exportKYCHistoryData = async (req, res) => {
  let KYCHistoryData = await selectKYCHistory(req.query);
  res.send(KYCHistoryData)
}

module.exports = {
  kycHistoryView,
  exportKYCHistoryData
}