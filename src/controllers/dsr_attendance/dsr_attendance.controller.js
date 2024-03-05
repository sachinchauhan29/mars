

const { getattendance } = require('../../models/dsr-attendance.model');

const attendanceView = async (req, res, next) => {

  if (req.query.page == -1) {
    req.query.page = 1;
  }

  let attendanceDetails = await getattendance(req.query);


  res.render('dsr_attendance', { user: res.userDetail, attendanceDetails, userResult11: attendanceDetails, QueryData: req.query, notification: res.notification });
}
const exportattendanceData = async (req, res) => {
  let allDetailss = await getattendance(req.query);
  //  console.log('asdfge: exportKYCData', allDetailss);
  res.send(allDetailss);
}

module.exports = { attendanceView, exportattendanceData }