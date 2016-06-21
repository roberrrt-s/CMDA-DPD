var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
	res.render('dashboard/screen/index', { title: 'Screens' });
});

router.get('/new/', function(req, res) {
	res.render('dashboard/screen/new', { title: 'New'});
});

router.get('/edit/', function(req, res) {
	res.render('dashboard/screen/edit', { title: 'Edit'});
});

router.get('/delete/', function(req, res) {
	res.render('dashboard/screen/delete', { title: 'Delete'});
});

module.exports = router;
