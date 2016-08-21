var express = require('express'),
	checkLogin = require('../../../lib/checkLogin.js'),
	filterType = require('../../../lib/filterType.js'),
	sqlLibrary = require('../../../lib/sqlLibrary.js'),
	reloader = require('../../../lib/reloader.js'),	
    router = express.Router();

// Slideshows

router.get('/', function(req, res) {

	if(checkLogin(req.session, res)) {

		req.getConnection(function(err, connection) {

			var promise = new Promise(function(resolve, reject) {

				// Select all data from the slideshow table.
				connection.query(sqlLibrary.selectAllFromSlideshow(), function(err, callback) {
					if(err) { 
						reject(err) 
					}
					else {
						resolve(callback)
					}	
				});

			}).then(function(callback) {

				// If there's no data.
				if(callback.length < 1) {
					res.render('dashboard/slideshow/index', { title: 'Slideshows', error: 'No slideshows available yet' });
				}
				// If there is.
				else {
					res.render('dashboard/slideshow/index', { title: 'Slideshows', data: callback });
				}				
				
			}).catch(function(err) {
				console.log("Something went wrong: " + err)
			});

		});

	}
});

router.get('/new/', function(req, res) {

	if(checkLogin(req.session, res)) {

		res.render('dashboard/slideshow/new', { title: 'New slideshow' });			
			
	}

});

router.post('/new/', function(req, res) {

if(checkLogin(req.session, res)) {

		var input = req.body

		req.getConnection(function(err, connection) {
			var slideshowId;

			// Checks with a new query to regenerate the current page with the error.
			if(input.name === '') {

				res.render('dashboard/slideshow/new', { title: 'Slideshows', error: 'Please enter a name' });
				
			}

			// Checks with a new query to regenerate the current page with the error.
			else if(input.description === '') {

				res.render('dashboard/slideshow/new', { title: 'Slideshows', error: 'Please enter a description' });

			}

			// If the checks are passed..
			else {

				var promise = new Promise(function(resolve, reject) {

					// Insert new slideshow in the database
					connection.query(sqlLibrary.insertNewSlideshowItem(), [input.name, input.description], function(err, callback) {
						if(err) { 
							reject(err) 
						}
						else {
							resolve(callback)
						}
					})

				}).then(function(callback) {

					res.redirect('/dashboard/slideshow/');

				}).catch(function(err) {

					console.log("Something went wrong: " + err)

				});

			}
		})
	}

});

router.get('/edit/:id', function(req, res) {

if(checkLogin(req.session, res)) {

		req.getConnection(function(err, connection) {

			// Get the slideshow data from the database
			var promise = new Promise(function(resolve, reject) {
				connection.query(sqlLibrary.selectRowFromSlideshow(), [req.params.id], function(err, callback) {
					if(err) { 
						reject(err) 
					}
					else {
						resolve(callback)
					}
				})

			}).then(function(callback) {
				var input = callback[0]

				var promised = new Promise(function(resolve, reject) {
					connection.query(sqlLibrary.matchContentFromSlideshow(), [req.params.id], function(err, callback) {
						if(err) { 
							reject(err) 
						}
						else {
							resolve(callback)
						}
					})

				}).then(function(slides) {
					
					console.log(slides)

					// Render the edit page
					res.render('dashboard/slideshow/edit', { 
						title: 'Slideshows', 
						name: input.name, 
						description: input.description,
						slide: slides,
						id: req.params.id 
					});			

				})

	

			}).catch(function(err) {
				console.log("Something went wrong: " + err)
				res.redirect('/dashboard/slideshow/');
			});

		})
	}

})

router.post('/edit/:id', function(req, res) {

	if(checkLogin(req.session, res)) {
		var input = req.body

		req.getConnection(function(err, connection) {

			var promise = new Promise(function(resolve, reject) {
				// Update slideshow table
				connection.query(sqlLibrary.updateRowInSlideshow(), [input.name, input.description, req.params.id], function(err, callback) {
					if(err) { 
						reject(err) 
					}
					else {
						resolve(callback)
					}
				})
			}).then(function(callback) {

				res.redirect('/dashboard/slideshow/');
			
			}).catch(function(err) {
			
				console.log("Something went wrong:" + res)
			
			});

		});

		// Restart any slideshow instance. 
		reloader.send();
	}

});

router.get('/delete/:id/', function(req, res) {

	if(checkLogin(req.session, res)) {

		req.getConnection(function(err, connection) {

			var promise = new Promise(function(resolve, reject) {

				// Get the slideshow in question
				connection.query(sqlLibrary.selectRowFromSlideshow(), [req.params.id], function(err, callback) {
					if(err) { 
						reject(err) 
					}
					else {
						resolve(callback)
					}	
				});

			}).then(function(callback) {

				res.render('dashboard/slideshow/delete', { title: 'Delete', id: req.params.id, name: callback[0].name });
			
			}).catch(function(err) {

				console.log("Something went wrong: " + err)
				res.redirect('/dashboard/slideshow/');

			});


		});

	}

});

router.post('/delete/:id', function(req, res) {

	if(checkLogin(req.session, res)) {

		req.getConnection(function(err, connection) {

			var promise = new Promise(function(resolve, reject) {

				connection.query(sqlLibrary.deleteRowFromSlideshow(), [req.params.id], function(err, callback) {
					if(err) { 
						reject(err);
					}
					else {
						resolve(callback);
					}

				})

			}).then(function(callback) {

				res.redirect('/dashboard/slideshow/');

			}).catch(function(err) {

				console.log("Something went wrong: " + err);

			});			

		});

	}

})

module.exports = router;
