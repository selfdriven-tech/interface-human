/*
	{
    	title: "Util; Visuals", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
  	}
*/

app.add(
{
	name: 'util-visual-attributes-chart-show',
	code: function (param, data)
	{
		//https://gionkunz.github.io/chartist-js/api-documentation.html#chartistbar-function-bar

		var context = app._util.param.get(param, 'context', {default: 'learner-me'}).value;
        var scope = app._util.param.get(param, 'scope').value;
        var containerSelector = app._util.param.get(param, 'containerSelector').value;

        if (scope == undefined) {scope = context + '-visual'};
        if (containerSelector == undefined) {containerSelector = '#' + scope + '-attributes-view'};

		var seriesData = app.get(
		{
			scope: scope,
			context: 'attributes-as-at-reversed'
		});

		var elements = app.get(
		{
			scope: 'util-setup',
			context: 'structureElements'
		});

		var visualAttributesCategory = app.get(
		{
			scope: scope,
			context: 'category',
			valueDefault: 'general'
		});

		var category = app.whoami().mySetup.structures.me.categories[visualAttributesCategory];
		elements = _.filter(elements, function (element) {return element.category == category})

		app.set(
		{
			scope: scope,
			context: 'elements',
			value: elements
		});

		var labels = _.map(elements, 'title')

		var series = [];
		var elementData;

		//seriesData = _.reverse(seriesData)

		_.each(seriesData, function (data)
		{
			data._series = [];

			_.each(elements, function (element)
			{
				elementData = numeral(data[element.alias]).value(); 
				if (elementData == null) {elementData = 0}
				
				data._series.push(elementData);
			});

			series.push({name: app.invoke('util-date', {date: data.createddate, format: 'DD MMM YYYY'}), data: data._series});
		});

		var chartData =
		{
			labels: labels,
  			series: series
		};

		app.invoke('util-view-chart-show',
		{	
			containerSelector: containerSelector,
			chartOptions:
			{
				type: 'Bar',
				height: 460,
				axisY:
				{
					onlyInteger: true,
					showLabel: true,
    				offset: 140
				},
				axisX:
				{
					showLabel: true,
					onlyInteger: true,
					high: 100
				},
				reverseData: true,
				horizontalBars: true,
				seriesBarDistance: 10,
				chartPadding: {right: 50}
			},
			chartData: chartData,
			legend: true,
			reverseLegend: true,
			reverseLegendView: true,
			foreignObjects: true
		},
		data);
	}
});

app.add(
{
	name: 'util-visual-attributes-balance-chart-show',
	code: function (param, data)
	{
		//https://gionkunz.github.io/chartist-js/api-documentation.html#chartistbar-function-bar
        var context = app._util.param.get(param, 'context', {default: 'learner-me'}).value;
        var scope = app._util.param.get(param, 'scope').value;
        var containerSelector = app._util.param.get(param, 'containerSelector').value;

        if (scope == undefined) {scope = context + '-visual'};
        if (containerSelector == undefined) {containerSelector = '#' + scope + '-attributes-balance-view'};

		var seriesData = app.get(
		{
			scope: scope,
			context: 'myAttributes'
		});

		var elements = app.get(
		{
			scope: 'util-setup',
			context: 'structureElements'
		});

		var visualAttributesCategory = app.get(
		{
			scope: scope,
			context: 'category',
			valueDefault: 'general'
		});

		var category = app.whoami().mySetup.structures.me.categories[visualAttributesCategory];
		elements = _.filter(elements, function (element) {return element.category == category})

		app.set(
		{
			scope: scope,
			context: 'elements',
			value: elements
		});

		var labels = [];
		var series = [];
		var elementData;
		var elementsWithNoValues = [];

		_.each(elements, function (element)
		{
			elementData = numeral(seriesData[element.alias]).value();

			if (elementData != null)
			{
				labels.push(element.title);
				series.push(elementData);
			}
			else
			{
				elementsWithNoValues.push(element.title)
			}
		});

		var chartData =
		{
			labels: labels,
  			series: series
		};

		var legendText = [];

		if (elementsWithNoValues.length != 0)
		{
			legendText.push('<div class="text-center"><i class="fa fa-info-circle text-muted mr-1"></i> <span class="font-weight-bold text-muted">Attributes Not Yet Set</span>');
			legendText = _.concat(legendText, _.map(elementsWithNoValues, function (elementsWithNoValue) {return '<div>' + elementsWithNoValue + '</div>'}));
			legendText.push('</div>');
		}

		app.invoke('util-view-chart-show',
		{	
			containerSelector: containerSelector,

			chartOptions:
			{
				type: 'Pie',
				height: 600,
				labelPosition: 'outside',
				labelDirection: 'explode',
				labelOffset: 60,
				donutWidth: 80,
				donut: true,
				chartPadding: 60
			},
			chartData: chartData,
			foreignObjects: false,
			legend: false,
			legendText: _.join(legendText, ''),
			showAsPercentageValue: false
		},
		data);
	}
});

app.add(
{
	name: 'util-visual-attributes-growth-chart-show',
	code: function (param, data)
	{
		//https://gionkunz.github.io/chartist-js/api-documentation.html#chartistbar-function-bar
        var context = app._util.param.get(param, 'context', {default: 'learner-me'}).value;
        var scope = app._util.param.get(param, 'scope').value;
        var containerSelector = app._util.param.get(param, 'containerSelector').value;

        if (scope == undefined) {scope = context + '-visual'};
        if (containerSelector == undefined) {containerSelector = '#' + scope + '-attributes-growth-view'};

		var seriesData = app.get(
		{
			scope: scope,
			context: 'attributes-as-at'
		});

		var elements = app.get(
		{
			scope: 'util-setup',
			context: 'structureElements'
		});

		var visualAttributesCategory = app.get(
		{
			scope: scope,
			context: 'category',
			valueDefault: 'general'
		});

		var category = app.whoami().mySetup.structures.me.categories[visualAttributesCategory];
		elements = _.filter(elements, function (element) {return element.category == category})

		app.set(
		{
			scope: scope,
			context: 'elements',
			value: elements
		});

		var labels = _.map(elements, 'title')

		var series = [];
		var elementData;

		//seriesData = _.reverse(seriesData)

		_.each(seriesData, function (data)
		{
			data._series = [];

			_.each(elements, function (element)
			{
				elementData = numeral(data[element.alias]).value(); 
				if (elementData == null) {elementData = 0}
				
				data._series.push(elementData);
			});

			series.push({name: data.guid, caption: app.invoke('util-date', {date: data.createddate, format: 'DD MMM YYYY'}), data: data._series});
		})

		var chartData =
		{
			labels: labels,
  			series: series
		};

		var chartOptions =
		{
			type: 'Line',
			height: 600,
			chartPadding: 30,
			fullwidth: true,
			axisY:
			{
				onlyInteger: true,
				high: 100
			},
			axisX:
			{
				offset: 20
			},
			series: {}
		}

		chartOptions.series[_.first(series).name] =
		{
			showArea: true
		}

		app.invoke('util-view-chart-show',
		{	
			containerSelector: containerSelector,
			chartOptions: chartOptions,
			chartData: chartData,
			foreignObjects: true,
			legend: true,
			reverseLegend: false,
			reverseLegendView: true
		},
		data);
	}
});

app.add(
{
	name: 'util-visual-attributes-balance-radar-chart-show',
	code: function (param, data)
	{
		//https://gionkunz.github.io/chartist-js/api-documentation.html#chartistbar-function-bar
        var context = app._util.param.get(param, 'context', {default: 'learner-me'}).value;
        var scope = app._util.param.get(param, 'scope').value;
        var containerSelector = app._util.param.get(param, 'containerSelector').value;

        if (scope == undefined) {scope = context + '-visual'};
        if (containerSelector == undefined) {containerSelector = '#' + scope + '-attributes-balance-radar-view'};

		var seriesData = app.get(
		{
			scope: scope,
			context: 'attributes-as-at'
		});

		var elements = app.get(
		{
			scope: 'util-setup',
			context: 'structureElements'
		});

		var visualAttributesCategory = app.get(
		{
			scope: scope,
			context: 'category',
			valueDefault: 'general'
		});

		var category = app.whoami().mySetup.structures.me.categories[visualAttributesCategory];
		elements = _.filter(elements, function (element) {return element.category == category})

		app.set(
		{
			scope: scope,
			context: 'elements',
			value: elements
		});

		var labels = _.map(elements, 'title')

		var series = [];
		var elementData;

		//seriesData = _.reverse(seriesData)

		_.each(_.slice(seriesData, 0, 1), function (data)
		{
			data._series = [];

			_.each(elements, function (element)
			{
				elementData = numeral(data[element.alias]).value(); 
				if (elementData == null) {elementData = 0}
				
				data._series.push(elementData);
			});

			series.push(
			{
				name: data.guid,
				label: app.invoke('util-date', {date: data.createddate, format: 'DD MMM YYYY'}),
				backgroundColor: 'rgba(30, 132, 198, 0.5)',
				borderColor: '#1e84c6',
				borderWidth: 3,
				data: data._series
			});
		})

		var ctx = $(containerSelector);

		if (window.myChart != undefined)
		{
			window.myChart.destroy()
		}

		window.myChart = new Chart(ctx,
		{
			type: 'radar',
			data:
			{
				labels: labels,
				datasets: series
			},
			options:
			{
				response: true,
				plugins:
				{
					legend: {position: 'bottom'},
					title: {display: false}
				},
				layout:
				{
            	padding: 0
        		},
        		scales:
        		{
      			r:
      			{
      				min: 0,
      				max: 100,
      				pointLabels:
      				{
      					font:
      					{
                        size: 14,
                        weight: 600
                    }
                  }
      			}
      		}
			}
		});
	}
});

// WELL-BEING VISUALS

app.add(
{
	name: 'util-visual-wellbeing-how-going-visual-by-day-chart-show',
	code: function (param, data)
	{
		//https://gionkunz.github.io/chartist-js/api-documentation.html#chartistbar-function-bar
		var context = app._util.param.get(param, 'context', {default: 'learner-wellbeing-how-going'}).value;
		var scope = app._util.param.get(param, 'scope').value;
		var containerSelector = app._util.param.get(param, 'containerSelector').value;

		if (scope == undefined) {scope = context + '-visual'};
		if (containerSelector == undefined) {containerSelector = '#' + scope + '-by-day-view'};

		var seriesData = app.get(
		{
			scope: 'learner-wellbeing-how-going-visual',
			context: 'howgoings',
		});

		var labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

		var series = [];
		var _seriesData = [];

		_.each(labels, function (label)
		{
			var _data = _.find(seriesData, function (data) {return data.dayOfWeek == label});
			var data = 0;
			if (_data != undefined)
			{
				data = numeral(_data['_howgoing']).value();
			}

			_seriesData.push(data);
		})

		series.push({name: 'how-going', caption: 'How Going', data: _seriesData});

		var chartData =
		{
			labels: labels,
			series: series
		};

		var chartOptions =
		{
			type: 'Line',
			height: 400,
			chartPadding: 30,
			fullwidth: true,
			axisY:
			{
				onlyInteger: true,
				high: 100
			},
			axisX:
			{
				offset: 20
			},
			series: {}
		}

		chartOptions.series['how-going'] =
		{
			showArea: true
		}

		app.invoke('util-view-chart-show',
		{	
			containerSelector: containerSelector,
			chartOptions: chartOptions,
			chartData: chartData,
			foreignObjects: true,
			legend: true,
			reverseLegend: false,
			reverseLegendView: true
		},
		data);
	}
});