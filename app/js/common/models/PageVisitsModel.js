define(['jquery', 'underscore', 'backbone', 'helpers/utility', 'services/io'], function($, _, Backbone, Utility, io) {
    return Backbone.BaseModel.extend({
        url: '/performance/pagevisits',
        defaults: {
            "isInitialized": false,
            "visits": 0,
            "avgtime": 0,
            "uniquevisits": 0,
            "pageviews": 0
        },
        request: function(params) {
            if (params && params.uid) {
                // At the Moment, ONLY "OREO" is supported
                // AND lunchboxglobal, which has the name of
                // "Global Reporting Suite"
                this.url = "/performance/campaigns/" + params.uid + "/pagevisits";
            }
            var that = this;
            console.time("PERFORMANCE API: PAGE VISITS DATA API CALL");
            io.GET(this.url, function(data, status, xhr) {
                console.timeEnd("PERFORMANCE API: PAGE VISITS DATA API CALL");
                console.log('>>> Successful Page Visits Data Responce <<<');
                that.__generateRealData(data);
                that.set("isInitialized", true);
            }, function(xhr, status, error) {
                console.timeEnd("PERFORMANCE API: PAGE VISITS DATA API CALL");
                console.log('PageVisitsModel: Get Page Visits xhr: ' + xhr);
                console.log('PageVisitsModel: Get Page Visits status: ' + status);
                console.log('PageVisitsModel: Get Page Visits Error: ' + error);
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
            data = JSON.parse(data);
            this.set('pagevisits', data);

            var series = data[0];

            this.set('visits', series.data[0]);
            this.set('avgtime', Utility.round(series.data[1], 2));
            this.set('uniquevisits', series.data[2]);
            this.set('pageviews', series.data[3]);
        }
    });
});