var Q 			= require("q"),
	_ 			= require("underscore"),
	path        = require("path"),
	colors      = require('colors'),
	express     = require("express"),
	Massive 	= require("massive"),
	app         = express();

initDatabase(global.settings.database);

/**
 * Massive supports SQL files as root-level functions.
 * By default, if you have a db directory in your project
 * (you can override this by passing in a scripts setting),
 * Massive will read each SQL file therein and create a query
 * function with the same name. If you use subdirectories, Massive
 * will namespace your queries in the exact same way.
 * @param  {Object} settings The application global settings.
 */
function initDatabase(settings) {
	Database = Massive.connectSync({
		connectionString: buildConnection(settings),
		scripts: path.resolve(__dirname, "scripts")
	});
	app.set('db', Database);

	/** Execute Command to SET the `search_path` value. */
	Database.setSearchPath(function(err, res) {
		if (err) {
			console.log(colors.red("!!! Postgres DB: SQL Script `setSearchPath` ERROR"));
		} else {
			Database.showSearchPath(function(err, res) {
				if (err) {
					console.log(colors.red("!!! Postgres DB: SQL Script `showSearchPath` ERROR"));
				} else {
					if (res[0])
						res = res[0];
					console.log("*** Postgres DB: Successfully SET `search_path` to: " + colors.green(res.search_path));
				}
			});
		}
	});
}

function buildConnection(settings) {
	/** Here we will add additionaly functionality to handle multi DB Instances */
	var connectionString = "", isError = false;
	var err = {
		statusCode: 500,
		message: "DBConnection Error Message:"
	};

	if (!settings.client) {
		if (!isError) isError = true;
		err.message += " Missing DB Client";
	} else
		connectionString = settings.client;

	if (!settings.username) {
		if (!isError) {
			isError = true;
			err.message += " Missing DB Username";
		} else
			err.message += ", Missing DB Username";
	} else
		connectionString += "://" + settings.username;

	if (!settings.password) {
		if (!isError) {
			isError = true;
			err.message += " Missing DB Password";
		} else
			err.message += ", Missing DB Password";
	} else
		connectionString += ":" + settings.password;

	if (!settings.host) {
		if (!isError) {
			isError = true;
			err.message += " Missing DB Host";
		} else
			err.message += ", Missing DB Host";
	} else
		connectionString += "@" + settings.host;

	if (!settings.port) {
		if (!isError) {
			isError = true;
			err.message += " Missing DB Port";
		} else
			err.message += ", Missing DB Port";
	} else
		connectionString += ":" + settings.port;

	if (!settings.name) {
		if (!isError) {
			isError = true;
			err.message += " Missing DB Name";
		} else
			err.message += ", Missing DB Name";
	} else
		connectionString += "/" + settings.name;

	if (isError) {
		/** Clearly this will result in a DB Connection Error. This is a Potential Bug! */
		return err;
	} else {
		return connectionString;
	}
}

// export module
module.exports = Database;

// Queries ran to create document tables for analytics schema
// create table analytics.socialpixel (
//   id serial primary key,
//   body jsonb not null,
//   search tsvector,
//   created_at timestamptz default now()
// );
// create index idx_socialpixel on analytics.socialpixel using GIN(body jsonb_path_ops);
// create index idx_socialpixel_search on analytics.socialpixel using GIN(search);
//
// socialpixel_id_seq
// postgres_admin
