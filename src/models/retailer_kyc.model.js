const dbCon = require('../config/db');



const getretailerkyc = async (data) => {
  //   let query = `
  //   SELECT Retailerkyc_details.*, awsm_details.*, aw_details.*, ase_details.*
  //   FROM Retailerkyc_details
  //   INNER JOIN awsm_details ON awsm_details.awsm_code = Retailerkyc_details.RetailerCode
  //   INNER JOIN aw_details ON Retailerkyc_details.aw_code = aw_details.aw_code
  //   INNER JOIN ase_details ON Retailerkyc_details.ase_email = ase_details.ase_email_id
  //   WHERE Retailerkyc_details.status = 'PENDING' AND (kyc_type = 'FRESH' OR kyc_type = 'Replace-KYC-Request' OR kyc_type = 'RE-KYC-Request')
  // `;
  let query = `SELECT Retailerkyc_details.*, distributor_details.*, ase_details.*
  FROM Retailerkyc_details
  INNER JOIN distributor_details ON distributor_details.distributorcode = Retailerkyc_details.aw_code
  INNER JOIN ase_details ON Retailerkyc_details.ase_email = ase_details.ase_email_id
  WHERE Retailerkyc_details.kyc_type IN ('FRESH', 'Replace-KYC-Request', 'RE-KYC-Request')
  AND Retailerkyc_details.status = 'PENDING'`;

  if (data.Mobile) {
    query += ` AND Retailerkyc_details.mobile_no = '${data.Mobile}'`;
  }
  if (data.email) {
    query += ` AND Retailerkyc_details.email_id = '${data.email}'`;
  }
  if (data.RetailerCode) {
    query += ` AND Retailerkyc_details.RetailerCode = '${data.RetailerCode}'`;
  }
  if (data.awsm_name) {
    query += ` AND awsm_details.awsm_name = '${data.awsm_name}'`;
  }
  if (data.salesman_type) {
    query += ` AND kyc_details.SellerType = '${data.salesman_type}'`;
  }

  //new edit 29/02/2024
  if (data.distributorcode) {
    query += ` AND distributor_details.distributorcode = '${data.distributorcode}'`;
  }
  if (data.name) {
    query += ` AND distributor_details.name = '${data.name}'`;
  }


  if (data.ase_name) {
    query += ` AND ase_details.ase_name = '${data.ase_name}'`;
  }
  if (data.ase_code) {
    query += ` AND ase_details.ase_employee_code = '${data.ase_code}'`;
  }

  if (data.fromDate && data.toDate) {
    query += ` AND DATE(Retailerkyc_details.created_on) BETWEEN STR_TO_DATE('${data.fromDate}', '%Y-%m-%d') AND STR_TO_DATE('${data.toDate}', '%Y-%m-%d')`;
  }
  if (data.awsm_state) {
    query += ` AND awsm_details.awsm_state = '${data.awsm_state}'`;
  }
  if (data.awsm_city) {
    query += ` AND awsm_details.awsm_city = '${data.awsm_city}'`;
  }
  query += ` ORDER BY Retailerkyc_details.created_on DESC`;
  // Add the LIMIT clause at the end of the query
  query += ` LIMIT 5`;

  //  console.log(query);

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
const updateKycStatus = (data) => {
  let updateStatus = `UPDATE Retailerkyc_details SET calling_count = '${data.calling_count || 0}', calling_status = '${data.calling_status || null}', calling_remarks = '${data.calling_remarks || null}', status = '${data.kyc_status || 'PENDING'}', wip_remarks = '${data.kyc_rejection_reason || null}', approved_comment = '${data.approved_comment}', approved_comment1 = '${data.approved_comment}' where kyc_id = '${data.kyc_id}'`

  return new Promise((resolve, reject) => {
    dbCon.query(updateStatus, (error, result) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(result);
      }
    });
  });
}
const updateFreshKycStatus = (data) => {
  let updateStatus = `UPDATE Retailerkyc_details SET calling_count = '${data.calling_count || 0}', calling_status = '${data.calling_status || null}', calling_remarks = '${data.calling_remarks || null}', status = '${data.kyc_status || 'PENDING'}', wip_remarks = '${data.kyc_rejection_reason || null}', approved_on = '${data.todayDate}', approved_by = '${data.userName}', approved_comment = '${data.approved_comment}', approved_comment1 = '${data.approved_comment}',updated_date = '${data.todayDate}' where kyc_id = '${data.kyc_id}'`

  return new Promise((resolve, reject) => {
    dbCon.query(updateStatus, (error, result) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(result);
      }
    });
  });
}

const updateReplaceKycStatus = (data) => {
  let updateStatus = `UPDATE Retailerkyc_details SET calling_count = '${data.calling_count || 0}', calling_status = '${data.calling_status || null}', calling_remarks = '${data.calling_remarks || null}', status = '${data.kyc_status || 'PENDING'}', wip_remarks = '${data.kyc_rejection_reason || null}', replace_kyc_edit_on = '${data.todayDate}', replace_kyc_edit_by = '${data.userName}', kyc_type = '${'Replace-KYC'}', approved_comment= '${data.approved_comment}', approved_comment1 = '${data.approved_comment}', updated_date = '${data.todayDate}' where kyc_id = '${data.kyc_id}'`

  return new Promise((resolve, reject) => {
    dbCon.query(updateStatus, (error, result) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(result);
      }
    });
  });
}

const updateReKycStatus = (data) => {
  let updateStatus = `UPDATE Retailerkyc_details SET calling_count = '${data.calling_count || 0}', calling_status = '${data.calling_status || null}', calling_remarks = '${data.calling_remarks || null}', status = '${data.kyc_status || 'PENDING'}', wip_remarks = '${data.kyc_rejection_reason || null}', re_kyc_edit_on = '${data.todayDate}', re_kyc_edit_by = '${data.userName}', kyc_type = '${'RE-KYC'}', approved_comment = '${data.approved_comment}', approved_comment1 = '${data.approved_comment}', updated_date = '${data.todayDate}' where kyc_id = '${data.kyc_id}'`

  return new Promise((resolve, reject) => {
    dbCon.query(updateStatus, (error, result) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(result);
      }
    });
  });
}

const getAWSMCity = () => {
  let awsmCityQuery = 'SELECT awsm_city, COUNT(*) AS city_count FROM awsm_details GROUP BY awsm_city';

  return new Promise((resolve, reject) => {
    dbCon.query(awsmCityQuery, (error, result) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(result);
      }
    });
  });
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

const CurrentUser = async (email) => {

  let query = `SELECT * FROM awsm_users WHERE email = '${email}'`;

  return new Promise((resolve, reject) => {
    dbCon.query(query, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = { getretailerkyc, updateKycStatus, CurrentUser, updateReplaceKycStatus, updateReKycStatus, updateFreshKycStatus, getAWSMCity }
