define(['jquery', 'underscore', 'marionette', 'helpers/events'], function($, _, Marionette, Events) {
	return Marionette.View.extend({
        id: "AlertView",
        className: "ui warning message",
		template: _.template([
            "<i id='CloseAlert' class='close icon'></i>",
            "<div class='header'>{{ title }}</div>",
            "{{ message }}"
        ].join("\n")),
        defaults: {
            title : "Alert Title!",
            type : "warning",
			message: 'alert message goes here!',
            postRender: function() {
            	return this;
            }
        },
		initialize : function(options) {
			options || (options = {});
            _.extend(this, _.pick(options, _.keys(this.defaults)));
            _.bindAll(this, "close");
			this.__applyCallbacks(options);
			this.listenTo(Events, Events.dispose, this.onDispose);
			this.on("close", function(view) {
                view.$el.closest('.message').transition('fade');
			});
		},
		render: function() {
            var that = this;
            var bind = this.__getBind();
            this.$el.html(this.template(bind));

            this.$alertCloseBtn = this.$el.find('.close .icon');

            $('#CloseAlert').on('click', that.close);

            if (bind.alertStyle)
            	this.$el.attr('style', bind.alertStyle);

            this.postRender();

            return this;
        },
        postRender : function() {
        	return this;
        },
        close: function(e) {
            if (e) e.preventDefault();
            var that = this;
            if (!this.trigger) return;
            this.trigger("close", this);
        },
		onDispose : function() {
			this.destroy();
		},
		destroy : function() {
			this.remove();
			this.stopListening();
		},
		__getBind : function() {
            var bind = {};
            if (this.title)
            	bind.title = this.title;
            else
            	bind.title = this.defaults.title;
            if (this.message)
            	bind.message = this.message;
            else
            	bind.message = this.defaults.message;
            if (this.type)
            	bind.type = this.type;
            else
            	bind.type = this.defaults.type;
            if (this.alertStyle)
            	bind.alertStyle = this.alertStyle;
            return bind;
        },
		__applyCallbacks : function(options) {
			// Callbacks
			if (typeof options.onClose == 'function')
				this.onClose = options.onClose;
			if (typeof options.onClosed == 'function')
				this.onClosed = options.onClosed;
		}
	});
});
