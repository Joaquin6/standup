define(['jquery', 'underscore', 'marionette', 'main', 'helpers/events'], function($, _, Marionette, Main, Events) {
	return Marionette.ItemView.extend({
		tagName: "h1",
		id: "TitleView",
		className: "ui dividing header",
		template: false,
		onBeforeShow: function() {
			this.listenTo(Events, Events.navigate, this.updateTitle);
		},
		onShow: function() {
			$(this.el).text(this.__getProperTitle());
		},
		updateTitle: function(linksource) {
			var pageTitle = $(this.el);
			pageTitle.empty();
			switch(linksource){
				case "dashboard":
					pageTitle.text('Dashboard');
					break;
				case "availablecampaigns":
					pageTitle.text('Available Campaigns');
					break;
				case "mycampaigns":
					pageTitle.text('My Campaigns');
					break;
				case "myprofile":
					pageTitle.text('My Profile');
					break;
				case "contact":
					pageTitle.text('Contact');
					break;
				case "topics":
					pageTitle.text('Topics');
					break;
				case "mynetworks":
					pageTitle.text('My Networks');
					break;
				case "paymentinfo":
					pageTitle.text('Payment Info');
					break;
				case "campaigndetails":
					pageTitle.text('Campaign Details');
					break;
			}
		},
		__getProperTitle: function() {
            var that = this;
			if (location.pathname.indexOf("/dashboard") > -1)
				return "Dashboard";
			else if (location.pathname.indexOf("/availablecampaigns") > -1)
				return "Available Campaigns";
			else if (location.pathname.indexOf("/myprofile") > -1)
				return "My Profile";
			else if (location.pathname.indexOf("/mycampaigns") > -1)
				return "My Campaigns";
			else if (location.pathname.indexOf("/campaigndetails") > -1)
				return "Campaign Details";
			else if (location.pathname.indexOf("/contact") > -1)
				return "Contact";
			else if (location.pathname.indexOf("/topics") > -1)
				return "Topics";
			else if (location.pathname.indexOf("/mynetworks") > -1)
				return "My Networks";
			else if (location.pathname.indexOf("/paymentinfo") > -1)
				return "Payment Info";
		}
	});
});