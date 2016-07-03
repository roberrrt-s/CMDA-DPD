var express = require('express'),
    checkLogin = require('../../../lib/checkLogin.js')
    router = express.Router();

router.get('/', function(req, res) {

    if(checkLogin(req.session, res)) {
        res.render('dashboard/settings/index', { title: 'Settings' });
    }

});

router.post('/settings', function(req, res) {

	// Deletes the session, effectively logging out.
	req.session.destroy();

	res.redirect('/dashboard/login')

});

module.exports = router;