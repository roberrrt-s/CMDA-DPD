var express = require('express'),
	checkLogin = require('../../../../lib/checkLogin.js'),
	filterType = require('../../../../lib/filterType.js'),
	sqlLibrary = require('../../../../lib/sqlLibrary.js'),
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

	reloader = require('../../../../lib/reloader.js'),	
    router = express.Router();

// Slides

router.get('/:id/slide/new', function(req, res) {

	if(checkLogin(req.session, res)) {

		req.getConnection(function(err, connection) {

			var promise = new Promise(function(resolve, reject) {

				// Select all slideshow information from the database
				connection.query(sqlLibrary.selectImagesFromContent(), function(err, callback) {
					if(err) { 
						reject(err)
					}
					else {
						resolve(callback)
					}
				})

			}).then(function(callback) {

				var images = callback

				res.render('dashboard/slideshow/slide/new', { title: 'New slide', images: images, id: req.params.id });

			}).catch(function(callback) {
				console.log(callback)
			})

		})
	}
})

router.post('/:id/slide/new', upload.single('file'), function(req, res) {

	if(checkLogin(req.session, res)) {

		var input = req.body,
			file = req.file;

			console.log(req.file);

		req.getConnection(function(err, connection) {

			switch(input.type) {
				case "image":
					
					switch(input.image_type) {
						case "new":

							var promise = new Promise(function(resolve, reject) {
								
								connection.query(sqlLibrary.insertNewContentItem(), [input.image_title, file.filename, null, input.type, req.session.userid], function(err, callback) {
									if(err) { 
										reject(err) 
									}
									else {
										resolve(callback)
									}
								})

							}).then(function(callback) {

								console.log(callback)

								createSlide(req, connection, callback, input);

							}).catch(function(err) {

								console.log("Something went wrong: " + err)

							});

						break;
						case "existing":

							var callback = {
								insertId: input.existing_image_id
							}

							createSlide(req, connection, callback, input);

							console.log(input)

						break;
						default: 
							console.log('unknown type');
					}

				break;

				case "video":

					var promise = new Promise(function(resolve, reject) {
						
						connection.query(sqlLibrary.insertNewContentItem(), [input.youtube_name, input.youtube_url, null, input.type, req.session.userid], function(err, callback) {
							if(err) { 
								reject(err) 
							}
							else {
								resolve(callback)
							}
						})

					}).then(function(callback) {

						console.log(callback)

						createSlide(req, connection, callback, input);

					}).catch(function(err) {

						res.redirect('/dashboard/slideshow/?message=failed');

					});

				break;

				case "tweet":

					var promise = new Promise(function(resolve, reject) {
						
						connection.query(sqlLibrary.insertNewContentItem(), [input.tweet_name, input.tweet_url, null, input.type, req.session.userid], function(err, callback) {
							if(err) { 
								reject(err) 
							}
							else {
								resolve(callback)
							}
						})

					}).then(function(callback) {

						console.log(callback)

						createSlide(req, connection, callback, input);

					}).catch(function(err) {

						console.log("Something went wrong: " + err)

					});

				break;

				default: 
					console.log('broken');

			}

			function createSlide(req, connection, callback, input) {

				var promise = new Promise(function(resolve, reject) {
					
					connection.query(sqlLibrary.insertNewSlide(), [req.params.id, callback.insertId, input.order, input.duration], function(err, callback) {
						if(err) { 
							reject(err) 
						}
						else {
							resolve(callback)
						}
					})

				}).then(function(callback) {

					res.redirect('/dashboard/slideshow/edit/' + req.params.id + '?message=succes');

				}).catch(function(err) {

					res.redirect('/dashboard/slideshow/edit/' + req.params.id + '?message=failed');

				});


			}

			console.log('hello world')

		})
	}
})

router.post('/:id/slide/:slideId', function(req, res) {

	if(checkLogin(req.session, res)) {

		var input = req.body;
		console.log(input.duration)
		console.log(input.order)
		console.log(req.params.slideId)

		req.getConnection(function(err, connection) {

			var promise = new Promise(function(resolve, reject) {

				// Select all slideshow information from the database
				connection.query(sqlLibrary.updateRowInSlide(), [input.duration, input.order, req.params.slideId], function(err, callback) {
					if(err) { 
						reject(err)
					}
					else {
						resolve(callback)
					}
				})

			}).then(function(callback) {

				res.redirect('/dashboard/slideshow/edit/' + req.params.id + '?message=edit');

			}).catch(function(callback) {

				res.redirect('/dashboard/slideshow/edit/' + req.params.id + '?message=failure');

			})

		})	

	}
})

router.post('/:id/slide/remove/:slideId', function(req, res) {

	if(checkLogin(req.session, res)) {

		req.getConnection(function(err, connection) {

			// Remove the content from the table itself.
			var promise = new Promise(function(resolve, reject) {
				connection.query(sqlLibrary.deleteRowFromSlide(), [req.params.slideId], function(err, callback) {
					if(err) { 
						reject(err) 
					}
					else {
						resolve(callback)
					}
				})

			}).then(function(callback) {

				res.redirect('/dashboard/slideshow/edit/' + req.params.id + '?message=delete');

			}).catch(function(callback) {

				res.redirect('/dashboard/slideshow/edit/' + req.params.id + '?message=failed');

			})

		});

	}

})

module.exports = router;
