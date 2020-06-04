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

    if (!username || !password) {
        return res.json({
            success: false,
            text: 'Not enougth parameters'
        })
    }

    try {
        const user = await User.findOne({ username });

        if (!user) return res.json({
            success: false,
            text: 'User not found'
        });

        if (!user.validPassword(password, user)) res.json({
            success: false,
            text: 'Password is wrong'
        });

        const token = user.generateJWT();

        res.json({
            success: true,
            token
        });

    } catch (err) {
        console.log(err);
        return res.json({
            success: false,
            text: 'Something went wrong'
        });
    }
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