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

	insertNewSlideshowItem: function() {
		return 'INSERT INTO slideshow SET name = ?,  description = ?';
	},

	insertRowInSlideshow: function() {
		return 'INSERT INTO slideshow SET name = ?, description = ? WHERE id = ?';
	},

	insertNewSlideshowContentItem: function() {
		return 'INSERT INTO slideshow_has_content SET slideshow_id = ?, content_id= ?';
	},

	deleteRowFromSlideshow: function() {
		return 'DELETE FROM slideshow WHERE id = ?'
	},

	deleteRowFromSlideshowContentItem: function() {
		return 'DELETE FROM slideshow_has_content WHERE slideshow_id = ?';
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
		return 'SELECT DISTINCT * FROM slideshow_has_content LEFT JOIN content ON slideshow_has_content.slideshow_id WHERE slideshow_id = ? GROUP BY link';
	}

}

module.exports = sqlLibrary;