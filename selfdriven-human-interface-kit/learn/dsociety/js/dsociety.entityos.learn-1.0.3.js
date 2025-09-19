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
            if (cardanoData == undefined) {cardanoData = {}}

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
				value: _.filter(_cardano.wallets, function (_wallet) {return _wallet.enabled})
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
                    '<div class="text-center mt-6">',
                        '<div class="fw-bold" style="color:#f05b4f; font-size:1.2rem;">There no wallets available to connect to, please install a wallet to continue.</div>',
                        '<div class="mt-4"><a href="https://www.cardanocube.io/collections/wallets" target="_blank" style="color:#f05b4f; font-size:1.2rem;">Cardano Wallets <i class="fe fe-external-link"></a></div>',
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
                            '<a href="#" class="entityos-click"',
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
                    offset: [0,10],
					sanitize: false
                }).on('show.bs.popover', function ()
				{
					$('#learn-view').html('');
				});

                $('#learn-view').html('<div class="text-center mt-6" style="font-family: PT Mono, monospace; font-size: 1rem; color:#f05b4f;"><div>Please connect to a wallet to continue.</div><div class="mt-2">Thank you, Turlia.</a>');
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

            eos.set({scope: 'learn', context: 'wallet-name', value: walletName});

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

            var walletName = eos.get({scope: 'learn', context: 'wallet-name'});

			var wallets = eos.get({scope: 'learn', context: 'wallets'});

			var _wallet = _.find(wallets, function (wallet) {return wallet.name == walletName})
			if (_wallet != undefined)
			{
				$('#learn-connect').html(_wallet.caption)
			}

			// [10] Get a wallet object i.e. with the functions that can use to interact with the wallet (see Dev Tools > Console)

            window.cardano[walletName].enable().then(function (wallet)
            {
                console.log(wallet);

				// [11] Run the getBalance function
				// It returns data in the Concise Binary Object Representation "CBOR" Hex format.
				// So if you look at it, it want make sense, which is why use entityos._util.hex.CBORtoArray to convert it!
				
                wallet.getBalance().then(function(dataAsCBORHex)
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
                            _.each(otherAssetValue, function  (_otherAssetValue, _otherAssetKey)
                            {
                                _otherAssets[entityos._util.convert.charCodesToText(_otherAssetKey)] = _otherAssetValue;
                            });
                        });

						console.log('- which decodes to:');
						console.log(_otherAssets);
                    }

					var learnWalletAssetsView = eos.view();

					learnWalletAssetsView.add(
					[
						'<div style="background-color:rgba(0,0,0,0.7); border-radius: 6px; padding:16px;" class="mx-auto w-md-25 mt-6">',
							'<div style="font-family: PT Mono, monospace; font-size: 1.65rem; color:#baadab;" class="fw-bold text-center mb-1">',
								(parseInt(lovelace) / 1000000), ' ADA',
							'</div>'
					]);

					_.each(_otherAssets, function (_otherAssetValue, _otherAssetKey)
					{
						learnWalletAssetsView.add(
						[
							'<div style="font-family: PT Mono, monospace; font-size: 1rem; color:#baadab;" class="text-center">',
								 _otherAssetKey, ' | ', _otherAssetValue, 
							'</div>'
						]);
					});

					learnWalletAssetsView.add('</div>');

					learnWalletAssetsView.render('#learn-view')

                });
            });
        }
	}
]);

// Show more functions - next one: wallet.getUtxos().then(function(data) {});
// THEN:
// .getChangeAddress(), .getNetworkId(), .getRewardAddresses(), .getUnusedAddresses(), .getUsedAddresse()
// .signData(), .signTx(), .submitTx()

// Check out https://buildingoncardano.dev for lot's of Dev Resources, Tools etc!

$(function ()
{
	//Just a little break to make sure all the wallets have finished initialising.
    setTimeout(learnInit, 2000);
});

function learnInit()
{
    eos.invoke('learn-init');
}