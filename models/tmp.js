const mongoose = require('mongoose');

const tmpSchema = new mongoose.Schema({
    id: String,
    user: String
}, { versionKey: false });

module.exports = mongoose.model('tmp', tmpSchema);