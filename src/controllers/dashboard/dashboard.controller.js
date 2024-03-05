
// const dashboardView = async (req, res, next) => {
//     res.render('account', { message: req.session.message });
// }
const dashboard = require('../../models/dashboard.model');

const dashboardBackView = async (req, res, next) => {
    
  let dashboardDetails = await dashboard.getattendance(req.query);
  let totalData = await dashboard.getdashboard();

  let absent = totalData.filter(element => {
    return element.attendance_status === "Absent";
  });
  
  let present = totalData.filter(element => {
    return element.attendance_status === "Present";
  });
  
  //  console.log(present.length,totalData,"..........................................");
  //   console.log(res.notification);
    res.render('dashboard',{ user: res.userDetail, notification: res.notification, QueryData: dashboardDetails,absent:absent.length,present:present.length,total:totalData.length});

}

module.exports = {
    // dashboardView,
    dashboardBackView
}