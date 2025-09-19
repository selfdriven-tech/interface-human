/*
	{
    	title: "Learning Partner; Projects", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
  	}
*/

app.add(
{
	name: 'learning-partner-projects',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-projects',
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
				field: 'createduser',
				value: app.whoami().thisInstanceOfMe.user.id
			},
			{
				field: 'restrictedtoteam',
				value: 'Y'
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

		app.invoke('util-view-table',
		{
			object: 'project',
			container: 'learning-partner-projects-dashboard-view',
			context: 'learning-partner-projects',
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
						data: 'id="admin-device-summary-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="learning-partner-project-summary"'
					},
					{
						caption: 'Type',
						field: 'typetext', 	
						sortBy: true,
						class: 'col-sm-2 myds-navigate',
						data: 'id="learning-partner-project-summary-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="learning-partner-project-summary"'
					},
					{
						caption: 'Project ID',
						field: 'reference', 	
						sortBy: true,
						class: 'col-sm-2 myds-navigate',
						data: 'id="learning-partner-project-summary-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="learning-partner-project-summary"'
					},
					{	
						fields:
						['type', 'notes']
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'learning-partner-project-summary',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learning-partner-project-summary',
			context: 'id',
			valueDefault: ''
		});

		var data = app.find(
		{
			dataController: 'learning-partner-projects',
			dataContext: 'all',
			controller: 'learning-partner-project-summary',
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
			scope: 'learning-partner-project-summary',
			selector: '#learning-partner-project-summary',
			data: data
		});
	}	
});

app.add(
{
	name: 'learning-partner-project-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataScope: 'learning-partner-projects',
			dataContext: 'all',
			scope: 'learning-partner-project-edit',
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
			scope: 'learning-partner-project-edit',
			selector: '#learning-partner-project-edit',
			data: data
		});

		app.invoke('util-view-select',
		{
			container: 'learning-partner-project-edit-type-' + data.id,
			object: 'setup_project_type',
			fields: [{name: 'title'}]
		});
	}	
});

app.add(
{
	name: 'learning-partner-project-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			controller: 'learning-partner-project-summary',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			controller: 'learning-partner-project-edit-' + id,
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
				callback: 'learning-partner-project-edit-save'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Project added/updated.');

				if (id == '')
				{
					app.invoke('app-navigate-to', {controller: 'learning-partner-projects'});
				}
				else
				{
					app.invoke('app-navigate-to', {controller: 'learning-partner-project-summary', context: data.id});
				}
			}
		}
	}
});

// LEARNER; PROJECT TASKS

app.add(
{
	name: 'learning-partner-tasks',
	code: function (param, response)
	{
		var taskTypes = app.get(
		{
			scope: 'learning-partner-tasks',
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
					scope: 'learning-partner-tasks',
					context: 'types'
				},
				callback: 'learning-partner-tasks'
			});
		}
		else
		{
			app.vq.init({queue: 'learning-partner-tasks-types'});
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
				queue: 'learning-partner-tasks-types'
			});

			app.vq.add(
			[
				'<button type="button" class="btn btn-white dropdown-toggle" data-toggle="dropdown" id="learning-partner-tasks-types-filter" aria-expanded="false">',
					'<span class="dropdown-text">Type</span>',
				'</button>',
				'<ul class="dropdown-menu mt-1"',
					'data-controller="learning-partner-tasks-dashboard"',
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
				queue: 'learning-partner-tasks-types'
			});

			_.each(taskTypes, function (type)
			{
				app.vq.add({useTemplate: true, queue: 'learning-partner-tasks-types'}, type)
			});

			app.vq.add('</ul>',
			{
				queue: 'learning-partner-tasks-types'
			});

			app.vq.render('#learning-partner-tasks-dashboard-types',
			{
				queue: 'learning-partner-tasks-types'
			});

			app.invoke('learning-partner-tasks-dashboard');
		}
	}
});

app.add(
{
	name: 'learning-partner-tasks-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-tasks-dashboard',
			valueDefault: {}
		});

		var utilSetup = app.get(
		{
			scope: 'util-setup',
			valueDefault: {}
		});

		var whoAmI = app.whoami().thisInstanceOfMe.user;

		var filters =
		[
			{
				field: 'taskby',
				value: whoAmI.user
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
			container: 'learning-partner-tasks-dashboard-view',
			context: 'learning-partner-tasks',
			filters: filters,
			options:
			{
				noDataText: 'There are no tasks for you that match this search.',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this task?',
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
					}
				},

				columns:
				[
					{
						caption: 'Description',
						field: 'description',
						defaultSort: true,
						sortBy: true,
						class: 'col-sm-4 myds-navigate',
						data: 'id="admin-device-summary-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="learning-partner-task-summary"'
					},
					{
						caption: 'Project',
						field: 'projecttask.project.description',
						defaultSort: true,
						sortBy: true,
						class: 'col-sm-2 myds-navigate',
						data: 'id="admin-device-summary-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="learning-partner-task-summary"'
					},
					{
						caption: 'Priority',
						field: 'prioritytext', 	
						sortBy: true,
						class: 'col-sm-2',
						data: 'data-id="{{id}}"'
					},
					{
						caption: 'Type',
						field: 'typetext', 	
						sortBy: true,
						class: 'col-sm-2 myds-navigate',
						data: 'id="learning-partner-project-summary-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="learning-partner-task-summary"'
					},
					{
						caption: 'Status',
						field: 'statustext', 	
						sortBy: true,
						class: 'col-sm-2',
						data: 'data-id="{{id}}"'
					},
					{	
						fields:
						['type', 'taskbyuser', 'notes', 'taskbyusertext', 'status']
					}

					// 'projecttask.taskbyuser.contactperson.firstname', 'projecttask.taskbyuser.contactperson.surname'
				]
			}
		});
	}
});

app.add(
{
	name: 'learning-partner-task-summary',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learning-partner-task-summary',
			context: 'id',
			valueDefault: ''
		});

		var data = app.find(
		{
			dataController: 'learning-partner-tasks',
			dataContext: 'all',
			controller: 'learning-partner-task-summary',
			context: 'id'
		});

		//if can't find data do direct look up

		if (data != undefined)
		{
			data._classIsNotes = (data.notes==''?'d-none':'')

			app.view.refresh(
			{
				scope: 'learning-partner-task-summary',
				selector: '#learning-partner-task-summary',
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

app.add(
{
	name: 'learning-partner-task-edit-status-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learning-partner-task-summary',
			context: 'id',
			valueDefault: ''
		});
	
		var dataStatus = app.get(
		{
			scope: 'learning-partner-task-edit-status-' + id,
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
				callback: 'learning-partner-task-edit-status-save',
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.refresh(
				{
					dataScope: 'learning-partner-tasks',
					data: data
				});

				app.invoke('learning-partner-task-edit-status-comment-save');
			}
		}
	}
});

app.add(
{
	name: 'learning-partner-task-edit-status-comment-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learning-partner-task-summary',
			context: 'id',
			valueDefault: ''
		});
	
		var dataStatus = app.get(
		{
			scope: 'learning-partner-task-edit-status-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values: {}
			}
		});

		var dataTask = app.get(
		{
			scope: 'learning-partner-task-summary',
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
			app.invoke('learning-partner-task-edit-status-save-complete');
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
					callback: 'learning-partner-task-edit-status-comment-save',
				});
			}
			else
			{	
				app.invoke('learning-partner-task-edit-status-save-complete');
			}
		}
	}
});

app.add(
{
	name: 'learning-partner-task-edit-status-save-complete',
	code: function (param, response)
	{	
		app.notify('Task status updated.')
		app.invoke('app-navigate-to', {scope: 'learning-partner-tasks'});
	}
});