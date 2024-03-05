const { selectMasterData, getAWSMCity, exportMasterData } = require("../../models/retailer_masterdata.model");


const retailermasterdataView = async (req, res, next) => {
    let masterData = await selectMasterData(req.query);
    let awsmCity = await getAWSMCity();
    res.render('retailermasterdata', { user: res.userDetail, masterData, awsmCity, QueryData: req.query, notification: res.notification });
}


const exportKYCMasterData = async (req, res) => {
    let masterData = await selectMasterData(req.query);
    res.send(masterData);
}

module.exports = {
    retailermasterdataView,
    exportKYCMasterData
}