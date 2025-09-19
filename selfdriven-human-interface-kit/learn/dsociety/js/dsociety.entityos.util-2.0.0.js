import { EntityOS } from '/site/2152/entityos.module.class-1.0.0.js';

const eos = new EntityOS();

// dSOCIETY | LEARN-BY-EXAMPLE

// Getting a "foot-hold" on twith Self-Sovereign Identity (SSI) tech by creating a DID.

// Code is free to use.
// It is only provided as to aid learning .

eos.add(
[
	{
		name: 'util-init',
		code: function ()
		{
			console.log('We have an opportunity to descentralise & rehumanise our society.');
			console.log('https://dsociety.io\n\n')
		}
	},
	{
		name: 'dsociety-util-generate-random-text',
		code: function (param)
		{
			const data = eos.get(
			{
				scope: 'dsociety-util-generate-random-text'
			});
		
			var utilView = eos.view();

			const generatedText = eos.invoke('util-generate-random-text', {referenceNumber: (data.reference==1), length: data.length})

			utilView.add(
			[
				'<div style="background-color:rgba(0,0,0,0.7); border-radius: 6px; padding:16px;" class="w-100 w-md-50 mt-2 mb-4">',
					'<div style="font-family: PT Mono, monospace; font-size: 1rem; color:#baadab; word-break: break-all;">',
						generatedText,
					'</div>',
					
                '</div>'
			]);

			utilView.render('#util-view')
		}
	}
]);

$(function ()
{
	eos.invoke('util-init');
});
