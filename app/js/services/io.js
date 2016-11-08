define(['jquery', 'underscore', 'backbone', 'main', 'router', 'helpers/events', 'helpers/utility'], function($, _, Backbone, Main, Router, Events, Utility) {
	return {
		__STATUS : {
			DISCONNECTED : 0,
			CONNECTED : 1
		},
		__socket : null,
		__isReady : 0,
		__queued : [],
		__headers: null,
		__notifications : {},
		__username : null,
		__devQAHost: false,
		__baseAddress : "http://localhost:8080",
		__onInitialized : null,
		initialize: function(options) {
			var sessionCookie;
			if (options.sessionCookie)
				sessionCookie = options.sessionCookie;
			if (sessionCookie && sessionCookie.token && !this.__headers)
				this.storeHeaders({"Authorization":"token.v1 " + sessionCookie.token});
		},
		POST : function(resource, payload, successCB, errorCB) {
			this.__post('post', resource, payload, successCB, errorCB);
		},
		PUT : function(resource, payload, successCB, errorCB) {
			this.__post('put', resource, payload, successCB, errorCB);
		},
		GET : function(resource, successCB, errorCB, options) {
			var baseAddress = Utility.getProtocol() + '//' + Utility.getHost();
			var url = baseAddress + resource;
			console.log('IO API CALL: GET URL => ' + url);
			var ajaxOpts = {
				url : url,
				type : 'get',
				contentType : "application/json",
				success : successCB,
				error : errorCB
			};
			if (this.__headers) {
				if (options) {
					var excludeHeaders = options.excludeHeaders || false;
					if (!excludeHeaders)
						ajaxOpts.headers = this.__headers;
				} else
					ajaxOpts.headers = this.__headers;
			}
			console.count("IO API CALL");
			$.ajax(ajaxOpts);
		},
		DELETE : function(resource, payload, callback) {
			this.__post('delete', resource, payload, callback);
		},
		Start : function(username) {
			this.__username = username;
			// this.__LongPoll();
		},
		storeHeaders: function(headers) {
			this.__headers = headers;
			$.ajaxSetup(headers);
			if (!Utility.isProductionEnv())
				console.log('IO: AJAX Headers Set => ' + JSON.stringify(headers));
		},
		__post : function(type, resource, payload, successCB, errorCB) {
			var baseAddress = Utility.getProtocol() + '//' + Utility.getHost();
			var packet = JSON.stringify(payload);
			var url = baseAddress + resource;
			if (!Utility.isProductionEnv())
				console.log('IO API CALL: POST URL => ' + url);
			var ajaxOpts = {
				url : url,
				type : type,
				contentType : "application/json",
				success : successCB,
				error : errorCB,
				data : packet
			};
			if (this.__headers)
				ajaxOpts.headers = this.__headers;
			console.count("IO API CALL");
			$.ajax(ajaxOpts);
		},
		__LongPoll : function(timestamp) {
			var url = this.__baseAddress + '/bloggers/' + this.__username + '/notifications';
			if (timestamp != undefined)
				url += '/' + timestamp;
			var that = this;
			$.get(url, function(packet) {
				var timestamp = undefined;
				if (packet != null) {
					// format: status, payload [notification, timestamp]
					if (packet.status == "ok") {
						var payload = that.__decodePayload(packet.payload);
						if (payload.length > 0) {
							payload.timestamp = packet.timestamp;
							Events.trigger(Events.notification, payload);
						}
						// that.__removeNotifications(packet.timestamp);
					}
					timestamp = packet.timestamp;
				}
				that.__LongPoll(timestamp);
			});
		},
		__decodePayload : function(packet) {
			var payload = [];
			for (var i = 0; i < packet.length; i++) {
				var notification = JSON.parse(packet[i]);
				if (notification == null)
					continue;
				if (this.__decodeNotification(notification)) {
					this.__pushNotification(notification);
					payload.push(notification);
				}
			}
			return payload;
		},
		__decodeNotification : function(notification) {
			if (notification.channel == undefined)
				return false;
			var parts = notification.channel.split(':');
			if (parts.length < 3)
				return false;
			notification.channel = parts[0];
			notification.action = parts[1];
			notification.id = parts[2];
			return true;
		},
		__pushNotification : function(notification) {
			if (this.__notifications[notification.channel] == undefined)
				this.__notifications[notification.channel] = [];
			this.__notifications[notification.channel].push(notification);
		},
		__removeNotifications : function(timestamp) {
			// var dareObject = {};
			// dareObject.timestamp = timestamp;
			// var resource = sprintf("/bloggers/%s/notifications", this.__username);
			// io.DELETE(resource, dareObject);
		}
	};
});
