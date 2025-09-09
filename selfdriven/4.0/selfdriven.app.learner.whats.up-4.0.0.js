/*
	{
    	title: "Learner WHAT'S UP"
  	}
*/

app.add(
{
	name: 'learner-whats-up',
	code: function (param, response)
	{		
		var uriContext = app._util.param.get(param, 'uriContext').value;
		var id = app._util.param.get(param, 'id').value;

		/*if (id == 'learner-whats-up-updates')
		{
			app.invoke('util-view-tab-show', '#learner-whats-up-updates');
			uriContext = 'learner-whats-up-updates';
		}
		
		if (uriContext == 'learner-feed-level-up-profile')
		{
			app.invoke('learner-feed-dashboard-level-up-profile');
		}
		else if (uriContext == 'learner-feed-projects')
		{
			app.invoke('learner-feed-dashboard');
		}
		else
		{
			app.invoke('learner-feed-dashboard-activity');
		}*/

		app.invoke('learner-whats-up-all');
	}
});

app.add(
{
	name: 'learner-whats-up-all',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learner-whats-up-all',
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
				field: 'projecttask.taskbyuser.contactperson',
				comparison: 'EQUAL_TO',
				value: app.whoami().thisInstanceOfMe.user.contactperson
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

			entityos.cloud.search(
			{
				object: 'project_task',
				fields:
				[
					'reference',
					'title',
					'guid',
					'projecttask.modifieduser.contactperson.firstname',
					'projecttask.modifieduser.contactperson.surname',
					'projecttask.modifieduser.contactperson.guid',
					'modifieddate',
					'modifiedusertext',
					'percentagecomplete',
					'statustext',
					'startdate',
					'projecttask.project.guid',
					'project'
				],
				filters: filters,
				sorts:
				[
					{
						field: 'modifieddate',
						direction: 'desc'
					}
				],
				callback: 'learner-whats-up-all'
			})
		}
		else
		{
			let view = app.vq.init({queue: 'learner-whats-up-all'});

			if (response.data.rows.length == 0)
			{
				view.add(
				[
					'<div class="text-muted text-center">',
						'Nothing to show.',
					'</div>'
				]);
			}
			else 
			{
				view.add(
				[
					'<div class="list-group list-group-flush list-group-activity my-n3">'
				]);

				view.template(
				[
					'<div class="list-group-item pt-2">',
						'<div class="row">',
							'<div class="col-auto">',
								'<button class="btn btn-rounded-circle btn-light">',
									'<a href="#learner-profile/{{projecttask.taskbyuser.contactperson.guid}}">{{initials}}</a>',
								'</button>',
							'</div>',
							'<div class="col ms-n2">',
								'<div class="pl-1 pb-3">',
									'<div class="mb-1 font-weight-bold">',
										'{{title}}',
                        			'</div>',
									'<div class="mb-0 text-secondary"',
									 	' data-controller="learner-task-summary"',
										' data-context="{{guid}}"',
										'>',
										'{{name}}',
                        			'</div>',
									'<div class="d-none small text-secondary mb-0">',
										'{{fromnow}}',
									'</div>',
									'<div class="small text-muted mb-0">',
										'{{date}} &#x2022; {{fromnow}}',
									'</div>',
								'</div>',
							'</div>',
							'<div class="col-auto">',
									'<button type="button" class="btn btn-sm btn-white myds-navigate"',
										' data-controller="learner-task-summary"',
										' data-context="{{guid}}">',
											'<i class="fe fe-arrow-right"></i>',
										'</button>',
							'</div>',
						'</div>',
					'</div>'
				]);

				_.each(response.data.rows, function (row)
				{
					row.initials = _.upperCase(_.first(row['projecttask.modifieduser.contactperson.firstname']) +
										_.first(row['projecttask.modifieduser.contactperson.surname']));
					
					row.name = row['projecttask.modifieduser.contactperson.firstname'] + ' ' +
										row['projecttask.modifieduser.contactperson.surname'];
					
					row.date = app.invoke('util-date', {date: row.modifieddate, format: 'ddd, D MMM YYYY LT'});

					row.fromnow = moment(row.modifieddate, 'D MMM YYYY hh:mm:ss').fromNow();

					view.add({useTemplate: true,}, row)
				});

				view.add('</div>')
			}

			view.render('#learner-whats-up-all-view')
		}
	}
});

