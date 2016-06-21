var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
	res.render('dashboard/index', { title: 'Home' });
});

router.get('/login/', function (req, res) {
	res.render('dashboard/login', { title: 'Login'});
});

router.get('/register/', function (req, res) {
	res.render('dashboard/register', { title: 'Register'});
});

module.exports = router;
