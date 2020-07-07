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
