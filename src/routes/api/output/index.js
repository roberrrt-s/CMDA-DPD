var express = require('express'),
	sqlLibrary = require('../../../lib/sqlLibrary.js'),
	filterType = require('../../../lib/filterType.js'),
	twit = require('../../../lib/twitter.js'),
	renderOutput = require('../../../lib/renderOutput.js'),
	reloader = require('../../../lib/reloader.js'),
    router = express.Router();

// Host data at api/output/ <screen id> which can be viewd from a screen
router.get('/:id', function (req, res) {

	req.getConnection(function(err, connection) {

		// Join slideshow and corresponding content and grab the media url and type.
		connection.query(sqlLibrary.grabOutputContent(), [req.params.id], function(err, callback) {

			var data = callback;

			if(!data) {
				res.render('api/index', {error: "Database related error, contact webmaster"})
			}

			// Check if screen has a slideshow that exists
			else if(!data[0]) {
				res.render('api/index', {error: "This screen doesn't exist, or has no slideshow assigned"})
			}

			// Check if slideshow has content
			else if(data[0].link === null) {
				res.render('api/index', {error: "There is no content in this slideshow"})
			}

			else {

				var tweets = [];

				for(var i = 0; i < data.length; i++) {

					switch(data[i].type) {

						case 'image': 
						data[i].image = true;
						
						break;
						case 'video':

							data[i].video = true;

							if(data[i].link.indexOf('watch?') > 0) {
								var link = data[i].link.split('=')
								data[i].link = link[link.length - 1];
							}

							// Mobile URL's
							if(data[i].link.indexOf('.be/') > 0) {
								var link = data[i].link.split('/')
								data[i].link = link[link.length - 1];							
							}

						data[i].id = 'video-' + i
						
						break;
						case 'tweet':

							data[i].tweet = true;

							// If a user pasted the entire URL instead of the code, grab the twitter ID instead.
							if(isNaN(data[i].link)) {
								var link = data[i].link.split('/');
								data[i].link = link[link.length - 1];
							}

							tweets.push(i);

						break;

					}

				}

				if(tweets.length > 0) {

					var tweet = twit.init();
					var tweetStack = [];

					for(var i = 0; i < tweets.length; i++) {

						var promise = new Promise(function(resolve, reject) {
							// Grab the twitter ID and request the object
							tweet.get('statuses/show', { id: data[tweets[i]].link },  function(err, callback, response) {
								if(err) {
									reject(err)
								}
								else {
									resolve(callback)
								}
							});	
						})

						tweetStack.push(promise)
					}

					Promise.all(tweetStack).then(function(callback) {
						for(var i = 0; i < callback.length; i++) {

							for(var j = 0; j < data.length; j++) {

								if(data[j].type === "tweet" && data[j].link === callback[i].id_str) {

									data[j].name = callback[i].user.name;
									data[j].screen_name = callback[i].user.screen_name;
									data[j].content = callback[i].text;
									data[j].bgimage = callback[i].user.profile_image_url;
									data[j].media = callback[i].entities.media[0].media_url;

								}

							}

						}

						res.render('api/index', { item: data })

					})

				}

				else {
					res.render('api/index', { item: data })
				}
			}
		})
	})
});

module.exports = router;