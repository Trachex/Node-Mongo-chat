const mongoose = require('mongoose');
const { socketHandler } = require('../../lib/controllers');
const { 
    Room,
    User,
    Message
} = require('../../lib/models');

describe('newUser tests', () => {

    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017', 
        { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
        (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });

    beforeEach(async () => {
        await User.deleteMany({});
        await Room.deleteMany({});
        await Message.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('should complete succsessfully', async () => {
        const msg = {
            room: 'test'
        };
        const testMessages = [
            { user: 'John', text: 'Hi', room: msg.room },
            { user: 'Max', text: 'Hello', room: msg.room },
            { user: 'Anon', text: 'Test', room: msg.room }
        ];
        const socket = {
            join: jest.fn(),
            emit: jest.fn()
        };
        const emit = { emit: jest.fn() }
        const io = { sockets: { in: jest.fn().mockReturnValueOnce(emit) } };

        const testRoom = new Room({ name: msg.room });
        await testRoom.save();
        const testUser = new User({
            username: 'test'
        });
        await testUser.save();
        msg.token = testUser.generateJWT();
        await Message.collection.insertMany(testMessages);

        await socketHandler.newUser(socket, msg, io);

        const testMsg = await Message.find({ room: msg.room });

        expect(socket.join).toBeCalledWith(msg.room);
        expect(socket.emit).toBeCalledWith('newUserInit', testMsg);
        expect(socket.user).toBe(testUser.username);
        expect(io.sockets.in).toBeCalledWith(msg.room);
        expect(emit.emit).toBeCalledWith('userConnect', { user: testUser.username });
    });

    test('should throw when not enough parameters', async () => {
        const msg = {};
        const socket = {
            emit: jest.fn()
        };

        await socketHandler.newUser(socket, msg);

        expect(socket.emit).toBeCalledWith('serverError', { text: 'Not enough parameters' });
    });

    test('should throw when token is invalid', async () => {
        const msg = {
            room: 'test',
            token: 'invalid'
        };
        const socket = {
            emit: jest.fn()
        };

        await socketHandler.newUser(socket, msg);

        expect(socket.emit).toBeCalledWith('serverError', { text: 'jwt malformed' });
    });

    test('should throw when room doesn`t exist', async () => {
        const msg = {
            room: 'test'
        };
        const socket = {
            emit: jest.fn()
        };

        const testUser = new User({
            username: 'test'
        });
        await testUser.save();
        msg.token = testUser.generateJWT();

        await socketHandler.newUser(socket, msg);

        expect(socket.emit).toBeCalledWith('serverError', { text: 'Such room does not exist' });
    });
});

describe('message tests', () => {

    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017', 
        { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
        (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });

    beforeEach(async () => {
        await User.deleteMany({});
        await Room.deleteMany({});
        await Message.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('should complete succsessfully', async () => {
        const msg = {
            room: 'test',
            text: 'sample text'
        };

        const testUser = new User({
            username: 'test'
        });
        await testUser.save();
        msg.token = testUser.generateJWT();

        const emit = { emit: jest.fn()}
        const io = { sockets: { in: jest.fn().mockReturnValueOnce(emit) } };

        await socketHandler.message(io, msg);

        const check = await Message.findOne({ user: testUser.username, text: msg.text });

        expect(io.sockets.in).toBeCalledWith(msg.room);
        expect(check.user).toBe(testUser.username);
        expect(check.text).toBe(msg.text);
        expect(emit.emit).toBeCalledWith('newMessage', { user: testUser.username, text: msg.text });
    });

    test('should throw when not enough parameters', async () => {
        const msg = {};
        const socket = {
            emit: jest.fn()
        };

        await socketHandler.message({}, msg, socket);

        expect(socket.emit).toBeCalledWith('serverError', { text: 'Not enough parameters' });
    });

    test('should throw when token is invalid', async () => {
        const msg = {
            room: 'test',
            text: 'none',
            token: 'invalid'
        };
        const socket = {
            emit: jest.fn()
        };

        await socketHandler.message({}, msg, socket);

        expect(socket.emit).toBeCalledWith('serverError', { text: 'jwt malformed' });
    });
});

describe('createRoom tests', () => {

    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017', 
        { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
        (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });

    beforeEach(async () => {
        await User.deleteMany({});
        await Room.deleteMany({});
        await Message.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('should complete succsessfully', async () => {
        const msg = {
            name: 'test'
        };

        const testUser = new User({
            username: 'test'
        });
        await testUser.save();
        msg.token = testUser.generateJWT();
        const io = { emit: jest.fn() };

        await socketHandler.createRoom(io, msg);

        const check = await Room.findOne({ name: msg.name });

        expect(check.name).toBe(msg.name);
        expect(check.owner).toBe(`${testUser._id}`);
        expect(io.emit).toBeCalledWith('newRoom', { name: msg.name });
    });

    test('should throw when not enough parameters', async () => {
        const msg = {};
        const socket = {
            emit: jest.fn()
        };

        await socketHandler.createRoom({}, msg, socket);

        expect(socket.emit).toBeCalledWith('serverError', { text: 'Not enough parameters' });
    });

    test('should throw when token is invalid', async () => {
        const msg = {
            name: 'sample',
            token: 'invalid'
        };
        const socket = {
            emit: jest.fn()
        };

        await socketHandler.createRoom({}, msg, socket);

        expect(socket.emit).toBeCalledWith('serverError', { text: 'jwt malformed' });
    });

    test('should throw when room name already taken', async () => {
        const msg = {
            name: 'sample',
        };
        const socket = {
            emit: jest.fn()
        };

        const testUser = new User({
            username: 'test'
        });
        await testUser.save();
        msg.token = testUser.generateJWT();
        const takenRoom = new Room({
            name: msg.name
        });
        await takenRoom.save();

        await socketHandler.createRoom({}, msg, socket);

        expect(socket.emit).toBeCalledWith('serverError', { text: 'Room name already taken' });
    });
});