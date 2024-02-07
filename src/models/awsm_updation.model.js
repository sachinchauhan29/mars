const dbCon = require('../config/db');


const selectAWSMUpdationLatest = async (data) => {
  let query = `
    SELECT kyc_details.*, awsm_details.*, aw_details.*, ase_details.*
    FROM kyc_details
    INNER JOIN awsm_details ON awsm_details.awsm_code = kyc_details.awsm_code
    INNER JOIN aw_details ON aw_details.aw_code = kyc_details.aw_code
    INNER JOIN ase_details ON ase_details.ase_email_id = kyc_details.ase_email
    WHERE kyc_details.kyc_type = 'Replace-KYC' OR kyc_details.kyc_type = 'Replace-KYC-Request'`;

  if (data.awsm_code) {
    query += ` AND kyc_details.awsm_code = '${data.awsm_code}'`;
  }
  if (data.fromDate && data.toDate) {
    query += ` AND kyc_details.created_on >= ? AND kyc_details.created_on <= DATE_ADD(?, INTERVAL 1 DAY)`;
  }

  query += ` ORDER BY kyc_details.created_on DESC`;

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
      }
      return resolve(result);
    });
  });
};


const selectAWSMUpdationOld = async () => {
  let query = {
    sql: `select kyc_details_history.*, awsm_details.*, aw_details.*, ase_details.* from kyc_details_history INNER JOIN aw_details on aw_details.aw_code = kyc_details_history.aw_code INNER JOIN ase_details on ase_details.ase_email_id = kyc_details_history.ase_email INNER JOIN awsm_details on awsm_details.awsm_code = kyc_details_history.awsm_code limit 3`,
    nestTables: false
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


const insertKycDetails = async (data) => {
  const query = `INSERT INTO kyc_details (kyc_id, ase_email, aw_code, awsm_code, bank_account_no, address, bank_cheque, bank_name, beneficiary_name, ifsc_code, mobile_no, photo_id, photo, status, kyc_type, gender, dob, created_by)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    data.kyc_id,
    data.ase_email, data.aw_code, data.awsm_code, data.bank_account_no, data.address,
    data.bank_cheque,
    data.bank_name, data.beneficiary_name, data.ifsc_code, data.mobile_no,
    data.photo_id, data.photo, data.status, data.kyc_type, data.gender, data.dob, data.beneficiary_name
  ];

  return new Promise((resolve, reject) => {
    dbCon.query(query, values, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}

const removeRestoreUser = async (data) => {
  let query = `DELETE FROM kyc_details_history WHERE kyc_id = ?`;
  let values = [data.kyc_id];

  return new Promise((resolve, reject) => {
    dbCon.query(query, values, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
};


const getKycAuthenticationHistoryDetails = async (data) => {
  let query = `SELECT * FROM kyc_authentication_details_history WHERE kyc_id = '${data.kyc_id}'`;
  return new Promise((resolve, reject) => {
    dbCon.query(query, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}


const createKycAuthenticationDetails = async (data) => {
  let query = 'INSERT INTO kyc_authentication_details (ase_email, awsm_code, gender, dob, address, bank_account_no, bank_name, beneficiary_name, ifsc_code, mobile_no, status) VALUES (?,?,?,?,?,?,?,?,?,?,?)';

  let values = [data.kyc_id, data.awsm_code, null, null, data.address, data.bank_account_no, data.bank_name, data.beneficiary_name, data.ifsc_code, data.mobile_no, 'SUCCESS'];

  return new Promise((resolve, reject) => {
    dbCon.query(query, values, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}


const UpdateKycAuthentication = async (data) => {
  let query = `UPDATE kyc_authentication_details 
               SET gender = ?, dob = ?, address = ?, bank_account_no = ? , bank_name = ?, 
               beneficiary_name = ? , ifsc_code = ? , mobile_no = ? , status = ?  
               WHERE awsm_code = ?`;

  let values = [data.ase_email, data.gender, data.dob, data.address, data.bank_account_no,
  data.bank_name, data.beneficiary_name, data.ifsc_code, data.mobile_no,
  data.status, data.awsm_code];

  return new Promise((resolve, reject) => {
    dbCon.query(query, values, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}


const updateAWSMDetails = async (data) => {
  let query = `UPDATE awsm_details SET awsm_name = ?, aw_code = ? WHERE awsm_code = ? `;
  let values = [data.awsm_code, data.aw_code, data.awsm_code];

  return new Promise((resolve, reject) => {
    dbCon.query(query, values, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}


const getKYCHistory = async (data) => {
  let query = 'SELECT * FROM kyc_details_history WHERE history_id = ?';
  const values = [data.history_id];

  return new Promise((resolve, reject) => {
    dbCon.query(query, values, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}


const UpdateKycDetails = async (data) => {
  console.log(data.kyc_id);
  let query = `UPDATE kyc_details SET ase_email = ?, aw_code = ?, awsm_code = ?, bank_account_no = ?, address = ?, bank_cheque = ?, bank_name = ?, beneficiary_name = ?, ifsc_code = ?, mobile_no = ?, photo_id = ?, photo = ?, status = ?, bio_status = ?, calling_count = ?, calling_remarks = ?, calling_status = ?, kyc_type = ?, wip_remarks = ? WHERE kyc_id = ?`;

  let values = [data.ase_email, data.aw_code, data.awsm_code, data.bank_account_no, data.address, data.bank_cheque, data.bank_name, data.beneficiary_name, data.ifsc_code, data.mobile_no, data.photo_id, data.photo, data.status, data.bio_status, data.calling_count, data.calling_remarks, data.calling_status, data.kyc_type, data.wip_remarks, data.kyc_id];

  return new Promise((resolve, reject) => {
    dbCon.query(query, values, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}


const selectKycDetails = async (data) => {
  let query = 'SELECT * FROM kyc_details WHERE kyc_id = ?';
  const values = [data.kyc_id];

  return new Promise((resolve, reject) => {
    dbCon.query(query, values, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}

const exportAWSMLatestUpdate = async (data) => {
  let query = `SELECT kyc_details.*, awsm_details.*, aw_details.*, ase_details.*
  FROM kyc_details
  INNER JOIN awsm_details ON awsm_details.awsm_code = kyc_details.awsm_code
  INNER JOIN aw_details ON aw_details.aw_code = kyc_details.aw_code
  INNER JOIN ase_details ON ase_details.ase_email_id = kyc_details.ase_email 
  WHERE kyc_details.kyc_type = 'Replace-KYC' OR kyc_details.kyc_type = 'Replace-KYC-Request'`;

  let queryParams = [];

  if (data.awsm_code) {
    query += ` AND kyc_details.awsm_code = '${data.awsm_code}'`;
  }
  if (data.fromDate && data.toDate) {
    query += ` AND kyc_details.created_on  >= ? AND kyc_details.created_on <= DATE_ADD(?, INTERVAL 1 DAY)`;
    queryParams.push(data.fromDate, data.toDate);
  }
  query += ` ORDER BY kyc_details.created_on DESC`;

  return new Promise((resolve, reject) => {
    dbCon.query(query, queryParams, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}


const exportAWSMOldUpdate = async () => {
  let query = {
    sql: `select kyc_details_history.*, awsm_details.*, aw_details.*, ase_details.* from kyc_details_history INNER JOIN aw_details on aw_details.aw_code = kyc_details_history.aw_code INNER JOIN ase_details on ase_details.ase_email_id = kyc_details_history.ase_email INNER JOIN awsm_details on awsm_details.awsm_code = kyc_details_history.awsm_code`,
    nestTables: false
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


// const geKycBioDetailsHistory = async (data) => {
//   let query = `select * from kyc_bio_details_history where kyc_id='${data.kyc_id}'`;
//   return new Promise((resolve, reject) => {
//     dbCon.query(query, (error, result) => {
//       if (error) {
//         return reject(error);
//       }
//       return resolve(result);
//     });
//   });
// }

// const updateKycBioDetails = async (data) => {
//   // let query = `UPDATE kyc_bio_details SET  kyc_bio_id = ?, kyc_id = ?, bio_details = ?, bio_index WHERE awsm_code = ?`;

//   let values = [];

//   return new Promise((resolve, reject) => {
//     dbCon.query(query, values, (error, result) => {
//       if (error) {
//         return reject(error);
//       }
//       return resolve(result);
//     });
//   });
// }


module.exports = { exportAWSMOldUpdate, exportAWSMLatestUpdate, selectAWSMUpdationLatest, selectAWSMUpdationOld, insertKycDetails, removeRestoreUser, UpdateKycAuthentication, getKycAuthenticationHistoryDetails, createKycAuthenticationDetails, updateAWSMDetails, getKYCHistory, UpdateKycDetails, selectKycDetails }