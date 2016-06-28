var express = require('express'),
	sqlLibrary = require('../../../lib/sqlLibrary.js'),
	filterType = require('../../../lib/filterType.js'),
    router = express.Router();

router.get('/:id', function (req, res) {

	req.getConnection(function(err, connection) {
		connection.query(sqlLibrary.joinContentAndSlideshow(), [req.params.id], function(err, callback) {

			var data = callback;

			console.log(data)

			if(!data[0]) {
				res.render('api/index', {error: "This screen doesn't exist, or has no slideshow assigned"})
			}
			else if(data[0].link === null) {
				res.render('api/index', {error: "There is no content in this slideshow"})
			}
			else {

				var imageStack = data.filter(filterType.image)
				var videoStack = data.filter(filterType.video)
				var tweetStack = data.filter(filterType.tweet)	

				res.render('api/index', {image: imageStack, video: videoStack, tweet: tweetStack})

			}
		})
	})
});

module.exports = router;