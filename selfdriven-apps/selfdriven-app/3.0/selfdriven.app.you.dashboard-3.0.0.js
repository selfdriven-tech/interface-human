/*
	{
    	title: "You; Dashboard",
    	design: ""
  	}
*/

app.add(
[
	{
		name: 'you-dashboard',
		code: function ()
		{
			//app.invoke('you-dashboard-profile-image');
			//app.invoke('you-dashboard-wellbeing');

			app.invoke('you-init');
			app.invoke('you-project-init',
			{
				onComplete: 'you-dashboard-show'
			});
		}
	},
	{
		name: 'you-dashboard-show',
		code: function ()
		{
			var utilSetup = app.get({scope: 'util-setup'});
			var whoAmI = app.whoami().thisInstanceOfMe.user;
			var levelUpProfileProject = app.whoami().mySetup.levelUp.managementProject;

			$('#you-dashboard-connections').attr('href', '#' + app.whoami().thisInstanceOfMe._userRole + '-connections');

			if (_.isSet(mydigitalstructure._scope.space.logoattachmentdownload))
			{
				$('#you-dashboard-header-view-1').addClass('col-md-9');
				$('#you-dashboard-header-view-2').addClass('col-md-3').html(
					'<a href="' + mydigitalstructure._scope.space.website + '" target="_blank">' +
						'<img class="img-fluid w-100 shadow-lg rounded-lg mb-4"' +
							' src="' + mydigitalstructure._scope.space.logoattachmentdownload + '">' +
					'</a>');				
			}

			var dashboards =
			[
				{
					name: 'you-dashboard-feed',
					containerSelector: '#you-dashboard-feed',
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
					name: 'you-dashboard-feed-you-profile',
					containerSelector: '#you-dashboard-feed-you-profile',
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
					name: 'you-projects',
					containerSelector: '#you-dashboard-projects',
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
								field: 'projectmanager',
								value: app.whoami().thisInstanceOfMe.user.id
							},
							{
								field: 'type',
								comparison: 'NOT_EQUAL_TO',
								value: app.whoami().mySetup.projectTypes.management
							}
						]
					}
				},
				{
					name: 'you-projects-challenges',
					containerSelector: '#you-dashboard-projects-challenges',
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
								field: 'projectmanager',
								value: app.whoami().thisInstanceOfMe.user.id
							},
							{
								field: 'type',
								comparison: 'NOT_EQUAL_TO',
								value: app.whoami().mySetup.projectTypes.management
							},
							{
								field: 'subtype',
								value: app.whoami().mySetup.projectSubTypes.learningLevelUp
							}
						]
					}
				},
				{
					name: 'you-dashboard-connections',
					containerSelector: '#you-dashboard-connections',
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
				}
			]

			if (app.whoami().thisInstanceOfMe._userRole == 'learning-partner')
			{
				dashboards.push(
				{
					name: 'you-dashboard-connections-learning-partner',
					containerSelector: '#you-dashboard-connections-learning-partner',
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
								value: whoAmI.contactperson
							}
						]
					}
				});

				if ($('#you-dashboard-connections-learning-partner').length == 0)
				{
					app.show('#you-dashboard-connections-view',
					[
						'<div class="col-12 col-sm-6 px-0">',
							'<h1 class="p-0 mb-2" style="font-size: 3rem;"><a href="#learning-partner-connections"',
									' id="you-dashboard-connections-learning-partner">...</a></h1>',
							' <small class="text-muted">Learners</small>',
						'</div>',
						'<div class="col-12 col-sm-6 px-0">',
							'<h1 class="p-0 mb-2" style="font-size: 3rem;"><a href="#learner-connections"',
									' id="you-dashboard-connections">...</a></h1>',
							' <small class="text-muted">Learning Partners</small>',
						'</div>'
					]);
				}
			}
			app.invoke('util-dashboard',
			{
				dashboards: dashboards
			});
		}
	}
]);

app.add(
{
	name: 'you-dashboard-tokens-format',
	code: function (param, data)
	{
		data.total = numeral(data.total).format('0');
	}
});
	
app.add(
{
	name: 'you-community-dashboard-updates',
	code: function (param, rows)
	{
		app.vq.init('#you-community-dashboard-updates',
		{
			queue: 'you-community-dashboard-updates',
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
                  '<button class="d-none mb-4 mt-2 btn btn-default btn-outline btn-xs myds-navigate" id="you-dashboard-community-updates-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="you-community-project-summary">View</button>',,
                '</div>',
              '</div>',
            '</div>'
      ];

		app.vq.add(template,
		{
			queue: 'you-community-dashboard-updates',
			type: 'template'
		});

		if (rows.length == 0)
		{
			app.vq.add('<div class="text-muted">No updates.</div>',
			{
				queue: 'you-community-dashboard-updates'
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
					queue: 'you-community-dashboard-updates',
					useTemplate: true
				},
				row);
			});
		}

		app.vq.render('#you-community-dashboard-updates',
		{
			queue: 'you-community-dashboard-updates'
		});
	}
});

app.add(
{
	name: 'you-dashboard-profile-image',
	code: function (param)
	{
		if (_.has(app.whoami().mySetup, 'images.profile'))
		{
			var profileImage = app.vq.init();

			var whoamiProfile = app.get(
			{
				scope: 'you-me',
				context: 'whoami'
			});
		
			if (whoamiProfile._profileimage == '' || whoamiProfile._profileimage == undefined)
			{
				profileImage.add('<div class="text-center py-2"><a href="#you-me" class="text-muted"><i class="fas fa-portrait mr-1"></i> Add a profile image...</a></div>')
			}
			else
			{
				profileImage.add(['<a href="#you-me"><img class="img-fluid w-100 float-left" src="', whoamiProfile._profileimage, '"></a>'])
			}

			profileImage.render('#you-dashboard-profile-image-view');
		}
	}
});

app.add(
{
	name: 'you-dashboard-wellbeing',
	code: function (param, response)
	{
		var whoami = app.get(
		{
			scope: 'you-me',
			context: 'whoami'
		});

		if (_.isNotSet(whoami._howgoing))
		{
			whoami._howgoing = 50
		}

		var howgoing = numeral(whoami._howgoing).value();
		$('#you-dashboard-wellbeing-howgoing').val(howgoing)

		app.refresh(
		{
			hide: '#you-community-dashboard-howgoing-reach-out-for-me, #you-community-dashboard-howgoing-reach-out-for-community, #you-community-dashboard-howgoing-stay-fit'
		});

		//0=Could be better
		//100=Going OK

		if (howgoing < 50) 
		{
			// reach out for others
			app.refresh(
			{
				show: '#you-community-dashboard-howgoing-reach-out-for-me',
				hide: '#you-community-dashboard-howgoing-reach-out-for-community, #you-community-dashboard-howgoing-stay-fit'
			});
		}
		else if (howgoing >= 50)
		{
			//stay mentally fit
			app.refresh(
			{
				show: '#you-community-dashboard-howgoing-stay-fit',
				hide: '#you-community-dashboard-howgoing-reach-out-for-me, #you-community-dashboard-howgoing-reach-out-for-community'
			});
		}
	}
});

app.add(
	{
		name: 'you-dashboard-wellbeing-save',
		code: function (param, response)
		{
			var data = app.get(
			{
				scope: 'you-dashboard-wellbeing'
			});

			app.invoke('you-wellbeing-how-going-save',
			{
				howgoing: data._howgoing
			});

		/* 	var whoami = app.get(
			{
				scope: 'you-me',
				context: 'whoami'
			});

			if (_.isUndefined(response))
			{
				if (data._howgoing != undefined)
				{
					app.set(
					{
						scope: 'you-me',
						context: 'whoami',
						name: '_howgoing',
						value: data._howgoing
					});

					app.invoke('you-dashboard-wellbeing');

					mydigitalstructure.update(
					{
						object: 'contact_person',
						data: {id: whoami.id, _howgoing: data._howgoing},
						callback: 'you-dashboard-wellbeing'
					});
				}
			}
			else
			{	
				if (response.status == 'OK')
				{
					//app.invoke('you-dashboard-wellbeing-followup')  // if value greater that X, do this
					app.notify('How you going updated.');
				}
			} */
		}
	});

