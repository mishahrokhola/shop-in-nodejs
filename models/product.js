var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/myapp";

/**
 * Method to get category products
 *
 * @param {string} subSubCategoryId contain the bottom category id
 * used to find products from db that have parent category equal subSubCategoryId
 * @example subSubCategoryId = mens-clothing-suits;
 *          returned data will contain all products of mens-clothing-suits category
 * @param cb return error or found data array
 */
exports.getCategoryProductsData = function (subSubCategoryId, cb) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection("products").find({"primary_category_id": subSubCategoryId}, {
            "_id": false,
            "id": true,
            "name": true,
            "price": true,
            "image_groups": true,
            "short_description": true
        }).toArray(function (err, result) {
            if (err) throw err;
            cb(err, result);
            db.close();
        })
    })
};

/**
 * Method to get one product data
 *
 * @param {string} productId - this is id of our searching product
 * @param cb return error or found data array
 */
exports.getProductData = function (productId, cb) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection("products").find({"id": productId}, {"_id": false}).toArray(function (err, result) {
            if (err) throw err;
            cb(err, result);
            db.close();
        })
    })
};

/**
 * Method to get all products that have productName part in the name
 * Also register don't mater in a productName
 * @param {string} productName - this is searching part of product name or product name
 * @param cb return error or found data array
 */
exports.getSearchProductData = function (productName, cb) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        if (productName !== "")
        db.collection("products").find({"name" : {$regex : ".*" + productName + ".*", $options : 'i'}},{"_id": false}).toArray(function (err, result) {
            if (err) throw err;
            cb(err, result);
            db.close();
        });
        else {
            cb(err, "");
            db.close();
        }
    })
};