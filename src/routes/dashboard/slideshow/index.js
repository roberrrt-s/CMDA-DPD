var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
	res.render('dashboard/slideshow/index', { title: 'Slideshows' });
});

router.get('/new/', function(req, res) {
	res.render('dashboard/slideshow/new', { title: 'New'});
});

router.get('/edit/', function(req, res) {
	res.render('dashboard/slideshow/edit', { title: 'Edit'});
});

router.get('/delete/', function(req, res) {
	res.render('dashboard/slideshow/delete', { title: 'Delete'});
});

module.exports = router;
