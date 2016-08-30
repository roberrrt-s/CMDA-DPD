var express = require('express'),
	checkLogin = require('../../../lib/checkLogin.js')
	sqlLibrary = require('../../../lib/sqlLibrary.js')
	reloader = require('../../../lib/reloader.js'),
    router = express.Router();

router.get('/', function(req, res) {

	if(checkLogin(req.session, res)) {

		var negative, positive;
		var message = req.query.message;

		switch(message) {
			case 'failed':
				negative = "Could not save changes";
			break;

			case 'new':
				positive = "Succesfully created new screen";
			break;

			case 'edit':
				positive = "Succesfully edited screen";
			break;

			case 'delete':
				positive = "Succesfully deleted screen";
			break;
		}

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
					res.render('dashboard/screen/index', { title: 'Screens', positive: positive, negative: negative });
				}
				// If there are,
				else {
					res.render('dashboard/screen/index', { title: 'Screens', data: callback, positive: positive, negative: negative });
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
			res.render('dashboard/screen/new', { title: 'New', errorName: 'Please fill in a name' });
		}
		else if(input.desc === '') {
			res.render('dashboard/screen/new', { title: 'New', errorDesc: 'Please fill in a description' });
		}
		else if(input.location === '') {
			res.render('dashboard/screen/new', { title: 'New', errorLoc: 'Please fill in a location' });
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

					res.redirect('/dashboard/screen?message=new');

				}).catch(function(callback) {

					res.redirect('/dashboard/screen?message=failed');

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
					
				}).catch(function() {
					res.redirect('/dashboard/slideshow/');
				})

			}).catch(function() {
				res.redirect('/dashboard/slideshow/');
			})

		})

		// Restart any slideshow instance. 
		reloader.send();
	}
	

});

router.post('/edit/:id', function(req, res) {
	if(checkLogin(req.session, res)) {
		
		var input = req.body;

		if(input.name === '') {
			res.render
		}

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

				reloader.send();
				res.redirect('/dashboard/screen?message=edit');

			}).catch(function() {

				res.redirect('/dashboard/screen?message=failed');

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
				reloader.send();
				res.redirect('/dashboard/screen?message=delete');
			}).catch(function(callback) {
				res.redirect('/dashboard/screen?message=failed');
			})
		});
		
	}

})

module.exports = router;
