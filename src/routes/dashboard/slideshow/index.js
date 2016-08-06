var express = require('express'),
	checkLogin = require('../../../lib/checkLogin.js'),
	filterType = require('../../../lib/filterType.js'),
	sqlLibrary = require('../../../lib/sqlLibrary.js'),
	reloader = require('../../../lib/reloader.js'),	
    router = express.Router();

// Slideshows

router.get('/', function(req, res) {

	if(checkLogin(req.session, res)) {

	}

});

router.get('/new/', function(req, res) {

	if(checkLogin(req.session, res)) {

	}

});

router.post('/new/', function(req, res) {

	if(checkLogin(req.session, res)) {

	}

});

router.get('/edit/:id', function(req, res) {

	if(checkLogin(req.session, res)) {

	}
})

router.post('/edit/:id', function(req, res) {

	if(checkLogin(req.session, res)) {
		
	}

});

router.get('/delete/:id/', function(req, res) {

	if(checkLogin(req.session, res)) {

	}

});

router.post('/delete/:id', function(req, res) {

	if(checkLogin(req.session, res)) {

	}

})

// Slides

router.get('/edit/:id/new', function(req, res) {

	if(checkLogin(req.session, res)) {

	}
}

router.post('/edit/:id/new', function(req, res) {

	if(checkLogin(req.session, res)) {

	}
}

router.get('/edit/:id/edit/:slideId', function(req, res) {

	if(checkLogin(req.session, res)) {

	}
}

router.post('/edit/:id/edit/:slideId', function(req, res) {

	if(checkLogin(req.session, res)) {

	}
}

router.post('/edit/:id/remove/:slideId', function(req, res) {

	if(checkLogin(req.session, res)) {

	}
}

module.exports = router;
