const router = require('express').Router();
const passport = require('passport');

require('../middleware/auth');

const {
    auth
} = require('../controllers');

router.get('/', auth.index);
router.get('/logout', auth.logout);
router.get('/getid', auth.getId);
router.post('/login', passport.authenticate('local'), auth.login);
router.post('/registration', auth.registration);

module.exports = router;