var express = require('express'),
    router = express.Router();

router.get('/', function (req, res) {
	res.redirect('/api/output/')
});

module.exports = router;