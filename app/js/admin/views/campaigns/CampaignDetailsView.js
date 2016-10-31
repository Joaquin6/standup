define(['jquery', 'underscore', 'marionette', 'highchartssrc', 'helpers/utility', 'moment', 'moment-range', 'models/ImpressionsModel', 'campaigns/CampaignDetailsTemplate.html'], function($, _, Marionette, Highcharts, Utility, Moment, Range, ImpressionsModel, Template) {
	return Marionette.ItemView.extend({
		id: "CampaignDetailsView",
		className: "ui segment",
		template: _.template(Template),
		templateHelpers: {
			formatCurrency: function(val) {
				var formattedCurrency = Utility.formatCurrency(val);
				return formattedCurrency;
			},
            formatDate: function(paidDate){
            	if (paidDate === 'N/A')
            		return paidDate;
                var formattedDate = Moment(paidDate).format('MM/DD/YYYY');
                return formattedDate;
            },
            formatStatus: function(status) {
                if (status === 0)
                    status = "Upcomming";
                else if (status === 1)
                    status = "Active";
                else
                    status = "Inactive";
                var formattedStatus = Utility.capitalizeFirstLetter(status);
                return formattedStatus;
            },
            formatDaysLeft: function(endDate) {
            	var today = Moment();
            	var end = Moment(endDate);
            	var range = Moment.range(today, end);
            	var daysLeft = range.diff('days');
                daysLeft = daysLeft < 0 ? 0 : daysLeft;
                return daysLeft;
            }
        },
        initialize: function() {
        	// This is how a module is loaded. Pass in Highcharts as a parameter.
			require('highcharts/modules/no-data-to-display')(Highcharts);
			Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function(color) {
				return Highcharts.Color(color).setOpacity(0.8).get('rgba');
			});
        },
        onShow: function() {
        	if (!ImpressionsModel.isInitialized()) {
        		var that = this;
                this.listenToOnce(ImpressionsModel, "change:isInitialized", function() {
                    that.__showLineChartContent();
                });
        	} else
        		this.__showLineChartContent();
        },
        __showLineChartContent: function() {
        	var series = ImpressionsModel.get("impressions");
        	var startUTC = Moment(series.pointStart);
        	startUTC = Moment.utc(startUTC);
        	new Highcharts.Chart({
                chart: {
                    type: 'line',
                    renderTo: "linechart_container",
                    zoomType: 'xy'
                },
                title: {
                    text: series.name
                },
                subtitle: {
                    text: 'Metrics thru ' + Moment().subtract(1, "day").format("YYYY-MM-DD")
                },
                xAxis: {
                    type: 'datetime'//,
                    //tickInterval: 24 * 3600 * 1000
                },
                yAxis: {
                    title: {
                        text: 'Impressions',
                        useHTML: true
                    }
                },
                units: [
                	['day', [1]]
                ],
                series: [{
                    name: series.name,
                    pointStart: startUTC.unix(),
                    pointInterval: 24 * 3600 * 1000,
                    data: series.data
                }]
        	});
        }
	});
});