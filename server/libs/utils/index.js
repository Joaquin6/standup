'use strict';
var Moment = require("moment");

var Format = {
    comma: function(val) {
        if ( typeof val == "number")
            val = val.toString();
        return val.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    },
    currency: function(val) {
        if (val >= 0)
            return '$' + this.comma(val);
        val = -val;
        return '-$' + this.comma(val);
    },
    numberThousands: function(val) {
        return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
};

var Utilities = {
    format: Format
};

module.exports = {
    daysHoursMinsFormat: function(t) {
        var cd = 24 * 60 * 60 * 1000,
            ch = 60 * 60 * 1000,
            d = Math.floor(t / cd),
            h = Math.floor((t - d * cd) / ch),
            m = Math.round((t - d * cd - h * ch) / 60000),
            pad = function(n) {
            return n < 10 ? '0' + n : n;
        };
        if (m === 60) {
            h++;
            m = 0;
        }
        if (h === 24) {
            d++;
            h = 0;
        }
        return [d + "Days", pad(h) + "Hours", pad(m) + "Mins"].join(':');
    },
    dump: function(data) {
        return JSON.stringify(data, null, 4);
    },
    Exception: function(message, code) {
        var error = new Error(message);
        error.code = code;
        return error;
    },
    formatComma: function(val) {
        if ( typeof val == "number")
            val = val.toString();
        return val.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    },
    formatCurrency: function(val) {
        if (val >= 0)
            return '$' + this.formatComma(val);
        val = -val;
        return '-$' + this.formatComma(val);
    },
    formatNumberThousands: function(val) {
        return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    },
    isValidJson: function(json) {
        var result;
        try {
            JSON.parse(json);
            result = true;
        } catch(err){
            result = false;
        }
        return result;
    },
    memorySizeOf: function (obj) {
        // useful method of returning approx size of object
        var bytes = 0;
        function sizeOf(obj) {
            if (obj !== null && obj !== undefined) {
                switch (typeof obj) {
                case 'number':
                    bytes += 8;
                    break;
                case 'string':
                    bytes += obj.length * 2;
                    break;
                case 'boolean':
                    bytes += 4;
                    break;
                case 'object':
                    var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                    if (objClass === 'Object' || objClass === 'Array') {
                        for (var key in obj) {
                            if (!obj.hasOwnProperty(key))
                                continue;
                            sizeOf(obj[key]);
                        }
                    } else
                        bytes += obj.toString().length * 2;
                    break;
                }
            }
            return bytes;
        };
        function formatByteSize(bytes) {
            if (bytes < 1024)
                return bytes + " bytes";
            else if (bytes < 1048576)
                return (bytes / 1024).toFixed(3) + " KiB";
            else if (bytes < 1073741824)
                return (bytes / 1048576).toFixed(3) + " MiB";
            else
                return (bytes / 1073741824).toFixed(3) + " GiB";
        };
        return formatByteSize(sizeOf(obj));
    },
    shuffle: function(array) {
        var currentIndex = array.length,
            temporaryValue,
            randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },
    /**
     * Set token expiration time
     * @param {Config} config - Global configuration object
     * @return {int}
     */
    tokenExpiration: function(config) {
        config = config || {duration: 15, unit: 'minutes'};
        return Moment().add(config.duration, config.unit).valueOf();
    },
    refreshTokenExpiration: function(expiry, refreshConfig) {
        refreshConfig = refreshConfig || {
            duration: 5,
            unit: 'minutes'
        };
        return Moment(expiry).add(refreshConfig.duration, refreshConfig.unit).valueOf();
    },
    ensureCallback: function(callback) {
        return (typeof callback !== 'function') ? function() {} : callback;
    },
    removeTrailingSlashes: function(path) {
        var p = path;
        for (var i = path.length; i; i--) {
            if (p[i - 1] !== '/') {
                return p;
            }
            p = p.substring(0, i - 1);
        }
        return p;
    },
    escapeRegExp: function(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
};