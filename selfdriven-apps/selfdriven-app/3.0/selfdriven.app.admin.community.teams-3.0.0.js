/*
	{
    	title: "Admin; Community; Teams", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
  	}
*/

app.add(
{
	name: 'admin-community-teams',
	code: function (param, response)
	{
		var projectTypes = app.get(
		{
			scope: 'admin-community-teams',
			context: 'project-types'
		});

		if (response == undefined && projectTypes == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'setup_project_type',
				fields: ['title'],
				filters: [],
				set:
				{
					scope: 'admin-community-teams',
					context: 'project-types'
				},
				callback: 'admin-community-teams'
			});
		}
		else
		{
			app.vq.init({queue: 'admin-community-teams-types'});
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
				queue: 'admin-community-teams-types'
			});

			app.vq.add(
			[
				'<button type="button" class="btn btn-white dropdown-toggle" data-toggle="dropdown" id="admin-community-teams-types-filter" aria-expanded="false">',
					'<span class="dropdown-text">All</span>',
				'</button>',
				'<ul class="dropdown-menu mt-1"',
					'data-controller="admin-community-teams-dashboard"',
					'data-context="type"',
				'>',
				'<li>',
					'<a href="#" class="myds-dropdown" data-id="-1">',
					'All',
					'</a>',
				'</li>'
			],
			{
				queue: 'admin-community-teams-types'
			});

			_.each(projectTypes, function (projectType)
			{
				app.vq.add({useTemplate: true, queue: 'admin-community-teams-types'}, projectType)
			});

			app.vq.add('</ul>',
			{
				queue: 'admin-community-teams-types'
			});

			app.vq.render('#admin-community-teams-types',
			{
				queue: 'admin-community-teams-types'
			});

			app.invoke('admin-community-teams-dashboard');
		}
	}
});

app.add(
{
	name: 'admin-community-teams-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'admin-community-teams-dashboard',
			valueDefault: {}
		});

		var filters =
		[
			{	
				field: 'type',
				comparison: 'NOT_EQUAL_TO',
				value: app.whoami().mySetup.projectTypes.management
			},
			{	
				field: 'subtype',
				comparison: 'NOT_EQUAL_TO',
				value: app.whoami().mySetup.projectSubTypes.learningLevelUp
			}
		];

		if (response == undefined)
		{
			if (!_.isEmpty(data.search))
			{
				filters = _.concat(filters,
				[
					{
						name: '('
					},
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
					},
					{
						name: ')'
					}
				]);
			}

			if (!_.isUndefined(data.type))
			{
				if (data.type != -1)
				{
					filters = _.concat(filters,
					[
						{	
							field: 'type',
							value: data.type
						}
					]);
				}
			}

			mydigitalstructure.cloud.search(
			{
				object: 'project',
				fields:
				[
					'reference',
					'description',
					'notes',
					'typetext',
					'subtypetext'

				],
				filters: filters,
				sorts:
				[
					{
						field: 'description',
						direction: 'asc'
					}
				],
				callback: 'admin-community-teams-dashboard'
			})
		}
		else
		{
			app.vq.init({queue: 'admin-community-teams-dashboard'});

			if (response.data.rows.length == 0)
			{
				app.vq.add(
				[
					'<div class="text-muted text-center">',
						'There are no community teams that match this search.',
					'</div>'
				],
				{
					queue: 'admin-community-teams-dashboard'
				});
			}
			else 
			{
				app.vq.add(
				[
					'<div class="col-sm-12 mb-3 mt-1">',
						'<div class="card">',
							'<div class="card-header">',
								'<div class="row">',
									'<div class="col-10">',
										'<h3 class="mt-1 mb-1">{{description}}</h3>',
										'<div class="small">{{notes}}</div>',
									'</div>',
									'<div class="col-2 text-right">',
										'<a class="btn btn-link btn-sm text-muted myds-collapse-toggle"',
											' data-toggle="collapse" role="button"',
											' href="#admin-community-teams-dashboard-collapse-{{id}}"',
										'>',
											'<i class="fa fa-chevron-down text-muted"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="collapse myds-collapse" id="admin-community-teams-dashboard-collapse-{{id}}"',
								'data-controller="admin-community-teams-dashboard-show"',
								'data-project="{{id}}">',
								'<div class="card-body py-4 px-4" id="admin-community-teams-dashboard-view-{{id}}">',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				],
				{
					type: 'template',
					queue: 'admin-community-teams-dashboard'
				});

				app.vq.add(
				[
					'<div>',
						'<div class="row">'
				],
				{
					queue: 'admin-community-teams-dashboard'
				});

				_.each(response.data.rows, function (row)
				{
					app.vq.add({useTemplate: true, queue: 'admin-community-teams-dashboard'}, row)
				});

				app.vq.add('</div></div>',
				{
					queue: 'admin-community-teams-dashboard'
				});
			}

			app.vq.render('#admin-community-teams-view',
			{
				queue: 'admin-community-teams-dashboard'
			});
		}
	}
});

app.add(
{
	name: 'admin-community-teams-dashboard-show',
	code: function (param, response)
	{
		var projectID = app._util.param.get(param.dataContext, 'project').value;

		var utilSetup = app.get(
		{
			scope: 'util-setup',
			valueDefault: {}
		});

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'project_team',
				fields:
				[
					'projectteam.contactperson.firstname',
					'projectteam.contactperson.surname',
					'projectteam.contactperson.email',
					'projectteam.contactperson.notes',
					'projectteam.contactperson.guid',
					'projectteam.contactperson._profileimage'
				],
				filters:
				[
					{
						field: 'project',
						value: projectID
					},
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
				],
				rows: 99999,
				sorts:
				[
					{
						field: 'projectteam.contactperson.firstname',
						direction: 'asc'
					}
				],
				callback: 'admin-community-teams-dashboard-show',
				callbackParam: param
			})
		}
		else
		{
			app.vq.init();

			if (response.data.rows.length == 0)
			{
				app.vq.add('<div class="text-muted text-center">No team members</div>')
			}
			else
			{
				app.vq.add(
				[
					'<ul class="list-group mb-2">',
						'<li class="list-group-item">',
							'<a href="#learner-profile/{{projectteam.contactperson.guid}}">',
			               '<img alt="image" style="height:38px; width:38px;" class="float-left rounded-circle" src="{{projectteam.contactperson._profileimage}}">',
								'<div class="float-left ml-3">',
									'<h4 class="mb-0">{{projectteam.contactperson.firstname}} {{projectteam.contactperson.surname}}</h4>',
									'<div class="text-muted small">{{projectteam.contactperson.notes}}</div>',
									'<div class="text-muted small">{{projectteam.contactperson.email}}</div>',
								'</div>',
							'</a>',
						'</li>',
					'</ul>'
				],
				{type: 'template'})

				app.vq.add('<div class="feed-activity-list">')

				_.each(response.data.rows, function (row)
				{
					if (row['projectteam.contactperson._profileimage'] == '')
					{
						row['projectteam.contactperson._profileimage'] = utilSetup.images.profile;
					}

					app.vq.add({useTemplate: true}, row)
				});

				app.vq.add('</div>')
			}
                                                  
			app.vq.render('#admin-community-teams-dashboard-view-' + projectID)
		}
	}
});

app.add(
{
	name: 'admin-community-team-summary',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'admin-community-team-summary',
			context: 'id',
			valueDefault: ''
		});

		var data = app.find(
		{
			dataController: 'admin-community-teams',
			dataContext: 'all',
			controller: 'admin-community-team-summary',
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
			scope: 'admin-community-team-summary',
			selector: '#admin-community-team-summary',
			data: data
		});
	}	
});

