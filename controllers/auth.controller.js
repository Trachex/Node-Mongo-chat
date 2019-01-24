const {
    User,
    Tmp
} = require('../models');

exports.index = (req, res, next) => {
    res.render('reg');
}

exports.logout = (req, res, next) => {
    req.logOut();
    res.redirect('/auth');
}

exports.getId = async (req, res, next) => {
    if (!req.user) return;
    try {
        const check = await Tmp.findOne({ id: req.session.id });
        if (!check) {
            const keyValue = new Tmp({
                id: req.session.id,
                user: req.user.username
            });
            await keyValue.save();
        }
    } catch (err) {
        console.log(err);
    }
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