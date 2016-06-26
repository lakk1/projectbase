var express = require('express'),
    app = express();
var morgan = require('morgan');
var fs = require('fs');
var path = require('path');
var ejs  = require('ejs');
var ejsMate  = require('ejs-mate');
var info = require("./info");

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})

//middleware
// setup the logger
app.use(morgan("dev",{stream:accessLogStream}));
app.engine('ejs',ejsMate);
app.set('view engine','ejs');


app.get('/',function (req,res) {
    res.render('home')
})

app.listen(3000,function (err) {
    console.log("Server is running on 3000");
});