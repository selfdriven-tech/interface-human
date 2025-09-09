/*
	{
    	title: "Learner; Next Steps",
    	design: ""
  	}
*/

app.add(
[
	{
		name: 'next-steps-dashboard',
		code: function ()
		{
			app.invoke('next-steps-me-dashboard-next-applications');

			app.invoke('util-dashboard',
			{
				dashboards:
				[
					{
						name: 'next-steps-me-dashboard-achievements',
						containerSelector: '#next-steps-me-dashboard-achievements',
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
						name: 'next-steps-me-dashboard-reflections',
						containerSelector: '#next-steps-me-dashboard-reflections',
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
						name: 'next-steps-me-dashboard-endorsements',
						containerSelector: '#next-steps-me-dashboard-endorsements',
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
						name: 'next-steps-me-next',
						containerSelector: '#next-steps-me-dashboard-next',
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
									value: app.whoami().mySetup.projectSubTypes.managementNextSteps
								}
							]
						}
					}
				]
			});
		}
	}
]);

app.add(
{
	name: 'next-steps-dashboard-tokens-format',
	code: function (param, data)
	{
		data.total = numeral(data.total).format('0');
	}
});
	
app.add(
{
	name: 'next-steps-community-dashboard-updates',
	code: function (param, rows)
	{
		app.vq.init('#next-steps-community-dashboard-updates',
		{
			queue: 'next-steps-community-dashboard-updates',
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
                  '<button class="d-none mb-4 mt-2 btn btn-default btn-outline btn-xs myds-navigate" id="next-steps-dashboard-community-updates-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="next-steps-community-project-summary">View</button>',,
                '</div>',
              '</div>',
            '</div>'
      ];

		app.vq.add(template,
		{
			queue: 'next-steps-community-dashboard-updates',
			type: 'template'
		});

		if (rows.length == 0)
		{
			app.vq.add('<div class="text-muted">No updates.</div>',
			{
				queue: 'next-steps-community-dashboard-updates'
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
					queue: 'next-steps-community-dashboard-updates',
					useTemplate: true
				},
				row);
			});
		}

		app.vq.render('#next-steps-community-dashboard-updates',
		{
			queue: 'next-steps-community-dashboard-updates'
		});
	}
});

app.add(
{
	name: 'next-steps-dashboard-profile-image',
	code: function (param)
	{
		if (_.has(app.whoami().mySetup, 'images.profile'))
		{
			var profileImage = app.vq.init();

			var whoamiProfile = app.get(
			{
				scope: 'next-steps-me',
				context: 'whoami'
			});
		
			if (whoamiProfile._profileimage == '' || whoamiProfile._profileimage == undefined)
			{
				profileImage.add('<div class="text-center py-2"><a href="#next-steps-me" class="text-muted"><i class="fas fa-portrait mr-1"></i> Add a profile image...</a></div>')
			}
			else
			{
				profileImage.add(['<a href="#next-steps-me"><img class="img-fluid w-100 float-left" src="', whoamiProfile._profileimage, '"></a>'])
			}

			profileImage.render('#next-steps-dashboard-profile-image-view');
		}
	}
});

app.add(
{
	name: 'next-steps-dashboard-wellbeing',
	code: function (param, response)
	{
		var whoami = app.get(
		{
			scope: 'next-steps-me',
			context: 'whoami'
		});

		if (_.isNotSet(whoami._howgoing))
		{
			whoami._howgoing = 50
		}

		var howgoing = numeral(whoami._howgoing).value();
		$('#next-steps-dashboard-wellbeing-howgoing').val(howgoing)

		app.refresh(
		{
			hide: '#next-steps-community-dashboard-howgoing-reach-out-for-me, #next-steps-community-dashboard-howgoing-reach-out-for-community, #next-steps-community-dashboard-howgoing-stay-fit'
		});

		//0=Could be better
		//100=Going OK

		if (howgoing < 50) 
		{
			// reach out for others
			app.refresh(
			{
				show: '#next-steps-community-dashboard-howgoing-reach-out-for-me',
				hide: '#next-steps-community-dashboard-howgoing-reach-out-for-community, #next-steps-community-dashboard-howgoing-stay-fit'
			});
		}
		else if (howgoing >= 50)
		{
			//stay mentally fit
			app.refresh(
			{
				show: '#next-steps-community-dashboard-howgoing-stay-fit',
				hide: '#next-steps-community-dashboard-howgoing-reach-out-for-me, #next-steps-community-dashboard-howgoing-reach-out-for-community'
			});
		}
	}
});

app.add(
{
	name: 'next-steps-dashboard-wellbeing-save',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'next-steps-dashboard-wellbeing'
		});

		app.invoke('next-steps-wellbeing-how-going-save',
		{
			howgoing: data._howgoing
		});
	}
});

app.add(
{
	name: 'next-steps-me-dashboard-next-applications',
	code: function (param, response)
	{	
		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				fields: ['description'],
				object: 'project',
				filters:
				[
					{
						field: 'template',
						value: 'Y'
					},
					{
						field: 'type',
						value: app.whoami().mySetup.projectTypes.facilitation
					}
				],
				callback: 'next-steps-me-dashboard-next-applications',
				callbackParam: param
			});
		}
		else
		{
			app.set(
			{
				scope: 'next-steps-me-dashboard-next-applications',
				context: 'templates',
				value: response.data.rows
			});

			app.invoke('next-steps-me-dashboard-next-applications-show');
		}
	}
});
					
app.add(
{
	name: 'next-steps-me-dashboard-next-applications-show',
	code: function (param, response)
	{	
		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'project',
				fields: ['description', 'createddate', 'contactpersontext', 'guid', 'startdate', 'notes', 'statustext', 'sourceprojecttemplate', 'sourceprojecttemplatetext', 'restrictedtoteam', 'modifieddate', 'project.modifieduser.guid', 'project.createduser.guid'],
				filters:
				[
					{
						field: 'createduser',
						value: app.whoami().thisInstanceOfMe.user.id
					},
					{
						field: 'restrictedtoteam',
						value: 'Y'
					},
					{
						field: 'type',
						value: app.whoami().mySetup.projectTypes.management
					},
					{
						field: 'subtype',
						value: app.whoami().mySetup.projectSubTypes.managementNextSteps
					},
					{
						field: 'status',
						comparison: 'NOT_EQUAL_TO',
						value: 7
					}
				],
				sorts:
				[
					{
						field: 'startdate',
						direction: 'desc'
					}
				],
				callback: 'next-steps-me-dashboard-next-applications-show'
			});
		}
		else
		{
			var nextStepsApplications = app.set(
			{
				scope: 'next-steps-me-dashboard-next',
				context: 'applications',
				value: response.data.rows
			});

			var nextStepsApplicationsView = app.vq.init({queue: 'next-steps-me-dashboard-next-applications'});

			if (nextStepsApplications.length == 0)
			{
				nextStepsApplicationsView.add(
				[
					'<div class="text-muted text-center">',
						'You do not have any applications at this moment.',
					'</div>'
				]);
			}
			else 
			{
				nextStepsApplicationsView.template(
				[
					'<div class="">',
						'<div class="card">',
							'<div class="card-body py-3">',
								'<div class="row mr-0">',
									'<div class="col-10">',
										'<h3 class="mt-1 mb-1"><a class="myds-navigate" data-controller="next-steps-next-share-off-chain" data-context="{{guid}}">{{templatedescription}}</a></h3>',
										'<div class="small">{{statustext}}</div>',
									'</div>',
									'<div class="col-2 text-right pr-0">',
										'<a class="btn btn-link btn-sm text-muted myds-collapse-toggle"',
											' data-toggle="collapse" role="button"',
											' href="#next-steps-me-dashboard-next-applications-collapse-{{guid}}"',
										'>',
											'<i class="fa fa-chevron-down text-muted"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="collapse myds-collapse" id="next-steps-me-dashboard-next-applications-collapse-{{guid}}"',
								'data-controller="next-steps-me-dashboard-next-applications-more-show"',
								'data-guid="{{guid}}">',
								'<div class="card-body pt-2 px-4">',
									'<button class="btn btn-default btn-outline myds-navigate" data-controller="next-steps-next-share-off-chain" data-context="{{guid}}" data-id="{{guid}}">View Application</button>',
								'</div>',
								'{{applicationinfo}}',
								'<div class="d-none card-body pt-1 pb-2 px-4 border-top">',
									'<h3 class="mb-1 mt-4">Achievements</h3>',
									'<div class="text-muted small mb-1">Achievements relating to this application.</div>',
									'<div class="pt-3" id="next-steps-me-dashboard-next-applications-{{guid}}-achievements">',
									'</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);

				nextStepsApplicationsView.add(
				[
					'<div class="">',
						'<div class="">'
				]);

				var applicationTemplates = app.get(
				{
					scope: 'next-steps-me-dashboard-next-applications',
					context: 'templates'
				});

				_.each(response.data.rows, function (row)
				{
					row.contactinfo = '';

					if (row['relationship.othercontactperson.email'] != '')
					{
						row.contactinfo += '<div class="card-body pt-1 pb-4 px-4">' + 
												'<i class="fa fa-envelope mr-1 text-muted"></i><a class="text-muted" href="mailto:' + row['relationship.othercontactperson.email'] + '">' +
												row['relationship.othercontactperson.email'] + '</a>' +
											'</div>';
					}

					row._sourcetemplate = _.find(applicationTemplates, function (applicationTemplate)
					{
						return applicationTemplate.id == row.sourceprojecttemplate;
					});

					row.templatedescription = '[No Template]';

					if (row._sourcetemplate != undefined)
					{
						row.templatedescription = row._sourcetemplate.description;
					}

					row.applicationinfo = '';

					nextStepsApplicationsView.add({useTemplate: true}, row)
				});

				nextStepsApplicationsView.add('</div></div>');
			}

			nextStepsApplicationsView.render('#next-steps-me-dashboard-next-applications-view');
		}
	}
});