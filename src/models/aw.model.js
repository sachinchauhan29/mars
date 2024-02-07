const dbCon = require('../config/db');


const selectAW = async (aw_code) => {
  let query = `SELECT * FROM aw_details WHERE aw_code = '${aw_code}'`;
  return new Promise((resolve, reject) => {
    dbCon.query(query, (error, employees) => {
      if (error) {
        return reject(error);
      }
      return resolve(employees);
    });
  });
}

module.exports = { selectAW }