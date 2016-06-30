var express = require('express'),
	checkLogin = require('../../../lib/checkLogin.js')
	sqlLibrary = require('../../../lib/sqlLibrary.js')
    router = express.Router();

router.get('/', function(req, res) {

	if(checkLogin(req.session)) {

		req.getConnection(function(err, connection) {
			connection.query(sqlLibrary.selectAllFromScreen(), function(err, callback) {

				if(callback.length < 1) {
					res.render('dashboard/screen/index', { title: 'Screens', error: 'No screens available yet' });
				}
				else {
					res.render('dashboard/screen/index', { title: 'Screens', data: callback });
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
		res.render('dashboard/screen/new', { title: 'New' });
	}
	else {
		res.redirect('/dashboard/login/');
	}

});

router.post('/new/', function(req, res) {

	if(checkLogin(req.session)) {
		
		var input = req.body;

		console.log(input)

		if(input.name === '') {
			res.render('dashboard/screen/new', { title: 'New', error: 'Please fill in a name' });
		}
		else if(input.desc === '') {
			res.render('dashboard/screen/new', { title: 'New', error: 'Please fill in a description' });
		}
		else if(input.location === '') {
			res.render('dashboard/screen/new', { title: 'New', error: 'Please fill in a location' });
		}
		else {

			req.getConnection(function(err, connection) {

				connection.query(sqlLibrary.insertNewScreenItem(), [input.name, input.desc, input.location], function(err, callback) {
					if(err) { console.log(err) };

					res.render('dashboard/screen/edit', { title: 'Edit', data: callback, id: req.params.id});

				})

			});

			res.redirect('/dashboard/screen');

		}

	}
	else {
		res.redirect('/dashboard/login/');
	}

});

router.get('/edit/', function(req, res) {
	res.redirect('/dashboard/screen')
});

router.get('/edit/:id', function(req, res) {

	if(checkLogin(req.session)) {

		req.getConnection(function(err, connection) {

			connection.query(sqlLibrary.selectRowFromScreen(), [req.params.id], function(err, callback) {
				if(err) { console.log(err) };
				var screen = callback[0];
				var none = false;

				console.log(screen.slideshow_id)

				if(screen.slideshow_id !== 0) {
					var none = true;
				}

				connection.query(sqlLibrary.selectAllFromSlideshow(), function(err, callback) {
					if(err) { console.log(err) };
					var slideshows = callback

					for(var i = 0; i < slideshows.length; i++) {
						if(slideshows[i].id === screen.slideshow_id) {
							console.log('true!')
							slideshows[i].selected = true;
						}
					}

					console.log(slideshows)

					res.render('dashboard/screen/edit', { 
						title: 'Edit', 
						name: screen.name, 
						desc: screen.description, 
						loc: screen.location, 
						current: screen.slideshow_id,
						id: req.params.id,
						slideshows: slideshows,
					});

				});

			});

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

			connection.query(sqlLibrary.updateRowInScreen(), [input.name, input.desc, input.loc, input.slideshow, req.params.id], function(err, callback) {
				if(err) { console.log(err) }
			});

		});

		res.redirect('/dashboard/screen');	
	}
	else {
		res.redirect('/dashboard/login/');
	}
})

router.get('/delete/', function(req, res) {
	res.redirect('/dashboard/screen')
});

router.get('/delete/:id', function(req, res) {

	if(checkLogin(req.session)) {
		res.render('dashboard/screen/delete', { title: 'Delete', id: req.params.id });
	}
	else {
		res.redirect('/dashboard/login/');
	}

});

router.post('/delete/:id', function(req, res) {

	if(checkLogin(req.session)) {

		req.getConnection(function(err, connection) {

			connection.query(sqlLibrary.deleteRowFromScreen(), [req.params.id], function(err, callback) {
				if(err) { console.log(err) };
			})
		});

		res.redirect('/dashboard/screen');	

	}
	else {
		res.redirect('/dashboard/login/');
	}

})

module.exports = router;
