/**
* @preserve CanvasJS jQuery Charting Plugin - https://canvasjs.com/ 
* Copyright 2021 fenopix

*  --------------------- License Information --------------------
* CanvasJS is a commercial product which requires purchase of license. Without a commercial license you can use it for evaluation purposes for upto 30 days. Please refer to the following link for further details.
*     https://canvasjs.com/license/
* 
*/

(function ($, window, document, undefined) {

	$.fn.CanvasJSChart = function (options) {

		if (options) {

			var $el = this.first();
			var container = this[0];
			var chart = new CanvasJS.Chart(container, options);

			$el.children(".canvasjs-chart-container").data("canvasjsChartRef", chart);

			chart.render();

			return this;

		} else {

			return this.first().children(".canvasjs-chart-container").data("canvasjsChartRef");

		}
	}

}(jQuery, window, document));