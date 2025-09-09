/*
	
	{
    	namespace: "selfdriven.app",
		scope: "org",
		context: "projects", 	
    	notes: "https://selfdriven.foundation/apps"
  	}
*/

app.add(
{
	name: 'learner-projects',
	code: function (param, response)
	{
		app.invoke('util-level-up-profile-challenges-project-check',
		{
			viewSelector: '#learner-projects-dashboard-level-up-profile-challenges-check',
			viewType: 'vertical'
		});

		// Types:
		// - Learning = Projects
		// - Verification = Quizzes
	
		var id = app._util.param.get(param, 'id', {default: 'learning'}).value;

		if (id == 'learning')
		{
			app.invoke('util-view-tab-show', '#learner-projects-dashboard-learning');
		}

		if (id == 'verification')
		{
			app.invoke('util-view-tab-show', '#learner-projects-dashboard-verification');
		}

		app.set(
		{
			scope: 'learner-projects-dashboard',
			merge: true,
			value: {dataContext: {type: id}}
		});

		app.invoke('learner-projects-dashboard', param)
	}
});

app.add(
{
	name: 'learner-projects-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learner-projects-dashboard',
			valueDefault: {}
		});

		var viewType = app._util.param.get(data.dataContext, 'type', {default: 'learning'}).value;
		var viewContainer = 'learner-projects-dashboard-view';
		var navigationController = 'learner-project-summary';

		/*{
			field: 'type',
		}
		{
				field: 'createduser',
				value: app.whoami().thisInstanceOfMe.user.id
			},
		*/

		var filters =
		[
			
			{
				field: 'restrictedtoteam',
				value: 'Y'
			}
		];

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

		if (viewType == 'all')
		{
			filters = _.concat(filters,
			[	
				{
					field: 'type',
					comparison: 'NOT_EQUAL_TO',
					value: app.whoami().mySetup.projectTypes.management
				}
			]);
		}

		if (viewType == 'learning') // LEARNING PROJECTS
		{
			viewContainer = 'learner-projects-dashboard-view-learning-container';

			filters = _.concat(filters,
			[	
				{
					field: 'projectmanager',
					value: app.whoami().thisInstanceOfMe.user.id
				},
				{
					field: 'type',
					value: app.whoami().mySetup.projectTypes.learning
				}
			]);
		}

		if (viewType == 'verification') // QUIZZES
		{
			viewContainer = 'learner-projects-dashboard-view-verification-container';
			navigationController = 'learner-project-do';

			filters = _.concat(filters,
			[	
				{
					field: 'projectmanager',
					value: app.whoami().thisInstanceOfMe.user.id
				},
				{
					field: 'type',
					value: app.whoami().mySetup.projectTypes.verification
				},
				{
					field: 'sourceprojecttemplate',
					comparison: 'IS_NOT_NULL'
				}
			]);
		}

		/*
		,
		{
			field: 'subtype',
			comparison: 'NOT_EQUAL_TO',
			value: app.whoami().mySetup.projectSubTypes.learningLevelUp
		}
		*/

		const viewLayout = 'grid' // (viewType=='learning'?'grid':'list');

		if (viewLayout == 'grid')
		{
			param = app._util.param.set(param, 'filters', filters);
			param.viewContainer = viewContainer;
			app.invoke('learner-projects-dashboard-grid', param)
		}
		else
		{
			app.invoke('util-view-table',
			{
				object: 'project',
				container: viewContainer,
				context: 'learner-projects',
				filters: filters,
				options:
				{
					noDataText: '<div class="p-4">You have no projects that match this search.</div>',
					rows: 20,
					orientation: 'vertical',
					progressive: true,
					class: 'table-condensed',
					deleteConfirm:
					{
						text: 'Are you sure you want to delete this project?',
						position: 'left'
					}
				},
				sorts:
				[
					{
						name: 'description',
						direction: 'asc'
					}
				],
				format:
				{
					header:
					{
						class: 'd-flex'
					},
					row:
					{
						data: 'data-id="{{id}}"',
						class: 'd-flex',
						controller: 'learner-projects-dashboard-format'
					},
					columns:
					[
						{
							caption: 'Description',
							name: 'projectInfo',
							class: 'col-12 col-sm-9 myds-navigate',
							data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="' + navigationController + '"'
						},
						{
							caption: 'Project ID',
							field: 'reference', 	
							sortBy: true,
							class: 'col-0 col-sm-3 d-none d-sm-block myds-navigate text-muted text-right',
							data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="' + navigationController + '"'
						},
						{	
							fields:
							[
								'type', 'notes', 'guid', 'typetext', 'category', 'description',
								'parentproject', 'parentprojecttext', 'projectmanager', 'restrictedtoteam',
								'project.parentproject.description', 'createduser', 'createdusertext'
							]
						}
					]
				}
			});
		}
	}
});

app.add(
{
	name: 'learner-projects-dashboard-grid',
	code: function (param, response)
	{
		var viewType = app._util.param.get(param.dataContext, 'type', {default: 'learning'}).value;

		if (response == undefined)
		{
			let filters = app._util.param.get(param, 'filters').value;

			entityos.cloud.search(
			{
				object: 'project',
				fields: ['reference', 'type', 'notes', 'guid', 'typetext', 'category', 'description',
								'parentproject', 'parentprojecttext', 'projectmanager', 'restrictedtoteam',
								'project.parentproject.description', 'createduser', 'createdusertext', 'statustext'],
				filters: filters,
				sorts:
				[
					{
						field: 'modifieddate',
						direction: 'desc'
					}
				],
				callback: 'learner-projects-dashboard-grid',
				callbackParam: param
			});
		}
		else
		{
			var viewContainer = app._util.param.get(param, 'viewContainer',
				{
					default: 'learner-projects-dashboard-view-learning-container'
				}
			).value;

			var navigationController = (viewType=='learning'?'learner-project-summary':'learner-project-do');

			var projectsView = app.vq.init({queue: 'learner-projects-dashboard'});

			if (response.data.rows.length == 0)
			{
				projectsView.add(
				[
					'<div class="text-secondary text-center pb-3">',
						'No ',
						(viewType=='learning'?'learning projects':'quizzes'),
						' to show.',
					'</div>'
				]);
			}
			else 
			{
				projectsView.template(
				[
					'<div class="col-12 col-sm-6 col-md-6 mb-3">',
						'<div class="card">',
							'<div class="card-body">',
								'<div class="row">',
									'<div class="col-10 myds-navigate" data-context="{{guid}}" data-id="{{guid}}" data-controller="', navigationController, '">',
										'<h2>{{projectInfo}}</h2>',
										'<div class="mt-1 text-secondary"><span class="badge badge-{{statusstyle}} p-2">{{statustext}}</span></div>',
										'<div class="d-none text-muted small mt-2">{{guid}}</div>',
									'</div>',
									'<div class="col-2 text-right">',
										'{{projectIcon}}',
									'</div>',
								'</div>',
							'</div>',
							'<div class="collapse myds-collapse" id="learner-projects-dashboard-collapse-{{guid}}"',
								'data-controller="learner-projects-dashboard-show"',
								'data-skill="{{guid}}">',
								'<div class="card-body pt-1 pb-4 px-4" id="learner-projects-dashboard-view-{{guid}}">',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);

				projectsView.add(
				[
					'<div class="px-0 mt-3">',
						'<div class="row">'
				]);

				_.each(response.data.rows, function (row)
				{
					app.invoke('learner-projects-dashboard-format', row);
					
					projectsView.add({useTemplate: true}, row)
				});

				projectsView.add('</div></div>');
			}

			projectsView.render('#' + viewContainer);
		}
	}
});

app.add(
{
	name: 'learner-projects-dashboard-format',
	code: function (row)
	{
		row.classNotes = (row.notes==''?'d-none':'');

		row.projectIcon = '<i class="fa fa-user text-secondary"></i>'
		if (row['createduser'] != app.whoami().thisInstanceOfMe.user.id)
		{
			row.projectIcon = '<i class="fa fa-users text-secondary"></i>'
		}

		row.projectInfo = '<span>' + row.description + '</span>';
		//'<span class="text-muted small" style="font-size: 0.7rem;">' + row.projectIcon + '</span>';

		row.createddate = app.invoke('util-date', {date: row.createddate, format: 'DD MMM YYYY'});

		row.statusstyle = (row.statustext=='Not Started'?'secondary':(row.statustext=='In Progress'?'warning':'success'));
	}
});

app.add(
{
	name: 'learner-project-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'learner-project-summary',
			context: 'id'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'learner-projects'});
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'project',
					fields: 
					[
						'description', 'type', 'typetext', 'subtype', 'subtypetext',
						'category', 'categorytext',
						'reference', 'notes', 
						'parentproject', 'parentprojecttext', 'projectmanager', 'restrictedtoteam',
						'project.parentproject.description',
						'startdate', 'enddate', 'sourceprojecttemplate',
						'contactbusiness', 'contactperson',
						'guid',
					],
					filters:
					[
						{
							field: 'guid',
							value: guid
						}
					],
					set: 
					{
						scope: 'learner-project-tasks',
						context: 'all'
					},
					callback: 'learner-project-summary'
				});
			}
			else
			{
				if (response.status == 'OK')
				{
					if (response.data.rows.length == 0)
					{}
					else
					{
						var data = _.first(response.data.rows);
						data.startdate = app.invoke('util-date', data.startdate);
						data.enddate = app.invoke('util-date', data.enddate);

						data.achievementtypeids = app.whoami().mySetup.actionTypes.achievement;
						data.reflectiontypeids = app.whoami().mySetup.actionTypes.reflection;

						app.set(
						{
							scope: 'learner-project-summary',
							context: 'dataContext',
							value: data
						});

						app.view.refresh(
						{
							scope: 'learner-project-summary',
							selector: '#learner-project-summary',
							data: data,
							collapse:
							{
								contexts:
								[
									'tasks', 'linked-projects', 'attachments', 'actions',
									'team-edit', 'tasks-edit', 'linked-projects-edit', 'attachments-edit', 'actions-edit'
								]
							}
						});

						app.invoke('learner-project-summary-source-template-show');
						
						app.invoke('util-attachments-initialise',
						{
							context: 'learner-project-summary',
							object: app.whoami().mySetup.objects.project,
							objectContext: data.id,
							showTypes: false,
							collapsible: false
						});
				
						var actionTypes = app.whoami().mySetup.actionTypes;
				
						app.invoke('util-actions-initialise',
						{
							context: 'learner-project-summary-reflections',
							object: app.whoami().mySetup.objects.project,
							objectContext: data.id,
							showTypes: false,
							collapsible: false,
							headerCaption: 'Search for Reflections & Feedback',
							typeIDs: actionTypes.reflection,
							types:
							[
								{
									id: actionTypes.reflectionBySelfOnGrowth,
									text: 'Reflection by Self On Growth'
								},
								{
									id: actionTypes.reflectionBySelfForGrowth,
									text: 'Reflection by Self For Growth'
								},
								{
									id: actionTypes.accountabilityFitForPurpose,
									text: 'Fit for Purpose Feedback'
								},
								{
									id: actionTypes.accountabilityUnfitForPurpose,
									text: 'Unfit for Purpose Feedback'
								}
							]
						});

						app.invoke('util-actions-initialise',
						{
							context: 'learner-project-summary-achievements',
							object: app.whoami().mySetup.objects.project,
							objectContext: data.id,
							showTypes: false,
							collapsible: false,
							showAdd: false,
							headerCaption: 'Search for Achievements',
							typeIDs: actionTypes.achievement
						});
					}
				}
			}
		}
	}	
});

app.add(
{
	name: 'learner-project-summary-source-template-show',
	code: function (param, response)
	{	
		var project = app.get(
		{
			scope: 'learner-project-summary',
			context: 'dataContext'
		});

		var sourceTemplateView = app.vq.init({queue: 'util-project-story-board-init'});

		if (_.isNotSet(project.sourceprojecttemplate))
		{
			app.show('#learner-project-summary-source-template-view', '');
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'project',
					fields: 
					[
						'description', 'type', 'typetext', 'subtype', 'subtypetext',
						'category', 'categorytext',
						'reference', 'notes', 
						'guid',
					],
					filters:
					[
						{
							field: 'id',
							value: project.sourceprojecttemplate
						}
					],
					callback: 'learner-project-summary-source-template-show'
				});
			}
			else
			{
				if (response.status == 'OK')
				{
					if (response.data.rows.length == 0)
					{
						sourceTemplateView.add('');
					}
					else
					{
						var sourceTemplate = _.first(response.data.rows);

						app.set(
							{
								scope: 'learner-project-summary',
								context: 'source-template',
								value: sourceTemplate
							});

						sourceTemplateView.add(
						[
							'<div class="card mt-4">',
								'<div class="card-body border-bottom pb-3">',
									'<div class="row">',
									'<div class="col-auto d-none"><i class="far fa-question-circle fa-lg mx-auto text-warning"></i></div>',
									'<div class="col">',
									'<h3 class="mb-1 text-warning">Project Help</h3>',
									'<div class="text-muted small mb-2">Based on ', sourceTemplate.description, '</div>',
									'</div>',
									'</div>',
								'</div>'
						]);
			
						sourceTemplateView.add(
						[
							'<div class="card-body">',
								'<div>', sourceTemplate.notes, '</div>',
							'</div>'
						]);

						sourceTemplateView.add(
						[
							'<div id="learner-project-summary-source-template-view-files"></div>'
						]);

						sourceTemplateView.add(
						[
							'</div>'
						]);
					}
				}

				sourceTemplateView.render('#learner-project-summary-source-template-view');

				app.invoke('learner-project-summary-source-template-show-files');
			}
		}
	}	
});

app.add(
{
	name: 'learner-project-summary-source-template-show-files',
	code: function (param, response)
	{	
		var projectTemplate = app.get(
		{
			scope: 'learner-project-summary',
			context: 'source-template'
		});

		if (projectTemplate == undefined)
		{
			app.invoke('util-project-information-init');
		}
		else
		{
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
							value: projectTemplate.id
						}
					],
					sorts:
					[
						{
							field: 'type',
							direction: 'asc'
						},
						{
							field: 'createddate',
							direction: 'asc'
						}
					],
					customOptions:
					[
						{
							name: 'object',
							value: app.whoami().mySetup.objects.project
						}
					],
					callback: 'learner-project-summary-source-template-show-files'
				});
			}
			else
			{
				var projectFilesView = app.vq.init({queue: 'util-project-story-board-files'});

				if (response.status == 'OK')
				{
					if (response.data.rows.length != 0)
					{
						projectFilesView.add(
						[
							'<div class="card-body border-top pb-2">',
								'<ul class="pb-0">'
						]);

						_.each(response.data.rows, function (row)
						{
							row.link = row.url;
							if (row.link == '') {row.link = row.download}
							row.linkname = row.title;
							if (row.linkname == '') {row.linkname = row.url}
							if (row.linkname == '') {row.linkname = row.filename}

							if (!_.includes(row.linkname, '.jpg'))
							{
								projectFilesView.add(
								[
									'<li><a href="', row.link, '" target="_blank">', row.linkname, '</li>'
								]);
							}
						});

						projectFilesView.add(
						[
								'</ul>',
							'</div>'
						]);

						_.each(response.data.rows, function (row)
						{
							row.link = row.download;
							row.linkname = row.filename;

							if (_.includes(row.linkname, '.jpg'))
							{
								projectFilesView.add(
								[
									'<div class="card-body border-top p-5">',
										'<img class="img-fluid rounded" src="', row.link, '">',
									'</div>'
								]);
							}
						});

						projectFilesView.render('#learner-project-summary-source-template-view-files');
					}

					projectTemplate.files = response.data.rows;
					projectTemplate.templateFile = _.find(projectTemplate.files, function (file)
					{
						return _.includes(file.filename, 'selfdriven.template.project')
					});

					app.set(
					{
						scope: 'learner-project-summary',
						context: 'source-template',
						value: projectTemplate
					});

					app.invoke('util-project-information-init');
				}
			}
		}
	}	
});

app.add(
{
	name: 'learner-project-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataScope: 'learner-projects',
			dataContext: 'all',
			scope: 'learner-project-edit',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				reference: '',
				type: '',
				typetext: '',
				description: '',
				category: '',
				categorytext: '',
				parentproject: '',
				parentprojecttext: ''
			}
		}

		app.view.refresh(
		{
			scope: 'learner-project-edit',
			selector: '#learner-project-edit',
			data: data
		});

		app.invoke('util-view-select',
		{
			container: 'learner-project-edit-type-' + data.id,
			object: 'setup_project_type',
			fields: [{name: 'title'}]
		});

		app.invoke('util-view-select',
		{
			container: 'learner-project-edit-category-' + data.id,
			object: 'setup_project_category',
			fields: [{name: 'title'}]
		});

		app.invoke('util-view-select',
		{
			container: 'learner-project-edit-parentproject-' + data.id,
			object: 'project',
			fields: [{name: 'description'}],
			filters:
			[
				{
					field: 'type',
					value: app.whoami().mySetup.projectTypes.design
				},
				{
					field: 'projectmanager',
					value: app.whoami().thisInstanceOfMe.user.id
				},
				{
					field: 'restrictedtoteam',
					value: 'Y'
				}
			]
		});
	}	
});

app.add(
{
	name: 'learner-project-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			controller: 'learner-project-edit',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'learner-project-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values:
				{
					datareturn: 'reference,typetext',
					restrictedtoteam: 'Y',
					type: app.whoami().mySetup.projectTypes.design,
					projectmanager: app.whoami().thisInstanceOfMe.user.id,
					contactperson: app.whoami().thisInstanceOfMe.user.contactperson
				}
			}
		});

		if (_.isUndefined(response))
		{
			mydigitalstructure.cloud.save(
			{
				object: 'project',
				data: data,
				callback: 'learner-project-edit-save'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				if (_.has(response, 'data'))
				{
					app.invoke('learner-project-edit-save-reference', param, response)
				}
				else
				{
					app.invoke('learner-project-edit-save-finalise')
				}
			}
		}
	}
});

app.add(
{
	name: 'learner-project-edit-save-reference',
	code: function (param, response)
	{	
		if (response != undefined)
		{
			var data =
			{
				id: response.id
			}

			var dataReturn = _.first(response.data.rows);
			
			data.reference = _.replace(dataReturn.reference, 'PRJ00', _.first(dataReturn.typetext));

			mydigitalstructure.cloud.save(
			{
				object: 'project',
				data: data,
				callback: 'learner-project-edit-save-finalise',
				set: {scope: 'learner-project-edit'}
			});
		}
	}
});

app.add(
{
	name: 'learner-project-edit-save-finalise',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learner-project-edit',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'learner-project-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values: {datareturn: 'reference,typetext,guid'}
			}
		});

		app.notify({message: 'Project has been ' + (id==''?'added':'updated') + '.'});

		app.invoke('util-view-refresh',
		{
			dataScope: 'learner-projects',
			data: data
		});

		app.invoke('app-navigate-to', {controller: 'learner-project-summary', context: data.guid});
	}
});

app.add(
{
	name: 'learner-project-story-board',
	code: function (param)
	{
		app.invoke('util-project-story-board', param)
	}
});

/* PROJECT TEMPLATES; CLONING ETC*/

app.add(
{
	name: 'learner-projects-templates',
	code: function (param, response)
	{
		app.invoke('learner-projects-templates-dashboard-community')
	}
});

app.add(
{
	name: 'learner-projects-templates-dashboard-x',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learner-projects-templates-dashboard',
			valueDefault: {}
		});

		var filters =
		[
			{
				field: 'template',
				value: 'Y'
			}
		];

		if (!_.isEmpty(data.search))
		{
			filters = _.concat(
			[
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

		app.invoke('util-view-table',
		{
			object: 'project',
			container: 'learner-projects-templates-dashboard-view',
			context: 'learner-projects-templates',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">There are no project templates that match this search.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed'
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
					class: 'd-flex',
					method: function (row)
					{
						row.classNotes = (row.notes==''?'d-none':'')
					}
				},

				columns:
				[
					{
						caption: 'Description',
						field: 'description',
						defaultSort: true,
						sortBy: true,
						class: 'col-12 col-sm-5 myds-navigate',
						data: 'data-context="{{id}}" data-id="{{id}}" data-controller="learner-projects-template-summary"'
					},
					{
						caption: 'Type',
						field: 'typetext', 	
						sortBy: true,
						class: 'col-0 col-sm-3 d-none d-sm-block myds-navigate',
						data: 'data-context="{{id}}" data-id="{{id}}" data-controller="learner-projects-template-summary"'
					},
					{
						caption: 'Template ID',
						field: 'reference', 	
						sortBy: true,
						class: 'col-0 col-sm-2 d-none d-sm-block myds-navigate text-muted',
						data: 'data-context="{{id}}" data-id="{{id}}" data-controller="learner-projects-template-summary"'
					},
					{
						html: '<button class="d-none btn btn-default btn-outline btn-sm myds-click"' +
									' data-controller="learner-projects-template-clone"' +
									' data-context="{{guid}}"' +
	               			' id="learner-projects-templates-clone-{{id}}" data-id="{{id}}"><i class="far fa-clone"></i> Clone</button>',
						caption: '&nbsp;',
						class: 'col-0 col-2 text-right'
					},
					{	
						fields:
						['type', 'notes', 'guid', 'categorytext', 'category', 'parentproject', 'parentprojecttext', 'projectmanager',
							'projectmanagertext', 'createdusertext']
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'learner-projects-templates-dashboard-format',
	code: function (row)
	{
		row.classNotes = (row.notes==''?'d-none':'');

		row.projectIcon = '<i class="fa fa-user text-secondary"></i>'
		if (row['createduser'] != app.whoami().thisInstanceOfMe.user.id)
		{
			row.projectIcon = '<i class="fa fa-users text-secondary"></i>'
		}

		row.projectInfo = '<span>' + row.description + '</span>';
		row.createddate = app.invoke('util-date', {date: row.createddate, format: 'DD MMM YYYY'});
		//row.statusstyle = (row.statustext=='Not Started'?'secondary':(row.statustext=='In Progress'?'warning':'success'));
		row.notes = _.unescapeHTML(row.notes);
	}
});

app.add(
{
	name: 'learner-projects-templates-dashboard-community',
	code: function (param, response)
	{
		if (response == undefined)
		{
			var data = app.get(
			{
				scope: 'learner-projects-templates-dashboard-community',
				valueDefault: {}
			});

			let filters =
			[
				{
					field: 'template',
					value: 'Y'
				},
				{
					name: '('
				},
				{
					field: 'status',
					comparison: 'IS_NULL'
				},
				{
					name: 'or'
				},
				{
					field: 'status',
					value: app.whoami().mySetup.projectStatuses.completed
				},
				{
					name: ')'
				}
			];
			
			entityos.cloud.search(
			{
				object: 'project',
				fields: ['reference', 'type', 'notes', 'guid', 'typetext', 'category', 'description',
								'parentproject', 'parentprojecttext', 'projectmanager', 'restrictedtoteam',
								'project.parentproject.description', 'createduser', 'createdusertext', 'statustext'],
				filters: filters,
				sorts:
				[
					{
						field: 'modifieddate',
						direction: 'desc'
					}
				],
				callback: 'learner-projects-templates-dashboard-community',
				callbackParam: param
			});
		}
		else
		{
			var viewContainer = 'learner-projects-templates-dashboard-community-view';
			var navigationController = 'learner-projects-template-summary';

			var projectsTemplatesView = app.vq.init({queue: 'learner-projects-templates-dashboard-community'});

			app.set(
			{
				controller: 'learner-projects-templates',
				context: 'all',
				value: response.data.rows
			})

			if (response.data.rows.length == 0)
			{
				projectsTemplatesView.add(
				[
					'<div class="text-muted text-center">',
						'There are no project templates that match this search.',
					'</div>'
				]);
			}
			else 
			{
				projectsTemplatesView.template(
				[
					'<div class="col-12 col-md-6 mb-3">',
						'<div class="card">',
							'<div class="card-body">',
								'<div class="row">',
									'<div class="col-10 myds-navigate" data-context="{{id}}" data-id="{{id}}" data-controller="', navigationController, '">',
										'<h2>{{projectInfo}}</h2>',
										'<div class="text-secondary small mt-2">{{notes}}</div>',
										'<div class="d-none text-muted small mt-2">{{guid}}</div>',
										'<div class="mt-2">',
											'<button class="btn btn-default btn-outline btn-sm myds-navigate"',
												' data-context="{{id}}" data-id="{{id}}" data-controller="', navigationController, '">',
													'Select',
											'</button>',
										'</div>',
									'</div>',
									'<div class="col-2 text-right">',
									'</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);

				projectsTemplatesView.add(
				[
					'<div class="px-0 mt-3">',
						'<div class="row">'
				]);

				_.each(response.data.rows, function (row)
				{
					app.invoke('learner-projects-templates-dashboard-format', row);
					projectsTemplatesView.add({useTemplate: true}, row);
				});

				projectsTemplatesView.add('</div></div>');
			}

			projectsTemplatesView.render('#' + viewContainer);
		}
	}
});

app.add(
{
	name: 'learner-projects-templates-dashboard-challenges',
	code: function (param)
	{
		app.invoke('util-level-up-profile-challenges-project-check',
		{
			viewSelector: '#learner-projects-templates-dashboard-challenges-view',
			viewType: 'vertical'
		});
	}
});

entityos._util.controller.add(
{
    name: 'learner-projects-templates-dashboard-skillzeb',
    code: function ()
    {
        var templatesSet = app.get({scope: 'skillzeb-templates', context: 'templates-set'});

        if (templatesSet != undefined)
        {
            app.invoke('learner-projects-templates-dashboard-skillzeb-search');
        }
        else
        {
            app.show('#learner-projects-templates-dashboard-skillzeb-view', '<h3 class="text-muted text-center mt-6">Initialising ...</h3>');

            $.ajax(
            {
                type: 'GET',
                url: '/site/6b2beaea-f5ef-45f7-bec0-4c679d314d71/data/skillzeb.templates.index-latest.json',
                dataType: 'json',
                success: function(data)
                {
                    app.set({scope: 'skillzeb-templates', context: 'templates-set', value: data.skillzeb.templates.set});
                    app.invoke('learner-projects-templates-dashboard-skillzeb-search');
                },
                error: function (data) {}			
            });
        }
    }
});

entityos._util.controller.add(
{
    name: 'learner-projects-templates-dashboard-skillzeb-search',
    code: function ()
    {
        var search = app.get({scope: 'skillzeb-templates', valueDefault: {}});

        var templatesSet = app.get({scope: 'skillzeb-templates', context: 'templates-set'});

		search._type = 'project,learning'

        if (!_.isEmpty(search._type))
        {
            templatesSet = _.filter(templatesSet, function (template)
            {
                return _.includes(search._type, template.type)
            });
        } 

        if (search['search-text'] != '' && search['search-text'] != undefined)
        {
            var searchText = search['search-text'].toLowerCase();

            templatesSet = _.filter(templatesSet, function (template)
            {
                return  (_.includes(template.sdt.toLowerCase(), searchText)
                            || _.includes(template.title.toLowerCase(), searchText)
                            || _.includes(template.name.toLowerCase(), searchText)
                            || _.includes(template.summary.toLowerCase(), searchText)
                            || _.includes(template.url.toLowerCase(), searchText)
                        )
            });
        } 

        var templatesView = app.vq.init({queue: 'templates-view'});

        app.set({scope: 'skillzeb-templates', context: 'templates-set-searched', value: templatesSet});

        if (templatesSet.length == 0)
        {
            templatesView.add('<h3 class="text-muted text-center mt-6">There are no templates that match this search.</h3>');
        }
        else
        {
            templatesView.add(
			[
				'<div class="px-0 mt-3">',
						'<div class="row">'
			]);

            templatesSet = _.sortBy(templatesSet, 'title');

            var limitReached = false;

			templatesView.template(
			[
				'<div class="col-12 col-md-6 mb-3">',
					'<div class="card">',
						'<div class="card-body">',
							'<div class="row">',
								'<div class="col-12" data-context="{{name}}">',
									'<h2 class="mb-2">{{title}}</h2>',
									'{{sourceHTML}}',
									'<div class="mt-3">',
										'<a class="btn btn-default btn-outline btn-sm entityos-collapse me-2" data-toggle="collapse" href="#learner-projects-templates-dashboard-skillzeb-info-view-{{name}}">',
											'View',
										'</a>',
										'<button class="d-none btn btn-default btn-outline btn-sm myds-navigate"',
											' data-context="{{name}}" data-id="{{name}}" data-controller="">',
												'Select',
										'</button>',
									'</div>',
								'</div>',
								'<div class="col-0 text-right">',
								'</div>',
							'</div>',
							'<div class="row">',
							 '<div class="col-12 mb-2 mt-4 px-0 collapse entityos-collapse" id="learner-projects-templates-dashboard-skillzeb-info-view-{{name}}" data-controller="learner-projects-templates-dashboard-skillzeb-info-show" data-context="{{name}}" data-url="{{url}}"></div>',
							 '</div>',
						'</div>',
					'</div>',
				'</div>'
			]);

            _.each(templatesSet, function (template, t)
            {
                if (t > 149)
                {
                    if (!limitReached)
                    {
                        limitReached = true;
                        skillsView.add(
                        [
                            '<div class="text-center">',
                                '<h3 class="text-muted mt-6 mb-4">First 150 of ', templatesSet.length, ' templates shown.</h3>',
                            '</div>'
                        ]);
                    }
                }
                else
                {
					template._url = template.url;
					if (!_.includes(template._url, 'http'))
					{
						if (!_.startsWith(template._url, '/'))
						{
							template._url = '/' + template._url;
						}

						template._url = '/site/6b2beaea-f5ef-45f7-bec0-4c679d314d71/data' + template._url;
					}

					template.sourceHTML = '';

					if (_.has(template, 'source'))
					{
						var templatesSourceHTML = app.vq.init({queue: 'templates-source-html'});

						templatesSourceHTML.add(
						[
							'<div class="text-secondary">', 
								'<div class="mb-1 fw-bold">', 
									template.source.name,
								'</div>'
						]);

						if (_.has(template, 'source.name'))
						{
							templatesSourceHTML.add(
							[
								'<div class="mb-1">', 
									template.source.notes,
								'</div>'
							])
						}

						if (_.has(template, 'source.url'))
						{
							templatesSourceHTML.add(
							[
								'<div class="mb-1">', 
									'<a href="', template.source.url, '" target="blank">', 
										_.replace( template.source.url, 'https://', ''),
									'</a>',
								'</div>'
							])
						}

						templatesSourceHTML.add(
						[
							'</div>'
						]);

						template.sourceHTML = templatesSourceHTML.get();
					}
					
					templatesView.add({useTemplate: true}, template);

                    /*templatesView.add(
                    [
                        '<div class="row pt-5 pb-3 border-bottom border-gray-300">',
                            '<div class="col-12"><h2 class="mb-2 fw-bold" style="font-size: 1.8rem; color:#8bc34a;">', template.title, '</h2><div class="text-dark">', template.summary, '</div><div class="mt-3 mb-2">', htmlViewInfo, '</div></div>',
                            '<div class="col-12 mb-2 border border-mute mt-2 shadow rounded collapse entityos-collapse" id="explorer-template-info-view-', template.name, '" data-controller="explorer-template-info-show" data-context="' + template.name + '" data-url="' + template.url + '"></div>'
                    ]);

                    templatesView.add('</div>')
					*/
                }
            });

            templatesView.add(['</div></div>']);
        }

        templatesView.render('#learner-projects-templates-dashboard-skillzeb-view');
    }
});


entityos._util.controller.add(
{
	name: 'learner-projects-templates-dashboard-skillzeb-info-show',
	code: function (param, response)
	{
        if (param.status == 'shown')
        {
            var template = entityos._util.data.set(
            {
                scope: 'explorer-template-info',
                context: 'template',
                value: param.dataContext
            });

			template._url = template.url;
			if (!_.includes(template._url, 'http'))
			{
				if (!_.startsWith(template._url, '/'))
				{
					template._url = '/' + template._url;
				}

				template._url = '/site/6b2beaea-f5ef-45f7-bec0-4c679d314d71/data' + template._url;
			}

			template._url = _.replace(template._url, 'https://raw.githubusercontent.com/selfdriven-foundation/skillzeb/main/templates/json', '/site/6b2beaea-f5ef-45f7-bec0-4c679d314d71/data')
					
            $.ajax(
            {
                type: 'GET',
                url: template._url,
                dataType: 'json',
				cors: false,
                success: function(data)
                {
					const sourceTemplate = 
					{
						_file: data,
						name: template.context,
						templateFile: template._url 
					}

					app.set(
					{
						scope: app.whoami().thisInstanceOfMe._userRole + '-project-summary',
						context: 'source-template',
						value: sourceTemplate
					});

					app.invoke('util-project-information-show', 
					{
						containerSelector: '#learner-projects-templates-dashboard-skillzeb-info-view-' + template.context,
						containerTemplate: '<div class="card shadow-lg"><div class="card-body pt-2">{{information}}</div></div>'
					});
                }
            });
		}
	}
});

app.add(
{
	name: 'learner-projects-template-summary',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learner-projects-template-summary',
			context: 'id',
			valueDefault: ''
		});

		var data = app.find(
		{
			dataController: 'learner-projects-templates',
			dataContext: 'all',
			controller: 'learner-projects-template-summary',
			context: 'id'
		});

		data.notes = _.unescapeHTML(data.notes);

		app.view.refresh(
		{
			scope: 'learner-projects-template-summary',
			selector: '#learner-projects-template-summary',
			data: data
		});

		app.invoke('learner-projects-template-summary-information-show')

		/*app.invoke('util-attachments-initialise',
		{
		  context: 'learner-projects-template-summary',
		  object: app.whoami().mySetup.objects.project,
		  objectContext: data.id,
		  showTypes: false
		});*/
	}	
});

app.add(
{
	name: 'learner-projects-template-summary-information-show',
	code: function (param, response)
	{
		var projectTemplate = app.get(
		{
			scope: 'learner-projects-template-summary',
			context: 'dataContext'
		});

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
						value: projectTemplate.id
					},
					{
						field: 'filename',
						comparison: 'TEXT_IS_LIKE',
						value: '.template.'
					}
				],
				sorts:
				[
					{
						field: 'createddate',
						direction: 'desc'
					}
				],
				customOptions: [{name: 'object', value: app.whoami().mySetup.objects.project}],
				rows: 1,
				callback: 'learner-projects-template-summary-information-show'
			});
		}
		else
		{
			var userRole = app.whoami().thisInstanceOfMe._userRole;
	
			projectTemplate.templateFile = _.first(response.data.rows)

			app.set(
			{
				scope: userRole + '-project-summary',
				context: 'source-template',
				value: projectTemplate
			});

			app.invoke('util-project-information-init', 
			{
				containerSelector: '#learner-projects-template-summary-information-container',
				containerTemplate: '<div class="card shadow-lg"><div class="card-body pt-2">{{information}}</div></div>'
			});
		}
	}
});

//PROJECT TEMPLATE CLONE
// Create a project with the sourceprojecttemplate set 
// And the use project_task_template_copy to get tasks etc

app.add(
{
	name: 'learner-projects-template-clone',
	code: function (param, response)
	{	
		var projectTemplate = app.get(
		{
			scope: 'learner-projects-template-clone'
		});

		if (projectTemplate == undefined)
		{
			app.notify({type: 'error', message: 'No template information.'});
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'project',
					fields:
					[
						'reference', 'description', 'typetext',
						'type', 'notes', 'guid',
						'category', 'categorytext', 'parentproject', 'parentprojecttext',
						'projectmanager', 'projectmanagertext', 'createdusertext',
						'handovernotes', 'project.createduser.contactperson'
					],
					filters:
					[
						{
							field: 'guid',
							value: projectTemplate.context
						}
					],
					callback: 'learner-projects-template-clone',
					callbackParam: param
				});
			}
			else
			{
				app.set( 
				{
					scope: 'learner-projects-template-clone',
					context: 'projectTemplate',
					value: _.first(response.data.rows)
				});

				app.invoke('learner-projects-template-clone-save')
			}
		}
	}
});

app.add(
{
	name: 'learner-projects-template-clone-save',
	code: function (param, response)
	{			
		var projectTemplate = app.get( 
		{
			scope: 'learner-projects-template-clone',
			context: 'projectTemplate'
		});

		if (projectTemplate == undefined)
		{
			app.notify('Can not find the template!')
		}
		else
		{
			if (_.isUndefined(response))
			{
				var data =
				{
					category: projectTemplate.category,
					contactbusiness: app.whoami().thisInstanceOfMe.user.contactbusiness,
					contactperson: app.whoami().thisInstanceOfMe.user.contactperson,
					description: projectTemplate.description,
					handovernotes: projectTemplate.handovernotes,
					notes: projectTemplate.notes,
					percentagecomplete: 0,
					projectmanager: app.whoami().thisInstanceOfMe.user.id,
					referencemask: _.first(projectTemplate.typetext) + '????',
					restrictedtoteam: 'Y',
					sourceprojecttemplate: projectTemplate.id,
					startdate: moment().format('DD MMM YYYY'),
					status: 1,
					type: projectTemplate.type,
					datareturn: 'guid'
				}

				mydigitalstructure.cloud.save(
				{
					object: 'project',
					data: data,
					callback: 'learner-projects-template-clone-save'
				});
			}
			else
			{	
				if (response.status == 'OK')
				{
					app.set(
					{
						scope: 'learner-projects-template-clone',
						context: 'project',
						value: {id: response.id}
					});

					app.set(
					{
						scope: 'learner-projects-template-clone',
						context: 'projectGUID',
						value: _.first(response.data.rows).guid
					})

					app.invoke('learner-projects-template-tasks-clone', {id: response.id})
				}
			}
		}
	}
});

app.add(
{
	name: 'learner-projects-template-tasks-clone',
	code: function (param, response)
	{	
		var projectClone = app.get( 
		{
			scope: 'learner-projects-template-clone'
		});

		if (projectClone == undefined)
		{
			app.notify({type: 'error', message: 'No template information.'});
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'project_task',
					fields:
					[
						'reference', 'description', 'type',
						'status', 'notes', 'priority', 'displayorder'
					],
					filters:
					[
						{
							field: 'project',
							value: projectClone.projectTemplate.id
						}
					],
					callback: 'learner-projects-template-tasks-clone'
				});
			}
			else
			{
				app.set( 
				{
					scope: 'learner-projects-template-clone',
					context: 'projectTemplateTasks',
					value: response.data.rows
				});

				app.set( 
				{
					scope: 'learner-projects-template-clone',
					context: 'project-template-tasks-index',
					value: 0
				});

				app.invoke('learner-projects-template-tasks-clone-save')
			}
		}
	}
});

app.add(
{
	name: 'learner-projects-template-tasks-clone-save',
	code: function (param, response)
	{	
		var projectClone = app.get( 
		{
			scope: 'learner-projects-template-clone'
		});

		var projectCloneTaskIndex = app.get( 
		{
			scope: 'learner-projects-template-clone',
			context: 'project-template-tasks-index',
			valueDefault: 0
		});

		if (projectCloneTaskIndex < projectClone.projectTemplateTasks.length)
		{
			var projectTemplateTask = projectClone.projectTemplateTasks[projectCloneTaskIndex];
		
			var data =
			{
				project: projectClone.project.id,
				reference: projectTemplateTask.reference,
				description: projectTemplateTask.description,
				type: projectTemplateTask.type,
				status: projectTemplateTask.status,
				notes: projectTemplateTask.notes,
				priority: projectTemplateTask.priority,
				displayorder: projectTemplateTask.displayorder,
				taskbyuser: app.whoami().thisInstanceOfMe.user.id,
				startdate: moment().format('D MMM YYYY')
			}

			mydigitalstructure.cloud.save(
			{
				object: 'project_task',
				data: data,
				callback: 'learner-projects-template-tasks-clone-next',
				callbackParam: param
			});
		}
		else
		{
			app.invoke('learner-projects-template-team-clone-init');
		}
	}
});

app.add(
{
	name: 'learner-projects-template-tasks-clone-next',
	code: function (param, response)
	{	
		app.set( 
		{
			scope: 'learner-projects-template-clone',
			context: 'project-template-tasks-index',
			value: function (value) {return numeral(value).value() + 1}
		});

		app.invoke('learner-projects-template-tasks-clone-save')
	}
});

app.add(
{
	name: 'learner-projects-template-team-clone-init',
	code: function (param, response)
	{	
		if (response == undefined)
		{
			var filters = [
			{
				field: 'contactperson',
				value: app.whoami().thisInstanceOfMe.user.contactperson
			}];

			entityos.cloud.search(
			{
				object: 'contact_relationship',
				fields:
				[
					'othercontactbusiness',
					'othercontactperson'
				],
				filters: filters,
				sorts: [],
				callback: 'learner-projects-template-team-clone-init',
				callbackParam: param
			});
		}
		else
		{
			var contactRelationships = response.data.rows;

			contactRelationships.push(
			{
				othercontactbusiness: app.whoami().thisInstanceOfMe.user.contactbusiness,
				othercontactperson: app.whoami().thisInstanceOfMe.user.contactperson,
				role: app.whoami().mySetup.projectRoles.owner
			});

			app.set(
			{	
				scope: 'learner-projects-template-team-clone',
				context: 'contact-relationships',
				value: contactRelationships
			});

			app.set(
			{	
				scope: 'learner-projects-template-team-clone',
				context: 'index',
				value: 0
			});

			app.invoke('learner-projects-template-team-clone-process', param);
		}
	}
});


app.add(
{
	name: 'learner-projects-template-team-clone-process',
	code: function (param)
	{	
		var contactRelationships = app.get(
		{	
			scope: 'learner-projects-template-team-clone',
			context: 'contact-relationships'
		});

		var index = app.get(
		{	
			scope: 'learner-projects-template-team-clone',
			context: 'index'
		});

		if (index < contactRelationships.length)
		{
			var contactRelationship = contactRelationships[index];

			var projectClone = app.get( 
			{
				scope: 'learner-projects-template-clone'
			});

			var projectRole = app.whoami().mySetup.projectRoles.mentor;
			if (_.isSet(contactRelationship.role))
			{
				projectRole = contactRelationship.role;
			}
		
			var data =
			{
				project: projectClone.project.id,
				startdate: moment().format('DD MMM YYYY'),
				contactbusiness: contactRelationship.othercontactbusiness,
				contactperson: contactRelationship.othercontactperson,
				projectrole: projectRole
			}

			entityos.cloud.save(
			{
				object: 'project_team',
				data: data,
				callback: 'learner-projects-template-team-clone-next',
				callbackParam: param
			});
		}
		else
		{
			app.invoke('learner-projects-template-tasks-clone-finalise', param);
		}
	}
});

app.add(
{
	name: 'learner-projects-template-team-clone-next',
	code: function (param, response)
	{	
		var index = app.get(
		{	
			scope: 'learner-projects-template-team-clone',
			context: 'index'
		});

		app.set(
		{	
			scope: 'learner-projects-template-team-clone',
			context: 'index',
			value: index + 1
		});

		app.invoke('learner-projects-template-team-clone-process', param);
	}
});


app.add(
{
	name: 'x-learner-projects-template-team-clone-init',
	code: function (param, response)
	{	
		var projectClone = app.get( 
		{
			scope: 'learner-projects-template-clone'
		});

		if (response == undefined)
		{
			var data =
			{
				project: projectClone.project.id,
				startdate: moment().format('DD MMM YYYY'),
				contactperson: projectClone.projectTemplate['project.createduser.contactperson'],
				projectrole: app.whoami().mySetup.projectRoles.facilitator
			}

			mydigitalstructure.cloud.save(
			{
				object: 'project_team',
				data: data,
				callback: 'learner-projects-template-team-clone-init',
				callbackParam: param
			});
		}
		else
		{
			app.invoke('learner-projects-template-tasks-clone-finalise');
		}
	}
});

app.add(
{
	name: 'learner-projects-template-tasks-clone-finalise',
	code: function (param, response)
	{	
		var projectClone = app.get( 
		{
			scope: 'learner-projects-template-clone'
		});

		app.invoke('util-view-spinner-remove-all');
		app.notify({message: 'Project has been copied & ready to start!'});

		const projectTemplateType = _.get(projectClone, 'projectTemplate.type');
		
        if (projectTemplateType == app.whoami().mySetup.projectTypes.verification)
        {
            app.invoke('app-navigate-to', {controller: 'learner-project-do', context: projectClone.projectGUID});
        }
        else
        {
		    app.invoke('app-navigate-to', {controller: 'learner-project-summary', context: projectClone.projectGUID});
        }
	}
});

//


// ------ USING MYDS METHOD
/*app.add(
{
	name: 'learner-projects-template-tasks-clone',
	code: function (param, response)
	{	
		console.log(param);

		var project = app.get(
		{
			scope: 'learner-projects-template-clone',
			context: 'project'
		});

		if (project == undefined)
		{
			app.notify({type: 'error', message: 'No project information.'})
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.invoke(
				{
					method: 'project_task_template_copy',
					data:
					{
						project: project.id,
						includeattachments: 1
					},
					callback: 'learner-projects-template-tasks-clone',
					callbackParam: param
				});
			}
			else
			{
				app.invoke('util-view-spinner-remove-all');
				console.log(response);
				app.notify({message: 'Project has been cloned.'});
				app.invoke('app-navigate-to', {controller: 'learner-project-summary', context: project.id});
			}
		}
	}
});
*/

app.add(
{
	name: 'learner-project-do',
	code: function (param)
	{
		app.invoke('util-project-do', param)
	}
});