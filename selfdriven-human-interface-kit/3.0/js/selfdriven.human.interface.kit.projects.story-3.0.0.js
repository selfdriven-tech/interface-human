
/* Project Story - Improvement Cycle */

app.add(
{
	name: 'util-project-story-board',
	code: function (param, response)
	{	
		var context = app.whoami().thisInstanceOfMe._userRole;

		var guid = app.get(
		{
			scope: context + '-project-story-board',
			context: 'id'
		});

		if (guid == undefined || guid == '')
		{
			app.notify({message: 'Can not find the project.', type: 'error'});
			app.invoke('app-navigate-to', {controller: context + '-projects'});
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
						'reference',
						'description',
						'type',
						'typetext',
						'subtype',
						'subtypetext',
						'category',
						'categorytext',
						'enddate',
						'startdate',
						'guid',
						'notes'
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
						scope: 'util-project-story-board',
						context: 'project'
					},
					callback: 'util-project-story-board',
					callbackParam: param
				});
			}
			else
			{
				if (response.status == 'OK')
				{
					if (response.data.rows.length == 0)
					{
						app.notify({type: 'error', message: 'Can not find this project.'});
						app.invoke('app-navigate-to', {controller: context + '-projects'});
					}
					else
					{
						var project = _.first(app.get( 
						{
							scope: 'util-project-story-board',
							context: 'project'
						}));

						app.set(
						{
							scope: 'util-project-story-board',
							context: 'summary',
							name: 'project',
							value: project
						});

						var storyBoardView = app.vq.init({queue: 'util-project-story-board-init'});
		
						/*
						var improvementCycle =
							[
								{
									caption: 'Listen & Observe',
									code: 'listen',
									task: projectTaskTypes.listening
								},
								{
									caption: 'Interpret',
									code: 'interpret',
									task: projectTaskTypes.interpreting
								},
								{
									caption: 'Implement',
									code: 'implement',
									task: projectTaskTypes.implementing
								},
								{
									caption: 'Review',
									code: 'review',
									task: projectTaskTypes.reviewing
								}
							]
						*/

						storyBoardView.add(
						[
							'<div class="header mb-2">',
								'<div class="container-fluid">',
									'<div class="header-body py-3">',
										'<div class="row align-items-end">',
											'<div class="col">',
												'<h6 class="header-pretitle">',
													'Project Story',
												'</h6>',
												'<h1 class="header-title">',
													project.description,
												'</h1>',
											'</div>',
											'<div class="col-auto text-right">',
												'<button class="btn btn-link btn-sm myds-navigate px-0" data-controller="', context, '-project-summary"',
														' id="', context, '-project-summary-', project.id, '" data-context="', project.guid, '" data-id="', project.guid, '">View Project</button>',
											'</div>',
											'<div class="col-auto text-right">',
												'<div class="btn-group mb-1">',
													'<button class="btn btn-default btn-outline btn-sm myds-click myds-button-group active" data-controller="util-project-story-board-show"',
													' id="learner-project-story-board-view-style-list" data-view-style="list" data-context="', project.guid, '" data-id="', project.guid, '">',
														'<i class="fa fa-bars"></i>',
													'</button>',
													'<button class="btn btn-default btn-outline btn-sm myds-click myds-button-group" data-controller="util-project-story-board-show"',
													' id="learner-project-story-board-view-style-edit" data-view-style="edit" data-context="', project.guid, '" data-id="', project.guid, '">',
														'<i class="fa fa-edit"></i>',
													'</button>',
													'<button class="btn btn-default btn-outline btn-sm myds-click myds-button-group" data-controller="util-project-story-board-show"',
													' id="learner-project-story-board-view-style-carousel" data-view-style="carousel" data-context="', project.guid, '" data-id="', project.guid, '">',
														'<i class="fa fa-images"></i>',
													'</button>',
													'<button data-spinner class="btn btn-default btn-outline btn-sm myds-click myds-button-group" data-controller="util-pdf-project-story"',
													' id="util-project-story-download" data-context="', project.guid, '" data-id="', project.guid, '">',
														'<i class="fa fa-file-download"></i>',
													'</button>',
												'</div>',
											'</div>',
										'</div>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="container-fluid">',
								'<div class="row">',
									'<div class="col-12">',
										'<div class="mb-3 text-muted d-none">The project story as a part of my learning journey.</div>',
										'<div class="mb-4 text-muted d-none">What the project was about and reflections on it, by myself and my learning partners.</div>',
									'</div>',
									
								'</div>',
							'</div>'
						]);

						/*
							'<button data-spinner class="btn btn-default btn-outline btn-sm myds-click myds-button-group" data-controller="util-export-project-story"',
													' id="util-project-story-download-data" data-context="', project.guid, '" data-id="', project.guid, '">',
														'<i class="fa fa-download"></i>',
													'</button>',
						*/

						storyBoardView.add(
						[
							'<div class="mt-0" id="', context, '-project-story-board-view"></div>'
						]);

						storyBoardView.render('#' + context + '-project-story-board');

						app.invoke('util-project-story-board-tasks', param);
					}
				}
			}
		}
	}
});

app.add(
{
	name: 'util-project-story-board-tasks',
	code: function (param, response)
	{	
		var context = app.whoami().thisInstanceOfMe._userRole;

		var guidProject = app.get(
		{
			scope: context + '-project-story-board',
			context: 'id'
		});

		if (guidProject == undefined || guidProject == '')
		{
			app.notify({message: 'Can not find the project.', type: 'error'});
			app.invoke('app-navigate-to', {controller: context + '-projects'});
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
						'reference',
						'title',
						'description',
						'type',
						'typetext',
						'notes',
						'enddate',
						'startdate',
						'createddate',
						'createdusertext',
						'percentagecomplete',
						'guid'
					],
					filters:
					[
						{
							field: 'projecttask.project.guid',
							value: guidProject
						}
					],
					sorts:
					[
						{
							field: 'type',
							direction: 'asc'
						},
						{
							field: 'startdate',
							direction: 'asc'
						}
					],
					set: 
					{
						scope: 'util-project-story-board',
						context: 'tasks'
					},
					callback: 'util-project-story-board-tasks',
					callbackParam: param
				});
			}
			else
			{
				if (response.status == 'OK')
				{
					app.invoke('util-project-story-board-show', param);
				}
			}
		}
	}	
});

app.add(
{
	name: 'util-project-story-board-show',
	code: function (param, response)
	{
		var projectStoryBoard = app.get( 
		{
			scope: 'util-project-story-board-show',
			valueDefault: {}
		});

		if (projectStoryBoard.viewStyle == undefined) {projectStoryBoard.viewStyle = 'list'}
		app.invoke('util-project-story-board-' + projectStoryBoard.viewStyle, param);		
	}
});

app.add(
{
	name: 'util-project-story-board-list',
	code: function (param, response)
	{		
		var context = app.whoami().thisInstanceOfMe._userRole;

		var storyBoardView = app.vq.init({queue: 'util-project-story-board-init'});

		var improvementCycle = app.get(
		{
			scope: 'util-setup',
			context: 'improvementCycle'
		});

		var tasks = app.get( 
		{
			scope: 'util-project-story-board',
			context: 'tasks'
		});

		var taskTypes = app.whoami().mySetup.projectTaskTypes;

		_.each(taskTypes, function (taskType)
		{
			taskType.tasks = _.filter(tasks, function (task)
			{
				return task.type == taskType.id
			});

			taskType.improvementCycle = _.find(improvementCycle, function (improvementCycleItem)
			{
				return improvementCycleItem.taskType == taskType.id
			});
		});

		console.log(taskTypes);

		storyBoardView.add(
		[
			'<div class="container-fluid mt-4">',
				'<div class="row">',
					'<div class="col-12 col-sm-8">'
		]);

		storyBoardView.add(
		[
			'<div class="x-card">'
		]);

		var project = app.get(
		{
			scope: 'util-project-story-board',
			context: 'summary',
			name: 'project',
		});

		storyBoardView.add(
		[
			'<div class="card">',
				'<div class="card-body">',
					'<h3 class="mb-1">Objective</h3>',
					'<div class="text-muted small">The purpose of the project. Why?</div>',
				'</div>',
				'<div class="card-body pt-0 border-bottom">',
					project.notes,
				'</div>',
				'<div id="util-project-story-board-list-files-container"></div>',
				'<div id="util-project-story-board-list-template-info-container"></div>',
			'</div>'
		]);

		_.each(improvementCycle, function (improvementCycleItem, iCI)
		{
			improvementCycleItem._header = '<h3>' + improvementCycleItem.captionVerb + '</h3>';
			
			if (_.isSet(improvementCycleItem.alternateCaptionVerb))
			{
				improvementCycleItem._header = '<h3 class="mb-1">' + 
					(improvementCycleItem.icon==undefined?'':improvementCycleItem.icon) +
						improvementCycleItem.alternateCaptionVerb + '</h3>' +
					'<div class="small text-muted mb-2">' + improvementCycleItem.captionVerb + '</div>';
			}

			storyBoardView.add(
			[
				'<div class="card">',
				'<div class="card-body',
					(iCI!=0?' x-border-top':''),
					'">',
					improvementCycleItem._header,
					'<div class="pt-2"',
							' id="', context, '-project-story-board-',
								improvementCycleItem.code, '-container">',
						'<div class="mt-2">',
							'<h4 style="color:#1c84c6;">To Do Tasks</h4>',
							'<div class="mb-3 mt-4"',
							' id="', context, '-project-story-board-',
								improvementCycleItem.code, '-container-tasks">',
							'</div>',
						'</div>',
						'<div class="">',
							'<div class="mb-2 mt-4"',
								' id="', context, '-project-story-board-',
									improvementCycleItem.code, '-container-images">',
							'</div>',
						'</div>',
						'<div class="border-top pt-4 mt-4">',
							'<h4 style="color:#1c84c6;">Reflections</h4>',
							'<div class="mb-2 mt-4"',
								' id="', context, '-project-story-board-',
									improvementCycleItem.code, '-container-reflections">',
							'</div>',
						'</div>',
					'</div>',
				'</div>',
				'</div>'
			]);
		});

		storyBoardView.add(
		[
			'</div>'
		]);

		storyBoardView.add(
		[		
				'</div>',
				'<div class="col-12 col-sm-4">'
		]);

		storyBoardView.add(
		[
			'<div class="card">',
				'<div class="card-body border-top pb-0">',
					'<h3 class="mb-0">Objective Fitness</h3>',
					'<div class="text-muted mb-2 small">(Review Feedback)</div>',
					'<div class="text-secondary">Is the project <em>Fit For Purpose</em>, i.e. meeting the objective, or do you need to go through the improvement cycle again based on feedback?</div>',
					'<div class="p-2 mt-3"',
							' id="', context, '-util-project-story-board-accountability-container">',
					'</div>',
				'</div>',
			'</div>'
		]);

		storyBoardView.add(
		[		
					'</div>',
				'</div>',
			'</div>'
		]);

		storyBoardView.render('#' + context + '-project-story-board-view');

		app.invoke('util-project-story-board-tasks-show');
		app.invoke('util-project-story-board-files');
		app.invoke('util-project-story-board-accountability');
	}
});

app.add(
{
	name: 'util-project-story-board-files',
	code: function (param, response)
	{	
		var project = app.get(
		{
			scope: 'util-project-story-board',
			context: 'summary',
			name: 'project',
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
						value: project.id
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
				set: 
				{
					scope: 'util-project-story-board',
					context: 'project-files'
				},
				customOptions: [{name: 'object', value: app.whoami().mySetup.objects.project}],
				callback: 'util-project-story-board-files'
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
						'<div class="card-body border-bottom">',
							'<ul class="pb-0">'
					]);

					_.each(response.data.rows, function (row)
					{
						row.link = row.url;
						if (row.link == '') {row.link = row.download}
						row._caption = row.title;
						if (row._caption == '') {row._caption = row.filename}
						if (row._caption == '') {row._caption = row.url}
						if (row._caption == '') {row._caption = 'Download'}

						projectFilesView.add(
						[
							'<li><a href="', row.link, '" target="_blank">', row._caption, '</li>'
						]);
					});

					projectFilesView.add(
					[
							'</ul>',
						'</div>'
					]);

					projectFilesView.render('#util-project-story-board-list-files-container');
				}
			}
		}
	}	
});
	
app.add(
{
	name: 'util-project-story-board-tasks-show',
	code: function (param, response)
	{	
		var context = app.whoami().thisInstanceOfMe._userRole;

		var tasks = app.get( 
		{
			scope: 'util-project-story-board',
			context: 'tasks'
		});

		app.set(
		{
			scope: 'util-project-story-board',
			context: 'summary',
			name: 'tasks',
			value: tasks
		});

		var improvementCycle = app.get(
		{
			scope: 'util-setup',
			context: 'improvementCycle'
		});

		_.each(improvementCycle, function (improvementCycleItem)
		{
			improvementCycleItem.tasks = _.filter(tasks, function (task)
			{
				return (task.type == improvementCycleItem.task)
			});

			var storyBoardTasksView = app.vq.init({queue: 'util-project-story-board-tasks-show'});

			if (improvementCycleItem.tasks.length == 0)
			{
				storyBoardTasksView.add(
				[
					'<em class="text-muted">No to do tasks</em>'
				]);
			}
			else
			{		
				storyBoardTasksView.add(
				[
					'<ul class="list-group mb-2">'
				]);

				_.each(improvementCycleItem.tasks, function (task)
				{
					storyBoardTasksView.add(
					[
						'<li class="list-group-item">',
							'<h4 class="mb-0">', task.title, '</h4>',
							(_.isSet(task.description)?'<div class="text-muted small">' + task.description + '</div>':''),
							'<div class="text-muted small">', task.statustext, '</div>',
							'<div class="text-muted small">', task.percentagecomplete, '%</div>',
							'<div class="progress progress-small mb-1">',
		  						'<div class="progress-bar" style="width: ', task.percentagecomplete, '%;" role="progressbar" aria-valuenow="', task.percentagecomplete, '" aria-valuemin="0" aria-valuemax="100"></div>',
							'</div>',
						'</li>'
					]);
				});

				storyBoardTasksView.add(
				[
					'</ul>'
				]);
			}

			app.set(
			{
				scope: 'util-project-story-board',
				context: 'summary',
				name: 'improvement-cycle-tasks',
				value: improvementCycleItem.tasks
			});

			storyBoardTasksView.render(_.join(['#', context, '-project-story-board-', improvementCycleItem.code, '-container-tasks'], ''));

			app.invoke('util-project-story-board-tasks-reflections');
			app.invoke('util-project-story-board-tasks-images');
		});
	}
});

app.add(
{
	name: 'util-project-story-board-tasks-reflections',
	code: function (param, response)
	{	
		var context = app.whoami().thisInstanceOfMe._userRole;

		var tasks = app.get( 
		{
			scope: 'util-project-story-board',
			context: 'tasks'
		});

		var taskIDs = _.map(tasks, 'id');

		var projectID = app.get(
		{
			scope: context + '-project-summary',
			context: 'id'
		});

		if (tasks.length == 0)
		{
			app.invoke('util-project-story-board-tasks-reflections-show');
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'action',
					fields: 
					[
						'reference',
						'date',
						'subject',
						'description',
						'guid',
						'object',
						'objectcontext'
					],
					filters:
					[
						{
							field: 'object',
							value: app.whoami().mySetup.objects.projectTask
						},
						{
							field: 'objectcontext',
							comparison: 'IN_LIST',
							value: taskIDs
						},
						{
							field: 'type',
							comparison: 'IN_LIST',
							value: app.whoami().mySetup.actionTypes.reflection
						}
					],
					sorts:
					[
						{
							field: 'type',
							direction: 'asc'
						},
						{
							field: 'date',
							direction: 'asc'
						}
					],
					set: 
					{
						scope: 'util-project-story-board',
						context: 'reflections'
					},
					callback: 'util-project-story-board-tasks-reflections'
				});
			}
			else
			{
				if (response.status == 'OK')
				{
					app.invoke('util-project-story-board-tasks-reflections-show');
				}
			}
		}
	}	
});

app.add(
{
	name: 'util-project-story-board-tasks-reflections-show',
	code: function (param, response)
	{	
		var context = app.whoami().thisInstanceOfMe._userRole;

		var tasks = app.get( 
		{
			scope: 'util-project-story-board',
			context: 'tasks'
		});

		var reflections = app.get( 
		{
			scope: 'util-project-story-board',
			context: 'reflections',
			valueDefault: []
		});

		app.set(
		{
			scope: 'util-project-story-board',
			context: 'summary',
			name: 'reflections',
			value: reflections
		});

		var improvementCycle = app.get(
		{
			scope: 'util-setup',
			context: 'improvementCycle'
		});

		_.each(improvementCycle, function (improvementCycleItem)
		{
			improvementCycleItem.tasks = _.filter(tasks, function (task)
			{
				return (task.type == improvementCycleItem.task)
			});

			improvementCycleItem.taskIDs = _.map(improvementCycleItem.tasks, 'id')

			improvementCycleItem.reflections = _.filter(reflections, function (task)
			{
				return (_.includes(improvementCycleItem.taskIDs, reflection.objectcontext))
			});

			var storyBoardTasksReflectionsView = app.vq.init({queue: 'util-project-story-board-tasks-reflections-show'});

			if (improvementCycleItem.reflections.length == 0)
			{
				storyBoardTasksReflectionsView.add(
				[
					'<em class="text-muted">No reflections</em>'
				]);
			}
			else
			{
				storyBoardTasksReflectionsView.add(
				[
					'<table class="table">'
				]);

				_.each(improvementCycleItem.reflections, function (reflection)
				{
					storyBoardTasksReflectionsView.add(
					[
						'<tr>',
							'<td>',
								reflection.subject,
							'</td>',
						'</tr>'
					]);
				});

				storyBoardTasksReflectionsView.add(
				[
					'</table>'
				]);
			}

			//fix: needs to be all
			app.set(
			{
				scope: 'util-project-story-board',
				context: 'summary',
				name: 'improvement-cycle-reflections',
				value: improvementCycleItem.reflections
			});

			storyBoardTasksReflectionsView.render(_.join(['#', context, '-project-story-board-', improvementCycleItem.code, '-container-reflections'], ''));
		});
	}
});

app.add(
{
	name: 'util-project-story-board-accountability',
	code: function (param, response)
	{	
		var context = app.whoami().thisInstanceOfMe._userRole;

		var project = app.get(
		{
			scope: 'util-project-story-board',
			context: 'summary',
			name: 'project'
		});

		if (project == undefined)
		{
			app.invoke('util-project-story-board-accountability-show');
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'action',
					fields: 
					[
						'reference',
						'date',
						'subject',
						'description',
						'type',
						'typetext',
						'guid',
						'createdusertext'
					],
					filters:
					[
						{
							field: 'object',
							value: app.whoami().mySetup.objects.project
						},
						{
							field: 'objectcontext',
							value: project.id
						},
						{
							field: 'type',
							comparison: 'IN_LIST',
							value: app.whoami().mySetup.actionTypes.accountabilityImprovementCycle
						}
					],
					sorts:
					[
						{
							field: 'type',
							direction: 'asc'
						},
						{
							field: 'date',
							direction: 'asc'
						}
					],
					set: 
					{
						scope: 'util-project-story-board',
						context: 'accountability'
					},
					callback: 'util-project-story-board-accountability'
				});
			}
			else
			{
				if (response.status == 'OK')
				{
					app.invoke('util-project-story-board-accountability-show');
				}
			}
		}
	}	
});

app.add(
{
	name: 'util-project-story-board-accountability-show',
	code: function (param, response)
	{	
		var context = app.whoami().thisInstanceOfMe._userRole;

		var accountability = app.get( 
		{
			scope: 'util-project-story-board',
			context: 'accountability',
			valueDefault: []
		});

		app.set(
		{
			scope: 'util-project-story-board',
			context: 'summary',
			name: 'accountability',
			value: accountability
		});

		var storyBoardAccountabilityView = app.vq.init({queue: 'util-project-story-board-accountability-show'});

		if (accountability.length == 0)
		{
			storyBoardAccountabilityView.add(
			[
				'<div class="mb-2"><em>No feedback.</em></div>'
			]);
		}
		else
		{
			storyBoardAccountabilityView.add(
			[
				'<table class="table">'
			]);

			_.each(accountability, function (accountability)
			{
				storyBoardAccountabilityView.add(
				[
					'<tr class="d-flex">',
						'<td class="col-1 pl-1">',
							(accountability.type==app.whoami().mySetup.actionTypes.accountabilityFitForPurpose?
								'<i class="fa fa-plus fa-fw text-success"></i>':'<i class="fa fa-minus fa-fw text-danger"></i>'),
						'</td>',
						'<td class="col-11">',
							'<div>', accountability.subject, '</div>',
							'<div class="text-muted small mt-1">', accountability.description, '</div>',
							'<div class="text-muted small mt-2"><em>', accountability.createdusertext, '</em></div>',
						'</td>',
					'</tr>'
				]);
			});

			storyBoardAccountabilityView.add(
			[
				'</table>'
			]);
		}

		storyBoardAccountabilityView.render(_.join(['#', context, '-util-project-story-board-accountability-container'], ''));
	}
});

app.add(
{
	name: 'util-project-story-board-tasks-images',
	code: function (param, response)
	{	
		var context = app.whoami().thisInstanceOfMe._userRole;

		var tasks = app.get( 
		{
			scope: 'util-project-story-board',
			context: 'tasks'
		});

		var taskIDs = _.map(tasks, 'id');

		var projectID = app.get(
		{
			scope: context + '-project-summary',
			context: 'id'
		});

		if (tasks.length != 0)
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
						'object',
						'objectcontext'
					],
					filters:
					[
						{
							field: 'object',
							value: app.whoami().mySetup.objects.projectTask
						},
						{
							field: 'objectcontext',
							comparison: 'IN_LIST',
							value: taskIDs
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
					set: 
					{
						scope: 'util-project-story-board',
						context: 'images'
					},
					customOptions: [{name: 'object', value: app.whoami().mySetup.objects.project}],
					callback: 'util-project-story-board-tasks-images'
				});
			}
			else
			{
				if (response.status == 'OK')
				{
					app.invoke('util-project-story-board-tasks-images-show');
				}
			}
		}
	}	
});

app.add(
{
	name: 'util-project-story-board-tasks-images-show',
	code: function (param, response)
	{	
		var context = app.whoami().thisInstanceOfMe._userRole;

		var tasks = app.get( 
		{
			scope: 'util-project-story-board',
			context: 'tasks'
		});

		var images = app.get( 
		{
			scope: 'util-project-story-board',
			context: 'images',
			valueDefault: []
		});

		app.set(
		{
			scope: 'util-project-story-board',
			context: 'summary',
			name: 'images',
			value: images
		});

		var improvementCycle = app.get(
		{
			scope: 'util-setup',
			context: 'improvementCycle'
		});

		_.each(improvementCycle, function (improvementCycleItem)
		{
			improvementCycleItem.tasks = _.filter(tasks, function (task)
			{
				return (task.type == improvementCycleItem.task)
			});

			improvementCycleItem.taskIDs = _.map(improvementCycleItem.tasks, 'id')

			improvementCycleItem.images = _.filter(images, function (image)
			{
				return (_.includes(improvementCycleItem.taskIDs, image.objectcontext))
			});

			var storyBoardTasksImagesView = app.vq.init({queue: 'util-project-story-board-tasks-images-show'});

			if (improvementCycleItem.images.length == 0)
			{
				storyBoardTasksImagesView.add('');
			}
			else
			{

				storyBoardTasksImagesView.add(
				[
					'<div class="row">'
				]);

				_.each(improvementCycleItem.images, function (image)
				{
					storyBoardTasksImagesView.add(
					[
						'<div class="col-sm-6 mb-3 mt-1">',
							'<a href="', image.download, '" target="_self"><img class="img-fluid rounded float-left" src="', image.download, '"></a>',
						'</div>'
					]);
				});

				storyBoardTasksImagesView.add(
				[
					'</div>'
				]);
			}

			//fix: needs to be all
			app.set(
			{
				scope: 'util-project-story-board',
				context: 'summary',
				name: 'improvement-cycle-images',
				value: improvementCycleItem.images
			});

			storyBoardTasksImagesView.render(_.join(['#', context, '-project-story-board-', improvementCycleItem.code, '-container-images'], ''));
		});
	}
});

//----- CAROUSEL BASED VIEW OF TASK IMAGES

app.add(
{
	name: 'util-project-story-board-carousel',
	code: function (param, response)
	{	
		var context = app.whoami().thisInstanceOfMe._userRole;

		var tasks = app.get( 
		{
			scope: 'util-project-story-board',
			context: 'tasks'
		});

		var taskIDs = _.map(tasks, 'id');

		var projectID = app.get(
		{
			scope: context + '-project-summary',
			context: 'id'
		});

		if (tasks.length == 0)
		{
			var storyBoardView = app.vq.init({queue: 'util-project-story-board-init'});

			storyBoardView.add(
			[
				'<div class="p-4 text-muted text-center">',
					'This project does not have any to do tasks.',
				'</div>'
			]);

			storyBoardView.render('#' + context + '-project-story-board-view');
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
						'object',
						'objectcontext'
					],
					filters:
					[
						{
							field: 'object',
							value: app.whoami().mySetup.objects.projectTask
						},
						{
							field: 'objectcontext',
							comparison: 'IN_LIST',
							value: taskIDs
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
					set: 
					{
						scope: 'util-project-story-board',
						context: 'images'
					},
					customOptions: [{name: 'object', value: app.whoami().mySetup.objects.projectTask}],
					callback: 'util-project-story-board-carousel'
				});
			}
			else
			{
				if (response.status == 'OK')
				{
					app.invoke('util-project-story-board-carousel-show');
				}
			}
		}
	}	
});

app.add(
{
	name: 'util-project-story-board-carousel-show',
	code: function (param, response)
	{		
		var context = app.whoami().thisInstanceOfMe._userRole;

		var improvementCycle = app.get(
		{
			scope: 'util-setup',
			context: 'improvementCycle'
		});

		var images = app.get( 
		{
			scope: 'util-project-story-board',
			context: 'images'
		});

		var tasks = app.get( 
		{
			scope: 'util-project-story-board',
			context: 'tasks'
		});

		var storyBoardView = app.vq.init({queue: 'util-project-story-board-init'});

		storyBoardView.add(
		[
			'<div class="container-fluid mt-4">',
				'<div class="card">',
					'<div class="card-body">'
		]);

		if (images.length == 0)
		{
			storyBoardView.add(
			[
				'<div class="text-muted text-center m-5">There are no to do tasks with images, so nothing to show.</div>'
			]);
		}
		else
		{
			storyBoardView.add(
			[
				'<div id="util-project-story-board-carousel" class="carousel slide" data-interval="false" data-ride="carousel" style="min-height:500px;">',
					'<ul class="carousel-indicators">'
			]);

			_.each(images, function (image, i)
			{
				storyBoardView.add(
				[	
					'<li data-target="#util-project-story-board-carousel"',
							' data-slide-to="', i, '" class="', (i==0?' active':''), '"></li>'
				]);
			});

			storyBoardView.add(
			[
				'</ul>',
				'<div class="carousel-inner">'
			]);

			_.each(images, function (image, i)
			{
				image.task = _.find(tasks, function (task)
				{
					return image.objectcontext == task.id
				});

				image.caption = '';

				/*
				causing issue with previous / next.

				'<div class="progress progress-small mb-2 mt-2">' +
								'<div class="progress-bar" style="width: ' + image.task.percentagecomplete + '%;" role="progressbar" aria-valuenow="' + image.task.percentagecomplete + '" aria-valuemin="0" aria-valuemax="100"></div>',
							'</div>'
				*/

				if (image.task != undefined)
				{
					image.caption = 
						'<div style="background-color:rgba(0,0,0,0.4); border-radius: 6px; padding:4px; padding-left:20px; padding-right:20px;">' +
							'<h3 class="text-white font-weight-bold">' + image.task.description + '</h3>' +
							'<div class="mb-2">' + image.task.typetext + ', ' + image.task.percentagecomplete + '%</div>' +
						'</div>'
				}

				storyBoardView.add(
				[	
					'<div class="carousel-item', (i==0?' active':''), '">',
						'<img class="w-100" src="', image.download, '">',
						'<div class="carousel-caption">',
							image.caption,
						'</div>',
					'</div>'
				]);
			});

			storyBoardView.add(
			[
				'</div>'
			]);

			storyBoardView.add(
			[
				'<a class="carousel-control-prev" href="#util-project-story-board-carousel" data-slide="prev">',
					'<span class="carousel-control-prev-icon"></span>',
				'</a>',
				'<a class="carousel-control-next" href="#util-project-story-board-carousel" data-slide="next">',
					'<span class="carousel-control-next-icon"></span>',
				'</a>'
			]);

			storyBoardView.add(
			[
				'</div>'
			]);
		}

		storyBoardView.add(
		[
					'</div>',
				'</div>',
			'</div>'
		]);

		storyBoardView.render('#' + context + '-project-story-board-view');
	}
})

//--- EDIT TASKS, ACTIONS

app.add(
{
	name: 'util-project-story-board-edit',
	code: function (param, response)
	{		
		var context = app.whoami().thisInstanceOfMe._userRole;
		
		var improvementCycle = app.get(
		{
			scope: 'util-setup',
			context: 'improvementCycle'
		});

		var storyBoardView = app.vq.init({queue: 'util-project-story-board-init'});

		storyBoardView.add(
		[
			'<div class="container-fluid">',
				'<div class="row">',
					'<div class="col-12">'
		]);

		storyBoardView.add(
		[
			'<ul class="nav nav-tabs mb-4">'
		]);

		/*storyBoardView.add(
		[	
			'<li class="nav-item myds-tab">',
				'<a class="nav-link active" data-toggle="tab"',
						' href="#util-project-story-board-edit-overview"',
						' data-controller="util-project-story-board-overview-show"',
						' data-context="overview"',
				'><span class="d-none d-md-inline" style="font-size:0.85rem;">',
					'Objective',
					'</span></a>',
			'</li>'
		]);*/

		_.each(improvementCycle, function (improvementCycleItem, iCI)
		{
			improvementCycleItem._header = improvementCycleItem.captionVerb;
			
			if (_.isSet(improvementCycleItem.alternateCaptionVerb))
			{
				improvementCycleItem._header = (improvementCycleItem.icon==undefined?'':improvementCycleItem.icon) +
					improvementCycleItem.alternateCaptionVerb;
			}

		  	storyBoardView.add(
			[	
				'<li class="nav-item myds-tab">',
 					'<a class="nav-link', (iCI==0?' active':''), '" data-toggle="tab"',
 							' href="#util-project-story-board-', improvementCycleItem.code, '"',
 							' data-controller="util-project-story-board-edit-show"',
							' data-context="', improvementCycleItem.code, '"',
 					'><span class="d-none d-md-inline" style="font-size:0.85rem;">',
 						improvementCycleItem._header,
 						'</span></a>',
				'</li>'
			]);
		});

		storyBoardView.add(
		[
			'</ul>',
			'<div class="tab-content">'
		]);

		var project = app.get(
		{
			scope: 'util-project-story-board',
			context: 'summary',
			name: 'project'
		});

		/*storyBoardView.add(
		[
			'<div class="tab-pane active" id="util-project-story-board-edit-overview">',
				'<div class="p-2 pb-0"',
						' id="util-project-story-board-edit-overview-container"',
				'>',	
					'<div class="card">',
						'<div class="card-body border-bottom font-weight-bold">',
							project.notes,
						'</div>',
						'<div id="util-project-story-board-edit-files-container"></div>',
						'<div id="util-project-story-board-edit-template-info-container"></div>',
					'</div>',
				'</div>',
			'</div>'
		]);*/

		_.each(improvementCycle, function (improvementCycleItem, iCI)
		{
			storyBoardView.add(
			[
				'<div class="tab-pane', (iCI==0?' active':''), '" id="util-project-story-board-', improvementCycleItem.code, '">',
					'<div class="p-2 pb-0"',
							' id="util-project-story-board-',
								improvementCycleItem.code, '-container"',
					'>',	
						'<div class="card">',
							'<div class="card-header pb-0">',
								'<div class="row">',
									'<div class="col-10">',
										'<h4 class="mt-2 mb-0">To Do Tasks</h4>',
									'</div>',
									'<div class="d-none col-2 text-right">',
										'<button type="button" class="btn btn-sm btn-primary mb-2" aria-expanded="false"',
												' data-toggle="collapse" role="button"', 
                   								' href="#util-project-story-board-edit-',
												   improvementCycleItem.code, '-task-edit-container"',
										'>',
										'<i class="fa fa-plus fa-fw"></i>',
										'</button>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="collapse myds-collapse"',
								' id="util-project-story-board-edit-',
										improvementCycleItem.code, '-task-edit-container"',
								' data-controller="util-project-story-task-edit"',
								' data-project=""',
							'>',
								'<div class="card-body border-bottom mb-3">',
									app.invoke('util-project-story-board-edit-task-edit', {improvementCycleItem: improvementCycleItem}),
								'</div>',
							'</div>',
							'<div class="card-body">',
								'<div class="mb-3"',
									' id="util-project-story-board-edit-',
										improvementCycleItem.code, '-container-tasks">',
								'</div>',
							'</div>',
						'</div>',
						'<div class="card d-none">',
							'<div class="card-header pb-0">',
								'<div class="row">',
									'<div class="col-10">',
										'<h4 class="mt-2 mb-0">Reflections</h4>',
									'</div>',
									'<div class="col-2 text-right">',
									'<button type="button" class="btn btn-sm btn-primary mb-2" aria-expanded="false"',
											' data-toggle="collapse" role="button"', 
											' href="#util-project-story-board-edit-',
											improvementCycleItem.code, '-reflection-edit-container"',
									'>',
										'<i class="fa fa-plus fa-fw"></i>',
										'</button>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="collapse myds-collapse"',
								' id="util-project-story-board-edit-',
										improvementCycleItem.code, '-reflection-edit-container"',
								' data-controller="util-project-story-reflection-edit"',
								' data-project=""',
							'>',
								'<div class="card-body border-bottom mb-3">',
								app.invoke('util-project-story-board-edit-reflection-edit', {improvementCycleItem: improvementCycleItem}),
								'</div>',
							'</div>',
							'<div class="card-body">',
								'<div class="mb-2"',
									' id="util-project-story-board-edit-',
										improvementCycleItem.code, '-container-reflections">',
								'</div>',
							'</div>',
						'</div>',
					'</div>',	
				'</div>',
			]);
		});
		  					
		storyBoardView.add(
		[
			'</div></div></div>'
		]);

		storyBoardView.add(
		[		
			'</div>',
				
		]);

		storyBoardView.render('#' + context + '-project-story-board-view');

		app.invoke('util-project-story-board-edit-files');
		app.invoke('util-project-story-board-edit-accountability');
		app.invoke('util-project-story-board-edit-show', {context: 'listen'});
	}
});

app.add(
{
	name: 'util-project-story-board-edit-task-edit',
	code: function (param)
	{	
		var improvementCycleItemCode = '';
		var improvementCycleItemTaskType;
		var taskID = '';
		var containerSelector;

		if (_.has(param, 'dataContext'))
		{
			taskID = app._util.param.get(param.dataContext, 'context', {default: ''}).value;
			containerSelector = '#' + app._util.param.get(param.dataContext, 'scope').value;
			improvementCycleItemCode = app._util.param.get(param.dataContext, 'improvementCycleCode', {default: ''}).value;
			improvementCycleItemType = app._util.param.get(param.dataContext, 'improvementCycleType', {default: ''}).value;
		}
		else
		{
			var improvementCycleItem = app._util.param.get(param, 'improvementCycleItem').value;
			improvementCycleItemCode = improvementCycleItem.code;
			improvementCycleItemTaskType = improvementCycleItem.type;
		}

		var storyBoardViewTaskEdit = app.vq.init({queue: 'util-project-story-board-task-edit'});

		var tasks = app.get(
		{
			scope: 'util-project-story-board-edit',
			context: 'tasks'
		});

		var taskData = _.find(tasks, function (task)
		{
			return task.id == taskID
		});

		if (taskData == undefined)
		{
			taskData =
			{
				id: taskID,
				title: '',
				description: '',
				displayorder: ''
			}
		}
	
		storyBoardViewTaskEdit.template(
		[
			'<div class="mt-4">',
				'<div class="form-group">',
					'<h4><label class="text-muted mb-1" for="util-project-story-board-edit-', improvementCycleItemCode, '-task-edit-title">Subject</label></h4>',
					'<input type="text" class="form-control myds-text" id="util-project-story-board-edit-', improvementCycleItemCode, '-task-edit-title"',
					'data-scope="util-project-story-board-edit-' + improvementCycleItemCode + '-task-edit-{{id}}"',
					'data-context="title" value="{{title}}">',
				'</div>',
				'<div class="form-group">',
					'<h4><label class="text-muted mb-1" for="learning-partner-project-summary-task-edit-description">Description</label></h4>',
					'<textarea style="height:150px;" class="form-control myds-text myds-validate" data-validate-mandatory id="learning-partner-project-summary-task-edit-" data-id="{{id}}" data-scope="util-project-story-board-edit-' + improvementCycleItemCode + '-task-edit-{{id}}" data-context="description">{{description}}</textarea>',
				'</div>',
				'<div class="form-group">',
					'<h4><label class="text-muted mb-1" for="learning-partner-project-summary-task-edit-displayorder">Sequence #</label></h4>',
					'<input type="text" class="form-control myds-text"',
					'id="learning-partner-project-summary-task-edit-displayorder"',
					'data-scope="util-project-story-board-edit-' + improvementCycleItemCode + '-task-edit-{{id}}"',
					'data-context="displayorder" value="{{displayorder}}">',
				'</div>',
				'<div class="form-group text-center mb-0">',
					'<button type="button" class="btn btn-sm btn-default btn-outline mr-2 mb-3 myds-click"',
					'data-taskcode="', improvementCycleItemCode, '"',
					'data-tasktype="', improvementCycleItemTaskType, '"',
					'data-id="{{id}}"',
					'data-controller="util-project-story-board-edit-task-edit-save"',
					'>',
						'Save',
					'</button>',
				'</div>',
			'</div>'
		]);

		storyBoardViewTaskEdit.add({useTemplate: true}, taskData);

		if (_.isSet(containerSelector))
		{
			if (param.status == 'shown')
			{
				storyBoardViewTaskEdit.render(containerSelector);
			}
		}
		else
		{
			return storyBoardViewTaskEdit.get();
		}
	}
});

app.add(
{
	name: 'util-project-story-board-edit-reflection-edit',
	code: function (param)
	{	
		var improvementCycleItem = app._util.param.get(param, 'improvementCycleItem').value;

		var storyBoardViewReflectionEdit = app.vq.init({queue: 'util-project-story-board-reflection-edit'});

		storyBoardViewReflectionEdit.add(
		[
			'<div class="form-group mt-2">',
				'<h4><label class="text-muted mb-1" for="{{context}}-reflection-edit-subject">Subject</label></h4>',
				'<input type="text" class="form-control myds-text"',
				' id="{{context}}-reflection-edit-subject"',
				' data-scope="{{context}}-reflection-edit"',
				' data-context="subject"',
				'>',
			'</div>',
			'<div class="form-group text-center mb-0">',
				'<button type="button" class="btn btn-default btn-outline btn-sm mr-2 mb-3 myds-click"',
				'data-context="', improvementCycleItem.code, '"',
				'data-tasktype="', improvementCycleItem.task, '"',
				'data-controller="util-project-story-board-edit-reflection-edit-save"',
				'>',
					'Save',
				'</button>',
			'</div>'
		]);

		return storyBoardViewReflectionEdit.get();
	}
});

app.add(
{
	name: 'util-project-story-board-edit-task-edit-save',
	code: function (param, response)
	{	
		var context = app.whoami().thisInstanceOfMe._userRole;
		var taskID = app._util.param.get(param.dataContext, 'id').value;
		var taskType = app._util.param.get(param.dataContext, 'tasktype').value;
		var taskCode = app._util.param.get(param.dataContext, 'taskCode').value;
		
		var project = app.get(
		{
			scope: 'util-project-story-board',
			context: 'summary',
			name: 'project'
		});

		var data = app.get(
		{
			controller: 'util-project-story-board-edit-' + taskCode + '-task-edit-' + taskID,
			cleanForCloudStorage: true,
			valueDefault: {},
			mergeDefault:
			{
				id: taskID,
				values:
				{
					project: project.id,
					type: taskType,
					taskbyuser: app.whoami().thisInstanceOfMe.user.id,
					startdate: moment().format('DD MMM YYYY'),
					priority: 2,
					status: app.whoami().mySetup.taskStatuses['Not Started']
				}
			}
		});

		if (_.isUndefined(response))
		{
			mydigitalstructure.cloud.save(
			{
				object: 'project_task',
				data: data,
				callback: 'util-project-story-board-edit-task-edit-save',
				callbackParam: param
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				if (taskID == '')
				{
					app.notify('Task added to the project.');
					
				}
				else
				{
					app.notify('Task updated.');
				}

				app.invoke('util-view-collapse', {context: 'util-project-story-board-edit-' + taskCode + '-task-edit-container-' + taskID});
				
				app.invoke('util-project-story-board-tasks', param)
			}
		}
	}
});

app.add(
{
	name: 'util-project-story-board-edit-files',
	code: function (param, response)
	{	
		var project = app.get(
		{
			scope: 'util-project-story-board',
			context: 'summary',
			name: 'project',
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
						value: project.id
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
				set: 
				{
					scope: 'util-project-story-board',
					context: 'project-files'
				},
				customOptions: [{name: 'object', value: app.whoami().mySetup.objects.project}],
				callback: 'util-project-story-board-edit-files'
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
						'<div class="card-body border-bottom">',
							'<ul class="pb-0">'
					]);

					_.each(response.data.rows, function (row)
					{
						row.link = row.url;
						if (row.link == '') {row.link = row.download}

						projectFilesView.add(
						[
							'<li><a href="', row.link, '" target="_blank">', row.link, '</li>'
						]);
					});

					projectFilesView.add(
					[
							'</ul>',
						'</div>'
					]);

					projectFilesView.render('#util-project-story-board-edit-files-container');
				}
			}
		}
	}	
});

app.add(
{
	name: 'util-project-story-board-edit-show',
	code: function (param, response)
	{	
		console.log(param)
		app.invoke('util-project-story-board-edit-tasks', param)
	}
});

app.add(
{
	name: 'util-project-story-board-edit-tasks',
	code: function (param, response)
	{	
		var context = app.whoami().thisInstanceOfMe._userRole;

		var guidProject = app.get(
		{
			scope: context + '-project-story-board',
			context: 'id'
		});

		if (guidProject == undefined || guidProject == '')
		{
			app.notify({message: 'Can not find the project.', type: 'error'});
			app.invoke('app-navigate-to', {controller: context + '-projects'});
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
						'reference',
						'title',
						'description',
						'type',
						'typetext',
						'notes',
						'displayorder',
						'enddate',
						'startdate',
						'createddate',
						'createdusertext',
						'percentagecomplete',
						'guid'
					],
					filters:
					[
						{
							field: 'projecttask.project.guid',
							value: guidProject
						}
					],
					sorts:
					[
						{
							field: 'type',
							direction: 'asc'
						},
						{
							field: 'startdate',
							direction: 'asc'
						}
					],
					set: 
					{
						scope: 'util-project-story-board-edit',
						context: 'tasks'
					},
					callback: 'util-project-story-board-edit-tasks'
				});
			}
			else
			{
				if (response.status == 'OK')
				{
					app.invoke('util-project-story-board-edit-tasks-show');
					app.invoke('util-project-story-board-edit-tasks-reflections');
					//app.invoke('util-project-story-board-tasks-images');
				}
			}
		}
	}	
});

app.add(
{
	name: 'util-project-story-board-edit-tasks-show',
	code: function (param, response)
	{	
		var context = app.whoami().thisInstanceOfMe._userRole;

		var tasks = app.get( 
		{
			scope: 'util-project-story-board-edit',
			context: 'tasks'
		});

		app.set(
		{
			scope: 'util-project-story-board-edit',
			context: 'summary',
			name: 'tasks',
			value: tasks
		});

		var improvementCycle = app.get(
		{
			scope: 'util-setup',
			context: 'improvementCycle'
		});

		_.each(improvementCycle, function (improvementCycleItem)
		{
			improvementCycleItem.tasks = _.filter(tasks, function (task)
			{
				return (task.type == improvementCycleItem.task)
			});

			var storyBoardTasksView = app.vq.init({queue: 'util-project-story-board-tasks-show'});

			if (improvementCycleItem.tasks.length == 0)
			{
				storyBoardTasksView.add(
				[
					'<em class="text-muted">No tasks</em>'
				]);
			}
			else
			{
				storyBoardTasksView.add(
				[
					'<ul class="list-group mb-2">'
				]);

				_.each(improvementCycleItem.tasks, function (task)
				{
					storyBoardTasksView.add(
					[
						'<li class="list-group-item">',
							'<div class="row align-items-end">',
								'<div class="col myds-navigate" data-controller="learning-partner-task-summary" data-context="', task.guid, '">',
									'<h4 class="mb-0">', task.title, '</h4>',
									'<div class="text-muted small">', task.statustext, '</div>',
									'<div class="text-muted small">', task.percentagecomplete, '%</div>',
									'<div class="progress progress-small mb-1">',
										'<div class="progress-bar" style="width: ', task.percentagecomplete, '%;" role="progressbar" aria-valuenow="', task.percentagecomplete, '" aria-valuemin="0" aria-valuemax="100"></div>',
									'</div>',
								'</div>',
								'<div class="col-auto text-right">',
									'<button type="button" class="btn btn-sm btn-white" aria-expanded="false" data-toggle="collapse" role="button" href="#util-project-story-board-edit-listen-task-edit-container-', task.id, '" data-id="', task.id, '"><i class="fa fa-edit fa-fw"></i></button>',
									'<div class="d-none btn-group mb-3" role="group">',
										'<a class="d-none btn btn-white btn-sm" role="button" data-toggle="collapse" href="#learning-partner-project-summary-attachments-link"><i class="fa fa-link fa-fw"></i></a>',
										'<a class="d-none btn btn-white btn-sm" role="button" data-toggle="collapse" href="#learning-partner-project-summary-attachments-upload"><i class="fa fa-cloud-upload-alt fa-fw"></i></a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="row">',
								'<div class="myds-collapse collapse" id="util-project-story-board-edit-', improvementCycleItem.code ,'-task-edit-container-', task.id, '"',
									' data-context="', task.id, '"',
									' data-scope="util-project-story-board-edit-listen-task-edit-container-', task.id, '"',
									' data-controller="util-project-story-board-edit-task-edit"',
									' data-improvement-cycle-code="', improvementCycleItem.code ,'"',
									' data-improvement-cycle-tasktype="', improvementCycleItem.task ,'"',
									'>',
								'</div>',
							'</div>',
						'</li>'
					]);
				});

				storyBoardTasksView.add(
				[
					'</ul>'
				]);
			}

			app.set(
			{
				scope: 'util-project-story-board-edit',
				context: 'summary',
				name: 'improvement-cycle-tasks',
				value: improvementCycleItem.tasks
			});

			storyBoardTasksView.render(_.join(['#', 'util-project-story-board-edit-', improvementCycleItem.code, '-container-tasks'], ''));
		});
	}
});

app.add(
{
	name: 'util-project-story-board-edit-tasks-reflections',
	code: function (param, response)
	{	
		var context = app.whoami().thisInstanceOfMe._userRole;

		var tasks = app.get( 
		{
			scope: 'util-project-story-board',
			context: 'tasks'
		});

		var taskIDs = _.map(tasks, 'id');

		if (tasks.length == 0)
		{
			app.invoke('util-project-story-board-edit-tasks-reflections-show');
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'action',
					fields: 
					[
						'reference',
						'date',
						'subject',
						'description',
						'guid',
						'object',
						'objectcontext'
					],
					filters:
					[
						{
							field: 'object',
							value: app.whoami().mySetup.objects.projectTask
						},
						{
							field: 'objectcontext',
							comparison: 'IN_LIST',
							value: taskIDs
						},
						{
							field: 'type',
							comparison: 'IN_LIST',
							value: app.whoami().mySetup.actionTypes.reflection
						}
					],
					sorts:
					[
						{
							field: 'type',
							direction: 'asc'
						},
						{
							field: 'date',
							direction: 'asc'
						}
					],
					set: 
					{
						scope: 'util-project-story-board',
						context: 'reflections'
					},
					callback: 'util-project-story-board-edit-tasks-reflections'
				});
			}
			else
			{
				if (response.status == 'OK')
				{
					app.invoke('util-project-story-board-edit-tasks-reflections-show');
				}
			}
		}
	}	
});

app.add(
{
	name: 'util-project-story-board-edit-tasks-reflections-show',
	code: function (param, response)
	{	
		var context = app.whoami().thisInstanceOfMe._userRole;

		var tasks = app.get( 
		{
			scope: 'util-project-story-board-edit',
			context: 'tasks'
		});

		var reflections = app.get( 
		{
			scope: 'util-project-story-board-edit',
			context: 'reflections',
			valueDefault: []
		});

		app.set(
		{
			scope: 'util-project-story-board-edit',
			context: 'summary',
			name: 'reflections',
			value: reflections
		});

		var improvementCycle = app.get(
		{
			scope: 'util-setup',
			context: 'improvementCycle'
		});

		_.each(improvementCycle, function (improvementCycleItem)
		{
			improvementCycleItem.tasks = _.filter(tasks, function (task)
			{
				return (task.type == improvementCycleItem.task)
			});

			improvementCycleItem.taskIDs = _.map(improvementCycleItem.tasks, 'id')

			improvementCycleItem.reflections = _.filter(reflections, function (task)
			{
				return (_.includes(improvementCycleItem.taskIDs, relection.objectcontext))
			});

			var storyBoardTasksReflectionsView = app.vq.init({queue: 'util-project-story-board-edit-tasks-reflections-show'});

			if (improvementCycleItem.reflections.length == 0)
			{
				storyBoardTasksReflectionsView.add(
				[
					'<em class="text-muted">No reflections</em>'
				]);
			}
			else
			{
				storyBoardTasksReflectionsView.add(
				[
					'<table class="table">'
				]);

				_.each(improvementCycleItem.reflections, function (reflection)
				{
					storyBoardTasksReflectionsView.add(
					[
						'<tr>',
							'<td>',
								reflection.subject,
							'</td>',
						'</tr>'
					]);
				});

				storyBoardTasksReflectionsView.add(
				[
					'</table>'
				]);
			}

			//fix: needs to be all
			app.set(
			{
				scope: 'util-project-story-board',
				context: 'summary',
				name: 'improvement-cycle-reflections',
				value: improvementCycleItem.reflections
			});

			storyBoardTasksReflectionsView.render(_.join(['#', 'util-project-story-board-edit-', improvementCycleItem.code, '-container-reflections'], ''));
		});
	}
});


app.add(
{
	name: 'util-project-story-board-edit-accountability',
	code: function (param, response)
	{	
		var context = app.whoami().thisInstanceOfMe._userRole;

		var project = app.get(
		{
			scope: 'util-project-story-board',
			context: 'summary',
			name: 'project'
		});

		if (project == undefined)
		{
			app.invoke('util-project-story-board-edit-accountability-show');
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'action',
					fields: 
					[
						'reference',
						'date',
						'subject',
						'description',
						'type',
						'typetext',
						'guid'
					],
					filters:
					[
						{
							field: 'object',
							value: app.whoami().mySetup.objects.project
						},
						{
							field: 'objectcontext',
							value: project.id
						},
						{
							field: 'type',
							comparison: 'IN_LIST',
							value: app.whoami().mySetup.actionTypes.accountabilityImprovementCycle
						}
					],
					sorts:
					[
						{
							field: 'type',
							direction: 'asc'
						},
						{
							field: 'date',
							direction: 'asc'
						}
					],
					set: 
					{
						scope: 'util-project-story-board',
						context: 'accountability'
					},
					callback: 'util-project-story-board-edit-accountability'
				});
			}
			else
			{
				if (response.status == 'OK')
				{
					app.invoke('util-project-story-board-edit-accountability-show');
				}
			}
		}
	}	
});

app.add(
{
	name: 'util-project-story-board-edit-accountability-show',
	code: function (param, response)
	{	
		var context = app.whoami().thisInstanceOfMe._userRole;

		var accountability = app.get( 
		{
			scope: 'util-project-story-board',
			context: 'accountability',
			valueDefault: []
		});

		app.set(
		{
			scope: 'util-project-story-board',
			context: 'summary',
			name: 'accountability',
			value: accountability
		});

		var storyBoardAccountabilityView = app.vq.init({queue: 'util-project-story-board-edit-accountability-show'});

		if (accountability.length == 0)
		{
			storyBoardAccountabilityView.add(
			[
				'<div class="mb-2"><em>No feedback.</em></div>'
			]);
		}
		else
		{
			storyBoardAccountabilityView.add(
			[
				'<table class="table">'
			]);

			_.each(accountability, function (accountability)
			{
				storyBoardAccountabilityView.add(
				[
					'<tr class="d-flex">',
						'<td class="col-1 pl-1">',
							(accountability.type==app.whoami().mySetup.actionTypes.accountabilityFitForPurpose?
								'<i class="fa fa-plus fa-fw text-success"></i>':'<i class="fa fa-minus fa-fw text-danger"></i>'),
						'</td>',
						'<td class="col-11">',
							'<div>', accountability.subject, '</div>',
							'<div class="text-muted small mt-1">', accountability.description, '</div>',
						'</td>',
					'</tr>'
				]);
			});

			storyBoardAccountabilityView.add(
			[
				'</table>'
			]);
		}

		storyBoardAccountabilityView.render(_.join(['#', context, '-util-project-story-board-edit-accountability-container'], ''));
	}
});
