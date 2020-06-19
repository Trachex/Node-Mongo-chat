const jwt = require('jsonwebtoken');
const config = require('../config');

const {
    Message,
    User,
    Room
} = require('../models');

exports.newUser = async (socket, msg, io) => {
    const { room, token } = msg;

    try {
        const decoded = jwt.verify(token, config.jwt.secret);

        const check = await Room.findOne({ name: room });
        if (!check) return;

        const user = await User.findById(decoded.id);
        const msg = await Message.find({ room });

        socket.join(room);
        socket.emit('newUserInit', msg);

        io.sockets.in(room).emit('userConnect', { user: user.username });

    } catch (err) {
        console.log(err);
    }
}

exports.message = async (io, msg) => {
    const { room, text, token } = msg;

    try {
        const decoded = jwt.verify(token, config.jwt.secret);

        const user = await User.findById(decoded.id);

        const newMessage = new Message({
            user: user.username,
            text,
            room
        });

        await newMessage.save();

        io.sockets.in(room).emit('newMessage', { user: user.username, text });

    } catch (err) {
        console.log(err);
    }

}
