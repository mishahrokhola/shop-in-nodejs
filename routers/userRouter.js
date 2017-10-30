var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController');

/**
 * The routes that user need to login to have access
 */
router.get('/logout', userController.isLoggedIn, function (req, res) {
    userController.logOut(req, res);
});

router.get('/profile', userController.isLoggedIn, function (req, res) {
    userController.getUserProfile(req, res);
});

router.post('/add-to-cart/:id', userController.isLoggedIn, function (req, res) {
    userController.addProductToUserCart(req, res);
});

router.get('/remove/:id', userController.isLoggedIn, function (req, res) {
    userController.removeProductFromUserCart(req, res);
});

router.get('/shopping-cart', userController.isLoggedIn, function (req, res) {
    userController.getShoppingCart(req, res);
});

/**
 * The routes that user can visit without login
 */
router.use('/', userController.notLoggedIn, function (req, res, next) {
    next();
});

router.get('/signup',function (req, res) {
    userController.getUserSignUp(req, res);
});

router.get('/signin', function (req, res) {
    userController.getUserSignIn(req, res);
});

router.post('/signup', userController.postUserSignUp, userController.userCart);
router.post('/signin', userController.postUserSignIn, userController.userCart);

module.exports = router;