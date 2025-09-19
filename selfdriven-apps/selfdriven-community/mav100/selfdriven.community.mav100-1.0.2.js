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

            $('#mav100-col-1').removeClass('col-md-6').addClass('col-md-8');
            $('#mav100-col-2').removeClass('col-md-6').addClass('col-md-4')

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
									'<div class="text-muted small">',
										'#d3116237-4e82-467f-9fb5-ef0b48d1737b',
									'</div>',
								'</div>',
							'</div>',
							'<div class="row mt-2">',
								'<div class="col-12">',
									'<div>AirNode 000002</div>',
									'<div class="text-muted small">',
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
									'<div class="text-muted small">',
										'#18d4dffb-c5be-4305-c13a-b60024ed0b07',
									'</div>',
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