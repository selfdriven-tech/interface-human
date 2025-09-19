/*
	https://selfdriven.ai
	https://selfdriven.tech

	Set up:

	app.invoke('util-cloud-search-show',
	{
		object: 'core_url_group',
		fields: ['title'], filters: [],
		rows: 9999
	});

	lab: id: 525
	prod: id: 526

	entityos.cloud.save(
	{
		object: 'core_url_group',
		data:
		{
			title: 'Services'
		}
	});

	entityos.cloud.save(
	{
		object: 'core_url',
		data:
		{
			title: 'GenAI Provider (Octo)',
			group: 526,
			internalreference: 1,
			type: 4,
			url: 'https://ai.api.slfdrvn.io',
			
			urllogon: '',
			urlpassword: '',
			public: 'Y'
		}
	});

	app.invoke('util-cloud-search-show',
	{
		object: 'core_url',
		fields: ['title', 'internalreference'], filters: {group: 526},
		rows: 10
	});

	lab: id: 29356
	prod: id: 29357
*/

app.add(
{
	name: 'util-ai-chat',
	code: function (param)
	{
		app.invoke('util-ai-set-options');
		app.invoke('util-ai-chat-show');
	}
});

app.add(
{
	name: 'util-ai-set-options',
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
				scope: 'util-ai',
				context: 'mySetup',
				value: 
				{
					context: 'lab',
					conversations: {}
				}
			});
		}
		else
		{
			app.set(
			{
				scope: 'util-ai',
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
					conversations: {},
					templates: {}
				}
			});
		}
	}
});

app.add(
{
	name: 'util-ai-chat-show',
	code: function (param)
	{
		$('#util-ai-chat-assistant-show').removeClass("d-none")

		var chatDashboardView = app.vq.init();

		chatDashboardView.add(
		[
			'<div class="mt-4 pt-30 pb-1">',
				'<div class="">',
					'<div class="">',
						'<div class="row">',
							'<div class="col-1 text-right pr-3">',
								'<a class="entityos-click"',
									' data-spinner',
									' data-controller="util-ai-get-models"',
								'>',
								'<img src="/site/2134/selfdriven-art-series-3-octo.0.doing.stuff-thanks.png" class="img-responsive mx-auto rounded-circle" style="height:42px; padding-top: 2px;">',
								'</a>',
							'</div>',
							'<div class="col-10 px-0">',
								'<form autocomplete="off">',
									'<div class="input-group input-group-flush input-group-merge input-group-reverse">',
										'<input type="text" class="form-control input-lg entityos-text text-center input-rounded" data-enter="stop" data-clean="disabled" data-scope="util-ai" data-context="chat-text" id="util-ai-chat-text" placeholder="Chat with Octo">',
									'</div>',
								'</form>',
							'</div>',
							'<div class="col-1 pl-2 mt-0">',
								'<button class="btn btn-default btn-outline entityos-click"',
									' data-controller="util-ai-chat-send"',
									' data-spinner',
								'><i class="fa fa-arrow-up"></i></button>',
							'</div>',
						'</div>',
					'</div>',
				'</div>',
				'<div class="row mt-3 text-center">',
					'<div class="col-12">',
						'<input type="file" id="util-ai-attach-file" class="entityos-change" data-controller="util-ai-attach-select" data-context="file" style="display:none;"/>',
						'<button class="btn btn-default border btn-sm entityos-click rounded-pill" id="util-ai-attach" data-controller="util-ai-chat-attach"><i class="fa fa-cloud-upload-alt"></i> Attach File</button>',
					'</div>',
				'</div>',
			'</div>',
			'<div id="util-ai-chat-view" class="text-center">',
				'<div class="row">',
					'<div class="col-12 mt-2">',
						'<button class="btn btn-default border btn-sm entityos-click rounded-pill"',
							' data-spinner',
							' data-controller="util-ai-chat-send" data-text="I\'m Bored"',
						'>I\'m Bored</button>',
						'<button class="btn btn-default border btn-sm entityos-click rounded-pill ms-2"',
							' data-spinner',
							' data-controller="util-ai-chat-send" data-text="I need an idea for a personal challenge"',
						'>I need an idea for a personal challenge</button>',
					'</div>',
				'</div>',
			'</div>'
		]);

		chatDashboardView.add(
		[
			'<div id="util-ai-attach-file-view" class="text-center">',
			'</div>'
		]);

		chatDashboardView.add(
		[
			'<div id="util-ai-info-view" class="text-center">',
			'</div>'
		]);

		chatDashboardView.render('#util-ai-chat-container');

		// Init messages conversation // role: system/user/assistant

		let systemMessage = 'You are a learning assistant.';
		let messages = [
		{
			role: 'system',
			content: systemMessage
		}]
		
		app.set({scope: 'util-ai', context: 'messages', value: messages});
	}
});

app.add(
{
	name: 'util-ai-chat-attach',
	code: function (param)
	{
		document.getElementById('util-ai-attach-file').click();
	}
});

app.add(
{
	name: 'util-ai-attach-select',
	code: function (param)
	{
		const attachFile = document.getElementById('util-ai-attach-file').files[0];

		var attachSelectView = app.vq.init();

		if (_.includes(attachFile.type, 'image/'))
		{
			app.invoke('util-ai-chat-attach-file-to-base64', attachFile).then(function (dataBase64)
			{
				//console.log('Base64 (correct):', dataBase64);
				app.set(
				{
					scope: 'util-ai',
					context: 'chat-attach',
					value: dataBase64
				});

				attachSelectView.add(
				[
					'<div class="card mt-3">',
						'<div class="card-body">',
							'<div class="row items-align-end">',
								'<div class="col text-secondary">',
									attachFile.name,
									'</div>',
								'</div>',
							'</div>',
							'<div class="row items-align-end">',
								'<div class="col mb-3">',
									'<img class="img-fluid" src="data:image/', _.last(_.split(attachFile.type, '/')), ';base64,' + dataBase64 + '">',
									'</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);

				attachSelectView.render('#util-ai-attach-file-view');
			});
		}
		else
		{
			attachSelectView.add(
			[
				'<div class="card mt-3">',
					'<div class="card-body">',
						'<div class="row items-align-end">',
							'<div class="col text-secondary">',
								attachFile.name,
								'</div>',
							'</div>',
						'</div>',
					'</div>',
				'</div>'
			]);

			attachSelectView.render('#util-ai-attach-file-view')
		}
	}
});


app.add(
{
	name: 'util-ai-chat-attach-file-to-base64',
	code: function (file)
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
	}
});

app.add(
{
	name: 'util-ai-chat-attach-process',
	code: function (param, response)
	{
		const attachFile = document.getElementById('util-ai-attach-file').files[0];

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
				scope: 'util-ai',
				context: 'chat-attach',
				value: dataBase64
			});

			app.invoke('util-ai-chat-process', param);		
		});

		/*readFileAsText(attachFile)
		.then(result => {
			const data = result;
			const dataBase64 = Base64.encode(data);
			console.log('Data Base64:', dataBase64);

			app.set(
			{
				scope: 'util-ai',
				context: 'chat-attach',
				value: dataBase64
			});

			app.invoke('util-ai-chat-process', param);			
		})
		.catch(error => {
			console.error('Error reading file:', error);
		});*/
	}
});

app.add(
{
	name: 'util-ai-chat-send',
	code: function (param)
	{
		if (document.getElementById('util-ai-attach-file').files.length != 0)
		{
			app.invoke('util-ai-chat-attach-process', param);
		}
		else
		{
			app.invoke('util-ai-chat-process', param);
		}
	}
})

app.add(
{
	name: 'util-ai-chat-process',
	code: function (param, response)
	{
		let messages = app.get({scope: 'util-ai', context: 'messages', valueDefault: []});
		let userMessage = _.get(param, 'dataContext.text');

		if (_.isNotSet(userMessage))
		{
			userMessage = app.get(
			{
				scope: 'util-ai',
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
				
				if (app.whoami().mySetup.isLab)
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

					const model = app.get(
					{
						scope: 'util-ai',
						context: 'model'
					});

					const service = app.get(
					{
						scope: 'util-ai',
						context: 'service'
					});

					let invokeData =
					{
						method: 'ai-gen-chat',
						data:
						{
							_context: _context,
							service: service,
							model: model,
							messages: {
								all: messages
							}
						}
					}

					// Need to codify support for "all"
					if (service != 'openai')
					{
						const systemMessage = _.find(messages, function (message)
						{
							return message.role == 'system'
						});

						_.set(invokeData, 'data.messages',
						{
							system: _.get(systemMessage, 'content'),
							user: userMessage
						})
					}

					const attachBase64 = app.get(
					{
						scope: 'util-ai',
						context: 'chat-attach'
					});

					if (attachBase64 != undefined)
					{
						invokeData.data.attachments =
						[
							{base64: attachBase64}
						]
					}

					/*let coreURL = 'https://ai.api.slfdrvn.io';
					
					entityos.cloud.invoke(
					{
						url: coreURL,
						data: JSON.stringify(invokeData),
						type: 'POST',
						callback: 'util-ai-chat-process',
						callbackParam: param
					});*/

					var urlID =  _.get(app.whoami().mySetup, 'uris.urls.aiProvider.id')

					entityos.cloud.invoke(
					{
						method: 'core_url_get',
						data:
						{
							urlid: urlID,
							type: 'POST',
							data: JSON.stringify(invokeData),
							asis: 'Y'
						},
						callback: 'util-ai-chat-process',
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

				let messages = app.get({scope: 'util-ai', context: 'messages', valueDefault: []});

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
						const messageClass = (message.role=='user'?' text-secondary-x':'') 
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
												'<i class="fa text-muted-x ml-2 ', collapseCSS.chevron, '"></i>',
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

				chatDashboardView.render('#util-ai-chat-view');

				$('#util-ai-chat-text').val('');
				app.invoke('util-view-spinner-remove-all');
			}
		}
	}
});

app.add(
{
	name: 'util-ai-get-models',
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

			/*let coreURL = 'https://ai.api.slfdrvn.io';
			
			entityos.cloud.invoke(
			{
				url: coreURL,
				data: JSON.stringify(invokeData),
				type: 'POST',
				callback: 'util-ai-get-models',
				callbackParam: param
			});*/

			var urlID =  _.get(app.whoami().mySetup, 'uris.urls.aiProvider.id')

			entityos.cloud.invoke(
			{
				method: 'core_url_get',
				data:
				{
					urlid: urlID,
					type: 'POST',
					data: JSON.stringify(invokeData),
					asis: 'Y'
				},
				callback: 'util-ai-get-models',
				callbackParam: param
			});
		}
		else
		{
			if (response.status == 'ER')
			{}
			else
			{
				console.table(_.get(response, 'data.models'));

				const defaultModel = _.find(_.get(response, 'data.models'), function (model)
				{
					return model.default // change to systemDefault when available
				})

				app.set(
				{
					scope: 'util-ai',
					context: 'model',
					value: _.get(defaultModel, 'name')
				});

				app.set(
				{
					scope: 'util-ai',
					context: 'service',
					value: _.get(defaultModel, 'service')
				});

				var chatDashboardView = app.vq.init();

				chatDashboardView.add(
				[
					'<div class="card mt-3">',
						'<div class="card-body">'
				]);

				_.each(response.data.models, function (model)
				{
					// Need to codify support for "all"
					model.all = (model.service == 'openai');
					
					chatDashboardView.add(
					[
						'<div class="row items-align-end">',
							'<div class="col', (model.default?' text-dark':' text-secondary'), ' entityos-click"',
								' data-controller="util-ai-get-models-set"',
								' data-service="', model.service, '"',
								' data-model="', model.name, '">',
								model.name,
								' <span class="small" style="color:#bdccdb;">(', model.service, ')</span>',
								(model.all?' <span class="small" style="color:#bdccdb;"><i class="fa fa-sync"></i></span>':''),
							'</div>',
						'</div>'
					]);
				});

				chatDashboardView.add(
				[
						'</div>',
					'</div>'
				]);

				chatDashboardView.render('#util-ai-info-view');
				app.invoke('util-view-spinner-remove-all');
			}
		}
	}
});

app.add(
{
	name: 'util-ai-get-models-set',
	code: function (param)
	{
		//console.log(param)

		app.set(
		{
			scope: 'util-ai',
			context: 'model',
			value: _.get(param, 'dataContext.model')
		});

		app.set(
		{
			scope: 'util-ai',
			context: 'service',
			value: _.get(param, 'dataContext.service')
		});
	}
});

// Chat with Assistant
// - Personal -- Vector-Store with experiences
// - Domain -- Vector-Store with domain specific data


app.add(
{
	name: 'util-ai-chat-assistant',
	code: function (param)
	{
		app.invoke('util-ai-set-options');
		app.invoke('util-ai-chat-assistant-show');
	}
});

app.add(
{
	name: 'util-ai-chat-assistant-show',
	code: function (param)
	{
		var data = app.get({scope: 'chat'});

		$('#util-ai-chat-assistant-show').addClass("d-none");

		var chatDashboardView = app.vq.init();

		chatDashboardView.add(
		[
			'<div class="mt-4 pt-30 pb-1">',
				'<div class="">',
					'<div class="">',
						'<div class="row">',
							'<div class="col-1 text-right pr-3">',
								'<a class="entityos-click"',
									' data-spinner',
									' data-controller="util-ai-get-assistants"',
								'>',
								'<img src="/site/2134/artomics-selfdriven-art-series-1-octo.0.importance-of-understanding-of-self.png" class="img-responsive mx-auto rounded-circle" style="height:42px; padding-top: 2px;">',
								'</a>',
							'</div>',
							'<div class="col-10 px-0">',
								'<form autocomplete="off">',
									'<div class="input-group input-group-flush input-group-merge input-group-reverse">',
										'<input type="text" class="form-control input-lg entityos-text text-center input-rounded" data-enter="stop" data-clean="disabled" data-scope="util-ai" data-context="chat-assistant-text" id="util-ai-chat-assistant-text" placeholder="Chat with the selfdriven White Paper Assistant">',
									'</div>',
								'</form>',
							'</div>',
							'<div class="col-1 pl-2 mt-0">',
								'<button class="btn btn-default btn-outline entityos-click"',
									' data-controller="util-ai-chat-assistant-send"',
									' data-spinner',
								'><i class="fa fa-arrow-up"></i></button>',
							'</div>',
						'</div>',
					'</div>',
				'</div>',
				'<div class="row mt-3 text-center">',
					'<div class="col-12">',
						'<input type="file" id="util-ai-chat-assistant-attach-file" class="entityos-change" data-controller="util-ai-chat-assistant-attach-select" data-context="file" style="display:none;"/>',
						'<button class="btn btn-default border btn-sm entityos-click rounded-pill" id="util-ai-chat-assistant-attach" data-controller="util-ai-chat-assistant-attach"><i class="fa fa-cloud-upload-alt"></i> Attach File</button>',
					'</div>',
				'</div>',
			'</div>',
			'<div id="util-ai-chat-assistant-view" class="text-center">',
				'<div class="row">',
					'<div class="col-12 mt-2">',
						'<button class="btn btn-default border btn-sm entityos-click rounded-pill"',
							' data-spinner',
							' data-controller="util-ai-chat-assistant-send" data-text="I\'m Bored"',
						'>I\'m Bored</button>',
						'<button class="btn btn-default border btn-sm entityos-click rounded-pill ms-2"',
							' data-spinner',
							' data-controller="util-ai-chat-assistant-send" data-text="I need ideas for my level up profile"',
						'>I need ideas for my level up profile</button>',
					'</div>',
				'</div>',
			'</div>'
		]);

		chatDashboardView.add(
		[
			'<div id="util-ai-attach-assistant-file-view" class="text-center">',
			'</div>'
		]);

		chatDashboardView.add(
		[
			'<div id="util-ai-info-view" class="text-center">',
			'</div>'
		]);

		chatDashboardView.render('#util-ai-chat-assistant-container');

		// Init messages conversation // role: system/user/assistant

		let systemMessage = 'You are a learning assistant.';
		let messages = [
		{
			role: 'system',
			content: systemMessage
		}]
		
		app.set({scope: 'util-ai', context: 'messages', value: messages});
	}
});

app.add(
{
	name: 'util-ai-chat-assistant-send',
	code: function (param)
	{
		if (document.getElementById('util-ai-chat-assistant-attach-file').files.length != 0)
		{
			app.invoke('util-ai-chat-assistant-attach-process', param);
		}
		else
		{
			app.invoke('util-ai-chat-assistant-process', param);
		}
	}
})

app.add(
{
	name: 'util-ai-chat-assistant-process',
	code: function (param, response)
	{
		let messages = app.get({scope: 'util-ai', context: 'messages-assistant', valueDefault: []});
		let userMessage = _.get(param, 'dataContext.text');

		if (_.isNotSet(userMessage))
		{
			userMessage = app.get(
			{
				scope: 'util-ai',
				context: 'chat-assistant-text'
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
				
				if (app.whoami().mySetup.isLab)
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

					const model = app.get(
					{
						scope: 'util-ai-assistant',
						context: 'model'
					});

					const service = app.get(
					{
						scope: 'util-ai-assistant',
						context: 'service'
					});

					// thread.id can be user specific with generic assistant
					// thread.id and assistant.id can be user specific
					// Need to securely hold against a user - but needs lots of security/privacy considerations.
					// Currently only for public assistants. eg shared educational material

					let invokeData =
					{
						method: 'ai-gen-chat-with-assistant',
						data:
						{
							_context: _context,
							service: service,
							model: model,
							thread:
							{
								id: 'thread_yX2bMq1IhyZNdEJ5nUYbP2nK'
							},
							assistant:
							{
								id: 'asst_bM8EgHOcjlO4zWWWMUauCD4F'
							},
							message:
							{
								role: 'user',
								content: userMessage
							}
						}
					}

					// Need to codify support for "all"
					if (service != 'openai')
					{
						const systemMessage = _.find(messages, function (message)
						{
							return message.role == 'system'
						});

						_.set(invokeData, 'data.messages',
						{
							system: _.get(systemMessage, 'content'),
							user: userMessage
						})
					}

					const attachBase64 = app.get(
					{
						scope: 'util-ai',
						context: 'chat-assistant-attach'
					});

					if (attachBase64 != undefined)
					{
						invokeData.data.attachments =
						[
							{base64: attachBase64}
						]
					}

					/*let coreURL = 'https://ai.api.slfdrvn.io';
					
					entityos.cloud.invoke(
					{
						url: coreURL,
						data: JSON.stringify(invokeData),
						type: 'POST',
						callback: 'util-ai-chat-process',
						callbackParam: param
					});*/

					var urlID =  _.get(app.whoami().mySetup, 'uris.urls.aiProvider.id')

					entityos.cloud.invoke(
					{
						method: 'core_url_get',
						data:
						{
							urlid: urlID,
							type: 'POST',
							data: JSON.stringify(invokeData),
							asis: 'Y'
						},
						callback: 'util-ai-chat-assistant-process',
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

				let messages = app.get({scope: 'util-ai', context: 'messages-assistant', valueDefault: []});

				messages.push(
				{
					role: 'assistant',
					content: _.get(response, 'data.assistant.response', '')
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
						const messageClass = (message.role=='user'?' text-secondary-x':'') 
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
												'<i class="fa text-muted-x ml-2 ', collapseCSS.chevron, '"></i>',
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

				chatDashboardView.render('#util-ai-chat-assistant-view');

				$('#util-ai-chat-assistant-text').val('');
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

