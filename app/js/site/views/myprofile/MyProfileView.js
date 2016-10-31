define(['jquery', 'underscore', 'marionette', 'main', 'myprofile/MyProfileTemplate.html'], function($, _, Marionette, Main, Template) {
	return Marionette.ItemView.extend({
		id: "MyProfileView",
		className: "ui segments",
		template: _.template(Template),
		templateHelpers: {
			formatPhone: function(phone){
                return this.phoneData.formatted;
            }
        }
	});
});