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
			const isLab = _.includes(window.location.hostname, '-lab');

			// Using SDF (selfdriven Foundation PolicyID to test)
			// https://selfdriven.foundation/tokens

			if (isLab)
			{
				eos.set(
				{
					scope: 'community-wallet-auth-using-policy',
					context: 'auth',
					value: 
					{
						policy: '906ba07f6419a89d7b05cca88f0ff3ee2114936c373cb2156f8426ec',
						apikey: '888c7eac-4b9b-465f-baa8-ea3137f4ccd6',
						site: 'a210dba4-cd65-4a4f-a9e2-8432b2c01256',
						context: 'lab'
					}
				});

				eos.set(
				{
					scope: 'community',
					context: 'mySetup',
					value: 
					{
						projectTypes: 
						{
							environment: 34,
							service: 36,
							facilitation: 37,
							activity: 43,
							communication: 56,
							management: 59,
							design: 63,
							learning: 62,
							planning: 65
						},
						context: 'lab'
					}
				});
			}
			else
			{
				eos.set(
				{
					scope: 'community-wallet-auth-using-policy',
					context: 'auth',
					value: 
					{
						apikey: 'bc9a313c-13f6-4fa2-93c0-e7ada5ef97e7',
						site: 'f74bf2d4-3ff6-4b47-967d-80110e0cabf5',
						policy: '906ba07f6419a89d7b05cca88f0ff3ee2114936c373cb2156f8426ec'
					}
				});

				eos.set(
				{
					scope: 'community',
					context: 'mySetup',
					value: 
					{
						projectTypes: 
						{
							environment: 39,
							service: 41,
							facilitation: 42,
							activity: 44,
							communication: 57,
							management: 60,
							design: 64,
							learning: 61,
							planning: 66
						}
					}
				});
			}
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
				'<div class="col-12 col-md-8 mt-3 mt-md-3">',
					'<div id="community-learning-templates" class="card shadow-lg mt-3">',
						'<div class="card-body border-bottom">',
							'<div class="row align-items-end">',
								'<div class="col">',
									'<h5 class="font-weight-bold">Learning Projects</h5>',
								'</div>',
								'<div class="col-auto">',
									' <a data-toggle="collapse" href="#community-dashboard-learning-projects-clone"',
											' id="community-project-clone"',
											' class="btn btn-outline-primary btn-sm rounded-pill entityos-click"',
											' data-controller="community-project-clone"',
										'>',
										'<i class="far fa-clone"></i> New',
									'</a>',
								'</div>',
							'</div>',
						'</div>',
						'<div class="card-body border-bottom collapse text-center" id="community-dashboard-learning-projects-clone" style="">',
							'[Select project template]',
                    	'</div>',
						'<div class="card-body">',
							'<div id="community-dashboard-learning-projects-view">',
							'</div>',
							'<div class="text-center mt-2">',
								'<div><a href="https://levelup.slfdrvn.app" target="_blank" style="font-size: 0.6rem;">',
									'Powered by selfdriven Level Up',
								'</a></div>',
							'</div>',
						'</div>',
					'</div>',
				'</div>'
			]);

            communityDashboardView.add(
			[
				'<div class="col-12 col-md-4 mt-3 mt-md-3">',
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
									'<div><a href="https://commonlands.zendesk.com/hc/en-us/sections/14051078365975-FAQ" target="_blank">',
										'FAQs',
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

			eos.invoke('community-dashboard-process');
		}
	}
]);

eos.add(
{
	name: 'community-dashboard-process',
	code: function (param, response)
	{
		if (response == undefined)
		{
			entityos.cloud.invoke(
			{
				method: 'core_get_user_details',
				data: {},
				callback: 'community-dashboard-process'
			})
		}
		else
		{
			eos.set(
			{
				scope: 'community',
				context: 'user',
				value: response
			});

			eos.invoke('community-dashboard-learning-projects')
		}
	}
});

eos.add(
{
	name: 'community-dashboard-learning-projects',
	code: function (param, response)
	{
		if (response == undefined)
		{
			const community = eos.get(
			{
				scope: 'community'
			});

			entityos.cloud.search(
			{
				object: 'project',
				fields: ['description'],
				filters:
				[
					{
						field: 'restrictedtoteam',
						value: 'Y'
					},
					{
						field: 'projectmanager',
						value: community.user.user
					},
					{
						field: 'type',
						value: community.mySetup.projectTypes.learning
					},
					{
						field: 'sourceprojecttemplate',
						comparison: 'IS_NOT_NULL'
					},
					{
						field: 'description',
						comparison: 'TEXT_IS_LIKE',
						value: 'Commonlands'
					}
				],
				callback: 'community-dashboard-learning-projects'
			})
		}
		else
		{
			var communityDashboardView = eos.view();

			communityDashboardView.add(
			[
				'<div class="row mt-2 mb-4">'
			]);

			_.each(response.data.rows, function (row)
			{
				communityDashboardView.add(
				[
					'<div class="col-6 text-center mb-3">',
						'<div class="card shadow">',
							'<div class="card-body ">',
								'<div class="font-weight-bold">',
									row.description,
								'</div>',
								'<div class="text-secondary small mt-1">',
									'In Progress',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);
			})

			communityDashboardView.add(
			[
				'</div>'
			]);

			communityDashboardView.render('#community-dashboard-learning-projects-view');
		}
	}
});

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