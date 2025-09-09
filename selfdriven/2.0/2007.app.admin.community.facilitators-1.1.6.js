/*
	{
    	title: "Admin; Community; Facilitators", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
  	}
*/

app.add(
{
	name: 'admin-community-facilitators',
	code: function (param, response)
	{
		var projects = app.get(
		{
			scope: 'admin-community-facilitators',
			context: 'projects'
		});

		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		if (response == undefined && projects == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'project',
				fields: ['description', 'notes'],
				filters:
				[
					{
						field: 'type',
						value: utilSetup.projectTypes.facilitation
					}
				],
				set:
				{
					scope: 'admin-community-facilitators',
					context: 'projects'
				},
				rows: 99999,
				callback: 'admin-community-facilitators'
			});
		}
		else
		{
			app.vq.init({queue: 'admin-community-facilitators-projects'});
			app.vq.add(
			[
				'<li>',
					'<a href="#" class="myds-dropdown" data-id="{{id}}">',
					'{{description}}',
					'</a>',
				'</li>'
			],
			{
				type: 'template',
				queue: 'admin-community-facilitators-projects'
			});

			app.vq.add(
			[
				'<button type="button" class="btn btn-white dropdown-toggle" data-toggle="dropdown" id="admin-community-faciliators-projects-filter" aria-expanded="false">',
					'<span class="dropdown-text">All</span>',
				'</button>',
				'<ul class="dropdown-menu mt-1"',
					'data-controller="admin-community-facilitators-dashboard"',
					'data-context="project"',
				'>',
				'<li>',
					'<a href="#" class="myds-dropdown" data-id="-1">',
					'All',
					'</a>',
				'</li>'
			],
			{
				queue: 'admin-community-facilitators-projects'
			});

			_.each(projects, function (project)
			{
				app.vq.add({useTemplate: true, queue: 'admin-community-facilitators-projects'}, project)
			});

			app.vq.add('</ul>',
			{
				queue: 'admin-community-facilitators-projects'
			});

			app.vq.render('#admin-community-facilitators-projects',
			{
				queue: 'admin-community-facilitators-projects'
			});

			app.invoke('admin-community-facilitators-dashboard');
		}
	}
});

app.add(
{
	name: 'admin-community-facilitators-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'admin-community-facilitators-dashboard',
			valueDefault: {}
		});

		var utilSetup = app.get(
		{
			scope: 'util-setup',
			valueDefault: {}
		});

		var filters =
		[
			{name: '('},
			{
				field: 'enddate',
				comparison: 'IS_NULL'
			},
			{name: 'or'},
			{
				field: 'enddate',
				comparison: 'GREATER_THAN_OR_EQUAL_TO',
				value: 'today'
			},
			{name: ')'}
		];

		if (response == undefined)
		{
			if (!_.isEmpty(data.search))
			{
				filters = _.concat(filters,
				[
					{	
						field: 'projectteam.contactperson.firstname',
						comparison: 'TEXT_IS_LIKE',
						value: data.search
					},
					{
						name: 'or'
					},
					{	
						field: 'projectteam.contactperson.surname',
						comparison: 'TEXT_IS_LIKE',
						value: data.search
					}
				]);
			}

			if (!_.isUndefined(data.project))
			{
				if (data.project != -1)
				{
					filters = _.concat(filters,
					[
						{	
							field: 'project',
							value: data.project
						}
					]);
				}
			}
			else
			{
				filters = _.concat(filters,
				[
					{
						field: 'projectteam.project.type',
						value: utilSetup.projectTypes.facilitation
					}
				]);
			}

			mydigitalstructure.cloud.search(
			{
				object: 'project_team',
				fields:
				[
					'contactperson',
					'projectteam.project.description'
				],
				filters: filters,
				rows: 99999,
				set:
				{
					scope: 'admin-community-facilitators-dashboard',
					context: 'projectteams'
				},
				callback: 'admin-community-facilitators-dashboard'
			})
		}
		else
		{
			var contactPersonIDs = ['-1'];

			if (response.data.rows.length != 0)
			{
				contactPersonIDs = _.map(response.data.rows, 'contactperson')
			}

			app.set(
			{
				scope: 'admin-community-facilitators-dashboard',
				context: 'contactpersons',
				value: _.join(contactPersonIDs, ',')
			});

			app.invoke('admin-community-facilitators-dashboard-show')
		}
	}
});

app.add(
{
	name: 'admin-community-facilitators-dashboard-show',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'admin-community-facilitators-dashboard',
			valueDefault: {}
		});

		var utilSetup = app.get(
		{
			scope: 'util-setup',
			valueDefault: {}
		});

		var filters = [];

		if (response == undefined)
		{
			if (!_.isUndefined(data.contactpersons))
			{
				filters = _.concat(filters, 
				[
					{	
						field: 'id',
						comparison: 'IN_LIST',
						value: data.contactpersons
					}
				]);
			}

			mydigitalstructure.cloud.search(
			{
				object: 'contact_person',
				fields:
				[
					'firstname',
					'surname',
					'notes',
					'guid',
					'_profileimage'
				],
				filters: filters,
				rows: 99999,
				sorts:
				[
					{
						field: 'firstname',
						direction: 'asc'
					}
				],
				callback: 'admin-community-facilitators-dashboard-show'
			});
		}
		else
		{
			app.vq.init({queue: 'admin-community-facilitators-dashboard'});

			if (!_.isUndefined(data.project))
			{
				if (data.project != -1)
				{
					var projects = app.get(
					{
						scope: 'admin-community-facilitators',
						context: 'projects'
					});

					var project = _.find(projects, function (project) {return project.id == data.project});

					if (!_.isUndefined(project))
					{
						if (project.notes != '')
						{
							app.vq.add(
							[
								'<div class="alert alert-info text-center mb-4">',
									project.notes,
								'</div>'
							],
							{
								queue: 'admin-community-facilitators-dashboard'
							});
						}
					}
				}
			}

			if (response.data.rows.length == 0)
			{
				app.vq.add(
				[
					'<div class="text-muted text-center">',
						'There are no community facilitators that match this search.',
					'</div>'
				],
				{
					queue: 'admin-community-facilitators-dashboard'
				});
			}
			else 
			{
				app.vq.add(
				[
					'<div class="col-sm-4 mb-4 mt-1">',
						'<div class="card">',
							'<div class="card-body bg-light text-dark">',
								'<img style="height:30px; width:30px;" class="img-fluid rounded-circle float-left" src="{{_profileimage}}">',
								'<h3 class="my-0 float-left ml-2 mt-1 myds-navigate" ',
										'data-id="{{guid}}" data-controller="learner-profile"',
										'data-context="{{guid}}">',
									'{{firstname}} {{surname}}',
								'</h3>',
							'</div>',
							'<div class="card-body">',
								'<div class="mb-3">{{notes}}</div>',
								'<div>{{teams}}</div>',
							'</div>',
						'</div>',
					'</div>'
				],
				{
					type: 'template',
					queue: 'admin-community-facilitators-dashboard'
				});

				app.vq.add(
				[
					'<div class="container-fluid px-0">',
						'<div class="row">'
				],
				{
					queue: 'admin-community-facilitators-dashboard'
				});

				_.each(response.data.rows, function (row)
				{
					if (row['_profileimage'] == '')
					{
						row['_profileimage'] = utilSetup.images.profile;
					}
					
					row._teams = _.filter(data.projectteams, function (projectteam)
					{
						return (projectteam['contactperson'] == row.id)
					});

					row.teams = '';
					if (row._teams.length > 0)
					{
						row.teams = 
							'<h5 class="mb-1 text-muted"><i class="fa fa-user-friends"></i> Teams</h5>' +
							'<ul class="pl-4 mb-1 small">' +
							_.join(_.map(row._teams, function (team) { return '<li class="mt-2">' + team['projectteam.project.description'] + '</li>'}), '') +
							'</ul>'
					}

					row._email = '';
					row.emailcaption = '';
					if (row.email != '')
					{
						row._email = _.split(row.email, '@');
						row.emailcaption = '<div>' + _.first(row._email) + '</div>' +
													'<div>@' + _.last(row._email) + '</div>';
					}

					app.vq.add({useTemplate: true, queue: 'admin-community-facilitators-dashboard'}, row)
				});

				app.vq.add('</div></div>',
				{
					queue: 'admin-community-facilitators-dashboard'
				});
			}

			app.vq.render('#admin-community-facilitators-view',
			{
				queue: 'admin-community-facilitators-dashboard'
			});
		}
	}
});

app.add(
{
	name: 'admin-community-facilitator-summary',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'admin-community-facilitator-summary',
			context: 'id',
			valueDefault: ''
		});

		var data = app.find(
		{
			dataController: 'admin-community-facilitators',
			dataContext: 'all',
			controller: 'admin-community-facilitator-summary',
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
			scope: 'admin-community-facilitator-summary',
			selector: '#admin-community-facilitator-summary',
			data: data
		});
	}	
});
