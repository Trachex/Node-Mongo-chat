const app = require('./lib/middleware');
const config = require('./config');

const server = app.listen(config.app.port, () => {
    console.log('On');
});

require('./lib/middleware/sockets')(server);