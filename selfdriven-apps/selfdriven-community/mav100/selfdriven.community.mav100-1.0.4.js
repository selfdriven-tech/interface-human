import { EntityOS } from '/site/2186/entityos.module.class-1.0.0.js';
const eos = new EntityOS();

/*
	Powered by:
	- entityos.cloud
	- cardano.org

	https://slfdrvn.community/mav100
    -d: https://entityos.iagon.net/apps/selfdriven/community/mav100.html
*/

eos.add(
[
	{
		name: 'community-dashboard-show',
		code: function (param)
		{
			var data = eos.get({scope: 'community'});

            $('#mav100-col-1').removeClass('col-md-7').addClass('col-md-9');
            $('#mav100-col-2').removeClass('col-md-5').addClass('col-md-3');
            $('#mav100-header-md').css('font-size', '3rem')
            
			var communityDashboardView = eos.view();

			communityDashboardView.add(
			[
				'<div class="row mt-2 mb-4">'
			]);

			//Resources | Status Updates

			communityDashboardView.add(
			[
				'<div class="col-12 col-md-6">',
					'<div id="community-resources" class="card shadow-lg mt-3">',
						'<div class="card-body border-bottom text-center">',
							'<h5 class="mb-0 font-weight-bold text">Resources</h5>',
						'</div>',
						'<div class="card-body text-center">',
							'<div class="row">',
								'<div class="col-12">',
									'<div>AirNode 000001</div>',
									'<div class="text-muted" style="font-size: 0.6rem;">',
										'#d3116237-4e82-467f-9fb5-ef0b48d1737b',
									'</div>',
								'</div>',
							'</div>',
							'<div class="row mt-2">',
								'<div class="col-12">',
									'<div>AirNode 000002</div>',
									'<div class="text-muted" style="font-size: 0.6rem;">',
										'#353e143f-8117-49c8-8095-09f872289601',
									'</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>',
				'</div>'
			]);

			communityDashboardView.add(
			[
				'<div class="col-12 col-md-6 mt-3 mt-md-0">',
					'<div id="community-status-updates" class="card shadow-lg mt-3">',
						'<div class="card-body border-bottom text-center">',
							'<h5 class="mb-0 font-weight-bold">Status Updates</h5>',
						'</div>',
						'<div class="card-body">',
							'<div class="row">',
								'<div class="col-12 text-center">',
									'<div><a href="https://drive.google.com/file/d/1WYmLMCS3XW315xqqXQp8MZH5DYfL6pbq/view?usp=sharing" target="_blank">',
										'Example Status Report',
									'</a></div>',
									'<div class="text-muted" style="font-size: 0.6rem;">',
										'#18d4dffb-c5be-4305-c13a-b60024ed0b07',
									'</div>',
								'</div>',
								'<div class="col-12 text-center mt-4 border-top pt-3">',
									'<div><a href="https://github.com/selfdriven-foundation/community" target="_blank" class="text-secondary">',
										'MAV100 Data Feed (API/Oracle)',
									'</a></div>',
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
							'<h5 class="mb-0 font-weight-bold">Learning</h5>',
						'</div>',
						'<div class="card-body">',
							'<div class="row">',
								'<div class="col-12 text-center">',
									'<div><a href="https://skillzeb.io/template-explorer/mav100" target="_blank">',
										'The Tech Powering MAV100 (CBRS etc)',
									'</a></div>',
									
								'</div>',
								'<div class="col-12 text-center mt-2">',
									'<div><a href="https://skillzeb.io/template-explorer/mav100" target="_blank">',
										'How The MAV100 MCA (Coop) Works',
									'</a></div>',
								'</div>',
								'<div class="col-12 text-center mt-2">',
									'<div><a href="https://skillzeb.io/template-explorer/mav100" target="_blank">',
										'Becoming a MAV100 Reseller',
									'</a></div>',
									'<div class="text-muted mt-1" style="font-size: 0.6rem;">',
										'Powered by skillzeb',
									'</div>',
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
							'<h5 class="mb-0 font-weight-bold">About</h5>',
						'</div>',
						'<div class="card-body">',
							'<div class="row">',
								'<div class="col-12 text-center">',
									'<div><a href="https://mav100.com" target="_blank">',
										'MAV100',
									'</a></div>',
								'</div>',
								'<div class="col-12 text-center mt-2">',
									'<div><a href="https://worldmobile.io" target="_blank">',
										'WORLD MOBILE',
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
	setTimeout(learnInit, 2000);
});

function learnInit()
{
	eos.invoke('community-init');
}