const mongoose = require('mongoose');
const config = require('../config');

mongoose.Promise = global.Promise;

mongoose.connect(config.database.uri, config.database.options)
  .then(() => console.log('Connection to mongoDB is successful'))
  .catch(err => console.log(err));

module.exports = mongoose;