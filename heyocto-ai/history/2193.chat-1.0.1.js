/*
	https://heyocto.ai/chat
		- https://selfdriven.ai
			- selfdriven.tech
				- entityos.cloud
				- cardano.org	
*/

app.add(
[
	{
		name: 'chat-set-options',
		code: function (param)
		{
			const isLab = _.includes(window.location.hostname, '-lab');
		
			app.set(
			{
				scope: 'ai',
				context: 'signup',
				value: _.includes(window.location.hash, '#signup')
			});

			if (isLab)
			{
				app.set(
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

				app.set(
				{
					scope: 'chat',
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
				app.set(
				{
					scope: 'on-chain-wallet-auth-using-policy',
					context: 'auth',
					value: 
					{
						policy: '11d09f751a005b90b56ccaad3f7a4d2c90bef0f106c4d1c66f61c2ca',
						apikey: 'fad3bbe4-26c9-4750-87b9-c0d2c513efdc',
						site: '1a406553-455f-4827-ae45-026e2fc3a93c',
						viewController: 'chat-dashboard-show',
						showNoAsset: true
					}
				});

				app.set(
				{
					scope: 'chat',
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
			var data = app.get({scope: 'chat'});

			var chatDashboardView = app.vq.init();

			chatDashboardView.add(
			[
				'<div class="mt-4 pt-3 pb-1 w-md-75 mx-auto">',
					'<div class="row">',
						'<div class="col-1 text-right pr-2">',
							'<img src="/site/2134/selfdriven-art-series-3-octo.0.doing.stuff-thanks.png" class="img-responsive mx-auto rounded-circle" style="height:38px; padding-top: 2px;">',
						'</div>',
						'<div class="col-10 px-0">',
							'<form autocomplete="off">',
								'<div class="input-group input-group-flush input-group-merge input-group-reverse">',
									'<input type="text" class="form-control input-lg entityos-text text-center input-rounded" data-scope="explorer-templates" data-context="search-text" id="explorer-templates-search-text" placeholder="Chat with Octo">',
								'</div>',
							'</form>',
						'</div>',
						'<div class="col-1 pl-0 mt-1">',
							'<button class="btn btn-success rounded-pill entityos-click"',
								' data-controller="chat-dashboard-get-models"',
							'><i class="fa fa-arrow-up text-white"></i></button>',
						'</div>',
					'</div>',
				'</div>',
				'<div id="chat-view"">',
				'</div>'
			]);

			chatDashboardView.render('#on-chain-dashboard-view');

			//app.invoke('chat-dashboard-process');
		}
	}
]);

app.add(
{
	name: 'chat-dashboard-get-models',
	code: function (param, response)
	{
		var data = entityos._util.data.get(
		{
			scope: 'hey-octo',
			valueDefault: {}
		});

		if (response == undefined)
		{
			let _context = 'selfdriven-lab';
			
			if (_.includes(window.location.host.toLowerCase(), '-lab'))
			{
				_context = 'selfdriven-lab';
			}

			let invokeData =
			{
				method: 'ai-gen-get-models',
				data:
				{
					_context: _context
				}
			}

			let coreURL = 'https://ai.api.slfdrvn.io';
			
			entityos.cloud.invoke(
			{
				url: coreURL,
				data: JSON.stringify(invokeData),
				type: 'POST',
				callback: 'chat-dashboard-get-models',
				callbackParam: param
			});
		}
		else
		{
			if (response.status == 'ER')
			{}
			else
			{
				console.log(response);

				var chatDashboardView = app.vq.init();

				chatDashboardView.add(
				[
					'<div class="card">',
						'<div class="card-body">'
				]);

				_.each(response.data.models, function (model)
				{
					chatDashboardView.add(
					[
						'<div class="row items-align-end">',
							'<div class="col', (model.default?' text-dark':' text-secondary'), '">',
								model.name,
								' <span class="small" style="color:#bdccdb;">(', model.service, ')</span>',
							'</div>',
						'</div>'
					]);
				});

				chatDashboardView.add(
				[
						'</div>',
					'</div>'
				]);

				chatDashboardView.render('#chat-view');
			}
		}
	}
});

app.add(
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
			app.set(
			{
				scope: 'ai',
				context: 'user',
				value: response
			});

			//app.invoke('chat-dashboard-conversations');
		}
	}
});

app.add(
{
	name: 'chat-dashboard-conversations',
	code: function (param, response)
	{
		if (response == undefined)
		{
			const ai = app.get(
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
				app.set(
				{
					scope: 'chat-data',
					context: 'conversations',
					name: 'statusUpdates',
					value: _.first(response.data.rows)
				});
			}

			console.log(_.first(response.data.rows))

			app.invoke('chat-dashboard-conversations-posts');
		}
	}
});

app.add(
{
	name: 'chat-dashboard-conversations-posts',
	code: function (param, response)
	{
		if (response == undefined)
		{
			const aiData = app.get(
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
			var aiDashboardView = app.view();

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

$(function () {
	//Just a little break to make sure all the wallets have finished initialising.
	entityos._util.factory.core();
	setTimeout(chatInit, 2000);
});

function chatInit()
{
	app.invoke('chat-set-options');
	app.invoke('on-chain-init');
}