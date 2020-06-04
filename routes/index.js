const router = require('express').Router();

router.use('/', require('./chat'));
router.use('/auth', require('./auth'));

module.exports = router;