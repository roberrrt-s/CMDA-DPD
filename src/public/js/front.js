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

		if(containers.length < 1) {
			animation.play();
			return false;
		}

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
			events: {
				'onReady': video.save,
				'onStateChange': video.ended 
			}
		});

	}

	var save = function(e) {

		blockbuster.list.push({
			name: e.target.a.id,
			player: e.target
		})

		console.log(blockbuster.list.length)
		console.log(document.getElementsByClassName('video').length)

		if(blockbuster.list.length === document.getElementsByClassName('video').length) {
			animation.play();
		}

	}

	var ended = function(e) {

		if(e.data === 0) {
			animation.play(animation.current, animation.slides)
		}

	}

	// Return the public functions
	return {
		init: init,
		ready: ready,
		insert: insert,
		save: save,
		ended: ended
	}

}());

var animation = (function(){

	var current = 0;
	var slides = document.getElementsByClassName('item');

	var play = function() {

		for (var i = 0; i < slides.length; i++) {
			slides[i].style.opacity = 0;
		}

		animation.current = (animation.current != animation.slides.length - 1) ? animation.current + 1 : 0;
		animation.slides[animation.current].style.opacity = 1;
		var duration = animation.slides[animation.current].getAttribute('data-duration') * 1000;

		if(isNaN(duration)) {

			var id = animation.slides[animation.current].childNodes[1].id;
			var video = document.getElementById(id);

			for(var i = 0; i < blockbuster.list.length; i++) {
				if(blockbuster.list[i].name === id) {
					blockbuster.list[i].player.playVideo();
				}
			}

			return false;

		}

		setTimeout(function() {
			animation.play();
		}, duration)

	}

	return {
		current: current,
		slides: slides,
		play: play
	}

}());

var blockbuster = (function(){

	var list = [];

	return {
		list: list
	}

}());

// YouTube API requires this function to fire, so it's outside of the IIFE scope.
function onYouTubePlayerAPIReady() {
	video.ready();
}

video.init();