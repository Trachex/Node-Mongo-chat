const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    hash: String,
    salt: String
}, { versionKey: false });

userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    let hashTemp = crypto.createHmac('sha512', this.salt);
    hashTemp.update(password);
    this.hash = hashTemp.digest('hex');
};
userSchema.methods.validPassword = function(pass, user) {
    let hashtemp = crypto.createHmac('sha512', user.salt);
    hashtemp.update(pass);
    let hashcheck = hashtemp.digest('hex');
	return user.hash === hashcheck;
};

module.exports = mongoose.model('Users', userSchema);