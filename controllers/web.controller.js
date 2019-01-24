exports.index = (req, res, next) => {
    if (!req.user) res.redirect('/auth');
    res.render('web');
}