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

entityos.cloud.save(
{
	object: 'core_url',
	data:
	{
		title: 'On-Chain API (octo-api@slfdrvn.io)',
		group: 526,
		internalreference: 'on-chain-api-octo',
		type: 4,
		url: 'https://webauthn.api.entityos.cloud',
		urllogon: '2174af85-2728-4330-94dc-0b8be2b12947',
		urlpassword: 'kFbqCip4DAioI28wx5Sobef6qtldbO0r6MV2SCWJ5sywKkuH',
		public: 'Y'
	}
});

app.invoke('util-cloud-search-show',
{
	object: 'core_url',
	fields: ['title'], filters: {group: 525},
	rows: 10
});


*/

app.add(
[
	{
		name: 'util-webauthn-passkeys',
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
							value: '[webauthn-passkey]'
						}
					],
					sorts:
					[
						{
							field: 'modifieddate',
							direction: 'desc'
						}
					],
					callback: 'util-webauthn-passkeys'
				});
			}
			else
			{
				var webauthnPasskeysView = app.vq.init({queue: 'util-webauthn-passkeys'});

				if (response.data.rows.length == 0)
				{
					identityAccountView.add(
					[
						'<div class="mt-4">',
							'<button type="button" class="btn btn-default btn-sm myds-click" data-spinner="prepend" data-controller="util-webauthn-create-passkey">',
								'Create Passkey',
							'</button>',
						'</div>'
					]);
				}
				else
				{
					// Could be many with 'notes' on different devices

					var passkey = app.set(
					{
						scope: 'util-webauthn',
						context: '_passkey',
						value: _.first(response.data.rows)
					});

					webauthnPasskeysView.add(
                    [
						'<div class="row mt-0">',
							'<div class="col-12">',
								'<div class="mt-4 text-dark lead px-6 alert alert-info mb-3" style="overflow-wrap: break-word;">',
									passkey.key,
								'</div>',
							'</div>',
						'</div>'
					]);	
				}
                
				const selector = _.get(param, 'viewContainerSelector', '#util-webauthn-passkey-view');
				webauthnPasskeysView.render(selector);
			}
		}
	},
	{
		name: 'util-webauthn-create-passkey',
		code: function (param, response)
		{
			app.invoke('util-webauthn-create-passkey-process');
		}
	},
    {
		name: 'util-webauthn-create-passkey-process',
		code: function (param, response)
		{
            if (response == undefined)
            {
                console.log('## Create Passkey');

				let urlData =
				{
					 method: 'webauthn-register-options',
					 _context: 'webauthn',
					 data:
					 {	
						userid: app.whoami().thisInstanceOfMe.user.userlogonname,
						username: app.whoami().thisInstanceOfMe.user.userlogonname

					}
				}
					
                var urlID = app.whoami().mySetup.webauthnURLID;
				// Set up section at the top of this file.

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
                    callback: 'util-webauthn-create-passkey-process',
                    callbackParam: param
                })
            }
            else
            {
				app.invoke('util-view-spinner-remove-all');

                if (_.isPlainObject(response.data))
                {
					const passkey = app.set(
					{
						scope: 'util-webauthn-create',
						context: 'passkey',
						value: response.data
					});

					entityos._util.security.trusted.webauthn.passkey.register(
					{
						onComplete: 'util-webauthn-account-create-process-save'
					},
					response.data)

					app.invoke('util-webauthn-account-create-process-save');
                }
				
				if (!_.isUndefined(response.warning))
				{
					var webauthnPasskeyView = app.vq.init({queue: 'util-webauthn-passkey-create'});

					webauthnPasskeyView.add(
                    [
					 	'<div class="mt-4 text-warning">',
                            response.error,
                        '</div>'
					]);

					webauthnPasskeyView.render('#util-webauthn-account-view');
				}	
            }
		}
	},
	{
		name: 'util-webauthn-account-create-process-save',
		code: function (param, response)
		{
            if (response == undefined)
            {
                const account = app.get(
				{
					scope: 'util-webauthn-account-create',
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
					callback: 'util-webauthn-account-create-process-save'
				});
            }
            else
            {
				app.invoke('util-webauthn-account');
            }
		}
	},
	{
		name: 'util-webauthn-account-my-profile',
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
		name: 'util-webauthn-account-my-on-chain-profile',
		code: function (param)
		{
			const url = app.whoami().buildingMe.options.startURI + '/#' +
							_.last(_.split(app.whoami().buildingMe.options.startURI, '-')) +
							'-me-on-chain-edit'

			window.location.href = url;
		}
	}
	
]);
