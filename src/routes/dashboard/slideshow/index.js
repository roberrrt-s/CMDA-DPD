var express = require('express'),
	checkLogin = require('../../../lib/checkLogin.js'),
	filterType = require('../../../lib/filterType.js'),
	sqlLibrary = require('../../../lib/sqlLibrary.js'),
	reloader = require('../../../lib/reloader.js'),	
    router = express.Router();

// Slideshows

router.get('/', function(req, res) {

	if(checkLogin(req.session, res)) {

// Load an overview of slideshows including the option to create a new slideshow

	}

});

router.get('/new/', function(req, res) {

	if(checkLogin(req.session, res)) {

// Render a form to create a new slideshow

	}

});

router.post('/new/', function(req, res) {

	if(checkLogin(req.session, res)) {

// Save slideshow inside the database

	}

});

router.get('/edit/:id', function(req, res) {

	if(checkLogin(req.session, res)) {

// Edit an existing slideshow

	}
})

router.post('/edit/:id', function(req, res) {

	if(checkLogin(req.session, res)) {
		
// Send editted slideshow data to the database

	}

});

router.get('/delete/:id/', function(req, res) {

	if(checkLogin(req.session, res)) {

// Delete a specific slideshow

	}

});

router.post('/delete/:id', function(req, res) {

	if(checkLogin(req.session, res)) {

// Delete a specific slideshow from the database

	}

})

// Slides

router.get('/edit/:id/new', function(req, res) {

	if(checkLogin(req.session, res)) {

// Create a new slide for an existing slideshow

	}
}

router.post('/edit/:id/new', function(req, res) {

	if(checkLogin(req.session, res)) {

// Save slide data to the database

	}
}

router.get('/edit/:id/edit/:slideId', function(req, res) {

	if(checkLogin(req.session, res)) {

// Edit a slide from a specific slideshow

	}
}

router.post('/edit/:id/edit/:slideId', function(req, res) {

	if(checkLogin(req.session, res)) {

// Save slide changes to the database

	}
}

router.post('/edit/:id/remove/:slideId', function(req, res) {

	if(checkLogin(req.session, res)) {

// Delete specific slide from the database and save it to the database (post only)

	}
}

module.exports = router;
