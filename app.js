require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
//const encrypt = require("mongoose-encryption");
const md5 = require("md5");
const app = express();
const mongoose = require("mongoose");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
//Hashing function used therefore encryption using secret commented
//Secret stored in .env file
//userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.email,
        password: md5(req.body.password)
    });
    newUser.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

app.post("/login", function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email}, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser.password === password) {
                res.render("secrets");
            }
        }
    });
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});