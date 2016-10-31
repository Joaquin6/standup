define(['jquery', 'underscore', 'backbone', 'main', 'moment', 'helpers/utility', 'collections/CampaignCollection', 'services/io'], function($, _, Backbone, Main, Moment, Utility, CampaignCollection, io) {
    var impressionsModel = Backbone.BaseModel.extend({
        url: '/performance/socialpixel',
        defaults: {
            "isInitialized": false
        },
        collect: function(params) {
            var that = this;
            if (params && params.uid) {
                this.url = "/performance/campaigns/" + params.uid + "/socialpixel/overall";
            }
            console.time("PERFORMANCE API: TOTAL IMPRESSIONS DATA API CALL");
            io.GET(this.url, function(data, status, xhr) {
                console.timeEnd("PERFORMANCE API: TOTAL IMPRESSIONS DATA API CALL");
                console.log('>>> Successful Total Impressions Data Responce <<<');
                that.__generateRealData(data);
            }, function(xhr, status, error) {
                console.timeEnd("PERFORMANCE API: TOTAL IMPRESSIONS DATA API CALL");
                console.log('ImpressionsModel: Get Total Impressions xhr: ' + xhr);
                console.log('ImpressionsModel: Get Total Impressions status: ' + status);
                console.log('ImpressionsModel: Get Total Impressions Error: ' + error);
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

            this.set('impressions', realData);

            this.set("isInitialized", true);
        }
    });
    return new impressionsModel();
});