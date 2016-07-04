var express = require('express'),
	Twitter = require('twitter');

var twit = {

	init: function() {

		var initiate = new Twitter ({
			consumer_key: 'D6qLrQ92OhUtHY1UbGXWmm6jQ',
			consumer_secret: 'z1LJKsY0t15PPLp6XP473OvaOA7S628bAO2ykY68D4PUKVMazU',
			access_token_key: '3542656995-gMKrBC4gvQmEYrhkEbiXW5N1izGjcUmvzuiyoKG',
			access_token_secret: '24gvScKfNpr38GQDWD2FrHbZbrHfwmqGb8ZIJXs5RRsu4'
		});

		return initiate

	}

}

module.exports = twit;