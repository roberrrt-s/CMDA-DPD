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
		return 'INSERT INTO content SET name = ?, link = ?, description = ?, type = ?, user_id = ?';
	},

	updateRowInContent: function() {
		return 'UPDATE content SET name = ? WHERE id = ?';
	},

	deleteRowFromContent: function() {
		return 'DELETE FROM content WHERE id = ?';
	},

	selectImagesFromContent: function () {
		return "SELECT * FROM content WHERE type = 'image'";
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
		return 'INSERT INTO screen SET name = ?, description = ?, location = ?, slideshow_id = ?';
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

	selectRowFromSlide: function() {
		return 'SELECT * FROM slide WHERE id = ?';
	},

	matchContentFromSlideshow: function () {
		return 'SELECT slideshow.id AS slideshowId, slideshow.name AS slideshowName, slideshow.description AS slideshowDesc, slide.id, slide.slideshow_id, slide.content_id, slide.slide_order, slide.duration, content.id, content.name, content.description, content.link, content.type, content.user_id, content.created_at FROM slideshow LEFT JOIN slide ON slideshow.id = slide.slideshow_id LEFT JOIN content ON slide.content_id = content.id WHERE slideshow.id = ? ORDER BY slide.slide_order, slide.id'
	},

	insertNewSlideshowItem: function() {
		return 'INSERT INTO slideshow SET name = ?, description = ?';
	},

	updateRowInSlide: function() {
		return 'UPDATE slide SET duration = ?, slide_order = ? WHERE id = ?';
	},

	updateRowInSlideshow: function() {
		return 'UPDATE slideshow SET name = ?, description = ? WHERE id = ?';
	},

	insertNewSlide: function() {
		return 'INSERT INTO slide SET slideshow_id = ?, content_id = ?, slide_order = ?, duration = ?';
	},

	deleteRowFromSlideshow: function() {
		return 'DELETE FROM slideshow WHERE id = ?'
	},

	deleteRowFromSlide: function() {
		return 'DELETE FROM slide WHERE slideshow_id = ?'
	},

	deleteRowFromSlideshowContentItem: function() {
		return 'DELETE FROM slide WHERE slideshow_id = ?';
	},

	deleteRowFromContentItemSlideshow: function() {
		return 'DELETE FROM slide WHERE content_id = ?';
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
	grabOutputContent: function() {
		return 'SELECT slide.slideshow_id, content.id, content.type, content.link, content.name, slide.duration, slide.slide_order FROM slide LEFT JOIN slideshow ON slide.slideshow_id = slideshow.id LEFT JOIN content ON slide.content_id = content.id LEFT JOIN screen ON slideshow.id = screen.slideshow_id WHERE screen.id = ? ORDER BY slide.slide_order, slide.id';
	}

}

module.exports = sqlLibrary;