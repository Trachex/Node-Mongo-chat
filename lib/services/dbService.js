const {
    Message,
    User,
    Room
} = require('../models');

class dbServcie {
    async getUserByName(username) {
        const user = await User.findOne({ username });
        return user;
    }

    async getRoomData(id, room) {
        const check = await Room.findOne({ name: room });
        if (!check) throw new Error('Such room does not exist');

        const user = await User.findById(id);
        const msg = await Message.find({ room });

        return { user, msg };
    }

    async saveMessage(id, text, room) {
        const user = await User.findById(id);

        const newMessage = new Message({
            user: user.username,
            text,
            room
        });

        await newMessage.save();

        return user.username;
    }

    async createRoom(owner, name) {
        const check = await Room.findOne({ name });
        if (check) throw new Error('Room name already taken');

        const newRoom = new Room({ name, owner });
        await newRoom.save();
    }

    async createUser(username, password) {
        const newUser = new User({
            username
        });

        newUser.setPassword(password);
        await newUser.save();
    }
}

module.exports = dbServcie;