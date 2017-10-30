var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController');

/**
 * The routes for facebook authenticate
 */

router.get('/facebook', userController.facebookUserSignUp);

router.get('/facebook/callback', userController.facebookCallback, userController.userCart);

module.exports = router;