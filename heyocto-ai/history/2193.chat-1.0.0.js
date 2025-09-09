import { EntityOS } from '/site/2186/entityos.module.class-1.0.0.js';
const eos = new EntityOS();

/*
	https://heyocto.ai/chat
		- https://selfdriven.ai
			- selfdriven.tech
				- entityos.cloud
				- cardano.org	
*/

eos.add(
[
	{
		name: 'chat-set-options',
		code: function (param)
		{
			const isLab = _.includes(window.location.hostname, '-lab');
		
			eos.set(
			{
				scope: 'ai',
				context: 'signup',
				value: _.includes(window.location.hash, '#signup')
			});

			if (isLab)
			{
				eos.set(
				{
					scope: 'on-chain-wallet-auth-using-policy',
					context: 'auth',
					value: 
					{
						policy: '11d09f751a005b90b56ccaad3f7a4d2c90bef0f106c4d1c66f61c2ca',
						apikey: '...',
						site: '1a406553-455f-4827-ae45-026e2fc3a93c'
					}
				});

				eos.set(
				{
					scope: 'ai',
					context: 'mySetup',
					value: 
					{
						context: 'lab',
						conversations:
						{
						}
					}
				});
			}
			else
			{
				eos.set(
				{
					scope: 'on-chain-wallet-auth-using-policy',
					context: 'auth',
					value: 
					{
						policy: '11d09f751a005b90b56ccaad3f7a4d2c90bef0f106c4d1c66f61c2ca',
						apikey: 'fad3bbe4-26c9-4750-87b9-c0d2c513efdc',
						site: '1a406553-455f-4827-ae45-026e2fc3a93c'
					}
				});

				eos.set(
				{
					scope: 'ai',
					context: 'mySetup',
					value: 
					{
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
					}
				});
			}
		}
	},
	{
		name: 'chat-dashboard-show',
		code: function (param)
		{
			var data = eos.get({scope: 'chat'});

			onChainWalletAssetsView.add(
						[
							'<div class="mt-5 pb-1 w-md-75 mx-auto">',
								'<form autocomplete="off">',
									'<div class="row">',
										'<div class="col-1"></div>',
										'<div class="col-10 px-0">',
											'<div class="input-group input-group-flush input-group-merge input-group-reverse">',
												'<input type="text" class="form-control input-lg entityos-text text-center input-rounded" data-scope="explorer-templates" data-context="search-text" id="explorer-templates-search-text" placeholder="Chat with Octo">',
											'</div>',
										'</div>',
										'<div class="col-1 pl-0 mt-1">',
											'<button class="btn btn-success rounded-pill"><i class="fa fa-arrow-up"></i></button>',
										'</div>',
									'</div>',
								'</form>',
							'</div>'
						]);


            $('#dgov-education-col-1').removeClass('col-md-7').addClass('col-md-9');
            $('#dgov-education-col-2').removeClass('col-md-5').addClass('col-md-3');
            $('#dgov-education-header-md').css('font-size', '3rem')
            
			var aiDashboardView = eos.view();

			aiDashboardView.add(
			[
				'<div class="row mt-2 mb-4">'
			]);

			//My Learning // Events

			aiDashboardView.add(
			[
				'<div class="col-12 col-md-6">',
					'<div id="chat-learning-projects" class="card shadow mt-3"',
						' style="background-color: rgba(255, 255, 255, 0.5);"',
						'>',
						'<div class="card-body text-center pb-0">',
							'<h4 class="mb-0 font-weight-bold">My Learning Projects</h4>',
						'</div>',
						'<div class="card-body text-center" id="chat-dashboard-learning-projects-view">',
						'</div>',
					'</div>',
					'<div id="chat-events" class="card shadow mt-4"',
						' style="background-color: rgba(255, 255, 255, 0.5);"',
						'>',
						'<div class="card-body text-center pb-0">',
							'<h4 class="mb-0 font-weight-bold">Workshops</h4>',
						'</div>',
						'<div class="card-body text-center" id="chat-dashboard-events-view">',
						'</div>',
					'</div>',
				'</div>'
			]);

			// COL 2 
			aiDashboardView.add(
			[
				'<div class="col-12 col-md-6 mt-3 mt-md-0">',
					'<div id="chat-dashboard-status-updates-container" class="card shadow mt-3"',
						'style="background-color: rgba(255, 255, 255, 0.5);"',
					'>',
						'<div class="card-body text-center pb-0">',
							'<h4 class="mb-0 font-weight-bold">Status Updates</h4>',
						'</div>',
						'<div class="card-body" id="chat-dashboard-status-updates-view">',
						'</div>',
					'</div>',
				
			]);

            aiDashboardView.add(
			[
					'<div id="chat-resource-templates" class="card shadow mt-4"',
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

			aiDashboardView.add(
			[
					'<div id="chat-learning-templates" class="card shadow mt-4"',
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

			aiDashboardView.add(
			[
				'</div>'
			]);

			aiDashboardView.render('#chat-dashboard-view');

			eos.invoke('chat-dashboard-process');
		}
	}
]);

eos.add(
{
	name: 'chat-dashboard-process',
	code: function (param, response)
	{
		if (response == undefined)
		{
			entityos.cloud.invoke(
			{
				method: 'core_get_user_details',
				data: {},
				callback: 'chat-dashboard-process'
			})
		}
		else
		{
			eos.set(
			{
				scope: 'ai',
				context: 'user',
				value: response
			});

			//eos.invoke('chat-dashboard-learning-e');
			//eos.invoke('chat-dashboard-conversations');
			//eos.invoke('chat-dashboard-resources');
		}
	}
});

eos.add(
{
	name: 'chat-dashboard-learning-projects',
	code: function (param, response)
	{
		if (response == undefined)
		{
			const ai = eos.get(
			{
				scope: 'ai'
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
						value: ai.user.user
					},
					{
						field: 'type',
						value: ai.mySetup.projectTypes.learning
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
				callback: 'chat-dashboard-learning-projects'
			})
		}
		else
		{
			var aiDashboardView = eos.view();

			aiDashboardView.add(
			[
				'<div class="row mt-2 mb-4">'
			]);

			_.each(response.data.rows, function (row)
			{
				aiDashboardView.add(
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

			aiDashboardView.add(
			[
				'</div>'
			]);

			aiDashboardView.render('#chat-dashboard-learning-projects-view');
		}
	}
});

eos.add(
{
	name: 'chat-dashboard-conversations',
	code: function (param, response)
	{
		if (response == undefined)
		{
			const ai = eos.get(
			{
				scope: 'ai'
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
						value: ai.mySetup.conversations.statusUpdates
					}

				],
				callback: 'chat-dashboard-conversations'
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
					scope: 'chat-data',
					context: 'conversations',
					name: 'statusUpdates',
					value: _.first(response.data.rows)
				});
			}

			console.log(_.first(response.data.rows))

			eos.invoke('chat-dashboard-conversations-posts');
		}
	}
});

eos.add(
{
	name: 'chat-dashboard-conversations-posts',
	code: function (param, response)
	{
		if (response == undefined)
		{
			const aiData = eos.get(
			{
				scope: 'chat-data'
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
						value: aiData.conversations.statusUpdates.id
					}
				],
				customOptions:
				[
					{
						name: 'conversation',
						value: aiData.conversations.statusUpdates.id
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
				callback: 'chat-dashboard-conversations-posts'
			});
		}
		else
		{
			var aiDashboardView = eos.view();

			aiDashboardView.add(
			[
				'<div class="row mt-0 mb-0">'
			]);

			_.each(response.data.rows, function (row)
			{
				aiDashboardView.add(
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

			aiDashboardView.add(
			[
				'</div>'
			]);

			aiDashboardView.render('#chat-dashboard-status-updates-view');
		}
	}
});

eos.add(
{
	name: 'chat-dashboard-events',
	code: function (param, response)
	{
		if (response == undefined)
		{
			const ai = eos.get(
			{
				scope: 'ai'
			});

			entityos.cloud.search(
			{
				object: 'event',
				fields: ['reference', 'title', 'description', 'modifieddate', 'guid'],
				filters:
				[
					{
						field: 'contactbusiness',
						value: ai.user.contactbusiness
					}
				],
				callback: 'chat-dashboard-events'
			})
		}
		else
		{
			eos.set(
			{
				scope: 'chat-data',
				context: 'events',
				value: response.data.rows
			});

			if (response.data.rows == 0)
			{
				aiDashboardView.add(
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
				var aiDashboardView = eos.view();

				aiDashboardView.add(
				[
					'<div class="row mt-0 mb-0">'
				]);

				_.each(response.data.rows, function (row)
				{
					aiDashboardView.add(
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
									'<div class="mt-2" id="chat-dashboard-resources-images-', row.id, '-view">',
									'</div>',
								'</div>',
							'</div>',
						'</div>'
					]);
				})

				aiDashboardView.add(
				[
					'</div>'
				]);
			}

			aiDashboardView.render('#chat-dashboard-resources-view');

			//eos.invoke('chat-dashboard-events-attachments');
		}
	}
});

eos.add(
{
	name: 'chat-dashboard-events-attachments',
	code: function (param, response)
	{
		if (response == undefined)
		{
			const ai = eos.get(
			{
				scope: 'ai'
			});

			const events = eos.get(
			{
				scope: 'chat-data',
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
				callback: 'chat-dashboard-events-attachments'
			})
		}
		else
		{
			const attachments = eos.set(
			{
				scope: 'chat-data',
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
					var aiDashboardView = eos.view();

					const colnumber = (eventAttachments.length==1?12:6);
		
					aiDashboardView.template(
					[
						'<div class="col-', colnumber, ' mb-3 mt-1">',
							'<a href="{{download}}" target="_blank"><img class="img-fluid rounded float-left" src="{{download}}"></a>',
						'</div>'
					]);

					aiDashboardView.add(
					[
						'<div class="row mt-0 mb-0">'
					]);

					_.each(eventAttachments, function (attachment)
					{
						if (attachment.sourcetype == 2)
						{
							attachment.download = row.url
						}

						aiDashboardView.add({useTemplate: true}, attachment)
					})

					aiDashboardView.add(
					[
						'</div>'
					]);

					aiDashboardView.render('#chat-dashboard-events-images-' + resourceID + '-view');
				});
			}
		}
	}
});


$(function () {
	//Just a little break to make sure all the wallets have finished initialising.
	entityos._util.factory.core();
	setTimeout(aiInit, 2000);
});

function aiInit()
{
	eos.invoke('chat-set-options');
	eos.invoke('on-chain-init');
}