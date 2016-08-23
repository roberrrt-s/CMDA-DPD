var express = require('express'),
	fs = require('fs'),
	path = require('path'),
	query = require('../../../lib/query.js'),
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

		var message = query.message(req.query.message);

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
				var images = callback.filter(filterType.image)

				res.render('dashboard/content', { title: 'Content', image: images, message: message });

			})

		});

	}

});

router.get('/new/', function(req, res) {

	if(checkLogin(req.session, res)) {
		res.redirect('/dashboard/content/');
	}

});

router.get('/new/image', function(req, res) {

	if(checkLogin(req.session, res)) {

		res.render('dashboard/content/new', { title: 'Upload new image' });

	}

});

// Configure a single upload option (file)
router.post('/new/image', upload.single('file'), function(req, res, cb) {

	if(checkLogin(req.session, res)) {

		var input = req.body,
			file = req.file;
			console.log(input)

		if(input.name === '') {
			res.render('dashboard/content/new', { title: 'Upload new image', error: 'Please enter a name' });
		}
		else if(!file) {
			res.render('dashboard/content/new', { title: 'Upload new image', error: 'Please upload an image' });
		}
		else if(file.mimetype.indexOf('image') === -1) {
			fs.unlinkSync(req.file.path)
			res.render('dashboard/content/new', { title: 'Upload new image', error: 'You can only upload images' });
		}

		else {

			// If everything is fine, upload the image and insert the values in the database
			req.getConnection(function(err, connection) {
				var promise = new Promise(function(resolve, reject) {
					connection.query(sqlLibrary.insertNewContentItem(), [input.name, file.filename, null, "image", req.session.userid], function(err, callback) {
						if(err) { 
							reject(err) 
						}
						else {
							resolve(callback)
						}
					})
				// When done, redirect to the content.
				}).then(function(callback) {
					res.redirect('/dashboard/content/?message=new');
				}).catch(function(callback) {
					res.redirect('/dashboard/content/?message=failed');
				})

			});

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
					name: input.name, 
					link: input.link,
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
				connection.query(sqlLibrary.updateRowInContent(), [input.name, req.params.id], function(err, callback) {
					if(err) { 
						reject(err)
						console.log(err)
					}
					else {
						resolve(callback)
					}
				});
			}).then(function(callback) {

				res.redirect('/dashboard/content?message=edit');	
			}).catch(function(callback) {

				res.redirect('/dashboard/content?message=failed');	
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

			var promise = new Promise(function(resolve, reject) {
				connection.query(sqlLibrary.deleteRowsFromSlide(), [req.params.id], function(err, callback) {
					if(err) { 
						reject(err)
					}
					else {
						resolve(callback)
					}
				})

			}).catch(function(callback) {
				console.log(callback)
				res.redirect('/dashboard/content?message=failed');	
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

				res.redirect('/dashboard/content?message=delete');

			}).catch(function(callback) {

				res.redirect('/dashboard/content?message=failed');

			})

		});

	}

})

module.exports = router;
