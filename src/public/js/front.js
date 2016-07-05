var video = (function(){

	// Insert the YouTube API.
	var init = function() {
		var tag = document.createElement('script');
		tag.src = "https://www.youtube.com/player_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);			
	}

	// When it's ready, it fires the onYouTubePlayerAPIReady() function
	var ready = function(videoId, element) {

		// Declare the max/min height/width
		var body = document.body,
			html = document.documentElement,
			totalHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight),
			totalWidth = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);

		// Select all video containers
		var containers = document.querySelectorAll('.video > div')

		// Insert the YouTube iframe for every container
		for(var i = 0; i < containers.length; i++) {
			var videoId = containers[i].getAttribute('data-video')
			var element = containers[i].id
			this.insert(videoId, element, totalHeight, totalWidth)
		}
	}

	// Create a new YouTube iframe and insert it
	var insert = function(videoId, element, tHeight, tWidth) {
		var player = new YT.Player(element, {
			height: tHeight,
			width: tWidth,
			videoId: videoId,
		});				
	}

	// Return the public functions
	return {
		init: init,
		ready: ready,
		insert: insert
	}

}());

// YouTube API requires this function to fire, so it's outside of the IIFE scope.
function onYouTubePlayerAPIReady() {
	video.ready();
}

video.init();