const router = require('express').Router();

router.use('/', require('./web'));
router.use('/auth', require('./auth'));

module.exports = router;