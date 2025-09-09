import { EntityOS } from '/site/2007/entityos.module.class-1.0.0.js';
const eos = new EntityOS();

// Based on dsociety.io/util-on-chain-blockchain code example
// Auth using a CIP-30 compliant Cardano Wallet

eos.add(
[
	{
		name: 'util-on-chain-dashboard',
		code: function ()
		{
			eos.invoke('util-on-chain-init-cardano');
		}
	},
	{
		name: 'util-on-chain-init-cardano',
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
						caption: 'Nami',
						lab: true
					},
					{
						name: 'nufi',
						caption: 'NuFi'
					},
					{
						name: 'typhoncip30',
						names: ['typhon', 'typhoncip30'],
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
				scope: 'util-on-chain',
				context: 'cardano',
				value: _cardano
			});

			// [4] Reduce to set of wallets available in the this browser.

			var wallets = eos.set(
			{
				scope: 'util-on-chain',
				context: 'wallets',
				value: _.filter(_cardano.wallets, function (_wallet) { return _wallet.enabled })
			});

			console.log(_cardano);
			console.table(wallets);
			console.log('\n');

			// [5] Show wallets to user or not to install

			if (wallets.length == 0)
			{
				$('#util-on-chain-connect').hide();

				var authOnChainView = eos.view()

				authOnChainView.add(
				[
					'<div class="mt-2">',
					'<div class="fw-bold">There no wallets available, please install a wallet to continue.</div>',
					'<div class="mt-3"><a href="https://cardanowallets.io" target="_blank">Cardano Wallets <i class="fe fe-external-link"><i></a></div>',
					'</div>'
				]);

				authOnChainView.render('#util-on-chain-view');
			}
			else
			{
				var authOnChainView = eos.view();
				var viewType = 'list' // 'dropdown'
				
				if (viewType == 'dropdown')
				{
					_.each(wallets, function (wallet)
					{
						authOnChainView.add(
						[
							'<div class="text-center">',
							'<a href="#" class="entityos-click lead"',
							' data-name="', wallet.name, '"',
							' data-controller="util-on-chain-wallet-connect" data-context="wallet" data-scope="util-on-chain-wallet-connect">',
							wallet.caption,
							'</a>',
							'</div>'
						]);
					});

					$('#util-on-chain-connect').removeClass('disabled').popover(
					{
						content: authOnChainView.get(),
						html: true,
						placement: 'bottom',
						template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><div class="popover-body"></div></div>',
						offset: [0, 10],
						sanitize: false
					}).on('show.bs.popover', function () {
						$('#util-on-chain-view').html('');
					});

					$('#util-on-chain-view').html('<div class="mt-4"><div class="fw-bold text-white">Please connect to a wallet to continue.</div>');
				}

				if (viewType == 'list')
				{
					$('#util-on-chain-connect').hide();

					authOnChainView.add(
					[
						'<div class="d-none fw-bold text-white mb-3">Installed Cardano wallets...</div>'
					]);

					authOnChainView.add('<div class="mt-3">');

					_.each(wallets, function (wallet)
					{
						if (!app.whoami().mySetup.isLab || (app.whoami().mySetup.isLab && wallet.lab))
						{
							wallet._name = wallet.name;
							if (_.isArray(wallet.names))
							{
								wallet._name = _.first(wallet.names)
							}
							
							authOnChainView.add(
							[
								'<div class="card">',
									'<div class="card-body">',
										'<div class="row">',
											'<div class="col-1">',
												'<img class="img-fluid" style="max-width:40px;" src="/site/2182/', wallet._name, '.icon.svg">',
											'</div>',
											'<div class="col-9">',
												'<h2 class="mb-0 mt-1">', wallet.caption, '</h2>',
												'<div id="util-on-chain-wallet-', wallet.name, '-view">',
												'</div>',
											'</div>',
											'<div class="col-2 text-right">',
												'<button type="button" class="btn btn-default btn-outline btn-sm entityos-click"',
													' data-wallet-name="', wallet.name, '"',
													' data-controller="util-on-chain-wallet-show"',
													' id="util-on-chain-wallet-', wallet.name, '"',
													' >',
														'Connect',
												'</button>',
											'</div>',
										'</div>',
									'</div>',
								'</div>'
							]);
						}
					});

					authOnChainView.add('</div>');
					authOnChainView.render('#util-on-chain-view');
				}				
			}
		}
	},
	{
		name: 'util-on-chain-wallet-connect',
		code: function (param)
		{
			console.log('## Store Wallet Name:')

			// [6] Get wallet name based on user selection.

			var walletName = entityos._util.param.get(param.dataContext, 'walletName').value;

			// [7] Set the wallet name in the local browser data, so can be used later.

			eos.set({ scope: 'util-on-chain', context: 'wallet-name', value: walletName });

			console.log(walletName);

			// [8] Show wallet options.

			eos.invoke('util-on-chain-wallet-show', param)
		}
	},
	{
		name: 'util-on-chain-wallet-show',
		code: function (param)
		{
			var walletName = eos.param(param.dataContext, 'walletName').value;
			if (_.isSet(walletName))
			{
				var wallets = eos.get({ scope: 'util-on-chain', context: 'wallets' });
				var _wallet = _.find(wallets, function (wallet) { return wallet.name == walletName })

				var authOnChainWalletView = eos.view();

				authOnChainWalletView.add(
				[
					'<div id="util-on-chain-wallet-info-', walletName, '-view"></div>',

					'<div class="card mt-4 shadow-lg border border-muted">',
						'<div class="card-body p-4">',
							'<h3>',
								'Set ', _wallet.caption, ' as your My On-Chain Profile Primary Wallet.',
							'</h3>',
							'<div class="text-secondary">',
								'This will override any existing setting.',
							'</div>',
							'<button id="util-on-chain-wallet-set-as-primary-', walletName, '"',
								' type="button" class="btn btn-default btn-outline btn-sm entityos-click mt-3"',
								' data-wallet-name="', walletName, '"',
								' data-controller="util-on-chain-wallet-set-as-primary">',
								'Set as Primary Wallet',
							'</button>',
							'<div id="util-on-chain-wallet-set-as-primary-', walletName, '-view"></div>',
						'</div>',
					'</div>',

					'<div class="card mt-4 shadow-lg border border-muted">',
						'<div class="card-body p-4">',
							'<h3>',
								'Use ', _wallet.caption, ' to Logon',
							'</h3>',
							'<div class="text-secondary">',
								'Instead of using your existing seldriven password you can replace it by signing your username using your ', _wallet.caption, ' wallet and thus its password.',
							'</div>',
							'<div class="form-group w-75 my-3">',
								'<label class="text-muted mb-1" for="auth-password-existing">Existing selfdriven Password</label>',
								'<input type="password" class="form-control w-lg m-x-auto input-lg myds-text"',
								' id="util-on-chain-wallet-use-as-password-existing-', walletName, '"',
								' data-scope="util-on-chain-wallet-use-as-password" data-context="existing">',
							'</div>',
							'<button id="util-on-chain-wallet-use-as-password-', walletName, '"',
								' type="button" class="btn btn-default btn-outline btn-sm entityos-click mt-1"',
								' data-wallet-name="', walletName, '"',
								' data-controller="util-on-chain-wallet-use-as-password">',
								'Enable',
							'</button>',
							'<div class="text-danger small mt-3">',
								'<i class="fe fe-alert-triangle"></i> Once enabled, you will no longer be able to use your selfdriven password.',
							'</div>',
							'<div id="util-on-chain-wallet-use-as-password-', walletName, '-view"></div>',
						'</div>',
					'</div>'
				]);

				authOnChainWalletView.render('#util-on-chain-wallet-' + walletName + '-view');

				eos.invoke('util-on-chain-wallet-get-info', param);
			}
		}
	},
	{
		name: 'util-on-chain-wallet-get-info',
		code: function (param)
		{
			var walletName = eos.param(param.dataContext, 'walletName').value;
		
			window.cardano[walletName].enable().then(function (wallet)
			{
				wallet.getRewardAddresses().then(function (addresses)
				{
					var addressAsHex = _.first(addresses);
					//https://cardano.stackexchange.com/questions/7718/cbor-address-to-bech32-type-address-in-js-or-python

					var address = typhonjs.utils.getAddressFromHex(addressAsHex);

					app.set(
					{
						scope: 'util-on-chain',
						context: 'address',
						value: address
					});

					if (!_.isUndefined(addressAsHex))
					{
						var authOnChainWalletInfoView = eos.view();

						authOnChainWalletInfoView.add(
						[
							'<div class="card w-md-50 mt-4 shadow-lg border border-muted">',
								'<div class="card-body p-4">',
									'<h3 class="mb-0">',
										address.addressBech32,
									'</h3>',
								'</div>',
							'</div>'
						]);

						authOnChainWalletInfoView.render('#util-on-chain-wallet-info-' + walletName + '-view');
					}
				});
			});
		}
	},
	{
		name: 'util-on-chain-wallet-use-as-password',
		code: function (param)
		{
			var walletName = eos.param(param.dataContext, 'walletName').value;
			var logonName = app.whoami().thisInstanceOfMe.user.userlogonname;
			var onChainToken;

			/*
			TODO: Mix in in CORE_SECURE_TOKEN
			As per on-agent/device:
			onChainToken = eos.invoke('util-local-cache-search',
			{
				persist: true,
				key: 'entityos.on-chain-token-' + window.btoa(logonName)
			});
			*/

			var userPasswordExisting = eos.get(
			{
				scope: 'util-on-chain-wallet-use-as-password',
				context: 'existing'
			});

			if (_.isNotSet(userPasswordExisting))
			{
				app.notify({type: 'error', message: 'You need to enter your existing selfdriven password.'})
			}
			else
			{
				var dataToSign = logonName;

				if (onChainToken != undefined)
				{
					dataToSign += '|' + onChainToken;
				}

				console.log('Data to Sign: ' + dataToSign);

				// Get a wallet object i.e. with the functions that can use to interact with the wallet

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
								console.log('Signed Data with Associated Key:')
								console.log(signedData);

								if (_.isSet(signedData))
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

									eos.invoke('util-on-chain-wallet-use-as-password-process',
									{
										userPassword: userPassword
									});
								}
							},
							function(error)
							{
								console.log(error);
								app.notify({type: 'error', message: error.info})
							});
						}
					});
				});
			}
		}
	},
	{
		name: 'util-on-chain-wallet-use-as-password-process',
		code: function (param, response)
		{
			if (response == undefined)
			{
				var userPassword = eos.param(param, 'userPassword').value;

				var userPasswordExisting = eos.get(
				{
					scope: 'util-on-chain-wallet-use-as-password',
					context: 'existing'
				});

				entityos.cloud.save(
				{
					object: 'site_user_password',
					data: 
					{
						expiredays: 3650,
						site: entityos._scope.user.site,
						currentpassword: userPasswordExisting,
						newpassword: userPassword
					},
					callback: 'util-on-chain-wallet-use-as-password-process',
					callbackParam: param
				});
			}
			else
			{
				entityos._util.data.clear(
				{
					scope: 'util-on-chain-wallet-use-as-password',
					context: 'existing'
				});
			}
		}
	},
	{
		name: 'util-on-chain-wallet-set-as-primary',
		code: function (param, response)
		{
            if (response == undefined)
            {
                const address = app.get(
				{
					scope: 'util-on-chain',
					context: 'address'
				});

				let data = 
				{
					object: app.whoami().mySetup.objects.user,
					objectcontext: app.whoami().thisInstanceOfMe.user.id,
					type: 1,
					category: 6,
					title: '[onchain-cardano-wallet-primary]',
					key: address.addressBech32,
					notes: address.addressBech32
				}

				entityos.cloud.save(
				{
					object: 'core_protect_key',
					data: data,
					callback: 'util-on-chain-wallet-set-as-primary'
				});
            }
            else
            {
				app.notify('Set as On-Chain Profile Primary Wallet')
            }
		}
	},
	{
		name: 'util-on-chain-wallet-assets',
		code: function (param)
		{
			console.log('## Get & Show Wallet Assets:')

			// [9] Get the stored walletName & set the button name

			var walletName = eos.get({scope: 'util-on-chain', context: 'wallet-name'});

			var wallets = eos.get({ scope: 'util-on-chain', context: 'wallets' });
			var _wallet = _.find(wallets, function (wallet) { return wallet.name == walletName })
			if (_wallet != undefined) {
				$('#util-on-chain-connect').html(_wallet.caption)
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

					learnWalletAssetsView.add('<div id="util-on-chain-wallet-view"></div>');

					learnWalletAssetsView.render('#util-on-chain-view');
				});
			});
		}
	},
	{
		name: 'util-on-chain-wallet-logon',
		code: function (param)
		{
			var logonName = eos.get(
			{
				scope: 'util-on-chain',
				context: 'logonname',
				valueDefault: ''
			});

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

			console.log('Data to Sign: ' + dataToSign);

			var walletName = eos.get({scope: 'util-on-chain', context: 'wallet-name'});

			// Get a wallet object i.e. with the functions that can use to interact with the wallet (see Dev Tools > Console)

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
							console.log('Signed Data with Associated Key:')
							console.log(signedData);
						
							eos.set(
							{
								scope: 'util-on-chain',
								context: 'signed-data',
								value: signedData
							});

							entityos.auth(
							{
								logon: logonName,
								password: signedData,
								callback: 'util-on-chain-wallet-logon-response'
							})

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

							authOnChainView.render('#util-on-chain-message');
						});
					}
				});
			});
		}
	},
    {
		name: 'util-on-chain-wallet-create',
		code: function (param, response)
		{
            if (response == undefined)
            {
                console.log('## Create On-Chain Wallet:');

                var urlID = (app.whoami().mySetup.isLab?29256:29258)

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
                        data: '{' + (app.whoami().mySetup.isLab?'"_context":"lab",':'') + '"method":"generate-wallet","data":{}}',
                        asis: 'Y'
                    },
                    callback: 'util-on-chain-wallet-create',
                    callbackParam: param
                })
            }
            else
            {
                console.log(response);
                var onChainAccounView = app.vq.init({queue: 'util-on-chain-account-create'});

                if (_.isPlainObject(response.data))
                {
                    var account = response.data;

                    onChainAccounView.add(
                    [
                        '<div class="mt-4" style="overflow-wrap: break-word; font-family: monospace;">',
                            account.addresses.base.bech32,
                        '</div>',
						 '<div class="mt-3" style="overflow-wrap: break-word; font-family: monospace;">',
                            account.addresses.stake.bech32,
                        '</div>',
                        '<div class="mt-3">',
                            '<a data-toggle="collapse" role="button" href="#util-on-chain-create-account-mnemonic">',
                               'Show Seed Phrase (Be Careful) <i class="fe fe-chevron-down" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Show Seed Phrase"></i></a>',
                            '<div class="collapse mt-3" id="util-on-chain-create-account-mnemonic" style="overflow-wrap: break-word; font-family: monospace;">',
                                account.mnemonic,
                            '</div>',
                        '</div>'     
                    ]);

                    onChainAccounView.render('#util-on-chain-wallet-view');

					app.invoke('util-view-spinner-remove-all');
                }
            }
		}
	},
	{
		name: 'util-on-chain-account',
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
							value: 6
						},	
						{
							field: 'title',
							comparison: 'TEXT_IS_LIKE',
							value: '[onchain-cardano-account-fully-managed]'
						}
					],
					sorts:
					[
						{
							field: 'modifieddate',
							direction: 'desc'
						}
					],
					callback: 'util-on-chain-account'
				});
			}
			else
			{
				var onChainAccounView = app.vq.init({queue: 'util-on-chain-account'});

				if (response.data.rows.length == 0)
				{
					onChainAccounView.add(
					[
						'<div class="mt-4">',
							'<button type="button" class="btn btn-default btn-sm btn-outline myds-click" data-spinner="prepend" data-controller="util-on-chain-account-create">',
								'Create On-Chain Account',
							'</button>',
						'</div>'
					]);
				}
				else
				{
					var account = _.first(response.data.rows);

					onChainAccounView.add(
                    [
						'<div class="mt-4" style="overflow-wrap: break-word; font-family: monospace;">',
                            account.key,
                        '</div>',
						'<div class="mt-4" style="overflow-wrap: break-word; font-family: monospace;">',
                            account.notes,
                        '</div>'
                    ]);
				}
                
				onChainAccounView.render('#util-on-chain-account-view');
			}
		}
	},
	{
		name: 'util-on-chain-account-create',
		code: function (param, response)
		{
			//Create account with OCTO (api) 
			//	lab: UserKey: 2174af85-2728-4330-94dc-0b8be2b12947

			app.invoke('util-on-chain-account-create-conversation');
		}
	},
	{
		name: 'util-on-chain-account-create-conversation',
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
					callback: 'util-on-chain-account-create-conversation'
				});
			}
			else
			{
				if (response.data.rows.length == 0)
				{
					app.invoke('util-on-chain-account-create-conversation-save');
				}
				else
				{
					app.set(
					{
						scope: 'util-on-chain-account-create',
						context: 'conversation',
						value: _.first(response.data.rows)
					});

					app.invoke('util-on-chain-account-create-conversation-participant');
				}
			}
		}
	},
	{
		name: 'util-on-chain-account-create-conversation-save',
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
					callback: 'util-on-chain-account-create-conversation-save',
					callbackParam: param
				});
			}
			else
			{
				app.set(
				{
					scope: 'util-on-chain-account-create',
					context: 'conversation',
					value: {id: response.id, guid: _.first(response.data.rows).guid}
				});

				app.invoke('util-on-chain-account-create-conversation-participant');
			}
		}
	},
	{
		name: 'util-on-chain-account-create-conversation-participant',
		code: function (param, response)
		{
			if (response == undefined)
			{
				const conversation = app.get(
				{
					scope: 'util-on-chain-account-create',
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
					callback: 'util-on-chain-account-create-conversation-participant'
				});
			}
			else
			{
				if (response.data.rows.length == 0)
				{
					app.invoke('util-on-chain-account-create-conversation-participant-save');
				}
				else
				{
					app.invoke('util-on-chain-account-create-process');
				}
			}
		}
	},
	{
		name: 'util-on-chain-account-create-conversation-participant-save',
		code: function (param, response)
		{
			const conversation = app.get(
			{
				scope: 'util-on-chain-account-create',
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
					callback: 'util-on-chain-account-create-conversation-participant-save',
					callbackParam: param
				});
			}
			else
			{
				app.invoke('util-on-chain-account-create-process');
			}
		}
	},
    {
		name: 'util-on-chain-account-create-process',
		code: function (param, response)
		{
            if (response == undefined)
            {
                console.log('## Create On-Chain Account:');

				const conversation = app.get(
				{
					scope: 'util-on-chain-account-create',
					context: 'conversation'
				});

				let urlData =
				{
					 method: 'generate-account',
					 data:
					 {	
						managed: true,
						userkey: app.whoami().thisInstanceOfMe.user.guid,
						conversationkey: conversation.guid
					}
				}
					
				if (app.whoami().mySetup.isLab)
				{
					urlData._context = 'lab'
				}

				if (_.get(param, 'reset', false))
				{
					urlData.data.reset = true
				}

                var urlID = (app.whoami().mySetup.isLab?29256:29258)

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
                    callback: 'util-on-chain-account-create-process',
                    callbackParam: param
                })
            }
            else
            {
				app.invoke('util-view-spinner-remove-all');

                var onChainAccounView = app.vq.init({queue: 'util-on-chain-account-create'});

                if (_.isPlainObject(response.data))
                {
					const account = app.set(
					{
						scope: 'util-on-chain-account-create',
						context: 'account',
						value: response.data
					});

					app.invoke('util-on-chain-account-create-process-save');

                    onChainAccounView.add(
                    [
						'<div class="mt-4" style="overflow-wrap: break-word; font-family: monospace;">',
                            account.addresses.stake.bech32,
                        '</div>',
                        '<div class="mt-4" style="overflow-wrap: break-word; font-family: monospace;">',
                            account.addresses.base.bech32,
                        '</div>'
                    ]);
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

				onChainAccounView.render('#util-on-chain-account-view');
            }
		}
	},
	{
		name: 'util-on-chain-account-create-process-save',
		code: function (param, response)
		{
            if (response == undefined)
            {
                const account = app.get(
				{
					scope: 'util-on-chain-account-create',
					context: 'account'
				});

				let data = 
				{
					object: app.whoami().mySetup.objects.user,
					objectcontext: app.whoami().thisInstanceOfMe.user.id,
					type: 1,
					category: 6,
					title: '[onchain-cardano-account-fully-managed]' + _.get(account, 'key', ''),
					key:  account.addresses.stake.bech32,
					notes:  account.addresses.base.bech32
				}

				entityos.cloud.save(
				{
					object: 'core_protect_key',
					data: data,
					callback: 'util-on-chain-account-create-process-save'
				});
            }
            else
            {
				app.notify('On-Chain Fully Managed Account Updated')
            }
		}
	},
	{
		name: 'util-on-chain-account-my-profile',
		code: function (param)
		{
			const url = app.whoami().buildingMe.options.startURI + '/#' +
							_.last(_.split(app.whoami().buildingMe.options.startURI, '-')) +
							'-me'

			window.location.href = url;
		}
	},
		{
		name: 'util-on-chain-account-my-on-chain-profile',
		code: function (param)
		{
			const url = app.whoami().buildingMe.options.startURI + '/#' +
							_.last(_.split(app.whoami().buildingMe.options.startURI, '-')) +
							'-me-on-chain-edit'

			window.location.href = url;
		}
	}
]);

$(function ()
{
	//Just a little break to make sure all the wallets have finished initialising.
	setTimeout(authOnChainInit, 2000);
});

function authOnChainInit()
{
	eos.invoke('util-on-chain-dashboard');
}