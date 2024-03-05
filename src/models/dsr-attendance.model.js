const dbCon = require('../config/db');

const getattendance = async (data) => {
  let query = `select * from dsr_attendance WHERE 1=1 `;
  if (data.dsr_id) {
    query += ` AND dsr_attendance.dsr_id = '${data.dsr_id}'`;
  }
  if (data.dsr_name) {
    query += ` AND dsr_attendance.dsr_name = '${data.dsr_name}'`;
  }
  if (data.toDate && data.fromDate) {
    query += `AND dsr_attendance.created_date BETWEEN '${data.fromDate}' and '${data.toDate}'`;
  }
  // console.log(query, "..............", data);
  return new Promise((resolve, reject) => {
    dbCon.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}



module.exports = { getattendance }