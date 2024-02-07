"user strict";
const mysql = require("mysql");

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "mkyc",
});

// const connection = mysql.createPool({
//   host: "13.234.166.225",
//   user: "root",
//   password: "Test@123root",
//   database: "kyc",
// });


// const connection = mysql.createPool({
//   host: "13.234.162.67",
//   user: "anuj",
//   password: "Anuj@3112",
//   database: "kyc",
// });

module.exports = connection;
