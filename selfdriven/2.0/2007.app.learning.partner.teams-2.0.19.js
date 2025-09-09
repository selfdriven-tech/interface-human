/*
	{
    	title: "Learning Partner; My Teams", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
  	}
*/

app.add(
{
	name: 'learning-partner-teams',
	code: function (param, response)
	{
		// CHANGE TO SHOW TEAMS THE USER IS ON
		
		var projectTypes = app.get(
		{
			scope: 'learning-partner-teams',
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
					scope: 'learning-partner-teams',
					context: 'project-types'
				},
				callback: 'learning-partner-teams'
			});
		}
		else
		{
			app.vq.init({queue: 'learning-partner-teams-types'});
			app.vq.add(
			[
				'<li>',
					'<a href="#" class="myds-dropdown dropdown-item" data-id="{{id}}">',
					'{{title}}',
					'</a>',
				'</li>'
			],
			{
				type: 'template',
				queue: 'learning-partner-teams-types'
			});

			app.vq.add(
			[
				'<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" id="learning-partner-teams-types-filter" aria-expanded="false">',
					'<span class="dropdown-text">All</span>',
				'</button>',
				'<ul class="dropdown-menu mt-1"',
					'data-controller="learning-partner-teams-dashboard"',
					'data-context="type"',
				'>',
				'<li>',
					'<a href="#" class="myds-dropdown dropdown-item" data-id="-1">',
					'All',
					'</a>',
				'</li>'
			],
			{
				queue: 'learning-partner-teams-types'
			});

			_.each(projectTypes, function (projectType)
			{
				app.vq.add({useTemplate: true, queue: 'learning-partner-teams-types'}, projectType)
			});

			app.vq.add('</ul>',
			{
				queue: 'learning-partner-teams-types'
			});

			app.vq.render('#learning-partner-teams-types',
			{
				queue: 'learning-partner-teams-types'
			});

			app.invoke('learning-partner-teams-dashboard');
		}
	}
});

app.add(
{
	name: 'learning-partner-teams-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-teams-dashboard',
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
			if (!_.isEmpty(data.search))
			{
				filters = _.concat(
				[
					{
						name: '('
					},
					{	
						field: 'projectteam.project.reference',
						comparison: 'TEXT_IS_LIKE',
						value: data.search
					},
					{
						name: 'or'
					},
					{	
						field: 'projectteam.project.description',
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
							field: 'projectteam.project.type',
							value: data.type
						}
					]);
				}
			}

			filters.push(
			{
				field: 'contactperson',
				value: app.whoami().thisInstanceOfMe.user.contactperson
			});

			mydigitalstructure.cloud.search(
			{
				object: 'project_team',
				fields:
				[
					'projectteam.project.reference',
					'projectteam.project.description',
					'projectteam.project.notes',
					'projectteam.project.typetext',
					'projectteam.project.id',
					'projectteam.project.guid',
					'projectteam.project.restrictedtoteam',
					'projectteam.project.contactperson.guid',
					'projectteam.project.contactperson.firstname',
					'projectteam.project.contactperson.surname',
					'projectteam.project.contactperson.email'
				],
				filters: filters,
				sorts:
				[
					{
						field: 'projectteam.project.description',
						direction: 'asc'
					}
				],
				callback: 'learning-partner-teams-dashboard'
			})
		}
		else
		{
			app.vq.init({queue: 'learning-partner-teams-dashboard'});

			if (response.data.rows.length == 0)
			{
				app.vq.add(
				[
					'<div class="text-muted text-center">',
						'You are not a member of any teams that match this search.',
					'</div>'
				],
				{
					queue: 'learning-partner-teams-dashboard'
				});
			}
			else 
			{
				app.vq.add(
				[
					'<div class="col-sm-12 mb-3 mt-1 px-0">',
						'<div class="card">',
							'<div class="card-body">',
								'<div class="row">',
									'<div class="col-10">',
										'<h2 class="mt-1 mb-1"><span class="mr-2">{{projectteam.project.description}}</span><span class="text-muted small">{{projectIcon}}</span>',
											'<span class="pl-2 text-muted small">{{projectteam.project.typetext}}</span>',
										'</h2>',
										'<div class="text-secondary">{{projectteam.project.contactperson.firstname}} {{projectteam.project.contactperson.surname}}</div>',
										'<div class="small mt-1">{{projectteam.project.notes}}</div>',
										'<div class="mt-3">',
											'<a class="btn btn-default btn-outline btn-sm myds-navigate text-white"',
												'  data-scope="learning-partner-project-summary"',
												'  data-context="{{projectteam.project.guid}}"',
											'>',
												'Open Project',
											'</a>',
										'</div>',
									'</div>',
									'<div class="col-2 text-right">',
										'<a class="btn btn-link btn-sm text-muted myds-collapse-toggle"',
											' data-toggle="collapse" role="button"',
											' href="#learning-partner-teams-dashboard-collapse-{{projectteam.project.id}}"',
										'>',
											'<i class="fa fa-chevron-down text-muted"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="collapse myds-collapse" id="learning-partner-teams-dashboard-collapse-{{projectteam.project.id}}"',
								'data-controller="learning-partner-teams-dashboard-show"',
								'data-project="{{projectteam.project.id}}">',
								'<div class="card-body pt-1 pb-4 px-4" id="learning-partner-teams-dashboard-view-{{projectteam.project.id}}">',
								'</div>',
							'</div>',
						'</div>',
		 			'</div>'
				],
				{
					type: 'template',
					queue: 'learning-partner-teams-dashboard'
				});

				app.vq.add(
				[
					'<div class="px-0">',
						'<div class="row px-3">'
				],
				{
					queue: 'learning-partner-teams-dashboard'
				});

				_.each(response.data.rows, function (row)
				{
					row.projectIcon = '<i class="fa fa-users fa-fw"></i>'
					if (row['projecttask.project.restrictedtoteam'] == 'Y')
					{
						row.projectIcon = '<i class="fa fa-user fa-fw"></i>'
					}

					app.vq.add({useTemplate: true, queue: 'learning-partner-teams-dashboard'}, row)
				});

				app.vq.add('</div></div>',
				{
					queue: 'learning-partner-teams-dashboard'
				});
			}

			app.vq.render('#learning-partner-teams-view',
			{
				queue: 'learning-partner-teams-dashboard'
			});
		}
	}
});

app.add(
{
	name: 'learning-partner-teams-dashboard-show',
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
					'projectteam.contactperson._profileimage',
					'projectteam.projectroletext'
				],
				filters:
				[
					{
						field: 'project',
						value: projectID
					}
				],
				rows: 99999,
				sorts:
				[
					{
						field: 'projectteam.contactperson.firstname',
						direction: 'asc'
					}
				],
				callback: 'learning-partner-teams-dashboard-show',
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
							'<a href="#learning-partner-profile/{{projectteam.contactperson.guid}}">',
			               '<img alt="image" style="height:38px; width:38px;" class="float-left rounded-circle" src="{{projectteam.contactperson._profileimage}}">',
								'<div class="float-left ml-3">',
									'<h4 class="mb-0">{{projectteam.contactperson.firstname}} {{projectteam.contactperson.surname}}</h4>',
									'<div class="text-muted small">{{projectteam.projectroletext}}</div>',
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
                                                  
			app.vq.render('#learning-partner-teams-dashboard-view-' + projectID)
		}
	}
});

app.add(
{
	name: 'learning-partner-team-summary',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learning-partner-community-team-summary',
			context: 'id',
			valueDefault: ''
		});

		var data = app.find(
		{
			dataController: 'learning-partner-teams',
			dataContext: 'all',
			controller: 'learning-partner-community-team-summary',
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
			scope: 'learning-partner-community-team-summary',
			selector: '#learning-partner-community-team-summary',
			data: data
		});
	}	
});

