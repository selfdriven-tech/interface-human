//import { EntityOS } from '/site/2186/entityos.module.class-1.0.0.js';
//const eos = new EntityOS();

const eos = {
	invoke: function (controllerName, controllerParam) {
		return entityos._util.controller.invoke(controllerName, controllerParam)
	},

	add: function (controllerParam) {
		return entityos._util.controller.add(controllerParam)
	},

	set: function(param) {
		return entityos._util.data.set(param)
	},

	get: function(param) {
		return entityos._util.data.get(param)
	},

	view: function(param) {
		return entityos._util.view.queue.init(param)
	},

	param: function(param, fieldName, options) {
		return entityos._util.param.get(param, fieldName, options);
	}
}

_.contains = _.includes;

/*
	https://slfdrvn.io/intro-cardano
	Powered by:
	- entityos.cloud
	- cardano.org

	Using example Cardano CIP30 Wallet code from:
	- https://dsociety.io/community-blockchain
*/

eos.add(
[
	{
		name: 'community-init',
		code: function ()
		{
			console.log('Your selfdriven community.');
			console.log('https://slfdrvn.io/intro-cardano')
			eos.invoke('community-init-cardano');
		}
	},
	{
		name: 'community-init-cardano',
		code: function ()
		{
			// [1] Set up a standard set of wallets that work in the browser
			// https://www.cardanocube.io/collections/wallets for full list.

			console.log('## Browser wallets:')

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
				scope: 'community',
				context: 'cardano',
				value: _cardano
			});

			// [4] Reduce to set of wallets available in the this browser.

			var wallets = eos.set(
			{
				scope: 'community',
				context: 'wallets',
				value: _.filter(_cardano.wallets, function (_wallet) { return _wallet.enabled })
			});

			console.log(_cardano);
			console.table(wallets);
			console.log('\n');

			// [5] Show wallets to user or not to install

			if (wallets.length == 0)
			{
				var communityView = eos.view()

				communityView.add(
					[
						'<div class="mt-4 text-center">',
						'<div class="font-weight-bold text-secondary">There no wallets available to connect to, please install a wallet to continue.</div>',
						'<div class="mt-4"><a href="https://www.cardanowallets.io" target="_blank" style="font-size:1.2rem;">Cardano Wallets <i class="far fa-arrow-up-light-from-square"></a></div>',
						'</div>'
					]);

				communityView.render('#community-view');
			}
			else
			{
				var communityConnectWalletsView = eos.view()

				_.each(wallets, function (wallet)
				{
					communityConnectWalletsView.add(
					[
						'<a href="#" class="dropdown-item entityos-click py-2"',
						' data-name="', wallet.name, '"',
						' data-controller="community-wallet-connect" data-context="wallet" data-scope="community-wallet-connect">',
						wallet.caption,
						'</a>'
					]);
				});

				communityConnectWalletsView.add(
					[
						'<a id="community-wallet-disconnect-view" href="#" class="dropdown-item entityos-click border-top py-2 d-none"',
						' data-controller="community-wallet-disconnect">',
							'Disconnect',
						'</a>'
					]);

				communityConnectWalletsView.render('#community-connect-view');

				$('#community-connect').removeClass('disabled');

				$('#community-view').html('<div class="mt-4 text-center"><div class="font-weight-bold text-secondary">Please connect to a Cardano wallet to continue.</div><div class="mt-2 text-secondary">Thank you.</a>');
			}
		}
	},
	{
		name: 'community-wallet-connect',
		code: function (param)
		{
			//eos.invoke('util-view-popover-hide');

			$('#community-wallet-disconnect-view').removeClass('d-none');

			$('#community-view').html('<div class="mt-4 text-center text-secondary">Connecting...</div>');

			console.log('## Store Wallet Name:')

			// [6] Get wallet name based on user selection.

			var walletName = entityos._util.param.get(param.dataContext, 'name').value;

			// [7] Set the wallet name in the local browser data, so can be used later.

			eos.set({ scope: 'community', context: 'wallet-name', value: walletName });

			console.log(walletName);
			console.log('\n');

			// [8] Get the wallet assets.

			eos.invoke('community-wallet-assets', param)
		}
	},
	{
		name: 'community-wallet-assets',
		code: function (param)
		{
			console.log('## Get & Show Wallet Assets:')

			// [9] Get the stored walletName & set the button name

			var walletName = eos.get({ scope: 'community', context: 'wallet-name' });

			var wallets = eos.get({ scope: 'community', context: 'wallets' });

			var _wallet = _.find(wallets, function (wallet) { return wallet.name == walletName })
			if (_wallet != undefined)
			{
				$('#community-connect').html(_wallet.caption)
			}

			eos.set(
			{
				scope: 'community',
				context: '_wallet',
				value: _wallet
			});

			// [10] Get a wallet object i.e. with the functions that can use to interact with the wallet (see Dev Tools > Console)

			window.cardano[walletName].enable().then(function (wallet)
			{
				console.log(wallet);

				// [11] Run the getBalance function
				// It returns data in the Concise Binary Object Representation "CBOR" Hex format.
				// So if you look at it, it want make sense, which is why use entityos._util.hex.CBORtoArray to convert it!

				wallet.getBalance().then(function (dataAsCBORHex)
				{
					console.log('CBOR(Hex): ' + dataAsCBORHex)

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

					console.log('- which decodes to:');
					console.log(parseInt(lovelace) + ' Lovelace / ' + parseInt(lovelace) / 1000000 + ' ADA\n\n');

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

					console.log('Other Digital Assets In The Wallet:');
					var otherAssets = data[1];
					console.log(otherAssets);

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

						console.log('- which decodes to:');
						console.log(_otherAssets);
					}

					_.each(_otherAssets, function (value, key)
					{
						_wallet.assets.push(
						{
							name: key,
							amount: value
						});
					});

					eos.invoke('community-wallet-transactions', param);
				});
			});
		}
	},
	{
		name: 'community-wallet-transactions',
		code: function (param)
		{
			console.log('## Get & Show Wallet Transactions:')

			var _wallet = eos.get({scope: 'community', context: '_wallet'});
         	var walletName = eos.get({ scope: 'community', context: 'wallet-name' });
			
            window.cardano[walletName].enable().then(function (wallet)
            {
                console.log(wallet);

				var uxtos = [];
				_wallet._assets = [];
				
                wallet.getUtxos().then(function(dataAsCBORHex)
                {
                    console.log('UXTOs Data:')

					var _dataAsCBORHex = _.split(dataAsCBORHex, ',')
					console.log(_dataAsCBORHex);

					_.each(_dataAsCBORHex, function (__dataAsCBORHex)
					{
						var _uxto = {};

                        if (__dataAsCBORHex != '')
                        {
                            var _data = _.split(__dataAsCBORHex, '8258390');
                            console.log('-- Transaction:');

                            var txID = _.replace(_.first(_data), '82825820', '')
                            _uxto['id'] = _.join(_.slice(txID, 0, -2), '');

                            console.log('#' + parseInt(_.join(_.slice(txID,-2), '')));
                            _uxto['index'] = parseInt(_.join(_.slice(txID,-2), ''));

                            var data = entityos._util.hex.CBORtoArray(__dataAsCBORHex);
                            console.log('--')
                            var dataTransaction = data[1][1];

                            if (!_.isArray(dataTransaction))
                            {
                                console.log(dataTransaction);
                                _uxto['assets'] = {cardano: {lovelace: dataTransaction}};
                                _uxto['_assets'] = {name: 'lovelace', amount: numeral(dataTransaction).value(), tx: txID};
                            }
                            else
                            {
                                console.log(dataTransaction[0]);

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

                                    console.log('chars:' + charCodes)
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
                                    });

                                    _uxto['_assets'].push(_.clone(_asset));
                                });
                            }

                            uxtos.push(_uxto);

                            _wallet._assets = _.concat(_wallet._assets, _uxto._assets);
                        }
					})
                   
					console.log(uxtos);

					_wallet.uxtos = uxtos;

					var assets = [];

					_.each(_wallet._assets, function (_walletAsset)
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
					});

					eos.set(
					{
						scope: 'community',
						context: 'assets',
						value: assets
					});

					eos.invoke('community-wallet-network', param);
                });
            });
        }
	},
	{
		name: 'community-wallet-network',
		code: function (param)
		{
			console.log('## Get & Show Wallet Network:')

			var _wallet = eos.get({scope: 'community', context: '_wallet'});
        	var walletName = eos.get({ scope: 'community', context: 'wallet-name' });

            window.cardano[walletName].enable().then(function (wallet)
            {
				wallet.getNetworkId().then(function(data)
				{
					console.log('NetworkID: ' + data);
					_wallet.networkID = data

					eos.invoke('community-wallet-used-addresses', param);
				});
			});
		}
	},
	{
		name: 'community-wallet-used-addresses',
		code: function (param)
		{
			console.log('## Get & Show Wallet Used Addresses:')

         	var _wallet = eos.get({scope: 'community', context: '_wallet'});
         	var walletName = eos.get({ scope: 'community', context: 'wallet-name' });

            window.cardano[walletName].enable().then(function (wallet)
            {
				wallet.getUsedAddresses().then(function(addressesData)
				{
					var _usedAddresses = [];

					_.each(addressesData, function (addressData)
					{
						console.log(addressData);

						var _usedAddress = typhonjs.utils.getAddressFromHex(addressData);

						var _usedAddressData = 
						{
							_data: _usedAddress
						}
						
						_usedAddressData.address = _usedAddressData._data.addressBech32;
						_usedAddresses.push(_usedAddressData);
					});

					console.log('Used Addresses:')
					console.log(_usedAddresses)

					_wallet.addresses = {used: _usedAddresses}

					eos.invoke('community-wallet-reward-addresses', param)
				});
			});
		}
	},
	{
		name: 'community-wallet-reward-addresses',
		code: function (param)
		{
			console.log('## Get & Show Wallet Reward Addresses:')

         	var _wallet = eos.get({scope: 'community', context: '_wallet'});
         	var walletName = eos.get({ scope: 'community', context: 'wallet-name' });

            window.cardano[walletName].enable().then(function (wallet)
            {
				wallet.getRewardAddresses().then(function(addressesData)
				{
					var _rewardAddresses = [];

					_.each(addressesData, function (addressData)
					{
						console.log(addressData);

						var _address = typhonjs.utils.getAddressFromHex(addressData);

						var _rewardAddressData = 
						{
							_data: _address
						}
						
						_rewardAddressData.address = _rewardAddressData._data.addressBech32;
						_rewardAddresses.push(_rewardAddressData);
					});

					console.log('Reward Addresses:')
					console.log(_rewardAddresses)

					_wallet.addresses = _.assign(_wallet.addresses, {reward: _rewardAddresses})

					eos.invoke('community-wallet-change-address', param)
				});
			});
		}
	},
		{
		name: 'community-wallet-change-address',
		code: function (param)
		{
			console.log('## Get & Show Wallet Change Address:')

         	var _wallet = eos.get({scope: 'community', context: '_wallet'});
         	var walletName = eos.get({ scope: 'community', context: 'wallet-name' });

            window.cardano[walletName].enable().then(function (wallet)
            {
				wallet.getChangeAddress().then(function(addressData)
				{
					console.log(addressData);

					var _address = typhonjs.utils.getAddressFromHex(addressData);

					var _changeAddressData = 
					{
						_data: _address
					}
					
					_changeAddressData.address = _changeAddressData._data.addressBech32;
				
					console.log('Change Address:')
					console.log(_changeAddressData)

					_wallet.addresses = _.assign(_wallet.addresses, {change: _changeAddressData})

					eos.invoke('community-wallet-show', param)
				});
			});
		}
	},
	{
		name: 'community-wallet-show',
		code: function (param)
		{
			var _wallet = eos.get({scope: 'community', context: '_wallet'});
			var data = eos.get({scope: 'community'});

			var communityWalletAssetsView = eos.view();

			var lovelace = _.find(data.assets, function (asset)
			{
				return asset.name == 'lovelace'
			});

			communityWalletAssetsView.add(
			[
				'<div class="card shadow-lg mt-3">',
					'<div class="card-body text-center">'
			]);

			if (_.has(data, '_wallet.addresses.reward'))
			{
				// Also referred to as Account Address
				_wallet.stakeAddress = _.first(data._wallet.addresses.reward).address;

				communityWalletAssetsView.add(
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

				communityWalletAssetsView.add(
				[
					'<div style="word-break: break-all;" class="mb-1 text-secondary small">',
						'<a class="text-secondary" href="https://cardanoscan.io/address/',
								 _wallet.changeAddress, '" target="_blank">', _wallet.changeAddress, '</a>',
					'</div>'
				]);
			}

			var showADA = false;
			if (showADA)
			{
				communityWalletAssetsView.add(
				[
					'<div class="font-weight-bold mb-1 mt-1">',
						(parseInt(lovelace.amount) / 1000000), ' ADA',
					'</div>'
				]);
			}

			var _otherAssets = _.filter(data.assets, function (asset)
			{
				return asset.name != 'lovelace'
			});

			var _otherAssetsOrdered = _.sortBy(_otherAssets, 'name');

			var communityPolicyID = '09b1ae51b984fc1aa405d753a98a239ec4fcd2c199f0ea532e9139df';
			var assetBasedOnPolicyIDFound = false;

			_.each(_otherAssetsOrdered, function (_otherAsset)
			{
				if (_otherAsset.policy == communityPolicyID)
				{
					assetBasedOnPolicyIDFound = true;

					communityWalletAssetsView.add(
					[
						'<div class="mt-3 pb-1">',
							'<h4 class="">',
								'<span class="font-weight-bold">', _otherAsset.name, '</span> <span class="d-none text-muted"> | ', _otherAsset.amount, '</span>',
							'</h4>',
							'<div class="text-muted small">',
								'Policy # <a class="text-muted" href="https://cardanoscan.io/tokenPolicy/',
									_otherAsset.policy, '" target="_blank">', _otherAsset.policy, '</a>',
							'</div>',
							'<div class="mt-3" id="community-wallet-auth-view">',
								' <button type="button"',
										' id="community-wallet-auth-using-policy"',
										' class="btn btn-outline-primary btn-sm entityos-click"',
										' data-controller="community-wallet-auth-using-policy"',
										' data-policy="',  _otherAsset.policy, '"',
									'>',
									'Sign In',
								'</button>',
							'</div>',
						'</div>'
					]);
				}
			});

			if (!assetBasedOnPolicyIDFound)
			{
				communityWalletAssetsView.add(
				[
					'<h4 class="mt-4">',
						'<span class="font-weight-bold">Hello!</span>',
					'</h4>',
                    '<div class="font-weight-bold">',
						'To access this webapp you need a token (i.e. NFT) in your wallet with the following PolicyID:',
					'</div>',
					'<div class="text-secondary mt-2">',
						'Policy # <a class="text-muted" href="https://jpg.store/collection/',
							communityPolicyID, '" target="_blank">', communityPolicyID, '</a>',
					'</div>',
				]);
			}

			communityWalletAssetsView.add([
					'</div>',
				'</div>'
			]);

			communityWalletAssetsView.add('<div id="community-dashboard-view"></div>');

			communityWalletAssetsView.render('#community-view');
		}
	},
	{
		name: 'community-wallet-auth-using-policy',
		code: function (param)
		{
			var policy = _.get(param.dataContext, 'policy');
			console.log(policy);

			$('#community-wallet-auth-view').addClass('d-none');
		
			//Do the LOGON_TRUSTED USING the signed policy ID to proof own the wallet.
			//Next step show the sign data that will be sent to LOGON_TRUSTED

			/*eos.invoke('community-wallet-sign-data',
			{
				dataToSign: policy
			})*/

			//For Design Conceptualisation
			//Will be called after OK from community-wallet-auth-using-policy
			eos.invoke('community-dashboard-show', param);
		}
	}
]);