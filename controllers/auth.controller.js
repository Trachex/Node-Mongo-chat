const {
    User
} = require('../models');
const redis = require('redis').client;

exports.index = (req, res, next) => {
    res.render('reg');
}

exports.logout = (req, res, next) => {
    req.logOut();
    res.redirect('/auth');
}

exports.getId = async (req, res, next) => {
    if (!req.user) return;
    await redis.set(req.session.id, JSON.stringify({ user: req.user.username }));
    res.json({
        sessionId: req.session.id
    });
}

exports.login = (req, res) => {
    res.redirect('/');
}

exports.registration = async (req, res) => {
    const {
        username,
        password
    } = req.body;

    if (!username || !password) {
        return res.json({
            success: false,
            text: 'Not enougth parameters'
        })
    }

    try {
        const test = await User.findOne({ username });
        if (test) return res.json({
            success: false,
            text: 'Username already taken'
        });

        const newUser = new User({
            username
        });

        newUser.setPassword(password);
        await newUser.save();
        
        res.json({
            success: true
        });

    } catch (err) {
        console.log(err);
        return res.json({
            success: false,
            text: 'Something went wrong'
        });
    }

}