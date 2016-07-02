var express = require('express');

var checkLogin = function(session, res) {
	if(session.email) {
		return true;
	}
	else {
		res.redirect('/dashboard/login/');
		return false;		
	}
}

module.exports = checkLogin;