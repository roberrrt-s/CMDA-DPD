var express = require('express'),
	fs = require('fs'),
	path = require('path'),
	filterType = require('../../../lib/filterType.js'),
	sqlLibrary = require('../../../lib/sqlLibrary.js'),
	multer  = require('multer'),

	storage = multer.diskStorage({
		// Configuring multer to upload towards the public/uploads map
	    destination: function(req, file, cb) {
	        cb(null, 'public/uploads')
	    },
	    // Rename the file, so we can create a reference to save in the database.
	    filename: function(req, file, cb) {
	    	var ext = file.originalname.split('.')
	        cb(null, 'upload-' + Date.now() + '.' + ext[ext.length - 1])
	  }

	})	

	// Assign the configured storage to the upload.
	upload = multer({ 
		storage: storage,
	})

	checkLogin = require('../../../lib/checkLogin.js'),
    router = express.Router();

router.get('/', function(req, res) {

	if(checkLogin(req.session, res)) {

		req.getConnection(function(err, connection) {

			var promise = new Promise(function(resolve, reject) {

				// Grab all rows from content
				connection.query(sqlLibrary.selectAllFromContent(), function(err, callback) {
					if(err) { 
						reject(err) 
					}
					else {
						resolve(callback)
					}					
				});

			}).then(function(callback) {

				// Filter content based on type for parsing.
				var imageStack = callback.filter(filterType.image)
				var videoStack = callback.filter(filterType.video)
				var tweetStack = callback.filter(filterType.tweet)

				res.render('dashboard/content', { title: 'Content', image: imageStack, video: videoStack, tweet: tweetStack });

			})



		});

	}

});

router.get('/new/', function(req, res) {

	if(checkLogin(req.session, res)) {
		res.redirect('/dashboard/content/');
	}

});

router.get('/new/:type', function(req, res) {

	if(checkLogin(req.session, res)) {

		// Check the type, and render the corresponding page or redirect back. 
		switch(req.params.type) {
			case 'image':
				res.render('dashboard/content/new', { title: 'Image', type: req.params.type, preview: true, img: true, duration: true});
			break;

			case 'video':
				res.render('dashboard/content/new', { title: 'Video', type: req.params.type, preview: false, url: true, duration: false});
			break;

			case 'tweet':
				res.render('dashboard/content/new', { title: 'Tweet', type: req.params.type, preview: false, url: true, duration: true});
			break;

			default:
				res.redirect('/dashboard/content/');
		}

	}


});

// Configure a single upload option (file)
router.post('/new/:type', upload.single('file'), function(req, res, cb) {

	if(checkLogin(req.session, res)) {

		var input = req.body,
			file = req.file;

			// Insert checks for the uploads
			switch(req.params.type) {
				case 'image':

					if(input.name === '') {
						res.render('dashboard/content/new', { title: 'Image', type: req.params.type, preview: true, img: true, error: 'Please enter a name' });
					}
					else if(input.desc === '') {
						res.render('dashboard/content/new', { title: 'Image', type: req.params.type, preview: true, img: true, error: 'Please enter a description' });
					}
					else if(input.duration === '') {
						res.render('dashboard/content/new', { title: 'Image', type: req.params.type, preview: true, img: true, error: 'Please enter a duration' });
					}
					else if(!file) {
						res.render('dashboard/content/new', { title: 'Image', type: req.params.type, preview: true, img: true, error: 'Please upload an image' });
					}
					else if(file.mimetype.indexOf('image') === -1) {
						fs.unlinkSync(req.file.path)
						res.render('dashboard/content/new', { title: 'Image', type: req.params.type, preview: true, img: true, error: 'You can only upload images' });
					}

					else {

						// If everything is fine, upload the image and insert the values in the database
						req.getConnection(function(err, connection) {
							var promise = new Promise(function(resolve, reject) {
								connection.query(sqlLibrary.insertNewContentItem(), [input.name, file.filename, input.desc, input.duration, req.params.type, req.session.userid], function(err, callback) {
									if(err) { 
										reject(err) 
									}
									else {
										resolve(callback)
									}
								})
							// When done, redirect to the content.
							}).then(function(callback) {
								res.redirect('/dashboard/content/');
							})

						});

					}

				break;

				case 'video':
				case 'tweet':

					if(input.name === '') {
						res.render('dashboard/content/new', { title: 'Media', type: req.params.type, error: 'Please enter a name' });
					}
					else if(input.desc === '') {
						res.render('dashboard/content/new', { title: 'Media', type: req.params.type, error: 'Please enter a description' });
					}
					else if(input.duration === '') {
						res.render('dashboard/content/new', { title: 'Media', type: req.params.type, error: 'Please enter a duration' });
					}
					else if(input.url === '') {
						res.render('dashboard/content/new', { title: 'Media', type: req.params.type, error: 'Please enter the code' });
					}

					else {

						req.getConnection(function(err, connection) {
							var promise = new Promise(function(resolve, reject) {
								connection.query(sqlLibrary.insertNewContentItem(), [input.name, input.url, input.desc, input.duration, req.params.type, req.session.userid], function(err, callback) {
									if(err) { 
										reject(err) 
									}
									else {
										resolve(callback)
									}
								})
							}).then(function(callback) {
								res.redirect('/dashboard/content/');
							})

						});

					}

				break;

				default:
					res.redirect('/dashboard/content/');
			}

	}
	

});

router.get('/edit/', function(req, res) {

	if(checkLogin(req.session, res)) {
		res.redirect('/dashboard/content/');
	}


});

router.get('/edit/:id', function(req, res) {

	if(checkLogin(req.session, res)) {
		
		// Get the current specific information of the slide in question.
		req.getConnection(function(err, connection) {

			var promise = new Promise(function(resolve, reject) {
				connection.query(sqlLibrary.selectRowFromContent(), [req.params.id], function(err, callback) {
					if(err) { 
						reject(err) 
					}
					else {
						resolve(callback)
					}
				})

			// Render the page with all information available.
			}).then(function(callback) {

				var input = callback[0]

				res.render('dashboard/content/edit', { 
					title: 'Edit', 
					id: req.params.id, 
					type: input.type, 
					name: input.name, 
					link: input.link,
					desc: input.description,
					dur: input.duration,
					duration: true
				});

			}).catch(function() {
				res.redirect('/dashboard/slideshow/');
			})
					
		});

	}



});


router.post('/edit/:id', function(req, res) {

	if(checkLogin(req.session, res)) {

		var input = req.body;
		input.duration = 0;

		req.getConnection(function(err, connection) {
			// Insert all new data inside the database.
			var promise = new Promise(function(resolve, reject) {
				connection.query(sqlLibrary.updateRowInContent(), [input.name, input.description, input.duration, req.params.id], function(err, callback) {
					if(err) { 
						reject(err) 
						console.log(err)
					}
					else {
						resolve(callback)
					}
				});
			}).then(function(calback) {
				res.redirect('/dashboard/content');	
			})
		});

	}


});

router.get('/delete/', function(req, res) {

	if(checkLogin(req.session, res)) {
		res.redirect('/dashboard/content/');
	}


});

router.get('/delete/:id', function(req, res) {

	if(checkLogin(req.session, res)) {

		req.getConnection(function(err, connection) {
			
			var promise = new Promise(function(resolve, reject) {
				connection.query(sqlLibrary.selectRowFromContent(), [req.params.id], function(err, callback) {
					if(err) { 
						reject(err) 
					}
					else {
						resolve(callback)
					}
				})
			}).then(function(callback) {
				res.render('dashboard/content/delete', { title: 'Delete', id: req.params.id, type: callback[0].type, name: callback[0].name });
			}).catch(function() {
				res.redirect('/dashboard/slideshow/');
			})

		});

	}


});

router.post('/delete/:id', function(req, res) {

	if(checkLogin(req.session, res)) {

		req.getConnection(function(err, connection) {
			
			// Delete all slideshow_has_content items first, due to FK dependencies
			var promise = new Promise(function(resolve, reject) {
				connection.query(sqlLibrary.deleteRowFromContentItemSlideshow(), [req.params.id], function(err, callback) {
					if(err) { 
						reject(err) 
					}
					else {
						resolve(callback)
					}					
				})
			})

			// Remove the content from the table itself.
			var promise = new Promise(function(resolve, reject) {
				connection.query(sqlLibrary.deleteRowFromContent(), [req.params.id], function(err, callback) {
					if(err) { 
						reject(err) 
					}
					else {
						resolve(callback)
					}
				})

			}).then(function(callback) {
				res.redirect('/dashboard/content');	
			})

		});

	}


})

module.exports = router;
