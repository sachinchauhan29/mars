const { selectNotification } = require("../../models/notification.model")

const notification = async (req, res) => {
  let notificationResult = await selectNotification();
  res.render('notification', { user: res.userDetail, notificationResult: notificationResult, notification: res.notification })
}

module.exports = {
  notification
}