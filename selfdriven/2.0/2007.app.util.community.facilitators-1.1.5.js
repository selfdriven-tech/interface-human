app.add(
{
	name: 'util-community-facilitors-attributes',
	code: function (param, response)
	{	
		
		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		var elements = app.get(
		{
			scope: 'util-setup',
			context: 'structureElements'
		});

		var category = utilSetup.structures.me.categories.leadership;
		elements = _.filter(elements, function (element) {return element.category == category})

		if (response == undefined)
		{
			var fields = []

			if (elements != undefined)
			{
				fields = _.concat(fields, _.map(elements, 'alias'))
			}

			//Add project team filters | person group filters

			mydigitalstructure.cloud.search(
			{
				object: 'contact_person',
				fields: fields,
				filters:
				[],
				rows: 99999,
				callback: 'util-community-facilitors-attributes'
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
				scope: 'util-community-facilitors-attributes',
				context: 'data',
				value: data
			});

			app.vq.init();

			app.vq.add(
			[
				'<div class="card">',
					'<div class="card-header">',
						'<h2 class="float-left mt-2">Community Attributes & Skills</h2>',
						'<div class="float-right">',
							 '<button class="btn btn-default btn-outline btn-sm myds-click mt-2" data-controller="util-community-facilitors-attributes">Refresh</button>',
						'</div>',
					'</div>',
					'<div class="card-body p-4">',
						'<div class="mb-4">',
							'<div class="alert alert-info">',
								'<i class="fa fa-info-circle mr-2"></i>Based on ' + data.includedCount + ' self-reflections.',
							'</div>',
						'</div>'
			]);

			app.vq.add(
			[
				'<div class="mb-3">',
					'<label class="form-check-label mb-0" for="learner-me-edit-attributes-{{meid}}">',
	            	'<div>{{title}}</div>',
	             	'<div class="text-muted small">{{caption}}</div>',
	           	'</label>',
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
					'</div>',
				'</div>'
			]);

			//Focus based on reflection.

			var elementsMinimum = _.take(_.sortBy(elements, function (element) {return element.minvalue}), 3);

			app.vq.add(
			[
				'<div class="alert alert-info mt-3">',
					'<span class="font-weight-bold">Suggested focus based on lifting the base is:</span>',
					'<ul class="mb-0">'
			]);

			_.each(elementsMinimum, function (element)
			{
				app.vq.add(
				[
						'<li class="mt-1">',
						element.title,
						'</li>'
				]);
			});
			
			app.vq.add(
			[
					'</ul>',
			]);


			app.vq.add(
			[
				'</div>'
			]);

	      app.vq.render('#util-community-facilitors-attributes-view')	
		}
	}
});





