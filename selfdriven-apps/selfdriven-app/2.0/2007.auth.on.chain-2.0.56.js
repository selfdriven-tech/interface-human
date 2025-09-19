import { EntityOS } from '/site/2007/entityos.module.class-1.0.0.js';
const eos = new EntityOS();

// Based on dsociety.io/learn-blockchain code example
// Auth using a CIP-30 compliant Cardano Wallet

eos.add(
[
	{
		name: 'auth-on-chain',
		code: function ()
		{
			eos.invoke('auth-on-chain-init-cardano');
		}
	},
	{
		name: 'auth-on-chain-init-cardano',
		code: function ()
		{
			// [1] Set up a standard set of wallets that work in the browser
			// https://cardanowallets.io for full list.

			console.log('## Supported Browser Wallets:')

			var cardanoData = window.cardano;
			if (cardanoData == undefined) { cardanoData = {} }

			var _cardano =
			{
				data: cardanoData,
				wallets:
				[
					{
						name: 'eternl',
						names: ['eternl', 'ccvault'],
						caption: 'Eternl'
					},
					{
						name: 'flint',
						caption: 'Flint'
					},
					{
						name: 'gerowallet',
						caption: 'Gero Wallet'
					},
					{
						name: 'nami',
						caption: 'Nami'
					},
					{
						name: 'nufi',
						caption: 'NuFi'
					},
					{
						name: 'typhoncip30',
						names: ['typhoncip30', 'typhon'],
						caption: 'Typhon'
					},
					{
						name: 'yoroi',
						caption: 'Yoroi'
					},
					{
						name: 'lace',
						caption: 'Lace'
					}
				]
			};

			// [2] Check for installed wallets by querying: window.cardano

			_.each(_cardano.wallets, function (_wallet) {
				_wallet.enabled = (_cardano.data[_wallet.name] != undefined)
			});

			// [3] Put in browser data for using later as required.

			eos.set(
			{
				scope: 'learn',
				context: 'cardano',
				value: _cardano
			});

			// [4] Reduce to set of wallets available in the this browser.

			var wallets = eos.set(
			{
				scope: 'learn',
				context: 'wallets',
				value: _.filter(_cardano.wallets, function (_wallet) { return _wallet.enabled })
			});

			console.log(_cardano);
			console.table(wallets);
			console.log('\n');

			// [5] Show wallets to user or not to install

			if (wallets.length == 0)
			{
				var authOnChainView = eos.view()

				authOnChainView.add(
				[
					'<div class="mt-4">',
					'<div class="fw-bold text-white">There no wallets available to connect to, please install a wallet to continue.</div>',
					'<div class="mt-3"><a href="https://cardanowallets.io" target="_blank" class="text-white">Cardano Wallets <i class="fe fe-external-link"></a></div>',
					'</div>'
				]);

				authOnChainView.render('#auth-on-chain-message');
			}
			else
			{
				var authOnChainView = eos.view()

				_.each(wallets, function (wallet)
				{
					authOnChainView.add(
					[
						'<div class="text-center">',
						'<a href="#" class="entityos-click lead"',
						' data-name="', wallet.name, '"',
						' data-controller="auth-on-chain-wallet-connect" data-context="wallet" data-scope="auth-on-chain-wallet-connect">',
						wallet.caption,
						'</a>',
						'</div>'
					]);
				});

				$('#auth-on-chain-logon').removeClass('disabled').popover(
					{
						content: authOnChainView.get(),
						html: true,
						placement: 'bottom',
						template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><div class="popover-body"></div></div>',
						offset: [0, 10],
						sanitize: false
					}).on('show.bs.popover', function () {
						$('#learn-view').html('');
					});

				//$('#auth-on-chain-message').html('<div class="mt-4"><div class="fw-bold text-secondary">Please connect to a wallet to continue.</div>');
			}
		}
	},
	{
		name: 'auth-on-chain-wallet-connect',
		code: function (param)
		{
			eos.invoke('util-view-popover-hide');

			console.log('## Store Wallet Name:')

			// [6] Get wallet name based on user selection.

			var walletName = entityos._util.param.get(param.dataContext, 'name').value;

			// [7] Set the wallet name in the local browser data, so can be used later.

			eos.set({ scope: 'learn', context: 'wallet-name', value: walletName });

			console.log(walletName);

			// [8] Get the wallet assets.

			eos.invoke('auth-on-chain-wallet-logon', param)
		}
	},
	{
		name: 'auth-on-chain-wallet-logon-view-update',
		code:	function (data)
		{
			if (data)
			{
				if (data.from == 'myds-logon-init')
				{
					if (data.status == 'start')
					{	
						$('#app-auth-message').html('');
						$('#myds-logoncode-view').addClass('hidden d-none');
					}

					if (data.status == 'need-code')
					{	
						$('#myds-logoncode-view').removeClass('hidden d-none');
						$('#app-auth-message').html('<div class="mt-3">A code has been sent to you via ' + data.message + '.</div>');
						$('#myds-logoncode').focus();
					}

					if (data.status == 'need-totp-code')
					{	
						var logonTOTPName = 'your TOTP client (eg Google Authenticator)';

						if (_.has(mydigitalstructure.options, 'logonTOTP'))
						{
							if (mydigitalstructure.options.logonTOTP.name != undefined)
							{
								logonTOTPName = mydigitalstructure.options.logonTOTP.name;
							}
						}

						$('#myds-logoncode-view').removeClass('d-none hidden');
						$('#app-auth-message').html('<div class="mt-3">Please enter the code from ' + logonTOTPName + ' and then press Logon again.</div>');
						$('#myds-logoncode').focus();
					}
				}

				if (data.from == 'myds-logon-send')
				{
					if (data.status == 'error')
					{	
						$('#myds-logon-status').html('<div class="mt-3">' + data.message + '</div>');
					}
					else
					{
						$('#myds-logon-status').html('');
					}	
				}

				if (data.from == 'myds-core')
				{
					if (data.status == 'error')
					{	
						if (data.message != 'invalid passwordhash' && data.message != 'INVALID_LOGON')
						{
							entityos._util.controller.invoke('app-notify',
							{
								message: data.message,
								class: 'danger'
							});
						}
					}

					if (data.status == 'notify')
					{	
						entityos._util.controller.invoke('app-notify',
						{
							message: data.message
						});
					}
				}

				if (data.from == 'myds-auth')
				{
					if (data.status == 'error')
					{	
						var options = mydigitalstructure._scope.app.options;
						options.notify = {message: 'You need to log on again.', class: 'danger'};
						mydigitalstructure._util.init(mydigitalstructure._scope.app)
					}
				}

				if (data.from == 'myds-send')
				{
					$('#app-working')[(data.status=='start'?'remove':'add') + 'Class']('hidden d-none');
				}

				if (data.from == 'myds-init')
				{
					if (data.status == 'uri-changed')
					{	
						mydigitalstructure._util.controller.invoke(
						{
							name: 'app-route-to'
						},
						{
							uri: mydigitalstructure._scope.app.uri,
							uriContext: data.message
						});

						window.scrollTo(0, 0);
					}	
				}

				if (data.from == 'myds-logon-send')
				{
					if (data.status == 'error')
					{
						$('#app-auth-message').html('<div class="mt-3">' + data.message + '</div>');
					}

					if (data.status == 'start')
					{
						$('#app-auth-message').html('<span class="spinner mt-3"><i class="icon-spin icon-refresh"></i></span>');
					}
				}

				if (data.from == 'myds-view-access')
				{
					if (data.status == 'context-changed')
					{
						$(data.message.hide.join(',')).addClass('hidden d-none');
						$(data.message.show.join(',')).removeClass('hidden d-none');
					}
				}
			}
		}
	},
	{
		name: 'auth-on-chain-wallet-logon-start',
		code: function (param)
		{
			if (!_.isEmpty(param))
			{
				delete param.logon;
				delete param.password;

				entityos._util.data.set(
				{
					controller: 'app-start',
					context: '_param',
					value: param
				});
			}
			else
			{
				param = entityos._util.data.get(
				{
					controller: 'app-start',
					context: '_param'
				});
			}
			
			if (param.isLoggedOn == false)
			{
				entityos._scope.user = undefined;
				entityos._util.controller.invoke('app-router', param);
			}
			else
			{	
				if (param.passwordstatus == 'EXPIRED' && $('#auth-password').length != 0)
				{
					$('#auth-password').modal('show')
				}
				else
				{
					entityos._util.controller.invoke('auth-on-chain-wallet-logon-set-uri', param);
	
					entityos._util.controller.invoke('app-router', param);

					$('.myds-logon-first-name').html(mydigitalstructure._scope.user.firstname);
					$('.myds-logon-surname').html(mydigitalstructure._scope.user.surname);
					$('.myds-logon-name').html(mydigitalstructure._scope.user.userlogonname);
					$('.myds-logon-space').html(mydigitalstructure._scope.user.contactbusinesstext);

					entityos._util.controller.invoke('app-navigation-side');
				}	
			}	
		}
	},
	{
		name: 'auth-on-chain-wallet-logon-set-uri',
		code: function (param)
		{
			var role = '';

			if (_.has(entityos, '_scope.user.roles.rows'))
			{
				if (entityos._scope.user.roles.rows.length != 0)
				{
					role = _.kebabCase(_.lowerCase(_.first(entityos._scope.user.roles.rows).title));
					entityos._scope.app.options.startURIContext = '#' + role + '-dashboard';
					entityos._scope.app.options.startURI = '/app-' + role;
				}
			};

			entityos._util.data.set(
			{
				controller: 'util-setup',
				context: 'userRole',
				value: role
			});

			if (_.has(entityos._scope.app, 'options.start'))
			{
				var locationHost = window.location.host;
				var start = _.find(entityos._scope.app.options.start, function (_start)
				{
					return _.includes(locationHost, _start.urlContains)
				});

				if (start != undefined)
				{
					entityos._scope.app.options.startURI = start.uri;
					entityos._scope.app.options.startURIContext = start.uriContext;
				}
			}

			if (param != undefined)
			{
				param.uri = entityos._scope.app.options.startURI;
				param.uriContext = entityos._scope.app.options.startURIContext;
			}	
		}
	},
	{
		name: 'auth-on-chain-wallet-logon',
		code: function (param)
		{
			entityos._scope.app.viewUpdate = 'auth-on-chain-wallet-logon-view-update';
			entityos._scope.app.viewStart = 'auth-on-chain-wallet-logon-start';

			entityos._scope.app.options = 
			{
				auth: true,
				httpsOnly: true,
				container: '#main',
				assistWithBehavior: false,
				objects: false,
				registerDocument: undefined,
				authURIIsHome: true,
				authURI: '/auth',
				authURIContext: '#auth',
				spinner: '/site/1901/1901.working.gif',
				working: '<div class="m-a-md text-center"><img src="/site/1901/1901.working.gif" style="height:25px;"></div>',
				rows: 50,
				namespace: 'app',
				styles:
				{
					button: 'btn btn-primary btn-outline btn-sm',
					toast:
					{
						class: 'info',
						showDismiss: true,
						time: 3000,
						annimation: true
					},
					datePicker:
					{
						icons:
						{
							time: 'far fa-clock',
							date: 'far fa-calendar-alt',
							up: 'far fa-arrow-up',
							down: 'far fa-arrow-down',
							previous: 'fas fa-chevron-left',
							next: 'fas fa-chevron-right',
							today: 'far fa-calendar-check-o',
							clear: 'far fa-trash',
							close: 'far fa-times'
						},
						options:
						{
							debug: false
						}
					}
				},
				startURI: '/app-{{role}}',
				startURIContext: '#{{role}}-dashboard',
				start:
				[
					{
						default: true,
						uri: '/app-{{role}}',
						uriContext: '#{{role}}-dashboard'
					},
					{
						urlContains: 'levelup',
						uri: '/app-level-up',
						uriContext: '#level-up-dashboard',
					},
					{
						urlContains: 'org',
						uri: '/app-org',
						uriContext: '#org-dashboard',
					},
					{
						urlContains: 'studio',
						uri: '/app-studio',
						uriContext: '#studio-dashboard',
					},
					{
						urlContains: 'nextsteps',
						uri: '/app-next-steps',
						uriContext: '#next-steps-dashboard',
					},
					{
						urlContains: 'projects',
						uri: '/app-projects',
						uriContext: '#projects-dashboard',
					},
					{
						urlContains: 'supporter',
						uri: '/app-supporter',
						uriContext: '#supporter-dashboard',
					},
					{
						urlContains: 'you',
						uri: '/app-you',
						uriContext: '#you-dashboard',
					}
				],
				password:
				{
					minimumLength: 6
				},
				routing:
				{
					toURI:
					[
						{
							uri: '/app',
							uriContext:
							[
								'#dashboard'
							],
							onlyApplyIfURIDataContextSet: false,
							applyEvenIfReload: true
						}
					],

					toStart:
					[
						{
							uri: '*',
							uriContext:
							[
								'*'
							]
						}
					]	
				}
			}

			var logonName = eos.get(
			{
				scope: 'auth-on-chain',
				context: 'logonname',
				valueDefault: ''
			});

			var userPassword = eos.get(
			{
				scope: 'auth-on-chain',
				context: 'userpassword'
			});

			var code = $('#myds-logoncode').val();

			if (userPassword == undefined)
			{
				var onChainToken = eos.invoke('util-local-cache-search',
				{
					persist: true,
					key: 'entityos.on-chain-token-' + window.btoa(logonName)
				});

				var dataToSign = logonName;

				if (onChainToken != undefined)
				{
					dataToSign += '|' + onChainToken;
				}

				var walletName = eos.get({scope: 'learn', context: 'wallet-name'});

				window.cardano[walletName].enable().then(function (wallet)
				{
					wallet.getRewardAddresses().then(function (addresses)
					{
						console.log(addresses);
						var signingAddress = _.first(addresses);

						if (!_.isUndefined(signingAddress))
						{
							console.log(signingAddress);

							var dataToSignAsHex = entityos._util.hex.to(dataToSign);

							console.log('Data To Sign (Hex): ' + dataToSignAsHex);

							wallet.signData(signingAddress, dataToSignAsHex)
							.then(function (signedData)
							{						
								var userPassword = _.truncate(signedData.signature,
								{ 
									'length': 25,
									'omission': ''
								});

								userPassword += _.truncate(signedData.key,
								{ 
									'length': 25,
									'omission': ''
								});

								var userPassword = eos.set(
								{
									scope: 'auth-on-chain',
									context: 'userpassword',
									value: userPassword
								});

								entityos.auth(
								{
									logon: logonName,
									password: userPassword,
									code: code,
									callback: 'auth-on-chain-wallet-logon-response'
								});

								//Next verion is to do full trusted logon (LOGON_TRUSTED) with verification with out pre-established trust.
							},
							function(error)
							{
								console.log(error);
								var authOnChainView = eos.view();

								authOnChainView.add(
								[
									'<div class="pt-4 text-white fw-bold">', error.info, '</div>'
								])

								authOnChainView.render('#auth-on-chain-message');
							});
						}
					});
				});
			}
			else
			{
				entityos.auth(
				{
					logon: logonName,
					password: userPassword,
					code: code,
					callback: 'auth-on-chain-wallet-logon-response'
				});
			}
		}
	},
	{
		name: 'auth-on-chain-wallet-logon-response',
		code: function (param)
		{
			console.log('Logon response:')
			console.log(param)

			if (param.status == 'ER')
			{
				var authOnChainView = eos.view();
				authOnChainView.add(
				[
					'<div class="pt-4 text-white fw-bold">Logon name or sign data is incorrect.</div>'
				]);

				authOnChainView.render('#auth-on-chain-message');
			}
			else
			{

			}
		}
	},
	{
		name: 'auth-on-chain-wallet-assets',
		code: function (param)
		{
			console.log('## Get & Show Wallet Assets:')

			// [9] Get the stored walletName & set the button name

			var walletName = eos.get({ scope: 'learn', context: 'wallet-name' });

			var wallets = eos.get({ scope: 'learn', context: 'wallets' });

			var _wallet = _.find(wallets, function (wallet) { return wallet.name == walletName })
			if (_wallet != undefined) {
				$('#learn-connect').html(_wallet.caption)
			}

			// [10] Get a wallet object i.e. with the functions that can use to interact with the wallet (see Dev Tools > Console)

			window.cardano[walletName].enable().then(function (wallet)
			{
				console.log(wallet);

				// [11] Run the getBalance function
				// It returns data in the Concise Binary Object Representation "CBOR" Hex format.
				// So if you look at it, it want make sense, which is why use entityos._util.hex.CBORtoArray to convert it!

				wallet.getBalance().then(function (dataAsCBORHex) {
					console.log('CBOR(Hex): ' + dataAsCBORHex)

					var data = entityos._util.hex.CBORtoArray(dataAsCBORHex);

					// [12] The base Cardano currency is a "lovelace". 1,000,000 lovelace = 1 ADA.
					// Named after Ada Lovelace the first programmer (female)

					// The lovelace (i.e. ADA) is stored in the first array position (index 0)
					// !! NOTE: If no other assets then it is not in an array it is the data value !!

					var lovelace;

					if (_.isArray(data)) {
						lovelace = _.first(data)
					}
					else {
						lovelace = data;
					}

					console.log('- which decodes to:');
					console.log(parseInt(lovelace) + ' Lovelace / ' + parseInt(lovelace) / 1000000 + ' ADA\n\n');

					// The other assets e.g. NFTs, Native-Tokens are stored in the 2nd array position (index 1)

					console.log('Other Digital Assets In The Wallet:');
					var otherAssets = data[1];
					console.log(otherAssets);

					var _otherAssets = {};

					// [13] Go through each of the other assets and decode their names using entityos._util.convert.charCodesToText function

					if (otherAssets != undefined) {
						_.each(otherAssets, function (otherAssetValue, otherAssetKey) {
							_.each(otherAssetValue, function (_otherAssetValue, _otherAssetKey) {
								_otherAssets[entityos._util.convert.charCodesToText(_otherAssetKey)] = _otherAssetValue;
							});
						});

						console.log('- which decodes to:');
						console.log(_otherAssets);
					}

					var learnWalletAssetsView = eos.view();

					learnWalletAssetsView.add(
						[
							'<div style="background-color:rgba(0,0,0,0.7); border-radius: 6px; padding:16px;" class="w-md-50 mt-6">',
							'<div style="font-family: PT Mono, monospace; font-size: 1.65rem; color:#ff943d;" class="fw-bold mb-1">',
							(parseInt(lovelace) / 1000000), ' ADA',
							'</div>'
						]);

					var _otherAssetsOrdered = {};
					_(_otherAssets).keys().sort().each(function (key) {
						_otherAssetsOrdered[key] = _otherAssets[key];
					});

					_.each(_otherAssetsOrdered, function (_otherAssetValue, _otherAssetKey) {
						learnWalletAssetsView.add(
							[
								'<div style="font-family: PT Mono, monospace; font-size: 1rem; color:#baadab;" class="">',
								_otherAssetKey, ' | ', _otherAssetValue,
								'</div>'
							]);
					});

					learnWalletAssetsView.add('</div>');

					learnWalletAssetsView.add('<div id="learn-wallet-view"></div>');

					learnWalletAssetsView.render('#learn-view');
				});
			});
		}
	}
]);

$(function ()
{
	entityos._util.factory.core();
	entityos._util.factory.local();

	//Just a little break to make sure all the wallets have finished initialising.
	setTimeout(authOnChainInit, 2000);
});

function authOnChainInit()
{
	eos.invoke('auth-on-chain');
}