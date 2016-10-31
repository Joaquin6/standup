var path = require('path'),
    http = require('http'),
    crypto = require('crypto'),
    express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    colors = require('colors'),
    httpProxy = require('http-proxy'),
    program = require('commander'),
    multer = require('multer'),
    passport = require('passport'),
    jwt = require('jwt-simple'),
    configUtils = require('./config'),
    api = require('./router'),
    proxy = httpProxy.createProxyServer(),
    app = express();

/** ------------ Setup Steps ----------------- */
var settings = {};
var clientRootPath = path.resolve(__dirname, '..', 'app');
/** Keep the file extension in order to pass the validation of the API */
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './static/forms');
    },
    filename: function(req, file, cb) {
        crypto.pseudoRandomBytes(16, function(err, raw) {
            if (err) {
                cb(err);
            }
            cb(null, raw.toString('hex') + Date.now() + '.' + path.extname(file.originalname));
        });
    }
});
global.uploadFile = multer({
    storage: storage
});
readEnvironment();
setupEnvironment();
listen();

function readEnvironment() {
    var configEnv = configUtils.settings(path.join(__dirname, 'env'), app.get('env'));
    settings = configUtils.mergeSettingsDefault(configEnv, program);
    settings.environment = app.get('env');
    console.log('>>> Node Server: Running Environment: ' + colors.green(settings.environment));
    if (settings.environment === "development") {
        Error.stackTraceLimit = settings.stackTraceLimit;
        console.log(">>> Node Server: Increased Stack Trace Limit to: " + colors.green(settings.stackTraceLimit));
    }
    global.settings = settings;
}

function setupEnvironment() {
    console.log('>>> Node Server: Setting Up Environment');
    if (settings.environment === 'prod' || settings.environment === 'qa')
        clientRootPath = path.resolve(__dirname, '..', 'release');
    app.set("port", settings.port);
    app.set('siteType', process.env.SITE_TYPE || settings.siteType);
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    /** Initialize Passport */
    app.use(passport.initialize());
    app.use(passport.session());

    initModules();

    if (settings.environment === 'development') {
        // We only want to run the workflow when not in production
        console.log('>>> Node Server: Spawing Webpack Development Server');
        // We require the bundler inside the if block because
        // it is only needed in a development environment. Later
        // you will see why this is a good idea
        var bundle = require('./bundle.js');
        bundle(settings);
        // Any requests to localhost:1919/build is proxied
        // to webpack-dev-server
        app.all('/build/*', function(req, res) {
            proxy.web(req, res, {
                target: 'http://localhost:1919'
            });
        });
    }
    app.use(express.static(clientRootPath));

    if (settings.siteType === 'admin')
        console.log('>>> Node Server: ' + colors.magenta('Running Admin Site'));
    else
        console.log('>>> Node Server: ' + colors.green('Running Bloggers Site'));
    console.log('>>> Node Server: Environment ' + colors.green(settings.environment) + ' Was Set Successfully!');

    /**
     * Load up the settings now, and make them available at all the routes.
     * This way we dont load them multiple times in each route.
     */
    app.use(function(req, res, next) {
        req.appSettings = settings;
        next();
    });

    /** token based auth for /api routes */
    var jwtAuth = require("./libs/auth/jwt-auth");
    app.use(jwtAuth);

    api.route(app);
    app.use(function(req, res) {
        var newUrl = req.protocol + '://' + req.get('Host') + '/#' + req.url;
        return res.redirect(newUrl);
    });
    process.on('uncaughtException', function(err) {
        console.error(">>> Node Server: Uncaught Exeption");
    });
    /**
     * It is important to catch any errors from the proxy or the
     * server will crash. An example of this is connecting to the
     * server when webpack is bundling
     */
    proxy.on('error', function(e) {
        console.log(">>> Node Server: " + colors.red('Could not connect to proxy, please try again...'));
    });
}

function initModules() {
    initializeDatabase();
}

function initializeDatabase() {
    require("./libs/db");
}

function listen() {
    var appPort = app.get('port');
    app.listen(appPort, function() {
        console.log(">>> Node Started On Port: " + colors.green(appPort));
        console.log(">>> Node Process ID (pid): " + colors.green(process.pid));
        /** Print the current directory. */
        console.log(">>> Current Directory: " + process.cwd());
        /** Print the process version. */
        console.log(">>> Current Version: " + process.version);
    });
}