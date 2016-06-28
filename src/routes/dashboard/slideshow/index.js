var express = require('express'),
	checkLogin = require('../../../lib/checkLogin.js'),
	filterType = require('../../../lib/filterType.js'),
	sqlLibrary = require('../../../lib/sqlLibrary.js'),
    router = express.Router();

router.get('/', function(req, res) {

	if(checkLogin(req.session)) {

		req.getConnection(function(err, connection) {
			connection.query(sqlLibrary.selectAllFromSlideshow(), function(err, callback) {

				if(callback.length < 1) {
					res.render('dashboard/slideshow/index', { title: 'Slideshows', error: 'No slideshows available yet' });
				}
				else {
					res.render('dashboard/slideshow/index', { title: 'Slideshows', data: callback });
				}
			})
		});

	}
	else {
		res.redirect('/dashboard/login/');
	}

});

router.get('/new/', function(req, res) {

	if(checkLogin(req.session)) {

		req.getConnection(function(err, connection) {
			connection.query(sqlLibrary.selectAllFromContent(), function(err, callback) {

				var imageStack = callback.filter(filterType.image)
				var videoStack = callback.filter(filterType.video)
				var tweetStack = callback.filter(filterType.tweet)

				res.render('dashboard/slideshow/new', { title: 'Slideshows', image: imageStack, video: videoStack, tweet: tweetStack });

			})
		});

	}
	else {
		res.redirect('/dashboard/login/');
	}

});

router.post('/new/', function(req, res) {

	if(checkLogin(req.session)) {

		var input = req.body

		req.getConnection(function(err, connection) {
			var slideshowId;

			if(input.name === '') {

				req.getConnection(function(err, connection) {
					connection.query(sqlLibrary.selectAllFromContent(), function(err, callback) {

						var imageStack = callback.filter(filterType.image)
						var videoStack = callback.filter(filterType.video)
						var tweetStack = callback.filter(filterType.tweet)

						res.render('dashboard/slideshow/new', { title: 'Slideshows', image: imageStack, video: videoStack, tweet: tweetStack, error: 'Please enter a name' });

					})
				});

			}
			else if(input.description === '') {

				req.getConnection(function(err, connection) {
					connection.query(sqlLibrary.selectAllFromContent(), function(err, callback) {

						var imageStack = callback.filter(filterType.image)
						var videoStack = callback.filter(filterType.video)
						var tweetStack = callback.filter(filterType.tweet)

						res.render('dashboard/slideshow/new', { title: 'Slideshows', image: imageStack, video: videoStack, tweet: tweetStack, error: 'Please enter a description' });

					})
				});

			}
			else {

				connection.query(sqlLibrary.insertNewSlideshowItem(), [input.name, input.description], function(err, callback) {
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

		});

	}
	else {
		res.redirect('/dashboard/login/');
	}

});

router.get('/edit/', function(req, res) {

	if(checkLogin(req.session)) {
		res.redirect('/dashboard/slideshow/');
	}
	else {
		res.redirect('/dashboard/login/');
	}

});

router.get('/edit/:id', function(req, res) {

	if(checkLogin(req.session)) {

		req.getConnection(function(err, connection) {
			connection.query(sqlLibrary.selectAllFromContent(), function(err, callback) {
				if(err) { console.log(err) };

				connection.query('SELECT * FROM slideshow_has_content WHERE slideshow_id = ?', [req.params.id], function(err, memory) {
					if(err) { console.log(err) };

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

					connection.query(sqlLibrary.selectRowFromSlideshow(), [req.params.id], function(err, callback) {
						if(err) { console.log(err) };

						var input = callback[0]

						res.render('dashboard/slideshow/edit', { title: 'Slideshows', image: imageStack, video: videoStack, tweet: tweetStack, name: input.name, description: input.description, id: req.params.id });
					
					});
				});
			})
		});

	}
	else {
		res.redirect('/dashboard/login/');
	}

});

router.post('/edit/:id', function(req, res) {

	if(checkLogin(req.session)) {
		var input = req.body

		req.getConnection(function(err, connection) {

			connection.query(sqlLibrary.deleteRowFromSlideshowContentItem(), [req.params.id], function(err, callback) {
				if(err) { console.log(err) };
			})

			connection.query(sqlLibrary.insertRowInSlideshow(), [input.name, input.description, req.params.id], function(err, callback) {
				
				for(key in input) {
					if(!isNaN(key)) {
						connection.query(sqlLibrary.insertNewSlideshowContentItem(), [req.params.id, key], function(err, callback) {
							if(err) { console.log(err) }
						})
					}
				}

			res.redirect('/dashboard/slideshow/');

			})
		});

	}
	else {
		res.redirect('/dashboard/login/');
	}



});

router.get('/delete/', function(req, res) {

	if(checkLogin(req.session)) {
		res.redirect('/dashboard/slideshow/');
	}
	else {
		res.redirect('/dashboard/login/');
	}

});

router.get('/delete/:id/', function(req, res) {

	if(checkLogin(req.session)) {

		req.getConnection(function(err, connection) {

			connection.query(sqlLibrary.selectRowFromSlideshow(), [req.params.id], function(err, callback) {
				if(err) { console.log(err) };
				res.render('dashboard/slideshow/delete', { title: 'Delete', id: req.params.id, name: callback[0].name });
			})

		});

	}
	else {
		res.redirect('/dashboard/login/');
	}

});

router.post('/delete/:id', function(req, res) {

	if(checkLogin(req.session)) {

		req.getConnection(function(err, connection) {

			connection.query(sqlLibrary.deleteRowFromSlideshowContentItem(), [req.params.id], function(err, callback) {
				if(err) { console.log(err) };
				
				connection.query(sqlLibrary.deleteRowFromSlideshow(), [req.params.id], function(err, callback) {
					if(err) { console.log(err) };
					res.redirect('/dashboard/slideshow');	
				})

			})

		});

	}
	else {
		res.redirect('/dashboard/login/');
	}

})

module.exports = router;
