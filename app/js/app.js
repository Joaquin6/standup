/**
 * @module The Application module is the entry point for both the Blogger and Admin Site.
 */
/** Bring in all global styles */
require('fsstyles');
/** Bring in all global scripts */
require(['jquery', 'underscore', 'semantic-ui/semantic', 'helpers/utility', 'main'], function($, _, Semantic, Utility, Main) {
	/**
	 * Here we setup the global configs for all or any lib being used thru the application.
	 * @type {Object} Underscore's templateSettings so we can bind with {{ replaceme }} for underscore templates
	 */
	_.templateSettings = {
		evaluate: /\{\[([\s\S]+?)\]\}/g,
		interpolate: /\{\{([\s\S]+?)\}\}/g
	};
    Utility.initialize({});
    Main.initialize({});
});
