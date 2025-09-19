/*
	{
    	title: "Level Up; Profile", 	
    	design: "https://slfdrvn.io/apps"
  	}
*/

app.add(
{
	name: 'learner-me-level-up',
	code: function (param, response)
	{
		
	}
});

app.add(
{
	name: 'learner-me-level-up-edit',
	code: function (param, response)
	{	
		var data = app.whoami().mySetup.levelUp.managementProjectTemplate;

		if (!_.has(data, 'template.project'))
		{
			app.invoke('level-up-project-init',
			{
				callback: 'learner-me-level-up-edit'
			});
		}
		else
		{
			app.set(
			{
				scope: 'learner-me-level-up-summary',
				context: 'dataContext',
				value: data
			});

			data = _.assign(data,
			{
				firstname: app.whoami().thisInstanceOfMe.user.firstname,
				surname: app.whoami().thisInstanceOfMe.user.surname,
				id: app.whoami().thisInstanceOfMe.user.id,
			});

			app.view.refresh(
			{
				scope: 'learner-me-level-up-edit',
				selector: '#learner-me-level-up-edit',
				data: data
			});

			var learnerLevelUpTemplate = app.set(
			{
				scope: 'util-setup',
				context: 'learnerLevelUpTemplate',
				value:	
				[
					{
						caption: 'I want to Improve',
						code: 'improve',
						alternateCaption: 'Skills',
						template: 'skills/gained',
						icon: '<i class="fe fe-sun me-1"></i>',
						viewController: 'learner-me-level-up-edit-improve-view',
						showController: 'learner-me-level-up-edit-improve-show' 
					},
					{
						caption: 'By Doing Challenges',
						code: 'by',
						alternateCaption: 'To Do Tasks',
						template: 'milestone/0/tasks',
						icon: '<i class="fe fe-target me-1"></i>',
						viewController: 'learner-me-level-up-edit-by-view',
						showController: 'learner-me-level-up-edit-by-show' 
					},
					{
						caption: 'With',
						code: 'with',
						alternateCaption: 'Team',
						template: 'team',
						icon: '<i class="fe fe-users me-1"></i>',
						viewController: 'learner-me-level-up-edit-with-view'
					},
					{
						caption: 'Supported By',
						code: 'supported',
						alternateCaption: 'Connections (Learners & Learning-Partners)',
						template: 'connections',
						icon: '<i class="fe fe-share-2 me-1"></i>',
						viewController: 'learner-me-level-up-edit-supported-view'
					},
					{
						caption: 'For',
						code: 'for',
						alternateCaption: 'Achievements & Rewards',
						template: '-s',
						icon: '<i class="fe fe-star me-1"></i>',
						viewController: 'learner-me-level-up-edit-for-view',
						showController: 'learner-me-level-up-edit-for-show' 
					}
				]
			});

			var levelUpView = app.vq.init({queue: 'learner-me-level-up-edit'});

			levelUpView.add(
			[
				'<div class="container-fluid pb-4"><div class="card shadow-lg mb-4"><div class="card-body pt-2">',
					'<div class="row">',
						'<div class="col-12">'
			]);

						levelUpView.add(
						[
							'<ul class="nav nav-tabs mb-3 mb-md-4">'
						]);

						_.each(learnerLevelUpTemplate, function (learnerLevelUpTemplateItem, itemIndex)
						{
							learnerLevelUpTemplateItem._header = '<span class="d-none d-md-inline" style="font-size:1.1rem;">' +
																		learnerLevelUpTemplateItem.caption + '</span>';
						
							if (_.isSet(learnerLevelUpTemplateItem.icon))
							{
								learnerLevelUpTemplateItem._header = learnerLevelUpTemplateItem.icon +
									learnerLevelUpTemplateItem._header;
							}

							if (!_.isSet(learnerLevelUpTemplateItem.showController))
							{
								learnerLevelUpTemplateItem.showController = ''
							}

							levelUpView.add(
							[	
								'<li class="nav-item myds-tab">',
									'<a class="nav-link', (itemIndex==0?' active':''), '" data-toggle="tab"',
											' href="#learner-me-level-up-edit-', learnerLevelUpTemplateItem.code, '"',
											' data-controller="', learnerLevelUpTemplateItem.showController, '"',
											' data-context="', learnerLevelUpTemplateItem.code, '"',
									'>',
										learnerLevelUpTemplateItem._header,
										'</a>',
								'</li>'
							]);
						});

						levelUpView.add(
						[
							'</ul>',
							'<div class="tab-content">'
						]);

						_.each(learnerLevelUpTemplate, function (learnerLevelUpTemplateItem, itemIndex)
						{
							levelUpView.add(
							[
								'<div class="tab-pane', (itemIndex==0?' active':''), '" id="learner-me-level-up-edit-', learnerLevelUpTemplateItem.code, '">',
									'<div class="p-md-2 pb-0 pt-1 pt-md-0"',
											' id="learner-me-level-up-edit-', learnerLevelUpTemplateItem.code, '-container"',
									'>'
							]);

							if (_.isSet(learnerLevelUpTemplateItem.viewController))
							{
								levelUpView.add(app.invoke(learnerLevelUpTemplateItem.viewController));
							}
							else
							{
								levelUpView.add(learnerLevelUpTemplateItem.alternateCaption);
							}
							
							levelUpView.add(
							[
									'</div>',
								'</div>'
							]);
						});

						levelUpView.add(
						[		
							'</div>'	
						]);
			
			levelUpView.add(
			[		
				'</div></div>',
				'</div></div>',
					'<div class="row mt-4">',
						'<div class="col-12">',
							'<div class="text-center"><a data-toggle="collapse" role="button" href="#learner-me-level-up-edit-by-reflections">View Reflections/Comments By Learning Partners <i class="fe fe-chevron-down"></i></a></div>',
							'<div class="collapse entityos-collapse" id="learner-me-level-up-edit-by-reflections"',
							' data-controller="learner-me-level-up-edit-by-show-reflections">',
								'<div class="card mt-3 mb-0"><div class="card-body p-1">',
									'<div id="learner-me-level-up-edit-by-reflections-view"></div>',
								'</div></div>',
							'</div>',
						'</div>',
					'</div>',
					
					'<div class="row mt-4 mb-6">',
						'<div class="col-12">',
							'<div class="text-center"><a data-toggle="collapse" role="button" href="#learner-me-level-up-edit-sharing">View & Manage Who Can See Your Level Up Profile <i class="fe fe-chevron-down"></i></a></div>',
							'<div class="collapse entityos-collapse" id="learner-me-level-up-edit-sharing"',
							' data-controller="learner-me-level-up-edit-sharing">',
								'<div class="card mt-3"><div class="card-body p-1">',
									'<div id="learner-me-level-up-edit-sharing-view"></div>',
									'<div class="text-center"><a class="btn btn-link" data-toggle="collapse" role="button"',
										'href="#learner-me-level-up-edit-sharing-edit-collapse">',
										'Add Sharing <i class="fe fe-chevron-down"></i>',
									'</a></div>',

									'<div class="collapse myds-collapse" id="learner-me-level-up-edit-sharing-edit-collapse"',
										' data-controller="learner-me-level-up-edit-sharing-edit"',
										' data-context="learner-me-level-up-edit-sharing-edit">',
										'<div class="card mt-3 px-sm-5">',
											'<div id="learner-me-level-up-edit-sharing-edit-view" class="card-body pb-3 px-4">',
												'<div class="form-group text-center">',
													'<h4><label class="text-muted mb-1"',
															' for="learner-me-level-up-edit-sharing-edit-contactperson">',
															' Share Level Up Profile With',
														'</label>',
													'</h4>',
													'<select class="form-control input-lg myds-select"',
														' id="learner-me-level-up-edit-sharing-edit-contactperson"',
														' style="width:100%;" data-id=""',
														' data-scope="learner-me-level-up-edit-sharing-edit"',
														' data-context="contactperson">',
													'</select>',
												'</div>',
												'<div class="form-group text-center mb-0">',
													'<button type="button"',
														' class="btn btn-default btn-outline mr-2 mb-3 myds-click"',
														' data-context="learner-me-level-up-edit-sharing-edit"',
														' data-controller="learner-me-level-up-edit-sharing-edit-save">',
														' Save',
													'</button>',
												'</div>',
											'</div>',
										'</div>',
									'</div>',
								'</div></div>',
							'</div>',
						'</div>',
					'</div>',
				'</div>'
			]);

			levelUpView.render('#learner-me-level-up-edit-view');

			var learnerLevelUpTemplateDefault = _.first(learnerLevelUpTemplate);

			if (_.isSet(learnerLevelUpTemplateDefault.showController))
			{
				app.invoke(learnerLevelUpTemplateDefault.showController)
			}
		}
	}
});

app.add(
{
	name: 'learner-me-level-up-edit-improve-view',
	code: function (param, response)
	{	
		var dataLevelUp = app.whoami().mySetup.levelUp;
		var _templateSkillsNotes = dataLevelUp.managementProjectTemplate.template.project.skills.notes;
		if (_.isNotSet(_templateSkillsNotes)) {_templateSkillsNotes = ''}

		var showSelectChecked = '';
		var _templateSkillsMode = dataLevelUp.managementProjectTemplate.template.project.skills.mode;
		
		if (_templateSkillsMode == 'focused') // exploring
		{
			showSelectChecked = ' checked="checked"'
		}
		
		var levelUpImproveView = app.vq.init({queue: 'learner-me-level-up-edit-improve'});

		levelUpImproveView.add(
		[
			'<div class="row">',
				'<div class="col-12 col-md-8">',
					'<div class="alert alert-info shadow">',
						'<div class="col-12 mt-1 pl-1">',
							'<h3 class="mb-2">Select the skills you want to improve.</h3>',
							'<div class="text-secondary">Suggest talking to friends and learning partners for suggestions on which skills to focus on.</div>',
						'</div>',
					'</div>',
				'</div>',
				'<div class="col-12 col-md-4">',
					'<div class="alert alert-info shadow text-center">',
						'<div class="col-12 mt-1 px-0">',
							'<input type="checkbox" class="entityos-check me-1" name="learner-me-level-up-edit-improve-skills-show-selected-only" data-controller="learner-me-level-up-edit-improve-show-select" data-scope="learner-me-level-up-edit-improve-show-select" data-context="skill-show-select"', showSelectChecked, '></input> Show Selected Only',
						'</div>',
					'</div>',
				'</div>',
			'</div>',
			'<div class="mt-2" id="learner-me-level-up-edit-improve-skills-view"></div>',
			'<div class="mt-4">',
				'<h3>Other Notes</h3>',
				'<textarea style="height:100px;"',
					' class="form-control myds-text entityos-focus"',
					' id="learner-me-level-up-edit-improve-notes"',
					' data-scope="learner-me-level-up-edit"',
					' data-context="improvenotes"',
					' data-controller="learner-me-level-up-edit-save"',
					' data-enter="ok">',
						_templateSkillsNotes,
				'</textarea>',
			'</div>'
		]);

		return levelUpImproveView.get();
	}
});

app.add(
{
	name: 'learner-me-level-up-edit-improve-show-select',
	code: function (param)
	{
		var selected = app._util.param.get(param, 'selected', {default: false}).value;
		var showParam =
		{
			mode: (selected?'selected-only':'all')
		}

		var dataLevelUp = app.whoami().mySetup.levelUp;
		var _template = dataLevelUp.managementProjectTemplate.template.project;

		if (_template.skills == undefined) {_template.skills = {}}
		_template.skills.mode = (selected?'focused':'exploring');

		var saveData = 
		{
			description: JSON.stringify(dataLevelUp.managementProjectTemplate),
			id: dataLevelUp.managementProject.id
		}
		
		entityos.cloud.save(
		{
			object: 'project',
			data: saveData
		});

		app.invoke('learner-me-level-up-edit-improve-show', showParam);
	}
});

app.add(
{
	name: 'learner-me-level-up-edit-improve-show',
	notes: 'If no skills.gained in the template then show the edit select.',
	code: function (param, response)
	{
		var dataLevelUp = app.whoami().mySetup.levelUp;
		var _templateSkillsGained = dataLevelUp.managementProjectTemplate.template.project.skills.gained;
		var communitySkills = app.whoami().mySetup.levelUpCommunitySkills;

		var mode = app._util.param.get(param, 'mode').value;

		if (_.isNotSet(mode))
		{
			var _templateSkillsMode = dataLevelUp.managementProjectTemplate.template.project.skills.mode;
			var mode = (_templateSkillsMode=='focused'?'selected-only':'all');
		}

		var improveView = app.vq.init({queue: 'learner-me-level-up-improve'});

		improveView.add(
		[
			'<table class="table table-condensed mb-0 m-b-0">',
				'<tbody>'
		]);

		_.each(communitySkills, function (skill)
		{
			var _checked = '';
			var skillNotes = '';
			var skillNotesClass = ' d-none';
			var skillClass = (mode=='selected-only'?' d-none':'');

			var _skill = _.find(_templateSkillsGained, function (skillgained)
			{
				return skillgained.uri == skill.uri
			});

			if (_skill != undefined)
			{
				_checked = ' checked="checked"';
				skillNotesClass = '';
				skillClass = '';

				if (_.isSet(_skill.notes))
				{
					skillNotes = _skill.notes;
				}
			}

			improveView.add(
			[
				'<tr class="d-flex', skillClass, '" data-uri="', skill.uri, '">',
					'<td class="col-1 text-center">',
						'<input type="checkbox" class="entityos-check" name="learner-me-level-up-edit-improve-skills"',
						' data-controller="learner-me-level-up-edit-save" data-scope="learner-me-level-up-edit" ',
						' data-id="', skill.uri, '" data-uri="', skill.uri, '"',
						' data-name="skill"',
						' data-context="skill-', skill.uri,'"',
						_checked,
						'></input>',
					'</td>',
					'<td class="col-11 text-left">',
						'<h3 class="mb-1">', skill.caption, '</h3>',
						'<div class="text-secondary">', skill.description, '</div>',
						'<textarea style="height:60px;"',
							' class="form-control myds-text entityos-focus mt-2', skillNotesClass, '"',
							' id="learner-me-level-up-edit-improve-notes"',
							' data-scope="learner-me-level-up-edit"',
							' data-context="skillnotes-', skill.uri, '"',
							' data-controller="learner-me-level-up-edit-save"',
							' data-enter="ok" placeholder="Why do you want to improve this skill?">',
								skillNotes,
							'</textarea>',
					'</td>',
				'</tr>'
			]);
		});

		improveView.add(
		[
			'</table>'
		]);
		
		improveView.render('#learner-me-level-up-edit-improve-skills-view')
	}
});

app.add(
{
	name: 'learner-me-level-up-edit-by-view',
	code: function (param, response)
	{	
		var dataLevelUp = app.whoami().mySetup.levelUp;
		var _templateSkillsGainedURIs = _.map(dataLevelUp.managementProjectTemplate.template.project.skills.gained, 'uri');
		var communitySkills = app.whoami().mySetup.levelUpCommunitySkills;

		var skillsSelected = _.filter(communitySkills, function (communitySkill)
		{
			return _.includes(_templateSkillsGainedURIs, communitySkill.uri)
		});

		var levelUpByView = app.vq.init({queue: 'learner-me-level-up-edit-by'});

		levelUpByView.add('<div class="row">');

		levelUpByView.add(
		[
			'<div class="col-12 col-md-7">',
				'<div class="alert alert-info mb-0 shadow">',
					'<div class="col-12 mt-1 pl-1 pr-4">',
						'<h3 class="">List The Challenges You Would Like To Do</h3>',
						'<div class="text-secondary">Once you and your learning-partners are happy with your challenges, you can then create them as projects.</div>',
					'</div>',
				'</div>',
			'</div>'
		]);

		levelUpByView.add(
		[
			'<div class="col-12 col-md-5">',
				'<div class="alert alert-info mb-0 shadow">',
					'<div class="col-12 mt-1 pl-1 pr-1">'
		]);

		if (skillsSelected.length == 0)
		{
			levelUpByView.add(
			[
					'<h3 class="mb-0">You haven\'t yet selected any skills to improve/level-up.</h3>'
			]);
		}
		else
		{
			levelUpByView.add(
			[
					'<h3 class="mb-2">Your Selected Skills</h3>',
					'<ul class="mb-0">'
			]);

			_.each(skillsSelected, function (skillSelected)
			{
				levelUpByView.add(
				[
						'<li class="text-secondary">', skillSelected.caption, '</li>'
				]);
			});

			levelUpByView.add(
			[
					'</ul>'
			]);
		}

		levelUpByView.add(
		[
						'</div>',
					'</div>',
				'</div>',
			'</div>',
			'<div class="mt-2" id="learner-me-level-up-edit-by-challenges-view"></div>'
		]);

		return levelUpByView.get();
	}
});

app.add(
{
	name: 'learner-me-level-up-edit-by-show',
	notes: '',
	code: function (param)
	{
		var dataLevelUp = app.whoami().mySetup.levelUp;
		var _templateOutcomes = dataLevelUp.managementProjectTemplate.template.project.outcomes;
		var showOutcomeIndex = app._util.param.get(param, 'showOutcomeIndex', {default: 0}).value;

		var byView = app.vq.init({queue: 'learner-me-level-up-by'});

		byView.add(
		[
			'<div class="row pt-3">',
    			'<div class="col-1 border-right">',
					'<div class="nav flex-column nav-pills" id="learner-me-level-up-edit-by-pills-tab" role="tablist" aria-orientation="vertical">'
		]);

		var sequence = 0;

		_.each(_templateOutcomes, function (outcome, outcomeIndex)
		{
			sequence = (sequence + 1);
			outcome.reference = sequence;
			var activeClass = (outcomeIndex==showOutcomeIndex?' active':'');

			byView.add(
			[
						'<a class="nav-link text-center fw-bold', activeClass, '" id="learner-me-level-up-edit-by-pills-', outcome.reference ,'-tab" data-toggle="pill" href="#learner-me-level-up-edit-by-pills-', outcome.reference ,'" role="tab" aria-controls="learner-me-level-up-edit-by-pills-1" aria-selected="true">',
							outcome.reference,
						'</a>'
			]);
		});

		byView.add(
		[
						'<button class="nav-link text-center fw-bold border-top mt-2 entityos-click" data-toggle="pill" href="#learner-me-level-up-edit-by-pills-add" role="tab" aria-controls="learner-me-level-up-edit-by-pills-1" aria-selected="true"',
							' data-controller="learner-me-level-up-edit-by-show-outcome-add"',
							' data-reference="', (sequence + 1), '"', 
						'>',
							'<i class="fe fe-plus"></i>',
						'</button>',
					'</div>',
				'</div>',
				'<div class="col-11 pt-2 pl-3">',
					'<div class="tab-content" id="learner-me-level-up-edit-by-pills-tabContent">',
		]);

		var sequence = 0;

		_.each(_templateOutcomes, function (outcome, outcomeIndex)
		{
			sequence = (sequence + 1);
			outcome.reference = sequence;
			var activeClass = (outcomeIndex==showOutcomeIndex?' show active':'');

			byView.add(
			[
						'<div class="tab-pane fade', activeClass, '" id="learner-me-level-up-edit-by-pills-', outcome.reference ,'" role="tabpanel" aria-labelledby="learner-me-level-up-edit-by-pills-', outcome.reference ,'-tab">'
			]);

			byView.add(app.invoke('learner-me-level-up-edit-by-show-outcome', outcome));

			byView.add(
			[
						'</div>'
			]);
		});

		if (_templateOutcomes.length == 0)
		{
			byView.add(
			[
						'<div class="text-secondary mt-2">Click + to add a challenge.</div>'
			]);
		}

		byView.add(
		[
					'</div>',
				'</div>',
			'</div>'
		]);

		/*byView.add(
		[
			'<div class="row mt-3 pt-4 border-top">',
				'<div class="col-12 text-center">',
					'<div><a data-toggle="collapse" role="button" href="#learner-me-level-up-edit-by-reflections">View Reflections/Comments By Learning Partners <i class="fe fe-chevron-down"></i></a></div>',
					'<div class="collapse entityos-collapse" id="learner-me-level-up-edit-by-reflections"',
					' data-controller="learner-me-level-up-edit-by-show-outcome-reflections">',
						'<div id="learner-me-level-up-edit-by-reflections-view"></div>',
					'</div>',
				'</div>',
			'</div>'
		]);*/

		byView.render('#learner-me-level-up-edit-by-challenges-view')
	}
});

app.add(
{
	name: 'learner-me-level-up-edit-by-show-outcome',
	notes: '',
	code: function (outcome)
	{
		var byOutcomeView = app.vq.init({queue: 'learner-me-level-up-by-outcome'});
		var byOutcomeVerificationNotes = '';

		if (_.has(outcome, 'verification.notes'))
		{
			byOutcomeVerificationNotes = outcome.verification.notes;
		}

		var checked =
		{
			all: ' checked',
			some: ''
		}

		var dataLevelUp = app.whoami().mySetup.levelUp;
		var _templateSkillsGainedURIs = _.map(dataLevelUp.managementProjectTemplate.template.project.skills.gained, 'uri');
		var communitySkills = app.whoami().mySetup.levelUpCommunitySkills;

		var skillsSelected = _.filter(communitySkills, function (communitySkill)
		{
			return _.includes(_templateSkillsGainedURIs, communitySkill.uri)
		});

		var byOutcomeSkillsSelectedView = app.vq.init({queue: 'learner-me-level-up-by-outcome-selected-skills'});

		_.each(skillsSelected, function (skillSelected)
		{
			var _isSelected = false;

			if (_.isPlainObject(outcome.skills))
			{
				_isSelected = !_.isUndefined(_.find(outcome.skills.gained, function (outcomeSkillGained)
				{
					return (outcomeSkillGained.uri == skillSelected.uri)
				}));
			}

			byOutcomeSkillsSelectedView.add(
			[
				'<div class="text-secondary"><input type="checkbox" class="entityos-check me-2" name="learner-me-level-up-by-outcome-skills"',
						' data-controller="learner-me-level-up-edit-save" data-scope="learner-me-level-up-edit" ',
						' data-id="', skillSelected.uri, '" data-uri="', skillSelected.uri, '"',
						' data-name="skillstype"',
						' data-context="byskillstype-', outcome.reference,'-', skillSelected.uri, '"',
						(_isSelected?' checked="checked"':''),
						'></input>', 
				skillSelected.caption,
				'</div>'
			]);
		});	

		if (_.has(outcome, 'skills.gained'))
		{
			if (_.first(outcome.skills.gained) != '*')
			{
				checked =
				{
					all: '',
					some: ' checked'
				}
			}
		}

		var durationDays = '';
		if (_.has(outcome, 'duration-days.maximum'))
		{
			durationDays = outcome['duration-days'].maximum;
		}

		var outcomeProjectLink = '<a href="#level-up-challenges-start/outcome-' + outcome.reference + '">Create as Project <i class="fe fe-arrow-right"></i></a>';
		if (_.isSet(outcome.uri))
		{
			outcomeProjectLink = '<a href="#learner-project-summary/' + outcome.uri + '">View Project <i class="fe fe-arrow-right"></i></a>';
		}

		byOutcomeView.add(
		[
			'<div>',
				'<form autocomplete="off">',
				'<div class="form-group">',
					'<h4 class="mt-0"><label class="mb-0 mt-0" for="learner-me-level-up-edit-by-notes">',
						'Challenge ', outcome.reference,
					'</label></h4>',
					'<textarea style="height:100px;"',
						' class="form-control myds-text entityos-focus"',
						' id="learner-me-level-up-edit-by-notes"',
						' data-scope="learner-me-level-up-edit"',
						' data-context="by-', outcome.reference, '"',
						' data-controller="learner-me-level-up-edit-save"',
						' data-enter="ok">',
					(outcome.description!=undefined?outcome.description:''),
					'</textarea>',
				'</div>',	
				'<div class="form-group">',
					'<h4 class="mt-0"><label class="mb-0 mt-0" for="learner-me-level-up-edit-outcome-skills-type">',
						'This Challenge Will Help Me Improve',
					'</label></h4>',
					'<div class="radio-inline radio-lg mb-1">',
						'<input type="radio" class="myds-check" id="learner-me-level-up-edit-outcome-skills-type-all-', outcome.reference, '"',
						' name="learner-me-level-up-edit-outcome-skills-type-', outcome.reference, '" value="*" data-id="*"',
						' data-scope="learner-me-level-up-edit"',
						' data-context="byoutcomeskills-', outcome.reference, '"',
						' data-name="skillstype"',
						' data-reference="', outcome.reference, '"',
						' data-controller="learner-me-level-up-edit-outcome-skills-type-show"',
						checked.all,
						' data-context="byskillstype-', outcome.reference, '">',
							'All of the selected skills',
					'</div>',
					'<div class="radio-inline radio-lg mb-1">',
						'<input type="radio" class="myds-check" id="learner-me-level-up-edit-outcome-skills-type-some-', outcome.reference, '"',
						' name="learner-me-level-up-edit-outcome-skills-type-', outcome.reference, '" value="some" data-id="some"',
						' data-scope="learner-me-level-up-edit"',
						' data-name="skillstype"',
						' data-reference="', outcome.reference, '"',
						' data-controller="learner-me-level-up-edit-outcome-skills-type-show"',
						checked.some,
						' data-context="byskillstype-', outcome.reference, '">',
							'Some of the selected skills',
					'</div>',
					'<div class="ml-4', (checked.some!=''?'':' d-none'), '"',
						' id="learner-me-level-up-edit-outcome-skills-type-', outcome.reference, '">',
						byOutcomeSkillsSelectedView.get(),
					'</div>',
				'</div>',
				'<div id="learner-me-level-up-edit-outcome-skills-some"></div>',
				'<div class="form-group">',
					'<h4 class="mt-0"><label class="mb-0 mt-0">',
						'Verifiable Outcome Of The Challenge',
					'</label></h4>',
					'<textarea style="height:100px;"',
						' class="form-control myds-text entityos-focus"',
						' data-scope="learner-me-level-up-edit"',
						' data-context="byverification-', outcome.reference, '"',
						' data-controller="learner-me-level-up-edit-save"',
						' data-enter="ok">',
						byOutcomeVerificationNotes,
					'</textarea>',
				'</div>',
				'<div class="form-group">',
					'<h4 class="mt-0"><label class="mb-0 mt-0">',
						'Days To Complete This Challenge (Estimated Total)',
					'</label></h4>',
					'<input type="text" class="form-control form-control-lg myds-text entityos-focus w-25"',
					' data-scope="learner-me-level-up-edit" data-context="byduration-', outcome.reference, '"',
					' data-controller="learner-me-level-up-edit-save" value="', durationDays, '"></input>',
				'</div>',
				'</form>',
				'<div class="my-3">', outcomeProjectLink, '</div>',
			'</div>'
		]);

		return byOutcomeView.get();
	}
});

app.add(
{
	name: 'learner-me-level-up-edit-outcome-skills-type-show',
	notes: '',
	code: function (param)
	{
		var action = 'add';
		if (param.dataID == 'some' && param.selected) {action = 'remove'}
		$('#learner-me-level-up-edit-outcome-skills-type-' + param.dataContext.reference)[action + 'Class']('d-none');

		var _template = app.whoami().mySetup.levelUp.managementProjectTemplate.template.project;

		if (_template.outcomes == undefined) {_template.outcomes = [];}

		var _outcome = _.find(_template.outcomes, function (outcome)
		{
			return outcome.reference == param.dataContext.reference;
		});

		if (_outcome == undefined)
		{
			_template.outcomes.push(
			{
				reference: _profileKeyIndex,
				by: 'learner',
				skills: {gained: []}
			});

			_outcome = _.find(_template.outcomes, function (outcome)
			{
				return outcome.reference == param.dataContext.reference
			});
		}

		_outcome.skills.gained = [];
		if (param.dataID == '*')
		{
			_outcome.skills.gained.push('*')
		}

		app.invoke('learner-me-level-up-edit-save', param);
	}
});

app.add(
{
	name: 'learner-me-level-up-edit-by-show-reflections',
	code: function (param, response)
	{
		var dataLevelUp = app.whoami().mySetup.levelUp;

		console.log(param);

		//show for management project

		/*app.invoke('util-actions-show',
		{
			dataContext:
			{
				container: 'learner-me-level-up-edit-by-reflections-view',
				context: 'learner-me-level-up-edit-by-reflections',
				object: app.whoami().mySetup.objects.project,
				objectcontext: dataLevelUp.managementProject.id
			},
			status: 'shown'
		});*/

		var filters = 
		[
			{
				field: 'object',
				value: app.whoami().mySetup.objects.project
			},
			{
				field: 'objectcontext',
				value: dataLevelUp.managementProject.id
			},
			{
				field: 'type',
				comparison: 'IN_LIST',
				value: app.whoami().mySetup.actionTypes.reflection
			},
				
		]

		app.invoke('util-view-table',
		{
			object: 'action',
			container: 'learner-me-level-up-edit-by-reflections-view',
			context: 'learner-me-level-up-edit-by-reflections-actions',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">Sorry, no reflections/feedback at this moment.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed border rounded',
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
					controller: 'learner-me-level-up-edit-by-show-reflections-format'
				},

				columns:
				[
					{
						caption: 'Info',
						name: 'info',
						sortBy: true,
						class: 'col-9 col-sm-7 text-left',
						data: ''
					},
					{
						caption: 'Date',
						field: 'createddate',
						sortBy: true,
						defaultSort: true,
						defaultSortDirection: 'desc',
						class: 'col-3 col-sm-3 text-center',
						data: ''
					},
					{
						caption: 'By',
						field: 'contactpersontext',
						sortBy: true,
						class: 'col-0 col-sm-2 d-none d-sm-block text-center',
						data: ''
					},
					
					{
						fields:
						['subject', 'duedate', 'description', 'statustext', 'object', 'objectcontext', 'actionby', 'actionbytext',
						'contactbusiness', 'contactbusinesstext', 'contactperson', 'contactpersontext',
						'actiontype', 'actiontypetext', 'status', 
						'modifieddate', 'modifieduser', 'modifiedusertext', 'modifieddate', 'modifieduser', 'modifiedusertext']
					}
				]
			}
		});

	
	}
});

app.add(
{
	name: 'learner-me-level-up-edit-by-show-reflections-format',
	code: function (row)
	{
		row.info = row.description
	}
});

app.add(
{
	name: 'learner-me-level-up-edit-by-show-outcome-add',
	notes: '',
	code: function (param)
	{
		var dataLevelUp = app.whoami().mySetup.levelUp;
		var _templateOutcomes = dataLevelUp.managementProjectTemplate.template.project.outcomes; 

		var reference = app._util.param.get(param.dataContext, 'reference').value;

		var outcome = _.find(_templateOutcomes, function (outcome)
		{
			return outcome.reference == reference;
		});

		if (_.isUndefined(outcome))
		{
			if (_.isUndefined(_templateOutcomes))
			{
				_templateOutcomes = [];
			}

			_templateOutcomes.push(
			{
				reference: reference,
				by: 'learner',
				skills: {gained: ['*']}
			});
		}

		app.invoke('learner-me-level-up-edit-by-show',
		{
			showOutcomeIndex: (reference - 1)
		});
	}
});

app.add(
{
	name: 'learner-me-level-up-edit-with-view',
	code: function (param, response)
	{	
		var dataLevelUp = app.whoami().mySetup.levelUp;
		var _templateTeamMembers = dataLevelUp.managementProjectTemplate.template.project.team.members;
		var withMembers =
		[
			{
				uri: 1,
				caption: '1'
			},
			{
				uri: 2,
				caption: '2'
			},
			{
				uri: 3,
				caption: '3'
			}
		]

		if (_templateTeamMembers != undefined)
		{
			_.each(withMembers, function (withMember)
			{
				withMember.member = _.find(_templateTeamMembers, function (member)
				{
					return member.reference == withMember.uri
				});
			});
		}

		var levelUpWithView = app.vq.init({queue: 'learner-me-level-up-edit-with'});

		levelUpWithView.add(
		[
			'<h3>List the people (if any) that you want to collaborate with.</h3>'
		])

		levelUpWithView.add(
		[
			'<table class="table table-condensed mb-0 m-b-0">',
				'<tbody>'
		]);

		_.each(withMembers, function (withMember)
		{
			levelUpWithView.add(
			[
				'<tr class="d-flex" data-uri="', withMember.uri, '">',
					'<td class="col-1 text-center">',
						'<h1 class="mt-2">', withMember.caption, '</h1>',
					'</td>',
					'<td class="col-11 text-left">',
						'<input type="text" class="form-control form-control-lg myds-text entityos-focus"',
							' id="learner-me-level-up-edit-with-name"',
							' data-scope="learner-me-level-up-edit"',
							' data-context="with-', withMember.uri, '"',
							' data-controller="learner-me-level-up-edit-save"',
							' value="', (withMember.member!=undefined?withMember.member.name:''), '"',
						'>',
					'</td>',
				'</tr>'
			]);
		});

		levelUpWithView.add(
		[
			'</table>'
		]);

		return levelUpWithView.get();
	}
});

app.add(
{
	name: 'learner-me-level-up-edit-supported-view',
	code: function (param, response)
	{	
		var dataLevelUp = app.whoami().mySetup.levelUp;
		var _templateSupportConnections = []
		if (_.has(dataLevelUp, 'managementProjectTemplate.template.project.support.connections'))
		{
			_templateSupportConnections = dataLevelUp.managementProjectTemplate.template.project.support.connections
		}

		var supportConnections =
		[
			{
				uri: 1,
				caption: '1'
			},
			{
				uri: 2,
				caption: '2'
			},
			{
				uri: 3,
				caption: '3'
			}
		]

		if (_templateSupportConnections != undefined)
		{
			_.each(supportConnections, function (supportConnection)
			{
				supportConnection.connection = _.find(_templateSupportConnections, function (connection)
				{
					return connection.reference == supportConnection.uri
				});
			});
		}

		var levelUpSupportView = app.vq.init({queue: 'learner-me-level-up-edit-support'});

		levelUpSupportView.add(
		[
			'<h3>List the people (learning-partners) that you want to support you.</h3>'
		])

		levelUpSupportView.add(
		[
			'<table class="table table-condensed mb-0 m-b-0">',
				'<tbody>'
		]);

		_.each(supportConnections, function (supportConnection)
		{
			levelUpSupportView.add(
			[
				'<tr class="d-flex" data-uri="', supportConnection.uri, '">',
					'<td class="col-1 text-center">',
						'<h1 class="mt-2">', supportConnection.caption, '</h1>',
					'</td>',
					'<td class="col-11 text-left">',
						'<input type="text" class="form-control form-control-lg myds-text entityos-focus"',
							' id="learner-me-level-up-edit-supported-name"',
							' data-scope="learner-me-level-up-edit"',
							' data-context="supported-', supportConnection.uri, '"',
							' data-controller="learner-me-level-up-edit-save"',
							' value="', (supportConnection.connection!=undefined?supportConnection.connection.name:''), '"',
						'>',
					'</td>',
				'</tr>'
			]);
		});

		levelUpSupportView.add(
		[
			'</table>'
		]);

		return levelUpSupportView.get();
	}
});

app.add(
{
	name: 'learner-me-level-up-edit-for-view',
	code: function (param, response)
	{	
		var dataLevelUp = app.whoami().mySetup.levelUp;
		var _templateRecognitionNotes = dataLevelUp.managementProjectTemplate.template.project.recognition.notes;
		if (_.isNotSet(_templateRecognitionNotes)) {_templateRecognitionNotes = ''}

		var levelUpForView = app.vq.init({queue: 'learner-me-level-up-edit-for'});

		levelUpForView.add(
		[
			'<div class="alert alert-info row">',
				'<div class="col-9 mt-1 pl-1">',
					'<h3 class="mb-0">How would you like to be recognised/rewarded?</h3>',
				'</div>',
				'<div class="col-3 mt-2 pr-1 text-right">',
				'<button class="d-none btn btn-white entityos-click" data-controller="">Continue</button>',
				'</div>',
			'</div>',
			'<div class="mt-4" id="learner-me-level-up-edit-for-view"></div>',
			'<div class="mt-4">',
				'<h3>Notes</h3>',
				'<textarea style="height:100px;"',
					' class="form-control myds-text entityos-focus"',
					' id="learner-me-level-up-edit-for-notes"',
					' data-scope="learner-me-level-up-edit"',
					' data-context="fornotes"',
					' data-controller="learner-me-level-up-edit-save"',
					' data-enter="ok">',
						_templateRecognitionNotes,
					'</textarea>',
			'</div>'
		]);

		return levelUpForView.get();
	}
});

app.add(
{
	name: 'learner-me-level-up-edit-for-show',
	notes: '',
	code: function (param, response)
	{
		var dataLevelUp = app.whoami().mySetup.levelUp;

		var _templateRecognitionTypes = []
		if (_.has(dataLevelUp, 'managementProjectTemplate.template.project.recognition.types'))
		{
			_templateRecognitionTypes = dataLevelUp.managementProjectTemplate.template.project.recognition.types;
		}

		var recognitionTypes = app.whoami().mySetup.recognitionTypes;

		var mode = 'select' // 'edit'

		var forView = app.vq.init({queue: 'learner-me-level-up-for'});

		if (mode == 'select')
		{
			forView.add(
			[
				'<table class="table table-condensed mb-0 m-b-0">',
					'<tbody>'
			]);

			_.each(recognitionTypes, function (type)
			{
				var _checked = '';
				var _recognitionType = _.find(_templateRecognitionTypes, function (recognitionType)
				{
					return recognitionType.uri == type.uri
				});

				if (_recognitionType != undefined)
				{
					_checked = ' checked="checked"'
				}

				forView.add(
				[
					'<tr class="d-flex" data-name="', type.uri, '">',
						'<td class="col-1 text-center">',
							'<input type="checkbox" class="entityos-check" name="learner-me-level-up-edit-for-recognition"',
							' data-controller="learner-me-level-up-edit-save" data-scope="learner-me-level-up-edit" ',
							' data-id="', type.uri, '" data-uri="', type.uri, '"',
							' data-name="for"',
							' data-context="for-', type.uri,'"',
							_checked,
							'></input>',
						'</td>',
						'<td class="col-11 text-left">',
							'<h3 class="mb-1">', type.caption, '</h3>',
							'<div class="text-secondary">', type.notes, '</div>',
						'</td>',
					'</tr>'
				]);
			});

			forView.add(
			[
				'</table>'
			]);
		}
		else
		{

		}

		forView.render('#learner-me-level-up-edit-for-view')
	}
});


//-- SAVING

app.add(
{
	name: 'learner-me-level-up-edit-save',
	code: function (param, response)
	{	
		if (_.isUndefined(response))
		{
			var save = (param._type == 'focusout');
			if (!save && _.has(param, 'dataContext.name'))
			{
				save = (param.dataContext.name == 'skill' || param.dataContext.name == 'for' || param.dataContext.name == 'skillstype')
			}

			if (save)
			{
				console.log(param);

				var dataLevelUp = app.whoami().mySetup.levelUp;

				var dataLevelUpProfile = app.get(
				{
					scope: 'learner-me-level-up-edit',
					cleanForCloudStorage: true,
					valueDefault: {}
				});

				var _template = dataLevelUp.managementProjectTemplate.template.project;

				_.each(dataLevelUpProfile, function(profileValue, profileKey)
				{
					if (_.startsWith(profileKey, 'skill-'))
					{
						//template.skills.gained[].uri

						var _profileKey = _.split(profileKey, '-');
						if (_profileKey.length > 1)
						{
							var _profileKeyType = _profileKey[0];
							var _profileKeyIndex = _profileKey[1];

							if (_profileKeyType == 'skill')
							{
								if (_template.skills == undefined) {_template.skills = {}}
								if (_template.skills.gained == undefined) {_template.skills.gained = []}

								var _skill = _.find(_template.skills.gained, function (skill)
								{
									return skill.uri == _profileKeyIndex
								});

								if (_skill == undefined && param.selected == true)
								{
									$('[data-context="skillnotes-' + _profileKeyIndex + '"]').removeClass('d-none');
									_template.skills.gained.push(
									{
										uri: _profileKeyIndex
									})
								}
								else if (param.selected == false)
								{
									$('[data-context="skillnotes-' + _profileKeyIndex + '"]').addClass('d-none');
									_template.skills.gained = _.filter(_template.skills.gained, function (skill)
									{
										return skill.uri != _skill.uri
									})
								}
							}
						}

						app.invoke('learner-me-level-up-edit-by-show');
					}

					if (_.startsWith(profileKey, 'skillnotes-'))
					{
						//template.skills.gained[].notes

						var _profileKey = _.split(profileKey, '-');
						if (_profileKey.length > 1)
						{
							var _profileKeyType = _profileKey[0];
							var _profileKeyIndex = _profileKey[1];

							if (_profileKeyType == 'skillnotes')
							{
								if (_template.skills == undefined) {_template.skills = {}}
								if (_template.skills.gained == undefined) {_template.skills.gained = []}

								var _skill = _.find(_template.skills.gained, function (skill)
								{
									return skill.uri == _profileKeyIndex
								});

								if (_skill == undefined )
								{
									_template.skills.gained.push(
									{
										uri: _profileKeyIndex,
										notes: profileValue
									})
								}
								else
								{
									_skill.notes = profileValue;
								}
							}
						}
					}

					if (_.startsWith(profileKey, 'improvenotes-'))
					{
						if (_template.skills == undefined) {_template.skills = {}}
						_template.skills.notes = profileValue;
					}

					if (_.startsWith(profileKey, 'by-'))
					{
						var _profileKey = _.split(profileKey, '-');
						if (_profileKey.length > 1)
						{
							var _profileKeyType = _profileKey[0];
							var _profileKeyIndex = _profileKey[1];

							if (_profileKeyType == 'by')
							{
								if (_template.outcomes == undefined) {_template.outcomes = [];}

								var _outcome = _.find(_template.outcomes, function (outcome)
								{
									return outcome.reference == _profileKeyIndex
								});

								if (_outcome == undefined)
								{
									_template.outcomes.push(
									{
										reference: _profileKeyIndex,
										by: 'learner',
										description: profileValue
									})
								}
								else
								{
									_outcome.description = profileValue;
								}
							}
						}
					}

					if (_.startsWith(profileKey, 'byverification-'))
					{
						var _profileKey = _.split(profileKey, '-');
						if (_profileKey.length > 1)
						{
							var _profileKeyType = _profileKey[0];
							var _profileKeyIndex = _profileKey[1];

							if (_profileKeyType == 'byverification')
							{
								if (_template.outcomes == undefined) {_template.outcomes = [];}

								var _outcome = _.find(_template.outcomes, function (outcome)
								{
									return outcome.reference == _profileKeyIndex
								});

								if (_outcome == undefined)
								{
									_template.outcomes.push(
									{
										reference: _profileKeyIndex,
										by: 'learner',
										verification: {notes: profileValue}
									})
								}
								else
								{
									if (_outcome.verification == undefined) {_outcome.verification = {}}
									_outcome.verification.notes = profileValue;
								}
							}
						}
					}

					if (_.startsWith(profileKey, 'byduration-'))
					{
						var _profileKey = _.split(profileKey, '-');
						if (_profileKey.length > 1)
						{
							var _profileKeyType = _profileKey[0];
							var _profileKeyIndex = _profileKey[1];

							if (_profileKeyType == 'byduration')
							{
								if (_template.outcomes == undefined) {_template.outcomes = [];}

								var _outcome = _.find(_template.outcomes, function (outcome)
								{
									return outcome.reference == _profileKeyIndex
								});

								if (_outcome == undefined)
								{
									_template.outcomes.push(
									{
										reference: _profileKeyIndex,
										by: 'learner'
									});

									 _.find(_template.outcomes, function (outcome)
									{
										return outcome.reference == _profileKeyIndex
									});
								}

								if (_outcome['duration-days'] == undefined) {_outcome['duration-days'] = {}}
								_outcome['duration-days'].maximum = profileValue;
							}
						}
					}

					if (_.startsWith(profileKey, 'byskillstype-'))
					{
						var _profileKey = _.split(profileKey, '-');
						if (_profileKey.length > 1)
						{
							var _profileKeyType = _profileKey[0];
							var _profileKeyIndex = _profileKey[1];

							if (_template.outcomes == undefined) {_template.outcomes = [];}

							var _outcome = _.find(_template.outcomes, function (outcome)
							{
								return outcome.reference == _profileKeyIndex
							});

							if (_outcome == undefined)
							{
								_template.outcomes.push(
								{
									reference: _profileKeyIndex,
									by: 'learner',
									skills: {gained: []}
								});

								_outcome = _.find(_template.outcomes, function (outcome)
								{
									return outcome.reference == _profileKeyIndex
								});
							}

							if (profileValue == 'some')
							{
								if (_outcome.skills == undefined) {_outcome.skills = {}}
								_outcome.skills.gained = [];
							}
							else if (profileValue != '*')
							{
								if (_outcome.skills == undefined) {_outcome.skills = {}}
								if (_outcome.skills.gained == undefined) {_outcome.skills.gained = []}

								if (_.isUndefined(_.find(_outcome.skills.gained, function (skill)
								{
									return skill.uri == profileValue
								})))
								{
									_outcome.skills.gained.push({uri: profileValue});
								}	
							}
						}
					}

					if (_.startsWith(profileKey, 'with-'))
					{
						//template.team.members

						var _profileKey = _.split(profileKey, '-');
						if (_profileKey.length > 1)
						{
							var _profileKeyType = _profileKey[0];
							var _profileKeyIndex = _profileKey[1];

							if (_profileKeyType == 'with')
							{
								if (_template.team == undefined) {_template.team = {}}
								if (_template.team.members == undefined) {_template.team.members = {}}

								var _member = _.find(_template.team.members, function (member)
								{
									return member.reference == _profileKeyIndex
								});

								if (_member == undefined)
								{
									_template.team.members.push(
									{
										reference: _profileKeyIndex,
										name: profileValue
									})
								}
								else
								{
									_member.name = profileValue;
								}
							}
						}
					}

					if (_.startsWith(profileKey, 'supported-'))
					{
						//template.support.connections

						var _profileKey = _.split(profileKey, '-');
						if (_profileKey.length > 1)
						{
							var _profileKeyType = _profileKey[0];
							var _profileKeyIndex = _profileKey[1];

							if (_profileKeyType == 'supported')
							{
								if (_template.support == undefined) {_template.support = {}}
								if (_template.support.connections == undefined) {_template.support.connections = []}

								var _connection = _.find(_template.support.connections, function (connection)
								{
									return connection.reference == _profileKeyIndex
								});

								if (_connection == undefined)
								{
									_template.support.connections.push(
									{
										reference: _profileKeyIndex,
										name: profileValue
									})
								}
								else
								{
									_connection.name = profileValue;
								}
							}
						}
					}

					if (_.startsWith(profileKey, 'for-'))
					{
						//template.recognition.types

						var _profileKey = _.split(profileKey, '-');
						if (_profileKey.length > 1)
						{
							var _profileKeyType = _profileKey[0];
							var _profileKeyIndex = _profileKey[1];

							if (_profileKeyType == 'for')
							{
								if (_template.recognition == undefined) {_template.recognition = {}}
								if (_template.recognition.types == undefined) {_template.recognition.types = []}

								var _type = _.find(_template.recognition.types, function (type)
								{
									return type.uri == _profileKeyIndex
								});

								if (_type == undefined)
								{
									_template.recognition.types.push(
									{
										uri: _profileKeyIndex,
										name: profileValue
									})
								}
								else
								{
									_type.name = profileValue;
								}
							}
						}
					}

					if (_.startsWith(profileKey, 'fornotes-'))
					{
						if (_template.recognition == undefined) {_template.recognition = {}}
						_template.recognition.notes = profileValue;
					}				
				});

				console.log(dataLevelUp.managementProjectTemplate);

				var saveData = 
				{
					text: JSON.stringify(dataLevelUp.managementProjectTemplate)
				}

				var templateAction = app.get(
				{
					scope: 'util-setup',
					context: 'levelUp',
					name: 'managementAction'
				});

				var templateActionUpdated = app.get(
				{
					scope: 'util-setup',
					context: 'levelUp',
					name: 'managementActionUpdated'
				});

				if (templateActionUpdated)
				{
					//Update the same action within a user session
					saveData.id = templateAction.id
				}
				else
				{
					app.set(
					{
						scope: 'util-setup',
						context: 'levelUp',
						name: 'managementActionUpdated',
						value: true
					});

					var project = app.whoami().mySetup.levelUp.managementProject;

					saveData = _.assign(saveData,
					{
						type: app.whoami().mySetup.actionTypes.managementLevelUpProfile,
						object: app.whoami().mySetup.objects.project,
						objectcontext: project.id,
						actionby: app.whoami().thisInstanceOfMe.user.id,
						contactbusiness: app.whoami().thisInstanceOfMe.user.contactbusiness,
						contactperson: app.whoami().thisInstanceOfMe.user.contactperson,
						date: moment().format('DD MMM YYYY')
					});
				}

				app.set(
				{
					scope: 'util-setup',
					context: 'levelUp',
					name: 'managementAction',
					merge: true,
					value: saveData
				});
				
				mydigitalstructure.cloud.save(
				{
					object: 'action',
					data: saveData,
					callback: 'learner-me-level-up-edit-save'
				});
			}
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.set(
				{
					scope: 'util-setup',
					context: 'levelUp',
					name: 'managementAction',
					merge: true,
					value: {id: response.id}
				});

				//$('#learner-me-level-up-edit-message').show();
				//app.show('#learner-me-level-up-edit-message', '<span class="text-secondary me-3">Saved</span>');
				//$('#learner-me-level-up-edit-message').fadeOut(4000)
			}
		}
		
	}
});

app.add(
{
	name: 'learner-me-level-up-edit-sharing',
	code: function (param)
	{	
		var projectID = app.whoami().mySetup.levelUp.managementProject.id;
        var viewStatus = app._util.param.get(param, 'status', {default: 'shown'}).value;
        var show = (viewStatus == 'shown');
	
		if (show)
		{
			if (projectID != undefined)
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
						class: 'col-4 col-sm-3 text-break text-wrap myds-click'
					},
					{
						caption: 'Last Name',
						field: 'projectteam.contactperson.surname',
						sortBy: true,
						class: 'col-4 col-sm-3 text-break text-wrap myds-click'
					},
					{
						caption: 'Organisation',
						field: 'projectteam.contactperson.contactbusinesstext',
						sortBy: true,
						class: 'col-4 col-sm-3 text-break text-wrap myds-click'
					},
					{
						caption: 'Added',
						field: 'startdate',
						sortBy: true,
						class: 'col-0 col-sm-2 d-none d-sm-block text-break text-wrap myds-click text-center'
					},
					{
						html: '<button class="btn btn-danger btn-outline btn-sm myds-delete"' +
							   ' id="learner-me-level-up-edit-sharing-delete-{{id}}" data-id="{{id}}">' +
								   '<i class="fa fa-unlink"></i></button>',
						caption: '&nbsp;',
						class: 'col-0 col-sm-1 d-none d-sm-block text-center'
					},
					{
						fields: ['enddate', 'guid']
					}
				];

				app.invoke('util-view-table',
				{
					object: 'project_team',
					container: 'learner-me-level-up-edit-sharing-view',
					context: 'learner-me-level-up-edit-sharing',
					filters: filters,
					options:
					{
						noDataText: '<div class="p-4">This profile is not shared.</div>',
						rows: 20,
						orientation: 'vertical',
						progressive: true,
						class: 'table-condensed',
						deleteConfirm:
						{
							text: 'Are you sure you want to remove this sharing?',
							position: 'left',
							headerText: 'Remove Profile Share',
							buttonText: 'Remove',
							controller: 'learner-me-level-up-edit-sharing-delete-ok'
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
							class: 'd-flex'
						},

						columns: columns
					}
				});
			}			
		}
	}
});


app.add(
{
	name: 'learner-me-level-up-edit-sharing-edit',
	code: function (param)
	{	
		app.invoke('util-view-select',
		{
			container: 'learner-me-level-up-edit-sharing-edit-contactperson',
			object: 'contact_person',
			fields: [{name: 'firstname'}, {name: 'surname'}, {name: 'contactbusiness', hidden: true, noSearch: true}],
			filters:
			[
				
			],
			searchMinimumCharacters: 1
		});
	}
});

/*
{
	field: 'contactbusiness',
	value: app.whoami().thisInstanceOfMe.user.contactbusiness
}
*/

app.add(
{
	name: 'learner-me-level-up-edit-sharing-edit-save',
	code: function (param, response)
	{	
		var context = app._util.param.get(param.dataContext, 'context').value;

		var project = app.whoami().mySetup.levelUp.managementProject;

		if (_.isSet(project))
		{
			var id = app.get(
			{
				controller: 'learner-me-level-up-edit-sharing-edit',
				context: 'id',
				valueDefault: ''
			});
		
			var data = app.get(
			{
				controller: 'learner-me-level-up-edit-sharing-edit',
				cleanForCloudStorage: true,
				valueDefault: {}
			});

			if (_.isSet(data.contactperson))
			{
				var dataContactPersons = app.get(
				{
					scope: 'learner-me-level-up-edit-sharing-edit-contactperson',
					context: '_data'
				});

				var _contactperson = _.find(dataContactPersons, function (dataContactPerson)
				{
					return dataContactPerson.id == data.contactperson
				});

				if (!_.isUndefined(_contactperson))
				{
					data.contactbusiness = _contactperson.contactbusiness
				}
			}

			if (id == '')
			{
				data.project = project.id;
				data.startdate = moment().format('D MMM YYYY');
				data.projectrole = app.whoami().mySetup.projectRoles.mentor;
			}
			else
			{
				data.id = id;
			}

			if (_.isUndefined(response))
			{
				entityos.cloud.save(
				{
					object: 'project_team',
					data: data,
					callback: 'learner-me-level-up-edit-sharing-edit-save',
					callbackParam: param
				});
			}
			else
			{	
				if (response.status == 'OK')
				{
					app.notify('Sharing added.');
					$('#learner-me-level-up-edit-sharing-edit-collapse').removeClass('show');
					app.invoke('learner-me-level-up-edit-sharing', param)
				}
			}
		}
	}
});

app.add(
{
	name: 'learner-me-level-up-edit-sharing-delete-ok',
	code: function (param, response)
	{
		if (_.isUndefined(response))
		{
			if (!_.isUndefined(param.dataContext))
			{
				entityos.cloud.delete(
				{
					object: 'project_team',
					data:
					{
						id: param.dataContext.id,
					},
					callback: 'learner-me-level-up-edit-sharing-delete-ok'
				});
			}	
		}
		else
		{
			if (response.status == 'OK')
			{
				app.notify('Sharing removed.');
				app.invoke('learner-me-level-up-edit-sharing', {});
			}
			else if (response.status == 'ER')
			{
				app.notify('Sharing can not be removed. (' + response.error.errornotes + ')');
			}
		}
	}
});


app.add(
{
	name: 'learner-me-level-up-profile-download',
	code: function (param)
	{	
		app.invoke('util-pdf-profile-level-up',
		{
			data: app.whoami().mySetup.levelUp.managementProjectTemplate.template.project
		});
	}
});

