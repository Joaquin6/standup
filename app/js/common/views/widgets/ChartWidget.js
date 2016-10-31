/**
 * @fileOverview File description goes here.
 * @author UX Team <sd-ux@itg.com>
 * @module ChartWidget
 */
define(['jquery', 'underscore', 'marionette', 'highchartssrc', 'helpers/events', 'views/widgets/LoadingWidget'], function($, _, Marionette, Highcharts, Events, LoadingWidget) {
	return Marionette.BaseView.extend({
		name : "ChartWidget",
		__chartHandle : null,
		__isSparkline : false,
		__simpleView : false,
		__labelThreshold : 10,
		__loadingWidget : null,
		__config : null,
		overrideInit: function() {
			// This is how a module is loaded. Pass in Highcharts as a parameter.
			require('highcharts/modules/no-data-to-display')(Highcharts);
			Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function(color) {
				return Highcharts.Color(color).setOpacity(0.8).get('rgba');
			});
		},
		overrideDispose : function() {
			this.__destroy();
		},
		overrideOnResize : function(force) {
			if (this.__chartHandle == null)
				return;
			if (!$(this.el).is(':visible'))
				return;
			var width = this.parent('getWidth');
			var height = this.parent('getHeight');
			if (width == 0 || height == 0)
				return;
			var sizeChangeDetected = (this.__chartHandle.chartWidth != width) || (this.__chartHandle.chartHeight != height);
			if ((!sizeChangeDetected) && (force == undefined))
				return;
			this.__handleResponsive(width, height);
			if (sizeChangeDetected) {
				this.__chartHandle.setSize(width, height, {
					easing : "linear",
					duration : 250
				});
			}
			this.toggleLegend(true);
		},
		getControl : function() {
			return this.__chartHandle;
		},
		export : function() {
			this.__chartHandle.exportChart({
				type : 'application/pdf',
				filename : 'my-pdf'
			});
		},
		showLoading : function(show) {
			if (show) {
				if (this.__loadingWidget == null)
					this.__loadingWidget = LoadingWidget.show($(this.el));
			} else {
				LoadingWidget.hide(this.__loadingWidget);
				this.__loadingWidget = null;
			}
		},
		toggleTicks : function(enabled) {
			if (this.__chartHandle == null)
				return;
			// sparkline is a very simple implementation of the chart
			if (this.__isSparkline) {
				var options = this.__chartHandle.xAxis[0].options;
				if (options.labels.enabled != enabled) {
					options.labels.enabled = enabled;
					this.__chartHandle.xAxis[0].update(options, false);
					this.__chartHandle.tooltip.options.enabled = enabled;
					this.__simpleView = true;
					return;
				}
			}
			var minorTickLength = 0;
			var tickLength = 0;
			if (enabled) {
				minorTickLength = 2;
				tickLength = 5;
				this.__simpleView = false;
			} else
				this.__simpleView = true;

			var options = this.__chartHandle.xAxis[0].options;
			if (options.labels.enabled != enabled) {
				options.labels.enabled = enabled;
				options.minorTickLength = minorTickLength;
				options.tickLength = tickLength;
				this.__chartHandle.xAxis[0].update(options, false);

				options = this.__chartHandle.yAxis[0].options;
				options.labels.enabled = enabled;
				options.minorTickLength = minorTickLength;
				options.tickLength = tickLength;
				this.__chartHandle.yAxis[0].update(options, false);

				options = this.__chartHandle.tooltip.options;
				options.enabled = enabled;
			}
		},
		showTitle : function(show) {
			if (this.__chartHandle == null)
				return;
			var title = "";
			if (show)
				title = this.__config.title.text;
			this.__chartHandle.setTitle({
				text : title,
				style : {
					color : '#666666',
					fontSize : '12px',
					fontWeight : 'normal'
				}
			});
		},
		toggleLegend : function(close) {
			if (this.__chartHandle == null)
				return;
			var legend = this.__chartHandle.legend;
			if (legend == undefined)
				return;
			if (this.__isDonut()) {// Donut does not have legends but Data labels
				var opt = this.__chartHandle.series[0].options;
				opt.dataLabels.enabled = !opt.dataLabels.enabled;
				if (close != undefined)
					opt.dataLabels.enabled = !close;
				this.__chartHandle.series[0].update(opt);
				return;
			}
			if (legend.display || close)
				this.__chartHandle.legendHide();
			else
				this.__chartHandle.legendShow();
		},
		toggleLegendItem : function(item) {
			if (this.__chartHandle == null)
				return;
			// iterate all series and hide any that is not item (and show this one)
			var series = this.__chartHandle.series;
			for (var i = 0; i < series.length; i++) {
				if (series[i].name == item)
					series[i].show();
				else
					series[i].hide();
			}
		},
		clear : function(redraw) {
			if (this.__chartHandle == null || this.__chartHandle.series == undefined)
				return;
			for (var i = 0; i < this.__chartHandle.series.length; i++)
				this.__chartHandle.series[i].setData(null, redraw);
		},
		isBound : function() {
			return this.__chartHandle.hasData();
		},
		bind : function(series) {
			this.__chartHandle.preBind();
			if (series == undefined) {
				this.clear(true);
				this.__chartHandle.hideNoData();
			} else if (series == null) {
				this.showLoading(false);
				this.clear(true);
			} else if (series.reload) {
				this.__chartHandle.hideNoData();
				this.toggleLegend(true);
			} else {
				this.showLoading(false);
				this.toggleLegend(true);
				if (series != null) {
					this.clear(true);
					this.__setCategories(series);
					if (this.__chartHandle.series == undefined)
						return;
					if (this.__chartHandle.series.length == 0) {
						var colors = this.__getColorArray();
						for (var i = 0; i < series.length; i++) {
							var seriesoption = {
								name : series[i].name,
								color : {
									linearGradient : {
										x1 : 0,
										y1 : 0,
										x2 : 0,
										y2 : 1
									},
									stops : [[0, colors[i]], [1, colors[i]]]
								},
								data : series[i].data,
								borderWidth : 0,
								pointPadding : -0.05
							};
							this.__chartHandle.addSeries(seriesoption, false);
							this.__queryHideLegendSeries(this.__chartHandle.series[i], series[i]);
						}
						this.__chartHandle.redraw();
					} else {
						for (var i = 0; i < series.length; i++) {
							this.__chartHandle.series[i].setData(series[i].data, false);
							this.__queryHideLegendSeries(this.__chartHandle.series[i], series[i]);
						}
						this.__chartHandle.redraw();
					}
				}
				// inform any who is interested that we just rendered
				if (this.options && this.options.onRendered != undefined) {
					var that = this;
					// since we don't know exactly when highcharts will render (redraw event from them fires too many times) - we'll just do poor mans and wait 1 sec
					setTimeout(function() {
						that.options.onRendered();
					}, 1000);
				}
				this.overrideOnResize(true);
			}
			if (!this.isBound())
				this.__chartHandle.showNoData();
		},
		overrideRender : function() {
			var that = this;
			if (this.options != undefined) {
				if (this.options.sparkline)
					this.__isSparkline = this.options.sparkline;
				if (this.options.labelthreshold != undefined)
					this.__labelThreshold = this.options.labelthreshold;
			}
			this.__config = this.__getConfigOptions();
			this.__chartHandle = new Highcharts.Chart(this.__config);
			this.toggleLegend(true);
		},
		__destroy: function() {
			if (this.__chartHandle != null)
				this.__chartHandle.destroy();
		},
		__getConfigOptions : function() {
			var chartConfig = this.__getDefaultConfig();
			if (!this.options.configure)
				return chartConfig;
			this.options.configure(chartConfig);
			return chartConfig;
		},
		__getDefaultConfig : function() {
			var that = this;
			var options = {
				chart : {
					alignTicks : true,
					animation : true,
					backgroundColor : 'rgba(255, 255, 255, 0.9)',
					borderColor : '#4572A7',
					events : {
						selection : function(event) {
							if (event.xAxis) {
								that.__chartHandle.isZoomed = true;
							} else {
								that.__chartHandle.isZoomed = false;
							}
						}
					},
					reflow : true,
					renderTo : $(this.el).attr('id'),
					resetZoomButton : {
						position : {
							align : 'right',
							verticalAlign : 'top',
							x : 5,
							y : 10
						}
					},
					type : 'line',
					width : this.parent('getWidth')
				},
				credits : {
					enabled : false
				},
				legend : {
					enabled : true,
					align : 'right',
					layout : 'vertical',
					verticalAlign : 'top',
					x : 0,
					y : 0,
					floating : true,
					backgroundColor : '#ffffff'
				},
				navigation : {
					buttonOptions : {
						enabled : false
					}
				},
				loading : {
					hideDuration : 100,
					labelStyle : {
						fontWeight : 'bold',
						fontSize : '0',
						top : '50%',
						left : '50%',
						backgroundImage : 'url("../images/loadingAnimation.gif")',
						backgroundColor : 'rgba(255, 255, 255, 0)',
						display : 'block',
						width : '35px',
						height : '35px'
					},
					showDuration : 100,
					style : {
						backgroundColor : '#ffffff'
					}
				},
				title : {
					text : ''
				},
				subtitle : {
					text : ''
				},
				xAxis : {
					type : 'datetime',
					endOnTick : true,
					showFirstLabel : true,
					showLastLabel : true,
					startOnTick : false,
					endOnTick : false,
					minPadding : 0,
					labels : {
						rotation : 0,
						style : {
							color : '#6a6a6a',
							fontSize : '10px',
							fontWeight : 'normal'
						},
						//step : 1,
						enabled : true,
						formatter : function() {
							var max = 10;
							var label = this.value;
							if ( typeof this.value != "string")
								label = Highcharts.dateFormat('%H:%M', this.value);
							return label;
						}
					},
					gridLineWidth : 0,
					gridLineColor : '#c8c8c8',
					lineColor : '#999999',
					tickColor : '#999999',
					lineWidth : this.__isSparkline ? 0 : 1,
					tickLength : this.__isSparkline ? 0 : 1
				},
				yAxis : {
					labels : {
						align : 'right',
						style : {
							color : '#585858',
							fontSize : '10px',
							fontWeight : 'normal'
						},
						enabled : this.__isSparkline ? false : true
					},
					title : {
						text : null
					},
					gridLineWidth : this.__isSparkline ? 0 : 1,
					lineWidth : this.__isSparkline ? 0 : 1,
					tickWidth : this.__isSparkline ? 0 : 1,
					gridLineColor : '#c8c8c8',
					lineColor : '#999999',
					tickColor : '#999999'
				},
				tooltip : {
					followPointer : true,
					hideDelay : '0',
					crosshairs : false,
					borderRadius : '0',
					enabled : true,
					shared : true,
					backgroundColor : '#ffffff',
					borderColor : '#666666',
					style : {
						color : '#666666'
					},
					formatter : function() {
						if (this.x) {
							var x = this.x;
							var y = this.y;
							return '<small><b>' + x + '</b></small>: ' + '<b>' + Highcharts.numberFormat(y, 0, '.', ',') + '</b>';
						} else if (this.percentage) {
							var x = Highcharts.numberFormat(this.percentage, 0, '.', ',') + '%';
							var y = this.y;
							var name = this.point.name;
							return '<small><b>' + name + '</b></small>: ' + '<b>' + x + '</b><br/>' + '<small><b>total</b></small>: ' + y;
						}
						return null;
					}
				},
				plotOptions : {
					column : {
						borderWidth : 1,
						borderColor : '#dedede',
						grouping : false,
						shadow : false,
						borderColor : 'none',
						dataLabels : {
							enabled : this.__isSparkline ? true : false
						}
					},
					bar : {
						dataLabels : {
							enabled : this.__isSparkline ? true : false,
							formatter : function() {
								var val = this.point.y;
								if (this.point.isnegative)
									val = -val;
								if ((that.__labelthreshold == 0) || (this.series.data.length <= that.__labelthreshold))
									return "" + Highcharts.numberFormat(val, 0, '.', ',');
								if ((this.point.x == 0) || (this.point.x == (this.series.data.length - 1)))
									return "" + Highcharts.numberFormat(val, 0, '.', ',');
								return null;
							}
						}
					},
					pie : {
						allowPointSelect: true,
						color : '#6a6a6a',
						dataLabels : {
							enabled : false,
							distance : -30
						},
						shadow : false,
						point : {
							events : {
								legendItemClick : function() {
									userClickedLegend = true;
								}
							}
						}
					},
					series : [{
						dataLabels : {
							formatter : function() {
								if (this.point.y < labelthreshold)
									return null;
								return this.point.name;
							}
						},
						events : {
							click : function(e) {
								if (that.options.onMarkerClick != undefined) {
									that.options.onMarkerClick(this, e.point);
								}
							},
							legendItemClick : function() {
								if (that.options.legendItemClick != undefined) {
									that.options.legendItemClick(that.__chartHandle, this.name);
								}
							}
						}
					}]
				},
				series : [{
					animation : true
				}]
			};
			return options;
		},
		__setCategories : function(series) {
			// typically the x-axis for numerical values will be used as series[x,y] - however if series[x] is a string - then we need to add a specific x-axis category
			if (this.__chartHandle.xAxis == undefined || series[0] == undefined)
				return;
			var categories = [];
			for (var i = 0; i < series.length; i++) {
				if (series[i].data[0] instanceof Array) {
					if ( typeof series[i].data[0][0] == 'string') {
						for (var j = 0; j < series[i].data.length; j++) {
							categories.push(series[i].data[j][0]);
						}
						this.__chartHandle.xAxis[0].setCategories(categories);
					}
					// i.e. for numeric - we let highcharts autostep it
					this.__chartHandle.xAxis[0].options.labels.step = 1;
					return;
				} else {
					for (var j = 0; j < series[i].data.length; j++) {
						categories.push(series[i].data[j].name);
					}
					if (categories.length == 0)
						continue;
					if (categories[0] == undefined)
						return;
					this.__chartHandle.xAxis[0].setCategories(categories);
					if (categories.length <= this.__labelThreshold) {
						this.__chartHandle.xAxis[0].options.labels.step = 1;
					}
				}
			}
		},
		__getColorArray : function() {
			var utilColors = Utility.getColorArray();
			var colors = [];
			for (var i = 0; i < utilColors.green.length; i++) {
				colors.push(utilColors.blue[i]);
				colors.push(utilColors.magenta[i]);
				colors.push(utilColors.grey[i]);
				colors.push(utilColors.green[i]);
				colors.push(utilColors.orange[i]);
				colors.push(utilColors.yellow[i]);
			}
			return colors;
		},
		__handleResponsive : function(width, height) {
			var responsiveWidth = 200;
			var responsiveHeight = 150;
			if (this.options && this.options.responsive) {
				if (this.options.responsive.width)
					responsiveWidth = this.options.responsive.width;
				if (this.options.responsive.height)
					responsiveWidth = this.options.responsive.height;
			}
			if ((width < responsiveWidth) || (height < responsiveHeight)) {
				this.showTitle(false);
				this.toggleTicks(false);
			} else {
				this.showTitle(true);
				this.toggleTicks(true);
			}
		},
		__isDonut : function() {
			if (this.__chartHandle == null)
				return;
			var handleOptions = this.__chartHandle.options;
			if (handleOptions.chart.type == 'pie') {
				var innerSizeCircle = handleOptions.plotOptions.pie.innerSize;
				if (innerSizeCircle && !isNaN(parseInt(innerSizeCircle)))
					return true;
			}
			return false;
		},
		__queryHideLegendSeries : function(chartseries, dataseries) {
			if (this.__chartHandle == null)
				return;
			// if no data - then hide the legend
			if (dataseries == null || dataseries.data == undefined || dataseries.data.length == 0 || dataseries.disabled) {
				chartseries.options.showInLegend = false;
				chartseries.legendItem = null;
				this.__chartHandle.legend.destroyItem(chartseries);
				if (this.__chartHandle.legend.display)
					this.__chartHandle.legend.render();
			}
		}
	});
});
