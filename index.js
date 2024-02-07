const express = require("express");
const path = require('path');
const app = express();
require('dotenv').config();


const cookieParser = require('cookie-parser');
const logger = require("morgan");


const session = require('express-session')
app.use(session({
  secret: 'secret-key',
  saveUninitialized: true,
  resave: true
}))

const adminRoute = require("./src/routes");
const port = process.env.PORT;
const upload = require('express-fileupload');


app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'src/views'));


app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "src/public")));

// app.use(express.static('public'));
// app.use('/public', express.static(__dirname + '/public'));

app.use('/public', express.static(__dirname + '/src/public'));

app.use(upload());
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);

  res.send({ "message": "404 Page Not Found..!" });
});


app.use('/', adminRoute);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
})