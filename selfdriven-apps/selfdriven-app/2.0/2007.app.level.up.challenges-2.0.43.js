/*
	{
    	title: "Level Up; Challenges", 	
    	design: "https://slfdrvn.io/levelup"
  	}
*/

app.add(
{
	name: 'level-up-challenges',
	code: function (param, response)
	{
		var levelUpProfileProject = app.whoami().mySetup.levelUp.managementProject;
		var levelUpProfileProjectTemplate = app.whoami().mySetup.levelUp.managementProjectTemplate.template.project;

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'project',
				fields: ['description'],
				filters: 
				[
					{
						field: 'parentproject',
						value: levelUpProfileProject.id
					}
				],
				callback: 'level-up-challenges'
			});
		}
		else
		{
			var profileChallengesCount = 0;
			var profileOutcomes = [];

			if (_.has(levelUpProfileProjectTemplate, 'outcomes'))
			{
				profileOutcomes = _.filter(levelUpProfileProjectTemplate.outcomes, function (outcome)
				{
					return (_.isNotSet(outcome.uri) && _.isSet(outcome.description))
				});

				profileChallengesCount = profileOutcomes.length;
			}

			var challenges = response.data.rows;
			var challengesCount = challenges.length;
			var challengesToStartCount = numeral(profileChallengesCount).value() //- numeral(challengesCount).value();
			var challengesToStartCountText = challengesToStartCount;
			if (challengesToStartCount <= 0)
			{
				challengesToStartCountText = 'no'
			}

			var profileInfoView = app.vq.init({queue: 'level-up-challenges-info-profile'});
			
			if (challengesToStartCount <= 0)
			{
				profileInfoView.add(
				[
					'<div class="card mt-3">',
						'<div class="card-body">',
							'<div class="row">',
								'<div class="col pr-md-4">',
									'<h4 class="mb-2 text-secondary">It looks like you haven\'t set up your level up profile.</h4>',
									'<h4 class="mb-0 text-secondary">To get started click My Level Up Profile and add to the "By Doing Challenges" section, then come back here.</h4>',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);
			}
			else
			{
				profileInfoView.add(
				[
					'<div class="card mt-3">',
						'<div class="card-header">',
							'<div class="row">',
								'<div class="col d-flex align-items-center pr-md-4">',
									'<h3 class="mb-0">Based on your level up profile, you have ', challengesToStartCountText, ' challenge(s) that you have not yet created a project for.</h3>',
								'</div>',
								'<div class="col-auto d-flex flex-column align-items-end">',
									'<a class="btn btn-light btn-sm"',
										' data-toggle="collapse" role="button"',
										' href="#level-up-challenges-info-profile-challenges"',
										' aria-expanded="true">Show</a>',
								'</div>',
							'</div>',
						'</div>',
						'<div id="level-up-challenges-info-profile-challenges" class="myds-collapse collapse">',
							'<div class="card-body pt-1">'
				]);

						_.each(profileOutcomes, function (outcome)
						{
							profileInfoView.add(
							[
								'<div class="row border-bottom border-muted py-3">',
									'<div class="col-10 fw-bold">',
										outcome.description,
									'</div>',
									'<div class="col-2">',
										'<div class="d-flex flex-column align-items-end">',
											'<button type="button" class="btn btn-default btn-outline btn-sm myds-navigate"',
											' data-controller="level-up-challenges-start"',
											' data-context="outcome-', outcome.reference, '" data-id="', outcome.reference, '">',
												'Create',
											'</button>',
										'</div>',
									'</div>',
								'</div>'
							]);
						});

				profileInfoView.add(
				[		
							'</div>',
						'</div>',
					'</div>'
				]);
			}

			profileInfoView.render('#level-up-challenges-info-profile');

			app.invoke('level-up-challenges-dashboard');
		}
	}
});

app.add(
{
	name: 'level-up-challenges-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'level-up-challenges',
			valueDefault: {}
		});

		var filters =
		[
			{
				field: 'restrictedtoteam',
				value: 'Y'
			},
			{
				field: 'projectmanager',
				value: app.whoami().thisInstanceOfMe.user.id
			},
			{
				field: 'type',
				value: app.whoami().mySetup.projectTypes.learning
			},
			{
				field: 'subtype',
				value: app.whoami().mySetup.projectSubTypes.learningLevelUp
			}
		];

		if (!_.isEmpty(data.search))
		{
			filters = _.concat(filters,
			[
				{name: '('},
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
				{name: ')'}
			]);
		}

		app.invoke('util-view-table',
		{
			object: 'project',
			container: 'level-up-challenges-dashboard-view',
			context: 'level-up-challenges',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">There are no challenges that match this search.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this task?',
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
					controller: 'level-up-challenges-dashboard-format'
				},

				columns:
				[
					{
						caption: 'Name',
						field: 'title',
						defaultSort: true,
						sortBy: true,
						class: 'col-sm-10 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="level-up-challenge-summary"'
					},
					{
						caption: 'Status',
						field: 'statustext', 	
						sortBy: true,
						class: 'col-sm-2',
						data: 'data-id="{{guid}}"'
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


app.add(
{
	name: 'level-up-challenges-dashboard-format',
	code: function (row)
	{
		var utilSetup = app.get({scope: 'util-setup'});

		row._taskbyname = _.find(utilSetup.users, function (user) {return user.id == row.taskbyuser});
		row.taskbyname = row.taskbyusertext;
		if (row._taskbyname != undefined)
		{
			row.taskbyname = '<div>' + row._taskbyname['user.contactperson.firstname'] + ' ' + row._taskbyname['user.contactperson.surname'] + '</div>';

			if (row._taskbyname['user.contactperson.email'] != '')
			{
				row.taskbyname = row.taskbyname +
					'<div class="text-muted small"><a href="mailto:' + row._taskbyname['user.contactperson.email'] + '" class="text-muted">' +
							'<i class="fa fa-envelope mr-1"></i>' + row._taskbyname['user.contactperson.email'] + '</a></div>'
			}
		}

		row.projectIcon = '<i class="fa fa-users fa-fw"></i>'
		if (row['projecttask.project.restrictedtoteam'] == 'Y')
		{
			row.projectIcon = '<i class="fa fa-user fa-fw"></i>'
		}

		row.projectInfo = '<span class="mr-1">' + row['projecttask.project.description'] + '</span>' +
									'<span class="text-muted small">' + row.projectIcon + '</span>';


		//row.taskbyname = row['projecttask.taskbyuser.contactperson.firstname'] + ' ' + row['projecttask.taskbyuser.contactperson.surname']
	}
});

//CHALLENGE

app.add(
{
	name: 'level-up-challenge-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'level-up-challenge-summary',
			context: 'id'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'level-up-challenges'});
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
					callback: 'level-up-challenge-summary'
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
							scope: 'level-up-challenge-summary',
							context: 'dataContext',
							value: data
						});

						app.view.refresh(
						{
							scope: 'level-up-challenge-summary',
							selector: '#level-up-challenge-summary',
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

						app.invoke('util-project-team-show',
						{
							dataContext:
							{
								context: 'level-up-challenge-summary',
								project: data.id,
								selector: 'level-up-challenge-summary-team-view'
							}
						})
						
						app.invoke('util-attachments-initialise',
						{
							context: 'level-up-challenge-summary',
							object: app.whoami().mySetup.objects.project,
							objectContext: data.id,
							showTypes: false,
							collapsible: false
						});
				
						var actionTypes = app.whoami().mySetup.actionTypes;
				
						app.invoke('util-actions-initialise',
						{
							context: 'level-up-challenge-summary-reflections',
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
							context: 'level-up-challenge-summary-achievements',
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



// !!!CHECK

app.add(
{
	name: 'level-up-challenge-edit-status-save',
	code: function (param, response)
	{	
		var taskID = app.get(
		{
			scope: 'level-up-challenge-summary',
			context: 'dataContext',
			name: 'id',
			valueDefault: ''
		});
	
		var dataStatus = app.get(
		{
			scope: 'level-up-challenge-edit-status-' + taskID,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: taskID,
				values: {}
			}
		});

		var data =
		{
			id: taskID
		};

		if (_.isSet(dataStatus.percentagecomplete))
		{
			data.percentagecomplete = dataStatus.percentagecomplete
		}

		if (_.isSet(dataStatus.status))
		{
			data.status = dataStatus.status
		}

		if (_.isUndefined(response))
		{		
			mydigitalstructure.cloud.save(
			{
				object: 'project_task',
				data: data,
				callback: 'level-up-challenge-edit-status-save',
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.refresh(
				{
					dataScope: 'level-up-challenges',
					data: data
				});

				app.invoke('level-up-challenge-edit-status-comment-save');
			}
		}
	}
});

app.add(
{
	name: 'level-up-challenge-edit-status-comment-save',
	code: function (param, response)
	{	
		var taskID = app.get(
		{
			scope: 'level-up-challenge-summary',
			context: 'dataContext',
			name: 'id',
			valueDefault: ''
		});
	
		var dataStatus = app.get(
		{
			scope: 'level-up-challenge-edit-status-' + taskID,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: taskID,
				values: {}
			}
		});

		var dataTask = app.get(
		{
			scope: 'level-up-challenge-summary',
			context: 'dataContext',
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: taskID,
				values: {}
			}
		});

		if (dataStatus.statuscomment == '')
		{
			app.invoke('level-up-challenge-edit-status-save-complete');
		}
		else
		{
			var utilSetup = app.get(
			{
				scope: 'util-setup'
			});

			var data =
			{
				object: 11,
				objectcontext: taskID,
				actionby: app.whoami().thisInstanceOfMe.user.user,
				contactperson: app.whoami().thisInstanceOfMe.user.contactperson,
				actiontype: utilSetup.actionTypes.taskStatusUpdate,
				description: dataStatus.statuscomment,
				actionreference: _.truncate('Status Update|' + dataTask['projecttask.project.description'] + '|' + dataTask.description, {length: 800, separator: ' '}),
				status: 1,
				completed: moment().format('D MMM YYYY'),
				duedate: moment().format('D MMM YYYY')
			};

			if (_.isUndefined(response))
			{		
				mydigitalstructure.cloud.save(
				{
					object: 'action',
					data: data,
					callback: 'level-up-challenge-edit-status-comment-save',
				});
			}
			else
			{	
				app.invoke('level-up-challenge-edit-status-save-complete');
			}
		}
	}
});

app.add(
{
	name: 'level-up-challenge-edit-status-save-complete',
	code: function (param, response)
	{	
		app.notify('Task status updated.')

		var taskID = app.get(
		{
			scope: 'level-up-challenge-summary',
			context: 'id',
			valueDefault: ''
		});

		app.invoke('level-up-challenge-summary');
		//app.invoke('app-navigate-to', {scope: 'level-up-challenge-summary', context: taskID});
	}
});

app.add(
{
	name: 'level-up-challenge-summary-reflection-save',
	code: function (param, response)
	{	
		var taskID = app.get(
		{
			scope: 'level-up-challenge-summary',
			context: 'dataContext',
			name: 'id',
			valueDefault: ''
		});
	
		var dataActionReflection = app.get(
		{
			scope: 'level-up-challenge-summary-reflection-' + taskID,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				values:
				{
					object: 11,
					objectcontext: taskID,
					actionby: app.whoami().thisInstanceOfMe.user.user,
					contactperson: app.whoami().thisInstanceOfMe.user.contactperson,
					subject: 'Learner Reflection on a Project Task',
					status: 1,
					completed: moment().format('D MMM YYYY'),
					duedate: moment().format('D MMM YYYY')
				}
			}
		});

		if (_.isUndefined(response))
		{		
			mydigitalstructure.cloud.save(
			{
				object: 'action',
				data: dataActionReflection,
				callback: 'level-up-challenge-summary-reflection-save',
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Reflection added.');

				var taskID = app.get(
				{
					scope: 'level-up-challenge-summary',
					context: 'id',
					valueDefault: ''
				});

				app.invoke('level-up-challenge-summary');
				//app.invoke('app-navigate-to', {scope: 'level-up-challenge-summary', context: taskID});
			}
		}
	}
});

app.add(
{
	name: 'level-up-challenge-summary-skill-capacity-show',
	code: function (param, response)
	{
		var task = app.get(
		{
			scope: 'level-up-challenge-summary',
			context: 'dataContext',
		});

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'core_object_link',
				fields: 
				[
					'objectcontext',
					'createddate', 'modifieddate',
					'guid', 'notes'
				],
				filters:
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
						value: task.id
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
				callback: 'level-up-challenge-summary-skill-capacity-show',
				callbackParam: param
			});
		}
		else
		{
			var taskSkillCapacity = _.first(response.data.rows);

			if (_.isSet(taskSkillCapacity))
			{
				$('#level-up-challenge-summary-skill-capacity-' + taskSkillCapacity.objectcontext + '-' + task.id).attr('checked', 'checked');
			}
		}
	}
});

app.add(
{
	name: 'level-up-challenge-summary-skill-capacity-save',
	code: function (param, response)
	{
		var task = app.get(
		{
			scope: 'level-up-challenge-summary',
			context: 'dataContext',
		});

		var taskSummaryCapacity = app.get(
		{
			scope: 'level-up-challenge-summary-skill-capacity-' + task.id
		});

		if (_.isNotSet(taskSummaryCapacity))
		{
			app.notify('You need to select a Skill Capacity.')
		}
		else
		{
			if (response == undefined)
			{
				entityos.cloud.save(
				{
					object: 'core_object_link',
					data:
					{
						parentobject: app.whoami().mySetup.objects.projectTask,
						parentobjectcontext: task.id,
						object: 410,
						objectcontext: taskSummaryCapacity.dataID,
						notes: ''
					},
					callback: 'level-up-challenge-summary-skill-capacity-save'
				});
			}
			else
			{
				app.notify('Skill Capacity updated.')
			}
		}
	}
});

app.add(
{
	name: 'learner-me-level-up-start-challenge',
	code: function (param, response)
	{

	}
});



