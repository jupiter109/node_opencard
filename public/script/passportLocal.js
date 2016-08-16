/**
 * Created by Mars on 2016/8/16.
 */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(function (username, password, done) {
    const User = global.User;
    User.findOne({userName: username}, function (err, user) {
        if (err) {
            done(err, null);
        }
        if (!user) {
            done(null, false);
        }
        if (user.passWord != password) {
            done(null, false);
        }
        return done(null, user);
    })
}));

passport.serializeUser(function (user, callback) {
    callback(null, user.userName);
});

passport.deserializeUser(function (id, cb) {
    const User = global.User;
    User.findOne({userName: id}, function (err, user) {
        if (err) {
            console.error(err);
            cb(err, null);
        }
        cb(null, user);
    });
});

module.exports = passport;