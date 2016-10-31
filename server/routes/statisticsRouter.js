var Q = require("q");
var express = require('express');
var router = express.Router();

var Statistics = require('../models/statistics');
var Utility  = require('../helpers/utilHelper');

router.get('/', function(req, res) {
	Statistics.getStats(req, res).then(function(apiResponse) {
		if (res) {
			res.headers = apiResponse.headers;
	        res.setHeader("Content-Type", "application/json; charset=utf-8");
	        res.setHeader("Access-Control-Allow-Headers", "Content-Type, api_key");
	        var bodyUtil = Utility.dump(apiResponse.body);
	        return res.status(apiResponse.statusCode).send(bodyUtil);
		}
	}).fail(function(err) {
		console.log(methodName + ' ' + colors.red('Failed'));
		console.dir(err);
	}).done();
});


module.exports = router;
