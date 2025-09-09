import { EntityOS } from '/site/2186/entityos.module.class-1.0.0.js';
const eos = new EntityOS();

/*
	https://app.dgov.education
		- https://selfdriven.community
			- selfdriven.tech
				- entityos.cloud
				- cardano.org	
*/

eos.add(
[
	{
		name: 'community-set-options',
		code: function (param)
		{
			const isLab = _.includes(window.location.hostname, '-lab');
			const isSignUp = _.includes(window.location.hash, '#signup');

			eos.set(
			{
				scope: 'community',
				context: 'signup',
				value: isSignUp
			});

			if (isSignUp)
			{
				eos.set(
				{
					scope: 'community',
					context: 'signup-context',
					value: _.replace(window.location.hash, '#signup/', '')
				});
			}

			if (isLab)
			{
				eos.set(
				{
					scope: 'community',
					context: 'key',
					value: '314e06ee-5dd0-4315-8bec-b7c78c1d5a20'
				});

				eos.set(
				{
					scope: 'community-wallet-auth-using-policy',
					context: 'auth',
					value: 
					{
						policy: 'lovelace',
						apikey: '...',
						site: '1a406553-455f-4827-ae45-026e2fc3a93c'
					}
				});

				eos.set(
				{
					scope: 'community',
					context: 'mySetup',
					value: 
					{
						projectTypes: 
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
						},
						context: 'lab',
						conversations:
						{
							statusUpdates: ''
						}
					}
				});
			}
			else
			{
				eos.set(
				{
					scope: 'community',
					context: 'key',
					value: 'dcd85ae6-2259-4574-b554-c8064178dc48'
				});

				eos.set(
				{
					scope: 'community-wallet-auth-using-policy',
					context: 'auth',
					value: 
					{
						policy: 'lovelace',
						apikey: 'fad3bbe4-26c9-4750-87b9-c0d2c513efdc',
						site: '1a406553-455f-4827-ae45-026e2fc3a93c'
					}
				});

				eos.set(
				{
					scope: 'community',
					context: 'mySetup',
					value: 
					{
						email: 'team@drep.education',
						projectTypes: 
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
						},
						conversations:
						{
							statusUpdates: ''
						},
						templates:
						{
							learning:
							[
								{
									name: 'cardano-drep-pioneer-program-workshop-kit',
									url: 'https://skillzeb.io/site/6b2beaea-f5ef-45f7-bec0-4c679d314d71/data/skillzeb.template.learning.cardano-drep-pioneer-program-workshop-kit.json'
								}
							]
						},
						events:
						[
							{
								reference: '8W3AZ9EM',
								name: 'DRep Workshop (Sydney)',
								date: '03 AUG 2024'
							},
							{
								reference: 'M112G4HZ',
								name: 'Constitution Workshop (Sydney)',
								date: '14 SEP 2024'
							}
						]
					}
				});
			}
		}
	},
	{
		name: 'community-dashboard-show',
		code: function (param)
		{
			var data = eos.get({scope: 'community'});

            $('#dgov-education-col-1').removeClass('col-md-7').addClass('col-md-9');
            $('#dgov-education-col-2').removeClass('col-md-5').addClass('col-md-3');
            $('#dgov-education-header-md').css('font-size', '3rem')
            
			var communityDashboardView = eos.view();

			communityDashboardView.add(
			[
				'<div class="row mt-2 mb-4">'
			]);

			//My Learning // Events

			communityDashboardView.add(
			[
				'<div class="col-12 col-md-6">',
					'<div id="community-learning-projects" class="card shadow mt-3"',
						' style="background-color: rgba(255, 255, 255, 0.5);"',
						'>',
						'<div class="card-body text-center pb-0">',
							'<h4 class="mb-0 font-weight-bold">My Learning Projects</h4>',
						'</div>',
						'<div class="card-body text-center" id="community-dashboard-learning-projects-view">',
						'</div>',
					'</div>',
					'<div id="community-events" class="card shadow mt-4"',
						' style="background-color: rgba(255, 255, 255, 0.5);"',
						'>',
						'<div class="card-body text-center pb-0">',
							'<h4 class="mb-0 font-weight-bold">Workshops</h4>',
						'</div>',
						'<div class="card-body text-center" id="community-dashboard-events-view">',
						'</div>',
					'</div>',
				'</div>'
			]);

			// COL 2 
			communityDashboardView.add(
			[
				'<div class="col-12 col-md-6 mt-3 mt-md-0">',
					'<div id="community-dashboard-status-updates-container" class="card shadow mt-3"',
						'style="background-color: rgba(255, 255, 255, 0.5);"',
					'>',
						'<div class="card-body text-center pb-0">',
							'<h4 class="mb-0 font-weight-bold">Status Updates</h4>',
						'</div>',
						'<div class="card-body" id="community-dashboard-status-updates-view">',
						'</div>',
					'</div>',
				
			]);

            communityDashboardView.add(
			[
					'<div id="community-resource-templates" class="card shadow mt-4"',
						' style="background-color: rgba(255, 255, 255, 0.5);"',
						'>',
						'<div class="card-body text-center pb-0">',
							'<h4 class="mb-0 font-weight-bold">Resources</h4>',
						'</div>',
						'<div class="card-body">',
							'<div class="row">',
								'<div class="col-12 text-center">',
									'<div><a href="https://skillzeb.io/template-explorer/cardano-drep-pioneer-program-workshop-kit" target="_blank">',
										'Workshop Kit skillzeb Template',
									'</a></div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
			]);

			communityDashboardView.add(
			[
					'<div id="community-learning-templates" class="card shadow mt-4"',
							' style="background-color: rgba(255, 255, 255, 0.5);">',
						'<div class="card-body text-center pb-0">',
							'<h4 class="mb-0 font-weight-bold">About</h4>',
						'</div>',
						'<div class="card-body">',
							'<div class="row">',
								'<div class="col-12 mb-3 text-center">',
									'<div><a href="https://dgov.education" target="_blank">',
										'DGov Education',
									'</a></div>',
								'</div>',
								'<div class="col-12 mb-0 text-center">',
									'<div><a href="https://intersectmbo.org" target="_blank">',
										'Intersect',
									'</a></div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>',
				'</div>'
				
			]);

			communityDashboardView.add(
			[
				'</div>'
			]);

			communityDashboardView.render('#community-dashboard-view');

			eos.invoke('community-dashboard-process');
		}
	}
]);

eos.add(
{
	name: 'community-dashboard-process',
	code: function (param, response)
	{
		if (response == undefined)
		{
			entityos.cloud.invoke(
			{
				method: 'core_get_user_details',
				data: {},
				callback: 'community-dashboard-process'
			})
		}
		else
		{
			eos.set(
			{
				scope: 'community',
				context: 'user',
				value: response
			});

			//eos.invoke('community-dashboard-learning-e');
			//eos.invoke('community-dashboard-conversations');
			//eos.invoke('community-dashboard-resources');
		}
	}
});

eos.add(
{
	name: 'community-dashboard-learning-projects',
	code: function (param, response)
	{
		if (response == undefined)
		{
			const community = eos.get(
			{
				scope: 'community'
			});

			entityos.cloud.search(
			{
				object: 'project',
				fields: ['description'],
				filters:
				[
					{
						field: 'restrictedtoteam',
						value: 'Y'
					},
					{
						field: 'projectmanager',
						value: community.user.user
					},
					{
						field: 'type',
						value: community.mySetup.projectTypes.learning
					},
					{
						field: 'sourceprojecttemplate',
						comparison: 'IS_NOT_NULL'
					},
					{
						field: 'description',
						comparison: 'TEXT_IS_LIKE',
						value: 'Commonlands'
					}
				],
				callback: 'community-dashboard-learning-projects'
			})
		}
		else
		{
			var communityDashboardView = eos.view();

			communityDashboardView.add(
			[
				'<div class="row mt-2 mb-4">'
			]);

			_.each(response.data.rows, function (row)
			{
				communityDashboardView.add(
				[
					'<div class="col-6 text-center mb-3">',
						'<div class="card shadow">',
							'<div class="card-body ">',
								'<div class="font-weight-bold">',
									row.description,
								'</div>',
								'<div class="text-secondary small mt-1">',
									'In Progress',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);
			})

			communityDashboardView.add(
			[
				'</div>'
			]);

			communityDashboardView.render('#community-dashboard-learning-projects-view');
		}
	}
});

eos.add(
{
	name: 'community-dashboard-conversations',
	code: function (param, response)
	{
		if (response == undefined)
		{
			const community = eos.get(
			{
				scope: 'community'
			});

			entityos.cloud.search(
			{
				object: 'messaging_conversation',
				fields: ['title', 'description', 'modifieddate'],
				filters:
				[
					{
						field: 'status',
						comparison: 'NOT_EQUAL_TO',
						value: 2
					},
					{
						field: 'sharing',
						comparison: 'EQUAL_TO',
						value: 1
					},
					{
						field: 'guid',
						comparison: 'EQUAL_TO',
						value: community.mySetup.conversations.statusUpdates
					}

				],
				callback: 'community-dashboard-conversations'
			})
		}
		else
		{
			if (response.data.rows == 0)
			{}
			else
			{
				eos.set(
				{
					scope: 'community-data',
					context: 'conversations',
					name: 'statusUpdates',
					value: _.first(response.data.rows)
				});
			}

			console.log(_.first(response.data.rows))

			eos.invoke('community-dashboard-conversations-posts');
		}
	}
});

eos.add(
{
	name: 'community-dashboard-conversations-posts',
	code: function (param, response)
	{
		if (response == undefined)
		{
			const communityData = eos.get(
			{
				scope: 'community-data'
			});

			entityos.cloud.search(
			{
				object: 'messaging_conversation_post',
				fields: ['subject', 'message', 'modifieddate'],
				filters:
				[
					{
						field: 'conversation',
						comparison: 'EQUAL_TO',
						value: communityData.conversations.statusUpdates.id
					}
				],
				customOptions:
				[
					{
						name: 'conversation',
						value: communityData.conversations.statusUpdates.id
					}
				],
				sorts:
				[
					{
						name: 'modifieddate',
						direction: 'desc'
					}
				],
				rows: 99,
				callback: 'community-dashboard-conversations-posts'
			});
		}
		else
		{
			var communityDashboardView = eos.view();

			communityDashboardView.add(
			[
				'<div class="row mt-0 mb-0">'
			]);

			_.each(response.data.rows, function (row)
			{
				communityDashboardView.add(
				[
					'<div class="col-12 text-center mb-3">',
						'<div class="card shadow">',
							'<div class="card-body">',
								'<div class="font-weight-bold lead">',
									row.subject,
								'</div>',
								'<div class="text-secondary mt-3">',
									row.message,
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);
			})

			communityDashboardView.add(
			[
				'</div>'
			]);

			communityDashboardView.render('#community-dashboard-status-updates-view');
		}
	}
});

eos.add(
{
	name: 'community-dashboard-events',
	code: function (param, response)
	{
		if (response == undefined)
		{
			const community = eos.get(
			{
				scope: 'community'
			});

			entityos.cloud.search(
			{
				object: 'event',
				fields: ['reference', 'title', 'description', 'modifieddate', 'guid'],
				filters:
				[
					{
						field: 'contactbusiness',
						value: community.user.contactbusiness
					}
				],
				callback: 'community-dashboard-events'
			})
		}
		else
		{
			eos.set(
			{
				scope: 'community-data',
				context: 'events',
				value: response.data.rows
			});

			if (response.data.rows == 0)
			{
				communityDashboardView.add(
				[
					'<div class="row mt-0 mb-0">',
						'<div class="col-12 text-center mb-3">',
							'<div class="card shadow">',
								'<div class="card-body">',
									'There are no workshop events to show.',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				])		
			}
			else
			{
				var communityDashboardView = eos.view();

				communityDashboardView.add(
				[
					'<div class="row mt-0 mb-0">'
				]);

				_.each(response.data.rows, function (row)
				{
					communityDashboardView.add(
					[
						'<div class="col-12 text-center mb-3">',
							'<div class="card shadow">',
								'<div class="card-body">',
									'<div class="font-weight-bold lead">',
										row.title,
									'</div>',
									'<div class="text-secondary small mt-2">',
										'#', row.guid,
									'</div>',
									'<div class="text-secondary mt-2">',
										row.description,
									'</div>',
									'<div class="mt-2" id="community-dashboard-resources-images-', row.id, '-view">',
									'</div>',
								'</div>',
							'</div>',
						'</div>'
					]);
				})

				communityDashboardView.add(
				[
					'</div>'
				]);
			}

			communityDashboardView.render('#community-dashboard-resources-view');

			//eos.invoke('community-dashboard-events-attachments');
		}
	}
});

eos.add(
{
	name: 'community-dashboard-events-attachments',
	code: function (param, response)
	{
		if (response == undefined)
		{
			const community = eos.get(
			{
				scope: 'community'
			});

			const events = eos.get(
			{
				scope: 'community-data',
				context: 'events'
			});

			const eventIDs = _.map(events, 'id');
			if (eventIDs.length == 0) {eventIDs = [-1]}

			entityos.cloud.search(
			{
				object: 'core_attachment',
				fields: ['download', 'filename', 'type', 'typetext', 'url', 'sourcetype', 'objectcontext'],
				filters:
				[
					{
						field: 'object',
						value: 39
					},
					{
						field: 'objectcontext',
						comparison: 'IN_LIST',
						value: eventIDs
					}
				],
				customOptions:
				[
					{
						name: 'object',
						value: 16
					}
				],
				callback: 'community-dashboard-events-attachments'
			})
		}
		else
		{
			const attachments = eos.set(
			{
				scope: 'community-data',
				context: 'resources-attachments',
				value: response.data.rows
			});

			if (response.data.rows == 0)
			{}
			else
			{
				const attachmentsByEvent = _.groupBy(attachments, 'objectcontext')

				_.each(attachmentsByEvent, function (eventAttachments, eventID)
				{
					var communityDashboardView = eos.view();

					const colnumber = (eventAttachments.length==1?12:6);
		
					communityDashboardView.template(
					[
						'<div class="col-', colnumber, ' mb-3 mt-1">',
							'<a href="{{download}}" target="_blank"><img class="img-fluid rounded float-left" src="{{download}}"></a>',
						'</div>'
					]);

					communityDashboardView.add(
					[
						'<div class="row mt-0 mb-0">'
					]);

					_.each(eventAttachments, function (attachment)
					{
						if (attachment.sourcetype == 2)
						{
							attachment.download = row.url
						}

						communityDashboardView.add({useTemplate: true}, attachment)
					})

					communityDashboardView.add(
					[
						'</div>'
					]);

					communityDashboardView.render('#community-dashboard-events-images-' + resourceID + '-view');
				});
			}
		}
	}
});

eos.add(
{
	name: 'community-auth-signup',
	code: function (param, response)
	{	
		var communitySignupData = eos.get(
		{
			scope: 'community-signup',
			valueDefault: {}
		});

		if (response == undefined)
		{
			let messageView = app.vq.init({queue: 'community-auth-signup-message'});

			messageView.add('<h4 class="mt-3 pb-3 text-white">');

			let validationOK = false;

			if (
					_.isNotSet(communitySignupData.firstname)
				|| 	_.isNotSet(communitySignupData.lastname)
				|| 	_.isNotSet(communitySignupData.email)
			)
			{
				messageView.add('<i class="fa fa-exclamation-triangle text-warning mr-2"></i>You are missing some data');
			}
			else
			{
				messageView.add('<i class="fa fa-check-circle text-success mr-2"></i>Signing you up...');
				validationOK = true;		
			}

			messageView.add('</h4>');

			messageView.render('#community-auth-signup-message-view');
	
			if (validationOK)
			{
				let _context = 'selfdriven-communitydcd85ae6-2259-4574-b554-c8064178dc48-dgov-prod';
				let communitykey = 'dcd85ae6-2259-4574-b554-c8064178dc48';
				
				let invokeData =
				{
					method: 'add-community-member',
					data:
					{
						_context: _context,
						communitykey: communitykey,
						memberrole: 'learner',
						memberfirstname: communitySignupData.firstname,
						memberlastname: communitySignupData.lastname,
						membermobile: communitySignupData.mobile,
						memberusername: communitySignupData.mobile,
						memberuserpassword: communitySignupData.userpassword
					}
				}
				entityos.cloud.invoke(
				{
					url: 'https://api.slfdrvn.io',
					data: JSON.stringify(invokeData),
					type: 'POST',
					callback: 'community-auth-signup',
					callbackParam: param
				});
			}
		}
		else
		{
			if (response.status == 'OK')
			{
				entityos.auth(
				{
					logon: response.data.username,
					password: communitySignupData.userpassword
				});
			}
			else
			{
				let messageView = app.vq.init({queue: 'community-auth-signup-message'});
				messageView.add('<h4 class="mt-3 pb-3 text-white"><i class="fa fa-exclamation-triangle text-warning mr-2"></i>There was an issue signing you up, please contact Commonlands support.</h4>');
				messageView.render('#community-auth-signup-message-view');	
			}
		}
	}
});



$(function () {
	//Just a little break to make sure all the wallets have finished initialising.
	entityos._util.factory.core();
	setTimeout(communityInit, 2000);
});

function communityInit()
{
	eos.invoke('community-set-options');
	eos.invoke('community-init');
}