const dbCon = require('../config/db');



const getfilterDistrubutorkyc = async (data) => {

  let query = "SELECT * FROM distributor_details WHERE 1=1 ";
  if (data.MobileNo) {
    query += ` AND distributor_details.MobileNo = '${data.MobileNo}'`;
  }
  if (data.email) {
    query += ` AND distributor_details.email = '${data.email}'`;
  }
  if (data.toDate && data.fromDate) {
    query += `AND distributor_details.created_date BETWEEN '${data.fromDate}' and '${data.toDate}'`;
  }

  // console.log(query);

  return new Promise((resolve, reject) => {
    dbCon.query(query, (error, result) => {
      if (error) {
        return reject(error);
      } else {
        // console.log("here is the result broooo",result);
        return resolve(result);
      }
    })
  })

}

// const getAllDistrubutorkyc = async()=>{
//    let query = "select * from distributor_kyc";

//    return new Promise((resolve, reject) => {
//     dbCon.query(query, (error, result) => {
//       if (error) {
//         return reject(error);
//       } else {
//         return resolve(result);
//       }
//     })
//   })
// }



module.exports = { getfilterDistrubutorkyc }
