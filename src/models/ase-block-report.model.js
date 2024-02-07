const dbCon = require('../config/db');


const selectBlockASEReport = async (data) => {
  // let queryOption = {
  //   sql: `select awsm_details.*, aw_details.*, ase_details.* from awsm_details INNER JOIN aw_details on aw_details.aw_code = awsm_details.aw_code INNER JOIN ase_details on aw_details.ase_email_id = ase_details.ase_email_id limit 3`,
  //   nestTables: false
  // }

  let query = 'select * from block_ase_user_report where 1 = 1';

  if (data.ase_code) {
    query += ` AND block_ase_user_report.ase_code = '${data.ase_code}'`;
  }
  if (data.ase_email_id) {
    query += ` AND block_ase_user_report.ase_email_id = '${data.ase_email_id}'`;
  }
  if (data.aw_code) {
    query += ` AND block_ase_user_report.aw_code = '${data.aw_code}'`;
  }
  if (data.awsm_code) {
    query += ` AND block_ase_user_report.awsm_code = '${data.awsm_code}'`;
  }
  if (data.awsm_name) {
    query += ` AND block_ase_user_report.awsm_name = '${data.awsm_name}'`;
  }
  if (data.state) {
    query += ` AND block_ase_user_report.awsm_state = '${data.state}'`;
  }
  if (data.city) {
    query += ` AND block_ase_user_report.awsm_city = '${data.city}'`;
  }
  if (data.limit || true) {
    query += ` LIMIT ${parseInt(10)}`;
  }
  
  return new Promise((resolve, reject) => {
    dbCon.query(query, (error, result) => {
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

module.exports = { selectBlockASEReport, getAWSMCity}