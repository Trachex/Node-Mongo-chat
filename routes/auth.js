const router = require('express').Router();
const passport = require('passport');

require('../middleware/auth');

// const {
//     auth
// } = require('../controllers');

router.get('/logout', auth.logout);
router.post('/login', passport.authenticate('local'), auth.login);
router.post('/registration', auth.registration);

router.get('/', auth.reg);