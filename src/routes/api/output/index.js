var express = require('express'),
	sqlLibrary = require('../../../lib/sqlLibrary.js'),
	filterType = require('../../../lib/filterType.js'),
	twit = require('../../../lib/twitter.js'),
	renderOutput = require('../../../lib/renderOutput.js'),
    router = express.Router();

// Host data at api/output/ <screen id> which can be viewd from a screen
router.get('/:id', function (req, res) {

	req.getConnection(function(err, connection) {

		// Join slideshow and corresponding content and grab the media url and type.
		connection.query(sqlLibrary.joinContentAndSlideshow(), [req.params.id], function(err, callback) {

			var data = callback;

			// Check if screen has a slideshow that exists
			if(!data[0]) {
				res.render('api/index', {error: "This screen doesn't exist, or has no slideshow assigned"})
			}

			// Check if slideshow has content
			else if(data[0].link === null) {
				res.render('api/index', {error: "There is no content in this slideshow"})
			}
			else {

				// Filter types because images, videos and tweets get parsed differently.
				var imageStack = data.filter(filterType.image)
				var videoStack = data.filter(filterType.video)
				var tweetStack = data.filter(filterType.tweet)	

				// If we have tweets, activate a twitter client
				if(tweetStack.length > 0) {
					var tweet = twit.init();
				}

				// Array which will hold the twitter return object items we'll save
				var tweetList = []

				// For every twitter code in the stack
				for(var i = 0; i < tweetStack.length; i++) {

					// If a user pasted the entire URL instead of the code, grab the twitter ID instead.
					if(isNaN(tweetStack[i].link)) {
						var link = tweetStack[i].link.split('/');
						tweetStack[i].link = link[link.length - 1];
					}
					var promise = new Promise(function(resolve, reject) {
						// Grab the twitter ID and request the object
						tweet.get('statuses/show', { id: tweetStack[i].link },  function(err, callback, response) {
							if(err) {
								reject(err)
							}
							else {
								resolve(callback)
							}
						});	
					}).then(function(callback) {

						// Add all data we need into the twitter list
						tweetList.push( {
							name: callback.user.name,
							screen_name: callback.user.screen_name,
							content: callback.text,
							bgimage: callback.user.profile_image_url,
							media: callback.entities.media[0].media_url
						})

					}).then(function(callback) {
						// Check if we're done with all tweets, if not, skip this step and repeat.
						if(tweetList.length === tweetStack.length) {
							var params = { image: imageStack, video: videoStack, tweet: tweetList }
							renderOutput.init(res, params)
						}
					})
	
				}
			}
		})
	})
});

module.exports = router;