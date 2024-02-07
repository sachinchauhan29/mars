const { getUploadRecords } = require("../../models/payout-history.model");

const payoutHistoryView = async (req, res, next) => {
  let fileProcessRecords = await getUploadRecords();
  res.render('payout/payout-history', { user: res.userDetail, uploadDataArray: fileProcessRecords, notification: res.notification });
}

module.exports = {
  payoutHistoryView,
}