/*
	{
    	title: "Learner; Community; Skills", 	
    	design: "https://www.selfdriven.foundation/skills"
  	}
*/

app.add(
{
	name: 'learner-community-skills',
	code: function (param, response)
	{
		var skillTypes = app.get(
		{
			scope: 'learner-community-skills',
			context: 'skill-types'
		});

		if (response == undefined && skillTypes == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'setup_contact_attribute_type',
				fields: ['title'],
				filters: [],
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
	}
});

app.add(
{
	name: 'learner-community-skills-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learner-community-skills-dashboard',
			valueDefault: {}
		});

		var utilSetup = app.get(
		{
			scope: 'util-setup',
			valueDefault: {}
		});

		var filters =
		[
			{
				field: 'hidden',
				value: 'N'
			}
		];

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
						field: 'title',
						comparison: 'TEXT_IS_LIKE',
						value: data.search
					},
					{
						name: 'or'
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
						field: 'categorytext',
						comparison: 'TEXT_IS_LIKE',
						value: data.search
					},
					{
						name: 'or'
					},
					{	
						field: 'guid',
						comparison: 'TEXT_IS_LIKE',
						value: data.search
					},
					{
						name: 'or'
					},
					{	
						field: 'url',
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
				object: 'setup_contact_attribute',
				fields:
				[
					'title',
					'reference',
					'notes',
					'url',
					'hidden',
					'displayorder',
					'guid',
					'parentattribute',
					'parentattributetext',
					'type',
					'typetext',
					'category',
					'categorytext',
					'level',
					'leveltext',
					'capacity',
					'capacitytext'
				],
				filters: filters,
				sorts:
				[
					{
						field: 'title',
						direction: 'asc'
					}
				],
				callback: 'learner-community-skills-dashboard'
			})
		}
		else
		{
			app.vq.init({queue: 'learner-community-skills-dashboard'});

			if (response.data.rows.length == 0)
			{
				app.vq.add(
				[
					'<div class="text-muted text-center">',
						'There are no community skills that match this search.',
					'</div>'
				],
				{
					queue: 'learner-community-skills-dashboard'
				});
			}
			else 
			{
				app.vq.add(
				[
					'<div class="col-sm-12 mb-3 mt-0">',
						'<div class="card">',
							'<div class="card-body">',
								'<div class="row">',
									'<div class="col-10">',
										'<h3 class="mt-1 mb-1">{{title}}</h3>',
										'<div class="text-muted font-weight-bold">{{typetext}}</div>',
										'<div class="text-muted">{{reference}}, {{leveltext}}, {{capacitytext}}</div>',
									'</div>',
									'<div class="col-2 text-right">',
										'<a class="btn btn-link btn-sm text-muted myds-collapse-toggle"',
											' data-toggle="collapse" role="button"',
											' href="#learner-community-skills-dashboard-collapse-{{id}}"',
										'>',
											'<i class="fa fa-chevron-down text-muted"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="collapse myds-collapse" id="learner-community-skills-dashboard-collapse-{{id}}"',
								'data-controller="learner-community-skills-dashboard-show"',
								'data-project="{{id}}">',
								'<div class="card-body pt-0 pb-4 px-4" id="learner-community-skills-dashboard-view-{{id}}">',
									'<h5 class="mb-0 mt-3">Source</h5>',
									'<div class="text-muted">{{categorytext}}</div>',
									'{{_notes}}',
									'<h5 class="mb-0 mt-3">SDI</h5>',
									'<div class="text-muted">{{guid}}</div>',
									'<h5 class="mb-0 mt-3">URI</h5>',
									'<div class="text-muted">{{url}}</div>',
									'<h5 class="mb-0 mt-3">On-Chain Asset Name</h5>',
									'<div class="text-muted">{{_onChainAssetName}}</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				],
				{
					type: 'template',
					queue: 'learner-community-skills-dashboard'
				});

				app.vq.add(
				[
					'<div class="px-0">',
						'<div class="row">'
				],
				{
					queue: 'learner-community-skills-dashboard'
				});

				_.each(response.data.rows, function (row)
				{
					row._onChainAssetName = app.invoke('admin-setup-skill-on-chain-assetname',
					{
						sdi: row.guid
					});

					if (_.isSet(row.notes))
					{
						row._notes = '<h5 class="mb-0 mt-3">Notes</h5>' +
										'<div class="text-muted">' + row.notes + '</div>'
					}

					app.vq.add({useTemplate: true, queue: 'learner-community-skills-dashboard'}, row)
				});

				app.vq.add('</div></div>',
				{
					queue: 'learner-community-skills-dashboard'
				});
			}

			app.vq.render('#learner-community-skills-view',
			{
				queue: 'learner-community-skills-dashboard'
			});
		}
	}
});

app.add(
{
	name: 'x-learner-community-skills-dashboard-show',
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
	name: 'learner-community-skill-summary',
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

