const { selectAuthentication, filterDataAuthentication, getAWSMCity, getTotalCount, totalEntries } = require("../../models/authentication.model");



const authenticationView = async (req, res, next) => {

  if (req.query.page == -1) {
    req.query.page = 1;
  }

  let authenticationDetails = await filterDataAuthentication(req.query);
  let awsmCity = await getAWSMCity();
  let totalRows = await getTotalCount();
  let totalEntrie = await totalEntries();

  const maxVisiblePages = 4;
  let currentPage = req.query.page || 1;
  const startPage = Math.max(parseInt(currentPage) - Math.floor(maxVisiblePages / 2), 1);
  const endPage = Math.min(startPage + maxVisiblePages - 1, totalRows);

  res.render('authentication', { user: res.userDetail, authenticationDetails, awsmCity, QueryData: req.query, notification: res.notification, startPage, endPage, currentPage, totalRows, totalEntrie });
}



const exporAuthenticationData = async (req, res) => {
  let allDetails = await selectAuthentication(req.query);
  res.send(allDetails)
}



module.exports = {
  authenticationView,
  exporAuthenticationData
}