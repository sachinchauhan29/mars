const dbCon = require('../config/db');

const exportMasterData = async (data) => {
  let query = `
  SELECT kyc.mobile_no, awsm.awsm_code, kyc.kyc_type, kyc_report.awsm_name, awsm.salesman_type, kyc_report.aw_code, kyc.beneficiary_name, kyc.address, kyc.bank_account_no,kyc.bank_name, kyc.ifsc_code, kyc.calling_remarks, kyc.calling_count, kyc.status, kyc.calling_status, kyc_report.payment_status, kyc_report.payout_amount, kyc_report.payout_month, kyc.approved_on, kyc.update_timestamp, awsm.channel, kyc.gender, kyc.dob, kyc_report.aw_name, ase.ase_employee_code, ase.ase_email_id, kyc_report.ase_name, kyc.created_on, awsm.awsm_state, awsm.awsm_city
  FROM kyc_details AS kyc
  INNER JOIN awsm_details AS awsm ON awsm.awsm_code = kyc.awsm_code
  INNER JOIN distributor_details AS aw ON aw.distributorcode = kyc.aw_code
  INNER JOIN ase_details AS ase ON ase.ase_email_id = kyc.ase_email
  INNER JOIN kyc_report_base AS kyc_report ON kyc_report.ase_email = kyc.ase_email
  WHERE 1 = 1`;

  if (data.mobile_no) {
    query += ` AND kyc.mobile_no = '${data.mobile_no}'`;
  }
  if (data.awsm_code) {
    query += ` AND awsm.awsm_code = '${data.awsm_code}'`;
  }
  if (data.awsm_name) {
    query += ` AND kyc_report.awsm_name = '${data.awsm_name}'`;
  }
  if (data.salesman_type) {
    query += ` AND awsm.salesman_type = '${data.salesman_type}'`;
  }
  if (data.aw_code) {
    query += ` AND kyc_report.aw_code = '${data.aw_code}'`;
  }
  if (data.aw_name) {
    query += ` AND kyc_report.aw_name = '${data.aw_name}'`;
  }
  if (data.ase_code) {
    query += ` AND ase.ase_employee_code = '${data.ase_code}'`;
  }
  if (data.ase_name) {
    query += ` AND kyc_report.ase_name = '${data.ase_name}'`;
  }
  if (data.fromDate && data.toDate) {
    query += ` AND kyc.created_on >= '${data.fromDate}' AND kyc.created_on <= DATE_ADD('${data.toDate}', INTERVAL 1 DAY)`;
  }
  if (data.awsm_state) {
    query += ` AND awsm.awsm_state = '${data.awsm_state}'`;
  }
  if (data.awsm_city) {
    query += ` AND awsm.awsm_city = '${data.awsm_city}'`;
  }

  query += ` ORDER BY kyc.created_on DESC`;


  return new Promise((resolve, reject) => {
    dbCon.query(query, (error, result) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(result);
      }
    })
  });
};


const selectMasterData = async (data) => {


  //   let query = `
  //   SELECT 
  //   kyc_details.*, 
  //   awsm_details.*, 
  //   distributor_details.*, 
  //   ase_details.*, 
  //   kyc_report_base.*
  // FROM 
  //   kyc_details
  // INNER JOIN 
  //   awsm_details 
  // ON 
  //   awsm_details.awsm_code = kyc_details.awsm_code
  // INNER JOIN 
  //   distributor_details 
  // ON 
  //   kyc_details.aw_code = distributor_details.aw_code
  // INNER JOIN 
  //   ase_details 
  // ON 
  //   kyc_details.ase_email = ase_details.ase_email_id
  // INNER JOIN 
  //   kyc_report_base 
  // ON 
  //   kyc_report_base.ase_email = kyc_details.ase_email
  // WHERE 
  //   1 = 1`;
  //   let query = `SELECT kyc_details.*, awsm_details.*, distributor_details.*, ase_details.*
  // FROM kyc_details AS kyc
  // INNER JOIN awsm_details ON awsm_details.awsm_code = kyc_details.awsm_code
  // NNER JOIN distributor_details ON kyc_details.aw_code = distributor_details.distributorcode
  // INNER JOIN ase_details ON kyc_details.ase_email = ase_details.ase_email_id
  // WHERE 1=1`;
  let query = `
    SELECT 
    kyc.mobile_no, 
    awsm.awsm_code, 
    kyc.kyc_type, 
    kyc_report.awsm_name, 
    awsm.salesman_type, 
    kyc_report.aw_code, 
    kyc.beneficiary_name, 
    kyc.address, 
    kyc.bank_account_no,
    kyc.bank_name, 
    kyc.ifsc_code, 
    kyc.calling_remarks, 
    kyc.calling_count, 
    kyc.status, 
    kyc.calling_status, 
    kyc_report.payment_status, 
    kyc_report.payout_amount, 
    kyc_report.payout_month, 
    kyc.approved_on, 
    kyc.update_timestamp, 
    awsm.channel, 
    kyc.gender, 
    kyc.dob, 
    kyc_report.aw_name, 
    ase.ase_employee_code, 
    ase.ase_email_id, 
    kyc_report.ase_name, 
    kyc.created_on, 
    awsm.awsm_state, 
    awsm.awsm_city
  FROM 
    kyc_details AS kyc
  INNER JOIN 
    awsm_details AS awsm ON awsm.awsm_code = kyc.awsm_code
  INNER JOIN 
    distributor_details AS aw ON aw.distributorcode = kyc.aw_code
  INNER JOIN 
    ase_details AS ase ON ase.ase_email_id = kyc.ase_email
  INNER JOIN 
    kyc_report_base AS kyc_report ON kyc_report.ase_email = kyc.ase_email
  WHERE 
    1 = 1 `;

  if (data.Mobile) {
    query += ` AND kyc.mobile_no = '${data.Mobile}'`;
  }
  if (data.salesman_id) {
    query += ` AND awsm.awsm_code = '${data.salesman_id}'`;
  }
  if (data.salesman_name) {
    query += ` AND kyc_report.awsm_name = '${data.salesman_name}'`;
  }
  if (data.salesman_type) {
    query += ` AND awsm.salesman_type = '${data.salesman_type}'`;
  }
  if (data.aw_code) {
    query += ` AND kyc_report.aw_code = '${data.aw_code}'`;
  }
  if (data.aw_name) {
    query += ` AND kyc_report.aw_name = '${data.aw_name}'`;
  }
  if (data.ase_code) {
    query += ` AND ase.ase_employee_code = '${data.ase_code}'`;
  }
  if (data.ase_name) {
    query += ` AND kyc_report.ase_name = '${data.ase_name}'`;
  }
  if (data.fromDate && data.toDate) {
    query += ` AND kyc.created_on  >= ? AND kyc.created_on <= DATE_ADD(?, INTERVAL 1 DAY)`;
  }
  if (data.state) {
    query += ` AND awsm.awsm_state = '${data.state}'`;
  }
  if (data.city) {
    query += ` AND awsm.awsm_city = '${data.city}'`;
  }
  if (true) {
    query += ` ORDER BY kyc.created_on DESC`;
  }
  if (data.limit || true) {
    query += ` LIMIT ${parseInt(5)}`;
  }

  const queryParams = [];

  if (data.fromDate && data.toDate) {
    queryParams.push(data.fromDate, data.toDate);
  }
  return new Promise((resolve, reject) => {
    dbCon.query(query, queryParams, (error, result) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(result);
      }
    })
  })
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


module.exports = { selectMasterData, getAWSMCity, exportMasterData }
