import { EntityOS } from '/site/2152/entityos.module.class-1.0.0.js';
const eos = new EntityOS();

// dSOCIETY | LEARN-BY-EXAMPLE

// Getting a "foot-hold" on the Cardano tech by connecting to a wallet and querying on-chain data.

// Code is free to use.
// It is only provided as to aid learning about connecting to the Cardano blockchain/wallet.
// To that purpose it uses Javascript in its simplest form, so as to keep focus on the blockchain/wallet conceptual learning.
// Recommend using resources @ https://buildingoncardano.dev if plan to build a production-grade app.

// Each of the wallets have their own code files loaded into the browser
// They all expose the same functions (methods) based on the CIP-30 standard.
// In the example if you look at the wallet variable in the browser console you will see the methods. i.e. console.log(wallet)
// e.g. wallet.getBalance().then(function (walletData) {}) - walletData being the data returned by the wallet.

// The data is stored in the CBOR format - which is used to store data on Cardano and transfer it over http(s).
// This example code uses the entityOS import for some basic help functions to conver the data, so it can be used by the Javascript code.

eos.add(
[
	{
		name: 'learn-init',
		code: function ()
		{
			console.log('We have an opportunity to descentralise & rehumanise our society.');
			console.log('https://dsociety.io\n\n')
			eos.invoke('learn-init-cardano');
		}
	},
	{
		name: 'learn-init-cardano',
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
				var learnView = eos.view()

				learnView.add(
					[
						'<div class="mt-6">',
						'<div class="fw-bold text-secondary" style="font-size:1.2rem;">There no wallets available to connect to, please install a wallet to continue.</div>',
						'<div class="mt-4"><a href="https://www.cardanowallets.io" target="_blank" style="font-size:1.2rem;">Cardano Wallets <i class="fe fe-external-link"></a></div>',
						'</div>'
					]);

				learnView.render('#learn-view');
			}
			else
			{
				var learnConnectWalletsView = eos.view()

				_.each(wallets, function (wallet)
				{
					learnConnectWalletsView.add(
						[
							'<div class="text-center">',
							'<a href="#" class="entityos-click" style="color:#fff !important;"',
							' data-name="', wallet.name, '"',
							' data-controller="learn-wallet-connect" data-context="wallet" data-scope="learn-wallet-connect">',
							wallet.caption,
							'</a>',
							'</div>'
						]);
				});

				$('#learn-connect').removeClass('disabled').popover(
				{
					content: learnConnectWalletsView.get(),
					html: true,
					placement: 'bottom',
					template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><div class="popover-body"></div></div>',
					offset: [0, 10],
					sanitize: false
				}).on('show.bs.popover', function () {
					$('#learn-view').html('');
				});

				$('#learn-view').html('<div class="mt-6" style="font-size: 1.2rem;"><div class="fw-bold text-secondary">Please connect to a Cardano wallet to continue.</div><div class="mt-2 text-secondary">Thank you, Turlia.</a>');
			}
		}
	},
	{
		name: 'learn-wallet-connect',
		code: function (param)
		{
			eos.invoke('util-view-popover-hide');

			console.log('## Store Wallet Name:')

			// [6] Get wallet name based on user selection.

			var walletName = entityos._util.param.get(param.dataContext, 'name').value;

			// [7] Set the wallet name in the local browser data, so can be used later.

			eos.set({ scope: 'learn', context: 'wallet-name', value: walletName });

			console.log(walletName);
			console.log('\n');

			// [8] Get the wallet assets.

			eos.invoke('learn-wallet-assets', param)
		}
	},
	{
		name: 'learn-wallet-assets',
		code: function (param)
		{
			console.log('## Get & Show Wallet Assets:')

			// [9] Get the stored walletName & set the button name

			var walletName = eos.get({ scope: 'learn', context: 'wallet-name' });

			var wallets = eos.get({ scope: 'learn', context: 'wallets' });

			var _wallet = _.find(wallets, function (wallet) { return wallet.name == walletName })
			if (_wallet != undefined)
			{
				$('#learn-connect').html(_wallet.caption)
			}

			eos.set(
			{
				scope: 'learn',
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

					eos.invoke('learn-wallet-transactions', param);
				});
			});
		}
	},
	{
		name: 'learn-wallet-transactions',
		code: function (param)
		{
			console.log('## Get & Show Wallet Transactions:')

			var _wallet = eos.get({scope: 'learn', context: '_wallet'});
         	var walletName = eos.get({ scope: 'learn', context: 'wallet-name' });
			
            window.cardano[walletName].enable().then(function (wallet)
            {
                console.log(wallet);

				var utxos = [];
				_wallet._assets = [];
				
                wallet.getUtxos().then(function(dataAsCBORHex)
                {
                    console.log('utxos Data:')

					var _dataAsCBORHex = _.split(dataAsCBORHex, ',')

					_wallet._utxosCBORHex = _dataAsCBORHex;

					console.log(_dataAsCBORHex);

					_.each(_dataAsCBORHex, function (__dataAsCBORHex)
					{
						var _utxo = {};

						let _data1 = entityos._util.hex.CBORtoArray(__dataAsCBORHex);
						var data = entityos._util.hex.CBORtoArray(__dataAsCBORHex);

						function uint8ArrayToHex(uint8Array) {
							return Array.from(uint8Array)
								.map(byte => byte.toString(16).padStart(2, '0'))
								.join('');
							}

						console.log('-- Transaction:');

						let txID = uint8ArrayToHex(data[0][0])
						console.log(txID);

						_utxo['id'] = txID;

						let txIndex = data[0][1];
						_utxo['index'] = txIndex;

						console.log('--')

						var dataTransaction = data[1][1];

						if (!_.isArray(dataTransaction))
						{
							console.log(dataTransaction);
							_utxo['assets'] = {cardano: {lovelace: dataTransaction}};
							_utxo['_assets'] = {name: 'lovelace', amount: numeral(dataTransaction).value(), tx: _utxo['id'], index: _utxo['index']};
						}
						else
						{
							console.log(dataTransaction[0]);

							_utxo['_assets'] =
							[
								{
									name: 'lovelace',
									amount: numeral(dataTransaction[0]).value(),
									tx: _utxo['id'],
									index: _utxo['index']
								}
							];

							_utxo['assets'] =
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

								_utxo['assets'][hexString] = {};
								_asset['policy'] = hexString;

								_.each(dataTransaction[1][_transactionKey], function (_transactionValueValue, _transactionValueKey)
								{
									dataTransaction[1][_transactionKey][entityos._util.convert.charCodesToText(_transactionValueKey)] = _transactionValueValue;

									_utxo['assets'][hexString][entityos._util.convert.charCodesToText(_transactionValueKey)] = _transactionValueValue;

									_asset['name'] = entityos._util.convert.charCodesToText(_transactionValueKey);
									_asset['amount'] = numeral(_transactionValueValue).value();
									_asset['tx'] = txID;
								});

								_utxo['_assets'].push(_.clone(_asset));
                            });
						}

						utxos.push(_utxo);

						_wallet._assets = _.concat(_wallet._assets, _utxo._assets)
					})
                   
					console.log(utxos);

					_wallet.utxos = utxos;

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
						scope: 'learn',
						context: 'assets',
						value: assets
					});

					eos.invoke('learn-wallet-network', param);
                });
            });
        }
	},
	{
		name: 'learn-wallet-network',
		code: function (param)
		{
			console.log('## Get & Show Wallet Network:')

			var _wallet = eos.get({scope: 'learn', context: '_wallet'});
        	var walletName = eos.get({ scope: 'learn', context: 'wallet-name' });

            window.cardano[walletName].enable().then(function (wallet)
            {
				wallet.getNetworkId().then(function(data)
				{
					console.log('NetworkID: ' + data);
					_wallet.networkID = data

					eos.invoke('learn-wallet-used-addresses', param);
				});
			});
		}
	},
	{
		name: 'learn-wallet-used-addresses',
		code: function (param)
		{
			console.log('## Get & Show Wallet Used Addresses:')

         	var _wallet = eos.get({scope: 'learn', context: '_wallet'});
         	var walletName = eos.get({ scope: 'learn', context: 'wallet-name' });

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

					eos.invoke('learn-wallet-reward-addresses', param)
				});
			});
		}
	},
	{
		name: 'learn-wallet-reward-addresses',
		code: function (param)
		{
			console.log('## Get & Show Wallet Reward Addresses:')

         	var _wallet = eos.get({scope: 'learn', context: '_wallet'});
         	var walletName = eos.get({ scope: 'learn', context: 'wallet-name' });

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

					eos.invoke('learn-wallet-change-address', param)
				});
			});
		}
	},
		{
		name: 'learn-wallet-change-address',
		code: function (param)
		{
			console.log('## Get & Show Wallet Change Address:')

         	var _wallet = eos.get({scope: 'learn', context: '_wallet'});
         	var walletName = eos.get({ scope: 'learn', context: 'wallet-name' });

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

					eos.invoke('learn-wallet-show', param)
				});
			});
		}
	},
	{
		name: 'learn-wallet-show',
		code: function (param)
		{
			var _wallet = eos.get({scope: 'learn', context: '_wallet'});
			var data = eos.get({scope: 'learn'});

			var learnWalletAssetsView = eos.view();

			var lovelace = _.find(data.assets, function (asset)
			{
				return asset.name == 'lovelace'
			});

			learnWalletAssetsView.add(
			[
				'<div style="background-color:rgba(0,0,0,0.7); border-radius: 6px; padding:16px;" class="w-md-75 mt-6">',
			]);

			if (_.has(data, '_wallet.addresses.reward'))
			{
				// Also referred to as Account Address
				_wallet.stakeAddress = _.first(data._wallet.addresses.reward).address;

				learnWalletAssetsView.add(
				[
					'<div style="font-family: PT Mono, monospace; font-size: 1.2rem;" class="mb-1 text-white">',
						_wallet.stakeAddress,
					'</div>'
				]);
			}

			if (_.has(data, '_wallet.addresses.change'))
			{
				// Also referred to as Account Address
				_wallet.changeAddress = data._wallet.addresses.change.address;

				learnWalletAssetsView.add(
				[
					'<div style="font-family: PT Mono, monospace; font-size: 1rem; word-break: break-all;" class="mb-1 text-muted">',
						'<a class="text-muted" href="https://cardanoscan.io/address/',
								 _wallet.changeAddress, '" target="_blank">', _wallet.changeAddress, '</a>',
					'</div>'
				]);
			}

			learnWalletAssetsView.add(
			[
				'<div style="font-family: PT Mono, monospace; font-size: 1.65rem; color:#ff943d;" class="fw-bold mb-1">',
				(parseInt(lovelace.amount) / 1000000), ' ADA',
				'</div>'
			]);

			var _otherAssets = _.filter(data.assets, function (asset)
			{
				return asset.name != 'lovelace'
			});

			var _otherAssetsOrdered = _.sortBy(_otherAssets, 'name');

			_.each(_otherAssetsOrdered, function (_otherAsset)
			{
				learnWalletAssetsView.add(
				[
					'<div class="mb-2">',
						'<div style="font-family: PT Mono, monospace; font-size: 1.2rem;" class="text-white">',
							'<span class="fw-bold">', _otherAsset.name, '</span> | ', _otherAsset.amount,
						'</div>',
						'<div class="text-muted small">',
							'Policy # <a class="text-muted" href="https://cardanoscan.io/tokenPolicy/',
								_otherAsset.policy, '" target="_blank">', _otherAsset.policy, '</a>',
									' <button id="learn-connect" type="button"',
										' class="ms-2 btn btn-outline-primary btn-sm entityos-click"',
										' data-controller="learn-wallet-sign-policy"',
										' data-policy="',  _otherAsset.policy, '"',
									'>',
										'<span class="text-white small fw-light">Sign</span>',
									'</button>',
						'</div>',
					'</div>'
				]);
			});

			learnWalletAssetsView.add('</div>');

			learnWalletAssetsView.add('<div id="learn-wallet-view"></div>');

			learnWalletAssetsView.render('#learn-view');

			//SIGN DATA

			var learnWalletView = eos.view();

			learnWalletView.add(
			[
				'<div class="card w-md-75 mt-6 shadow-lg border border-secondaey">',
					'<div class="card-body p-4">',
						'<div class="form-group">',
							'<div class="mb-2"><label class="fw-bold text-secondary" for="url-text">Enter Data to Sign</label>',
							'</div>',
							'<textarea id="learn-wallet-sign-data-text" class="form-control entityos-text w-100" style="height:140px;" data-scope="learn-cardano-wallet" data-context="sign-data-text"></textarea>',
						'</div>',
						'<button id="learn-connect" type="button" class="btn btn-outline-primary btn-sm entityos-click" data-controller="learn-wallet-sign-data">',
							'Sign Data',
						'</button>',
						'<div id="learn-wallet-sign-data-view"></div>',
					'</div>',
				'</div>'
			]);

			learnWalletView.add(
			[
				'<div class="card w-md-75 mt-6 shadow-lg border border-secondaey">',
					'<div class="card-body p-4">',
						'<button id="learn-connect" type="button" class="btn btn-outline-primary btn-sm entityos-click" data-controller="learn-wallet-send-ada" data-mode="to-self">',
							'Send ADA',
						'</button>',
						'<div id="learn-wallet-send-data-view"><div class="text-danger mt-2">Note it only requests the signing and does not do the actual submit - so no assets are moved.</div>',
					'</div>',
				'</div>'
			]);

			learnWalletView.render('#learn-wallet-view');
		}
	},
	{
		name: 'learn-wallet-sign-policy',
		code: function (param)
		{
			var policy = _.get(param.dataContext, 'policy');
			console.log(policy);
			$('#learn-wallet-sign-data-text').val(policy);
			eos.invoke('learn-wallet-sign-data',
			{
				dataToSign: policy
			})
		}
	},
	{
		name: 'learn-wallet-sign-data',
		code: function (param)
		{
			//https://www.npmjs.com/package/@cardano-foundation/cardano-verify-datasignature
			//Implementation: https://github.com/ibcom-lab/entityos-learn-blockchain

			var _wallet = eos.get({scope: 'learn', context: '_wallet'});
			var dataToSign = _.get(param, 'dataToSign');

			if (dataToSign == undefined)
			{
				dataToSign = eos.get(
				{
					scope: 'learn-cardano-wallet',
					context: 'sign-data-text'
				});
			}

			console.log('Data to Sign: ' + dataToSign);

			var walletName = eos.get({ scope: 'learn', context: 'wallet-name' });

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
							signedData.address = _wallet.changeAddress;
							signedData.stakeAddress = _wallet.stakeAddress;
							signedData.data = dataToSign;
							signedData.dataAsHex = dataToSignAsHex;
							console.log('Signed Data with Associated Key:')
							console.log(signedData);
							console.log('Repo with example NodeJS code to verify the sign data:')
							console.log('https://github.com/ibcom-lab/entityos-learn-blockchain/blob/main/learn-verify-signed-data.js')

							eos.set(
							{
								scope: 'learn-cardano-wallet',
								context: 'signed-data',
								value: signedData
							});

							var learnWalletSignDataView = eos.view();

							learnWalletSignDataView.add(
							[
								'<div class="py-2">', JSON.stringify(signedData), '</div>'
							])

							learnWalletSignDataView.render('#learn-wallet-sign-data-view');
						},
						function(error)
						{
							console.log(error);
							var learnWalletSignDataView = eos.view();

							learnWalletSignDataView.add(
							[
								'<div class="py-2">', error.info, '</div>'
							])

							learnWalletSignDataView.render('#learn-wallet-sign-data-view');
						});
					}
				});
			});
		}
	},
	{
		name: 'learn-wallet-send-ada',
		code: async function (param)
		{
			//https://docs.strica.io/lib/typhonjs/classes/Transaction.html#buildTransaction
			
			console.log('## Sending ADA to Self');
		
			// Retrieve the wallet name
			const walletName = eos.get({ scope: 'learn', context: 'wallet-name' });

			// Enable the wallet (connect)
			const wallet = await window.cardano[walletName].enable();

			const protocolParams = eos.invoke('learn-util-protocol-parameters');
			console.log(protocolParams);

			const addresses = await wallet.getUsedAddresses();
			const senderAddress = typhonjs.utils.getAddressFromHex(addresses[0]);

			// Define the receiver address and amount
			let receiverAddress = senderAddress; // Insert the receiver's address
			const sendAmount = 2000000; // 1 ADA in lovelace

			// Create a new transaction
			let tx = new typhonjs.Transaction({
				protocolParams: protocolParams // Set protocol params here
			});

			console.log(tx);

			const utxos = await wallet.getUtxos();

			var _wallet = eos.get({scope: 'learn', context: '_wallet'});

			console.log(_wallet);
			// get the ADA (lovelace assets)

			let inputTransactions = _.filter(_wallet._assets, function (asset)
			{
				return asset.policy == undefined;
			});

			inputTransactions = _.sortBy(inputTransactions, 'amount');
			console.log(inputTransactions)

			let inputTransaction;

			_.each(inputTransactions, function (_inputTransaction)
			{
				if (inputTransaction == undefined)
				{
					if (_inputTransaction.amount >= sendAmount)
					{
						inputTransaction = _inputTransaction;
					}
				}
			})

			console.log(inputTransaction)

			if (false)
			{
				_.each(inputTransactions, function (inputTransaction)
				{
					tx.addInput(
					{
						txId: inputTransaction.tx,
						index: inputTransaction.index,
						amount: new BigNumber(inputTransaction.amount),
						address: senderAddress,
						tokens: []
					});
				})
			}
			else
			{
				tx.addInput(
				{
					txId: inputTransaction.tx,
					index: inputTransaction.index,
					amount: new BigNumber(inputTransaction.amount),
					address: senderAddress,
					tokens: []
				});
			}

			console.log(tx.getInputs())

			//Test Octo on Nami
			receiverAddress = typhonjs.utils.getAddressFromString('addr1qxmzlel8x6sdjae7zc4a776ltealq42t4kvc6c04zv7xazys6d4aytccfpnuwtl4jte0peuq8clf6d0xyd6tw5nt6ydqdl5vdh');
			
			// Add outputs
			tx.addOutput({
				address: receiverAddress,
				amount: sendAmount
			});

			// Optionally set fee (wallet will calculate this)
			tx.setFee(155381 + 44); // TODO: Need function to calc fees based on protocol parameters.

			// Build the transaction
			//const unsignedTx = tx.buildTransaction();

			// const tx = new Transaction({ protocolParams: stub.pParams });
			// tx.addInput(stub.UTXOs[0]);
			// tx.addOutput(output);
			// tx.addCollateral(stub.UTXOs[2]);
			// tx.setCollateralOutput(colOutput);
			// tx.setTotalCollateral(new BigNumber(30000000)); // stub 2 utxo

			const unsignedTx = tx.buildTransaction();

			console.log(unsignedTx)

			const _unsignedTxPayload = entityos._util.hex.CBORtoArray(unsignedTx.payload);

			console.log(_unsignedTxPayload);

			function uint8ArrayToHex(uint8Array) {
				return Array.from(uint8Array)
					.map(byte => byte.toString(16).padStart(2, '0'))
					.join('');
				}

			const _unsignedTxInputs = _unsignedTxPayload[0][0][0][0];

			console.log(uint8ArrayToHex(_unsignedTxInputs))

			// metadata: { 674: { msg: "Hello from TyphonJS!" } }, // Optional metadata

			// Sign the transaction
			// TEST - Doesn't show To address in Nami/Lace - is it because same address?
			const signedTx = await wallet.signTx(unsignedTx.payload, true);

			console.log(signedTx)

			$('#learn-wallet-send-data-view').html(
				_.join([
					'<div class="fw-bold mt-2">Sign Transaction to be Submitted</div>',
					'<div class="text-secondary small">',
						signedTx,
					'</div>'
				], ''))

			//const txHash = await wallet.submitTx(signedTx);
			//console.log(txHash)
		}
	},
	{
		name: 'learn-util-protocol-parameters',
		todo: 'Make dynamic using https://onchain.api.slfdrvn.io [https://selfdriven.tech/apps/#apis]',
		code: function (param)
		{
			const parameters =
			'{"epoch":511,"min_fee_a":44,"min_fee_b":155381,"max_block_size":90112,"max_tx_size":16384,"max_block_header_size":1100,"key_deposit":"2000000","pool_deposit":"500000000","e_max":18,"n_opt":500,"a0":0.3,"rho":0.003,"tau":0.2,"decentralisation_param":0,"extra_entropy":null,"protocol_major_ver":9,"protocol_minor_ver":0,"min_utxo":"4310","min_pool_cost":"170000000","nonce":"4ef95a10f639d0cf16bb963c3a580d4bf2a95b6ae7848702665884843e3c661d","cost_models":{"PlutusV1":{"addInteger-cpu-arguments-intercept":100788,"addInteger-cpu-arguments-slope":420,"addInteger-memory-arguments-intercept":1,"addInteger-memory-arguments-slope":1,"appendByteString-cpu-arguments-intercept":1000,"appendByteString-cpu-arguments-slope":173,"appendByteString-memory-arguments-intercept":0,"appendByteString-memory-arguments-slope":1,"appendString-cpu-arguments-intercept":1000,"appendString-cpu-arguments-slope":59957,"appendString-memory-arguments-intercept":4,"appendString-memory-arguments-slope":1,"bData-cpu-arguments":11183,"bData-memory-arguments":32,"blake2b_256-cpu-arguments-intercept":201305,"blake2b_256-cpu-arguments-slope":8356,"blake2b_256-memory-arguments":4,"cekApplyCost-exBudgetCPU":16000,"cekApplyCost-exBudgetMemory":100,"cekBuiltinCost-exBudgetCPU":16000,"cekBuiltinCost-exBudgetMemory":100,"cekConstCost-exBudgetCPU":16000,"cekConstCost-exBudgetMemory":100,"cekDelayCost-exBudgetCPU":16000,"cekDelayCost-exBudgetMemory":100,"cekForceCost-exBudgetCPU":16000,"cekForceCost-exBudgetMemory":100,"cekLamCost-exBudgetCPU":16000,"cekLamCost-exBudgetMemory":100,"cekStartupCost-exBudgetCPU":100,"cekStartupCost-exBudgetMemory":100,"cekVarCost-exBudgetCPU":16000,"cekVarCost-exBudgetMemory":100,"chooseData-cpu-arguments":94375,"chooseData-memory-arguments":32,"chooseList-cpu-arguments":132994,"chooseList-memory-arguments":32,"chooseUnit-cpu-arguments":61462,"chooseUnit-memory-arguments":4,"consByteString-cpu-arguments-intercept":72010,"consByteString-cpu-arguments-slope":178,"consByteString-memory-arguments-intercept":0,"consByteString-memory-arguments-slope":1,"constrData-cpu-arguments":22151,"constrData-memory-arguments":32,"decodeUtf8-cpu-arguments-intercept":91189,"decodeUtf8-cpu-arguments-slope":769,"decodeUtf8-memory-arguments-intercept":4,"decodeUtf8-memory-arguments-slope":2,"divideInteger-cpu-arguments-constant":85848,"divideInteger-cpu-arguments-model-arguments-intercept":228465,"divideInteger-cpu-arguments-model-arguments-slope":122,"divideInteger-memory-arguments-intercept":0,"divideInteger-memory-arguments-minimum":1,"divideInteger-memory-arguments-slope":1,"encodeUtf8-cpu-arguments-intercept":1000,"encodeUtf8-cpu-arguments-slope":42921,"encodeUtf8-memory-arguments-intercept":4,"encodeUtf8-memory-arguments-slope":2,"equalsByteString-cpu-arguments-constant":24548,"equalsByteString-cpu-arguments-intercept":29498,"equalsByteString-cpu-arguments-slope":38,"equalsByteString-memory-arguments":1,"equalsData-cpu-arguments-intercept":898148,"equalsData-cpu-arguments-slope":27279,"equalsData-memory-arguments":1,"equalsInteger-cpu-arguments-intercept":51775,"equalsInteger-cpu-arguments-slope":558,"equalsInteger-memory-arguments":1,"equalsString-cpu-arguments-constant":39184,"equalsString-cpu-arguments-intercept":1000,"equalsString-cpu-arguments-slope":60594,"equalsString-memory-arguments":1,"fstPair-cpu-arguments":141895,"fstPair-memory-arguments":32,"headList-cpu-arguments":83150,"headList-memory-arguments":32,"iData-cpu-arguments":15299,"iData-memory-arguments":32,"ifThenElse-cpu-arguments":76049,"ifThenElse-memory-arguments":1,"indexByteString-cpu-arguments":13169,"indexByteString-memory-arguments":4,"lengthOfByteString-cpu-arguments":22100,"lengthOfByteString-memory-arguments":10,"lessThanByteString-cpu-arguments-intercept":28999,"lessThanByteString-cpu-arguments-slope":74,"lessThanByteString-memory-arguments":1,"lessThanEqualsByteString-cpu-arguments-intercept":28999,"lessThanEqualsByteString-cpu-arguments-slope":74,"lessThanEqualsByteString-memory-arguments":1,"lessThanEqualsInteger-cpu-arguments-intercept":43285,"lessThanEqualsInteger-cpu-arguments-slope":552,"lessThanEqualsInteger-memory-arguments":1,"lessThanInteger-cpu-arguments-intercept":44749,"lessThanInteger-cpu-arguments-slope":541,"lessThanInteger-memory-arguments":1,"listData-cpu-arguments":33852,"listData-memory-arguments":32,"mapData-cpu-arguments":68246,"mapData-memory-arguments":32,"mkCons-cpu-arguments":72362,"mkCons-memory-arguments":32,"mkNilData-cpu-arguments":7243,"mkNilData-memory-arguments":32,"mkNilPairData-cpu-arguments":7391,"mkNilPairData-memory-arguments":32,"mkPairData-cpu-arguments":11546,"mkPairData-memory-arguments":32,"modInteger-cpu-arguments-constant":85848,"modInteger-cpu-arguments-model-arguments-intercept":228465,"modInteger-cpu-arguments-model-arguments-slope":122,"modInteger-memory-arguments-intercept":0,"modInteger-memory-arguments-minimum":1,"modInteger-memory-arguments-slope":1,"multiplyInteger-cpu-arguments-intercept":90434,"multiplyInteger-cpu-arguments-slope":519,"multiplyInteger-memory-arguments-intercept":0,"multiplyInteger-memory-arguments-slope":1,"nullList-cpu-arguments":74433,"nullList-memory-arguments":32,"quotientInteger-cpu-arguments-constant":85848,"quotientInteger-cpu-arguments-model-arguments-intercept":228465,"quotientInteger-cpu-arguments-model-arguments-slope":122,"quotientInteger-memory-arguments-intercept":0,"quotientInteger-memory-arguments-minimum":1,"quotientInteger-memory-arguments-slope":1,"remainderInteger-cpu-arguments-constant":85848,"remainderInteger-cpu-arguments-model-arguments-intercept":228465,"remainderInteger-cpu-arguments-model-arguments-slope":122,"remainderInteger-memory-arguments-intercept":0,"remainderInteger-memory-arguments-minimum":1,"remainderInteger-memory-arguments-slope":1,"sha2_256-cpu-arguments-intercept":270652,"sha2_256-cpu-arguments-slope":22588,"sha2_256-memory-arguments":4,"sha3_256-cpu-arguments-intercept":1457325,"sha3_256-cpu-arguments-slope":64566,"sha3_256-memory-arguments":4,"sliceByteString-cpu-arguments-intercept":20467,"sliceByteString-cpu-arguments-slope":1,"sliceByteString-memory-arguments-intercept":4,"sliceByteString-memory-arguments-slope":0,"sndPair-cpu-arguments":141992,"sndPair-memory-arguments":32,"subtractInteger-cpu-arguments-intercept":100788,"subtractInteger-cpu-arguments-slope":420,"subtractInteger-memory-arguments-intercept":1,"subtractInteger-memory-arguments-slope":1,"tailList-cpu-arguments":81663,"tailList-memory-arguments":32,"trace-cpu-arguments":59498,"trace-memory-arguments":32,"unBData-cpu-arguments":20142,"unBData-memory-arguments":32,"unConstrData-cpu-arguments":24588,"unConstrData-memory-arguments":32,"unIData-cpu-arguments":20744,"unIData-memory-arguments":32,"unListData-cpu-arguments":25933,"unListData-memory-arguments":32,"unMapData-cpu-arguments":24623,"unMapData-memory-arguments":32,"verifyEd25519Signature-cpu-arguments-intercept":53384111,"verifyEd25519Signature-cpu-arguments-slope":14333,"verifyEd25519Signature-memory-arguments":10},"PlutusV2":{"addInteger-cpu-arguments-intercept":100788,"addInteger-cpu-arguments-slope":420,"addInteger-memory-arguments-intercept":1,"addInteger-memory-arguments-slope":1,"appendByteString-cpu-arguments-intercept":1000,"appendByteString-cpu-arguments-slope":173,"appendByteString-memory-arguments-intercept":0,"appendByteString-memory-arguments-slope":1,"appendString-cpu-arguments-intercept":1000,"appendString-cpu-arguments-slope":59957,"appendString-memory-arguments-intercept":4,"appendString-memory-arguments-slope":1,"bData-cpu-arguments":11183,"bData-memory-arguments":32,"blake2b_256-cpu-arguments-intercept":201305,"blake2b_256-cpu-arguments-slope":8356,"blake2b_256-memory-arguments":4,"cekApplyCost-exBudgetCPU":16000,"cekApplyCost-exBudgetMemory":100,"cekBuiltinCost-exBudgetCPU":16000,"cekBuiltinCost-exBudgetMemory":100,"cekConstCost-exBudgetCPU":16000,"cekConstCost-exBudgetMemory":100,"cekDelayCost-exBudgetCPU":16000,"cekDelayCost-exBudgetMemory":100,"cekForceCost-exBudgetCPU":16000,"cekForceCost-exBudgetMemory":100,"cekLamCost-exBudgetCPU":16000,"cekLamCost-exBudgetMemory":100,"cekStartupCost-exBudgetCPU":100,"cekStartupCost-exBudgetMemory":100,"cekVarCost-exBudgetCPU":16000,"cekVarCost-exBudgetMemory":100,"chooseData-cpu-arguments":94375,"chooseData-memory-arguments":32,"chooseList-cpu-arguments":132994,"chooseList-memory-arguments":32,"chooseUnit-cpu-arguments":61462,"chooseUnit-memory-arguments":4,"consByteString-cpu-arguments-intercept":72010,"consByteString-cpu-arguments-slope":178,"consByteString-memory-arguments-intercept":0,"consByteString-memory-arguments-slope":1,"constrData-cpu-arguments":22151,"constrData-memory-arguments":32,"decodeUtf8-cpu-arguments-intercept":91189,"decodeUtf8-cpu-arguments-slope":769,"decodeUtf8-memory-arguments-intercept":4,"decodeUtf8-memory-arguments-slope":2,"divideInteger-cpu-arguments-constant":85848,"divideInteger-cpu-arguments-model-arguments-intercept":228465,"divideInteger-cpu-arguments-model-arguments-slope":122,"divideInteger-memory-arguments-intercept":0,"divideInteger-memory-arguments-minimum":1,"divideInteger-memory-arguments-slope":1,"encodeUtf8-cpu-arguments-intercept":1000,"encodeUtf8-cpu-arguments-slope":42921,"encodeUtf8-memory-arguments-intercept":4,"encodeUtf8-memory-arguments-slope":2,"equalsByteString-cpu-arguments-constant":24548,"equalsByteString-cpu-arguments-intercept":29498,"equalsByteString-cpu-arguments-slope":38,"equalsByteString-memory-arguments":1,"equalsData-cpu-arguments-intercept":898148,"equalsData-cpu-arguments-slope":27279,"equalsData-memory-arguments":1,"equalsInteger-cpu-arguments-intercept":51775,"equalsInteger-cpu-arguments-slope":558,"equalsInteger-memory-arguments":1,"equalsString-cpu-arguments-constant":39184,"equalsString-cpu-arguments-intercept":1000,"equalsString-cpu-arguments-slope":60594,"equalsString-memory-arguments":1,"fstPair-cpu-arguments":141895,"fstPair-memory-arguments":32,"headList-cpu-arguments":83150,"headList-memory-arguments":32,"iData-cpu-arguments":15299,"iData-memory-arguments":32,"ifThenElse-cpu-arguments":76049,"ifThenElse-memory-arguments":1,"indexByteString-cpu-arguments":13169,"indexByteString-memory-arguments":4,"lengthOfByteString-cpu-arguments":22100,"lengthOfByteString-memory-arguments":10,"lessThanByteString-cpu-arguments-intercept":28999,"lessThanByteString-cpu-arguments-slope":74,"lessThanByteString-memory-arguments":1,"lessThanEqualsByteString-cpu-arguments-intercept":28999,"lessThanEqualsByteString-cpu-arguments-slope":74,"lessThanEqualsByteString-memory-arguments":1,"lessThanEqualsInteger-cpu-arguments-intercept":43285,"lessThanEqualsInteger-cpu-arguments-slope":552,"lessThanEqualsInteger-memory-arguments":1,"lessThanInteger-cpu-arguments-intercept":44749,"lessThanInteger-cpu-arguments-slope":541,"lessThanInteger-memory-arguments":1,"listData-cpu-arguments":33852,"listData-memory-arguments":32,"mapData-cpu-arguments":68246,"mapData-memory-arguments":32,"mkCons-cpu-arguments":72362,"mkCons-memory-arguments":32,"mkNilData-cpu-arguments":7243,"mkNilData-memory-arguments":32,"mkNilPairData-cpu-arguments":7391,"mkNilPairData-memory-arguments":32,"mkPairData-cpu-arguments":11546,"mkPairData-memory-arguments":32,"modInteger-cpu-arguments-constant":85848,"modInteger-cpu-arguments-model-arguments-intercept":228465,"modInteger-cpu-arguments-model-arguments-slope":122,"modInteger-memory-arguments-intercept":0,"modInteger-memory-arguments-minimum":1,"modInteger-memory-arguments-slope":1,"multiplyInteger-cpu-arguments-intercept":90434,"multiplyInteger-cpu-arguments-slope":519,"multiplyInteger-memory-arguments-intercept":0,"multiplyInteger-memory-arguments-slope":1,"nullList-cpu-arguments":74433,"nullList-memory-arguments":32,"quotientInteger-cpu-arguments-constant":85848,"quotientInteger-cpu-arguments-model-arguments-intercept":228465,"quotientInteger-cpu-arguments-model-arguments-slope":122,"quotientInteger-memory-arguments-intercept":0,"quotientInteger-memory-arguments-minimum":1,"quotientInteger-memory-arguments-slope":1,"remainderInteger-cpu-arguments-constant":85848,"remainderInteger-cpu-arguments-model-arguments-intercept":228465,"remainderInteger-cpu-arguments-model-arguments-slope":122,"remainderInteger-memory-arguments-intercept":0,"remainderInteger-memory-arguments-minimum":1,"remainderInteger-memory-arguments-slope":1,"serialiseData-cpu-arguments-intercept":955506,"serialiseData-cpu-arguments-slope":213312,"serialiseData-memory-arguments-intercept":0,"serialiseData-memory-arguments-slope":2,"sha2_256-cpu-arguments-intercept":270652,"sha2_256-cpu-arguments-slope":22588,"sha2_256-memory-arguments":4,"sha3_256-cpu-arguments-intercept":1457325,"sha3_256-cpu-arguments-slope":64566,"sha3_256-memory-arguments":4,"sliceByteString-cpu-arguments-intercept":20467,"sliceByteString-cpu-arguments-slope":1,"sliceByteString-memory-arguments-intercept":4,"sliceByteString-memory-arguments-slope":0,"sndPair-cpu-arguments":141992,"sndPair-memory-arguments":32,"subtractInteger-cpu-arguments-intercept":100788,"subtractInteger-cpu-arguments-slope":420,"subtractInteger-memory-arguments-intercept":1,"subtractInteger-memory-arguments-slope":1,"tailList-cpu-arguments":81663,"tailList-memory-arguments":32,"trace-cpu-arguments":59498,"trace-memory-arguments":32,"unBData-cpu-arguments":20142,"unBData-memory-arguments":32,"unConstrData-cpu-arguments":24588,"unConstrData-memory-arguments":32,"unIData-cpu-arguments":20744,"unIData-memory-arguments":32,"unListData-cpu-arguments":25933,"unListData-memory-arguments":32,"unMapData-cpu-arguments":24623,"unMapData-memory-arguments":32,"verifyEcdsaSecp256k1Signature-cpu-arguments":43053543,"verifyEcdsaSecp256k1Signature-memory-arguments":10,"verifyEd25519Signature-cpu-arguments-intercept":53384111,"verifyEd25519Signature-cpu-arguments-slope":14333,"verifyEd25519Signature-memory-arguments":10,"verifySchnorrSecp256k1Signature-cpu-arguments-intercept":43574283,"verifySchnorrSecp256k1Signature-cpu-arguments-slope":26308,"verifySchnorrSecp256k1Signature-memory-arguments":10},"PlutusV3":{"addInteger-cpu-arguments-intercept":100788,"addInteger-cpu-arguments-slope":420,"addInteger-memory-arguments-intercept":1,"addInteger-memory-arguments-slope":1,"appendByteString-cpu-arguments-intercept":1000,"appendByteString-cpu-arguments-slope":173,"appendByteString-memory-arguments-intercept":0,"appendByteString-memory-arguments-slope":1,"appendString-cpu-arguments-intercept":1000,"appendString-cpu-arguments-slope":59957,"appendString-memory-arguments-intercept":4,"appendString-memory-arguments-slope":1,"bData-cpu-arguments":11183,"bData-memory-arguments":32,"blake2b_256-cpu-arguments-intercept":201305,"blake2b_256-cpu-arguments-slope":8356,"blake2b_256-memory-arguments":4,"cekApplyCost-exBudgetCPU":16000,"cekApplyCost-exBudgetMemory":100,"cekBuiltinCost-exBudgetCPU":16000,"cekBuiltinCost-exBudgetMemory":100,"cekConstCost-exBudgetCPU":16000,"cekConstCost-exBudgetMemory":100,"cekDelayCost-exBudgetCPU":16000,"cekDelayCost-exBudgetMemory":100,"cekForceCost-exBudgetCPU":16000,"cekForceCost-exBudgetMemory":100,"cekLamCost-exBudgetCPU":16000,"cekLamCost-exBudgetMemory":100,"cekStartupCost-exBudgetCPU":100,"cekStartupCost-exBudgetMemory":100,"cekVarCost-exBudgetCPU":16000,"cekVarCost-exBudgetMemory":100,"chooseData-cpu-arguments":94375,"chooseData-memory-arguments":32,"chooseList-cpu-arguments":132994,"chooseList-memory-arguments":32,"chooseUnit-cpu-arguments":61462,"chooseUnit-memory-arguments":4,"consByteString-cpu-arguments-intercept":72010,"consByteString-cpu-arguments-slope":178,"consByteString-memory-arguments-intercept":0,"consByteString-memory-arguments-slope":1,"constrData-cpu-arguments":22151,"constrData-memory-arguments":32,"decodeUtf8-cpu-arguments-intercept":91189,"decodeUtf8-cpu-arguments-slope":769,"decodeUtf8-memory-arguments-intercept":4,"decodeUtf8-memory-arguments-slope":2,"divideInteger-cpu-arguments-constant":85848,"divideInteger-cpu-arguments-model-arguments-c00":123203,"divideInteger-cpu-arguments-model-arguments-c01":7305,"divideInteger-cpu-arguments-model-arguments-c02":-900,"divideInteger-cpu-arguments-model-arguments-c10":1716,"divideInteger-cpu-arguments-model-arguments-c11":549,"divideInteger-cpu-arguments-model-arguments-c20":57,"divideInteger-cpu-arguments-model-arguments-minimum":85848,"divideInteger-memory-arguments-intercept":0,"divideInteger-memory-arguments-minimum":1,"divideInteger-memory-arguments-slope":1,"encodeUtf8-cpu-arguments-intercept":1000,"encodeUtf8-cpu-arguments-slope":42921,"encodeUtf8-memory-arguments-intercept":4,"encodeUtf8-memory-arguments-slope":2,"equalsByteString-cpu-arguments-constant":24548,"equalsByteString-cpu-arguments-intercept":29498,"equalsByteString-cpu-arguments-slope":38,"equalsByteString-memory-arguments":1,"equalsData-cpu-arguments-intercept":898148,"equalsData-cpu-arguments-slope":27279,"equalsData-memory-arguments":1,"equalsInteger-cpu-arguments-intercept":51775,"equalsInteger-cpu-arguments-slope":558,"equalsInteger-memory-arguments":1,"equalsString-cpu-arguments-constant":39184,"equalsString-cpu-arguments-intercept":1000,"equalsString-cpu-arguments-slope":60594,"equalsString-memory-arguments":1,"fstPair-cpu-arguments":141895,"fstPair-memory-arguments":32,"headList-cpu-arguments":83150,"headList-memory-arguments":32,"iData-cpu-arguments":15299,"iData-memory-arguments":32,"ifThenElse-cpu-arguments":76049,"ifThenElse-memory-arguments":1,"indexByteString-cpu-arguments":13169,"indexByteString-memory-arguments":4,"lengthOfByteString-cpu-arguments":22100,"lengthOfByteString-memory-arguments":10,"lessThanByteString-cpu-arguments-intercept":28999,"lessThanByteString-cpu-arguments-slope":74,"lessThanByteString-memory-arguments":1,"lessThanEqualsByteString-cpu-arguments-intercept":28999,"lessThanEqualsByteString-cpu-arguments-slope":74,"lessThanEqualsByteString-memory-arguments":1,"lessThanEqualsInteger-cpu-arguments-intercept":43285,"lessThanEqualsInteger-cpu-arguments-slope":552,"lessThanEqualsInteger-memory-arguments":1,"lessThanInteger-cpu-arguments-intercept":44749,"lessThanInteger-cpu-arguments-slope":541,"lessThanInteger-memory-arguments":1,"listData-cpu-arguments":33852,"listData-memory-arguments":32,"mapData-cpu-arguments":68246,"mapData-memory-arguments":32,"mkCons-cpu-arguments":72362,"mkCons-memory-arguments":32,"mkNilData-cpu-arguments":7243,"mkNilData-memory-arguments":32,"mkNilPairData-cpu-arguments":7391,"mkNilPairData-memory-arguments":32,"mkPairData-cpu-arguments":11546,"mkPairData-memory-arguments":32,"modInteger-cpu-arguments-constant":85848,"modInteger-cpu-arguments-model-arguments-c00":123203,"modInteger-cpu-arguments-model-arguments-c01":7305,"modInteger-cpu-arguments-model-arguments-c02":-900,"modInteger-cpu-arguments-model-arguments-c10":1716,"modInteger-cpu-arguments-model-arguments-c11":549,"modInteger-cpu-arguments-model-arguments-c20":57,"modInteger-cpu-arguments-model-arguments-minimum":85848,"modInteger-memory-arguments-intercept":0,"modInteger-memory-arguments-slope":1,"multiplyInteger-cpu-arguments-intercept":90434,"multiplyInteger-cpu-arguments-slope":519,"multiplyInteger-memory-arguments-intercept":0,"multiplyInteger-memory-arguments-slope":1,"nullList-cpu-arguments":74433,"nullList-memory-arguments":32,"quotientInteger-cpu-arguments-constant":85848,"quotientInteger-cpu-arguments-model-arguments-c00":123203,"quotientInteger-cpu-arguments-model-arguments-c01":7305,"quotientInteger-cpu-arguments-model-arguments-c02":-900,"quotientInteger-cpu-arguments-model-arguments-c10":1716,"quotientInteger-cpu-arguments-model-arguments-c11":549,"quotientInteger-cpu-arguments-model-arguments-c20":57,"quotientInteger-cpu-arguments-model-arguments-minimum":85848,"quotientInteger-memory-arguments-intercept":0,"quotientInteger-memory-arguments-slope":1,"remainderInteger-cpu-arguments-constant":1,"remainderInteger-cpu-arguments-model-arguments-c00":85848,"remainderInteger-cpu-arguments-model-arguments-c01":123203,"remainderInteger-cpu-arguments-model-arguments-c02":7305,"remainderInteger-cpu-arguments-model-arguments-c10":-900,"remainderInteger-cpu-arguments-model-arguments-c11":1716,"remainderInteger-cpu-arguments-model-arguments-c20":549,"remainderInteger-cpu-arguments-model-arguments-minimum":57,"remainderInteger-memory-arguments-intercept":85848,"remainderInteger-memory-arguments-minimum":0,"remainderInteger-memory-arguments-slope":1,"serialiseData-cpu-arguments-intercept":955506,"serialiseData-cpu-arguments-slope":213312,"serialiseData-memory-arguments-intercept":0,"serialiseData-memory-arguments-slope":2,"sha2_256-cpu-arguments-intercept":270652,"sha2_256-cpu-arguments-slope":22588,"sha2_256-memory-arguments":4,"sha3_256-cpu-arguments-intercept":1457325,"sha3_256-cpu-arguments-slope":64566,"sha3_256-memory-arguments":4,"sliceByteString-cpu-arguments-intercept":20467,"sliceByteString-cpu-arguments-slope":1,"sliceByteString-memory-arguments-intercept":4,"sliceByteString-memory-arguments-slope":0,"sndPair-cpu-arguments":141992,"sndPair-memory-arguments":32,"subtractInteger-cpu-arguments-intercept":100788,"subtractInteger-cpu-arguments-slope":420,"subtractInteger-memory-arguments-intercept":1,"subtractInteger-memory-arguments-slope":1,"tailList-cpu-arguments":81663,"tailList-memory-arguments":32,"trace-cpu-arguments":59498,"trace-memory-arguments":32,"unBData-cpu-arguments":20142,"unBData-memory-arguments":32,"unConstrData-cpu-arguments":24588,"unConstrData-memory-arguments":32,"unIData-cpu-arguments":20744,"unIData-memory-arguments":32,"unListData-cpu-arguments":25933,"unListData-memory-arguments":32,"unMapData-cpu-arguments":24623,"unMapData-memory-arguments":32,"verifyEcdsaSecp256k1Signature-cpu-arguments":43053543,"verifyEcdsaSecp256k1Signature-memory-arguments":10,"verifyEd25519Signature-cpu-arguments-intercept":53384111,"verifyEd25519Signature-cpu-arguments-slope":14333,"verifyEd25519Signature-memory-arguments":10,"verifySchnorrSecp256k1Signature-cpu-arguments-intercept":43574283,"verifySchnorrSecp256k1Signature-cpu-arguments-slope":26308,"verifySchnorrSecp256k1Signature-memory-arguments":10,"cekConstrCost-exBudgetCPU":16000,"cekConstrCost-exBudgetMemory":100,"cekCaseCost-exBudgetCPU":16000,"cekCaseCost-exBudgetMemory":100,"bls12_381_G1_add-cpu-arguments":962335,"bls12_381_G1_add-memory-arguments":18,"bls12_381_G1_compress-cpu-arguments":2780678,"bls12_381_G1_compress-memory-arguments":6,"bls12_381_G1_equal-cpu-arguments":442008,"bls12_381_G1_equal-memory-arguments":1,"bls12_381_G1_hashToGroup-cpu-arguments-intercept":52538055,"bls12_381_G1_hashToGroup-cpu-arguments-slope":3756,"bls12_381_G1_hashToGroup-memory-arguments":18,"bls12_381_G1_neg-cpu-arguments":267929,"bls12_381_G1_neg-memory-arguments":18,"bls12_381_G1_scalarMul-cpu-arguments-intercept":76433006,"bls12_381_G1_scalarMul-cpu-arguments-slope":8868,"bls12_381_G1_scalarMul-memory-arguments":18,"bls12_381_G1_uncompress-cpu-arguments":52948122,"bls12_381_G1_uncompress-memory-arguments":18,"bls12_381_G2_add-cpu-arguments":1995836,"bls12_381_G2_add-memory-arguments":36,"bls12_381_G2_compress-cpu-arguments":3227919,"bls12_381_G2_compress-memory-arguments":12,"bls12_381_G2_equal-cpu-arguments":901022,"bls12_381_G2_equal-memory-arguments":1,"bls12_381_G2_hashToGroup-cpu-arguments-intercept":166917843,"bls12_381_G2_hashToGroup-cpu-arguments-slope":4307,"bls12_381_G2_hashToGroup-memory-arguments":36,"bls12_381_G2_neg-cpu-arguments":284546,"bls12_381_G2_neg-memory-arguments":36,"bls12_381_G2_scalarMul-cpu-arguments-intercept":158221314,"bls12_381_G2_scalarMul-cpu-arguments-slope":26549,"bls12_381_G2_scalarMul-memory-arguments":36,"bls12_381_G2_uncompress-cpu-arguments":74698472,"bls12_381_G2_uncompress-memory-arguments":36,"bls12_381_finalVerify-cpu-arguments":333849714,"bls12_381_finalVerify-memory-arguments":1,"bls12_381_millerLoop-cpu-arguments":254006273,"bls12_381_millerLoop-memory-arguments":72,"bls12_381_mulMlResult-cpu-arguments":2174038,"bls12_381_mulMlResult-memory-arguments":72,"keccak_256-cpu-arguments-intercept":2261318,"keccak_256-cpu-arguments-slope":64571,"keccak_256-memory-arguments":4,"blake2b_224-cpu-arguments-intercept":207616,"blake2b_224-cpu-arguments-slope":8310,"blake2b_224-memory-arguments":4,"integerToByteString-cpu-arguments-c0":1293828,"integerToByteString-cpu-arguments-c1":28716,"integerToByteString-cpu-arguments-c2":63,"integerToByteString-memory-arguments-intercept":0,"integerToByteString-memory-arguments-slope":1,"byteStringToInteger-cpu-arguments-c0":1006041,"byteStringToInteger-cpu-arguments-c1":43623,"byteStringToInteger-cpu-arguments-c2":251,"byteStringToInteger-memory-arguments-intercept":0,"byteStringToInteger-memory-arguments-slope":1}},"cost_models_raw":{"PlutusV1":[100788,420,1,1,1000,173,0,1,1000,59957,4,1,11183,32,201305,8356,4,16000,100,16000,100,16000,100,16000,100,16000,100,16000,100,100,100,16000,100,94375,32,132994,32,61462,4,72010,178,0,1,22151,32,91189,769,4,2,85848,228465,122,0,1,1,1000,42921,4,2,24548,29498,38,1,898148,27279,1,51775,558,1,39184,1000,60594,1,141895,32,83150,32,15299,32,76049,1,13169,4,22100,10,28999,74,1,28999,74,1,43285,552,1,44749,541,1,33852,32,68246,32,72362,32,7243,32,7391,32,11546,32,85848,228465,122,0,1,1,90434,519,0,1,74433,32,85848,228465,122,0,1,1,85848,228465,122,0,1,1,270652,22588,4,1457325,64566,4,20467,1,4,0,141992,32,100788,420,1,1,81663,32,59498,32,20142,32,24588,32,20744,32,25933,32,24623,32,53384111,14333,10],"PlutusV2":[100788,420,1,1,1000,173,0,1,1000,59957,4,1,11183,32,201305,8356,4,16000,100,16000,100,16000,100,16000,100,16000,100,16000,100,100,100,16000,100,94375,32,132994,32,61462,4,72010,178,0,1,22151,32,91189,769,4,2,85848,228465,122,0,1,1,1000,42921,4,2,24548,29498,38,1,898148,27279,1,51775,558,1,39184,1000,60594,1,141895,32,83150,32,15299,32,76049,1,13169,4,22100,10,28999,74,1,28999,74,1,43285,552,1,44749,541,1,33852,32,68246,32,72362,32,7243,32,7391,32,11546,32,85848,228465,122,0,1,1,90434,519,0,1,74433,32,85848,228465,122,0,1,1,85848,228465,122,0,1,1,955506,213312,0,2,270652,22588,4,1457325,64566,4,20467,1,4,0,141992,32,100788,420,1,1,81663,32,59498,32,20142,32,24588,32,20744,32,25933,32,24623,32,43053543,10,53384111,14333,10,43574283,26308,10],"PlutusV3":[100788,420,1,1,1000,173,0,1,1000,59957,4,1,11183,32,201305,8356,4,16000,100,16000,100,16000,100,16000,100,16000,100,16000,100,100,100,16000,100,94375,32,132994,32,61462,4,72010,178,0,1,22151,32,91189,769,4,2,85848,123203,7305,-900,1716,549,57,85848,0,1,1,1000,42921,4,2,24548,29498,38,1,898148,27279,1,51775,558,1,39184,1000,60594,1,141895,32,83150,32,15299,32,76049,1,13169,4,22100,10,28999,74,1,28999,74,1,43285,552,1,44749,541,1,33852,32,68246,32,72362,32,7243,32,7391,32,11546,32,85848,123203,7305,-900,1716,549,57,85848,0,1,90434,519,0,1,74433,32,85848,123203,7305,-900,1716,549,57,85848,0,1,1,85848,123203,7305,-900,1716,549,57,85848,0,1,955506,213312,0,2,270652,22588,4,1457325,64566,4,20467,1,4,0,141992,32,100788,420,1,1,81663,32,59498,32,20142,32,24588,32,20744,32,25933,32,24623,32,43053543,10,53384111,14333,10,43574283,26308,10,16000,100,16000,100,962335,18,2780678,6,442008,1,52538055,3756,18,267929,18,76433006,8868,18,52948122,18,1995836,36,3227919,12,901022,1,166917843,4307,36,284546,36,158221314,26549,36,74698472,36,333849714,1,254006273,72,2174038,72,2261318,64571,4,207616,8310,4,1293828,28716,63,0,1,1006041,43623,251,0,1]},"price_mem":0.0577,"price_step":0.0000721,"max_tx_ex_mem":"14000000","max_tx_ex_steps":"10000000000","max_block_ex_mem":"62000000","max_block_ex_steps":"20000000000","max_val_size":"5000","collateral_percent":150,"max_collateral_inputs":3,"coins_per_utxo_size":"4310","coins_per_utxo_word":"4310","pvt_motion_no_confidence":0.51,"pvt_committee_normal":0.51,"pvt_committee_no_confidence":0.51,"pvt_hard_fork_initiation":0.51,"dvt_motion_no_confidence":0.67,"dvt_committee_normal":0.67,"dvt_committee_no_confidence":0.6,"dvt_update_to_constitution":0.75,"dvt_hard_fork_initiation":0.6,"dvt_p_p_network_group":0.67,"dvt_p_p_economic_group":0.67,"dvt_p_p_technical_group":0.67,"dvt_p_p_gov_group":0.75,"dvt_treasury_withdrawal":0.67,"committee_min_size":"7","committee_max_term_length":"146","gov_action_lifetime":"6","gov_action_deposit":"100000000000","drep_deposit":"500000000","drep_activity":"20","pvtpp_security_group":0.51,"pvt_p_p_security_group":0.51,"min_fee_ref_script_cost_per_byte":15}'
		
			return JSON.parse(parameters);
		}
	}
]);

// .getChangeAddress(), .getUnusedAddresses(),
// .signTx(), .submitTx()

// Check out https://cardano.build for lot's of Dev Resources, Tools etc!

// USING AS DATA STORE
// - Generate UUID using browser
// - Sign UUID using browser SignData to create Encryption Key
// - Save and Search for encrypted data in local storage using signedUUID as key

$(function () {
	//Just a little break to make sure all the wallets have finished initialising.
	entityos._util.factory.core();
	setTimeout(learnInit, 2000);
});

function learnInit()
{
	eos.invoke('learn-init');
}

