/*
	{
    	title: "Projects; Dashboard",
    	design: ""
  	}
*/

app.add(
[
	{
		name: 'projects-dashboard',
		code: function ()
		{
			var utilSetup = app.get({scope: 'util-setup'});

			var whoAmI = app.whoami().thisInstanceOfMe.user;

			//app.invoke('projects-dashboard-profile-image');
			//app.invoke('projects-dashboard-wellbeing');

			app.invoke('util-dashboard',
			{
				dashboards:
				[
					{
						name: 'projects-feed',
						containerSelector: '#projects-dashboard-feed',
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
								},
								{
									field: 'status',
									comparison: 'NOT_IN_LIST',
									value: utilSetup.taskStatuses.closed
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
							}
						]
					},
					{
						name: 'projects-dashboard-tokens-earned',
						containerSelector: '#projects-dashboard-tokens-earned',
						template: '{{total}}',
						formatController: 'projects-dashboard-tokens-format',
						storage:
						{
							object: 'action',
							fields:
							[
								{name: 'sum(totaltimehrs) total'}
							],
							filters:
							[
								{
									field: 'contactperson',
									value: app.whoami().thisInstanceOfMe.user.contactperson
								},
								{
									field: 'type',
									comparison: 'IN_LIST',
									value: app.whoami().mySetup.actionTypes.sdc
								}
							]
						}
					},
					{
						name: 'projects-dashboard-tokens-used',
						containerSelector: '#projects-dashboard-tokens-used',
						template: '{{total}}',
						formatController: 'projects-dashboard-tokens-format',
						storage:
						{
							object: 'action',
							fields:
							[
								{name: 'sum(totaltimehrs) total'}
							],
							filters:
							[
								{
									field: 'contactperson',
									value: app.whoami().thisInstanceOfMe.user.contactperson
								},
								{
									field: 'type',
									comparison: 'IN_LIST',
									value: app.whoami().mySetup.actionTypes.sdcUse
								}
							]
						}
					},
					{
						name: 'projects-me-projects',
						containerSelector: '#projects-me-dashboard-projects',
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
									field: 'restrictedtoteam',
									value: 'Y'
								}
							]
						}
					},
					{
						name: 'projects-me-tasks',
						containerSelector: '#projects-me-dashboard-tasks',
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
								}
							]
						}
					},
					{
						name: 'projects-me-dashboard-tasks-overdue',
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
									$('#projects-me-dashboard-tasks-overdue-label').addClass('label-success').removeClass('label-danger')
								}
							},
							{
								when: function (data)
								{
									return (data.count != 0)
								},
								do: function (param, data)
								{
									$('#projects-me-dashboard-tasks-overdue-label').removeClass('label-success').addClass('label-danger')
								}
							}
						]
					},
					{
						name: 'projects-me-dashboard-connections',
						containerSelector: '#projects-me-dashboard-connections',
						template: '{{count}}',
						storage:
						{
							object: 'contact_relationship',
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
						name: 'projects-me-dashboard-achievements',
						containerSelector: '#projects-me-dashboard-achievements',
						template: '{{count}}',
						storage:
						{
							object: 'action',
							fields:
							[
								{name: 'count(id) count'}
							],
							filters:
							[
								{	
									field: 'actiontype',
									comparison: 'IN_LIST',
									value: app.whoami().mySetup.actionTypes.achievement
								},
								{
									field: 'contactperson',
									value: app.whoami().thisInstanceOfMe.user.contactperson
								}
							]
						}
					},
					{
						name: 'projects-me-dashboard-reflections',
						containerSelector: '#projects-me-dashboard-reflections',
						template: '{{count}}',
						storage:
						{
							object: 'action',
							fields:
							[
								{name: 'count(id) count'}
							],
							filters:
							[
								{	
									field: 'actiontype',
									comparison: 'IN_LIST',
									value: app.whoami().mySetup.actionTypes.reflection
								},
								{
									field: 'contactperson',
									value: app.whoami().thisInstanceOfMe.user.contactperson
								}
							]
						}
					},
					{
						name: 'projects-me-dashboard-endorsements',
						containerSelector: '#projects-me-dashboard-endorsements',
						template: '{{count}}',
						storage:
						{
							object: 'action',
							fields:
							[
								{name: 'count(id) count'}
							],
							filters:
							[
								{	
									field: 'actiontype',
									comparison: 'IN_LIST',
									value: app.whoami().mySetup.actionTypes.endorsement
								},
								{
									field: 'contactperson',
									value: app.whoami().thisInstanceOfMe.user.contactperson
								}
							]
						}
					},
					{
						name: 'projects-me-check-ins',
						containerSelector: '#projects-me-dashboard-check-ins',
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
									field: 'restrictedtoteam',
									value: 'Y'
								},
								{
									field: 'createduser',
									value: app.whoami().thisInstanceOfMe.user.id
								},
								{
									field: 'type',
									value: app.whoami().mySetup.projectTypes.management
								},
								{
									field: 'subtype',
									value: app.whoami().mySetup.projectSubTypes.managementCheckIn
								}
							]
						}
					},
					{
						name: 'projects-community-projects',
						containerSelector: '#projects-community-dashboard-projects',
						template: '{{count}}',
						storage:
						{
							object: 'project',
							fields:
							[
								{name: 'count(id) count'}
							]
						}
					},
					{
						name: 'projects-community-tasks',
						containerSelector: '#projects-community-dashboard-tasks',
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
						name: 'projects-community-teams',
						containerSelector: '#projects-community-dashboard-teams',
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
						name: 'projects-community-documents',
						containerSelector: '#projects-community-dashboard-documents',
						template: '{{count}}',
						storage:
						{
							object: 'document',
							fields:
							[
								{name: 'count(id) count'}
							],
							filters:
							[
								{
									field: 'url',
									comparison: 'TEXT_IS_EMPTY'
								}
							]
						}
					},
					{
						name: 'projects-community-updates',
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
						renderController: 'projects-community-dashboard-updates'
					}
				]
			});
		}
	}
]);

app.add(
{
	name: 'projects-dashboard-tokens-format',
	code: function (param, data)
	{
		data.total = numeral(data.total).format('0');
	}
});
	
app.add(
{
	name: 'projects-community-dashboard-updates',
	code: function (param, rows)
	{
		app.vq.init('#projects-community-dashboard-updates',
		{
			queue: 'projects-community-dashboard-updates',
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
                  '<button class="d-none mb-4 mt-2 btn btn-default btn-outline btn-xs myds-navigate" id="projects-dashboard-community-updates-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="projects-community-project-summary">View</button>',,
                '</div>',
              '</div>',
            '</div>'
      ];

		app.vq.add(template,
		{
			queue: 'projects-community-dashboard-updates',
			type: 'template'
		});

		if (rows.length == 0)
		{
			app.vq.add('<div class="text-muted">No updates.</div>',
			{
				queue: 'projects-community-dashboard-updates'
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
					queue: 'projects-community-dashboard-updates',
					useTemplate: true
				},
				row);
			});
		}

		app.vq.render('#projects-community-dashboard-updates',
		{
			queue: 'projects-community-dashboard-updates'
		});
	}
});

app.add(
{
	name: 'projects-dashboard-profile-image',
	code: function (param)
	{
		if (_.has(app.whoami().mySetup, 'images.profile'))
		{
			var profileImage = app.vq.init();

			var whoamiProfile = app.get(
			{
				scope: 'projects-me',
				context: 'whoami'
			});
		
			if (whoamiProfile._profileimage == '' || whoamiProfile._profileimage == undefined)
			{
				profileImage.add('<div class="text-center py-2"><a href="#projects-me" class="text-muted"><i class="fas fa-portrait mr-1"></i> Add a profile image...</a></div>')
			}
			else
			{
				profileImage.add(['<a href="#projects-me"><img class="img-fluid w-100 float-left" src="', whoamiProfile._profileimage, '"></a>'])
			}

			profileImage.render('#projects-dashboard-profile-image-view');
		}
	}
});

app.add(
{
	name: 'projects-dashboard-wellbeing',
	code: function (param, response)
	{
		var whoami = app.get(
		{
			scope: 'projects-me',
			context: 'whoami'
		});

		if (_.isNotSet(whoami._howgoing))
		{
			whoami._howgoing = 50
		}

		var howgoing = numeral(whoami._howgoing).value();
		$('#projects-dashboard-wellbeing-howgoing').val(howgoing)

		app.refresh(
		{
			hide: '#projects-community-dashboard-howgoing-reach-out-for-me, #projects-community-dashboard-howgoing-reach-out-for-community, #projects-community-dashboard-howgoing-stay-fit'
		});

		//0=Could be better
		//100=Going OK

		if (howgoing < 50) 
		{
			// reach out for others
			app.refresh(
			{
				show: '#projects-community-dashboard-howgoing-reach-out-for-me',
				hide: '#projects-community-dashboard-howgoing-reach-out-for-community, #projects-community-dashboard-howgoing-stay-fit'
			});
		}
		else if (howgoing >= 50)
		{
			//stay mentally fit
			app.refresh(
			{
				show: '#projects-community-dashboard-howgoing-stay-fit',
				hide: '#projects-community-dashboard-howgoing-reach-out-for-me, #projects-community-dashboard-howgoing-reach-out-for-community'
			});
		}
	}
});

app.add(
	{
		name: 'projects-dashboard-wellbeing-save',
		code: function (param, response)
		{
			var data = app.get(
			{
				scope: 'projects-dashboard-wellbeing'
			});

			app.invoke('projects-wellbeing-how-going-save',
			{
				howgoing: data._howgoing
			});

		/* 	var whoami = app.get(
			{
				scope: 'projects-me',
				context: 'whoami'
			});

			if (_.isUndefined(response))
			{
				if (data._howgoing != undefined)
				{
					app.set(
					{
						scope: 'projects-me',
						context: 'whoami',
						name: '_howgoing',
						value: data._howgoing
					});

					app.invoke('projects-dashboard-wellbeing');

					mydigitalstructure.update(
					{
						object: 'contact_person',
						data: {id: whoami.id, _howgoing: data._howgoing},
						callback: 'projects-dashboard-wellbeing'
					});
				}
			}
			else
			{	
				if (response.status == 'OK')
				{
					//app.invoke('projects-dashboard-wellbeing-followup')  // if value greater that X, do this
					app.notify('How you going updated.');
				}
			} */
		}
	});