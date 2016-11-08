var Q = require("q"),
    _ = require("underscore"),
    db = require("../../libs/db");

module.exports = {
    get: function(params, options) {
        var deferred = Q.defer();
        params = params || {};
        options = options || {};
        db.products.inventory.findDoc(params, options, function(err, doc) {
            if (err)
                deferred.reject(err);
            else
                deferred.resolve(doc);
        });
        return deferred.promise;
    },
    saveDoc: function(data) {
        var deferred = Q.defer();
        db.products.inventory.saveDoc(data, function(err, doc) {
            if (err)
                deferred.reject(err);
            else {
                deferred.resolve({
                    status: 'success',
                    doc: doc,
                    message: 'Document Saved'
                });
            }
        });
        return deferred.promise;
    },
    searchDoc: function(params, options, returnOptions) {
        var deferred = Q.defer();
        var toReturn = false;
        if (returnOptions !== undefined)
            toReturn = returnOptions;
        options = options || {};

        db.products.inventory.searchDoc(params, function(err, docs) {
            if (err)
                deferred.reject(err);
            else {
                if (toReturn) {
                    var resObj = _.extend({}, options);
                    resObj.docs = docs;
                    deferred.resolve(resObj);
                } else {
                    deferred.resolve(docs);
                }
            }
        });
        return deferred.promise;
    },
    update: function(data) {
        var deferred = Q.defer();
        db.products.inventory.save(data, function(err, doc) {
            if (err)
                deferred.reject(err);
            else {
                deferred.resolve({
                    status: 'success',
                    doc: doc,
                    message: 'Document Updated'
                });
            }
        });
        return deferred.promise;
    }
};