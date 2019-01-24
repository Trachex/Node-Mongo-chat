const {
    Tmp,
    Message
} = require('../models');

module.exports = (server) => {
    const io = require('socket.io').listen(server);

    io.on('connection', async (socket) => {
        const initMessages = await Message.find({});
        socket.emit('init', initMessages);

        socket.on('message', async (msg) => {
            const username = await Tmp.findOne({ id: msg.user });
            const newMessage = new Message({
                user: username.user,
                text: msg.text 
            });
            await newMessage.save();
            msg.user = username.user;
            io.emit('new message', msg);
        });
        
    });
}