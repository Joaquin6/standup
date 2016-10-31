define(['jquery', 'helpers/utility'], function($, Utility) {
	return {
		name : 'LoadingWidget',
		show : function(element) {
			if (element == undefined)
				element = 'body';
			var id = "loading" + Utility.getUniqueId();
			var html = "<div id='__ID__' style='position: absolute; left: 50%; top: 50%; width: 35px; height: 35px; margin-left: -17px; margin-top: -17px; opacity: 0.2; background-image: url(&quot;/images/loadingAnimation.gif&quot;)'></div>".replace('__ID__', id);
			var node = $.parseHTML(html);
			$(element).append(node);
			return node;
		},
		hide : function(element) {
			if (element == undefined || element == null)
				return;
			$(element).remove();
		}
	};
});
