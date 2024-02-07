const mysqlConnection = require('../config/db');
const bcrypt = require("bcryptjs");

const insertQuery = async (data) => {
    let encryptedPassword = await bcrypt.hash(data.password, 10)
    let query = `INSERT INTO awsm_users( firstName, lastName, email, password, role) VALUES ( '${data.firstName}', '${data.lastName}', '${data.email}', '${encryptedPassword}', '${data.role}')`;
    return new Promise((resolve, reject) => {
        mysqlConnection.query(query, (error, employees) => {
            if (error) {
                return reject(error);
            }
            return resolve(employees);
        });
    });
}

const selectQuery = async (data) => {
    let query = `SELECT * FROM awsm_users WHERE email = '${data.email}'`;

    return new Promise((resolve, reject) => {
        mysqlConnection.query(query, (error, result) => {
            if (error) {
                return reject(error)
            }
            return resolve(result);
        });
    })
}


const selectQueryByToken = async (token) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query('SELECT * FROM awsm_users WHERE token =?', token, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        })
    })
}


const updateQuery = async (data) => {
    let token = data.token;
    return new Promise((resolve, reject) => {
        let query = `UPDATE awsm_users SET ? WHERE email =?`;
        mysqlConnection.query(query, [{ token: token }, `${data.email}`], (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        })
    })
}

const updateQueryPassword = async (data) => {
    let password = data.password;
    return new Promise((resolve, reject) => {
        let query = `UPDATE awsm_users SET ? WHERE email =?`;
        mysqlConnection.query(query, [{ password: password }, `${data.email}`], (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        })
    })
}

const updateQueryByToken = async (data) => {
    return new Promise((resolve, reject) => {
        let query = `UPDATE awsm_users SET ? WHERE token = ?`;
        mysqlConnection.query(query, [{ token: '' }, `${data.token}`], (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        })
    })
}

const updatePasswordByToken = async (data) => {
    let password = data.password;
    return new Promise((resolve, reject) => {
        let query = `UPDATE awsm_users SET ? WHERE token =?`;
        mysqlConnection.query(query, [{ password: password }, `${data.token}`], (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        })
    })
}

module.exports = { insertQuery, selectQuery, selectQueryByToken, updateQuery, updateQueryByToken, updateQueryPassword, updatePasswordByToken }