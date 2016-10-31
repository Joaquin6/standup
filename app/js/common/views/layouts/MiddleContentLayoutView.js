define(['jquery', 'underscore', 'marionette', 'main', 'layouts/MiddleContentLayoutTemplate.html', 'views/ApplicationStatusView', 'views/PaymentStatusView',], function($, _, Marionette, Main, Template, ApplicationStatusView, PaymentStatusView) {
    return Marionette.LayoutView.extend({
        __views: {},
        id: "MiddleContentLayoutView",
        className: "ui segments",
        template: _.template(Template),
        regions: {
            UpperMiddleContentBodyRegion: '#UpperMiddleContentBodyRegion',
            LowerMiddleContentBodyRegion: '#LowerMiddleContentBodyRegion'
        },
        onShow: function() {
            this.UpperMiddleContentBodyRegion.show(this.__getApplicationStatusView());
            this.LowerMiddleContentBodyRegion.show(this.__getPaymentStatusView());
		},
        __getApplicationStatusView: function() {
            var view;
            if (this.__views.applicationStatusView)
                view = this.__views.applicationStatusView;
            else {
                view = this.__views.applicationStatusView = new ApplicationStatusView({
                    model: Main.App.Session.User
                });
            }
            if (view.isDestroyed) {
                view = this.__views.applicationStatusView = new ApplicationStatusView({
                    model: Main.App.Session.User
                });
            }
            return view;
        },
        __getPaymentStatusView: function() {
            var view;
            if (this.__views.paymentStatusView)
                view = this.__views.paymentStatusView;
            else {
                view = this.__views.paymentStatusView = new PaymentStatusView({
                    model: Main.App.Session.User
                });
            }
            if (view.isDestroyed) {
                view = this.__views.paymentStatusView = new PaymentStatusView({
                    model: Main.App.Session.User
                });
            }
            return view;
        }
    });
});