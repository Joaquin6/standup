define(['jquery', 'underscore', 'backbone', 'main', 'moment', 'helpers/utility', 'collections/CampaignCollection', 'services/io'], function($, _, Backbone, Main, Moment, Utility, CampaignCollection, io) {
    var statisticsModel = Backbone.BaseModel.extend({
        url: '/statistics',
        defaults: {
            "isInitialized": false
        },
        collect: function() {
            var that = this;
            console.time("STATISTICS DATA API CALL");
            io.GET(this.url, function(data, status, xhr) {
                console.timeEnd("STATISTICS DATA API CALL");
                console.log('>>> Successful Statistics Data Responce <<<');
                console.dir(data);
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        that.set(key, data[key]);
                    }
                }
                that.collectSocialPixel();
            }, function(xhr, status, error) {
                console.timeEnd("STATISTICS DATA API CALL");
                console.log('StatisticsModel: Get Statistics xhr: ' + xhr);
                console.log('StatisticsModel: Get Statistics status: ' + status);
                console.log('StatisticsModel: Get Statistics Error: ' + error);
            }, {
                excludePreamble: true
            });
        },
        collectSocialPixel: function() {
            var that = this;
            console.time("PERFORMANCE API: SOCIAL PIXEL DATA API CALL");
            io.GET("/performance/socialpixel/overall/top/20", function(data, status, xhr) {
                console.timeEnd("PERFORMANCE API: SOCIAL PIXEL DATA API CALL");
                console.log('>>> Successful Social Pixel Data Responce <<<');
                that.__generateRealData(data);
                that.set("isInitialized", true);
            }, function(xhr, status, error) {
                console.timeEnd("STATISTICS DATA API CALL");
                console.log('StatisticsModel: Get Social Pixel xhr: ' + xhr);
                console.log('StatisticsModel: Get Social Pixel status: ' + status);
                console.log('StatisticsModel: Get Social Pixel Error: ' + error);
            }, {
                excludePreamble: true,
                excludeHeaders: true
            });
        },
        isInitialized: function() {
            var init = this.get("isInitialized");
            if (!init)
                init = this.defaults.isInitialized;
            return init;
        },
        __generateRealData: function(data) {
            var realData = JSON.parse(data);
            var metricsDate = "Metrics for " + Moment(realData.pointEnd).format("dddd, MMMM Do YYYY");
            this.set('metricsDate', metricsDate);

            var series = [];
            var dataseries = {};
            dataseries.name = realData.name || "Social Pixel Data";
            dataseries.data = realData.data;
            series.push(dataseries);

            this.set('randomSeries', series);
        }
    });
    return new statisticsModel();
});