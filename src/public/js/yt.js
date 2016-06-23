var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var body = document.body,
	html = document.documentElement;

var totalHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
var totalWidth = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);

var player;

function onYouTubePlayerAPIReady() {
	player = new YT.Player('yt-video', {
		height: totalHeight,
		width: totalWidth,
		videoId: 'fB28wli-AVA',
		events: {
			'onReady': onPlayerReady,
		}
	});
}

function onPlayerReady(event) {
	event.target.playVideo();
}