var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
	res.render('dashboard/content/index', { title: 'Content' });
});

router.get('/new/', function(req, res) {
	res.render('dashboard/content/new', { title: 'New'});
});

router.get('/edit/', function(req, res) {
	res.render('dashboard/content/edit', { title: 'Edit'});
});

router.get('/delete/', function(req, res) {
	res.render('dashboard/content/delete', { title: 'Delete'});
});

module.exports = router;
