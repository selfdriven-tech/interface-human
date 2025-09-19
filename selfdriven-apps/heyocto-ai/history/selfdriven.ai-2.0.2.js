/*
	https://heyocto.ai/chat
		- https://selfdriven.ai
			- selfdriven.tech
				- entityos.cloud
				- cardano.org	
*/

app.add(
{
	name: 'selfdriven-ai-set-options',
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
					viewController: 'selfdriven-ai-show',
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
});

app.add(
{
	name: 'selfdriven-ai-show',
	code: function (param)
	{
		var data = app.get({scope: 'chat'});

		var chatDashboardView = app.vq.init();

		chatDashboardView.add(
		[
			'<div class="mt-4 pt-3 pb-1 w-md-75 mx-auto">',
				'<div class="row">',
					'<div class="col-1 text-right pr-3">',
						'<a class="entityos-click"',
							' data-spinner',
							' data-controller="selfdriven-ai-get-models"',
						'>',
						'<img src="/site/2134/selfdriven-art-series-3-octo.0.doing.stuff-thanks.png" class="img-responsive mx-auto rounded-circle" style="height:38px; padding-top: 2px;">',
						'</a>',
					'</div>',
					'<div class="col-10 px-0">',
						'<form autocomplete="off">',
							'<div class="input-group input-group-flush input-group-merge input-group-reverse">',
								'<input type="text" class="form-control input-lg entityos-text text-center input-rounded" data-enter="stop" data-clean="disabled" data-scope="selfdriven-ai" data-context="chat-text" id="selfdriven-ai-chat-text" placeholder="Chat with Octo">',
							'</div>',
						'</form>',
					'</div>',
					'<div class="col-1 pl-0 mt-1">',
						'<button class="btn btn-success rounded-pill entityos-click"',
							' data-controller="selfdriven-ai-chat"',
						'><i class="fa fa-arrow-up text-white"></i></button>',
					'</div>',
				'</div>',
				'<div class="row">',
					'<div class="col-12">',
						'<input type="file" id="selfdriven-ai-attach-file" style="display:none;"/>',
						'<button class="btn btn-default border btn-sm entityos-click rounded-pill" id="selfdriven-ai-attach" data-controller="selfdriven-ai-chat-attach"><i class="fa fa-cloud-upload-alt"></i> Attach File</button>',
					'</div>',
				'</div>',
			'</div>',
			'<div id="selfdriven-ai-chat-view">',
				'<div class="row">',
					'<div class="col-12 mt-2">',
						'<button class="btn btn-default border btn-sm entityos-click rounded-pill"',
							' data-spinner',
							' data-controller="selfdriven-ai-chat" data-text="I\'m Bored"',
						'>I\'m Bored</button>',
					'</div>',
				'</div>',
			'</div>'
		]);

		chatDashboardView.add(
		[
			'<div id="selfdriven-ai-info-view"">',
			'</div>'
		]);

		chatDashboardView.render('#selfdriven-ai-view');

		// Init messages conversation // role: system/user/assistant

		let systemMessage = 'You are a learning assistant.';
		let messages = [
		{
			role: 'system',
			content: systemMessage
		}]
		
		app.set({scope: 'selfdriven-ai', context: 'messages', value: messages});
	}
});

app.add(
{
	name: 'selfdriven-ai-chat-attach',
	code: function (param, response)
	{
		document.getElementById('selfdriven-ai-attach-file').click();
	}
});

app.add(
{
	name: 'selfdriven-ai-chat-attach-process',
	code: function (param, response)
	{
		const attachFile = document.getElementById('selfdriven-ai-attach-file').files[0];

		const encodeFileToBase64 = function (file)
		{
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = function (e) {
				const bytes = new Uint8Array(e.target.result);
				let binary = '';
				bytes.forEach(byte => binary += String.fromCharCode(byte));
				resolve(btoa(binary));
				};
				reader.onerror = reject;
				reader.readAsArrayBuffer(file);
			});
		};

		// Usage:
		encodeFileToBase64(attachFile).then(function (dataBase64)
		{
			//console.log('Base64 (correct):', dataBase64);
			app.set(
			{
				scope: 'selfdriven-ai',
				context: 'chat-attach',
				value: dataBase64
			});

			app.invoke('selfdriven-ai-chat-process', param);		
		});

		/*readFileAsText(attachFile)
		.then(result => {
			const data = result;
			const dataBase64 = Base64.encode(data);
			console.log('Data Base64:', dataBase64);

			app.set(
			{
				scope: 'selfdriven-ai',
				context: 'chat-attach',
				value: dataBase64
			});

			app.invoke('selfdriven-ai-chat-process', param);			
		})
		.catch(error => {
			console.error('Error reading file:', error);
		});*/
	}
});

app.add(
{
	name: 'selfdriven-ai-chat',
	code: function (param)
	{
		if (document.getElementById('selfdriven-ai-attach-file').files.length != 0)
		{
			app.invoke('selfdriven-ai-chat-attach-process', param);
		}
		else
		{
			app.invoke('selfdriven-ai-chat-process', param);
		}
	}
})

app.add(
{
	name: 'selfdriven-ai-chat-process',
	code: function (param, response)
	{
		let messages = app.get({scope: 'selfdriven-ai', context: 'messages', valueDefault: []});
		let userMessage = _.get(param, 'dataContext.text');

		if (_.isNotSet(userMessage))
		{
			userMessage = app.get(
			{
				scope: 'selfdriven-ai',
				context: 'chat-text'
			});
		}

		if (response == undefined)
		{
			if (_.isNotSet(userMessage))
			{}
			else
			{
				//  role: system/user/assistant

				let _context = 'selfdriven-prod';
				
				if (_.includes(window.location.host.toLowerCase(), '-lab'))
				{
					_context = 'selfdriven-lab';
				}

				if (_.isNotSet(userMessage))
				{
					app.invoke('util-view-spinner-remove-all');
					app.notify('What did you want to ask?')
				}
				else
				{
					messages.push(
					{
						role: 'user',
						content: userMessage
					});

					let invokeData =
					{
						method: 'ai-gen-chat',
						data:
						{
							_context: _context,
							service: 'openai',
							messages: {
								all: messages
							}
						}
					}

					const attachBase64 = app.get(
					{
						scope: 'selfdriven-ai',
						context: 'chat-attach'
					});

					if (attachBase64 != undefined)
					{
						invokeData.data.attachments =
						[
							{base64: attachBase64}
						]
					}

					let coreURL = 'https://ai.api.slfdrvn.io';
					
					entityos.cloud.invoke(
					{
						url: coreURL,
						data: JSON.stringify(invokeData),
						type: 'POST',
						callback: 'selfdriven-ai-chat-process',
						callbackParam: param
					});
				}
			}
		}
		else
		{
			if (response.status == 'ER')
			{}
			else
			{
				console.log(response);

				let messages = app.get({scope: 'selfdriven-ai', context: 'messages', valueDefault: []});

				messages.push(
				{
					role: 'assistant',
					content: _.get(response, 'data.messages.response', '')
				});

				var chatDashboardView = app.vq.init();

				chatDashboardView.add(
				[
					'<div class="card mt-3">',
						'<div class="card-body">'
				]);

				const viewMessages = _.cloneDeep(messages);

				let currentMessageIndex;

				_.each(viewMessages, function (message, m)
				{
					if (message.role == 'system')
					{}
					else
					{
						const messageClass = (message.role=='user'?' text-secondary':'') 
						//_.get(response, 'data.messages.response', '').replace(/\n/g, '<br>');

						let collapseCSS = 
						{
							chevron: 'fa-chevron-down',
							container: ''
						}

						if ((messages.length - m) <= 4)
						{
							collapseCSS = 
							{
								chevron: 'fa-chevron-up',
								container: 'show'
							}
						}

						if (message.role == 'user')
						{
							chatDashboardView.add(
							[
								'<div class="row items-align-end">',
									'<div class="col',  messageClass, ' mb-3">',
										'<a class="entityos-collapse-toggle',  messageClass, '" data-toggle="collapse" role="button"',
											' href="#selfdriven-message-', m, '-collapse" aria-expanded="true">',
												message.content,
												'<i class="fa text-muted ml-2 ', collapseCSS.chevron, '"></i>',
										'</a>',
									'</div>',
								'</div>'
							]);

							currentMessageIndex = m;
						}
						else
						{
							chatDashboardView.add(
							[
								'<div class="row items-align-end">',
									'<div class="col',  messageClass, ' mb-0">',
										'<div class="entityos-collapse collapse ', collapseCSS.container, '" id="selfdriven-message-', currentMessageIndex, '-collapse">',
										marked.parse(message.content),
										'</div>',
									'</div>',
								'</div>'
							]);
						}
					}
				});
				
				chatDashboardView.add(
				[
						'</div>',
					'</div>'
				]);

				chatDashboardView.render('#selfdriven-ai-chat-view');

				$('#selfdriven-ai-chat-text').val('');
				app.invoke('util-view-spinner-remove-all');
			}
		}
	}
});

app.add(
{
	name: 'selfdriven-ai-get-models',
	code: function (param, response)
	{
		var data = entityos._util.data.get(
		{
			scope: 'hey-octo',
			valueDefault: {}
		});

		if (response == undefined)
		{
			let _context = 'selfdriven-prod';
			
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
				callback: 'selfdriven-ai-get-models',
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
					'<div class="card mt-3">',
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

				chatDashboardView.render('#selfdriven-ai-info-view');
				app.invoke('util-view-spinner-remove-all');
			}
		}
	}
});

// User Authenticated chats
// TODO

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
	app.invoke('selfdriven-ai-set-options');
	app.invoke('on-chain-init');
}