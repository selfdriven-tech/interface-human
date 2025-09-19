import { EntityOS } from '/site/2186/entityos.module.class-1.0.0.js';
const eos = new EntityOS();

/*
	https://selfdriven.tech
	Powered by:
	- entityos.cloud
	- cardano.org

	Using example Cardano CIP30 Wallet code from:
	- https://dsociety.io/on-chain-blockchain
*/

eos.add(
[
	{
		name: 'on-chain-init',
		code: function ()
		{
			console.log('selfdrivenOS ');
			console.log('https://selfdriven.tech');

			eos.invoke('on-chain-init-cardano');
		}
	},
	{
		name: 'on-chain-init-cardano',
		code: function ()
		{
			// [1] Set up a standard set of wallets that work in the browser
			// https://cardanowallets.io for full list.

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

			_.each(_cardano.wallets, function (_wallet)
			{
				_wallet.enabled = (_cardano.data[_wallet.name] != undefined)
			});

			// [3] Put in browser data for using later as required.

			eos.set(
			{
				scope: 'on-chain',
				context: 'cardano',
				value: _cardano
			});

			// [4] Reduce to set of wallets available in the this browser.

			var wallets = eos.set(
			{
				scope: 'on-chain',
				context: 'wallets',
				value: _.filter(_cardano.wallets, function (_wallet) { return _wallet.enabled })
			});

			// [5] Show wallets to user or not to install

			if (wallets.length == 0)
			{
				var aiView = eos.view()

				aiView.add(
					[
						'<div class="mt-4">',
						'<div class="font-weight-bold text-secondary lead">There no wallets available to connect to.</div>',
						'<div class="font-weight-bold text-secondary lead">Please install a wallet to continue.</div>',
						'<div class="mt-2"><a href="https://cardanowallets.io" target="_blank" class="text-secondary font-weight-bold lead">Cardano Wallets <i class="fas fa-external-link-alt text-secondary"></i></a></div>',
						'</div>'
					]);

				aiView.render('#on-chain-view');
			}
			else
			{
				var aiConnectWalletsView = eos.view()
				var hash = (window.location.hash==''?'#':window.location.hash);

				_.each(wallets, function (wallet)
				{
					aiConnectWalletsView.add(
					[
						'<a href="', hash, '" class="dropdown-item entityos-click py-2"',
						' data-name="', wallet.name, '"',
						' data-controller="on-chain-wallet-connect" data-context="wallet" data-scope="on-chain-wallet-connect">',
						wallet.caption,
						'</a>'
					]);
				});

				aiConnectWalletsView.add(
					[
						'<a id="on-chain-wallet-disconnect-view" href="#" class="dropdown-item entityos-click border-top py-2 d-none"',
						' data-controller="on-chain-wallet-disconnect">',
							'Disconnect',
						'</a>'
					]);

				aiConnectWalletsView.render('#on-chain-connect-view');

				$('#on-chain-connect').removeClass('disabled');

				$('#on-chain-view').html('<div class="mt-4"><div class="font-weight-bold text-secondary lead">Please connect your Cardano wallet to continue.</div><div class="mt-2 text-secondary">Thank you.</a>');
			}
		}
	},
	{
		name: 'on-chain-wallet-connect',
		code: function (param)
		{
			//eos.invoke('util-view-popover-hide');

			$('#on-chain-wallet-disconnect-view').removeClass('d-none');

			$('#on-chain-view').html('<div class="mt-4 text-secondary">Connecting...</div>');

			// [6] Get wallet name based on user selection.

			var walletName = entityos._util.param.get(param.dataContext, 'name').value;

			// [7] Set the wallet name in the local browser data, so can be used later.

			eos.set({ scope: 'on-chain', context: 'wallet-name', value: walletName });

			// [8] Get the wallet assets.

			eos.invoke('on-chain-wallet-assets', param)
		}
	},
    {
		name: 'on-chain-wallet-disconnect',
		code: function (param)
		{
            location.reload()
        }
    },
	{
		name: 'on-chain-wallet-assets',
		code: function (param)
		{
			// [9] Get the stored walletName & set the button name

			var walletName = eos.get({ scope: 'on-chain', context: 'wallet-name' });

			var wallets = eos.get({ scope: 'on-chain', context: 'wallets' });

			var _wallet = _.find(wallets, function (wallet) { return wallet.name == walletName })
			if (_wallet != undefined)
			{
				$('#on-chain-connect').html(_wallet.caption)
			}

			eos.set(
			{
				scope: 'on-chain',
				context: '_wallet',
				value: _wallet
			});

			// [10] Get a wallet object i.e. with the functions that can use to interact with the wallet (see Dev Tools > Console)

			window.cardano[walletName].enable().then(function (wallet)
			{
				// [11] Run the getBalance function
				// It returns data in the Concise Binary Object Representation "CBOR" Hex format.
				// So if you look at it, it want make sense, which is why use entityos._util.hex.CBORtoArray to convert it!

				wallet.getBalance().then(function (dataAsCBORHex)
				{
					var data = entityos._util.hex.CBORtoArray(dataAsCBORHex);

					// [12] The base Cardano currency is a "lovelace". 1,000,000 lovelace = 1 ADA.
					// Named after Ada Lovelace the first programmer (female)

					// The lovelace (i.e. ADA) is stored in the first array position (index 0)
					// !! NOTE: If no other assets then it is not in an array it is the data value !!

					var lovelace;

					if (_.isArray(data))
					{
						lovelace = _.first(data)
					}
					else
					{
						lovelace = data;
					}

					_wallet.assets =
					[
						{
							name: 'lovelace',
							amount: lovelace
						},
						{
							name: 'ada',
							amount: (parseInt(lovelace) / 1000000)
						}
					]

					// The other assets e.g. NFTs, Native-Tokens are stored in the 2nd array position (index 1)

					var otherAssets = data[1];

					var _otherAssets = {};

					// [13] Go through each of the other assets and decode their names using entityos._util.convert.charCodesToText function

					if (otherAssets != undefined)
					{
						_.each(otherAssets, function (otherAssetValue, otherAssetKey)
						{
							_.each(otherAssetValue, function (_otherAssetValue, _otherAssetKey) {
								_otherAssets[entityos._util.convert.charCodesToText(_otherAssetKey)] = _otherAssetValue;
							});
						});
					}

					_.each(_otherAssets, function (value, key)
					{
						_wallet.assets.push(
						{
							name: key,
							amount: value
						});
					});

					eos.invoke('on-chain-wallet-transactions', param);
				});
			});
		}
	},
	{
		name: 'on-chain-wallet-transactions',
		code: function (param)
		{
			var _wallet = eos.get({scope: 'on-chain', context: '_wallet'});
         	var walletName = eos.get({ scope: 'on-chain', context: 'wallet-name' });
			
            window.cardano[walletName].enable().then(function (wallet)
            {
				var uxtos = [];
				_wallet._assets = [];

				_wallet.canSignData = _.isFunction(wallet.signData)
				
                wallet.getUtxos().then(function(dataAsCBORHex)
                {
					var _dataAsCBORHex = _.split(dataAsCBORHex, ',')

					_.each(_dataAsCBORHex, function (__dataAsCBORHex)
					{
						var _uxto = {};

                        if (__dataAsCBORHex != '')
                        {
                            var _data = _.split(__dataAsCBORHex, '8258390');

                            var txID = _.replace(_.first(_data), '82825820', '')
                            _uxto['id'] = _.join(_.slice(txID, 0, -2), '');

                            _uxto['index'] = parseInt(_.join(_.slice(txID,-2), ''));

                            var data = entityos._util.hex.CBORtoArray(__dataAsCBORHex);
                            var dataTransaction = data[1][1];

                            if (!_.isArray(dataTransaction))
                            {
                                _uxto['assets'] = {cardano: {lovelace: dataTransaction}};
                                _uxto['_assets'] = {name: 'lovelace', amount: numeral(dataTransaction).value(), tx: txID};
                            }
                            else
                            {
                                _uxto['_assets'] =
                                [
                                    {
                                        name: 'lovelace',
                                        amount: numeral(dataTransaction[0]).value(),
                                        tx: txID
                                    }
                                ];

                                _uxto['assets'] =
                                {
                                    cardano: {lovelace: dataTransaction[0]}
                                };

                                _.each(dataTransaction[1], function  (_transactionValue, _transactionKey)
                                {
                                    var _asset = {};
                                    const charCodes = _.split(_transactionKey, ',');
                                    const uint8Array = new Uint8Array(charCodes);

                                    // Convert Uint8Array to hex string
                                    let hexString = '';
                                    uint8Array.forEach((byte) => {
                                        hexString += byte.toString(16).padStart(2, '0');
                                    });

                                    dataTransaction[1][hexString] = _transactionValue;

                                    _uxto['assets'][hexString] = {};
                                    _asset['policy'] = hexString;

                                    _.each(dataTransaction[1][_transactionKey], function (_transactionValueValue, _transactionValueKey)
                                    {
                                        dataTransaction[1][_transactionKey][entityos._util.convert.charCodesToText(_transactionValueKey)] = _transactionValueValue;

                                        _uxto['assets'][hexString][entityos._util.convert.charCodesToText(_transactionValueKey)] = _transactionValueValue;

                                        _asset['name'] = entityos._util.convert.charCodesToText(_transactionValueKey);
                                        _asset['amount'] = numeral(_transactionValueValue).value();
                                        _asset['tx'] = txID;

										 _uxto['_assets'].push(_.clone(_asset));
                                    });
                                });
                            }

                            uxtos.push(_uxto);

                            _wallet._assets = _.concat(_wallet._assets, _uxto._assets);
                        }
					})
                   
					_wallet.uxtos = uxtos;

					var assets = [];
					const showAll = true;

					_.each(_wallet._assets, function (_walletAsset)
					{
						if (showAll)
						{
							assets.push(_walletAsset)
						}
						else
						{
							var _asset = _.find(assets, function (asset)
							{
								return (asset.name == _walletAsset.name &&
											asset.policy == _walletAsset.policy)
							});

							if (_asset == undefined)
							{
								assets.push(_walletAsset)
							}
							else
							{
								_asset.amount += _walletAsset.amount;
							}
						}
					});

					eos.set(
					{
						scope: 'on-chain',
						context: 'assets',
						value: assets
					});

					eos.invoke('on-chain-wallet-network', param);
                });
            });
        }
	},
	{
		name: 'on-chain-wallet-network',
		code: function (param)
		{
			var _wallet = eos.get({scope: 'on-chain', context: '_wallet'});
        	var walletName = eos.get({ scope: 'on-chain', context: 'wallet-name' });

            window.cardano[walletName].enable().then(function (wallet)
            {
				wallet.getNetworkId().then(function(data)
				{
					_wallet.networkID = data

					eos.invoke('on-chain-wallet-used-addresses', param);
				});
			});
		}
	},
	{
		name: 'on-chain-wallet-used-addresses',
		code: function (param)
		{
         	var _wallet = eos.get({scope: 'on-chain', context: '_wallet'});
         	var walletName = eos.get({ scope: 'on-chain', context: 'wallet-name' });

            window.cardano[walletName].enable().then(function (wallet)
            {
				wallet.getUsedAddresses().then(function(addressesData)
				{
					var _usedAddresses = [];

					_.each(addressesData, function (addressData)
					{
						var _usedAddress = typhonjs.utils.getAddressFromHex(addressData);

						var _usedAddressData = 
						{
							_data: _usedAddress
						}
						
						_usedAddressData.address = _usedAddressData._data.addressBech32;
						_usedAddresses.push(_usedAddressData);
					});

					_wallet.addresses = {used: _usedAddresses}

					eos.invoke('on-chain-wallet-reward-addresses', param)
				});
			});
		}
	},
	{
		name: 'on-chain-wallet-reward-addresses',
		code: function (param)
		{
         	var _wallet = eos.get({scope: 'on-chain', context: '_wallet'});
         	var walletName = eos.get({ scope: 'on-chain', context: 'wallet-name' });

            window.cardano[walletName].enable().then(function (wallet)
            {
				wallet.getRewardAddresses().then(function(addressesData)
				{
					var _rewardAddresses = [];

					_.each(addressesData, function (addressData)
					{
						var _address = typhonjs.utils.getAddressFromHex(addressData);

						var _rewardAddressData = 
						{
							_data: _address
						}
						
						_rewardAddressData.address = _rewardAddressData._data.addressBech32;
						_rewardAddresses.push(_rewardAddressData);
					});

					_wallet.addresses = _.assign(_wallet.addresses, {reward: _rewardAddresses})

					eos.invoke('on-chain-wallet-change-address', param)
				});
			});
		}
	},
		{
		name: 'on-chain-wallet-change-address',
		code: function (param)
		{
         	var _wallet = eos.get({scope: 'on-chain', context: '_wallet'});
         	var walletName = eos.get({ scope: 'on-chain', context: 'wallet-name' });

            window.cardano[walletName].enable().then(function (wallet)
            {
				wallet.getChangeAddress().then(function(addressData)
				{
					var _address = typhonjs.utils.getAddressFromHex(addressData);

					var _changeAddressData = 
					{
						_data: _address
					}
					
					_changeAddressData.address = _changeAddressData._data.addressBech32;
				
					_wallet.addresses = _.assign(_wallet.addresses, {change: _changeAddressData})

					eos.invoke('on-chain-wallet-show', param)
				});
			});
		}
	},
	{
		name: 'on-chain-wallet-show',
		code: function (param)
		{
			var _wallet = eos.get({scope: 'on-chain', context: '_wallet'});
			var data = eos.get({scope: 'on-chain'});

			var onChainAuth = eos.get(
			{
				scope: 'on-chain-wallet-auth-using-policy',
				context: 'auth'
			});

			var onChainWalletAssetsView = eos.view();

			var lovelace = _.find(data.assets, function (asset)
			{
				return asset.name == 'lovelace'
			});

			if (onChainAuth.showWalletInfo)
			{
				if (_.has(data, '_wallet.addresses.reward'))
				{
					// Also referred to as Account Address
					_wallet.stakeAddress = _.first(data._wallet.addresses.reward).address;

					onChainWalletAssetsView.add(
					[
						'<div style="word-break: break-all;" class="mb-1 text-secondary font-weight-bold">',
							_wallet.stakeAddress,
						'</div>'
					]);
				}

				if (_.has(data, '_wallet.addresses.change'))
				{
					// Also referred to as Account Address
					_wallet.changeAddress = data._wallet.addresses.change.address;

					onChainWalletAssetsView.add(
					[
						'<div style="word-break: break-all;" class="mb-1 text-secondary small">',
							'<a class="text-secondary" href="https://cardanoscan.io/address/',
									_wallet.changeAddress, '" target="_blank">', _wallet.changeAddress, '</a>',
						'</div>'
					]);
				}

				if (onChainAuth.showWalletInfoADA)
				{
					onChainWalletAssetsView.add(
					[
						'<div class="font-weight-bold mb-1 mt-1">',
							(parseInt(lovelace.amount) / 1000000), ' ADA',
						'</div>'
					]);
				}
			}

			var _otherAssets = _.filter(data.assets, function (asset)
			{
				return asset.name != 'lovelace'
			});

			var _otherAssetsOrdered = _.sortBy(_otherAssets, 'policy');

			/*
				e.g.
				{
					scope: 'on-chain-wallet-auth-using-policy',
					context: 'auth',
					value: 
					{
						_policy: '09b1ae51b984fc1aa405d753a98a239ec4fcd2c199f0ea532e9139df',
						policy: 'f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a',
						apikey: 'a3847801-1811-4667-8253-fdecaab8cac1',
						site: 'a210dba4-cd65-4a4f-a9e2-8432b2c01256'
					}
				});
			*/

			onChainAuth.assetBasedOnPolicyIDFound = false;

			if (!_wallet.canSignData)
			{
				onChainWalletAssetsView.add(
				[
					'<div class="mt-3 pb-1">',
						'<h4 class="">',
							'<span class="font-weight-bold">', _otherAsset.name, '</span> <span class="d-none text-muted"> | ', _otherAsset.amount, '</span>',
						'</h4>',
						'<div class="text-muted small">',
							'Policy # <a class="text-muted" href="https://cardanoscan.io/tokenPolicy/',
								_otherAsset.policy, '" target="_blank">', _otherAsset.policy, '</a>',
						'</div>',
						'<div class="mt-3" id="on-chain-wallet-auth-view">',
							'<div class="text-secondary">',
								'<div><i class="fa lead fa-info-circle"></i></div><div class="mt-2 font-weight-bold">Currently you can not use a Hardware Wallet to sign data on Cardano.</div><div class="mt-1">Hardware Wallet support is being worked on by the Cardano ai, and when available they will work automatically with this site.</div>',
							'</div>',
						'</div>',
					'</div>'
				]);
			}
			else
			{
				if (data.signup)
				{
					//Event (based on GUID)
					//Names
					//Email

					onChainWalletAssetsView.add(
					[
						'<div class="mt-3 pb-1">',
							'<form role="form" class="mx-auto text-center">',
								'<div class="form-group form-floating">',
									'<input type="text" class="form-control entityos-text text-center input-rounded" data-scope="explorer-templates" data-context="search-text" id="explorer-templates-search-text" placeholder="First Name">',
								'</div>',
								'<div class="form-group form-floating">',
									'<input type="text" class="form-control entityos-text text-center input-rounded" data-scope="explorer-templates" data-context="search-text" id="explorer-templates-search-text" placeholder="Last Name">',
								'</div>',
								'<div class="form-group form-floating">',
									'<input type="text" class="form-control entityos-text text-center input-rounded" data-scope="explorer-templates" data-context="search-text" id="explorer-templates-search-text" placeholder="Email">',
								'</div>',
							'</form>',
						'</div>'
					]);

					onChainWalletAssetsView.add(
					[
						'<div class="mt-3 pb-1">',
							'<div class="mt-3" id="on-chain-wallet-auth-view">',
								' <button type="button"',
										' id="on-chain-wallet-auth-using-policy"',
										' class="btn btn-outline-primary btn-sm rounded-pill entityos-click"',
										' data-controller="on-chain-wallet-sign-up"',
										' data-policy="', onChainAuth.policy, '"',
									'>',
									'Sign Up',
								'</button>',
							'</div>',
						'</div>'
					]);
				}
				else
				{
					_.each(_otherAssetsOrdered, function (_otherAsset)
					{
						if (_otherAsset.policy == onChainAuth.policy)
						{
							onChainAuth.assetBasedOnPolicyIDFound = true;
			
							if (onChainAuth.showAsset)
							{
								_onChainWalletAssetsViewsView.add(
								[
									'<div>',
										'<h4 class="my-2">',
											'<span class="font-weight-bold">', _otherAsset.name, '</span> <span class="d-none text-muted"> | ', _otherAsset.amount, '</span>',
										'</h4>',
									'</div>'
								]);
							}
						}
					});

					if (onChainAuth.assetBasedOnPolicyIDFound)
					{
						if (onChainAuth.showSignIn)
						{
							onChainWalletAssetsViewsView.add(
							[
								'<div class="mt-3 pb-1">',
									_onChainWalletAssetsViewsView.get(),
									'<div class="text-muted small">',
										'Policy # <a class="text-muted" href="https://cardanoscan.io/tokenPolicy/',
											onChainAuth.policy, '" target="_blank">', onChainAuth.policy, '</a>',
									'</div>',
									'<div class="mt-3" id="on-chain-wallet-auth-view">',
										' <button type="button"',
												' id="on-chain-wallet-auth-using-policy"',
												' class="btn btn-outline-primary btn-sm rounded-pill entityos-click"',
												' data-controller="on-chain-wallet-auth-using-policy"',
												' data-policy="', onChainAuth.policy, '"',
											'>',
											'Sign In',
										'</button>',
									'</div>',
								'</div>'
							]);
						}
					}
					else
					{
						if (onChainAuth.showNoAsset)
						{
							onChainWalletAssetsView.add(
							[
								'<div class="font-weight-bold mt-4">',
									'To access this webapp you need a token in your wallet with the following PolicyID:',
								'</div>',
								'<div class="text-secondary mt-2">',
									'Policy # <a class="text-muted" href="https://jpg.store/collection/',
										onChainAuth.policy, '" target="_blank">', onChainAuth.policy, '</a>',
								'</div>',
							]);
						}
					}
				}
			}

			eos.set(
			{
				scope: 'on-chain-wallet-auth-using-policy',
				context: 'auth',
				value: onChainAuth
			})

			if (onChainAuth.viewContainer == undefined)
			{
				onChainAuth.viewContainer = 'on-chain-dashboard-view'
			}

			onChainWalletAssetsView.add(['<div id="', onChainAuth.viewContainer, '"></div>']);

			onChainWalletAssetsView.render('#on-chain-view');

			if (onChainAuth.assetBasedOnPolicyIDFound && onChainAuth.viewController != undefined)
			{
				eos.invoke(onChainAuth.viewController);
			}
		}
	},
	{
		name: 'on-chain-wallet-auth-using-policy',
		code: function (param)
		{
			var policy = _.get(param.dataContext, 'policy');

			$('#on-chain-wallet-auth-view').addClass('d-none');

			//SET DEFAULT TO TEST DASHBOARD LOOK
            var auth = entityos._util.param.get(param, 'auth', {default: true}).value;

            if (!auth)
            {
                eos.invoke('on-chain-dashboard-show', param);
            }
            else
            {   
                eos.invoke('on-chain-wallet-auth-using-policy-logon-init')
            }
        }
    },
	{
		name: 'on-chain-wallet-auth-using-policy-logon-init',
		code: function (param, response)
		{
			if (response == undefined)
			{
				entityos.cloud.invoke(
                {
                    method: 'core_get_user_details',
                    data: {},
                    callback: 'on-chain-wallet-auth-using-policy-logon-init'
                })
			}
			else
			{
				const logonkey = eos.set(
				{
					scope: 'on-chain-wallet-auth-using-policy-logon',
					context: 'logonkey',
					value: response.logonkey
				});

				let onChainAuth = eos.get(
				{
					scope: 'on-chain-wallet-auth-using-policy',
					context: 'auth'
				});

				var _wallet = eos.get({scope: 'on-chain', context: '_wallet'});

				var dataToSign = onChainAuth.policy;

				if (logonkey != undefined)
				{
					dataToSign += '|' + logonkey;
				}

				window.cardano[_wallet.name].enable().then(
				function (wallet)
				{
					wallet.getRewardAddresses().then(
					function (addresses)
					{
						var signingAddress = _.first(addresses);

						eos.set(
						{
							scope: 'on-chain-wallet-auth-using-policy-logon',
							context: 'datatosign',
							value: dataToSign
						});

						eos.set(
						{
							scope: 'on-chain-wallet-auth-using-policy-logon',
							context: 'signingaddress',
							value: signingAddress
						});

						var dataToSignAsHex = entityos._util.hex.to(dataToSign);

						wallet.signData(signingAddress, dataToSignAsHex)
						.then(function (signedData)
						{						
							eos.set(
							{
								scope: 'on-chain-wallet-auth-using-policy-logon',
								context: 'signeddata',
								value: signedData
							});

							 eos.invoke('on-chain-wallet-auth-using-policy-logon')
						},
						function(error)
						{
							var authOnChainView = eos.view();

							authOnChainView.add(
							[
								'<div class="pt-4 text-white fw-bold">', error.info, '</div>'
							])

							authOnChainView.render('#auth-on-chain-message');
						});
					},
					function(error)
					{
						console.log(error);
					});
				},
				function (error)
				{
					console.log(error);
				});
			}
		}
	},
    {
		name: 'on-chain-wallet-auth-using-policy-logon',
		code: function (param, response)
		{
			//var policy = _.get(param.dataContext, 'policy');
	
            if (response == undefined)
            {
				const dataLogon = eos.get(
				{
					scope: 'on-chain-wallet-auth-using-policy-logon'
				});

				const onChainAuth = eos.get(
				{
					scope: 'on-chain-wallet-auth-using-policy',
					context: 'auth'
				});

				var _wallet = eos.get({scope: 'on-chain', context: '_wallet'});

				let context;
				if (_.includes(window.location.hostname, '-lab'))
				{
					context = 'lab'
				}

                const dataBase64 = entityos._util.base64.to(
                {      
                    _context: context,
                    method: 'verify-user-auth',
                    apikey: onChainAuth.apikey,
                    data:
                    {
                        site: onChainAuth.site,
                        auth:
                        {
                            key: dataLogon.signeddata.key,
                            signature: dataLogon.signeddata.signature,
                            datatoverify: onChainAuth.policy + '|[[LOGONKEY]]',
                            stakeaddress: _wallet.stakeAddress
                        }
                    }
                });
        
                entityos.cloud.invoke(
                {
                    method: 'logon_trusted',
                    data: 
                    {
                        identityprovidertype: 'url',
                        data: dataBase64
                    },
                    callback: 'on-chain-wallet-auth-using-policy-logon'
                });
            }
            else
            {
				if (response.status == 'OK')
				{
					eos.invoke('on-chain-dashboard-show', param);
				}
				else
				{
					var onChainWalletAssetsViewsView = eos.view();
					onChainWalletAssetsViewsView.add(
					[
						'<div class="card my-4 shadow">',
							'<div class="card-body text-center">',
								'<div class="text-danger font-weight-bold mb-2 lead">Sign In Failed</div>',
								'<div class="text-secondary">Please check the NFT is still in your wallet and you signed the data using the correct wallet, thank you.</div>',
							'</div>',
						'</div>'
					]);

					onChainWalletAssetsViewsView.render('#on-chain-dashboard-view');
				}
            }		
		}
	},

]);

eos.add(
{
	name: 'on-chain-dashboard-learning-projects-clone-copy-save',
	code: function (param, response)
	{			
		var projectTemplate = eos.get( 
		{
			scope: 'on-chain-dashboard-learning-projects-clone-copy',
			context: 'projectTemplate'
		});

		if (projectTemplate == undefined)
		{
			eos.notify('Can not find the template!')
		}
		else
		{
			if (_.isUndefined(response))
			{
				var data =
				{
					category: projectTemplate.category,
					contactbusiness: eos.invoke('util-whoami').thisInstanceOfMe.user.contactbusiness,
					contactperson: eos.invoke('util-whoami').thisInstanceOfMe.user.contactperson,
					description: projectTemplate.description,
					handovernotes: projectTemplate.handovernotes,
					notes: projectTemplate.notes,
					percentagecomplete: 0,
					projectmanager: eos.invoke('util-whoami').thisInstanceOfMe.user.id,
					referencemask: _.first(projectTemplate.typetext) + '????',
					restrictedtoteam: 'Y',
					sourceprojecttemplate: projectTemplate.id,
					startdate: moment().format('DD MMM YYYY'),
					status: 1,
					type: projectTemplate.type,
					datareturn: 'guid,id'
				}

				mydigitalstructure.cloud.save(
				{
					object: 'project',
					data: data,
					callback: 'on-chain-dashboard-learning-projects-clone-copy-save'
				});
			}
			else
			{	
				if (response.status == 'OK')
				{
					eos.set( 
					{
						scope: 'on-chain-dashboard-learning-project-do',
						value: _.first(response.data.rows)
					});

					eos.invoke('on-chain-dashboard-learning-projects-clone-copy-team-init')
				}
			}
		}
	}
});

eos.add(
{
	name: 'on-chain-dashboard-learning-projects-clone-copy-team-init',
	code: function (param, response)
	{	
		if (response == undefined)
		{
			entityos.cloud.search(
			{
				object: 'contact_relationship',
				fields:
				[
					'othercontactperson',
					'othercontactbusiness'
				],
				filters:
				[
					{
						field: 'contactperson',
						value: app.whoami().thisInstanceOfMe.user.contactperson
					}
				],
				callback: 'on-chain-dashboard-learning-projects-clone-copy-team-init'
			});
		}
		else
		{
			eos.set( 
			{
				scope: 'on-chain-dashboard-learning-projects-clone-copy-team',
				value: response.data.rows
			});

			eos.set( 
			{
				scope: 'on-chain-dashboard-learning-projects-clone-copy-team-index',
				value: 0
			});

			eos.invoke('on-chain-dashboard-learning-projects-clone-copy-team-process')
		}
	}
});

eos.add(
{
	name: 'on-chain-dashboard-learning-projects-clone-copy-team-process',
	code: function (param, response)
	{	
		const projectCloneTeamConnections = eos.get( 
		{
			scope: 'on-chain-dashboard-learning-projects-clone-copy-team',
		});

		const projectCloneTeamConnectionIndex = eos.get( 
		{
			scope: 'on-chain-dashboard-learning-projects-clone-copy-team-index',
		});

		if (projectCloneTeamConnectionIndex < projectCloneTeamConnections.length)
		{
			const projectCloneTeamConnection = projectCloneTeamConnections[projectCloneTeamConnectionIndex];

			const projectClone = eos.get( 
			{
				scope: 'on-chain-dashboard-learning-project-do'
			});

			var data =
			{
				project: projectClone.id,
				startdate: moment().format('DD MMM YYYY'),
				contactperson: projectCloneTeamConnection['othercontactperson'],
				contactbusiness: projectCloneTeamConnection['othercontactbusiness']
			}

			// Can add projectRole at a later date.

			entityos.cloud.save(
			{
				object: 'project_team',
				data: data,
				callback: 'on-chain-dashboard-learning-projects-clone-copy-team-next',
				callbackParam: param
			});
		}
		else
		{
			app.invoke('on-chain-dashboard-learning-projects-clone-copy-complete');
		}
	}
});

eos.add(
{
	name: 'on-chain-dashboard-learning-projects-clone-copy-team-next',
	code: function (param, response)
	{	
		const projectCloneTeamConnectionIndex = eos.get( 
		{
			scope: 'on-chain-dashboard-learning-projects-clone-copy-team-index'
		});

		eos.set( 
		{
			scope: 'on-chain-dashboard-learning-projects-clone-copy-team-index',
			value: (projectCloneTeamConnectionIndex + 1)
		});

		app.invoke('on-chain-dashboard-learning-projects-clone-copy-team-process');
	}
});

eos.add(
{
	name: 'on-chain-dashboard-learning-projects-clone-copy-complete',
	code: function (param, response)
	{
		eos.invoke('on-chain-dashboard-learning-project-do')
	}
});		


eos.add(
{
	name: 'on-chain-dashboard-learning-project-do',
	code: function (param, response)
	{
		const project = eos.get( 
		{
			scope: 'on-chain-dashboard-learning-project-do'
		});
		
		const aiDashboardView = eos.view();

		aiDashboardView.add(
		[
			'<div class="row mt-2 mb-4">',
				'<div class="col-12 mt-3 mt-md-3">',
					'<div class="d-none">',
						'<a class="btn btn-primary rounded-pill entityos-click" data-controller="on-chain-dashboard-show"><i class="fas fa-home text-white"></i></a>',
					'</div>',

					'<div id="learning-partner-project-do-view"></div>',
					'<div id="learner-project-do-view"></div>',
				'</div>',
			'</div>'
		]);

		aiDashboardView.render('#on-chain-view');

		let projectID = project.guid;
		if (projectID == undefined)
		{
			projectID = project.id
		}

		eos.invoke('util-project-do', {id: projectID, viewSelector: '#on-chain-dashboard-learning-project-do-view'})
	}
});
