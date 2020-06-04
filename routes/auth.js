const router = require('express').Router();

const {
    auth
} = require('../controllers');

router.get('/', auth.index);
router.post('/login', auth.login);
router.post('/registration', auth.registration);

module.exports = router;