const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { auth } = require('../../lib/controllers');
const { User } = require('../../lib/models');
const config = require('../../config');

describe('Login tests', () => {

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

    afterEach(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('should complete successfully', async () => {
        const req = { body: {
            username: 'user',
            password: 'pass'
        }};
        const res = {
            json: jest.fn()
        };

        const testUser = new User({ username: req.body.username });
        testUser.setPassword(req.body.password);
        const { _id } = await testUser.save();
        
        await auth.login(req, res);

        const response = res.json.mock.calls[0][0];
        const decoded = jwt.verify(response.token, config.jwt.secret);

        expect(response).toMatchObject({ success: true });
        expect(`${_id}`).toBe(decoded.id);
    });

    test('should throw on validation', async () => {
        const req = { body: {
            username: '',
            password: ''
        }};
        const res = {
            json: jest.fn()
        };

        await auth.login(req, res);

        expect(res.json).toHaveBeenCalledWith({ success: false, text: 'Not enough parameters' });
    });

    test('should throw when user not found', async () => {
        const req = { body: {
            username: 'none',
            password: 'none'
        }};
        const res = {
            json: jest.fn()
        };

        await auth.login(req, res);

        expect(res.json).toHaveBeenCalledWith({ success: false, text: 'User not found' });
    });

    test('should throw when password is wrong', async () => {
        const req = { body: {
            username: 'none',
            password: 'wrong'
        }};
        const res = {
            json: jest.fn()
        };

        const testUser = new User({ username: req.body.username });
        testUser.setPassword('other password');
        await testUser.save();

        await auth.login(req, res);

        expect(res.json).toHaveBeenCalledWith({ success: false, text: 'Password is wrong' });
    });
});

describe('Registration tests', () => {

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

    afterEach(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });


    test('should complete successfully', async () => {
        const req = { body: {
            username: 'username',
            password: 'password'
        }};
        const res = {
            json: jest.fn()
        };

        await auth.registration(req, res);

        const testUser = await User.findOne({ username: req.body.username });

        expect(res.json).toHaveBeenCalledWith({ success: true });
        expect(testUser.username).toBe(req.body.username);
    });

    test('should throw on validation', async () => {
        const req = { body: {
            username: '',
            password: ''
        }};

        const res = {
            json: jest.fn()
        };

        await auth.registration(req, res);

        expect(res.json).toHaveBeenCalledWith({ success: false, text: 'Not enough parameters' });
    });

    test('should throw when username already taken', async () => {
        const req = { body: {
            username: 'username',
            password: 'password'
        }};
        const res = {
            json: jest.fn()
        };

        const testUser = new User({ username: req.body.username });
        await testUser.save();

        await auth.registration(req, res);

        expect(res.json).toHaveBeenCalledWith({ success: false, text: 'Username already taken' });
    });

});