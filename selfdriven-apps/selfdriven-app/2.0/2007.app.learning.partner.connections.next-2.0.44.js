/*
	{
    	title: "Learning Partner; Connections; Next Steps; Applications (Management Projects)", 	
    	design: "https://www.selfdriven.foundation/design"
  	}
*/

app.add(
{
	name: 'learning-partner-connections-next',
	code: function (param, response)
	{
		app.invoke('learning-partner-connections-next-dashboard')
	}
});

app.add(
{
	name: 'learning-partner-connections-next-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-connections-next-dashboard',
			valueDefault: {}
		});

		var filters =
		[
			{
				field: 'restrictedtoteam',
				value: 'Y'
			},
			{
				field: 'type',
				value: app.whoami().mySetup.projectTypes.management
			},
			{
				field: 'subtype',
				value: app.whoami().mySetup.projectSubTypes.managementNextSteps
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
				},
				{
					name: 'or'
				},
				{	
					field: 'contactpersontext',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				}
			]);
		}

		app.invoke('util-view-table',
		{
			object: 'project',
			container: 'learning-partner-connections-next-dashboard-view',
			context: 'learning-partner-connections-next',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4 text-secondary">There are no applications that match this search.</div>',
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
						row.startdate = app.invoke('util-view-date-clean', row.startdate);
					}
				},

				columns:
				[
					{
						caption: 'By',
						field: 'contactpersontext',
						defaultSort: true,
						sortBy: true,
						class: 'col-4 col-sm-2 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="learning-partner-connections-next-summary"'
					},
					{
						caption: 'Description',
						field: 'description',
						defaultSort: true,
						sortBy: true,
						class: 'col-0 col-4 d-none d-sm-block myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="learning-partner-connections-next-summary"'
					},
					{
						caption: 'Last Updated',
						field: 'modifieddate', 	
						sortBy: true,
						class: 'col-4 myds-navigate text-center',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="learning-partner-connections-next-summary"'
					},
					{
						caption: 'Status',
						field: 'statustext', 	
						sortBy: true,
						class: 'col-4 col-sm-2 myds-navigate text-center',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="learning-partner-connections-next-summary"'
					},
					{	
						fields:
						[
							'type', 'notes', 'guid', 'typetext', 'category', 
							'parentproject', 'parentprojecttext', 'projectmanager', 'restrictedtoteam',
							'project.parentproject.description', 'status'
						]
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'learning-partner-connections-next-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'learning-partner-connections-next-summary',
			context: 'id'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'learning-partner-connections-next'});
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
						'guid', 'status', 'statustext', 'contactperson', 'createduser',
						'createdusertext', 'contactperson', 'contactpersontext', 'modifieddate'
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
						scope: 'learner-project-next',
						context: 'all'
					},
					callback: 'learning-partner-connections-next-summary'
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
						data.startdate = app.invoke('util-view-date-clean', data.startdate);

						app.set(
						{
							scope: 'learning-partner-connections-next-summary',
							context: 'dataContext',
							value: data
						});

						app.view.refresh(
						{
							scope: 'learning-partner-connections-next-summary',
							selector: '#learning-partner-connections-next-summary',
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

						app.invoke('learning-partner-next-share-off-chain');
					}
				}
			}
		}
	}	
});

app.add(
{
	name: 'learning-partner-next-share-off-chain',
	code: function (param, response)
	{	
		var nextStepsSummary = app.get(
		{
			scope: 'learning-partner-connections-next-summary',
			context: 'dataContext'
		})

		app.set(
		{
			scope: 'learning-partner-next-share-off-chain',
			context: 'application',
			value: nextStepsSummary
		});

		app.invoke('learning-partner-next-share-off-chain-source-template');			
	}
});

app.add(
{
	name: 'learning-partner-next-share-off-chain-source-template',
	code: function (param, response)
	{	
		var nextStepsApplication = app.get(
		{
			scope: 'learning-partner-next-share-off-chain',
			context: 'application'
		});

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
						value: nextStepsApplication.sourceprojecttemplate
					}
				],
				callback: 'learning-partner-next-share-off-chain-source-template'
			});
		}
		else
		{
			if (response.status == 'OK')
			{
				var sourceTemplateView = app.vq.init({queue: 'learning-partner-next-share-off-chain-source-template'});
			
				if (response.data.rows.length != 0)
				{
					var sourceTemplate = _.first(response.data.rows);

					nextStepsApplication._sourceprojecttemplate = sourceTemplate;
					nextStepsApplication.sourceprojecttemplatedescription = sourceTemplate.description;

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
						'<div id="learning-partner-next-share-off-chain-source-template-view-files"></div>'
					]);

					sourceTemplateView.add(
					[
						'</div>'
					]);
				}
			}

			nextStepsApplication.templateInfo = sourceTemplateView.get();

			app.set(
			{
				scope: 'learning-partner-next-share-off-chain',
				context: 'application',
				value: nextStepsApplication
			});

			app.invoke('learning-partner-next-share-off-chain-source-template-files');
		}
	}	
});

app.add(
{
	name: 'learning-partner-next-share-off-chain-source-template-files',
	code: function (param, response)
	{	
		var nextStepsApplication = app.get(
		{
			scope: 'learning-partner-next-share-off-chain',
			context: 'application',
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
						value: nextStepsApplication.sourceprojecttemplate
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
				callback: 'learning-partner-next-share-off-chain-source-template-files'
			});
		}
		else
		{
			if (response.status == 'OK')
			{
				nextStepsApplication.moreinformation = '';
				nextStepsApplication.files = response.data.rows;
				nextStepsApplication.templateFile = _.find(nextStepsApplication.files, function (file)
				{
					return _.includes(file.filename, 'selfdriven.template.next.steps')
				});

				app.set(
				{
					scope: 'learning-partner-next-share-off-chain',
					context: 'application',
					value: nextStepsApplication
				});

				if (_.isSet(nextStepsApplication.templateFile))
				{
					app.invoke('learning-partner-next-share-off-chain-source-template-file-get')
				}
				else
				{
					app.invoke('learning-partner-next-share-off-chain-show');
				}
			}
		}
	}	
});
	
app.add(
{
	name: 'learning-partner-next-share-off-chain-source-template-file-get',
	code: function (param, response)
	{
		//CORE_FILE_READ

		var nextStepsApplication = app.get(
		{
			scope: 'learning-partner-next-share-off-chain',
			context: 'application'
		});

		if (response == undefined)
		{
			mydigitalstructure.cloud.invoke(
			{
				method: 'core_file_read',
				data:
				{
					id: nextStepsApplication.templateFile.id,
					dataonly: 'Y'
				},
				callback: 'learning-partner-next-share-off-chain-source-template-file-get'
			});
		}
		else
		{
			nextStepsApplication._file = response;

			app.set(
			{
				scope: 'learning-partner-next-share-off-chain',
				context: 'application',
				value: nextStepsApplication
			});

			if (_.has(nextStepsApplication, '_file.template.nextsteps.url'))
			{
				nextStepsApplication.moreinformation = 
						'<a href="' + nextStepsApplication._file.template.nextsteps.url + '" target="_blank">More Information...</a>'
			}

			app.invoke('learning-partner-next-share-off-chain-show');
		}
	}
});

app.add(
{
	name: 'learning-partner-next-share-off-chain-show',
	code: function (param, response)
	{	
		var nextStepsApplication = app.get(
		{
			scope: 'learning-partner-next-share-off-chain',
			context: 'application'
		});

		var nextStepsApplicationsView = app.vq.init({queue: 'learning-partner-next-share-off-chain'});

		if (_.isNotSet(nextStepsApplication))
		{
			nextStepsApplicationsView.add(
			[
				'<div class="card mt-4">',
					'<div class="card-body pb-3 text-center">',
						'<h3 class="mb-1">Create Application</h3>',
						'<div class="text-muted mt-3">',
							'You can now create a generic application for a learner.',
						'</div>',
					'</div>',
					'<div class="d-none card-body pt-0">',
						'<div class="text-center mt-2">',
							'<button class="btn btn-default btn-outline myds-click" data-controller="learning-partner-next-share-off-chain-application-edit-save" id="learning-partner-next-share-off-chain-application-edit-create" data-context="{{guid}}" data-id="{{guid}}">Create</button>',
						'</div>',
					'</div>',
				'</div>'
			]);
		}
		else
		{
			nextStepsApplicationsView.add(
			[
				'<ul class="nav nav-tabs myds-tab">',
					'<li class="nav-item d-none">',
						'<a href="#learning-partner-next-share-off-chain-application-overview" data-toggle="tab" class="nav-link" data-controller="learning-partner-next-share-off-chain-application-overview">',
							'Application',
						'</a>',
					'</li>',
					'<li class="nav-item d-none">',
						'<a href="#learning-partner-next-share-off-chain-application-information" data-toggle="tab" class="nav-link active" data-controller="learning-partner-next-share-off-chain-application-information">',
							'Information',
						'</a>',
					'</li>',
					'<li class="nav-item">',
						'<a href="#learning-partner-next-share-off-chain-application-skills" data-toggle="tab" class="nav-link active" data-controller="learning-partner-next-share-off-chain-application-skills">',
							'Skills Required',
						'</a>',
					'</li>',
					'<li class="nav-item d-none">',
						'<a href="#learning-partner-next-share-off-chain-application-check-ins" data-toggle="tab" class="nav-link" data-controller="learning-partner-next-share-off-chain-application-check-ins">',
							'Check-Ins',
						'</a>',
					'</li>',
					'<li class="nav-item">',
						'<a href="#learning-partner-next-share-off-chain-application-files" data-toggle="tab" class="nav-link"',
									'data-controller="util-files-show" data-object="1" data-objectcontext="', nextStepsApplication.id, '"', 
									' data-context="learning-partner-next-share-off-chain-application-files"',
						'>',
							'Files',
						'</a>',
					'</li>',
					'<li class="nav-item">',
						'<a href="#learning-partner-next-share-off-chain-application-notes" data-toggle="tab" class="nav-link">',
							'Notes',
						'</a>',
					'</li>',
					'<li class="nav-item">',
						'<a href="#learning-partner-next-share-off-chain-application-team" data-toggle="tab" class="nav-link" data-controller="learning-partner-next-share-off-chain-application-team"',
						' data-project="', nextStepsApplication.id, '"', 
						'>',
							'Team',
						'</a>',
					'</li>',
					'<li class="nav-item">',
						'<a href="#learning-partner-next-share-off-chain-application-finalise" data-toggle="tab" class="nav-link" data-controller="learning-partner-next-share-off-chain-application-finalise">',
							'Status',
						'</a>',
					'</li>',
				'</ul>',
				'<div class="tab-content px-0">',
					'<div class="tab-pane d-none" id="learning-partner-next-share-off-chain-application-overview">',
						'<div class="row mt-4">',
							'<div class="card">',
								'<div class="card-body">',
									'<h2>', nextStepsApplication.description, '</h2>',
									'<div class="form-group mt-3">',
										'<h4><label class="text-muted mb-1 mt-1" for="learning-partner-next-share-off-chain-application-overview-sourceprojecttemplate">Application For</label></h4>',
										'<select class="form-control input-lg myds-select" id="learning-partner-next-share-off-chain-application-overview-sourceprojecttemplate" style="width:100%;" data-id="', nextStepsApplication.sourceprojecttemplate, '" data-scope="learning-partner-next-share-off-chain" data-context="sourceprojecttemplate" data-text="',
										nextStepsApplication.sourceprojecttemplatedescription, '">',
										'</select>',
									'</div>',
									'<div class="text-center" id="learning-partner-next-share-off-chain-application-overview-link">',
										nextStepsApplication.moreinformation,
									'</div>',
								'</div>',
								'<div class="card-body pt-0">',
									'<div class="text-center mt-2">',
										'<button class="btn btn-default btn-outline myds-click" data-controller="learning-partner-next-share-off-chain-application-edit-save" id="learning-partner-next-share-off-chain-application-edit-save" data-context="{{guid}}" data-id="{{guid}}">Save</button>',
									'</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>',
					'<div class="tab-pane" id="learning-partner-next-share-off-chain-application-information"></div>',
					'<div class="tab-pane active" id="learning-partner-next-share-off-chain-application-skills"></div>',
					'<div class="tab-pane" id="learning-partner-next-share-off-chain-application-files">',
						'<div class="mt-4" id="learning-partner-next-share-off-chain-application-files-attachments-container">',
						'</div>',
					'</div>',
					'<div class="tab-pane" id="learning-partner-next-share-off-chain-application-notes">',
						'<div class="form-group mt-4">',
							'<textarea style="height:350px;" class="form-control myds-text myds-validate" id="learning-partner-next-share-off-chain-application-notes" data-id="49538" data-scope="learning-partner-next-share-off-chain-application" data-context="notes"></textarea>',
						'</div>',
					'</div>',
					'<div class="tab-pane" id="learning-partner-next-share-off-chain-application-team">',
						'<div class="mt-4">',
							'<div class="card">',
								'<div class="card-body p-0" id="learning-partner-next-share-off-chain-application-team-view">',
								'</div>',
							'</div>',
							'<a class="btn btn-link" data-toggle="collapse" role="button"',
									' href="#learning-partner-next-share-off-chain-application-team-edit-collapse"',
							'>',
								' Add Application Team Member',
							'</a>',
							'<div class="collapse myds-collapse"',
								' id="learning-partner-next-share-off-chain-application-team-edit-collapse"',
								' data-controller="learning-partner-next-share-off-chain-application-team-edit"',
								' data-objectcontext="', nextStepsApplication.id, '"',
								' data-context="learning-partner-next-share-off-chain-application"',
							'>',
								'<div class="card mt-3">',
									'<div id="learning-partner-next-share-off-chain-application-team-edit-view" class="card-body pb-3 pt-5 px-4">',
										'<div class="form-group">',
											'<select class="form-control input-lg myds-select"',
												'id="learning-partner-next-share-off-chain-application-team-edit-contactperson" style="width:100%;"',
												' data-id=""',
												' data-scope="learning-partner-next-share-off-chain-application-team-edit"',
												' data-context="contactperson">',
											'</select>',
										'</div>',
										'<div class="form-group">',
											'<select class="form-control input-lg myds-select"',
												'id="learning-partner-next-share-off-chain-application-team-edit-projectrole" style="width:100%;"',
												' data-id=""',
												' data-scope="learning-partner-next-share-off-chain-application-team-edit"',
												' data-context="projectrole">',
											'</select>',
										'</div>',
										'<div class="form-group text-center mb-0">',
											'<button type="button" class="btn btn-default btn-outline btn-sm mr-2 mb-3 myds-click"',
											' data-context="learning-partner-next-share-off-chain-application"',
											' data-project="', nextStepsApplication.id, '"',
											' data-id="', nextStepsApplication.id, '"',
											' data-controller="learning-partner-next-share-off-chain-application-team-edit-save"',
											'>',
											'Add to Team',
											'</button>',
										'</div>',
									'</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>',
					'<div class="tab-pane" id="learning-partner-next-share-off-chain-application-check-ins"></div>',
					'<div class="tab-pane" id="learning-partner-next-share-off-chain-application-finalise">',
						'<div class="row mt-4">',
							'<div class="card">',
								'<div class="card-body pb-3 text-center">',
									'<div class="text-muted">',
										'Update the status of the application.',
									'</div>',
								'</div>',
								'<div class="card-body pt-0">',
									'<div class="text-center mt-2">',
										'<button class="btn btn-default btn-outline btn-sm myds-navigate" data-controller="learning-partner-next-share-off-chain-profile-add" id="learning-partner-next-share-off-chain-profile-add-{{id}}" data-context="{{guid}}" data-id="{{guid}}">Update</button>',
									'</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>',
				'</div>'
			]);

			/**/
		}

		nextStepsApplicationsView.render('#learning-partner-connections-next-summary-view');

		//app.invoke('learning-partner-next-share-off-chain-application-information');

		app.invoke('learning-partner-next-share-off-chain-application-skills');
		
		app.invoke('util-view-select',
		{
			container: 'learning-partner-next-share-off-chain-application-overview-sourceprojecttemplate',
			object: 'project',
			filters:
			[
				{
					field: 'template',
					value: 'Y'
				},
				{
					field: 'type',
					value: app.whoami().mySetup.projectTypes.facilitation
				}
			],
			fields: [{name: 'description'}]
		});

		app.invoke('util-attachments-initialise',
		{
			context: 'learning-partner-next-share-off-chain-application-files',
			object: app.whoami().mySetup.objects.project,
			objectContext: nextStepsApplication.id,
			showTypes: false,
			collapsible: false
		});
	}
});

app.add(
{
	name: 'learning-partner-next-share-off-chain-application-skills',
	code: function (param, response)
	{	
		var nextStepsApplication = app.get(
		{
			scope: 'learning-partner-next-share-off-chain',
			context: 'application'
		});

		if (_.has(nextStepsApplication, '_file.template.nextsteps.skills.required'))
		{
			var _applicationNotes = {};

			if (_.startsWith(nextStepsApplication.notes, '{'))
			{
				_applicationNotes = JSON.parse(nextStepsApplication.notes)
			}

			var skillsView = app.vq.init({queue: 'next-steps-next-share-off-chain-application-skills'});

			skillsView.template(
			[
				'<div class="col-12 col-sm-4 mb-3 mt-0 text-center">',
					'<div class="card">',
						'<div class="card-body border-bottom">',
							'<h3 class="mt-0 mb-2 ml-2 mt-1 myds-navigate" ',
									'data-name="{{name}}" data-controller=""',
									'data-context="{{name}}">',
								'{{name}}',
							'</h3>',
						'</div>',
						'<div class="card-body text-center" id="next-steps-next-share-off-chain-application-information-skills-required-{{uri}}-view">',
							'<form autocomplete="off">',
								'<div class="form-group">',
									'<h4>Level</h4>',
									'<h1 class="display-2 text-info">{{levelValue}}</h1>',
								'</div>',
							'</form>',
						'</div>',
					'</div>',
				'</div>'
			]);
		
			skillsView.add(['<div class="row mt-4">']);

			_.each(nextStepsApplication._file.template.nextsteps.skills.required, function(skillRequired)
			{
				skillRequired.levelValue = '-';
				if (_.has(_applicationNotes, 'skills.required'))
				{
					var _applicationNoteSkill = _.find(_applicationNotes.skills.required, function (noteSkillRequired)
					{
						return (noteSkillRequired.uri == skillRequired.uri)
					});

					if (_.isSet(_applicationNoteSkill))
					{
						skillRequired.levelValue = _applicationNoteSkill.level;
					}
				}
				skillRequired.evidenceClass = (_.isSet(skillRequired.evidence)?'':' d-none');
				skillsView.add({useTemplate: true}, skillRequired)
			});

			skillsView.add(['</div>']);

			skillsView.render('#learning-partner-next-share-off-chain-application-skills');
		}
	}
});

	
app.add(
{
	name: 'learning-partner-next-share-off-chain-application-information',
	code: function (param, response)
	{	
		var nextStepsApplication = app.get(
		{
			scope: 'learning-partner-next-share-off-chain',
			context: 'application'
		});

		app.show('#learning-partner-next-share-off-chain-application-help-view',
		[
			'<div class="card">',
				'<div class="card-body text-center px-3">',
					'<div class="font-weight-bold text-muted">',
						'SDN tokens are a way of representing your activity and attributes within your current learning community.',
					'</div>',
					'<div class="text-muted mt-3">',
						'Each learning partner assigns their own value to each of your activities and attributes recorded within selfdriven to assist them work out how suited you are to; their learning community and any particular area of learning you want to focus on.',
					'</div>',
				'</div>',
			'</div>',
			'<div class="card mt-3">',
				'<div class="card-body text-center px-3">',
					'<a class="" href="' + nextStepsApplication._file.template.nextsteps.url + '" target="_blank">',
							nextStepsApplication._file.template.nextsteps.urlCaption,
							'</a>',
				'</div>',
			'</div>'
		]);

		if (_.isSet(nextStepsApplication._file))
		{
			app.invoke('learning-partner-next-share-off-chain-application-information-get');
		}
		else
		{
			app.show('#learning-partner-next-share-off-chain-application-information', 
							'<div class="text-muted p-4">Sorry, no information to show.</div>');
		}
	}
});

app.add(
{
	name: 'learning-partner-next-share-off-chain-application-information-get',
	code: function (param, response)
	{
		var nextStepsApplication = app.get(
		{
			scope: 'learning-partner-next-share-off-chain',
			context: 'application'
		});

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'action',
				fields: ['createdusertext', 'createddate', 'guid', 'text', 'subject', 'action.createduser.contactpersontext'],
				filters:
				[
					{	
						field: 'object',
						value: app.whoami().mySetup.objects.project,
					},
					{	
						field: 'objectcontext',
						value: nextStepsApplication.id,
					},
					{	
						field: 'actiontype',
						comparison: 'IN_LIST',
						value: app.whoami().mySetup.actionTypes.nextStepsApplication
					}
				],
				sorts:
				[
					{
						field: 'id',
						direction: 'desc'
					}
				],
				rows: 1,
				callback: 'learning-partner-next-share-off-chain-application-information-get'
			});
		}
		else
		{
			var applicationInformationShared = app.set(
			{
				scope: 'learning-partner-next-share-off-chain',
				context: 'application-shared',
				value: _.first(response.data.rows)
			});

			if (applicationInformationShared == undefined)
			{
				app.show('#learning-partner-next-share-off-chain-application-information',
				[
					'<div class="text-muted p-4">No application information has been shared.</div>'
				]);
			}
			else
			{
				var learnerApplication = JSON.parse(applicationInformationShared.text);

				app.set(
				{
					scope: 'learning-partner-next-share-off-chain',
					context: 'learner-application',
					value: learnerApplication
				});

				app.invoke('learning-partner-next-share-off-chain-application-information-show');
			}
		}
	}
});

app.add(
{
	name: 'learning-partner-next-share-off-chain-application-information-show',
	code: function (param, response)
	{
		var nextStepsApplication = app.get(
		{
			scope: 'learning-partner-next-share-off-chain',
			context: 'application'
		});

		var nextStepsLearnerApplication = app.get(
		{
			scope: 'learning-partner-next-share-off-chain',
			context: 'learner-application'
		});

		var learnerApplication = nextStepsLearnerApplication.nextsteps.learner.application;

		if (_.has(nextStepsApplication, '_file.template.nextsteps.attributes'))
		{
			var informationView = app.vq.init({queue: 'learning-partner-next-share-off-chain-application-information-show'});

			informationView.template(
			[
				'<div class="col-12 col-sm-6 mb-3 mt-0 text-center">',
					'<div class="card">',
						'<div class="card-body pb-1">',
							'<h2 class="mt-0 mb-2 ml-2 mt-1 myds-navigate" ',
									'data-name="{{name}}" data-controller=""',
									'data-context="{{name}}">',
								'{{caption}}',
							'</h2>',
							'<div class="text-muted small">{{notes}}</div>',
						'</div>',
						'<div class="card-body pt-3" id="learning-partner-next-share-off-chain-application-information-attribute-{{name}}-view">',
							'{{info}}',
						'</div>',
					'</div>',
				'</div>'
			]);

			informationView.add(
			[
				'<div class="card mt-4">',
					'<div class="card-body" id="learning-partner-next-share-off-chain-application-information-sdn-view">',
					'</div>',
					'<div class="d-none card-body text-center border-top">',
						'<a class="" href="' + nextStepsApplication._file.template.nextsteps.url + '" target="_blank">',
							nextStepsApplication._file.template.nextsteps.urlCaption,
							'</a>',
					'</div>',
				'</div>'
			]);

			informationView.add('<div class="row mt-4">');
			
			_.each(nextStepsApplication._file.template.nextsteps.attributes, function (attribute)
			{
				var informationAttributeView = app.vq.init({queue: 'learning-partner-next-share-off-chain-application-information-show-attribute'});
				informationAttributeView.template(
				[
					'<div class="mt-3 w-75 mx-auto text-center">',
						'<label class="form-check-label mb-0">',
						'<div class="text-muted small">{{title}}</div>',
						'</label>',
						'<div class="progress progress-small">',
								'<div class="progress-bar" style="width: {{value}}%;" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="100"></div>',
						'</div>',
					'</div>'
				]);

				attribute.sdnTokens = 0;

				attribute._learnerAttributes = _.find(learnerApplication.information.attributes, function (learnerApplicationAttribute)
				{
					return (attribute.name).toLowerCase() == (learnerApplicationAttribute.name).toLowerCase()
				});

				if (attribute._learnerAttributes != undefined)
				{
					attribute.sdnTokens = attribute._learnerAttributes.sdn.tokens.total;
				
					informationAttributeView.add(
						'<div class="col-12 text-center">' +
							'<h1 class="p-0 mb-1" style="font-size:3em;">' +
								'<a href="#" style="color:#9ecbed;">' +
									attribute.sdnTokens +
								'</a>' +
							'</h1>' +
							'<small class="text-muted">SDN Tokens</small>' +
						'</div>');

					//Types

					var types =
					[
						{
							name: 'profile',
							caption: 'Attributes'
						},
						{
							name: 'dashboard',
							caption: 'Activity'
						},
						{
							name: 'tokens',
							caption: 'Community'
						},
						{
							name: 'skills',
							caption: 'Skills'
						}
					]

					informationAttributeView.add('<div class="row pt-3 px-1">');

					_.each(types, function (type)
					{
						informationAttributeView.add(
						[
							'<div class="col-3 px-0 text-center">' +
								'<h1 class="p-0 mb-0" style="font-size:1em;">' +
									'<a href="#" style="color:#9ecbed;">' +
										attribute._learnerAttributes.sdn.tokens.type[type.name] +
									'</a>' +
								'</h1>' +
								'<small class="text-muted">', type.caption, '</small>' +
							'</div>'
						]);	
					});

					informationAttributeView.add('</div>');
					
					if (_.has(attribute, 'source.profile.attributes'))
					{
						informationAttributeView.add('<div class="mt-3 pt-2 border-top">');

						_.each(attribute.source.profile.attributes, function (profileAttribute)
						{
							profileAttribute.value = 0;

							profileAttribute._learnerProfileAttribute = _.find(attribute._learnerAttributes.source.profile.attributes, function (learnerProfileAttribute)
							{
								return (profileAttribute.name == learnerProfileAttribute.name)
							});

							if (profileAttribute._learnerProfileAttribute != undefined)
							{
								profileAttribute.title = profileAttribute._learnerProfileAttribute.title;
								profileAttribute.value = profileAttribute._learnerProfileAttribute.value;
							}

							if (_.isSet(profileAttribute.value))
							{
								informationAttributeView.add({useTemplate: true}, profileAttribute)
							}
						});

						informationAttributeView.add('</div>');
					}

					if (_.has(attribute, 'source.skills'))
					{
						informationAttributeView.add('<div class="mt-3 pt-3 border-top w-100">');

						_.each(attribute.source.skills, function (skill)
						{
							skill.value = 0;

							skill._learnerSkill = _.find(attribute._learnerAttributes.source.skills, function (learnerSkill)
							{
								return (skill.name == learnerSkill.name)
							});

							if (skill._learnerSkill != undefined)
							{
								skill.value = skill._learnerSkill.value;
							}

							if (_.isSet(skill.value))
							{
								if (skill.value != 0)
								{
									informationAttributeView.add(
									[
										'<div class="col-12 text-center">',
											'<div style="color:#9ecbed;">',
												skill.value,
											'</div>',
											'<div class="text-muted">',
												skill.name,
											'</div>',
										'</div>'
									]);
								}
							}
						});

						informationAttributeView.add('</div>');
					}

					attribute.info = informationAttributeView.get();

					if (_.isNotSet(attribute.notes)) {attribute.notes = ''}

					informationView.add({useTemplate: true}, attribute);

					sdnTokensTotal += attribute.sdnTokens;
				}
			});

			informationView.add('</div>');
		
			informationView.render('#learning-partner-next-share-off-chain-application-information');

			var sdnTokensTotal = learnerApplication.sdnTokens;

			app.show('#learning-partner-next-share-off-chain-application-information-sdn-view',
			[
				'<div class="col-12 text-center">' +
					'<h1 class="p-0 mb-2" style="font-size:3em;">' +
						'<a href="#" style="color:#9ecbed;">' +
						sdnTokensTotal +
						'</a>' +
					'</h1>' +
					'<small class="text-muted font-weight-bold">selfdriven Next Steps (SDN) Tokens Total</small>' +
				'</div>'
			]);

			var learner = nextStepsLearnerApplication.nextsteps.learner;
			var learnerView = app.vq.init({queue: 'learning-partner-next-share-off-chain-application-learner'})

			learnerView.add(
			[
				'<div class="card">',
					'<div class="card-body text-center">',
						'<h4 class="text-muted">selfdriven Learner <i class="fe fe-hash"></i></h4>',
						'<div class="mb-0 mt-0">', learner.id, '</div>'
			]);

			if (learner.identifiers.length != 0)
			{	
				learnerView.template(
				[
					'<h4 class="text-muted mt-3">{{type}}</h4>',
					'<div class="mb-0 mt-0">{{reference}}</div>'
				]);
	
				_.each(learner.identifiers, function (identifier)
				{
					learnerView.add({useTemplate: true}, identifier)
				});
			}

			learnerView.add(
			[
					'</div>',
				'</div>'
			]);
			
			learnerView.render('#learning-partner-connections-next-summary-identifiers')
		
		}
	}
});
	
app.add(
{
	name: 'learning-partner-next-share-off-chain-source-template-files-show',
	code: function (param, response)
	{	
		var nextStepsApplication = app.get(
		{
			scope: 'learning-partner-next-share-off-chain',
			context: 'application'
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
						value: nextStepsApplication.id
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
				callback: 'learning-partner-next-share-off-chain-source-template-files'
			});
		}
		else
		{
			//get JSON file to get set up.

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

					projectFilesView.render('#learning-partner-next-share-off-chain-source-template-view-files');
				}
			}
		}
	}	
});

app.add(
{
	name: 'learning-partner-next-share-off-chain-application-team',
	code: function (param, response)
	{	
		var projectID = app._util.param.get(param.dataContext, 'project').value;
		var scope = app._util.param.get(param.dataContext, 'scope').value;
		var context = app._util.param.get(param.dataContext, 'context').value;
		var selector = app._util.param.get(param.dataContext, 'selector').value;
		var viewStatus = app._util.param.get(param, 'status', {default: 'shown'}).value;
		var show = (viewStatus == 'shown');

		var userRole = app.whoami().thisInstanceOfMe.userRole;
		if (context == undefined) {context = 'learning-partner-next-share-off-chain-application'}
		
		var project = app.get(
		{
			scope: 'learning-partner-next-share-off-chain',
			context: 'application'
		});

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
			scope = 'learning-partner-next-share-off-chain-application-team'
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
			selector = 'learning-partner-next-share-off-chain-application-team-view'
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
						sortBy: false,
						class: 'col-4 col-sm-2 text-break text-wrap myds-click'
					},
					{
						caption: 'Last Name',
						field: 'projectteam.contactperson.surname',
						sortBy: false,
						class: 'col-4 col-sm-2 text-break text-wrap myds-click'
					},
					{
						caption: 'Role',
						field: 'projectroletext',
						sortBy: false,
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
						class: 'col-0 col-sm-3 d-none d-sm-block text-break text-wrap myds-click'
					});
				}
	
				app.invoke('util-view-table',
				{
					object: 'project_team',
					container: selector,
					context: 'learning-partner-next-share-off-chain-application-team',
					filters: filters,
					options:
					{
						noDataText: '<div class="p-4">There are no team members.</div>',
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
							controller: 'learning-partner-next-share-off-chain-application-team-delete-ok'
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
							controller: 'learning-partner-next-share-off-chain-application-team-format'
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
	name: 'learning-partner-next-share-off-chain-application-team-format',
	code: function (row)
	{
		row.name = row['projectteam.contactperson.firstname'] + ' ' +
					row['projectteam.contactperson.surname'];

		row['dateleft-leaveteam'] = row.enddate;
		
		if (_.isNotSet(row['dateleft-leaveteam']))
		{
			row['dateleft-leaveteam'] = '<button class="btn btn-white btn-sm myds-click"' +
										' id="learning-partner-next-share-off-chain-application-team-leave-team-' + row.id +
										'" data-id="' + row.id + '"' +
										'" data-controller="learning-partner-next-share-off-chain-application-team-leave-ok"' +
										'">Leave</button>';
		}
	}
});

app.add(
{
	name: 'learning-partner-next-share-off-chain-application-team-edit',
	code: function (param)
	{	
		var context = app._util.param.get(param.dataContext, 'context').value;

		app.invoke('util-view-select',
		{
			container: 'learning-partner-next-share-off-chain-application-team-edit-contactperson',
			object: 'contact_person',
			fields: [{name: 'firstname'}, {name: 'surname'}]
		});

		app.invoke('util-view-select',
		{
			container: 'learning-partner-next-share-off-chain-application-team-edit-projectrole',
			object: 'setup_project_role',
			fields: [{name: 'title'}]
		});
	}
});

app.add(
{
	name: 'learning-partner-next-share-off-chain-application-team-edit-save',
	code: function (param, response)
	{	
		var context = app._util.param.get(param.dataContext, 'context').value;

		var nextStepsApplication = app.get(
		{
			scope: 'learning-partner-next-share-off-chain',
			context: 'application'
		});

		var projectID = nextStepsApplication.id;

		var id = app.get(
		{
			controller: 'learning-partner-next-share-off-chain-application-team',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			controller: 'learning-partner-next-share-off-chain-application-team-edit',
			cleanForCloudStorage: true,
			valueDefault: {}
		});

		if (id == '')
		{
			data.project = projectID;
			data.startdate = moment().format('D MMM YYYY');
		}
		else
		{
			data.id = id;
		}

		if (_.isUndefined(response))
		{
			mydigitalstructure.update(
			{
				object: 'project_team',
				data: data,
				callback: 'learning-partner-next-share-off-chain-application-team-edit-save',
				callbackParam: param
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Added to this next steps application team.');
				//$('#admin-community-project-summary-team-edit-collapse').removeClass('show');
				//app.invoke('app-navigate-to', {controller: 'admin-community-project-summary', context: data.project});
				//app.invoke('app-navigate-to', {controller: 'admin-community-projects', context: data.project});
				app.invoke('learning-partner-next-share-off-chain-application-team', param)
			}
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-next-download',
	code: function (param, response)
	{
		var nextStepsApplications = app.get(
		{
			scope: 'learning-partner-connections-next',
			context: 'all'
		});

		if (response == undefined)
		{
			var ids = _.map(nextStepsApplications, 'id');
			if (ids.length == 0) {ids = [-1]}

			mydigitalstructure.cloud.search(
			{
				object: 'action',
				fields: ['createdusertext', 'createddate', 'guid', 'text', 'subject', 'action.createduser.contactpersontext'],
				filters:
				[
					{	
						field: 'object',
						value: app.whoami().mySetup.objects.project,
					},
					{	
						field: 'actiontype',
						comparison: 'IN_LIST',
						value: app.whoami().mySetup.actionTypes.nextStepsApplication
					},
					{	
						field: 'objectcontext',
						comparison: 'IN_LIST',
						value: ids
					},
				],
				sorts:
				[
					{
						field: 'id',
						direction: 'desc'
					}
				],
				rows: 999,
				callback: 'learning-partner-connections-next-download'
			});
		}
		else
		{
			app.set(
			{
				scope: 'learning-partner-connections-next-download',
				context: 'applications',
				value: response.data.rows
			});

			app.invoke('learning-partner-connections-next-download-save')
		}

	}
});

app.add(
{
	name: 'learning-partner-connections-next-download-save',
	code: function (param, response)
	{
		var _nextStepsApplications = app.get(
		{
			scope: 'learning-partner-connections-next-download',
			context: 'applications'
		});

		var nextStepsApplications = [];

		_.each(_nextStepsApplications, function (_nextStepsApplication)
		{
			_nextStepsApplication._learnerApplication = JSON.parse(_nextStepsApplication.text);
			_nextStepsApplication.learnerApplication = _nextStepsApplication._learnerApplication.nextsteps.learner.application
			
			if (_nextStepsApplication.learnerApplication.thoughts == "")
			{
				_nextStepsApplication.learnerApplication.thoughts = '-'
			}

			var nextstepsApplication =
			{
				learnerid: _nextStepsApplication.learnerApplication.learnerid,
				name: _nextStepsApplication.learnerApplication.learnername,
				description: _nextStepsApplication.learnerApplication.description,
				applicationid: _nextStepsApplication.learnerApplication.id,
				sdntokens: _nextStepsApplication.learnerApplication.sdnTokens,
				lastupdated: _nextStepsApplication.learnerApplication.lastupdated,
				thoughts: _nextStepsApplication.learnerApplication.thoughts
			}

			nextstepsApplication['learner-identifiers'] = 
					_.join(_.map(_nextStepsApplication._learnerApplication.nextsteps.learner.identifiers, function (identifier)
								{
									return identifier.type + ':' + identifier.reference
								}), '; ');

			nextstepsApplication.attributes = _.join(_.map(_nextStepsApplication.learnerApplication.information.attributes, 'name'), ',')

			_.each(_nextStepsApplication.learnerApplication.information.attributes, function (attribute)
			{
				nextstepsApplication[attribute.name + '-sdn-tokens'] = attribute.sdn.tokens.total;
				_.each(attribute.sdn.tokens.type, function (typeValue, typeName)
				{
					nextstepsApplication[attribute.name + '-sdn-tokens-' + typeName] = typeValue;
				});

				nextstepsApplication[attribute.name + '-profiles'] = 
					_.join(_.map(attribute.source.profile.attributes, function (attr)
								{
									return attr.name + ':' + attr.value
								}), '; ');

				nextstepsApplication[attribute.name + '-skills'] = 
					_.join(_.map(attribute.source.skills, function (skill)
							{
								return skill.name + ':' + skill.value
							}), '; ');

				nextstepsApplication[attribute.name + '-tokens'] = 
					_.join(_.map(attribute.source.tokens, function (tokenValue, tokenName)
								{
									return tokenName + ':' + tokenValue
								}), '; ');
			});

			nextStepsApplications.push(nextstepsApplication);
		});

		var filename = 'selfdriven-next-steps-applications-' +
							moment().format('D-MMM-YYYY') +
							'.csv'

		app.invoke('util-export-data-as-is-to-csv',
		{
			fileData: nextStepsApplications,
			filename: filename
		});
	}
});

app.add(
{
	name: 'learning-partner-connections-next-summary-download',
	code: function (param, response)
	{
		var nextStepsLearnerApplication = app.get(
		{
			scope: 'learning-partner-next-share-off-chain',
			context: 'learner-application'
		});

		var nextStepsApplication = app.get(
		{
			scope: 'learning-partner-next-share-off-chain',
			context: 'application'
		});
	
		var data = JSON.stringify(nextStepsLearnerApplication);
		var filename = 'selfdriven-next-steps-application-' +
							_.kebabCase(nextStepsApplication.contactpersontext) +
							'-' + nextStepsApplication.guid +
							'.json'

		app.invoke('util-export-to-file',
		{
			data: data,
			filename: filename
		});
	}
});






