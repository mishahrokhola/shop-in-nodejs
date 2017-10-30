/**Constructor function Cart
 *
 * If oldCart undefined we create a new cart with define variable
 * @param oldCart {{items: string[], totalQty: number, totalPrice: number}}
 */
module.exports = function Cart(oldCart) {
    /** @type {string[]} - products data */
    this.items = oldCart.items || {};

    /** @type {number} */
    this.totalQty = oldCart.totalQty || 0;

    /** @type {number} */
    this.totalPrice = oldCart.totalPrice || 0;

    /**
     * Add the product item to the cart
     * If items are not exist - create new {item: item, qty: 0, price: 0}
     * than increase the items qty and price
     * If items exist - increase the items qty and price
     *
     * Also increased the totalQty and totalPrice Cart
     *
     * @param {string []} item - this is a product that we would like to add to the cart
     * @param {string} id - this is a ID of product we want to add
     */
    this.add = function (item, id) {
        var storedItem = this.items[id];
        if(!storedItem) storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        storedItem.qty ++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty ++;
        this.totalPrice += storedItem.item.price;

    };

    /**
     * Remove the product from cart function
     * Decreased the items qty and price and if qty will became equal 0 than delete from Cart
     *
     * Also decreased the totalQty and totalPrice Cart
     *
     * @param {string} id - this is a ID of product we want to remove
     */
    this.removeByOne = function (id) {
        this.items[id].qty --;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;

        if(this.items[id].qty <= 0) delete this.items[id];
    };

    /**
     * Generate the array of items in cart with number index (0,1,2 etc)
     * @returns {Array}
     */
    this.generateArray = function () {
        var arr = [];
        for (var id in this.items) arr.push(this.items[id]);
        return arr;
    }
};