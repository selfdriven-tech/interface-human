/*
	{
    	title: "Learning Partner; Dashboard",
    	design: ""
  	}
*/

app.add(
[
	{
		name: 'learning-partner-dashboard',
		code: function ()
		{
			var utilSetup = app.get(
			{
				scope: 'util-setup',
				valueDefault: {}
			});

			var whoAmI = app.whoami().thisInstanceOfMe.user;

			app.invoke('learning-partner-dashboard-profile-image');
			app.invoke('learning-partner-dashboard-wellbeing');

			app.invoke('util-dashboard',
			{
				dashboards:
				[
					{
						name: 'learning-partner-me-projects',
						containerSelector: '#learning-partner-me-dashboard-projects',
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
									value: app.whoami().mySetup.projectTypes.design
								},
								{
									field: 'createduser',
									value: app.whoami().thisInstanceOfMe.user.id
								}
							]
						}
					},
					{
						name: 'learning-partner-me-tasks',
						containerSelector: '#learning-partner-me-dashboard-tasks',
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
						name: 'learning-partner-me-teams',
						containerSelector: '#learning-partner-me-dashboard-teams',
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
						name: 'learning-partner-community-projects',
						containerSelector: '#learning-partner-community-dashboard-projects',
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
						name: 'learning-partner-community-tasks',
						containerSelector: '#learning-partner-community-dashboard-tasks',
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
						name: 'learning-partner-community-teams',
						containerSelector: '#learning-partner-community-dashboard-teams',
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
						name: 'learning-partner-dashboard-connections-learners',
						containerSelector: '#learning-partner-dashboard-connections-learners',
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
									field: 'othercontactperson',
									value: app.whoami().thisInstanceOfMe.user.contactperson
								},
								{
									field: 'type',
									comparison: 'IN_LIST',
									value: utilSetup.relationshipTypes.learningPartner
								}
							]
						}
					},
					{
						name: 'learning-partner-dashboard-connections-projects',
						containerSelector: '#learning-partner-dashboard-connections-projects',
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
									value: app.whoami().thisInstanceOfMe.user.contactperson
								}
							]
						}
					},
					{
						name: 'learning-partner-dashboard-connections-invites',
						containerSelector: '#learning-partner-dashboard-connections-invites',
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
									field: 'othercontactperson',
									value: app.whoami().thisInstanceOfMe.user.contactperson
								},
								{
									field: 'type',
									comparison: 'IN_LIST',
									value: '-1'
								}
							]
						}
					},
					{
						name: 'learning-partner-community-updates',
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
						renderController: 'learning-partner-community-dashboard-updates'
					}
				]
			});
		}
	}
]);

app.add(
{
	name: 'learning-partner-community-dashboard-updates',
	code: function (param, rows)
	{
		app.vq.init('#learning-partner-community-dashboard-updates',
		{
			queue: 'learning-partner-community-dashboard-updates',
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
                  '<button class="d-none mb-4 mt-2 btn btn-default btn-outline btn-xs myds-navigate" id="learning-partner-dashboard-community-updates-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="learning-partner-community-project-summary">View</button>',,
                '</div>',
              '</div>',
            '</div>'
      ];

		app.vq.add(template,
		{
			queue: 'learning-partner-community-dashboard-updates',
			type: 'template'
		});

		if (rows.length == 0)
		{
			app.vq.add('<div class="text-muted">No updates.</div>',
			{
				queue: 'learning-partner-community-dashboard-updates'
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
					queue: 'learning-partner-community-dashboard-updates',
					useTemplate: true
				},
				row);
			});
		}

		app.vq.render('#learning-partner-community-dashboard-updates',
		{
			queue: 'learning-partner-community-dashboard-updates'
		});
	}
});

app.add(
{
	name: 'learning-partner-dashboard-profile-image',
	code: function (param)
	{
		if (_.has(app.whoami().mySetup, 'images.profile'))
		{
			var profileImage = app.vq.init();

			var whoamiProfile = app.get(
			{
				scope: 'learner-me',
				context: 'whoami'
			});
		
			if (whoamiProfile._profileimage == '' || whoamiProfile._profileimage == undefined)
			{
				profileImage.add('<div class="text-center py-2"><a href="#learning-partner-me" class="text-muted"><i class="fas fa-portrait mr-1"></i> Add a profile image...</a></div>')
			}
			else
			{
				profileImage.add(['<a href="#learning-partner-me"><img class="img-fluid w-100 float-left" src="', whoamiProfile._profileimage, '"></a>'])
			}

			profileImage.render('#learning-partner-dashboard-profile-image-view');
		}
	}
});

app.add(
{
	name: 'learning-partner-dashboard-wellbeing',
	code: function (param, response)
	{
		var whoami = app.get(
		{
			scope: 'learner-me',
			context: 'whoami'
		});

		if (_.isNotSet(whoami._howgoing))
		{
			whoami._howgoing = 50
		}

		var howgoing = numeral(whoami._howgoing).value();
		$('#learning-partner-dashboard-wellbeing-howgoing').val(howgoing)

		app.refresh(
		{
			hide: '#learning-partner-community-dashboard-howgoing-reach-out-for-me, #learning-partner-community-dashboard-howgoing-reach-out-for-community, #learning-partner-community-dashboard-howgoing-stay-fit'
		});

		//0=Could be better
		//100=Going OK

		if (howgoing < 50) 
		{
			// reach out for others
			app.refresh(
			{
				show: '#learning-partner-community-dashboard-howgoing-reach-out-for-me',
				hide: '#learning-partner-community-dashboard-howgoing-reach-out-for-community, #learning-partner-community-dashboard-howgoing-stay-fit'
			});
		}
		else if (howgoing > 50)
		{
			//stay mentally fit
			app.refresh(
			{
				show: '#learning-partner-community-dashboard-howgoing-stay-fit',
				hide: '#learning-partner-community-dashboard-howgoing-reach-out-for-me, #learning-partner-community-dashboard-howgoing-reach-out-for-community'
			});
		}
	}
});

app.add(
	{
		name: 'learning-partner-dashboard-wellbeing-save',
		code: function (param, response)
		{
			var data = app.get(
			{
				scope: 'learning-partner-dashboard-wellbeing'
			});

			var whoami = app.get(
			{
				scope: 'learner-me',
				context: 'whoami'
			});

			if (_.isUndefined(response))
			{
				if (data._howgoing != undefined)
				{
					app.set(
					{
						scope: 'learner-me',
						context: 'whoami',
						name: '_howgoing',
						value: data._howgoing
					});

					app.invoke('learning-partner-dashboard-wellbeing');

					mydigitalstructure.update(
					{
						object: 'contact_person',
						data: {id: whoami.id, _howgoing: data._howgoing},
						callback: 'learning-partner-dashboard-wellbeing'
					});
				}
			}
			else
			{	
				if (response.status == 'OK')
				{
					//app.invoke('learning-partner-dashboard-wellbeing-followup')  // if value greater that X, do this
					app.notify('How you going updated.');
				}
			}
		}
	});