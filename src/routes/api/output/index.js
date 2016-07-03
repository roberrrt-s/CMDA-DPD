var express = require('express'),
	sqlLibrary = require('../../../lib/sqlLibrary.js'),
	filterType = require('../../../lib/filterType.js'),
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

				res.render('api/index', {image: imageStack, video: videoStack, tweet: tweetStack})

			}
		})
	})
});

module.exports = router;