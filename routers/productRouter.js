var express = require('express');
var router = express.Router();
var categoryController = require('../controllers/categoryController');
var productController = require('../controllers/productController');


/**
 *  GET home pages
 */
router.get('/', function (req, res) {
    categoryController.getHomeCategories(req, res);
});

router.get('/:categoryId', function (req, res) {
    categoryController.getCategories(req, res);
});

router.get('/:categoryId/:subCategoryId', function (req, res) {
    categoryController.getSubCategories(req, res);
});

router.get('/:categoryId/:subCategoryId/:subSubCategoryId', function (req, res) {
    categoryController.getSubSubCategories(req, res);
});

router.get('/:categoryId/:subCategoryId/:subSubCategoryId/:productId', function (req, res) {
    productController.getProduct(req, res);
});

router.post('/search',function (req, res) {
    productController.getSearchProduct(req, res);
});

module.exports = router;