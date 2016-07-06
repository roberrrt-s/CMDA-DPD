// Seperate queries and structure for clarification. These are all MySQL queries used by the router.

var sqlLibrary = {

	// Content queries
	selectAllFromContent: function() {
		return 'SELECT * FROM content';
	},

	selectRowFromContent: function() {
		return 'SELECT * FROM content WHERE id = ?';
	},

	insertNewContentItem: function() {
		return 'INSERT INTO content SET name = ?, link = ?, description = ?, duration = ?, type = ?, user_id = ?';
	},

	updateRowInContent: function() {
		return 'UPDATE content SET name = ?, description = ?, duration = ? WHERE id = ?';
	},

	deleteRowFromContent: function() {
		return 'DELETE FROM content WHERE id = ?';
	},
	// End of content queries

	// Screen queries
	selectAllFromScreen: function() {
		return 'SELECT * FROM screen';
	},

	selectRowFromScreen: function() {
		return 'SELECT * FROM screen WHERE id = ?';
	},

	insertNewScreenItem: function() {
		return 'INSERT INTO screen SET name = ?, description = ?, location = ?, slideshow_id = 0';
	},

	updateRowInScreen: function() {
		return 'UPDATE screen SET name = ?, description = ?, location = ?, slideshow_id = ? WHERE id = ?';
	},

	deleteRowFromScreen: function() {
		return 'DELETE FROM screen WHERE id = ?';
	},
	// End of screen queries

	// Slideshow queries
	selectAllFromSlideshow: function() {
		return 'SELECT * FROM slideshow';
	},

	selectRowFromSlideshow: function() {
		return 'SELECT * FROM slideshow WHERE id = ?';
	},

	matchContentFromSlideshow: function () {
		return 'SELECT * FROM slideshow_has_content WHERE slideshow_id = ?'
	},

	insertNewSlideshowItem: function() {
		return 'INSERT INTO slideshow SET name = ?, description = ?';
	},

	updateRowInSlideshow: function() {
		return 'UPDATE slideshow SET name = ?, description = ? WHERE id = ?';
	},

	insertNewSlideshowContentItem: function() {
		return 'INSERT INTO slideshow_has_content SET slideshow_id = ?, content_id = ?';
	},

	deleteRowFromSlideshow: function() {
		return 'DELETE FROM slideshow WHERE id = ?'
	},

	deleteRowFromSlideshowContentItem: function() {
		return 'DELETE FROM slideshow_has_content WHERE slideshow_id = ?';
	},

	deleteRowFromContentItemSlideshow: function() {
		return 'DELETE FROM slideshow_has_content WHERE content_id = ?';
	},

	// End of Slideshow queries

	// Login queries 
	selectRowFromUser: function() {
		return 'SELECT id, email, password, name FROM user WHERE email = ?';
	},

	selectEmailFromUser: function() {
		return 'SELECT email FROM user WHERE email = ?';
	},

	insertRowInUser: function() {
		return 'INSERT INTO user SET email = ?, password = ?, name = ?';
	},

	// API query
	joinContentAndSlideshow: function() {
		return 'SELECT link, type, duration FROM slideshow LEFT JOIN slideshow_has_content ON slideshow_id = ? LEFT JOIN content ON slideshow_has_content.content_id = content.id';
	}

}

module.exports = sqlLibrary;