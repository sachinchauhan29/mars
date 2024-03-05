const dbCon = require('../config/db');

// const retailer = async (data) => {
//     let query = `SELECT * FROM retailerwhitelisting WHERE 1=1`;

//     if (data && data.Region) {
//         query += ` AND Region = '${data.Region}'`;
//     }
//     if (data && data.RSM) {
//         query += ` AND RSM = '${data.RSM}'`;
//     }
//     if (data && data.ASMAreaCode) {
//         query += ` AND \`ASMAreaCode\` = '${data.ASMAreaCode}'`;
//     }
//     if (data && data.SO) {
//         query += ` AND \`SO\` = '${data.SO}'`;
//     }
//     if (data && data.DistributorCode) {
//         query += ` AND \`DistributorCode\` = '${data.DistributorCode}'`;
//     }
//     if (data && data.DistributorName) {
//         query += ` AND \`DistributorName\` = '${data.DistributorName}'`;
//     }
//     if (data && data.RetailerCode) {
//         query += ` AND RetailerCode = '${data.RetailerCode}'`;
//     }
//     if (data && data.RetailerName) {
//         query += ` AND \`RetailerName\` = '${data.RetailerName}'`;
//     }
//     if (data && data.SalesManCode) {
//         query += ` AND \`SalesManCode\` = '${data.SalesManCode}'`;
//     }
//     if (data && data.SalesManName) {
//         query += ` AND \`SalesManName\` = '${data.SalesManName}'`;
//     }
//     if (data && data.toDate && data.fromDate) {
//         query += ` AND created_date BETWEEN '${data.fromDate}' and '${data.toDate}'`;
//     }
//     if (data && data.SalesManEmpCode) {
//         query += ` AND SalesManEmpCode = '${data.SalesManEmpCode}'`;
//     }

//     // console.log(query, "..............", data);
//     console.log(query); // Log the constructed query for debugging

//     // Return a promise for executing the query
//     return new Promise((resolve, reject) => {
//         dbCon.query(query, (err, result) => {
//             if (err) {
//                 reject(err); // Reject the promise with the error if query execution fails
//             } else {
//                 resolve(result); // Resolve the promise with the query result
//             }
//         });
//     });
// }
// const retailer = async (data) => {
//     // let query = `SELECT Retailerkyc_details.*, distributor_details.*, aw_details.*, ase_details.*
//     // FROM Retailerkyc_details
//     // INNER JOIN distributor_details ON distributor_details.distributorcode = Retailerkyc_details.aw_code
//     // INNER JOIN aw_details ON Retailerkyc_details.aw_code = aw_details.aw_code
//     // INNER JOIN ase_details ON Retailerkyc_details.ase_email = ase_details.ase_email_id
//     // WHERE 1=1`;
//     let query = `SELECT Retailers_details.*, Retailers_details.name as retailername , distributor_details.*,  ase_details.*,awsm_details.*
//     FROM Retailers_details
//     INNER JOIN distributor_details ON distributor_details.distributorcode = Retailers_details.distributorcode
//     INNER join awsm_details ON Retailers_details.distributorcode = awsm_details.aw_code
//     INNER JOIN ase_details ON Retailers_details.aseemailid = ase_details.ase_email_id
//     WHERE 1=1`;

//     const queryParams = [];

//     // if (data.ase_code) {
//     //     query += ` AND ase.ase_employee_code = ?`;
//     //     queryParams.push(data.ase_code);
//     // }
//     // if (data.ase_name) {
//     //     query += ` AND ase.ase_name = ?`;
//     //     queryParams.push(data.ase_name);
//     // }
//     // if (data.ase_email_id) {
//     //     query += ` AND ase.ase_email_id = ?`;
//     //     queryParams.push(data.ase_email_id);
//     // }
//     // if (data.aw_code) {
//     //     query += ` AND awd.aw_code = ?`;
//     //     queryParams.push(data.aw_code);
//     // }
//     // if (data.awsm_code) {
//     //     query += ` AND ad.awsm_code = ?`;
//     //     queryParams.push(data.awsm_code);
//     // }
//     // if (data.awsm_name) {
//     //     query += ` AND ad.awsm_name = ?`;
//     //     queryParams.push(data.awsm_name);
//     // }
//     // if (data.salesman_type) {
//     //     query += ` AND ad.salesman_type = ?`;
//     //     queryParams.push(data.salesman_type);
//     // }
//     // if (data.aw_code) {
//     //     query += ` AND awd.aw_code = ?`;
//     //     queryParams.push(data.aw_code);
//     // }
//     // if (data.fromDate && data.toDate) {
//     //     query += ` AND DATE(ad.insert_timestamp) BETWEEN STR_TO_DATE(?, '%Y-%m-%d') AND STR_TO_DATE(?, '%Y-%m-%d')`;
//     //     queryParams.push(data.fromDate, data.toDate);
//     // }

//     // query += ` ORDER BY ad.insert_timestamp DESC`;

//     return new Promise((resolve, reject) => {
//         dbCon.query(query, queryParams, (error, result) => {
//             if (error) {
//                 return reject(error);
//             }
//             return resolve(result);
//         });
//     });
// };
const insertIntoFileProcessretailerwhitelisting = async (data) => {
    let query = `INSERT INTO retailerwhitelisting_file_process(original_file_name, file_name, file_size, process_status, reason, total_counts, success_counts, failure_counts, updated_file_name, channel) VALUES(?,?,?,?,?,?,?,?,?,?)`;
    let values = [data.original_file_name, data.file_name, data.file_size, data.process_status, data.reason, data.total_count, data.success_count, data.failure_count, data.updated_file_name, data.channel];

    return new Promise((resolve, reject) => {
        dbCon.query(query, values, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

const getUploadRecords = async () => {
    let query = `SELECT * FROM retailerwhitelisting_file_process ORDER BY insert_datetime DESC LIMIT 10`;

    return new Promise((resolve, reject) => {
        dbCon.query(query, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}
const exportWhitelisting = async (data) => {
    let query = `SELECT * FROM retailerwhitelisting   WHERE 1 = 1`;

    console.log(data, 'exportWhitelisting', query);
    const queryParams = [];

    return new Promise((resolve, reject) => {
        dbCon.query(query, queryParams, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
};

const updateKYCDetailHistory = async (data) => {

    let query = `INSERT INTO retailerwhitelisting(kyc_id, awsm_history_id, ase_email, aw_code, awsm_code, approved_by, approved_comment, gender, dob, bank_account_no, address, bank_cheque, bank_name, beneficiary_name, created_on, created_by, ifsc_code, mobile_no, photo_id, photo, status, bio_status, calling_count, calling_remarks, calling_status, kyc_type, wip_remarks, reason) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    let values = [data.kyc_id, data.awsm_history_id, data.ase_email, data.aw_code, data.awsm_code, data.approved_by, data.approved_comment, data.gender, data.dob, data.bank_account_no, data.address, data.bank_cheque, data.bank_name, data.beneficiary_name, data.created_on, data.created_by, data.ifsc_code, data.mobile_no, data.photo_id, data.photo, data.status, data.bio_status, data.calling_count, data.calling_remarks, data.calling_status, data.kyc_type, data.wip_remarks, data.reason];

    return new Promise((resolve, reject) => {
        dbCon.query(query, values, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}



const totalEntries = async () => {
    let query = `SELECT COUNT(*) as totalEntries
  FROM awsm_details AS ad
  INNER JOIN distributor_details AS awd ON awd.distributorcode = ad.aw_code
  INNER JOIN ase_details AS ase ON awd.aseemailid = ase.ase_email_id
  WHERE 1 = 1`;

    return new Promise((resolve, reject) => {
        dbCon.query(query, (error, result) => {
            if (error) {
                return reject(error);
            }
            const totalEntries = result[0].totalEntries;
            return resolve(totalEntries);
        });
    });
};



const selectDataWhitelisting = async (data) => {

    const page = parseInt(data.page) || 1;
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    let query = `SELECT ase_details.*,  Retailers_details.*, Retailers_details.retailercode as awsm_code, Retailers_details.name as awsm_name, Retailers_details.aseemailid, distributor.distributorcode as distributor_code, distributor.name as distributor_name, distributor.state, distributor.city, distributor.region 
    FROM Retailers_details  
    INNER JOIN distributor_details AS distributor ON distributor.aseemailid = Retailers_details.aseemailid
   
    INNER JOIN ase_details  ON ase_details.ase_email_id = Retailers_details.aseemailid
    WHERE 1 = 1
  `;
    if (data.ase_code) {
        query += ` AND ase.ase_employee_code = '${data.ase_code}'`;
    }
    if (data.ase_name) {
        query += ` AND ase.ase_name = '${data.ase_name}'`;
    }
    if (data.ase_email_id) {
        query += ` AND ase.ase_email_id = '${data.ase_email_id}'`;
    }
    if (data.salesman_id) {
        query += ` AND ad.awsm_code = '${data.salesman_id}'`;
    }
    if (data.salesman_name) {
        query += ` AND ad.awsm_name = '${data.salesman_name}'`;
    }
    if (data.salesman_type) {
        query += ` AND ad.salesman_type = '${data.salesman_type}'`;
    }
    if (data.distributorcode) {
        query += ` AND distributor.distributorcode = '${data.distributorcode}'`;
    }
    // if (data.fromDate && data.toDate) {
    //     query += ` AND DATE(ad.insert_timestamp) BETWEEN STR_TO_DATE('${data.fromDate}', '%Y-%m-%d') AND STR_TO_DATE('${data.toDate}', '%Y-%m-%d')`;
    // }
    // if (data.search) {
    //     const searchTerm = dbCon.escape(`%${data.search}%`);
    //     query += ` AND (ase.ase_email_id LIKE ${searchTerm} OR ase.ase_name LIKE ${searchTerm} OR ase.ase_employee_code LIKE ${searchTerm})`;
    // }

    // query += ` ORDER BY ad.insert_timestamp DESC LIMIT ? OFFSET ?`;

    // if (true) {
    //   query += ` ORDER BY ad.insert_timestamp DESC`;
    // }
    // if (data.limit || true) {
    //   query += ` LIMIT ${parseInt(10)} `;
    // }

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
    SELECT COUNT(*) as total
    FROM awsm_details AS ad
    INNER JOIN distributor_details AS awd ON awd.distributorcode = ad.aw_code
    INNER JOIN ase_details AS ase ON awd.aseemailid = ase.ase_email_id
    WHERE 1 = 1
  `;

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


const UpdateWhiteList = async (data) => {
    let query = `UPDATE awsm_details SET awsm_name = '${data.salesman_name}', awsm_code = '${data.salesman_code}' WHERE awsm_name = '${data.awsm_name}' AND awsm_code = '${data.awsm_code}'`;
    return new Promise((resolve, reject) => {
        dbCon.query(query, (error, result) => {
            if (error) {
                return resolve(error);
            }
            return resolve(result);
        });
    });
}

const selectAWSMDetail = async (data) => {
    let query = `SELECT * FROM Retailers_details where retailercode = '${data.awsm_code}'`;
    return new Promise((resolve, reject) => {
        dbCon.query(query, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}
const updateAWSMDetail = async (data) => {
    console.log(data, 'updateAWSMDetail sachin');
    let query = 'UPDATE Retailers_details SET name = ?, retailercode = ? WHERE retailercode = ?';
    let values = [data.salesman_name, data.salesman_code, data.awsm_code];

    return new Promise((resolve, reject) => {
        dbCon.query(query, values, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

const updateAWSMDetailHistory = async (data) => {

    let query = `INSERT INTO awsm_details_history(awsm_code, awsm_city, awsm_name, awsm_state, reason, aw_code) VALUES(?,?,?,?,?,?)`;
    let values = [data.awsm_code, data.awsm_city, data.awsm_name, data.awsm_state, data.reason, data.aw_code];

    return new Promise((resolve, reject) => {
        dbCon.query(query, values, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });

}



const selectKYCDetail = async (data) => {
    console.log(data, "selectKYCDetails");
    let query = `SELECT * FROM Retailerkyc_details where RetailerCode = '${data.awsm_code}'`;
    return new Promise((resolve, reject) => {
        dbCon.query(query, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

const selectASE = async (data) => {
    let query = `SELECT * FROM ase_details where ase_email_id = '${data.ase_email_id}'`;
    return new Promise((resolve, reject) => {
        dbCon.query(query, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}


const updateASE = async (data) => {
    console.log('UPDATE data ase_details', data);
    let query = 'UPDATE ase_details SET ase_city = ?, ase_employee_code = ?, ase_name = ? WHERE ase_email_id = ?';
    let values = [data.City, data.ase_code, data.ase_name, data.ase_email_id];

    return new Promise((resolve, reject) => {
        dbCon.query(query, values, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}



const insertASE = async (data) => {
    let query = `INSERT INTO ase_details(ase_email_id, ase_city, ase_employee_code, ase_name) VALUES(?, ?, ?, ?)`;
    let values = [data.ase_email_id, data.City, data.ase_code, data.ase_name];

    return new Promise((resolve, reject) => {
        dbCon.query(query, values, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}


const selectAW = async (data) => {
    console.log(data, 'selectAW distributor_details');
    let query = `SELECT * FROM distributor_details  where aseemailid = '${data.ase_email_id}'`;
    return new Promise((resolve, reject) => {
        dbCon.query(query, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

const updateAW = async (data) => {
    console.log(data, 'updateAW');
    // let query = `UPDATE distributor_details SET city = ?, name = ?, state = ?, region = ?, aseemailid = ? WHERE distributorcode = ? `;
    let query = `UPDATE distributor_details SET city = ?, name = ?, state = ?, region = ?, distributorcode = ? WHERE aseemailid = ? `;
    let values = [data.aw_city, data.aw_name, data.aw_state, data.region, data.aw_code, data.ase_email_id,];

    return new Promise((resolve, reject) => {
        dbCon.query(query, values, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

const insertAW = async (data) => {
    let query = 'INSERT INTO distributor_details  (city, name, state, region, distributorcode, aseemailid,region) VALUES (?, ?, ?, ?, ?, ?,?)';
    let values = [data.aw_city, data.aw_name, data.aw_state, data.region, data.aw_code, data.ase_email_id, data.region];

    return new Promise((resolve, reject) => {
        dbCon.query(query, values, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}


const selectAWSM = async (data) => {
    let query = `SELECT * FROM retailers_details where retailercode = '${data.awsm_code}'`;
    return new Promise((resolve, reject) => {
        dbCon.query(query, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}


const deleteAWSM = async (data) => {
    const query = 'DELETE FROM retailers_details WHERE retailercode = ?';
    const values = [data.awsm_code];

    return new Promise((resolve, reject) => {
        dbCon.query(query, values, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};



const updateAWSM = async (data) => {
    console.log(data, 'data.retailers_details,updateAWSM');

    let query = 'UPDATE retailers_details SET  name = ?, distributorcode = ?,  aseemailid = ? WHERE retailercode = ?';
    let values = [data.name, data.aw_code, data.ase_email_id, data.awsm_code,];

    return new Promise((resolve, reject) => {
        dbCon.query(query, values, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}




const insertAWSM = async (data) => {
    console.log(data, 'insert');
    let query = 'INSERT INTO Retailers_details (name, distributorcode, retailercode,aseemailid) VALUES ( ?, ?, ?,?)';
    let values = [data.name, data.aw_code, data.awsm_code, data.ase_email_id,];

    return new Promise((resolve, reject) => {
        dbCon.query(query, values, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}


const insertIntoFileProcess = async (data) => {
    let query = `INSERT INTO whitelisting_file_process(original_file_name, file_name, file_size, process_status, reason, total_counts, success_counts, failure_counts, updated_file_name, channel) VALUES(?,?,?,?,?,?,?,?,?,?)`;
    let values = [data.original_file_name, data.file_name, data.file_size, data.process_status, data.reason, data.total_count, data.success_count, data.failure_count, data.updated_file_name, data.channel];

    return new Promise((resolve, reject) => {
        dbCon.query(query, values, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}



const updateIsActiveStatus = async (data) => {
    console.log('asdf' + data.id + '', data);
    let query = 'UPDATE retailers_details SET is_active = ? WHERE retailercode = ?';
    let values = [data.isChecked, data.retailercode];

    return new Promise((resolve, reject) => {
        dbCon.query(query, values, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

const UpdateAWSMHistory = (data) => {

    let query = `INSERT INTO awsm_details_history(awsm_code, awsm_city, awsm_name, awsm_state, reason, aw_code) VALUES(?,?,?,?,?,?)`;
    let values = [data.awsm_code, data.awsm_city, data.awsm_name, data.awsm_state, data.reason, data.aw_code];

    return new Promise((resolve, reject) => {
        dbCon.query(query, values, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

const selectKYC = async (data) => {
    let query = `SELECT * FROM kyc_details WHERE awsm_code ='${data.awsm_code}'`;

    return new Promise((resolve, reject) => {
        dbCon.query(query, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

const selectAUTH = async (data) => {
    let query = `SELECT * FROM kyc_authentication_details WHERE awsm_code ='${data.awsm_code}'`;

    return new Promise((resolve, reject) => {
        dbCon.query(query, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

const awsmDetailsHistory = async (data) => {
    console.log(data, 'result');
    let query = `SELECT * FROM Retailerkyc_details WHERE RetailerCode ='${data.awsm_code}'`;

    return new Promise((resolve, reject) => {
        dbCon.query(query, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });

}




const updateAUTHDetailHistory = async (data) => {
    let query = `INSERT INTO kyc_authentication_details_history(kyc_id, awsm_code, gender, dob, address, bank_account_no, bank_name, beneficiary_name, ifsc_code, mobile_no, status, reason) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`;
    let values = [data.kyc_id, data.awsm_code, data.gender, data.dob, data.address, data.bank_account_no, data.bank_name, data.beneficiary_name, data.ifsc_code, data.mobile_no, data.status, data.reason];

    return new Promise((resolve, reject) => {
        dbCon.query(query, values, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

const update_kyc_details = async (data) => {
    console.log(data, 'update_kyc');
    let query = 'UPDATE Retailerkyc_details SET RetailerCode = ? WHERE RetailerCode = ?';
    let values = [data.salesman_code, data.awsm_code];

    return new Promise((resolve, reject) => {
        dbCon.query(query, values, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

const updateAWSMKycAuthenticationDetails = async (data) => {
    let query = 'UPDATE kyc_authentication_details SET awsm_code = ? WHERE awsm_code = ?';
    let values = [data.salesman_code, data.awsm_code];

    return new Promise((resolve, reject) => {
        dbCon.query(query, values, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

const updateKYCDetail = async (data) => {
    let query = 'UPDATE kyc_details SET ase_email = ?, aw_code = ? WHERE awsm_code = ?';
    let values = [data.ase_email_id, data.aw_code, data.awsm_code];

    return new Promise((resolve, reject) => {
        dbCon.query(query, values, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

const updateAUTHDetail = async (data) => {
    let query = 'UPDATE kyc_authentication_details SET ase_email = ? WHERE awsm_code = ?';
    let values = [data.ase_email_id, data.awsm_code];

    return new Promise((resolve, reject) => {
        dbCon.query(query, values, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

const deleteKYCDetail = async (data) => {
    let query = 'DELETE FROM kyc_details WHERE awsm_code = ?';
    let values = [data.awsm_code];

    return new Promise((resolve, reject) => {
        dbCon.query(query, values, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

module.exports = { totalEntries, exportWhitelisting, selectDataWhitelisting, UpdateWhiteList, selectASE, updateASE, insertASE, selectAW, updateAW, insertAW, selectAWSM, updateAWSM, insertAWSM, insertIntoFileProcess, getUploadRecords, updateIsActiveStatus, getTotalCount, UpdateAWSMHistory, deleteAWSM, selectKYC, awsmDetailsHistory, updateKYCDetailHistory, updateKYCDetail, selectAWSMDetail, updateAWSMDetailHistory, updateAWSMDetail, selectKYCDetail, update_kyc_details, updateAWSMKycAuthenticationDetails, deleteKYCDetail, selectAUTH, updateAUTHDetailHistory, updateAUTHDetail, updateAUTHDetail, insertIntoFileProcessretailerwhitelisting, getUploadRecords, exportWhitelisting, updateKYCDetailHistory }
