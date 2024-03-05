"user strict";
const mysql = require("mysql");

// const connection = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "mars_kyc123456",
// });



const connection = mysql.createPool({
  host: "13.234.162.67",
  user: "anuj",
  password: "Anuj@3112",
  database: "m_kyc",
});


// const connection = mysql.createPool({
//   host: "13.234.162.67",
//   user: "anuj",
//   password: "Anuj@3112",
//   database: "kyc",
// });

module.exports = connection;
