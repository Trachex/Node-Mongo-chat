class socketServcie {
    constructor({ socket, io, db }) {
        this._socket = socket;
        this._io = io;
        this._db = db;
    }

    async joinRoom(id, room) {
        const { user, msg } = await this._db.getRoomData(id, room);

        this._socket.join(room);
        this._socket.emit('newUserInit', msg);
        this._socket.user = user.username;

        this._io.sockets.in(room).emit('userConnect', { user: user.username });
    }

    async message(id, text, room) {
        const user = await this._db.saveMessage(id, text, room);

        this._io.sockets.in(room).emit('newMessage', { user, text });
    }

    async createRoom(id, name) {
        await this._db.createRoom(id, name);
        this._io.emit('newRoom', { name });
    }
}

module.exports = socketServcie;