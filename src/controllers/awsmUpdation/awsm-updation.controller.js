const { selectAWSMUpdationLatest, selectAWSMUpdationOld, insertKycDetails, removeRestoreUser, UpdateKycAuthentication, getKycAuthenticationHistoryDetails, createKycAuthenticationDetails, updateAWSMDetails, getKYCHistory, UpdateKycDetails, selectKycDetails, exportAWSMLatestUpdate, exportAWSMOldUpdate } = require("../../models/awsm_updation.model");


const awsmUpdationView = async (req, res, next) => {
  let awsmLatest = await selectAWSMUpdationLatest(req.query);
  let awsmOld = await selectAWSMUpdationOld();

  res.render('awsm-updation', { user: res.userDetail, awsmLatest: awsmLatest, awsmOld: awsmOld, QueryData: req.query, notification: res.notification })
}

const awsmUpdationRestore = async (req, res) => {
  try {
    req.body.kyc_id = req.query.kyc_id;
    req.body.history_id = req.query.history_id;

    //update kyc_authentication_details 
    //update kyc_bio_details
    //update kyc_details
    //update awsm_details

    let getKycAuthDetailsHis = await getKycAuthenticationHistoryDetails(req.query);

    if (getKycAuthDetailsHis.length == 0) {
      await createKycAuthenticationDetails(req.body);
    } else {
      await UpdateKycAuthentication(getKycAuthDetailsHis[0]);
    }

    let getKycHistoryResult = await getKYCHistory(req.query);
    let selectKycDetailsResult = await selectKycDetails(req.query);

    if (selectKycDetailsResult.length == 0) {
      await insertKycDetails(getKycHistoryResult[0]);
    } else {
      await UpdateKycDetails(getKycHistoryResult[0]);
    }

    // await updateAWSMDetails(req.body);
    await removeRestoreUser(req.query);
    return res.redirect('/awsm-updation');
  }
  catch (error) {
    console.log("Error in restore", error);
    return res.redirect('/awsm-updation');
  }
}

const awsmLatestUpdation = async (req, res) => {
  let exportResult = await exportAWSMLatestUpdate(req.query);
  res.send(exportResult);
}

const awsmOldUpdation = async (req, res) => {
  let exportResult = await exportAWSMOldUpdate();
  res.send(exportResult);
}

module.exports = {
  awsmUpdationView,
  awsmUpdationRestore,
  awsmLatestUpdation,
  awsmOldUpdation
}