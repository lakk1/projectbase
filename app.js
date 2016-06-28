var express = require('express'),
    app = express();

var fs = require('fs');
var path = require('path');
var morgan = require('morgan');

var ejs  = require('ejs');
var ejsMate  = require('ejs-mate');

var bodyParser = require('body-parser');
var session =require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);

var passport = require('passport');

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
app.use(express.static('public'));
app.use(express.static('public/lib'));

app.engine('ejs',ejsMate);
app.set('view engine','ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret:info.secretKey,
    store : new MongoStore({url:info.db,autoReconnect:true})
    }));
app.use(flash())
app.use(passport.initialize());
app.use(passport.session())

app.use(function (req,res,next) {
    res.locals.user = req.user;
    next()
})

app.get('/',function (req,res) {

    res.render('home')
})

var userRoutes = require('./routes/userRoutes');
app.use(userRoutes);



app.listen(3001,function (err) {
    console.log("Server is running on 3000");
});