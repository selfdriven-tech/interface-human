/*
	{
    	title: "Learner; Projects", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
  	}
*/

app.add(
{
	name: 'admin-tasks',
	code: function (param, response)
	{
		var taskTypes = app.get(
		{
			scope: 'admin-tasks',
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
					scope: 'admin-tasks',
					context: 'types'
				},
				callback: 'admin-tasks'
			});
		}
		else
		{
			app.vq.init({queue: 'admin-tasks-types'});
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
				queue: 'admin-tasks-types'
			});

			app.vq.add(
			[
				'<button type="button" class="btn btn-white dropdown-toggle" data-toggle="dropdown" id="admin-tasks-types-filter" aria-expanded="false">',
					'<span class="dropdown-text">All</span>',
				'</button>',
				'<ul class="dropdown-menu mt-1"',
					'data-controller="admin-tasks-dashboard"',
					'data-context="type"',
				'>',
				'<li>',
					'<a href="#" class="myds-dropdown" data-id="-1">',
					'All',
					'</a>',
				'</li>'
			],
			{
				queue: 'admin-tasks-types'
			});

			_.each(taskTypes, function (type)
			{
				app.vq.add({useTemplate: true, queue: 'admin-tasks-types'}, type)
			});

			app.vq.add('</ul>',
			{
				queue: 'admin-tasks-types'
			});

			app.vq.render('#admin-tasks-dashboard-types',
			{
				queue: 'admin-tasks-types'
			});

			app.invoke('admin-tasks-dashboard');
		}
	}
});

app.add(
{
	name: 'admin-tasks-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'admin-tasks-dashboard',
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
		});

		app.invoke('util-dashboard-tasks-show',
		{
			context: 'admin-tasks',
			filters: filters
		})

		app.invoke('util-view-table',
		{
			object: 'project_task',
			container: 'admin-tasks-view',
			context: 'admin-tasks',
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
						class: 'col-sm-6 myds-navigate',
						data: 'data-context="{{guid}}" data-controller="admin-community-task-summary"'
					},
					{
						caption: '<i class="far fa-calendar-alt"></i>',
						name: 'dates', 	
						sortBy: true,
						class: 'col-sm-3 myds-navigate',
						data: 'data-context="{{guid}}" data-controller="admin-community-task-summary"'
					},
					{
						caption: '<i class="fa fa-info-circle"></i>',
						name: 'info', 	
						sortBy: true,
						class: 'col-sm-3 myds-navigate',
						data: 'id="admin-community-task-summary-status-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="admin-community-task-summary"'
					},
					{	
						fields:
						[
							'type', 'typetext',
							'taskbyuser', 'notes', 'taskbyusertext', 'project',
							'startdate','enddate',
							'priority', 'prioritytext',
							'status', 'statustext',
							'description', 'projecttask.project.description',
							'guid'
						]
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'admin-task-summary',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'admin-task-summary',
			context: 'id',
			valueDefault: ''
		});

		var data = app.find(
		{
			dataController: 'admin-tasks',
			dataContext: 'all',
			controller: 'admin-task-summary',
			context: 'id'
		});

		//if can't find data do direct look up

		if (data != undefined)
		{
			data._classIsNotes = (data.notes==''?'d-none':'')

			app.view.refresh(
			{
				scope: 'admin-task-summary',
				selector: '#admin-task-summary',
				data: data,
				collapse: {contexts: ['actions', 'attachments']}
			});

			app.invoke('util-view-select',
			{
				container: 'admin-task-edit-status',
				object: 'setup_project_task_status',
				fields: [{name: 'title'}]
			});
		}
	}	
});

app.add(
{
	name: 'admin-task-edit-status-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'admin-task-summary',
			context: 'id',
			valueDefault: ''
		});
	
		var dataStatus = app.get(
		{
			scope: 'admin-task-edit-status-' + id,
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
				callback: 'admin-task-edit-status-save',
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.refresh(
				{
					dataScope: 'admin-tasks',
					data: data,
					collapse: {contexts: ['attachments', 'actions']}
				});

				app.invoke('admin-task-edit-status-comment-save');
			}
		}
	}
});

app.add(
{
	name: 'admin-task-edit-status-comment-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'admin-task-summary',
			context: 'id',
			valueDefault: ''
		});
	
		var dataStatus = app.get(
		{
			scope: 'admin-task-edit-status-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values: {}
			}
		});

		var dataTask = app.get(
		{
			scope: 'admin-task-summary',
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
			app.invoke('admin-task-edit-status-save-complete');
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
					callback: 'admin-task-edit-status-comment-save',
				});
			}
			else
			{	
				app.invoke('admin-task-edit-status-save-complete');
			}
		}
	}
});

app.add(
{
	name: 'admin-task-edit-status-save-complete',
	code: function (param, response)
	{	
		app.notify('Task status updated.')
		app.invoke('app-navigate-to', {scope: 'admin-tasks'});
	}
});

app.add(
[
	{
		name: 'admin-tasks-email',
		code: function (param, response)
		{	
			var whoamiUser = app.whoami().thisInstanceOfMe.user;

			app.vq.init({queue: 'message'});

			app.vq.add(
			[
				'<body>',
					'<div style="background-color:#f3f3f4; margin:20px; padding:20px; border-radius:6px;">',
						'<div style="font-size:1.2rem; font-weight:bold;">Hello, ', whoamiUser.firstname, ' you have ...</div>',
						'<div style="margin-top:16px;">',
							'<ul>',
								'<li style="margin-bottom:4px;">4 active tasks.</li>',
								'<li style="margin-bottom:4px;">No tasks due soon.</li>',
								'<li style="margin-bottom:4px;"><span style="color:#ed5565; font-weight:bold;">1</span> task overdue.</li>',
							'</ul>',
						'</div>',
						'<div style="margin-top:12px; font-size:1rem; color:rgb(103, 106, 108);">As a community, there are ...</div>',
						'<div style="margin-top:16px;">',
							'<ul>',
								'<li style="margin-bottom:4px;">{{communitytasksactive}} active tasks.</li>',
								'<li style="margin-bottom:4px;">No tasks due soon.</li>',
								'<li style="margin-bottom:4px;"><span style="color:#ed5565; font-weight:bold;">2</span> tasks overdue.</li>',
							'</ul>',
						'</div>',
						'<div style="margin-top:20px; margin-bottom:0px;">',
							'<a href="https://journal.ths.community" target="_blank">',
								'<div style="padding:10px; border-style:solid; background-color:#2a88bd; border-width:1px;',
									' width:80px; color:white; border-radius:5px; text-decoration:none; text-align:center; font-weight:bold;"',
									'>',
									'Log On',
								'</div>',
							'</a>',
						'</div>',	
					'</div>',
				'</body>'
			], {type: 'template', queue: 'message'});

			app.invoke('admin-tasks-email-get-tasks');
		}
	},
	{
		name: 'admin-tasks-email-get-tasks',
		code: function (param, response)
		{	
			var utilSetup = app.get({scope: 'util-setup'});

			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'project_task',
					fields:
					[
						'taskby', 'status', 'startdate'
					],
					filters:
					[
						{
							field: 'status',
							comparison: 'NOT_IN_LIST',
							value: utilSetup.taskStatuses.closed
						}
					],
					rows: 99999,
					callback: 'admin-tasks-email-get-tasks',
					callbackParam: param
				});
			}
			else
			{
				_.each(response.data.rows, function (row)
				{
					row.startdate = app.invoke('util-date', {date: row.startdate});
				});

				app.set(
				{
					scope: 'admin-tasks-email',
					context: 'tasks',
					value: response.data.rows
				});

				app.invoke('admin-tasks-email-prepare');
			}
		}
	},
	{
		name: 'admin-tasks-email-prepare',
		code: function (param, response)
		{			
			var tasks = app.get(
			{
				scope: 'admin-tasks-email',
				context: 'tasks'
			});

			var data = {}

			data.communitytasksactive = tasks.length;

			data.communitytasksduesoon = _.filter(tasks, function (task)
			{
				return (false)
			});

			app.set(
			{
				scope: 'admin-tasks-email',
				context: 'data',
				value: data
			});

			app.invoke('admin-tasks-email-send');	
		}
	},
	{
		name: 'admin-tasks-email-send',
		code: function (param, response)
		{				
			var data = app.get(
			{
				scope: 'admin-tasks-email',
				context: 'data'
			});

			app.vq.add({queue: 'message', useTemplate: true}, data)

			//app.vq.render('#admin-tasks-view', {queue: 'message'});

			var message = app.vq.get({queue: 'message'});

			if (message != '')
			{
				mydigitalstructure.cloud.invoke(
				{
					method: 'messaging_email_send',
					data:
					{
						fromemail: 'journal@ths.community',
						subject: '[THS Community Journal] Your Tasks',
						message: message,
						to: 'mark.byers@ibcom.biz',
					},
					notify: 'Email sent',
					callback: 'admin-tasks-email-sent'
				});
			}
			else
			{
				app.invoke('util-view-spinner-remove', {controller: 'admin-tasks-email'});
			}
		}
	},
	{
		name: 'admin-tasks-email-sent',
		code: function (param, response)
		{
			app.invoke('util-view-spinner-remove', {controller: 'admin-tasks-email'});
		}
	}
]);

