const { selectMasterData, getAWSMCity, exportMasterData } = require("../../models/master-data.model");


const retailermasterdataView = async (req, res, next) => {
    let masterData = await selectMasterData(req.query);
    let awsmCity = await getAWSMCity();
    res.render('retailermasterdata', { user: res.userDetail, masterData, awsmCity, QueryData: req.query, notification: res.notification });
}


const exportKYCMasterData = async (req, res) => {
    let masterData = await exportMasterData(req.query);
    res.send(masterData);
}

module.exports = {
    retailermasterdataView,
    exportKYCMasterData
}