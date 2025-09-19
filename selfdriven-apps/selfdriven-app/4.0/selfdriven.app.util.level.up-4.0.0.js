/*
	LEVEL UP UTIL FUNCTIONS

	http://slfdrvn.io/levelup

	- Is there a default level up project
	- Create template with outcomes, tasks, skills etc
*/

// !!FUTURE | FROM MEMBER ORGANISATION FILE (JSON)

app.add(
{
	name: 'level-up-init',
	notes: 'Set the skills that can be used with level up.  Reduced to community level. https://skillzeb.io',
	code: function (param, response)
	{	
		app.set(
		{
			scope: 'util-setup',
			context: 'levelUpConnections',
			value: 
			[
				{
					"sdi": "369655ce-4147-4bc7-8777-ed644681d2c8",
					"caption": "Cathy (Lab)"
				},
				{
					"sdi": "5facf280-5601-4a2b-816a-4035a6c93d54",
					"caption": "DALLE (Lab)"
				},
				{
					"sdi": "16f46812-8c9a-44ac-85ee-5d23039f483a",
					"caption": "Tim W"
				}
			]
		});

		app.set(
		{
			scope: 'util-setup',
			context: 'levelUpCommunitySkills',
			value: 
			[
				{
					"uri": "00010000120000",
					"caption": "Think Why",
					"description": "Questioning the reasons and motives behind actions and decisions."
				},
				{
					"uri": "00010000100000",
					"caption": "Make & Express Meaning",
					"description": "Conveying understanding and significance through various mediums."
				},
				{
					"uri": "00010000060000",
					"caption": "Build Ideas",
					"description": "Developing and expanding on original concepts or thoughts."
				},
				{
					"uri": "00010000130000",
					"caption": "Influence",
					"description": "Having an impact on the behaviors or opinions of others."
				},
				{
					"uri": "00010000260000",
					"caption": "Empathy",
					"description": "Understanding and sharing the feelings of another."
				},
				{
					"uri": "00010000110000",
					"caption": "Teamwork",
					"description": "Collaborating with others to achieve shared objectives"
				},
				{
					"uri": "00010000080000",
					"caption": "Focus",
					"description": "Concentrating on a single task or goal without getting distracted."
				},
				{
					"uri": "00010000090000",
					"caption": "Grit",
					"description": "Determination and perseverance in the face of challenges."
				},
				{
					"uri": "00010000070000",
					"caption": "Curiosity",
					"description": "A strong desire to learn and explore new things."
				},
				{
					"uri": "00010000010000",
					"caption": "Critical Reflection (Thinking)",
					"description": "Analysing thoughts and experiences to gain deeper understanding."
				},
				{
					"uri": "00010000040000",
					"caption": "Communication",
					"description": "Conveying information effectively to others & self."
				},
				{
					"uri": "00010000030000",
					"caption": "Creativity",
					"description": "Using imagination to come up with original ideas or solutions."
				},
				{
					"uri": "00010000020000",
					"caption": "Collaboration",
					"description": "Working together with others to achieve a common goal."
				},
				{
					"uri": "00010000140000",
					"caption": "Altruism",
					"description": "Selflessly helping others without expecting anything in return."
				},
				{
					"uri": "00010000150000",
					"caption": "Engagement",
					"description": "Active involvement and interest in a particular activity or subject."
				},
				{
					"uri": "00010000160000",
					"caption": "Perseverance",
					"description": "Persisting in efforts despite obstacles and setbacks."
				},
				{
					"uri": "00010000050000",
					"caption": "Self-Management",
					"description": "Controlling one's own actions and emotions to achieve personal goals"
				}
			]
		});

		

		app.set(
		{
			scope: 'util-setup',
			context: 'recognitionCommunityTokens',
			value: 
			[
				{
					source: 'foundation',
					tokens: 
					[
						{
							name: 'sdc-tokens',
							caption: 'SDC Tokens',
							type: 'token-ft',
							url: 'https://slfdrvn.io/tokens',
							use: ['in-community'],
							amount:
							{
								total: 1000,
								achievement: 10
							}
						},
						{
							name: 'newm-tokens',
							caption: 'projectNEWM Streaming Rights Tokens (MURS)',
							type: 'token-ft',
							url: 'https://murs.newm.io/',
							use: ['out-community'],
							amount:
							{
								total: 1000,
								achievement: 10
							}
						},
						{
							name: 'copi-tokens',
							caption: 'Corncopias Tokens',
							type: 'token-ft',
							url: 'https://corncopias.io/',
							use: ['out-community'],
							amount:
							{
								total: 1000,
								achievement: 10
							}
						},
						{
							name: 'ada-tokens',
							caption: 'Cardano ADA Tokens',
							type: 'token-ft',
							url: 'https://cardano.org',
							use: ['out-community'],
							amount:
							{
								total: 100,
								achievement: 5
							}
						},
						{
							name: 'artomic-art-s3',
							caption: 'Artomic ART Series 3 (At The Beack)',
							url: 'https://artomics.io',
							type: 'token-nft',
							use: ['out-community'],
							amount:
							{
								total: 10,
								achievement: 1
							}
						}
					]
				},
				{
					source: 'local',
					tokens: 
					[
						{
							name: 'sdc-tokens',
							caption: 'SDC Tokens',
							type: 'token-ft',
							url: 'https://slfdrvn.io/tokens',
							use: ['in-community'],
							amount:
							{
								total: 2000,
								achievement: 10
							}
						}
					]
				}
			]
		});

		app.set(
		{
			scope: 'util-setup',
			context: 'recognitionCommunityTokensUse',
			value: 
			[
				{
					name: 'sdc-tokens',
					caption: 'SDC Tokens',
					type: 'token-ft',
					amount: 1,
					url: 'https://slfdrvn.io/tokens',
					use: 
					[
						{
							type: 'food',
							exchange:
							[
								{
									skill: {capacity: 'K'},
									amount:
									{
										token: 'cAUD',
										amount: 1
									}
								}
							]
						}
					]
				}
			]
		});

		app.set(
		{
			scope: 'util-setup',
			context: 'recognitionTypes',
			value: 
			[
				{
					uri: '000001',
					name: 'just-for-me',
					caption: 'Just For Me',
					notes: 'I just want to do it for myself as sense of achievement.'
				},
				{
					uri: '000002',
					name: 'community-showcase',
					caption: 'Community Showcase',
					notes: 'So can be part of the community showcase.'
				},
				{
					uri: '000003',
					name: 'community-recognition',
					caption: 'Community Recognition',
					notes: 'Recognition by the community.'
				},
				{
					uri: '000004',
					name: 'community-privileges',
					caption: 'Community Privileges',
					notes: 'Special priviledges with the learning community.'
				},
				{
					uri: '000005',
					name: 'rewards-for-me',
					caption: 'Rewards For Me',
					notes: 'Hit me with some rewards.',
					rewards: true
				},
				{
					uri: '000006',
					name: 'rewards-for-others',
					caption: 'Rewards For Others',
					notes: 'Use with a project I\'m in to.'
				},
			]
		});
	}
});

// INIT THE LEVEL UP PROJECT - ONE FOR EACH USER AS PRIMARY PROJECT

app.add(
{
	name: 'level-up-project-init',
	code: function (param, response)
	{	
		if (response == undefined)
		{
			entityos.cloud.search(
			{
				object: 'project',
				fields: ['description'],
				filters:
				[
					{
						field: 'type',
						value: app.whoami().mySetup.projectTypes.management
					},
					{
						field: 'subtype',
						value: app.whoami().mySetup.projectSubTypes.learningLevelUp
					},
					{
						field: 'createduser',
						value: app.whoami().thisInstanceOfMe.user.id
					}
				],
				callback: 'level-up-project-init',
				callbackParam: param
			});
		}
		else
		{
			if (response.data.rows.length == 0)
			{
				app.invoke('level-up-project-init-process', param)
			}
			else
			{
				var project = _.first(response.data.rows);

				app.set(
				{
					scope: 'util-setup',
					context: 'levelUp',
					name: 'managementProject',
					value: project
				});

				app.invoke('level-up-project-init-template', param)
			}
		}
	}
});

app.add(
{
	name: 'level-up-project-init-template',
	notes: 'Get the latest template stored in action of type "managementLevelUpProfile"',
	code: function (param, response)
	{	
		var project = app.whoami().mySetup.levelUp.managementProject;
	
		if (response == undefined)
		{
			entityos.cloud.search(
			{
				object: 'action',
				fields: ['text', 'modifieddate'],
				filters:
				[
					{
						field: 'type',
						value: app.whoami().mySetup.actionTypes.managementLevelUpProfile
					},
					{
						field: 'object',
						value: app.whoami().mySetup.objects.project
					},
					{
						field: 'objectcontext',
						value: project.id
					}
				],
				rows: 1,
				sorts: [{field: 'id', direction: 'desc'}],
				callback: 'level-up-project-init-template',
				callbackParam: param
			});
		}
		else
		{
			if (response.data.rows.length == 0)
			{
				var projectTemplate = app.invoke('level-up-util-template-init');

				app.set(
				{
					scope: 'util-setup',
					context: 'levelUp',
					name: 'managementProjectTemplate',
					value: projectTemplate
				});

				//app.invoke('level-up-project-init-template-process', param);
				//Do on profile change/save.
			}
			else
			{
				var templateAction = _.first(response.data.rows);

				app.set(
				{
					scope: 'util-setup',
					context: 'levelUp',
					name: 'managementAction',
					value: templateAction
				});

				app.set(
				{
					scope: 'util-setup',
					context: 'levelUp',
					name: 'managementActionUpdated',
					value: false
				});

				var projectTemplate = app.invoke('level-up-util-template-init');

				if (_.isSet(templateAction.text))
				{
					if (_.startsWith(templateAction.text, '{'))
					{
						try {
							projectTemplate = JSON.parse(templateAction.text)
						} catch (error) {}
					}
				}

				app.set(
				{
					scope: 'util-setup',
					context: 'levelUp',
					name: 'managementProjectTemplate',
					value: projectTemplate
				});

			}

			app.invoke('util-on-complete', param);
		}
	}
});

app.add(
{
	name: 'level-up-project-init-process',
	notes: 'Could be also linked to a project-template (SDC rewards etc) which meshes with description',
	code: function (param, response)
	{
		if (response == undefined)
		{
			var _description = 'Level Up Template is stored in actions linked to this project. See the latest action for the most recent template.'

			/*
			description.template.project.title = 'Level Up; ' +  app.whoami().thisInstanceOfMe.user.userlogonname,
			description.template.project.version = {date: moment().format('D MMM YYYY')}
			var _description = JSON.stringify(description)
			*/

			var data = 
			{
				referencemask: 'L??????',
				restrictedtoteam: 'Y',
				type: app.whoami().mySetup.projectTypes.management,
				subtype: app.whoami().mySetup.projectSubTypes.learningLevelUp,
				projectmanager: app.whoami().thisInstanceOfMe.user.id,
				contactperson: app.whoami().thisInstanceOfMe.user.contactperson,
				description: _description	
			}

			entityos.cloud.save(
			{
				object: 'project',
				data: data,
				callback: 'level-up-project-init-process',
				callbackParam: param
			});
		}
		else
		{
			if (response.status == 'OK')
			{
				app.set(
				{
					scope: 'level-up-project-init',
					context: 'projectID',
					value: response.id
				});

				app.invoke('level-up-project-init-process-team', param)
			}
		}
	}
});

app.add(
{
	name: 'level-up-project-init-process-team',
	code: function (param)
	{	
		app.set(
		{	
			scope: 'level-up-project-init-process-team',
			context: 'index',
			value: 0
		});

		app.invoke('level-up-project-init-process-team-init', param);
	}
});

app.add(
{
	name: 'level-up-project-init-process-team-init',
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
				callback: 'level-up-project-init-process-team-init',
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

			app.invoke('level-up-project-init-process-team-process', param);
		}
	}
});

app.add(
{
	name: 'level-up-project-init-process-team-process',
	code: function (param)
	{	
		var contactRelationships = app.get(
		{	
			scope: 'level-up-project-init-process-team',
			context: 'contact-relationships'
		});

		var index = app.get(
		{	
			scope: 'level-up-project-init-process-team',
			context: 'index'
		});

		if (index < contactRelationships.length)
		{
			var contactRelationship = contactRelationships[index];

			var projectID = app.get(
			{
				scope: 'level-up-project-init',
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
				callback: 'level-up-project-init-process-team-next',
				callbackParam: param
			});
		}
		else
		{
			app.invoke('level-up-project-init', param);
		}
	}
});

app.add(
{
	name: 'level-up-project-init-process-team-next',
	code: function (param, response)
	{	
		var index = app.get(
		{	
			scope: 'level-up-project-init-process-team',
			context: 'index'
		});

		app.set(
		{	
			scope: 'level-up-project-init-process-team',
			context: 'index',
			value: index + 1
		});

		app.invoke('level-up-project-init-process-team-process', param);
	}
});

app.add(
{
	name: 'level-up-util-template-init',
	code: function (param)
	{
		var projectTemplate =
		{
			"template":
			{
				"project":
				{
					"name": "selfdriven-level-up-management",
					"title": "Level Up Management | [userlogonname]",
					"version":
					{
						"number": "0.0.1",
						"date": "",
						"notes": "Initial set up"
					},
					"outcomes": [],
					"team":
					{
						"members": [],
						"roles": []
					},
					"support":
					{
						"connections": []
					},
					"rules": [],
					"resources": [],
					"milestones": [],
					"skills":
					{
						"capacities": [ "A", "C", "K", "N"],
						"learner-proposed": "true",
						"based-on-uri": "https://skillzeb.io/skillset-explorer",
						"gained": []
					},
					"recognition":
					{
						"types": []
					}
				}
			}
		}

		return projectTemplate
	}
});

app.add(
{
	name: 'level-up-util-profile-render',
	code: function (param, response)
	{
		var data = app._util.param.get(param, 'data', {default: {}}).value;
		var levelUpProfileProject = app._util.param.get(param, 'levelUpProfileProject').value;

		var profileView = app.vq.init({queue: 'level-up-util-profile-render'});

		if (!_.isPlainObject(data) && _.startsWith(data, '{'))
		{
			data = JSON.parse(data);
		}

		if (_.has(data, 'template.project'))
		{
			var profile = data.template.project;

			console.log(profile);

			profileView.add(
			[
				'<div class="row">',
					'<div class="d-none col-12">',
						'<h2 style="color:#f66c1d;" class="mb-3">Level Up Profile</h2>',
					'</div>'
			]);

			if (profile.skills.gained.length != 0)
			{
				profileView.add(
				[
					'<div class="col-12">',
						'<div class="card shadow">',
							'<div class="card-header bg-light">',
								'<h4 class="mb-0"><i class="fe fe-sun me-2"></i>I Want To Improve (Skills)</h4>',
							'</div>',
							'<div class="card-body px-4 pt-3 pb-3">',
								'<div class="row">'
				]);
				
				_.each(profile.skills.gained, function (skill)
				{
					skill._skill = _.find(app.whoami().mySetup.levelUpCommunitySkills, function (communitySkill)
					{
						return communitySkill.uri == skill.uri
					});

					if (_.isSet(skill._skill))
					{
						profileView.add(['<div class="col-12 mb-2"><div>', skill._skill.caption, '</div>']);

						if (_.isSet(skill.notes))
						{
							profileView.add(['<div class="text-secondary pl-2">', skill.notes, '</div>']);
						}

						profileView.add(['</div>'])
					}
				});

				profileView.add(
				[
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);
			}

			var needEndDiv = false;

			if (profile.team.members.length != 0
					|| profile.support.connections.length != 0
					|| profile.recognition.types.length != 0)
			{
				needEndDiv = true;

				profileView.add(
				[
					'<div class="col-12">',
						'<div class="d-flex flex-column h-100">'
				]);
			}

			if (profile.team.members.length != 0)
			{
				
				profileView.add(
				[
							'<div class="card shadow mb-4">',
								'<div class="card-header bg-light">',
									'<h4 class="mb-0"><i class="fe fe-users me-2"></i>With (Team)</h4>',
								'</div>',
								'<div class="card-body px-4 py-3">',
									'<div class="row">'
				]);
			
				_.each(profile.team.members, function (teamMember)
				{
					profileView.add(['<div class="col-12">', teamMember.name, '</div>']);
				});

				profileView.add(
				[
									'</div>',
								'</div>',
							'</div>'
				]);
			}

			if (profile.support.connections.length != 0)
			{
				profileView.add(
				[
							'<div class="card shadow mb-4">',
								'<div class="card-header bg-light">',
									'<h4 class="mb-0"><i class="fe fe-share-2 me-2"></i>Supported By</h4>',
								'</div>',
								'<div class="card-body px-4 py-3">',
									'<div class="row">'
					]);
				
				_.each(profile.support.connections, function (supportConnection)
				{
					profileView.add(['<div class="col-12">', supportConnection.name, '</div>']);
				});

				profileView.add(
				[
									'</div>',
								'</div>',
							'</div>'
				]);
			}

			if (profile.recognition.types.length != 0)
			{
				profileView.add(
				[
							'<div class="card shadow mb-4">',
								'<div class="card-header bg-light">',
									'<h4 class="mb-0"><i class="fe fe-star me-2"></i>For (Recognition)</h4>',
								'</div>',
								'<div class="card-body px-4 py-3">',
									'<div class="row">'
				]);

				_.each(profile.recognition.types, function (recognition)
				{
					recognition._type = _.find(app.whoami().mySetup.recognitionTypes, function (recognitionType)
					{
						return recognitionType.uri == recognition.uri
					});

					if (_.isSet(recognition._type))
					{
						profileView.add(['<div class="col-12">', recognition._type.caption, '</div>']);
					}
				});

				profileView.add(
				[
									'</div>',
								'</div>',
							'</div>'
				]);
			}

			if (needEndDiv)
			{
				profileView.add(
				[
						'</div>',
					'</div>'
				]);
			}

			if (profile.outcomes.length != 0)
			{
				profileView.add(
				[
					'<div class="col-12">',
						'<div class="card shadow">',
							'<div class="card-header bg-light">',
								'<h4 class="mb-0"><i class="fe fe-target me-2"></i>By Doing Challenges</h4>',
							'</div>',
							'<div class="card-body px-4 py-3">',
								'<div class="row">'
				]);
				
				_.each(profile.outcomes, function (outcome)
				{
					profileView.add(['<div class="col-12 mb-2"><div>', outcome.reference, '. ', outcome.description, '</div>']);

					if (_.has(outcome, 'duration-days.maximum'))
					{
						profileView.add(['<div class="text-secondary pl-4">', outcome['duration-days'].maximum, ' days</div>']);
					}

					if (_.has(outcome, 'skills.gained'))
					{
						if (outcome.skills.gained.length != 0)
						{
							profileView.add('<div class="text-muted pl-4 small mt-2">Skills Gained</div>');

							_.each(outcome.skills.gained, function (skill)
							{
								skill._skill = _.find(app.whoami().mySetup.levelUpCommunitySkills, function (communitySkill)
								{
									return communitySkill.uri == skill.uri
								});

								if (_.isSet(skill._skill))
								{
									profileView.add(['<div class="text-secondary pl-5">', skill._skill.caption, '</div>']);
								}
							});
						}
					}

					if (_.has(outcome, 'verification.notes'))
					{
						profileView.add(
						[
							'<div class="text-muted pl-4 small mt-2">Verifiable Outcome Of The Challenge</div>',
							'<div class="text-secondary pl-5">', outcome.verification.notes, '</div>'
						]);
					}

					profileView.add(['</div>'])
				});

				profileView.add(
				[
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);
			}

			profileView.add(
			[
				'</div>'
			]); // row
		}
		else
		{
			profileView.add(
			[
				'<div class="row">',
					'<div class="col-12">',
						'<h2 style="color:#f66c1d;" class="mb-2">Level Up Profile</h2>',
					'</div>',
					'<div class="col-12">',
						'<div class="text-secondary mb-3">No Level Up profile created.</div>',
					'</div>',
				'</div>'
			]);		
		}

		if (_.isSet(levelUpProfileProject))
		{
			profileView.add(
			[	
				'<div class="row">',
					'<div class="col-12">',
						'<div class="card shadow">',
							'<div class="card-header bg-light">',
								'<div class="row align-items-end">',
									'<div class="col">',
										'<h4 class="mb-0"><i class="fe fe-message-circle me-2"></i>Reflections/Feedback</h4>',
									'</div>',
									'<div class="col-auto text-right">',
										'<button class="d-none btn btn-sm btn-primary" data-controller="">Add</button>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="card-body p-0">',
								'<div id="level-up-util-profile-reflections-', levelUpProfileProject.id, '-view">',
								'</div>',
							'</div>',
						'</div>',
					'</div>',

					'<div class="col-12 text-center mb-4">',
						'<div><a data-toggle="collapse" role="button" href="#level-up-util-profile-reflections-add">Add Reflection/Comment <i class="fe fe-chevron-down"></i></a></div>',
						'<div class="collapse entityos-collapse" id="level-up-util-profile-reflections-add" data-controller="level-up-util-profile-render-reflections-add" data-project="', levelUpProfileProject.id, '" data-context="', levelUpProfileProject.id, '">',
						'<div id="level-up-util-profile-reflections-', levelUpProfileProject.id, '-add-view" data-project="', levelUpProfileProject.id, '" data-context="', levelUpProfileProject.id, '"></div></div></div>',
				'</div>'
			]);
		}

		return profileView.get();
	}
});

app.add(
{
	name: 'level-up-util-profile-render-reflections',
	code: function (param)
	{
		var levelUpProfileProject = app._util.param.get(param, 'levelUpProfileProject').value;

		console.log(param);

		var filters = 
		[
			{
				field: 'object',
				value: app.whoami().mySetup.objects.project
			},
			{
				field: 'objectcontext',
				value: levelUpProfileProject.id
			},
			{
				field: 'type',
				comparison: 'IN_LIST',
				value: app.whoami().mySetup.actionTypes.reflection
			}	
		]

		app.invoke('util-view-table',
		{
			object: 'action',
			container: 'level-up-util-profile-reflections-' + levelUpProfileProject.id + '-view',
			context: 'level-up-util-profile-reflections-actions',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-3">No reflections/feedback at this moment.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
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
					controller: 'level-up-util-profile-reflections-format'
				},

				columns:
				[
					{
					caption: 'Info',
					name: 'info',
					sortBy: true,
					class: 'col-9 col-sm-8',
					data: ''
					},
					{
						caption: 'Date',
						field: 'createddate',
						sortBy: true,
						defaultSort: true,
						defaultSortDirection: 'desc',
						class: 'col-3 col-sm-2',
						data: ''
					},
					{
						caption: 'By',
						field: 'contactpersontext',
						sortBy: true,
						class: 'col-0 col-sm-2 d-none d-sm-block',
						data: ''
					},
					
					{
						fields:
						['subject', 'duedate', 'description']
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'level-up-util-profile-reflections-format',
	code: function (row)
	{
		row.info = row.description
	}
});

app.add(
{
	name: 'level-up-util-profile-render-reflections-add',
	code: function (param)
	{
		var projectID = app._util.param.get(param.dataContext, 'project').value;
		var status = app._util.param.get(param, 'status').value;

		if (status == 'shown')
		{
			var reflectionsAddView = app.vq.init({queue: 'level-up-util-profile-render-reflections-add'});
		
			reflectionsAddView.add(
			[
				'<div class="card shadow mt-3" data-project="', projectID, '">',
					'<div class="card-body border-bottom p-0 px-2">',
						'<div class="form-group mb-0">',
							'<textarea style="height:120px;" class="form-control myds-text myds-validate border-0 pt-3" data-validate-mandatory',
							' id="level-up-util-profile-render-reflections-add-description" data-id="{{id}}"',
							' data-scope="level-up-util-profile-render-reflections-add-', projectID , '" data-context="description" placeholder="Enter your reflection/comment for the learner about their level up profile."></textarea>',
						'</div>',
					'</div>',
					'<div class="card-header p-2 bg-light">',
						'<div class="row">',
							'<div class="col text-center">',
								'<button class="btn btn-primary myds-click" ',
								' data-controller="level-up-util-profile-render-reflections-add-save" ',
								' data-context="', projectID, '" data-project="', projectID, '">',
									'Save',
								'</button>',
							'</div>',
						'</div>',
					'</div>',
				'</div>'
			]);

			reflectionsAddView.render('#level-up-util-profile-reflections-' + projectID + '-add-view');
		}
	}
});

app.add(
{
	name: 'level-up-util-profile-render-reflections-add-save',
	code: function (param, response)
	{	
		var projectID = app._util.param.get(param.dataContext, 'project').value;

		if (_.isUndefined(response))
		{
			/*var dataDashboard = app.get(
			{
				scope: 'learning-partner-connections-projects-show-reflect-dashboard',
				valueDefault: []
			});

			var projectTask = _.find(dataDashboard['project-tasks'], function (task)
			{
				return (task.id == taskID)
			});*/

			var data = app.get(
			{
				scope: 'level-up-util-profile-render-reflections-add-' + projectID,
				cleanForCloudStorage: true,
				mergeDefault:
				{
					id: undefined,
					values:
					{	
						object: app.whoami().mySetup.objects.project,
						objectContext: projectID,
						date: moment().format('D MMM YYYY'),
						status: app.whoami().mySetup.actionStatuses.inProgress,
						type: app.whoami().mySetup.actionTypes.reflectionByLearningPartnerForGrowth
					}
				}
			});

			data.subject = 'Reflection by Learning Partner on Level Up Profile';

			// Might have to set this to match the project.
			data.contactbusiness = app.whoami().thisInstanceOfMe.user.contactbusiness;
			data.contactperson = app.whoami().thisInstanceOfMe.user.contactperson;
			
			delete data.dataID;
			delete data.growth;
				
			mydigitalstructure.cloud.save(
			{
				object: 'action',
				data: data,
				callback: 'level-up-util-profile-render-reflections-add-save',
				callbackParam: param,
				notify: 'Reflection has been added.'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				$('#level-up-util-profile-reflections-' + projectID + '-add-view').addClass('d-none');
				app.invoke('level-up-util-profile-render-reflections', {levelUpProfileProject: {id: projectID}});
			}
		}
	}
});

app.add(
{
	name: 'util-level-up-profile-challenges-project-check',
	code: function (param, response)
	{
		var viewSelector = app._util.param.get(param, 'viewSelector', {default: '#util-level-up-profile-challenges-project-check-view'}).value;
		var viewType = app._util.param.get(param, 'viewType', {default: 'horizontal'}).value;
		var levelUpProfileProject = _.get(app.whoami(), 'mySetup.levelUp.managementProject');
		var levelUpProfileProjectTemplate = _.get(app.whoami(), 'mySetup.levelUp.managementProjectTemplate.template.project');

		if (_.isSet(levelUpProfileProject))
		{
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
					callback: 'util-level-up-profile-challenges-project-check',
					callbackParam: param
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
					if (viewType == 'horizontal')
					{
						if (levelUpProfileProjectTemplate.outcomes == 0)
						{
							profileInfoView.add(
							[
								'<div class="card mt-3">',
									'<div class="card-body">',
										'<div class="row">',
											'<div class="col pr-md-4 text-center">',
												'<h3>It looks like you haven\'t set up your level up profile.</h3>',
												'<div class="mb-0">To get started go to <a href="#learner-me-level-up-edit">My Level Up Profile</a> and add to the "By Doing Challenges" section, then come back here.</div>',
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
									'<div class="card-body">',
										'<div class="row">',
											'<div class="col pr-md-4 text-center">',
												'<h3>It looks like you haven\'t set up your level up profile.</h3>',
												'<div class="mb-0">To get started go to <a href="#learner-me-level-up-edit">My Level Up Profile</a> and add to the "By Doing Challenges" section, then come back here.</div>',
											'</div>',
										'</div>',
									'</div>',
								'</div>'
							]);
						}
					}
					else
					{
						if (levelUpProfileProjectTemplate.outcomes == 0)
						{
							profileInfoView.add(
							[
								'<div class="card">',
									'<div class="card-body">',
										'<div class="row">',
											'<div class="col-12 text-center">',
												'<h3>You\'ve created projects for all your challenges!</h3>',
												'<div class="mb-0">To do another challenge, go to <a href="#learner-me-level-up-edit">My Level Up Profile</a> and add a challenge to the "By Doing Challenges" section, then come back here.</div>',
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
								'<div class="card">',
									'<div class="card-body">',
										'<div class="row">',
											'<div class="col-12 text-center">',
												'<h3>You\'ve created projects for all your challenges!</h3>',
												'<div class="mb-0">To do another challenge, go to <a href="#learner-me-level-up-edit">My Level Up Profile</a> and add a challenge to the "By Doing Challenges" section, then come back here.</div>',
											'</div>',
										'</div>',
									'</div>',
								'</div>'
							]);
						}
					}
				}
				else
				{
					if (viewType == 'horizontal')
					{
						profileInfoView.add(
						[
							'<div class="card mt-3 mb-2">',
								'<div class="card-header">',
									'<div class="row">',
										'<div class="col d-flex align-items-center pr-md-4">',
											'<h3 class="mb-0 w-75">Based on your level up profile, you have ', challengesToStartCountText, ' challenge(s) that you have not yet created a challenge project for.</h3>',
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
										'<div class="col-10">',
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
					else
					{
						profileInfoView.add(
						[
							'<div class="card mb-4">',
								'<div class="card-body">',
									'<div class="row">',
										'<div class="col-12 text-center">',
											'<div class="fw-bold">Based on your level up profile, you have ', challengesToStartCountText, ' challenge(s) that you have not yet created a challenge project for.</div>',
										'</div>',
										'<div class="col-12 text-center mt-4">',
											'<a class="btn btn-light btn-sm"',
												' data-toggle="collapse" role="button"',
												' href="#level-up-challenges-info-profile-challenges"',
												' aria-expanded="true">Show</a>',
										'</div>',
									'</div>',
								'</div>',
								'<div id="level-up-challenges-info-profile-challenges" class="myds-collapse collapse">',
									'<div class="card-body pt-1 px-3 pb-1">'
						]);

							_.each(profileOutcomes, function (outcome)
							{
								profileInfoView.add(
								[
									'<div class="row border-top border-muted py-3">',
										'<div class="col-12 text-center">',
											outcome.description,
										'</div>',
										'<div class="col-12 text-center mt-3 mb-2">',
											'<div>',
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
				}

				profileInfoView.render(viewSelector);
			}
		}
	}
});
