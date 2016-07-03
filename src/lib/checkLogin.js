var express = require('express');

// Checks if an email is hooked to a session (user logged in). if not, redirect to login
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