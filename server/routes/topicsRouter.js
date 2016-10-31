var express             = require('express');
var router              = express.Router();
var commonRouter        = require('./common/commonRouter');


var methods = {

	getTopics: function (req, res) {
		var methodName = 'GET /topics/' + ' ';
		var uri = "topics"
		commonRouter.GetResource(req, res, methodName, uri);
	},

	addTopics: function (req, res) {
		var methodName = 'POST /topics/' + ' ';
		var uri = "topics"
		commonRouter.PostResource(req, res, methodName, uri);
	},


}

router.get('/', methods.getTopics);
router.post('/', methods.addTopics);

module.exports = {
	Router:  router,
	Methods: methods
};

