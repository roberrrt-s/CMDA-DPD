var filterType = {

	image: function(obj) {
		return obj.type === 'image';
	},

	video: function(obj) {
		return obj.type === 'video';
	},

	tweet: function(obj) {
		return obj.type === 'tweet';
	}

}

module.exports = filterType;