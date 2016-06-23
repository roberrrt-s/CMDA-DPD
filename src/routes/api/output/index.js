var express = require('express'),
	sqlLibrary = require('../../../lib/sqlLibrary.js'),
	filterType = require('../../../lib/filterType.js'),
    router = express.Router();

router.get('/:id', function (req, res) {

	req.getConnection(function(err, connection) {
		connection.query(sqlLibrary.selectRowFromScreen(), [req.params.id], function(err, callback) {
			connection.query(sqlLibrary.joinContentAndSlideshow(), [callback[0].slideshow_id], function(err, callback) {

				var data = callback;

				var imageStack = data.filter(filterType.image)
				var videoStack = data.filter(filterType.video)
				var tweetStack = data.filter(filterType.tweet)

				res.render('api/index', {image: imageStack, video: videoStack, tweet: tweetStack})

			})
		})
	});
});

module.exports = router;