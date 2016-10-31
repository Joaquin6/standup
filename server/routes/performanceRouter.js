var Q 				= require("q");
var clc    			= require("cli-color");
var express 		= require('express');
var router 			= express.Router();

var Performance 	= require('../models/performance');
var Utility  		= require('../helpers/utilHelper');

function handleSocialPixelOverall(req, res) {
	Performance.getSocialpixel(req, res).then(function(apiResponse) {
		if (res) {
	        var bodyUtil = Utility.dump(apiResponse);
	        return res.status(200).send(bodyUtil);
		}
	}).fail(function(err) {
		console.dir(clc.red(err));
		return res.status(404).send(err.message);
	}).done();
}

router.get('/socialpixel/overall', handleSocialPixelOverall);
router.get('/socialpixel/overall/top/:limit', handleSocialPixelOverall);
router.get('/socialpixel/overall/bottom/:limit', handleSocialPixelOverall);

// router.get('/socialpixel/:rsid/all', function(req, res) {
// 	Performance.getAllSocialpixel(req, res).then(function(apiResponse) {
// 		if (res) {
// 	        var bodyUtil = Utility.dump(apiResponse);
// 	        return res.status(200).send(bodyUtil);
// 		}
// 	}).fail(function(err) {
// 		console.dir(clc.red(err));
// 		return res.status(404).send(err.message);
// 	}).done();
// });

function handleCampaignsOverall(req, res) {
	Performance.getCampaigns(req, res).then(function(apiResponse) {
		if (res) {
	        var bodyUtil = Utility.dump(apiResponse);
	        return res.status(200).send(bodyUtil);
		}
	}).fail(function(err) {
		console.dir(clc.red(err));
		return res.status(404).send(err.message);
	}).done();
}

router.get('/campaigns', handleCampaignsOverall);
router.get('/campaigns/:uid', handleCampaignsOverall);
router.get('/campaigns/:uid/pagevisits', handleCampaignsOverall);
router.get('/campaigns/:uid/socialpixel/overall', handleCampaignsOverall);

function handlePageVisitsAPI(req, res) {
	Performance.getPageVisits(req, res).then(function(apiResponse) {
		if (res) {
	        var bodyUtil = Utility.dump(apiResponse);
	        return res.status(200).send(bodyUtil);
		}
	}).fail(function(err) {
		console.dir(clc.red(err));
		return res.status(404).send(err.message);
	}).done();
}

router.get('/pagevisits', handlePageVisitsAPI);

module.exports = router;