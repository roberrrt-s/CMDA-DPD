var express = require('express'),
	checkLogin = require('../../../../lib/checkLogin.js'),
	filterType = require('../../../../lib/filterType.js'),
	sqlLibrary = require('../../../../lib/sqlLibrary.js'),
	reloader = require('../../../../lib/reloader.js'),	
    router = express.Router();

// Slides

router.get('/:id/slide/new', function(req, res) {

	if(checkLogin(req.session, res)) {

		res.render('dashboard/slideshow/slide/new', { title: 'New slide', id: req.params.id });

	}
})

router.post('/:id/slide/new', function(req, res) {

	if(checkLogin(req.session, res)) {

	// Save slide data to the database

	}
})

router.get('/:id/slide/:slideId', function(req, res) {

	if(checkLogin(req.session, res)) {

		res.render('dashboard/slideshow/slide/edit', { title: 'Edit slide', id: req.params.id, slideId: req.params.slideId });

	}
})

router.post('/:id/slide/:slideId', function(req, res) {

	if(checkLogin(req.session, res)) {

// Save slide changes to the database

	}
})

router.post('/:id/slide/remove/:slideId', function(req, res) {

	if(checkLogin(req.session, res)) {

// Delete specific slide from the database and save it to the database (post only)

	}
})

module.exports = router;
