const {
    socketHandler
} = require('../controllers');

module.exports = server => {
    const io = require('socket.io').listen(server);

    io.on('connection', async socket => {
        socket.on('newUser', msg => { socketHandler.newUser(socket, msg, io); });
    
        socket.on('message', msg => { socketHandler.message(io, msg, socket) });

        socket.on('createRoom', msg => { socketHandler.createRoom(io, msg, socket) });

        socket.on('disconnecting', () => {

            if (socket.user) {
                const rooms = Object.keys(socket.rooms);

                rooms.forEach(room => {
                    io.sockets.in(room).emit('userDisconnect', { user: socket.user });
                });
            }

        });
    });
}
