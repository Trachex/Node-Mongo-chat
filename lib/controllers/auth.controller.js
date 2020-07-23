const {
    User
} = require('../models');

exports.index = (req, res, next) => {
    res.render('auth');
}

exports.login = async (req, res) => {
    const {
        username,
        password
    } = req.body;

    try {
        if (!username || !password) throw new Error('Not enough parameters');

        const user = await User.findOne({ username });

        if (!user) throw new Error('User not found');

        if (!user.validPassword(password, user)) throw new Error('Password is wrong');

        const token = user.generateJWT();

        res.json({
            success: true,
            token
        });

    } catch (err) {
        return res.json({
            success: false,
            text: err.message
        });
    }
}

exports.registration = async (req, res) => {
    const {
        username,
        password
    } = req.body;

    try {
        if (!username || !password) throw new Error('Not enough parameters');

        const test = await User.findOne({ username });
        if (test) throw new Error('Username already taken');

        const newUser = new User({
            username
        });

        newUser.setPassword(password);
        await newUser.save();
        
        res.json({
            success: true
        });

    } catch (err) {
        return res.json({
            success: false,
            text: err.message
        });
    }

}