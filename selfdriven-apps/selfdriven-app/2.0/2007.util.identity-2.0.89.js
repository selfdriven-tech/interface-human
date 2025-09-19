// Based on dsociety.io/learn-ssi code example
// SSI DIDs/VCs etc

import { EntityOS } from '/site/2007/entityos.module.class-1.0.0.js';
const eos = new EntityOS();

eos.add(
[
	{
		name: 'util-identity-dashboard',
		code: function ()
		{
			app.invoke('util-identity-account');
		}
	},
	{
		name: 'util-identity-account',
		code: function (param, response)
		{
			//Get the fully managed account
			if (response == undefined)
			{
				entityos.cloud.search(
				{
					object: 'core_protect_key',
					fields:
					[
						'key', 'notes'
					],
					filters:
					[
						{	
							field: 'object',
							comparison: 'EQUAL_TO',
							value: app.whoami().mySetup.objects.user
						},
						{	
							field: 'objectcontext',
							comparison: 'EQUAL_TO',
							value: app.whoami().thisInstanceOfMe.user.id
						},
						{	
							field: 'type',
							comparison: 'EQUAL_TO',
							value: 1
						},
						{	
							field: 'category',
							comparison: 'EQUAL_TO',
							value: 4
						},	
						{
							field: 'title',
							comparison: 'EQUAL_TO',
							value: '[ssi-account-fully-managed]'
						}
					],
					sorts:
					[
						{
							field: 'modifieddate',
							direction: 'desc'
						}
					],
					callback: 'util-identity-account'
				});
			}
			else
			{
				var identityAccountView = app.vq.init({queue: 'util-identity-account'});

				if (response.data.rows.length == 0)
				{
					identityAccountView.add(
					[
						'<div class="mt-4">',
							'<button type="button" class="btn btn-default btn-sm btn-outline myds-click" data-spinner="prepend" data-controller="util-identity-account-create">',
								'Create Identity Account',
							'</button>',
						'</div>'
					]);
				}
				else
				{
					var account = app.set(
					{
						scope: 'util-identity-account',
						context: '_account',
						value: _.first(response.data.rows)
					});

					app.set(
					{
						scope: 'util-identity-account',
						context: 'didDocument',
						value: JSON.parse(account.notes)
					});

					identityAccountView.add(
                    [
						'<div class="row mt-0">',
							'<div class="col-12">',
								'<div class="mt-4 text-dark lead px-6 alert alert-info mb-3" style="overflow-wrap: break-word;">',
									account.key,
								'</div>',
								'<div class="mt-4" id="util-identity-account-show-view">',
									'<button type="button" class="btn btn-default btn-sm btn-outline myds-click me-2" data-controller="util-identity-account-show">',
										'<i class="fa fa-address-card"></i> Show DID Document',
									'</button>',
								'</div>',
							'</div>',
							'<div class="col-12 text-center mt-3">',
								'<button type="button" class="btn btn-default btn-sm btn-outline myds-click" data-controller="util-identity-account-download">',
									'<i class="fa fa-cloud-download-alt"></i> Download to Save & Share',
								'</button>',
							'</div>',
							'<div class="col-12 text-center mt-4">',
								'<button type="button" class="btn btn-link btn-sm text-muted myds-click" data-controller="util-identity-account-download-sdi">',
									'Download as SDI SSI On-Chain Metadata',
								'</button>',
							'</div>',
						'</div>'
					]);	
				}
                
				identityAccountView.render('#util-identity-account-view');
			}
		}
	},
	{
		name: 'util-identity-account-show',
		code: function (param, response)
		{
			var didDocument = app.get(
			{
				scope: 'util-identity-account',
				context: 'didDocument'
			});

			var identityAccountShowView = app.vq.init({queue: 'util-identity-account-show'});

			identityAccountShowView.add(
			[
				'<div class="row mt-3">',
					'<div class="col-12">',
						'<div class="px-4 alert alert-info py-4 mb-3" style="overflow-wrap: break-word;">',
							'<div class="text-secondary">',
								'Verification Method Type',
							'</div>',
							'<div class="text-dark lead" style="overflow-wrap: break-word;">',
								_.first(didDocument.verificationMethod).type,
							'</div>',
							'<div class="text-secondary mt-2">',
								'Public Key Multibase (Base58)',
							'</div>',
							'<div class="text-dark lead" style="overflow-wrap: break-word;">',
								_.first(didDocument.verificationMethod).publicKeyMultibase,
							'</div>',
						'</div>',
					'</div>',
				'</div>'
			]);

			identityAccountShowView.render('#util-identity-account-show-view');
		}
	},
	{
		name: 'util-identity-account-download',
		code: function (param, response)
		{
			var account = app.get(
			{
				scope: 'util-identity-account',
				context: '_account'
			})

			var account = app.get(
			{
				scope: 'util-identity-account',
				context: '_account'
			});

			var data = account.notes;

			const anon = _.includes(account.key, 'did:selfdriven:anon:');

			let filename;

			if (anon)
			{
				filename = 'selfdriven-did-document-' +
								_.replace(account.key, 'did:selfdriven:anon:', '') +
								'.json'
			}
			else
			{
				filename = 'selfdriven-did-document-' +
								_.replace(account.key, 'did:selfdriven:', '') +
								'.json'
			}

			app.invoke('util-export-to-file',
			{
				data: data,
				filename: filename
			});
		}
	},
	{
		name: 'util-identity-account-download-sdi',
		code: function (param, response)
		{
			var account = app.get(
			{
				scope: 'util-identity-account',
				context: '_account'
			})

			var account = app.get(
			{
				scope: 'util-identity-account',
				context: '_account'
			});

			var data = account.notes;

			const anon = _.includes(account.key, 'did:selfdriven:anon:');

			let filename;
			let sdiOnChainData;

			if (anon)
			{
				sdiOnChainData =
				{
					"115100105": {
						"6dd60b94e766e94ea3886d7631990db6d468d202c42a482090ee3a17": {
							"SSI": {
								"id": account.key
							}
						}
					}
				}

				filename = 'selfdriven-sdi-ssi-anon-on-chain-metadata-' +
								_.replace(account.key, 'did:selfdriven:anon:', '') +
								'.json';

				app.invoke('util-export-to-file',
				{
					data: JSON.stringify(sdiOnChainData, null, 2),
					filename: filename
				});
			}
			else
			{
				entityos.cloud.search(
				{
					object: 'contact_person',
					fields: 'guid',
					filters: {id: app.whoami().thisInstanceOfMe.user.contactperson},
					callback: function (param, response)
					{
						const userContact = _.first(response.data.rows);
						let userContactData = {}

						if (_.isSet(userContact));
						{
							userContactData[_.replaceAll(_.get(userContact, 'guid', 'unknown'), '-', '')] = 
							{
								"SSI": {
									"id": account.key
								}
							}
						}

						sdiOnChainData =
						{
							"115100105": {
								"6dd60b94e766e94ea3886d7631990db6d468d202c42a482090ee3a17": userContactData
							}
						}
		
						filename = 'selfdriven-sdi-ssi-on-chain-metadata-' +
								_.replace(account.key, 'did:selfdriven:', '') +
								'.json';

						app.invoke('util-export-to-file',
						{
							data: JSON.stringify(sdiOnChainData, null, 2),
							filename: filename
						});
					}
				});
			}
		}
	},
	{
		name: 'util-identity-account-create',
		code: function (param, response)
		{
			//Create account with selfdrivenOcto as trusted agent. (via api) 
			//	lab: UserKey: 2174af85-2728-4330-94dc-0b8be2b12947

			app.invoke('util-identity-account-create-conversation');
		}
	},
	{
		name: 'util-identity-account-create-conversation',
		code: function (param, response)
		{
			//Search to see if have a conversation with Octo already.
			//Search by title "Conversation with Octo"
			//object = 22
			//objectcontext = current user
			//notes = '[conversation-with-octo]'

			if (response == undefined)
			{
				entityos.cloud.search(
				{
					object: 'messaging_conversation',
					fields: [{name: 'owner'}],

					filters:
					[
						{
							field: 'notes',
							comparison: 'EQUAL_TO',
							value: '[conversation-with-octo]'
						},
						{
							field: 'sharing',
							comparison: 'EQUAL_TO',
							value: 1
						},
						{
							field: 'object',
							comparison: 'EQUAL_TO',
							value: 22
						},
						{
							field: 'objectcontext',
							comparison: 'EQUAL_TO',
							value: app.whoami().thisInstanceOfMe.user.id
						}
					],
					callback: 'util-identity-account-create-conversation'
				});
			}
			else
			{
				if (response.data.rows.length == 0)
				{
					app.invoke('util-identity-account-create-conversation-save');
				}
				else
				{
					app.set(
					{
						scope: 'util-identity-account-create',
						context: 'conversation',
						value: _.first(response.data.rows)
					});

					app.invoke('util-identity-account-create-conversation-participant');
				}
			}
		}
	},
	{
		name: 'util-identity-account-create-conversation-save',
		code: function (param, response)
		{
			if (response == undefined)
			{
				const data =
				{
					title: 'Conversation with Octo',
					notes: '[conversation-with-octo]',
					sharing: 1,
					object: 22,
					objectcontext: app.whoami().thisInstanceOfMe.user.id
				}

				entityos.cloud.save(
				{
					object: 'messaging_conversation',
					data: data,
					responseFields: 'guid',
					callback: 'util-identity-account-create-conversation-save',
					callbackParam: param
				});
			}
			else
			{
				app.set(
				{
					scope: 'util-identity-account-create',
					context: 'conversation',
					value: {id: response.id, guid: _.first(response.data.rows).guid}
				});

				app.invoke('util-identity-account-create-conversation-participant');
			}
		}
	},
	{
		name: 'util-identity-account-create-conversation-participant',
		code: function (param, response)
		{
			if (response == undefined)
			{
				const conversation = app.get(
				{
					scope: 'util-identity-account-create',
					context: 'conversation'
				});

				entityos.cloud.search(
				{
					object: 'messaging_conversation_participant',
					fields: [{name: 'guid'}],
					customOptions:
					[
						{
							name: 'conversation',
							value: conversation.id
						}
					],
					filters:
					[
						{
							field: 'conversation',
							comparison: 'EQUAL_TO',
							value: conversation.id
						},
						{
							field: 'user',
							comparison: 'EQUAL_TO',
							value: (app.whoami().mySetup.isLab?44066:44068)
						}
					],
					callback: 'util-identity-account-create-conversation-participant'
				});
			}
			else
			{
				if (response.data.rows.length == 0)
				{
					app.invoke('util-identity-account-create-conversation-participant-save');
				}
				else
				{
					app.invoke('util-identity-account-create-process');
				}
			}
		}
	},
	{
		name: 'util-identity-account-create-conversation-participant-save',
		code: function (param, response)
		{
			const conversation = app.get(
			{
				scope: 'util-identity-account-create',
				context: 'conversation'
			});

			if (response == undefined)
			{
				const data =
				{
					conversation: conversation.id,
					emailalert: 'N',
					user: (app.whoami().mySetup.isLab?44066:44068)
				}

				entityos.cloud.save(
				{
					object: 'messaging_conversation_participant',
					data: data,
					callback: 'util-identity-account-create-conversation-participant-save',
					callbackParam: param
				});
			}
			else
			{
				app.invoke('util-identity-account-create-process');
			}
		}
	},
    {
		name: 'util-identity-account-create-process',
		code: function (param, response)
		{
            if (response == undefined)
            {
                console.log('## Create SSI Identity Account:');

				const conversation = app.get(
				{
					scope: 'util-identity-account-create',
					context: 'conversation'
				});

				let urlData =
				{
					 method: 'ssi-generate-account',
					 data:
					 {	
						managed: true,
						ssifrawework: 'selfdriven',
						userkey: app.whoami().thisInstanceOfMe.user.guid,
						conversationkey: conversation.guid
					}
				}
					
				if (app.whoami().mySetup.isLab)
				{
					urlData._context = 'selfdriven-lab'
				}
				else
				{
					urlData._context = 'selfdriven-prod'
				}

				if (_.get(param, 'reset', false))
				{
					urlData.data.reset = true
				}

                var urlID = (app.whoami().mySetup.isLab?29295:29296) 

                entityos.cloud.invoke(
                {
                    method: 'core_url_get',
                    data:
                    {
                        urlid: urlID,
                        headeroutname0: 'x-api-key',
                        headeroutvalue0: '[[LOGON]]',
                        headeroutname1: 'x-auth-key',
                        headeroutvalue1: '[[PASSWORD]]',
                        type: 'POST',
                        data: JSON.stringify(urlData),
                        asis: 'Y'
                    },
                    callback: 'util-identity-account-create-process',
                    callbackParam: param
                })
            }
            else
            {
				app.invoke('util-view-spinner-remove-all');

                var onChainAccounView = app.vq.init({queue: 'util-identity-account-create'});

                if (_.isPlainObject(response.data))
                {
					const account = app.set(
					{
						scope: 'util-identity-account-create',
						context: 'account',
						value: response.data
					});

					app.invoke('util-identity-account-create-process-save');
                }
				
				if (!_.isUndefined(response.warning))
				{
					onChainAccounView.add(
                    [
					 	'<div class="mt-4 text-warning">',
                            response.error,
                        '</div>'
					]);
				}

				onChainAccounView.render('#util-identity-account-view');
            }
		}
	},
	{
		name: 'util-identity-account-create-process-save',
		code: function (param, response)
		{
            if (response == undefined)
            {
                const account = app.get(
				{
					scope: 'util-identity-account-create',
					context: 'account'
				});

				let data = 
				{
					object: app.whoami().mySetup.objects.user,
					objectcontext: app.whoami().thisInstanceOfMe.user.id,
					type: 1,
					category: 4,
					title: '[ssi-account-fully-managed]',
					key:  account.didDocument.id,
					notes:  JSON.stringify(account.didDocument)
				}

				entityos.cloud.save(
				{
					object: 'core_protect_key',
					data: data,
					callback: 'util-identity-account-create-process-save'
				});
            }
            else
            {
				app.invoke('util-identity-account');
            }
		}
	},
	{
		name: 'util-identity-account-my-profile',
		code: function (param)
		{
			const _startURI = _.split(app.whoami().buildingMe.options.startURI, '-');
			let startURIContext = _.replace(app.whoami().buildingMe.options.startURI, _.first(_startURI) + '-', '');
			if (startURIContext == 'level-up') {startURIContext = 'learner'}

			const url = app.whoami().buildingMe.options.startURI + '/#' +
							startURIContext +
							'-me'

			window.location.href = url;
		}
	},
		{
		name: 'util-identity-account-my-on-chain-profile',
		code: function (param)
		{
			const url = app.whoami().buildingMe.options.startURI + '/#' +
							_.last(_.split(app.whoami().buildingMe.options.startURI, '-')) +
							'-me-on-chain-edit'

			window.location.href = url;
		}
	}
	
]);
