var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/myapp";

/**
 * Return the only main categories data (Mens/Womens)
 *
 * @param cb return error or found data array
 */
exports.getHomeCategoriesData = function (cb) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection("categories").find({},
            {
                "_id": false,
                "id": true,
                "name": true,
                "page_description": true,
                "page_title": true,
                "parent_category_id": true
            }
        ).toArray(function (err, result) {
            if (err) throw err;
            cb(err, result);
            db.close();
        })
    })
};

/**
 * @param {string} categoryId - use to find in db the subCategories of categoryId
 * @example if categoryId = mens; returned data will contain mens-clothing and mens-accessories data
 * @param cb return error or found data array
 */
exports.getSubCategoriesData = function (categoryId, cb) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection("categories").find({"id": categoryId}).toArray(function (err, result) {
            if (err) throw err;
            cb(err, result);
            db.close();
        })
    })
};

/**
 * @param {string} categoryId - use to find in db the categoryId data
 *                 and all subCategories data with only name and id
 * @param cb return error or found data array
 */
exports.getUrlsBranch = function (categoryId, cb) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection("categories").find({"id": categoryId}, {
            "_id": false,
            "id": true,
            "name": true,
            "categories.id": true,
            "categories.name": true,
            "categories.categories.id": true,
            "categories.categories.name": true
        }).toArray(function (err, result) {
            if (err) throw err;
            cb(err, result);
            db.close();
        })
    })
};