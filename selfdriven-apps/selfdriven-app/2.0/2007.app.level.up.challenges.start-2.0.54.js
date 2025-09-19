/*
	{
    	title: "Level Up; Challenges", 	
    	design: "https://slfdrvn.io/levelup"
  	}
*/

app.add(
{
	name: 'level-up-challenges-start',
	code: function (param, response)
	{	
		console.log(param)

		var levelUpProfileProjectTemplate = app.whoami().mySetup.levelUp.managementProjectTemplate.template.project;
		var outcomeID = app._util.param.get(param, 'id', '').value;
		var profileOutcome;

		if (_.isSet(outcomeID))
		{
			var _outcome = _.split(outcomeID, '-');
			var reference = _.last(_outcome);
			profileOutcome = _.find(levelUpProfileProjectTemplate.outcomes, function (outcome)
			{
				return (outcome.reference == reference)
			});

			app.set(
			{
				scope: 'level-up-challenges-start',
				context: 'profile-outcome',
				value: profileOutcome
			});
		}

		var startView = app.vq.init({queue: 'level-up-challenges-info-profile'});

		if (_.isSet(profileOutcome))
		{
			startView.add(
			[
				'<div class="card mt-3">',
					'<div class="card-body">',
						'<div class="row align-items-end">',
							'<div class="col">',
								'<h3 class="fw-bold">',
									'This challenge project will be based on the following challenge you have selected from your Level Up profile.',
								'</h3>',
								'<div class="text-secondary mt-3">',
									'Before creating the project, make sure you and your learning-partners are happy with the challenge i.e. outcome is achieveable within the timeframe etc.',
								'</div>',
								'<div class="mt-4 fw-bold">',
									profileOutcome.description,
								'</div>',
							'</div>',
							'<div class="col-auto">',
								'<button class="btn btn-default btn-sm entityos-click"',
									' role="button"',
									' data-controller="level-up-challenges-start-project-init"',
									' aria-expanded="true" data-spinner="append">Create as a Project</button>',
							'</div>',
						'</div>',
					'</div>',
				'</div>'
			])
		}

		startView.render('#level-up-challenges-start-view');
	}
});

app.add(
{
	name: 'level-up-challenges-start-project-init',
	code: function (param, response)
	{	
		var levelUpManagementProject = app.whoami().mySetup.levelUp.managementProject;
		var levelUpManagementProjectTemplate = app.whoami().mySetup.levelUp.managementProjectTemplate;

		var profileOutcome = app.get(
		{
			scope: 'level-up-challenges-start',
			context: 'profile-outcome'
		});

		if (_.isUndefined(response))
		{
			if (_.isNotSet(profileOutcome))
			{
				app.notify({type: 'error', message: 'No Level Up profile challenge selected!'})
			}
			else if (_.isNotSet(levelUpManagementProject))
			{
				app.notify({type: 'error', message: 'No Level Up profile set up!'})
			}
			else
			{
				var data =
				{
					category: app.whoami().mySetup.projectCategories.small,
					contactbusiness: app.whoami().thisInstanceOfMe.user.contactbusiness,
					contactperson: app.whoami().thisInstanceOfMe.user.contactperson,
					title: profileOutcome.description.substring(0, 250),
					description: profileOutcome.description,
					handovernotes: 'Based on Level Up profile challenge with reference ' +  profileOutcome.reference,
					notes: '',
					percentagecomplete: 0,
					projectmanager: app.whoami().thisInstanceOfMe.user.id,
					referencemask: 'L????',
					restrictedtoteam: 'Y',
					sourceprojecttemplate: levelUpManagementProject.id,
					parentproject: levelUpManagementProject.id,
					startdate: moment().format('DD MMM YYYY'),
					status: 1,
					type: app.whoami().mySetup.projectTypes.learning,
					subtype: app.whoami().mySetup.projectSubTypes.learningLevelUp,
					datareturn: 'guid'
				}

				console.log(data);

				mydigitalstructure.cloud.save(
				{
					object: 'project',
					data: data,
					callback: 'level-up-challenges-start-project-init'
				});
			}
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.invoke('util-view-spinner-remove-all');

				app.set(
				{
					scope: 'level-up-challenges-start',
					context: 'projectID',
					value: response.id
				});

				app.set(
				{
					scope: 'level-up-challenges-start',
					context: 'projectGUID',
					value: _.first(response.data.rows).guid
				});

				app.invoke('level-up-challenges-start-profile-save');
				app.invoke('level-up-challenges-start-project-team');
			}
		}
	}
});

app.add(
{
	name: 'level-up-challenges-start-profile-save',
	code: function (param, response)
	{	
		var levelUpManagementProjectTemplate = app.whoami().mySetup.levelUp.managementProjectTemplate;
		var levelUpManagementAction = app.whoami().mySetup.levelUp.managementAction;

		var profileOutcome = app.get(
		{
			scope: 'level-up-challenges-start',
			context: 'profile-outcome'
		});

		if (profileOutcome != undefined)
		{
			if (response == undefined)
			{
				var outcome = _.find(levelUpManagementProjectTemplate.template.project.outcomes, function (outcome)
				{
					return outcome.reference == profileOutcome.reference
				});

				var projectGUID = app.get(
				{
					scope: 'level-up-challenges-start',
					context: 'projectGUID'
				});

				if (_.isSet(outcome))
				{
					outcome.uri = projectGUID
			
					var saveData = 
					{
						text: JSON.stringify(levelUpManagementProjectTemplate),
						id: levelUpManagementAction.id
					}
					
					mydigitalstructure.cloud.save(
					{
						object: 'action',
						data: saveData,
						callback: 'level-up-challenges-start-profile-save'
					});
				}
			}
		}
	}
});

app.add(
{
	name: 'level-up-challenges-start-project-team',
	code: function (param, response)
	{	
		app.set(
		{	
			scope: 'level-up-challenges-start-project-team',
			context: 'index',
			value: 0
		});

		app.invoke('level-up-challenges-start-project-team-init');
	}
});

app.add(
{
	name: 'level-up-challenges-start-project-team-init',
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
				callback: 'level-up-challenges-start-project-team-init',
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
				scope: 'level-up-project-init-process-team',
				context: 'contact-relationships',
				value: contactRelationships
			});

			app.invoke('level-up-challenges-start-project-team-process');
		}
	}
});

app.add(
{
	name: 'level-up-challenges-start-project-team-process',
	code: function (param)
	{	
		var contactRelationships = app.get(
		{	
			scope: 'level-up-project-init-process-team',
			context: 'contact-relationships'
		});

		var index = app.get(
		{	
			scope: 'level-up-challenges-start-project-team',
			context: 'index'
		});

		if (index < contactRelationships.length)
		{
			var contactRelationship = contactRelationships[index];

			var projectID = app.get(
			{
				scope: 'level-up-challenges-start',
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
				callback: 'level-up-challenges-start-project-team-next',
				callbackParam: param
			});
		}
		else
		{
			app.invoke('level-up-challenges-start-project-team-finalise');
		}
	}
});

app.add(
{
	name: 'level-up-challenges-start-project-team-next',
	code: function (param, response)
	{	
		var index = app.get(
		{	
			scope: 'level-up-challenges-start-project-team',
			context: 'index'
		});

		app.set(
		{	
			scope: 'level-up-challenges-start-project-team',
			context: 'index',
			value: index + 1
		});

		app.invoke('level-up-challenges-start-project-team-process');
	}
});

app.add(
{
	name: 'level-up-challenges-start-project-team-finalise',
	code: function (param, response)
	{	
		var projectGUID = app.get(
		{
			scope: 'level-up-challenges-start',
			context: 'projectGUID'
		});

		app.invoke('util-view-spinner-remove-all');
		console.log(response);
		app.notify({message: 'Challenge project has been created.'});
		app.invoke('app-navigate-to', {controller: 'learner-project-summary', context: projectGUID});
	}
});


