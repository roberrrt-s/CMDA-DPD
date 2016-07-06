// Main video object
var video = (function(){
	'use strict'

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

		// Check if there are any video's, if not, we do not have to insert a new video.
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

	// Save a reference to this video, including the name of the wrapper.
	var save = function(e) {

		blockbuster.list.push({
			name: e.target.a.id,
			player: e.target
		})

		// If all video's are ready, start the animation.
		if(blockbuster.list.length === document.getElementsByClassName('video').length) {
			animation.play();
		}

	}

	// If a video has ended playing (checking for data 0, which is the YouTube reference for ended).
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

// Main animation object.
var animation = (function(){
	'use strict'

	// Define the current and all slides in the slideshow.
	var current = 0;
	var slides = document.getElementsByClassName('item');

	// Start the animation.
	var play = function() {

		// Set all slides opacity to 0
		for (var i = 0; i < slides.length; i++) {
			slides[i].style.opacity = 0;
		}

		// Get the current slide, and progress to the next one. Set opacity and duration.
		animation.current = (animation.current != animation.slides.length - 1) ? animation.current + 1 : 0;
		animation.slides[animation.current].style.opacity = 1;
		var duration = animation.slides[animation.current].getAttribute('data-duration') * 1000;

		// Check if the duration is video
		if(isNaN(duration)) {

			// If video, grab the reference from blockbuster.list and play the video
			var id = animation.slides[animation.current].childNodes[1].id;
			var video = document.getElementById(id);

			for(var i = 0; i < blockbuster.list.length; i++) {
				if(blockbuster.list[i].name === id) {
					blockbuster.list[i].player.playVideo();
				}
			}
			// Return false to avoid a new timeout.
			return false;

		}

		// Restart the animation principle after the delay.
		setTimeout(function() {
			animation.play();
		}, duration)

	}

	// Return the public functions
	return {
		current: current,
		slides: slides,
		play: play
	}

}());

// Object that holds all video references.
var blockbuster = (function(){
	'use strict'

	var list = [];

	return {
		list: list
	}

}());

// YouTube API requires this function to fire, so it's outside of the IIFE scope.
function onYouTubePlayerAPIReady() {
	video.ready();
}

// Start the application
video.init();