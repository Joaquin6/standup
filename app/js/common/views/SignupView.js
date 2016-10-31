define(['jquery', 'underscore', 'marionette', 'helpers/utility', 'views/components/AlertView', 'signup/SignupTemplate.html'], function($, _, Marionette, Utility, AlertView, Template) {
    return Marionette.ItemView.extend({
        __debug: true,
        id: "SignupView",
        className: "ui middle aligned center aligned grid",
        template: false,
        initialize: function() {
            _.bindAll(this, '__handleFirstStepSuccess');
            this.listenTo(this.model, "change:signupResponse", this.onSignupResponse);
            this.listenTo(this.model, "change:topicsResponse", this.onTopicsResponse);
            this.listenTo(this.model, "change:networksResponse", this.onNetworksResponse);
        },
        onBeforeRender: function() {
            if ($('body').hasClass('pushable'))
                $('body').removeClass('pushable');
        },
        onRender: function() {
            $('body').append(this.$el.html(Template));
            if (Utility.isProductionEnv())
                this.__debug = false;
            this.__initStepOneForm();
        },
        onSignupResponse: function(model, response) {
            if (response == undefined)
                return;
            Utility.removeBtnLoader($('#btn-signup'));
            var that = this;
            if (response.status === 'success') {
                $('#SignupStep1').hide();
                $('#SignupStep2').show({
                    complete: that.__enableTopics
                });
                $('#StepHeader').html('Choose Your Topics - Step 2');
                $('#ProgressStep1').removeClass('active');
                $('#ProgressStep1').addClass('completed');
                $('#ProgressStep2').addClass('active');
                this.__initStepTwoForm();
            } else {
                console.log(response);
                console.log('HANDLE SIGNUP ERROR HERE');
            }
        },
        onTopicsResponse: function(model, response) {
            if (response == undefined)
                return;
            Utility.removeBtnLoader($('#btn-topics'));
            if (response.status === 'success') {
                $('#SignupStep2').hide();
                $('#SignupStep3').show();
                $('#StepHeader').html('Choose Your Topics - Step 3');
                $('#ProgressStep2').removeClass('active');
                $('#ProgressStep2').addClass('completed');
                $('#ProgressStep3').addClass('active');
                this.__initStepThreeForm();
            } else {
                console.log(response);
                console.log('HANDLE TOPICS ERROR HERE');
            }
        },
        onNetworksResponse: function(model, response) {
            console.log('on networks response FUNCTION');
            console.dir(response);
            if (response == undefined)
                return;
            Utility.removeBtnLoader($('#btn-networks'));
            if (response.status !== 'success') {
                // console.log('on networks response success');
                // model.redirectDashboard();
                console.log(response);
                console.log('HANDLE TOPICS ERROR HERE');
            }
        },
        __initStepOneForm: function() {
            var model = this.model;
            var debug = this.__debug;
            $('#SignupStep1').form({
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
                    firstName: {
                        identifier: 'firstName',
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter your first name'
                        }]
                    },
                    lastName: {
                        identifier: 'lastName',
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter your last name'
                        }]
                    },
                    phone: {
                        identifier: 'phone',
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter a phone number'
                        }]
                    },
                    password: {
                        identifier: 'password',
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter a password'
                        }, {
                            type: 'length[6]',
                            prompt: 'Your password must be at least 6 characters'
                        }]
                    },
                    passwordConfirm: {
                        identifier: 'passwordConfirm',
                        rules: [{
                            type: 'empty',
                            prompt: 'Please confirm your password'
                        }, {
                            type: 'match[password]',
                            prompt: 'Your passwords do not match'
                        }]
                    },
                    age: {
                        identifier: 'age',
                        rules: [{
                            type: 'number',
                            prompt: 'Please enter a valid age'
                        }, {
                            type: 'empty',
                            prompt: 'Please enter an age'
                        }]
                    },
                    address1: {
                        identifier: 'address1',
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter an address'
                        }]
                    },
                    city: {
                        identifier: 'city',
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter a city'
                        }]
                    },
                    state: {
                        identifier: 'state',
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter a state'
                        }]
                    },
                    zipcode: {
                        identifier: 'zipcode',
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter a zipcode'
                        }, {
                            type: 'minLength[5]',
                            prompt: 'Please enter a valid zipcode'
                        }]
                    }
                },
                onSuccess: function(e, payload) {
                    e.preventDefault();
                    Utility.addBtnLoader($('#btn-signup'));
                    model.signup(payload);
                },
                debug: debug
            });
        },
        __initStepTwoForm: function() {
            var model = this.model;
            var debug = this.__debug;
            $('#SignupStep2').form({
                on: 'submit',
                onSuccess: function(e, payload) {
                    e.preventDefault();
                    Utility.addBtnLoader($('#btn-topics'));
                    model.updateTopics(payload);
                },
                debug: debug
            });
        },
        __initStepThreeForm: function() {
            var model = this.model;
            var debug = this.__debug;
            $('#SignupStep3').form({
                on: 'submit',
                onSuccess: function(e, payload) {
                    e.preventDefault();
                    Utility.addBtnLoader($('#btn-networks'));
                    model.updateNetworks(payload);
                },
                debug: debug
            });
        },
        __handleFirstStepSuccess: function(e, payload) {
            e.preventDefault();
            var that = this;
            $('#SignupStep1').hide();
            $('#SignupStep2').show({
                complete: that.__enableTopics
            });
            $('#StepHeader').html('Choose Your Topics - Step 2');
            $('#ProgressStep1').removeClass('active');
            $('#ProgressStep1').addClass('completed');
            $('#ProgressStep2').addClass('active');
        },
        __enableTopics: function() {
            $('.ui.toggle.checkbox').checkbox();
        },
        __handleTopicsSuccess: function(response) {
            $('#SignupStep2').hide();
            $('#SignupStep3').show();
            $('#StepHeader').html('Choose Your Topics - Step 3');
            $('#ProgressStep2').removeClass('active');
            $('#ProgressStep2').addClass('completed');
            $('#ProgressStep3').addClass('active');
        }
    });
});