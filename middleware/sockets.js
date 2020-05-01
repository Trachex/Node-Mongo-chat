const {
    Message,
    User
} = require('../models');

module.exports = (server) => {
    const io = require('socket.io').listen(server);

    io.on('connection', async (socket) => {
        const initMessages = await Message.find({});
        socket.emit('init', initMessages);

        socket.on('message', async (msg) => {
            const user = await User.findById(msg.id);
            const newMessage = new Message({
                user: user.username,
                text: msg.text
            });
            await newMessage.save();
            msg.user = user.username;
            io.emit('new message', msg);
        });
        
    });
}