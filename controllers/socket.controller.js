const jwt = require('jsonwebtoken');
const config = require('../config');

const {
    Message,
    User
} = require('../models');

exports.init = async socket => {
    const initMessages = await Message.find({});
    socket.emit('init', initMessages);
}

exports.message = async (io, msg) => {
    try {
        const decoded = jwt.verify(msg.token, config.jwt.secret);

        const user = await User.findById(decoded.id);

        const newMessage = new Message({
            user: user.username,
            text: msg.text
        });

        await newMessage.save();

        const newMsg = {
            text: msg.text,
            user: user.username
        };
        io.emit('new message', newMsg);

    } catch (err) {
        console.log(err);
    }
}