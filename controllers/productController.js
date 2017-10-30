var Category = require('../models/category');
var Product = require('../models/product');

/**
 * Methods for handling routes:
 * 1) root:/home/category/subCategory
 * 2) root:/home/search
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
 * Method that pass the one product to view
 */
exports.getProduct = function (req, res) {
    Product.getProductData(req.params.productId, function (err, productData) {
        if (err) throw err;
        Category.getUrlsBranch(req.params.categoryId, function (err, data) {
            if (err) throw err;

            for (var i = 0; i < data[0].categories.length; i++)
                for (var j = 0; j < data[0].categories[i].categories.length; j++)
                    if (data[0].categories[i].categories[j].id === req.params.subSubCategoryId) {

                        var branch_name = ["Home"];
                        branch_name.push(data[0].name);
                        branch_name.push(data[0].categories[i].name);
                        branch_name.push(data[0].categories[i].categories[j].name);
                        branch_name.push(productData[0].name);

                        var branch_url = ["/home"];
                        branch_url.push("/home/" + data[0].id);
                        branch_url.push("/home/" + data[0].id + "/" + data[0].categories[i].id);
                        branch_url.push("/home/" + data[0].id + "/" + data[0].categories[i].id + "/" + data[0].categories[i].categories[j].id);

                        res.render('./product/product', {
                            product: productData[0],
                            branch_name: branch_name,
                            branch_url: branch_url
                        })
                    }
        });
    });
};

/**
 * Method that pass the found products to view
 */
exports.getSearchProduct = function (req, res) {

    /** @param {string} req.body.searchName - get the search product name from search input*/
    Product.getSearchProductData(req.body.searchName, function (err, productData) {
        if (err) throw err;

        var branch_name = ["Home"];

        /** Show the searching part in branch_name */
        branch_name.push("Search" + " - " + req.body.searchName);

        var branch_url = ["/home"];

        res.render('search', {
            product: productData,
            branch_name: branch_name,
            branch_url: branch_url
        })
    })
};