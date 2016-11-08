define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    return _.extend({
        dispose: 'dispose',
        resize: 'resize',
        notify: 'notify',
        navigate: 'navigate',
        logout: 'logout',
        hideLoader: 'hideLoader',
        showScroller: 'showScroller',
        unauthorized: 'unauthorized',
        sidebarToggled: 'sidebarToggled',
        showCampaignDetails: 'showCampaignDetails',
        onRenderedSideNavToggle: 'onRenderedSideNavToggle'
    }, Backbone.Events);
});