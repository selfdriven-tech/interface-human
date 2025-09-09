app.add(
{
	name: 'util-project-tasks-show',
	code: function (param, response)
	{	
		var projectID = app._util.param.get(param.dataContext, 'project').value;
		var scope = app._util.param.get(param.dataContext, 'scope').value;
		var context = app._util.param.get(param.dataContext, 'context').value;
		var selector = app._util.param.get(param.dataContext, 'selector').value;

		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		if (scope == undefined)
		{
			scope = context
		}

		if (scope == undefined)
		{
			scope = 'util-project-tasks-show'
		}

		if (projectID == undefined)
		{
			projectID = app.get(
			{
				scope: scope,
				context: 'id',
				valueDefault: ''
			});
		}

		if (selector == undefined)
		{
			selector = scope + '-tasks-view'
		}

		var tasksContext = _.replace(context, '-summary', '-tasks');
		context = _.replace(context, '-challenge-summary', '-project-summary');
		var taskContext = _.replace(context, '-project-summary', '-task-summary');

		if (param.status == 'shown')
		{
			if (projectID != undefined && selector != undefined)
			{
				var filters =
				[
					{	
						field: 'project',
						comparison: 'EQUAL_TO',
						value: projectID
					}
				]
	
				app.invoke('util-view-table',
				{
					object: 'project_task',
					container: selector,
					context: tasksContext,
					filters: filters,
					sorts:
					[
						{
							name: 'displayorder',
							direction: 'asc'
						}
					],
					options:
					{
						noDataText: '<div class="p-4">There are no project tasks.</div>',
						rows: 20,
						orientation: 'vertical',
						progressive: true,
						class: 'table-condensed fadeInDown',
						deleteConfirm:
						{
							text: 'Are you sure you want to delete this task?',
							position: 'left',
							headerText: 'Delete Project task',
							buttonText: 'Delete',
							controller: 'util-project-task-delete-ok'
						},
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
							class: 'd-flex',
							method: function (row)
							{
								var date = moment(row.startdate, 'D MMM YYYY LT');
								if (date.isValid())
								{
									row.startdate = moment(row.startdate, 'D MMM YYYY LT').format('D MMM YYYY');
								}

								var date = moment(row.enddate, 'D MMM YYYY LT');
								if (date.isValid())
								{
									row.enddate = moment(row.enddate, 'D MMM YYYY LT').format('D MMM YYYY');
								}

								row.info = '<div class="row">';

								if (row.taskbyusertext != '')
								{
									//'<div>' + row.taskbyusertext + '</div>' +
									row.info = row.info +
										'<div class="col-12 col-sm-6">' +
										'<div>' + row['projecttask.taskbyuser.contactperson.firstname'] + 
											' ' + row['projecttask.taskbyuser.contactperson.surname'] + 
										'</div>' +
										'<div class="text-muted small mb-1">To Do Task By</div>' +
										'</div>'
								}

								if (row.typetext != '' && row.typetext != '[None]')
								{
									row.info = row.info +
										'<div class="col-12 col-sm-6">' +
										'<div>' + row.typetext + '</div>' +
										'<div class="text-muted small mb-1">Type</div>' +
										'</div>'
								}

								if (row.prioritytext != '' && row.prioritytext != '[unassigned]')
								{
									row.info = row.info +
										'<div class="col-12 col-sm-6">' +
										'<div>' + row.prioritytext + '</div>' +
										'<div class="text-muted small mb-1">Priority</div>' +
										'</div>'
								}

								if (row.statustext != '')
								{
									row.info = row.info +
										'<div class="col-12 col-sm-6">' +
										'<div>' + row.statustext + '</div>' +
										'<div class="text-muted small mb-1">Status</div>' +
										'</div>'
								}

								if (row.startdate != '')
								{
									row.info = row.info +
										'<div class="col-12 col-sm-6">' +
										'<div>' + row.startdate + '</div>' +
										'<div class="text-muted small mb-1">Start Date</div>' +
										'</div>'
								}

								if (row.enddate != '')
								{
									row.info = row.info +
										'<div class="col-12 col-sm-6">' +
										'<div>' + row.enddate + '</div>' +
										'<div class="text-muted small mb-1">End Date</div>' +
										'</div>'
								}

								row.info = row.info + '</div>';

								row._userRole = utilSetup.userRole;
							}
						},

						columns:
						[
							{
								caption: 'Subject',
								field: 'title',
								sortBy: true,
								defaultSort: true,
								class: 'col-6 col-sm-3 text-break text-wrap myds-navigate',
								data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="' + taskContext + '"'
							},
							{
								caption: 'Description',
								field: 'description',
								sortBy: true,
								defaultSort: true,
								class: 'col-0 col-sm-4 d-none d-sm-block text-break text-wrap myds-navigate',
								data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="' + taskContext + '"'
							},
							{
								caption: 'Info',
								name: 'info',
								sortBy: true,
								class: 'col-6 col-sm-5 text-break text-wrap'
							},
							{
								fields:
								[
									'project', 'projecttask.project.description',
									'notes', 'typetext', 'statustext', 'prioritytext',
									'taskbyuser', 'taskbyusertext',
									'startdate', 'enddate', 'percentagecomplete',
									'guid', 'taskbyusertext', 'projecttask.taskbyuser.contactperson.firstname',
									'projecttask.taskbyuser.contactperson.surname'
								]
							}
						]	
					}
				});
			}			
		}
		else if (param.status == 'hidden')
		{
			app.show('#' + selector, '');
		}
	}
});

app.add(
{
	name: 'util-project-task-edit',
	code: function (param)
	{	
		var context = app._util.param.get(param.dataContext, 'context').value;
		var project = app.get({scope: context, context: 'dataContext'});

        var filters =
        [
			{
				field: 'project',
				value: project.id
			},
			{
				field: 'projectteam.contactperson.contactbusiness',
				value: app.whoami().thisInstanceOfMe.user.contactbusiness
			}
        ];

        app.invoke('util-view-select',
		{
			container: context + '-task-edit-taskbyuser',
			object: 'project_team',
			fields:
            [
                {name: 'projectteam.contactperson.firstname'},
                {name: 'projectteam.contactperson.surname'},
                {name: 'projectteam.contactperson.user.id', hidden: true}
            ],
			searchMinimumCharacters: 0,
			idField: 'projectteam.contactperson.user.id',
			filters: filters
		});

		app.invoke('util-view-select',
		{
			container: context + '-task-edit-type',
			object: 'setup_project_task_type',
			fields: [{name: 'title'}]
		});

		app.invoke('util-view-select',
		{
			container: context + '-task-edit-priority',
			object: 'setup_project_task_priority',
			fields: [{name: 'title'}]
		});
	}
});

app.add(
{
	name: 'util-project-task-edit-save',
	code: function (param, response)
	{	
		var context = app._util.param.get(param.dataContext, 'context').value;

		var projectID = app.get(
		{
			controller: context,
			context: 'dataContext',
			name: 'id',
			valueDefault: ''
		});

		var id = app.get(
		{
			controller: context + '-show',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			controller: 'util-project-task-edit-' + id,
			cleanForCloudStorage: true,
			valueDefault: {}
		});

		var okToSave = true;

		if (id == '')
		{
			if (_.isNotSet(data.title))
			{
				app.notify({type: 'error', message: 'You need to set the subject of the task'})
			}
			else
			{
				data.project = projectID;

				if (_.isNotSet(data.type))
				{
					data.type = app.whoami().mySetup.projectTaskTypes.none
				}

				if (_.isNotSet(data.priority))
				{
					data.priority = app.whoami().mySetup.projectTaskPriorities.unassigned
				}

				if (_.isNotSet(data.taskbyuser))
				{
					data.taskbyuser = app.whoami().thisInstanceOfMe.user.id
				}
			}
		}
		else
		{
			data.id = id;
		}

		if (okToSave)
		{
			if (_.isUndefined(response))
			{
				mydigitalstructure.update(
				{
					object: 'project_task',
					data: data,
					callback: 'util-project-task-edit-save',
					callbackParam: param
				});
			}
			else
			{	
				if (response.status == 'OK')
				{
					app.notify('Task added to the project.');
					app.invoke('util-view-collapse', {context: context + '-task-edit'});

					param.status = 'shown';
					if (param.dataContext == undefined)
					{
						param.dataContext = {}
					}
					param.dataContext.project = projectID;
					app.invoke('util-project-tasks-show', param)
				}
			}
		}
	}
});

app.add(
{
	name: 'util-project-task-delete-ok',
	code: function (param, response)
	{
		if (_.isUndefined(response))
		{
			if (!_.isUndefined(param.dataContext))
			{
				mydigitalstructure.cloud.delete(
				{
					object: 'project_task',
					data:
					{
						id: param.dataContext.id,
					},
					callback: 'util-project-task-delete-ok'
				});
			}	
		}
		else
		{
			if (response.status == 'OK')
			{
				app.notify('Task deleted from project.');
				app.invoke('util-project-tasks-show', {});
			}
			else if (response.status == 'ER')
			{
				app.notify('Task can not be removed from the project. (' + response.error.errornotes + ')');
			}
		}
	}
});

app.add(
{
	name: 'util-project-information',
	code: function (param, response)
	{	
		var sourceTemplateID = app._util.param.get(param, 'sourceTemplateID').value;

		if (_.isNotSet(sourceTemplateID))
		{
			sourceTemplateID = app.get(
			{
				scope: 'util-project-information',
				context: 'source-template-id'
			});
		}

		if (_.isNotSet(sourceTemplateID))
		{
			app.notify({type: 'error', message: 'No project template set.'});
		}
		else
		{
			if (response == undefined)
			{
				entityos.cloud.search(
				{
					object: 'project',
					fields: 
					[
						'description', 'type', 'typetext',
						'category', 'categorytext',
						'reference', 'notes', 
						'guid', 'parentproject'
					],
					filters:
					[
						{
							field: 'id',
							value: sourceTemplateID
						}
					],
					callback: 'util-project-information',
					callbackParam: param
				});
			}
			else
			{
				if (response.status == 'OK')
				{
					if (response.data.rows.length == 0)
					{
						app.notify({type: 'error', message: 'Can not find the project template.'});
					}
					else
					{
						var sourceTemplate = _.first(response.data.rows);

						app.set(
						{
							scope: 'util-project-information',
							context: 'source-template',
							value: sourceTemplate
						});

						var userRole = app.whoami().thisInstanceOfMe._userRole;

						app.set(
						{
							scope: userRole + '-project-summary',
							context: 'source-template',
							value: sourceTemplate
						});
					}
				}

				app.invoke('util-project-information-files', param);
			}
		}
	}	
});

app.add(
{
	name: 'util-project-information-files',
	code: function (param, response)
	{	
		var userRole = app.whoami().thisInstanceOfMe._userRole;

		var projectTemplate = app.get(
		{
			scope: userRole + '-project-summary',
			context: 'source-template'
		});

		if (response == undefined)
		{
			let projectTemplateIDs = [projectTemplate.id];

			if (_.isSet(projectTemplate.parentproject))
			{
				projectTemplateIDs.push(projectTemplate.parentproject)
			}

			entityos.cloud.search(
			{
				object: 'core_attachment',
				fields: 
				[
					'download',
					'url',
					'filename',
					'title',
					'objectcontext'
				],
				filters:
				[
					{
						field: 'object',
						value: app.whoami().mySetup.objects.project
					},
					{
						field: 'objectcontext',
						comparison: 'IN_LIST',
						value: projectTemplateIDs
					}
				],
				sorts:
				[
					{
						field: 'type',
						direction: 'asc'
					},
					{
						field: 'modifieddate',
						direction: 'desc'
					}
				],
				customOptions:
				[
					{
						name: 'object',
						value: app.whoami().mySetup.objects.project
					}
				],
				callback: 'util-project-information-files',
				callbackParam: param
			});
		}
		else
		{
			if (response.status == 'OK')
			{
				projectTemplate.files = response.data.rows;

				if (_.isSet(projectTemplate.parentproject))
				{
					_.each(projectTemplate.files, function (file)
					{
						file.parent = (file.objectcontext == projectTemplate.parentproject)
					})
				}

				projectTemplate.templateFile = _.find(projectTemplate.files, function (file)
				{
					return (_.includes(file.filename, 'selfdriven.template.project') && !file.parent)
				});

				projectTemplate.templateParentFile = _.find(projectTemplate.files, function (file)
				{
					return (_.includes(file.filename, 'selfdriven.template.project') && file.parent)
				});

				app.set(
				{
					scope: userRole + '-project-summary',
					context: 'source-template',
					value: projectTemplate
				});

				app.invoke('util-project-information-init', param);
			}
		}
	}	
});

app.add(
{
	name: 'util-project-information-init',
	code: function (param)
	{	
		var userRole = app.whoami().thisInstanceOfMe._userRole;

		var projectSourceTemplate = app.get(
		{
			scope: userRole + '-project-summary',
			context: 'source-template'
		});

		if (_.isNotSet(projectSourceTemplate))
		{
			projectSourceTemplate = app.get(
			{
				scope: 'util-project-information',
				context: 'source-template'
			});
		}

		if (_.isSet(projectSourceTemplate))
		{
			if (true || _.isNotSet(projectSourceTemplate._file))
			{
				app.invoke('util-project-source-template-file-get', param);
			}
			else
			{
				app.invoke('util-project-information-show');
			}
		}
		else
		{
			//app.notify({type: 'error', message: 'No project template data.'});
			app.invoke('util-project-information-show');
		}
	}
});

app.add(
{
	name: 'util-project-information-show',
	code: function (param, response)
	{
		var userRole = app.whoami().thisInstanceOfMe._userRole;
		var containerSelector = app._util.param.get(param, 'containerSelector', {default: '#' + userRole + '-project-summary-information-view'}).value;
		var containerTemplate = app._util.param.get(param, 'containerTemplate').value;

		var projectTemplateFile = app.get(
		{
			scope: userRole + '-project-summary',
			context: 'source-template',
			name: '_file'
		});

		var sourceProjectTemplate = app.get(
		{
			scope: userRole + '-project-summary',
			context: 'source-template'
		});

		app._util.data.clear(
		{
			scope: 'util-project-information-show-milestone-tasks',
			context: 'tasks'
		});

		var project = app.get(
		{
			scope: app.whoami().thisInstanceOfMe._userRole + '-project-summary'
		});

		var informationView = app.vq.init({queue: 'util-project-information-show'});

		if (sourceProjectTemplate == undefined)
		{
			// Show project description
			if (_.has(project, 'dataContext.description'))
			{
				informationView.add(
				[
					'<div class="card mt-2">',
						'<div class="card-body">',
							'<div class="text-secondary">', project.dataContext.description, '</div>',
						'</div>',
					'</div>'
				]);
			}
			else
			{
				informationView.add(
				[
					'<div class="card mt-2">',
						'<div class="card-body">',
							'<div class="text-secondary" data-reason="1">No project template.</div>',
						'</div>',
					'</div>'
				]);
			}
			
			informationView.render(containerSelector);
		}
		else if (sourceProjectTemplate.templateFile == undefined)
		{
			var sourceFound = false;

			if (sourceProjectTemplate.subtype == app.whoami().mySetup.projectSubTypes.learningLevelUp)
			{
				if (_.startsWith(sourceProjectTemplate.description, '{'))
				{
					var _description = JSON.parse(sourceProjectTemplate.description);
					var template = _description.template.project;

					if (_.isArray(template.outcomes))
					{
						var _outcome = _.find(template.outcomes, function(outcome)
						{
							return outcome.uri == project.id
						});

						if (_outcome != undefined)
						{
							sourceFound = true;
							console.log(_outcome)

							/*
							{"reference":1,"by":"learner","skills":{"gained":["*"]},"description":"This is my first challenge 1","verification":{"notes":""},"uri":"2e0c2e71-65fa-4c1e-8066-db75805f3304"}
							*/
							
							informationView.add(
							[
								'<div class="card mt-2">',
									'<div class="card-body">',
										'<div>Based on Level Up Profile <em>', _outcome.description , '</em> challenge.</div>',
									'</div>',
								'</div>'
							]);
						}
					}
				}
			}

			if (!sourceFound)
			{
				if (_.has(project, 'dataContext.description'))
				{
					informationView.add(
					[
						'<div class="card mt-2">',
							'<div class="card-body">',
								'<div class="text-secondary">', project.dataContext.description, '</div>',
							'</div>',
						'</div>'
					]);
				}
			}

			informationView.render(containerSelector);
		}
		else if (sourceProjectTemplate.templateFile != undefined)
		{
			if (_.has(projectTemplateFile, 'template.definition')
				&& !_.has(projectTemplateFile, 'template.project'))
			{
				projectTemplateFile.template.project = projectTemplateFile.template.definition
			}

			if (_.has(projectTemplateFile, 'template.project'))
			{
				var projectTemplate = projectTemplateFile.template.project;

				informationView.add(
				[
					'<div class="mt-4">',
						'<div class="w-75 mx-auto">',
							'<h1 class="text-center mx-auto">', projectTemplate.title, '</h1>',
							'<h2 class="text-center mx-auto">', projectTemplate.summary, '</h2>',
							'<div class="text-center text-secondary mx-auto lead">', projectTemplate.description, '</div>',
						'</div>',
					'</div>'
				]);

				if (_.isSet(projectTemplate.url))
				{
					let urlCaption = projectTemplate.urlCaption;
					if (_.isNotSet(urlCaption))
					{
						urlCaption = 'More Information'
					}

					informationView.add(
					[
						'<div class="mt-3">',
							'<div class="w-75 mx-auto text-center">',
								'<a href="' + projectTemplate.url + '" target="_blank">',
									urlCaption,
									'</a>',
							'</div>',
						'</div>'
					]);
				}

				// OUTCOMES

				if (_.has(projectTemplate, 'outcomes'))
				{
					informationView.add(
					[
						'<div class="card mt-4">',
							'<div class="card-header">',
								'<div class="row align-items-end">',
									'<div class="col">',
										'<h3 class="mb-0" style="font-size:1.4rem;">',
											'Outcomes',
											'<span class="badge text-muted mb-1" style="font-size: 0.8rem;">(' + projectTemplate.outcomes.length + ')</span>',
										'</h3>',
									'</div>',
									'<div class="col-auto pb-1">',
										'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-outcomes-collapse">',
											'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="card-body collapse myds-collapse" id="util-project-information-outcomes-collapse">'
					]);

					if (projectTemplate.outcomes.length == 0)
					{
						informationView.add(
						[
							'<div class="card">',
								'<div class="card-body">',
									'<div class="text-secondary">There are outcomes set up.</div>',
								'</div>',
							'</div>'
						]);
					}
					else
					{
						_.each(projectTemplate.outcomes, function (outcome)
						{
							informationView.add(
							[
								'<div class="card">',
									'<div class="card-body">',
										outcome.description,
									'</div>',
								'</div>'
							]);
						});
					}

					informationView.add(
					[		
							'</div>',
						'</div>'
					]);
				}

				// RULES

				if (_.has(projectTemplate, 'rules'))
				{
					const templateRules = _.filter(projectTemplate.rules, function (rule)
					{
						return (_.isSet(rule.subject) || _.isSet(rule.description))
					});

					informationView.add(
					[
						'<div class="card mt-4">',
							'<div class="card-header">',
								'<div class="row align-items-end">',
									'<div class="col">',
										'<h3 class="mb-0" style="font-size:1.4rem;">',
											'Rules',
											'<span class="badge text-muted mb-1" style="font-size: 0.8rem;">(' + templateRules.length + ')</span>',
										'</h3>',
									'</div>',
									'<div class="col-auto pb-1">',
										'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-rules-collapse">',
											'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="card-body collapse myds-collapse" id="util-project-information-rules-collapse">'
					]);

					if (templateRules.length == 0)
					{
						informationView.add(
						[
							'<div class="card">',
								'<div class="card-body">',
									'<div class="text-secondary">There are no rules set up.</div>',
								'</div>',
							'</div>'
						]);
					}
					else
					{
						_.each(templateRules, function (rule)
						{
							if (_.isArray(rule.description))
							{
								rule.description = _.join(rule.description, '');
							}

							informationView.add(
							[
								'<div class="card">',
									'<div class="card-body">',
										(_.isSet(rule.subject)?'<h4>' + rule.subject + '</h4>':''),
										rule.description,
									'</div>',
								'</div>'
							]);
						});
					}

					informationView.add(
					[		
							'</div>',
						'</div>'
					]);
				}

				// RESOURCES

				if (_.isNotSet(projectTemplate.resources))
				{
					projectTemplate.resources = projectTemplate.links;
				}

				if (_.has(projectTemplate, 'resources'))
				{
					const templateResources = _.filter(projectTemplate.resources, function (resource)
					{
						return (_.isSet(resource.subject) || _.isSet(resource.description))
					});

					var informationResourcesView = app.vq.init({queue: 'util-project-information-show-resources'});

					_.each(templateResources, function (resource)
					{
						if (true || _.includes(resource.for, userRole))
						{
							if (resource.description == undefined) {resource.description = ''};
							if (_.isArray(resource.description)) {resource.description = _.join(resource.description, '')}

							if (_.isSet(resource.url))
							{
								let urlCaption = resource.urlCaption;
								if (urlCaption == undefined)
								{
									urlCaption = resource.url;
								}

								informationResourcesView.add(
								[
									'<div class="card">',
										'<div class="card-body">',
											'<h4>', resource.subject, '</h4>',
											'<div><a href="', resource.url, '" target="_blank">', urlCaption, '</a></div>',
										'</div>',
									'</div>'
								]);
							}
							else if (_.isSet(resource['image-url']))
							{
								informationResourcesView.add(
								[
									'<div class="card">',
										'<div class="card-body">',
											'<div class="row align-items-end">',
												'<div class="col">',
													'<h4>', resource.subject, '</h4>',
												'</div>',
												'<div class="col-auto pb-1">',
													'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-resource-', _.kebabCase(resource.subject), '-collapse">',
														'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
													'</a>',
												'</div>',
											'</div>',							
										'</div>',
										'<div class="p-4 pt-0 collapse myds-collapse" id="util-project-information-resource-', _.kebabCase(resource.subject), '-collapse"',
											' data-subject="', resource.subject, '">',
											'<div id="util-project-information-resource-', _.kebabCase(resource.subject), '">',
												'<div class="text-secondary">', resource.description, '</div>',
												'<img src="', resource['image-url'], '" class="img-responsive w-100">',
											'</div>',
										'</div>',
									'</div>'
								]);
							}
							else 
							{
								informationResourcesView.add(
								[
									'<div class="card">',
										'<div class="card-body">',
											'<h4>', resource.subject, '</h4>',
											(_.isSet(resource.description)?'<div class="text-secondary">' + resource.description + '</div>':''),
										'</div>',
									'</div>'
								]);
							}
						}
					});

					var resourcesViewHTML = informationResourcesView.get();

					if (resourcesViewHTML != '')
					{
						informationView.add(
						[
							'<div class="card mt-4">',
								'<div class="card-header">',
									'<div class="row align-items-end">',
										'<div class="col">',
										'<h3 class="mb-0" style="font-size:1.4rem;">',
											'Resources',
											'<span class="badge text-muted mb-1" style="font-size: 0.8rem;">(' + templateResources.length + ')</span>',
										'</h3>',
										'</div>',
										'<div class="col-auto pb-1">',
											'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-resources-collapse">',
												'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
											'</a>',
										'</div>',
									'</div>',
								'</div>',
								'<div class="card-body collapse myds-collapse" id="util-project-information-resources-collapse">'
						]);

						informationView.add(resourcesViewHTML);

						informationView.add(
						[		
								'</div>',
							'</div>'
						]);
					}
				}

				// MILESTONES

				if (_.has(projectTemplate, 'milestones'))
				{
					informationView.add(
					[
						'<div class="card mt-4">',
							'<div class="card-header">',
								'<div class="row align-items-end">',
									'<div class="col">',
									'<h3 class="mb-0" style="font-size:1.4rem;">',
										'Milestones | Modules',
										'<span class="badge text-muted mb-1" style="font-size: 0.8rem;">(' + projectTemplate.milestones.length + ')</span>',
									'</h3>',
									'</div>',
									'<div class="col-auto pb-1">',
										'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-milestones-collapse">',
											'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="card-body collapse myds-collapse" id="util-project-information-milestones-collapse"">'
					]);

					if (projectTemplate.milestones.length == 0)
					{
						informationView.add(
						[
							'<div class="card">',
								'<div class="card-body">',
									'<div class="text-secondary">There are no milestones (modules) set up.</div>',
								'</div>',
							'</div>'
						]);
					}
					else
					{
						_.each(projectTemplate.milestones, function (milestone)
						{
							informationView.add(
							[
								'<div class="card">',
									'<div class="card-body">',
										'<div class="row align-items-end">',
											'<div class="col">',
												'<div class="mb-0 lead fw-bold">', milestone.reference, '. ', milestone.subject, '</div>',
											'</div>',
											'<div class="col-auto pb-1">',
												'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-milestone-', milestone.reference,'-collapse">',
													'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
												'</a>',
											'</div>',
										'</div>',							
									'</div>',
									'<div class="collapse myds-collapse" id="util-project-information-milestone-', milestone.reference,'-collapse"',
										' data-controller="util-project-information-show-milestone"',
										' data-on-show="false"',
										' data-on-hide="false"',
										' data-reference="', milestone.reference, '">',
										'<div id="util-project-information-milestone-', milestone.reference, '">',
											'<div class="text-muted small text-center p-4">Initialising...</div>',
										'</div>',
									'</div>',
								'</div>'
							]);
						});
					}

					informationView.add(
					[		
							'</div>',
						'</div>'
					]);
				}

				//SKILLS GAINED

				if (_.has(projectTemplate, 'skills.gained'))
				{
					informationView.add(
					[
						'<div class="card mt-4">',
							'<div class="card-header">',
								'<div class="row align-items-end">',
									'<div class="col">',
									'<h3 class="mb-0" style="font-size:1.4rem;">',
										'Skills Gained',
										'<span class="badge text-muted mb-1" style="font-size: 0.8rem;">(' + projectTemplate.skills.gained.length + ')</span>',
									'</h3>',
									'</div>',
									'<div class="col-auto pb-1">',
										'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-skills-gained-collapse">',
											'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="card-body pb-0 collapse myds-collapse" id="util-project-information-skills-gained-collapse">',
								'<div class="card-body">',
									'<div class="text-center">',
										'The follow skills will be earned (in the form of an achievement) once the project has been successfully completed and verified by your learning partner.',
									'</div>'
					]);

					if (projectTemplate.skills.gained.length == 0)
					{
						informationView.add(
						[
							'<div class="card">',
								'<div class="card-body">',
									'<div class="text-secondary">There are no skills to be gained set up.</div>',
								'</div>',
							'</div>'
						]);
					}
					else
					{
						if (projectTemplate['skill-capacities'] != undefined)
						{
							informationView.add(
							[
										'<div class="text-secondary mt-3 text-center">' +
											'You can be endorsed as a combination of the follow capacities; ' +
											_.join(_.map(projectTemplate['skill-capacities'], function (skillCapacity)
														{
															return app.whoami().mySetup.skillCapacities[skillCapacity] + ' (' + skillCapacity + ')'
														}), ', '),
											'.',
										'</div>'
							])
						}

						informationView.add(
						[
									'</div>',
									'<div class="card-body">',
										'<div class="row">'
						]);

						var skillsContexts = projectTemplate.skills['scope-contexts'];

						if (_.isNotSet(skillsContexts))
						{
							skillsContexts =
							[
								{
									"name": "All"
								}
							]
						}
						
						_.each(skillsContexts, function (skillsContext)
						{
							skillsContext.caption = '<div class="row">';

							if (_.isSet(skillsContext['image-uri']))
							{
								skillsContext.caption += '<div class="col-2"><img src="' + skillsContext['image-uri'] + '" class="float-left rounded shadow ml-2" style="height:50px;"></div>'
							}

							skillsContext.caption += ('<div class="col-auto mt-3"><h3');

							if (_.isSet(skillsContext.style))
							{
								skillsContext.caption += ' style="' + skillsContext.style + '"'
							}

							skillsContext.caption += ('>' + skillsContext.name + '</h3>');
							
							skillsContext.caption += '</div></div>';

							if (skillsContext.name == 'All')
							{
								informationView.add(
								[
											'<div id="util-project-information-skills-gained-', _.kebabCase(skillsContext.name), '">'			
								]);

								skillsContext.skillsGained = projectTemplate.skills.gained
							}
							else
							{
								informationView.add(
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
		
								skillsContext.skillsGained = _.filter(projectTemplate.skills.gained, function(skillsGained)
								{
									return _.includes(skillsGained.scope.contexts, skillsContext.name)
								})
							}

							informationView.add('<div class="row">');
					
							_.each(skillsContext.skillsGained, function (skill)
							{
								if (_.isNotSet(skill.validation))
								{
									skill.validation = skill.verification;
								}

								skill._validationView = '';

								if (_.has(skill, 'validation.notes'))
								{
									skill._validationView += '<div class="text-secondary mt-3">Verification Notes</div><div>' + skill.validation.notes + '</div>'
								}

								if (_.has(skill, 'validation.evidence'))
								{
									skill._validationView += '<div class="text-secondary mt-3">Verification Evidence</div><div>';

									_.each(skill.validation.evidence, function (evidence)
									{
										skill._validationView += '<div>' + evidence.description + '</div>'
									});

									skill._validationView += '</div>'
								}
							
								informationView.add(
								[
														'<div class="col-12 col-xl-6">',
															'<div class="card">',
																'<div class="card-body text-center">',
																	'<h2>', skill.name, '</h2>',
																	'<div>', 
																		'<span class="badge text-muted border">URI</span> ',
																		'<a href="https://skillzeb.io/skillset-explorer/', skill.uri, '" target="_blank">',
																			skill.uri,
																		'</a>',
																	'</div>',
																	'<div class="text-secondary"><span class="badge text-muted border">SDI</span> ', skill.sdi, '</div>',
																	skill._validationView,
																'</div>',
															'</div>',
														'</div>'
								]);
							});

							informationView.add(
							[
													'</div>'
							])

							if (_.isSet(skillsContext.tokens))
							{
								informationView.add('<div class="row">');

								_.each(skillsContext.tokens, function (tokenCount, tokenName)
								{
									informationView.add([
										'<div class="col-12 text-center mx-auto w-75 text-secondary mb-4">',
											tokenCount, ' ', tokenName.toUpperCase(), ' tokens will be earned for each skill gained at this level.',
										'</div>'
									]);
								});

								informationView.add('</div>');
							}

							informationView.add(
								[
												'</div>',
											'</div>',
										'</div>'
							]);

							
						});
					}

					informationView.add(
					[		
									'</div>',
								'</div>',
							'</div>',
						'</div>'
					]);
				}

				if (_.has(projectTemplate, 'version'))
				{
					informationView.add(
					[
						'<div class="card mt-4">',
							'<div class="card-header">',
								'<div class="row align-items-end">',
										'<div class="col">',
										'<h3 class="mb-0" style="font-size:1.4rem;">Template Info</h3>',
										'</div>',
										'<div class="col-auto pb-1">',
											'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-template-info-collapse">',
												'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
											'</a>',
										'</div>',
									'</div>',
							'</div>',
							'<div class="card-body py-2 collapse myds-collapse" id="util-project-information-template-info-collapse">',
								'<div class="row mt-3">',
									'<div class="col-12 text-center">',
										'<div class="text-secondary">',
											projectTemplate.usage,
										'</div>',
									'</div>',
								'</div>',
								'<div class="row">'
					]);

								informationView.add(
								[
									'<div class="col-6">',
										'<div class="card mt-4">',
											'<div class="card-body">',
												'<h4 class="">',
													'Version ', projectTemplate.version.number, ' (', projectTemplate.version.date, ')', 
												'</h4>'
								]);

								if (_.has(projectTemplate, 'sharing'))
								{
									informationView.add(
									[
												'<div class="text-secondary">',
													'Share As ', projectTemplate.sharing.type, 
												'</div>',
												'<div class="text-secondary mt-2">',
													projectTemplate.sharing.notes,
												'</div>'
									]);
								}

								informationView.add(
								[
											'</div>',
										'</div>',
									'</div>'
								]);

							if (_.has(projectTemplate, 'source'))
							{
								informationView.add(
								[
									'<div class="col-6">',
										'<div class="card mt-4">',
											'<div class="card-body">',
												'<h4 class="">Source; ', projectTemplate.source.name, '</h4>',
												'<div class="text-secondary">Shared by source as ', projectTemplate.source.sharing.type, '</div>',
												'<div class="text-secondary mt-2">', projectTemplate.source.notes, '</div>',
											'</div>',
										'</div>',
									'</div>'
								]);
							}
								
					informationView.add(
					[		
									
								'</div>',
							'</div>',
						'</div>'
					]);
				}
			}

			if (_.isSet(containerTemplate))
			{
				var _informationView = app.vq.init({queue: '_informationView'});
				_informationView.template(containerTemplate);
				_informationView.add({useTemplate: true}, {information: informationView.get()});
				_informationView.render(containerSelector);
			}
			else
			{
				informationView.render(containerSelector);
			}

			app.invoke('util-project-information-show-skills-status');
		}
	}
});

app.add(
{
	name: 'util-project-information-show-skills-status',
	code: function (param)
	{
		var projectTemplateFile = app.get(
		{
			scope: userRole + '-project-summary',
			context: 'source-template',
			name: '_file'
		});

		if (_.has(projectTemplateFile, 'template.project.skills'))
		{
			var projectTemplateSkills = projectTemplateFile.template.project.skills;

			if (_.isNotSet(response))
			{
				var userRole = app.whoami().thisInstanceOfMe._userRole;

				var filters = 
				[
					{
						field: 'displayorder',
						value: _.map(projectTemplateSkills, 'sequencenumber')
					}
				];

				mydigitalstructure.cloud.search(
				{
					object: 'setup_contact_attribute',
					fields: ['guid', 'displayorder'],
					filters: filters,
					callback: 'util-project-information-show-skills-status'
				});
			}
			else
			{
				var projectTemplateSkills = app.set(
				{
					scope: 'util-project-information-show',
					context: 'project-template-skills',
					value: response.data.rows
				});

				if (projectTemplateSkills.length != 0)
				{
					var userRole = app.whoami().thisInstanceOfMe._userRole;

					var projectID = app.get(
					{
						scope: userRole + '-project-summary',
						context: 'dataContext',
						valid: 'id'
					});

					var filters = 
					[
						{
							field: 'object',
							value: app.whoami().mySetup.objects.contactAttribute
						},
						{
							field: 'parentobject',
							value: app.whoami().mySetup.objects.project
						},
						{
							field: 'parentobjectcontext',
							value: projectID
						}
					];

					mydigitalstructure.cloud.search(
					{
						object: 'core_object_link',
						fields: 'objectcontext',
						filters: filters,
						callback: 'util-project-information-show-skills-status-process'
					});

					//Set skills IDs and then get object links; parentobject: 1, parentobjectcontext: this project
					// {"value":409,"name":"object","comparison":"EQUAL_TO"}
					// then call to -process and show tick if set.  ie learning partner has set the status.
				}
			}
		}
	}
});

app.add(
{
	name: 'util-project-information-show-skills-status-process',
	code: function (param, response)
	{
		var projectSkills = response.data.rows;

		if (projectSkills.length != 0 )
		{
			var filters = 
			[
				{
					field: 'id',
					value: _.map(projectSkills, 'id')
				},
				{
					field: 'contactperson',
					value: app.whoami().thisInstanceOfMe.user.contactperson
				}
			]

			mydigitalstructure.cloud.search(
			{
				object: 'contact_attribute',
				fields: 'attribute',
				filters: filters,
				callback: 'util-project-information-show-skills-status-process-show'
			});
		}
	}
});

app.add(
{
	name: 'util-project-information-show-skills-status-process-show',
	code: function (param, response)
	{
		var projectTemplateContactSkills = app.set(
			{
				scope: 'util-project-information-show',
				context: 'project-template-contact-skills',
				value: response.data.rows
			});

		var projectTemplateSkills = app.get(
		{
			scope: 'util-project-information-show',
			context: 'project-template-skills'
		});

		_.each(projectTemplateContactSkills, function (contactSkill)
		{
			contactSkill._attribute = _.find(projectTemplateSkills, function (skill)
			{
				return (skill.id == contactSkill.attribute)
			});

			if (_.isSet(contactSkill._attribute))
			{
				app.show('#util-project-summary-information-skill-status-' + contactSkill._attribute.displayorder,
					'[Tick]');
			}
		});
	}
});

app.add(
{
	name: 'util-project-information-show-milestone',
	code: function (param)
	{
		var userRole = app.whoami().thisInstanceOfMe._userRole;

		var projectTemplateFile = app.get(
		{
			scope: userRole + '-project-summary',
			context: 'source-template',
			name: '_file'
		});

		var projectTemplate = projectTemplateFile.template.project;
		
		var milestoneReference = app._util.param.get(param.dataContext, 'reference').value;

		var milestone = _.find(projectTemplate.milestones, function (milestone)
						{
							return milestone.reference == milestoneReference
						});

		if (_.isSet(milestone))
		{
			var milestoneView = app.vq.init({queue: 'util-project-information-show-milestone'});

			var durationDays = milestone['duration-days'];
			if (_.isNotSet(durationDays))
			{
				durationDays = milestone['durationdays'] 
			}

			var durationDaysText = ''

			if (_.isSet(durationDays))
			{
				durationDaysText = durationDays.minimum + ' to ' +
				durationDays.maximum, ' days.';
			}
			
			milestoneView.add(
			[
				'<div class="card-body pt-0">',
					'<div class="row pb-4 pl-2">',
						'<div class="col-12 text-secondary mb-3">',
							'<div class="mb-0 fw-bold">', milestone['description'], '</div>',	
						'</div>',
						'<div class="col-12 text-secondary">',
							durationDaysText,
						'</div>',
					'</div>',
					'<div class="row">',
						'<div class="col-12">',
							'<div class="d-none" id="util-project-information-milestone-', milestone.reference, '-support-items-container">',
							'</div>',
							'<div class="d-none" id="util-project-information-milestone-', milestone.reference, '-resources-container">',
							'</div>',
							'<div class="d-none" id="util-project-information-milestone-', milestone.reference, '-tasks-container">',
							'</div>',
						'</div>',
					'</div>',
				'</div>'
			]);

			milestoneView.render('#util-project-information-milestone-' + milestone.reference);

			// MILESTONE; TASKS

			var refresh = {};
			refresh[(milestone.tasks.length==0?'hide':'show')] = '#util-project-information-milestone-' + milestone.reference + '-tasks-container';
			app.refresh(refresh);

			milestoneView.template(
			[
				'<div class="card">',
					'<div class="card-body">',
						'<div class="row">',
							'<div class="col">',
								'<h4 class="mb-2 lead fw-bold">{{subject}}</h4>',
								'<div>{{description}}</div>',
							'</div>',
							'<div class="col-auto text-right">',
								'<span class="badge text-muted border small">{{_by}}</span>',
							'</div>',
							
						'</div>',	
						'<div class="mt-3" id="util-project-information-milestone-', milestone.reference, '-task-{{hash}}">',
							'<div class="row">',
								'<div class="col-12">',
									'<div id="util-project-information-milestone-', milestone.reference, '-task-{{hash}}-resources-container">',
										'{{_resourcesHTML}}',
									'</div>',
									'<div id="util-project-information-milestone-', milestone.reference, '-task-{{hash}}-support-items-container">',
										'{{_supportItemsHTML}}',
									'</div>',
									'<div id="util-project-information-milestone-', milestone.reference, '-task-{{hash}}-reflections-container">',
										'{{_reflectionsHTML}}',
									'</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>',
				'</div>'
			]);

			if (milestone.tasks.length != 0)
			{
				milestoneView.add(
				[
					'<h4 class="ml-2" style="font-size: 1.1rem;">Tasks</h4>',
				]);

				_.each(milestone.tasks, function (task)
				{
					task._by = _.capitalize(task.by);

					task._hash = task.id;
					if (task._hash == undefined)
					{
						task._hash = task.subject;
					}

					task._hash = milestone.reference + '--' + task._hash;

					task.hash = app.invoke('util-protect-hash', {data: task._hash}).dataHashed;

					//Resources
					task._resourcesHTML = '';

					if (_.isSet(task.resources))
					{
						task._resourcesHTML += '<h4 class="text-muted">Resources</h4><ul>';

						_.each(task.resources, function(resource)
						{	
							if (_.isNotSet(resource.subject)) {resource.subject = resource.url}
							task._resourcesHTML += '<li><div><a href="' + resource.url + '" target="_blank">' + resource.subject + '</a></div>';
							if (_.isSet(resource.description))
							{
									task._resourcesHTML += '<div class="text-secondary small">' + resource.description + '</div>';
							}
							task._resourcesHTML += '</li>';
						});

						task._resourcesHTML += '</ul>';
					}

					//Support Items

					task._supportItemsHTML = '';

					if (_.isSet(task.supportitems))
					{
						task._supportItemsHTML += '<h4 class="text-muted">Support Items</h4><ul>';

						_.each(task['supportitems'], function(item)
						{	
							if (_.isSet(item.subject))
							{
								task._supportItemsHTML += '<li>' +
									'<div class="fw-bold">' + item.subject + '</div>' +
									'<div class="mt-1">' + item.description + '</div>' +
								'</li>'
							}
							else
							{
								task._supportItemsHTML += '<li>' + item.description + '</li>';
							}							
						});

						task._supportItemsHTML += '</ul>';
					}

					//Reflections
					task._reflectionsHTML = '';

					if (_.isSet(task.reflections))
					{
						task._reflectionsHTML += '<h4 class="text-muted">Reflections | Quizzes</h4><ul>';

						_.each(task.reflections, function(reflection)
						{
							task._reflectionsHTML += '<li>' + reflection.description;
							
							if (_.has(reflection, 'structure.options'))
							{
								task._reflectionsHTML += '<ul>'

								_.each(reflection.structure.options, function(option)
								{
									task._reflectionsHTML += '<li>' + option.caption + ' (' + option.points + ')' + '</li>';
								});

								task._reflectionsHTML += '</ul>'
							}
							
							task._reflectionsHTML += '</li>'
						});

						task._reflectionsHTML += '</ul>';
					}

					milestoneView.add({useTemplate: true}, task);
				});
			}

			milestoneView.render('#util-project-information-milestone-' + milestone.reference + '-tasks-container');

			if (app.whoami().thisInstanceOfMe.view.uriContext != '#learning-partner-setup-project-template-summary'
				&& app.whoami().thisInstanceOfMe.view.uriContext != '#studio-setup-template-summary')
			{
				app.invoke('util-project-information-show-milestone-tasks', param);
			}

			// MILESTONE; RESOURCES

			var refresh = {};

			milestone.hasResources = false;
			if (milestone.notes != undefined) {milestone.hasResources = (milestone.notes.length != 0)}
			if (!milestone.hasResources && milestone.resources != undefined) {milestone.hasResources = (milestone.resources.length != 0)}

			refresh[(milestone.hasResources?'show':'hide')] = '#util-project-information-milestone-' + milestone.reference + '-resources-container';
			app.refresh(refresh);

			var resources = milestone.resources;

			if (_.isSet(milestone.notes))
			{
				resources = _.assign(resources, milestone.notes);
			}

			resources = _.filter(resources, function (resource)
			{
				return (_.includes(resource.for, userRole) || resource.for == undefined);
			});

			if (resources.length != 0)
			{
				milestoneView.add(
				[
					'<h4 class="ml-2" style="font-size: 1.1rem;">Resources</h4>',
				]);

				_.each(resources, function (resource)
				{
					if (resource.description == undefined) {resource.description = ''};
					if (_.isArray(resource.description)) {resource.description = _.join(resource.description, '')}

					if (_.isSet(resource.url))
					{
						milestoneView.add(
						[
							'<div class="card">',
								'<div class="card-body">',
									'<h4>', resource.subject, '</h4>',
									'<div><a href="', resource.url, '" target="_blank">', resource.description, ' <i class="far fa-external-link"></i></a></div>',
								'</div>',
							'</div>'
						]);
					}
					else if (_.isSet(resource['image-url']))
					{
						milestoneView.add(
						[
							'<div class="card">',
								'<div class="card-body">',
									'<div class="row align-items-end">',
										'<div class="col">',
											'<h4>', resource.subject, '</h4>',
										'</div>',
										'<div class="col-auto pb-1">',
											'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-resource-', _.kebabCase(resource.subject), '-collapse">',
												'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
											'</a>',
										'</div>',
									'</div>',							
								'</div>',
								'<div class="p-4 pt-0 collapse myds-collapse" id="util-project-information-resource-', _.kebabCase(resource.subject), '-collapse"',
									' data-subject="', resource.subject, '">',
									'<div id="util-project-information-resource-', _.kebabCase(resource.subject), '">',
										'<div class="text-secondary mb-4">', resource.description, '</div>',
										'<img src="', resource['image-url'], '" class="img-responsive w-100">',
									'</div>',
								'</div>',
							'</div>'
						]);
					}
					else if (_.isSet(resource.description))
					{
						milestoneView.add(
						[
							'<div class="card">',
								'<div class="card-body">',
									'<h4>', resource.subject, '</h4>',
									'<div class="text-secondary">', resource.description, '</div>',
								'</div>',
							'</div>'
						]);
					}
					
				});

				milestoneView.render('#util-project-information-milestone-' + milestone.reference + '-resources-container');
			}

			// SUPPORT ITEMS

			var refresh = {};

			milestone.hasSupportItems = false;

			if (milestone['support-items'] != undefined) {milestone.hasSupportItems = (milestone['support-items'].length != 0)}
			if (!milestone.hasSupportItems && milestone['learner-support-items'] != undefined) {milestone.hasSupportItems = (milestone['learner-support-items'].length != 0)}

			refresh[(milestone.hasSupportItems?'show':'hide')] = '#util-project-information-milestone-' + milestone.reference + '-support-items-container';
			app.refresh(refresh);

			var supportItems = milestone['support-items'];

			if (_.isSet(milestone['learner-support-items']))
			{
				supportItems = _.assign(supportItems, milestone.notes);
			}

			supportItems = _.filter(supportItems, function (supportItem)
			{
				return (_.includes(supportItem.for, userRole) || supportItem.for == undefined);
			});

			if (supportItems.length != 0)
			{
				milestoneView.template(
				[
					'<div class="card">',
						'<div class="card-body">',
							'<div class="mb-3">{{subject}}</div>',
							'<div class="text-secondary">{{description}}</div>',
						'</div>',
					'</div>'
				]);

				milestoneView.add(
				[
					'<h4 class="ml-2" style="font-size: 1.1rem;">Items</h4>',
				]);

				_.each(supportItems, function (item)
				{
					if (item.description == undefined) {item.description = ''}
					if (_.isArray(item.description)) {item.description = _.join(item.description, '')}
					milestoneView.add({useTemplate: true}, item);
				});
			}

			milestoneView.render('#util-project-information-milestone-' + milestone.reference + '-support-items-container');
		}
	}
});

app.add(
{
	name: 'util-project-information-show-milestone-tasks',
	code: function (param, response)
	{
		if (param.status == 'shown')
		{
			var userRole = app.whoami().thisInstanceOfMe._userRole;

			if (userRole == 'learning-partner')
			{
				app.invoke('util-project-information-show-milestone-tasks-show', param)
			}
			else
			{
				var project = app.get(
				{
					scope: userRole + '-project-summary',
					context: 'dataContext'
				});

				if (response == undefined)
				{
					var tasks =	app.get(
					{
						scope: 'util-project-information-show-milestone-tasks',
						context: 'tasks'
					});

					if (_.isSet(tasks))
					{	
						app.invoke('util-project-information-show-milestone-hashes', param)
					}
					else
					{
						var filters = 
						[
							{
								field: 'project',
								value: project.id
							}
						];

						mydigitalstructure.cloud.search(
						{
							object: 'project_task',
							fields: ['id', 'guid'],
							filters: filters,
							callback: 'util-project-information-show-milestone-tasks',
							callbackParam: param
						});
					}
				}
				else
				{
					app.set(
					{
						scope: 'util-project-information-show-milestone-tasks',
						context: 'tasks',
						value: response.data.rows
					});

					app.invoke('util-project-information-show-milestone-hashes', param)
				}
			}
		}
	}
});

app.add(
{
	name: 'util-project-information-show-milestone-hashes',
	code: function (param, response)
	{
		var userRole = app.whoami().thisInstanceOfMe._userRole;

		var project = app.get(
		{
			scope: userRole + '-project-summary',
			context: 'dataContext'
		});

		var tasks = app.get(
		{
			scope: 'util-project-information-show-milestone-tasks',
			context: 'tasks'
		});

		app.set(
		{
			scope: 'util-project-information-show-milestone-tasks',
			context: 'hashes',
			value: []
		});

		if (tasks.length == 0)
		{
			app.invoke('util-project-information-show-milestone-tasks-show', param)
		}
		else
		{
			if (response == undefined)
			{
				var filters = 
				[
					{
						field: 'object',
						value: app.whoami().mySetup.objects.projectTask
					},
					{
						field: 'objectcontext',
						comparison: 'IN_LIST',
						value: _.map(tasks, 'id')
					},
					{
						field: 'type',
						value: 2
					}
				];

				mydigitalstructure.cloud.search(
				{
					object: 'core_protect_ciphertext',
					fields: ['ciphertext', 'objectcontext'],
					filters: filters,
					callback: 'util-project-information-show-milestone-hashes',
					callbackParam: param
				});
			}
			else
			{
				var hashes = response.data.rows;

				_.each(hashes, function (hash)
				{
					hash._task = _.find(tasks, function(task) {return task.id == hash.objectcontext});
					if (hash._task != undefined)
					{
						hash.taskID = hash._task.id;
						hash.taskGUID = hash._task.guid;
					}
				});

				app.set(
				{
					scope: 'util-project-information-show-milestone-tasks',
					context: 'hashes',
					value: hashes
				});
					
				app.invoke('util-project-information-show-milestone-tasks-show', param)
			}
		}
	}
});

app.add(
{
	name: 'util-project-information-show-milestone-tasks-show',
	code: function (param)
	{
		var userRole = app.whoami().thisInstanceOfMe._userRole;

		var projectTemplateFile = app.get(
		{
			scope: userRole + '-project-summary',
			context: 'source-template',
			name: '_file'
		});

		var taskHashes = app.get(
		{
			scope: 'util-project-information-show-milestone-tasks',
			context: 'hashes'
		});

		var projectTemplate = projectTemplateFile.template.project;
		
		var milestoneReference = app._util.param.get(param.dataContext, 'reference').value;

		var milestone = _.find(projectTemplate.milestones, function (milestone)
		{
			return milestone.reference == milestoneReference
		});

		if (_.has(milestone, 'tasks'))
		{
			_.each(milestone.tasks, function (task)
			{
				task._hash = task.id;
				if (task._hash == undefined)
				{
					task._hash = task.subject;
				}

				task._hash = milestone.reference + '--' + task._hash;

				task.hash = app.invoke('util-protect-hash', {data: task._hash}).dataHashed;

				task._existingHash = _.find(taskHashes, function (taskHash) {return taskHash.ciphertext == task.hash})

				var actionView = app.vq.init({queue: 'util-project-information-milestone-action'});

				if (task._existingHash == undefined)
				{
					actionView.add(
					[
						'<button type="button" style="width:90px;" class="btn btn-default btn-sm myds-click"',
						' data-scope="learner-task-summary"',
						' data-controller="util-project-information-show-milestone-task-save"',
						' data-hash="', task.hash, '"',
						' data-milestone="', milestone.reference, '"',
						' data-spinner="append"', 
						'>Create Task',
						'</button>'
					]);
				}
				else
				{
					actionView.add(
					[
						'<button type="button" style="width:90px;" class="btn btn-default btn-sm myds-navigate"',
						' data-scope="learner-task-summary"',
						' data-context="', task._existingHash.taskGUID , '"',
						'>View Task',
						'</button>'
					]);
				}

				actionView.render('#util-project-information-milestone-' + milestone.reference + '-' + task.hash)
			});
		}
	}
});

app.add(
{
	name: 'util-project-information-show-milestone-task-save',
	code: function (param, response)
	{	
		var userRole = app.whoami().thisInstanceOfMe._userRole;

		var taskHash = app._util.param.get(param.dataContext, 'hash').value;
		var taskMilestoneReference = app._util.param.get(param.dataContext, 'milestone').value;

		var projectTemplateFile = app.get(
		{
			scope: userRole + '-project-summary',
			context: 'source-template',
			name: '_file'
		});
	
		var projectTemplate = projectTemplateFile.template.project;
		
		var project = app.get(
		{
			scope: userRole + '-project-summary',
			context: 'dataContext'
		});

		var milestone = _.find(projectTemplate.milestones, function (milestone)
		{
			return milestone.reference == taskMilestoneReference
		});
	
		if (milestone == undefined)
		{
			app.notify({type: 'error', message: 'Can not find the milestone in the template.'})
		}
		else
		{
			var task = _.find(milestone.tasks, function (task)
			{
				return task.hash == taskHash
			});

			var taskType = app.whoami().mySetup.projectTaskTypes['listening'];

			if (_.isSet(task.type))
			{
				taskType = app.whoami().mySetup.projectTaskTypes[task.type.toLowerCase()];

				if (taskType == undefined)
				{
					taskType = app.whoami().mySetup.projectTaskTypes[task.type.toLowerCase() + 'ing'];
				}
			}
			
			var data =
			{
				datareturn: 'guid',
				project: project.id,
				title: task.subject,
				description: task.description,
				percentagecomplete: 0,
				priority: 2,
				status: 1,
				taskbyuser: app.whoami().thisInstanceOfMe.user.id,
				type: taskType,
				startdate: moment().format('DD MMM YYYY')
			}
		
			mydigitalstructure.cloud.save(
			{
				object: 'project_task',
				data: data,
				callback: 'util-project-information-show-milestone-task-save-hash',
				callbackParam: param
			});
		}

	}
});

app.add(
{
	name: 'util-project-information-show-milestone-task-save-hash',
	code: function (param, response)
	{	
		if (response.status == 'OK')
		{
			app._util.param.set(param, 'taskID', response.id);

			if (_.has(response, 'data.rows'))
			{
				app._util.param.set(param, 'taskGUID', _.first(response.data.rows).guid);
			}
			
			var taskHash = app._util.param.get(param.dataContext, 'hash').value;
			var taskMilestoneReference = app._util.param.get(param.dataContext, 'milestone').value;
			
			var data =
			{
				object: app.whoami().mySetup.objects.projectTask,
				objectcontext: response.id,
				type: 2,
				ciphertext: taskHash,
				notes: 'Milestone: ' + taskMilestoneReference
			}
		
			mydigitalstructure.cloud.save(
			{
				object: 'core_protect_ciphertext',
				data: data,
				callback: 'util-project-information-show-milestone-task-save-finalise',
				callbackParam: param
			});
		}
	}
});

app.add(
{
	name: 'util-project-information-show-milestone-task-save-finalise',
	code: function (param, response)
	{	
		if (response.status == 'OK')
		{
			app.notify('Task added to your project.');

			var taskHash = app._util.param.get(param.dataContext, 'hash').value;
			var milestoneReference = app._util.param.get(param.dataContext, 'milestone').value;

			var taskGUID = app._util.param.get(param, 'taskGUID').value;

			app.invoke('util-view-spinner-remove-all');

			app.show('#util-project-information-milestone-' + milestoneReference + '-' + taskHash,
			[
				'<button type="button" style="width:90px;" class="btn btn-default btn-sm myds-navigate"',
				' data-scope="learner-task-summary"',
				' data-context="', taskGUID , '"',
				' data-hash="', taskHash , '"',
				'>View Task',
				'</button>'
			]);
		}
	}
});

app.add(
{
	name: 'util-project-source-template-file-get',
	code: function (param, response)
	{
		var userRole = app.whoami().thisInstanceOfMe._userRole;
		var onComplete = app._util.param.get(param, 'onComplete', {default: 'util-project-information-show'}).value;

		var projectTemplateFile = app._util.param.get(param, 'projectTemplateFile').value;

		if (projectTemplateFile == undefined)
		{
			var projectTemplate = app.get(
			{
				scope: userRole + '-project-summary',
				context: 'source-template'
			});

			if (projectTemplate != undefined)
			{
				projectTemplateFile = projectTemplate.templateFile;
			}
		}

		if (projectTemplateFile == undefined)
		{
			app.invoke(onComplete, param);
		}
		else
		{
			if (response == undefined)
			{
				entityos.cloud.invoke(
				{
					method: 'core_file_read',
					data:
					{
						id: projectTemplateFile.id,
						dataonly: 'Y'
					},
					callback: 'util-project-source-template-file-get',
					callbackParam: param
				});
			}
			else
			{
				app._util.param.set(param, '_file', response);

				if (projectTemplate != undefined)
				{
					projectTemplate._file = response;

					app.set(
					{
						scope: userRole + '-project-summary',
						context: 'source-template',
						value: projectTemplate
					});

					if (_.isSet(projectTemplate.templateParentFile))
					{
						app.invoke('util-project-source-template-file-get-parent', param);
					}
					else
					{
						app.invoke(onComplete, param);
					}
				}
				else
				{
					app.set(
					{
						scope: onComplete,
						context: 'source-template',
						value: response
					});

					app.invoke(onComplete, param);
				}
			}
		}
	}
});

app.add(
{
	name: 'util-project-source-template-file-get-parent',
	code: function (param, response)
	{
		var userRole = app.whoami().thisInstanceOfMe._userRole;
		var onComplete = app._util.param.get(param, 'onComplete', {default: 'util-project-information-show'}).value;

		var projectTemplate = app.get(
		{
			scope: userRole + '-project-summary',
			context: 'source-template'
		});
	
		if (response == undefined)
		{
			entityos.cloud.invoke(
			{
				method: 'core_file_read',
				data:
				{
					id: projectTemplate.templateParentFile.id,
					dataonly: 'Y'
				},
				callback: 'util-project-source-template-file-get-parent',
				callbackParam: param
			});
		}
		else
		{
			app._util.param.set(param, '_fileParent', response);

			projectTemplate._fileParent = response;

			// Merge file definitions

			projectTemplate._file = _.merge(projectTemplate._fileParent, projectTemplate._file);

			if (_.has(projectTemplate._file, 'template.definition.spaces'))
			{
				const spacesDefault = _.filter(projectTemplate._file.template.definition.spaces, function (space)
				{
					return (space['milestone-reference'] == '*')
				});

				if (_.has(projectTemplate._file, 'template.definition.milestones'))
				{
					if (spacesDefault.length != 0)
					{
						_.each(projectTemplate._file.template.definition.milestones, function (milestone)
						{
							milestone.spaces = _.concat(_.get(milestone, 'spaces', []), spacesDefault);
						});
					}

					_.each(projectTemplate._file.template.definition.spaces, function (space)
					{
						if (space['milestone-reference'] != '*')
						{
							let milestone = _.find(projectTemplate._file.template.definition.milestones, function (milestone)
							{
								return (milestone.reference == space['milestone-reference'])
							});

							if (_.isSet(milestone))
							{
								milestone.spaces = _.concat(_.get(milestone, 'spaces', []), space);
							}
						}
					});
				}
			}

			app.set(
			{
				scope: userRole + '-project-summary',
				context: 'source-template-parent',
				value: projectTemplate
			});

			app.invoke(onComplete, param);	
		}
	}
});


app.add(
{
	name: 'util-project-team-show',
	code: function (param)
	{	
		var projectID = app._util.param.get(param.dataContext, 'project').value;
		var scope = app._util.param.get(param.dataContext, 'scope').value;
		var context = app._util.param.get(param.dataContext, 'context').value;
		var selector = app._util.param.get(param.dataContext, 'selector').value;
        var viewStatus = app._util.param.get(param, 'status', {default: 'shown'}).value;
        var show = (viewStatus == 'shown');

		var userRole = app.whoami().thisInstanceOfMe.userRole;
        if (context == undefined) {context = userRole + '-project-summary'}
       
        var project;

        if (context != undefined)
        {
            project = app.get({scope: context, context: 'dataContext'})
        }

        var isMyProject = false;
        
        if (project != undefined)
        {
            isMyProject = (project.restrictedtoteam == 'Y');
            if (projectID == undefined) {projectID = project.id}
        }

        if (!isMyProject)
        {
            isMyProject = (userRole == 'admin');
        }

		if (scope == undefined)
		{
			scope = context
		}

		if (scope == undefined)
		{
			scope = 'util-project-team-show'
		}

		if (projectID == undefined)
		{
			projectID = app.get(
			{
				scope: scope,
				context: 'id',
				valueDefault: ''
			});
		}

		if (selector == undefined)
		{
			selector = scope + '-team-view'
		}

		if (show)
		{
			if (projectID != undefined && selector != undefined)
			{
				var filters =
				[
					{	
						field: 'project',
						comparison: 'EQUAL_TO',
						value: projectID
					}
				]

				var columns =
				[
					{
						caption: 'First Name',
						field: 'projectteam.contactperson.firstname',
						defaultSort: true,
						sortBy: true,
						class: 'col-4 col-sm-2 text-break text-wrap myds-click'
					},
					{
						caption: 'Last Name',
						field: 'projectteam.contactperson.surname',
						sortBy: true,
						class: 'col-4 col-sm-2 text-break text-wrap myds-click'
					},
					{
						caption: 'Role',
						field: 'projectroletext',
						sortBy: true,
						defaultSort: true,
						class: 'col-4 col-sm-3 text-break text-wrap myds-click'
					},
					
					{
						caption: 'Joined The Team',
						field: 'startdate',
						sortBy: true,
						class: 'col-0 col-sm-2 d-none d-sm-block text-break text-wrap myds-click'
					},
					{
						fields: ['enddate', 'guid']
					}
				];

				if (isMyProject)
				{
					columns = _.concat(columns,
                    {
                        caption: 'Left The Team',
                        name: 'dateleft-leaveteam',
                        sortBy: true,
                        class: 'col-0 col-sm-2 d-none d-sm-block text-break text-wrap myds-click'
                    },
					{
						html: '<button class="btn btn-danger btn-outline btn-sm myds-delete"' +
							   ' id="util-project-team-delete-{{id}}" data-id="{{id}}">' +
								   '<i class="fa fa-unlink"></i></button>',
						caption: '&nbsp;',
						class: 'col-0 col-sm-1 d-none d-sm-block text-center'
					});
				}
                else
                {
                    columns = _.concat(columns,
                    {
                        caption: 'Left The Team',
                        field: 'enddate',
                        sortBy: true,
                        class: 'col-0 col-sm-2 d-none d-sm-block text-break text-wrap myds-click'
                    });
                }
	
				app.invoke('util-view-table',
				{
					object: 'project_team',
					container: selector,
					context: 'util-project-team',
					filters: filters,
					options:
					{
						noDataText: '<div class="p-4">There are no project team members.</div>',
						rows: 20,
						orientation: 'vertical',
						progressive: true,
						class: 'table-condensed',
						deleteConfirm:
						{
							text: 'Are you sure you want to remove this team member?',
							position: 'left',
							headerText: 'Remove Project team member',
							buttonText: 'Remove',
							controller: 'util-project-team-delete-ok'
						},
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
							class: 'd-flex',
							controller: 'util-project-team-show-format'
						},

						columns: columns
					}
				});
			}			
		}
		else if (param.status == 'hidden')
		{
			app.show('#' + selector, '');
		}
	}
});

app.add(
{
    name: 'util-project-team-show-format',
    code: function (row)
    {
        row.name = row['projectteam.contactperson.firstname'] + ' ' +
					row['projectteam.contactperson.surname'];

        row['dateleft-leaveteam'] = row.enddate;
        
        if (_.isNotSet(row['dateleft-leaveteam']))
        {
            row['dateleft-leaveteam'] = '<button class="btn btn-white btn-sm myds-click"' +
                                        ' id="util-project-team-show-leave-team-' + row.id +
                                        '" data-id="' + row.id + '"' +
                                        '" data-controller="util-project-team-show-leave-ok"' +
                                        '">Leave</button>';
        }
    }
});

app.add(
{
    name: 'util-project-team-show-leave-ok',
    code: function (param, response)
    {
        if (_.isUndefined(response))
        {
            if (!_.isUndefined(param.dataContext))
            {
                mydigitalstructure.cloud.save(
                {
                    object: 'project_team',
                    data:
                    {
                        id: param.dataContext.id,
                        enddate: moment().format('D MMM YYYY')
                    },
                    callback: 'util-project-team-show-leave-ok',
                    callbackParam: param
                });
            }	
        }
        else
        {
            if (response.status == 'OK')
            {
                app.notify('Team member set as having left this team.');
                app.invoke('util-project-team-show', param);
            }
            else if (response.status == 'ER')
            {
                app.notify('Member can not leave this team. (' + response.error.errornotes + ')');
            }
        }
    }
});

app.add(
{
	name: 'util-project-team-edit',
	code: function (param)
	{	
		var context = app._util.param.get(param.dataContext, 'context').value;

		app.invoke('util-view-select',
		{
			container: context + '-team-edit-contactperson',
			object: 'contact_person',
			fields: [{name: 'firstname'}, {name: 'surname'}],
			filters:
			[
				{
					field: 'contactbusiness',
					value: app.whoami().thisInstanceOfMe.user.contactbusiness
				}
			],
			searchMinimumCharacters: 1
		});

		app.invoke('util-view-select',
		{
			container: context + '-team-edit-projectrole',
			object: 'setup_project_role',
			searchMinimumCharacters: 0,
			fields: [{name: 'title'}]
		});
	}
});

app.add(
{
	name: 'util-project-team-edit-save',
	code: function (param, response)
	{	
		var context = app._util.param.get(param.dataContext, 'context').value;

		var project = app.get(
		{
			controller: context,
			context: 'dataContext',
			valueDefault: {}
		});

		if (_.isSet(project))
		{
			var id = app.get(
			{
				controller: context + '-team-show',
				context: 'id',
				valueDefault: ''
			});
		
			var data = app.get(
			{
				controller: context + '-team-edit',
				cleanForCloudStorage: true,
				valueDefault: {}
			});

			if (id == '')
			{
				data.project = project.id;
				data.startdate = moment().format('D MMM YYYY');
			}
			else
			{
				data.id = id;
			}

			if (_.isUndefined(response))
			{
				mydigitalstructure.cloud.save(
				{
					object: 'project_team',
					data: data,
					callback: 'util-project-team-edit-save',
					callbackParam: param
				});
			}
			else
			{	
				if (response.status == 'OK')
				{
					app.notify('Added to this project team.');
					//$('#admin-community-project-summary-team-edit-collapse').removeClass('show');
					//app.invoke('app-navigate-to', {controller: 'admin-community-project-summary', context: data.project});
					//app.invoke('app-navigate-to', {controller: 'admin-community-projects', context: data.project});
					app.invoke('util-project-team-show', param)
				}
			}
		}
	}
});

app.add(
{
	name: 'util-project-team-delete-ok',
	code: function (param, response)
	{
		if (_.isUndefined(response))
		{
			if (!_.isUndefined(param.dataContext))
			{
				mydigitalstructure.cloud.delete(
				{
					object: 'project_team',
					data:
					{
						id: param.dataContext.id,
					},
					callback: 'util-project-team-delete-ok'
				});
			}	
		}
		else
		{
			if (response.status == 'OK')
			{
				app.notify('Removed from team.');
				app.invoke('util-project-team-show', {});
			}
			else if (response.status == 'ER')
			{
				app.notify('Can not be removed from the team. (' + response.error.errornotes + ')');
			}
		}
	}
});

/* LINKED PROJECTS */

app.add(
{
	name: 'util-project-linked-projects-show',
	code: function (param, response)
	{	
		var viewStatus = app._util.param.get(param, 'status', {default: 'shown'}).value;

		if (viewStatus == 'shown')
		{
			var context = app._util.param.get(param, 'context').value;

			if (_.isNotSet(context))
			{
				context = app._util.param.get(param.dataContext, 'context').value;
			}

			if (_.isNotSet(context))
			{
				context = 'util-project-linked-projects-show'
			}

			var selector = app._util.param.get(param.dataContext, 'selector').value;

			if (_.isNotSet(selector))
			{
				selector = context + '-linked-projects-view'
			}

			var projectID = app.get(
			{
				scope: 'util-project-linked-projects-show',
				context: 'dataContext',
				name: 'project'
			});

			if (projectID != undefined && selector != undefined)
			{
				var filters =
				[
					{	
						field: 'parentobject',
						value: 1
					},
					{	
						field: 'parentobjectcontext',
						value: projectID
					}
				]
	
				app.invoke('util-view-table',
				{
					object: 'core_object_link',
					container: selector,
					context: 'util-project-linked-projects',
					filters: filters,
					options:
					{
						noDataText: '<div class="p-4">There are no linked projects.</div>',
						rows: 20,
						orientation: 'vertical',
						progressive: true,
						class: 'table-condensed',
						deleteConfirm:
						{
							text: 'Are you sure you want to unlink this project?',
							position: 'left',
							headerText: 'Remove Project Link',
							buttonText: 'Remove',
							controller: 'util-project-linked-projects-delete-ok'
						},
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
							data: 'data-id="{{id}}" data-context="{{id}}" data-controller="learner-project-summary"',
							class: 'd-flex',
							method: function (row) {}
						},

						columns:
						[
							{
								caption: 'Name',
								field: 'notes',
								defaultSort: true,
								sortBy: true,
								class: 'col-10 text-break text-wrap myds-navigate'
							},
							{
								html: '<button class="btn btn-danger btn-outline btn-sm myds-delete"' +
			               			' id="util-project-linked-projects-delete-{{id}}" data-id="{{id}}">' +
			               				'<i class="fa fa-unlink"></i></button>',
								caption: '&nbsp;',
								class: 'col-2 text-center'
							},
							{
								fields: []
							}
						]	
					}
				});
			}			
		}
		else if (param.status == 'hidden')
		{
			app.show('#' + selector, '');
		}
	}
});

app.add(
{
	name: 'util-project-linked-projects-edit',
	code: function (param)
	{	
		var context = app._util.param.get(param.dataContext, 'context').value;

		app.invoke('util-view-select',
		{
			container: context + '-linked-projects-edit-project',
			object: 'project',
			fields: [{name: 'description'}, {name: 'guid', hidden: true}],
			filters:
			[
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
	name: 'util-project-linked-projects-edit-save',
	code: function (param, response)
	{	
		var context = app._util.param.get(param, 'context').value;

		var parentProject = app.get(
		{
			scope: context,
			context: 'dataContext'
		});

		var data = app.get(
		{
			controller: 'util-project-linked-projects-edit',
			valueDefault: {}
		});

		if (_.isUndefined(response))
		{
			if (_.isSet(data.project) && _.isSet(parentProject.id))
			{
				var dataObjectLink = 
				{
					object: 1,
					objectcontext: data.project,
					parentobject: 1,
					parentobjectcontext: parentProject.id,
					notes: data.projecttext,
					contextnotes: data._project.guid
				}

				mydigitalstructure.cloud.save(
				{
					object: 'core_object_link',
					data: dataObjectLink,
					callback: 'util-project-linked-projects-edit-save',
					callbackParam: param
				});
			}
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Linked to this project.');
				app.invoke('util-view-collapse', {context: context + '-linked-projects-edit'});
				app.invoke('util-project-linked-projects-show', {context: context});
			}
		}
	}
});

app.add(
{
	name: 'util-project-linked-projects-delete-ok',
	code: function (param, response)
	{
		if (_.isUndefined(response))
		{
			if (!_.isUndefined(param.dataContext))
			{
				mydigitalstructure.cloud.delete(
				{
					object: 'core_object_link',
					data:
					{
						id: param.dataContext.id,
					},
					callback: 'util-project-linked-projects-delete-ok',
					callbackParam: param
				});
			}	
		}
		else
		{
			if (response.status == 'OK')
			{
				app.notify('Project unlinked.');
				app.invoke('util-project-linked-projects-show', param);
			}
			else if (response.status == 'ER')
			{
				app.notify('Can not unlink this project. (' + response.error.errornotes + ')');
			}
		}
	}
});

// PROJECT TEMPLATES

app.add(
{
	name: 'util-project-template-tasks-show',
	code: function (param, response)
	{	
		var projectID = app._util.param.get(param.dataContext, 'project').value;
		var scope = app._util.param.get(param.dataContext, 'scope').value;
		var context = app._util.param.get(param.dataContext, 'context').value;
		var selector = app._util.param.get(param.dataContext, 'selector').value;

		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		if (scope == undefined)
		{
			scope = context
		}

		if (scope == undefined)
		{
			scope = 'util-project-template-tasks-show'
		}

		if (projectID == undefined)
		{
			projectID = app.get(
			{
				scope: scope,
				context: 'id',
				valueDefault: ''
			});
		}

		if (selector == undefined)
		{
			selector = app.whoami().thisInstanceOfMe._userRole + '-projects-template-summary-tasks-view'
		}

		if (param.status == 'shown')
		{
			if (projectID != undefined && selector != undefined)
			{
				var filters =
				[
					{	
						field: 'project',
						comparison: 'EQUAL_TO',
						value: projectID
					}
				]
	
				app.invoke('util-view-table',
				{
					object: 'project_task',
					container: selector,
					context: 'util-project-template-tasks-show',
					filters: filters,
					options:
					{
						noDataText: '<div class="p-4">There are no project tasks for this template.</div>',
						rows: 20,
						orientation: 'vertical',
						progressive: true,
						class: 'table-condensed fadeInDown',
						showFooter: true
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
								var date = moment(row.startdate, 'D MMM YYYY LT');
								if (date.isValid())
								{
									row.startdate = moment(row.startdate, 'D MMM YYYY LT').format('D MMM YYYY');
								}

								var date = moment(row.enddate, 'D MMM YYYY LT');
								if (date.isValid())
								{
									row.enddate = moment(row.enddate, 'D MMM YYYY LT').format('D MMM YYYY');
								}

								row.info = ''

								if (row.typetext != '')
								{
									row.info = row.info +
										'<div>' + row.typetext + '</div>' +
										'<div class="text-muted small mb-1">Type</div>'
								}

								if (row.prioritytext != '')
								{
									row.info = row.info +
										'<div>' + row.prioritytext + '</div>' +
										'<div class="text-muted small mb-1">Priority</div>'
								}

								row._userRole = utilSetup.userRole;
							}
						},

						columns:
						[
							{
								caption: 'Description',
								field: 'description',
								sortBy: true,
								defaultSort: true,
								class: 'col-sm-6 text-break text-wrap',
								data: 'data-context="{{guid}}" data-id="{{guid}}"'
							},
							{
								caption: 'Info',
								name: 'info',
								sortBy: true,
								class: 'col-sm-6 text-break text-wrap'
							},
							{
								fields:
								[
									'project', 'projecttask.project.description',
									'notes', 'typetext', 'statustext', 'prioritytext',
									'taskbyuser', 'taskbyusertext',
									'startdate', 'enddate', 'percentagecomplete',
									'guid'
								]
							}
						]	
					}
				});
			}			
		}
		else if (param.status == 'hidden')
		{
			app.show('#' + selector, '');
		}
	}
});

/* LINKED ACHIEVEMENTS & SKILLS */

app.add(
{
	name: 'util-project-linked-achievements-show',
	notes: 'Links to setup_contact_attribute (409) created by learning partners',
	code: function (param)
	{	
		var viewStatus = app._util.param.get(param, 'status', {default: 'shown'}).value;

		if (viewStatus == 'shown')
		{
			var context = app._util.param.get(param, 'context').value;

			if (_.isNotSet(context))
			{
				context = app._util.param.get(param.dataContext, 'context').value;
			}

			if (_.isNotSet(context))
			{
				context = 'util-project-linked-achievements-show'
			}

			var selector = app._util.param.get(param.dataContext, 'selector').value;

			if (_.isNotSet(selector))
			{
				selector = context + '-linked-achievements-view'
			}

			var projectID = app.get(
			{
				scope: 'util-project-linked-achievements-show',
				context: 'dataContext',
				name: 'project'
			});

			if (projectID != undefined && selector != undefined)
			{
				var filters =
				[
					{	
						field: 'parentobject',
						value: 1
					},
					{	
						field: 'parentobjectcontext',
						value: projectID
					},
					{	
						field: 'object',
						value: 409
					}
				]
	
				app.invoke('util-view-table',
				{
					object: 'core_object_link',
					container: selector,
					context: 'util-project-linked-achievements',
					filters: filters,
					options:
					{
						noDataText: '<div class="p-4">There are no linked achievements.</div>',
						rows: 20,
						orientation: 'vertical',
						progressive: true,
						class: 'table-condensed',
						deleteConfirm:
						{
							text: 'Are you sure you want to unlink this achievements?',
							position: 'left',
							headerText: 'Remove Project Link',
							buttonText: 'Remove',
							controller: 'util-project-linked-projects-delete-ok'
						},
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
							data: 'data-id="{{id}}" data-context="{{id}}" data-controller="learner-project-summary"',
							class: 'd-flex',
							method: function (row) {}
						},

						columns:
						[
							{
								caption: 'Name',
								field: 'notes',
								defaultSort: true,
								sortBy: true,
								class: 'col-10 text-break text-wrap myds-navigate'
							},
							{
								html: '<button class="btn btn-danger btn-outline btn-sm myds-delete"' +
			               			' id="util-project-linked-projects-delete-{{id}}" data-id="{{id}}">' +
			               				'<i class="fa fa-unlink"></i></button>',
								caption: '&nbsp;',
								class: 'col-2 text-center'
							},
							{
								fields: []
							}
						]	
					}
				});
			}			
		}
		else if (param.status == 'hidden')
		{
			app.show('#' + selector, '');
		}
	}
});

app.add(
{
	name: 'util-project-team-update',
	code: function (param, response)
	{	
		if (response == undefined)
		{
			entityos.cloud.search(
			{
				object: 'project_team',
				fields: ['contactbusiness', 'contactperson'],
				sorts: [{field: 'id', direction: 'desc'}],
				filters: [
				{
					field: 'contactbusiness', comparison: 'IS_NULL',
					field: 'contactperson', value: app.whoami().thisInstanceOfMe.user.contactperson
				}],
				rows: 20,
				callback: 'util-project-team-update'
			});
		}
		else
		{
			_.each(response.data.rows, function (row)
			{
				entityos.cloud.save(
				{
					object: 'project_team',
					data: {id: row.id, contactbusiness: app.whoami().thisInstanceOfMe.user.contactbusiness}
				});
			});	
		}
	}
});

/* ACHIEVEMENT CREATE */

// Generate Achievement with Skills (optional - else just in the description)
// Use linked template to get the skills.gained

app.add(
{
	name: 'util-project-achievement-create',
	code: function (param, response)
	{	
		const projectGUID = app._util.param.get(param, 'guid').value;

		if (response == undefined)
		{
			entityos.cloud.search(
			{
				object: 'project',
				fields: 
				[
					'contactperson', 'contactbusiness', 'projectmanager', 'sourceprojecttemplate', 'parentproject', 'title', 'description'
				],
				filters:
				[
					{
						field: 'guid',
						value: projectGUID
					}
				],
				callback: 'util-project-achievement-create',
				callbackParam: param
			});
		}
		else
		{
			if (response.data.rows.length == 0)
			{ 
				app.notify({type: 'error', message: 'Can not find the project.'})
			}
			else
			{
				_.set(param, 'project', _.first(response.data.rows));

				if (_.isSet(param.project.sourceprojecttemplate) || _.isSet(param.project.parentproject))
				{
					app.invoke('util-project-achievement-create-template-get', param);
				}
				else
				{
					app.invoke('util-project-achievement-create-save', param);
				}
			}
		}
	}
});

app.add(
{
	name: 'util-project-achievement-create-template-get',
	code: function (param, response)
	{	
		let project = app._util.param.get(param, 'project').value;

		if (response == undefined)
		{
			let projectTemplateIDs = [];

			if (_.isSet(project.sourceprojecttemplate))
			{
				projectTemplateIDs.push(project.sourceprojecttemplate)
			}

			if (_.isSet(project.parentproject))
			{
				projectTemplateIDs.push(project.parentproject)
			}

			if (projectTemplateIDs.length == 0)
			{
				app.invoke('util-project-achievement-create-save', param);
			}
			else
			{
				entityos.cloud.search(
				{
					object: 'core_attachment',
					fields: 
					[
						'download',
						'url',
						'filename',
						'title',
						'objectcontext'
					],
					filters:
					[
						{
							field: 'object',
							value: app.whoami().mySetup.objects.project
						},
						{
							field: 'objectcontext',
							comparison: 'IN_LIST',
							value: projectTemplateIDs
						}
					],
					sorts:
					[
						{
							field: 'type',
							direction: 'asc'
						},
						{
							field: 'modifieddate',
							direction: 'desc'
						}
					],
					customOptions:
					[
						{
							name: 'object',
							value: app.whoami().mySetup.objects.project
						}
					],
					callback: 'util-project-achievement-create-template-get',
					callbackParam: param
				});
			}
		}
		else
		{
			if (response.status == 'OK')
			{
				project.files = response.data.rows;

				if (_.isSet(project.parentproject))
				{
					_.each(project.files, function (file)
					{
						file.parent = (file.objectcontext == project.parentproject)
					})
				}

				project.templateFile = _.find(project.files, function (file)
				{
					return (_.includes(file.filename, '.template.') && !file.parent)
				});

				project.templateParentFile = _.find(project.files, function (file)
				{
					return (_.includes(file.filename, '.template.') && file.parent)
				});

				app.set(
				{
					scope: 'util-project-achievement-create',
					context: 'project',
					value: project
				});

				if (_.isSet(project.templateFile) || project.templateParentFile)
				{
					app.invoke('util-project-achievement-create-template-get-file-get', param);
				}
				else
				{
					app.invoke('util-project-achievement-create-save', param);
				}
			}
		}
	}	
});

app.add(
{
	name: 'util-project-achievement-create-template-get-file-get',
	code: function (param, response)
	{
		var onComplete = app._util.param.get(param, 'onComplete', {default: 'util-project-achievement-create-save'}).value;
		var merge = app._util.param.get(param, 'merge', {default: false}).value;
		//todo: if both templateFile & templateParentFile set then get both and merge

		let project = app._util.param.get(param, 'project').value;

		let templateFile = project.templateFile;
		
		if (templateFile == undefined)
		{
			templateFile = project.templateParentFile;
		}

		if (templateFile == undefined)
		{
			app.invoke(onComplete, param);
		}
		else
		{
			if (response == undefined)
			{
				entityos.cloud.invoke(
				{
					method: 'core_file_read',
					data:
					{
						id: templateFile.id,
						dataonly: 'Y'
					},
					callback: 'util-project-achievement-create-template-get-file-get',
					callbackParam: param
				});
			}
			else
			{
				project._file = response;
				_.set(param, '_file', project._file);

				app.set(
				{
					scope: 'util-project-achievement-create',
					context: 'project',
					value: project
				});

				app.invoke('util-project-achievement-create-save', param);
			}
		}
	}
});

app.add(
{
	name: 'util-project-achievement-create-save',
	code: function (param, response)
	{	
		var project = app.get(
		{
			scope: 'util-project-achievement-create',
			context: 'project'
		});

		// Skills inclusion: 1: None, 2: In Text: 3: Text & Linked
		// If not 1, Need to get skills from the project template

		if (_.isUndefined(response))
		{	
			project._templateDefinition = _.get(project, '_file.template.definition');
			
			project.skills = _.get(project._templateDefinition, 'skills.gained', []);

			project.subject = project.title;

			if (_.isNotSet(project.subject))
			{
				project.subject = project.description;
			}

			project.subject = 'Achievement For ' + _.truncate(project.subject, {length: 800});

			var actionData =
			{
				type: app.whoami().mySetup.actionTypes.achievement,
				billingstatus: app.whoami().mySetup.actionBillingStatuses.availableForBilling,
				status: app.whoami().mySetup.actionStatuses.completed,
				contactperson: project.contactperson,
				contactbusiness: project.contactbusiness,
				date: moment().format('D MMM YYYY'),
				completed: moment().format('D MMM YYYY'),
				by: project.projectmanager,
				object: app.whoami().mySetup.objects.project,
				objectcontext: project.id,
				subject: project.subject
			}

			if (project.skills.length != 0)
			{
				actionData.description = 'Skills; ' + _.join(_.map(project.skills, 'name'), ' &bull; ')
			}
			
			entityos.cloud.save(
			{
				object: 'action',
				data: actionData,
				callback: 'util-project-achievement-create-save',
				callbackParam: param
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				_.set(project, 'actionID', response.id);

				app.set(
				{
					scope: 'util-project-achievement-create',
					context: 'project',
					value: project
				});

				const linkSkills = _.get(param, 'linkSkills', true);

				if (linkSkills)
				{
					app.invoke('util-project-achievement-create-skills', param);
				}
				else
				{
					app.invoke('util-project-achievement-create-skills-complete', param);
				}
			}
		}
	}
});

app.add(
{
	name: 'util-project-achievement-create-skills',
	notes: 'Map the template skills to registered skills',
	code: function (param, response)
	{
		let project = app.get(
		{
			scope: 'util-project-achievement-create',
			context: 'project'
		});

		if (response == undefined)
		{
			let filters = []

			const skillsURIs = _.map(project.skills, 'uri');

			if (skillsURIs.length != 0)
			{
				filters.push(
				{
					field: 'url',
					comparison: 'IN_LIST',
					value: skillsURIs
				});
			}

			const skillSDIs = _.map(project.skills, 'sdi');

			if (skillSDIs.length != 0)
			{
				if (filters.length != 0)
				{
					filters.push(
					{
						name: 'or'
					});
				}

				filters.push(
				{
					field: 'guid',
					comparison: 'IN_LIST',
					value: skillSDIs
				});
			}

			if (filters.length == 0)
			{
				app.invoke('util-project-achievement-create-skills-complete', param);
			}
			else
			{
				entityos.cloud.search(
				{
					object: 'setup_contact_attribute',
					fields: 
					[
						'title'
					],
					filters: filters,
					callback: 'util-project-achievement-create-skills',
					callbackParam: param
				});
			}
		}
		else
		{
			if (response.data.rows.length == 0)
			{
				app.invoke('util-project-achievement-create-skills-complete', param);
			}
			else
			{
				app.set(
				{
					scope: 'util-project-achievement-create',
					context: 'skills-template-attributes',
					value: response.data.rows
				});

				app.invoke('util-project-achievement-create-skills-contactperson');
			}
		}
	}
});

app.add(
{
	name: 'util-project-achievement-create-skills-contactperson',
	notes: 'Does the conactperson (learner) already have the attribute (i.e. stop duplication)',
	code: function (param, response)
	{
		let project = app.get(
		{
			scope: 'util-project-achievement-create',
			context: 'project'
		});

		if (response == undefined)
		{
			entityos.cloud.search(
			{
				object: 'contact_attribute',
				fields: 
				[
					'attribute'
				],
				filters:
				[
					{
						field: 'contactperson',
						value: project.contactperson
					}
				],
				callback: 'util-project-achievement-create-skills-contactperson',
				callbackParam: param
			});
		}
		else
		{
			const skillsContactPersonAttributes = app.set(
			{
				scope: 'util-project-achievement-create',
				context: 'skills-contactperson-attributes',
				value: response.data.rows
			});

			let skillsTemplateAttributes = app.get(
			{
				scope: 'util-project-achievement-create',
				context: 'skills-template-attributes'
			});

			_.each(skillsTemplateAttributes, function (attribute)
			{
				attribute._contactPersonAttribute = _.find(skillsContactPersonAttributes, function(contactPersonAttribute)
				{
					return (contactPersonAttribute.attribute == attribute.id)
				})

				attribute.exists = !_.isUndefined(attribute._contactPersonAttribute);
			});

			let skillsTemplateAttributesToAdd = skillsTemplateAttributes;

			app.set(
			{
				scope: 'util-project-achievement-create',
				context: 'skills-template-attributes-to-add',
				value: skillsTemplateAttributesToAdd
			});

			if (skillsTemplateAttributesToAdd.length == 0)
			{
				app.invoke('util-project-achievement-create-skills-complete', param);
			}
			else
			{
				app.set(
				{
					scope: 'util-project-achievement-create',
					context: 'skills-template-attributes-to-add-index',
					value: 0
				});

				app.invoke('util-project-achievement-create-skills-process');
			}
		}
	}
});

app.add(
{
	name: 'util-project-achievement-create-skills-process',
	code: function (param)
	{
		let data = app.get(
		{
			scope: 'util-project-achievement-create'
		});

		const project = data.project;

		let skillsTemplateAttributesToAdd = data['skills-template-attributes-to-add'];
		let skillsTemplateAttributesToAddIndex = data['skills-template-attributes-to-add-index'];

		if (skillsTemplateAttributesToAddIndex < skillsTemplateAttributesToAdd.length)
		{
			const skillsTemplateAttributeToAdd = skillsTemplateAttributesToAdd[skillsTemplateAttributesToAddIndex];

			if (!skillsTemplateAttributeToAdd.exists)
			{
				entityos.cloud.save(
				{
					object: 'contact_attribute',
					data:
					{
						attribute: skillsTemplateAttributeToAdd.id,
						contactperson: project.contactperson,
						startdate: moment().format('D MMM YYYY')
					},
					callback: 'util-project-achievement-create-skills-process-link'
				});
			}
			else
			{
				app.invoke('util-project-achievement-create-skills-process-link', {},
				{
					id: skillsTemplateAttributeToAdd._contactPersonAttribute.id
				});
			}
		}
		else
		{
			app.invoke('util-project-achievement-create-skills-finalise');
		}
	}
});

app.add(
{
	name: 'util-project-achievement-create-skills-process-link',
	code: function (param, response)
	{
		const contactAttributeID = response.id;

		const project = app.get(
		{
			scope: 'util-project-achievement-create',
			context: 'project'
		});

		const achievementActionID = project.actionID;

		const data = app.get(
		{
			scope: 'util-project-achievement-create'
		});

		let skillsTemplateAttributesToAdd = data['skills-template-attributes-to-add'];
		let skillsTemplateAttributesToAddIndex = data['skills-template-attributes-to-add-index'];

		const skillsTemplateAttributeToAdd = skillsTemplateAttributesToAdd[skillsTemplateAttributesToAddIndex];

		entityos.cloud.save(
		{
			object: 'core_object_link',
			data:
			{
				object: app.whoami().mySetup.objects.contactAttribute,
				objectcontext: contactAttributeID,
				parentobject: app.whoami().mySetup.objects.action,
				parentobjectcontext: achievementActionID,
				notes: skillsTemplateAttributeToAdd['id'] + ':' + skillsTemplateAttributeToAdd['guid'] + ':' + skillsTemplateAttributeToAdd['title']
			},
			callback: 'util-project-achievement-create-skills-process-next'
		}); 
	}
});

app.add(
{
	name: 'util-project-achievement-create-skills-process-next',
	code: function (param, response)
	{
		app.set(
		{
			scope: 'util-project-achievement-create',
			context: 'skills-template-attributes-to-add-index',
			value: function (value) { return numeral(value).value() + 1 }
		});

		app.invoke('util-project-achievement-create-skills-process');
	}
});

app.add(
{
	name: 'util-project-achievement-create-skills-finalise',
	code: function (param, response)
	{	
		const project = app.get(
		{
			scope: 'util-project-achievement-create',
			context: 'project'
		});

		const achievementActionID = project.actionID;

		if (response == undefined)
		{
			entityos.cloud.search(
			{
				object: 'core_object_link',
				fields: 
				[
					'objectcontext',
					'createddate', 'modifieddate',
					'guid', 'notes', 'objectlink.createduser.guid', 'createdusertext',
					'objectlink.modifieduser.guid', 'modifiedusertext'
				],
				filters:
				[
					{
						field: 'object',
						value: app.whoami().mySetup.objects.contactAttribute
					},
					{
						field: 'parentobject',
						value: app.whoami().mySetup.objects.action
					},
					{
						field: 'parentobjectcontext',
						value:achievementActionID
					}
				],
				callback: 'util-project-achievement-create-skills-finalise',
				callbackParam: param
			});
		}
		else
		{
			var skills = _.map(response.data.rows, function (row)
			{
				return {
					createddate: row.createddate,
					createdusertext: row.createdusertext,
					createduserguid: row['objectlink.createduser.guid'],
					modifieddate: row.modifieddate,
					modifiedusertext: row.modifiedusertext,
					modifieduserguid: row['objectlink.modifieduser.guid'],
					guid: _.split(row['notes'], ':')[1],
					skill: _.first(_.split(row['notes'], ':')),
					skilltext: _.last(_.split(row['notes'], ':')),
				}
			});

			var data =
			{
				id: achievementActionID,
				text: JSON.stringify(skills)
			}

			entityos.cloud.save(
			{
				object: 'action',
				data: data,
				callback: 'util-project-achievement-create-skills-complete',
			});
		}
	}
});

app.add(
{
	name: 'util-project-achievement-create-skills-complete',
	code: function (param)
	{
		app.invoke('util-view-spinner-remove-all');

		app.notify({message: 'Achievement has been created.'});

		const project = app.get(
		{
			scope: 'util-project-achievement-create',
			context: 'project'
		});

		const button = $('[data-controller="learning-partner-connections-dashboard-learning-verify-create-achievement"][data-guid="' + project.guid + '"]');
		button.parent('div').html('<div class="text-success">Achievement Created</div>');
		$('button[data-guid="' + project.guid + '"]').parent().html('');
	}
});


