const dbCon = require('../config/db');


const selectKYCStatus = async (data) => {
  let query = `SELECT MONTHNAME(kyc_details.created_on) AS month_name, kyc_details.*, awsm_details.*, kyc_details.update_timestamp as kyc_update_date  FROM kyc_details INNER JOIN awsm_details ON kyc_details.awsm_code = awsm_details.awsm_code  WHERE 1 = 1`;

  if (data.salesman_id) {
    query += ` AND kyc_details.awsm_code = '${data.salesman_id}'`;
  }
  if (data.salesman_type) {
    query += ` AND awsm_details.salesman_type = '${data.salesman_type}'`;
  }
  if (data.state) {
    query += ` AND awsm_details.awsm_state = '${data.state}'`;
  }
  if (data.month) {
    const monthNameToNumber = {
      January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
    };
    const desiredMonthNumber = monthNameToNumber[data.month];
    query += ` AND MONTH(kyc_details.created_on) = ${desiredMonthNumber}`;
  }
  if (data.year) {
    query += ` AND YEAR(kyc_details.created_on) = ${data.year}`;
  }

  query += ` ORDER BY DATE(kyc_details.created_on) DESC LIMIT ? OFFSET ?`;

  const page = parseInt(data.page) || 1;
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  return new Promise((resolve, reject) => {
    dbCon.query(query, [pageSize, offset], (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}


const getTotalCount = () => {
  let countQuery = `
    SELECT COUNT(*) as total FROM kyc_details INNER JOIN awsm_details ON kyc_details.awsm_code = awsm_details.awsm_code WHERE 1 = 1`;

  let pageSize = 10;

  return new Promise((resolve, reject) => {
    dbCon.query(countQuery, (err, result) => {
      if (err) {
        return reject(err);
      }

      const [totalCountRows] = result;
      const totalItems = totalCountRows.total;
      const totalPages = Math.ceil(totalItems / pageSize);

      return resolve(totalPages);
    });
  });
};

const exportKYCStatus = async (data) => {
  let query = `SELECT MONTHNAME(kyc_details.created_on) AS month_name, kyc_details.*, awsm_details.* FROM kyc_details
  INNER JOIN awsm_details ON kyc_details.awsm_code = awsm_details.awsm_code WHERE 1 = 1`;

  if (data.awsm_code) {
    query += ` AND kyc_details.awsm_code = '${data.awsm_code}'`;
  }
  if (data.salesman_type) {
    query += ` AND awsm_details.salesman_type = '${data.salesman_type}'`;
  }
  if (data.awsm_state) {
    query += ` AND awsm_details.awsm_state = '${data.awsm_state}'`;
  }
  if (data.Month) {
    const monthNameToNumber = {
      January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
    };
    const desiredMonthNumber = monthNameToNumber[data.Month];
    query += ` AND MONTH(kyc_details.created_on) = ${desiredMonthNumber}`;
  }
  if (data.Year) {
    query += ` AND YEAR(kyc_details.created_on) = ${data.Year}`;
  }
  query += ` ORDER BY kyc_details.created_on DESC`;

  return new Promise((resolve, reject) => {
    dbCon.query(query, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}

module.exports = { selectKYCStatus, exportKYCStatus, getTotalCount }