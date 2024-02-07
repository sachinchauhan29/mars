const { selectKYCStatus, getTotalCount, exportKYCStatus } = require("../../models/kyc-status.model");


const kycStatusView = async (req, res, next) => {
  if (req.query.page == -1) {
    req.query.page = 1;
  }

  let KYCStatusData = await selectKYCStatus(req.query);
  let totalRows = await getTotalCount();

  const maxVisiblePages = 4;
  let currentPage = req.query.page || 1;
  const startPage = Math.max(parseInt(currentPage) - Math.floor(maxVisiblePages / 2), 1);
  const endPage = Math.min(startPage + maxVisiblePages - 1, totalRows);

  res.render('kyc-status', { user: res.userDetail, KYCStatusData, QueryData: req.query, notification: res.notification, startPage, endPage, currentPage, totalRows });
}

const exportKYCStatusData = async (req, res) => {
  let KYCStatusData = await exportKYCStatus(req.query);

  res.send(KYCStatusData);
}

module.exports = {
  kycStatusView,
  exportKYCStatusData
}