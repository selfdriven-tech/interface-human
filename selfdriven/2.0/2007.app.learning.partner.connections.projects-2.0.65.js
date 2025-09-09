/*
	{
    	title: "Learning Partner; Connections; Projects", 	
    	design: "https://www.selfdriven.foundation/design"
  	}

	Select/CreateTemplate [Design]
		Information [Listen]

		Learners / Overview / Planning [Analysis]
			Learners By Template Tasks

		Learning Session [Run] [Implement]
			Dashboard of Learners with tasks 
			Set task as goal
			Show as red (0%) / orange (1-99%) / green (100%)

		Validation [Review]
			Learner Reflections and selection of skills
			Create SDC

*/

app.add(
{
	name: 'learning-partner-connections-projects',
	code: function (param, response)
	{
		app.invoke('util-view-select',
		{
			container: 'learning-partner-connections-projects-template',
			object: 'project',
			fields: [{name: 'description'}],
			searchMinimumCharacters: 0,
			invokeChange: false,
			filters:
			[
				{
					field: 'template',
					value: 'Y'
				}
			]
		});		
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show',
	code: function (param)
	{
		var data = app.get(
		{
			scope: 'learning-partner-connections-projects'
		});

		var projectsView = app.vq.init({queue: 'learning-partner-connections-projects'});

		projectsView.add(
		[
			'<div class="row mt-1">',
				'<div class="col-12 pl-sm-2 pr-sm-0">',
					'<ul class="nav nav-tabs myds-tab mb-2 ml-2">',
						'<li class="nav-item myds-tab mr-0 mr-sm-2">',
							'<a class="nav-link active" data-toggle="tab" href="#learning-partner-connections-projects-information"',
								' data-controller="learning-partner-connections-projects-show-information">',
								'<button class="btn btn-default btn-outline btn-rounded"><i class="fas fa-info-circle mr-2"></i>Info</button>',
							'</a>',
						'</li>',
						'<li class="nav-item myds-tab mr-0 mr-sm-2">',
							'<a class="nav-link" data-toggle="tab" href="#learning-partner-connections-projects-overview"',
								' data-controller="learning-partner-connections-projects-show-overview">',
								'<button class="btn btn-default btn-outline btn-rounded"><i class="far fa-users mr-2"></i>Learners</button>',
							'</a>',
						'</li>',
						'<li class="nav-item myds-tab mr-0 mr-sm-2">',
							'<a class="nav-link" data-toggle="tab" href="#learning-partner-connections-projects-session"',
								' data-controller="learning-partner-connections-projects-show-session">',
								'<button class="btn btn-default btn-outline btn-rounded"><i class="fas fa-chalkboard-teacher mr-2"></i>Session</button>',
							'</a>',
						'</li>',
						'<li class="nav-item myds-tab mr-0 mr-sm-2">',
							'<a class="nav-link" data-toggle="tab" href="#learning-partner-connections-projects-reflect"',
								' data-controller="learning-partner-connections-projects-show-reflect">',
								'<button class="btn btn-default btn-outline btn-rounded"><i class="fas fa-comment mr-2"></i>Reflect</button>',
							'</a>',
						'</li>',
						'<li class="nav-item mr-0 mr-sm-2">',
							'<a class="nav-link" data-toggle="tab" href="#learning-partner-connections-projects-verify"',
								' data-controller="learning-partner-connections-projects-show-verify">',
								'<button class="btn btn-default btn-outline btn-rounded"><i class="fas fa-check-square mr-2"></i>Verify</button>',
							'</a>',
						'</li>',

					'</ul>',
					'<div class="tab-content myds-tab px-3 px-sm-0">',
						'<div class="tab-pane active pt-3" id="learning-partner-connections-projects-information">',
							'<div id="learning-partner-connections-projects-information-view">',
							'</div>',
						'</div>',
						'<div class="tab-pane pt-3" id="learning-partner-connections-projects-overview">',
							'<div id="learning-partner-connections-projects-overview-view">',
								'...',
							'</div>',
						'</div>',
						'<div class="tab-pane pt-3" id="learning-partner-connections-projects-session">',
							'<div id="learning-partner-connections-projects-session-view">',
								'...',
							'</div>',
						'</div>',
						'<div class="tab-pane pt-3" id="learning-partner-connections-projects-reflect">',
							'<div id="learning-partner-connections-projects-reflect-view">',
								'...',
							'</div>',
						'</div>',
						'<div class="tab-pane pt-3" id="learning-partner-connections-projects-verify">',
							'<div id="learning-partner-connections-projects-verify-view">',
								'...',
							'</div>',
						'</div>',
					'</div>',
				'</div>',
			'</div>'
			
		]);

		projectsView.render('#learning-partner-connections-projects-view');

		app.set(
		{
			scope: 'util-project-information',
			context: 'source-template-id',
			value: data.template
		});

		app.invoke('learning-partner-connections-projects-show-information');

	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-information',
	code: function (param)
	{
		var viewStatus = app._util.param.get(param, 'status', {default: 'shown'}).value;

		if (viewStatus == 'shown')
		{
			app.invoke('util-project-information',
			{
				containerSelector: '#learning-partner-connections-projects-information-view'
			});
		}
	}
});

// OVERVIEW

app.add(
{
	name: 'learning-partner-connections-projects-show-overview',
	code: function (param)
	{
		var viewStatus = app._util.param.get(param, 'status', {default: 'shown'}).value;

		if (viewStatus == 'shown')
		{
			var overviewView = app.vq.init({queue: 'learning-partner-connections-projects-show-overview'});

			overviewView.add(
			[
				'<div class="card">',
					'<div class="card-header">',
						'<div class="row">',
							'<div class="col-sm-12">',
								'<form autocomplete="off">',
									'<div class="input-group input-group-flush input-group-merge input-group-reverse">',
										'<input type="text" class="form-control myds-text" placeholder="Search for projects / learners"',
											' data-controller="learning-partner-connections-projects-show-overview-dashboard"',
											' data-context="search">',
										'<div class="input-group-text"><span class="fe fe-search"></span></div>',
									'</div>',
								'</form>',
							'</div>',
						'</div>',
					'</div>',
				
					'<div class="card-body p-0">',
						'<div class="row">',
							'<div class="col-sm-12" id="learning-partner-connections-projects-show-overview-dashboard-view">',
							'</div>',
						'</div>',
					'</div>',
				'</div>'
			]);

			overviewView.render('#learning-partner-connections-projects-overview-view');

			app.invoke('learning-partner-connections-projects-show-overview-dashboard', param);
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-overview-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-connections-projects-show-overview-dashboard',
			valueDefault: {}
		});

		var templateID = app.get(
		{
			scope: 'util-project-information',
			context: 'source-template-id'
		});

		if (_.isNotSet(response))
		{
			var filters =
			[
				{
					field: 'sourceprojecttemplate',
					value: templateID
				}
			];

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

			entityos.cloud.search(
			{
				object: 'project',
				fields:
				[
					'description', 'projectmanagertext', 'projectmanager', 'contactpersontext', 'contactperson', 'contactbusiness',
					'project.contactperson.firstname',
					'project.contactperson.surname',
					'guid', 'type'
				],
				filters: filters,
				callback: 'learning-partner-connections-projects-show-overview-dashboard',
				callbackParam: param
			});
		}
		else
		{
			app.set(
			{
				scope: 'learning-partner-connections-projects-show-overview-dashboard',
				context: 'projects',
				value: response.data.rows
			});

			app.invoke('learning-partner-connections-projects-show-overview-dashboard-show', param)
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-overview-dashboard-show',
	code: function (param, response)
	{
		var projects = app.get(
		{
			scope: 'learning-partner-connections-projects-show-overview-dashboard',
			context: 'projects'
		});

		if (projects.length == 0)
		{
			app.show('#learning-partner-connections-projects-show-overview-dashboard-view',
						'<div class="p-4 text-secondary>No projects that match this search.</div>')
	
		}
		else
		{
			var overviewView = app.vq.init({queue: 'learning-partner-connections-projects-show-overview-dashboard'});

			overviewView.template(
			[
				'<tr class="d-flex">',
					'<td class="col-9">',
						'<div class="font-weight-bold">',
							'{{project.contactperson.firstname}} {{project.contactperson.surname}}',
						'</div>',
						'<div class="text-secondary">',
							'{{description}}',
						'</div>',
					'</td>',
					'<td class="col-3 text-right">',
						'<button type="button" class="btn btn-sm btn-white myds-navigate" data-controller="{{controller}}" data-context="{{guid}}">',
							'Open Project',
						'</button>',
					'</td>',
				'</tr>'
			]);

			overviewView.add(
			[
				'<table class="table"><tbody>'
			]);

			_.each(projects, function (project)
			{
				project.controller = 'learning-partner-project-summary';

				if (project.type == app.whoami().mySetup.projectTypes.learning)
				{
					project.controller = 'learner-project-do';
				}

				overviewView.add({useTemplate: true}, project);
			});

			overviewView.add(
			[
				'</tbody></table>'
			]);

			overviewView.render('#learning-partner-connections-projects-show-overview-dashboard-view');
		}
		
	}
});

// LEARNING SESSION
app.add(
{
	name: 'learning-partner-connections-projects-show-session',
	code: function (param)
	{
		var viewStatus = app._util.param.get(param, 'status', {default: 'shown'}).value;

		if (viewStatus == 'shown')
		{
			var projectTemplateFile = app.get(
			{
				scope: 'util-project-information',
				context: 'source-template',
				name: '_file'
			});

			var projectTemplateInfo = projectTemplateFile.template.project;

			var sessionView = app.vq.init({queue: 'learning-partner-connections-projects-show-session'});

			sessionView.add(
			[
				'<div class="row">',
					'<div class="col-2">'
			]);
	
				_.each(projectTemplateInfo.milestones, function (milestone)
				{
					sessionView.add(
					[
						'<div class="mb-5">',
							'<div class="text-white mb-2 text-center small">',
								milestone.subject, //milestone.reference + '. ' + 
							'</div>',
							'<div>'
					]);

						_.each(milestone.tasks, function (milestoneTask)
						{
							milestoneTask._hash = milestoneTask.id;

							if (milestoneTask._hash == undefined)
							{
								milestoneTask._hash = milestoneTask.subject;
							}

							milestoneTask._hash = milestone.reference + '--' + milestoneTask._hash;

							milestoneTask.hash = app.invoke('util-protect-hash', {data: milestoneTask._hash}).dataHashed;

							sessionView.add(
							[
								'<div class="card shadow lift learning-partner-connections-projects-show-session-task"',
									' data-subject="', milestoneTask.subject, '"',
									' data-hash="', milestoneTask.hash, '"',
									'>',
									'<div class="card-body p-3 myds-click"',
											' data-subject="', milestoneTask.subject, '"',
											' data-hash="', milestoneTask.hash, '"',
											' data-controller="learning-partner-connections-projects-show-session-dashboard">',
										'<div class="row align-items-end px-1">',
											'<div class="col text-center">', milestoneTask.subject ,'</div>',
										'</div>',
									'</div>',
									'<div id="learning-partner-connections-projects-show-session-task-', milestoneTask.hash, '-view">',
									'</div>',
								'</div>'
							]);
						});

					sessionView.add(
					[
							'</div>',
						'</div>'
					]);
				});


			sessionView.add(
			[
					'</div>',
					'<div class="col-10 pl-4">'
			]);

					sessionView.add(
					[
						'<div class="card">',
							'<div class="card-header">',
								'<div class="row">',
									'<div class="col-sm-12 pr-0">',
										'<form autocomplete="off">',
											'<div class="input-group input-group-flush input-group-merge">',
												'<div class="input-group-prepend input-group-text p-0 mr-3 "><span class="fe fe-search"></span></div>',
												'<input type="text" class="form-control myds-text" placeholder="Search for a learner"',
													' data-controller="learning-partner-connections-projects-show-session-dashboard"',
													' data-context="search">',
												'<div class="d-none input-group-append input-group-text p-0 ml-3">',
													'<label class="form-check-label text-secondary small" for="flexSwitchCheckDefault">My Connections Only</label>',
												'</div>',
												'<div class="d-none input-group-append input-group-text p-0 ml-2">',
													'<div class="form-check form-switch">',
														'<input class="form-check-input small" type="checkbox" id="flexSwitchCheckDefault">',
													'</div>',
												'</div>',
											'</div>',
										'</form>',
									
									'</div>',
								'</div>',
							'</div>',
						'</div>',

						'<div class="row">',
							'<div class="col-sm-12" id="learning-partner-connections-projects-show-session-dashboard-view">',
							'</div>',
						'</div>'
					]);

			sessionView.add(
			[
					'</div>',
				'</div>'
			]);

			sessionView.render('#learning-partner-connections-projects-session-view');

			app.invoke('learning-partner-connections-projects-show-session-dashboard', param)
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-session-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-connections-projects-show-session-dashboard',
			valueDefault: {}
		});

		if (_.isSet(data.subject))
		{
			$('.learning-partner-connections-projects-show-session-task').removeClass('border-2 border-primary');
			$('.learning-partner-connections-projects-show-session-task[data-subject="' + data.subject + '"]').addClass('border-2 border-primary');
		}

		app.show('#learning-partner-connections-projects-show-session-task-' + data.hash + '-view',
		[
			'<form autocomplete="off">',
				'<div class="p-3 pt-0 mx-auto input-group input-group-merge">',
					'<input type="text" class="form-control myds-text text-center pl-4" placeholder="100"',
						' data-controller="learning-partner-connections-projects-show-session-dashboard-projects" data-context="percentage">',
					'</input>',
					'<div class="input-group-text py-2">',
						'<span class="fe fe-percent"></span>',
					'</div>',
				'</div>',
			'</form>'
		]);

		app.invoke('learning-partner-connections-projects-show-session-dashboard-projects', param);
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-session-dashboard-projects',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-connections-projects-show-session-dashboard',
			valueDefault: {}
		});

		var templateID = app.get(
		{
			scope: 'util-project-information',
			context: 'source-template-id'
		});

		if (_.isNotSet(response))
		{
			var filters =
			[
				{
					field: 'sourceprojecttemplate',
					value: templateID
				},
				{
					field: 'status',
					comparison: 'NOT_EQUAL_TO',
					value: app.whoami().mySetup.projectStatuses.completed
				}
			];

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

			entityos.cloud.search(
			{
				object: 'project',
				fields: ['description', 'projectmanagertext', 'projectmanager', 'contactpersontext', 'contactperson'],
				filters: filters,
				callback: 'learning-partner-connections-projects-show-session-dashboard-projects',
				callbackParam: param
			});
		}
		else
		{
			app.set(
			{
				scope: 'learning-partner-connections-projects-show-session-dashboard',
				context: 'projects',
				value: response.data.rows
			});

			app.invoke('learning-partner-connections-projects-show-session-dashboard-show', param)
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-session-dashboard-show',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-connections-projects-show-session-dashboard',
			valueDefault: {}
		});

		var projects = app.get(
		{
			scope: 'learning-partner-connections-projects-show-session-dashboard',
			context: 'projects'
		});

		if (projects.length == 0)
		{
			app.show('#learning-partner-connections-projects-show-session-dashboard-view',
						'<div class="p-4 text-secondary">No learners that match this search for this session.</div>')
	
		}
		else
		{
			var sessionView = app.vq.init({queue: 'learning-partner-connections-projects-show-session-dashboard'});

			sessionView.template(
			[
				'<div class="col-4">',
					'<div class="card shadow-lg lift learning-partner-connections-projects-show-session-dashboard-project"',
						' data-project="{{id}}"',
					'>',
						'<div class="card-header px-3"',
							' data-project="{{id}}"',
							' data-taskhash="', data.hash, '"',
							'>',
								'<div class="col text-left px-0 myds-click"',
									' data-controller="learning-partner-connections-projects-show-session-dashboard-project-show"',
									' data-project="{{id}}"',
									' data-taskhash="', data.hash, '"',
								'>',
									'<h3 class="mb-0">{{contactpersontext}}</h3>',
								'</div>',
								'<div class="col-auto text-right px-0" id="learning-partner-connections-projects-show-session-dashboard-project-{{id}}-task-options-view">',
								'</div>',
								'<div class="col-auto text-right pl-2 pr-0">',
									'<div id="learning-partner-connections-projects-show-session-dashboard-project-{{id}}-min-view">',
										'<button class="btn btn-white btn-sm myds-click" ',
											' data-controller="learning-partner-connections-projects-show-session-dashboard-project-show" data-project="{{id}}"',
											' data-taskhash="', data.hash, '"',
										'>',
											'<i class="fe fe-maximize-2"></i>',
										'</button>',
									'</div>',
									'<div class="d-none" id="learning-partner-connections-projects-show-session-dashboard-project-{{id}}-max-view">',
										'<button class="d-none btn btn-white btn-sm myds-click me-2" ',
											' data-controller="learning-partner-connections-projects-show-session-dashboard-project-reflection-record" data-project="{{id}}"><i class="fe fe-mic"></i>',
										'</button>',
										'<button class="btn btn-white btn-sm myds-click" ',
											' data-controller="learning-partner-connections-projects-show-session-dashboard-project-hide" data-project="{{id}}"><i class="fe fe-minimize-2"></i>',
										'</button>',
										'<button class="d-none btn btn-white btn-sm myds-navigate ms-2" type="button" data-context="{{guid}}" ',
											'data-controller="learning-partner-project-summary">',
											'<i class="fe fe-external-link"></i></button>',
									'</div>',
								'</div>',
						'</div>',
						'<div class="card-body text-center myds-click pb-3"',
								' data-controller="learning-partner-connections-projects-show-session-dashboard-project-show"',
								' data-project="{{id}}"',
								' data-taskhash="', data.hash, '"',
							'>',
							'<div class="text-secondary">{{description}}</div>',
						'</div>',
						'<div class="card-body p-2" id="learning-partner-connections-projects-show-session-dashboard-project-{{id}}-tasks-view">',
						'</div>',
						'<div class="card-body p-0" id="learning-partner-connections-projects-show-session-dashboard-project-{{id}}-reflect-view">',
						'</div>',
					'</div>',
				'</div>'
			]);

			sessionView.add(
			[
				'<div class="row">'
			]);

			_.each(projects, function (project)
			{
				sessionView.add({useTemplate: true}, project);
			});

			sessionView.add(
			[
				'</div>'
			]);

			sessionView.render('#learning-partner-connections-projects-show-session-dashboard-view');

			if (_.isSet(data.subject))
			{
				app.invoke('learning-partner-connections-projects-show-session-dashboard-tasks');
			}
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-session-dashboard-project-hide',
	code: function (param, response)
	{
		var projectID = app._util.param.get(param.dataContext, 'project').value;

		$('#learning-partner-connections-projects-show-session-dashboard-project-' + projectID + '-options-view').addClass('d-none');

		$('#learning-partner-connections-projects-show-session-dashboard-project-' + projectID + '-min-view').removeClass('d-none');
		$('#learning-partner-connections-projects-show-session-dashboard-project-' + projectID + '-max-view').addClass('d-none');

		$('#learning-partner-connections-projects-show-session-dashboard-project-' + projectID + '-reflect-view').addClass('d-none');
		$('.learning-partner-connections-projects-show-session-dashboard-project[data-project="' + projectID + '"]').removeClass('border-2 border-primary');
		$('.learning-partner-connections-projects-show-session-dashboard-project[data-project="' + projectID + '"]').parent('div.col-12').removeClass('col-12').addClass('col-4');
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-session-dashboard-tasks',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-connections-projects-show-session-dashboard',
			valueDefault: {}
		});

		var templateID = app.get(
		{
			scope: 'util-project-information',
			context: 'source-template-id'
		});

		var projectIDs = _.map(data.projects, 'id');
		if (projectIDs.length == 0) {projectIDs = [-1]}

		if (_.isNotSet(response))
		{
			var filters =
			[
				{
					field: 'project',
					comparison: 'IN_LIST',
					value: projectIDs
				}
			];

			if (!_.isEmpty(data.subject))
			{
				filters = _.concat(filters,
				[
					{	
						field: 'title',
						value: data.subject
					}
				]);
			}

			entityos.cloud.search(
			{
				object: 'project_task',
				fields: ['title', 'percentagecomplete', 'project', 'reference', 'projecttask.project.contactbusiness','projecttask.project.contactperson', 'createduser', 'modifieduser', 'modifieddate'],
				filters: filters,
				callback: 'learning-partner-connections-projects-show-session-dashboard-tasks',
				callbackParam: param
			});
		}
		else
		{
			app.set(
			{
				scope: 'learning-partner-connections-projects-show-session-dashboard',
				context: 'project-tasks',
				value: response.data.rows
			});

			app.invoke('learning-partner-connections-projects-show-session-dashboard-tasks-show', param)
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-session-dashboard-tasks-show',
	code: function (param, response)
	{
		var projects = app.get(
		{
			scope: 'learning-partner-connections-projects-show-session-dashboard',
			context: 'projects'
		});

		var projectTasks = app.get(
		{
			scope: 'learning-partner-connections-projects-show-session-dashboard',
			context: 'project-tasks'
		});

		var taskPercentageAsComplete = app.get(
		{
			scope: 'learning-partner-connections-projects-show-session-dashboard-projects',
			context: 'percentage',
			valueDefault: 100
		});

		taskPercentageAsComplete = numeral(taskPercentageAsComplete).value()

		_.each(projects, function (project)
		{
			project._tasks = _.filter(projectTasks, function (projectTask)
			{
				return projectTask.project == project.id;
			});

			var sessionTasksView = app.vq.init({queue: 'learning-partner-connections-projects-show-session-dashboard-tasks-show'});

			_.each(project._tasks, function (task)
			{
				task._class = 'bg-danger text-white';

				if (numeral(task.percentagecomplete).value() > 0)
				{
					task._class = 'bg-warning text-white';
				}

				if (numeral(task.percentagecomplete).value() >= taskPercentageAsComplete)
				{
					task._class = 'bg-success text-white';
				}

				sessionTasksView.add(
				[
					'<div class="col-12">',
						'<div class="card">',
							'<div class="card-body p-3 text-center rounded ', task._class, '">',
								'<div class="fw-bold">', task.percentagecomplete, '%</div>',
							'</div>',
						'</div>',
					'</div>'
				]);
			});

			sessionTasksView.render('#learning-partner-connections-projects-show-session-dashboard-project-' + project.id + '-tasks-view');

			project._task = _.first(project._tasks);

			if (_.isSet(project._task))
			{
				project._task.modifiedclass = '';
				if (project._task.modifieduser == app.whoami().thisInstanceOfMe.user.id)
				{
					project._task.modifiedclass = ' active'
				}

				app.show('#learning-partner-connections-projects-show-session-dashboard-project-' + project.id + '-task-options-view',
				[
					'<button class="btn btn-light btn-sm myds-click myds-toggle-active', project._task.modifiedclass, '" type="button" ',
						' data-task="', project._task.id , '" ',
						' data-controller="learning-partner-connections-projects-show-session-dashboard-project-task-tag"',
						' data-context="thumbs-up"><i class="fe fe-zap"></i></button>'
				]);
			}
		});		
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-session-dashboard-project-task-tag',
	code: function (param, response)
	{	
		var taskID = app._util.param.get(param.dataContext, 'task').value;
	
		if (_.isUndefined(response))
		{	
			var data =
			{
				id: taskID
			}
				
			mydigitalstructure.cloud.save(
			{
				object: 'project_task',
				data: data,
				callback: 'learning-partner-connections-projects-show-session-dashboard-project-task-tag',
				callbackParam: param
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				//app.invoke('learning-partner-connections-projects-show-session-dashboard-project-hide', {dataContext: {project: projectID}});
			}
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-session-dashboard-project-show',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-connections-projects-show-session-dashboard-project-show',
			valueDefault: {}
		});

		if (_.isSet(data.project))
		{
			$('.learning-partner-connections-projects-show-session-dashboard-project').removeClass('border-2 border-primary');
			$('.learning-partner-connections-projects-show-session-dashboard-project[data-project="' + data.project + '"]').addClass('border-2 border-primary');
			$('.learning-partner-connections-projects-show-session-dashboard-project[data-project="' + data.project + '"]').parent('div.col-12').removeClass('col-12').addClass('col-4');
			$('.learning-partner-connections-projects-show-session-dashboard-project[data-project="' + data.project + '"]').parent('div').removeClass('col-4').addClass('col-12');
			$('#learning-partner-connections-projects-show-session-dashboard-project-' + data.project + '-options-view').removeClass('d-none');

			$('#learning-partner-connections-projects-show-session-dashboard-project-' + data.project + '-max-view').removeClass('d-none');
			$('#learning-partner-connections-projects-show-session-dashboard-project-' + data.project + '-min-view').addClass('d-none');
		}

		// Show Reflections & New Reflect

		if (_.isSet(data.taskhash))
		{
			app.invoke('learning-partner-connections-projects-show-session-dashboard-project-show-task-reflections', param);
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-session-dashboard-project-show-task-reflections',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-connections-projects-show-session-dashboard',
			valueDefault: {}
		});

		var projectID = app._util.param.get(param.dataContext, 'project').value;

		var project = _.find(data['projects'], function (project)
		{
			return (project.id == projectID)
		});

		var projectTask = _.find(project._tasks, function (task)
		{
			return (task.title == data.subject)
		})

		if (_.isSet(projectTask))
		{
			if (_.isNotSet(response))
			{		 
				var filters =
				[
					{
						field: 'object',
						value: app.whoami().mySetup.objects.projectTask
					},
					{
						field: 'objectcontext',
						value: projectTask.id
					},
					{
						field: 'type',
						comparison: 'IN_LIST',
						value: app.whoami().mySetup.actionTypes.reflection
					}
				];

				entityos.cloud.search(
				{
					object: 'action',
					fields:
					[
						'subject',
						'type',
						'typetext',
						'date',
						'statustext',
						'createdusertext',
						'guid',
						'description'
					],
					filters: filters,
					sorts: 
					[
						{
							field: 'modifieddate',
							direction: 'desc'
						}
					],
					callback: 'learning-partner-connections-projects-show-session-dashboard-project-show-task-reflections',
					callbackParam: param
				});
			}
			else
			{
				var taskReflections = app.set(
				{
					scope: 'learning-partner-connections-projects-show-session-dashboard-project-show-task-reflections',
					context: 'task-reflections',
					value: response.data.rows
				});

				var reflectTaskReflectionsView = app.vq.init({queue: 'learning-partner-connections-projects-show-session-dashboard-project-show-task-reflections'});

				reflectTaskReflectionsView.add(
				[
					'<div class="card shadow mx-4" data-task="{{id}}">',
						'<div class="card-header p-2"',
							' data-task="{{id}}"',
							' data-context="{{guid}}"',
						'>',
							'<div class="row align-items-end px-3">',
								'<div class="col ml-2">',
									'<h3 class="my-1 text-secondard">Add Reflection</h3>',
								'</div>',
								'<div class="col-auto">',
									'<div class="btn-group btn-group-sm">',
										'<button class="btn btn-light active btn-sm myds-check myds-button-group mr-0" type="button" id="learning-partner-connections-projects-show-session-dashboard-show-task-reflections-on-for-growth" value="on-for" data-id="on-for" data-scope="learning-partner-connections-projects-show-session-dashboard-project-show-task-reflection-', projectTask.id , '" data-context="growth"><i class="fe fe-activity me-2"></i>On & For Growth',
										'</button>',
										'<button class="btn btn-light btn-sm myds-check myds-button-group mr-0" type="button" id="learning-partner-connections-projects-show-session-dashboard-show-task-reflections-on-growth" value="on" data-id="on" data-scope="learning-partner-connections-projects-show-session-dashboard-project-show-task-reflection-', projectTask.id , '" data-context="growth"><i class="fe fe-trending-up me-2"></i>On Growth',
										'</button>',
										'<button class="btn btn-light btn-sm myds-check myds-button-group" type="button" id="learning-partner-connections-projects-show-session-dashboard-show-task-reflections-for-growth" value="for" data-id="for" data-category="growth" data-scope="learning-partner-connections-projects-show-session-dashboard-project-show-task-reflection-', projectTask.id , '" data-context="growth">For Growth<i class="fe fe-arrow-up-right ms-2"></i>',
										'</button>',
									'</div>',
								'</div>',
								'<div class="col-auto mr-2 pt-1">',
									'<button class="btn btn-primary btn-sm myds-click" ',
									' data-controller="learning-partner-connections-projects-show-session-dashboard-project-show-task-reflection-save" ',
									' data-context="', projectTask.id, '" data-task="', projectTask.id, '" data-project="', projectID, '">',
										'Save',
									'</button>',
								'</div>',
							'</div>',
						'</div>'
				]);

				reflectTaskReflectionsView.add(
				[
						'<div class="card-body border-bottom p-0 pl-2">',
							'<div class="form-group mb-0">',
								'<textarea style="height:150px;" class="form-control myds-text myds-validate border-0 pl-4" data-validate-mandatory',
								' id="learning-partner-connections-endorsement-edit-description" data-id="{{id}}"',
								' data-scope="learning-partner-connections-projects-show-session-dashboard-project-show-task-reflection-', projectTask.id , '" data-context="description"></textarea>',
							'</div>',
						'</div>',
						'<div class="card-body p-0" id="learning-partner-connections-projects-show-session-dashboard-project-show-task-reflections-', projectID,'-attachments">',
						'</div>',
					'</div>'
				]);

				reflectTaskReflectionsView.add(
				[
					'<div class="mt-5" data-task="{{id}}">'					
				]);

				if (taskReflections.length == 0)
				{
						reflectTaskReflectionsView.add(
						[
							'<div class="p-2 text-secondary text-center">There are no existing reflections for this task.</div>'
						]);
				}
				else
				{
						reflectTaskReflectionsView.template(
						[
							'<div class="card shadow mx-4" data-action="{{id}}">',
								'<div class="card-body p-3">',
									'<div class="row align-items-end px-3">',
										'<div class="col">',
											'<h3 class="my-1">{{subject}}</h3>',
											'<div class="text-secondary small">',
												'{{date}} &#x2022; {{createdusertext}}',
											'</div>',
										'</div>',
										'<div class="col-auto pb-3">',
											'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button"',
												' href="#learning-partner-connections-projects-show-session-dashboard-project-show-task-reflection-{{id}}-collapse">',
												'<i class="fa fa-chevron-down text-muted ml-1"></i>',
											'</a>',
										'</div>',
									'</div>',
								'</div>',
								'<div class="collapse" id="learning-partner-connections-projects-show-session-dashboard-project-show-task-reflection-{{id}}-collapse">',
									'<div class="card-body">',
										'{{description}}',
									'</div>',
								'</div>',
							'</div>'
						]);

						_.each(taskReflections, function (taskReflection)
						{
							taskReflection.date = app.invoke('util-date', {date: taskReflection.date, format: 'ddd, D MMM YYYY'})
							reflectTaskReflectionsView.add({useTemplate: true}, taskReflection);
						});

					reflectTaskReflectionsView.add(
					[
						'</div>',
					]);
					
				}

				reflectTaskReflectionsView.template(
				[
					'</div>'
				]);

				reflectTaskReflectionsView.render('#learning-partner-connections-projects-show-session-dashboard-project-' + projectID + '-reflect-view');
				$('#learning-partner-connections-projects-show-session-dashboard-project-' + projectID + '-reflect-view').removeClass('d-none');

				param = app._util.param.set(param, 'project', projectID);
				param = app._util.param.set(param, 'projectTask', projectTask.id);
				
				app.invoke('learning-partner-connections-projects-show-session-dashboard-project-show-task-attachments', param)
			}
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-session-dashboard-project-show-task-attachments',
	code: function (param, response)
	{
		var projectID = app._util.param.get(param, 'project').value;
		var projectTaskID = app._util.param.get(param, 'projectTask').value;

		app.invoke('util-attachments-show',
		{
			container: 'learning-partner-connections-projects-show-session-dashboard-project-show-task-reflections-' + projectID + '-attachments',
			object: app.whoami().mySetup.objects.projectTask,
			objectContext: projectTaskID,
			showUnlink: false
		});
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-session-dashboard-project-show-task-reflection-save',
	code: function (param, response)
	{	
		var taskID = app._util.param.get(param.dataContext, 'task').value;
		var projectID = app._util.param.get(param.dataContext, 'project').value;

		if (_.isUndefined(response))
		{
			var data = app.get(
			{
				scope: 'learning-partner-connections-projects-show-session-dashboard',
				valueDefault: {}
			});

			var project = _.find(data['projects'], function (project)
			{
				return (project.id == projectID)
			});

			var projectTask = _.find(project._tasks, function (task)
			{
				return (task.title == data.subject)
			})

			var data = app.get(
			{
				scope: 'learning-partner-connections-projects-show-session-dashboard-project-show-task-reflection-' + taskID,
				cleanForCloudStorage: true,
				mergeDefault:
				{
					id: undefined,
					values:
					{	
						object: app.whoami().mySetup.objects.projectTask,
						objectContext: taskID,
						date: moment().format('D MMM YYYY'),
						completed: moment().format('D MMM YYYY'),
						status: app.whoami().mySetup.actionStatuses.completed
					}
				}
			});

			data.subject = ['Reflection by Learning Partner'];

			if (data.dataID == 'on')
			{
				data.type = app.whoami().mySetup.actionTypes.reflectionByLearningPartnerOnGrowth;
				data.subject.push(' On')
			}
			else if (data.dataID == 'for')
			{
				data.type = app.whoami().mySetup.actionTypes.reflectionByLearningPartnerForGrowth;
				data.subject.push(' For')
			}
			else
			{
				data.type = app.whoami().mySetup.actionTypes.reflectionByLearningPartnerOnForGrowth;
				data.subject.push(' On & For');
			}

			data.subject.push(' Growth');
			data.subject = data.subject.join('');

			if (_.isSet(projectTask))
			{
				data.contactbusiness = projectTask['projecttask.project.contactbusiness'];
				data.contactperson = projectTask['projecttask.project.contactperson'];
			}

			delete data.dataID;
			delete data.growth;
				
			mydigitalstructure.cloud.save(
			{
				object: 'action',
				data: data,
				callback: 'learning-partner-connections-projects-show-session-dashboard-project-show-task-reflection-save',
				callbackParam: param,
				notify: 'Reflection has been added.'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.invoke('learning-partner-connections-projects-show-session-dashboard-project-hide', {dataContext: {project: projectID}});
			}
		}
	}
});


// REFLECT

app.add(
{
	name: 'learning-partner-connections-projects-show-reflect',
	code: function (param)
	{
		var viewStatus = app._util.param.get(param, 'status', {default: 'shown'}).value;

		if (viewStatus == 'shown')
		{
			var reflectView = app.vq.init({queue: 'learning-partner-connections-projects-show-reflect'});

			reflectView.add(
			[
				'<div class="card">',
					'<div class="card-header">',
						'<div class="row">',
							'<div class="col-sm-12">',
								'<form autocomplete="off">',
									'<div class="input-group input-group-flush input-group-merge input-group-reverse">',
										'<input type="text" class="form-control myds-text" placeholder="Search for a learner"',
											' data-controller="learning-partner-connections-projects-show-session-dashboard"',
											' data-context="search">',
										'<div class="input-group-text"><span class="fe fe-search"></span></div>',
									'</div>',
								'</form>',
							'</div>',
						'</div>',
					'</div>',
				'</div>',

				'<div class="row">',
					'<div class="col-sm-12" id="learning-partner-connections-projects-show-reflect-dashboard-view">',
					'</div>',
				'</div>'
			]);

			reflectView.render('#learning-partner-connections-projects-reflect-view');

			app.invoke('learning-partner-connections-projects-show-reflect-dashboard', param)
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-reflect-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-connections-projects-show-reflect-dashboard',
			valueDefault: {}
		});

		var templateID = app.get(
		{
			scope: 'util-project-information',
			context: 'source-template-id'
		});

		if (_.isNotSet(response))
		{
			var filters =
			[
				{
					field: 'projecttask.project.sourceprojecttemplate',
					value: templateID
				},
				{name: '('},
						{
							field: 'percentagecomplete',
							comparison: 'NOT_EQUAL_TO',
							value: 0
						},
					{name: 'and'},
						{
							field: 'percentagecomplete',
							comparison: 'LESS_THAN',
							value: 100
						},
				{name: ')'}
			];

			if (!_.isEmpty(data.search))
			{
				filters = _.concat(filters,
				[
					{	
						field: 'projecttask.project.contactpersontext',
						comparison: 'TEXT_IS_LIKE',
						value: data.search
					},
					{
						name: 'or'
					},
					{	
						field: 'projecttask.project.description',
						comparison: 'TEXT_IS_LIKE',
						value: data.search
					}
				]);
			}

			entityos.cloud.search(
			{
				object: 'project_task',
				fields:
				[
					'description', 'taskbytext', 'taskby', 'title',
					'projecttask.taskbyuser.contactpersontext',
					'projecttask.taskbyuser.contactperson',
					'projecttask.taskbyuser.contactbusiness',
					'projecttask.project.description', 'percentagecomplete',
				],
				filters: filters,
				sorts: 
				[
					{
						field: 'modifieddate',
						direction: 'desc'
					}
				],
				callback: 'learning-partner-connections-projects-show-reflect-dashboard',
				callbackParam: param
			});
		}
		else
		{
			app.set(
			{
				scope: 'learning-partner-connections-projects-show-reflect-dashboard',
				context: 'project-tasks',
				value: response.data.rows
			});

			app.invoke('learning-partner-connections-projects-show-reflect-dashboard-show', param)
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-reflect-dashboard-show',
	code: function (param, response)
	{
		var projectTasks = app.get(
		{
			scope: 'learning-partner-connections-projects-show-reflect-dashboard',
			context: 'project-tasks'
		});

		if (projectTasks.length == 0)
		{
			app.show('#learning-partner-connections-projects-show-reflect-dashboard-view',
						'<div class="p-4 text-secondary>No learners that match this search for this session.</div>')
	
		}
		else
		{
			var reflectView = app.vq.init({queue: 'learning-partner-connections-projects-show-reflect-dashboard'});

			reflectView.add(
			[
				'<div class="row">'
			]);

				reflectView.template(
				[
					'<div class="col-4">',
						'<div class="card shadow-lg lift learning-partner-connections-projects-show-reflect-dashboard-task"',
							' data-task="{{id}}"',
						'>',
							'<div class="card-header px-3"',
								' data-task="{{id}}"',
								'>',
									'<div class="col text-left px-0 myds-click"',
										' data-controller="learning-partner-connections-projects-show-reflect-dashboard-task-show"',
										' data-task="{{id}}"',
									'>',
										'<h3 class="mb-0">{{projecttask.taskbyuser.contactpersontext}}</h3>',
									'</div>',
									'<div class="col-auto text-right px-0" id="learning-partner-connections-projects-show-reflect-dashboard-task-{{id}}-task-options-view">',
									'</div>',
									'<div class="col-auto text-right pl-2 pr-0">',
										'<div id="learning-partner-connections-projects-show-reflect-dashboard-task-{{id}}-min-view">',
											'<button class="btn btn-white btn-sm myds-click" ',
												' data-controller="learning-partner-connections-projects-show-reflect-dashboard-task-show" data-task="{{id}}"',
											'>',
												'<i class="fe fe-maximize-2"></i>',
											'</button>',
										'</div>',
										'<div class="d-none" id="learning-partner-connections-projects-show-reflect-dashboard-task-{{id}}-max-view">',
											'<button class="btn btn-white btn-sm myds-click me-2" ',
												' data-controller="learning-partner-connections-projects-show-reflect-dashboard-task-reflection-record" data-task="{{id}}"><i class="fe fe-mic"></i>',
											'</button>',
											'<button class="btn btn-white btn-sm myds-click" ',
												' data-controller="learning-partner-connections-projects-show-reflect-dashboard-task-hide" data-task="{{id}}"><i class="fe fe-minimize-2"></i>',
											'</button>',
											'<button class="btn btn-white btn-sm myds-navigate ms-2" type="button" data-context="{{guid}}" ',
												'data-controller="learning-partner-task-summary">',
												'<i class="fe fe-external-link"></i></button>',
										'</div>',
									'</div>',
							'</div>',
							'<div class="card-body text-center myds-click pb-3"',
									' data-controller="learning-partner-connections-projects-show-reflect-dashboard-task-show"',
									' data-task="{{id}}"',
								'>',
								'<div class="p-3 text-center rounded {{_class}}"><div class="fw-bold">{{percentagecomplete}}%</div></div>',
								'<div class="text-secondary mt-2">{{description}}</div>',
							'</div>',
							'<div class="card-body p-0" id="learning-partner-connections-projects-show-reflect-dashboard-task-{{id}}-reflect-view">',
							'</div>',
						'</div>',
					'</div>'
				]);

				var taskPercentageAsComplete = 100;

				_.each(projectTasks, function (projectTask)
				{
					projectTask._class = 'bg-danger text-white';

					if (numeral(projectTask.percentagecomplete).value() > 0)
					{
						projectTask._class = 'bg-warning text-white';
					}

					if (numeral(projectTask.percentagecomplete).value() >= taskPercentageAsComplete)
					{
						projectTask._class = 'bg-success text-white';
					}

					reflectView.add({useTemplate: true}, projectTask);
				});

				reflectView.add(
				[
					'</div>'
				]);

			reflectView.render('#learning-partner-connections-projects-show-reflect-dashboard-view');
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-reflect-dashboard-show-task-tag',
	code: function (param, response)
	{
		var taskID = app._util.param.get(param.dataContext, 'task').value;
	
		if (_.isUndefined(response))
		{	
			var data =
			{
				id: taskID
			}
				
			mydigitalstructure.cloud.save(
			{
				object: 'project_task',
				data: data,
				callback: 'learning-partner-connections-projects-show-reflect-dashboard-show-task-tag',
				callbackParam: param
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				//app.invoke('learning-partner-connections-projects-show-session-dashboard-project-hide', {dataContext: {project: projectID}});
			}
		}
	}
});


app.add(
{		
	name: 'learning-partner-connections-projects-show-reflect-dashboard-task-show',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-connections-projects-show-reflect-dashboard-task-show',
			valueDefault: {}
		});

		if (_.isSet(data.task))
		{
			$('.learning-partner-connections-projects-show-reflect-dashboard-task').removeClass('border-2 border-primary');
			$('.learning-partner-connections-projects-show-reflect-dashboard-task[data-task="' + data.task + '"]').addClass('border-2 border-primary');
			$('.learning-partner-connections-projects-show-reflect-dashboard-task[data-task="' + data.task + '"]').parent('div.col-12').removeClass('col-12').addClass('col-4');
			$('.learning-partner-connections-projects-show-reflect-dashboard-task[data-task="' + data.task + '"]').parent('div').removeClass('col-4').addClass('col-12');
			$('#learning-partner-connections-projects-show-reflect-dashboard-task-' + data.task + '-options-view').removeClass('d-none');

			$('#learning-partner-connections-projects-show-reflect-dashboard-task-' + data.task + '-max-view').removeClass('d-none');
			$('#learning-partner-connections-projects-show-reflect-dashboard-task-' + data.task + '-min-view').addClass('d-none');
		}

		// Show Reflections & New Reflect

		if (_.isSet(data.task))
		{
			app.invoke('learning-partner-connections-projects-show-reflect-dashboard-show-task-reflections', param);
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-reflect-dashboard-task-hide',
	code: function (param, response)
	{
		var taskID = app._util.param.get(param.dataContext, 'task').value;

		$('#learning-partner-connections-projects-show-reflect-dashboard-task-' + taskID + '-options-view').addClass('d-none');

		$('#learning-partner-connections-projects-show-reflect-dashboard-task-' + taskID + '-min-view').removeClass('d-none');
		$('#learning-partner-connections-projects-show-reflect-dashboard-task-' + taskID + '-max-view').addClass('d-none');

		$('#learning-partner-connections-projects-show-reflect-dashboard-task-' + taskID + '-reflect-view').addClass('d-none');
		$('.learning-partner-connections-projects-show-reflect-dashboard-task[data-task="' + taskID + '"]').removeClass('border-2 border-primary');
		$('.learning-partner-connections-projects-show-reflect-dashboard-task[data-task="' + taskID + '"]').parent('div.col-12').removeClass('col-12').addClass('col-4');
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-reflect-dashboard-show-task-reflections',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-connections-projects-show-reflect-dashboard-task-show',
			valueDefault: {}
		});

		if (_.isNotSet(response))
		{			 
			var filters =
			[
				{
					field: 'object',
					value: app.whoami().mySetup.objects.projectTask
				},
				{
					field: 'objectcontext',
					value: data.task
				},
				{
					field: 'type',
					comparison: 'IN_LIST',
					value: app.whoami().mySetup.actionTypes.reflection
				}
			];

			entityos.cloud.search(
			{
				object: 'action',
				fields:
				[
					'subject',
					'type',
					'typetext',
					'date',
					'statustext',
					'guid',
					'createdusertext',
					'description'
				],
				filters: filters,
				sorts: 
				[
					{
						field: 'modifieddate',
						direction: 'desc'
					}
				],
				callback: 'learning-partner-connections-projects-show-reflect-dashboard-show-task-reflections',
				callbackParam: param
			});
		}
		else
		{
			var taskReflections = app.set(
			{
				scope: 'learning-partner-connections-projects-show-reflect-dashboard-show-task-reflections',
				context: 'task-reflections',
				value: response.data.rows
			});

			var reflectTaskReflectionsView = app.vq.init({queue: 'learning-partner-connections-projects-show-reflect-dashboard-show-task-reflections'});

			reflectTaskReflectionsView.add(
			[
				'<div class="card shadow mx-4" data-task="{{id}}">',
					'<div class="card-header p-2 bg-light"',
						' data-task="{{id}}"',
						' data-context="{{guid}}"',
					'>',
						'<div class="row align-items-end px-3">',
							'<div class="col ml-2">',
								'<h3 class="my-1 text-secondard">Add Reflection</h3>',
							'</div>',
							'<div class="col-auto">',
								'<div class="btn-group btn-group-sm border">',
									'<button class="btn btn-light active btn-sm myds-check myds-button-group mr-0" type="button" id="learning-partner-connections-projects-show-reflect-dashboard-show-task-reflections-on-for-growth" value="on-for" data-id="on-for" data-scope="learning-partner-connections-projects-show-reflect-dashboard-project-show-task-reflection-', data.task , '" data-context="growth"><i class="fe fe-activity me-2"></i>On & For Growth',
									'</button>',
									'<button class="btn btn-light btn-sm myds-check myds-button-group mr-0" type="button" id="learning-partner-connections-projects-show-reflect-dashboard-show-task-reflections-on-growth" value="on" data-id="on" data-scope="learning-partner-connections-projects-show-reflect-dashboard-project-show-task-reflection-', data.task , '" data-context="growth"><i class="fe fe-trending-up me-2"></i>On Growth',
									'</button>',
									'<button class="btn btn-light btn-sm myds-check myds-button-group" type="button" id="learning-partner-connections-projects-show-reflect-dashboard-show-task-reflections-for-growth" value="for" data-id="for" data-category="growth" data-scope="learning-partner-connections-projects-show-reflect-dashboard-project-show-task-reflection-', data.task , '" data-context="growth">For Growth<i class="fe fe-arrow-up-right ms-2"></i>',
									'</button>',
								'</div>',
							'</div>',
							'<div class="col-auto mr-2 pt-1">',
								'<button class="btn btn-primary btn-sm myds-click" ',
								' data-controller="learning-partner-connections-projects-show-reflect-dashboard-project-show-task-reflection-save" ',
								' data-context="', data.task, '" data-task="', data.task, '">',
									'Save',
								'</button>',
							'</div>',
						'</div>',
					'</div>'
			]);

			reflectTaskReflectionsView.add(
			[
					'<div class="card-body border-bottom p-0 pl-2">',
						'<div class="form-group mb-0">',
							'<textarea style="height:150px;" class="form-control myds-text myds-validate border-0 pl-4" data-validate-mandatory',
							' id="learning-partner-connections-endorsement-edit-description" data-id="{{id}}"',
							' data-scope="learning-partner-connections-projects-show-reflect-dashboard-project-show-task-reflection-', data.task , '" data-context="description"></textarea>',
						'</div>',
					'</div>',
					'<div class="card-body p-0" id="learning-partner-connections-projects-show-reflect-dashboard-project-show-task-reflections-', data.task,'-attachments">',
					'</div>',
				'</div>'
			]);

			reflectTaskReflectionsView.add(
			[
				'<div class="mt-5" data-task="{{id}}">'					
			]);

			if (taskReflections.length == 0)
			{
					reflectTaskReflectionsView.add(
					[
						'<div class="p-2 text-secondary text-center">There are no existing reflections for this task.</div>'
					]);
			}
			else
			{
						reflectTaskReflectionsView.template(
						[
							'<div class="card shadow mx-4" data-action="{{id}}">',
								'<div class="card-body p-3">',
									'<div class="row align-items-end px-3">',
										'<div class="col">',
											'<h3 class="my-1">{{subject}}</h3>',
											'<div class="text-secondary small">',
												'{{date}} &#x2022; {{createdusertext}}',
											'</div>',
										'</div>',
										'<div class="col-auto pb-3">',
											'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button"',
												' href="#learning-partner-connections-projects-show-reflect-dashboard-project-show-task-reflection-{{id}}-collapse">',
												'<i class="fa fa-chevron-down text-muted ml-1"></i>',
											'</a>',
										'</div>',
									'</div>',
								'</div>',
								'<div class="collapse" id="learning-partner-connections-projects-show-reflect-dashboard-project-show-task-reflection-{{id}}-collapse">',
									'<div class="card-body">',
										'{{description}}',
									'</div>',
								'</div>',
							'</div>'
						]);

					_.each(taskReflections, function (taskReflection)
					{
						reflectTaskReflectionsView.add({useTemplate: true}, taskReflection);
					});

				reflectTaskReflectionsView.add(
				[
					'</div>',
				]);
				
			}

			reflectTaskReflectionsView.template(
			[
				'</div>'
			]);

			reflectTaskReflectionsView.render('#learning-partner-connections-projects-show-reflect-dashboard-task-' + data.task + '-reflect-view');
			$('#learning-partner-connections-projects-show-reflect-dashboard-task-' + data.task + '-reflect-view').removeClass('d-none');

			//TODO; TAGS - thumbs up

			app.invoke('learning-partner-connections-projects-show-reflect-dashboard-show-task-attachments', param)
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-reflect-dashboard-show-task-attachments',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-connections-projects-show-reflect-dashboard-task-show',
			valueDefault: {}
		});

		app.invoke('util-attachments-show',
		{
			container: 'learning-partner-connections-projects-show-reflect-dashboard-project-show-task-reflections-' + data.task + '-attachments',
			object: app.whoami().mySetup.objects.projectTask,
			objectContext: data.task,
			showUnlink: false
		});
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-reflect-dashboard-project-show-task-reflection-save',
	code: function (param, response)
	{	
		var taskID = app._util.param.get(param.dataContext, 'task').value;

		if (_.isUndefined(response))
		{
			var dataDashboard = app.get(
			{
				scope: 'learning-partner-connections-projects-show-reflect-dashboard',
				valueDefault: []
			});

			var projectTask = _.find(dataDashboard['project-tasks'], function (task)
			{
				return (task.id == taskID)
			});

			var data = app.get(
			{
				scope: 'learning-partner-connections-projects-show-reflect-dashboard-project-show-task-reflection-' + taskID,
				cleanForCloudStorage: true,
				mergeDefault:
				{
					id: undefined,
					values:
					{	
						object: app.whoami().mySetup.objects.projectTask,
						objectContext: taskID,
						date: moment().format('D MMM YYYY'),
						completed: moment().format('D MMM YYYY'),
						status: app.whoami().mySetup.actionStatuses.completed
					}
				}
			});

			data.subject = ['Reflection by Learning Partner'];

			if (data.dataID == 'for')
			{
				data.type = app.whoami().mySetup.actionTypes.reflectionByLearningPartnerForGrowth;
				data.subject.push(' For')
			}
			else if (data.dataID == 'for')
			{
				data.type = app.whoami().mySetup.actionTypes.reflectionByLearningPartnerOnGrowth;
				data.subject.push(' On');
			}
			else
			{
				data.type = app.whoami().mySetup.actionTypes.reflectionByLearningPartnerOnForGrowth;
				data.subject.push(' On & For');
			}

			data.subject.push(' Growth');
			data.subject = data.subject.join('');

			if (_.isSet(projectTask))
			{
				data.contactbusiness = projectTask['projecttask.taskbyuser.contactbusiness'];
				data.contactperson = projectTask['projecttask.taskbyuser.contactperson'];
			}

			delete data.dataID;
			delete data.growth;
				
			mydigitalstructure.cloud.save(
			{
				object: 'action',
				data: data,
				callback: 'learning-partner-connections-projects-show-reflect-dashboard-project-show-task-reflection-save',
				callbackParam: param,
				notify: 'Reflection has been added.'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.invoke('learning-partner-connections-projects-show-reflect-dashboard-task-hide', {dataContext: {task: taskID}});
			}
		}
	}
});

// VERIFY

app.add(
{
	name: 'learning-partner-connections-projects-show-verify',
	code: function (param)
	{
		var viewStatus = app._util.param.get(param, 'status', {default: 'shown'}).value;

		if (viewStatus == 'shown')
		{
			var reflectView = app.vq.init({queue: 'learning-partner-connections-projects-show-verify'});

			reflectView.add(
			[
				'<div class="card">',
					'<div class="card-header">',
						'<div class="row">',
							'<div class="col-sm-12">',
								'<form autocomplete="off">',
									'<div class="input-group input-group-flush input-group-merge input-group-reverse">',
										'<input type="text" class="form-control myds-text" placeholder="Search for a learner"',
											' data-controller="learning-partner-connections-projects-show-verify-dashboard"',
											' data-context="search">',
										'<div class="input-group-text"><span class="fe fe-search"></span></div>',
									'</div>',
								'</form>',
							'</div>',
						'</div>',
					'</div>',
				'</div>',

				'<div class="row">',
					'<div class="col-sm-12" id="learning-partner-connections-projects-show-verify-dashboard-view">',
					'</div>',
				'</div>'
			]);

			reflectView.render('#learning-partner-connections-projects-verify-view');

			app.invoke('learning-partner-connections-projects-show-verify-dashboard', param)
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-verify-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard',
			valueDefault: {}
		});

		var templateID = app.get(
		{
			scope: 'util-project-information',
			context: 'source-template-id'
		});

		if (_.isNotSet(response))
		{
			var filters =
			[
				{
					field: 'sourceprojecttemplate',
					value: templateID
				}
			];

			/*
			,
				{
					field: 'status',
					comparison: 'NOT_EQUAL_TO',
					value: app.whoami().mySetup.projectStatuses.completed
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

			entityos.cloud.search(
			{
				object: 'project',
				fields: ['description', 'projectmanagertext', 'projectmanager', 'contactpersontext', 'contactperson', 'guid'],
				filters: filters,
				callback: 'learning-partner-connections-projects-show-verify-dashboard',
				callbackParam: param
			});
		}
		else
		{
			app.set(
			{
				scope: 'learning-partner-connections-projects-show-verify-dashboard',
				context: 'projects',
				value: response.data.rows
			});

			app.invoke('learning-partner-connections-projects-show-verify-dashboard-show', param)
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-verify-dashboard-show',
	code: function (param, response)
	{
		var projects = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard',
			context: 'projects'
		});

		if (projects.length == 0)
		{
			app.show('#learning-partner-connections-projects-show-verify-dashboard-view',
						'<div class="p-4 text-secondary">No learners that match this search for verification.</div>')
	
		}
		else
		{
			var verifyView = app.vq.init({queue: 'learning-partner-connections-projects-show-verify-dashboard'});

			verifyView.add(
			[
				'<div class="row">',
					'<div class="col-2">'
			]);

				verifyView.template(
				[
					'<div class="row">',
						'<div class="col-12">',
							'<div class="card shadow-lg lift myds-click learning-partner-connections-projects-show-verify-dashboard-project" ',
								' data-controller="learning-partner-connections-projects-show-verify-dashboard-show-tasks"',
								' data-project="{{id}}"',
								' data-context="{{guid}}"',
								'>',
								'<div class="card-header p-2 text-center">',
									'<h3 class="my-1">{{contactpersontext}}</h3>',
								'</div>',
								'<div class="card-body px-2 text-center">',
									'<div class="text-secondary">{{description}}</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);

				_.each(projects, function (project)
				{
					verifyView.add({useTemplate: true}, project);
				});

			verifyView.add(
			[
					'</div>',
					'<div class="col-4" id="learning-partner-connections-projects-show-verify-dashboard-view-tasks">',
					'</div>',
					'<div class="col-6" id="learning-partner-connections-projects-show-verify-dashboard-view-achievements">',
					'</div>',
				'</div>'
			]);

			verifyView.render('#learning-partner-connections-projects-show-verify-dashboard-view');
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-verify-dashboard-show-tasks',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard-show-tasks',
			valueDefault: {}
		});

		if (_.isNotSet(response))
		{

			$('div.learning-partner-connections-projects-show-verify-dashboard-project').removeClass('border-2 border-primary');
			$('div.learning-partner-connections-projects-show-verify-dashboard-project[data-project="' + data.project + '"]').addClass('border-2 border-primary');
			 

			var filters =
			[
				{
					field: 'project',
					value: data.project
				}
			];

			//ADD: percentagecomplete: 100 or status: completed

			if (!_.isEmpty(data.search))
			{
				filters = _.concat(filters,
				[
					{	
						field: 'projecttask.project.description',
						comparison: 'TEXT_IS_LIKE',
						value: data.search
					}
				]);
			}

			entityos.cloud.search(
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
				filters: filters,
				sorts: 
				[
					{
						field: 'modifieddate',
						direction: 'desc'
					}
				],
				callback: 'learning-partner-connections-projects-show-verify-dashboard-show-tasks',
				callbackParam: param
			});
		}
		else
		{
			var projectTasks = app.set(
			{
				scope: 'learning-partner-connections-projects-show-verify-dashboard-show-tasks',
				context: 'project-tasks',
				value: response.data.rows
			});

			if (projectTasks.length == 0)
			{
				app.show('#learning-partner-connections-projects-show-verify-dashboard-view-tasks',
							'<div class="p-4 text-secondary">There are no tasks ready for verificaton.</div>')
		
			}
			else
			{
				var verifyTasksView = app.vq.init({queue: 'learning-partner-connections-projects-show-verify-dashboard-tasks'});

				verifyTasksView.template(
				[
					'<div class="row">',
						'<div class="col-12">',
							'<div class="card shadow-lg learning-partner-connections-projects-show-verify-dashboard-project-task" data-task="{{id}}">',
								'<div class="card-body px-2 py-3 text-center myds-click"',
									' data-controller="learning-partner-connections-projects-show-verify-dashboard-show-task-summary"',
									' data-task="{{id}}"',
									' data-context="{{guid}}">',
									'<div class="row"><h3 class="my-1">{{title}}</h3></div>',
									'<div class="text-secondary text-center">{{percentagecomplete}}%</div>',
									'<div class="text-secondary text-center mt-2" id="learning-partner-connections-projects-show-verify-dashboard-show-task-summary-skill-capacity-{{id}}"></div>',
								'</div>',
								'<div class="card-body p-0 text-center">',
									'<div id="learning-partner-connections-projects-show-verify-dashboard-show-task-summary-view-{{id}}"></div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);

				_.each(projectTasks, function (projectTask)
				{
					verifyTasksView.add({useTemplate: true}, projectTask);
				});


				verifyTasksView.render('#learning-partner-connections-projects-show-verify-dashboard-view-tasks');
			}

			app.invoke('learning-partner-connections-projects-show-verify-dashboard-show-skill-capacities');
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-verify-dashboard-show-task-summary',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard-show-task-summary',
			valueDefault: {}
		});

		var projectTasks = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard-show-tasks',
			context: 'project-tasks'
		});

		var projectTask = _.find(projectTasks, function (projectTask)
		{
			return (projectTask.id == data.task)
		})

		//$('div.learning-partner-connections-projects-show-verify-dashboard-project-task').removeClass('border-2 border-primary');
		//$('div.learning-partner-connections-projects-show-verify-dashboard-project-task[data-task="' + data.task + '"]').addClass('border-2 border-primary');

		var verifyTaskSummaryView = app.vq.init({queue: 'learning-partner-connections-projects-show-verify-dashboard-show-task-summary'});

		verifyTaskSummaryView.add(	
		[
			'<ul class="nav nav-tabs myds-tab mb-4 justify-content-center bg-lighter">',
				'<li class="nav-item myds-tab">',
					'<a class="nav-link active" data-toggle="tab" href="#learning-partner-connections-projects-show-verify-dashboard-show-task-summary-info-', data.task, '">Info</a>',
				'</li>',
				'<li class="nav-item myds-tab">',
					'<a class="nav-link" data-toggle="tab" href="#learning-partner-connections-projects-show-verify-dashboard-show-task-summary-reflections-', data.task, '"',
						' data-controller="learning-partner-connections-projects-show-verify-dashboard-show-task-summary-reflections" data-task="', data.task, '">Reflections</a>',
				'</li>',
				'<li class="nav-item">', // myds-tab
					'<a class="nav-link" data-toggle="tab" href="#learning-partner-connections-projects-show-verify-dashboard-show-task-summary-attachments-', data.task, '"',
					' data-controller="learning-partner-connections-projects-show-verify-dashboard-show-task-summary-attachments" data-task="', data.task, '">Files & Links</a>',
				'</li>',
			'</ul>'
		]);

		verifyTaskSummaryView.add(	
		[
			'<div class="tab-content">', //myds-tab
				'<div class="tab-pane pb-4 active" id="learning-partner-connections-projects-show-verify-dashboard-show-task-summary-info-', data.task, '">',
					'<div class="text-secondary">', projectTask.description, '</div>',
				'</div>',
				'<div class="tab-pane pb-4" id="learning-partner-connections-projects-show-verify-dashboard-show-task-summary-reflections-', data.task, '">',
				'</div>',
				'<div class="tab-pane pb-4" id="learning-partner-connections-projects-show-verify-dashboard-show-task-summary-attachments-', data.task, '">',
				'</div>',
			'</div>'
		]);

		verifyTaskSummaryView.render('#learning-partner-connections-projects-show-verify-dashboard-show-task-summary-view-' + data.task);

		//app.invoke('learning-partner-connections-projects-show-verify-dashboard-show-task-summary-achievements', param);
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-verify-dashboard-show-task-summary-reflections',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard-show-task-summary',
			valueDefault: {}
		});

		if (_.isNotSet(response))
		{
			var filters =
			[
				{
					field: 'object',
					value: app.whoami().mySetup.objects.projectTask
				},
				{
					field: 'objectcontext',
					value: data.task
				},
				{
					field: 'type',
					comparison: 'IN_LIST',
					value: app.whoami().mySetup.actionTypes.reflection
				}
			];

			entityos.cloud.search(
			{
				object: 'action',
				fields:
				[
					'subject',
					'type',
					'typetext',
					'date',
					'statustext',
					'guid',
					'description'
				],
				filters: filters,
				sorts: 
				[
					{
						field: 'modifieddate',
						direction: 'desc'
					}
				],
				callback: 'learning-partner-connections-projects-show-verify-dashboard-show-task-summary-reflections',
				callbackParam: param
			});
		}
		else
		{
			var reflectionActions = app.set(
			{
				scope: 'learning-partner-connections-projects-show-verify-dashboard-show-tasks',
				context: 'reflection-actions',
				value: response.data.rows
			});

			if (reflectionActions.length == 0)
			{
				app.show('#learning-partner-connections-projects-show-verify-dashboard-show-task-summary-reflections-' + data.task,
							'<div class="py-2 text-secondary">There are no reflections for this task.</div>');
			}
			else
			{
				var verifyTaskReflectionsView = app.vq.init({queue: 'learning-partner-connections-projects-show-verify-dashboard-show-task-summary-reflections'});

				verifyTaskReflectionsView.template(
				[
					'<div class="row">',
						'<div class="col-12">',
							'<div class="mx-3 card card-inactive shadow myds-click" ',
								' data-controller="learning-partner-connections-projects-show-verify-dashboard-show-tasks-verify"',
								' data-action="{{id}}"',
								' data-context="{{guid}}"',
								'>',
								'<div class="card-header p-2 text-center">',
									'<h3 class="my-1">{{subject}}</h3>',
								'</div>',
								'<div class="card-body px-2 text-center">',
									'<div class="text-secondary">{{description}}</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);

				_.each(reflectionActions, function (reflectionAction)
				{
					verifyTaskReflectionsView.add({useTemplate: true}, reflectionAction);
				});


				verifyTaskReflectionsView.render('#learning-partner-connections-projects-show-verify-dashboard-show-task-summary-reflections-' + data.task);
			}
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-verify-dashboard-show-task-summary-attachments',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard-show-task-summary',
			valueDefault: {}
		});

		if (_.isNotSet(response))
		{
			var filters =
			[
				{
					field: 'object',
					value: app.whoami().mySetup.objects.projectTask
				},
				{
					field: 'objectcontext',
					value: data.task
				}
			];

			entityos.cloud.search(
			{
				object: 'core_attachment',
				fields:
				[
					'filename',
					'url',
					'download',
					'modifieddate',
					'guid'
				],
				filters: filters,
				sorts: 
				[
					{
						field: 'modifieddate',
						direction: 'desc'
					}
				],
				callback: 'learning-partner-connections-projects-show-verify-dashboard-show-task-summary-attachments',
				callbackParam: param
			});
		}
		else
		{
			var reflectionAttachments = app.set(
			{
				scope: 'learning-partner-connections-projects-show-verify-dashboard-show-tasks',
				context: 'reflection-attachments',
				value: response.data.rows
			});

			if (reflectionAttachments.length == 0)
			{
				app.show('#learning-partner-connections-projects-show-verify-dashboard-show-task-summary-attachments-' + data.task,
							'<div class="py-2 text-secondary">There are no files or links for this task.</div>');
			}
			else
			{
				var verifyTaskAttachmentsView = app.vq.init({queue: 'learning-partner-connections-projects-show-verify-dashboard-show-task-summary-attachments'});

				verifyTaskAttachmentsView.template(
				[
					'<div class="row">',
						'<div class="col-12">',
							'<div class="mx-3 shadow card card-inactive" ',
								' data-action="{{id}}"',
								' data-context="{{guid}}"',
								'>',
								'<div class="card-header p-2 text-center">',
									'<h3 class="my-1"><a href="/download/{{id}}" class="myds-no-warn" target="_self">{{filename}} {{url}}</a></h3>',
								'</div>',
								'<div class="card-body px-2 text-center">',
									'<div class="text-secondary">{{modifieddate}}</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);

				_.each(reflectionAttachments, function (reflectionAttachment)
				{
					verifyTaskAttachmentsView.add({useTemplate: true}, reflectionAttachment);
				});


				verifyTaskAttachmentsView.render('#learning-partner-connections-projects-show-verify-dashboard-show-task-summary-attachments-' + data.task);
			}
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-verify-dashboard-show-achievements',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard-show-tasks',
			valueDefault: {}
		});

		if (_.isNotSet(response))
		{
			var filters =
			[
				{
					field: 'object',
					value: app.whoami().mySetup.objects.project
				},
				{
					field: 'objectcontext',
					value: data.project
				},
				{
					field: 'type',
					value: app.whoami().mySetup.actionTypes.achievement
				}
			];

			entityos.cloud.search(
			{
				object: 'action',
				fields:
				[
					'subject',
					'date',
					'guid',
					'description',
					'createdusertext'
				],
				filters: filters,
				sorts: 
				[
					{
						field: 'modifieddate',
						direction: 'desc'
					}
				],
				callback: 'learning-partner-connections-projects-show-verify-dashboard-show-achievements',
				callbackParam: param
			});
		}
		else
		{
			var achievementActions = app.set(
			{
				scope: 'learning-partner-connections-projects-show-verify-dashboard-show',
				context: 'achievement-actions',
				value: response.data.rows
			});

			app.set(
			{
				scope: 'learning-partner-connections-projects-show-verify-dashboard-show',
				context: 'skills-selected',
				value: []
			});

			app.show('#learning-partner-connections-projects-show-verify-dashboard-view-achievements',
			[
				'<div id="learning-partner-connections-projects-show-verify-dashboard-view-achievements-existing"></div>',
				'<div class="card shadow-lg">',
					'<div class="card-body">',
						'<div class="row">',
							'<div class="col text-secondary text-center">',
								'Select skills below to assign to this learner\'s project.',
							'</div>',
							'<div class="col-auto text-secondary" style="text-align:right;">',
								'<a href="https://slfdrvn.io/skills" target="_blank"><i class="fe fe-info text-secondary"></i></a>',
							'</div>',
						'</div>',
						'<div id="learning-partner-connections-projects-show-verify-dashboard-view-achievements-add-select">',
							'<div class="mt-4 text-center">',
								'<button class="btn btn-primary btn-sm myds-click" ',
								' data-controller="learning-partner-connections-projects-show-verify-dashboard-achievements-add-default" ',
								'>',
									'Set based on Learner Self-Assessment',
								'</button>',
							'</div>',
						'</div>',
					'</div>',
				'</div>',
				'<div class="text-secondary text-center" id="learning-partner-connections-projects-show-verify-dashboard-view-achievements-add">',
					'<button type="button" class="d-none btn btn-primary btn-sm myds-click" data-controller="learning-partner-connections-projects-show-verify-dashboard-add-achievements" data-task="', data.task, '">',
						'Add Achievement & Skills',
					'</button>',
				'</div>'
			]);

			if (achievementActions.length == 0)
			{
				app.show('#learning-partner-connections-projects-show-verify-dashboard-view-achievements-existing',
				[
					'<div class="mb-4 py-2 text-secondary text-center">There are no existing achievements for this learner project.</div>'
				]);
			}
			else
			{
				var verifyTaskAchievementsView = app.vq.init({queue: 'learning-partner-connections-projects-show-verify-dashboard-show-task-summary-achievements'});

				verifyTaskAchievementsView.template(
				[
					'<div class="row">',
						'<div class="col-12">',
							'<div class="card shadow-lg" ',
								' data-action="{{id}}"',
								' data-context="{{guid}}"',
								'>',
								'<div class="card-body text-center">',
									'<h3 class="my-0" style="line-height: 1.6;">{{description}}</h3>',
									'<div class="text-secondary mt-2">{{date}} &bull; {{createdusertext}}</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);

				_.each(achievementActions, function (achievementAction)
				{
					achievementAction.date = app.invoke('util-date', {date: achievementAction.date, format: 'D MMM YYYY'});
					verifyTaskAchievementsView.add({useTemplate: true}, achievementAction);
				});

				verifyTaskAchievementsView.render('#learning-partner-connections-projects-show-verify-dashboard-view-achievements-existing');
			}

			app.invoke('learning-partner-connections-projects-show-verify-dashboard-add-achievements');
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-verify-dashboard-add-achievements',
	code: function (param)
	{
		var dataTemplateInfo = app.get(
		{
			scope: 'util-project-information',
			context: 'source-template'
		});

		var projectTemplate = dataTemplateInfo._file.template.project;

		var informationView = app.vq.init({queue: 'learning-partner-connections-projects-show-verify-dashboard-add-achievements-information-show'});

		if (_.has(projectTemplate, 'skills.gained'))
		{
			if (projectTemplate['skill-capacities'] != undefined)
			{
				informationView.add(
				[
					'<div class="text-secondary mt-3 text-center">' +
						'Learners can be endorsed with the follow capacities; ' +
						_.join(_.map(projectTemplate['skill-capacities'], function (skillCapacity)
									{
										return app.whoami().mySetup.skillCapacities[skillCapacity] + ' (' + skillCapacity + ')'
									}), ', '),
						'.',
					'</div>'
				])
			}

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

			var skillCapacities = 
			{
				'00': 'Aware',
				'01': 'Capable',
				'02': 'Knowledgeable',
				'03': 'Natural'
			}

			var skillCapacityDefault = app.invoke('learning-partner-connections-projects-show-verify-skill-capacity-default');
			
			_.each(skillsContexts, function (skillsContext)
			{
				skillsContext.caption = '<div class="row">';

				if (_.isSet(skillsContext['image-uri']))
				{
					skillsContext.caption += '<div class="col-auto"><img src="' + skillsContext['image-uri'] + '" class="float-left rounded shadow ml-2" style="height:50px;"></div>'
				}

				skillsContext.caption += ('<div class="col-auto mt-2"><a class="myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-skills-gained-' +
												_.kebabCase(skillsContext.name) + '-collapse"><h3');

				if (_.isSet(skillsContext.style))
				{
					skillsContext.caption += ' style="' + skillsContext.style + '" class="text-left mb-1"'
				}

				skillsContext._name = skillsContext.name;

				if (_.includes(skillsContext._name, '('))
				{
					var name = _.split(skillsContext._name, '(');
					skillsContext._name = _.last(name);
					skillsContext._name = _.replace(skillsContext._name, ')', '');
				}

				skillsContext.skill = _.first(skillsContext.skillsGained);
				skillsContext.skillCapacity = skillsContext.skill.capacity;
				skillsContext.skillCapacityName = skillCapacities[skillsContext.skillCapacity];

				skillsContext.caption += ('>' + skillsContext._name + '</h3><div class="text-left text-secondary">' + skillsContext.skillCapacityName + '</div></a>');
					
				skillsContext.caption += '</div></div>';

				var collapseShow = '';
				if (skillCapacityDefault == skillsContext.capacity)
				{
					collapseShow = ' show';
				}

				informationView.add(
				[
							'<div class="card">',
								'<div class="card-body">',
									'<div class="row align-items-end">',
										'<div class="col px-0">',
											skillsContext.caption,
										'</div>',
										'<div class="col-auto pb-3 px-3">',
											'<button class="btn btn-white btn-sm myds-click" data-controller="learning-partner-connections-projects-show-verify-dashboard-skills-add"',
											' data-project=""',
											' data-skillcapacity="', skillsContext.capacity, '"',
										'><i class="fe fe-plus"></i><span class="ms-1 me-1">All</span></button>',
										'</div>',	
									'</div>',							
								'</div>',
								'<div class="px-4 collapse', collapseShow, ' myds-collapse" id="util-project-information-skills-gained-', _.kebabCase(skillsContext.name), '-collapse"',
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

				informationView.add('<div class="row">');
		
				_.each(skillsContext.skillsGained, function (skill)
				{
					skill._validationView = '';

					if (_.has(skill, 'validation.evidence'))
					{
						skill._validationView = '<div>';

						_.each(skill.validation.evidence, function (evidence)
						{
							skill._validationView += '<div class="text-secondary mt-2">' + evidence.description + '</div>'
						});

						skill._validationView += '</div>'
					}
				
					informationView.add(
					[
							'<div class="col-12">',
								'<div class="card shadow">',
									'<div class="card-body p-3">',
										'<div class="row align-items-end-x">',
											'<div class="col text-left">',
												'<div class="mt-2 fw-bold"><a class="text-dark" data-toggle="collapse" href="#add-achievements-skill-capacity-validation-', _.kebabCase(skill.name) , '">', skill.name, '</a></div>',
											'</div>',
											'<div class="col-auto">',
												'<button class="btn btn-white btn-sm myds-click" data-controller="learning-partner-connections-projects-show-verify-dashboard-skills-add"',
												' data-project=""',
												' data-skilluri="', skill.uri ,'"',
												' data-skillcapacity="', skillsContext.capacity, '"',
											'><i class="fe fe-plus"></i></button>',
											'</div>',
										'</div>',
										'<div class="collapse" id="add-achievements-skill-capacity-validation-', _.kebabCase(skill.name) , '">',
											skill._validationView,
										'</div>',
									'</div>',
								'</div>',
							'</div>'
					]);
				});

				informationView.add(
				[
						'</div>'
				])

				if (false && _.isSet(skillsContext.tokens))
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

				informationView.add('</div></div></div>');
				
			});
		}

		informationView.render('#learning-partner-connections-projects-show-verify-dashboard-view-achievements-add')
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-verify-dashboard-show-skill-capacities',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard-show-tasks',
			valueDefault: {}
		});

		var projectTaskIDs = _.map(data['project-tasks'], 'id');
		if (projectTaskIDs.length == 0)
		{
			projectTaskIDs = [-1];
		}

		if (_.isNotSet(response))
		{
			var filters =
			[
				{
					field: 'object',
					value: 410
				},
				{
					field: 'parentobject',
					value: app.whoami().mySetup.objects.projectTask
				},
				{
					field: 'parentobjectcontext',
					comparison: 'IN_LIST',
					value: projectTaskIDs
				}
			];

			entityos.cloud.search(
			{
				object: 'core_object_link',
				fields: 
				[
					'objectcontext', 'parentobjectcontext', 'createduser'
				],
				filters: filters,
				sorts:
				[
					{
						field: 'id',
						direction: 'desc'
					}
				],
				callback: 'learning-partner-connections-projects-show-verify-dashboard-show-skill-capacities',
				callbackParam: param
			});
		}
		else
		{
			var taskSkillCapacities = app.set(
			{
				scope: 'learning-partner-connections-projects-show-verify-dashboard-show',
				context: 'task-skill-capacities',
				value: response.data.rows
			});

			var taskSkillCapacitiesReduced = [];

			_.each(taskSkillCapacities, function (taskSkillCapacity)
			{
				if (_.find(taskSkillCapacitiesReduced, function (taskSkillCapacitiesReduced)
				{
					return taskSkillCapacitiesReduced.parentobjectcontext == taskSkillCapacity.parentobjectcontext
				}) == undefined)
				{
					taskSkillCapacitiesReduced.push(taskSkillCapacity)
				}
			});

			app.set(
			{
				scope: 'learning-partner-connections-projects-show-verify-dashboard-show',
				context: 'task-skill-capacities-reduced',
				value: taskSkillCapacitiesReduced
			});

			var taskSkillCapacitiesLearner = _.filter(taskSkillCapacities, function(taskSkillCapacity)
			{
				return (taskSkillCapacity.createduser != app.whoami().thisInstanceOfMe.user.id)
			});

			_.each(taskSkillCapacitiesLearner, function (taskSkillCapacity)
			{
				taskSkillCapacity._skillCapacity = _.find(app.whoami().mySetup.skillsSet.capacities, function (skillSetCapacity)
				{
					return (skillSetCapacity.id == taskSkillCapacity.objectcontext)
				});

				if (_.isSet(taskSkillCapacity._skillCapacity))
				{
					$('#learning-partner-connections-projects-show-verify-dashboard-show-task-summary-skill-capacity-' + taskSkillCapacity.parentobjectcontext).html('Learner self-accessed as<br /><span style="' + taskSkillCapacity._skillCapacity.style + '">"' + taskSkillCapacity._skillCapacity.name + '"</span><br />' + taskSkillCapacity._skillCapacity.caption + '');
				}
			});

			app.invoke('learning-partner-connections-projects-show-verify-dashboard-show-achievements', param);
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-verify-dashboard-skills-add',
	code: function (param, response)
	{
		var dataTemplateInfo = app.get(
		{
			scope: 'util-project-information',
			context: 'source-template'
		});

		var projectTemplate = dataTemplateInfo._file.template.project;
		var skillsContexts = projectTemplate.skills['scope-contexts'];

		var skillCapacity = app._util.param.get(param.dataContext, 'skillcapacity').value;
		var skillURI = app._util.param.get(param.dataContext, 'skilluri').value;

		var data = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard-show-tasks'
		});

		var skillsSelected = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard-show',
			context: 'skills-selected'
		});

		if (_.isSet(skillCapacity) && _.isNotSet(skillURI))
		{
			var skillsContext = _.find(skillsContexts, function (_skillsContext)
			{
				return (_skillsContext.capacity == skillCapacity)
			});

			if (_.isSet(skillsContext))
			{
				_.each(skillsContext.skillsGained, function (skill)
				{
					skillsSelected.push(
					{
						project: data.project,
						skillURI: skill.uri,
						skillName: skill.name,
						_skill: skill
					});
				})
			}
		}

		if (_.isSet(skillURI))
		{
			var skillsContext = _.find(skillsContexts, function (_skillsContext)
			{
				return (_skillsContext.capacity == skillCapacity)
			});

			if (_.isSet(skillsContext))
			{
				var skill = _.find(skillsContext.skillsGained, function (skill)
				{
					return (skill.uri == skillURI)
				})

				if (_.isSet(skill))
				{
					skillsSelected.push(
					{
						project: data.project,
						skillURI: skill.uri,
						skillName: skill.name,
						_skill: skill
					});
				}
			}
		}

		app.invoke('learning-partner-connections-projects-show-verify-dashboard-skills-selected')
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-verify-dashboard-achievements-add-default',
	code: function (param, response)
	{
		var dataTemplateInfo = app.get(
		{
			scope: 'util-project-information',
			context: 'source-template'
		});

		var taskSkillCapacities = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard-show',
			context: 'task-skill-capacities-reduced'
		});

		var projectTemplate = dataTemplateInfo._file.template.project;
		var skillsContexts = projectTemplate.skills['scope-contexts'];

		var skillCapacity;

		var skillCapacityRating =
		{
			A: 1,
			C: 2,
			K: 3,
			N: 4
		}

		var skillCapacityRatingRev =
		{
			1: 'A',
			2: 'C',
			3: 'K',
			4: 'N'
		}

		if (taskSkillCapacities.length != 0)
		{
			_.each(taskSkillCapacities, function (taskSkillCapacity)
			{
				taskSkillCapacity.rating = skillCapacityRating[taskSkillCapacity._skillCapacity.code]
			})

			var ratings = _.map(taskSkillCapacities, 'rating');
			var ratingAverage = parseInt(_.sum(ratings) / ratings.length);

			//skillCapacity = _.last(taskSkillCapacities)._skillCapacity.code
			skillCapacity = skillCapacityRatingRev[ratingAverage];
		}
	
		var data = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard-show-tasks'
		});

		var skillsSelected = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard-show',
			context: 'skills-selected'
		});

		if (_.isSet(skillCapacity))
		{
			var skillsContext = _.find(skillsContexts, function (_skillsContext)
			{
				return (_skillsContext.capacity == skillCapacity)
			});

			if (_.isSet(skillsContext))
			{
				_.each(skillsContext.skillsGained, function (skill)
				{
					skillsSelected.push(
					{
						project: data.project,
						skillURI: skill.uri,
						skillName: skill.name,
						_skill: skill
					});
				})
			}
		}

		app.invoke('learning-partner-connections-projects-show-verify-dashboard-skills-selected')
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-verify-dashboard-skills-selected',
	code: function (param, response)
	{
		var skillsSelected = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard-show',
			context: 'skills-selected'
		});

		var skillsSelectedView = app.vq.init({queue: 'learning-partner-connections-projects-show-verify-dashboard-skills-selected'});

		_.each(skillsSelected, function(skillSelected, s)
		{
			var classTop = 'mt-1'
			if (s == 0)
			{
				classTop = 'mt-4'
			}

			skillsSelectedView.add(
			[
				'<div class="row ', classTop, ' mb-1 py-1 border-bottom">',
					'<div class="col">',
						skillSelected.skillName,
					'</div>',
					'<div class="col-auto"><button class="btn btn-white btn-sm myds-click" data-controller="learning-partner-connections-projects-show-verify-dashboard-skills-remove" data-project="" data-skilluri="', skillSelected.skillURI, '"><i class="fe fe-x"></i></button></div>',
				'</div>'
			])
		});

		if (skillsSelected.length != 0)
		{
			skillsSelectedView.add(
			[
				'<div class="row mt-4">',
					'<div class="col-12 mr-2 pt-1 text-center">',
						'<button class="btn btn-primary btn-sm myds-click" data-spinner-append',
						' data-controller="learning-partner-connections-projects-show-verify-dashboard-view-achievements-add-save" ',
						'>',
							'Save as an Achievement',
						'</button>',
					'</div>',
				'</div>'
			]);
		}

		skillsSelectedView.render('#learning-partner-connections-projects-show-verify-dashboard-view-achievements-add-select');
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-verify-dashboard-skills-remove',
	code: function (param, response)
	{
		var skillURI = app._util.param.get(param.dataContext, 'skilluri').value;

		var skillsSelected = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard-show',
			context: 'skills-selected'
		});

		skillsSelected = _.filter(skillsSelected, function (skillSelected)
		{
			return (skillSelected.skillURI != skillURI)
		});

		app.set(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard-show',
			context: 'skills-selected',
			value: skillsSelected
		});

		app.invoke('learning-partner-connections-projects-show-verify-dashboard-skills-selected')
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-verify-dashboard-view-achievements-add-save',
	code: function (param, response)
	{	
		var data = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard-show-tasks'
		});

		var projects = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard',
			context: 'projects'
		});

		var project = app.set(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard',
			context: 'project',
			value: _.find(projects, function (project)
			{
				return (project.id == data.project)
			})
		});

		var skillsSelected = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard-show',
			context: 'skills-selected'
		});

		var skillNames = _.join(_.map(skillsSelected, 'skillName'), ' &bull; ')

		var actionData =
		{
			type: app.whoami().mySetup.actionTypes.achievement,
			billingstatus: 2,
			status: 1,
			contactperson: project.contactperson,
			contactbusiness: project.contactbusiness,
			date: moment().format('D MMM YYYY'),
			completed: moment().format('D MMM YYYY'),
			by: project.projectmanager,
			description: 'Skills; ' + skillNames,
			object: app.whoami().mySetup.objects.project,
			objectcontext: project.id,
			subject: 'Achievement For ' + project.description
		}

		console.log(actionData)

		if (_.isUndefined(response))
		{		
			mydigitalstructure.cloud.save(
			{
				object: 'action',
				data: actionData,
				callback: 'learning-partner-connections-projects-show-verify-dashboard-view-achievements-add-save',
				set: {scope: 'learning-partner-connections-projects-show-verify-dashboard-view-achievements-add-save', data: true, guid: true}
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.invoke('learning-partner-connections-projects-show-verify-dashboard-view-achievements-add-skills-save');	
			}
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-verify-dashboard-view-achievements-add-skills-save',
	code: function (param, response)
	{
		var skillsSelected = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard-show',
			context: 'skills-selected'
		});

		var skillsURIs = _.map(skillsSelected, 'skillURI');
		if (skillsURIs.length == 0)
		{
			skillsURIs = [-1]
		}

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'setup_contact_attribute',
				fields: 
				[
					'id'
				],
				filters:
				[
					{
						field: 'url',
						comparison: 'IN_LIST',
						value: skillsURIs
					}
				],
				callback: 'learning-partner-connections-projects-show-verify-dashboard-view-achievements-add-skills-save',
				callbackParam: param
			});
		}
		else
		{
			app.set(
			{
				scope: 'learning-partner-connections-projects-show-verify-dashboard-show',
				context: 'skills-selected-contact-attributes',
				value: response.data.rows
			});

			 app.set(
			{
				scope: 'learning-partner-connections-projects-show-verify-dashboard-view-achievements-add-skills-process',
				context: 'skills-selected-contact-attributes-index',
				value: 0
			});
		
			app.invoke('learning-partner-connections-projects-show-verify-dashboard-view-achievements-add-skills-process')
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-verify-dashboard-view-achievements-add-skills-process',
	code: function (param)
	{
		var achievementActionID = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard-view-achievements-add-save',
			context: 'id'
		});

		var project = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard',
			context: 'project'
		});

		var skillsSelectedContactAttributes = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard-show',
			context: 'skills-selected-contact-attributes'
		});

		var skillsSelectedContactAttributeIndex = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard-view-achievements-add-skills-process',
			context: 'skills-selected-contact-attributes-index'
		});

		if (skillsSelectedContactAttributeIndex < skillsSelectedContactAttributes.length)
		{
			var skillContactAttribute = skillsSelectedContactAttributes[skillsSelectedContactAttributeIndex];

			mydigitalstructure.cloud.save(
			{
				object: 'contact_attribute',
				data:
				{
					attribute: skillContactAttribute.id,
					contactperson: project.contactperson,
					startdate: moment().format('D MMM YYYY')
				},
				callback: 'learning-partner-connections-projects-show-verify-dashboard-view-achievements-add-skills-link'
			}); 
			
		}
		else
		{
			app.invoke('learning-partner-connections-projects-show-verify-dashboard-view-achievements-add-save-complete'); //CHECK
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-verify-dashboard-view-achievements-add-skills-link',
	code: function (param, response)
	{
		var contactAttributeID = response.id;

		var achievementActionID = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard-view-achievements-add-save',
			context: 'id'
		});

		mydigitalstructure.cloud.save(
		{
			object: 'core_object_link',
			data:
			{
				object: app.whoami().mySetup.objects.contactAttribute,
				objectcontext: contactAttributeID,
				parentobject: app.whoami().mySetup.objects.action,
				parentobjectcontext: achievementActionID
			},
			callback: 'learning-partner-connections-projects-show-verify-dashboard-view-achievements-add-skills-next'
		}); 
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-verify-dashboard-view-achievements-add-skills-next',
	code: function (param, response)
	{
		app.set(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard-view-achievements-add-skills-process',
			context: 'skills-selected-contact-attributes-index',
			value: function (value) { return numeral(value).value() + 1 }
		});

		app.invoke('learning-partner-connections-projects-show-verify-dashboard-view-achievements-add-skills-process');
	}
});

app.add(
{
	name: 'learning-partner-connections-projects-show-verify-dashboard-view-achievements-add-save-complete',
	code: function (param)
	{
		app.invoke('util-view-spinner-remove-all');

		app.notify({message: 'Achievement has been added.'});

		var project = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard',
			context: 'project'
		});

		app.invoke('learning-partner-connections-projects-show-verify-dashboard-show-tasks', {dataContext: {project: project.id}});
	}
});	

app.add(
{
	name: 'learning-partner-connections-projects-show-verify-skill-capacity-default',
	code: function (param)
	{
		var dataTemplateInfo = app.get(
		{
			scope: 'util-project-information',
			context: 'source-template'
		});

		var taskSkillCapacities = app.get(
		{
			scope: 'learning-partner-connections-projects-show-verify-dashboard-show',
			context: 'task-skill-capacities-reduced'
		});

		var skillCapacity;

		var skillCapacityRating =
		{
			A: 1,
			C: 2,
			K: 3,
			N: 4
		}

		var skillCapacityRatingRev =
		{
			1: 'A',
			2: 'C',
			3: 'K',
			4: 'N'
		}

		if (taskSkillCapacities.length != 0)
		{
			_.each(taskSkillCapacities, function (taskSkillCapacity)
			{
				taskSkillCapacity.rating = skillCapacityRating[taskSkillCapacity._skillCapacity.code]
			})

			var ratings = _.map(taskSkillCapacities, 'rating');
			var ratingAverage = parseInt(_.sum(ratings) / ratings.length);

			skillCapacity = skillCapacityRatingRev[ratingAverage];
		}

		return skillCapacity;
	}
});

