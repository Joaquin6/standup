define(['jquery'], function($) {
	return {
		__cache : {},
		get : function(key) {
			return this.__cache[key];
		},
		set : function(key, value) {
			this.__cache[key] = value;
		},
		has : function(key) {
			return this.__cache[key] != undefined;
		},
		clear : function(key) {
			if (key == undefined) {
				this.__cache = {};
			} else {
				delete this.__cache[key];
			}
		}
	};
});
