var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

mongoose.connect('mongodb://localhost:27017/myapp', { useMongoClient: true});
/**
 * User model
 * Have two variation of user : local or facebook
 * and cart for this user
 */
var userSchema = new Schema({
    local: {
        firstName: {type: String},
        lastName: {type: String},
        email: {type: String},
        password: {type: String}
    },
    facebook:{
        id: {type: String},
        token: {type: String},
        firstName: {type: String},
        lastName: {type: String},
        email: {type: String}
    },
    cart: {type: Object}
});

/**
 * Hash the password
 * @param {string} password that need to be hashed
 * @return the hashed password
 */
userSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

/**
 * Compare passwords
 * @param {string} password that need to be compared
 * @return {bool}
 */
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password)
};

module.exports = mongoose.model('User', userSchema);

