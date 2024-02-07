const { selectBlockASEReport, getAWSMCity } = require("../../models/ase-block-report.model");


const blockASEUserReportView = async (req, res, next) => {
  let reportASEDATA = await selectBlockASEReport(req.query);
  let awsmCity = await getAWSMCity();
  res.render('block-ase-user-report', { user: res.userDetail, reportASEDATA, QueryData: req.query, awsmCity });
}

module.exports = {
  blockASEUserReportView
}