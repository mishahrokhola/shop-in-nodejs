var passport = require('passport');
var Product = require('../models/product');
var User = require('../models/user');
var Cart = require('../models/cart');

/**
 * Methods for handling user routes:
 * 1) root:/user/profile
 * 2) root:/user/signup
 * 3) root:/user/signin
 * 4) root:/user/shopping-cart
 *
 * Methods for passport authenticate:
 * 1)@param postUserSignUp
 * 2)@param postUserSignIn
 * 3)@param facebookUserSignUp
 * 4)@param facebookCallback
 *
 * All doc about get data in models
 *
 * @param req.user - the user from current session
 * @param {object} req.user._id - the user._id from current session
 * @param {string[]} branch_name - the names at the top links
 * @param {string[]} branch_url - the links to each name
 * @param req.flash - array of validation errors
 */


exports.getUserProfile = function (req, res) {
    var firstName;
    var lastName;

    var branch_name = ["Home"];
    branch_name.push("Profile");

    var branch_url = ["/home"];

    User.findById(req.user._id, function (err, user) {
        if (err) throw err;

        if (user.facebook.firstName !== undefined) {
            firstName = user.facebook.firstName;
            lastName = user.facebook.lastName;
        }
        else {
            firstName = user.local.firstName;
            lastName = user.local.lastName;
        }

        res.render('./user/profile', {
            firstName: firstName,
            lastName: lastName,
            branch_name: branch_name,
            branch_url: branch_url
        })
    });
};

exports.getUserSignUp = function (req, res) {
    var messages = req.flash('error');

    var branch_name = ["Home"];
    branch_name.push("Sign Up");

    var branch_url = ["/home"];

    res.render('./user/signup', {
        messages: messages,
        hasErrors: messages.length > 0,
        branch_name: branch_name,
        branch_url: branch_url
    })
};

exports.getUserSignIn = function (req, res) {
    var messages = req.flash('error');

    var branch_name = ["Home"];
    branch_name.push("Sign In");

    var branch_url = ["/home"];

    res.render('./user/signin', {
        messages: messages,
        hasErrors: messages.length > 0,
        branch_name: branch_name,
        branch_url: branch_url
    })
};

exports.getShoppingCart = function (req, res) {
    var branch_name = ["Home"];
    branch_name.push("Shopping Cart");

    var branch_url = ["/home"];

    User.findById(req.user._id, function (err, user) {
        if (err) throw err;

        var cart = new Cart(user.cart ? user.cart : {});

        user.cart = cart;
        var products = cart.generateArray();

        res.render('./user/shopping-cart', {
            product: products,
            totalPrice: user.cart.totalPrice.toFixed(2),
            totalQty: user.cart.totalQty,
            branch_name: branch_name,
            branch_url: branch_url
        })
    })
};

/**
 * Using in routes authenticate callback
 * If User authenticate that will call this method and give him his oldCart
 * or empty if he fist sign in
 */
exports.userCart = function (req, res, next) {
    User.findById(req.user._id, function (err, user) {
        if (err) throw err;

        var cart = new Cart(user.cart ? user.cart : {});
        user.cart = cart;

        req.session.cart = cart;

        user.save(function (err, result) {
            if (err) throw err;
            res.redirect('/home');
        })
    })
};

exports.addProductToUserCart = function (req, res) {
    Product.getProductData(req.params.id, function (err, productData) {
        if (err) throw err;
        User.findById(req.user._id, function (err, user) {
            if (err) throw err;

            var cart = new Cart(user.cart ? user.cart : {});

            cart.add(productData[0], req.params.id);

            user.cart = cart;
            req.session.cart = cart;

            user.save(function (err, result) {
                if (err) throw err;
                res.redirect('/user/shopping-cart');
            })
        });
    })
};

exports.removeProductFromUserCart = function (req, res) {
    User.findById(req.user._id, function (err, user) {
        if (err) throw err;

        var cart = new Cart(user.cart ? user.cart : {});

        cart.removeByOne(req.params.id);

        user.cart = cart;
        req.session.cart = cart;

        user.save(function (err, result) {
            if (err) throw err;
            res.redirect('/user/shopping-cart');
        })
    });
};

/** local authenticate methods */
exports.postUserSignUp = passport.authenticate('local.signup', {
    successRedirect: '/home',
    failureRedirect: '/user/signup',
    failureFlash: true
});

exports.postUserSignIn = passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
});

/** Facebook authenticate methods */
exports.facebookUserSignUp = passport.authenticate('facebook', {scope: ['email']});

exports.facebookCallback = passport.authenticate('facebook', {
    failureRedirect: '/user/signin',
    failureFlash: true
});

/** Clean the req.session.cart and logout */
exports.logOut = function (req, res, next) {
    req.session.cart = null;
    req.logout();
    res.redirect('/home');
};

/** Used in routes to identify is user login */
exports.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/home');
};

exports.notLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) return next();
    res.redirect('/home');
};
