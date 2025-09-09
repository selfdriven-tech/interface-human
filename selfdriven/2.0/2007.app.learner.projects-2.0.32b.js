/*
	{
    	title: "Learner; Projects", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
  	}
*/

app.add(
{
	name: 'learner-projects',
	code: function (param, response)
	{
		app.invoke('learner-projects-dashboard')
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

		var utilSetup = app.get(
		{
			scope: 'util-setup',
			valueDefault: {}
		});

		/*{
			field: 'type',
			value: app.whoami().mySetup.projectTypes.design
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

		/*
		,
			{
				field: 'type',
				comparison: 'NOT_EQUAL_TO',
				value: app.whoami().mySetup.projectTypes.management
			}
		*/

		if (!_.isEmpty(data.search))
		{
			filters = _.concat(filters,
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
				filters = _.concat(filters,
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
			container: 'learner-projects-dashboard-view',
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
						defaultSort: true,
						sortBy: true,
						class: 'col-12 col-sm-6 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="learner-project-summary"'
					},
					{
						caption: 'Type',
						field: 'typetext', 	
						sortBy: true,
						class: 'col-0 col-sm-2 d-none d-sm-block myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="learner-project-summary"'
					},
					{
						caption: 'Category',
						field: 'categorytext', 	
						sortBy: true,
						class: 'col-0 col-sm-2 d-none d-sm-block myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="learner-project-summary"'
					},
					{
						caption: 'Project ID',
						field: 'reference', 	
						sortBy: true,
						class: 'col-0 col-sm-2 d-none d-sm-block myds-navigate text-muted',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="learner-project-summary"'
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
});

app.add(
{
	name: 'learner-projects-dashboard-format',
	code: function (row)
	{
		row.classNotes = (row.notes==''?'d-none':'');

		row.projectIcon = '<i class="fa fa-user fa-fw"></i>'
		if (row['createduser'] != app.whoami().thisInstanceOfMe.user.id)
		{
			row.projectIcon = '<i class="fa fa-users fa-fw"></i>'
		}

		row.projectInfo = '<span class="mr-1">' + row.description + '</span>' +
									'<span class="text-muted small" style="font-size: 0.7rem;">' + row.projectIcon + '</span>';
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
						'description', 'type', 'typetext',
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

						//app.invoke('learner-project-summary-source-template-show');
						app.invoke('util-project-information-init');
						
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
						'description', 'type', 'typetext',
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
		app.invoke('learner-projects-templates-dashboard')
	}
});

app.add(
{
	name: 'learner-projects-templates-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learner-projects-templates-dashboard',
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

		app.view.refresh(
		{
			scope: 'learner-projects-template-summary',
			selector: '#learner-projects-template-summary',
			data: data
		});

		app.invoke('util-attachments-initialise',
		{
		  context: 'learner-projects-template-summary',
		  object: app.whoami().mySetup.objects.project,
		  objectContext: data.id,
		  showTypes: false
		});
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
					description: 'Clone of ' + projectTemplate.description,
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
		console.log(response);
		app.notify({message: 'Project has been cloned.'});
		app.invoke('app-navigate-to', {controller: 'learner-project-summary', context: projectClone.projectGUID});
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
