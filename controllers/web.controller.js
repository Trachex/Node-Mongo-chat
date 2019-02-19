exports.index = (req, res, next) => {
    if (!req.user) return res.redirect('/auth');
    res.render('web');
}