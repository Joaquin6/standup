var express         = require('express');
var router          = express.Router();
var commonRouter    = require('./common/commonRouter');

var methods = {
	getUserById : function(req, res) {
		var methodName = 'GET /users/{userId}' + ' ';
		var uri = "users/"  + req.params.userId;

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getUserParticipations : function getUserParticipations(req, res) {
		var methodName = 'GET /participations?user={userId}/' + ' ';
		var uri = "participations?user=" + req.params.userId
		commonRouter.GetResource(req, res, methodName, uri);
	},
	getFraudulentUsers : function(req, res) {
		var methodName = 'GET /users/fraud' + ' ';
		var uri = "users/fraud";

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getUsers : function(req, res) {
		var methodName = 'GET /users' + ' ';
		var uri = "users";

		commonRouter.GetResource(req, res, methodName, uri);
	},
	searchUsers : function(req, res) {
		var methodName = 'POST /users/search' + ' ';
		var uri = "users/_search";

		commonRouter.PostResource(req, res, methodName, uri);
	},
	getUserTopics : function(req, res) {
		var methodName = 'GET /users/{userId}/topics' + ' ';
		var uri = "users/"  + req.params.userId + "/topics";

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getUserTags : function(req, res) {
		var methodName = 'GET /users/{userId}/tags' + ' ';
		var uri = "users/"  + req.params.userId + "/tags";

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getUserPlatforms : function(req, res) {
		var methodName = 'GET /users/{userId}/platforms' + ' ';
		var uri = "users/"  + req.params.userId + "/platforms";

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getUserPlatform : function(req, res) {
		var methodName = 'GET /users/{userId}/platforms/{pid}' + ' ';
		var uri = "users/"  + req.params.userId + "/platforms/" + req.params.pid;

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getUserPaymentInfo : function(req, res) {
		var methodName = 'GET /users/{userId}/paymentinfo' + ' ';
		var uri = "users/"  + req.params.userId + "/paymentinfo";

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getUserW9 : function(req, res) {
		var methodName = 'GET /users/{userId}/paymentinfo/w9' + ' ';
		var uri = "users/"  + req.params.userId + "/paymentinfo/w9";

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getUserAvatarImage : function(req, res) {
		var methodName = 'GET /users/{userId}/images/avatar' + ' ';
		var uri = "users/"  + req.params.userId + "/images/avatar";

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getUserStatus : function(req, res) {
		var methodName = 'GET /users/{userId}/status' + ' ';
		var uri = "users/"  + req.params.userId + "/status";

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getUserPaymentStatus : function(req, res) {
		var methodName = 'GET /users/{userId}/paymentstatus' + ' ';
		var uri = "users/"  + req.params.userId + "/paymentstatus";

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getUserPayments : function(req, res) {
		var methodName = 'GET /payments/user/{userId}' + ' ';
		var uri = "payments/user/"  + req.params.userId

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getUserApprovals : function(req, res) {
		var methodName = 'GET /users/{userId}/approvals' + ' ';
		var uri = "users/"  + req.params.userId + "/approvals";

		commonRouter.GetResource(req, res, methodName, uri);
	},
	getUserFraudLinks : function(req, res) {
		var methodName = 'GET /users/fraud/links' + ' ';
		var uri = "users/fraud/_links";

		commonRouter.GetResource(req, res, methodName, uri);
	},
	addAddress : function(req, res) {
		var methodName = 'POST /users/{id}/addresses' + ' ';
		var uri = "users/" + req.params.userId + "/addresses";

		commonRouter.PostResource(req, res, methodName, uri);
	},
	putAddress : function(req, res) {
		var methodName = 'PUT /users/{id}/addresses/{aid}' + ' ';
		var uri = "users/" + req.params.userId + "/addresses/" + req.params.addressId;

		commonRouter.PutResource(req, res, methodName, uri);
	},
	putUserTopics : function(req, res) {
		var methodName = 'PUT /users/{id}/topics' + ' ';
		var uri = "users/" + req.params.userId + "/topics";

		commonRouter.PutResource(req, res, methodName, uri);
	},
	putTags : function(req, res) {
		var methodName = 'PUT /users/{id}/tags' + ' ';
		var uri = "users/" + req.params.userId + "/tags";

		commonRouter.PutResource(req, res, methodName, uri);
	},
	postUserPlatforms : function(req, res) {
		var methodName = 'POST /users/{id}/platforms' + ' ';
		var uri = "users/" + req.params.userId + "/platforms";

		commonRouter.PostResource(req, res, methodName, uri);
	},
	putUserPlatforms : function(req, res) {
		var methodName = 'PUT /users/{id}/platforms' + ' ';
		var uri = "users/" + req.params.userId + "/platforms";

		commonRouter.PutResource(req, res, methodName, uri);
	},
	putUserPlatformById : function(req, res) {
		var methodName = 'PUT /users/{id}/platforms/{pid}' + ' ';
		var uri = "users/" + req.params.userId + "/platforms/" + req.params.pid;

		commonRouter.PutResource(req, res, methodName, uri);
	},
	addUserApprovals : function(req, res) {
		var methodName = 'POST /users/{id}/approvals' + ' ';
		var uri = "users/" + req.params.userId + "/approvals";

		commonRouter.PostResource(req, res, methodName, uri);
	},
	putUserPaymentInfo : function(req, res) {
		var methodName = 'PUT /users/{userId}/paymentinfo' + ' ';
		var uri = "users/"  + req.params.userId + "/paymentinfo";

		commonRouter.PutResource(req, res, methodName, uri);
	},
	postUserW9 : function(req, res) {
		var methodName = 'POST /users/{userId}/paymentinfo/w9' + ' ';
		var uri = "users/"  + req.params.userId + "/paymentinfo/w9";

		commonRouter.PostResourceBinary(req, res, methodName, uri);
	},
	postUserAvatarImage : function(req, res) {
		var methodName = 'POST /users/{userId}/images/avatar' + ' ';
		var uri = "users/"  + req.params.userId + "/images/avatar";

		commonRouter.PostResourceBinary(req, res, methodName, uri);
	},
	putUserById : function(req, res) {
		var methodName = 'PUT /users/{userId}' + ' ';
		var uri = "users/"  + req.params.userId;

		commonRouter.PutResource(req, res, methodName, uri);
	},
	postUsers : function(req, res) {
		var methodName = 'POST /users' + ' ';
		var uri = "users";

		commonRouter.PostResourceBinary(req, res, methodName, uri);
	}
};

router.put('/:userId/platforms/:pid', methods.putUserPlatformById);

router.get('/:userId/platforms/:pid', methods.getUserPlatform);

router.post('/:userId/platforms', methods.postUserPlatforms);

router.put('/:userId/platforms', methods.putUserPlatforms);

router.get('/:userId/platforms', methods.getUserPlatforms);

router.post('/:userId/paymentinfo/w9', global.uploadFile.single('file'), methods.postUserW9);

router.get('/:userId/paymentinfo/w9', methods.getUserW9);

router.post('/:userId/images/avatar', global.uploadFile.single('file'), methods.postUserAvatarImage);

router.get('/:userId/images/avatar', methods.getUserAvatarImage);

router.put('/:userId/paymentinfo', methods.putUserPaymentInfo);

router.get('/:userId/paymentinfo', methods.getUserPaymentInfo);

router.get('/:userId/status', methods.getUserStatus);

router.get('/:userId/payments', methods.getUserPayments);

router.get('/:userId/paymentstatus', methods.getUserPaymentStatus);

router.get('/:userId/tags', methods.getUserTags);

router.put('/:userId/topics', methods.putUserTopics);

router.get('/:userId/topics', methods.getUserTopics);

router.get('/:userId/participations', methods.getUserParticipations);

router.post('/:userId/approvals', methods.addUserApprovals);

router.get('/:userId/approvals', methods.getUserApprovals);

router.get('/:userId', methods.getUserById);

router.put('/:userId', methods.putUserById);

router.get('/:userId/fraud/links', methods.getUserFraudLinks);

router.get('/fraud', methods.getFraudulentUsers);

router.put('/:userId/addresses/:addressId', methods.putAddress);

router.post('/:userId/addresses', methods.addAddress);

router.put('/:userId/tags', methods.putTags);

router.post('/search', methods.searchUsers);

router.get('/', methods.getUsers);

router.post('/', methods.postUsers);

module.exports = {
	Router:     router,
	Methods:    methods
};

