define(['jquery', 'underscore', 'backbone', 'services/cache', 'cookies'], function($, _, Backbone, Cache, Cookies) {
	return {
		__env: null,
		__allowLogs: false,
		__authConfig: null,
		name : 'Utility',
		uniqueId : 1,
		addBtnLoader: function(el) {
			if (!el)
				console.error('Utility Method Requires an Element');
			$(el).addClass('loading');
		},
		allowConsoleLogs: function() {
			if (!this.__allowLogs)
				return false;
			return true;
		},
		getRandomInt : function(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},
		enableLogs: function() {
			this.__allowLogs = true;
			console.log("%cWarning Message: Console Logs Are Enabled", "font: 1.25em sans-serif; color: yellow; background-color: red;");
		},
		initialize : function(settings) {
			this.__patchPolyFill();
			if (settings.auth)
				this.__authConfig = settings.auth;
		},
		setPersistence : function(key, value, options, cookiename) {
			key = key.toLowerCase();
			try {
				// When reading a cookie with the default Cookies.get api,
				// you receive the string representation stored in the cookie.
				// ===========================================================
				// When reading a cookie with the Cookies.getJSON api, you receive
				// the parsed representation of the string stored in the cookie according to JSON.parse
				var cookie = Cookies.getJSON("fsCookie");
				if (cookie == undefined)
					cookie = new Object();
				if (cookiename == undefined)
					cookiename = "default";
				if (cookie[cookiename] == undefined)
					cookie[cookiename] = {};
				cookie[cookiename][key] = value;
				if (options == undefined)
					options = {};
				// When creating a cookie you can pass an Array or Object Literal instead of a string in the value.
				// If you do so, js-cookie will store the string representation of the object according to JSON.stringify.
				Cookies.set('fsCookie', cookie, options);
				return true;
			} catch (e) {
				console.log('unable to set cookie value: ' + cookiename + ":" + key + ":" + value);
				console.log(e);
			}
			return false;
		},
		getPersistence : function(key, cookiename) {
			key = key.toLowerCase();
			var cookie = Cookies.getJSON("fsCookie");
			if (cookie == undefined)
				return undefined;
			if (cookiename == undefined)
				cookiename = "default";
			if (cookie[cookiename] == undefined)
				return undefined;
			return cookie[cookiename][key];
		},
		removeBtnLoader: function(el) {
			if (!el)
				console.error('Utility Method Requires an Element');
			$(el).removeClass('loading');
		},
		removePersistence : function(key, options, cookiename) {
			key = key.toLowerCase();
			var cookie = Cookies.getJSON("fsCookie");
			if (cookie == undefined)
				return false;
			if (cookiename == undefined)
				cookiename = "default";
			if (cookie[cookiename] == undefined)
				return false;
			delete cookie[cookiename][key];
			if (options == undefined)
				options = {};
			Cookies.set('fsCookie', cookie, options);
			return true;
		},
		existsPersistence : function(key, cookiename) {
			return this.getPersistence(key, cookiename) != undefined;
		},
		isNullOrEmpty : function(value) {
			if ((value == undefined) || (value == null) || (value == "null") || (value.length == 0))
				return true;
			return false;
		},
		getUniqueId : function() {
			return this.uniqueId++;
		},
		toTitleCase : function(str) {
			return str.replace(/\w\S*/g, function(txt) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			});
		},
		round : function(value, decimals) {
			if (decimals == undefined || isNaN(decimals))
				decimals = 0;
			if (value == undefined || isNaN(value))
				return 0;
			return Number(value.toFixed(decimals));
		},
		nFormatter : function(val, precision) {
			if (precision == undefined)
				precision = 0;
			if (val >= 1000000000) {
				return (val / 1000000000).toFixed(precision).replace(/\.0$/, '') + 'G';
			}
			if (val >= 1000000) {
				return (val / 1000000).toFixed(precision).replace(/\.0$/, '') + 'M';
			}
			if (val >= 1000) {
				return (val / 1000).toFixed(precision).replace(/\.0$/, '') + 'K';
			}
			return val;
		},
		domHasDeviceClass : function() {
			if ($('html').hasClass('mobile') || $('html').hasClass('desktop'))
				return true;
			return false;
		},
		formatNumber : function(val) {
			if ( typeof val !== "number" || isNaN(val)) {
				return "";
			}
			return val.toString().replace(/\,/g, '');
		},
		isNumeric : function(val) {
			return !isNaN(parseFloat(val)) && isFinite(val);
		},
		formatNumberThousands : function(val) {
			return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		},
		formatCurrency : function(val) {
			if (val >= 0)
				return '$' + this.formatComma(val);
			val = -val;
			return '-$' + this.formatComma(val);
		},
		formatComma : function(val) {
			if ( typeof val == "number")
				val = val.toString();
			return val.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		},
		toNumber : function(val) {
			if ( typeof val == "number")
				return val;
			var num = val.replace(/\d+$/, "");
			if (num.length == 0)
				return 0;
			return parseInt(num);
		},
		toPhoneNumber: function(text) {
			return text.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
		},
		sortArray : function(array, item, asc) {
			if (asc) {
				array.sort(function(a, b) {
					return a[item] - b[item];
				});
			} else {
				array.sort(function(a, b) {
					return b[item] - a[item];
				});
			}
		},
		validateEmail : function(email) {
			if (email.length == 0)
				return false;
			var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
			return re.test(email);
		},
		validatePhone: function(phoneNumStr) {
			if (phoneNumStr.length == 0)
				return false;
			var re = /^(\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$/i;
			return re.test(phoneNumStr);
		},
		formatURL : function(url) {
			return url.replace(/%20/g, '-').replace(/\s+/g, '-');
		},
		toCamelCase: function(string) {
			return string.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
				return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
			}).replace(/\s+/g, '');
		},
		capitalizeFirstLetter : function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		},
		getColorArray : function() {
			return {
				'green' : ['#7AB800', '#95C633', '#AFD466', '#CAE399', '#E4F1CC'],
				'blue' : ['#009FDA', '#33B2E1', '#66C5E9', '#99D9F0', '#CCECF8'],
				'yellow' : ['#ECC200', '#F0CE33', '#F4DA66', '#F7E799', '#FBF3CC'],
				'magenta' : ['#CF0072', '#D9338E', '#E266AA', '#EC99C7', '#F5CCE3'],
				'orange' : ['#E98399', '#ED9C33', '#F2B566', '#F6CD99', '#FBE6CC'],
				'grey' : ['#616365', '#818284', '#A0A1A3', '#C0C1C1', '#DFE0E0'],
				'red' : ['#D51B03', '#da3722', '#df5442', '#ea8d81', '#eea49a'],
				'positive' : ['#93d119', '#a0d635', '#aedc52', '#c9e88c', '#d4eda3'],
				'negative' : ['#ee341c', '#f04d38', '#f26654', '#f6998d', '#f8aea4']
			};
		},
		getNameInitial: function(string) {
			string = this.capitalizeFirstLetter(string);
			return string.charAt(0);
		},
		isExcluded : function(context) {
			// We are considering a property Bad if
			// Attribute 'IsHiddenDeal' is true, or if
			// Attribute 'IsExcludeFromAlgo' is true,
			// And if Lat and Lng are either -999 or "".
			//
			// This needs is needed because the sidebar will include them regardless if they have a bad
			// Lat/Lng. This causes problems because upon removing these layers from the map, the map only
			// sends out 15 properties excluded from Legend check boxes, and the sidebar bar has 17 total.
			// This is why we still saw properties on the sidebar when all check boxes were deselected from
			// legend.
			var Latitude,
			    Longitude,
			    IsHiddenDeal,
			    IsExcludeFromAlgo;
			if ( context instanceof Backbone.Model) {
				Latitude = context.get('Latitude');
				Longitude = context.get('Longitude');
				IsHiddenDeal = context.get('IsHiddenDeal');
				IsExcludeFromAlgo = context.get('IsExcludeFromAlgo');
			} else {
				Latitude = context.Latitude;
				Longitude = context.Longitude;
				IsHiddenDeal = context.IsHiddenDeal;
				IsExcludeFromAlgo = context.IsExcludeFromAlgo;
			}
			if (Latitude === undefined && context.attributes.Latitude)
				Latitude = context.attributes.Latitude;
			if (Longitude === undefined && context.attributes.Longitude)
				Longitude = context.attributes.Longitude;
			if (IsHiddenDeal === undefined && context.attributes.IsHiddenDeal)
				IsHiddenDeal = context.attributes.IsHiddenDeal;
			if (IsExcludeFromAlgo === undefined && context.attributes.IsExcludeFromAlgo)
				IsExcludeFromAlgo = context.attributes.IsExcludeFromAlgo;

			if (IsHiddenDeal || IsExcludeFromAlgo)
				return true;
			else if (parseFloat(Latitude) === -999 || parseFloat(Longitude) === -999)
				return true;
			else if (Latitude === "" || Longitude === "")
				return true;
			// True - exclude the property
			return false;
			// False - do not exclude the property
		},
		setEnvironment: function(env) {
			this.__env = env;
		},
		isAuthorized: function(token) {
			var autorizationToken = this.getAuthConfig().authorizationToken;
			if (token == undefined || token.length == 0 || autorizationToken == undefined)
				return true;
			if (token == autorizationToken)
				return true;
			return false;
		},
		isProductionEnv: function() {
			var env = this.__env;
			if (!env || env !== 'production')
				return false;
			return true;
		},
		isQAEnv: function() {
			if (this.__env !== 'qa')
				return false;
			return true;
		},
		isSidebarVisible: function() {
			if ($('#SideNavbarView').sidebar('is hidden'))
				return false;
			return true;
		},
		getPercentValue : function(num, perc) {
			return (perc / 100) * num;
		},
		populateEmail : function(element) {
			var user = this.getPersistence('fsLogin');
			if (user)
				$(element).val(user.email);
		},
		isSupportViewportUnits : function(){
	        // modernizr implementation
	        var $elem = $('<div style="height: 50vh; position: absolute; top: -1000px; left: -1000px;">').appendTo('body');
	        var elem = $elem[0];
	        var height = parseInt(window.innerHeight / 2, 10);
	        var compStyle = parseInt((window.getComputedStyle ? getComputedStyle(elem, null) : elem.currentStyle)['height'], 10);
	        $elem.remove();
	        return compStyle == height;
	    },
	    calculate16by9 : function() {
	    	// .fs-section--16by9 (16 by 9 blocks autoheight)
	    	$(this).css('height', $(this).parent().width() * 9 / 16);
	    },
	    callLoginAPI : function(payload) {
	    	var deferred = $.Deferred();
			$.ajax({
				type : 'POST',
				url : '/blogger/login',
				data : payload
			}).done(function(data, status, jqXHR) {
				deferred.resolve(data);
			}).fail(function(error) {
				deferred.reject(error);
			});
			return deferred.promise();
	    },
	    currentPage: function() {
	    	var loc = location.pathname;
	    	if (loc.indexOf("/dashboard") > -1)
                return "dashboard";
            else if (loc.indexOf("/availablecampaigns") > -1)
                return "availablecampaigns";
            else if (loc.indexOf("/myprofile") > -1)
                return "myprofile";
            else if (loc.indexOf("/mycampaigns") > -1)
                return "mycampaigns";
            else if (loc.indexOf("/contact") > -1)
                return "contact";
            else if (loc.indexOf("/topics") > -1)
                return "topics";
            else if (loc.indexOf("/mynetworks") > -1)
                return "mynetworks";
            else if (loc.indexOf("/paymentinfo") > -1)
                return "paymentinfo";
	    },
	    getAuthConfig : function() {
			return this.__authConfig;
		},
	    /**
		 * Used to get the DOM Elements in question
		 * @param  {Utility} Element The DOM containing the view requested
		 * @return {Utility} Will return the DOM element in question.
		 */
		getContext : function(element) {
			return $(element).data('data-wsview');
		},
	    getSingleton : function(key, classdef) {
			var instance = Cache.get(key);
			if (instance)
				return instance;
			if (classdef == undefined)
				return null;
			instance = new classdef();
			Cache.set(key, instance);
			return instance;
		},
	    getLocation : function() {
			return window.location.pathname;
		},
		getHost: function() {
			return window.location.host;
		},
		getHostname: function() {
			return window.location.hostname;
		},
		getPort: function() {
			return window.location.port;
		},
		getProtocol: function() {
			return window.location.protocol;
		},
		getOrigin: function() {
			return window.location.origin;
		},
		getAvatar: function(gender) {
			return "http://cdn3.danielacandela.com/wp-content/plugins/userpro/img/default_avatar_" + gender + ".jpg";
		},
		getAreaCode: function(string) {
			return string.replace(/\D/g,'').substr(0, 3);
		},
		createPhoneObj: function(phoneNumStr) {
			var re = /^1?(\d{3})(\d{3})(\d{4})(\d*)$/i;
			phoneNumStr = phoneNumStr.replace(/\D/g,'');
			var matchResult = re.exec(phoneNumStr);
			var phoneObj = {};
			phoneObj.formatted = this.toPhoneNumber(phoneNumStr);
			phoneObj.origString = matchResult[0];
			phoneObj.areaCode = matchResult[1];
			phoneObj.exchange = matchResult[2];
			phoneObj.suffix = matchResult[3];
			phoneObj.extension = matchResult[4];
			return phoneObj;
		},
		stringHelpers: function() {
			return {
	            // Pad string using padMask.  string '1' with padMask '000' will produce '001'.
	            padLeft: function(string, padMask) {
	                string = '' + string;
	                return (padMask.substr(0, (padMask.length - string.length)) + string);
	            }
	        };
		},
		/** All Methods that begin with "__" are private methods */
		__patchPolyFill : function() {
			// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
			// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
			// requestAnimationFrame polyfill by Erik Möller
			// fixes from Paul Irish and Tino Zijdel
            (function() {
                var lastTime = 0;
                var vendors = ['ms', 'moz', 'webkit', 'o'];
                for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
                }

                if (!window.requestAnimationFrame)
                    window.requestAnimationFrame = function(callback, element) {
                        var currTime = new Date().getTime();
                        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                        var id = window.setTimeout(function() {
                            callback(currTime + timeToCall);
                        }, timeToCall);
                        lastTime = currTime + timeToCall;
                        return id;
                    };

                if (!window.cancelAnimationFrame)
                    window.cancelAnimationFrame = function(id) {
                        clearTimeout(id);
                    };
            }());
		}
	};
});
