const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
    },
    room: {
        type: String
    }
});

module.exports = mongoose.model('Messages', messageSchema);