/*
	{
    	title: "Learner; Tasks", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
  	}
*/

app.add(
{
	name: 'learner-tasks',
	code: function (param, response)
	{
		var taskTypes = app.get(
		{
			scope: 'learner-tasks',
			context: 'types'
		});

		if (response == undefined && taskTypes == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'setup_project_task_type',
				fields: ['title'],
				set:
				{
					scope: 'learner-tasks',
					context: 'types'
				},
				callback: 'learner-tasks'
			});
		}
		else
		{
			var typesView = app.vq.init({queue: 'learner-tasks-types'});
			typesView.template(
			[
				'<li>',
					'<a href="#" class="myds-dropdown dropdown-item" data-id="{{id}}">',
					'{{title}}',
					'</a>',
				'</li>'
			]);

			typesView.add(
			[
				'<button type="button" class="btn btn-sm btn-primary dropdown-toggle" data-toggle="dropdown" id="learner-tasks-types-filter" aria-expanded="false">',
					'<span class="dropdown-text">Type</span>',
				'</button>',
				'<ul class="dropdown-menu mt-1"',
					'data-controller="learner-tasks-dashboard"',
					'data-context="type"',
				'>',
				'<li>',
					'<a href="#" class="myds-dropdown dropdown-item" data-id="-1">',
					'All',
					'</a>',
				'</li>'
			]);

			_.each(taskTypes, function (type)
			{
				typesView.add({useTemplate: true, queue: 'learner-tasks-types'}, type)
			});

			typesView.add('</ul>');

			typesView.render('#learner-tasks-dashboard-types');

			app.invoke('learner-tasks-dashboard');
		}
	}
});

app.add(
{
	name: 'learner-tasks-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learner-tasks-dashboard',
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
			container: 'learner-tasks-dashboard-view',
			context: 'learner-tasks',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">There are no tasks for you that match this search.</div>',
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
					controller: 'learner-tasks-dashboard-format'
				},

				columns:
				[
					{
						caption: 'Subject',
						field: 'title',
						defaultSort: true,
						sortBy: true,
						class: 'col-sm-4 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="learner-task-summary"'
					},
					{
						caption: 'Status',
						field: 'statustext', 	
						sortBy: true,
						class: 'col-sm-2',
						data: 'data-id="{{guid}}"'
					},
					{
						caption: 'Priority',
						field: 'prioritytext', 	
						sortBy: true,
						class: 'col-sm-2',
						data: 'data-id="{{guid}}"'
					},
					{
						caption: '%',
						field: 'percentagecomplete', 	
						sortBy: true,
						class: 'col-sm-1 text-center',
						data: 'data-id="{{guid}}"'
					},
					{
						caption: 'Project',
						name: 'projectInfo',
						defaultSort: true,
						sortBy: true,
						class: 'col-sm-3 myds-navigate text-muted',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="learner-task-summary"'
					},
					{	
						fields:
						['type', 'typetext', 'taskbyuser', 'notes', 'taskbyusertext', 'status', 'projecttask.project.restrictedtoteam',
							'projecttask.project.description', 'guid']
					}

					// 'projecttask.taskbyuser.contactperson.firstname', 'projecttask.taskbyuser.contactperson.surname'
				]
			}
		});
	}
});


app.add(
{
	name: 'learner-tasks-dashboard-format',
	code: function (row)
	{
		var utilSetup = app.get({scope: 'util-setup'});

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

		row.projectIcon = '<i class="fa fa-users fa-fw"></i>'
		if (row['projecttask.project.restrictedtoteam'] == 'Y')
		{
			row.projectIcon = '<i class="fa fa-user fa-fw"></i>'
		}

		row.projectInfo = '<span class="mr-1">' + row['projecttask.project.description'] + '</span>' +
									'<span class="text-muted small">' + row.projectIcon + '</span>';


		//row.taskbyname = row['projecttask.taskbyuser.contactperson.firstname'] + ' ' + row['projecttask.taskbyuser.contactperson.surname']
	}
});

app.add(
{
	name: 'learner-task-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'learner-task-summary',
			context: 'id'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'learner-tasks'});
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
						'title',
						'description', 'projecttask.project.description', 'guid',
						'percentagecomplete',
						'projecttask.project.guid',
						'createduser', 'modifieduser', 'modifieddate', 'modifiedusertext',
						'projecttask.modifieduser.contactperson.firstname',
						'projecttask.modifieduser.contactperson.surname'
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
					callback: 'learner-task-summary'
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
						data._title = data.title;

						var actionTypes = app.whoami().mySetup.actionTypes;
						data['actiontype-reflectionbyselfonforgrowth'] = actionTypes.reflectionBySelfOnForGrowth;
						data['actiontype-reflectionbyselfongrowth'] = actionTypes.reflectionBySelfOnGrowth;
						data['actiontype-reflectionbyselfforgrowth'] = actionTypes.reflectionBySelfForGrowth;

						var skillsSet = app.whoami().mySetup.skillsSet;

						_.each(skillsSet.capacities, function (capacity, capacityName)
						{
							data['capacity-' + capacityName] = capacity.id;
							data['capacity-' + capacityName + '-url'] = capacity.url
						});

						if (_.isNotSet(data._title))
						{
							data._title = _.truncate(data.description, {
								'length': 25,
								'separator': ' '
							  });
						}

						data._taginfo = '';
						if (data.modifieduser != app.whoami().thisInstanceOfMe.user.id)
						{
							data._taginfo =
								'<div class="text-right">' +
									'<i class="fe fe-zap" style="color:#a0cced; font-size:1.4rem;"></i>' +
								'</div>' +
								'<div class="text-muted small text-right">' +	
									data['projecttask.modifieduser.contactperson.firstname'] + ' ' + data['projecttask.modifieduser.contactperson.surname'] +
										' &#x2022; ' + moment(data.modifieddate, 'D MMM YYYY hh:mm:ss').fromNow() +
								'</div>';
						}

						//app.invoke('util-date', {date: data.modifieddate, format: 'D MMM YYYY'}) +
						
						app.set(
						{
							scope: 'learner-task-summary',
							context: 'dataContext',
							value: data
						});

						app.invoke('util-attachments-initialise',
						{
							context: 'learner-task-summary',
							object: app.whoami().mySetup.objects.projectTask,
							objectContext: data.id,
							showTypes: false,
							collapsible: false
						});

						app.view.refresh(
						{
							scope: 'learner-task-summary',
							selector: '#learner-task-summary',
							data: data,
							collapse: {contexts: []}
						});

						app.invoke('util-view-select',
						{
							container: 'learner-task-summary-status',
							object: 'setup_project_task_status',
							fields: [{name: 'title'}]
						});

						app.invoke('util-actions-show',
						{
							dataContext:
							{
								container: 'learner-task-summary-actions-view',
								context: 'learner-task-summary',
								object: app.whoami().mySetup.objects.projectTask,
								objectcontext: data.id
							},
							status: 'shown'
						});

						app.invoke('learner-task-summary-skill-capacity-show');
					}
				}
			}
		}
	}	
});

app.add(
{
	name: 'learner-task-edit-status-save',
	code: function (param, response)
	{	
		var taskID = app.get(
		{
			scope: 'learner-task-summary',
			context: 'dataContext',
			name: 'id',
			valueDefault: ''
		});
	
		var dataStatus = app.get(
		{
			scope: 'learner-task-edit-status-' + taskID,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: taskID,
				values: {}
			}
		});

		var data =
		{
			id: taskID
		};

		if (_.isSet(dataStatus.percentagecomplete))
		{
			data.percentagecomplete = dataStatus.percentagecomplete
		}

		if (_.isSet(dataStatus.status))
		{
			data.status = dataStatus.status
		}

		if (_.isUndefined(response))
		{		
			mydigitalstructure.cloud.save(
			{
				object: 'project_task',
				data: data,
				callback: 'learner-task-edit-status-save',
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.refresh(
				{
					dataScope: 'learner-tasks',
					data: data
				});

				app.invoke('learner-task-edit-status-comment-save');
			}
		}
	}
});

app.add(
{
	name: 'learner-task-edit-status-comment-save',
	code: function (param, response)
	{	
		var taskID = app.get(
		{
			scope: 'learner-task-summary',
			context: 'dataContext',
			name: 'id',
			valueDefault: ''
		});
	
		var dataStatus = app.get(
		{
			scope: 'learner-task-edit-status-' + taskID,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: taskID,
				values: {}
			}
		});

		var dataTask = app.get(
		{
			scope: 'learner-task-summary',
			context: 'dataContext',
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: taskID,
				values: {}
			}
		});

		if (dataStatus.statuscomment == '')
		{
			app.invoke('learner-task-edit-status-save-complete');
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
				objectcontext: taskID,
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
					callback: 'learner-task-edit-status-comment-save',
				});
			}
			else
			{	
				app.invoke('learner-task-edit-status-save-complete');
			}
		}
	}
});

app.add(
{
	name: 'learner-task-edit-status-save-complete',
	code: function (param, response)
	{	
		app.notify('Task status updated.')

		var taskID = app.get(
		{
			scope: 'learner-task-summary',
			context: 'id',
			valueDefault: ''
		});

		app.invoke('learner-task-summary');
		//app.invoke('app-navigate-to', {scope: 'learner-task-summary', context: taskID});
	}
});

app.add(
{
	name: 'learner-task-summary-reflection-save',
	code: function (param, response)
	{	
		var taskID = app.get(
		{
			scope: 'learner-task-summary',
			context: 'dataContext',
			name: 'id',
			valueDefault: ''
		});
	
		var dataActionReflection = app.get(
		{
			scope: 'learner-task-summary-reflection-' + taskID,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				values:
				{
					object: 11,
					objectcontext: taskID,
					actionby: app.whoami().thisInstanceOfMe.user.user,
					contactperson: app.whoami().thisInstanceOfMe.user.contactperson,
					subject: 'Learner Reflection on a Project Task',
					status: 1,
					completed: moment().format('D MMM YYYY'),
					duedate: moment().format('D MMM YYYY')
				}
			}
		});

		if (_.isUndefined(response))
		{		
			mydigitalstructure.cloud.save(
			{
				object: 'action',
				data: dataActionReflection,
				callback: 'learner-task-summary-reflection-save',
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Reflection added.');

				var taskID = app.get(
				{
					scope: 'learner-task-summary',
					context: 'id',
					valueDefault: ''
				});

				app.invoke('learner-task-summary');
				//app.invoke('app-navigate-to', {scope: 'learner-task-summary', context: taskID});
			}
		}
	}
});

app.add(
{
	name: 'learner-task-summary-skill-capacity-show',
	code: function (param, response)
	{
		var task = app.get(
		{
			scope: 'learner-task-summary',
			context: 'dataContext',
		});

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'core_object_link',
				fields: 
				[
					'objectcontext',
					'createddate', 'modifieddate',
					'guid', 'notes'
				],
				filters:
				[
					{
						field: 'object',
						value: 410
					},
					{
						field: 'parentobject',
						value: app.whoami().mySetup.objects.projectTask
					},
					{
						field: 'parentobjectcontext',
						value: task.id
					}
				],
				sorts:
				[
					{
						field: 'id',
						direction: 'desc'
					}
				],
				rows: 1,
				callback: 'learner-task-summary-skill-capacity-show',
				callbackParam: param
			});
		}
		else
		{
			var taskSkillCapacity = _.first(response.data.rows);

			if (_.isSet(taskSkillCapacity))
			{
				$('#learner-task-summary-skill-capacity-' + taskSkillCapacity.objectcontext + '-' + task.id).attr('checked', 'checked');
			}
		}
	}
});

app.add(
{
	name: 'learner-task-summary-skill-capacity-save',
	code: function (param, response)
	{
		var task = app.get(
		{
			scope: 'learner-task-summary',
			context: 'dataContext',
		});

		var taskSummaryCapacity = app.get(
		{
			scope: 'learner-task-summary-skill-capacity-' + task.id
		});

		if (_.isNotSet(taskSummaryCapacity))
		{
			app.notify('You need to select a Skill Capacity.')
		}
		else
		{
			if (response == undefined)
			{
				entityos.cloud.save(
				{
					object: 'core_object_link',
					data:
					{
						parentobject: app.whoami().mySetup.objects.projectTask,
						parentobjectcontext: task.id,
						object: 410,
						objectcontext: taskSummaryCapacity.dataID,
						notes: ''
					},
					callback: 'learner-task-summary-skill-capacity-save'
				});
			}
			else
			{
				app.notify('Skill Capacity updated.')
			}
		}
	}
});





