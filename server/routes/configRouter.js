var express                     = require('express');
var router                      = express.Router();
var httpHelper                  = require('../libs/helpers/httpHelper');

//new methods

var methods =
	{
		getAppSettings : function (req, res) {
			return httpHelper.SendWebResponse(res,200,global.settings,{})
		}
	}

router.get('/', methods.getAppSettings);


module.exports = {
	Router : router,
	Methods : methods
};

