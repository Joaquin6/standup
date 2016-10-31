/**
 * @module The Application module is the entry point for both the Blogger and Admin Site.
 */
/** Bring in all global styles */
require('fsstyles');
/** Bring in all global scripts */
require(['jquery', 'underscore', 'marionette', 'semantic', 'nano', 'helpers/baseview', 'helpers/basemodel', 'models/SettingsModel', 'helpers/log', 'helpers/custom', 'helpers/utility', 'main'], function($, _, Marionette, Semantic, NanoScroler, BaseView, BaseModel, Settings, Log, Custom, Utility, Main) {
	/**
	 * Here we setup the global configs for all or any lib being used thru the application.
	 * @type {Object} Underscore's templateSettings so we can bind with {{ replaceme }} for underscore templates
	 */
	_.templateSettings = {
		evaluate: /\{\[([\s\S]+?)\]\}/g,
		interpolate: /\{\{([\s\S]+?)\}\}/g
	};
    Settings.on("sync", function(model, settings) {
    	Log.initialize(settings.allowConsoleLogs);
        Custom.initialize();
        Utility.initialize(settings);
        Main.initialize(settings);
    });
    Settings.request();
});
