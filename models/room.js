const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    owner: {

    }
}, { versionKey: false });

module.exports = mongoose.model('Room', roomSchema);
