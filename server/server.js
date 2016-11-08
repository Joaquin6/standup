var path            = require('path'),
    http            = require('http'),
    express         = require('express'),
    bodyParser      = require('body-parser'),
    methodOverride  = require('method-override'),
    session         = require('express-session'),
    colors          = require('colors'),
    httpProxy       = require('http-proxy'),
    program         = require('commander'),
    passport        = require('passport'),
    _               = require("underscore"),
    config          = require('./config'),
    clientRootPath  = path.resolve(__dirname, '..', 'app'),
    proxy           = httpProxy.createProxyServer(),
    app             = express();

/** ------------ Setup Steps ----------------- */
var settings = {}, cryptr = null, bundle = null;
readEnvironment();
setupEnvironment();
listen();

function readEnvironment() {
    var configEnv = config.settings(path.join(__dirname, 'config', 'env'), app.get("env"));
    settings = config.mergeSettingsDefault(configEnv, program);
    settings.environment = app.get('env');
    console.log('>>> Node Server: Running Environment: ' + colors.green(settings.environment));
    if (settings.environment === "development") {
        Error.stackTraceLimit = settings.stackTraceLimit;
        console.log(">>> Node Server: Increased Stack Trace Limit to: " + colors.green(settings.stackTraceLimit));
    }
    global.settings = settings;
}

function setupEnvironment() {
    /** Configure Passport */
    require('./libs/auth/passport')(passport);
    cryptr = require('./libs/cryptr')(settings.encryption);
    console.log('>>> Node Server: Setting Up Environment');
    if (settings.environment === 'prod' || settings.environment === 'qa')
        clientRootPath = path.resolve(__dirname, '..', 'release');
    app.set('port', settings.port);
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    app.use(session({
        secret: 'your secret sauce',
        saveUninitialized: true,
        resave: true
    }));
    /** Initialize Passport */
    app.use(passport.initialize());
    app.use(passport.session());

    initializeDatabase();

    /**
     * Load up the settings now, and make them available at all the routes.
     * This way we dont load them multiple times in each route.
     */
    app.use(function(req, res, next) {
        req.appSettings = settings;
        next();
    });

    if (settings.environment === 'development') {
        // We only want to run the workflow when not in production
        console.log('>>> Node Server: Spawing Webpack Development Server');
        // We require the bundler inside the if block because
        // it is only needed in a development environment. Later
        // you will see why this is a good idea
        bundle = require('./bundle.js')(settings);
        // Any requests to localhost:1919/build is proxied
        // to webpack-dev-server
        app.all('/build/*', function(req, res) {
            proxy.web(req, res, {
                target: 'http://localhost:1919'
            });
        });
    }

    app.use(express.static(clientRootPath));

    /** token based auth for /api routes */
    var jwtAuth = require("./libs/auth/jwt-auth");
    app.use(jwtAuth);

    require('./router').route(app);
    console.log('>>> Node Server: Environment ' + colors.green(settings.environment) + ' Was Set Successfully!');
    app.use(function(req, res) {
        var newUrl = req.protocol + '://' + req.get('Host') + '/#' + req.url;
        return res.redirect(newUrl);
    });

    process.on('uncaughtException', function(err) {
        console.error(">>> Node Server: Uncaught Exeption");
        console.error(err);
    });

    process.on("exit", function(code) {
        console.log(">>> Node Server: Closing with Code " + code);
        if (bundle) {
            bundle.closeInstance();
        }
    });

    /* ===== REMOVE: if SIGINT event listener is added, process must be manually closed; ===== */
    // process.on('SIGINT', function() {
    //     console.log('Got SIGINT.  Press Control-D to exit.');
    //     if (bundle) {
    //         bundle.closeInstance();
    //     }
    // });

    /**
     * It is important to catch any errors from the proxy or the
     * server will crash. An example of this is connecting to the
     * server when webpack is bundling
     */
    proxy.on('error', function(e) {
        console.log(">>> Node Server: " + colors.red('Could not connect to proxy, please try again...'));
    });

    confimDefaultUsers();
}

function initializeDatabase() {
    require("./libs/db");
}

function confimDefaultUsers() {
    var admin = settings.defaultAdmin;
    var Accounts = require("./models/public/accounts");
    Accounts.get({email: admin.email}).then(function(account) {
        if (account && account.length) {
            account = account[0];
            cryptr.setPassword(admin.password, function(err, hash) {
                account.password = hash;
                Accounts.update(prepJsonbAccount(account)).then(function(doc) {
                    console.log(colors.green(">>> Successfully Updated defaultAdmin"));
                }).fail(function(err) {
                    console.log(colors.red("!!! ERROR Updating defaultAdmin"));
                    console.log(err);
                }).done();
            });
        } else {
            cryptr.setPassword(admin.password, function(err, hash) {
                admin.password = hash;
                Accounts.saveDoc(admin).then(function(doc) {
                    console.log(colors.green(">>> Successfully Saved defaultAdmin"));
                }).fail(function(err) {
                    console.log(colors.red("!!! ERROR Saving defaultAdmin"));
                    console.log(err);
                }).done();
            });
        }
    }).fail(function(err) {
        console.log(colors.red("!!! Error Checking for Default Admin"));
        console.log(err);
    }).done();
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

function prepJsonbAccount(account) {
    var newAccount = {
        id: null,
        body: {}
    };

    newAccount.id = account.id;
    delete account.id;
    newAccount.body = _.extend(newAccount.body, account);

    return newAccount;
}