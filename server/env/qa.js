var override = {
    host: "qa-app.firestart.me",
    protocol: "https",
    siteType: "bloggers",
    allowConsoleLogs: true,
    api: {
        "protocol":"https",
        "host": "qa-api.firestart.me",
        "port": "443",
        "path": "/api/v1.1/"
    },
    stackTraceLimit: 15
};

module.exports = override;