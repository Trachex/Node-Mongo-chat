const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const {
    User
} = require('../models');

passport.use(new LocalStrategy({},
    (username, password, done) => {
        User.findOne({username})
        .then((user) => {
            if (!user) return done('User  not found', null);
            else if (!user.validPassword(password, user)) return done('Password is wrong' , null);
            else done(null, user);
        })
        .catch(err => done(err));
    })
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});