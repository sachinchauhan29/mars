
const { getfilterDistrubutorkyc } = require("../../models/distributor.model");
const axios = require('axios');

const distributorView = async (req, res) => {
    let allDetails = await getfilterDistrubutorkyc(req.query);

    res.render('distributor', { user: res.userDetail, kycData: allDetails, userResult11: allDetails, QueryData: req.query, notification: res.notification });
}

const exportKYCData = async (req, res) => {
    let allDetailss = await getfilterDistrubutorkyc(req.query);
  //  console.log('asdfge: exportKYCData', allDetailss);
    res.send(allDetailss);
}
// const filterApply = async(req,res)=>{
//     let allDetails = await distributormodel.getfilterDistrubutorkyc(req.body);
//     let awsmCity = await getAWSMCity();
//    console.log("................Hey I am from FilterApply.............", req.body);
//    res.render('distributor', { user: res.userDetail, kycData: allDetails, userResult11:allDetails,QueryData: allDetails, awsmCity, notification: res.notification});
// }

module.exports = {
    distributorView,
    exportKYCData
}