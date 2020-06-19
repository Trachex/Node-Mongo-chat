const router = require('express').Router();

const {
    chat
} = require('../controllers');

router.get('/', chat.index);
router.get('/:room', chat.room);
router.post('/create', chat.createRoom);

module.exports = router;