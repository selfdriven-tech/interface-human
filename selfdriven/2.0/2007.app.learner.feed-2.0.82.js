/*
	{
    	title: "Learner; Feed (From Connections)", 	
    	design: "https://www.selfdriven.foundation/design"
  	}
*/

app.add(
{
	name: 'learner-feed',
	code: function (param, response)
	{		
		var uriContext = app._util.param.get(param, 'uriContext').value;
		var id = app._util.param.get(param, 'id').value;

		if (id == 'level-up-profile')
		{
			app.invoke('util-view-tab-show', '#learner-feed-level-up-profile');
			uriContext = 'learner-feed-level-up-profile';
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
		}
	}
});

// PROJECTS / TASKS

app.add(
{
	name: 'learner-feed-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learner-feed-dashboard',
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

			mydigitalstructure.cloud.search(
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
				callback: 'learner-feed-dashboard'
			})
		}
		else
		{
			var feedView = app.vq.init({queue: 'learner-feed-dashboard'});

			if (response.data.rows.length == 0)
			{
				feedView.add(
				[
					'<div class="text-muted text-center">',
						'Nothing in your projects what\'s up feed.',
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

					feedView.add({useTemplate: true,}, row)
				});

				feedView.add('</div>')
			}

			feedView.render('#learner-feed-dashboard-view')
		}
	}
});

// LEVEL UP PROFILE REFLECTIONS / COMMENTS

app.add(
{
	name: 'learner-feed-dashboard-level-up-profile',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learner-feed-dashboard-level-up-profile',
			valueDefault: {}
		});

		var levelUpProfileProject = app.whoami().mySetup.levelUp.managementProject;

		var filters = 
		[
			{
				field: 'object',
				value: app.whoami().mySetup.objects.project
			},
			{
				field: 'objectcontext',
				value: levelUpProfileProject.id
			},
			{
				field: 'type',
				comparison: 'IN_LIST',
				value: app.whoami().mySetup.actionTypes.reflection
			},
			{
				field: 'status',
				value: app.whoami().mySetup.actionStatuses.inProgress
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
				object: 'action',
				fields:
				[
					'description',
					'guid',
					'action.createduser.contactperson.firstname',
					'action.createduser.contactperson.surname',
					'action.createduser.contactperson.guid',
					'modifieddate',
					'modifiedusertext',
					'createddate'
				],
				filters: filters,
				sorts:
				[
					{
						field: 'modifieddate',
						direction: 'desc'
					}
				],
				callback: 'learner-feed-dashboard-level-up-profile'
			})
		}
		else
		{
			var feedView = app.vq.init({queue: 'learner-feed-dashboard-level-up-profile'});

			if (response.data.rows.length == 0)
			{
				feedView.add(
				[
					'<div class="text-muted text-center">',
						'Nothing in your level up profile what\'s up feed.',
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
									'<a href="#learner-profile/{{action.createduser.contactperson.guid}}">{{initials}}</a>',
								'</button>',
							'</div>',
							'<div class="col ms-n2">',
								'<div class="pl-1 pb-3">',
									'<div class="mb-1 font-weight-bold">',
										'{{description}}',
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
									' data-controller="learner-me-level-up-edit"',
									' data-context="{{guid}}">',
										'<i class="fe fe-arrow-right"></i>',
								'</button>',
							'</div>',
						'</div>',
					'</div>'
				]);

				_.each(response.data.rows, function (row)
				{
					row.initials = _.upperCase(_.first(row['action.createduser.contactperson.firstname']) +
										_.first(row['action.createduser.contactperson.surname']));
					
					row.name = row['action.createduser.contactperson.firstname'] + ' ' +
										row['action.createduser.contactperson.surname'];
					
					row.date = app.invoke('util-date', {date: row.createddate, format: 'ddd, D MMM YYYY LT'});

					row.fromnow = moment(row.createdate, 'D MMM YYYY hh:mm:ss').fromNow();

					feedView.add({useTemplate: true,}, row)
				});

				feedView.add('</div>')
			}

			feedView.render('#learner-feed-dashboard-level-up-profile-view')
		}
	}
});

