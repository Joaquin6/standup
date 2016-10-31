var express                     = require('express');
var router                      = express.Router();
var httpHelper                  = require('../helpers/httpHelper');
var commonRouter                = require('./common/commonRouter');

//new methods

var methods = {

	getParticipation :	function(req, res) {
		var methodName = 'GET /participations/{id}' + ' ';
		var uri = "participations/" + req.params.participationId;
		commonRouter.GetResource(req, res, methodName, uri);
	},
	getParticipationActions :  function(req, res) {
		var methodName = 'GET /participations/{id}/actions' + ' ';
		var uri = "participations/" + req.params.participationId + "/actions";

		commonRouter.GetResource(req, res, methodName, uri);
	},

	getParticipationLinks : function(req, res) {
		var methodName = 'GET /participations/{id}/_links' + ' ';
		var uri = "participations/" + req.params.participationId + "/_links";

		commonRouter.GetResource(req, res, methodName, uri);
	},

	getParticipationPlatforms: function(req, res) {
		var methodName = 'GET /participations/{id}/platforms' + ' ';
		var uri = "participations/" + req.params.participationId + "/activity/platforms";

		commonRouter.GetResource(req, res, methodName, uri);
	},

	getParticipationActivity: function(req, res) {
		var methodName = 'GET /participations/{id}/activity' + ' ';
		var uri = "participations/" + req.params.participationId + "/activity";

		commonRouter.GetResource(req, res, methodName, uri);
	},


	getParticipationPlatform : function(req, res) {
		var methodName = 'GET /participations/{id}/{platform}' + ' ';
		var uri = "participations/" + req.params.participationId + "/activity/platforms/" + req.params.platform;

		commonRouter.GetResource(req, res, methodName, uri);
	},


	getParticipationReport : function(req, res) {
		var methodName = 'GET /participations/{id}/activity/{report}' + ' ';
		var uri = "participations/" + req.params.participationId + "/activity/" + req.params.report +"?[dates][from]="+req.query.datesFrom+"&[dates][to]="+req.query.datesTo+"&[freq][slice]="+req.query.freqSlice+
			      "&[freq][amount]="+req.query.freqAmount+"&[series][submitted]="+req.query.seriesSubmitted+"&[series][approved]="+req.query.seriesApproved;

		commonRouter.GetResource(req, res, methodName, uri);
	},

	getParticipationReportType : function(req, res) {
		var methodName = 'GET /participations/{id}/activity/{report}/{type}' + ' ';
		var uri = "participations/" + req.params.participationId + "/activity/" + req.params.report +"/"+req.params.type+"?[dates][from]="+req.query.datesFrom+"&[dates][to]="+req.query.datesTo+"&[freq][slice]="+req.query.freqSlice+
			"&[freq][amount]="+req.query.freqAmount+"&[series][submitted]="+req.query.seriesSubmitted+"&[series][approved]="+req.query.seriesApproved;

		commonRouter.GetResource(req, res, methodName, uri);
	},

    createParticipation : function(req, res) {
        var methodName = 'POST /participations' + ' ';
        var uri = "participations";

        commonRouter.PostResource(req, res, methodName, uri);
    },

    createParticipationShare : function(req, res) {
        var methodName = 'POST /participations/{participationId}/shares' + ' ';
        var uri = "participations/"+ req.params.participationId + "/shares";

        commonRouter.PostResource(req, res, methodName, uri);
    },

    createParticipationAction : function(req, res) {
        var methodName = 'POST /participations/{participationId}/actions' + ' ';
        var uri = "participations/"+ req.params.participationId + "/actions";

        commonRouter.PostResource(req, res, methodName, uri);
    },

    participationSearch : function(req, res) {
        var methodName = 'POST /participations/search' + ' ';
        var uri = "participations/_search";

        commonRouter.PostResource(req, res, methodName, uri);
    },

    updateParticipationLinks : function(req, res) {
        var methodName = 'PUT /participations/{participationId}/links' + ' ';
        var uri = "participations/" + req.params.participationId + "/links";

        commonRouter.PutResource(req, res, methodName, uri);
    },

    updateParticipationActivity : function(req, res) {
        var methodName = 'PUT /participations/{participationId}/activity' + ' ';
        var uri = "participations/" + req.params.participationId + "/activity";

        commonRouter.PutResource(req, res, methodName, uri);
    },

    updateParticipation : function(req, res) {
        var methodName = 'PUT /participations/{participationId}' + ' ';
        var uri = "participations/" + req.params.participationId + "";

        commonRouter.PutResource(req, res, methodName, uri);
    },



}


router.get('/:participationId', methods.getParticipation);

router.get('/:participationId/actions', methods.getParticipationActions);

router.get('/:participationId/links', methods.getParticipationLinks);

router.get('/:participationId/platforms', methods.getParticipationPlatforms);

router.get('/:participationId/activity/:report', methods.getParticipationReport);

router.get('/:participationId/activity/:report/:type', methods.getParticipationReportType);

router.get('/:participationId/activity', methods.getParticipationActivity);

router.get('/:participationId/:platform', methods.getParticipationPlatform);

router.post('/', methods.createParticipation);

router.post('/:participationId/shares', methods.createParticipationShare);

router.post('/:participationId/actions', methods.createParticipationAction);

router.post('/search', methods.participationSearch);

router.put('/:participationId/links', methods.updateParticipationLinks);

router.put('/:participationId/activity', methods.updateParticipationActivity);

router.put('/:participationId', methods.updateParticipation);


module.exports = {
	Router : router,
	Methods : methods
};

