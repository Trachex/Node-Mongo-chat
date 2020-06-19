const {
    socketHandler
} = require('../controllers');

module.exports = server => {
    const io = require('socket.io').listen(server);

    io.on('connection', async socket => {
        socket.on('newUser', msg => { socketHandler.newUser(socket, msg, io) });
    
        socket.on('message', msg => { socketHandler.message(io, msg) });
    });
}
