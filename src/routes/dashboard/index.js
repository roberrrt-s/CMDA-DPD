var express = require('express'),
	crypto = require('crypto')
	checkLogin = require('../../lib/checkLogin.js')
	sqlLibrary = require('../../lib/sqlLibrary.js')
	encryptData = require('../../lib/encryptData.js')
	decryptData = require('../../lib/decryptData.js')
	router = express.Router();

router.get('/', function(req, res) {

	if(checkLogin(req.session, res)) {
		res.render('dashboard/index', { title: 'Home' });
	}

});

router.get('/login/', function (req, res) {
	res.render('dashboard/login', { title: 'Login'});
});

router.get('/register/', function (req, res) {
	res.render('dashboard/register', { title: 'Register'});
});

router.post('/login/', function(req, res) {

	var input = req.body;

	if(input.email === '' || input.password === '') {
		res.render('dashboard/login', { error: 'Please enter a email / password'})
	}
	else {

		req.getConnection(function(err, connection) {

			var promise = new Promise(function(resolve, reject) {

				connection.query(sqlLibrary.selectRowFromUser(), [input.email], function(err, callback) {
					if(err) { 
						reject(err) 
					}
					else {
						resolve(callback)
					}
				})

			}).then(function(callback) {
				if(callback.length === 0) {
					res.render('dashboard/login', { error: 'User does not exist', title: 'Login'})	
				}
				else if(callback[0].password !== encryptData(input.password)) {
					res.render('dashboard/login', { error: 'Incorrect password', title: 'Login'})	
				}
				else {

					var data = callback[0]

					req.session.name = data.name
					req.session.email = data.email
					req.session.userid = data.id

					res.redirect('/dashboard/');
				}				
			})
		})

	}

})

router.post('/register/', function(req, res) {

	var input = req.body;

	if(input.name === '' || input.email === '' || input.pass === '' || input.confirm === '') {
		res.render('dashboard/register', { error: 'You did not fill in all the fields', title: 'Register'})
	}
	else if(input.pass !== input.confirm) {
		res.render('dashboard/register', { error: 'Your passwords did not match', title: 'Register'})
	}
	else if(input.email.indexOf('@hva.nl') === -1) {
		res.render('dashboard/register', { error: 'Only HvA members can register', title: 'Register'})
	}
	else {

		req.getConnection(function(err, connection) {

			var promise = new Promise(function(resolve, reject) {
				connection.query(sqlLibrary.selectEmailFromUser(), [input.email], function(err, callback) {
					if(err) { 
						reject(err) 
					}
					else {
						resolve(callback)
					}					
				})
			}).then(function(callback) {
				if(callback.length > 1) {
					res.render('dashboard/register', { error: 'This email has been used already', title: 'Register'})
				}
				else {
					
					var promised = new Promise(function(resolve, reject) {

						connection.query(sqlLibrary.insertRowInUser(), [input.email, encryptData(input.pass), input.name], function(err, callback) {
							if(err) { 
								reject(err) 
							}
							else {
								resolve(callback)
							}								
						})

					}).then(function(callback) {
						res.redirect('/dashboard/login/');
					})
				}
			})
		});

	}

})

module.exports = router;
