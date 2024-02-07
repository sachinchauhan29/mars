const dbCon = require('../config/db');


const selectAWSM = async (awsm_code) => {
  let query = `SELECT * FROM awsm_details WHERE awsm_code = '${awsm_code}'`;
  return new Promise((resolve, reject) => {
    dbCon.query(query, (error, employees) => {
      if (error) {
        return reject(error);
      }
      return resolve(employees);
    });
  });
}

module.exports = { selectAWSM }