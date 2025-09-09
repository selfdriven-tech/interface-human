/*
	{
    	title: "Admin; Community; Projects", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
  	}
*/


// ADMIN; COMMUNITY TASKS

app.add(
{
	name: 'admin-community-tasks',
	code: function (param, response)
	{
		var taskTypes = app.get(
		{
			scope: 'admin-community-tasks',
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
					scope: 'admin-community-tasks',
					context: 'types'
				},
				callback: 'admin-community-tasks'
			});
		}
		else
		{
			app.vq.init({queue: 'admin-community-tasks-types'});
			app.vq.add(
			[
				'<li>',
					'<a href="#" class="myds-dropdown" data-id="{{id}}">',
					'{{title}}',
					'</a>',
				'</li>'
			],
			{
				type: 'template',
				queue: 'admin-community-tasks-types'
			});

			app.vq.add(
			[
				'<button type="button" class="btn btn-white dropdown-toggle" data-toggle="dropdown" id="admin-community-tasks-types-filter" aria-expanded="false">',
					'<span class="dropdown-text">Type</span>',
				'</button>',
				'<ul class="dropdown-menu mt-1"',
					'data-controller="admin-community-tasks-dashboard"',
					'data-context="type"',
				'>',
				'<li>',
					'<h6 class="dropdown-header mt-2">Type</h6>',
				'</li>',
				'<li>',
					'<a href="#" class="myds-dropdown" data-id="-1">',
					'All',
					'</a>',
				'</li>'
			],
			{
				queue: 'admin-community-tasks-types'
			});

			_.each(taskTypes, function (type)
			{
				app.vq.add({useTemplate: true, queue: 'admin-community-tasks-types'}, type)
			});

			app.vq.add('</ul>',
			{
				queue: 'admin-community-tasks-types'
			});

			app.vq.render('#admin-community-tasks-dashboard-types',
			{
				queue: 'admin-community-tasks-types'
			});

			app.vq.init({queue: 'admin-community-tasks-statuses'});
			app.vq.add(
			[
				'<li>',
					'<a href="#" class="myds-dropdown" data-id="{{id}}">',
					'{{title}}',
					'</a>',
				'</li>'
			],
			{
				type: 'template',
				queue: 'admin-community-tasks-statuses'
			});

			app.vq.add(
			[
				'<button type="button" class="btn btn-white dropdown-toggle" data-toggle="dropdown" id="admin-community-tasks-statuses-filter" aria-expanded="false">',
					'<span class="dropdown-text">Status</span>',
				'</button>',
				'<ul class="dropdown-menu mt-1"',
					'data-controller="admin-community-tasks-dashboard"',
					'data-context="status"',
				'>',
				'<li>',
					'<h6 class="dropdown-header mt-2">Status</h6>',
				'</li>',
				'<li>',
					'<a href="#" class="myds-dropdown" data-id="-1">',
					'All',
					'</a>',
				'</li>'
			],
			{
				queue: 'admin-community-tasks-statuses'
			});

			_.each(utilSetup._taskStatuses, function (status)
			{
				app.vq.add({useTemplate: true, queue: 'admin-community-tasks-statuses'}, status)
			});

			app.vq.add('</ul>',
			{
				queue: 'admin-community-tasks-statuses'
			});

			app.vq.render('#admin-community-tasks-dashboard-statuses',
			{
				queue: 'admin-community-tasks-statuses'
			});

			app.invoke('admin-community-tasks-dashboard');
		}
	}
});

app.add(
{
	name: 'admin-community-tasks-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'admin-community-tasks-dashboard',
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

		if (!_.isUndefined(data.status))
		{
			if (data.status != -1)
			{
				filters = _.concat(
				[
					{	
						field: 'status',
						value: data.status
					}
				]);
			}
		}

		var utilSetup = app.get({scope: 'util-setup'});

		app.invoke('util-dashboard-tasks-show',
		{
			context: 'admin-community-tasks',
			filters: filters
		});

		app.invoke('util-view-table',
		{
			object: 'project_task',
			container: 'admin-community-tasks-view',
			context: 'admin-community-tasks',
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
						}

						var date = moment(row.startdate, 'D MMM YYYY LT');
						if (date.isValid())
						{
							row.startdate = moment(row.startdate, 'D MMM YYYY LT').format('D MMM YYYY');
						}

						row._classHasStartDate = (data.startdate==''?'d-none':'')

						var date = moment(row.enddate, 'D MMM YYYY LT');
						if (date.isValid())
						{
							row.enddate = moment(row.enddate, 'D MMM YYYY LT').format('D MMM YYYY');
						}

						row._classHasEndDate = (data.enddate==''?'d-none':'')

						row.dates = '';
 
						if (row.startdate != '')
						{
							row.dates = row.dates +
								'<div>' + row.startdate + '</div>' +
								'<div class="mb-2 text-muted small">Start Date</div>';
						}

						if (row.enddate != '')
						{
							row.dates = row.dates +
								'<div>' + row.enddate + '</div>' +
								'<div class="mb-2 text-muted small">End Date</div>';
						}

						row.info =
								'<div>' + row.prioritytext + '</div>' +
								'<div class="mb-2 text-muted small">Priority</div>' +
								'<div>' + row.typetext + '</div>' +
								'<div class="mb-2 text-muted small">Type</div>' +
								'<div>' + row.statustext + '</div>' +
								'<div class="mb-2 text-muted small">Status</div>';

						row.task =
								'<div>' + row.description + '</div>' + 
								'<div class="text-muted small">' + row['projecttask.project.description'] + '</div>';
					}
				},

				columns:
				[
					{
						caption: 'Description',
						name: 'task',
						defaultSort: true,
						sortBy: true,
						class: 'col-sm-4 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="admin-community-task-summary"'
					},

					{
						caption: 'Task By',
						name: 'taskbyname', 	
						sortBy: true,
						class: 'col-sm-3',
						data: 'data-id="{{id}}"'
					},
					{
						caption: '<i class="far fa-calendar-alt"></i>',
						name: 'dates', 	
						sortBy: true,
						class: 'col-sm-2 myds-navigate',
						data: 'id="admin-community-task-summary-status-{{id}}" data-context="{{guid}}" data-id="{{guid}}" data-controller="admin-community-task-summary"'
					},
					{
						caption: '<i class="fa fa-info-circle"></i>',
						name: 'info', 	
						sortBy: true,
						class: 'col-sm-2 myds-navigate',
						data: 'id="admin-community-task-summary-status-{{id}}" data-context="{{guid}}" data-id="{{guid}}" data-controller="admin-community-task-summary"'
					},
					{
						html: '<button class="btn btn-danger btn-outline btn-sm myds-delete"' +
	               			' id="admin-community-projects-delete-{{id}}" data-id="{{id}}"><i class="fa fa-trash"></i></button>',
						caption: '&nbsp;',
						class: 'col-sm-1 text-right'
					},
					{	
						fields:
						[
							'type', 'typetext',
							'taskbyuser', 'notes', 'taskbyusertext', 'project',
							'startdate','enddate',
							'priority', 'prioritytext',
							'status', 'statustext',
							'description', 'projecttask.project.description', 'guid'
						]
					}
				]
			}
		});
	}
});


app.add(
{
	name: 'admin-community-tasks-board',
	code: function (param, response)
	{
		if (response == undefined)
		{
			var data = app.get(
			{
				scope: 'admin-community-tasks-dashboard'
			});

			if (data == undefined)
			{
				data = app.get(
				{
					scope: 'admin-community-tasks-board'
				});
			}

			var utilSetup = app.get(
			{
				scope: 'util-setup',
				valueDefault: {}
			});

			var filters = [];

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

			if (_.isUndefined(data.status))
			{
				filters = _.concat(
				[
					{	
						field: 'status',
						comparison: 'IN_LIST',
						value: '1,2,8'
					}
				]);
			}
			else
			{
				if (data.status == -1)
				{}
				else
				{
					filters = _.concat(
					[
						{	
							field: 'status',
							value: data.status
						}
					]);
				}
			}

			mydigitalstructure.cloud.search(
			{
				object: 'project_task',
				filters: filters,
				fields:
				[
					'type', 'typetext',
					'taskbyuser', 'notes', 'taskbyusertext', 'project',
					'startdate','enddate',
					'priority', 'prioritytext',
					'status', 'statustext',
					'description', 'projecttask.project.description', 'guid'
				],
				callback: 'admin-community-tasks-board'
			});
		}
		else
		{
			var tasksByProject = _.groupBy(response.data.rows, 'projecttask.project.description');

			app.set(
			{
				scope: 'admin-community-tasks-board',
				context: 'tasks-by-project',
				value: tasksByProject
			});

			app.invoke('admin-community-tasks-board-show')
		}
	}
});

app.add(
{
	name: 'admin-community-tasks-board-show',
	code: function (param, response)
	{
		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		var tasksByProject = app.get(
		{
			scope: 'admin-community-tasks-board',
			context: 'tasks-by-project',
			value: tasksByProject
		});

		app.vq.init({queue: 'board-project'});

		app.vq.add('<div class="container-fluid"><div class="row">',
			{queue: 'board-project'});

		app.vq.add(['<div class="col-4 mb-4"><div class="card"><div class="card-body">',
			'<h4>{{projecttask.project.description}}</h4>'],
			{type: 'template', queue: 'board-project'});

		_.each(tasksByProject, function (projectTasks)
		{
			var _project = _.first(projectTasks);

			app.vq.add({useTemplate: true, queue: 'board-project'}, _project);

				app.vq.add('<ul class="sortable-list connectList agile-list ui-sortable">',
					{queue: 'board-project-tasks'});

				app.vq.add(				
				[
			 		'<li class="{{class}}-element ui-sortable-handle myds-navigate"',
			 			' data-controller="admin-community-task-summary"',
			 			' data-context="{{guid}}"',
			 			'>',
						'{{description}}',
                        '<div class="agile-detail">',
							'<div>{{startdate}}</div>',
							'<div class="mt-2">{{taskbyusertext}}</div>',
							'<div class="d-none"><a href="#" class="btn btn-xs btn-white">Action</a></div>',
						'</div>',
					'</li>'
				],
				{type: 'template', queue: 'board-project-tasks'});

				_.each(projectTasks, function (projectTask)
				{
					projectTask.startdate = moment(projectTask.startdate, 'D MMM YYYY LT').format('D MMM YYYY');
					projectTask.class = utilSetup.taskStatusClasses[projectTask.statustext];
					app.vq.add({useTemplate: true, queue: 'board-project-tasks'}, projectTask);
				});
				
				app.vq.add('</ul></div></div></div>',
					{queue: 'board-project-tasks'});

			app.vq.add(app.vq.get({queue: 'board-project-tasks'}),
				{queue: 'board-project'});

		});

		app.vq.add('</div></div>',
			{queue: 'board-project'});

		app.vq.render('#admin-community-tasks-board-view', {queue: 'board-project'});
	}
});

app.add(
{
	name: 'admin-community-tasks-delete-ok',
	code: function (param, response)
	{
		if (_.isUndefined(response))
		{
			if (!_.isUndefined(param.dataContext))
			{
				mydigitalstructure.cloud.delete(
				{
					object: 'project_task',
					data:
					{
						id: param.dataContext.id,
					},
					callback: 'admin-community-tasks-delete-ok'
				});
			}	
		}
		else
		{
			if (response.status == 'OK')
			{
				app.notify({message: 'Task deleted.', persist: false});
				app.invoke('admin-community-tasks');
			}
		}
	}
});

app.add(
{
	name: 'admin-community-task-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'admin-community-task-summary',
			context: 'id'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'admin-community-tasks'});
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
						scope: 'admin-community-tasks',
						context: 'all'
					},
					callback: 'admin-community-task-summary'
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
							scope: 'admin-community-task-summary',
							context: 'dataContext',
							value: data
						});

						app.invoke('util-attachments-initialise',
						{
							context: 'admin-community-task-summary',
							object: app.whoami().mySetup.objects.projectTask,
							objectContext: data.id,
							showTypes: false
						});

						app.view.refresh(
						{
							scope: 'admin-community-task-summary',
							selector: '#admin-community-task-summary',
							data: data,
							collapse: {contexts: ['attachments', 'actions']}
						});

						app.invoke('util-view-select',
						{
							container: 'admin-community-task-summary-status',
							object: 'setup_project_task_status',
							fields: [{name: 'title'}]
						});
					}
				}
			}
		}
	}	
});

app.add(
{
	name: 'admin-community-task-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataController: 'util-project_tasks_admin-community-project-summary',
			dataContext: 'all',
			controller: 'admin-community-task-summary',
			context: 'id'
		});

		if (data == undefined)
		{
			var data = app.find(
			{
				dataScope: 'admin-community-tasks',
				dataContext: 'all',
				scope: 'admin-community-task-edit',
				context: 'id'
			});
		}

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				startdate: '',
				enddate: ''
			}
		}

		app.view.refresh(
		{
			scope: 'admin-community-task-edit',
			selector: '#admin-community-task-edit',
			data: data
		});

		app.invoke('util-view-select',
		{
			container: 'admin-community-task-edit-taskbyuser',
			object: 'setup_user',
			fields: [{name: 'user.contactperson.firstname'}, {name: 'user.contactperson.surname'}]
		});

		app.invoke('util-view-select',
		{
			container: 'admin-community-task-edit-type',
			object: 'setup_project_task_type',
			fields: [{name: 'title'}]
		});

		app.invoke('util-view-select',
		{
			container: 'admin-community-task-edit-priority',
			object: 'setup_project_task_priority',
			fields: [{name: 'title'}]
		});

		app.invoke('util-view-select',
		{
			container: 'admin-community-task-edit-status',
			object: 'setup_project_task_status',
			fields: [{name: 'title'}]
		});
	}	
});

app.add(
{
	name: 'admin-community-task-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'admin-community-task-edit',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'admin-community-task-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values: {}
			}
		});

		if (_.isUndefined(response))
		{		
			mydigitalstructure.cloud.save(
			{
				object: 'project_task',
				data: data,
				callback: 'admin-community-task-edit-save',
				set: {scope: 'admin-community-task-edit'},
				notify: 'Task has been ' + (id==''?'added':'updated') + '.'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.refresh(
				{
					dataScope: 'admin-community-tasks',
					data: data
				});

				app.invoke('app-navigate-to', {controller: 'admin-community-task-summary', context: data.id});
			}
		}
	}
});

app.add(
{
	name: 'admin-community-task-summary-status-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'admin-community-task-summary',
			context: 'id',
			valueDefault: ''
		});
	
		var dataStatus = app.get(
		{
			scope: 'admin-community-task-summary-status-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values: {}
			}
		});

		var data =
		{
			id: id,
			status: dataStatus.status
		};

		if (_.isUndefined(response))
		{		
			mydigitalstructure.cloud.save(
			{
				object: 'project_task',
				data: data,
				callback: 'admin-community-task-summary-status-save',
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.refresh(
				{
					dataScope: 'admin-tasks',
					data: data
				});

				app.invoke('admin-community-task-summary-status-comment-save');
			}
		}
	}
});

app.add(
{
	name: 'admin-community-task-summary-status-comment-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'admin-community-task-summary',
			context: 'id',
			valueDefault: ''
		});
	
		var dataStatus = app.get(
		{
			scope: 'admin-community-task-summary-status-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values: {}
			}
		});

		var dataTask = app.get(
		{
			scope: 'admin-community-task-summary',
			context: 'dataContext',
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values: {}
			}
		});

		if (dataStatus.statuscomment == '')
		{
			app.invoke('admin-community-task-summary-status-save-complete');
		}
		else
		{
			var utilSetup = app.get(
			{
				scope: 'util-setup'
			});

			var data =
			{
				object: 11,
				objectcontext: id,
				actionby: app.whoami().thisInstanceOfMe.user.user,
				contactperson: app.whoami().thisInstanceOfMe.user.contactperson,
				actiontype: utilSetup.actionTypes.taskStatusUpdate,
				description: dataStatus.statuscomment,
				actionreference: _.truncate('Status Update|' + dataTask['projecttask.project.description'] + '|' + dataTask.description, {length: 800, separator: ' '}),
				status: 1,
				completed: moment().format('D MMM YYYY'),
				duedate: moment().format('D MMM YYYY')
			};

			if (_.isUndefined(response))
			{		
				mydigitalstructure.cloud.save(
				{
					object: 'action',
					data: data,
					callback: 'admin-community-task-summary-status-comment-save',
				});
			}
			else
			{	
				app.invoke('admin-community-task-summary-status-save-complete');
			}
		}
	}
});

app.add(
{
	name: 'admin-community-task-summary-status-save-complete',
	code: function (param, response)
	{	
		app.notify('Task status updated.')
		app.invoke('app-navigate-to', {scope: 'admin-community-tasks'});
	}
});


