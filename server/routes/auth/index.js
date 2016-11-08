var express             = require('express');
var router              = express.Router();

var authenticationCtrl 	= require('../../controllers/authentication');

var methods = {
	login: function(req, res, next) {
		authenticationCtrl.login(req, res, next).then(function(account) {
			return res.status(200).json(account);
		}).fail(function(err) {
			return res.status(err.statusCode || err.code || 400).send(err);
		}).done();
	},
	refreshToken: function(req, res, next) {
		authenticationCtrl.refreshToken(req, res, next).then(function(account) {
			return res.status(200).json(account);
		}).fail(function(err) {
			return res.status(err.statusCode || err.code || 400).send(err);
		}).done();
	}
};

/** Authentication & Authorization */
router.post('/login', methods.login);
router.post('/refresh', methods.refreshToken);

module.exports = {
	Router: router,
	Methods: methods
};