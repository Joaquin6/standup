/**
 * @fileOverview File description goes here.
 * @author UX Team <sd-ux@itg.com>
 * @module RendermanWidget
 */
define(['jquery', 'underscore', 'marionette', 'helpers/utility'], function($, _, Marionette, Utility) {
	var Widget = Marionette.BaseView.extend({
		name : 'RendermanWidget',
		__queuedTasks : [],
		__frameId : null,
		__viewsRendered : [],
		__callbacks : {},
		overrideInit : function() {
			this.__polyFill();
		},
		queue : function() {
			if (arguments[0] == undefined) {
				console.log('RenderMan Widget: ERROR - queued up undefined function!');
				return;
			}
			this.__queuedTasks.push(arguments);
			this.__requestWork();
		},
		clearRendered : function(view) {
			if (view == null)
				this.__viewsRendered = [];
			else
				this.__viewsRendered = _.without(this.__viewsRendered, view);
		},
		setRendered : function(view) {
			if (_.indexOf(this.__viewsRendered, view) < 0)
				this.__viewsRendered.add(view);
			this.__fireRendered();
		},
		isRendered : function(views) {
			if (_.isArray(views)) {
				for (var i = 0; i < views.length; i++) {
					if (!this.isRendered(views[i]))
						return false;
				}
				return true;
			} else {
				var view = views;
				return _.indexOf(this.__viewsRendered, view) > -1;
			}
		},
		bindRendered : function(views, callback) {
			var key = views.join(',');
			this.__callbacks[key] = callback;
			this.__fireRendered();
		},
		unBindRendered : function(views, callback) {
			var key = views.join(',');
			delete this.__callbacks[key];
		},
		__fireRendered : function() {
			// iterate and find out if any callbacks need to fire based on rendered views
			var keys = _.keys(this.__callbacks);
			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];
				var views = key.split(',');
				var callback = this.__callbacks[key];
				if (this.isRendered(views))
					callback(views);
			}
		},
		__requestWork : function() {
			if (this.__queuedTasks.length == 0)
				return;
			if (this.__frameId != null)
				return;
			var that = this;
			this.__frameId = requestAnimationFrame(function() {
				cancelAnimationFrame(that.__frameId);
				// who knew javascript had a queue and stack built in? http://codetunnel.com/9-javascript-tips-you-may-not-know/
				var task = that.__queuedTasks.shift();
				that.__doTask(task);
				that.__wait();
			});
		},
		__doTask : function(task) {
			var ctx = null;
			if (task.length > 1)
				ctx = task[1];
			var params = [];
			for (var i = 2; i < task.length; i++)
				params.push(task[i]);
			try {
				task[0].apply(ctx, params);
			} catch (e) {
				console.log(e);
			}
		},
		__wait : function() {
			var that = this;
			setTimeout(function() {
				that.__frameId = null;
				that.__requestWork();
			}, 1);
		},
		__polyFill : function() {
			// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
			// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
			// requestAnimationFrame polyfill by Erik Möller
			// fixes from Paul Irish and Tino Zijdel
			( function() {
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
	});
	return Utility.getSingleton('RenderManWidget', Widget);
});
