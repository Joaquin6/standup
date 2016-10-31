define(function() {
    return {
        initialize: function(allowConsoleLogs) {
            window.debug = allowConsoleLogs;
            this.__consoleFix();
        },
        __consoleFix: function() {
            //      Allows the ability to turn the console on and off. Use debug=true
            //      in a script before this loads, or in the page url, like:
            //          http://mypage/index.html?debug=true
            //      Without debug=true in one of these two places, the console is turned off
            //      to prevent throwing errors in users' browsers that do not have Firebug
            //      installed.
            //
            //      Fixes some of the annoyances with the IE8 console:
            //          -   clears the logs on reload
            //          -   adds spaces between logged arguments
            //          -   adds stubs for Firebug commands
            //      Fixes WebKit Mobile Debuggers:
            //          - concatenates all arguments into a string to get
            //              around the one argument-logged silliness.
            //          - Does not log objects.
            //          - Only log, info, debug and warn are supported.
            (function() {
                var dbg = window.debug || false;
                var count = window.loglimit || 299;
                var common = "info,error,log,warn";
                var more = "debug,time,timeEnd,assert,count,trace,dir,dirxml,group,groupEnd,groupCollapsed,exception,table,memory";
                window.loglimit = count;
                if (!window.console)
                    console = {};

                function clearLogs() {
                    // clear the console on load. This is more than a convenience - too many logs crashes it.
                    // (If closed it throws an error)
                    try {
                        console.clear();
                    } catch (e) {}
                }

                function fixIE() {
                    var calls = common.split(",");
                    calls.forEach(function(call, index) {
                        var m = call;
                        var n = "_" + call;
                        console[n] = console[m];
                        console[m] = (function() {
                            var type = n;
                            return function() {
                                count--;
                                if (count == 0) console._log("***LOG LIMIT OF " + loglimit + " HAS BEEN REACHED***");
                                if (count < 1) return;
                                console[type](Array.prototype.slice.call(arguments).join(" "));
                            }
                        })();
                    });
                    clearLogs();
                }

                function fixMobile() {
                    // iPad and iPhone use the crappy old Safari debugger.
                    var calls = common.split(",");
                    calls.forEach(function(call, index) {
                        (function() {
                            var m = call;
                            var n = "_" + call;
                            console[n] = console[m];
                            console[m] = function() {
                                console[n](Array.prototype.slice.call(arguments).join(" "));
                            };
                        })();
                    });
                }

                function hideCalls(str) {
                    var calls = str.split(",");
                    calls.forEach(function(call, index) {
                        console[call] = function() {};
                    });
                }

                function tweak() {
                    var calls = more.split(",");
                    calls.forEach(function(call, index) {
                        if (!console[call])
                            console[call] = function() {};
                    });
                }

                var ua = window.navigator.userAgent;
                if (dbg && /Trident/.test(ua)) {
                    fixIE();
                    hideCalls(more);
                } else if (dbg && /WebKit|iPad|iPhone/.test(ua)) {
                    fixMobile();
                    tweak();
                } else if ((/IE/.test(ua) && !/Trident/.test(ua)) || !dbg || !window.console) { // IE6 or no console
                    clearLogs();
                    hideCalls(more + "," + common);
                } else {
                    tweak();
                }
            })();
        }
    };
});