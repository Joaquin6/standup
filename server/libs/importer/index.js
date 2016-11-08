var fs              = require('fs'),
    path            = require('path'),
    Q               = require('q'),
    express         = require('express'),
    colors          = require('colors'),
    Err             = require("custom-err"),
    config          = require('./config.json'),
    dataRootPath    = path.resolve(__dirname, 'source'),
    app             = express();

/** ------------ Setup Steps ----------------- */
console.log('--- Data Importer: Commencing Data Imports');
var db = null, settings = {};

readConfigSettings();
importSourceData();

function readConfigSettings() {
    Error.stackTraceLimit = config.stackTraceLimit;
    console.log("--- Data Importer: Increased Stack Trace Limit to: " + colors.green(config.stackTraceLimit));
    settings = global.settings = config;

    db = require("../db");

    process.on('exit', function(code) {
        console.log("--- Data Importer: Exiting Process with Code: " + code);
    });

    process.on('uncaughtException', function(err) {
        console.error("--- Data Importer: Uncaught Exeption");
    });
}

function importSourceData() {
    __readSourceDataDir().then(function(files) {
        console.log('--- Data Importer: Read all Files in Dir');
        console.log(files);
        __readEachFileContents(files).then(function(response) {
            console.log(colors.yellow('--- Data Importer: Saved all File Contents Successfully'));
            process.exit(0);
        }).fail(function(err) {
            console.log(colors.red('--- Data Importer: ERROR Saving File Contents'));
            console.log(err);
        }).done();
    }).fail(function(err) {
        if (err.stack) {
            console.log(colors.yellow(">>> WARNING: Long Stack Traces <<<"));
            console.log(err.stack);
        }
        console.log(err);
    }).done();
}

function __readSourceDataDir() {
    var deferred = Q.defer();
    fs.readdir(dataRootPath, function(err, files) {
        if (err)
            deferred.reject(err);
        else {
            /** Before resolving, we exclude all hidden files */
            files.forEach(function(file, idx) {
                if (file.charAt(0) === '.')
                    files.splice(idx, 1);
            });
            deferred.resolve(files);
        }
    });
    return deferred.promise;
}

function __readEachFileContents(files) {
    var deferred = Q.defer();
    var promises = [];
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var fileSplit = file.split("-");
        var fileSchema = fileSplit[0];
        var fileTable = fileSplit[1].split(".")[0];
        var filePath = path.join(dataRootPath, file);
        var fileContents = fs.readFileSync(filePath, 'utf8');
        var fileData = JSON.parse(fileContents);

        for (var k = 0; k < fileData.length; k++) {
            var row = fileData[k];
            var promise = __saveFileData(row, fileSchema, fileTable);
            promises.push(promise);
        }

        Q.allSettled(promises).then(function(results) {
            var isError = false,
                errorResult;
            results.forEach(function(result) {
                if (result.state !== 'fulfilled') {
                    isError = true;
                    errorResult = result;
                }
            });
            if (isError) {
                console.log(colors.red("!!! " + errorResult.reason));
                errorResult.message = errorResult.reason;
                deferred.reject(errorResult);
            } else {
                deferred.resolve(results);
            }
        }).done();
    }
    return deferred.promise;
}

function __saveFileData(data, schema, table) {
    var deferred = Q.defer();
    var dbPromise = null;
    if (schema === 'public')
        dbPromise = db[table];
    else
        dbPromise = db[schema][table];

    if (!dbPromise) {
        var err = Err("The combination of " + schema + " Schema and " + table + " Table Does not Exists on the DB.", {
            statusCode: 500
        });
        console.log(err);
        return deferred.reject(err);
    }

    dbPromise.saveDoc(data, function(err, doc) {
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
}