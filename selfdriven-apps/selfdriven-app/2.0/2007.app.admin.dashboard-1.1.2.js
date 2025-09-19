/*
	{
    	title: "Admin; Dashboard",
    	design: ""
  	}
*/

app.add(
[
	{
		name: 'admin-dashboard',
		code: function ()
		{
			var utilSetup = app.get(
			{
				scope: 'util-setup',
				valueDefault: {}
			});

			var whoAmI = app.whoami().thisInstanceOfMe.user;

			var learnerWhoAmI = app.get(
			{
				scope: 'learner-me',
				context: 'whoami'
			});

			app.show('#admin-dashboard-me-profile-image',
				[
					'<button class="btn btn-default btn-outline btn-rounded btn-lg" style="padding:0px;">',
						'<img style="height:39px; width:39px;" class="img-fluid rounded-circle float-left" src="',
						learnerWhoAmI._profileimage,
					'"></button>'
				])

			app.invoke('util-dashboard',
			{
				dashboards:
				[
					{
						name: 'admin-me-tasks',
						containerSelector: '#admin-me-dashboard-tasks',
						template: '{{count}}',
						storage:
						{
							object: 'project_task',
							fields:
							[
								{name: 'count(id) count'}
							],
							filters:
							[
								{
									field: 'taskby',
									value: whoAmI.user
								},
								{
									field: 'status',
									comparison: 'IN_LIST',
									value: utilSetup.taskStatuses.closed
								}
							]
						}
					},
					{
						name: 'admin-me-dashboard-tasks-overdue',
						template: '{{count}}',
						storage:
						{
							object: 'project_task',
							fields:
							[
								{name: 'count(id) count'}
							],
							filters:
							[
								{
									field: 'taskby',
									value: whoAmI.user
								},
								{
									field: 'status',
									comparison: 'NOT_IN_LIST',
									value: utilSetup.taskStatuses.closed
								},
								{
									field: 'startdate',
									comparison: 'LESS_THAN',
									value: app.invoke('util-date')
								}
							]
						},
						styles:
						[
							{
								when: function (data)
								{
									return (data.count != 0)
								},
								class: 'text-danger'
							},
							{
								when: function (data)
								{
									return (data.count == 0)
								},
								do: function (param, data)
								{
									$('#admin-me-dashboard-tasks-overdue-label').addClass('label-success').removeClass('label-danger')
								}
							},
							{
								when: function (data)
								{
									return (data.count != 0)
								},
								do: function (param, data)
								{
									$('#admin-me-dashboard-tasks-overdue-label').removeClass('label-success').addClass('label-danger')
								}
							}
						]
					},
					{
						name: 'admin-me-dashboard-tasks-due-soon',
						template: '{{count}}',
						storage:
						{
							object: 'project_task',
							fields:
							[
								{name: 'count(id) count'}
							],
							filters:
							[
								{
									field: 'taskby',
									value: whoAmI.user
								},
								{
									field: 'status',
									comparison: 'NOT_IN_LIST',
									value: utilSetup.taskStatuses.closed
								},
								{
									field: 'startdate',
									comparison: 'GREATER_THAN',
									value: app.invoke('util-date', {set: {duration: -3}})
								},
								{
									field: 'startdate',
									comparison: 'LESS_THAN',
									value: app.invoke('util-date')
								}
							]
						},
						styles:
						[
							{
								when: function (data)
								{
									return (data.count != 0)
								},
								class: 'text-danger'
							},
							{
								when: function (data)
								{
									return (data.count == 0)
								},
								do: function (param, data)
								{
									$('#admin-me-dashboard-tasks-due-soon-label').addClass('label-success').removeClass('label-danger')
								}
							},
							{
								when: function (data)
								{
									return (data.count != 0)
								},
								do: function (param, data)
								{
									$('#admin-me-dashboard-tasks-due-soon-label').removeClass('label-success').addClass('label-danger')
								}
							}
						]
					},
					{
						name: 'admin-me-teams',
						containerSelector: '#admin-me-dashboard-teams',
						template: '{{count}}',
						storage:
						{
							object: 'project_team',
							fields:
							[
								{name: 'count(id) count'}
							],
							filters:
							[
								{
									field: 'contactperson',
									value: whoAmI.contactperson
								}
							]
						}
					},
					{
						name: 'admin-community-members',
						containerSelector: '#admin-community-dashboard-members',
						template: '{{count}}',
						storage:
						{
							object: 'contact_person',
							fields:
							[
								{name: 'count(id) count'}
							],
							filters:
							[			
								{	
									field: 'customerstatus',
									comparison: 'IN_LIST',
									value: '1,5'
								}
							]
						}
					},
					{
						name: 'admin-community-projects',
						containerSelector: '#admin-community-dashboard-projects',
						template: '{{count}}',
						storage:
						{
							object: 'project',
							fields:
							[
								{name: 'count(id) count'}
							],
							filters:
							[			
								{	
									field: 'type',
									comparison: 'IN_LIST',
									value: utilSetup.projectTypes.environment
								}
							]
						}
					},
					{
						name: 'admin-community-tasks',
						containerSelector: '#admin-community-dashboard-tasks',
						template: '{{count}}',
						storage:
						{
							object: 'project_task',
							fields:
							[
								{name: 'count(id) count'}
							]
						}
					},
					{
						name: 'admin-community-dashboard-tasks-overdue',
						template: '{{count}}',
						storage:
						{
							object: 'project_task',
							fields:
							[
								{name: 'count(id) count'}
							],
							filters:
							[
								{
									field: 'status',
									comparison: 'NOT_IN_LIST',
									value: utilSetup.taskStatuses.closed
								},
								{
									field: 'startdate',
									comparison: 'LESS_THAN',
									value: app.invoke('util-date')
								}
							]
						},
						styles:
						[
							{
								when: function (data)
								{
									return (data.count != 0)
								},
								class: 'text-danger'
							},
							{
								when: function (data)
								{
									return (data.count == 0)
								},
								do: function (param, data)
								{
									$('#admin-community-dashboard-tasks-overdue-label').addClass('label-success').removeClass('label-danger')
								}
							},
							{
								when: function (data)
								{
									return (data.count != 0)
								},
								do: function (param, data)
								{
									$('#admin-community-dashboard-tasks-overdue-label').removeClass('label-success').addClass('label-danger')
								}
							}
						]
					},
					{
						name: 'admin-community-dashboard-tasks-due-soon',
						template: '{{count}}',
						storage:
						{
							object: 'project_task',
							fields:
							[
								{name: 'count(id) count'}
							],
							filters:
							[
								{
									field: 'status',
									comparison: 'NOT_IN_LIST',
									value: utilSetup.taskStatuses.closed
								},
								{
									field: 'startdate',
									comparison: 'GREATER_THAN',
									value: app.invoke('util-date', {set: {duration: -5}})
								},
								{
									field: 'startdate',
									comparison: 'LESS_THAN',
									value: app.invoke('util-date')
								}
							]
						},
						styles:
						[
							{
								when: function (data)
								{
									return (data.count != 0)
								},
								class: 'text-warning'
							},
							{
								when: function (data)
								{
									return (data.count == 0)
								},
								do: function (param, data)
								{
									$('#admin-community-dashboard-tasks-due-soon-label').addClass('label-success').removeClass('label-warning')
								}
							},
							{
								when: function (data)
								{
									return (data.count != 0)
								},
								do: function (param, data)
								{
									$('#admin-community-dashboard-tasks-due-soon-label').removeClass('label-success').addClass('label-warning')
								}
							}
						]
					},
					{
						name: 'admin-community-teams',
						containerSelector: '#admin-community-dashboard-teams',
						template: '{{count}}',
						storage:
						{
							object: 'project',
							fields:
							[
								{name: 'count(id) count'}
							],
							filters:
							[
								{
									field: 'type',
									value: utilSetup.projectTypes.facilitation
								}
							]
						}
					},
					{
						name: 'admin-users',
						containerSelector: '#admin-dashboard-users',
						template: '{{count}}',
						disabled: true,
						storage:
						{
							object: 'setup_user',
							fields:
							[
								{name: 'count(id) count'}
							],
							filters:
							[
								{
									field: 'disabled',
									value: 'N'
								}
							]
						}
					},
					{
						name: 'admin-community-events',
						containerSelector: '#admin-community-dashboard-events',
						template: '{{count}}',
						storage:
						{
							object: 'event',
							fields:
							[
								{name: 'count(id) count'}
							]
						}
					},
					{
						name: 'admin-community-feedback',
						containerSelector: '#admin-community-dashboard-feedback',
						template: '{{count}}',
						storage:
						{
							object: 'opportunity',
							fields:
							[
								{name: 'count(id) count'}
							]
						}
					},
					{
						name: 'admin-community-docs',
						containerSelector: '#admin-community-dashboard-docs',
						template: '{{count}}',
						storage:
						{
							object: 'document',
							fields:
							[
								{name: 'count(id) count'}
							]
						}
					},
					{
						name: 'admin-community-updates',
						multiple: true,
						storage:
						{
							object: 'action',
							fields: ['completed', 'actionreference', 'description', 'actionbytext', 'actionbytext',
											'action.contactperson.firstname', 'action.contactperson.surname', 'action.contactperson.email'],
							filters:
							[
								{
									field: 'object',
									value: 11
								},
								{
									field: 'actiontype',
									value: utilSetup.actionTypes.taskStatusUpdate
								},
								{
									field: 'status',
									value: 1
								}
							],
							sorts: [{field: 'completed', direction: 'desc'}],
							rows: 5,
							options:
							{
								noDataText: 'No updates.'
							},
							filters:
							[
								{
									field: 'completed',
									comparison: 'GREATER_THAN_OR_EQUAL_TO',
									value: moment().add(-2, 'day').format('D MMM YYYY')
								},
								{
									field: 'actiontype',
									value: utilSetup.actionTypes.taskStatusUpdate
								}
							]
						},
						renderController: 'admin-community-dashboard-updates'
					}
				]
			});
		}
	}
]);

app.add(
{
	name: 'admin-community-dashboard-updates',
	code: function (param, rows)
	{
		app.vq.init('#admin-community-dashboard-updates',
		{
			queue: 'admin-community-dashboard-updates',
			working: true
		});

		var template =
		[
			'<div class="timeline-item">',
              '<div class="row">',
                '<div class="col-5 date">',
                  '<i class="far fa-calendar-alt text-muted"></i>',
                  '<div>{{completed}}</div>',
                  '<div class="text-muted small">{{action.contactperson.firstname}}</div>',
                  '<div class="text-muted small">{{action.contactperson.surname}}</div>',
                '</div>',
                '<div class="col content mb-2">',
                 	'<div class="font-weight-bold mb-1">{{description}}</div>',
                  '<div class="text-muted small mb-1">{{tasktext}}</div>',
                  '<div class="text-muted small">{{projecttext}}</div>',
                  '<button class="d-none mb-4 mt-2 btn btn-default btn-outline btn-xs myds-navigate" id="admin-dashboard-community-updates-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="admin-community-project-summary">View</button>',,
                '</div>',
              '</div>',
            '</div>'
      ];

		app.vq.add(template,
		{
			queue: 'admin-community-dashboard-updates',
			type: 'template'
		});

		if (rows.length == 0)
		{
			app.vq.add('<div class="text-muted">No updates.</div>',
			{
				queue: 'admin-community-dashboard-updates'
			});
		}
		else
		{
			_.each(rows, function (row)
			{
				row.dayssince = moment(row.completed, app.options.dateFormats).fromNow();
				row._actionreference = _.split(row.actionreference, '|');
				row.projecttext = '';
				row.tasktext = '';

				if (row._actionreference.length > 1)
				{
					row.projecttext = row._actionreference[1];
				}

				if (row._actionreference.length > 2)
				{
					row.tasktext = _.truncate(row._actionreference[2], {length: 70, separate: ' '});
				}

				app.vq.add(
				{
					queue: 'admin-community-dashboard-updates',
					useTemplate: true
				},
				row);
			});
		}

		app.vq.render('#admin-community-dashboard-updates',
		{
			queue: 'admin-community-dashboard-updates'
		});
	}
});