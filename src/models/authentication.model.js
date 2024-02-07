const dbCon = require('../config/db');


const selectAuthentication = async (data) => {

  let query = `select DATE_FORMAT(kyc_authentication_details.created_on, '%Y-%m-%d %H:%i:%s') as formatted_created_on,
    kyc_authentication_details.ase_email, ase_details.ase_employee_code, ase_details.ase_name, aw_details.aw_code, aw_details.aw_name, kyc_authentication_details.awsm_code, awsm_details.awsm_name, awsm_details.salesman_type, kyc_authentication_details.beneficiary_name, awsm_details.awsm_state, awsm_details.awsm_city, kyc_authentication_details.address, kyc_authentication_details.bank_account_no, kyc_authentication_details.bank_name, kyc_authentication_details.ifsc_code, kyc_authentication_details.mobile_no, kyc_authentication_details.gender, kyc_authentication_details.dob, awsm_details.channel, kyc_authentication_details.biometric_flag, kyc_authentication_details.auth_methed
    from kyc_authentication_details INNER JOIN awsm_details on awsm_details.awsm_code = kyc_authentication_details.awsm_code INNER JOIN aw_details on aw_details.aw_code = awsm_details.aw_code  INNER JOIN ase_details on ase_details.ase_email_id = aw_details.ase_email_id WHERE kyc_authentication_details.status = 'SUCCESS'`;

  if (data.mobile_no) {
    query += ` AND kyc_authentication_details.mobile_no = '${data.mobile_no}'`;
  }
  if (data.awsm_code) {
    query += ` AND kyc_authentication_details.awsm_code = '${data.awsm_code}'`;
  }
  if (data.awsm_name) {
    query += ` AND awsm_details.awsm_name = '${data.awsm_name}'`;
  }
  if (data.salesman_type) {
    query += ` AND awsm_details.salesman_type = '${data.salesman_type}'`;
  }
  if (data.aw_code) {
    query += ` AND aw_details.aw_code = '${data.aw_code}'`;
  }
  if (data.aw_name) {
    query += ` AND aw_details.aw_name = '${data.aw_name}'`;
  }
  if (data.ase_code) {
    query += ` AND ase_details.ase_employee_code = '${data.ase_code}'`;
  }
  if (data.ase_name) {
    query += ` AND ase_details.ase_name = '${data.ase_name}'`;
  }
  if (data.fromDate && data.toDate) {
    query += ` AND DATE(kyc_authentication_details.created_on) BETWEEN STR_TO_DATE('${data.fromDate}', '%Y-%m-%d') AND STR_TO_DATE('${data.toDate}', '%Y-%m-%d')`;
  }
  if (data.awsm_state) {
    query += ` AND awsm_details.awsm_state = '${data.awsm_state}'`;
  }
  if (data.awsm_city) {
    query += ` AND awsm_details.awsm_city = '${data.awsm_city}'`;
  }
  query += ` ORDER BY kyc_authentication_details.created_on DESC`;

  const limit = parseInt(1000000000);
  if (!isNaN(limit) && limit > 0) {
    query += ` LIMIT ${limit}`;
  }


  return new Promise((resolve, reject) => {
    dbCon.query(query, (error, employees) => {
      if (error) {
        return reject(error);
      }
      return resolve(employees);
    });
  });
}

const filterDataAuthentication = async (data) => {
  let query = `
  SELECT kyc_authentication_details.*, awsm_details.*, aw_details.*, ase_details.*
  FROM kyc_authentication_details
  INNER JOIN awsm_details ON awsm_details.awsm_code = kyc_authentication_details.awsm_code
  INNER JOIN aw_details ON aw_details.aw_code = awsm_details.aw_code
  INNER JOIN ase_details ON ase_details.ase_email_id = aw_details.ase_email_id
  WHERE kyc_authentication_details.status = 'SUCCESS'`;

  var queryParams = [];

  if (data.Mobile) {
    query += ` AND kyc_authentication_details.mobile_no = ?`;
    queryParams.push(data.Mobile);
  }
  if (data.salesman_id) {
    query += ` AND kyc_authentication_details.awsm_code = '${data.salesman_id}'`;
  }
  if (data.salesman_name) {
    query += ` AND awsm_details.awsm_name = '${data.salesman_name}'`;
  }
  if (data.salesman_type) {
    query += ` AND awsm_details.salesman_type = '${data.salesman_type}'`;
  }
  if (data.aw_code) {
    query += ` AND aw_details.aw_code = '${data.aw_code}'`;
  }
  if (data.aw_name) {
    query += ` AND aw_details.aw_name = '${data.aw_name}'`;
  }
  if (data.ase_code) {
    query += ` AND ase_details.ase_employee_code = '${data.ase_code}'`;
  }
  if (data.ase_name) {
    query += ` AND ase_details.ase_name = '${data.ase_name}'`;
  }
  if (data.fromDate && data.toDate) {
    query += ` AND kyc_authentication_details.created_on >= ? AND kyc_authentication_details.created_on <= DATE_ADD(?, INTERVAL 1 DAY)`;
    queryParams.push(data.fromDate, data.toDate);
  }
  if (data.state) {
    query += ` AND awsm_details.awsm_state = ?`;
    queryParams.push(data.state);
  }
  if (data.city) {
    query += ` AND awsm_details.awsm_city = ?`;
    queryParams.push(data.city);
  }

  query += ` ORDER BY DATE(kyc_authentication_details.created_on) DESC LIMIT ? OFFSET ?`;
  const page = parseInt(data.page) || 1;
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  queryParams.push(pageSize, offset);

  return new Promise((resolve, reject) => {
    dbCon.query(query, queryParams, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}


const totalEntries = async () => {
  let query = `SELECT COUNT(*) as totalEntries
  FROM kyc_authentication_details
  INNER JOIN awsm_details ON awsm_details.awsm_code = kyc_authentication_details.awsm_code
  INNER JOIN aw_details ON aw_details.aw_code = awsm_details.aw_code
  INNER JOIN ase_details ON ase_details.ase_email_id = aw_details.ase_email_id
  WHERE 1 = 1`;

  return new Promise((resolve, reject) => {
    dbCon.query(query, (error, result) => {
      if (error) {
        return reject(error);
      }
      const totalEntries = result[0].totalEntries;
      return resolve(totalEntries);
    });
  });
};



const getTotalCount = () => {
  let countQuery = `
  SELECT COUNT(*) as total
  FROM kyc_authentication_details
  INNER JOIN awsm_details ON awsm_details.awsm_code = kyc_authentication_details.awsm_code
  INNER JOIN aw_details ON aw_details.aw_code = awsm_details.aw_code
  INNER JOIN ase_details ON ase_details.ase_email_id = aw_details.ase_email_id
  WHERE 1 = 1`;

  return new Promise((resolve, reject) => {
    dbCon.query(countQuery, (err, result) => {
      if (err) {
        return reject(err);
      }

      const [totalCountRow] = result;
      const totalItems = totalCountRow.total;
      const pageSize = 10;
      const totalPages = Math.ceil(totalItems / pageSize);

      return resolve(totalPages);
    });
  });
};


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

module.exports = { totalEntries, selectAuthentication, filterDataAuthentication, getAWSMCity, getTotalCount }