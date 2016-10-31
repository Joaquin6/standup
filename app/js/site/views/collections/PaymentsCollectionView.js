define(['jquery', 'underscore', 'marionette', 'views/paymentinfo/PaymentItemView', 'views/components/EmptyCampaignsView'], function($, _, Marionette, PaymentItemView, EmptyPaymentsView) {
    return Marionette.CollectionView.extend({
        el: "#PaymentsCollectionView",
        childView: PaymentItemView,
        emptyView: EmptyPaymentsView
    });
});