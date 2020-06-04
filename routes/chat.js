const router = require('express').Router();

const {
    chat
} = require('../controllers');

router.get('/', chat.index);

module.exports = router;