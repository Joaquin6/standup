'use strict';
var cliColor = require('cli-color');
var bluebird = require('bluebird');
var httpHelper = bluebird.promisifyAll(require('../../libs/helpers/httpHelper'));

function invokeHttpRequest(payload, cb) {
    httpHelper.HttpRequestAsync(payload).then(function(result) {
        console.log('RESULTS INVOKING WEB REQUEST: ' + result);
        cb(null, result);
    }, function(error) {
        //console.log();
        console.log(cliColor.red('------------------------------------------------'));
        console.log(cliColor.red('ERROR INVOKING WEB REQUEST MESSAGE: ' + error.message));
        console.log(cliColor.red('ERROR INVOKING WEB REQUEST CONTEXT: ' + error.context));
        cb(error, null);
    }).catch(function(e) {
        console.error('exception invoking web request: ' + e);
    });
}

function getResource(req, uri, cb) {
    var payload = {
        path: uri,
        method: "GET",
        headers: req.headers
    };

    invokeHttpRequest(payload, cb);
}

function postResource(req, uri, cb) {
    var payload = {
        path: uri,
        method: "POST",
        headers: req.headers,
        data: req.body
    };

    invokeHttpRequest(payload, cb);
}

function postResourceBinary(req, uri, cb) {
    var payload = {
        path: uri,
        method: "POST",
        headers: req.headers,
        data: req.body,
        file: req.file
    };

    invokeHttpRequest(payload, cb);
}

function headResource(req, uri, cb) {
    var payload = {
        path: uri,
        method: "HEAD",
        headers: req.headers
    };

    invokeHttpRequest(payload, cb);
}

function putResource(req, uri, cb) {
    var payload = {
        path: uri,
        method: "PUT",
        headers: req.headers,
        data: req.body
    };

    invokeHttpRequest(payload, cb);
}

function deleteResource(req, uri, cb) {
    var payload = {
        path: uri,
        method: "DELETE",
        headers: req.headers
    };

    invokeHttpRequest(payload, cb);
}

module.exports = {
    InvokeHttpRequest: invokeHttpRequest,
    GetResource: getResource,
    PostResource: postResource,
    PostResourceBinary: postResourceBinary,
    HeadResource: headResource,
    PutResource: putResource,
    DeleteResource: deleteResource
};