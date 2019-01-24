const router = require('express').Router();

const {
    web
} = require('../controllers');

router.get('/', web.index);

module.exports = router;