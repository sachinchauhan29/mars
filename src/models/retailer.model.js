const dbCon = require('../config/db');


const getUsers = async (data) => {
    let query = `SELECT * FROM awsm_users WHERE role != 'admin'`;

    if (data.user_name) {
        query += ` AND awsm_users.firstName = '${data.user_name}'`;
    }
    if (data.email) {
        query += ` AND awsm_users.email = '${data.email}'`;
    }

    if (data.role) {
        query += ` AND awsm_users.role = '${data.role}'`;
    }

    if (data.limit || true) {
        query += ` LIMIT ${parseInt(50)}`;
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




module.exports = { getUsers };
