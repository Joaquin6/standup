var express         = require('express');
var router          = express.Router();
var commonRouter    = require('./common/commonRouter');

var methods = {
	getCampaignMediaByKey : function(req, res) {
		var methodName = 'GET /campaigns/{campaignId}/media/{mediaType}/{mid}/urls/{key}' + ' ';
		var uri = "campaigns/"  + req.params.campaignId +
			'/media/'     + req.params.mediaType +
			'/'           + req.params.mid +
			'/urls/'      + req.params.key;

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getCampaignMediaById : function(req, res) {
		var methodName = 'GET /campaigns/{campaignId}/media/{mediaType}/{mid}' + ' ';
		var uri = "campaigns/"  + req.params.campaignId +
			'/media/'     + req.params.mediaType +
			'/'           + req.params.mid;

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getCampaignModuleUrls : function(req, res) {
		var methodName = 'GET /campaigns/{campaignId}/modules/{name}/urls' + ' ';
		var uri = "campaigns/"  + req.params.campaignId + '/modules/' + req.params.name + '/urls';

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getCampaignSnippetsByKey : function(req, res) {
		var methodName = 'GET /campaigns/{campaignId}/modules/{name}/snippets/{key}' + ' ';
		var uri = "campaigns/"  + req.params.campaignId + '/modules/' + req.params.name + '/snippets/' + req.params.key;

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getCampaignModuleSnippets : function(req, res) {
		var methodName = 'GET /campaigns/{campaignId}/modules/{name}/snippets' + ' ';
		var uri = "campaigns/"  + req.params.campaignId + '/modules/' + req.params.name + '/snippets';

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getCampaignPlatform : function(req, res) {
		var methodName = 'GET /campaigns/{id}/activity/platforms/{platform}' + ' ';
		var uri = "campaigns/" + req.params.campaignId + '/activity/platforms/' + req.params.platform;

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getCampaignPaymentsReport : function(req, res) {
		var methodName = 'GET /campaigns/{id}/payments/{report}' + ' ';
		var uri = "campaigns/" + req.params.campaignId + '/payments/' + req.params.report;

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getCampaignMediaByType : function(req, res) {
		var methodName = 'GET /campaigns/{id}/media/{mediaType}' + ' ';
		var uri = "campaigns/" + req.params.campaignId + '/media/' + req.params.mediaType;

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getCampaignEventsByTrackname : function(req, res) {
		var methodName = 'GET /campaigns/{campaignId}/events/{trackname}' + ' ';
		var uri = "campaigns/"  + req.params.campaignId + '/events/' + req.params.trackname;

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getCampaignModuleByName : function(req, res) {
		var methodName = 'GET /campaigns/{campaignId}/modules/{name}' + ' ';
		var uri = "campaigns/"  + req.params.campaignId + '/modules/' + req.params.name;

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getCampaignPlatforms : function(req, res) {
		var methodName = 'GET /campaigns/{id}/activity/platforms' + ' ';
		var uri = "campaigns/" + req.params.campaignId + '/activity/platforms';

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getCampaignActivity : function(req, res) {
		var methodName = 'GET /campaigns/{id}/activity' + ' ';
		var uri = "campaigns/" + req.params.campaignId + '/activity';

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getCampaignMedia : function(req, res) {
		var methodName = 'GET /campaigns/{id}/media' + ' ';
		var uri = "campaigns/" + req.params.campaignId + '/media';

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getCampaignTopics : function(req, res) {
		var methodName = 'GET /campaigns/{id}/topics' + ' ';
		var uri = "campaigns/" + req.params.campaignId + '/topics';

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getCampaignLinks : function(req, res) {
		var methodName = 'GET /campaigns/{id}/links' + ' ';
		var uri = "campaigns/" + req.params.campaignId + '/links';

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getCampaignCopy : function(req, res) {
		var methodName = 'GET /campaigns/{id}/copy' + ' ';
		var uri = "campaigns/" + req.params.campaignId + '/copy';

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getCampaignParticipations : function(req, res) {
		var methodName = 'GET /campaigns/{id}/participations' + ' ';
		var uri = "campaigns/" + req.params.campaignId + '/participations';

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getCampaignEvents : function(req, res) {
		var methodName = 'GET /campaigns/{campaignId}/events' + ' ';
		var uri = "campaigns/"  + req.params.campaignId + '/events';

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getCampaignModules : function(req, res) {
		var methodName = 'GET /campaigns/{campaignId}/modules' + ' ';
		var uri = "campaigns/"  + req.params.campaignId + '/modules';

		commonRouter.GetResource(req, res, methodName, uri);
	},
	checkCampaignExists : function(req, res) {
		var methodName = 'HEAD /campaigns/{id}' + ' ';
		var uri = "campaigns/" + req.params.campaignId;

		commonRouter.HeadResource(req, res, methodName, uri);
	},
	getCampaign : function(req, res) {
		var methodName = 'GET /campaigns/{id}' + ' ';
		var uri = "campaigns/" + req.params.campaignId;

		commonRouter.GetResource(req, res, methodName, uri);
	},
	searchCampaigns : function(req, res) {
		var methodName = 'POST /campaigns/search' + ' ';
		var uri = "campaigns/_search";

		commonRouter.PostResource(req, res, methodName, uri);
	},
	getCampaigns : function(req, res) {
		var methodName = 'GET /campaigns' + ' ';
		var uri = "campaigns";

		commonRouter.GetResource(req, res, methodName, uri);
	},
	updateCampaignCopy : function(req, res) {
		var methodName = 'PUT /campaigns/{campaignId}/copy' + ' ';
		var uri = "campaigns/"  + req.params.campaignId + '/copy';

		commonRouter.PutResource(req, res, methodName, uri);
	},
	createCampaign : function(req, res) {
		var methodName = 'POST /campaigns' + ' ';
		var uri = "campaigns";

		commonRouter.PostResource(req, res, methodName, uri);
	},
	updateCampaignLinks : function(req, res) {
		var methodName = 'PUT /campaigns/{campaignId}/links' + ' ';
		var uri = "campaigns/"  + req.params.campaignId + '/links';

		commonRouter.PutResource(req, res, methodName, uri);
	},
	updateCampaignTopics : function(req, res) {
		var methodName = 'PUT /campaigns/{campaignId}/topics' + ' ';
		var uri = "campaigns/"  + req.params.campaignId + '/topics';

		commonRouter.PutResource(req, res, methodName, uri);
	},
	addMediaFile : function(req, res) {
		var methodName = 'POST /campaigns/{campaignId}/media/{mediaType}/file' + ' ';
		var uri = "campaigns/"  + req.params.campaignId +
			"/media/"     + req.params.mediaType  +
			"/file";

		commonRouter.PostResourceBinary(req, res, methodName, uri);
	},
	addMedia : function(req, res) {
		var methodName = 'POST /campaigns/{campaignId}/media/{mediaType}' + ' ';
		var uri = "campaigns/"  + req.params.campaignId +
				  "/media/"     + req.params.mediaType;

		commonRouter.PostResource(req, res, methodName, uri);
	},
	updateMediaById : function(req, res) {
		var methodName = 'PUT /campaigns/{campaignId}/media/{mediaType}/{mid}' + ' ';
		var uri = "campaigns/"  + req.params.campaignId +
				  '/media/'     + req.params.mediaType +
				  '/'           + req.params.mid;

		commonRouter.PutResource(req, res, methodName, uri);
	},
	deleteMediaById : function(req, res) {
		var methodName = 'DELETE /campaigns/{campaignId}/media/{mediaType}/{mid}' + ' ';
		var uri = "campaigns/"  + req.params.campaignId +
				  '/media/'     + req.params.mediaType +
				  '/'           + req.params.mid;

		commonRouter.DeleteResource(req, res, methodName, uri);
	},
	updateMediaUriByKey : function(req, res) {
		var methodName = 'PUT /campaigns/{campaignId}/media/{mediaType}/{mid}/urls/{key}' + ' ';
		var uri = "campaigns/"  + req.params.campaignId +
				  '/media/'     + req.params.mediaType +
				  '/'           + req.params.mid +
				  '/urls/'      + req.params.key;

		commonRouter.PutResource(req, res, methodName, uri);
	},
	addCampaignEvents : function(req, res) {
		var methodName = 'POST /campaigns/{campaignId}/events' + ' ';
		var uri = "campaigns/" + req.params.campaignId + "/events";

		commonRouter.PostResource(req, res, methodName, uri);
	},
	updateCampaignEventByTrackname : function(req, res) {
		var methodName = 'PUT /campaigns/{campaignId}/events/{trackname}' + ' ';
		var uri = "campaigns/"  + req.params.campaignId + '/events/' + req.params.trackname;

		commonRouter.PutResource(req, res, methodName, uri);
	},
	deleteCampaignEventByTrackname : function(req, res) {
		var methodName = 'DELETE /campaigns/{campaignId}/events/{trackname}' + ' ';
		var uri = "campaigns/"  + req.params.campaignId + '/events/' + req.params.trackname;

		commonRouter.DeleteResource(req, res, methodName, uri);
	},
	postCampaignModules : function(req, res) {
		var methodName = 'POST /campaigns/{id}/modules' + ' ';
		var uri = "campaigns/" + req.params.campaignId + "/modules";

		commonRouter.PostResource(req, res, methodName, uri);
	},
	updateCampaignModule : function(req, res) {
		var methodName = 'PUT /campaigns/{id}/modules/{name}' + ' ';
		var uri = "campaigns/"  + req.params.campaignId +
				  "/modules/"       + req.params.name;

		commonRouter.PutResource(req, res, methodName, uri);
	},
	deleteCampaignModule : function(req, res) {
		var methodName = 'DELETE /campaigns/{campaignId}/modules/{name}' + ' ';
		var uri = "campaigns/"  + req.params.campaignId + '/modules/' + req.params.name;

		commonRouter.DeleteResource(req, res, methodName, uri);
	},
	updateCampaignSnippetByKey : function(req, res) {
		var methodName = 'PUT /campaigns/{campaignId}/modules/{name}/snippets/{key}' + ' ';
		var uri = "campaigns/"  + req.params.campaignId + '/modules/' + req.params.name + '/snippets/' + req.params.key;

		commonRouter.PutResource(req, res, methodName, uri);
	},
	addCampaignModuleSnippet : function(req, res) {
		var methodName = 'POST /campaigns/{campaignId}/modules/{name}/snippets' + ' ';
		var uri = "campaigns/"  + req.params.campaignId + '/modules/' + req.params.name + '/snippets';

		commonRouter.PostResource(req, res, methodName, uri);
	},
	deleteCampaignSnippetByKey : function(req, res) {
		var methodName = 'DELETE /campaigns/{campaignId}/modules/{name}/snippets/{key}' + ' ';
		var uri = "campaigns/"  + req.params.campaignId +
				  "/modules/"   + req.params.name +
				  "/snippets/"  + req.params.key;

		commonRouter.DeleteResource(req, res, methodName, uri);
	},
	updateCampaignActivity : function(req, res) {
		var methodName = 'PUT /campaigns/{id}/activity' + ' ';
		var uri = "campaigns/" + req.params.campaignId + '/activity';

		commonRouter.PutResource(req, res, methodName, uri);
	},
	addCampaignPayment : function(req, res) {
		var methodName = 'GET /campaigns/{id}/payments' + ' ';
		var uri = "campaigns/" + req.params.campaignId + '/payments';

		commonRouter.GetResource(req, res, methodName, uri);
	},
	updateCampaign : function(req, res) {
		var methodName = 'PUT /campaigns/{id}' + ' ';
		var uri = "campaigns/" + req.params.campaignId;

		commonRouter.PutResource(req, res, methodName, uri);
	}
};

//Routes are evaluated in order, i.e. more specific and longer routes must be first
//Certain verbs like HEAD must be place before GET if they answer to the same uri

router.get('/:campaignId/media/:mediaType/:mid/urls/:key', methods.getCampaignMediaByKey);

router.put('/:campaignId/media/:mediaType/:mid/urls/:key', methods.updateMediaUriByKey);

router.put('/:campaignId/media/:mediaType/:mid', methods.updateMediaById);

router.delete('/:campaignId/media/:mediaType/:mid', methods.deleteMediaById);

router.get('/:campaignId/media/:mediaType/:mid', methods.getCampaignMediaById);

router.get('/:campaignId/modules/:name/urls', methods.getCampaignModuleUrls);

router.delete('/:campaignId/modules/:name/snippets/:key', methods.deleteCampaignSnippetByKey);

router.put('/:campaignId/modules/:name/snippets/:key', methods.updateCampaignSnippetByKey);

router.get('/:campaignId/modules/:name/snippets/:key', methods.getCampaignSnippetsByKey);

router.post('/:campaignId/modules/:name/snippets', methods.addCampaignModuleSnippet);

router.get('/:campaignId/modules/:name/snippets', methods.getCampaignModuleSnippets);

router.get('/:campaignId/activity/platforms/:platform', methods.getCampaignPlatform);

router.get('/:campaignId/payments/:report', methods.getCampaignPaymentsReport);

router.post('/:campaignId/payments', methods.addCampaignPayment);

router.get('/:campaignId/media/:mediaType', methods.getCampaignMediaByType);

router.delete('/:campaignId/events/:trackname', methods.deleteCampaignEventByTrackname);

router.put('/:campaignId/events/:trackname', methods.updateCampaignEventByTrackname);

router.get('/:campaignId/events/:trackname', methods.getCampaignEventsByTrackname);

router.get('/:campaignId/modules/:name', methods.getCampaignModuleByName);

router.get('/:campaignId/activity/platforms', methods.getCampaignPlatforms);

router.get('/:campaignId/activity', methods.getCampaignActivity);

router.get('/:campaignId/media', methods.getCampaignMedia);

router.get('/:campaignId/topics', methods.getCampaignTopics);

router.get('/:campaignId/links', methods.getCampaignLinks);

router.get('/:campaignId/copy', methods.getCampaignCopy);

router.get('/:campaignId/participations', methods.getCampaignParticipations);

router.get('/:campaignId/events', methods.getCampaignEvents);

router.post('/:campaignId/events', methods.addCampaignEvents);

router.post('/:campaignId/modules', methods.postCampaignModules);

router.get('/:campaignId/modules', methods.getCampaignModules);

router.head('/:campaignId', methods.checkCampaignExists);

router.get('/:campaignId', methods.getCampaign);

router.post('/search', methods.searchCampaigns);

router.get('/', methods.getCampaigns);

router.put('/:campaignId/copy', methods.updateCampaignCopy);

router.post('/', methods.createCampaign);

router.put('/:campaignId/links', methods.updateCampaignLinks);

router.put('/:campaignId/topics', methods.updateCampaignTopics);

router.post('/:campaignId/media/:mediaType/file', global.uploadFile.single('file'), methods.addMediaFile);

router.post('/:campaignId/media/:mediaType', methods.addMedia);

router.put('/:campaignId/modules/:name', methods.updateCampaignModule);

router.delete('/:campaignId/modules/:name', methods.deleteCampaignModule);

router.put('/:campaignId/activity', methods.updateCampaignActivity);

router.put('/:campaignId', methods.updateCampaign);

module.exports = {
	Router  : router,
	Methods : methods
};
