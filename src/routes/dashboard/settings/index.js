var express = require('express'),
    checkLogin = require('../../../lib/checkLogin.js')
    router = express.Router();

router.get('/', function(req, res) {

    if(checkLogin(req.session)) {
        res.render('dashboard/settings/index', { title: 'Settings' });
    }
    else {
        res.redirect('/dashboard/login/');
    }

});

router.post('/settings', function(req, res) {

	req.session.destroy();

	res.redirect('/dashboard/login')

});

module.exports = router;