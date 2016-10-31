var override = {
    app: "fs.app",
    title: "The Firestarter Network | Firestarter",
    host: "firestart.me",
    port: 8080,
    protocol: "http",
    siteType: "bloggers",
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
    useRealAPI: false,
    performanceAPI: {
        protocol:"http",
        host: "qa-performance-api.mirum.la",
        path: "/api/v1/"
    },
    auth: {
        "enabled": false,
        "tokens": ["admin" , "limited"]
    },
    database: {
        client: "postgres",
        username: "postgres_admin",
        password: "p0stgrEs_adm1NpASS",
        host: "lab-pg-db.mirum.la",
        name: "firestarter_data",
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
                    '/_ping'
                ]
            },
            '/api/v1': {
                public: [
                    '/docs',
                    '/api-docs',
                    '/auth'
                ],
                // used to override paths that are within "public"
                protect: [
                    '/auth/password'
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
    session: {
        secret: "Bp7O3T4FPVV3y{5"
    },
    defaultAdmin: {
        email: 'admin@fs.api',
        password: 'mullenI$aFirestarter',
        firstName: 'Admin',
        lastName: 'Lbox',
        roles: 'admin'
    },
    defaultService: {
        email: 'services@fs.api',
        password: 'make!t$0NumberOne',
        firstName: 'Service',
        lastName: 'Lbox',
        roles: 'service'
    },
    serviceHeader: {
        serviceNetworkTitle: 'Firestarter Network',
        serviceNetworkTitleHTML: 'Firestarter Network&#8482;',
        serviceNetwork: 'http://dev.firestart.me',
        serviceSignUpEmail: 'signup@dev.firestart.me',
        serviceContactAssistance: 'If you did not change or require any additional assistance please contact us at signup@firestart.me',
        serviceContactAssistancePayPal : 'If you are having issues with your PayPal account, please contact PayPal at http://paypal.com'
    },
    S3StorageCredentials : {
        s3AccessKey: 'AKIAJW22WK6L5GHJRMCA',
        s3SecretAccessKey: 'X2hxYTJ+lSnF9HV7cy2dlTUGiX6d3cAYDtVOmwF8',
        s3Bucket: 'dev.firestart.me',
        s3BucketAssets: 'dev.firestart.me'
    },
    paypal: {
        'mode': 'sandbox',
        'host': 'api.sandbox.paypal.com',
        'port': '',
        'client_id': 'ARSKdYjckt8YYbZR1Zsxe8yc4vbvDYlLCPz9iLm7d4fMv4zO-qHKL_HgI_Dnaj_SE7qQ24j-2phAm8JN',
        'client_secret': 'EM—SG3jJnG7IbojkjAqE6GlgK4GrCuppPvKmqAS_RX2vOZRsnzs9NOIIvgfR9HZqorx3DU5hgnj3ul',
        'submissionLimit': 300
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
    // S3 Storage Keys
    // Note the algorithm, keylen and salt are dependent upon each other.
    // The keylen and saltSize must be correct for the algo, the only known values for aes-256 are below.
    // !!!!!!!
    // NEVER DELETE A KEY FROM HERE! It should be able to decrypt anything it ever created!
    // !!!!!!!
    s3Crypto: {
        fileNameSeparator: ':::enc:::',
        // This REALLY shouldn't be in a browseable directory space. What is appropriate?
        // In production this directory should be as secured as possible.
        // If a user or process on the machine can view the directory they can copy files while in their unencrypted state.
        tempDir: './static/forms/',
        w9: {
            unencrypted: {
                algorithm: '',
                keylen: 0, // This needs to fit the algorithm's key length
                saltSize: 0, // In bytes, needs to fit the keylen bits
                // Changing ANY of these password, iterations or fileNameSepartor will result in the currently encrypted files not working.
                password: '',
                iterations: 0,
                hashAlgorithm: '',
                encryptionTag: /(https:\/\/s3.amazonaws.com)/,
                S3StorageCredentials : {
                    s3AccessKey: 'AKIAJW22WK6L5GHJRMCA',
                    s3SecretAccessKey: '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',
                    s3Bucket: 'dev.firestart.me'
                }
            },
            v1: {
                algorithm: 'aes-256-cbc',
                keylen: 32, // This needs to fit the algorithm's key length
                saltSize: 8, // In bytes, needs to fit the keylen bits
                // Changing ANY of thes password, iterations or fileNameSepartor will result in the currently encrypted files not working.
                password: 'S0m3R34le3c)mp13x5trlN6',
                iterations: 4096,
                hashAlgorithm: 'sha1',
                S3StorageCredentials : {
                    s3AccessKey: 'AKIAJW22WK6L5GHJRMCA',
                    s3SecretAccessKey: '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',
                    s3Bucket: 'dev.firestart.me'
                }
            }
        }
    },
    // Audit Log signing key, there should only be one.
    //
    // Note the algorithm, keylen and salt are dependent upon each other.
    // The keylen and saltSize must be correct for the algo, the only known values for aes-256 are below.
    // !!!!!!!
    // Ideally keys would be rotated out of here and securely archived.
    // This would make it impossible to create bogus historical data in the future.
    // Reporting can ignore the HMAC, its only needed if we need when some questions the validity of the data.
    // !!!!!!!
    auditLog: {
        algorithm: 'aes-256-cbc',
        keylen: 32, // This needs to fit the algorithm's key length
        saltSize: 8, // In bytes, needs to fit the keylen bits
        // Changing ANY of thes password, iterations or fileNameSepartor will result in the currently encrypted files not working.
        password: 'S0m3R34le3c)mp13x5trlN6',
        iterations: 4096,
        hashAlgorithm: 'sha1',
        // The S3 credentials should lead to a secure write only bucket, a copy of the audit object can be stored on S3.
        S3StorageCredentials: {
            s3AccessKey: 'AKIAJW22WK6L5GHJRMCA',
            s3SecretAccessKey: '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',
            s3Bucket: 'dev.firestart.me'
        }
    },
    advantage: {
        glaCode: '10.2000.00.91520'
    }
};

module.exports = override;