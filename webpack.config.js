var path        = require('path');
var colors      = require('colors');
var webpack     = require('webpack');

var contextPath     = path.resolve(__dirname, "app");
var outputPath      = path.resolve(__dirname, 'release');
var mainPath        = path.resolve(__dirname, 'app', 'js', 'app.js');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');

function defineSettings() {
    var configUtils     = require('./server/config');
    var program         = require('commander');
    var express         = require('express');
    var app             = express();

    var configEnv = configUtils.settings(path.join(__dirname, 'server/env'));
    settings = configUtils.mergeSettingsDefault(configEnv, program);
    settings.environment = app.get('env');
    global.settings = settings;
}
var environment = defineSettings();

var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var StatsPlugin = require('stats-webpack-plugin');
var WebpackErrorNotificationPlugin = require('webpack-error-notification');

module.exports = {
    environment: readEnvironment(),
    context: contextPath,
    debug: getDebugMode(),
    devtool: getDevTools(),
    devServer: getDevServer(),
    entry: getEntry(),
    output: getOutput(),
    watch: getWatchMode(),
    resolve: getResolve(),
    module: getModule(),
    plugins: getPlugins()
};

function readEnvironment() {
    if (global.settings && global.settings.environment)
        environment = global.settings.environment;
    console.log('*** Webpack: Running Environment: ' + colors.green(environment));
    return environment;
}

function getDebugMode() {
    if (environment === 'development')
        return true;
    return false;
}

function getDevTools() {
    var devtool = null;
    if (environment === 'development') {
        console.log('*** Webpack: Assigning Development Tools');
        devtool = "eval";
    } else
        console.log('*** Webpack: No Development Tools Required for ' + colors.green(environment));
    return devtool;
}

function getDevServer() {
    var devServer = null;
    if (environment === 'development') {
        console.log('*** Webpack: Assigning Dev Server Option');
        devServer = {
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:8080",
                "Access-Control-Allow-Credentials": "true"
            }
        };
    } else
        console.log('*** Webpack: No Dev Server Option Required for ' + colors.green(environment));
    return devServer;
}

function getEntry() {
    console.log('*** Webpack: Assigning ' + colors.green(environment) + ' Entry Points');
    var entry = [mainPath];
    if (environment === 'development') {
        entry.push(
            /** For hot style updates */
            'webpack/hot/dev-server',
            /** @type {String} The script refreshing the browser on none hot updates */
            'webpack-dev-server/client?http://localhost:1919'
        );
    }
    return entry;
}

function getOutput() {
    console.log('*** Webpack: Assigning ' + colors.green(environment) + ' Output Options');
    var output = {
        /**
         * We need to give Webpack a path. It does not actually need it,
         * because files are kept in memory in webpack-dev-server, but an
         * error will occur if nothing is specified. We use the outputPath
         * as that points to where the files will eventually be bundled
         * in production
         * @type {String}
         */
        path: outputPath,
        sourceMapFilename: "[file].map"
    };
    if (environment === 'development') {
        output.filename = 'bundle.js';
        /**
         * Everything related to Webpack should go through a build path,
         * localhost:3000/build. That makes proxying easier to handle
         * @type {String}
         */
        output.publicPath = '/build/';
    } else
        output.filename = 'build/bundle-[hash].js';
    return output;
}

function getWatchMode() {
    if (environment === 'development')
        return true;
    return false;
}

function getResolve() {
    console.log('*** Webpack: Assigning ' + colors.green(environment) + ' Resolve Options');
    var fsStyles = 'firestarter.css';
    var fsStylesPath = 'css';
    var fsJSPath = 'js/site';
    var fsTempPath = 'templates/site';
    // If env is development, bring in SASS instead
    if (environment === 'development') {
        fsStyles = 'firestarter.scss';
        fsStylesPath = 'sass';
    }
    if (settings.siteType === 'admin') {
        console.log('*** Webpack: Applying Alias for ' + colors.magenta('Admin Site'));
        fsJSPath = 'js/admin';
        fsTempPath = 'templates/admin';
    } else
        console.log('*** Webpack: Applying Alias for ' + colors.green('Bloggers Site'));
    // Build up the Resolve object settings based on the env and site
    var resolve = {
        root: contextPath,
        alias: {
            // Alias backbone to the version installed as a dependency of marionette
            backbone: 'backbone.marionette/node_modules/backbone/backbone.js',
            // Alias backbone.wreqr to the version installed as a dependency of marionette
            'backbone.wreqr':'backbone.marionette/node_modules/backbone.wreqr/lib/backbone.wreqr.js',
            // Alias marionette to backbone.marionette to reduce the amount of typing in import statements
            marionette: 'backbone.marionette',
            // Alias wreqr to backbone.wreqr to reduce the amount of typing in import statements
            wreqr: 'backbone.wreqr',
            // Alias Cookie to js-cookie to enable ie11 compatibility.
            cookies: 'js-cookie/src/js.cookie.js',
            // Alias Semantic-UI
            semantic: 'semantic/semantic.js',
            // Alias Semantic-UI
            nano: 'nanoscroller/bin/javascripts/jquery.nanoscroller.js',
            // Alias Highcharts
            highchartssrc: 'highcharts/highcharts.src.js',
            // This allows us to bring in either CSS for deployment or SASS for development
            fsstyles: fsStyles
        },
        modulesDirectories: [fsStylesPath, fsJSPath, fsTempPath, 'js/common', 'templates/common', 'node_modules']
    };
    console.log('*** Webpack: Serving Stylesheets ' + colors.green(fsStyles));
    return resolve;
}

function getModule() {
    console.log('*** Webpack: Assigning ' + colors.green(environment) + ' Module Options');
    var module = {
        loaders: getModuleLoaders()
    };
    return module;
}

function getModuleLoaders() {
    var loaders = [
        {test: /\.html$/,loaders: ['raw'], exclude: [nodeModulesPath]},
        {test: /\.json$/, loader: 'json'},
        {test: /\.js$/, loader: 'babel', query: {"presets": ["es2015"]}, exclude: [nodeModulesPath]},
        {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?/[path][name].[ext]?[hash]?limit=8192&mimetype=application/font-woff2'},
        {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?/[path][name].[ext]?[hash]?limit=8192&mimetype=application/font-woff'},
        {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?/[path][name].[ext]?[hash]?limit=8192&mimetype=application/octet-stream'},
        {test: /\.(jpe?g|png|gif|svg)$/i, loader: 'url?/[path][name].[ext]?[hash]'}
    ];
    if (environment === 'development') {
        loaders.push(
            {test: /\.scss$/,loaders: ['style', 'css', 'sass']},
            {test: /\.css$/, loaders: ['style', 'css']},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
            {test: /\.md$/, loaders: ['html', 'markdown']}
        );
    } else {
        loaders.push(
            {test: /\.s?css$/, loader: ExtractTextPlugin.extract('style', ['css', 'sass'])},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'url'}
        );
    }
    return loaders;
}

function getPlugins() {
    console.log('*** Webpack: Adding ' + colors.green(environment) + ' Plugins');
    var plugins = [
        new WebpackErrorNotificationPlugin(function(msg) {
            console.log(colors.red(msg));
        }),
        // We have to manually add the jquery global context due to MAC/Linux intergration env
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ];
    if (environment === 'development') {
        plugins.push(
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin()
        );
    } else {
        plugins.push(
            new webpack.optimize.OccurenceOrderPlugin(),
            new HtmlWebpackPlugin({
                title: 'The Firestarter Network | Firestarter',
                template: 'templates/common/root.html',
                inject: 'head',
                favicon: 'images/generic/favicon.ico',
                filename: 'index.html',
                hash: true
            }),
            new webpack.optimize.UglifyJsPlugin({
                compressor: {
                    warnings: false,
                    screw_ie8: true
                },
                output: {
                    comments: false
                }
            }),
            new StatsPlugin('webpack.stats.json', {
                source: false,
                modules: false
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': environment
            }),
            new ExtractTextPlugin("css/[name]-[hash].css")
        );
    }
    return plugins;
}