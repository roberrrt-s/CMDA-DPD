var express = require('express'),
	checkLogin = require('../../../lib/checkLogin.js'),
	filterType = require('../../../lib/filterType.js'),
	sqlLibrary = require('../../../lib/sqlLibrary.js'),
	reloader = require('../../../lib/reloader.js'),	
    router = express.Router();

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
				console.log("Something went wrong: " + res)
			});

		});

	}

});

router.get('/new/', function(req, res) {

	if(checkLogin(req.session, res)) {

		req.getConnection(function(err, connection) {

			var promise = new Promise(function(resolve, reject) {
				// Grab all content to display as options
				connection.query(sqlLibrary.selectAllFromContent(), function(err, callback) {
					if(err) { 
						reject(err) 
					}
					else {
						resolve(callback)
					}	
				});

			}).then(function(callback) {
				// Filter all options on their types
				var imageStack = callback.filter(filterType.image)
				var videoStack = callback.filter(filterType.video)
				var tweetStack = callback.filter(filterType.tweet)

				res.render('dashboard/slideshow/new', { title: 'Slideshows', image: imageStack, video: videoStack, tweet: tweetStack });			
			
			}).catch(function(err) {
				console.log("Something went wrong: " + res)
			});

		});

	}

});

router.post('/new/', function(req, res) {

	if(checkLogin(req.session, res)) {

		var input = req.body

		req.getConnection(function(err, connection) {
			var slideshowId;

			// Checks with a new query to regenerate the current page with the error.
			if(input.name === '') {

				var promise = new Promise(function(resolve, reject) {
					connection.query(sqlLibrary.selectAllFromContent(), function(err, callback) {
						if(err) { 
							reject(err) 
						}
						else {
							resolve(callback)
						}
					})

				}).then(function(callback) {

					var imageStack = callback.filter(filterType.image)
					var videoStack = callback.filter(filterType.video)
					var tweetStack = callback.filter(filterType.tweet)

					res.render('dashboard/slideshow/new', { title: 'Slideshows', image: imageStack, video: videoStack, tweet: tweetStack, error: 'Please enter a name' });
				
				}).catch(function(err) {
					console.log("Something went wrong: " + res)
				});


			}
			// Checks with a new query to regenerate the current page with the error.
			else if(input.description === '') {

				var promise = new Promise(function(resolve, reject) {
					connection.query(sqlLibrary.selectAllFromContent(), function(err, callback) {
						if(err) { 
							reject(err) 
						}
						else {
							resolve(callback)
						}
					})
				}).then(function(callback) {

					var imageStack = callback.filter(filterType.image)
					var videoStack = callback.filter(filterType.video)
					var tweetStack = callback.filter(filterType.tweet)

					res.render('dashboard/slideshow/new', { title: 'Slideshows', image: imageStack, video: videoStack, tweet: tweetStack, error: 'Please enter a description' });

				}).catch(function(err) {
					console.log("Something went wrong: " + res)
				});

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

					slideshowId = callback.insertId;
					
					// Update the entire slideshow_has_content item for every key in input. (checkbox)
					for(key in input) {
						if(!isNaN(key)) {
							connection.query(sqlLibrary.insertNewSlideshowContentItem(), [slideshowId, key], function(err, callback) {
								if(err) { console.log(err) }
							})
						}
					}

					res.redirect('/dashboard/slideshow/');

				}).catch(function(err) {
					console.log("Something went wrong: " + res)
				});

			}
		})
	}

});

router.get('/edit/', function(req, res) {

	if(checkLogin(req.session, res)) {
		res.redirect('/dashboard/slideshow/');
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
		var input = req.body

		req.getConnection(function(err, connection) {

			var promise = new Promise(function(resolve, reject) {
				// Remove all previous entries of the slideshow_has_content
				connection.query(sqlLibrary.deleteRowFromSlideshowContentItem(), [req.params.id], function(err, callback) {
					if(err) { 
						reject(err) 
					}
					else {
						resolve(callback)
					}						
				})
			}).then(function(callback) {
				console.log('done')
			}).catch(function(err) {
				console.log("Something went wrong: " + res)
			});

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

				// Update slideshow_has_content with all new entries
				for(key in input) {
					if(!isNaN(key)) {
						var loop = new Promise(function(resolve, reject) {
							connection.query(sqlLibrary.insertNewSlideshowContentItem(), [req.params.id, key], function(err, callback) {
								if(err) { 
									reject(err) 
								}
								else {
									resolve(callback)
								}
							});
						});
					}
				}

				res.redirect('/dashboard/slideshow/');

			}).catch(function(err) {
				console.log("Something went wrong:" + res)
			});

		});

		// Restart any slideshow instance. 
		reloader.send();
	}

});

router.get('/delete/', function(req, res) {

	if(checkLogin(req.session, res)) {
		res.redirect('/dashboard/slideshow/');
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
				console.log("Something went wrong: " + res)
			});


		});

	}

});

router.post('/delete/:id', function(req, res) {

	if(checkLogin(req.session, res)) {

		req.getConnection(function(err, connection) {

			var promise = new Promise(function(resolve, reject) {
				//Remove all slideshow_has_content references first, due to FK restrictions
				connection.query(sqlLibrary.deleteRowFromSlideshowContentItem(), [req.params.id], function(err, callback) {
					if(err) { 
						reject(err) 
					}
					else {
						resolve(callback)
					}	
				});
			}).then(function(callback) {
				var promised = new Promise(function(resolve, reject) {
					// Remove all slideshow references from the table slideshow
					connection.query(sqlLibrary.deleteRowFromSlideshow(), [req.params.id], function(err, callback) {
						if(err) { 
							reject(err) 
						}
						else {
							resolve(callback)
						}	
					});
				}).then(function(callback) {
					res.redirect('/dashboard/slideshow');	
				})			
			})	
		});

	}

})

module.exports = router;
