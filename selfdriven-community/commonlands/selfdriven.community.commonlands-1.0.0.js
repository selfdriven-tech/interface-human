import { EntityOS } from '/site/2186/entityos.module.class-1.0.0.js';
const eos = new EntityOS();

/*
	Powered by:
	- entityos.cloud
	- cardano.org

	https://slfdrvn.community/commonlands
    -d: https://entityos.iagon.net/apps/selfdriven/community/commonlands.html
*/

eos.add(
[
	{
		name: 'community-set-options',
		code: function (param)
		{
			eos.set(
			{
				scope: 'community-wallet-auth-using-policy',
				context: 'auth',
				value: 
				{
					policy: 'f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a',
					apikey: 'bc9a313c-13f6-4fa2-93c0-e7ada5ef97e7',
					_apikey: '888c7eac-4b9b-465f-baa8-ea3137f4ccd6',
					site: 'f74bf2d4-3ff6-4b47-967d-80110e0cabf5',
					_site: 'a210dba4-cd65-4a4f-a9e2-8432b2c01256'
				}
			});
		}
	},
	{
		name: 'community-dashboard-show',
		code: function (param)
		{
			var data = eos.get({scope: 'community'});

            $('#commonlands-col-1').removeClass('col-md-7').addClass('col-md-9');
            $('#commonlands-col-2').removeClass('col-md-5').addClass('col-md-3');
            $('#commonlands-header-md').css('font-size', '3rem')
            
			var communityDashboardView = eos.view();

			communityDashboardView.add(
			[
				'<div class="row mt-2 mb-4">'
			]);

            communityDashboardView.add(
			[
				'<div class="col-12 col-md-6 mt-3 mt-md-3">',
					'<div id="community-learning-templates" class="card shadow-lg mt-3">',
						'<div class="card-body border-bottom text-center">',
							'<h5 class="mb-0 font-weight-bold">Learning</h5>',
						'</div>',
						'<div class="card-body">',
							'<div class="row">',
								'<div class="col-12 text-center">',
									'<div><a href="https://skillzeb.io/template-explorer/commonlands" target="_blank">',
										'Getting Started',
									'</a></div>',
									
								'</div>',
								'<div class="col-12 text-center mt-2">',
									'<div><a href="https://skillzeb.io/template-explorer/commonlands" target="_blank">',
										'Using the App',
									'</a></div>',
								'</div>',
								'<div class="col-12 text-center mt-2">',
									'<div><a href="https://levelup.slfdrvn.app" target="_blank">',
										'Level Up App',
									'</a></div>',
									'<div class="text-muted mt-1" style="font-size: 0.6rem;">',
										'Powered by selfdriven',
									'</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>',
				'</div>'
			]);

            communityDashboardView.add(
			[
				'<div class="col-12 col-md-6 mt-3 mt-md-3">',
					'<div id="community-learning-templates" class="card shadow-lg mt-3">',
						'<div class="card-body border-bottom text-center">',
							'<h5 class="mb-0 font-weight-bold">Resources</h5>',
						'</div>',
						'<div class="card-body">',
							'<div class="row">',
								'<div class="col-12 text-center">',
									'<div><a href="https://commonlands.org" target="_blank">',
										'commonlands.org',
									'</a></div>',
								'</div>',
								'<div class="col-12 mt-2 text-center">',
									'<div><a href="https://commonlands.zendesk.com/hc/en-us/sections/15354324893463-App-Tutorials" target="_blank">',
										'App Tutorials',
									'</a></div>',
								'</div>',
								'<div class="col-12 mt-2 text-center">',
									'<div><a href="https://web.tresorit.com/l/qGhWt#uLbVPhyUOG4yPWS613IbvA" target="_blank">',
										'Step by Step Explanation',
									'</a></div>',
								'</div>',

								
							'</div>',
						'</div>',
					'</div>',
				'</div>'
			]);
			
			communityDashboardView.add(
			[
				'</div>'
			]);

			communityDashboardView.render('#community-dashboard-view');
		}
	}
]);

$(function () {
	//Just a little break to make sure all the wallets have finished initialising.
	entityos._util.factory.core();
	setTimeout(communityInit, 2000);
});

function communityInit()
{
	eos.invoke('community-set-options');
	eos.invoke('community-init');
}