const dbCon = require('../config/db');


const selectASE = async (ase_email) => {
  let query = `SELECT * FROM ase_details WHERE ase_email_id = '${ase_email}'`;
  return new Promise((resolve, reject) => {
    dbCon.query(query, (error, employees) => {
      if (error) {
        return reject(error);
      }
      return resolve(employees);
    });
  });
}

module.exports = { selectASE }