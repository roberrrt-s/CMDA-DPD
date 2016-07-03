var express = require('express'),
	checkLogin = require('../../../lib/checkLogin.js'),
	filterType = require('../../../lib/filterType.js'),
	sqlLibrary = require('../../../lib/sqlLibrary.js'),
    router = express.Router();

router.get('/', function(req, res) {

	if(checkLogin(req.session, res)) {

		req.getConnection(function(err, connection) {

			var promise = new Promise(function(resolve, reject) {

				connection.query(sqlLibrary.selectAllFromSlideshow(), function(err, callback) {
					if(err) { 
						reject(err) 
					}
					else {
						resolve(callback)
					}	
				});

			}).then(function(callback) {

				if(callback.length < 1) {
					res.render('dashboard/slideshow/index', { title: 'Slideshows', error: 'No slideshows available yet' });
				}
				else {
					res.render('dashboard/slideshow/index', { title: 'Slideshows', data: callback });
				}				
				
			})
		});

	}

});

router.get('/new/', function(req, res) {

	if(checkLogin(req.session, res)) {

		req.getConnection(function(err, connection) {

			var promise = new Promise(function(resolve, reject) {

				connection.query(sqlLibrary.selectAllFromContent(), function(err, callback) {
					if(err) { 
						reject(err) 
					}
					else {
						resolve(callback)
					}	
				});

			}).then(function(callback) {

				var imageStack = callback.filter(filterType.image)
				var videoStack = callback.filter(filterType.video)
				var tweetStack = callback.filter(filterType.tweet)

				res.render('dashboard/slideshow/new', { title: 'Slideshows', image: imageStack, video: videoStack, tweet: tweetStack });			
			
			})
		});

	}

});

router.post('/new/', function(req, res) {

	if(checkLogin(req.session, res)) {

		var input = req.body

		req.getConnection(function(err, connection) {
			var slideshowId;

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
				
				})

			}
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

				})

			}
			else {

				var promise = new Promise(function(resolve, reject) {

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
					
					for(key in input) {
						if(!isNaN(key)) {
							connection.query(sqlLibrary.insertNewSlideshowContentItem(), [slideshowId, key], function(err, callback) {
								if(err) { console.log(err) }
							})
						}
					}

					res.redirect('/dashboard/slideshow/');

				})
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

		req.getConnection(function(err, connection) {

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
				var promised = new Promise(function(resolve, reject) {
					connection.query(sqlLibrary.matchContentFromSlideshow(), [req.params.id], function(err, memory) {
						if(err) { 
							reject(err) 
						}
						else {
							resolve(callback)
						}
					})
				}).then(function(callback) {

					for(var i = 0; i < callback.length; i++) {
						for(var j = 0; j < memory.length; j++) {
							if(callback[i].id === memory[j].content_id) {
								callback[i].checked = true;
							}
						}

					}

					var imageStack = callback.filter(filterType.image)
					var videoStack = callback.filter(filterType.video)
					var tweetStack = callback.filter(filterType.tweet)

					var show = new Promise(function(resolve, reject) {
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

						res.render('dashboard/slideshow/edit', { title: 'Slideshows', image: imageStack, video: videoStack, tweet: tweetStack, name: input.name, description: input.description, id: req.params.id });					
					});
				})
			})
		});
	}

});

router.post('/edit/:id', function(req, res) {

	if(checkLogin(req.session, res)) {
		var input = req.body

		req.getConnection(function(err, connection) {

			var promise = new Promise(function(resolve, reject) {
				connection.query(sqlLibrary.deleteRowFromSlideshowContentItem(), [req.params.id], function(err, callback) {
					if(err) { 
						reject(err) 
					}
					else {
						resolve(callback)
					}						
				})
			}).then(function(callback) {

				var promised = new Promise(function(resolve, reject) {
					connection.query(sqlLibrary.insertRowInSlideshow(), [input.name, input.description, req.params.id], function(err, callback) {
						if(err) { 
							reject(err) 
						}
						else {
							resolve(callback)
						}
					})
				}).then(function(callback) {

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

				})
			})
		});
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
			})

		});

	}

});

router.post('/delete/:id', function(req, res) {

	if(checkLogin(req.session, res)) {

		req.getConnection(function(err, connection) {

			var promise = new Promise(function(resolve, reject) {
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
