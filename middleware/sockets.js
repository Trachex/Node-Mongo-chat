const {
    Message
} = require('../models');
const redis = require('redis').client;

module.exports = (server) => {
    const io = require('socket.io').listen(server);

    io.on('connection', async (socket) => {
        const initMessages = await Message.find({});
        socket.emit('init', initMessages);

        socket.on('message', async (msg) => {
            const {
                user
            } = JSON.parse(await redis.get(msg.user));
            console.log(user);
            const newMessage = new Message({
                user,
                text: msg.text 
            });
            await newMessage.save();
            msg.user = user;
            io.emit('new message', msg);
        });
        
    });
}