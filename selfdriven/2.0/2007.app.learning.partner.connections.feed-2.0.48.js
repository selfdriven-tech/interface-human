/*
	{
    	title: "Learning Partner; Connections; Feed", 	
    	design: "https://www.selfdriven.foundation/design"
  	}
*/

app.add(
{
	name: 'learning-partner-connections-feed',
	code: function (param, response)
	{		
		app.invoke('learning-partner-connections-feed-dashboard')
	}
});

app.add(
{
	name: 'learning-partner-connections-feed-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-connections-feed-dashboard',
			valueDefault: {}
		});

		var filters =
		[
			{
				field: 'modifieduser',
				comparison: 'NOT_EQUAL_TO',
				value: app.whoami().thisInstanceOfMe.user.id
			},
			{
				field: 'projecttask.project.id',
				comparison: 'IS_NOT_NULL'
			},
			{
				field: 'projecttask.project.restrictedtoteam',
				value: 'Y'
			},
			{
				field: 'projecttask.taskbyuser.contactperson.guid',
				comparison: 'IS_NOT_NULL'
			}
		];

		if (response == undefined)
		{
			if (!_.isEmpty(data.search))
			{
				if (!_.isEmpty(data.search))
				{
					filters = _.concat(filters,
					[
						{	
							field: 'description',
							comparison: 'TEXT_IS_LIKE',
							value: data.search
						}
					]);
				}
			}

			mydigitalstructure.cloud.search(
			{
				object: 'project_task',
				fields:
				[
					'reference',
					'title',
					'guid',
					'projecttask.taskbyuser.contactperson.firstname',
					'projecttask.taskbyuser.contactperson.surname',
					'projecttask.taskbyuser.contactperson.guid',
					'modifieddate',
					'percentagecomplete',
					'statustext',
					'startdate',
					'projecttask.project.guid'
				],
				filters: filters,
				sorts:
				[
					{
						field: 'modifieddate',
						direction: 'desc'
					}
				],
				callback: 'learning-partner-connections-feed-dashboard'
			})
		}
		else
		{
			var feedView = app.vq.init({queue: 'learning-partner-connections-feed-dashboard'});

			if (response.data.rows.length == 0)
			{
				feedView.add(
				[
					'<div class="text-muted text-center">',
						'There are is nothing in your what\'s up feed.',
					'</div>'
				]);
			}
			else 
			{
				feedView.add(
				[
					'<div class="list-group list-group-flush list-group-activity my-n3">'
				]);

				feedView.template(
				[
					'<div class="list-group-item pt-2">',
						'<div class="row">',
							'<div class="col-auto">',
								'<button class="btn btn-rounded-circle btn-light">',
									'<a href="#learning-partner-profile/{{projecttask.taskbyuser.contactperson.guid}}">{{initials}}</a>',
								'</button>',
							'</div>',
							'<div class="col ms-n2">',
								'<div class="pl-1 pb-3">',
									'<h5 class="mb-1">',
										'{{projecttask.taskbyuser.contactperson.firstname}} {{projecttask.taskbyuser.contactperson.surname}}',
                        			'</h5>',
									'<small class="text-muted">{{modifieddate}}</small>',
									'<div class="small text-gray-700 mb-0">',
										'{{title}}',
                        			'</div>',
									'<div class="small text-gray-700 mb-0">',
										'{{percentagecomplete}}%',
                        			'</div>',
								
								'</div>',
							'</div>',
							'<div class="col-auto">',
									'<button type="button" class="btn btn-sm btn-white myds-navigate"',
										' data-controller="learning-partner-project-summary"',
										' data-context="{{projecttask.project.guid}}">',
											'Open Project',
										'</button>',
							'</div>',
						'</div>',
					'</div>'
				]);

				_.each(response.data.rows, function (row)
				{
					row.initials = _.first(row['projecttask.taskbyuser.contactperson.firstname']) +
										_.first(row['projecttask.taskbyuser.contactperson.surname']);
					feedView.add({useTemplate: true,}, row)
				});

				feedView.add('</div>')
			}

			feedView.render('#learning-partner-connections-feed-dashboard-view')
		}
	}
});

