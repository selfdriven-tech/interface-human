/*
	{
    	title: "Learning Partner; Connections; Learners; Projects", 	
    	design: "https://www.selfdriven.foundation/design"
  	}
*/

app.add(
{
	name: 'learning-partner-connections-learners-projects',
	code: function (param, response)
	{		
		var projectTypes = app.get(
		{
			scope: 'learning-partner-connections-learners-projects',
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
					scope: 'learning-partner-connections-learners-projects',
					context: 'project-types'
				},
				callback: 'learning-partner-connections-learners-projects'
			});
		}
		else
		{
			app.vq.init({queue: 'learning-partner-connections-learners-projects-types'});
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
				queue: 'learning-partner-connections-learners-projects-types'
			});

			app.vq.add(
			[
				'<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" id="learning-partner-connections-learners-projects-types-filter" aria-expanded="false">',
					'<span class="dropdown-text">All</span>',
				'</button>',
				'<ul class="dropdown-menu mt-1"',
					'data-controller="learning-partner-connections-learners-projects-dashboard"',
					'data-context="type"',
				'>',
				'<li>',
					'<a href="#" class="myds-dropdown dropdown-item" data-id="-1">',
					'All',
					'</a>',
				'</li>'
			],
			{
				queue: 'learning-partner-connections-learners-projects-types'
			});

			_.each(projectTypes, function (projectType)
			{
				app.vq.add({useTemplate: true, queue: 'learning-partner-connections-learners-projects-types'}, projectType)
			});

			app.vq.add('</ul>',
			{
				queue: 'learning-partner-connections-learners-projects-types'
			});

			app.vq.render('#learning-partner-connections-learners-projects-types',
			{
				queue: 'learning-partner-connections-learners-projects-types'
			});

			app.invoke('learning-partner-connections-learners-projects-roles');
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-learners-projects-roles',
	code: function (param, response)
	{		
		var projectRoles = app.get(
		{
			scope: 'learning-partner-connections-learners-projects',
			context: 'project-roles'
		});

		if (response == undefined && projectRoles == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'setup_project_role',
				fields: ['title'],
				filters: [],
				sorts:
				[
					{
						field: 'displayorder',
						direction: 'asc'
					}
				],
				set:
				{
					scope: 'learning-partner-connections-learners-projects',
					context: 'project-roles'
				},
				callback: 'learning-partner-connections-learners-projects-roles'
			});
		}
		else
		{
			app.vq.init({queue: 'learning-partner-connections-learners-projects-roles'});
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
				queue: 'learning-partner-connections-learners-projects-roles'
			});

			app.vq.add(
			[
				'<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" id="learning-partner-connections-learners-projects-roles-filter" aria-expanded="false">',
					'<span class="dropdown-text">All</span>',
				'</button>',
				'<ul class="dropdown-menu mt-1"',
					'data-controller="learning-partner-connections-learners-projects-dashboard"',
					'data-context="role"',
				'>',
				'<li>',
					'<a href="#" class="myds-dropdown dropdown-item" data-id="-1">',
					'All',
					'</a>',
				'</li>'
			],
			{
				queue: 'learning-partner-connections-learners-projects-roles'
			});

			_.each(projectRoles, function (projectRole)
			{
				app.vq.add({useTemplate: true, queue: 'learning-partner-connections-learners-projects-roles'}, projectRole)
			});

			app.vq.add('</ul>',
			{
				queue: 'learning-partner-connections-learners-projects-roles'
			});

			app.vq.render('#learning-partner-connections-learners-projects-roles',
			{
				queue: 'learning-partner-connections-learners-projects-roles'
			});

			app.invoke('learning-partner-connections-learners-projects-dashboard');
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-learners-projects-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-connections-learners-projects-dashboard',
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
						name: 'or'
					},
					{	
						field: 'projectteam.project.contactperson.firstname',
						comparison: 'TEXT_IS_LIKE',
						value: data.search
					},
					{
						name: 'or'
					},
					{	
						field: 'projectteam.project.contactperson.surname',
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

			if (!_.isUndefined(data.role))
			{
				if (data.role != -1)
				{
					filters = _.concat(filters,
					[
						{	
							field: 'projectrole',
							value: data.role
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
					'projectteam.project.contactperson.email',
					'projectroletext'
				],
				filters: filters,
				sorts:
				[
					{
						field: 'projectteam.project.description',
						direction: 'asc'
					}
				],
				callback: 'learning-partner-connections-learners-projects-dashboard'
			})
		}
		else
		{
			app.vq.init({queue: 'learning-partner-connections-learners-projects-dashboard'});

			if (response.data.rows.length == 0)
			{
				app.vq.add(
				[
					'<div class="text-muted text-center">',
						'There are no projects that you have a connection to that match this search.',
					'</div>'
				],
				{
					queue: 'learning-partner-connections-learners-projects-dashboard'
				});
			}
			else 
			{
				app.vq.add(
				[
					'<div class="col-sm-12 mb-3 mt-1">',
						'<div class="card mb-3">',
							'<div class="card-body">',
								'<div class="row">',
									'<div class="col-10">',
										'<h3 class="mt-1 mb-1"><span class="mr-2">{{projectteam.project.description}}</span><span class="text-muted small">{{projectIcon}}</span></h3>',
										'<div class="text-muted">{{projectteam.project.contactperson.firstname}} {{projectteam.project.contactperson.surname}}</div>',
										'<div class="small mt-1">{{projectteam.project.notes}}</div>',
									'</div>',
									'<div class="col-2 text-right">',
										'<a class="btn btn-link btn-sm text-muted myds-collapse-toggle"',
											' data-toggle="collapse" role="button"',
											' href="#learning-partner-connections-learners-projects-dashboard-collapse-{{projectteam.project.id}}"',
										'>',
											'<i class="fa fa-chevron-down text-muted"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="collapse myds-collapse" id="learning-partner-connections-learners-projects-dashboard-collapse-{{projectteam.project.id}}"',
								' data-controller="learning-partner-connections-learners-projects-dashboard-show"',
								' data-project="{{projectteam.project.id}}"',
								' data-projectguid="{{projectteam.project.guid}}">',
								'<div class="card-body pt-1 pb-4 px-4" id="learning-partner-connections-learners-projects-dashboard-view-{{projectteam.project.id}}">',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				],
				{
					type: 'template',
					queue: 'learning-partner-connections-learners-projects-dashboard'
				});

				app.vq.add(
				[
					'<div class="px-0">',
						'<div class="row">'
				],
				{
					queue: 'learning-partner-connections-learners-projects-dashboard'
				});

				_.each(response.data.rows, function (row)
				{
					row.projectIcon = '<i class="fa fa-users fa-fw"></i>'
					if (row['projecttask.project.restrictedtoteam'] == 'Y')
					{
						row.projectIcon = '<i class="fa fa-user fa-fw"></i>'
					}

					app.vq.add({useTemplate: true, queue: 'learning-partner-connections-learners-projects-dashboard'}, row)
				});

				app.vq.add('</div></div>',
				{
					queue: 'learning-partner-connections-learners-projects-dashboard'
				});
			}

			app.vq.render('#learning-partner-connections-learners-projects-view',
			{
				queue: 'learning-partner-connections-learners-projects-dashboard'
			});
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-learners-projects-dashboard-show',
	code: function (param, response)
	{
		var projectID = app._util.param.get(param.dataContext, 'project').value;
		var projectGUID = app._util.param.get(param.dataContext, 'projectguid').value;

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'project_task',
				fields:
				[
					'title',
					'notes',
					'type',
					'typetext',
					'startdate',
					'enddate',
					'status',
					'statustext',
					'percentagecomplete',
					'taskbyuser',
					'taskbyusertext',
					'description'
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
						field: 'startdate',
						direction: 'desc'
					}
				],
				callback: 'learning-partner-connections-learners-projects-dashboard-show',
				callbackParam: param
			})
		}
		else
		{
			var projectView = app.vq.init({queue: 'learning-partner-connections-learners-projects-dashboard-show'});

			if (response.data.rows.length == 0)
			{
				projectView.add('<div class="text-muted text-center">No tasks</div>')
			}
			else
			{
				projectView.add(
				[
					'<li class="list-group-item">',
						'<h4 class="mb-0">{{title}}</h4>',
						'<div class="text-secondary small">{{taskbyusertext}}</div>',
						'<div class="text-secondary small mb-1">{{typetext}}, {{statustext}}, {{percentagecomplete}}%</div>',
						'<div class="text-secondary small mb-2">{{description}}</div>',

						'<div class="progress progress-small">',
	  						'<div class="progress-bar" style="width: {{percentagecomplete}}%;" role="progressbar" aria-valuenow="{{percentagecomplete}}" aria-valuemin="0" aria-valuemax="100"></div>',
						'</div>',
						
						'<div class="d-none text-secondary small mt-2">',
							'<a class="text-secondary myds-collapse-toggle" data-toggle="collapse" role="button"',
							' href="#learning-partner-connections-learners-projects-dashboard-collapse-26185" aria-expanded="true">',
								'Updates & Reflections <i class="far fa-chevron-down"></i>',
							'</a>',
						'</div>',
						'<div class="text-secondary small mt-3">',
							'<a class="text-secondary btn btn-sm btn-white myds-collapse-toggle" data-toggle="collapse" role="button"',
							' href="#learning-partner-connections-learners-projects-dashboard-task-attachments-{{id}}-collapse" aria-expanded="true">',
								'Files & Links <i class="far fa-chevron-down"></i>',
							'</a>',

							'<div class="myds-collapse collapse" id="learning-partner-connections-learners-projects-dashboard-task-attachments-{{id}}-collapse"',
								' data-controller="learning-partner-connections-learners-projects-dashboard-show-task-attachments" data-id="{{id}}"',
								'>',
								'<div class="mt-2 card"><div class="card-body p-0" id="learning-partner-connections-learners-projects-dashboard-task-attachments-{{id}}-view"></div></div>',

							'</div>',
						'</div>',
					'</li>'
				],
				{type: 'template'})

				projectView.add('<h4 class="d-none mb-3 text-info"><i class="fa fa-list-alt fa-fw mr-1 text-info"></i>Tasks</h4>');
									
				projectView.add(
				[
					'<div class="feed-activity-list">',
						'<ul class="list-group mb-2">'
				]);

				_.each(response.data.rows, function (row)
				{
					projectView.add({useTemplate: true}, row)
				});

				projectView.add(
				[
						'</ul>',
					'</div>'
				]);

				projectView.add(
				[
					'<div class="mt-4">',
						'<a class="btn btn-default text-white btn-sm myds-navigate mr-2 "',
							'  data-scope="learning-partner-project-summary"',
							'  data-context="', projectGUID ,'"',
						'>Open Project</a>',
				
						'<button type="button" class="btn btn-default text-white btn-sm myds-navigate"',
							' data-controller="learning-partner-connections-project-achievements"',
							' data-context="', projectGUID ,'"',
							'>',
							'Allocate Achievements & Skills',
						'</button>',
					'</div>'
				]);
			}
                                                  
			projectView.render('#learning-partner-connections-learners-projects-dashboard-view-' + projectID)
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-learners-projects-dashboard-show-task-attachments',
	code: function (param, response)
	{
		var taskID = app._util.param.get(param.dataContext, 'id').value;
		
		//app.show('#learning-partner-connections-learners-projects-dashboard-task-attachments-' + taskID + '-view', taskID);

		app.invoke('util-attachments-show',
		{
			container: 'learning-partner-connections-learners-projects-dashboard-task-attachments-' + taskID + '-view',
			object: app.whoami().mySetup.objects.projectTask,
			objectContext: taskID,
			showUnlink: false
		});
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
			dataController: 'learning-partner-connections-learners-projects',
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

app.add(
{
	name: 'learning-partner-connections-project-achievements',
	code: function (param, response)
	{	
		var projectGUID = app._util.param.get(param, 'dataContext').value;
		
		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'project',
				fields: ['sourceprojecttemplate', 'sourceprojecttemplate', 'project.contactperson.firstname', 'project.contactperson.surname', 'project.contactperson.email', 'description', 'description', 'statustext'],
				filters:
				[
					{
						field: 'guid',
						value: projectGUID
					}
				],
				callback: 'learning-partner-connections-project-achievements',
				callbackParam: param
			});
		}
		else
		{
			var project = app.set(
			{
				scope: 'learning-partner-connections-project-achievements',
				context: 'project',
				value: _.first(response.data.rows)
			});

			app.show('#learning-partner-connections-project-achievements-header-view', project.description);

			app.show('#learning-partner-connections-project-achievements-summary-view',
			[
				'<h2 class="text-secondary mb-2">', project['project.contactperson.firstname'], ' ', project['project.contactperson.surname'] ,'</h2>'
			]);

			app.invoke('learning-partner-connections-project-achievements-allocate', project)
		}
	}	
});

// GET template json for skills.gained
// GET current actions (type SDA) linked to the project


app.add(
{
	name: 'learning-partner-connections-project-achievements-allocate',
	code: function (param, response)
	{
		var project = app.get(
		{
			scope: 'learning-partner-connections-project-achievements',
			context: 'project'
		});

		var projectTemplate = project.sourceprojecttemplate;

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'core_attachment',
				fields: 
				[
					'download',
					'url',
					'filename',
					'title'
				],
				filters:
				[
					{
						field: 'object',
						value: app.whoami().mySetup.objects.project
					},
					{
						field: 'objectcontext',
						comparison: 'EQUAL_TO',
						value: projectTemplate
					},
					{
						field: 'filename',
						comparison: 'TEXT_IS_LIKE',
						value: 'selfdriven.template.project'
					}
				],
				sorts:
				[
					{
						field: 'createddate',
						direction: 'desc'
					}
				],
				rows: 1,
				callback: 'learning-partner-connections-project-achievements-allocate',
				callbackParam: param
			});
		}
		else
		{
			var projectTemplateFile = _.first(response.data.rows)

			app.set(
			{
				scope: 'learning-partner-connections-project-achievements-allocate',
				context: 'source-template',
				value: projectTemplateFile
			});

			param = app._util.param.set(param, 'projectTemplateFile', projectTemplateFile);
			app.invoke('learning-partner-connections-project-achievements-allocate-skills-gained-init', param);
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-project-achievements-allocate-skills-gained-init',
	code: function (param)
	{
		app._util.param.set(param, 'onComplete', 'learning-partner-connections-project-achievements-allocate-skills-gained-show');

		app.invoke('util-project-source-template-file-get', param);
	}
});

app.add(
{
	name: 'learning-partner-connections-project-achievements-allocate-skills-gained-show',
	code: function (param)
	{
		var projectTemplateFile = app._util.param.get(param, '_file').value;

		if (_.has(projectTemplateFile, 'template.project'))
		{
			var projectTemplate = projectTemplateFile.template.project;

			if (_.has(projectTemplate, 'skills.gained'))
			{
				var skillsContexts = projectTemplate.skills['scope-contexts'];

				if (skillsContexts == undefined)
				{
					skillsContexts =
					[
						{
							"name": "All"
						}
					]
				}

				var skillsGainedView = app.vq.init({queue: 'skills-gained'});

				_.each(skillsContexts, function (skillsContext)
				{
					skillsContext.caption = '<div class="row"><div class="col-2">';

					if (_.isSet(skillsContext['image-uri']))
					{
						skillsContext.caption += '<img src="' + skillsContext['image-uri'] + '" class="float-left rounded-circle ml-2" style="height:40px;"></div>'
					}

					skillsContext.caption += ('<div class="col-auto mt-3"><h4');

					if (_.isSet(skillsContext.style))
					{
						skillsContext.caption += ' style="' + skillsContext.style + '"'
					}

					skillsContext.caption += ('>' + skillsContext.name + '</h4>');
					 
					skillsContext.caption += '</div></div>';

					skillsGainedView.add(
					[
								'<div class="card">',
									'<div class="card-body">',
										'<div class="row align-items-end">',
											'<div class="col">',
												skillsContext.caption,
											'</div>',
											'<div class="col-auto pb-1">',
												'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-skills-gained-', _.kebabCase(skillsContext.name), '-collapse">',
													'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
												'</a>',
											'</div>',
										'</div>',							
									'</div>',
									'<div class="collapse myds-collapse" id="util-project-information-skills-gained-', _.kebabCase(skillsContext.name), '-collapse"',
										' data-controller="util-project-information-show-tasks"',
										' data-name="', skillsContext.name, '">',
										'<div id="util-project-information-skills-gained-', _.kebabCase(skillsContext.name), '">',
											
					]);

					if (skillsContext.name == 'All')
					{
						skillsContext.skillsGained = projectTemplate.skills.gained
					}
					else
					{
						skillsContext.skillsGained = _.filter(projectTemplate.skills.gained, function(skillsGained)
						{
							return _.includes(skillsGained.scope.contexts, skillsContext.name)
						})
					}

					skillsGainedView.add('<div class="row">');
			
					_.each(skillsContext.skillsGained, function (skill)
					{
						skill._validationView = '';

						if (_.has(skill, 'validation.evidence'))
						{
							skill._validationView = '<div>';

							_.each(skill.validation.evidence, function (evidence)
							{
								skill._validationView += '<div class="text-secondary mt-4">' + evidence.description + '</div>'
							});

							skill._validationView += '</div>'
						}
					
						skillsGainedView.add(
						[
												'<div class="col-6">',
													'<div class="card">',
														'<div class="card-body text-center">',
															'<h4>', skill.name, '</h4>',
															skill._validationView,
															'<button type="button" class="btn btn-sm btn-white mb-2 mt-4 myds-click"',
																' data-controller="learning-partner-connections-project-achievements-allocate-process" ',
																' data-spinner="prepend"',
																' data-sdi="', skill.sdi, '"',
																' data-context="', skill.uri, '">Allocate</button>',
														'</div>',
													'</div>',
												'</div>'
						]);
					});

					skillsGainedView.add(
					[
											'</div>'
					])

					if (_.isSet(skillsContext.tokens))
					{
						skillsGainedView.add('<div class="row">');

						_.each(skillsContext.tokens, function (tokenCount, tokenName)
						{
							skillsGainedView.add([
								'<div class="col-12 text-center mx-auto w-75 text-secondary mb-4">',
									tokenCount, ' ', tokenName.toUpperCase(), ' tokens will be earned for each skill gained at this level.',
								'</div>'
							]);
						});

						skillsGainedView.add('</div>');
					}

					skillsGainedView.add(
						[
										'</div>',
									'</div>',
								'</div>'
					]);	
				});

				skillsGainedView.render('#learning-partner-connections-project-achievements-allocate-view')
			}
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-project-achievements-allocated',
	code: function (param, response)
	{
		var project = app.get(
		{
			scope: 'learning-partner-connections-project-achievements',
			context: 'project'
		});

		var filters =
		[
			{
				field: 'object',
				value: app.whoami().mySetup.objects.project
			},
			{
				field: 'objectcontext',
				comparison: 'EQUAL_TO',
				value: project.id
			},
			{	
				field: 'actiontype',
				comparison: 'IN_LIST',
				value: app.whoami().mySetup.actionTypes.achievement
			}
		];

		app.invoke('util-view-table',
		{
			object: 'action',
			container: 'learning-partner-connections-project-achievements-allocated-view',
			context: 'learning-partner-connections-project-achievements-allocated',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">There are no achievements allocated to this project.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this achievement?',
					position: 'left'
				}
			},
			format:
			{
				header:
				{
					class: 'd-flex'
				},

				row:
				{
					data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="learning-partner-connections-achievement-summary"',
					class: 'd-flex'
				},

				columns:
				[
					{
						caption: 'For',
						field: 'contactpersontext',
						defaultSort: true,
						sortBy: true,
						class: 'col-sm-4 myds-navigate'
					},
					{
						caption: 'Subject',
						field: 'subject', 	
						sortBy: true,
						class: 'col-sm-5 myds-navigate'
					},
					{
						caption: 'Date',
						field: 'createddate', 	
						sortBy: true,
						class: 'col-sm-3 myds-navigate'
					},
					{	
						fields:
						['guid']
					}
				]
			}
		});
	}
});


