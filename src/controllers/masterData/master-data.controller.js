const { selectMasterData, getAWSMCity, exportMasterData } = require("../../models/master-data.model");


const masterDataView = async (req, res, next) => {
  let masterData = await selectMasterData(req.query);
  let awsmCity = await getAWSMCity();
  res.render('master-data', { user: res.userDetail, masterData, awsmCity, QueryData: req.query, notification: res.notification });
}


const exportKYCMasterData = async (req, res) => {
  let masterData = await exportMasterData(req.query);
  res.send(masterData);
}

module.exports = {
  masterDataView,
  exportKYCMasterData
}