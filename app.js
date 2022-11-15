//jshint esversion:6
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const exp = require('constants');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

//Creates Node app
const app = express();



//Starting the mongodb connection with mongoose
mongoose.connect("mongodb://localhost:27017/userDB");

//Enables the use of static things
app.use(express.static("public"));

//sets view engine as ejs
app.set('view engine','ejs');

//to use bodyParser
app.use(bodyParser.urlencoded({extended: true}));

//User Schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//encrytion using mongoose-encryption
userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields: ["password"]});

//Creates Model or Table
const User = mongoose.model('User',userSchema);

//root route
app.get("/",function(req, res){
    res.render("home");
});

//login route
app.get("/login",function(req, res){
    res.render("login");
});

//register route
app.get("/register",function(req, res){
    res.render("register");
});

//Resgister user 
app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err){
        if (err){
            console.log(err);
        }else {
            res.render("secrets");
        }
    });
});

//Loging In
app.post("/login",function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username},function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                
                if(foundUser.password == password){
                    res.render("secrets");
                }
            }
        }
    });
});




app.listen(3000,function(req, res){
    console.log("Server is running on port 3000.");
});