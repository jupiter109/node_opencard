var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log(req.session.passport);
    console.log("req.isAuthenticated = " + req.isAuthenticated());
    res.render('index', {title: 'Express'});
});

module.exports = router;
