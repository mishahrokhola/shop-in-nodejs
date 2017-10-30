var Category = require('../models/category');
var Product = require('../models/product');

/**
 * Methods for handling routes:
 * 1) root:/home
 * 2) root:/home/category
 * 3) root:/home/category/subCategory
 *
 * All doc about get data in models
 *
 * @param {string[]} main_title: - the description at the top of each subCategory
 * @param {string[]} branch_name - the names at the top links
 * @param {string[]} branch_url - the links to each name
 * @param {string[]} butUrl - the link of current page
 * that will be modify at view in "View Products" button.
 * Result: we have link to next category in the button on view
 */

/**
 * Method that pass the main categories (mens/womens) to view (home page)
 * branch_url = 0 because don't need to pass url of Home - we already in home page
 */
exports.getHomeCategories = function (req, res) {
    Category.getHomeCategoriesData(function (err, data) {
        if (err) throw err;

        var branch_name = ["Home"];

        var butUrl = "/home/";

        res.render('./product/category', {
            category: data,
            main_title: 0,
            branch_name: branch_name,
            branch_url: 0,
            butUrl: butUrl
        });
    });
};

/**
 * Method that pass the subCategories (for example: mens-clothing ) to view (/home/mens)
 * branch_url = data[0].name now we pass url to home page
 */
exports.getCategories = function (req, res) {
    Category.getSubCategoriesData(req.params.categoryId, function (err, data) {
        if (err) throw err;

        var branch_url = ["/home"];

        var branch_name = ["Home"];
        branch_name.push(data[0].name);

        var butUrl = "/home/" + data[0].id + "/";

        res.render('./product/category', {
            category: data[0].categories,
            main_title: data[0].page_title,
            branch_name: branch_name,
            branch_url: branch_url,
            butUrl: butUrl
        });
    });
};

/**
 * Method that pass the subSubCategories (for example: mens-clothing-suits) to view (home/mens/mens-clothing)
 */
exports.getSubCategories = function (req, res) {
    Category.getSubCategoriesData(req.params.categoryId, function (err, data) {
        if (err) throw err;

        var branch_url = ["/home"];
        branch_url.push("/home/" + data[0].id);

        var branch_name = ["Home"];
        branch_name.push(data[0].name);

        var butUrl = "/home/" + data[0].id + "/";

        for (var i = 0; i < data[0].categories.length; i++)
            if (data[0].categories[i].id === req.params.subCategoryId) {
                butUrl += data[0].categories[i].id + "/";

                branch_name.push(data[0].categories[i].name);

                res.render('./product/category', {
                    category: data[0].categories[i].categories,
                    main_title: data[0].categories[i].page_title,
                    branch_name: branch_name,
                    branch_url: branch_url,
                    butUrl: butUrl
                });
            }
    });
};

/**
 * Method that pass the products of subSubCategory (for example: mens-clothing-suits products )
 * to view (home/mens/mens-clothing/mens-clothing-suits)
 */
exports.getSubSubCategories = function (req, res) {

    /**
     * get subSubCategory products data from db in model
     * @param {string} req.params.subSubCategoryId - id of the bottom category
     */
    Product.getCategoryProductsData(req.params.subSubCategoryId, function (err, productData) {
        if (err) throw err;

        /**
         * get subSubCategory products data from db in model
         */
        Category.getUrlsBranch(req.params.categoryId, function (err, data) {
            if (err) throw err;

            for (var i = 0; i < data[0].categories.length; i++)
                if (data[0].categories[i].id === req.params.subCategoryId)
                    var catgIndex = i;

            for (var j = 0; j < data[0].categories[catgIndex].categories.length; j++)
                if (data[0].categories[catgIndex].categories[j].id === req.params.subSubCategoryId) {

                    var branch_name = ["Home"];
                    branch_name.push(data[0].name);
                    branch_name.push(data[0].categories[catgIndex].name);
                    branch_name.push(data[0].categories[catgIndex].categories[j].name);

                    var branch_url = ["/home"];
                    branch_url.push("/home/" + data[0].id);
                    branch_url.push("/home/" + data[0].id + "/" + data[0].categories[catgIndex].id);

                    var butUrl = branch_url[branch_url.length - 1] + "/" + data[0].categories[catgIndex].categories[j].id + "/";

                    /**
                     * Divide products to chunkSize part that will be on one row
                     * @type {Array}
                     */
                    var productChunks = [];
                    var chunkSize = 2;

                    for (var k = 0; k < productData.length; k += chunkSize)
                        productChunks.push(productData.slice(k, k + chunkSize))

                    res.render('./product/categoryProducts', {
                        products: productChunks,
                        branch_name: branch_name,
                        branch_url: branch_url,
                        butUrl: butUrl
                    })

                }
        });

    });
};

