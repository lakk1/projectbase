var express = require('express'),
    app = express();
var morgan = require('morgan');
var fs = require('fs');
var path = require('path');
var ejs  = require('ejs');
var ejsMate  = require('ejs-mate');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session =require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');

var info = require("./config/info");
var User = require('./models/user.model');

//

//Connect mongodb
mongoose.connect(info.db,function (err) {
    if(err){
        console.log(err)
    }else {
        console.log("Database Succesfully connected")
    }
})
//create a write stream (in append mode) and log requests
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
app.use(morgan("dev",{stream:accessLogStream}));

// middleware
app.use(express.static('public'))
app.use(express.static('public/lib'))
app.engine('ejs',ejsMate);
app.set('view engine','ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret:"djdjhfjfdhj#2"
    }))
app.use(flash())

var userRoutes = require('./routes/userRoutes');
app.use(userRoutes);

app.get('/',function (req,res) {
    res.render('home')
})

app.listen(info.port,function (err) {
    console.log("Server is running on 3000");
});