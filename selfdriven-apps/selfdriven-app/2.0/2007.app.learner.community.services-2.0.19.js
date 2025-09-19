/*
	{
    	title: "Learner; Community; Services", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
  	}
*/

app.add(
{
	name: 'learner-community-services',
	code: function (param, response)
	{
		app.invoke('learner-community-services-dashboard');
	}
});

app.add(
{
	name: 'learner-community-services-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learner-community-services-dashboard',
			valueDefault: {}
		});

		if (response == undefined)
		{
			var filters =
			[
				{
					field: 'category',
					value: app.whoami().mySetup.productCategories.communityService
				}
			];

			if (!_.isEmpty(data.search))
			{
				filters = _.concat(filters,
				[
					{
						name: '('
					},
					{	
						field: 'title',
						comparison: 'TEXT_IS_LIKE',
						value: data.search
					},
					{
						name: 'or'
					},
					{	
						field: 'description',
						comparison: 'TEXT_IS_LIKE',
						value: data.search
					},
					{
						name: ')'
					}
				]);
			}

			mydigitalstructure.cloud.search(
			{
				object: 'product',
				fields:
				[
					'title',
					'status',
					'statustext',
					'guid',
					'description'
				],
				filters: filters,
				rows: 99999,
				sorts:
				[
					{
						field: 'title',
						direction: 'asc'
					}
				],
				callback: 'learner-community-services-dashboard'
			});
		}
		else
		{
			
			var communityServicesDashboardView = app.vq.init({queue: 'learner-community-services-dashboard'})
			if (response.data.rows.length == 0)
			{
				communityServicesDashboardView.add(
				[
					'<div class="text-muted text-center">',
						'There are no community services that match this search.',
					'</div>'
				]);
			}
			else 
			{
				communityServicesDashboardView.template(
				[
					'<div class="col-sm-4 mb-4 mt-1">',
						'<div class="card">',
							'<div class="card-header bg-light text-dark">',
								'<h2 class="my-0 float-left mt-1 " ',
										'data-context="{{guid}}">',
									'{{title}}',
								'</h2>',
							'</div>',
							'<div class="card-body">',
								'<div class="mb-3 fw-bold">{{statustext}}</div>',
								'<div class="mb-3 text-secondary">{{description}}</div>',
								'<div>',
								'<button class="btn btn-primary btn-sm myds-navigate disabled" data-scope="earner-tokens-use-community-services-spend" data-context="{{guid}}">',
									'Spend',
								'</button>',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);

				communityServicesDashboardView.add(
				[
					'<div class="row">'
				]);

				_.each(response.data.rows, function (row)
				{
					communityServicesDashboardView.add({useTemplate: true}, row)
				});

				communityServicesDashboardView.add('</div>');
			}

			communityServicesDashboardView.render('#learner-community-services-dashboard-view');
		}
	}
});

app.add(
{
	name: 'learner-community-service-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'learner-community-service-summary',
			context: 'id'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'learner-community-services'});
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'product',
					fields: 
					[
						'title',
						'createddate', 'modifieddate',
						'guid',
						'description'
					],
					filters:
					[
						{
							field: 'guid',
							value: guid
						}
					],
					set: 
					{
						scope: 'learner-community-services',
						context: 'all'
					},
					callback: 'learner-community-service-summary'
				});
			}
			else
			{
				if (response.status == 'OK')
				{
					if (response.data.rows.length == 0)
					{}
					else
					{
						var data = _.first(response.data.rows);

						//app.invoke('learning-partner-connections-tokens-dashboard-transactions-format', data);

						app.set(
						{
							scope: 'learner-community-service-summary',
							context: 'dataContext',
							value: data
						});

						app.invoke('util-attachments-initialise',
						{
							context: 'learner-community-service-summary',
							object: app.whoami().mySetup.objects.action,
							objectContext: data.id,
							showTypes: false
						});

						app.view.refresh(
						{
							scope: 'learner-community-service-summary',
							selector: '#learner-community-service-summary',
							data: data,
							collapse: {contexts: ['attachments']}
						});
					}
				}
			}
		}
	}	
});
