const {
    authService,
    dbService
} = require('../services');

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

        const authInst = new authInst(new dbService());
        const token = await authInst.login(username, password);

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

        const authInst = new authInst(new dbService());
        await authInst.registration(username, password);
        
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