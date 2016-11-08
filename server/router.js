var auth = require('./routes/auth');

module.exports = {
    route: function(app) {
        app.use('/auth', auth.Router);
    }
};