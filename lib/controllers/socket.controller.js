const jwt = require('jsonwebtoken');
const config = require('../../config');

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
        socket.user = user.username;

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

exports.createRoom = async (io, msg) => {
    const { name, token } = msg;

    if (!name || !token) return;

    try {
        const decoded = jwt.verify(token, config.jwt.secret);

        const check = await Room.findOne({ name });

        if (check) return;

        const newRoom = new Room({ name, owner: decoded.id });
        await newRoom.save();

    } catch(err) {
        console.log(err);
    }

    io.emit('newRoom', { name })
}
