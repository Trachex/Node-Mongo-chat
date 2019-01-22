const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    user:{
        type: String,
        required: true
    },
    text:{
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Messages', messageSchema);