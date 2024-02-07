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


const saveUser = async (data) => {
  try {
    const query = `INSERT INTO awsm_users (firstName, email, password, view_password, role) VALUES (?, ?, ?, ?, ?)`;
    const values = [data.firstName, data.email, data.password, data.view_password, data.role];

    return new Promise((resolve, reject) => {
      dbCon.query(query, values, (err, result) => {
        if (err) {
          return reject(err)
        }
        return resolve(result)
      })
    })
  } catch (error) {
    return error;
  }
};

const selectUsers = async (data) => {
  let query = `SELECT * FROM awsm_users WHERE email = '${data.email}'`

  return new Promise((resolve, reject) => {
    dbCon.query(query, (err, result) => {
      if (err) {
        return reject(err)
      }
      return resolve(result)
    })
  })
}

module.exports = { getUsers, saveUser, selectUsers };
