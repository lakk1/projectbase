var router = require('express').Router();
var User = require('../models/user.model');
router.get('/login',function (req,res) {
    res.render('login')
})
router.get('/signup',function (req,res,next) {
    res.render('signup',{
        errors:req.flash('errors')
    })
    next();
});
router.post('/signup',function (req,res,next) {
    var user = new User();
    user.email = req.body.email;
    user.profile.name = req.body.name;
    user.password =req.body.password;

    User.findOne({email:req.body.email},function (err,euser) {
        if(euser){
            req.flash('errors','Email already exist')
            return res.redirect('/signup')
        }else{
            user.save(function (err) {
                if(err) return next(err);
                res.redirect('/profile')
            })
        }

    })


})
router.get('/profile',function (req,res) {
    res.render("profile")
})
module.exports = router;