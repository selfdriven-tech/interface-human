/*
	{
    	title: "Learning Partner; Setup", 	
    	design: ""
  	}
*/

// --- SETUP; PROJECT TEMPLATES

app.add(
{
	name: 'learning-partner-setup-project-templates',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-setup-project-templates',
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
			filters.push(
			{	
				field: 'description',
				comparison: 'TEXT_IS_LIKE',
				value: data.search
			});
		}

		app.invoke('util-view-table',
		{
			object: 'project',
			container: 'learning-partner-setup-project-templates-view',
			context: 'learning-partner-setup-project-templates',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">There are no project templates that match this search.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this project template?',
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
					class: 'd-flex'
				},

				columns:
				[
					{
						caption: 'Name',
						field: 'description', 	
						sortBy: true,
						defaultSort: true,
						class: 'col-9 myds-navigate',
						data: 'data-context="{{guid}}" data-controller="learning-partner-setup-project-template-summary"'
					},
					{
						caption: 'Reference',
						field: 'reference', 	
						sortBy: true,
						class: 'col-3 myds-navigate text-muted',
						data: 'data-context="{{guid}}" data-controller="learning-partner-setup-project-template-summary"'
					},
					{	
						fields:
						['guid', 'type', 'typetext', 'subtype', 'subtypetext', 'contactbusinesstext', 'contactpersontext']
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'learning-partner-setup-project-template-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'learning-partner-setup-project-template-summary',
			context: 'context'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'learning-partner-setup-project-templates'});
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
						'description',
						'notes',
						'guid',
						'reference',
						'type',
						'typetext',
						'category',
						'categorytext',
						'restrictedtoteam',
						'contactbusinesstext',
						'contactbusiness',
						'contactpersontext',
						'contactperson'
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
						scope: 'learning-partner-setup-project-templates',
						context: 'all'
					},
					callback: 'learning-partner-setup-project-template-summary'
				});
			}
			else
			{
				if (response.status == 'OK')
				{
					if (response.data.rows.length == 0)
					{
						app.notify({type: 'error', message: 'Can not find this project template'});
						app.invoke('app-navigate-to', {controller: 'learning-partner-setup-project-templates'});
					}
					else
					{
						var data = app.set(
						{
							scope: 'learning-partner-setup-project-template-summary',
							context: 'dataContext',
							value: _.first(response.data.rows)
						});

						data.notes = _.unescape(data.notes);

						app.view.refresh(
						{
							scope: 'learning-partner-setup-project-template-summary',
							selector: '#learning-partner-setup-project-template-summary',
							data: data,
							collapse:
							{
								contexts: ['projects', 'attachments', 'tasks']
							}
						});

						app.invoke('util-attachments-initialise',
						{
							context: 'learning-partner-setup-project-template-summary',
							object: app.whoami().mySetup.objects.project,
							objectContext: data.id,
							showTypes: false,
							collapsible: false,
							showUUID: true
						});
					}
				}
			}
		}
	}	
});

app.add(
{
	name: 'learning-partner-setup-project-template-edit',
	code: function (param, response)
	{	
		var data = app.get(
		{
			scope: 'learning-partner-setup-project-template-summary',
			context: 'dataContext',
			valueDefault:
			{
				id: '',
				refererence: '',
				description: '',
				typetext: '',
				categorytext: '',
				milestone: 'N'
			}
		});

		app.refresh(
		{
			scope: 'learning-partner-setup-project-template-edit',
			selector: '#learning-partner-setup-project-template-edit',
			data: data
		});

		app.invoke('util-view-editor',
		{
			selector: '#learning-partner-setup-project-template-edit-notes-' + data.id,
			height: '400px',
			content: data.notes
		});

		app.invoke('util-view-select',
		{
			container: 'learning-partner-setup-project-template-edit-type-' + data.id,
			object: 'setup_project_type',
			fields: [{name: 'title'}]
		});

		app.invoke('util-view-select',
		{
			container: 'learning-partner-setup-project-template-edit-category-' + data.id,
			object: 'setup_project_category',
			fields: [{name: 'title'}]
		});
	}	
});

app.add(
{
	name: 'learning-partner-setup-project-template-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learning-partner-setup-project-template-edit',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'learning-partner-setup-project-template-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values:
				{
					template: 'Y',
					contactbusiness: app.whoami().thisInstanceOfMe.user.contactbusiness,
					datareturn: 'reference,typetext'
				}
			}
		});

		if (_.isUndefined(response))
		{		
			mydigitalstructure.cloud.save(
			{
				object: 'project',
				data: data,
				callback: 'learning-partner-setup-project-template-edit-save',
				set: {scope: 'learning-partner-setup-project-template-edit-edit', data: true, guid: true},
				notify: 'Project template has been ' + (id==''?'added':'updated') + '.'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				if (id=='' && _.has(response, 'data'))
				{
					app.invoke('learning-partner-setup-project-template-edit-save-reference', param, response)
				}
				else
				{
					app.invoke('learning-partner-setup-project-template-edit-save-finalise')
				}
			}
		}
	}
});

app.add(
{
	name: 'learning-partner-setup-project-template-edit-save-reference',
	code: function (param, response)
	{	
		if (response != undefined)
		{
			var data =
			{
				id: response.id
			}

			var dataReturn = _.first(response.data.rows);
						
			data.reference = _.replace(dataReturn.reference, 'PRJ00', 'T-' + _.first(dataReturn.typetext));

			mydigitalstructure.cloud.save(
			{
				object: 'project',
				data: data,
				callback: 'learning-partner-setup-project-template-edit-save-finalise',
				set: {scope: 'learning-partner-setup-project-template-edit'}
			});
		}
	}
});

app.add(
{
	name: 'learning-partner-setup-project-template-edit-save-finalise',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learning-partner-setup-project-template-edit',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'learning-partner-setup-project-template-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values: {datareturn: 'reference'}
			}
		});

		app.notify({message: 'Project template has been ' + (id==''?'added':'updated') + '.'});

		app.invoke('util-view-refresh',
		{
			dataScope: 'learning-partner-setup-project-templates',
			data: data
		});

		app.invoke('app-navigate-to', {controller: 'learning-partner-setup-project-template-summary', context: data.guid});
	}
});

app.add(
{
	name: 'learning-partner-setup-project-template-summary-task-edit',
	code: function (param)
	{	
		var projectID = app.get({scope: 'learning-partner-setup-project-template-summary-task-edit', context: 'dataContext'});

		var filters =
		[
			{
				field: 'project',
				value: projectID
			}
		];

		/* app.invoke('util-view-select',
		{
			container: context + '-task-edit-taskbyuser',
			object: 'project_team',
			fields:
			[
				{name: 'projectteam.contactperson.firstname'},
				{name: 'projectteam.contactperson.surname'},
				{name: 'projectteam.contactperson.user.id', hidden: true}
			],
			idField: 'projectteam.contactperson.user.id',
			filters: filters
		}); */

		//add projectType to project task type and filter by if set - may be
		app.invoke('util-view-select',
		{
			container: 'learning-partner-setup-project-template-summary-task-edit-type',
			object: 'setup_project_task_type',
			fields: [{name: 'title'}]
		});
	}
});

app.add(
{
	name: 'learning-partner-setup-project-template-summary-task-edit-save',
	code: function (param, response)
	{	
		var projectID = app.get(
		{
			scope: 'learning-partner-setup-project-template-summary-task-edit',
			context: 'dataContext',
			name: 'project'
		});

		var id = '';

		/*var id = app.get(
		{
			controller: context + '-show',
			context: 'id',
			valueDefault: ''
		});
		*/
	
		var data = app.get(
		{
			controller: 'learning-partner-setup-project-template-summary-task-edit-' + id,
			cleanForCloudStorage: true,
			valueDefault: {}
		});

		if (id == '')
		{
			data.project = projectID;
		}
		else
		{
			data.id = id;
		}

		if (_.isUndefined(response))
		{
			mydigitalstructure.update(
			{
				object: 'project_task',
				data: data,
				callback: 'learning-partner-setup-project-template-summary-task-edit-save',
				callbackParam: param
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Task added to the project template.');
				app.invoke('util-view-collapse', {context: 'learning-partner-setup-project-template-summary-task-edit'});
				app.invoke('learning-partner-setup-project-template-summary-tasks-show', {status: 'shown'})
			}
		}
	}
});

app.add(
{
	name: 'learning-partner-setup-project-template-summary-tasks-show',
	code: function (param, response)
	{	
		var projectID = app._util.param.get(param.dataContext, 'project').value;
		var scope = app._util.param.get(param.dataContext, 'scope').value;
		var context = app._util.param.get(param.dataContext, 'context').value;
		var selector = app._util.param.get(param.dataContext, 'selector',
				{ default: 'learning-partner-setup-project-template-summary-tasks-view'}).value;

		if (scope == undefined)
		{
			scope = context
		}

		if (scope == undefined)
		{
			scope = 'learning-partner-setup-project-template-summary-tasks-show'
		}

		if (projectID == undefined)
		{
			projectID = app.get(
			{
				scope: 'learning-partner-setup-project-template-summary',
				context: 'dataContext',
				name: 'id',
				valueDefault: ''
			});
		}

		if (param.status == undefined)
		{
			param.status = 'shown'
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

				var data = app.get(
				{
					scope: 'learning-partner-setup-project-template-summary-tasks-show',
					valueDefault: {}
				});

				if (_.isSet(data.search))
				{
					filters.push(
					{	
						field: 'title',
						comparison: 'TEXT_IS_LIKE',
						value: data.search
					});
				}
	
				app.invoke('util-view-table',
				{
					object: 'project_task',
					container: selector,
					context: 'learning-partner-setup-project-template-summary-tasks',
					filters: filters,
					options:
					{
						noDataText: '<div class="p-4">There are no project template tasks.</div>',
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
							controller: 'learning-partner-setup-project-template-summary-task-delete-ok'
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

								row._userRole = app.whoami().thisInstanceOfMe._userRole;

								row.tasktitle = row.title;
								if (row.tasktitle == '')
								{
									row.tasktitle = _.truncate(row.description, 100)
								}
							}
						},

						columns:
						[
							{
								caption: 'Subject',
								name: 'tasktitle',
								class: 'col-4 text-break text-wrap myds-navigate',
								data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="learning-partner-setup-project-template-task-summary"'
							},
							{
								caption: 'Info',
								name: 'info',
								sortBy: true,
								class: 'col-5 text-break text-wrap'
							},
							{
								caption: 'Sequence',
								field: 'displayorder',
								sortBy: true,
								defaultSort: true,
								class: 'col-2 text-break text-wrap myds-navigate text-center',
								data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="learning-partner-setup-project-template-task-summary"'
							},
							{
								html: '<button class="btn btn-danger btn-outline btn-sm myds-delete"' +
									   ' id="learning-partner-setup-project-template-summary-task-delete-{{id}}" data-id="{{id}}">' +
										   '<i class="fa fa-unlink"></i></button>',
								caption: '&nbsp;',
								class: 'col-1 text-center'
							},
							{
								fields:
								[
									'project', 'projecttask.project.description',
									'notes', 'typetext', 'statustext', 'prioritytext',
									'guid', 'reference', 'title', 'description', 'displayorder'
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
	name: 'learning-partner-setup-project-template-summary-task-delete-ok',
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
					callback: 'learning-partner-setup-project-template-summary-task-delete-ok'
				});
			}	
		}
		else
		{
			if (response.status == 'OK')
			{
				app.notify('Task deleted from project template.');
				app.invoke('learning-partner-setup-project-template-summary-tasks-show', {status: 'shown'});
			}
			else if (response.status == 'ER')
			{
				app.notify('Task can not be removed from this project template. (' + response.error.errornotes + ')');
			}
		}
	}
});

app.add(
{
	name: 'learning-partner-setup-project-template-task-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'learning-partner-setup-project-template-task-summary',
			context: 'context'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'learning-partner-setup-project-templates'});
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
						'title', 'description', 'displayorder',
						'project', 'projecttask.project.description',
						'projecttask.project.guid',
						'notes', 'type', 'typetext',
						'status', 'statustext',
						'priority', 'prioritytext',
						'milestone',
						'guid'
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
						scope: 'learning-partner-setup-project-template-tasks',
						context: 'all'
					},
					callback: 'learning-partner-setup-project-template-task-summary'
				});
			}
			else
			{
				if (response.status == 'OK')
				{
					if (response.data.rows.length == 0)
					{
						app.notify({type: 'error', message: 'Can not find this project template task'});
						app.invoke('app-navigate-to', {controller: 'learning-partner-setup-project-templates'});
					}
					else
					{
						var data = app.set(
						{
							scope: 'learning-partner-setup-project-template-task-summary',
							context: 'dataContext',
							value: _.first(response.data.rows)
						});

						app.view.refresh(
						{
							scope: 'learning-partner-setup-project-template-task-summary',
							selector: '#learning-partner-setup-project-template-task-summary',
							data: data,
							collapse:
							{
								contexts: ['attachments']
							}
						});

						app.invoke('util-attachments-initialise',
						{
							context: 'learning-partner-setup-project-template-task-summary',
							object: app.whoami().mySetup.objects.projectTask,
							objectContext: data.id,
							showTypes: false,
							collapsible: false
						});
					}
				}
			}
		}
	}	
});

app.add(
{
	name: 'learning-partner-setup-project-template-task-edit',
	code: function (param, response)
	{	
		var data = app.get(
		{
			scope: 'learning-partner-setup-project-template-task-summary',
			context: 'dataContext',
			valueDefault:
			{
				id: '',
				refererence: '',
				description: '',
				typetext: '',
				type: ''
			}
		});

		app.refresh(
		{
			scope: 'learning-partner-setup-project-template-task-edit',
			selector: '#learning-partner-setup-project-template-task-edit',
			data: data
		});

		app.invoke('util-view-select',
		{
			container: 'learning-partner-setup-project-template-task-edit-type-' + data.id,
			object: 'setup_project_task_type',
			fields: [{name: 'title'}]
		});

		app.invoke('util-view-select',
		{
			container: 'learning-partner-setup-project-template-task-edit-milestone-' + data.id,
			hideSearch: true,
			data:
			[
				{
					id: 'Y',
					text: 'Yes'
				},
				{
					id: 'N',
					text: 'No'
				}
			]
		});

		//text editor

		app.invoke('util-view-editor',
		{
			selector: '#learning-partner-setup-project-template-task-edit-notes-' + data.id,
			height: '600px',
			content: data.notes
		});
	}	
});
	
app.add(
{
	name: 'learning-partner-setup-project-template-task-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learning-partner-setup-project-template-task-edit',
			context: 'id',
			valueDefault: ''
		});
	
		if (_.isUndefined(response))
		{	
			var data = app.get(
			{
				scope: 'learning-partner-setup-project-template-task-edit-' + id,
				cleanForCloudStorage: true,
				mergeDefault:
				{
					id: id,
					values: {}
				}
			});
			
			mydigitalstructure.cloud.save(
			{
				object: 'project_task',
				data: data,
				callback: 'learning-partner-setup-project-template-task-edit-save',
				set: {scope: 'learning-partner-setup-project-template-task-edit', data: true, guid: true}
			});
		}
		else
		{	
			app.notify({message: 'Project template task has been ' + (id==''?'added':'updated') + '.'});
			app.invoke('app-navigate-to', {controller: 'learning-partner-setup-project-template-task-summary', context: response.guid});
		}
	}
});


//-- LINKED PROJECTS

app.add(
{
	name: 'learning-partner-setup-project-template-summary-projects-show',
	code: function (param, response)
	{	
		var projectID = app._util.param.get(param.dataContext, 'project').value;
		var scope = app._util.param.get(param.dataContext, 'scope').value;
		var context = app._util.param.get(param.dataContext, 'context').value;
		var selector = app._util.param.get(param.dataContext, 'selector').value;

		if (scope == undefined)
		{
			scope = context
		}

		if (scope == undefined)
		{
			scope = 'learning-partner-setup-project-template-summary'
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
			selector = scope + '-projects-view'
		}

		if (param.status == 'shown')
		{
			if (projectID != undefined && selector != undefined)
			{
				var filters =
				[
					{	
						field: 'sourceprojecttemplate',
						comparison: 'EQUAL_TO',
						value: projectID
					}
				]
	
				app.invoke('util-view-table',
				{
					object: 'project',
					container: selector,
					context: 'util-project-linked-projects',
					filters: filters,
					options:
					{
						noDataText: '<div class="pt-4">There are no projects based on this template.</p>',
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
							controller: 'learning-partner-setup-project-template-summary-projects-delete-ok'
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
							data: 'data-id="{{guid}}" data-context="{{guid}}" data-controller="learning-partner-project-summary"',
							class: 'd-flex',
							method: function (row) {}
						},

						columns:
						[
							{
								caption: 'Description',
								field: 'description',
								defaultSort: true,
								sortBy: true,
								class: 'col-4 text-break text-wrap myds-navigate'
							},
							{
								caption: 'Created By',
								field: 'createdusertext',
								sortBy: true,
								class: 'col-5 myds-navigate'
							},
							{
								caption: 'Created Date',
								field: 'createddate',
								sortBy: true,
								class: 'col-3 myds-navigate'
							},
							{
								fields: ['guid']
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

// PROJECT INFORMATION

app.add(
{
	name: 'learning-partner-setup-project-template-summary-information-show',
	code: function (param, response)
	{
		// Set the project template and get the files.

		var projectTemplate = app.get(
		{
			scope: 'learning-partner-setup-project-template-summary',
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
				customOptions: [{name: 'object', value: app.whoami().mySetup.objects.project}],
				rows: 1,
				callback: 'learning-partner-setup-project-template-summary-information-show'
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
				containerSelector: '#learning-partner-community-project-summary-information-view'
			});
		}
	}
});

app.add(
{
	name: 'learning-partner-setup-project-template-summary-information-edit',
	code: function (param)
	{
		param = app._util.param.set(param, 'template', app.get(
		{
			scope: 'learning-partner-setup-project-template-summary',
			context: 'dataContext'
		}));

		param = app._util.param.set(param, 'containerSelector', 'learning-partner-community-project-summary-information-edit');
		app.invoke('util-template-setup-edit', param);
	}
});