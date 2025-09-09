/*
	{
    	title: "Learner; Community; Tasks", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
  	}
*/

app.add(
{
	name: 'learner-community-tasks',
	code: function (param, response)
	{
		var taskTypes = app.get(
		{
			scope: 'learner-community-tasks',
			context: 'types'
		});

		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		if (response == undefined && taskTypes == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'setup_project_task_type',
				fields: ['title'],
				set:
				{
					scope: 'learner-community-tasks',
					context: 'types'
				},
				callback: 'learner-community-tasks'
			});
		}
		else
		{
			app.vq.init({queue: 'learner-community-tasks-types'});
			app.vq.add(
			[
				'<li>',
					'<a href="#" class="myds-dropdown dropdown-item" data-id="{{id}}">',
					'{{title}}',
					'</a>',
				'</li>'
			],
			{
				type: 'template',
				queue: 'learner-community-tasks-types'
			});

			app.vq.add(
			[
				'<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" id="learner-community-tasks-types-filter" aria-expanded="false">',
					'<span class="dropdown-text">Type</span>',
				'</button>',
				'<ul class="dropdown-menu mt-1"',
					'data-controller="learner-community-tasks-dashboard"',
					'data-context="type"',
				'>',
				'<li>',
					'<a href="#" class="myds-dropdown dropdown-item" data-id="-1">',
					'All',
					'</a>',
				'</li>'
			],
			{
				queue: 'learner-community-tasks-types'
			});

			_.each(taskTypes, function (type)
			{
				app.vq.add({useTemplate: true, queue: 'learner-community-tasks-types'}, type)
			});

			app.vq.add('</ul>',
			{
				queue: 'learner-community-tasks-types'
			});

			app.vq.render('#learner-community-tasks-dashboard-types',
			{
				queue: 'learner-community-tasks-types'
			});

			app.invoke('learner-community-tasks-dashboard');
		}
	}
});

app.add(
{
	name: 'learner-community-tasks-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learner-community-tasks-dashboard',
			valueDefault: {}
		});

		var utilSetup = app.get(
		{
			scope: 'util-setup',
			valueDefault: {}
		});

		var filters =
		[
			{
				field: 'projecttask.taskbyuser.contactbusiness',
				value: app.whoami().thisInstanceOfMe.user.contactbusiness
			}
		];

		if (!_.isEmpty(data.search))
		{
			filters = _.concat(
			[
				{	
					field: 'reference',
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
				}
			]);
		}

		if (!_.isUndefined(data.type))
		{
			if (data.type != -1)
			{
				filters = _.concat(
				[
					{	
						field: 'type',
						value: data.type
					}
				]);
			}
		}

		var utilSetup = app.get(
		{
			scope: 'util-setup'
		})

		app.invoke('util-view-table',
		{
			object: 'project_task',
			container: 'learner-community-tasks-dashboard-view',
			context: 'learner-community-tasks',
			filters: filters,
			options:
			{
				noDataText: 'There are no project tasks that match this search.',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this project task?',
					position: 'left'
				}
			},
			format:
			{
				header:
				{
					class: 'd-flex'
				},

				row:
				{
					data: 'data-id="{{id}}"',
					class: 'd-flex',
					method: function (row)
					{
						//row.taskbyname = row['projecttask.taskbyuser.contactperson.firstname'] + ' ' + row['projecttask.taskbyuser.contactperson.surname']
						row._taskbyname = _.find(utilSetup.users, function (user) {return user.id == row.taskbyuser});
						row.taskbyname = row.taskbyusertext;
						if (row._taskbyname != undefined)
						{
							row.taskbyname = '<div>' + row._taskbyname['user.contactperson.firstname'] + ' ' + row._taskbyname['user.contactperson.surname'] + '</div>';

							if (row._taskbyname['user.contactperson.email'] != '')
							{
								row.taskbyname = row.taskbyname +
									'<div class="text-muted small"><a href="mailto:' + row._taskbyname['user.contactperson.email'] + '" class="text-muted">' +
											'<i class="fa fa-envelope mr-1"></i>' + row._taskbyname['user.contactperson.email'] + '</a></div>'
							}

							row.info =
								'<div>' + row.prioritytext + '</div>' +
								'<div class="mb-2 text-muted small">Priority</div>' +
								'<div>' + row.typetext + '</div>' +
								'<div class="mb-2 text-muted small">Type</div>' +
								'<div>' + row.statustext + '</div>' +
								'<div class="mb-2 text-muted small">Status</div>';
						}
					}
				},

				columns:
				[
					{
						caption: 'Description',
						field: 'description',
						defaultSort: true,
						sortBy: true,
						class: 'col-6 col-sm-4 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="learner-community-task-summary"'
					},
					{
						caption: 'Project',
						field: 'projecttask.project.description',
						defaultSort: true,
						sortBy: true,
						class: 'col-0 col-sm-2 d-none d-sm-block myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="learner-community-task-summary"'
					},
					{
						caption: 'By',
						name: 'taskbyname', 	
						sortBy: true,
						class: 'col-0 col-sm-4 d-none d-sm-block',
						data: 'data-id="{{id}}"'
					},
					{
						caption: 'Info',
						name: 'info', 	
						sortBy: true,
						class: 'col-6 col-sm-2 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="learner-community-task-summary"'
					},
					{	
						fields:
						['type', 'taskbyuser', 'notes', 'taskbyusertext', 'project', 'prioritytext', 'statustext', 'typetext', 'guid']
					}

					// 'projecttask.taskbyuser.contactperson.firstname', 'projecttask.taskbyuser.contactperson.surname'
				]
			}
		});
	}
});

app.add(
{
	name: 'learner-community-task-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'learner-community-task-summary',
			context: 'id'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'learner-community-tasks'});
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'project_task',
					fields: 
					[
						'type', 'typetext',
						'taskbyuser', 'notes', 'taskbyusertext', 'project',
						'startdate', 'enddate',
						'priority', 'prioritytext',
						'status', 'statustext',
						'description', 'projecttask.project.description', 'guid'
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
						scope: 'learner-community-tasks',
						context: 'all'
					},
					callback: 'learner-community-task-summary'
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
						data.startdate = app.invoke('util-date', data.startdate);
						data.enddate = app.invoke('util-date', data.enddate);

						app.set(
						{
							scope: 'learner-community-task-summary',
							context: 'dataContext',
							value: data
						});

						app.invoke('util-attachments-initialise',
						{
							context: 'learner-community-task-summary',
							object: app.whoami().mySetup.objects.projectTask,
							objectContext: data.id,
							showTypes: false
						});

						app.view.refresh(
						{
							scope: 'learner-community-task-summary',
							selector: '#learner-community-task-summary',
							data: data,
							collapse: {contexts: ['attachments', 'actions']}
						});

						app.invoke('util-view-select',
						{
							container: 'learner-community-task-summary-status',
							object: 'setup_project_task_status',
							fields: [{name: 'title'}]
						});
					}
				}
			}
		}
	}	
});



