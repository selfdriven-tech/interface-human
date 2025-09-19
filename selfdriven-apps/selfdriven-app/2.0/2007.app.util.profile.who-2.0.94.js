/*
	PROFILE UTIL FUNCTIONS

	http://slfdrvn.io/levelup

	- Is there a default level up project
	- Create template with outcomes, tasks, skills etc
*/

// !!FUTURE | FROM MEMBER ORGANISATION/COMMUNITY FILE (JSON)

app.add(
{
	name: 'util-profile-who-init',
	code: function (param)
	{
		if (_.has(app.whoami(), 'mySetup.projectSubTypes.managementProfileWho'))
		{
			app.invoke('util-profile-who-project-init', param);
		}
		else
		{
			app.invoke('util-on-complete', param);
		}
	}
});

app.add(
{
	name: 'util-profile-who-project-init',
	note: 'See if there existings a management for Who (Am I / Are You) profile for this user. notes is the profile data.',
	code: function (param, response)
	{	
		if (response == undefined)
		{
			entityos.cloud.search(
			{
				object: 'project',
				fields: ['description', 'status', 'notes', 'statustext', 'modifieddate'],
				filters:
				[
					{
						field: 'type',
						value: app.whoami().mySetup.projectTypes.management
					},
					{
						field: 'subtype',
						value: app.whoami().mySetup.projectSubTypes.managementProfileWho
					},
					{
						field: 'contactperson',
						value: app.whoami().thisInstanceOfMe.user.contactperson
					}
				],
				callback: 'util-profile-who-project-init',
				callbackParam: param
			});
		}
		else
		{
			if (response.data.rows.length == 0)
			{
				$('.profile-who').addClass('disabled');
				app.invoke('util-profile-who-project-init-process', param)
			}
			else
			{
				var project = _.first(response.data.rows);

				if (_.startsWith(project.notes, '{'))
				{
					project._notes = JSON.parse(project.notes)
				}
				else
				{
					project._notes = {}
				}

				app.set(
				{
					scope: 'util-setup',
					context: 'profileWho',
					name: 'managementProject',
					value: project
				});

				$('.profile-who').addClass('disabled');

				if (project.status == app.whoami().mySetup.projectStatuses.notStarted)
				{
					app.invoke('util-profile-who-show', param);
				}
				else
				{
					if (project.status == app.whoami().mySetup.projectStatuses.completed)
					{
						$('.profile-who').removeClass('disabled');
					}

					app.invoke('uow-passport-dashboard')
				}
			}
		}
	}
});

app.add(
{
	name: 'util-profile-who-project-init-process',
	notes: 'Create a project for the tracking of the Profile Who (Am I / Are You) data based on the community linked template (.util)',
	code: function (param, response)
	{
		if (response == undefined)
		{
			var _description = 'Who (Am I / Are You) Profile.  Base information required to be part of a community.'

			/*
			description.template.project.title = 'Level Up; ' +  app.whoami().thisInstanceOfMe.user.userlogonname,
			description.template.project.version = {date: moment().format('D MMM YYYY')}
			var _description = JSON.stringify(description)
			*/

			var data = 
			{
				referencemask: 'PW??????',
				restrictedtoteam: 'Y',
				type: app.whoami().mySetup.projectTypes.management,
				subtype: app.whoami().mySetup.projectSubTypes.managementProfileWho,
				projectmanager: app.whoami().thisInstanceOfMe.user.id,
				contactperson: app.whoami().thisInstanceOfMe.user.contactperson,
				description: _description,
				status: app.whoami().mySetup.projectStatuses.notStarted
			}

			const sourceProjectTemplate = _.get(app.whoami(), 'mySetup.templates.who.project');

			if (sourceProjectTemplate != undefined)
			{
				data.sourceprojecttemplate = sourceProjectTemplate;
			}

			console.log(data)

			if (_.isSet(app.controller['util-octo-hey']))
			{
				let heyOctoTask =
				{
					name: 'add-project',
					data: data
				}

				app.invoke('util-octo-hey',
				{
					task: heyOctoTask,
					callback: 'util-profile-who-project-init',
					callbackParam: param
				});
			}
			else
			{
				entityos.cloud.save(
				{
					object: 'project',
					data: data,
					callback: 'util-profile-who-project-init-process',
					callbackParam: param
				});
			}
		}
		else
		{
			if (response.status == 'OK')
			{
				app.set(
				{
					scope: 'util-profile-who-project-init',
					context: 'projectID',
					value: response.id
				});

				app.invoke('util-profile-who-project-init-process-team', param)
			}
		}
	}
});

app.add(
{
	name: 'util-profile-who-project-init-process-team',
	code: function (param)
	{	
		app.set(
		{	
			scope: 'util-profile-who-project-init-process-team',
			context: 'index',
			value: 0
		});

		app.invoke('util-profile-who-project-init-process-team-init', param);
	}
});

app.add(
{
	name: 'util-profile-who-project-init-process-team-init',
	code: function (param, response)
	{	
		if (response == undefined)
		{
			var filters = [
			{
				field: 'contactperson',
				value: app.whoami().thisInstanceOfMe.user.contactperson
			}];

			//Set up in as part of sign up - relationship with admin as per settings.json

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
				callback: 'util-profile-who-project-init-process-team-init',
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
			})

			app.set(
			{	
				scope: 'util-profile-who-project-init-process-team',
				context: 'contact-relationships',
				value: contactRelationships
			});

			app.invoke('util-profile-who-project-init-process-team-process', param);
		}
	}
});

app.add(
{
	name: 'util-profile-who-project-init-process-team-process',
	code: function (param)
	{	
		var contactRelationships = app.get(
		{	
			scope: 'util-profile-who-project-init-process-team',
			context: 'contact-relationships'
		});

		var index = app.get(
		{	
			scope: 'util-profile-who-project-init-process-team',
			context: 'index'
		});

		if (index < contactRelationships.length)
		{
			var contactRelationship = contactRelationships[index];

			var projectID = app.get(
			{
				scope: 'util-profile-who-project-init',
				context: 'projectID'
			});

			var projectRole = app.whoami().mySetup.projectRoles.mentor;
			if (_.isSet(contactRelationship.role))
			{
				projectRole = contactRelationship.role;
			}
		
			var data =
			{
				project: projectID,
				startdate: moment().format('DD MMM YYYY'),
				contactbusiness: contactRelationship.othercontactbusiness,
				contactperson: contactRelationship.othercontactperson,
				projectrole: projectRole
			}

			entityos.cloud.save(
			{
				object: 'project_team',
				data: data,
				callback: 'util-profile-who-project-init-process-team-next',
				callbackParam: param
			});
		}
		else
		{
			app.invoke('util-profile-who-project-init', param);
		}
	}
});

app.add(
{
	name: 'util-profile-who-project-init-process-team-next',
	code: function (param, response)
	{	
		var index = app.get(
		{	
			scope: 'util-profile-who-project-init-process-team',
			context: 'index'
		});

		app.set(
		{	
			scope: 'util-profile-who-project-init-process-team',
			context: 'index',
			value: index + 1
		});

		app.invoke('util-profile-who-project-init-process-team-process', param);
	}
});

app.add(
{
	name: 'util-profile-who-show',
	code: function (param)
	{
		var profileWhoProject = app.get(
		{
			scope: 'util-setup',
			context: 'profileWho',
			name: 'managementProject'
		});

		let attachments = []

		const milestoneIndex = _.get(param, 'milestoneIndex', 0);
		
		var profileWho = app.whoami().mySetup.definitions.profileWho;

		if (milestoneIndex == profileWho.milestones.length)
		{
			app.invoke('util-profile-who-show-complete');
		}
		else
		{
			const milestone = profileWho.milestones[milestoneIndex];

			var profileWhoView = app.vq.init({queue: 'level-up-util-profile-render'});

			profileWhoView.add(
			[
				'<div class="pl-2 mt-3 mb-3">',
					'<h1 class="font-weight-bold text-primary mb-2">Hello ', app.whoami().thisInstanceOfMe.user.firstname, '</h1>',
					'<div class="mt-3 fw-bold">Enter the following information to complete your Future Me Program Application.</div>',
					'<div class="mt-2">Please note, your application will not be submitted until you fully complete the profile questions.</div>',
					'<div class="mt-2 pb-1">Applications for the Future Me Program close Sunday, 20 October 2024.</div>',
				'</div>'
			]);

			profileWhoView.add(
			[
				'<div class="card shadow">'
			]);

			profileWhoView.add(
			[
				'<div class="card-header">',
					'<h2 class="mb-0 text-dark fw-bold">', milestone.subject, '</h2>',
				'</div>'
			]);

			let taskControllers = [];

			_.each(milestone.tasks, function (task, taskIndex)
			{
				profileWhoView.add(
				[
					'<div class="card-body border-bottom border-light">',
						'<form autocomplete="off">'
				]);

				task.reflection = _.first(task.reflections);

				if (task.reflection != undefined)
				{
					const reflection = task.reflection;

					task._subjectSuffix = ' <span class="text-secondary"><sup>*</sup></span>';
					task._validateClass = ' entityos-validate';
					task._validateClassClick = ' entityos-validate-click';

					if (_.includes(reflection.rules, 'optional'))
					{
						task._subjectSuffix = '';
						task._validateClass = '';
						task._validateClassClick = '';
					}

					if (_.isNotSet(task.reflection.reference))
					{
						task.reflection.reference = _.lowerCase(_.kebabCase(task.subject))
					}

					reflection._context = 'reflection.' + milestone.reference + '.' + task.reference + '.' + _.kebabCase(task.reflection.reference);
					reflection._id = milestone.reference + '-' + task.reference + '-' + _.kebabCase(task.reflection.reference);

					reflection._note = _.get(profileWhoProject._notes, reflection._context, '');

					//data-validate-mandatory

					task._description = (_.isSet(task.description)?'<div class="text-secondary small mt-1">' + task.description + '</div>':'')

					if (reflection.method == 'observation')
					{
						if (_.includes(reflection.rules, 'many'))
						{
							profileWhoView.add(
							[
								'<div class="form-group mb-0">',
									'<label for="task-', reflection._context, '">',
										'<h4 class="mb-0">', task.subject, 
											task._subjectSuffix,
										'</h4>',
										task._description,
									'</label>',
									'<textarea style="height:120px;" class="form-control entityos-focus', task._validateClass, '"',
										' id="', reflection._context, '"',
										' data-id="', reflection._context, '"',
										' data-scope="util-profile-who-project-data"',
										' data-context="',reflection._context, '"',
										' data-validate-mandatory',
										' data-validate-minimum-length="50"',
										' data-validate-controller="util-profile-who-show-validate"',
										' data-controller="util-profile-who-project-data-update">',
										reflection._note,
									'</textarea>',
								'</div>'
							]);
						}
						else
						{
							profileWhoView.add(
							[
								'<div class="form-group mb-0">',
									'<label for="', reflection._context, '">',
										'<h4 class="mb-0">', task.subject, 
											task._subjectSuffix,
										'</h4>',
										task._description,
									'</label>',
									'<input class="form-control form-control-lg entityos-focus', task._validateClass, '"',
										' id="', reflection._context, '"',
										' data-scope="util-profile-who-project-data"',
										' data-context="', reflection._context, '"',
										' data-controller="util-profile-who-project-data-update"',
										' value="', reflection._note, '"',
										' data-validate-mandatory',
										' data-validate-controller="util-profile-who-show-validate"',
										'>',
								'</div>'
							]);
						}
					}

					if (reflection.method == 'date')
					{
						profileWhoView.add(
						[
							'<label for="',reflection._context, '">',
									'<h4 class="mb-0">', task.subject, 
										task._subjectSuffix,
									'</h4>',
									task._description,
								'</label>',
							'<div class="input-group date entityos-date myds-date" data-target-input="nearest" id="date-',reflection._id, '">',
								'<div class="input-group-prepend" data-target="#date-',reflection._id, '" data-toggle="datetimepicker">',
									'<div class="input-group-text"><i class="far fa-calendar-alt text-dark"></i></div>',
								'</div>',
			                  	'<input type="text" class="form-control form-control-lg input datetimepicker-input', task._validateClass, '"',
									' data-target="#date-', reflection._id, '"',
			                    	' id="',reflection._context, '-input"',
			                    	' data-scope="util-profile-who-project-data"',
									' data-context="', reflection._context, '"',
									' value="', reflection._note, '"',
									' data-controller="util-profile-who-project-data-update"',
									' data-validate-mandatory',
									' data-validate-controller="util-profile-who-show-validate">',
							'</div>'
						]);
					}

					if (reflection.method == 'info')
					{
						profileWhoView.add(
						[
							'<h4 class="mb-0">', task.subject, 
								task._subjectSuffix,
							'</h4>',
							task._description
						]);
					}

					if (reflection.method == 'attachment')
					{
						profileWhoView.add(
						[
							'<label for="task-', task.reference, '">',
									'<h4 class="mb-0">', task.subject, 
										task._subjectSuffix,
									'</h4>',
									task._description,
								'</label>',
							'<div id="task-', task.reference, '-attachments-container">',
							'</div>'
						]);

						attachments.push(
						{
							id: 'task-' + task.reference,
							subject: '<div>' + task.subject + task._subjectSuffix + '</div><div>' + task._description + '</div>'
						})
					}

					if (reflection.method == 'structured')
					{
						reflection._caption = reflection.subject;
						if (_.isNotSet(reflection._caption)) {reflection._caption = reflection.description}
						
						profileWhoView.add(
						[
							'<div class="form-group mb-0">',
								'<label for="util-project-do-milestone-task-', task.hash, '-reflection-', reflection.reference, '">',
										'<h4>', task.subject, task._subjectSuffix, '</h4>',
										task._description,
								'</label>',
								'<div id="', _.replace(reflection._context, /\./g, '-'), '-view">'
						]);

						if (_.isPlainObject(reflection.structure))
						{
							var options = reflection.structure.options;

							if (_.isArray(options))
							{
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

								let structureType = 'radio';

								if (_.includes(reflection.structure.rules, 'many'))
								{
									structureType = 'checkbox';
								}

								_.each(options, function (option, optionIndex)
								{
									option._checked = '';

									if (_.includes(reflection._note.split(','), option.caption))
									{
										option._checked = ' checked="checked"'
									}

									let optionReference = optionIndex;
									if (_.isSet(option.reference))
									{
										optionReference = option.reference
									}

									profileWhoView.add(
									[
										'<div class="ml-md-4 radio-inline radio-lg mb-1">',
											'<input', task._disabled, ' type="', structureType, '" class="entityos-check mr-1', task._validateClassClick, '" ',
											' id="', reflection._context, '-', optionReference, '"',
											' name="',reflection._context, '"',
											' value="',option.caption, '"',
											' data-id="', option.caption, '"',
											' data-points="', option.points, '"',
											' data-name="', reflection._context, '"',
											' data-scope="util-profile-who-project-data"',
											' data-context="',reflection._context, '"',
											' data-controller="util-profile-who-project-data-update"',
											' data-validate-mandatory',
											' data-validate-controller="util-profile-who-show-validate"',
											' data-validate-parent-selector="#', _.replace(reflection._context, /\./g, '-'), '-view"',
											option._checked,
											'>',
												option.caption,
										'</div>'
									]);
								});
							}
							else if (_.isPlainObject(options))
							{
								//set up as a select text box with data
								// then get from the URL or dataScope / data.context

								if (_.has(options, 'controller'))
								{
									taskControllers.push({name: options.controller})
								}

								profileWhoView.add(
								[
									'<div class="mb-0">',
										'<select ', task._disabled,
											' id="',  _.replace(reflection._context, /\./g, '-'), '-', optionReference, '"',
											' data-name="', reflection._context, '"',
											' class="util-profile-who-select', task._validateClassClick, '" ',
											' data-type="choices"',
											' data-scope="util-profile-who-project-data"',
											' data-context="', reflection._context, '"',
											' data-controller="util-profile-who-project-data-update"',
											' data-validate-mandatory',
											' data-validate-controller="util-profile-who-show-validate"',
											' multiple>',
										'</select>',
									'</div>'
								]);
							}
						}

						profileWhoView.add('</div></div>');
					}
				}

				profileWhoView.add(
				[
						'</form>',
					'</div>'
				]);
			});

			profileWhoView.add(
			[
				'<div class="card-footer">',
					'<div class="row align-items-end">',
						'<div class="col text-left">',
							'<button class="btn btn-default btn-outline entityos-click"',
								' data-controller="util-profile-who-show-next"',
								' data-milestone="', milestoneIndex, '">Next <i class="far fa-chevron-right"></i></button>',
						'</div>',
					'</div>',
				'</div>'
			]);

			profileWhoView.add(
			[
				'</div>'
			]);

			profileWhoView.render('#uow-passport-dashboard-profile-view');

			$('html, body').animate(
			{
				scrollTop: ($('#uow-passport-dashboard-profile-view').offset().top - 80)
			}, 'slow');

			entityos._util.view.datepicker({selector: '.entityos-date, .myds-date', format: 'D MMM YYYY', pickerOptions: {buttons: {showClear: true}, defaultDate: moment().add(-17, 'years')}});
			entityos._util.view.datepicker({selector: '.entityos-date-time, .myds-date-time', format: 'D MMM YYYY LT', pickerOptions: {defaultDate:''}});

			app.invoke('util-validate-check')

			_.each(attachments, function (attachment)
			{
				app.invoke('util-attachments-initialise',
				{
					context: attachment.id,
					object: app.whoami().mySetup.objects.project,
					objectContext: profileWhoProject.id,
					showTypes: false,
					collapsible: false,
					_headerHTML: '<div class="card-header">' +
									'<h3 class="mb-1 mt-0">' + attachment.subject + '</h3>' +
								'</div>'
				});
			});

			_.each(taskControllers, function (taskController)
			{
				app.invoke(taskController)
			});

			let elementsSelect = $('.util-profile-who-select')
			// .util-profile-who-select > Get Elements > ...

			if (elementsSelect.length > 0)
			{
				console.log(elementsSelect);
				app.invoke('util-view-select',
				{
					container: $(elementsSelect).attr('id'),
					data: dataXXX
				});
			}
		}
	}
});

app.add(
{
	name: 'util-profile-who-show-next',
	code: function (param)
	{
		let milestoneIndex = _.get(param, 'dataContext.milestone', 0);
		milestoneIndex = (milestoneIndex + 1);

		app.invoke('util-profile-who-show', {milestoneIndex: milestoneIndex});
	}
});

app.add(
{
	name: 'util-profile-who-show-validate',
	code: function (param)
	{
		//param.scopeErrors = false // for testing

		//check for task refection controllers

		let data = _.get(param, 'dataContext');

		if (_.isSet(data))
		{
			// Find the reflection
			// Check all code below

			let reflection = _.find()

			if (_.has(reflection, 'controllers'))
			{
				_.each(reflection.controllers, function (controller)
				{
					if (controller.points == reflection.points)
					{
						// do the "set"
						_.each(controller.references, function (reference)
						{
							// get the task reference based on context
							let _reference = _.find( '...' , reference)

							if (_.isSet(reference))
							{
								if (_.has(controller, 'set.rules'))
								{
									_.set(reference, 'rules', _.get(controller, 'set.rules'))
								}

								if (_.has(controller, 'set.class'))
								{
									// get element
									// .setClass()
								}

								if (_.has(controller, 'remove.class'))
								{
									// get element
									// .removeClass()
								}
							}
						})
					}
				});
			}

		}

		/*
			"controllers":
			[
				{
					"points": "1",
					"context": "task",
					"references": ["4-2", "4-3", "4-4", "4-5", "4-6"],
					"set": {"rules": ["optional"], "class": "d-none"},
					"remove": {"class": "d-block"},
					"controller": "util-validate-check"
				},
				{
					"points": "0",
					"context": "task",
					"references": ["4-2", "4-3", "4-4", "4-5", "4-6"],
					"set": {"rules": [], "class": "d-block"},
					"remove": {"class": "d-done"},
					"controller": "util-validate-check"
				}
			]
		*/

		$('[data-controller="util-profile-who-show-next"]')[(param.scopeErrors?'add':'remove') + 'Class']('disabled');
	}
})

app.add(
{
	name: 'util-profile-who-project-data-update',
	code: function (param)
	{
		var profileWhoProject = app.get(
		{
			scope: 'util-setup',
			context: 'profileWho',
			name: 'managementProject'
		});

		var data = app.get(
		{
			scope: 'util-profile-who-project-data'
		});

		console.log(data)

		_.each(data, function (dataValue, dataKey)
		{
			//console.log(dataKey);

			//if (!_.startsWith(dataKey, '_') && !_.includes(dataKey, '-unselected') && !_.includes(dataKey, 'dataID'))
			if (_.startsWith(dataKey, 'reflection.') && !_.includes(dataKey, '-unselected'))
			{
				if (true || _.has(templateFile, dataKey))
				{
					//console.log(dataValue);
					//dataKey = _.replace(dataKey, 'reflection.', '');
					_.set(profileWhoProject._notes, dataKey, dataValue);
				}
			}
		});

		console.log(profileWhoProject)

		var dataBase64 = app.invoke('util-convert-to-base64', JSON.stringify(profileWhoProject));

		app.invoke('util-local-cache-save',
		{
			key: 'util-profile-who-project-' + profileWhoProject.guid,
			persist: true,
			data: dataBase64 + '|' + btoa(moment().utc().format())
		});

		// TODO Validation check to disabled the Next > button

		app.invoke('util-profile-who-project-save');
	}
});


app.add(
{
	name: 'util-profile-who-project-save',
	code: function (param, reponse)
	{
		var profileWhoProject = app.get(
		{
			scope: 'util-setup',
			context: 'profileWho',
			name: 'managementProject'
		});

		var data =
		{
			id: profileWhoProject.id,
			notes: JSON.stringify(profileWhoProject._notes)
		}

		console.log(profileWhoProject._notes)
	
		entityos.cloud.save(
		{
			object: 'project',
			data: data
		});
	}
});


app.add(
{
	name: 'util-profile-who-reflection-hash',
	code: function (param, response)
	{	
		var reflection = app._util.param.get(param, 'reflection').value;
        var task = app._util.param.get(param, 'task').value;
        var milestone = app._util.param.get(param, 'milestone').value;

        reflection._hash = reflection.id;

        if (reflection._hash == undefined && _.isSet(reflection.reference))
        {
            reflection._hash = task.reference;
        }

        if (reflection._hash == undefined && _.isSet(task.subject))
        {
            reflection._hash = reflection.subject;
        }

        reflection._hash = milestone.reference + '--' + task.reference + '--' + reflection._hash;

        reflection.hash = app.invoke('util-protect-hash', {data: reflection._hash}).dataHashed;

        return reflection;
	}
});