//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: String,
  pass: String
});

console.log(process.env.SECRET);

userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields: ['pass']});

const User = new mongoose.model('User', userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  const register = new User({
    email: req.body.username,
    pass: req.body.password
  });

  register.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  // console.log(username);
  // console.log(password);
  User.findOne({email: username}, function(err, results) {
    if (err) {
      console.log(err);
    } else if (results) {
        // console.log(results);
        if (results.pass === password) {
          res.render("secrets");
          console.log("successfuy logged in");
        }
      }
  });
});

app.listen(3000, function() {
  console.log("server started at port 3000");
});
