var express = require('express'),
	fs = require('fs'),
	path = require('path'),
	filterType = require('../../../lib/filterType.js'),
	sqlLibrary = require('../../../lib/sqlLibrary.js'),
	multer  = require('multer'),

	storage = multer.diskStorage({
	    destination: function(req, file, cb) {
	        cb(null, 'public/uploads')
	    },
	    filename: function(req, file, cb) {
	    	var ext = file.originalname.split('.')
	        cb(null, 'upload-' + Date.now() + '.' + ext[ext.length - 1])
	  }

	})	

	upload = multer({ 
		storage: storage,
	})

	checkLogin = require('../../../lib/checkLogin.js'),
    router = express.Router();


router.get('/', function(req, res) {

	if(checkLogin(req.session)) {

		req.getConnection(function(err, connection) {

			var promise = new Promise(function(resolve, reject) {

				connection.query(sqlLibrary.selectAllFromContent(), ['image'], function(err, callback) {
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

				res.render('dashboard/content', { title: 'Content', image: imageStack, video: videoStack, tweet: tweetStack });

			})



		});

	}
	else {
		res.redirect('/dashboard/login/');
	}

});

router.get('/new/', function(req, res) {

	if(checkLogin(req.session)) {
		res.redirect('/dashboard/content/');
	}
	else {
		res.redirect('/dashboard/login/');
	}

});

router.get('/new/:type', function(req, res) {

	if(checkLogin(req.session)) {

		switch(req.params.type) {
			case 'image':
				res.render('dashboard/content/new', { title: 'Image', type: req.params.type, preview: true, img: true });
			break;

			case 'video':
				res.render('dashboard/content/new', { title: 'Video', type: req.params.type, preview: false, url: true });
			break;

			case 'tweet':
				res.render('dashboard/content/new', { title: 'Tweet', type: req.params.type, preview: false, url: true });
			break;

			default:
				res.redirect('/dashboard/content/');
		}

	}
	else {
		res.redirect('/dashboard/login/');
	}

});

router.post('/new/:type', upload.single('file'), function(req, res, cb) {

	if(checkLogin(req.session)) {

		var input = req.body,
			file = req.file;

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
	else {
		res.redirect('/dashboard/login/');
	}	

});

router.get('/edit/', function(req, res) {

	if(checkLogin(req.session)) {
		res.redirect('/dashboard/content/');
	}
	else {
		res.redirect('/dashboard/login/');
	}

});

router.get('/edit/:id', function(req, res) {

	if(checkLogin(req.session)) {
		
		req.getConnection(function(err, connection) {

			connection.query(sqlLibrary.selectRowFromContent(), [req.params.id], function(err, callback) {
				if(err) { console.log(err) };

				var input = callback[0]

				res.render('dashboard/content/edit', { 
					title: 'Edit', 
					id: req.params.id, 
					type: input.type, 
					name: input.name, 
					link: input.link,
					desc: input.description,
					dur: input.duration
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

		var input = req.body;

		req.getConnection(function(err, connection) {

			connection.query(sqlLibrary.updateRowInContent(), [input.name, input.description, input.duration, req.params.id], function(err, callback) {
				if(err) { console.log(err) }
			});

		});

		res.redirect('/dashboard/content');	
	}
	else {
		res.redirect('/dashboard/login/');
	}

});

router.get('/delete/', function(req, res) {

	if(checkLogin(req.session)) {
		res.redirect('/dashboard/content/');
	}
	else {
		res.redirect('/dashboard/login/');
	}

});

router.get('/delete/:id', function(req, res) {

	if(checkLogin(req.session)) {

		req.getConnection(function(err, connection) {

			connection.query(sqlLibrary.selectRowFromContent(), [req.params.id], function(err, callback) {
				if(err) { console.log(err) };
				res.render('dashboard/content/delete', { title: 'Delete', id: req.params.id, type: callback[0].type, name: callback[0].name });
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

			connection.query(sqlLibrary.deleteRowFromContent(), [req.params.id], function(err, callback) {
				if(err) { console.log(err) };
			})
		});

		res.redirect('/dashboard/content');	

	}
	else {
		res.redirect('/dashboard/login/');
	}

})

module.exports = router;
