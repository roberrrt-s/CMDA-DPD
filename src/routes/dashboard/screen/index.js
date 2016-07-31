var express = require('express'),
	checkLogin = require('../../../lib/checkLogin.js')
	sqlLibrary = require('../../../lib/sqlLibrary.js')
	reloader = require('../../../lib/reloader.js'),	
    router = express.Router();

router.get('/', function(req, res) {

	if(checkLogin(req.session, res)) {

		req.getConnection(function(err, connection) {
			var promise = new Promise(function(resolve, reject) {
				// Query to select all the screens from the database
				connection.query(sqlLibrary.selectAllFromScreen(), function(err, callback) {

					if(err) { 
						reject(err) 
					}
					else {
						resolve(callback)
					}

				})
			}).then(function(callback) {

				// If there are no screens.
				if(callback.length < 1) {
					res.render('dashboard/screen/index', { title: 'Screens', error: 'No screens available yet' });
				}
				// If there are,
				else {
					res.render('dashboard/screen/index', { title: 'Screens', data: callback });
				}

			})

		})

	}

});

router.get('/new/', function(req, res) {

	if(checkLogin(req.session, res)) {

		req.getConnection(function(err, connection) {

			var promise = new Promise(function(resolve, reject) {

				// Select all slideshow information from the database
				connection.query(sqlLibrary.selectAllFromSlideshow(), function(err, callback) {
					if(err) { 
						reject(err) 
					}
					else {
						resolve(callback)
					}
				})

			}).then(function(callback) {

				var slideshows = callback
				console.log(slideshows)

				res.render('dashboard/screen/new', { title: 'New', slideshows: slideshows });

			})
		})

	}

});

router.post('/new/', function(req, res) {

	if(checkLogin(req.session, res)) {
		
		var input = req.body;

		// Checks for validation to see if all fields are entered.
		if(input.name === '') {
			res.render('dashboard/screen/new', { title: 'New', error: 'Please fill in a name' });
		}
		else if(input.desc === '') {
			res.render('dashboard/screen/new', { title: 'New', error: 'Please fill in a description' });
		}
		else if(input.location === '') {
			res.render('dashboard/screen/new', { title: 'New', error: 'Please fill in a location' });
		}
		else {

			req.getConnection(function(err, connection) {

				var promise = new Promise(function(resolve, reject) {

					// Insert new screen data in the database
					connection.query(sqlLibrary.insertNewScreenItem(), [input.name, input.desc, input.location, input.slideshow], function(err, callback) {
						if(err) { 
							reject(err) 
						}
						else {
							resolve(callback)
						}
					})
				}).then(function(callback) {

					res.redirect('/dashboard/screen');

				})
			});
		}

	}

});

router.get('/edit/', function(req, res) {
	res.redirect('/dashboard/screen')
});

router.get('/edit/:id', function(req, res) {

	if(checkLogin(req.session, res)) {

		req.getConnection(function(err, connection) {

			var promise = new Promise(function(resolve, reject) {
				// Get the current matching screen
				connection.query(sqlLibrary.selectRowFromScreen(), [req.params.id], function(err, callback) {
					if(err) { 
						reject(err)
					}
					else {
						resolve(callback)
					}
				})

			}).then(function(callback) {

				var screen = callback[0];
				var none = false;

				// Pre-selected option for the dropdown, if statement to check if there's a pre-assigned option.
				if(screen.slideshow_id !== 0) {
					var none = true;
				}

				var promised = new Promise(function(resolve, reject) {

					// Select all slideshow information from the database
					connection.query(sqlLibrary.selectAllFromSlideshow(), function(err, callback) {
						if(err) { 
							reject(err) 
						}
						else {
							resolve(callback)
						}
					})

				}).then(function(callback) {

					var slideshows = callback

					// If there's a selected option, check all options to see which one matches.
					for(var i = 0; i < slideshows.length; i++) {
						if(slideshows[i].id === screen.slideshow_id) {
							slideshows[i].selected = true;
						}
					}

					res.render('dashboard/screen/edit', { 
						title: 'Edit', 
						name: screen.name, 
						desc: screen.description, 
						loc: screen.location, 
						current: screen.slideshow_id,
						id: req.params.id,
						slideshows: slideshows

					});
				})
			})
		})

		// Restart any slideshow instance. 
		reloader.send();
	}
	

});

router.post('/edit/:id', function(req, res) {
	if(checkLogin(req.session, res)) {
		
		var input = req.body;

		req.getConnection(function(err, connection) {

			var promise = new Promise(function(resolve, reject) {
				// Update the information in the database
				connection.query(sqlLibrary.updateRowInScreen(), [input.name, input.desc, input.loc, input.slideshow, req.params.id], function(err, callback) {
					if(err) { 
						reject(err) 
					}
					else {
						resolve(callback)
					}
				})
			}).then(function(callback) {
				res.redirect('/dashboard/screen');	
			})
		});

	}
})

router.get('/delete/', function(req, res) {
	res.redirect('/dashboard/screen')
});

router.get('/delete/:id', function(req, res) {

	if(checkLogin(req.session, res)) {
		res.render('dashboard/screen/delete', { title: 'Delete', id: req.params.id });
	}

});

router.post('/delete/:id', function(req, res) {

	if(checkLogin(req.session, res)) {

		req.getConnection(function(err, connection) {

			var promise = new Promise(function(resolve, reject) {
				// Query to remove the row from the database
				connection.query(sqlLibrary.deleteRowFromScreen(), [req.params.id], function(err, callback) {
					if(err) { 
						reject(err) 
					}
					else {
						resolve(callback)
					}
				})
			}).then(function(callback) {
				res.redirect('/dashboard/screen');
			})
		});
		
	}


})

module.exports = router;
