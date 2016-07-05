var express = require('express');

var renderOutput = {

	init: function(res, params) {
		res.render('api/index', params)
	}

}

module.exports = renderOutput;