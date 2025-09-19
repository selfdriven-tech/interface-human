import { EntityOS } from '/site/2152/entityos.module.class-1.0.0.js';
const eos = new EntityOS();

eos.add(
[
	{
		name: 'learn-init',
		code: function ()
		{
			console.log('We have an opportunity to descentralise & rehumanise our society.')
			eos.invoke('learn-init-cardano');
		}
	},
	{
		name: 'learn-init-cardano',
		code: function ()
		{
			console.log(window.cardano);

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

			//Check for Wallets

			_.each(_cardano.wallets, function (_wallet)
			{
				_wallet.enabled = (_cardano.data[_wallet.name] != undefined)
			});

			eos.set(
			{
				scope: 'learn',
				context: 'cardano',
				value: _cardano
			});

			var wallets = eos.set(
			{
				scope: 'learn',
				context: 'wallets',
				value: _.filter(_cardano.wallets, function (_wallet) {return _wallet.enabled})
			});

			console.log(_cardano);
			console.log(wallets)

            if (wallets.length == 0)
            {
			    var learnView = eos.view()

                learnView.add(
                [
                    '<div class="text-center mt-6">',
                        '<div class="fw-bold" style="color:#fadb86; font-size:1.2rem;">There no wallets available to connect to, please install a wallet to continue.</div>',
                        '<div class="mt-4"><a href="https://www.cardanocube.io/collections/wallets" target="_blank" style="color:#fadb86; font-size:1.2rem;">Cardano Wallets <i class="fe fe-external-link"></a></div>',
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
                });

                $('#learn-view').html('');
            }
		}
	},
    {
		name: 'learn-wallet-connect',
		code: function (param)
		{
			eos.invoke('util-view-popover-hide')
			console.log('Connect to Wallet.')
			console.log(param);
			var walletName = entityos._util.param.get(param.dataContext, 'name').value;
            eos.set({scope: 'learn', context: 'wallet-name', value: walletName});
            console.log(walletName);
            eos.invoke('learn-wallet-balance', param)
		}
	},
    {
		name: 'learn-wallet-balance',
		code: function (param)
		{
			console.log('Wallet Balance.')

            //var wallet = eos.get({scope: 'learn', context: 'wallet'});

            var walletName = eos.get({scope: 'learn', context: 'wallet-name'});

            window.cardano[walletName].enable().then(function (wallet)
            {
                console.log(wallet);
                eos.set({scope: 'learn', context: 'wallet', value: wallet});
            
                //wallet.getUtxos().then(function(data)
                wallet.getBalance().then(function(dataAsCBORHex)
                {
                    console.log(dataAsCBORHex)

                    var dataAsBuffer = hex2buffer(dataAsCBORHex);
                    var data = CBOR.decode(dataAsBuffer)
                    var lovelace = data[0];
                    var otherAssets = data[1];
                    console.log(otherAssets)

                    var _otherAssets = {};

                    if (otherAssets != undefined)
                    {
                        _.each(otherAssets, function (otherAssetValue, otherAssetKey)
                        {
                            _.each(otherAssetValue, function  (_otherAssetValue, _otherAssetKey)
                            {
                                _otherAssets[chars2Text(_otherAssetKey)] = _otherAssetValue;
                            });
                        })
                    }

                    console.log(lovelace);
                    console.log(_otherAssets);
                });
            });
        }
	}

]);

$(function ()
{
    setTimeout(learnInit, 2000);
});

function learnInit()
{
    eos.invoke('learn-init');
}