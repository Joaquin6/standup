define(['jquery', 'highchartssrc'], function($, Highcharts) {
    return {
        initialize: function() {
            this.__extendJQ();
            this.__patchJQ();
            this.__extendHC();
            $.event.special.debouncedresize.threshold = 500;
        },
        __extendJQ: function() {
            $.fn.extend({
                disable: function(state) {
                    return this.each(function() {
                        var $this = $(this);
                        $this.toggleClass('disabled', state);
                    });
                }
            });
            $.extend($.easing, {
                easeInOutCubic: function(x, t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                    return c / 2 * ((t -= 2) * t * t + 2) + b;
                }
            });
            $.fn.outerFind = function(selector) {
                return this.find(selector).addBack(selector);
            };
            $.isMobile = function(type) {
                var reg = [];
                var any = {
                    blackberry: 'BlackBerry',
                    android: 'Android',
                    windows: 'IEMobile',
                    opera: 'Opera Mini',
                    ios: 'iPhone|iPad|iPod'
                };
                type = 'undefined' == $.type(type) ? '*' : type.toLowerCase();
                if ('*' == type)
                    reg = $.map(any, function(v) {
                        return v;
                    });
                else if (type in any)
                    reg.push(any[type]);

                return !!(reg.length && navigator.userAgent.match(new RegExp(reg.join('|'), 'i')));
            };
        },
        __patchJQ: function() {
            (function($, sr) {
                // debouncing function from John Hann
                // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
                var debounce = function(func, threshold, execAsap) {
                        var timeout;
                        return function debounced() {
                            var obj = this,
                                args = arguments;

                            function delayed() {
                                if (!execAsap) func.apply(obj, args);
                                timeout = null;
                            };
                            if (timeout) clearTimeout(timeout);
                            else if (execAsap) func.apply(obj, args);

                            timeout = setTimeout(delayed, threshold || 100);
                        };
                    }
                    // smartresize
                jQuery.fn[sr] = function(fn) {
                    return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
                };
            })(jQuery, 'smartresize');

            (function() {
                var scrollbarWidth = 0,
                    originalMargin, touchHandler = function(event) {
                        event.preventDefault();
                    };

                function getScrollbarWidth() {
                    if (scrollbarWidth) return scrollbarWidth;
                    var scrollDiv = document.createElement('div');
                    $.each({
                        top: '-9999px',
                        width: '50px',
                        height: '50px',
                        overflow: 'scroll',
                        position: 'absolute'
                    }, function(property, value) {
                        scrollDiv.style[property] = value;
                    });
                    $('body').append(scrollDiv);
                    scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
                    $('body')[0].removeChild(scrollDiv);
                    return scrollbarWidth;
                }
            })();
            /*
             * debouncedresize: special jQuery event that happens once after a window resize
             *
             * latest version and complete README available on Github:
             * https://github.com/louisremi/jquery-smartresize
             *
             * Copyright 2012 @louis_remi
             * Licensed under the MIT license.
             *
             * This saved you an hour of work?
             * Send me music http://www.amazon.co.uk/wishlist/HNTU0468LQON
             */
            (function($) {
                var $event = $.event,
                    $special,
                    resizeTimeout;

                $special = $event.special.debouncedresize = {
                    setup: function() {
                        $( this ).on( "resize", $special.handler );
                    },
                    teardown: function() {
                        $( this ).off( "resize", $special.handler );
                    },
                    handler: function( event, execAsap ) {
                        // Save the context
                        var context = this,
                            args = arguments,
                            dispatch = function() {
                                // set correct event type
                                event.type = "debouncedresize";
                                $event.dispatch.apply( context, args );
                            };

                        if ( resizeTimeout ) {
                            clearTimeout( resizeTimeout );
                        }

                        execAsap ?
                            dispatch() :
                            resizeTimeout = setTimeout( dispatch, $special.threshold );
                    },
                    threshold: 150
                };
            })(jQuery);
        },
        __extendHC: function() {
            // ==ClosureCompiler==
            // @compilation_level SIMPLE_OPTIMIZATIONS
            /**
             * Extension for Highcharts3 and Highstocks1.3 to add the Chart some functions:
             * legendHide() , legendShow() , legendToggle([forceState])
             */
            (function(Highcharts, UNDEFINED) {
                "use strict";
                if (!Highcharts) {
                    return;
                }
                var chartProto = Highcharts.Chart.prototype,
                    legendProto = Highcharts.Legend.prototype;
                Highcharts.extend(chartProto, {
                    /**
                     * set the visibility of the legend
                     *
                     * @param {Boolean} display Whether to show or hide the legend
                     */
                    legendSetVisibility: function(display) {

                        var chart = this,
                            legend = chart.legend,
                            legendAllItems, legendAllItem, legendAllItemLength, legendOptions = chart.options.legend,
                            scroller, extremes;

                        if (legendOptions.enabled == display) {
                            return;
                        }

                        legendOptions.enabled = display;

                        if (!display) {
                            legendProto.destroy.call(legend);

                            { // fix for ex-rendered items - so they will be re-rendered if needed
                                legendAllItems = legend.allItems;
                                if (legendAllItems) {
                                    for (legendAllItem = 0, legendAllItemLength = legendAllItems.length; legendAllItem < legendAllItemLength; ++legendAllItem) {
                                        legendAllItems[legendAllItem].legendItem = UNDEFINED;
                                    }
                                }
                            }

                            { // fix for chart.endResize-eventListener and legend.positionCheckboxes()
                                legend.group = {};
                            }
                        }

                        chartProto.render.call(chart);

                        if (!legendOptions.floating) {
                            scroller = chart.scroller;
                            if (scroller && scroller.render) { // fix scrolller // @see renderScroller() in Highcharts
                                extremes = chart.xAxis[0].getExtremes();
                                scroller.render(extremes.min, extremes.max);
                            }
                        }
                    },
                    /**
                     * hide the legend
                     */
                    legendHide: function() {
                        this.legendSetVisibility(false);
                    },
                    /**
                     * show the legend
                     */
                    legendShow: function() {
                        this.legendSetVisibility(true);
                    },
                    /**
                     * toggle the visibility of the legend
                     *
                     * @param {Boolean} [display] optional: whether to show or hide the legend
                     */
                    legendToggle: function(display) {
                        if (typeof display != "boolean") {
                            display = (this.options.legend.enabled ^ true);
                        }
                        this.legendSetVisibility(display);
                    },
                    preBind: function() {
                        this.isBound = !0;
                    }
                });
            }(Highcharts));
        }
    };
});