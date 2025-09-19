/*
	{
    	title: "Learner; Showcase", 	
    	design: "https://selfdriven.foundation/design"
  	}

	Change to use PRODUCT; Category communityShowcase.
*/

app.add(
{
	name: 'learner-showcase',
	code: function (param, response)
	{
		/*
		var skillTypes = app.get(
		{
			scope: 'learner-community-skills',
			context: 'skill-types'
		});

		if (response == undefined && skillTypes == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'setup_contact_attribute',
				fields: ['title'],
				filters: [{field: 'hidden', value: 'Y'}],
				set:
				{
					scope: 'learner-community-skills',
					context: 'skill-types'
				},
				callback: 'learner-community-skills'
			});
		}
		else
		{
			app.vq.init({queue: 'learner-community-skills-types'});
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
				queue: 'learner-community-skills-types'
			});

			app.vq.add(
			[
				'<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" id="learner-community-skills-types-filter" aria-expanded="false">',
					'<span class="dropdown-text">All</span>',
				'</button>',
				'<ul class="dropdown-menu mt-1"',
					'data-controller="learner-community-skills-dashboard"',
					'data-context="type"',
				'>',
				'<li>',
					'<a href="#" class="myds-dropdown dropdown-item" data-id="-1">',
					'All',
					'</a>',
				'</li>'
			],
			{
				queue: 'learner-community-skills-types'
			});

			_.each(skillTypes, function (skillType)
			{
				app.vq.add({useTemplate: true, queue: 'learner-community-skills-types'}, skillType)
			});

			app.vq.add('</ul>',
			{
				queue: 'learner-community-skills-types'
			});

			app.vq.render('#learner-community-skills-types',
			{
				queue: 'learner-community-skills-types'
			});

			app.invoke('learner-community-skills-dashboard');
		}
		*/

		app.invoke('learner-showcase-dashboard');
	}
});

app.add(
{
	name: 'learner-showcase-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learner-showcase-dashboard',
			valueDefault: {}
		});

		if (response == undefined)
		{
			var filters =
			[
				{
					field: 'category',
					value: app.whoami().mySetup.productCategories.communityShowcase
				}
			];

			if (!_.isEmpty(data.search))
			{
				filters = _.concat(
				[
					{	
						field: 'title',
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

			mydigitalstructure.cloud.search(
			{
				object: 'product',
				fields:
				[
					'title',
					'reference',
					'description',
					'typetext',
					'type',
					'statustext',
					'status',
					'barcode',
					'guid',
					'url',
					'unitprice',
					'shopstatus'
				],
				filters: filters,
				sorts:
				[
					{
						field: 'title',
						direction: 'asc'
					}
				],
				callback: 'learner-showcase-dashboard'
			})
		}
		else
		{
			var showcaseView = app.vq.init({queue: 'learner-showcase-dashboard'});

			if (response.data.rows.length == 0)
			{
				showcaseView.add(
				[
					'<div class="text-muted text-center">',
						'There are no showcase projects that match this search.',
					'</div>'
				]);
			}
			else 
			{
				showcaseView.template(
				[
					'<div class="col-sm-12 mb-3 mt-0">',
						'<div class="card">',
							'<div class="card-body">',
								'<div class="row">',
									'<div class="col-10">',
										'<h3 class="mt-1 mb-1">{{title}}</h3>',
										'<div class="text-muted mt-2">{{description}}</div>',
									'</div>',
									'<div class="col-2 text-right">',
										'<a class="btn btn-link btn-sm text-muted myds-collapse-toggle"',
											' data-toggle="collapse" role="button"',
											' href="#learner-showcase-dashboard-collapse-{{id}}"',
										'>',
											'<i class="fa fa-chevron-down text-muted"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="collapse myds-collapse" id="learner-showcase-dashboard-collapse-{{id}}"',
								'data-controller="learner-showcase-dashboard-show"',
								'data-project="{{id}}">',
								'<div class="card-body py-2 px-4" id="learner-showcase-dashboard-view-{{id}}">',
									'{{info}}',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);

				showcaseView.add(
				[
					'<div class="px-0">',
						'<div class="row">'
				]);

				_.each(response.data.rows, function (row)
				{
					row.info = '';

					if (_.isSet(row.barcode))
					{
						row.info += '<button class="mb-4 mt-0 mr-2 btn btn-default btn-outline btn-sm myds-navigate" id="learner-community-showcase-dashboard-view-project-story-{{id}}" data-context="' + row.barcode + '" data-id="' + row.barcode + '" data-controller="learner-project-story-board">View Project</button>';
					}

					if (row.shopstatus == 1)
					{
						row.info += '<button class="mb-4 mt-0 mr-2 btn btn-default btn-outline btn-sm myds-navigate" id="learner-community-showcase-dashboard-view-project-story-{{id}}" data-context="' + row.barcode + '" data-id="' + row.barcode + '" data-controller="util-community-shop">Sell</button>';
					}

					if (_.isSet(row.url))
					{
						row.info += '<a href="' + row.url + '" target="_blank" class="mb-4 mt-0 mr-2 btn btn-default btn-outline btn-sm">View</a>';
					}

					showcaseView.add({useTemplate: true}, row)
				});

				showcaseView.add('</div></div>');
			}

			showcaseView.render('#learner-showcase-view');
		}
	}
});

app.add(
{
	name: 'x-learner-showcase-dashboard-show',
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
				callback: 'learner-community-skills-dashboard-show',
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
                                                  
			app.vq.render('#learner-community-skills-dashboard-view-' + projectID)
		}
	}
});

app.add(
{
	name: 'learner-showcase-summary',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learner-community-skill-summary',
			context: 'id',
			valueDefault: ''
		});

		var data = app.find(
		{
			dataController: 'learner-community-skills',
			dataContext: 'all',
			controller: 'learner-community-skill-summary',
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
			scope: 'learner-community-skill-summary',
			selector: '#learner-community-skill-summary',
			data: data
		});
	}	
});

