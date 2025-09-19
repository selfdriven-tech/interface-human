``
/* Project DO */

app.add(
{
	name: 'util-project-do',
	code: function (param, response)
	{	
		var guid = app._util.param.get(param, 'id').value;

		if (guid == undefined || guid == '')
		{
			app.notify({message: 'Can not find the project.', type: 'error'});
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
						'reference',
						'description',
						'type',
						'typetext',
						'subtype',
						'subtypetext',
						'category',
						'categorytext',
						'status',
						'statustext',
						'enddate',
						'startdate',
						'guid',
						'notes',
						'sourceprojecttemplate'
					],
					filters:
					[
						{
							field: 'guid',
							value: guid
						}
					],
					callback: 'util-project-do',
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
					}
					else
					{
						var project = _.first(response.data.rows);

						app.set(
						{
							scope: 'util-project-do',
							context: 'project',
							value: project
						});

						if (_.isNotSet(project.sourceprojecttemplate))
						{
							app.notify({type: 'error', message: 'Can not find the source template project.'});
						}
						else
						{
							app.invoke('util-template-get-definition-from-file',
							{
								objectContext: project.sourceprojecttemplate,
								onComplete: 'util-project-do-process'
							});
						}
					}
				}
			}
		}
	}
});

app.add(
{
	name: 'util-project-do-process',
	code: function (param)
	{
		console.log(param);

		var project = app.get(
		{
			scope: 'util-project-do',
			context: 'project'
		});

		app.view.refresh(
		{
			scope: 'learner-project-do',
			selector: '#learner-project-do',
			data: project
		});

		if (_.has(param, 'templateDefinition.template.definition'))
		{
			var template = app.set(
			{
				scope: 'util-project-do',
				context: 'template',
				value: param.templateDefinition.template.definition
			});


			if (_.has(template, 'sharing.resources'))
			{
				var headerView = app.vq.init({queue: 'header-view'});

				if (_.isArray(template.sharing.resources))
				{
					_.each(template.sharing.resources, function (resource)
					{
						if (resource.type == 'image-thumbnail')
						{
							if (_.isSet(resource.url))
							{
								headerView.add(
								[
									'<a href="', resource.url, '" target="_blank">'
								]);
							}

							headerView.add(
							[
								'<img src="', resource.imageURL, '" class="img-fluid shadow rounded-lg" style="height:60px;">'
							]);

							if (_.isSet(resource.url))
							{
								headerView.add('</a>')
							}
						}
					})
				}

				headerView.render('#learner-project-do-header-view')
			}

			if (!_.isArray(template.milestones))
			{}
			else
			{
				$('#learner-project-do-header-actions-view').addClass('d-none');
				app.invoke('util-project-do-project-tasks', param)
			}
		}
	}
});

app.add(
{
	name: 'util-project-do-project-tasks',
	notes: 'Get the tasks associated with the project for tracking progress and reflections',
	code: function (param, response)
	{
		var project = app.get(
		{
			scope: 'util-project-do',
			context: 'project'
		});

		if (project != undefined)
		{
			if (response == undefined)
			{
				var filters = 
				[
					{
						field: 'project',
						value: project.id
					}
				];

				entityos.cloud.search(
				{
					object: 'project_task',
					fields: ['id', 'guid', 'status', 'percentagecomplete', 'notes'],
					filters: filters,
					callback: 'util-project-do-project-tasks',
					callbackParam: param
				});
			}
			else
			{
				app.set(
				{
					scope: 'util-project-do',
					context: 'project-tasks',
					value: response.data.rows
				});

				app.invoke('util-project-do-project-task-hashes', param);
			}
		}
	}
});

app.add(
{
	name: 'util-project-do-project-task-hashes',
	code: function (param, response)
	{
		var projectTasks = app.get(
		{
			scope: 'util-project-do',
			context: 'project-tasks'
		});

		var template = app.get(
		{
			scope: 'util-project-do',
			context: 'template'
		});

		app.set(
		{
			scope: 'util-project-do',
			context: 'project-task-hashes',
			value: []
		});

		if (projectTasks.length == 0)
		{
			app.invoke('util-project-do-init', param);
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
						value: _.map(projectTasks, 'id')
					},
					{
						field: 'type',
						value: 2
					}
				];

				entityos.cloud.search(
				{
					object: 'core_protect_ciphertext',
					fields: ['ciphertext', 'objectcontext'],
					filters: filters,
					callback: 'util-project-do-project-task-hashes',
					callbackParam: param
				});
			}
			else
			{
				var hashes = response.data.rows;

				_.each(hashes, function (hash)
				{
					hash._projectTask = _.find(projectTasks, function(projectTask) {return projectTask.id == hash.objectcontext});
					if (hash._projectTask != undefined)
					{
						hash.projectTaskID = hash._projectTask.id;
						hash.projectTaskGUID = hash._projectTask.guid;
					}
				});

				_.each(projectTasks, function (projectTask)
				{
					projectTask._hash = _.find(hashes, function(hash) {return projectTask.id == hash.objectcontext});
					if (projectTask._hash != undefined)
					{
						projectTask.hash = projectTask._hash.ciphertext;
					}
				});

				app.set(
				{
					scope: 'util-project-do',
					context: 'project-task-hashes',
					value: hashes
				});

				app.set(
				{
					scope: 'util-project-do',
					context: 'project-tasks',
					value: projectTasks
				});

				app.set(
				{
					scope: 'util-project-do',
					context: 'template',
					value: template
				});

				app.invoke('util-project-do-init', param);
			}
		}
	}
});

app.add(
{
	name: 'util-project-do-init',
	code: function (param)
	{
		// Init the array of progress of tasks and which:
		// - milestones are in-active
		// - and within milestones which tasks

		var template = app.get(
		{
			scope: 'util-project-do',
			context: 'template'
		});

		var hashes = app.get(
		{
			scope: 'util-project-do',
			context: 'project-task-hashes'
		});

		if (_.isSet(template, 'milestones'))
		{
			template._current = {};

			_.each(template.milestones, function (milestone)
			{
				_.each(milestone.tasks, function (milestoneTask, milestoneTaskIndex)
				{
					milestoneTask._canBeEdited = (template.type == 'project');
					milestoneTask._status = 'todo';
					milestoneTask._currentTask = false;

					app.invoke('util-templates-task-hash',
					{
						task: milestoneTask,
						milestone: milestone
					});

					milestoneTask._hash = _.find(hashes, function(hash) {return milestoneTask.hash == hash.ciphertext});
					if (milestoneTask._hash != undefined)
					{
						milestoneTask._projectTask = milestoneTask._hash._projectTask;
						milestoneTask._canBeEdited = (milestoneTask._projectTask.status == app.whoami().mySetup.projectTaskStatuses.complete);
						milestoneTask._status = 'complete';
					}

					if (template._current.task == undefined && milestoneTask._status == 'todo')
					{
						milestoneTask._canBeEdited = true;
						milestoneTask._currentTask = true;
						template._current.task = milestoneTask;
					}					
				});

				milestone._status = 
				{
					todo: _.filter(milestone.tasks, function (milestoneTask) {return (milestoneTask._status == 'todo')}).length,
					complete: _.filter(milestone.tasks, function (milestoneTask) {return (milestoneTask._status == 'complete')}).length
				}

				if (template._current.milestone == undefined && milestone._status.todo != 0)
				{
					milestone._canBeEdited = true;
					template._current.milestone = milestone;
				}
				else
				{
					milestone._canBeEdited =  (template.type == 'project');
				}
			});
		}
		
		app.set(
		{
			scope: 'util-project-do',
			context: 'template',
			value: template
		});

		param.templateDefinition = {template: {definition: template}}
		app.invoke('util-project-do-show', param);
	}
});

app.add(
{
	name: 'util-project-do-show',
	code: function (param)
	{
		let templateDefinition = param.templateDefinition;
		var type = _.first(_.keys(templateDefinition.template));

		entityos._util.data.set(
		{
			scope: 'util-project-do-show',
			context: 'template-type',
			value: type
		});

		var template = app.set(
		{
			scope: 'util-project-do',
			context: 'template',
			value: templateDefinition.template[type]
		});

		if (template.milestones.length == 1)
		{
			var milestone = _.first(template.milestones);

			app.set(
			{
				scope: 'util-project-do',
				context: 'milestone',
				value: milestone
			});

			app.invoke('util-project-do-milestone-init', param);
		}
		else if (template.milestones.length > 1)
		{
			app.invoke('util-project-do-milestones', param);
		}
	}
});


app.add(
{
	name: 'util-project-do-milestones',
	code: function (param)
	{
		var template = app.get(
		{
			scope: 'util-project-do',
			context: 'template'
		});

		var milestonesView = app.vq.init({queue: 'util-project-do-milestones'});

		if (_.isSet(template.description))
		{
			milestonesView.add(
			[
				'<div class="row mt-4">',
					'<div class="col-12 pr-md-5">',
						'<h2 class="mb-0">', template.description, '</h2>',
					'</div>',
				'</div>'
			]);
		}

		if (_.isSet(template.summary))
		{
			milestonesView.add(
			[
				'<div class="row mt-4">',
					'<div class="col-12 pr-md-5 lead text-secondary">',
						template.summary,
					'</div>',
				'</div>'
			]);
		}

		milestonesView.add(
		[
			'<div class="row">'
		]);

		template._status = {todo: 0, complete: 0, total: 0}

		_.each(template.milestones, function (milestone)
		{
			milestone.taskCaption = 'No tasks';

			if (_.isArray(milestone.tasks))
			{
				if (milestone.tasks.length == 1)
				{
					milestone.taskCaption = '<div class="fw-bold">1 Task</div>';
				}
				else if (milestone.tasks.length > 1)
				{
					milestone.taskCaption = '<div class="fw-bold">' + milestone.tasks.length + ' Tasks</div>';
				}
			}

			if (_.isPlainObject(milestone._status))
			{
				template._status.todo += milestone._status.todo;
				template._status.complete += milestone._status.complete;
				template._status.total += milestone.tasks.length;

				if (milestone._canBeEdited
						|| (!milestone._canBeEdited && milestone._status.complete == milestone.tasks.length))
				{
					milestone.taskCaption += '<div class="row px-0">';

					if (milestone._status.complete != 0)
					{
						milestone.taskCaption += '<div class="col-6 col-xl-4"><div class="mt-2 text-center p-2 alert alert-success mb-0"><div class="display-3 text-white">' + milestone._status.complete + '</div><div class="text-white small">Completed</div></div></div>';
					}

					if (milestone._status.todo != 0)
					{
						milestone.taskCaption +=
							'<div class="col-6 col-xl-4"><div class="mt-2 text-center p-2 alert alert-warning mb-0">' +
								'<a class="entityos-click" data-controller="util-project-do-milestone-init"' +
								' data-reference="' + milestone.reference + '">' +
									'<div class="display-3 text-white">' +
									milestone._status.todo +
									'</div>' +
									'<div class="text-white small">To Do</div>' +
								'</a>' +
							'</div></div>';
					}

					milestone.taskCaption += '</div>';
				}
			}

			milestone.headerCaption = milestone.subject;
			if (_.isNotSet(milestone.headerCaption))
			{
				milestone.headerCaption = milestone.description;
			}

			var duration = '';

			if (_.isNotSet(milestone.durationdays))
			{
				milestone.durationdays = milestone['duration-days']
			}

			if (_.has(milestone, 'durationdays.minimum'))
			{
				duration = milestone.durationdays.minimum;
			}

			if (_.has(milestone, 'durationdays.minimum') && _.has(milestone, 'durationdays.maximum'))
			{
				duration += ' to '
			}

			if (_.has(milestone, 'durationdays.maximum'))
			{
				duration += milestone.durationdays.maximum;
			}

			if (_.isSet(duration))
			{
				duration += ' days';
			}

			if (milestone._canBeEdited)
			{
				milestone.header =
					'<a class="entityos-click" data-controller="util-project-do-milestone-init"' +
						' data-reference="' + milestone.reference + '">' +
						'<h2 class="text-secondary mb-2 badge border border-primary-x">' + milestone.reference + '</h2>' +
						'<h1 class="mb-2 fw-bold" style="font-size:2.0rem;">' + milestone.headerCaption + '</h1>' +
					'</a>';
			}
			else
			{
				milestone.header =
						'<h2 class="text-secondary mb-2 badge border border-secondary">' + milestone.reference + '</h2>' +
						'<h1 class="mb-2 fw-bold text-secondary" style="font-size:2.0rem;">' + milestone.headerCaption + '</h1>';
			}

			milestonesView.add(
			[
				'<div class="col-12 col-md-6">',
					'<div class="card mt-4 mb-1 shadow-lg">',
						'<div class="card-body">',
							'<div class="row">',
								'<div class="col">',
									milestone.header,
								'</div>',
							'</div>',
							'<div class="row">',
								'<div class="col-12 text-secondary">',
									duration,	
								'</div>',
								'<div class="col-12 text-secondary">',
									milestone.taskCaption,
								'</div>',
							'</div>',
							'<div class="row" id="util-project-do-show-milestone-show-', milestone.reference, '-view">',
								'<div class="col-12">',
									'<div class="d-none" id="util-project-do-milestones-', milestone.reference, '-support-items-container">',
									'</div>',
									'<div class="d-none" id="util-project-do-milestones-', milestone.reference, '-resources-container">',
									'</div>',
									'<div class="d-none" id="util-project-do-milestones-', milestone.reference, '-tasks-container">',
									'</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>',
				'</div>'
			]);
		});

		milestonesView.add(
		[
			'</div>'
		]);

		var templateAttachment = app.get(
		{
			scope: 'util-template-get-definition-from-file',
			context: 'attachment'
		});

		if (_.isSet(templateAttachment))
		{
			milestonesView.add(
			[
				'<div class="row mt-5 mb-5">',
					'<div class="col-12 text-center pl-3">',
						'<div class="mb-0">',
							'<i class="fe fe-info text-secondary me-2"></i><a href="', templateAttachment.download, '" target="_blank" class="text-secondary">Based on template ', templateAttachment.filename, '</a>',
						'</div>',
					'</div>',
				'</div>'
			]);
		}

		var userRole = app.whoami().thisInstanceOfMe._userRole;
		milestonesView.render('#' + userRole + '-project-do-view');

		// Project Status

		if (template._status.todo == 0)
		{
			var whenCompleteSupportItem;

			if (_.has(template, 'supportitems'))
			{
				whenCompleteSupportItem = _.find(template.supportitems, function (item)
				{
					return (_.get(item, 'when.status', '') == 'complete')
				})
			}

			if (whenCompleteSupportItem != undefined)
			{
				app.show('#project-do-status-view',
				[
					'<div class="row">',
						'<div class="col-12">',
							'<div class="mt-2 text-center alert alert-success lead mb-1 shadow">',
								'<h2 class="text-white">', whenCompleteSupportItem.subject, '</h2>',
								'<div class="text-white">', whenCompleteSupportItem.description, '</div>',
							'</div>',
						'</div>',
					'</div>'
				]);
			}
			else
			{
				app.show('#project-do-status-view',
				[
					'<div class="row">',
						'<div class="col-12">',
							'<div class="mt-2 text-center alert alert-success lead mb-1 shadow"><i class="fe fe-check me-2"></i>Completed</div>',
						'</div>',
					'</div>'
				]);
			}
		}

		param.projectStatus = (template._status.todo!=0?'inProgress':'completed');

		if (param.projectStatus == 'completed')
		{
			//Show supportitems for completed.
		}

		app.invoke('util-project-do-save', param);
	}
});

app.add(
{
	name: 'util-project-do-save',
	code: function (param, response)
	{	
		const project = app.get(
		{
			scope: 'util-project-do',
			context: 'project'
		});

		const newProjectStatus = app.whoami().mySetup.projectStatuses[param.projectStatus];

		if (project.status != newProjectStatus)
		{
			var data =
			{
				id: project.id,
				status: newProjectStatus
			}
		
			entityos.cloud.save(
			{
				object: 'project',
				data: data
			});
		}
	}
});

app.add(
{
	name: 'util-project-do-milestone-hide',
	code: function (param)
	{
		app.invoke('util-project-do-show-milestones');
	}
});

app.add(
{
	name: 'util-project-do-milestone-init',
	code: function (param)
	{
		app.invoke('util-project-do-milestone-show', param);
	}
});

app.add(
{
	name: 'util-data-shuffle',
	code: function (array)
	{
		for (let i = array.length - 1; i > 0; i--)
		{
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}
});

app.add(
{
	name: 'util-project-do-milestone-show',
	code: function (param)
	{
		var template = app.get(
		{
			scope: 'util-project-do',
			context: 'template'
		});

		var _milestone = app.get(
		{
			scope: 'util-project-do',
			context: 'milestone',
		});

		if (_milestone == undefined)
		{
			_milestone = {reference: app._util.param.get(param.dataContext, 'reference').value}
		}

		var userRole = app.whoami().thisInstanceOfMe._userRole;

		$('#' + userRole + '-project-do-view').html('');

		var milestone = _.find(template.milestones, function (templateMilestone)
		{
			return (templateMilestone.reference == _milestone.reference)
		});

		milestone.headerCaption = milestone.subject;
		if (_.isNotSet(milestone.headerCaption))
		{
			milestone.headerCaption = milestone.description;
		}

		if (_.isSet(milestone.reference))
		{
			milestone.headerCaption = '<a class="btn btn-primary btn-sm mb-2 mr-2 entityos-click shadow" data-controller="util-project-do-milestones">' +
											'<i class="fas fa-chevron-left fe fe-chevron-left mt-0 fw-bold"></i>' + 
											'<span class="ml-2 mr-1">|</span><span class="pl-1 pr-1 fw-bold" style="x-font-size:0.9rem;">' +
												milestone.reference + '</span>' + 
										'</a>' +
										milestone.headerCaption
		}

		var milestoneView = app.vq.init({queue: 'util-project-do-milestone-show'});

		milestoneView.add(
		[
			'<div class="row align-items-end mt-4">',
				'<div class="col">',
					'<h1 class="mb-1 font-weight-bold" style="font-size: 1.6rem;">',
						milestone.headerCaption,
					'</h1>',
				'</div>',
				'<div class="col-auto d-none">',
					'<a class="btn btn-primary ml-1 mr-1 entityos-click shadow rounded-pill" data-controller="util-project-do-milestones">',
						'<i class="fas fa-compress fe fe-minimize-2 mt-0 text-white"></i></a>',
				'</div>',
			'</div>'
		]);
				
		milestoneView.add(
		[
			'<div class="row mt-3">'
		]);

		if (milestone != undefined)
		{
			milestone.taskCaption = 'No tasks';

			if (_.isArray(milestone.tasks))
			{
				if (milestone.tasks.length == 1)
				{
					milestone.taskCaption = '1 task';
				}
				else if (milestone.tasks.length > 1)
				{
					milestone.taskCaption = milestone.tasks.length + ' tasks';
				}
			}
			
			if (_.isSet(milestone['description']))
			{
				milestoneView.add(
				[
					'<div class="col-12">',
						'<h3 class="mt-2 mb-4 fw-bold text-secondary">', milestone['description'], '</h3>',
					'</div>',	
				])

				/*milestoneView.add(
				[
					'<div class="col-12 col-md-12">',
						'<div class="card mt-4 mb-1 shadow-lg">',
							'<div class="card-body">',
								'<div class="row">',
									'<div class="col">',
										'<a class="entityos-click"',
											' data-reference="', milestone.reference, '">',
											'<h1 class="mb-1">',  milestone.reference, '.</h1>', 
											'<h2 class="mb-2 fw-bold">', milestone['description'], '</h2>',
										'</a>',
									'</div>',
									'<div class="col-auto pb-1">',
										'<a class="btn btn-white btn-sm ml-1 mr-1 entityos-click rounded-pill" data-controller="util-project-do-milestone-hide"',
											' data-reference="', milestone.reference, '">',
											'<i class="fas fa-compress fe fe-minimize-2 text-muted mt-0 text-white"></i>',
										'</a>',
									'</div>',
									
								'</div>',
								'<div class="row">',
									'<div class="col-12 text-secondary">',
										
									'</div>',
								'</div>',
								'<div class="row" id="util-project-do-milestone-show-', milestone.reference, '-view">',
									'<div class="col-12">',
										'<div class="d-none" id="util-project-do-milestone-', milestone.reference, '-support-items-container">',
										'</div>',
										'<div class="d-none" id="util-project-do-milestone-', milestone.reference, '-resources-container">',
										'</div>',
									'</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);*/
			}

			//milestone['durationdays'].minimum, ' to ',
			//milestone['durationdays'].maximum, ' days',	

			milestoneView.add(
				[
					'<div class="col-12 col-md-12 mb-5" id="util-project-do-milestone-tasks-view">',
					'</div>'
				]);
		}

		milestoneView.add(
		[
			'</div>'
		]);

		milestoneView.render('#' + userRole + '-project-do-view'); 

		//-- TASKS --

		var milestoneTasksView = app.vq.init({queue: 'util-project-do-milestone-tasks'});
		
		_.each(milestone.tasks, function (task, taskIndex)
		{
            app.invoke('util-templates-task-hash',
            {
                task: task,
                milestone: milestone
            });

			if (_.isSet(task.reference))
			{
				task.headerSubject = 
					task['subject'] +
						'<span class="badge border-primary-x border rounded text-secondary ml-2" style="font-size:0.8rem;">' +
							task.reference +
						'</span>';
			}
			else
			{
				task.headerSubject = 
					'<span class="text-secondary" style="font-size:1.4rem;">' +
						(taskIndex + 1) + '.</span> ' +
							task['subject'];
			}

			if (task._currentTask)
			{
				task.headerSubject =
					'<a class="myds-collapse-toggle" data-toggle="collapse" role="button"' +
						' href="#util-project-do-milestone-tasks-' + taskIndex + '-collapse"' +
						' data-related-selector="#util-project-do-milestone-tasks-' + taskIndex + '-collapse-container"' +
						' data-reference="' + milestone.reference + '">' +
						task.headerSubject +
					'</a>';
			}

			task.headerCaption =
				'<h1 class="mb-1" style="font-size:1.6rem !important;">' +
					task.headerSubject
				'</h1>';
		
			task.headerMore = '';

			if (task._currentTask)
			{
				task.headerMore =
					_.join(['<a class="btn btn-sm btn-white border-primary-x shadow myds-collapse-toggle" data-toggle="collapse" role="button"',
						' href="#util-project-do-milestone-tasks-', taskIndex, '-collapse"',
						' id="util-project-do-milestone-tasks-', taskIndex, '-collapse-container"',
						' data-reference="', milestone.reference, '">',
						'<i class="fa fa-chevron-up text-primary-x mt-0"></i>',
					'</a>'], '')
			}
			else
			{
				task.headerMore =
					_.join(['<a class="btn btn-sm btn-white border-primary-x shadow myds-collapse-toggle" data-toggle="collapse" role="button"',
						' href="#util-project-do-milestone-tasks-', taskIndex, '-collapse"',
						' id="util-project-do-milestone-tasks-', taskIndex, '-collapse-container"',
						' data-reference="', milestone.reference, '"',
						'>',
						'<i class="fa fa-chevron-down text-primary-x mt-0"></i>',
					'</a>'], '')
			}

			var _resourcesHTML = app.vq.init({queue: '_resourcesHTML'});

			if (_.isArray(task.resources))
			{
				_resourcesHTML.add('<div class="mt-4">');

				_.each(task.resources, function (resource)
				{
					if (_.isSet(resource.url))
					{
						if (_.isNotSet(resource.subject))
						{
							resource.subject = resource.url
						}

						let cssClass = 'fad fa-book-open fe fe-book-open';

						if (_.includes(resource.url, 'youtu'))
						{
							cssClass = 'fe fe-youtube fad fa-video fa-fw';
						}
						else if (resource.type == 'video')
						{
							cssClass = 'fe fe-video fad fa-video fa-fw';
						}
						
						_resourcesHTML.add(
						[
							'<div class="mt-2">',
								'<i class="', cssClass, ' me-2 text-secondary"></i><a href="', resource.url, '" target="_blank">', resource.subject, '</a>',
							'</div>'
						]);

						if (_.isSet(resource.description))
						{
							_resourcesHTML.add(
							[
								'<div class="pl-4 mt-0 small text-secondary">',
									resource.description,
								'</div>'
							]);
						}
					}

					if (_.isSet(resource.imageurl))
					{
						_resourcesHTML.add(
						[
							'<div class="mt-4 w-50">',
								'<img class="img-fluid w-100 shadow-lg rounded-lg mb-4" src="', resource.imageurl, '">',
							'</div>'
						]);

						if (_.isSet(resource.subject))
						{
							_resourcesHTML.add(
							[
								'<div class="mt-1 small text-secondary">',
									resource.subject,
								'</div>'
							]);
						}
					}
				});

				_resourcesHTML.add('</div>');
			}

			var resourcesHTML = _resourcesHTML.get();

			var _reflectionsHTML = app.vq.init({queue: '_reflectionsHTML'});

			if (_.isArray(task.reflections))
			{
				_reflectionsHTML.add('<div class="mt-4">');

				task._disabled = '';
				task._notes = {};
				if (_.isSet(task._projectTask))
				{
					if (_.startsWith(task._projectTask.notes, '{'))
					{
						task._disabled = (task._projectTask.status == app.whoami().mySetup.projectTaskStatuses.completed?' disabled':'');
						task._notes = JSON.parse(task._projectTask.notes);
					}
				}

				_.each(task.reflections, function (reflection, reflectionIndex)
				{
					let reflectionNoteValue = '';
					const _reflectionNote = _.find(task._notes.reflections, function (reflectionNote)
					{
						return reflectionNote.index == reflectionIndex
					});
					if (_.isSet(_reflectionNote))
					{
						reflectionNoteValue = _reflectionNote.value
					}

					if (reflection.method == 'observation')
					{
						reflection._caption = reflection.subject;
						if (_.isNotSet(reflection._caption)) {reflection._caption = reflection.description}

						_reflectionsHTML.add(
						[
							'<div class="form-group">',
								'<h3><label class="text-secondary mb-0 mt-1"',
										' for="util-project-do-milestone-task-', task.hash, '-reflection-', reflectionIndex, '"><i class="d-none d-md-inline far fa-file-alt fa-fw fe fe-file-text me-2"></i>',
											reflection._caption, '</label></h3>',
								'<textarea', task._disabled, ' style="height:140px;" class="form-control myds-text"',
									' id="util-project-do-milestone-task-', task.hash, '-reflection-', reflectionIndex, '"',
									' data-id=""',
									' data-scope="util-project-do-milestones-tasks-reflections"',
									' data-context="task-', task.hash, '-reflection-', reflectionIndex, '"',
									' data-reflection-index="', reflectionIndex, '"',
									' data-hash="', task.hash, '">', reflectionNoteValue, '</textarea>',
							'</div>'
						]);
					}

					if (reflection.method == 'structured')
					{
						reflection._caption = reflection.subject;
						if (_.isNotSet(reflection._caption)) {reflection._caption = reflection.description}
						
						_reflectionsHTML.add(
						[
							'<div class="form-group">',
								'<h3><label class="text-secondary mb-0 mt-1"',
										' for="util-project-do-milestone-task-', task.hash, '-reflection-', reflectionIndex, '">',
											'<i class="d-none d-md-inline fa fa-list fe fe-list me-2"></i>',
												reflection._caption,
								'</label></h3>'
						]);

						if (_.isPlainObject(reflection.structure))
						{
							var options = reflection.structure.options;

							// Sports
							var sortController = reflection.controller;
							if (sortController == undefined) {sortController = "sort:asis"}

							if (sortController == 'sort:randomise')
							{
								app.invoke('util-data-shuffle', options)
							}

							if (sortController == 'sort:caption')
							{
								options = _.sortBy(options, 'caption');
							}

							if (sortController == 'sort:sequence')
							{
								options = _.sortBy(options, function (option) {return numeral(option.sequence).value()})
							}

							_.each(options, function (option, optionIndex)
							{
								option._checked = '';
								if (option.name == reflectionNoteValue)
								{
									option._checked = ' checked="checked"'
								}
								_reflectionsHTML.add(
								[
									'<div class="ml-md-4 radio-inline radio-lg mb-1">',
										'<input', task._disabled, ' type="radio" class="entityos-check mr-1" ',
										' id="util-project-do-milestone-task-', task.hash, '-reflection-', reflectionIndex, '-', optionIndex + '"',
										' name="util-project-do-milestone-task-', task.hash, '-reflection-', reflectionIndex, '"',
										' value="', option.name, '"',
										' data-points="', option.points, '"',
										' data-scope="util-project-do-milestones-tasks-reflections"',
										' data-hash="', task.hash, '"',
										' data-name="reflection-', reflectionIndex, '"',
										' data-context="task-', task.hash, '-reflection-', reflectionIndex, '"',
										' data-reflection-index="', reflectionIndex, '"',
										option._checked,
										'>',
											option.caption,
									'</div>'
								]);
							});
						}

						_reflectionsHTML.add('</div>');
					}
				});

				_reflectionsHTML.add('</div>');
			}

			var reflectionsHTML = _reflectionsHTML.get();

			var _actionsHTML = app.vq.init({queue: '_actionsHTML'});

            var projectTaskInProgress = (task._projectTask == undefined);
            if (!projectTaskInProgress)
            {
                projectTaskInProgress = (task._projectTask.status != app.whoami().mySetup.projectTaskStatuses.completed)
            }

			let percentComplete100 = false;
			if (task._projectTask != undefined)
			{
				percentComplete100 = (task._projectTask.percentagecomplete == '100')
			}

			if (template.type == 'project')
			{
				if (projectTaskInProgress)
				{
					_actionsHTML.add(['<div class="mt-4"',
							' id="util-project-do-milestone-task-', task.hash, '">',
							'<button type="button" class="btn btn-default btn-outline btn-outline-primary-x btn-sm entityos-click"',
								' data-controller="util-project-do-milestone-task-save"',
								' data-milestone="', milestone.reference, '"',
								' data-hash="', task.hash, '"',
								' data-task-index="', taskIndex, '"',
								' data-status=""',
								'>',
								'<i class="fe fe-save"></i> Save',
							'</button>',
							(!percentComplete100?
							'<button type="button" class="btn btn-default btn-outline btn-outline-primary-x btn-sm entityos-click ms-2"' +
								' data-controller="util-project-do-milestone-task-save"' +
								' data-milestone="' + milestone.reference + '"' +
								' data-hash="' + task.hash + '"' +
								' data-task-index="' + taskIndex + '"' +
								' data-status="completed"' +
								'>' +
								'<i class="fe fe-check-square"></i> Save & Mark as Done' +
							'</button>':''),
						'</div>']);
				}
			}
			else
			{
				if (projectTaskInProgress)
				{
					_actionsHTML.add(
						[
							'<div class="mt-4"',
								' id="util-project-do-milestone-task-', task.hash, '">',
								'<button type="button" class="btn btn-sm btn-default btn-outline btn-outline-primary-x entityos-click"',
									' data-controller="util-project-do-milestone-task-check"',
									' data-action="next"',
									' data-milestone="', milestone.reference, '"',
									' data-hash="', task.hash, '"',
									' data-task-index="', taskIndex, '"',
									' data-status=""',
									'>',
									'Next <i class="fe fe-chevron-right fas fa-chevron-right"></i>' +
								'</button>',
								'<span id="util-project-do-milestone-task-', task.hash, '-action-status-view" class="ml-2"></div>',
							'</div>'
					]);
				}
			}

			var actionsHTML = _actionsHTML.get();
		
			milestoneTasksView.add(
			[
				'<div class="card mb-4 mb-1 shadow-lg" id="util-project-do-milestone-', milestone.reference, '-task-', taskIndex, '-view-container">',
					'<div class="card-body">',
						'<div class="row">',
							'<div class="col">',
								task.headerCaption,
							'</div>',
							'<div class="d-none d-md-inline col-auto pb-1">',
								task.headerMore,
							'</div>',
						'</div>',
						'<div class="row">',
							'<div class="col-12 text-secondary" id="util-project-do-milestone-', milestone.reference, '-task-', taskIndex, '-status-view">',
							'</div>',
						'</div>',
						'<div class="p-0 collapse', (task._currentTask?' show':'') ,'" id="util-project-do-milestone-tasks-', taskIndex, '-collapse">',
							'<div class="mt-4">',
								task.description,
							'</div>',
							resourcesHTML,
							reflectionsHTML,
							actionsHTML,
						'</div>',
					'</div>',
				'</div>'
			]);
		})

		milestoneTasksView.render('#util-project-do-milestone-tasks-view'); 

		//app.invoke('util-project-do-project-tasks', param);
		app.invoke('util-project-do-milestone-statuses-show', param);
	}
});

app.add(
{
	name: 'util-project-do-milestone-statuses-show',
	code: function (param)
	{
		var template = app.get(
		{
			scope: 'util-project-do',
			context: 'template'
		});

		var hashes = app.get(
		{
			scope: 'util-project-do',
			context: 'project-task-hashes'
		});

		if (_.isSet(template, 'milestones'))
		{
			_.each(template.milestones, function (milestone, milestoneIndex)
			{
				_.each(milestone.tasks, function (milestoneTask, milestoneTaskIndex)
				{
					milestoneTask._hash = _.find(hashes, function(hash) {return milestoneTask.hash == hash.ciphertext});
					milestoneTask.statusCaption = '<span class="badge badge-warning p-2">To Do</span>';

					if (milestoneTask._projectTask != undefined)
					{
						if (milestoneTask._projectTask.status == app.whoami().mySetup.projectTaskStatuses.completed)
						{
							//milestoneTask.statusCaption = '<span class="text-success"><i class="fe fe-check-square"></i> Completed (Verified by Learning Partner)</span>';
							milestoneTask.statusCaption = '<span class="badge badge-success p-2"><i class="fe fe-check-square"></i> Completed</span>';
						}

						if (milestoneTask._projectTask.status == app.whoami().mySetup.projectTaskStatuses.inProgress)
						{
							milestoneTask.verificationCaption = '';
							if (milestoneTask._projectTask.percentagecomplete == '100')
							{
								milestoneTask.verificationCaption = ' (Awaiting Learning Partner Verification)'
							}
							milestoneTask.statusCaption = '<span class="badge badge-warning p-2">In Progress' + milestoneTask.verificationCaption + '</span>';
						}
					}

					app.show('#util-project-do-milestone-' + milestone.reference + '-task-' + milestoneTaskIndex + '-status-view', milestoneTask.statusCaption);
				});				
			});
		}
	}
});

app.add(
{
	name: 'util-project-do-milestone-task-next',
	code: function (param, response)
	{
		app.invoke('util-project-do-milestone-task-check', param);
	}
});

app.add(
{
	name: 'util-project-do-milestone-task-check',
	code: function (param, response)
	{
		// Check all reflections completed and correct if structured.
		// Then do param.dataContext.action

		var taskHash = app._util.param.get(param.dataContext, 'hash').value;
		var taskMilestoneReference = app._util.param.get(param.dataContext, 'milestone').value;

		var template = app.get(
		{
			scope: 'util-project-do',
			context: 'template'
		});

		var reflectionsCompleted = true;

		var milestone = _.find(template.milestones, function (milestone)
		{
			return milestone.reference == taskMilestoneReference
		});

		if (_.isSet(milestone))
		{
			var task = _.find(milestone.tasks, function (task)
			{
				return task.hash == taskHash
			});

			if (_.isSet(task))
			{
				app.show('#util-project-do-milestone-task-' + task.hash + '-action-status-view', '');

				var taskReflections = app.get(
				{
					scope: 'util-project-do-milestones-tasks-reflections'
				});

				console.log(taskReflections);

				var _taskReflections = [];

				_.each(taskReflections, function (reflectionData, reflectionField)
				{
					if (_.startsWith(reflectionField, 'task-' + taskHash + '-reflection-') &&
						!_.includes(reflectionField, 'unselected'))
					{
						const _reflectionField = _.split(reflectionField, '-');

						let valueText = '';

						const templateReflection = task.reflections[_.last(_reflectionField)];

						if (templateReflection.method == 'structured')
						{
							let option = _.find(templateReflection.structure.options, function (option)
							{
								return (option.name == reflectionData )
							});

							if (option != undefined)
							{
								valueText = option.caption + '|' + option.points
							}
						}

						_taskReflections.push(
						{
							index: _.last(_reflectionField),
							description: templateReflection.description,
							value: reflectionData,
							valueText: valueText
						});
					}
				});

				console.log(_taskReflections);

				var definitionTaskReflections = task.reflections;
				
				_.each(definitionTaskReflections, function (definitionTaskReflection, definitionTaskReflectionIndex)
				{
					definitionTaskReflection._taskReflection = _.find(_taskReflections, function (_taskReflection)
					{
						return (_taskReflection.index == definitionTaskReflectionIndex)
					});

					definitionTaskReflection.ok = false;

					if (_.isSet(definitionTaskReflection._taskReflection))
					{
						if (definitionTaskReflection.method == 'observation')
						{
							definitionTaskReflection.ok = _.isSet(definitionTaskReflection._taskReflection.value)
						}

						if (definitionTaskReflection.method == 'structured')
						{
							if (_.has(definitionTaskReflection, 'structure.options'))
							{
								definitionTaskReflection._taskReflection._option = _.find(definitionTaskReflection.structure.options, function (option)
								{
									return (option.name == definitionTaskReflection._taskReflection.value)
								});

								if (_.isSet(definitionTaskReflection._taskReflection._option))
								{
									definitionTaskReflection._taskReflection._option._useControllers = false;

									if (_.has(definitionTaskReflection, 'structure.controllers'))
									{
										definitionTaskReflection._taskReflection._option._useControllers =
											!_.isEmpty(definitionTaskReflection.structure.controllers)
									}
									
									if (definitionTaskReflection._taskReflection._option._useControllers)
									{}
									else
									{
										//Use default points = 1 = OK.
										definitionTaskReflection.ok = (definitionTaskReflection._taskReflection._option.points == 1)
									}
								}
							}
						}
					}
				});

				console.log(definitionTaskReflections);

				task._reflections =
				{
					ok: _.filter(definitionTaskReflections, function (reflection) {return reflection.ok}),
					notok: _.filter(definitionTaskReflections, function (reflection) {return !reflection.ok})
				}

				task.ok = (task._reflections.notok.length == 0);

				if (!task.ok)
				{
					app.show('#util-project-do-milestone-task-' + task.hash + '-action-status-view',
						'<span class="text-danger"><i class="fe fe-alert-triangle fad fa-exclamation-triangle"></i> Some of the answers are blank or incorrect.')
				}
				else
				{
					app.show('#util-project-do-milestone-task-' + task.hash + '-action-status-view',
						'<span class="text-success"><i class="fe fe-check-circle fad fa-check-circle"></i>');

					app.invoke('util-project-do-milestone-task-save', param);
				}
			}
		}
	}
});

app.add(
{
	name: 'util-project-do-milestone-task-save',
	code: function (param, response)
	{	
		var taskHash = app._util.param.get(param.dataContext, 'hash').value;
		var taskMilestoneReference = app._util.param.get(param.dataContext, 'milestone').value;

		var saveStatus = app._util.param.get(param.dataContext, 'status').value;

		var template = app.get(
		{
			scope: 'util-project-do',
			context: 'template'
		});

		let taskStatus = app.whoami().mySetup.projectTaskStatuses.inProgress;
		let taskPercentageComplete = 50;

		if (_.isNotSet(saveStatus))
		{
			if (!_.has(template, 'team.supported'))
			{
				saveStatus = 'completed';
				app._util.param.set(param.dataContext, 'status', saveStatus);
			}
		}

		if (saveStatus == 'completed')
		{
			taskPercentageComplete = 100;

			if (_.has(template, 'team.supported'))
			{
				//Learning-partners sets to completed as part of verification.
			}
			else
			{
				taskStatus = app.whoami().mySetup.projectTaskStatuses.completed;
			}
		}

		var project = app.get(
		{
			scope: 'util-project-do',
			context: 'project'
		});

		var projectTasks = app.get(
		{
			scope: 'util-project-do',
			context: 'project-tasks'
		});

		var taskReflections = app.get(
		{
			scope: 'util-project-do-milestones-tasks-reflections'
		});

		// Need to make it work with multiple reflections per task
		// At the moment assumes only one reflection per task
        // Make it work with reflection references also not just the index (as template can change)

		var milestone = _.find(template.milestones, function (milestone)
		{
			return milestone.reference == taskMilestoneReference
		});
	
		if (milestone == undefined)
		{
			app.notify({type: 'error', message: 'Can not find the milestone in the template.'})
		}
		else
		{
			if (response == undefined)
			{
				var task = _.find(milestone.tasks, function (_task)
				{
					return _task.hash == taskHash
				});

				var taskNotes = {reflections: []} // this should be seeded with existing - JSON.parse

				_.each(taskReflections, function (reflectionData, reflectionField)
				{
					if (_.startsWith(reflectionField, 'task-' + taskHash + '-reflection-') &&
						!_.includes(reflectionField, 'unselected'))
					{
						const _reflectionField = _.split(reflectionField, '-');

						let valueText = '';

						const templateReflection = task.reflections[_.last(_reflectionField)];

						if (templateReflection.method == 'structured')
						{
							let option = _.find(templateReflection.structure.options, function (option)
							{
								return (option.name == reflectionData )
							});

							if (option != undefined)
							{
								valueText = option.caption + '|' + option.points
							}
						}

						taskNotes.reflections.push(
						{
							index: _.last(_reflectionField),
							description: templateReflection.description,
							value: reflectionData,
							valueText: valueText
						});
						
					}
				});

				var projectTask = _.find(projectTasks, function (_projectTask)
				{
					return _projectTask.hash == taskHash
				});

				var taskType = app.whoami().mySetup.projectTaskTypes.none;

				var data =
				{
					datareturn: 'guid',
					project: project.id,
					title: task.subject,
					description: task.description,
					percentagecomplete: taskPercentageComplete,
					priority: 4,
					status: taskStatus,
					taskbyuser: app.whoami().thisInstanceOfMe.user.id,
					type: taskType,
					startdate: moment().format('DD MMM YYYY'),
					notes: JSON.stringify(taskNotes)
				}

				if (_.isSet(projectTask))
				{
					data.id = projectTask.id;
				}
			
				console.log(data);

				entityos.cloud.save(
				{
					object: 'project_task',
					data: data,
					callback: 'util-project-do-milestone-task-save',
					callbackParam: param
				});
			}
			else
			{
				param = app._util.param.set(param, 'projectTaskID', response.id);
				param = app._util.param.set(param, 'taskHash', taskHash);
				app.invoke('util-project-do-milestone-task-save-hash', param);
			}
		}
	}
});

app.add(
{
	name: 'util-project-do-milestone-task-save-hash',
	code: function (param, response)
	{	
		const projectTaskID = app._util.param.get(param, 'projectTaskID').value;
		const taskHash = app._util.param.get(param.dataContext, 'hash').value;
		const taskMilestoneReference = app._util.param.get(param.dataContext, 'milestone').value;
		app._util.param.set(param, 'taskHash', taskHash);

		var hashes = app.get(
		{
			scope: 'util-project-do',
			context: 'project-task-hashes'
		});

		const _hash = _.find(hashes, function (hash)
		{
			return (hash.objectcontext == projectTaskID)
		})

		if (_hash != undefined)
		{
			app.invoke('util-project-do-milestone-task-save-finalise', param, {status: 'OK'});
		}
		else
		{
			var data =
			{
				object: app.whoami().mySetup.objects.projectTask,
				objectcontext: projectTaskID,
				type: 2,
				ciphertext: taskHash,
				notes: 'Milestone: ' + taskMilestoneReference
			}
		
			mydigitalstructure.cloud.save(
			{
				object: 'core_protect_ciphertext',
				data: data,
				callback: 'util-project-do-milestone-task-save-finalise',
				callbackParam: param
			});
		}
	}
});

app.add(
{
	name: 'util-project-do-milestone-task-save-finalise',
	code: function (param, response)
	{	
		if (response.status == 'OK')
		{
			const taskMilestoneReference = app._util.param.get(param.dataContext, 'milestone').value;
			const taskIndex = app._util.param.get(param.dataContext, 'taskIndex').value;
			const taskHash = app._util.param.get(param.dataContext, 'hash').value;
			const action = app._util.param.get(param.dataContext, 'action').value;
			const saveStatus = app._util.param.get(param.dataContext, 'status').value;

			app.invoke('util-view-spinner-remove-all');			

			if (saveStatus == 'completed')
			{
				if (action == 'next')
				{
					/*app.invoke('util-project-do-milestone-init',
					{
						dataContext: {reference: milestoneReference}
					});
					*/
					console.log(param);

					var template = app.get(
					{
						scope: 'util-project-do',
						context: 'template'
					});

					var milestone = _.find(template.milestones, function (milestone)
					{
						return milestone.reference == taskMilestoneReference
					});

					app.show('#util-project-do-milestone-' + taskMilestoneReference + '-task-' + taskIndex + '-status-view', '<span class="badge badge-success p-2">Completed</span>');

					$('#util-project-do-milestone-tasks-' + taskIndex + '-collapse').removeClass('show');
					$('#util-project-do-milestone-task-' + taskHash).addClass('d-none');

					$('#util-project-do-milestone-tasks-' + taskIndex + '-collapse input').prop('disabled', true);
					$('#util-project-do-milestone-tasks-' + taskIndex + '-collapse-container > i').toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');

					if (_.isSet(milestone))
					{
						contextTaskIndexNext = (taskIndex + 1);

						if (contextTaskIndexNext == milestone.tasks.length)
						{
							const project = app.get(
							{
								scope: 'util-project-do',
								context: 'project'
							});

							app.invoke('util-project-do', {id: project.guid})
						}
						else
						{
							$('html, body').animate({
								scrollTop: ($('#util-project-do-milestone-' + taskMilestoneReference + '-task-' +  contextTaskIndexNext + '-view-container').offset().top - 80)
							}, 'slow');

							$('#util-project-do-milestone-tasks-' + contextTaskIndexNext + '-collapse').addClass('show');
							$('#util-project-do-milestone-task-' + contextTaskIndexNext).removeClass('d-none');
						}
					}
				}
				else
				{
					app.notify('Task updated!');
					app.show('#util-project-do-milestone-task-' + taskHash, '');
				}
			}
		}
	}
});
