const cookieParser = require('cookie-parser');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const MongoStore = require('connect-mongo')(session);

require('./mongodb');

const index = require('../routes');
const config = require('../config');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(session({
    key: 'userid',
    resave: false,
    saveUninitialized: false,
    secret: config.session.secret,
    store: new MongoStore({
      url: config.database.uri,
      autoReconnect: true,
      clear_interval: 3600,
    }),
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: (7 * 24 * 60 * 60 * 1000),
    },
  }));

// passport needs to come after session initialization
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '../public')));

app.use('/', index);

// Error handing
app.use((req, res) => {
    res.status(404).send('404')
});
  
app.use((err, req, res, next) => {
    res.send(err);
});
  
process.on('uncaughtException', (err) => {
    console.log(err);
    process.exit(1);
});

module.exports = app;