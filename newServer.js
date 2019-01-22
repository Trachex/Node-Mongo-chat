const app = require('./middleware');
const config = require('./config');

const server = app.listen(config.app.port, () => {
    console.log('On');
});

const io = require('./middleware/sockets')(server);