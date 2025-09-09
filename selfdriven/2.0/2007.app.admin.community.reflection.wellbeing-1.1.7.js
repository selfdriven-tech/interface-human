app.add(
{
	name: 'admin-community-reflection-wellbeing-how-going',
	code: function (param, response)
	{	
		var elements = [{alias: '_howgoing' }];

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'contact_person',
				fields: _.map(elements, 'alias'),
				filters:
				[],
				rows: 99999,
				callback: 'admin-community-reflection-wellbeing-how-going'
			});
		}
		else
		{
			var data =
			{
				source: response.data.rows,
				count: response.data.rows.length,
				includedCount: 0,
				totals: {},
				average: {},
				minimum: {},
				maximum: {}
			}

			if (data.count != 0)
			{
				_.each(elements, function (element)
				{
					data.totals[element.alias] = 0;
					data.average[element.alias] = 0;
					data.minimum[element.alias] = 100;
					data.maximum[element.alias] = 0;
				});

				_.each(response.data.rows, function (row)
				{
					row.include = false;

					_.each(elements, function (element)
					{
						if (!row.include)
						{
							row.include = (row[element.alias] != '')
						}
					});

					if (row.include)
					{
						data.includedCount = data.includedCount + 1;

						_.each(elements, function (element)
						{
							if (row[element.alias] == '') {row[element.alias] = '0'}
							
							if (numeral(row[element.alias]).value() > data.maximum[element.alias])
							{
								data.maximum[element.alias] = numeral(row[element.alias]).value();
							}

							if (numeral(row[element.alias]).value() < data.minimum[element.alias])
							{
								data.minimum[element.alias] = numeral(row[element.alias]).value();
							}

							data.totals[element.alias] = data.totals[element.alias] + numeral(row[element.alias]).value();
						});
					}
				});

				_.each(elements, function (element)
				{
					data.average[element.alias] = numeral(data.totals[element.alias] / data.includedCount).format('0');
				});
			}

			app.set(
			{
				scope: 'admin-community-reflection-wellbeing-how-going',
				context: 'data',
				value: data
			});

			app.vq.init();

			app.vq.add(
			[
				'<div class="mb-4">',
					'<div class="progress progress-small">',
						'<div class="progress-bar" style="width: {{minvalue}}%; background-color: #e9ecef;" role="progressbar" aria-valuenow="{{minvalue}}" aria-valuemin="0" aria-valuemax="100"></div>',
		  				'<div class="progress-bar progress" style="width: {{value}}%;" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="100"></div>',
					'</div>',
				'</div>'
			],
			{
				type: 'template'
			});

			_.each(elements, function (element)
			{
				//element.value = data.average[element.alias] || 0;
				element.minvalue = data.minimum[element.alias] || 0;
				element.value = (data.maximum[element.alias] - data.minimum[element.alias]) || 0;

				app.vq.add({useTemplate: true}, element)
			});

	      	app.vq.add(
			[
				'<div class="alert alert-info">',
					'<i class="fa fa-info-circle mr-2"></i>Based on ' + data.includedCount + ' community members.',
				'</div>'
			]);

	     	//app.vq.render('#admin-community-reflection-wellbeing-how-going-view');
			app.invoke('admin-community-reflection-wellbeing-how-going-chart-show', param)
		}
	}
});

app.add(
	{
		name: 'admin-community-reflection-wellbeing-how-going-chart-show',
		code: function (param, data)
		{
			//https://gionkunz.github.io/chartist-js/api-documentation.html
			var context = app._util.param.get(param, 'context', {default: 'learner-me'}).value;
			var scope = app._util.param.get(param, 'scope').value;
			var containerSelector = '#admin-community-reflection-wellbeing-how-going-view';
	
			var data = app.get(
			{
				scope: 'admin-community-reflection-wellbeing-how-going',
				context: 'data'
			});

			var sourceData = _.filter(data.source, function (_data) {return _data.include});
			_.each(sourceData, function(_sourceData) {_sourceData.value = numeral(_sourceData._howgoing).value()})

			var range = _.range(0, 110, 10);

			var seriesData = [];
			var max = 0;

			_.each(range, function (value)
			{
				var data = _.filter(sourceData, function (_sourceData) {return _sourceData.value == value});
				seriesData.push(data.length);
				if (data.length > max) {max == data.length}
			});

			var labels = [];
			
			_.each(range, function (_range, r)
			{
				if (r == 0)
				{
					//labels.push('Could be better');
					labels.push('');
				}
				else if (r == range.length - 1)
				{
					//labels.push('Going OK');
					labels.push('');
				}
				else
				{
					labels.push('');
				}
			});
			
			var series =
			[
				{
					name: 'How Going',
					data: seriesData
				}
			];
			
			var chartData =
			{
				_labels: labels,
				series: series
			};
	
			var chartOptions =
			{
				type: 'Line',
				height: 400,
				chartPadding: 10,
				fullwidth: true,
				axisY:
				{
					onlyInteger: true,
					high: max
				},
				axisX:
				{
					offset: 16
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
				legend: false,
				reverseLegend: false,
				reverseLegendView: false
			},
			data);

			app.show('#admin-community-reflection-wellbeing-how-going-info-view',
				['<div class="mt-4 text-center text-muted">',
					'<i class="fa fa-info-circle mr-2"></i>Based on ' + sourceData.length + ' community members.',
				'</div>']);
		}
	});