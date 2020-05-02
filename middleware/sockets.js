const {
    socketio
} = require('../controllers');

module.exports = (server) => {
    const io = require('socket.io').listen(server);

    io.on('connection', async (socket) => {
        await socketio.init(socket);

        socket.on('message', msg => socketio.message(io, msg));
    });

}