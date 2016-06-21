var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
	res.render('dashboard/settings/index', { title: 'Settings' });
});

module.exports = router;
