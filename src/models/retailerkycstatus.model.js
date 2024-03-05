const dbCon = require('../config/db');


const selectKYCStatus = async (data) => {
    let query = `SELECT MONTHNAME(Retailerkyc_details.created_on) AS month_name, Retailerkyc_details.*, distributor_details.*, Retailerkyc_details.status as Retailerkycstatus, Retailerkyc_details.update_timestamp as kyc_update_date  FROM Retailerkyc_details INNER JOIN distributor_details ON Retailerkyc_details.aw_code = distributor_details.distributorcode  WHERE 1 = 1`;
    if (data.salesman_id) {
        query += ` AND Retailerkyc_details.RetailerCode = '${data.salesman_id}'`;
    }
    if (data.salesman_type) {
        query += ` AND distributor_details.salesman_type = '${data.salesman_type}'`;
    }
    if (data.state) {
        query += ` AND Retailerkyc_details.awsm_state = '${data.state}'`;
    }
    if (data.month) {
        const monthNameToNumber = {
            January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
        };
        const desiredMonthNumber = monthNameToNumber[data.month];
        query += ` AND MONTH(Retailerkyc_details.created_on) = ${desiredMonthNumber}`;
    }
    if (data.year) {
        query += ` AND YEAR(Retailerkyc_details.created_on) = ${data.year}`;
    }

    query += ` ORDER BY DATE(Retailerkyc_details.created_on) DESC LIMIT ? OFFSET ?`;

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
    SELECT COUNT(*) as total FROM Retailerkyc_details INNER JOIN distributor_details ON Retailerkyc_details.aw_code = distributor_details.distributorcode WHERE 1 = 1`;

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
    let query = `SELECT MONTHNAME(Retailerkyc_details.created_on) AS month_name, Retailerkyc_details.*, distributor_details.* FROM Retailerkyc_details
  INNER JOIN distributor_details ON Retailerkyc_details.RetailerCode = distributor_details.awsm_code WHERE 1 = 1`;

    if (data.awsm_code) {
        query += ` AND Retailerkyc_details.RetailerCode = '${data.awsm_code}'`;
    }
    if (data.salesman_type) {
        query += ` AND distributor_details.salesman_type = '${data.salesman_type}'`;
    }
    if (data.awsm_state) {
        query += ` AND distributor_details.awsm_state = '${data.awsm_state}'`;
    }
    if (data.Month) {
        const monthNameToNumber = {
            January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
        };
        const desiredMonthNumber = monthNameToNumber[data.Month];
        query += ` AND MONTH(Retailerkyc_details.created_on) = ${desiredMonthNumber}`;
    }
    if (data.Year) {
        query += ` AND YEAR(Retailerkyc_details.created_on) = ${data.Year}`;
    }
    query += ` ORDER BY Retailerkyc_details.created_on DESC`;

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