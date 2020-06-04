const {
    socketHandler
} = require('../controllers');

module.exports = (server) => {
    const io = require('socket.io').listen(server);

    io.on('connection', async (socket) => {
        await socketHandler.init(socket);

        socket.on('message', msg => socketHandler.message(io, msg));
    });

}