var video = (function(){

	var init = function() {
		var tag = document.createElement('script');
		tag.src = "https://www.youtube.com/player_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);			
	}

	var ready = function(videoId, element) {

		var body = document.body,
			html = document.documentElement,
			totalHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight),
			totalWidth = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);

		var containers = document.querySelectorAll('.video > div')

		for(var i = 0; i < containers.length; i++) {
			var videoId = containers[i].getAttribute('data-video')
			var element = containers[i].id
			this.insert(videoId, element, totalHeight, totalWidth)
		}
	}

	var insert = function(videoId, element, tHeight, tWidth) {
		var player = new YT.Player(element, {
			height: tHeight,
			width: tWidth,
			videoId: videoId,
		});				
	}

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