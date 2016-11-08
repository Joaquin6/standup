define(['jquery', 'underscore', 'marionette', 'helpers/utility', 'views/components/AlertView', 'login/LoginTemplate.html'], function($, _, Marionette, Utility, AlertView, Template) {
	return Marionette.View.extend({
		__alert: null,
		id: "LoginView",
		template: false,
        initialize: function() {
            _.bindAll(this, 'login');
        },
        onBeforeRender: function() {
            if ($('body').hasClass('pushable'))
                $('body').removeClass('pushable');
        },
		onRender: function() {
            $('body').append(this.$el.html(Template));
            this.__initLoginForm();
            this.listenTo(this.model, "change:loginResponse", this.onLoginResponse);
        },
        login: function(e, payload) {
            e.preventDefault();
            Utility.addBtnLoader($('#btn-login'));
            this.model.login(payload);
        },
        onLoginResponse: function(model, response) {
            if (response == undefined)
                return;
            if (response.status === 'success')
                this.__handleLoginSuccess(response);
            else {
                Utility.removeBtnLoader($('#btn-login'));
                this.__handleLoginFail(response);
            }
        },
        __initLoginForm: function() {
            var options = {
                on: 'submit',
                fields: {
                    email: {
                        identifier: 'email',
                        rules: [{
                            type: 'email',
                            prompt: 'Please enter a valid email address'
                        }, {
                            type: 'empty',
                            prompt: 'Please enter an email address'
                        }]
                    },
                    password: {
                        identifier: 'password',
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter a password'
                        }, {
                            type: 'length[6]',
                            prompt: 'Your password must be at least {ruleValue} characters'
                        }]
                    }
                },
                onSuccess: this.login,
                debug: true
            };
            if (Utility.isProductionEnv())
                options.debug = false;
            $('.ui.large.form').form(options);
        },
        __showErrorAlert: function(context) {
            this.__closeAlert();
            var alert = new AlertView({
                title : context.title,
                message : context.message,
                type : context.type
            });
            alert.$el.appendTo('#login-alert');
            alert.render();
            this.__alert = alert;
        },
        __closeAlert: function() {
            if (this.__alert) {
                this.__alert.close();
                this.__alert = null;
            }
        },
        __handleLoginSuccess: function(response) {
            if (response.data.token) {
                $('input[type="text"]').css({
                    "border": "2px solid red",
                    "box-shadow": "0 0 3px red"
                });
                $('input[type="password"]').css({
                    "border": "2px solid #00F5FF",
                    "box-shadow": "0 0 5px #00F5FF"
                });
            }
        },
        __handleLoginFail: function(response) {
            var context = {};
            var message = null;
            var data = response.data;
            $('input[type="text"],input[type="password"]').css({
                "border": "2px solid red",
                "box-shadow": "0 0 3px red"
            });
            if (data.message)
                message = data.message;
            else
                message = 'Sorry, There was a Connection Problem';
            if (data.title)
                context.title = data.title;
            else
                context.title = response.status;
            context.message = message;
            context.type = "warning";
            this.__showErrorAlert(context);
        }
	});
});