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
        if (!room || !token) throw new Error('Not enough parameters');

        const decoded = jwt.verify(token, config.jwt.secret);

        const check = await Room.findOne({ name: room });
        if (!check) throw new Error('Such room does not exist');

        const user = await User.findById(decoded.id);
        const msg = await Message.find({ room });

        socket.join(room);
        socket.emit('newUserInit', msg);
        socket.user = user.username;

        io.sockets.in(room).emit('userConnect', { user: user.username });

    } catch (err) {
        socket.emit('error', { text: err.message });
    }
}

exports.message = async (io, msg, socket) => {
    const { room, text, token } = msg;

    try {
        if (!room || !text || !token) throw new Error('Not enough parameters');

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
        socket.emit('error', { text: err.message });
    }

}

exports.createRoom = async (io, msg, socket) => {
    const { name, token } = msg;

    try {
        if (!name || !token) throw new Error('Not enough parameters');

        const decoded = jwt.verify(token, config.jwt.secret);

        const check = await Room.findOne({ name });

        if (check) throw new Error('Room name already taken');

        const newRoom = new Room({ name, owner: decoded.id });
        await newRoom.save();

        io.emit('newRoom', { name });

    } catch(err) {
        socket.emit('error', { text: err.message });
    }
}
