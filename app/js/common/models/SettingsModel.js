define(['jquery', 'underscore', 'backbone', 'helpers/utility'], function($, _, Backbone, Utility) {
    var settingsModel = Backbone.BaseModel.extend({
        url: '/config',
        request: function() {
            this.clear();
            var that = this;
            this.fetch({
                success: function(data) {
                    if (that.get('allowConsoleLogs')) {
                        Utility.enableLogs();
                        console.log('>>> Successful Application Settings Responce <<<');
                        console.dir(data.attributes);
                    }
                    Utility.setEnvironment(that.get('environment'));
                },
                error: function(err) {
                    console.log('>>> Bad Application Settings Responce <<<');
                    console.dir(error);
                }
            });
        }
    });
    return new settingsModel();
});