define(['jquery'], function($) {
	return {
		evt : {
			heartbeat : "heartbeat",
			viewcreated : "viewcreated",
			custom : "custom",
			resize : "resize",
			wsresize : "wsresize",
			interop : "interop"
		},
		action : {
			wsendstream : 'wsendstream',
			wsinterop : 'wsinterop',
			wsconfig : 'wsconfig'
		},
		options : {
			el : 'el',
			viewname : 'viewname',
			height : 'height',
			parentview : 'parentview',
			parentid : 'parentid',
			template : 'template',
			useroptions : 'useroptions'
		}
	};
});
