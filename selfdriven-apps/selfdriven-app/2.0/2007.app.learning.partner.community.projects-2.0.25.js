/*
	{
    	title: "Learning Partner; Community; Projects", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
  	}
*/

app.add(
{
	name: 'learning-partner-community-projects',
	code: function (param, response)
	{
		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		app.vq.init({queue: 'learning-partner-community-projects-types'});

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
			queue: 'learning-partner-community-projects-types'
		});

		app.vq.add(
		[
			'<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" id="learning-partner-community-projects-types-filter" aria-expanded="false">',
				'<span class="dropdown-text">All</span>',
			'</button>',
			'<ul class="dropdown-menu mt-1"',
				'data-controller="learning-partner-community-projects-dashboard"',
				'data-context="type"',
			'>',
			'<li>',
				'<a href="#" class="myds-dropdown dropdown-item" data-id="-1">',
				'All',
				'</a>',
			'</li>'
		],
		{
			queue: 'learning-partner-community-projects-types'
		});

		_.each(utilSetup._projectTypes, function (type)
		{
			app.vq.add({useTemplate: true, queue: 'learning-partner-community-projects-types'}, type)
		});

		app.vq.add('</ul>',
		{
			queue: 'learning-partner-community-projects'
		});

		app.vq.render('#learning-partner-community-projects-dashboard-types',
		{
			queue: 'learning-partner-community-projects-types'
		});

		app.invoke('learning-partner-community-projects-dashboard');
	}
});

app.add(
{
	name: 'learning-partner-community-projects-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-community-projects-dashboard',
			valueDefault: {}
		});

		var utilSetup = app.get(
		{
			scope: 'util-setup',
			valueDefault: {}
		});

		var filters = [];

		if (!_.isEmpty(data.search))
		{
			filters = _.concat(filters,
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
				filters = _.concat(filters,
				[
					{	
						field: 'type',
						value: data.type
					}
				]);
			}
		}
		
		app.invoke('util-view-table',
		{
			object: 'project',
			container: 'learning-partner-community-projects-dashboard-view',
			context: 'learning-partner-community-projects',
			filters: filters,
			options:
			{
				noDataText: 'There are no projects that match this search.',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this project?',
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
						row.classNotes = (row.notes==''?'d-none':'')
					}
				},

				columns:
				[
					{
						caption: 'Description',
						field: 'description',
						defaultSort: true,
						sortBy: true,
						class: 'col-sm-8 myds-navigate',
						data: 'id="admin-device-summary-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="learning-partner-community-project-summary"'
					},
					{
						caption: 'Type',
						field: 'typetext', 	
						sortBy: true,
						class: 'col-sm-3 myds-navigate',
						data: 'id="learning-partner-community-project-summary-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="learning-partner-community-project-summary"'
					},
					{
						caption: 'ID',
						field: 'reference', 	
						sortBy: true,
						class: 'col-sm-1 myds-navigate text-muted',
						data: 'id="learning-partner-community-project-summary-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="learning-partner-community-project-summary"'
					},
					{	
						fields:
						['type', 'notes', 'typetext', 'statustext']
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'learning-partner-community-project-summary',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learning-partner-community-project-summary',
			context: 'id',
			valueDefault: ''
		});

		var data = app.find(
		{
			dataController: 'learning-partner-community-projects',
			dataContext: 'all',
			controller: 'learning-partner-community-project-summary',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				firstname: '',
				surname: '',
				email: '',
				streetstate: ''
			}
		}

		app.view.refresh(
		{
			scope: 'learning-partner-community-project-summary',
			selector: '#learning-partner-community-project-summary',
			data: data
		});

		_.each(['tasks', 'team', 'attachments'], function (context)
		{
			$('#learning-partner-community-project-summary-' + context + '-collapse').removeClass('show')
			$('[href="#learning-partner-community-project-summary-' + context + '-collapse"] > i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
		});
	}	
});

app.add(
{
	name: 'learning-partner-community-project-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataScope: 'learning-partner-community-projects',
			dataContext: 'all',
			scope: 'learning-partner-community-project-edit',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				reference: '',
				type: '',
				typetext: '',
				description: ''
			}
		}

		app.view.refresh(
		{
			scope: 'learning-partner-community-project-edit',
			selector: '#learning-partner-community-project-edit',
			data: data
		});

		app.invoke('util-view-select',
		{
			container: 'learning-partner-community-project-edit-type-' + data.id,
			object: 'setup_project_type',
			fields: [{name: 'title'}]
		});
	}	
});

app.add(
{
	name: 'learning-partner-community-project-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			controller: 'learning-partner-community-project-summary',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			controller: 'learning-partner-community-project-edit-' + id,
			cleanForCloudStorage: true,
			valueDefault: {}
		});

		if (id == '')
		{}
		else
		{
			data.id = id;
		}

		if (_.isUndefined(response))
		{
			mydigitalstructure.cloud.save(
			{
				object: 'project',
				data: data,
				callback: 'learning-partner-community-project-edit-save'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Project added/updated.');

				if (id == '')
				{
					app.invoke('app-navigate-to', {controller: 'learning-partner-community-projects'});
				}
				else
				{
					app.invoke('app-navigate-to', {controller: 'learning-partner-community-project-summary', context: data.id});
				}
			}
		}
	}
});

// LEARNER; PROJECT TASKS

app.add(
{
	name: 'learning-partner-community-tasks',
	code: function (param, response)
	{
		var taskTypes = app.get(
		{
			scope: 'learning-partner-community-tasks',
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
					scope: 'learning-partner-community-tasks',
					context: 'types'
				},
				callback: 'learning-partner-community-tasks'
			});
		}
		else
		{
			app.vq.init({queue: 'learning-partner-community-tasks-types'});
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
				queue: 'learning-partner-community-tasks-types'
			});

			app.vq.add(
			[
				'<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" id="learning-partner-community-tasks-types-filter" aria-expanded="false">',
					'<span class="dropdown-text">All</span>',
				'</button>',
				'<ul class="dropdown-menu mt-1"',
					'data-controller="learning-partner-community-tasks-dashboard"',
					'data-context="type"',
				'>',
				'<li>',
					'<a href="#" class="myds-dropdown dropdown-item" data-id="-1">',
					'All',
					'</a>',
				'</li>'
			],
			{
				queue: 'learning-partner-community-tasks-types'
			});

			_.each(taskTypes, function (type)
			{
				app.vq.add({useTemplate: true, queue: 'learning-partner-community-tasks-types'}, type)
			});

			app.vq.add('</ul>',
			{
				queue: 'learning-partner-community-tasks-types'
			});

			app.vq.render('#learning-partner-community-tasks-dashboard-types',
			{
				queue: 'learning-partner-community-tasks-types'
			});

			app.invoke('learning-partner-community-tasks-dashboard');
		}
	}
});

app.add(
{
	name: 'learning-partner-community-tasks-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-community-tasks-dashboard',
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
				field: 'title',
				comparison: 'TEXT_IS_NOT_EMPTY'
			},
			{
				field: 'projecttask.project.template',
				value: 'N'
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
				},
				{
					name: ')'
				}
			]);
		}

		if (!_.isUndefined(data.type))
		{
			if (data.type != -1)
			{
				filters = _.concat(filters,
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
			container: 'learning-partner-community-tasks-dashboard-view',
			context: 'learning-partner-community-tasks',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">There are no community project tasks that match this search.</div>',
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
						row.info = '';

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
						caption: 'Subject',
						field: 'title',
						defaultSort: true,
						sortBy: true,
						class: 'col-sm-3 myds-navigate',
						data: 'id="learning-partner-community-task-summary-description-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="learning-partner-community-task-summary"'
					},
					{
						caption: 'Project',
						field: 'projecttask.project.description',
						defaultSort: true,
						sortBy: true,
						class: 'col-sm-3 myds-navigate',
						data: 'id="learning-partner-community-task-summary-project-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="learning-partner-community-task-summary"'
					},
					{
						caption: 'By',
						name: 'taskbyname', 	
						sortBy: true,
						class: 'col-sm-4',
						data: 'data-id="{{id}}"'
					},
					{
						caption: 'Info',
						name: 'info', 	
						sortBy: true,
						class: 'col-sm-2 myds-navigate',
						data: 'id="learning-partner-community-task-summary-type-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="learning-partner-community-task-summary"'
					},
					{	
						fields:
						['type', 'taskbyuser', 'notes', 'taskbyusertext', 'project', 'prioritytext', 'statustext', 'typetext', 'description']
					}

					// 'projecttask.taskbyuser.contactperson.firstname', 'projecttask.taskbyuser.contactperson.surname'
				]
			}
		});
	}
});

app.add(
{
	name: 'learning-partner-community-task-summary',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learning-partner-community-task-summary',
			context: 'id',
			valueDefault: ''
		});

		var data = app.find(
		{
			dataController: 'util-project_tasks_learning-partner-community-project-summary',
			dataContext: 'all',
			controller: 'learning-partner-community-task-summary',
			context: 'id'
		});

		if (data == undefined)
		{
			 data = app.find(
			{
				dataController: 'learning-partner-community-tasks',
				dataContext: 'all',
				controller: 'learning-partner-community-task-summary',
				context: 'id'
			});
		}

		if (data != undefined)
		{
			data._classIsNotes = (data.notes==''?'d-none':'')

			app.view.refresh(
			{
				scope: 'learning-partner-community-task-summary',
				selector: '#learning-partner-community-task-summary',
				data: data,
				collapse: {contexts: ['attachments', 'actions']}
			});

			app.invoke('util-view-select',
			{
				container: 'learning-partner-task-edit-status',
				object: 'setup_project_task_status',
				fields: [{name: 'title'}]
			});
		}
	}	
});



