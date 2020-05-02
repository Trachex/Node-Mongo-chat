const {
    Message,
    User
} = require('../models');

exports.init = async (socket) => {
    const initMessages = await Message.find({});
    socket.emit('init', initMessages);
}

exports.message = async (io, msg) => {
    const user = await User.findById(msg.id);
    const newMessage = new Message({
        user: user.username,
        text: msg.text
    });
    await newMessage.save();
    msg.user = user.username;
    io.emit('new message', msg);
}