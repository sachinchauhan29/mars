
const { totalEntries, selectDataWhitelisting, getTotalCount, updateIsActiveStatus, awsmDetailsHistory, selectAWSMDetail, updateAWSMDetailHistory, updateAWSMDetail, selectKYCDetail, update_kyc_details, updateAWSMKycAuthenticationDetails, insertIntoFileProcessretailerwhitelisting, getUploadRecords, updateKYCDetailHistory, insertAWSM, insertASE, UpdateAWSMHistory, selectAWSM, updateAW, insertAW, selectAW, updateASE, selectASE,deleteAWSM } = require("../../models/retailerwhitelisting.model");
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

    // console.log(dataWhitelistingResult);
    let totalRows = await getTotalCount();
    let totalEntrie = await totalEntries();


    // let retailerDataQuery = await retailer(req.query);
    const maxVisiblePages = 4;
    let currentPage = req.query.page || 1;
    const startPage = Math.max(parseInt(currentPage) - Math.floor(maxVisiblePages / 2), 1);
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalRows);

    res.render('retailerwhitelisting', { user: res.userDetail, dataWhitelistingResult, uploadDataArray: fileProcessRecords, QueryData: req.query, notification: res.notification, startPage, endPage, currentPage, totalRows, totalEntrie })

    //console.log('hghjglg', 'uploading...', retailerDataQuery);
}

const saveWhitelisnting = async (req, res) => {
    req.body.awsm_name = req.query.awsm_name;
    req.body.awsm_code = req.query.awsm_code;

    //Check for awsm for awsm_details
    let selectResultAWSMDetail = await selectAWSMDetail(req.body);
    console.log(selectResultAWSMDetail, 'AWSM details');
    if (selectResultAWSMDetail.length != 0) {
        req.body.reason = `Awsm Code-: ${selectResultAWSMDetail[0].awsm_code} replaced by : ${req.body.salesman_code} && Awsm Code-: ${selectResultAWSMDetail[0].awsm_name} replaced by : ${req.body.salesman_name}`;

        try {
            // await updateAWSMDetailHistory(selectResultAWSMDetail[0]);
            await updateAWSMDetail(req.body);
        }
        catch (error) {
            return res.redirect("/retailerwhitelisting");
        }
    }

    try {
        //Check for kyc from kyc_details
        let selectKYCResult = await selectKYCDetail(req.body);
        console.log(selectKYCResult, 'selectKYCResult awsm_code')
        if (selectKYCResult.length != 0) {
            let selectAWSMHistoryResult = await awsmDetailsHistory(req.body);
            console.log(selectAWSMHistoryResult, 'selectAWSMHistoryResult awsm_code')

            selectKYCResult[0].awsm_history_id = selectAWSMHistoryResult[0].id;
            selectKYCResult[0].reason = `Awsm Code-: ${selectKYCResult[0].awsm_code} replaced by : ${req.body.awsm_code}`;
            //await updateKYCDetailHistory(selectKYCResult[0]);
            await update_kyc_details(req.body);
        }
        //  await updateAWSMKycAuthenticationDetails(req.body);
        res.redirect("/retailerwhitelisting");
    }
    catch (error) {
        console.log(error, "Error updating');", error.message);
        res.redirect("/retailerwhitelisting");
    }
}

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
                    region: removeCommas(element[0]),
                    ASM_Email_id: removeCommas(element[1]),
                    ASM_Name: removeCommas(element[2]),
                    ASM_Code: removeCommas(element[3]),
                    ase_email_id: removeCommas(element[4]),
                    ase_code: removeCommas(element[5]),
                    ase_name: removeCommas(element[6]),
                    City: removeCommas(element[7]),
                    aw_code: removeCommas(element[8]),
                    aw_name: removeCommas(element[9]),
                    name: removeCommas(element[10]),
                    awsm_code: removeCommas(element[11]),
                    aw_state: removeCommas(element[12]),
                    aw_city: removeCommas(element[13]),
                    salesman_type: removeCommas(element[14]),
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

                                        ///await UpdateAWSMHistory(awsmInsertResult[0]);
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
                                        return res.redirect('/retailerwhitelisting');
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
                    return res.redirect('/retailerwhitelisting');
                }
            }
        } else {
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                let excelObject = {
                    region: removeCommas(element[0]),
                    ASM_Email_id: removeCommas(element[1]),
                    ASM_Name: removeCommas(element[2]),
                    ASM_Code: removeCommas(element[3]),
                    ase_email_id: removeCommas(element[4]),
                    ase_code: removeCommas(element[5]),
                    ase_name: removeCommas(element[6]),
                    City: removeCommas(element[7]),
                    aw_code: removeCommas(element[8]),
                    aw_name: removeCommas(element[9]),
                    name: removeCommas(element[10]),
                    awsm_code: removeCommas(element[11]),
                    aw_state: removeCommas(element[12]),
                    aw_city: removeCommas(element[13]),
                    salesman_type: removeCommas(element[14]),
                    //channel: removeCommas(element[15])
                };

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
                { label: 'region', value: 'region' },
                { label: 'ASM Email id', value: 'ASM_Email_id' },
                { label: 'ASM Name', value: 'ASM_Name' },
                { label: 'ASM Code', value: 'ASM_Code' },
                { label: 'SO Email id', value: 'ase_email_id' },
                { label: 'SO Code', value: 'ase_code' },
                { label: 'SO Name', value: 'ase_name' },
                { label: 'City', value: 'City' },
                { label: 'Distributor Code', value: 'aw_code' },
                { label: 'Distributor Name', value: 'aw_name' },
                { label: 'Retailer Code', value: 'retailercode' },
                { label: 'Retailer State', value: 'aw_state' },
                { label: 'Retailer City', value: 'aw_city' },
                { label: 'Retailer Name', value: 'name' },
                // { label: 'Salesman Code', value: 'Salesman_Code' },
                // { label: 'Salesman Name', value: 'Salesman_Name' },
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
            await insertIntoFileProcessretailerwhitelisting(fileData);
            return res.redirect('/retailerwhitelisting');
        }
        catch (error) {
            console.log(error, "**********************catch error********************");
            return res.redirect('/retailerwhitelisting');
        }
    }
    catch (error) {
        console.log('Error', error);
        return res.redirect('/retailerwhitelisting');
    }
}
const uploadDatass = async (req, res) => {
    try {

        let csvData = req.files.file.data.toString().split('\n');
        let dataArray = csvData.map(row => row.split(','));
        let data = dataArray.slice(1);
        console.log("data", data);
        if (req.query.action === 'delete-awsm') {
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                let excelObject = {
                    ASM_Email_ID: removeCommas(element[0]),
                    ASM_Name: removeCommas(element[1]),
                    ASM_Code: removeCommas(element[2]),
                    SO_Email_ID: removeCommas(element[3]),
                    SO_Code: removeCommas(element[4]),
                    SO_Name: removeCommas(element[5]),
                    City: removeCommas(element[6]),
                    Distributor_Code: removeCommas(element[7]),
                    Distributor_Name: removeCommas(element[8]),
                    Retailer_Name: removeCommas(element[9]),
                    Retailer_Code: removeCommas(element[10]),
                    Retailer_State: removeCommas(element[11]),
                    Retailer_City: removeCommas(element[12]),
                    Salesman_Name: removeCommas(element[13]),
                    Salesman_Code: removeCommas(element[14])
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
                                        return res.redirect('/retailerwhitelisting');
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
                    return res.redirect('/retailerwhitelisting');
                }
            }
        } else {
            for (let i = 0; i < data.length; i++) {
                const element = data[i];

                let excelObject = {
                    ASM_Email_ID: removeCommas(element[0]),
                    ASM_Name: removeCommas(element[1]),
                    ASM_Code: removeCommas(element[2]),
                    SO_Email_ID: removeCommas(element[3]),
                    SO_Code: removeCommas(element[4]),
                    SO_Name: removeCommas(element[5]),
                    City: removeCommas(element[6]),
                    Distributor_Code: removeCommas(element[7]),
                    Distributor_Name: removeCommas(element[8]),
                    Retailer_Name: removeCommas(element[9]),
                    Retailer_Code: removeCommas(element[10]),
                    Retailer_State: removeCommas(element[11]),
                    Retailer_City: removeCommas(element[12]),
                    Salesman_Name: removeCommas(element[13]),
                    Salesman_Code: removeCommas(element[14])
                };
                console.log(excelObject, "................................")

                function removeCommas(value) {

                    if (typeof value === 'string') {
                        return value.replace(/,/g, '');
                    } else {
                        return value;
                    }
                }

                if (excelObject.salesman_type.trim() !== '') {

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
                { label: 'ASM Email id', value: 'ASM_Email_ID' },
                { label: 'ASM Name', value: 'ASM_Name' },
                { label: 'ASM Code', value: 'ASM_Code' },
                { label: 'SO Email id', value: 'SO_Email_ID' },
                { label: 'SO Code', value: 'SO_Code' },
                { label: 'SO Name', value: 'SO_Name' },
                { label: 'City', value: 'City' },
                { label: 'Distributor Code', value: 'Distributor_Code' },
                { label: 'Distributor Name', value: 'Distributor_Name' },
                { label: 'Retailer Code', value: 'Retailer_Code' },
                { label: 'Retailer State', value: 'Retailer_State' },
                { label: 'Retailer City', value: 'Retailer_City' },
                { label: 'Retailer Name', value: 'Retailer_Name' },
                { label: 'Salesman Code', value: 'Salesman_Code' },
                { label: 'Salesman Name', value: 'Salesman_Name' },
            ];
            const csv = json2csv(excelArray, { fields });
            const dynamicBasePath = '../../../src/public/upload_files/';
            const directoryPath = path.join(__dirname, dynamicBasePath);
            const filePath = path.join(directoryPath, csvFileName);

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
            await insertIntoFileProcessretailerwhitelisting(fileData);
            return res.redirect('/retailerwhitelisting');
        }
        catch (error) {
            console.log(error, "**********************catch error********************");
            return res.redirect('/retailerwhitelisting');
        }
    }
    catch (error) {
        console.log('Error', error);
        return res.redirect('/retailerwhitelisting');
    }
}


const downloadSample = async (req, res) => {
    try {
        const columns = [
            "Region",
            "ASM Email id",
            "ASM Name",
            "ASM Code",
            "SO Email id",
            "SO Code",
            "SO Name",
            "City",
            "Distributor Code",
            "Distributor Name",
            "Retailer Name",
            "Retailer Code",
            "Retailer State",
            "Retailer City",
            "Salesman Name",
            "Salesman Code",
        ];

        res.setHeader('Content-Disposition', 'attachment; filename=retailerwhitelisting.csv');
        res.setHeader('Content-Type', 'text/csv');

        res.write(columns.join(',') + '\n');

        const data = [
            {
                "Region": '',
                "ASM Email id": '',
                "ASM Name": '',
                "ASM Code": '',
                "SO Email id": '',
                "SO Code": '',
                "SO Name": '',
                "City": '',
                "Distributor Code": '',
                "Distributor Name": '',
                "Retailer Name": '',
                "Retailer Code": '',
                "Retailer State": '',
                "Retailer City": '',
                "Salesman Name": '',
                "Salesman Code": '',
            },
        ];

        data.forEach((record) => {
            const row = columns.map((column) => record[column] || '').join(',');
            res.write(row + '\n');
        });

        res.end();
    } catch (error) {
        console.error('Error generating or serving the sample CSV:', error);
        res.redirect('/retailerwhitelisting');
    }
};

const UpdateStatus = async (req, res) => {
    try {
        const isChecked = req.body.isChecked;
        let data = {};
        if (isChecked === 'true') {
            data.isChecked = '1'
            data.retailercode = req.body.retailercode
        } else {
            data.isChecked = '0'
            data.retailercode = req.body.retailercode
        }
        await updateIsActiveStatus(data);
        return res.redirect("/retailerwhitelisting")
    }
    catch (error) {
        console.log('Error', error);
        return res.redirect("/retailerwhitelisting");
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
    exportWhitelist,
    insertIntoFileProcessretailerwhitelisting
}