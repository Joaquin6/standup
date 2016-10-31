define(['jquery', 'underscore', 'marionette', 'moment', 'helpers/events', 'helpers/utility', 'views/widgets/ChartWidget', 'views/widgets/RenderManWidget', 'statistics/StatisticsChartsTemplate.html'], function($, _, Marionette, Moment, Events, Utility, ChartWidget, RenderManWidget, Template) {
	return Marionette.BaseView.extend({
		__template : null,
		__mangleId : null,
		id: "StatisticsChartsView",
		className: "ui segment",
		template: false,
		views: [{
			el: '#BarChartColumn',
			definition : ChartWidget,
			options: {
				configure: function(widget) {
					widget.chart.type = 'bar';
					widget.chart.zoomType = 'x';
					widget.yAxis.min = 4;
					widget.yAxis.labels.overflow = "justify";
				}
			}
		}, {
			el: '#PieChartColumn',
			definition : ChartWidget,
			options: {
				configure: function(widget) {
					widget.chart.type = 'pie';
				}
			}
		}],
		overrideConstructor : function() {
			// since multiple views may load this up - let's mangle the ids (DOM can't have same id)
			this.__mangleIds();
		},
		overrideGetTemplate : function() {
			return this.__template;
		},
		onDestroy: function() {
			this.model.dispose();
		},
		onShow: function() {
			var metricsDate = this.model.get('metricsDate');
			RenderManWidget.queue(this.__onQueuedTitleRender, this, metricsDate);
			var data = this.model.get('randomSeries');
			RenderManWidget.queue(this.__onQueuedChartRender, this, data);
		},
		__onQueuedTitleRender : function(metricsDate) {
			var headerId = "ChartTitleColumn" + this.__mangleId;
			var header = this.$el.find("#" + headerId);
			header.find(".sub.header").text(metricsDate);
		},
		__onQueuedChartRender : function(data) {
			var chart = this.views[0].getContext();
			chart.bind(data);
			chart = this.views[1].getContext();
			chart.bind(data);
		},
		__getId : function(id) {
			if (this.__mangleId == null)
				this.__mangleId = Utility.getUniqueId();
			return '#' + id + this.__mangleId;
		},
		__mangleIds : function() {
			// no need to do this - if one and only one view of this type....
			var that = this;
			this.views[0].el = this.__getId('BarChartColumn');
			this.views[1].el = this.__getId('PieChartColumn');
			this.__template = $.parseHTML(Template);
			var elem = $(this.__template);
			$(elem).find("[id]").add(elem).each(function() {
				if ((this.id != "") && (this.id != undefined))
					this.id = this.id + that.__mangleId;
			});
		}
	});
});