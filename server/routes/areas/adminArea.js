var express             = require('express');
var router              = express.Router();

var usersRouter             = require('../usersRouter');
var campaignsRouter         = require('../campaignsRouter');
var authenticationRouter    = require('../authenticationRouter');
var participationsRouter    = require('../participationsRouter');
var tagsRouter              = require('../tagsRouter');
var topicsRouter            = require('../topicsRouter');

var authenticationCtrl 		= require('../../controllers/authentication');

//Routes are evaluated in order, i.e. more specific and longer routes must be first
//Certain verbs like HEAD must be place before GET if they answer to the same uri

//Inside the areas we had to wrap the router functions in another function to allow rewire to inject dependencies

//Tags

router.get('/tags/', function(req, res){ tagsRouter.Methods.getTags(req, res);} );
router.post('/tags/', function(req, res){ tagsRouter.Methods.addTags(req, res);} );

//Topics

router.get('/topics/', function(req, res){ topicsRouter.Methods.getTopics(req, res);} );
router.post('/topics/', function(req, res){ topicsRouter.Methods.addTopics(req, res);} );

//Participations

router.get('/participations/:participationId', function(req, res){ participationsRouter.Methods.getParticipation(req, res);} );

router.get('/participations/:participationId/actions', function(req, res){ participationsRouter.Methods.getParticipationActions(req, res);} );

router.get('/participations/:participationId/links', function(req, res){ participationsRouter.Methods.getParticipationLinks(req, res);} );

router.get('/participations/:participationId/platforms', function(req, res){ participationsRouter.Methods.getParticipationPlatforms(req, res);} );

router.get('/participations/:participationId/activity/:report', function(req, res){ participationsRouter.Methods.getParticipationReport(req, res);} );

router.get('/participations/:participationId/activity/:report/:type', function(req, res){ participationsRouter.Methods.getParticipationReportType(req, res);} );

router.get('/participations/:participationId/activity', function(req, res){ participationsRouter.Methods.getParticipationActivity(req, res);} );

router.get('/participations/:participationId/:platform', function(req, res){ participationsRouter.Methods.getParticipationPlatform(req, res);} );

router.post('/participations/', function(req, res){ participationsRouter.Methods.createParticipation(req, res);} );

router.post('/participations/:participationId/shares', function(req, res){ participationsRouter.Methods.createParticipationShare(req, res);} );

router.post('/participations/:participationId/actions', function(req, res){ participationsRouter.Methods.createParticipationAction(req, res);} );

router.post('/participations/search', function(req, res){ participationsRouter.Methods.participationSearch(req, res);} );

router.put('/participations/:participationId/links', function(req, res){ participationsRouter.Methods.updateParticipationLinks(req, res);} );

router.put('/participations/:participationId/activity', function(req, res){ participationsRouter.Methods.updateParticipationActivity(req, res);} );

router.put('/participations/:participationId', function(req, res){ participationsRouter.Methods.updateParticipation(req, res);} );


//Authentication & Authorization

router.post('/login', function(req, res, next) {
	authenticationCtrl.login(req, res, next).then(function(account) {
		return res.status(200).json(account);
	}).fail(function(err) {
		return res.status(err.statusCode || err.code || 400).send(err);
	}).done();
});

router.post('/refresh', function(req, res, next) {
	authenticationCtrl.refreshToken(req, res, next).then(function(account) {
		return res.status(200).json(account);
	}).fail(function(err) {
		return res.status(err.statusCode || err.code || 400).send(err);
	}).done();
});

router.post('/account', function(req, res){ authenticationRouter.Methods.registerAccount(req, res);} );

//Payments
router.get('/payments/user/:userId', function(req, res) { usersRouter.Methods.getUserPayments(req,res); });

router.get('/payments/user/:userId/status', function(req, res) { usersRouter.Methods.getUserPaymentStatus(req, res) });

//Campaigns

router.get('/campaigns/:campaignId/media/:mediaType/:mid/urls/:key', function(req, res){ campaignsRouter.Methods.getCampaignMediaByKey(req, res);} );

router.put('/campaigns/:campaignId/media/:mediaType/:mid/urls/:key', function(req, res){ campaignsRouter.Methods.updateMediaUriByKey(req, res);} );

router.put('/campaigns/:campaignId/media/:mediaType/:mid', function(req, res){ campaignsRouter.Methods.updateMediaById(req, res);} );

router.delete('/campaigns/:campaignId/media/:mediaType/:mid', function(req, res){ campaignsRouter.Methods.deleteMediaById(req, res);} );

router.get('/campaigns/:campaignId/media/:mediaType/:mid', function(req, res){ campaignsRouter.Methods.getCampaignMediaById(req, res);} );

router.get('/campaigns/:campaignId/modules/:name/urls', function(req, res){ campaignsRouter.Methods.getCampaignModuleUrls(req, res);} );

router.delete('/campaigns/:campaignId/modules/:name/snippets/:key', function(req, res){ campaignsRouter.Methods.deleteCampaignSnippetByKey(req, res);} );

router.put('/campaigns/:campaignId/modules/:name/snippets/:key', function(req, res){ campaignsRouter.Methods.updateCampaignSnippetByKey(req, res);} );

router.get('/campaigns/:campaignId/modules/:name/snippets/:key', function(req, res){ campaignsRouter.Methods.getCampaignSnippetsByKey(req, res);} );

router.post('/campaigns/:campaignId/modules/:name/snippets', function(req, res){ campaignsRouter.Methods.addCampaignModuleSnippet(req, res);} );

router.get('/campaigns/:campaignId/modules/:name/snippets', function(req, res){ campaignsRouter.Methods.getCampaignModuleSnippets(req, res);} );

router.get('/campaigns/:campaignId/activity/platforms/:platform', function(req, res){ campaignsRouter.Methods.getCampaignPlatform(req, res);} );

router.get('/campaigns/:campaignId/payments/:report', function(req, res){ campaignsRouter.Methods.getCampaignPaymentsReport(req, res);} );

router.post('/campaigns/:campaignId/payments', function(req, res){ campaignsRouter.Methods.addCampaignPayment(req, res);} );

router.get('/campaigns/:campaignId/media/:mediaType', function(req, res){ campaignsRouter.Methods.getCampaignMediaByType(req, res);} );

router.delete('/campaigns/:campaignId/events/:trackname', function(req, res){ campaignsRouter.Methods.deleteCampaignEventByTrackname(req, res);} );

router.put('/campaigns/:campaignId/events/:trackname', function(req, res){ campaignsRouter.Methods.updateCampaignEventByTrackname(req, res);} );

router.get('/campaigns/:campaignId/events/:trackname', function(req, res){ campaignsRouter.Methods.getCampaignEventsByTrackname(req, res);} );

router.get('/campaigns/:campaignId/modules/:name', function(req, res){ campaignsRouter.Methods.getCampaignModuleByName(req, res);} );

router.get('/campaigns/:campaignId/activity/platforms', function(req, res){ campaignsRouter.Methods.getCampaignPlatforms(req, res);} );

router.get('/campaigns/:campaignId/activity', function(req, res){ campaignsRouter.Methods.getCampaignActivity(req, res);} );

router.get('/campaigns/:campaignId/media', function(req, res){ campaignsRouter.Methods.getCampaignMedia(req, res);} );

router.get('/campaigns/:campaignId/topics', function(req, res){ campaignsRouter.Methods.getCampaignTopics(req, res);} );

router.get('/campaigns/:campaignId/links', function(req, res){ campaignsRouter.Methods.getCampaignLinks(req, res);} );

router.get('/campaigns/:campaignId/copy', function(req, res){ campaignsRouter.Methods.getCampaignCopy(req, res);} );

router.get('/campaigns/:campaignId/participations', function(req, res){ campaignsRouter.Methods.getCampaignParticipations(req, res);} );

router.get('/campaigns/:campaignId/events', function(req, res){ campaignsRouter.Methods.getCampaignEvents(req, res);} );

router.post('/campaigns/:campaignId/events', function(req, res){ campaignsRouter.Methods.addCampaignEvents(req, res);} );

router.post('/campaigns/:campaignId/modules', function(req, res){ campaignsRouter.Methods.postCampaignModules(req, res);} );

router.get('/campaigns/:campaignId/modules', function(req, res){ campaignsRouter.Methods.getCampaignModules(req, res);} );

router.head('/campaigns/:campaignId', function(req, res){ campaignsRouter.Methods.checkCampaignExists(req, res);} );

router.get('/campaigns/:campaignId', function(req, res){ campaignsRouter.Methods.getCampaign(req, res);} );

router.post('/campaigns/search', function(req, res){ campaignsRouter.Methods.searchCampaigns(req, res);} );

router.get('/campaigns', function(req, res){ campaignsRouter.Methods.getCampaigns(req, res);} );

router.put('/campaigns/:campaignId/copy', function(req, res){ campaignsRouter.Methods.updateCampaignCopy(req, res);} );

router.post('/campaigns', function(req, res){ campaignsRouter.Methods.createCampaign(req, res);} );

router.put('/campaigns/:campaignId/links', function(req, res){ campaignsRouter.Methods.updateCampaignLinks(req, res);} );

router.put('/campaigns/:campaignId/topics', function(req, res){ campaignsRouter.Methods.updateCampaignTopics(req, res);} );

router.post('/campaigns/:campaignId/media/:mediaType/file', global.uploadFile.single('file'), function(req, res){ campaignsRouter.Methods.addMediaFile(req, res);} );

router.post('/campaigns/:campaignId/media/:mediaType', function(req, res){ campaignsRouter.Methods.addMedia(req, res);} );

router.put('/campaigns/:campaignId/modules/:name', function(req, res){ campaignsRouter.Methods.updateCampaignModule(req, res);} );

router.delete('/campaigns/:campaignId/modules/:name', function(req, res){ campaignsRouter.Methods.deleteCampaignModule(req, res);} );

router.put('/campaigns/:campaignId/activity', function(req, res){ campaignsRouter.Methods.updateCampaignActivity(req, res);} );

router.put('/campaigns/:campaignId', function(req, res){ campaignsRouter.Methods.updateCampaign(req, res);} );

//Users

router.get('/users/:userId', function(req, res){ usersRouter.Methods.getUserById(req, res);} );

router.put('/users/:userId/platforms/:pid', function(req, res){ usersRouter.Methods.putUserPlatformById(req, res);} );

router.get('/users/:userId/platforms/:pid', function(req, res){ usersRouter.Methods.getUserPlatform(req, res);} );

router.post('/users/:userId/platforms', function(req, res){ usersRouter.Methods.postUserPlatforms(req, res);} );

router.put('/users/:userId/platforms', function(req, res){ usersRouter.Methods.putUserPlatforms(req, res);} );

router.get('/users/:userId/platforms', function(req, res){ usersRouter.Methods.getUserPlatforms(req, res);} );

router.post('/users/:userId/paymentinfo/w9', global.uploadFile.single('file'), function(req, res){ usersRouter.Methods.postUserW9(req, res);} );

router.get('/users/:userId/paymentinfo/w9', function(req, res){ usersRouter.Methods.getUserW9(req, res);} );

router.put('/users/:userId/paymentinfo', function(req, res){ usersRouter.Methods.putUserPaymentInfo(req, res);} );

router.get('/users/:userId/paymentinfo', function(req, res){ usersRouter.Methods.getUserPaymentInfo(req, res);} );

router.get('/users/:userId/status', function(req, res){ usersRouter.Methods.getUserStatus(req, res);} );

router.get('/users/:userId/paymentstatus', function(req, res){ usersRouter.Methods.getUserPaymentStatus(req, res);} );

router.get('/users/:userId/tags', function(req, res){ usersRouter.Methods.getUserTags(req, res);} );

router.put('/users/:userId/topics', function(req, res){ usersRouter.Methods.putUserTopics(req, res);} );

router.get('/users/:userId/topics', function(req, res){ usersRouter.Methods.getUserTopics(req, res);} );

router.get('/users/:userId/participations', function(req, res){ usersRouter.Methods.getUserParticipations(req, res);} );

router.post('/users/:userId/approvals', function(req, res){ usersRouter.Methods.addUserApprovals(req, res);} );

router.get('/users/:userId/approvals', function(req, res){ usersRouter.Methods.getUserApprovals(req, res);} );

router.get('/users/:userId', function(req, res){ usersRouter.Methods.getUserById(req, res);} );

router.put('/users/:userId', function(req, res){ usersRouter.Methods.putUserById(req, res);} );

router.get('/users/:userId/fraud/links', function(req, res){ usersRouter.Methods.getUserFraudLinks(req, res);} );

router.get('/users/:userId/fraud', function(req, res){ usersRouter.Methods.getFraudulentUsers(req, res);} );

router.post('/users/:userId/addresses/:addressId', function(req, res){ usersRouter.Methods.putAddress(req, res);} );

router.post('/users/:userId/addresses', function(req, res){ usersRouter.Methods.addAddress(req, res);} );

router.put('/users/:userId/tags', function(req, res){ usersRouter.Methods.putTags(req, res);} );

router.post('/users/search', function(req, res){ usersRouter.Methods.searchUsers(req, res);} );

router.get('/users', function(req, res){ usersRouter.Methods.getUsers(req, res);} );

router.post('/users', function(req, res){ usersRouter.Methods.postUsers(req, res);} );

module.exports = {
	Router: router
};
