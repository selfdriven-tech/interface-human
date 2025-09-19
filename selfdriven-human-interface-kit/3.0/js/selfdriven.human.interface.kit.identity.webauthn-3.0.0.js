// Works with 	https://github.com/ibcom-lab/entityos-identity-trust
//				& entityos.util.security-1.1.16.js^

/* Set up

app.invoke('util-cloud-search-show',
{
	object: 'core_url_group',
	fields: ['title'], filters: [],
	rows: 9999
});

entityos.cloud.save(
{
	object: 'core_url_group',
	data:
	{
		title: 'Services'
	}
});

530 is for group in operations scope for pre-auth.

entityos.cloud.save(
{
	object: 'core_url',
	data:
	{
		title: 'Identity Trust Provider (identity-trust@entityos)',
		group: 530,
		internalreference: 1,
		type: 4,
		url: 'https://identity.api.entityos.cloud',
		urllogon: '',
		urlpassword: '',
		public: 'Y'
	}
});

app.invoke('util-cloud-search-show',
{
	object: 'core_url',
	fields: ['title', 'internalreference'], filters: {group: 530},
	rows: 10
});

*/

app.add(
[
	{
		name: 'util-identity-webauthn-passkey',
		code: function (param)
		{
			//Check if in local cache for this device.

			const createTitle = _.get(param, 'createTitle', 'Set up a Passkey');
			const removeTitle = _.get(param, 'createTitle', 'Remove Passkey');

			const webAuthNCredentialID = app.invoke('util-local-cache-search',
			{
				persist: true,
				key: 'entityos.webauthn.passkey.credential.id'
			});
		
			var identityWebAuthNPasskeyView = app.vq.init({queue: 'util-webauthn-passkey'});

			if (webAuthNCredentialID == undefined)
			{
				identityWebAuthNPasskeyView.add(
				[
					'<div class="mt-4">',
						'<button type="button" class="btn btn-default btn-outline w-75 mx-auto btn-sm entityos-click mb-3" data-spinner="prepend" data-controller="util-identity-webauthn-passkey-create">',
							createTitle,
						'</button>',
					'</div>'
				]);
			}
			else
			{
				identityWebAuthNPasskeyView.add(
				[
					'<div class="mt-4">',
						'<button type="button" class="btn btn-default btn-outline w-75 mx-auto btn-sm entityos-click mb-3" data-credential-id="', webAuthNCredentialID,'" data-spinner="prepend" data-controller="util-identity-webauthn-passkey-remove">',
							removeTitle,
						'</button>',
					'</div>'
				]);
			}
                
			const selector = _.get(param, 'viewContainerSelector', '#util-identity-webauthn-passkey-view');
			identityWebAuthNPasskeyView.render(selector);
		}
	},
	{
		name: 'util-identity-webauthn-passkey-remove',
		code: function (param)
		{
			app.invoke('util-local-cache-remove',
			{
				persist: true,
				key: 'entityos.webauthn.passkey.credential.id'
			});

			app.notify('Passkey has been removed.');

			app.invoke('util-identity-webauthn-passkey')
		}
	},
	{
		name: 'util-identity-webauthn-passkey-create',
		code: function (param, response)
		{
			app.invoke('util-identity-webauthn-passkey-create-conversation');
		}
	},
	{
		name: 'util-identity-webauthn-passkey-create-conversation',
		code: function (param, response)
		{
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
							value: '[conversation-with-identity-webauthn-passkey-provider]'
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
					callback: 'util-identity-webauthn-passkey-create-conversation'
				});
			}
			else
			{
				if (response.data.rows.length == 0)
				{
					app.invoke('util-identity-webauthn-passkey-create-conversation-save');
				}
				else
				{
					app.set(
					{
						scope: 'util-identity-webauthn-passkey-create',
						context: 'conversation',
						value: _.first(response.data.rows)
					});

					app.invoke('util-identity-webauthn-passkey-create-conversation-participant');
				}
			}
		}
	},
	{
		name: 'util-identity-webauthn-passkey-create-conversation-save',
		code: function (param, response)
		{
			if (response == undefined)
			{
				const notes = 
				{
					userlogon: app.whoami().thisInstanceOfMe.user.userlogonname
				}

				const data =
				{
					title: '[conversation-identity-webauthn-passkey]',
					notes: JSON.stringify(notes),
					sharing: 1,
					object: 22,
					objectcontext: app.whoami().thisInstanceOfMe.user.id
				}

				entityos.cloud.save(
				{
					object: 'messaging_conversation',
					data: data,
					responseFields: 'guid',
					callback: 'util-identity-webauthn-passkey-create-conversation-save',
					callbackParam: param
				});
			}
			else
			{
				app.set(
				{
					scope: 'util-identity-webauthn-passkey-create',
					context: 'conversation',
					value: {id: response.id, guid: _.first(response.data.rows).guid}
				});

				app.invoke('util-identity-webauthn-passkey-create-conversation-participant');
			}
		}
	},
	{
		name: 'util-identity-webauthn-passkey-create-conversation-participant',
		code: function (param, response)
		{
			if (response == undefined)
			{
				const identityWebAuthNProviderUserID = _.get(app.whoami().mySetup, 'conversations.users.identityWebAuthNProvider.id')

				if (identityWebAuthNProviderUserID == undefined)
				{
					app.notify('No WebAuthN (Passkey) Provider User Set Up.')
				}
				else
				{
					const conversation = app.get(
					{
						scope: 'util-identity-webauthn-passkey-create',
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
								value: identityWebAuthNProviderUserID
							}
						],
						callback: 'util-identity-webauthn-passkey-create-conversation-participant'
					});
				}
			}
			else
			{
				if (response.data.rows.length == 0)
				{
					app.invoke('util-identity-webauthn-passkey-create-conversation-participant-save');
				}
				else
				{
					app.invoke('util-identity-webauthn-passkey-create-options');
				}
			}
		}
	},
	{
		name: 'util-identity-webauthn-passkey-create-conversation-participant-save',
		code: function (param, response)
		{
			const conversation = app.get(
			{
				scope: 'util-identity-webauthn-passkey-create',
				context: 'conversation'
			});

			if (response == undefined)
			{
				const identityWebAuthNProviderUserGUID = _.get(app.whoami().mySetup, 'conversations.users.identityWebAuthNProvider.guid')

				if (identityWebAuthNProviderUserGUID == undefined)
				{
					app.notify('No WebAuthN (Passkey) Provider User Set Up.')
				}
				else
				{
					const data =
					{
						conversation: conversation.id,
						emailalert: 'N',
						userguid: identityWebAuthNProviderUserGUID
					}

					entityos.cloud.save(
					{
						object: 'messaging_conversation_participant',
						data: data,
						callback: 'util-identity-webauthn-passkey-create-conversation-participant-save',
						callbackParam: param
					});
				}
			}
			else
			{
				app.invoke('util-identity-webauthn-passkey-create-options');
			}
		}
	},
    {
		name: 'util-identity-webauthn-passkey-create-options',
		code: function (param, response)
		{
            if (response == undefined)
            {
				const conversation = app.get(
				{
					scope: 'util-identity-webauthn-passkey-create',
					context: 'conversation'
				});

				let urlData =
				{
					 method: 'webauthn-register-options',
					 data:
					 {	
						userid: app.whoami().thisInstanceOfMe.user.id,
						username: app.whoami().thisInstanceOfMe.user.userlogonname,
						userkey: app.whoami().thisInstanceOfMe.user.guid,
						conversationkey: conversation.guid,
						rpname: _.get(app.whoami(), 'buildingme.about.name'),
						rpid: _.get(window.location, 'hostname')
					}
				}

				if (app.whoami().mySetup.isLab)
				{
					urlData.context = 'webauthn-lab'
				}
				else
				{
					urlData.context = 'webauthn-prod'
				}
				
                var urlID =  _.get(app.whoami().mySetup, 'uris.urls.identityWebAuthNProvider.id')
	
                entityos.cloud.invoke(
                {
                    method: 'core_url_get',
                    data:
                    {
                        urlid: urlID,
                        type: 'POST',
                        data: JSON.stringify(urlData),
                        asis: 'Y'
                    },
                    callback: 'util-identity-webauthn-passkey-create-options',
                    callbackParam: param
                })
            }
            else
            {
				app.set(
				{
					scope: 'util-identity-webauthn-passkey-create',
					context: 'registration-options',
					value: response
				});

                if (_.isPlainObject(response))
                {
					entityos._util.security.trusted.webauthn.passkey.register(
					{
						onComplete: 'util-identity-webauthn-passkey-create-verify'
					},
					response.webauthnoptions)
                }
            }
		}
	},
	{
		name: 'util-identity-webauthn-passkey-create-verify',
		code: function (param, response)
		{
            if (response == undefined)
            {
				const registerOptions = app.get(
				{
					scope: 'util-identity-webauthn-passkey-create',
					context: 'registration-options'
				});

				let urlData =
				{
					 method: 'webauthn-register-verify',
					 data:
					 {	
						webauthncredential: param.credential,
						postkey: registerOptions.postkey
					}
				}

				if (app.whoami().mySetup.isLab)
				{
					urlData.context = 'webauthn-lab'
				}
				else
				{
					urlData.context = 'webauthn-prod'
				}
					
                var urlID =  _.get(app.whoami().mySetup, 'uris.urls.identityWebAuthNProvider.id')
	
                entityos.cloud.invoke(
                {
                    method: 'core_url_get',
                    data:
                    {
                        urlid: urlID,
                        type: 'POST',
                        data: JSON.stringify(urlData),
                        asis: 'Y'
                    },
                    callback: 'util-identity-webauthn-passkey-create-verify',
                    callbackParam: param
                })
            }
            else
            {
				app.invoke('util-view-spinner-remove-all');

				app.set(
				{
					scope: 'util-identity-webauthn-passkey-create',
					context: 'registration-response',
					value: response
				});

				app.invoke('util-local-cache-save',
				{
					persist: true,
					key: 'entityos.webauthn.passkey.credential.id',
					data: _.get(response, 'credential.id')
				});

				app.invoke('util-identity-webauthn-passkey')

				app.notify('Passkey has been set up.');

            	app.invoke('util-on-complete', param)
            }
		}
	},
	{
		name: 'util-identity-webauthn-passkey-auth-options',
		code: function (param, response)
		{
            if (response == undefined)
            {
				const webAuthNCredentialID = app.invoke('util-local-cache-search',
				{
					persist: true,
					key: 'entityos.webauthn.passkey.credential.id'
				});

				if (webAuthNCredentialID == undefined)
				{
					app.notify({type: 'error', message: 'You need to register a PassKey for this device/browser.'})
				}
				else
				{
					let urlData =
					{
						method: 'webauthn-auth-options',
						data:
						{	
							credentialid: webAuthNCredentialID
						}
					}

					const isLab = _.includes(window.location.hostname, '-lab')

					if (isLab)
					{
						urlData.context = 'webauthn-lab'
					}
					else
					{
						urlData.context = 'webauthn-prod'
					}

					/*entityos.cloud.invoke(
					{
						url: 'https://identity.api.entityos.cloud',
						data: Base64.encode(JSON.stringify(urlData)),
						type: 'POST',
						callback: 'util-identity-webauthn-passkey-auth-options',
						callbackParam: param
					});*/

					 fetch("https://identity.api.entityos.cloud/",
					 {
						method: "POST",
						headers: {
						"Content-Type": "text/plain"
						},
						body: JSON.stringify(urlData)
					})
					.then(function(response) {
						if (!response.ok) {
						throw new Error("HTTP status " + response.status);
						}
						return response.text(); // or response.json() if expected
					}).then(function(data)
					{
						console.log(data)

						const _data = JSON.parse(data);

						app.set(
						{
							scope: 'util-identity-webauthn-passkey',
							context: 'auth-options',
							value: _data
						});

						if (_.isPlainObject(_data))
						{
							entityos._util.security.trusted.webauthn.passkey.auth(
							{
								onComplete: 'util-identity-webauthn-passkey-auth-verify'
							},
							_data.webauthnoptions)
						}

						//successCallback(data);
					})
					.catch(function(error) {
						console.log(data)
						//errorCallback(error);
					});

					/*entityos.cloud.invoke(
					{
						method: 'site_url_get',
						data:
						{
							guid: (isLab?'1077d669-4ada-4aae-8a6b-d24cf71aa2a9':'685edec8-6a66-4f96-bdc3-c7076fb8334d'),
							urlid: (isLab?29346:29349),
							type: 'POST',
							data: JSON.stringify(urlData),
							asis: 'Y'
						},
						callback: 'util-identity-webauthn-passkey-auth-options',
						callbackParam: param
					});*/
				}
            }
            else
            {
				app.set(
				{
					scope: 'util-identity-webauthn-passkey',
					context: 'auth-options',
					value: response
				});

                if (_.isPlainObject(response))
                {
					entityos._util.security.trusted.webauthn.passkey.auth(
					{
						onComplete: 'util-identity-webauthn-passkey-auth-verify'
					},
					response.webauthnoptions)
                }
            }
		}
	},
	{
		name: 'util-identity-webauthn-passkey-auth-verify',
		code: function (param, response)
		{
			if (response == undefined)
			{
				const authOptions = app.get(
				{
					scope: 'util-identity-webauthn-passkey',
					context: 'auth-options'
				});

				const authVerifyCredential = _.get(param, 'credential');

				const isLab = _.includes(window.location.hostname, '-lab');

				let urlData =
				{	
					data: {
						webauthncredential: authVerifyCredential,
						accountkey: authOptions.accountkey,
						accountauthkey: authOptions.accountauthkey
					},
					method: 'webauthn-auth-verify',
					context: (isLab?'webauthn-lab':'webauthn-prod'),
				}
				
				entityos.cloud.invoke(
				{
					method: 'logon_trusted',
					data:
					{
						identityprovidertype: 'url',
						data: btoa(JSON.stringify(urlData)),
					},
					callback: 'util-identity-webauthn-passkey-auth-verify',
					callbackParam: param
				})
			}
			else
			{
				if (response.status == 'OK')
				{
					window.location.href='/';
				}
				else
				{
					app.notify({type: 'error', message: 'Not a valid Passkey.</br>Please log in with your username & password, and then reset your Passkey.'})
					app.invoke('util-view-spinner-remove-all');
				}
			}
		}
	}
]);
