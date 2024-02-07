const { getUsers, saveUser, selectUsers } = require("../../models/users.model");
const bcrypt = require("bcryptjs");


const userView = async (req, res, next) => {
  let userResult = await getUsers(req.query);
  const data = (userResult.firstName);
  console.log('sdhashdasjdh' + data);
  res.render('users', { user: res.userDetail, notification: res.notification, userResult: userResult });
}

const addUser = async (req, res) => {
  res.render('users/add-user', { user: res.userDetail, notification: res.notification });
}

const addNewUser = async (req, res) => {

  let encryptedPassword = await bcrypt.hash(req.body.password, 10);
  req.body.view_password = req.body.password;
  req.body.password = encryptedPassword;

  let selectUser = await selectUsers(req.body);
  if (selectUser.length === 0) {
    await saveUser(req.body);
  }

  // let userResult = await getUsers(req.query);
  // res.render('users', { user: res.userDetail, notification: res.notification, userResult: userResult })
  res.redirect("/users")
}

const addRole = async (req, res) => {
  res.render('users/add-role', { user: res.userDetail, notification: res.notification });
}

module.exports = {
  addNewUser,
  userView,
  addUser,
  addRole
}