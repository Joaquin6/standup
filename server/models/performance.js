var Q 					= require("q");
var _ 					= require('underscore');
var http        		= require('http');
var clc    				= require("cli-color");
var Utility  			= require('../helpers/utilHelper');

var PerformanceModel = {
	getCampaigns: function(req, res) {
		var deferred = Q.defer();
		var payload = {
			uri: "campaigns"
	    };
	    if (req.params.uid) {
	    	payload.uri += "/" + req.params.uid;
	    }
	    if (req.url.indexOf("/socialpixel/overall") > -1) {
	    	payload.uri += "/socialpixel/overall";
	    } else if (req.url.indexOf("/pagevisits") > -1) {
	    	payload.uri += "/pagevisits";
	    }
	    this.request(payload).then(function(response) {
	    	if (response.data)
	    		response = response.data;
	    	deferred.resolve(response);
	    }).fail(function(err) {
	    	deferred.reject(err);
	    }).done();
		return deferred.promise;
	},
	getPageVisits: function(req, res) {
		var deferred = Q.defer();
		var payload = {
			uri: "pagevisits"
	    };
	    this.request(payload).then(function(response) {
	    	response = response.data;
	    	deferred.resolve(response);
	    }).fail(function(err) {
	    	deferred.reject(err);
	    }).done();
		return deferred.promise;
	},
	getSocialpixel: function(req, res) {
		var deferred = Q.defer();
		var payload = {
			uri: "socialpixel/overall"
	    };
	    if (req.params.limit) {
	    	var limitEndPoint = req.url.split("/")[3];// /socialpixel/overall/top/:limit
	    	payload.uri += "/" + limitEndPoint + "/" + req.params.limit;
	    }
	    this.request(payload).then(function(response) {
	    	deferred.resolve(response);
	    }).fail(function(err) {
	    	deferred.reject(err);
	    }).done();
		return deferred.promise;
	},
	getAllSocialpixel: function(req, res) {
		var deferred = Q.defer();
		var payload = {
			uri: "socialpixel"
	    };
	    // if an rsid was passed to the GET URI,
	    // add it to the URI string
	    if (req.params && req.params.rsid)
	    	payload.uri += "/" + req.params.rsid + "/all";
	    this.request(payload).then(function(response) {
	    	deferred.resolve(response);
	    }).fail(function(err) {
	    	deferred.reject(err);
	    }).done();
		return deferred.promise;
	},
	request: function(payload) {
		var deferred = Q.defer();
		this.__sendGetRequest(payload, global.settings, function(err, response) {
	        if (err) {
	            deferred.reject(err);
	        } else {
	            try {
	                var json = JSON.parse(response);
	                if (json.error) {
	                	console.log(clc.red("!!! Performance API Request Method Has an Error: " + json.error));
	                    deferred.reject(new Error(json.error));
	                } else if (json.status && (json.status == "failed" || json.status.indexOf("error ") > -1)) {
	                	console.log(clc.red("!!! Performance API Request Method Has a Status Error: " + json.status));
	                	var error = {};
	                	if (json.error_code)
	                		error.statusCode = json.error_code;
	                	if (json.error_msg)
	                		error.message = json.error_msg;
	                	else if (json.statusMsg)
	                		error.message = json.statusMsg;
	                	error.status = json.status;
	                	error.method = method;
	                	deferred.reject(error);
	                } else
	                    deferred.resolve(json);
	            } catch (e) { // if the string was not json, we just need to return it
	                deferred.resolve(response);
	            }
	        }
		});
	    return deferred.promise;
	},
	__sendGetRequest: function(payload, settings, callback) {
		var apiConfig   = settings.performanceAPI;

		var options = {
            host: apiConfig.host,
            port: apiConfig.port,
            path: apiConfig.path + payload.uri
        };

        console.log("Host: => " + options.host);
        console.log("Path: => " + options.path);
		http.get(options, function(res) {
			res.setEncoding('utf8');
	        var responseData = "";
	        // concatenate the response data as we get it
	        res.on("data", function(chunk) {
	            responseData += chunk;
	        });
	        // fire the callback event once the request is completed
	        res.on("end", function(e) {
	            callback(null, responseData);
	        });
	    }).on("error", function(eee) {
	    	console.error('Error with the request:', err.message);
	        callback(err.message);
	    });
	}
};

module.exports = PerformanceModel;
