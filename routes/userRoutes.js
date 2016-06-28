var router = require('express').Router();
var User = require('../models/user.model');
var passport = require('passport');
var passportConf = require('../config/passportconfig')



router.get('/login',function (req,res) {
    if(req.user) return res.redirect('/profile')
    res.render('login',{message:req.flash('loginMessage')})
})
router.post('/login',passport.authenticate('local-login',{
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFLash: true
} ));

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
                req.login(user,function (err) {
                    if(err) return next(err);
                    res.redirect('/profile')
                })
            })
        }

    })


})
router.get('/profile',function (req,res,next) {
    User.findOne({ _id:req.user._id},function (err,user) {
        if(err) return next(err)
        res.render("profile",{user:user})
    })

})
router.get('/logout',function (req,res) {
    req.logout();
    res.redirect('/');
})
module.exports = router;