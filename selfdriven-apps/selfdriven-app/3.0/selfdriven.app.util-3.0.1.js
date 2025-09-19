/*
	{
    	title: "App Utility Services"
  	}
*/

app.add(
{
	name: 'util-setup',
	code: function (param, response)
	{
		//eventTypes set with own controller

		param = param || {};

		param.onCompleteWhenCan = param.onCompleteWhenCan || param.onComplete;
		
		if (_.isUndefined(param.setupStep))
		{
			param.setupStep = 1

			var isLab = _.includes(window.location.hostname, '-lab');

			app.set(
			{
				controller: 'util-setup',
				context: 'isLab',
				value: isLab
			});

			var businessGroups = 
			{
				community: 3616,
				organisation: 3617
			}

			var personGroups = 
			{
				admin: 8056,
				communityServicesFacilitator: 8679,
				coordinator: 8068,
				facilitator: 8054,
				interestedParty: 8055,
				learner: 8052,
				learnerPartner: 8053,
				learningPartner: 8053,
				professionalLearningFacilitator: 8057,
				professionalLearningPathwayFacilitator: 8680,
				professionalLearningSupportFacilitator: 8086
			}
	
			var relationshipTypes =
			{
				learningPartnerFamily: 4127,
				learningPartnerProfessionalLearningFacilitator: 4133,
				learningPartnerOtherLearner: 4129,
				learningPartnerOther: 4130,
				learningPartnerLearningPathwayFacilitator: 4131,
				learningPartnerMentor: 4134,
				learningPartnerAuthenticLearningFacilitator: 4139,
				learningPartnerGenerativeAI: 4167,
				learningPartner: '4127,4133,4129,4130,4131,4134,4139,4167',
				learnerCommunity: 4151,
				learner: '4151'
			}
			
			var actionTypes = 
			{
				accountabilityAttendance: 1696,
				accountabilityClothing: 1697,
				accountabilityFitForPurpose: 1753,
				accountabilityUnfitForPurpose: 1754,
				accountabilityImprovementCycle: '1753,1754',
				accountabilityCheckIn: 1813,
				recognitionGrowth: 1698,
				recognitionAchievement: 1742,
				recognitionCommunity: 1808,
				recognition: '1698,1742,1808',
				reflectionBySelfForGrowth: 1701,
				reflectionBySelfOnGrowth: 1740,
				reflectionBySelfOnForGrowth: 1852,
				reflectionByLearningPartnerForGrowth: 1700,
				reflectionByLearningPartnerOnGrowth: 1738,
				reflectionByLearningPartnerOnForGrowth: 1851,
				reflectionBySelf: '1701,1740,1852',
				reflectionByLearner: '1701,1740,1852',
				reflectionByLearningPartner: '1700,1738,1851',
				reflection: '1701,1740,1700,1738,1851,1852',
				notes: 1699,
				taskStatusUpdate: 1704,
				profileAttributesUpdate: 1705,
				profileNextLearning: 1750,
				profileLevelUp: 1883,
				feedback: 1712,
				issue: 1715,
				wellbeingHowGoingUpdate: 1764,
				growthRecognition: 1698,
				endorsement: 1698,
				communityTokenUsage: 1811,
				nextStepsApplication: 1816,
				onChain: 1824,
				accountabilityPolicy: 1830,
				structuredThinkingData: 1831,
				structuredThinkingRecommendation: 1832,
				structuredThinkingResearch: 1833,
				environmentEnergy: 1875,
				environmentEnergyIn: 1875,
				environmentEnergyOut: 1877
			}

			var actionStatuses = 
			{
				completed: 1,
				notStarted: 2,
				cancelled: 3,
				inProgress: 4
			}

			var projectTaskStatuses = 
			{
				notStarted: 1,
				inProgress: 2,
				completed: 3,
				cancelled: 4,
				discontinued: 4,
				onHold: 5,
				notAssigned: 6,
				toBeChecked: 8
			}

			var documents =
			{
				framework:
				{
					sharedUnderstanding: 173900,
					structuredThinking: 173901,
					authenticExperiences: 173903,
					reflection: 173904,
					environment: 173905,
					accountability: 173906,
					growthRecognition:173907
				}
			}

			var projectStatuses = 
			{
				notStarted: 1,
				inProgress: 2,
				completed: 3,
				ongoing: 4,
				discontinued: 5,
				onHold: 6,
				cancelled: 7
			}

			var projectTypes = 
			{
				environment: 39,
				service: 41,
				facilitation: 42,
				activity: 44,
				communication: 57,
				management: 60,
				design: 64,
				learning: 61,
				planning: 66
			}

			var projectSubTypes = 
			{
				managementCheckIn: 74,
				managementNextSteps: 75,
				reflectionShowcase: 81,
				learningLevelUp: 82
			}

			var projectCategories = 
			{
				small: 11,
				medium: 12,
				large: 13,
				notSet: 15
			}

			var projectTaskTypes = 
			{
				none: 859,
				listening: 848,
				interpreting: 849,
				implementing: 850,
				reflecting: 851,
				reviewing: 851
			}

			var projectTaskPriorities = 
			{
				critical: 0,
				urgent: 1,
				routine: 2,
				noncritical: 3,
				unassigned: 4
			}

			var attachmentTypes = 
			{
				profileImageOrganisation: 677,
				profileImage: 490,
				purpose: 543,
				accountability: 544
			}

			var opportunityTypes = 
			{
				feedback: 821,
				idea: 822
			}

			var structures =
			{
				me: 
				{
					id: 855,
					categories:
					{
						leadership: 1815,
						images: 1816,
						general: 1836,
						wellbeing: 1836
					}
				}
			}

			var conversations =
			{
				default: 14888,
				users:
				{
					identityWebAuthNProvider:
					{
						id: 46179,
						guid: '53e0f3d6-1099-45d3-86de-a9afc71e7455'
					}
				}
			}

			var images =
			{
				profile: '/site/2007/2007.profile-1.0.1.png',
				profileLearningPartner: '/site/2007/2007.profile-1.0.1.png'
			}

			var objects =
			{
				user: 22,
				contactPerson: 32,
				contactBusiness: 12,
				project: 1,
				product: 16,
				action: 17,
				event: 39,
				projectTask: 11,
				contactAttribute: 409,
				messagingConversation: 50
			}

			var productCategories =
			{
				communityService: 1419,
				communityShowcase: 1423
			}

			var contactAttributes =
			{
				parents: 
				{
					personal: 9,
					technical: 10
				},
				categories:
				{
					whoami: 67
				},
				levels:
				{
					0: 42
				}
			}

			var uris =
			{
				usi: 28972,
				urls:
				{
					identityWebAuthNProvider: {id: 29345, url: 'https://identity.api.entityos.cloud'},
					aiProvider: {id: 29357, url: 'https://ai.api.slfdrvn.io'}
				}
			}

			var accounts =
			{
				aws: 23
			}

			var skillsSet =
			{
				capacities:
				{
					aware:
					{
						code: 'A',
						caption: 'Aware',
						id: 25,
						url: '/site/2007/baby-octo.png',
						style: 'color:#FF0000;',
						name: 'Baby Octo'
					},
					capable:
					{
						code: 'C',
						caption: 'Capable',
						id: 22,
						url: '/site/2007/cycling-octo.png',
						style: 'color:#FE9900;',
						name: 'Cycling Octo'
					},
					knowledgeable:
					{
						code: 'K',
						caption: 'Knowledgeable',
						id: 23,
						url: '/site/2007/flying-octo.png',
						style: 'color: #bbbc75;',
						name: 'Flying Octo'
					},
					natural:
					{
						code: 'N',
						caption: 'Natural',
						id: 24,
						url: '/site/2007/rocket-octo.png',
						style: 'color: #28a745;',
						name: 'Rocket Octo'
					}
				}
			}

			var wellbeingFlags =
			[
				{
					name: 'doing-ok',
					caption: 'Doing OK',
					url: '/site/2007/octo-doing-ok.png',
					style: 'color:green;',
					height: 1
				},
				{
					name: 'need-positive-vibes',
					caption: 'Could do with some positive vibes',
					url: '/site/2007/octo-need-positive-vibes.png',
					style: 'color:orange;',
					height: 5
				},
				{
					name: 'not-waving-drowning',
					caption: 'Not waving, drowning, please help!',
					url: '/site/2007/octo-nnot-waving-drowning.png',
					style: 'color:red;',
					height: 10
				}
			]

			if (isLab)
			{
				businessGroups = 
				{
					community: 3615,
					organisation: 3618
				}

				personGroups = 
				{
					admin: 8051,
					communityServicesFacilitator: 8681,
					coordinator: 7676,
					facilitator: 8039,
					interestedParty: 7678,
					learner: 7673,
					learnerPartner: 7672,
					learningPartner: 7672,
					professionalLearningFacilitator: 7674,
					professionalLearningPathwayFacilitator: 8683,
					professionalLearningSupportFacilitator: 8682
				}
		
				relationshipTypes =
				{
					learningPartnerFamily: 4122,
					learningPartnerProfessionalLearningFacilitator: 4123,
					learningPartnerOtherLearner: 4124,
					learningPartnerOther: 4125,
					learningPartnerLearningPathwayFacilitator: 4126,
					learningPartnerMentor: 4135,
					learningPartnerAuthenticLearningFacilitator: 4140,
					learningPartnerGenerativeAI: 4166,
					learningPartner: '4122,4123,4124,4125,4126,4135,4140,4166',
					learnerCommunity: 4150,
					learner: '4150'
				}
				
				actionTypes = 
				{
					accountabilityAttendance: 1596,
					accountabilityClothing: 1593,
					accountabilityFitForPurpose: 1751,
					accountabilityUnfitForPurpose: 1752,
					accountabilityImprovementCycle: '1751,1752',
					accountabilityCheckIn: 1814,
					recognitionGrowth: 1597,
					recognitionAchievement: 1741,
					recognitionCommunity: 1807,
					recognition: '1597,1741,1807',
					reflectionBySelfForGrowth: 1594,
					reflectionBySelfOnGrowth: 1739,
					reflectionBySelfOnForGrowth: 1850,
					reflectionByLearningPartnerForGrowth: 1595,
					reflectionByLearningPartnerOnGrowth: 1737,
					reflectionByLearningPartnerOnForGrowth: 1849,
					reflectionBySelf: '1594,1739,1850',
					reflectionByLearner: '1594,1739,1850',
					reflectionByLearningPartner: '1595,1737,1849',
					reflection: '1594,1739,1595,1737,1850,1849',
					notes: 1599,
					taskStatusUpdate: 1702,
					profileAttributesUpdate: 1703,
					profileNextLearning: 1749,	
					profileLevelUp: 1882,
					feedback: 1712,
					issue: 1714,
					wellbeingHowGoingUpdate: 1763,
					growthRecognition: 1597,
					endorsement: 1597,
					communityTokenUsage: 1812,
					nextStepsApplication: 1817,
					onChain: 1825,
					accountabilityPolicy: 1827,
					structuredThinkingData: 1826,
					structuredThinkingRecommendation: 1828,
					structuredThinkingResearch: 1829,
					environmentEnergy: 1874,
					environmentEnergyIn: 1874,
					environmentEnergyOut: 1876
				}

				documents =
				{
					framework:
					{
						sharedUnderstanding: 173887,
						structuredThinking: 173888,
						authenticExperiences: 173890,
						reflection: 173892,
						environment: 173894,
						accountability: 173895,
						growthRecognition: 173897
					}
				}

				projectTypes = 
				{
					environment: 34,
					service: 36,
					facilitation: 37,
					activity: 43,
					communication: 56,
					management: 59,
					design: 63,
					learning: 62,
					planning: 65
				}

				projectSubTypes = 
				{
					managementCheckIn: 76,
					managementNextSteps: 77,
					reflectionShowcase: 78,
					learningLevelUp: 80
				}

				projectCategories = 
				{
					small: 11,
					medium: 12,
					large: 13,
					notSet: 14
				}

				projectTaskTypes = 
				{
					none: 855,
					listening: 843,
					interpreting: 844,
					implementing: 845,
					reflecting: 846,
					reviewing: 846
				}

				attachmentTypes = 
				{
					profileImageOrganisation: 676,
					profileImage: 489,
					purpose: 541,
					accountability: 542
				}

				opportunityTypes = 
				{
					feedback: 823,
					idea: 824
				}

				structures =
				{
					me: 
					{
						id: 823,
						categories:
						{
							leadership: 1773,
							images: 1814,
							general: 1835,
							wellbeing: 1838
						}
					}
				}

				conversations =
				{
					default: 14887,
					users:
					{
						identityWebAuthNProvider:
						{
							id: 46179,
							guid: '53e0f3d6-1099-45d3-86de-a9afc71e7455'
						}
					}
				}

				productCategories =
				{
					communityService: 1418,
					communityShowcase: 1422
				}

				contactAttributes =
				{
					parents: 
					{
						personal: 7,
						technical: 8
					},
					categories:
					{
						whoami: 1
					},
					levels:
					{
						0: 41
					}
				}

				uris =
				{
					usi: 28965,
					urls:
					{
						identityWebAuthNProvider: {id: 29346, url: 'https://identity.api.entityos.cloud'},
						aiProvider: {id: 29356, url: 'https://ai.api.slfdrvn.io'}
					}
				}

				accounts =
				{
					aws: 22
				}

				skillsSet.capacities = _.merge(skillsSet.capacities,
				{
					aware:
					{
						id: 26
					},
					capable:
					{
						id: 1
					},
					knowledgeable:
					{
						id: 2
					},
					natural:
					{
						id: 3
					}
				});
			}

			actionTypes.achievement = actionTypes.recognitionAchievement;	// Achievement

			actionTypes.managementProfile = actionTypes.profileAttributesUpdate;
			actionTypes.managementLevelUpProfile = actionTypes.profileLevelUp;
			actionTypes.managementNextSteps = actionTypes.profileNextLearning;

			//SD Tokens
			actionTypes.sdc = actionTypes.recognitionCommunity;		// Community
			actionTypes.sde = actionTypes.recognitionGrowth;		// Endorsement		
			actionTypes.sdr = actionTypes.reflection;				// Reflection
			actionTypes.sda = actionTypes.recognitionAchievement;	// Achievement
			actionTypes.sdax = actionTypes.environmentEnergyIn;	// Energy In 
			actionTypes.sdaxUse = actionTypes.environmentEnergyOut;	// Energy Out (Unlocked By Achievement)
			actionTypes.sdcUse = actionTypes.communityTokenUsage;
			actionTypes.sdcs = actionTypes.sdc + ',' + actionTypes.sdcUse

			var improvementCycle =
			[
				{
					caption: 'Listen & Observe',
					captionVerb: 'Listening & Observing',
					code: 'listen',
					task: projectTaskTypes.listening,
					taskType: projectTaskTypes.listening,
					accountability: false,
					alternateCaptionVerb: 'Noticing',
					icon: '<i class="fe fe-eye" style="color:#07964C"></i> '
				},
				{
					caption: 'Interpret',
					captionVerb: 'Interpreting',
					code: 'interpret',
					task: projectTaskTypes.interpreting,
					taskType: projectTaskTypes.interpreting,
					accountability: false,
					alternateCaptionVerb: 'Ask why? Really Why?',
					icon: '<i class="fe fe-message-square" style="color:#FEDD02"></i> '
				},
				{
					caption: 'Implement',
					captionVerb: 'Implementing',
					code: 'implement',
					task: projectTaskTypes.implementing,
					taskType: projectTaskTypes.implementing,
					accountability: false,
					alternateCaptionVerb: 'Playing with possibility',
					icon: '<i class="fe fe-play" style="color:#10ADEF"></i> '
				},
				{
					caption: 'Review',
					captionVerb: 'Reviewing',
					code: 'review',
					task: projectTaskTypes.reviewing,
					taskType: projectTaskTypes.reviewing,
					accountability: true,
					alternateCaptionVerb: 'Selecting and evaluating',
					icon: '<i class="fe fe-check-square" style="color:#EC1A2D"></i> '
				}
			]

			app.set(
			{
				scope: 'util-setup',
				context: 'projectTaskTypes',
				value: projectTaskTypes
			});

			app.set(
			{
				scope: 'util-setup',
				context: 'actionStatuses',
				value: actionStatuses
			});

			app.set(
			{
				scope: 'util-setup',
				context: 'documents',
				value: documents
			});

			app.set(
			{
				scope: 'util-setup',
				context: 'projectStatuses',
				value: projectStatuses
			});

			app.set(
			{
				scope: 'util-setup',
				context: 'improvementCycle',
				value: improvementCycle
			});

			var actionBillingStatuses =
			{
				billable: 1,
				nonBillable: 2,
				availableForBilling: 4,
				billed: 5
			}

			app.set(
			{
				scope: 'util-setup',
				context: 'actionBillingStatuses',
				value: actionBillingStatuses
			});

			app.set(
			{
				scope: 'util-setup',
				context: 'businessGroups',
				value: businessGroups
			});

			app.set(
			{
				scope: 'util-setup',
				context: 'personGroups',
				value: personGroups
			});

			app.set(
			{
				scope: 'util-setup',
				context: 'relationshipTypes',
				value: relationshipTypes
			});

			app.set(
			{
				scope: 'util-setup',
				context: 'actionTypes',
				value: actionTypes
			});

			app.set(
			{
				scope: 'util-setup',
				context: 'projectTaskStatuses',
				value: projectTaskStatuses
			});

			app.set(
			{
				scope: 'util-setup',
				context: 'projectTypes',
				value: projectTypes
			});

			app.set(
			{
				scope: 'util-setup',
				context: 'projectSubTypes',
				value: projectSubTypes
			});
	
			app.set(
			{
				scope: 'util-setup',
				context: 'projectCategories',
				value: projectCategories
			});

			app.set(
			{
				scope: 'util-setup',
				context: 'attachmentTypes',
				value: attachmentTypes
			});

			app.set(
			{
				scope: 'util-setup',
				context: 'opportunityTypes',
				value: opportunityTypes
			});

			app.set(
			{
				scope: 'util-setup',
				context: 'structures',
				value: structures
			});

			app.set(
			{
				scope: 'util-setup',
				context: 'images',
				value: images
			});

			app.set(
			{
				scope: 'util-setup',
				context: 'objects',
				value: objects
			});

			app.set(
			{
				scope: 'util-setup',
				context: 'conversations',
				value: conversations
			});

			app.set(
			{
				scope: 'util-setup',
				context: 'productCategories',
				value: productCategories
			});

			app.set(
			{
				scope: 'util-setup',
				context: 'contactAttributes',
				value: contactAttributes
			});

			app.set(
			{
				scope: 'util-setup',
				context: 'uris',
				value: uris
			});

			app.set(
			{
				scope: 'util-setup',
				context: 'accounts',
				value: accounts
			});

			var role = '';

			if (mydigitalstructure._scope.user.roles.rows.length != 0)
			{
				role = _.kebabCase(_.lowerCase(_.first(mydigitalstructure._scope.user.roles.rows).title));
			}

			app.set(
			{
				controller: 'util-setup',
				context: 'userRole',
				value: role
			});

			app.set(
			{
				controller: 'util-setup',
				context: 'skillCapacities',
				value:
				{
					A: 'Aware',
					C: 'Capable',
					K: 'Knowledgeable',
					N: 'Natural'
				}
			});

			app.set(
			{
				controller: 'util-setup',
				context: 'skillsSet',
				value: skillsSet
			});

			app.set(
			{
				controller: 'util-setup',
				context: 'wellbeingFlags',
				value: wellbeingFlags
			});

			app.set(
			{
				scope: 'util-setup',
				context: 'projectTaskPriorities',
				value: projectTaskPriorities
			});

			app.invoke('util-get-users', param);
		}
	}
});

app.add(
{
	name: 'util-get-users',
	code: function (param, response)
	{
		if (response == undefined)
		{
			app.invoke('util-cloud-search',
			{
				object: 'setup_user',
				fields:
				[
					'username',
					'user.contactperson.firstname',
					'user.contactperson.surname',
					'user.contactperson.email',
					'user.contactperson.guid'
				],
				sorts:
				[
					{
						field: 'username',
						direction: 'asc'
					}
				],
				rows: 99999,
				callback: 'util-get-users',
				callbackParam: param
			});
		}
		else
		{
			app.set(
			{
				scope: 'util-setup',
				context: 'users',
				value: response.data.rows
			});

			app.invoke('util-get-project-task-statuses', param);
		}
	}
});

app.add(
{
	name: 'util-get-project-task-statuses',
	code: function (param, response)
	{
		if (response == undefined)
		{
			app.invoke('util-cloud-search',
			{
				object: 'setup_project_task_status',
				fields:
				[
					'title'
				],
				filters:
				[
					{
						field: 'title',
						comparison: 'NOT_EQUAL_TO',
						value: 'Customer Testing'
					}
				],
				sorts:
				[
					{
						field: 'title',
						direction: 'asc'
					}
				],
				callback: 'util-get-project-task-statuses',
				callbackParam: param
			});
		}
		else
		{
			var taskStatusClasses =
			{
				"[not assigned]": "info",
				"Not Started": "info",
				"In Progress": "info",
				"On Hold": "warning",
				"To Be Checked": "warning",
				"Completed": "success",
				"Discontinued": "info"
			}

			app.set(
			{
				scope: 'util-setup',
				context: 'taskStatusClasses',
				value: taskStatusClasses
			});

			_.each(response.data.rows, function (row)
			{
				row.class = taskStatusClasses[row.statustext];
			});

			app.set(
			{
				scope: 'util-setup',
				context: '_taskStatuses',
				value: response.data.rows
			});

			var taskStatuses = _.mapValues(_.keyBy(response.data.rows, 'title'), 'id');
			
			taskStatuses.closed = taskStatuses['Completed'] + ',' + taskStatuses['Discontinued']

			app.set(
			{
				scope: 'util-setup',
				context: 'taskStatuses',
				value:  taskStatuses
			});

			app.invoke('util-get-project-types', param);
		}
	}
});

app.add(
{
	name: 'util-get-project-types',
	code: function (param, response)
	{
		if (response == undefined)
		{
			app.invoke('util-cloud-search',
			{
				object: 'setup_project_type',
				fields:
				[
					'title'
				],
				filters:
				[],
				sorts:
				[
					{
						field: 'title',
						direction: 'asc'
					}
				],
				callback: 'util-get-project-types',
				callbackParam: param
			});
		}
		else
		{
			app.set(
			{
				scope: 'util-setup',
				context: '_projectTypes',
				value: response.data.rows
			});

			var projectTypes = _.mapValues(_.keyBy(response.data.rows, 'title'), 'id');

			projectTypes.environment =
				projectTypes['Built'] + ', ' +
				projectTypes['Equipment'] + ', ' +
				projectTypes['Natural']

			//Set above in code
			// app.set(
			// {
			// 	scope: 'util-setup',
			// 	context: 'projectTypes',
			// 	value: projectTypes
			// });

			app.invoke('util-get-project-roles', param);
		}
	}
});

app.add(
{
	name: 'util-get-project-roles',
	code: function (param, response)
	{
		if (response == undefined)
		{
			app.invoke('util-cloud-search',
			{
				object: 'setup_project_role',
				fields:
				[
					'title'
				],
				filters:
				[],
				sorts:
				[
					{
						field: 'title',
						direction: 'asc'
					}
				],
				callback: 'util-get-project-roles',
				callbackParam: param
			});
		}
		else
		{
			app.set(
			{
				scope: 'util-setup',
				context: '_projectRoles',
				value: response.data.rows
			});

			var projectRoles = _.mapValues(_.keyBy(response.data.rows, function (row) {return _.camelCase(row['title'])}), 'id');
		
			app.set(
			{
				scope: 'util-setup',
				context: 'projectRoles',
				value: projectRoles
			});

			app.invoke('util-get-event-types', param);
		}
	}
});


app.add(
{
	name: 'util-get-event-types',
	code: function (param, response)
	{
		if (response == undefined)
		{
			app.invoke('util-cloud-search',
			{
				object: 'setup_event_type',
				customOptions:
				[
					{
						name: 'showfixed',
						value: 'N'
					}
				],
				fields:
				[
					'title'
				],
				filters:
				[],
				sorts:
				[
					{
						field: 'title',
						direction: 'asc'
					}
				],
				callback: 'util-get-event-types',
				callbackParam: param
			});
		}
		else
		{
			_.each(response.data.rows, function (row)
			{
				row.text = row.title;
			});
			
			app.set(
			{
				scope: 'util-setup',
				context: '_eventTypes',
				value: response.data.rows
			});

			app.set(
			{
				scope: 'util-setup',
				context: 'eventTypes',
				value: _.mapValues(_.keyBy(response.data.rows, function (row) {return _.camelCase(row['title'])}), 'id')
			});

			app.invoke('util-get-structure-elements', param);
		}
	}
});

app.add(
{
	name: 'util-get-structure-elements',
	code: function (param, response)
	{
		if (response == undefined)
		{
			app.invoke('util-cloud-search',
			{
				object: 'setup_structure_element',
				fields: 
				[
					'title',
					'caption',
					'alias',
					'structure',
					'datatypetext',
					'displayorder',
					'category'
				],
				sorts:
				[
					{
						field: 'displayorder',
						direction: 'asc'
					}
				],
				callback: 'util-get-structure-elements',
				callbackParam: param
			});
		}
		else
		{
			app.set(
			{
				scope: 'util-setup',
				context: 'structureElements',
				value: response.data.rows
			});

			app.invoke('util-get-user', param);
		}
	}
});

app.add(
{
	name: 'util-get-user',
	code: function (param, response)
	{
		if (response == undefined)
		{
			var whoamiUser = app.whoami().thisInstanceOfMe.user;

			var elements = app.get(
			{
				scope: 'util-setup',
				context: 'structureElements'
			});

			var fields = ['firstname', 'surname', 'email', 'notes', 'guid']

			if (elements != undefined)
			{
				fields = _.concat(fields, _.map(elements, 'alias'))
			}

			app.invoke('util-cloud-search',
			{
				object: 'contact_person',
				fields: fields,
				filters:
				[
					{
						field: 'id',
						value: whoamiUser.contactperson
					}
				],
				callback: 'util-get-user',
				callbackParam: param
			});
		}
		else
		{
			var utilSetup = app.get(
			{
				scope: 'util-setup',
				valueDefault: {}
			});

			var whoami = {};

			if (response.status == 'OK')
			{
				if (response.data.rows.length != 0)
				{
					whoami = _.first(response.data.rows);
				}
			}

			if (whoami._profileimage == '')
			{
				whoami._profileimage = utilSetup.images.profile;
			}

			app.set(
			{
				scope: 'learner-me',
				context: 'whoami',
				value: whoami
			});

			app.invoke('util-get-user-organisation', param);	
		}
	}
});

app.add(
{
	name: 'util-get-user-organisation',
	code: function (param, response)
	{
		if (response == undefined)
		{
			var whoamiUser = app.whoami().thisInstanceOfMe.user;

			var fields = ['contactbusiness.imageattachment.download', 'webaddress']

			app.invoke('util-cloud-search',
			{
				object: 'contact_business',
				fields: fields,
				filters:
				[
					{
						field: 'id',
						value: whoamiUser.contactbusiness
					}
				],
				callback: 'util-get-user-organisation',
				callbackParam: param
			});
		}
		else
		{
			if (response.status == 'OK')
			{
				if (response.data.rows.length != 0)
				{
					whoamiOrganisation = _.first(response.data.rows);
				}
			}

			if (whoamiOrganisation['contactbusiness.imageattachment.download'] != '')
			{
				mydigitalstructure._scope.space.website = whoamiOrganisation.webaddress;
				mydigitalstructure._scope.space.logoattachmentdownload =
					_.replace(whoamiOrganisation['contactbusiness.imageattachment.download'],
								'/download/', '/rpc/core/?method=CORE_ATTACHMENT_DOWNLOAD&object=12&id=');
			}

			app.invoke('util-get-user-identifiers', param);	
		}
	}
});

app.add(
{
	name: 'util-get-user-identifiers',
	code: function (param, response)
	{
		if (response == undefined)
		{
			app.invoke('util-cloud-search',
			{
				object: 'core_url_link',
				fields: 
				[
					'urltext',
					'urlreference',
					'link.url.url',
					'link.url.guid'
				],
				filters:
				[
					{
						field: 'object',
						value: app.whoami().mySetup.objects.contactPerson
					},
					{	
						field: 'objectcontext',
						comparison: 'EQUAL_TO',
						value: app.whoami().thisInstanceOfMe.user.contactperson
					}
				],
				callback: 'util-get-user-identifiers',
				callbackParam: param
			});
		}
		else
		{
			var identifiers = _.map(response.data.rows, function (row)
			{
				return {type: row['urltext'], typeID: row['link.url.guid'], url: row['link.url.url'], reference: row['urlreference'] }
			})

			app.set(
			{
				scope: 'learner-me',
				context: 'whoami',
				name: 'identifiers',
				value: identifiers
			});

			app.invoke('util-get-whoami-attributes', param);	
		}
	}
});

app.add(
{
	name: 'util-get-whoami-attributes',
	code: function (param, response)
	{
		if (response == undefined)
		{
			app.invoke('util-cloud-search',
			{
				object: 'setup_contact_attribute',
				fields: 
				[
					'url',
					'guid'
				],
				filters:
				[
					{
						field: 'category',
						value: app.whoami().mySetup.contactAttributes.categories.whoami
					},
					{	
						field: 'level',
						value: app.whoami().mySetup.contactAttributes.levels['0']
					},
					{	
						field: 'capacity',
						value: app.whoami().mySetup.skillsSet.capacities.aware.id
					}
				],
				callback: 'util-get-whoami-attributes',
				callbackParam: param
			});
		}
		else
		{
			app.set(
			{
				scope: 'util-setup',
				context: 'contactAttributes',
				name: 'whoami',
				value: response.data.rows
			});

			app.invoke('util-on-complete', param);	
		}
	}
});


app.add(
{
	name: 'util-profile-show',
	code: function ()
	{
		var userRole = app.whoami().thisInstanceOfMe._userRole;
		var profileRole = userRole;

		if (profileRole == 'admin' || profileRole == 'you' || profileRole == 'learning-partner')
		{
			if (app.whoami().thisInstanceOfMe.view.uri == '/app-studio')
			{
				profileRole = 'studio'
			}
			else
			{
				profileRole = 'learner'
			}
		}

		app.invoke('app-route-to', {uri: app.whoami().thisInstanceOfMe.view.uri, uriContext: '#' + profileRole + '-me'})
	}
});

app.add(
{
	name: 'util-data-process',
	notes: 'decode/encode fields etc | _mode [send|response]',
	code: function (param, dataValue)
	{
		/*
			param._mode [send|response]
			param.object
			param._field
			param._value
		*/
		
		return dataValue;
	}
});