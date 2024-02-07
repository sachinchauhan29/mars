const { selectEditKycData, updateEditKycStatus, filterEditKycData, getAWSMCity, updateKycStatus, CurrentUser, SaveThirdPartyData } = require("../../models/edit-kyc-data.model");
const { updateNotification } = require("../../models/notification.model");
const axios = require('axios');

const retailereditkyc = async (req, res, next) => {
    let allDetails = await filterEditKycData(req.query);
    let awsmCity = await getAWSMCity()
    res.render('retailer-edit-kyc', { user: res.userDetail, kycData: allDetails, QueryData: req.query, awsmCity, notification: res.notification });
}


const exportEditKYCData = async (req, res) => {
    let allDetails = await selectEditKycData(req.query);
    res.send(allDetails)
}

const updateKYCEditDataStatus = async (req, res) => {
    req.body.kyc_id = req.query.kyc_id

    try {
        let currentUser = await CurrentUser(req.user.userId.userData.email);
        req.body.userName = currentUser[0].firstName;
    }
    catch (error) {
        console.log("error:-", error);
        res.redirect('/edit-kyc-data');
    }

    if (req.body.kyc_status === 'SUCCESS') {
        try {
            const apiUrl = 'https://arteriacp.apimanagement.ap1.hana.ondemand.com/crazibrain/ss/v1/spkyc/AGGRBRIT'
            const postData = {
                name: req.body.awsm_name,
                address1: req.body.address,
                spImage: req.body.photo,
                accountNo: req.body.bank_account_no,
                ifscCode: req.body.ifsc_code,
                bankChequeImage: req.body.bank_cheque,
                bankName: req.body.bank_name,
                spIdPhoto: req.body.photo_id,
                mobileNo: req.body.mobile_no,
                kycType: req.body.kyc_type,
                kycStatus: req.body.kyc_status,
                spNo: req.body.awsm_code,
                beneName: req.body.beneficiary_name
            }

            const username = 'P006026';
            const password = 'Arteria@2020';
            const basicAuth = 'Basic ' + btoa(username + ':' + password);
            const headers = {
                'Authorization': basicAuth,
                'Custom-Header': 'header-value',
                'apikey': 'W4jgqCFydIb7AcOrRhEiD0krcuGuobsz'
            };


            const response = await axios.post(apiUrl, postData, { headers });
            let data = {
                request: postData,
                url: apiUrl,
                response: response.data,
                status: 200,
                flag: 1,
                count: 0
            }

            let currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            const day = currentDate.getDate();

            const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            req.body.todayDate = formattedDate;
            await updateEditKycStatus(req.body);

            await SaveThirdPartyData(data);
        } catch (error) {
            console.log('API Error:', error);
            return res.redirect('/edit-kyc-data');
        }
    } else {
        let currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();

        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        req.body.todayDate = formattedDate;
        await updateEditKycStatus(req.body);
        res.redirect('/edit-kyc-data');
    }
}


const editKycNotify = async (req, res) => {
    try {
        await updateNotification(req.query);
        return res.redirect('/edit-kyc-data');

    }
    catch (error) {
        console.error('API Error:', error);
        return res.redirect('/edit-kyc-data');
    }
}

module.exports = {
    retailereditkyc,
    exportEditKYCData,
    updateKYCEditDataStatus,
    editKycNotify
}