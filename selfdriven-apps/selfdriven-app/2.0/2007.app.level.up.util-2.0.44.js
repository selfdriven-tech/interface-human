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
				app.invoke('level-up-project-init-process')
			}
			else
			{
				var project = _.first(response.data.rows);
				var projectTemplate = {};

				if (_.isSet(project.description))
				{
					projectTemplate = JSON.parse(project.description)
				}

				app.set(
				{
					scope: 'util-setup',
					context: 'levelUp',
					name: 'managementProjectTemplate',
					value: projectTemplate
				});

				app.set(
				{
					scope: 'util-setup',
					context: 'levelUp',
					name: 'managementProject',
					value: project
				});

				app.invoke('util-on-complete', param)
			}
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
			var description = 
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
							"date": "[date]",
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

			description.template.project.title = 'Level Up; ' +  app.whoami().thisInstanceOfMe.user.userlogonname,
			description.template.project.version = {date: moment().format('D MMM YYYY')}
	
			var _description = JSON.stringify(description)

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
				callback: 'level-up-project-init-process'
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

				app.invoke('level-up-project-init-process-team')
			}
		}
	}
});

app.add(
{
	name: 'level-up-project-init-process-team',
	code: function (param, response)
	{	
		var levelUpConnections = app.whoami().mySetup.levelUpConnections;

		if (_.isSet(levelUpConnections))
		{
			app.set(
			{	
				scope: 'level-up-project-init-process-team',
				context: 'index',
				value: 0
			});

			app.invoke('level-up-project-init-process-team-init');
		}
	}
});

app.add(
{
	name: 'level-up-project-init-process-team-init',
	code: function (param, response)
	{	
		var levelUpConnections = app.whoami().mySetup.levelUpConnections;
		var levelUpConnectionsWithGUIDs = _.filter(levelUpConnections, function (connection)
		{
			return _.isSet(connection.sdi)
		});

		app.set(
		{	
			scope: 'level-up-project-init-process-team',
			context: 'connections-with-guids',
			value: levelUpConnectionsWithGUIDs
		});

		if (response == undefined)
		{
			if (levelUpConnectionsWithGUIDs.length > 0)
			{
				var _levelUpConnectionsWithGUIDs = _.map(levelUpConnectionsWithGUIDs, 'sdi');

				mydigitalstructure.cloud.search(
				{
					object: 'contact_person',
					fields: 
					[
						'guid',
					],
					filters:
					[
						{
							field: 'guid',
							comparison: 'IN_LIST',
							value: _levelUpConnectionsWithGUIDs
						}
					],
					callback: 'level-up-project-init-process-team-init'
				});
			}
		}
		else
		{
			var contacts = response.data.rows;
			contacts.push(
			{
				id: app.whoami().thisInstanceOfMe.user.contactperson,
				role: app.whoami().mySetup.projectRoles.owner
			})

			app.set(
			{	
				scope: 'level-up-project-init-process-team',
				context: 'contacts',
				value: contacts
			});

			app.invoke('level-up-project-init-process-team-process');
		}
	}
});

app.add(
{
	name: 'level-up-project-init-process-team-process',
	code: function (param)
	{	
		var contacts = app.get(
		{	
			scope: 'level-up-project-init-process-team',
			context: 'contacts'
		});

		var index = app.get(
		{	
			scope: 'level-up-project-init-process-team',
			context: 'index'
		});

		if (index < contacts.length)
		{
			var contact = contacts[index];

			var projectID = app.get(
			{
				scope: 'level-up-project-init',
				context: 'projectID'
			});

			var projectRole = app.whoami().mySetup.projectRoles.supporter;
			if (_.isSet(contact.role))
			{
				projectRole = contact.role;
			}

			var data =
			{
				project: projectID,
				startdate: moment().format('DD MMM YYYY'),
				contactperson: contact.id,
				projectrole: projectRole
			}

			mydigitalstructure.cloud.save(
			{
				object: 'project_team',
				data: data,
				callback: 'level-up-project-init-process-team-next',
				callbackParam: param
			});
		}
		else
		{
			app.invoke('level-up-project-init');
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

		app.invoke('level-up-project-init-process-team-process');
	}
});

app.add(
{
	name: 'level-up-util-profile-render',
	code: function (param, response)
	{
		var data = app._util.param.get(param, 'data').value;
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
				'<h3 style="color:#f66c1d;" class="mb-4">Level Up Profile</h3>'
			]);

			if (profile.skills.gained.length != 0)
			{
				profileView.add(
				[
					'<h4><i class="fe fe-sun me-2"></i>I Want To Improve (Skills)</h4>',
						'<ul>'
				]);
				
				_.each(profile.skills.gained, function (skill)
				{
					skill._skill = _.find(app.whoami().mySetup.levelUpCommunitySkills, function (communitySkill)
					{
						return communitySkill.uri == skill.uri
					});

					if (_.isSet(skill._skill))
					{
						profileView.add(['<li>', skill._skill.caption, '</li>']);
					}
				});

				profileView.add(
				[
					'</ul>'
				]);
			}

			if (profile.outcomes.length != 0)
			{
				profileView.add(
				[
					'<h4><i class="fe fe-target me-2"></i>By Doing Challenges</h4>',
						'<ul>'
				]);
				
				_.each(profile.outcomes, function (outcome)
				{
					profileView.add(['<li>', outcome.description, '</li>']);

					if (_.has(outcome, 'skills.gained'))
					{
						if (outcome.skills.gained.length != 0)
						{
							profileView.add('<ul class="my-1">');
							_.each(outcome.skills.gained, function (skill)
							{
								profileView.add(['<li>', skill.uri, '</li>']);
							});
							profileView.add('</ul>');
						}
					}
				});

				profileView.add(
				[
					'</ul>'
				]);
			}

			if (profile.team.members.length != 0)
			{
				profileView.add(
				[
					'<h4><i class="fe fe-users me-2"></i>With (Team)</h4>',
						'<ul>'
				]);
				
				_.each(profile.team.members, function (teamMember)
				{
					profileView.add(['<li>', teamMember.name, '</li>']);
				});

				profileView.add(
				[
					'</ul>'
				]);
			}

			if (profile.support.connections.length != 0)
			{
				profileView.add(
				[
					'<h4><i class="fe fe-share-2 me-2"></i>Supported By</h4>',
						'<ul>'
				]);
				
				_.each(profile.support.connections, function (supportConnection)
				{
					profileView.add(['<li>', supportConnection.name, '</li>']);
				});

				profileView.add(
				[
					'</ul>'
				]);
			}

			if (profile.recognition.types.length != 0)
			{
				profileView.add(
				[
					'<h4><i class="fe fe-star me-2"></i>For (Recognition)</h4>',
						'<ul>'
				]);
				
				_.each(profile.recognition.types, function (recognition)
				{
					recognition._type = _.find(app.whoami().mySetup.recognitionTypes, function (recognitionType)
					{
						return recognitionType.uri == recognition.uri
					});

					if (_.isSet(recognition._type))
					{
						profileView.add(['<li>', recognition._type.caption, '</li>']);
					}
				});

				profileView.add(
				[
					'</ul>'
				]);
			}
		}

		return profileView.get();
	}
});


