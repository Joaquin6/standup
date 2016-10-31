define(['jquery', 'underscore', 'marionette', 'helpers/utility', 'layouts/PaymentInfoLayoutTemplate.html', 'views/collections/PaymentsCollectionView', 'collections/PaymentCollection'], function($, _, Marionette, Utility, Template, PaymentsCollectionView, PaymentCollection) {
    return Marionette.LayoutView.extend({
        id: "PaymentInfoLayoutView",
        template: _.template(Template),
        className: "ui segments",
        onShow: function() {
            var view = new PaymentsCollectionView({
                collection: PaymentCollection
            });
            view.render();
            this.__initPaymentsAccordion();
		},
        __initPaymentsAccordion: function() {
            var options = {
                selector: {
                    trigger: '#PaymentsAccordionTitle'
                }
            };
            if (!Utility.isProductionEnv())
                options.debug = true;
            $('#PaymentsAccordion').accordion(options);
        }
    });
});