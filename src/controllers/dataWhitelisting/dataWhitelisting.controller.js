const { totalEntries, selectDataWhitelisting, exportWhitelisting, getTotalCount, UpdateWhiteList, selectASE, updateASE, insertASE, selectAW, updateAW, insertAW, selectAWSM, updateAWSM, insertAWSM, insertIntoFileProcess, getUploadRecords, updateIsActiveStatus, UpdateAWSMHistory, deleteAWSM, selectKYC, awsmDetailsHistory, updateKYCDetailHistory, updateKYCDetail, selectAWSMDetail, updateAWSMDetailHistory, updateAWSMDetail, selectKYCDetail, update_kyc_details, updateAWSMKycAuthenticationDetails, deleteKYCDetail, selectAUTH, updateAUTHDetailHistory, updateAUTHDetail } = require("../../models/data-whitelisting.model");
const fs = require('fs');
const json2csv = require('json2csv').parse;
const moment = require('moment');
const timestamp1 = moment().valueOf();
const csvFileName = `SampleWhitelisting 2_${timestamp1}_feedback.csv`;
const path = require('path');


const dataWhitelistingView = async (req, res, next) => {
  if (req.query.page == -1) {
    req.query.page = 1;
  }
  let fileProcessRecords = await getUploadRecords();
  let dataWhitelistingResult = await selectDataWhitelisting(req.query);
  let totalRows = await getTotalCount();
  let totalEntrie = await totalEntries();

  const maxVisiblePages = 4;
  let currentPage = req.query.page || 1;
  const startPage = Math.max(parseInt(currentPage) - Math.floor(maxVisiblePages / 2), 1);
  const endPage = Math.min(startPage + maxVisiblePages - 1, totalRows);

  res.render('data-whitelisting', { user: res.userDetail, dataWhitelistingResult, uploadDataArray: fileProcessRecords, QueryData: req.query, notification: res.notification, startPage, endPage, currentPage, totalRows, totalEntrie })
}

const saveWhitelisnting = async (req, res) => {
  req.body.awsm_name = req.query.awsm_name;
  req.body.awsm_code = req.query.awsm_code;

  //Check for awsm for awsm_details
  let selectResultAWSMDetail = await selectAWSMDetail(req.body);
  if (selectResultAWSMDetail.length != 0) {
    req.body.reason = `Awsm Code-: ${selectResultAWSMDetail[0].awsm_code} replaced by : ${req.body.salesman_code} && Awsm Code-: ${selectResultAWSMDetail[0].awsm_name} replaced by : ${req.body.salesman_name}`;

    try {
      await updateAWSMDetailHistory(selectResultAWSMDetail[0]);
      await updateAWSMDetail(req.body);
    }
    catch (error) {
      return res.redirect("/data-whitelisting");
    }
  }

  try {
    //Check for kyc from kyc_details
    let selectKYCResult = await selectKYCDetail(req.body);
    if (selectKYCResult.length != 0) {

      let selectAWSMHistoryResult = await awsmDetailsHistory(req.body.awsm_code);
      selectKYCResult[0].awsm_history_id = selectAWSMHistoryResult[0].id;
      selectKYCResult[0].reason = `Awsm Code-: ${selectKYCResult[0].awsm_code} replaced by : ${req.body.salesman_code}`;

      await updateKYCDetailHistory(selectKYCResult[0]);
      await update_kyc_details(req.body);
    }
    await updateAWSMKycAuthenticationDetails(req.body);
    res.redirect("/data-whitelisting");
  }
  catch (error) {
    res.redirect("/data-whitelisting");
  }
}

// const uploadData = async (req, res) => {
//   try {
//     let csvData = req.files.file.data.toString().split('\r\n');
//     const dataArray = csvData.map(row => row.split(','));
//     let data = dataArray.slice(1, -1);

//     let success_count = 0;
//     let failure_count = 0;
//     let excelArray = [];

//     // Use map to create an array of promises
//     const promiseArray = data.map(async (element) => {
//       let excelObject = {
//         ase_email_id: element[0],
//         ase_name: element[1],
//         ase_employee_code: element[2],
//         ase_state: element[3],
//         ase_city: element[4],
//         aw_name: element[5],
//         aw_code: element[6],
//         aw_state: element[7],
//         aw_city: element[8],
//         awsm_name: element[9],
//         awsm_code: element[10],
//         awsm_state: element[11],
//         awsm_city: element[12],
//         region: element[13],
//         salesman_type: element[14],
//         channel: element[15]
//       }

//       if (excelObject.salesman_type !== '' && excelObject.salesman_type !== ' ') {

//         //Check ase exist or not 
//         let aseExistResult = await selectASE(excelObject);

//         if (aseExistResult.length == 0) {
//           await insertASE(excelObject);
//         } else {
//           await updateASE(excelObject);
//         }

//         // Check AW exist or not 
//         let awInrestResult = await selectAW(excelObject);

//         if (awInrestResult.length == 0) {
//           await insertAW(excelObject);
//         } else {
//           await updateAW(excelObject);
//         }

//         // Check AWSM exist or not
//         let awsmInsertResult = await selectAWSM(excelObject);

//         if (awsmInsertResult.length == 0) {
//           await insertAWSM(excelObject);
//           excelObject.status = 'Success'
//           excelObject.reason = 'NA'
//           success_count++;
//         } else {
//           await updateAWSM(excelObject);
//           excelObject.status = 'Failure'
//           excelObject.reason = 'DUPLICATE DATA EXIST';
//           failure_count++;
//         }
//         excelArray.push(excelObject)
//       }
//     });

//     Promise.all(promiseArray)
//       .then(async () => {
//         const fields = [
//           { label: 'ASE Email Id', value: 'ase_email_id' },
//           { label: 'ASE Name', value: 'ase_name' },
//           { label: 'ASE Employee Code', value: 'ase_employee_code' },
//           { label: 'ASE State', value: 'ase_state' },
//           { label: 'ASE City', value: 'ase_city' },
//           { label: 'AW Name', value: 'aw_name' },
//           { label: 'AW Code', value: 'aw_code' },
//           { label: 'AW State', value: 'aw_state' },
//           { label: 'AW City', value: 'aw_city' },
//           { label: 'AWSM Name', value: 'awsm_name' },
//           { label: 'AWSM Code', value: 'awsm_code' },
//           { label: 'AWSM State', value: 'awsm_state' },
//           { label: 'AWSM City', value: 'awsm_city' },
//           { label: 'Region', value: 'region' },
//           { label: 'Status', value: 'status' },
//           { label: 'Reason', value: 'reason' }
//         ];
//         const csv = json2csv(excelArray, { fields });
//         const dynamicBasePath = '../../../src/public/upload_files/';
//         const directoryPath = path.join(__dirname, dynamicBasePath);
//         const filePath = path.join(directoryPath, csvFileName);

//         fs.writeFileSync(filePath, csv);
//         let imageHostUrl = req.protocol + '://' + req.get('host') + '/public/upload_files/' + csvFileName;

//         let fileData = {
//           // client_id: 'BRIT_20190625',
//           // upload_type: "EDIT",
//           original_file_name: req.files.file.name,
//           file_name: csvFileName,
//           file_size: req.files.file.size,
//           process_status: "COMPLETED",
//           reason: 'SUCCESS',
//           total_count: data.length,
//           success_count: success_count,
//           failure_count: failure_count,
//           updated_file_name: imageHostUrl,
//           channel: "GT",
//         }
//         // Upload Data into whitelisting_file_process
//         await insertIntoFileProcess(fileData);
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//         return res.redirect('/data-whitelisting');
//       });
//     return res.redirect('/data-whitelisting');
//   }
//   catch (error) {
//     console.log('Error', error);
//     return res.redirect('/data-whitelisting');
//   }
// }


const uploadData = async (req, res) => {
  try {
    let csvData = req.files.file.data.toString().split('\r\n');
    let dataArray = csvData.map(row => row.split(','));
    let data = dataArray.slice(1, -1);
    let success_count = 0;
    let failure_count = 0;
    let excelArray = [];


    if (req.query.action === 'delete-awsm') {
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        let excelObject = {
          ase_email_id: removeCommas(element[0]),
          ase_name: removeCommas(element[1]),
          ase_employee_code: removeCommas(element[2]),
          ase_state: removeCommas(element[3]),
          ase_city: removeCommas(element[4]),
          aw_name: removeCommas(element[5]),
          aw_code: removeCommas(element[6]),
          aw_state: removeCommas(element[7]),
          aw_city: removeCommas(element[8]),
          awsm_name: removeCommas(element[9]),
          awsm_code: removeCommas(element[10]),
          awsm_state: removeCommas(element[11]),
          awsm_city: removeCommas(element[12]),
          region: removeCommas(element[13]),
          salesman_type: removeCommas(element[14]),
          channel: removeCommas(element[15])
        };

        function removeCommas(value) {
          return value.replace(/,/g, '');
        }

        try {
          if (excelObject.salesman_type.trim() !== '') {

            //Check ase exist or not 
            let aseExistResult = await selectASE(excelObject);

            if (aseExistResult.length !== 0) {

              // Check AW exist or not 
              let awInsertResult = await selectAW(excelObject);

              if (awInsertResult.length !== 0) {

                // Check AWSM exist or not
                let awsmInsertResult = await selectAWSM(excelObject);

                if (awsmInsertResult.length !== 0) {
                  try {
                    awsmInsertResult[0].reason = `Awsm Code-: ${awsmInsertResult[0].awsm_code} Deleted`;

                    await UpdateAWSMHistory(awsmInsertResult[0]);
                    await deleteAWSM(excelObject);

                    // Check KYC DETAILS exist or not for this awsm
                    let selectKYCResult = await selectKYC(excelObject);
                    if (selectKYCResult.length != 0) {
                      let selectAWSMHistory = await awsmDetailsHistory(excelObject.awsm_code);

                      selectKYCResult[0].awsm_history_id = selectAWSMHistory[0].id;
                      selectKYCResult[0].reason = `Awsm Code-: ${selectKYCResult[0].awsm_code} Deleted`;

                      await updateKYCDetailHistory(selectKYCResult[0]);
                      await deleteKYCDetail(excelObject);
                    }
                    excelObject.status = 'Success';
                    excelObject.reason = 'NA';
                    success_count++;
                  }
                  catch (error) {
                    console.log(error)
                    return res.redirect('/data-whitelisting');
                  }
                } else {
                  excelObject.status = 'Failure';
                  excelObject.reason = 'AWSM NOT EXIST';
                  failure_count++;
                }
              }
              else {
                excelObject.status = 'Failure';
                excelObject.reason = 'AW NOT EXIST';
                failure_count++;
              }
            } else {
              excelObject.status = 'Failure';
              excelObject.reason = 'ASE NOT EXIST';
              failure_count++;
            }
            excelArray.push(excelObject)
          }
        }
        catch (error) {
          console.log(error)
          return res.redirect('/data-whitelisting');
        }
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        let excelObject = {
          ase_email_id: removeCommas(element[0]),
          ase_name: removeCommas(element[1]),
          ase_employee_code: removeCommas(element[2]),
          ase_state: removeCommas(element[3]),
          ase_city: removeCommas(element[4]),
          aw_name: removeCommas(element[5]),
          aw_code: removeCommas(element[6]),
          aw_state: removeCommas(element[7]),
          aw_city: removeCommas(element[8]),
          awsm_name: removeCommas(element[9]),
          awsm_code: removeCommas(element[10]),
          awsm_state: removeCommas(element[11]),
          awsm_city: removeCommas(element[12]),
          region: removeCommas(element[13]),
          salesman_type: removeCommas(element[14]),
          channel: removeCommas(element[15])
        };
        //console.log(excelObject);
        function removeCommas(value) {
          return value.replace(/,/g, '');
        }

        if (excelObject.salesman_type.trim() !== '') {
          //Check ase exist or not 
          let aseExistResult = await selectASE(excelObject);
          let ASEEmail = '';
          if (aseExistResult.length == 0) {
            await insertASE(excelObject);
          } else {
            ASEEmail = aseExistResult[0].ase_email_id;
            await updateASE(excelObject);
          }

          // Check AW exist or not 
          let awInsertResult = await selectAW(excelObject);
          console.log(awInsertResult.length);
          if (awInsertResult.length == 0) {
            await insertAW(excelObject);
          } else {
            ASEEmail = awInsertResult[0].ase_email_id;
            await updateAW(excelObject);
          }

          // Check AWSM exist or not
          let awsmInsertResult = await selectAWSM(excelObject);

          if (awsmInsertResult.length == 0) {
            await insertAWSM(excelObject);
            excelObject.status = 'Success';
            excelObject.reason = 'NA';
            success_count++;
          } else {
            excelObject.reason = `Awsm Code-: ${awsmInsertResult[0].awsm_code} replaced by : ${excelObject.awsm_code} && Awsm Name -: ${awsmInsertResult[0].awsm_name} replaced by : ${excelObject.awsm_name} && Awsm State-: ${awsmInsertResult[0].awsm_state} replaced by : ${excelObject.awsm_state} && Aw Code -: ${awsmInsertResult[0].aw_code} replaced by : ${excelObject.aw_code} && Awsm City-: ${awsmInsertResult[0].awsm_city} replaced by : ${excelObject.awsm_city} && Ase Email-: ${ASEEmail} replaced by : ${excelObject.ase_email_id}`;
            await UpdateAWSMHistory(excelObject);
            await updateAWSM(excelObject);


            // Check KYC DETAILS exist or not for this awsm
            let selectKYCResult = await selectKYC(excelObject);
            if (selectKYCResult.length != 0) {
              let selectAWSMHistory = await awsmDetailsHistory(excelObject.awsm_code);

              selectKYCResult[0].awsm_history_id = selectAWSMHistory[0].id;
              selectKYCResult[0].reason = `Awsm Code-: ${selectKYCResult[0].awsm_code} replaced by : ${excelObject.awsm_code} && Awsm Name -: ${awsmInsertResult[0].awsm_name} replaced by : ${excelObject.awsm_name} && Awsm State-: ${awsmInsertResult[0].awsm_state} replaced by : ${excelObject.awsm_state} && Aw Code -: ${awsmInsertResult[0].aw_code} replaced by : ${excelObject.aw_code} && Awsm City-: ${awsmInsertResult[0].awsm_city} replaced by : ${excelObject.awsm_city} && Ase Email -: ${selectKYCResult[0].ase_email} replaced by : ${excelObject.ase_email_id}`;

              await updateKYCDetailHistory(selectKYCResult[0]);
              await updateKYCDetail(excelObject);


              //Check AUTH EXIST or not from kyc_authnetication_details
              let selectAuthResult = await selectAUTH(excelObject);
              if (selectAuthResult.length != 0) {
                selectAuthResult[0].reason = `Awsm Code-: ${selectAuthResult[0].awsm_code} replaced by : ${excelObject.awsm_code} && Awsm Name -: ${awsmInsertResult[0].awsm_name} replaced by : ${excelObject.awsm_name} && Awsm State-: ${awsmInsertResult[0].awsm_state} replaced by : ${excelObject.awsm_state} && Aw Code -: ${awsmInsertResult[0].aw_code} replaced by : ${excelObject.aw_code} && Awsm City-: ${awsmInsertResult[0].awsm_city} replaced by : ${excelObject.awsm_city} && Ase Email -: ${selectAuthResult[0].ase_email} replaced by : ${excelObject.ase_email_id}`;

                selectAuthResult[0].kyc_id = selectKYCResult[0].kyc_id;
                console.log(excelObject, "excelObject");
                console.log(selectAuthResult[0], "selectAuthResult");

                await updateAUTHDetailHistory(selectAuthResult[0]);
                await updateAUTHDetail(excelObject);
              }
            }
            excelObject.status = 'Failure';
            excelObject.reason = 'DUPLICATE DATA EXIST';
            failure_count++;
          }
          excelArray.push(excelObject);
        }
      }
    }
    try {
      const fields = [
        { label: 'ASE Email Id', value: 'ase_email_id' },
        { label: 'ASE Name', value: 'ase_name' },
        { label: 'ASE Employee Code', value: 'ase_employee_code' },
        { label: 'ASE State', value: 'ase_state' },
        { label: 'ASE City', value: 'ase_city' },
        { label: 'DISTRIBUTOR Name', value: 'aw_name' },
        { label: 'DISTRIBUTOR Code', value: 'aw_code' },
        { label: 'DISTRIBUTOR State', value: 'aw_state' },
        { label: 'DISTRIBUTOR City', value: 'city' },
        { label: 'AWSM Name', value: 'awsm_name' },
        { label: 'AWSM Code', value: 'awsm_code' },
        { label: 'AWSM State', value: 'awsm_state' },
        { label: 'AWSM City', value: 'awsm_city' },
        { label: 'Region', value: 'region' },
        { label: 'Status', value: 'status' },
        { label: 'Reason', value: 'reason' }
      ];
      const csv = json2csv(excelArray, { fields });
      const dynamicBasePath = '../../../src/public/upload_files/';
      const directoryPath = path.join(__dirname, dynamicBasePath);
      const filePath = path.join(directoryPath, csvFileName);
      // console.log(csv);
      fs.writeFileSync(filePath, csv);
      let imageHostUrl = req.protocol + '://' + req.get('host') + '/public/upload_files/' + csvFileName;

      let fileData = {
        // client_id: 'BRIT_20190625',
        // upload_type: "EDIT",
        original_file_name: req.files.file.name,
        file_name: csvFileName,
        file_size: req.files.file.size,
        process_status: "COMPLETED",
        reason: 'SUCCESS',
        total_count: data.length,
        success_count: success_count,
        failure_count: failure_count,
        updated_file_name: imageHostUrl,
        channel: "GT",
      }
      // Upload Data into whitelisting_file_process
      await insertIntoFileProcess(fileData);
      return res.redirect('/data-whitelisting');
    }
    catch (error) {
      console.log(error, "**********************catch error********************");
      return res.redirect('/data-whitelisting');
    }
  }
  catch (error) {
    console.log('Error', error);
    return res.redirect('/data-whitelisting');
  }
}


const downloadSample = async (req, res) => {
  try {
    const columns = [
      'SO Email id',
      'SO Name',
      'SO Employee Code',
      'SO State',
      'SO City',
      'DISTRIBUTOR Name',
      'DISTRIBUTOR Code',
      'DISTRIBUTOR State',
      'DISTRIBUTOR City',
      'DSR Name',
      'DSR Code',
      'DSR State',
      'DSR City',
      'Region',
      'Salesman Type',
      'Channel'
    ];

    res.setHeader('Content-Disposition', 'attachment; filename=SampleWhitelisting.csv');
    res.setHeader('Content-Type', 'text/csv');

    res.write(columns.join(',') + '\n');

    const data = [
      {
        'ASE Email id': '',
        'ASE Name': '',
        'ASE Employee Code': '',
        'ASE ASE State': '',
        'ASE ASE City': '',
        'AW Name': '',
        'AW Code': '',
        'AW State': '',
        'AW City': '',
        'AWSM Name': '',
        'AWSM Code': '',
        'AWSM State': '',
        'AWSM City': '',
        'Region': '',
        'Salesman Tyep': ''
      },
    ];

    data.forEach((record) => {
      const row = columns.map((column) => record[column] || '').join(',');
      res.write(row + '\n');
    });

    res.end();
  } catch (error) {
    console.error('Error generating or serving the sample CSV:', error);
    res.redirect('/data-whitelisting');
  }
};

const UpdateStatus = async (req, res) => {
  try {
    const isChecked = req.body.isChecked;
    let data = {};
    if (isChecked === 'true') {
      data.isChecked = '1'
      data.awsm_code = req.body.awsm_code
    } else {
      data.isChecked = '0'
      data.awsm_code = req.body.awsm_code
    }
    await updateIsActiveStatus(data);
    return res.redirect("/data-whitelisting")
  }
  catch (error) {
    console.log('Error', error);
    return res.redirect("/data-whitelisting");
  }
}

const exportWhitelist = async (req, res) => {
  let whitelistResult = await selectDataWhitelisting(req.query);

  res.send(whitelistResult);
}

module.exports = {
  dataWhitelistingView,
  saveWhitelisnting,
  uploadData,
  downloadSample,
  UpdateStatus,
  exportWhitelist
}