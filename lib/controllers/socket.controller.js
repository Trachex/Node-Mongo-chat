const jwt = require('jsonwebtoken');
const config = require('../../config');

const {
    socketService,
    dbService
} = require('../services');

exports.newUser = async (socket, msg, io) => {
    const { room, token } = msg;

    try {
        if (!room || !token) throw new Error('Not enough parameters');
        const decoded = jwt.verify(token, config.jwt.secret);

        const socketInst = new socketService({ socket, io, db: new dbService() });
        await socketInst.joinRoom(decoded.id, room);

    } catch (err) {
        socket.emit('serverError', { text: err.message });
    }
}

exports.message = async (io, msg, socket) => {
    const { room, text, token } = msg;

    try {
        if (!room || !text || !token) throw new Error('Not enough parameters');
        const decoded = jwt.verify(token, config.jwt.secret);

        const socketInst = new socketService({ socket, io, db: new dbService() });
        await socketInst.message(decoded.id, text, room);

    } catch (err) {
        socket.emit('serverError', { text: err.message });
    }

}

exports.createRoom = async (io, msg, socket) => {
    const { name, token } = msg;

    try {
        if (!name || !token) throw new Error('Not enough parameters');
        const decoded = jwt.verify(token, config.jwt.secret);

        const socketInst = new socketService({ socket, io, db: new dbService() });
        await socketInst.createRoom(decoded.id, name);

    } catch(err) {
        socket.emit('serverError', { text: err.message });
    }
}
