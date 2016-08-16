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
						console.log('ja')
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
				console.log("Something went wrong: " + res)
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

					console.log("Something went wrong: " + res)

				});

			}
		})
	}

});

router.get('/edit/:id', function(req, res) {

if(checkLogin(req.session, res)) {

		// Set the variables to this scope to access them everywhere we need.
		var allContent, memoryContent, imageStack, videoStack, tweetStack;

		req.getConnection(function(err, connection) {

			var promise = new Promise(function(resolve, reject) {

				// Select all data from content
				connection.query(sqlLibrary.selectAllFromContent(), function(err, callback) {
					if(err) { 
						reject(err) 
					}
					else {
						resolve(callback)
					}
				})

			}).then(function(callback) {
				// Apply the callback to a broader scope
				allContent = callback;
			}).catch(function(err) {
				console.log("Something went wrong: " + res)
			});

			var promise = new Promise(function(resolve, reject) {

				// Get all slideshow_has_content references.
				connection.query(sqlLibrary.matchContentFromSlideshow(), [req.params.id], function(err, callback) {
					if(err) { 
						reject(err) 
					}
					else {
						resolve(callback)
					}
				})

			}).then(function(callback) {
				// Apply the callback to a broaders scope
				memoryContent = callback;

				// Check all boxes that have been selected previously through a double for loop
				for(var i = 0; i < allContent.length; i++) {
					for(var j = 0; j < memoryContent.length; j++) {
						if(allContent[i].id === memoryContent[j].content_id) {
							allContent[i].checked = true;
						}
					}
				}

				// Filter all content
				imageStack = allContent.filter(filterType.image);
				videoStack = allContent.filter(filterType.video);
				tweetStack = allContent.filter(filterType.tweet);

			}).catch(function(err) {
				console.log("Something went wrong: " + res)
			});

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

				// Render the edit page
				res.render('dashboard/slideshow/edit', { 
					title: 'Slideshows', 
					image: imageStack, 
					video: videoStack, 
					tweet: tweetStack, 
					name: input.name, 
					description: input.description, 
					id: req.params.id 
				});			

			}).catch(function(err) {
				console.log("Something went wrong: " + res)
			});

		})
	}

})

router.post('/edit/:id', function(req, res) {

	if(checkLogin(req.session, res)) {
		
// Send editted slideshow data to the database

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

				console.log('?')
				res.render('dashboard/slideshow/delete', { title: 'Delete', id: req.params.id, name: callback[0].name });
			
			}).catch(function(err) {

				console.log("Something went wrong: " + err)

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

// Slides

router.get('/edit/:id/new', function(req, res) {

	if(checkLogin(req.session, res)) {

		res.render('dashboard/slideshow/slide/new', { title: 'New slide', id: req.params.id });

	}
})

router.post('/edit/:id/new', function(req, res) {

	if(checkLogin(req.session, res)) {

// Save slide data to the database

	}
})

router.get('/edit/:id/slide/:slideId', function(req, res) {

	if(checkLogin(req.session, res)) {

		res.render('dashboard/slideshow/slide/edit', { title: 'New slide', id: req.params.id, slideId: req.params.slideId });

	}
})

router.post('/edit/:id/slide/:slideId', function(req, res) {

	if(checkLogin(req.session, res)) {

// Save slide changes to the database

	}
})

router.post('/edit/:id/remove/:slideId', function(req, res) {

	if(checkLogin(req.session, res)) {

// Delete specific slide from the database and save it to the database (post only)

	}
})

module.exports = router;
