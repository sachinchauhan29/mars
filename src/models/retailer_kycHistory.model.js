const dbCon = require('../config/db');


const selectKYCHistory = async (data) => {
  // let query = `select kyc_details_history.*, awsm_details.*, aw_details.*, ase_details.* from kyc_details_history INNER JOIN awsm_details on awsm_details.awsm_code=kyc_details_history.awsm_code INNER JOIN aw_details on kyc_details_history.aw_code = aw_details.aw_code INNER JOIN ase_details on kyc_details_history.ase_email = ase_details.ase_email_id where 1 = 1 AND kyc_type != 'FRESH'`;
  let query = `SELECT Retailerkyc_details.*, distributor_details.*,Retailerkyc_details.status as Retailerkycstatus, ase_details.*
  FROM Retailerkyc_details
  INNER JOIN distributor_details ON distributor_details.distributorcode = Retailerkyc_details.aw_code
  INNER JOIN ase_details ON Retailerkyc_details.ase_email = ase_details.ase_email_id
  WHERE 1 = 1 AND Retailerkyc_details.status != 'PENDING'  `;


  if (data.Mobile) {
    query += ` AND Retailerkyc_details.mobile_no = '${data.Mobile}'`;
  }
  if (data.salesman_id) {
    query += ` AND Retailerkyc_details.RetailerCode = '${data.salesman_id}'`;
  }
  // if (data.salesman_name) {
  //   query += ` AND awsm_details.awsm_name = '${data.salesman_name}'`;
  // }
  // if (data.salesman_type) {
  //   query += ` AND awsm_details.salesman_type = '${data.salesman_type}'`;
  // }
  if (data.aw_code) {
    query += ` AND Retailerkyc_details.aw_code = '${data.aw_code}'`;
  }
  if (data.aw_name) {
    query += ` AND distributor_details.name = '${data.aw_name}'`;
  }
  if (data.ase_code) {
    query += ` AND ase_details.ase_employee_code = '${data.ase_code}'`;
  }
  if (data.ase_name) {
    query += ` AND ase_details.ase_name = '${data.ase_name}'`;
  }
  if (data.fromDate && data.toDate) {
    query += ` AND Retailerkyc_details.created_on  >= ? AND Retailerkyc_details.created_on <= DATE_ADD(?, INTERVAL 1 DAY)`;
  }
  if (data.state) {
    query += ` AND distributor_details.state = '${data.state}'`;
  }
  if (data.city) {
    query += ` AND distributor_details.city = '${data.city}'`;
  }
  if (true) {
    query += ` ORDER BY Retailerkyc_details.created_on DESC`;
  }
  // if (data.limit || true) {
  //   query += ` LIMIT ${parseInt(5)}`;
  // }
  const queryParams = [];

  if (data.fromDate && data.toDate) {
    queryParams.push(data.fromDate, data.toDate);
  }
  return new Promise((resolve, reject) => {
    dbCon.query(query, queryParams, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
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


module.exports = { selectKYCHistory, getAWSMCity }