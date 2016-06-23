var express = require('express');

var checkLogin = function(session) {
	if(session.email) {
		return true;
	}
	return false;
}

module.exports = checkLogin;