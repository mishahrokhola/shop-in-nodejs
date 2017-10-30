var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var configAuth = require('./auth');
var User = require('../models/user');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use('local.signup', new LocalStrategy({
    firstNameField: 'firstName',
    lastNameField: 'lastName',
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, firstName, lastName, email, password, done) {

    /** Validation part */
    req.checkBody('firstName', 'First Name Field is empty').notEmpty();
    req.checkBody('lastName', 'Last Name Field is empty').notEmpty();
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password: passwords must be at least 5 chars long').notEmpty().isLength({min: 5});
    req.checkBody('password', 'Invalid password: passwords must contain one number').notEmpty().matches(/\d/);

    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages))
    }
    User.findOne({'local.email': email}, function (err, user) {
        if (err) return done(err);

        if (user) return done(null, false, {message: 'Email is already in use.'});

        var newUser = new User();
        newUser.local.firstName = firstName;
        newUser.local.lastName = lastName;
        newUser.local.email = email;
        newUser.local.password = newUser.encryptPassword(password);
        newUser.save(function (err, result) {
            if (err) return done(err);
            return done(null, newUser);
        })
    })
}));

passport.use('local.signin', new LocalStrategy({
    firstNameField: 'firstName',
    lastNameField: 'lastName',
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, firstName, lastName, email, password, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages))
    }
    User.findOne({'local.email': email}, function (err, user) {
        if (err) return done(err);

        if (!user) return done(null, false, {message: 'No user found.'});

        if (!user.validPassword(password)) return done(null, false, {message: 'Wrong password.'});

        return done(null, user)
    })
}));

passport.use('facebook', new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        passReqToCallback : true,
        profileFields: ['id','emails', 'name']
    }, function (req, accessToken, refreshToken, profile, done) {
        User.findOne({'facebook.id': profile.id}, function (err, user) {
            if (err) return done(err);
            if (user) return done(null, user);
            else {
                var newUser = new User();
                newUser.facebook.id = profile.id;
                newUser.facebook.token = accessToken;
                newUser.facebook.firstName = profile.name.givenName;
                newUser.facebook.lastName = profile.name.familyName;
                newUser.facebook.email = profile.emails[0].value;

                newUser.save(function (err, user) {
                    if (err) throw err;
                    return done(null, newUser);
                })
            }
        });
    }
));