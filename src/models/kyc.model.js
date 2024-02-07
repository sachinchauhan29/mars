const dbCon = require('../config/db');


const selectKycData = async (data) => {
  let query = `
      SELECT kyc_details.*, awsm_details.*, aw_details.*, ase_details.*
      FROM kyc_details
      INNER JOIN awsm_details ON awsm_details.awsm_code = kyc_details.awsm_code
      INNER JOIN aw_details ON kyc_details.aw_code = aw_details.aw_code
      INNER JOIN ase_details ON kyc_details.ase_email = ase_details.ase_email_id
      WHERE status = 'PENDING' AND (kyc_type = 'FRESH' OR kyc_type = 'Replace-KYC-Request' OR kyc_type = 'RE-KYC-Request')
    `;

  if (data.mobile_no) {
    query += ` AND kyc_details.mobile_no = '${data.mobile_no}'`;
  }
  if (data.awsm_code) {
    query += ` AND kyc_details.awsm_code = '${data.awsm_code}'`;
  }
  if (data.awsm_name) {
    query += ` AND awsm_details.awsm_name = '${data.awsm_name}'`;
  }
  if (data.salesman_type) {
    query += ` AND awsm_details.salesman_type = '${data.salesman_type}'`;
  }
  if (data.aw_code) {
    query += ` AND kyc_details.aw_code = '${data.aw_code}'`;
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
    query += ` AND DATE(kyc_details.created_on) BETWEEN STR_TO_DATE('${data.fromDate}', '%Y-%m-%d') AND STR_TO_DATE('${data.toDate}', '%Y-%m-%d')`;
  }
  if (data.awsm_state) {
    query += ` AND awsm_details.awsm_state = '${data.awsm_state}'`;
  }
  if (data.awsm_city) {
    query += ` AND awsm_details.awsm_city = '${data.awsm_city}'`;
  }
  query += ` ORDER BY kyc_details.created_on DESC`;

  const limit = parseInt(1000000000);
  if (!isNaN(limit) && limit > 0) {
    query += ` LIMIT ${limit}`;
  }

  return new Promise((resolve, reject) => {
    dbCon.query(query, (error, result) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(result);
      }
    });
  });
};




const filterKycData = async (data) => {
  // let query = `select kyc_details.*, awsm_details.*, aw_details.*, ase_details.* from kyc_details INNER JOIN awsm_details on awsm_details.awsm_code=kyc_details.awsm_code INNER JOIN aw_details on kyc_details.aw_code = aw_details.aw_code INNER JOIN ase_details on kyc_details.ase_email = ase_details.ase_email_id WHERE kyc_details.kyc_type = 'FRESS' or RE-KYC or RE-KYC-Request`;
  let query = `SELECT kyc_details.*, awsm_details.*, aw_details.*, ase_details.*
  FROM kyc_details
  INNER JOIN awsm_details ON awsm_details.awsm_code = kyc_details.awsm_code
  INNER JOIN aw_details ON kyc_details.aw_code = aw_details.aw_code
  INNER JOIN ase_details ON kyc_details.ase_email = ase_details.ase_email_id
  WHERE kyc_details.kyc_type IN ('FRESH', 'Replace-KYC-Request', 'RE-KYC-Request')
  AND kyc_details.status = 'PENDING'`;


  if (data.Mobile) {
    query += ` AND kyc_details.mobile_no = '${data.Mobile}'`;
  }
  if (data.salesman_id) {
    query += ` AND kyc_details.awsm_code = '${data.salesman_id}'`;
  }
  if (data.salesman_name) {
    query += ` AND awsm_details.awsm_name = '${data.salesman_name}'`;
  }
  if (data.salesman_type) {
    query += ` AND awsm_details.salesman_type = '${data.salesman_type}'`;
  }
  if (data.aw_code) {
    query += ` AND kyc_details.aw_code = '${data.aw_code}'`;
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
  if ((data.fromDate == data.toDate) && (data.fromDate != '' && data.fromDate != undefined)) {
    query += ` AND DATE(kyc_details.created_on)='${data.fromDate}'`;
  }
  if (data.fromDate && data.toDate) {
    query += `AND DATE(kyc_details.created_on)>='${data.fromDate}'AND DATE(kyc_details.created_on)<= '${data.toDate}'`
  }
  if (data.state) {
    query += ` AND awsm_details.awsm_state = '${data.state}'`;
  }
  if (data.city) {
    query += ` AND awsm_details.awsm_city = '${data.city}'`;
  }
  query += ` ORDER BY kyc_details.created_on DESC`;
  query += ` LIMIT ${parseInt(5)}`;

  return new Promise((resolve, reject) => {
    dbCon.query(query, (error, result) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(result);
      }
    })
  })
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


const updateKycStatus = (data) => {
  let updateStatus = `UPDATE kyc_details SET calling_count = '${data.calling_count || 0}', calling_status = '${data.calling_status || null}', calling_remarks = '${data.calling_remarks || null}', status = '${data.kyc_status || 'PENDING'}', wip_remarks = '${data.kyc_rejection_reason || null}', approved_comment = '${data.approved_comment}', approved_comment1 = '${data.approved_comment}' where kyc_id = '${data.kyc_id}'`

  return new Promise((resolve, reject) => {
    dbCon.query(updateStatus, (error, result) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(result);
      }
    });
  });
}

const updateFreshKycStatus = (data) => {
  let updateStatus = `UPDATE kyc_details SET calling_count = '${data.calling_count || 0}', calling_status = '${data.calling_status || null}', calling_remarks = '${data.calling_remarks || null}', status = '${data.kyc_status || 'PENDING'}', wip_remarks = '${data.kyc_rejection_reason || null}', approved_on = '${data.todayDate}', approved_by = '${data.userName}', approved_comment = '${data.approved_comment}', approved_comment1 = '${data.approved_comment}',updated_date = '${data.todayDate}' where kyc_id = '${data.kyc_id}'`

  return new Promise((resolve, reject) => {
    dbCon.query(updateStatus, (error, result) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(result);
      }
    });
  });
}

const updateReplaceKycStatus = (data) => {
  let updateStatus = `UPDATE kyc_details SET calling_count = '${data.calling_count || 0}', calling_status = '${data.calling_status || null}', calling_remarks = '${data.calling_remarks || null}', status = '${data.kyc_status || 'PENDING'}', wip_remarks = '${data.kyc_rejection_reason || null}', replace_kyc_edit_on = '${data.todayDate}', replace_kyc_edit_by = '${data.userName}', kyc_type = '${'Replace-KYC'}', approved_comment= '${data.approved_comment}', approved_comment1 = '${data.approved_comment}', updated_date = '${data.todayDate}' where kyc_id = '${data.kyc_id}'`

  return new Promise((resolve, reject) => {
    dbCon.query(updateStatus, (error, result) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(result);
      }
    });
  });
}

const updateReKycStatus = (data) => {
  let updateStatus = `UPDATE kyc_details SET calling_count = '${data.calling_count || 0}', calling_status = '${data.calling_status || null}', calling_remarks = '${data.calling_remarks || null}', status = '${data.kyc_status || 'PENDING'}', wip_remarks = '${data.kyc_rejection_reason || null}', re_kyc_edit_on = '${data.todayDate}', re_kyc_edit_by = '${data.userName}', kyc_type = '${'RE-KYC'}', approved_comment = '${data.approved_comment}', approved_comment1 = '${data.approved_comment}', updated_date = '${data.todayDate}' where kyc_id = '${data.kyc_id}'`

  return new Promise((resolve, reject) => {
    dbCon.query(updateStatus, (error, result) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(result);
      }
    });
  });
}

const selectPhoenix = async (id) => {
  let query = `SELECT * FROM third_party_phoenix_data WHERE id = '${id}'`;
  return new Promise((resolve, reject) => {
    dbCon.query(query, (error, result) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(result);
      }
    });
  });
}

const updateThirdPartyData = async (data, id) => {
  let query = `UPDATE third_party_phoenix_data SET client_id = ?, campaign_id =? , url =? , request=?, response=?, status = ?, flag = ?, count = ? WHERE id = '${id}'`;

  let requestJson = JSON.stringify(data.request);
  let responseJson = JSON.stringify(data.response);

  let values = ['BRIT_20190625', '100005555', data.url, requestJson, responseJson, data.status, data.flag, data.count];

  return new Promise((resolve, reject) => {
    dbCon.query(query, values, (error, result) => {
      if (error) {
        return reject(error);
      } else {
        console.log(result, "updated done");
        return resolve(result);
      }
    });
  });
};



const SaveThirdPartyData = async (data) => {
  let query = 'INSERT INTO third_party_phoenix_data (client_id, campaign_id, url, request, response, status, flag, count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';


  let requestJson = JSON.stringify(data.request);
  let responseJson = JSON.stringify(data.response);

  let values = ['BRIT_20190625', '100005555', data.url, requestJson, responseJson, data.status, data.flag, data.count];
  return new Promise((resolve, reject) => {
    dbCon.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

const CurrentUser = async (email) => {

  let query = `SELECT * FROM awsm_users WHERE email = '${email}'`;

  return new Promise((resolve, reject) => {
    dbCon.query(query, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = { selectKycData, filterKycData, getAWSMCity, updateKycStatus, SaveThirdPartyData, selectPhoenix, updateThirdPartyData, updateFreshKycStatus, updateReplaceKycStatus, updateReKycStatus, CurrentUser }
