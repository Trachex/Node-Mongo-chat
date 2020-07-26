const router = require('express').Router();

const {
    chat
} = require('../controllers');

router.get('/', chat.index);
router.get('/room/:room', chat.room);

module.exports = router;