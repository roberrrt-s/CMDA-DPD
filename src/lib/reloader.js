var reloader = {

	send: function() {
		io.sockets.emit('reload');
	}
}

module.exports = reloader;