var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('index', {user: req.user});
});

router.get('/login', function (req, res) {
    res.render('login', {user: req.user});
});

router.post('/login', passport.authenticate('local'), function (req, res) {
    res.redirect('/');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function (req, res) {
    res.status(200).send("pong!");
});

module.exports = router;