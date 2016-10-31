var admin 	        = require('./routes/areas/adminArea');
var blogger         = require('./routes/areas/bloggerArea');

var campaigns       = require('./routes/campaignsRouter');
var participations  = require('./routes/participationsRouter');
var payments        = require('./routes/paymentsRouter');
var topics          = require('./routes/topicsRouter');
var tags            = require('./routes/tagsRouter');
var users           = require('./routes/usersRouter');
var config          = require('./routes/configRouter');
var auth            = require('./routes/authenticationRouter');

var statistics      = require('./routes/statisticsRouter');
var performance     = require('./routes/performanceRouter');

module.exports = {
	route : function(app) {
		app.use('/admin',           admin.Router);
		app.use('/blogger',         blogger.Router);

		app.use('/campaigns',       campaigns.Router);
		app.use('/participations',  participations.Router);
		app.use('/payments',        payments.Router);
		app.use('/topics',          topics.Router);
		app.use('/tags',            tags.Router);
		app.use('/users',           users.Router);
		app.use('/config',		    config.Router);
		app.use('/auth',			auth.Router);

		app.use('/statistics',      statistics);
		app.use('/performance', 	performance);
	}
};
