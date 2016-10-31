var express = require('express');
var router = express.Router();
var commonRouter = require('./common/commonRouter');

var methods = {
	login: function(req, res) {
		var methodName = 'POST /auth/login';
		var uri = "auth/login";
		commonRouter.PostResource(req, res, methodName, uri);
	},
	refreshToken: function(req, res) {
		var methodName = 'POST /auth/refresh' + ' ';
		var uri = "auth/refresh";
		commonRouter.PostResource(req, res, methodName, uri);
	},
	registerAccount: function(req, res) {
		var methodName = 'POST /auth' + ' ';
		var uri = "auth/register";
		commonRouter.PostResource(req, res, methodName, uri);
	}
};

router.post('/login', methods.login);
router.post('/refresh', methods.refreshToken);
router.post('/account', methods.registerAccount);

module.exports = {
	Router: router,
	Methods: methods
};