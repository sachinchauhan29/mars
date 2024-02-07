const { selectKYCReportBase, selectPayoutData, getTotalCount, payoutExport } = require("../../models/kyc-report.model");

const payoutView = async (req, res, next) => {

  if (req.query.page == -1) {
    req.query.page = 1;
  }

  let resultDB = await selectKYCReportBase(req.query);
  let totalRows = await getTotalCount();

  const maxVisiblePages = 4;
  let currentPage = req.query.page || 1;
  const startPage = Math.max(parseInt(currentPage) - Math.floor(maxVisiblePages / 2), 1);
  const endPage = Math.min(startPage + maxVisiblePages - 1, totalRows);

  res.render('payout', { user: res.userDetail, payout: resultDB, QueryData: req.query, notification: res.notification, startPage, endPage, currentPage, totalRows });
}


const exportPayout = async (req, res) => {
  let exportResult = await payoutExport(req.query);
  res.send(exportResult);
}

module.exports = {
  payoutView,
  exportPayout
}