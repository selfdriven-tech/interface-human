
$(function()
{
    app =
    {
        controller: entityos._util.controller.code,
        vq: entityos._util.view.queue,
        get: entityos._util.data.get,
        set: entityos._util.data.set,
        invoke: entityos._util.controller.invoke,
        add: entityos._util.controller.add,
        show: entityos._util.view.queue.show
    };

    entityos._util.factory.export();
    entityos._util.controller.invoke('app-init'); 
});


entityos._util.controller.add(
{
    name: 'app-init',
    code: function ()
    {
       var uriContext = window.location.pathname;

       if (uriContext != '/app')
       {
            var uriContextData = _.replace(uriContext, '/app/', '');

            if (uriContextData != '')
            {
               //specific wallet
            }
       }
    }
});

entityos._util.controller.add(
{
    name: 'wallet-init',
    code: function ()
    {
        // import BrowserWallet
        //import { BrowserWallet } from '@meshsdk/core';

        // connect to a wallet
        //const wallet = await BrowserWallet.enable('eternl');

        // get assets in wallet
        //const assets = await wallet.getAssets();
    }
});





