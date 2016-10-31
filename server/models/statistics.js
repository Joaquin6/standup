var Q = require("q");
var _ = require('underscore');
var Promise = require('bluebird');
var httpHelper = require('../helpers/httpHelper');
var Utility  = require('../helpers/utilHelper');
var commonController = Promise.promisifyAll(require('../controllers/common'));

var StatisticsModel = {
	getStats: function(req, res) {
		var deferred = Q.defer();
		this.__getStats(req, res).then(function(response) {
			deferred.resolve(response);
		}).fail(function(err) {
			deferred.reject(err);
		}).done();
		return deferred.promise;
	},
	getAllCampaignStats: function(req, res) {
		var deferred = Q.defer();
		var methodName = 'GET /campaigns' + ' ';
		var uri = "campaigns";
		this.__getAllCampaignStats(req, res, methodName, uri).then(function(response) {
			deferred.resolve(response);
		}).fail(function(err) {
			deferred.reject(err);
		}).done();
		return deferred.promise;
	},
	getAllUsersStats: function(req, res) {
		var deferred = Q.defer();
		var methodName = 'GET /users' + ' ';
		var uri = "users";
		this.__getAllUsersStats(req, res, methodName, uri).then(function(response) {
			deferred.resolve(response);
		}).fail(function(err) {
			deferred.reject(err);
		}).done();
		return deferred.promise;
	},
	__getStats: function(req, res) {
		var deferred = Q.defer();
		var promises = [], that = this, APIResponse;
		promises.push(this.getAllCampaignStats(req, res));
		promises.push(this.getAllUsersStats(req, res));
		Q.allSettled(promises).then(function(results) {
			var statistics = {}, value;
			results.forEach(function(result) {
				if (result.state === 'fulfilled') {
					value = result.value;
					if (!APIResponse)
						APIResponse = value;
					for (key in value.body) {
						if (value.body.hasOwnProperty(key))
							statistics[key] = value.body[key];
					}
				} else {
					var err = {};
					err.message = 'Error Getting All Statistics';
					console.log("-- " + err.message + " --");
					deferred.reject(err);
				}
			});
			APIResponse.body = statistics;
			deferred.resolve(APIResponse);
		}).done();
		return deferred.promise;
	},
	__getAllCampaignStats: function(req, res, methodName, uri) {
		var deferred = Q.defer();
		var that = this;
		commonController.GetResourceAsync(req, uri).then(function(apiResponse) {
			console.log(methodName + ' Statistics Successful');
			that.__buildAllCampaignStatistics(apiResponse.body).then(function(campaignStats) {
				apiResponse.body = campaignStats;
				deferred.resolve(apiResponse);
			}).fail(function(err) {
				deferred.reject(err);
			}).done();
		}, function (err) {
			deferred.reject(err);
		}).catch(function (fatal) {
			deferred.reject(fatal);
		});
		return deferred.promise;
	},
	__getAllUsersStats: function(req, res, methodName, uri) {
		var deferred = Q.defer();
		var that = this;
		commonController.GetResourceAsync(req, uri).then(function(apiResponse) {
			console.log(methodName + ' Statistics Successful');
			that.__buildAllUsersStatistics(apiResponse.body).then(function(usersStats) {
				apiResponse.body = usersStats;
				deferred.resolve(apiResponse);
			}).fail(function(err) {
				deferred.reject(err);
			}).done();
		}, function (err) {
			deferred.reject(err);
		}).catch(function (fatal) {
			deferred.reject(fatal);
		});
		return deferred.promise;
	},
	__buildAllCampaignStatistics: function(allCampaigns) {
		var deferred = Q.defer();
		var campaignStats = {
			campaigns: {}
		};
		// Get # of Campaigns
		campaignStats.campaigns.totalCampaigns = Utility.formatNumberThousands(_.size(allCampaigns));

		// Get Total Participations
        var totalParticipations = 0;
        var participations = _.pluck(allCampaigns, "myParticipation");
        participations.forEach(function(participation, index) {
            if (participation !== undefined)
                totalParticipations += participation;
        });
        campaignStats.campaigns.totalParticipations = Utility.formatNumberThousands(totalParticipations);

        // Get Total Campaign Status
        var totalActiveCampaigns = 0;
        var totalCompletedCampaigns = 0;
        var allStatus = _.pluck(allCampaigns, "status");
        allStatus.forEach(function(status, index) {
            if (status !== undefined) {
                if (status === "Active")
                    totalActiveCampaigns += 1;
                else if (status === "Completed")
                    totalCompletedCampaigns += 1;
            }
        });
        campaignStats.campaigns.totalActiveCampaigns = Utility.formatNumberThousands(totalActiveCampaigns);
        campaignStats.campaigns.totalCompletedCampaigns = Utility.formatNumberThousands(totalCompletedCampaigns);

        // Get Total Budgeted Clicks
        var totalBudgetedClicks = 0;
        var budgetedClicks = _.pluck(allCampaigns, "budgetedClicks");
        budgetedClicks.forEach(function(budgetedClick, index) {
            if (budgetedClick !== undefined)
                totalBudgetedClicks += budgetedClick;
        });
        campaignStats.campaigns.totalBudgetedClicks = Utility.formatNumberThousands(totalBudgetedClicks);

        // Get Total Budget
        var totalBudget = 0;
        var budgets = _.pluck(allCampaigns, "budget");
        budgets.forEach(function(budget, index) {
            if (budget !== undefined)
                totalBudget += budget;
        });
        campaignStats.campaigns.totalBudget = Utility.formatCurrency(totalBudget);

        // Get Total Remaining Balance
        var totalRemainingBalance = 0;
        var remainingBalances = _.pluck(allCampaigns, "remainingBalance");
        remainingBalances.forEach(function(remainingBalance, index) {
            if (remainingBalance !== undefined)
                totalRemainingBalance += remainingBalance;
        });
        campaignStats.campaigns.totalRemainingBalance = Utility.formatCurrency(totalRemainingBalance);

        deferred.resolve(campaignStats);

		return deferred.promise;
	},
	__buildAllUsersStatistics: function(allUsers) {
		var deferred = Q.defer();
		var usersStats = {
			users: {}
		};

		// Get # of Users
		usersStats.users.totalUsers = Utility.formatNumberThousands(_.size(allUsers));

        deferred.resolve(usersStats);

		return deferred.promise;
	}
};

module.exports = StatisticsModel;
