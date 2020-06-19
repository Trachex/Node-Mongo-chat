const jwt = require('jsonwebtoken');

const config = require('../config');
const {
    Room
} = require('../models');

exports.index = async (req, res) => {
    let rooms = [];

    try {
        rooms = await Room.find({});
    } catch(err) {
        console.log(err);
    }

    res.render('chat', { rooms });
}

exports.room = async (req, res) => {
    const name = req.params.room;

    const check = await Room.find({ name });

    if (!check) return res.redirect('/');

    res.render('room', { name });
}

exports.createRoom = async (req, res) => {
    const { name, token } = req.body;

    if (!name || !token) return;

    try {
        const decoded = jwt.verify(token, config.jwt.secret);

        const check = await Room.findOne({ name });

        if (check) return res.json({ success: false, text: 'Room name already taken' });

        const newRoom = new Room({ name, owner: decoded.id });
        await newRoom.save();

    } catch(err) {
        console.log(err);
        res.json({ succsess: false, text: 'Something went wrong' });
    }

    res.json({ succsess: true });
}
