/**
 * Created by Mars on 2016/8/19.
 */

//passport config
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = global.dao.User;

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne({userName: username}, function (err, user) {
            if (err) {
                console.error(err);
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            if (user.passWord !== password) {
                return done(null, false);
            }
            return done(null, user);
        });
    }
));

//序列化到session中
passport.serializeUser(function (user, done) {
    console.log('serializeUser = ' + user._id);
    done(null, user._id);
});

//从session中反序列化
passport.deserializeUser(function (id, done) {
    console.log('deserializeUser = ' + id)
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
module.exports = passport;