var override = {
    app: "vision-wheel-dealers",
    title: "Vision Wheel | Dealers",
    host: "dealers.visionwheel",
    port: 8080,
    protocol: "http",
    apiPath: "/api/v1",
    webpackDevServer: {
        contentBase: 'http://localhost/',
        proxy: {
            "*": "http://localhost:8080"
        },
        filename: "bundle.js",
        // We need to tell webpack to serve our bundled application
        // from the build path. When proxying:
        // http://localhost:1919/build -> http://localhost:8080/build
        publicPath: '/build/',
        // Configure hot replacement
        hot: true,
        // The rest is terminal configurations
        quiet: false,
        noInfo: true,
        stats: {
            colors: true
        },
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        }
    },
    webpackBundler: {
        port: 1919,
        host: "localhost"
    },
    database: {
        client: "postgres",
        username: "postgres_admin",
        password: "p0stgrEs_adm1NpASS",
        host: "lab-pg-db.mirum.la",
        name: "visionwheeldealers-qa",
        port: 5432,
        max: 10,
        idleTimeoutMillis: 30000
    },
    cors: {
        // Need to wildcard this for branch-based builds e.g. '*.firestart.me:*'
        origins: []
    },
    jwtTokenSecret: 'aGiantBoxOfLaunch',
    jwtRefreshTokenSecret: 'f1R3$T*rtRr3Fre5H',
    ssnSalt: '5h0odBUn3KpRyo0$r',
    resetTokenPass: 'makeI+$0NumberOne',
    resetPassword: {
        tokenExpiration: {
            duration: 1,
            unit: 'hours'
        },
        emailOptions: {
            from: 'support@dev.firestart.me',
            subject: 'Your reset password request',
            linkHost: 'http://localhost/'
        }
    },
    authorization: {
        // used by jwt-auth.isPublicPath
        // assumes everything else is protected
        pathSpec: {
            global: {
                public: [
                    '/_ping',
                    '/images'
                ]
            },
            '/auth': {
                public: [
                    '/login'
                ],
                // used to override paths that are within "public"
                protect: [
                    '/refresh'
                ]
            }
        },
        tokenExpiration: {
            duration: 30,
            unit: 'minutes'
        },
        tokenGracePeriod: {
            duration: 5,
            unit: 'minutes'
        },
        svcTokenExpiration: {
            duration: 1,
            unit: 'years'
        },
        svcTokenGracePeriod: {
            duration: 5,
            unit: 'minutes'
        }
    },
    defaultAdmin: {
        email: 'admin@vw.com',
        password: 'password',
        firstName: 'Admin',
        lastName: 'Mirum',
        roles: 'admin'
    },
    serviceHeader: {
        serviceNetworkTitle: 'Vision Wheel Dealers',
        serviceNetworkTitleHTML: 'Visionwheel Dealers&#8482;',
        serviceNetwork: 'http://dealers.visionwheel.com',
        serviceSignUpEmail: 'signup@dealers.visionwheel.com',
        serviceContactAssistance: 'If you did not change or require any additional assistance please contact us at signup@dealers.visionwheel.com',
        serviceContactAssistancePayPal: 'If you are having issues with your PayPal account, please contact PayPal at http://paypal.com'
    },
    // Note the algorithm, keylen and salt are dependent upon each other.
    // The keylen and saltSize must be correct for the alogo, the only known values for aes-256 are below.
    encryption: {
        algorithm: 'aes-256-cbc',
        keylen: 32, // This needs to fit the algorithm's key length
        saltSize: 8, // In bytes, needs to fit the keylen bits
        // Changing ANY of thes password, iterations or fileNameSepartor will result in the currently encrypted files not working.
        password: 'S0m3R34le3c)mp13x5trlN6',
        iterations: 4096,
        fileNameSeparator: ':::enc:::',
        hashAlgorithm: 'sha1'
    },
    crypto: {
        workFactor: 5000,
        keylen: 32,
        randomSize: 256
    }
};

module.exports = override;