var Promise = require('bluebird');
var httpHelper = require('../../helpers/httpHelper');
var commonController = Promise.promisifyAll(require('../../controllers/common'));

function getResource(req, res, methodName, uri) {
	commonController.GetResourceAsync(req, uri).then(function(apiResponse) {
		return httpHelper.HandleApiWebCallSuccess(res, apiResponse, methodName);
	}, function(err) {
		return httpHelper.HandleApiWebCallFail(res, err, methodName);
	}).catch(function(fatal) {
		return httpHelper.HandleApiWebCallFail(res, fatal, methodName);
	});
}

function postResource(req, res, methodName, uri) {
	commonController.PostResourceAsync(req, uri).then(function(apiResponse) {
		return httpHelper.HandleApiWebCallSuccess(res, apiResponse, methodName);
	}, function(err) {
		return httpHelper.HandleApiWebCallFail(res, err, methodName);
	}).catch(function(fatal) {
		return httpHelper.HandleApiWebCallFail(res, fatal, methodName);
	});
}

function postResourceBinary(req, res, methodName, uri) {
	commonController.PostResourceBinaryAsync(req, uri).then(function(apiResponse) {
		return httpHelper.HandleApiWebCallSuccess(res, apiResponse, methodName);
	}, function(err) {
		return httpHelper.HandleApiWebCallFail(res, err, methodName);
	}).catch(function(fatal) {
		return httpHelper.HandleApiWebCallFail(res, fatal, methodName);
	});
}

function headResource(req, res, methodName, uri) {
	commonController.HeadResourceAsync(req, uri).then(function(apiResponse) {
		return httpHelper.HandleApiWebCallSuccess(res, apiResponse, methodName);
	}, function(err) {
		return httpHelper.HandleApiWebCallFail(res, err, methodName);
	}).catch(function(fatal) {
		return httpHelper.HandleApiWebCallFail(res, fatal, methodName);
	});
}


function putResource(req, res, methodName, uri) {
	commonController.PutResourceAsync(req, uri).then(function(apiResponse) {
		return httpHelper.HandleApiWebCallSuccess(res, apiResponse, methodName);
	}, function(err) {
		return httpHelper.HandleApiWebCallFail(res, err, methodName);
	}).catch(function(fatal) {
		return httpHelper.HandleApiWebCallFail(res, fatal, methodName);
	});
}

function deleteResource(req, res, methodName, uri) {
	commonController.DeleteResourceAsync(req, uri).then(function(apiResponse) {
		return httpHelper.HandleApiWebCallSuccess(res, apiResponse, methodName);
	}, function(err) {
		return httpHelper.HandleApiWebCallFail(res, err, methodName);
	}).catch(function(fatal) {
		return httpHelper.HandleApiWebCallFail(res, fatal, methodName);
	});
}


module.exports = {
	GetResource: getResource,
	PostResource: postResource,
	PostResourceBinary: postResourceBinary,
	HeadResource: headResource,
	PutResource: putResource,
	DeleteResource: deleteResource,
};