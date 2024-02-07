const dbCon = require('../config/db');

// const selectKYCReportBase = async () => {

//   const selectQuery = `
//   SELECT
//     created_on,
//     COUNT(*) AS total_count,
//     SUM(CASE WHEN payment_status = 'success' THEN 1 ELSE 0 END) AS success_count,
//     SUM(CASE WHEN payment_status = 'reject' THEN 1 ELSE 0 END) AS reject_count
//   FROM
//     kyc_report_base
//   GROUP BY
//     created_on
//   ORDER BY
//     created_on DESC
//   LIMIT 10
// `;



//   return new Promise((resolve, reject) => {
//     dbCon.query(selectQuery, (error, result) => {
//       if (error) {
//         return reject(error);
//       }
//       return resolve(result);
//     });
//   })
// }

const getUploadRecords = async () => {
  let query = `SELECT * FROM file_process ORDER BY insert_datetime DESC LIMIT 10`;

  return new Promise((resolve, reject) => {
    dbCon.query(query, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}

module.exports = { getUploadRecords }