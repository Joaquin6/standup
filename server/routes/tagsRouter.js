var express             = require('express');
var router              = express.Router();
var commonRouter        = require('./common/commonRouter');

var methods = {

	getTags: function (req, res) {
		var methodName = 'GET /tags/' + ' ';
		var uri = "tags"
		commonRouter.GetResource(req, res, methodName, uri);
	},

	addTags: function (req, res) {
		var methodName = 'POST /tags/' + ' ';
		var uri = "tags"
		commonRouter.PostResource(req, res, methodName, uri);
	}
}

router.get('/', methods.getTags);
router.post('/', methods.addTags);

module.exports = {
	Router:  router,
	Methods: methods
};

