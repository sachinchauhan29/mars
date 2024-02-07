// const { getUsers } = require("../../models/report.model");
// const bcrypt = require("bcryptjs");


// const retailerView = async (req, res, next) => {

//     res.render('retailer', { user: res.userDetail, notification: res.notification, });
// }





// module.exports = { retailerView }

const { updateFreshKycStatus, updateReKycStatus, updateReplaceKycStatus, selectKycData, filterKycData, getAWSMCity, updateKycStatus, SaveThirdPartyData, CurrentUser } = require("../../models/kyc.model");
const { updateNotification } = require("../../models/notification.model");
const axios = require('axios');

const retailerView = async (req, res) => {
    let allDetails = await filterKycData(req.query);
    let awsmCity = await getAWSMCity();
    res.render('retailer', { user: res.userDetail, kycData: allDetails, QueryData: req.query, awsmCity, notification: res.notification });
}




const exportKYCData = async (req, res) => {
    let allDetails = await selectKycData(req.query);
    // const replacer = (key, value) => value === null ? '' : value;
    // const header = Object.keys(allDetails[0])
    // const csv = [
    //   header.join(','),
    //   ...allDetails.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    // ].join('\r\n');

    res.send(allDetails);
}


const updateKYCStatus = async (req, res) => {
    req.body.kyc_id = req.query.kyc_id;

    try {
        let currentUser = await CurrentUser(req.user.userId.userData.email);
        req.body.userName = currentUser[0].firstName;
    }
    catch (error) {
        console.log("error:-", error)
        res.redirect('/kyc');
    }

    if (req.body.kyc_status === 'SUCCESS') {
        try {
            if (req.body.kyc_type == 'RE-KYC-Request') {
                req.body.kyc_type = 'RE-KYC';
            }

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

            if (req.body.kyc_type === 'FRESH') {
                let currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1;
                const day = currentDate.getDate();

                const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                req.body.todayDate = formattedDate;
                await updateFreshKycStatus(req.body);


            } else if (req.body.kyc_type === 'Replace-KYC-Request') {
                let currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1;
                const day = currentDate.getDate();

                const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                req.body.todayDate = formattedDate;
                await updateReplaceKycStatus(req.body);
            } else if (req.body.kyc_type === 'RE-KYC') {
                let currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1;
                const day = currentDate.getDate();

                const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                req.body.todayDate = formattedDate;
                await updateReKycStatus(req.body);
            }
            await SaveThirdPartyData(data);
        } catch (error) {
            console.log('API Error:', error);
            return res.redirect('/kyc');
        }
    } else {
        if (req.body.kyc_type === 'FRESH') {
            let currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            const day = currentDate.getDate();

            const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            req.body.todayDate = formattedDate;
            await updateFreshKycStatus(req.body);


        } else if (req.body.kyc_type === 'Replace-KYC-Request') {
            let currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            const day = currentDate.getDate();

            const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            req.body.todayDate = formattedDate;
            await updateReplaceKycStatus(req.body);
        } else if (req.body.kyc_type === 'RE-KYC-Request') {
            let currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            const day = currentDate.getDate();

            const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            req.body.todayDate = formattedDate;
            await updateReKycStatus(req.body);
        }
        res.redirect('/kyc');
    }
};


const kycNotify = async (req, res) => {
    try {
        await updateNotification(req.query);
        return res.redirect('/kyc');

    }
    catch (error) {
        console.error('API Error:', error);
        return res.redirect('/kyc');
    }
}


module.exports = {
    retailerView,
    exportKYCData,
    updateKYCStatus,
    kycNotify,

}