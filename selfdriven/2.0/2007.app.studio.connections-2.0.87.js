/*
	{
    	title: "Studio; Connections", 	
    	design: "https://www.selfdriven.foundation/design"
  	}
*/

app.add(
{
	name: 'studio-connections',
	code: function (param, response)
	{		
		var relationshipTypes = app.get(
		{
			scope: 'util-setup',
			context: '_relationshipTypes'
		});

		if (response == undefined && relationshipTypes == undefined)
		{
			entityos.cloud.search(
			{
				object: 'setup_contact_relationship_type',
				fields: ['title'],
				filters: [{field: 'id', comparison: 'IN_LIST', value: app.whoami().mySetup.relationshipTypes.learningPartner}],
				sorts:
				[
					{
						field: 'title'
					}
				],
				set:
				{
					scope: 'util-setup',
					context: '_relationshipTypes'
				},
				callback: 'studio-connections'
			});
		}
		else
		{
			var typesView = app.vq.init({queue: 'studio-connections-types'});

			typesView.template(
			[
				'<li>',
					'<a href="#" class="myds-dropdown dropdown-item" data-id="{{id}}">',
					'{{title}}',
					'</a>',
				'</li>'
			]);

			typesView.add(
			[
				'<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" id="learner-teams-types-filter" aria-expanded="false">',
					'<span class="dropdown-text">All</span>',
				'</button>',
				'<ul class="dropdown-menu mt-1"',
					'data-controller="studio-connections-dashboard"',
					'data-context="type"',
				'>',
				'<li>',
					'<a href="#" class="myds-dropdown dropdown-item" data-id="-1">',
					'All',
					'</a>',
				'</li>'
			]);

			_.each(relationshipTypes, function (relationshipType)
			{
				relationshipType.title = _.replace(relationshipType.title, 'Learning Partner; ', '');
				typesView.add({useTemplate: true}, relationshipType)
			});

			typesView.add('</ul>');

			typesView.render('#studio-connections-types');

			app.invoke('studio-connections-dashboard');
		}
	}
});

app.add(
{
	name: 'studio-connections-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'studio-connections-dashboard',
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
						field: 'relationship.contactperson.firstname',
						comparison: 'TEXT_IS_LIKE',
						value: data.search
					},
					{
						name: 'or'
					},
					{	
						field: 'relationship.contactperson.surname',
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

			filters.push(
			{
				field: 'othercontactperson',
				value: app.whoami().thisInstanceOfMe.user.contactperson
			});

			entityos.cloud.search(
			{
				object: 'contact_relationship',
				fields:
				[
					'relationship.contactperson.firstname',
					'relationship.contactperson.surname',
					'relationship.contactperson.email',
					'relationship.contactperson.mobile',
					'relationship.contactperson.guid',
					'relationship.contactperson.id',
					'relationship.contactperson._profileimage',
					'relationship.contactperson._howgoing',
					'guid',
					'createddate',
					'startdate',
					'typetext'
				],
				filters: filters,
				sorts:
				[
					{
						field: 'relationship.contactperson.firstname',
						direction: 'asc'
					}
				],
				callback: 'studio-connections-dashboard'
			})
		}
		else
		{
			var connectionsView = app.vq.init({queue: 'studio-connections-dashboard'});

			if (response.data.rows.length == 0)
			{
				connectionsView.add(
				[
					'<div class="text-muted text-center">',
						'You do not have any connections that match this search.',
					'</div>'
				]);
			}
			else 
			{
				connectionsView.template(
				[
					'<div class="col-sm-12 mb-3 mt-1">',
						'<div class="card">',
							'<div class="card-body pt-3 pb-3">',
								'<div class="row">',
									'<div class="col-10">',
										'<div class="float-left">',
											'<h3 class="mt-1 mb-1">{{relationship.contactperson.firstname}} {{relationship.contactperson.surname}}</h3>',
											'{{contactinfo}}',
										'</div>',
									'</div>',
									'<div class="col-2 text-right pr-0">',
										'<a class="btn btn-link btn-sm text-muted myds-collapse-toggle"',
											' data-toggle="collapse" role="button"',
											' href="#studio-connections-dashboard-collapse-{{relationship.contactperson.guid}}"',
										'>',
											'<i class="fa fa-chevron-down text-muted"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="collapse myds-collapse" id="studio-connections-dashboard-collapse-{{relationship.contactperson.guid}}"',
								' data-controller="studio-connections-dashboard-show"',
								' data-guid="{{relationship.contactperson.guid}}"',
								' data-id="{{relationship.contactperson.id}}">',

								'<div class="card-body pt-0">',
									'<div class="row mr-0">',
										'<div class="col-12">',
											'<ul class="nav nav-tabs myds-tab">',
												'<li class="nav-item">',
													'<a class="nav-link active" data-toggle="tab" ',
														' href="#studio-connections-dashboard-show-{{relationship.contactperson.guid}}-projects"',
														' data-guid="{{relationship.contactperson.guid}}"',
														' data-controller="studio-connections-dashboard-show-projects">',
														'<i class="fe fe-folder"></i> Projects',
													'</a>',
												'</li>',
												'<li class="nav-item">',
													'<a class="nav-link" data-toggle="tab" ',
														' href="#studio-connections-dashboard-show-{{relationship.contactperson.guid}}-skills"',
														' data-guid="{{relationship.contactperson.guid}}"',
														' data-controller="studio-connections-dashboard-show-skills">',
														'<i class="fe fe-sun"></i> Skills',
													'</a>',
												'</li>',
												'<li class="d-none nav-item">',
													'<a class="nav-link" data-toggle="tab" ',
														' href="#studio-connections-dashboard-show-{{relationship.contactperson.guid}}-tokens"',
														' data-guid="{{relationship.contactperson.guid}}"',
														' data-controller="studio-connections-dashboard-show-tokens">',
														'<i class="fe fe-disc"></i> Tokens',
													'</a>',
												'</li>',
											'</ul>',
											'<div class="tab-content">',
												'<div class="tab-pane active pt-2" id="studio-connections-dashboard-show-{{relationship.contactperson.guid}}-projects">',
													'<div class="text-secondary mt-2 mb-0">',
														'Projects you are supporting {{relationship.contactperson.firstname}} with.',
													'</div>',
													'<div id="studio-connections-dashboard-view-{{relationship.contactperson.guid}}-projects">',
													'</div>',
												'</div>',
												'<div class="tab-pane pt-2" id="studio-connections-dashboard-show-{{relationship.contactperson.guid}}-skills">',
													'<div class="text-secondary mt-2 mb-0">',
														'Skills issued by you to {{relationship.contactperson.firstname}}.',
													'</div>',
													'<div id="studio-connections-dashboard-view-{{relationship.contactperson.guid}}-skills">',
													'</div>',
												'</div>',
												'<div class="tab-pane pt-2" id="studio-connections-dashboard-show-{{relationship.contactperson.guid}}-tokens">',
													'<div class="text-secondary mt-2 mb-0">',
														'Tokens assigned by you for {{relationship.contactperson.firstname}}.',
													'</div>',
													'<div id="studio-connections-dashboard-view-{{relationship.contactperson.guid}}-tokens">',
													'</div>',
												'</div>',
											'</div>',
										'</div>',
									'</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);

				connectionsView.add(
				[
					'<div class="px-0">',
						'<div class="row">'
				]);

				_.each(response.data.rows, function (row)
				{
					row['_profileimage'] = row['relationship.contactperson._profileimage'];

					if (row['_profileimage'] == '')
					{
						row['_profileimage'] = app.whoami().mySetup.images.profile;
					}

					row.contactinfo = '';

					row.typetext = _.replace(row.typetext, 'Learning Partner; ', '');

					if (row['relationship.contactperson.email'] != '')
					{
						row.contactinfo += '<div class="pt-1 small">' + 
												'<i class="far fa-envelope mr-1 text-muted"></i><a class="text-muted" href="mailto:' + row['relationship.contactperson.email'] + '">' +
												row['relationship.contactperson.email'] + '</a>' +
											'</div>';
					}

					if (row['relationship.contactperson.mobile'] != '')
					{
						row.contactinfo += '<div class="pt-1 small">' + 
												'<i class="far fa-phone mr-1 text-muted"></i><a class="text-muted" href="tel:' + row['relationship.contactperson.mobile'] + '">' +
												row['relationship.contactperson.mobile'] + '</a>' +
											'</div>';
					}

					connectionsView.add({useTemplate: true}, row)
				});

				connectionsView.add('</div></div>');
			}

			connectionsView.render('#studio-connections-view');
		}
	}
});

app.add(
{
	name: 'studio-connections-dashboard-show',
	code: function (param, response)
	{
		//var otherContactPersonGUID = app._util.param.get(param.dataContext, 'guid').value;
		//app.invoke('studio-connections-dashboard-show-level-up-profile', param);

		//Do on expand
		app.invoke('studio-connections-dashboard-show-projects', param);
		//app.invoke('studio-connections-dashboard-show-reflections', param);
		//app.invoke('studio-connections-dashboard-show-skills', param);
		//app.invoke('studio-connections-dashboard-show-endorsements', param);
	
	}
});

app.add(
{
	name: 'studio-connections-dashboard-show-endorsements',
	code: function (param, response)
	{
		var otherContactPersonGUID = app._util.param.get(param.dataContext, 'guid').value;

		if (response == undefined)
		{
			entityos.cloud.search(
			{
				object: 'action',
				fields: ['createdusertext', 'createddate', 'guid', 'text', 'action.createduser.contactpersontext', 'subject'],
				filters:
				[
					{	
						field: 'action.createduser',
						comparison: 'EQUAL_TO',
						value: app.whoami().thisInstanceOfMe.user.id
					},
					{	
						field: 'action.contactperson.guid',
						comparison: 'EQUAL_TO',
						value: otherContactPersonGUID
					},
					{	
						field: 'actiontype',
						comparison: 'IN_LIST',
						value: app.whoami().mySetup.actionTypes.recognition
					}
				],
				callback: 'studio-connections-dashboard-show-endorsements',
				callbackParam: param
			});
		}
		else
		{
			var connectionsDashboardView = app.vq.init({queue: 'studio-connections-dashboard-show'});

			if (response.data.rows.length == 0)
			{
				connectionsDashboardView.add(
				[
					'<div class="mb-2 mt-3 text-muted font-italic small">No endorsements at this moment.</div>'
				]);
			}
			else
			{
				connectionsDashboardView.template(
				[
					'<li class="mb-2">',
            		'<div class="font-weight-bold">{{subject}}</div>',
             		'<div class="text-muted small">{{createddate}}</div>',
					'</li>'
				]);

				connectionsDashboardView.add('<ul class="list-group mb-2 ml-4 mt-3">')

				_.each(response.data.rows, function (row)
				{
					row.createddate = app.invoke('util-date', {date: row.createddate, format: 'DD MMM YYYY'});
					connectionsDashboardView.add({useTemplate: true}, row)
				});

				connectionsDashboardView.add('</ul>')
			}

			connectionsDashboardView.add(
			[
			  '<button type="button" class="btn btn-sm btn-white mb-2 myds-navigate" data-controller="studio-connections-endorsements"',
			  		' data-context="', otherContactPersonGUID, '"',
			  		'>',
			  		'Add',
            '</button>'
			]);
                                                  
			connectionsDashboardView.render('#studio-connections-dashboard-view-' + otherContactPersonGUID + '-endorsements');
		}
	}
});

app.add(
{
	name: 'studio-connections-dashboard-show-reflections',
	code: function (param, response)
	{
		var otherContactPersonGUID = app._util.param.get(param.dataContext, 'guid').value;
		var elements = app.whoami().mySetup.structureElements;

		if (response == undefined)
		{
			var fields = ['subject', 'createddate', 'modifieddate', 'guid', 'contactperson', 'contactpersontext', 'description']

			if (elements != undefined)
			{
				fields = _.concat(fields, _.map(elements, 'alias'))
			}

			entityos.cloud.search(
			{
				object: 'action',
				fields: fields,
				filters:
				[
					{	
						field: 'action.createduser',
						comparison: 'EQUAL_TO',
						value: app.whoami().thisInstanceOfMe.user.id
					},
					{	
						field: 'action.contactperson.guid',
						comparison: 'EQUAL_TO',
						value: otherContactPersonGUID
					},
					{	
						field: 'actiontype',
						comparison: 'IN_LIST',
						value: app.whoami().mySetup.actionTypes.reflectionByLearningPartner
					}
				],
				callback: 'studio-connections-dashboard-show-reflections',
				callbackParam: param
			});
		}
		else
		{
			var connectionsDashboardReflectionsView = app.vq.init({queue: 'studio-connections-dashboard-show-reflections'});

			if (response.data.rows.length == 0)
			{
				connectionsDashboardReflectionsView.add(
				[
					'<div class="mb-2 mt-3 text-muted font-italic small">No reflections at this moment.</div>'
				]);
			}
			else
			{
				connectionsDashboardReflectionsView.template(
				[
					'<li class="mb-2">',
            		'<div class="font-weight-bold">{{subject}}</div>',
             		'<div class="text-muted small">{{createddate}}</div>',
					'{{attributes}}',
					'</li>'
				]);

				connectionsDashboardReflectionsView.add('<ul class="list-group mb-2 ml-4 mt-3">')

				_.each(response.data.rows, function (row)
				{
					row.attributes = app.invoke('studio-connections-dashboard-show-reflections-attributes', param, row);
					connectionsDashboardReflectionsView.add({useTemplate: true}, row)
				});

				connectionsDashboardReflectionsView.add('</ul>')
			}

			connectionsDashboardReflectionsView.add(
			[
				  '<button type="button" class="d-none btn btn-sm btn-white mb-2 myds-navigate" data-controller="studio-connections-reflections">',
				  		'Add',
              '</button>'
			]);
                                                  
			connectionsDashboardReflectionsView.render('#studio-connections-dashboard-view-' + otherContactPersonGUID + '-reflections');
		}
	}
});

app.add(
{
	name: 'studio-connections-dashboard-show-reflections-attributes',
	code: function (param, actionData)
	{	
		var elements = app.whoami().mySetup.structureElements;

		var category = app.whoami().mySetup.structures.me.categories.general;
		elements = _.filter(elements, function (element) {return element.category == category})

		var attributesView = app.vq.init({queue: 'attributes-view'});

		attributesView.template(
		[
			'<div class="mt-2 w-50">',
				'<label class="form-check-label mb-0">',
				'<div class="text-muted small font-weight-bold">{{title}}</div>',
				'</label>',
				'<div class="progress progress-small">',
						'<div class="progress-bar" style="width: {{value}}%;" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="100"></div>',
				'</div>',
			'</div>'
		]);

		_.each(elements, function (element)
		{
			element.value = actionData[element.alias];
			if (_.isSet(element.value))
			{
				attributesView.add({useTemplate: true}, element)
			}
		});

		return attributesView.get()	
	}
});

app.add(
{
	name: 'studio-connections-dashboard-show-skills',
	code: function (param, response)
	{
		var otherContactPersonGUID = app._util.param.get(param.dataContext, 'guid').value;

		if (response == undefined)
		{
			entityos.cloud.search(
			{
				object: 'contact_attribute',
				fields: ['attributetext', 'createddate', 'guid', 'notes'],
				filters:
				[
					{	
						field: 'attribute.contactperson.guid',
						comparison: 'EQUAL_TO',
						value: otherContactPersonGUID
					},
					{	
						field: 'attribute.createduser',
						comparison: 'EQUAL_TO',
						value: app.whoami().thisInstanceOfMe.user.id
					}
				],
				callback: 'studio-connections-dashboard-show-skills',
				callbackParam: param
			});
		}
		else
		{
			var connectionsDashboardSkillsView = app.vq.init({queue: 'studio-connections-dashboard-show-skills'});

			if (response.data.rows.length == 0)
			{
				connectionsDashboardSkillsView.add(
				[
					'<div class="mb-2 mt-3 text-muted font-italic small">No registered achievements at this moment.</div>'
				]);
			}
			else
			{
				connectionsDashboardSkillsView.template(
				[
					'<li class="mb-2">',
	            	'<div class="font-weight-bold">{{attributetext}}</div>',
	             	'<div class="text-muted small">{{notes}}</div>',
					'</li>'
				]);

				connectionsDashboardSkillsView.add('<ul class="list-group mb-2 ml-4 mt-3">')

				_.each(response.data.rows, function (row)
				{
					connectionsDashboardSkillsView.add({useTemplate: true}, row)
				});

				connectionsDashboardSkillsView.add('</ul>')
			}

			connectionsDashboardSkillsView.add(
			[
				  '<button type="button" class="d-none btn btn-sm btn-white mb-2 myds-navigate" data-controller="studio-connections-achievements">',
				  		'Add',
              '</button>'
			]);
                                                  
			connectionsDashboardSkillsView.render('#studio-connections-dashboard-view-' + otherContactPersonGUID + '-skills');
		}
	}
});

app.add(
{
	name: 'studio-connections-dashboard-show-projects',
	code: function (param, response)
	{
		if (param.status == 'shown')
		{
			var otherContactPersonGUID = app._util.param.get(param.dataContext, 'guid').value;

			if (response == undefined)
			{
				entityos.cloud.search(
				{
					object: 'project_team',
					fields:
					[
						'projectteam.project.reference',
						'projectteam.project.description',
						'projectteam.project.typetext',
						'projectteam.project.type',
						'projectteam.project.subtype',
						'projectteam.project.id',
						'projectteam.project.restrictedtoteam',
						'projectteam.project.guid',
						'projectteam.project.status',
						'projectteam.project.statustext'
					],
					filters:
					[
						{
							field: 'projectteam.project.contactperson.guid',
							value: otherContactPersonGUID
						},
						{
							field: 'projectteam.contactperson',
							value: app.whoami().thisInstanceOfMe.user.contactperson
						}
					],
					sorts:
					[
						{
							field: 'projectteam.project.startdate',
							direction: 'desc'
						}
					],
					callback: 'studio-connections-dashboard-show-projects',
					callbackParam: param
				});
			}
			else
			{
				var projectTeams = response.data.rows;

				var connectionsDashboardProjectsView = app.vq.init({queue: 'studio-connections-dashboard-show-projects'});

				var projects = _.filter(projectTeams, function (projectTeam)
				{
					return (projectTeam['projectteam.project.type'] != app.whoami().mySetup.projectTypes.management)
				});

				if (projects.length == 0)
				{
					connectionsDashboardProjectsView.add(
					[
						'<div class="mb-3 text-muted font-italic small">No projects at this moment.</li>'
					]);
				}
				else
				{
					
					connectionsDashboardProjectsView.template(
					[
						'<li class="mb-2">',
						'<div>{{projectteam.project.description}} <span class="text-secondary">({{projectteam.project.statustext}})</span></div>',
						'</li>'
					]);

					connectionsDashboardProjectsView.add('<ul class="list-group mb-2 ml-4 mt-2">')

					_.each(projects, function (project)
					{
						project.url = 'learner-project-summary';

						if (project['projectteam.project.type'] == app.whoami().mySetup.projectTypes.learning)
						{
							project.url = 'learner-project-do';
						}

						connectionsDashboardProjectsView.add({useTemplate: true}, project)
					});

					connectionsDashboardProjectsView.add('</ul>')
				}

				/*
				connectionsDashboardProjectsView.add(
				[
					'<button type="button" class="btn btn-sm btn-white mb-2 myds-click" aria-expanded="false">',
							'Add',
				'</button>'
				]);
				*/
													
				connectionsDashboardProjectsView.render('#studio-connections-dashboard-view-' + otherContactPersonGUID + '-projects');
			}
		}
	}
});

app.add(
{
	name: 'studio-connections-dashboard-show-level-up-profile',
	code: function (param, response)
	{
		var otherContactPersonGUID = app._util.param.get(param.dataContext, 'guid').value;

		if (response == undefined)
		{
			entityos.cloud.search(
			{
				object: 'project_team',
				fields:
				[
					'projectteam.project.id'
				],
				filters:
				[
					{
						field: 'projectteam.project.contactperson.guid',
						value: otherContactPersonGUID
					},
					{
						field: 'projectteam.contactperson',
						value: app.whoami().thisInstanceOfMe.user.contactperson
					},
					{
						field: 'projectteam.project.type',
						value: app.whoami().mySetup.projectTypes.management
					},
					{
						field: 'projectteam.project.subtype',
						value: app.whoami().mySetup.projectSubTypes.learningLevelUp
					}
				],
				rows: 1,
				sorts:
				[
					{
						field: 'projectteam.project.id',
						direction: 'desc'
					}
				],
				callback: 'studio-connections-dashboard-show-level-up-profile',
				callbackParam: param
			});
		}
		else
		{
			var levelUpProfileProject = _.first(response.data.rows);

			//if (!_.isUndefined(levelUpProfileProject))
			//{
				app.invoke('studio-connections-dashboard-show-level-up-profile-show',
				{
					levelUpProfileProject: {id: levelUpProfileProject['projectteam.project.id']},
					otherContactPersonGUID: otherContactPersonGUID
				});
			//}
		}
	}
});

app.add(
{
	name: 'studio-connections-dashboard-show-level-up-profile-show',
	code: function (param, response)
	{
		var levelUpProfileProject = app._util.param.get(param, 'levelUpProfileProject').value;

		if (_.isSet(levelUpProfileProject))
		{
			if (response == undefined)
			{
				entityos.cloud.search(
				{
					object: 'action',
					fields: ['text', 'modifieddate'],
					filters:
					[
						{
							field: 'type',
							value: app.whoami().mySetup.actionTypes.managementLevelUpProfile
						},
						{
							field: 'object',
							value: app.whoami().mySetup.objects.project
						},
						{
							field: 'objectcontext',
							value: levelUpProfileProject.id
						}
					],
					rows: 1,
					sorts: [{field: 'id', direction: 'desc'}],
					callback: 'studio-connections-dashboard-show-level-up-profile-show',
					callbackParam: param
				});
			}
			else
			{
				param.levelUpProfileAction = _.first(response.data.rows);
				app.invoke('studio-connections-dashboard-show-level-up-profile-show-render', param);
			}
		}
		else
		{
			app.invoke('studio-connections-dashboard-show-level-up-profile-show-render', param);
		}
	}
});

app.add(
{
	name: 'studio-connections-dashboard-show-level-up-profile-show-render',
	code: function (param, response)
	{
		var levelUpProfileProject = app._util.param.get(param, 'levelUpProfileProject').value;
		var levelUpProfileAction = app._util.param.get(param, 'levelUpProfileAction').value;
		var otherContactPersonGUID = app._util.param.get(param, 'otherContactPersonGUID').value;

		var connectionsDashboardLevelUpProfileView = app.vq.init(
		{
			queue: 'studio-connections-dashboard-show-projects-level-up-profile'
		});

		if (!_.isUndefined(levelUpProfileAction))
		{
			connectionsDashboardLevelUpProfileView.add([
				'<div>',
					app.invoke('level-up-util-profile-render',
					{
						data: levelUpProfileAction['text'],
						levelUpProfileProject: levelUpProfileProject
					}),
				'</div>'
			]);
		}
		else
		{
			connectionsDashboardLevelUpProfileView.add(
				app.invoke('level-up-util-profile-render',
				{
					levelUpProfileProject: levelUpProfileProject
				})
			);
		}

		connectionsDashboardLevelUpProfileView.render('#studio-connections-dashboard-view-' + otherContactPersonGUID + '-levelup-profile');

		if (_.isSet(levelUpProfileProject))
		{
			app.invoke('level-up-util-profile-render-reflections',
			{
				levelUpProfileProject: levelUpProfileProject
			});
		}
	}
});

app.add(
{
	name: 'studio-connections-dashboard-learning',
	code: function (param, response)
	{
		app.invoke('util-view-table',
		{
			object: 'project_team',
			container: 'studio-connections-learning-view',
			context: 'studio-connections-learning',
			filters:
			[
				{
					field: 'projectteam.project.restrictedtoteam',
					value: 'Y'
				},
				{
					field: 'projectteam.project.contactperson',
					comparison: 'NOT_EQUAL_TO',
					value: app.whoami().thisInstanceOfMe.user.contactperson
				},
				{
					field: 'projectteam.project.type',
					comparison: 'NOT_EQUAL_TO',
					value: app.whoami().mySetup.projectTypes.management
				},
				{
					field: 'projectteam.project.status',
					comparison: 'EQUAL_TO',
					value: app.whoami().mySetup.projectStatuses.completed
				}
			],
			options:
			{
				noDataText: '<div class="p-4">There is no completed learning projects.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				showFooter: false
			},
			format:
			{
				header:
				{
					class: 'd-flex'
				},

				row:
				{
					data: 'data-id="{{id}}"',
					class: 'd-flex'
				},

				columns:
				[
					{
						caption: 'Project',
						field: 'projectteam.project.description', 	
						sortBy: true,
						defaultSort: true,
						class: 'col-2 small',
						data: 'data-context="{{guid}}" data-controller="studio-setup-template-summary"'
					},
					{
						caption: 'Name',
						field: 'projectteam.project.contactperson.firstname', 	
						sortBy: true,
						defaultSort: true,
						class: 'col-2 small'
					},
					{
						caption: 'Last Name',
						field: 'projectteam.project.contactperson.surname', 	
						sortBy: true,
						defaultSort: true,
						class: 'col-2 small'
					},
					{
						caption: 'Info',
						field: 'projectteam.project.contactperson.mobile', 	
						sortBy: true,
						defaultSort: true,
						class: 'col-2 small'
					},
					{
						caption: 'Date',
						field: 'projectteam.project.modifieddate', 	
						sortBy: true,
						defaultSort: true,
						class: 'col-2 text-secondary small'
					},
					{
						caption: 'ID',
						field: 'guid', 	
						sortBy: true,
						class: 'col-2 text-secondary small'
					},
					{	
						fields:
						['projectteam.project.modifieddate']
					}
				]
			}
		});
	}
});

//-- LEARNING VERIFIY | & ISSUE ACHIEVEMENTS

app.add(
{
	name: 'studio-connections-dashboard-learning-verify',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'studio-connections-dashboard-learning-verify',
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
						field: 'relationship.contactperson.firstname',
						comparison: 'TEXT_IS_LIKE',
						value: data.search
					},
					{
						name: 'or'
					},
					{	
						field: 'relationship.contactperson.surname',
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

			filters.push(
			{
				field: 'othercontactperson',
				value: app.whoami().thisInstanceOfMe.user.contactperson
			});

			entityos.cloud.search(
			{
				object: 'contact_relationship',
				fields:
				[
					'relationship.contactperson.firstname',
					'relationship.contactperson.surname',
					'relationship.contactperson.email',
					'relationship.contactperson.guid',
					'relationship.contactperson.id',
					'relationship.contactperson._profileimage',
					'relationship.contactperson._howgoing',
					'guid',
					'createddate',
					'startdate',
					'typetext'
				],
				filters: filters,
				sorts:
				[
					{
						field: 'relationship.contactperson.firstname',
						direction: 'asc'
					}
				],
				callback: 'studio-connections-dashboard-learning-verify',
				callbackParam: param
			})
		}
		else
		{
			var connectionsView = app.vq.init({queue: 'studio-connections-dashboard'});

			if (response.data.rows.length == 0)
			{
				connectionsView.add(
				[
					'<div class="text-muted text-center">',
						'You do not have any connections that match this search.',
					'</div>'
				]);
			}
			else 
			{
				connectionsView.template(
				[
					'<div class="col-sm-12 mb-3 mt-1">',
						'<div class="card">',
							'<div class="card-body pt-3 pb-3">',
								'<div class="row mr-0">',
									'<div class="col-2 col-sm-1 text-center pl-0 pr-2">',
										'<img style="height:50px; width:50px;" class="img-fluid rounded-circle p-1" src="{{_profileimage}}">',	
									'</div>',
									'<div class="col-8 col-sm-9 pl-0">',
										'<div class="float-left">',
											'<h3 class="mt-1 mb-1">{{relationship.contactperson.firstname}} {{relationship.contactperson.surname}}</h3>',
											'<div class="small">You are {{relationship.contactperson.firstname}}\'s {{typetext}}</div>',
											'{{contactinfo}}',
										'</div>',
									'</div>',
									'<div class="col-2 text-right pr-0">',
										'<a class="btn btn-link btn-sm text-muted myds-collapse-toggle"',
											' data-toggle="collapse" role="button"',
											' href="#studio-connections-dashboard-learning-verify-collapse-{{relationship.contactperson.guid}}"',
										'>',
											'<i class="fa fa-chevron-down text-muted"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="collapse myds-collapse" id="studio-connections-dashboard-learning-verify-collapse-{{relationship.contactperson.guid}}"',
								' data-controller="studio-connections-dashboard-learning-verify-show"',
								' data-guid="{{relationship.contactperson.guid}}"',
								' data-id="{{relationship.contactperson.id}}">',

								'<div class="card-body pt-1">',
									'<div class="row mr-0">',
										'<div class="col-12">',
											'<ul class="nav nav-tabs myds-tab">',
												'<li class="nav-item">',
													'<a class="nav-link active" data-toggle="tab"',
														' href="#studio-connections-dashboard-learning-verify-show-{{relationship.contactperson.guid}}-tasks"',
														' data-guid="{{relationship.contactperson.guid}}"',
														' data-controller="studio-connections-dashboard-learning-verify-show-tasks">',
														'<i class="fe fe-square" style="color: #f66c1d !important;"></i> Verify Learning',
													'</a>',
												'</li>',
												'<li class="nav-item">',
													'<a class="nav-link" data-toggle="tab" ',
														' href="#studio-connections-dashboard-learning-verify-show-{{relationship.contactperson.guid}}-tasks-verified"',
														' data-guid="{{relationship.contactperson.guid}}"',
														' data-context="verified"',
														' data-controller="studio-connections-dashboard-learning-verify-show-tasks">',
														'<i class="fe fe-check-square" style="color: #28a745 !important;"></i> Verified Learning',
													'</a>',
												'</li>',
											'</ul>',
											'<div class="tab-content">',
												'<div class="tab-pane active pt-2" id="studio-connections-dashboard-learning-verify-show-{{relationship.contactperson.guid}}-tasks">',
													'<div class="text-secondary mt-2 mb-0">',
														'Learning & Project Tasks completed by {{relationship.contactperson.firstname}} ready for verification.',
													'</div>',
													'<div class="mt-4" id="studio-connections-dashboard-learning-verify-show-{{relationship.contactperson.guid}}-tasks-view">',
													'</div>',
												'</div>',
												'<div class="tab-pane pt-2" id="studio-connections-dashboard-learning-verify-show-{{relationship.contactperson.guid}}-tasks-verified">',
													'<div class="text-secondary mt-2 mb-0">',
														'Learning & Project Tasks verified by you for {{relationship.contactperson.firstname}}.',
													'</div>',
													'<div class="mt-4" id="studio-connections-dashboard-learning-verify-show-{{relationship.contactperson.guid}}-tasks-verified-view">',
													'</div>',
												'</div>',
									
											'</div>',
										'</div>',
									'</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);


				connectionsView.add(
				[
					'<div class="px-0">',
						'<div class="row">'
				]);

				_.each(response.data.rows, function (row)
				{
					row['_profileimage'] = row['relationship.contactperson._profileimage'];

					if (row['_profileimage'] == '')
					{
						row['_profileimage'] = app.whoami().mySetup.images.profile;
					}

					row.contactinfo = '';

					row.typetext = _.replace(row.typetext, 'Learning Partner; ', '');

					if (row['relationship.contactperson.email'] != '')
					{
						row.contactinfo += '<div class="pt-1 small">' + 
												'<i class="far fa-envelope mr-1 text-muted"></i><a class="text-muted" href="mailto:' + row['relationship.contactperson.email'] + '">' +
												row['relationship.contactperson.email'] + '</a>' +
											'</div>';
					}

					row.howgoinginfo = '';

					connectionsView.add({useTemplate: true}, row)
				});

				connectionsView.add('</div></div>');
			}

			connectionsView.render('#studio-connections-learning-verify-view');

			//app.invoke('studio-connections-dashboard-learning-verify-show', param);
		}
	}
});

app.add(
{
	name: 'studio-connections-dashboard-learning-verify-show',
	code: function (param, response)
	{
		//var otherContactPersonGUID = app._util.param.get(param.dataContext, 'guid').value;
		app.invoke('studio-connections-dashboard-learning-verify-show-tasks', param);

		//Do on expand
		//app.invoke('studio-connections-dashboard-show-projects', param);
	}
});

app.add(
{
	name: 'studio-connections-dashboard-learning-verify-show-tasks',
	code: function (param, response)
	{
		var otherContactPersonGUID = app._util.param.get(param.dataContext, 'guid').value;
		var context = app._util.param.get(param.dataContext, 'context').value;
		
		let viewContext = '';
		if (_.isSet(context))
		{
			viewContext = context + '-';
		}
		else
		{
			context = '';
		}

		var data = app.get(
		{
			scope: 'studio-connections-dashboard-learning-verify-show-tasks',
			valueDefault: {}
		});

		var filters =
		[
			{
				field: 'projecttask.project.restrictedtoteam',
				value: 'Y'
			},
			{
				field: 'projecttask.taskbyuser.contactperson.guid',
				value: otherContactPersonGUID
			},
			{
				field: 'projecttask.status',
				value: app.whoami().mySetup.projectTaskStatuses[(context==''?'inProgress':'completed')]
			},
			{
				field: 'percentagecomplete',
				value: 100
			}
		];

		if (response == undefined)
		{
			if (!_.isEmpty(data.search))
			{
				if (!_.isEmpty(data.search))
				{
					filters = _.concat(filters,
					[
						{	
							field: 'description',
							comparison: 'TEXT_IS_LIKE',
							value: data.search
						}
					]);
				}
			}

			entityos.cloud.search(
			{
				object: 'project_task',
				fields:
				[
					'reference',
					'title',
					'guid',
					'projecttask.taskbyuser.contactperson.firstname',
					'projecttask.taskbyuser.contactperson.surname',
					'projecttask.taskbyuser.contactperson.guid',
					'modifieddate',
					'percentagecomplete',
					'statustext',
					'startdate',
					'projecttask.project.guid',
					'projecttask.project.title',
					'projecttask.project.description',
					'notes'
				],
				filters: filters,
				sorts:
				[
					{
						field: 'modifieddate',
						direction: 'desc'
					}
				],
				callback: 'studio-connections-dashboard-learning-verify-show-tasks',
				callbackParam: param
			})
		}
		else
		{
			var feedView = app.vq.init({queue: 'studio-connections-feed-dashboard'});

			if (response.data.rows.length == 0)
			{
				feedView.add(
				[
					'<div class="text-muted text-center">',
						'There are no learning or project tasks ', (context==''?'ready for verification':'that have been verified'), '.',
					'</div>'
				]);
			}
			else 
			{
				feedView.add(
				[
					'<div class="list-group list-group-flush my-n3">'
				]);

				feedView.template(
				[
					'<div class="list-group-item pt-3">',
						'<div class="row">',
							'<div class="col">',
								'<div class="pl-1 pb-0">',
									'<h4 class="mb-1">',
										'{{title}}',
                        			'</h4>',
									'<div class="text-muted small">{{projecttask.project.description}}</div>',	
									'<div>{{notes}}</div>',			
								'</div>',
							'</div>',
							'<div class="col-auto">',
									'<button type="button" class="btn btn-sm btn-default btn-outline myds-click"',
										' data-controller="studio-connections-dashboard-learning-verify-task-save"',
										' data-id="{{id}}"',
										' data-context="', context, '"',
										' data-guid="{{projecttask.taskbyuser.contactperson.guid}}">',
											'<i class="fe fe-', (context==''?'check':'x') + '"></i>',
										'</button>',
							'</div>',
						'</div>',
					'</div>'
				]);

				_.each(response.data.rows, function (row)
				{
					row.initials = _.first(row['projecttask.taskbyuser.contactperson.firstname']) +
										_.first(row['projecttask.taskbyuser.contactperson.surname']);

					if (_.startsWith(row.notes, '{'))
					{
						row._notes = JSON.parse(row.notes);
						row.notes = '<ul>' + _.map(row._notes.reflections, function (reflection)
						{
							reflection._value = reflection.value;
							if (_.isSet(reflection.valueText)) {reflection._value = _.first(_.split(reflection.valueText, '|'))}
							return '<li><div class="mt-2 text-secondary fw-bold">' + (reflection.description!=undefined?reflection.description:'Reflection #' + (reflection.index + 1)) + '</div><div class="mb-1">' + reflection._value + '</div></li>'
						}) + '</ul>';
					}

					feedView.add({useTemplate: true,}, row)
				});

				feedView.add('</div>')
			}

			feedView.render('#studio-connections-dashboard-learning-verify-show-' + otherContactPersonGUID + '-tasks-' + viewContext + 'view')
		}
	}
});

app.add(
{
	name: 'studio-connections-dashboard-learning-verify-task-save',
	code: function (param, response)
	{	
		var taskID = app._util.param.get(param.dataContext, 'id').value;
	
		if (response == undefined)
		{
			var context = app._util.param.get(param.dataContext, 'context').value;

			var data =
			{
				id: taskID,
				status: app.whoami().mySetup.projectTaskStatuses.completed
			}

			if (context == 'verified')
			{
				data.status = app.whoami().mySetup.projectTaskStatuses.inProgress
			}

			entityos.cloud.save(
			{
				object: 'project_task',
				data: data,
				callback: 'studio-connections-dashboard-learning-verify-task-save',
				callbackParam: param
			});
		}
		else
		{
			app.invoke('studio-connections-dashboard-learning-verify-show-tasks', param);
		}
	}
});

//-- LEARNING PARTNERS SUPPORTING THE LEARNING PARTNER

app.add(
{
	name: 'studio-connections-dashboard-learning-partners',
	notes: 'The learning partners of the learning partner (as a learner)',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learner-connections-dashboard',
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
						field: 'relationship.othercontactperson.firstname',
						comparison: 'TEXT_IS_LIKE',
						value: data.search
					},
					{
						name: 'or'
					},
					{	
						field: 'relationship.othercontactperson.surname',
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

			filters.push(
			{
				field: 'contactperson',
				value: app.whoami().thisInstanceOfMe.user.contactperson
			});

			entityos.cloud.search(
			{
				object: 'contact_relationship',
				fields:
				[
					'relationship.othercontactperson.firstname',
					'relationship.othercontactperson.surname',
					'relationship.othercontactperson.email',
					'relationship.othercontactperson.guid',
					'guid',
					'createddate',
					'startdate',
					'typetext'
				],
				filters: filters,
				sorts:
				[
					{
						field: 'relationship.othercontactperson.firstname',
						direction: 'asc'
					}
				],
				callback: 'studio-connections-dashboard-learning-partners'
			})
		}
		else
		{
			var connectionsView = app.vq.init({queue: 'learner-connections-dashboard'});

			if (response.data.rows.length == 0)
			{
				connectionsView.add(
				[
					'<div class="text-muted text-center">',
						'You do not have any connections that match this search.',
					'</div>'
				]);
			}
			else 
			{
				connectionsView.template(
				[
					'<div class="col-sm-12 mb-3 mt-0">',
						'<div class="card">',
							'<div class="card-body py-3">',
								'<div class="row mr-0">',
									'<div class="col-10">',
										'<h3 class="mt-1 mb-1">{{relationship.othercontactperson.firstname}} {{relationship.othercontactperson.surname}}</h3>',
										'<div class="small">{{typetext}}</div>',
										'{{contactinfo}}',
									'</div>',
									'<div class="d-none col-2 text-right pr-0">',
										'<a class="btn btn-link btn-sm text-muted myds-collapse-toggle"',
											' data-toggle="collapse" role="button"',
											' href="#learner-connections-dashboard-collapse-{{relationship.othercontactperson.guid}}"',
										'>',
											'<i class="fa fa-chevron-down text-muted"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="collapse myds-collapse" id="learner-connections-dashboard-collapse-{{relationship.othercontactperson.guid}}"',
								'data-controller="learner-connections-dashboard-show"',
								'data-guid="{{relationship.othercontactperson.guid}}">',
								'<div class="card-body pt-1 pb-2 px-4 border-top">',
									'<h4 class="mt-3 mb-0 text-muted"><i class="fas fa-sync-alt mr-1 text-info"></i> Reflections</h4>',
									'<div class="text-muted small mb-1 ml-4">By this connection for you; on your growth & for your growth.</div>',
									'<div id="learner-connections-dashboard-view-{{relationship.othercontactperson.guid}}-reflections">',
									'</div>',
								'</div>',
								'<div class="card-body pt-1 pb-2 px-4 border-top">',
									'<h4 class="mb-1 mt-3 text-muted"><i class="fas fa-comment-alt mr-1 text-info"></i> Endorsements</h4>',
									'<div id="learner-connections-dashboard-view-{{relationship.othercontactperson.guid}}-endorsements">',
									'</div>',
								'</div>',
								'<div class="card-body pt-1 pb-2 px-4 border-top">',
									'<h4 class="mb-0 mt-3 text-muted"><i class="fas fa-certificate mr-1 text-info"></i> Achievements</h4>',
									'<div class="text-muted small mb-1 ml-4">Assigned by this connection ie learning partner.  Includes skills.</div>',
									'<div id="learner-connections-dashboard-view-{{relationship.othercontactperson.guid}}-skills">',
									'</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);

				connectionsView.add(
				[
					'<div class="px-0">',
						'<div class="row">'
				]);

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

					connectionsView.add({useTemplate: true}, row)
				});

				connectionsView.add('</div></div>');
			}

			connectionsView.render('#studio-connections-dashboard-learning-partners-view');
		}
	}
});

app.add(
{
	name: 'studio-connections-dashboard-learners-init',
	notes: 'Show LP Code',
	code: function (param, response)
	{	
		// First part of ID GUID
	}
})

app.add(
{
	name: 'studio-connections-dashboard-learners-signup',
	notes: 'Sign Up a user > Learning Partner > Connections > Sign Up',
	code: function (param, response)
	{	
		if (response == undefined)
		{
			entityos.cloud.search(
			{
				object: 'contact_person',
				fields: ['contactperson.contactbusiness.guid', 'guid'],
				filters: [{field: 'id', value: app.whoami().thisInstanceOfMe.user.contactperson}],
				callback: 'studio-connections-dashboard-learners-signup'
			});
		}
		else
		{
			app.set(
			{
				scope: 'studio-connections-dashboard-learners-signup-learner',
				context: 'contactbusinessguid',
				value: _.first(response.data.rows)['contactperson.contactbusiness.guid']
			});

			app.set(
			{
				scope: 'studio-connections-dashboard-learners-signup-learner',
				context: 'contactbusinesstext',
				value: app.whoami().thisInstanceOfMe.user.contactbusinesstext
			});

			app.set(
			{
				scope: 'studio-connections-dashboard-learners-signup-learner',
				context: 'source',
				value: 'contactperson:' + _.first(response.data.rows)['guid']
			});

			app.invoke('studio-connections-dashboard-learners-signup-process')
		}
	}
});

app.add(
{
	name: 'studio-connections-dashboard-learners-signup-process',
	code: function (param)
	{	
		let contactbusinessGUID = _.get(param, 'dataContext.contactbusinessguid');
		let contactbusinessText = _.get(param, 'dataContext.contactbusinesstext');

		let contactpersonFirstName = _.get(param, 'dataContext.contactpersonfirstname', '');
		let contactpersonLastName = _.get(param, 'dataContext.contactpersonlastname', '');
		let contactpersonEmail = _.get(param, 'dataContext.contactpersonemail', '');

		let source = _.get(param, 'dataContext.source');

		let linkContext = _.get(param, 'dataContext.context', '');
		if (_.isSet(linkContext)) {linkContext = '-' + linkContext}

		var data = app.get(
		{
			scope: 'studio-connections-dashboard-learners-signup-learner',
			valueDefault: {}
		});

		if (_.isNotSet(contactbusinessGUID))
		{
			contactbusinessGUID = data.contactbusinessguid;
		}

		if (_.isNotSet(contactbusinessText))
		{
			contactbusinessText = data.contactbusinesstext;
		}

		if (_.isNotSet(contactpersonFirstName))
		{
			contactpersonFirstName = data.contactpersonfirstname;
		}

		if (_.isNotSet(contactpersonLastName))
		{
			contactpersonLastName = data.contactpersonlastname;
		}

		if (_.isNotSet(contactpersonEmail))
		{
			contactpersonEmail = data.contactpersonemail;
		}

		if (_.isNotSet(source))
		{
			source = _.get(data, 'source', '');
		}

		var linkView = app.vq.init({queue: 'util-setup-user-signup-invite-generate-link'});

		if (_.isNotSet(contactpersonFirstName) || _.isNotSet(contactpersonFirstName) || _.isNotSet(contactpersonEmail))
		{
			linkView.add('<div class="text-warning mt-3">Please enter all the details.</div>')
		}
		else
		{
			// Add guid of the user signing up - for connection Octos etc

			var context = 
			'{' +
				'"contactbusinesstext":"' + contactbusinessText + '",' +
				'"contactbusinessguid":"' + contactbusinessGUID  + '",' +
				'"firstname":"' + contactpersonFirstName + '",' +
				'"lastname":"' + contactpersonLastName + '",' +
				'"email":"' + contactpersonEmail + '",' +
				'"origin":"' + window.location.origin + '",' +
				'"source":"' + source + '",' +
				'"sourcecontact":"' + app.whoami().thisInstanceOfMe.user.email + '"' +
			'}'

			let url = 'https://' + (app.whoami().mySetup.isLab?'signup-lab.selfdriven.cloud':'signup.slfdrvn.app')

			var contextBase58 = app.invoke('util-convert-to-base58', {text: context});

			url += '/signup#:z' + contextBase58; // z prefix means it is base58

			app.set(
			{
				scope: 'util-setup-users-invite-generate-link',
				context: 'url',
				value: url
			});

			const urlCaption = _.truncate(url, {length: 64});

			linkView.add(
			[
				'<div class="text-center mt-3">',
					'<a href="', url, '" target="_blank">', urlCaption, '</a>',
					'<a class="entityos-click text-secondary ms-2" data-controller="util-setup-users-invite-generate-link-share"><i class="fa fa-copy fe fe-copy text-secondary"></i></a>',
				'</div>'
			]);
		}

		linkView.render('#studio-connections-dashboard-learners-signup-view' + linkContext)
	}
});

entityos._util.controller.add(
{
    name: 'util-setup-users-invite-generate-link-share',
    code: function (param)
    {
		const url = app.get(
		{
			scope: 'util-setup-users-invite-generate-link',
			context: 'url'
		});

		navigator.clipboard.writeText(url)
        .then(() => {
            app.notify('Copied to Clipboard')
        })
        .catch(err => {
           app.notify('Could Not Copy')
        });
	}
});