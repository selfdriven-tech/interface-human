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
            $('#commonlands-header-md').css('font-size', '3rem');
			$('#community-user-container').removeClass('d-none');

			eos.invoke('util-setup');
            
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
									'<h5 class="font-weight-bold">Your Learning Projects</h5>',
								'</div>',
								'<div class="col-auto">',
									' <a data-toggle="collapse" href="#community-dashboard-learning-projects-clone"',
											' class="btn btn-primary btn-sm rounded-pill"',
										'>',
										'<i class="far fa-clone"></i> New',
									'</a>',
								'</div>',
							'</div>',
						'</div>',
						'<div class="card-body border-bottom collapse text-center entityos-collapse" id="community-dashboard-learning-projects-clone">',
							'<div id="community-dashboard-learning-projects-clone-view" data-controller="community-dashboard-learning-projects-clone">',
							'</div>',
                    	'</div>',
						'<div class="card-body">',
							'<div id="community-dashboard-learning-projects-view">',
							'</div>',
							'<div class="d-none text-center mt-2">',
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

			//communityDashboardView.render('#community-dashboard-view');
			communityDashboardView.render('#community-view');

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
				'<div class="row mt-2">'
			]);

			if (response.data.rows.length == 0)
			{
				communityDashboardView.add(
				[
					'<div class="col-12 text-center mb-3">',
						'<div class="font-weight-bold">You currently don\'t have any learning projects.</div>',
						'<div class="mt-2">Click New to start one!</div>',
					'</div>'
				]);
			}
			else
			{
				_.each(response.data.rows, function (row)
				{
					communityDashboardView.add(
					[
						'<div class="col-12 text-center mb-3">',
							'<div class="card shadow">',
								'<div class="card-body ">',
									'<div class="font-weight-bold lead">',
										'<a class="text-primary entityos-click"',
											' data-controller="community-dashboard-learning-project-do" aria-expanded="true"',
											' data-spinner="append"',
											' data-context="', row.guid ,'"',
											' data-id="', row.guid ,'"',
											'>',
												row.description,
											'</a>',
									'</div>',
								'</div>',
							'</div>',
						'</div>'
					]);
				});
			}

			communityDashboardView.add(
			[
				'</div>'
			]);

			communityDashboardView.render('#community-dashboard-learning-projects-view');
		}
	}
});

eos.add(
{
	name: 'community-dashboard-learning-projects-clone',
	code: function (param, response)
	{
		if (_.get(param, 'status') == 'shown')
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
					fields: ['description', 'notes', 'guid'],
					filters:
					[
						{
							field: 'template',
							value: 'Y'
						},
						{
							field: 'type',
							value: community.mySetup.projectTypes.learning
						},
						{
							field: 'description',
							comparison: 'TEXT_IS_LIKE',
							value: 'Commonlands'
						}
					],
					callback: 'community-dashboard-learning-projects-clone',
					callbackParam: param
				})
			}
			else
			{
				var communityDashboardView = eos.view();

				communityDashboardView.add(
				[
					'<div class="row mt-2 mb-4">'
				]);

				if (response.data.rows.length == 0)
				{
					communityDashboardView.add(
					[
						'<div class="col-12 text-center mb-3">',
							'<div class="font-weight-bold text-secondary">Sorry, there are no learning templates available.</div>',
						'</div>'
					]);
				}
				else
				{
					communityDashboardView.add(
					[
						'<div class="col-12 text-center mb-3">',
							'<div class="font-weight-bold text-secondary">Select a learning project to start.</div>',
						'</div>'
					]);

					_.each(response.data.rows, function (row)
					{
						row._notes = '';
						if (row.notes != '')
						{
							row._notes = '<div class="text-secondary mt-2">' + row.notes +'</div>';
						}

						communityDashboardView.add(
						[
							'<div class="col-12 text-center mb-3">',
								'<div class="card shadow">',
									'<div class="card-body ">',
										'<div class="font-weight-bold lead">',
											'<a class="text-primary entityos-click"',
											' data-controller="community-dashboard-learning-projects-clone-copy" aria-expanded="true"',
											' data-spinner="append"',
											' data-context="', row.guid ,'"',
											' data-id="', row.guid ,'"',
											'>',
												row.description,
											'</a>',
										'</div>',
										row._notes,
									'</div>',
								'</div>',
							'</div>'
						]);
					});
				}

				communityDashboardView.add(
				[
					'</div>'
				]);

				communityDashboardView.render('#community-dashboard-learning-projects-clone-view');
			}
		}
	}
});

eos.add(
{
	name: 'community-dashboard-learning-projects-clone-copy',
	code: function (param, response)
	{	
		var projectTemplateGUID = _.get(param, 'dataContext.id')

		if (projectTemplateGUID == undefined)
		{
			eos.notify({type: 'error', message: 'No template information.'});
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'project',
					fields:
					[
						'reference', 'description', 'typetext',
						'type', 'notes', 'guid',
						'category', 'categorytext', 'parentproject', 'parentprojecttext',
						'projectmanager', 'projectmanagertext', 'createdusertext',
						'handovernotes', 'project.createduser.contactperson'
					],
					filters:
					[
						{
							field: 'guid',
							value: projectTemplateGUID
						}
					],
					callback: 'community-dashboard-learning-projects-clone-copy',
					callbackParam: param
				});
			}
			else
			{
				eos.set( 
				{
					scope: 'community-dashboard-learning-projects-clone-copy',
					context: 'projectTemplate',
					value: _.first(response.data.rows)
				});

				eos.invoke('community-dashboard-learning-projects-clone-copy-save')
			}
		}
	}
});

eos.add(
[
	{
		name: 'app-update',
		code:	function (data)
		{
			if (data)
			{
				if (data.from == 'myds-logon-init')
				{
					if (data.status == 'start')
					{	
						$('#app-auth-message').html('');
						$('#myds-logoncode-view').addClass('hidden d-none');
					}

					if (data.status == 'need-code')
					{	
						$('#myds-logoncode-view').removeClass('hidden d-none');
						$('#app-auth-message').html('<div class="mt-3">A code has been sent to you via ' + data.message + '.</div>');
						$('#myds-logoncode').focus();
					}

					if (data.status == 'need-totp-code')
					{	
						var logonTOTPName = 'your TOTP client (eg Google Authenticator)';

						if (_.has(mydigitalstructure.options, 'logonTOTP'))
						{
							if (mydigitalstructure.options.logonTOTP.name != undefined)
							{
								logonTOTPName = mydigitalstructure.options.logonTOTP.name;
							}
						}

						$('#myds-logoncode-view').removeClass('d-none hidden');
						$('#app-auth-message').html('<div class="mt-3">Please enter the code from ' + logonTOTPName + ' and then press Logon again.</div>');
						$('#myds-logoncode').focus();
					}
				}

				if (data.from == 'myds-logon-send')
				{
					if (data.status == 'error')
					{	
						$('#myds-logon-status').html('<div class="mt-3">' + data.message + '</div>');
					}
					else
					{
						$('#myds-logon-status').html('');
					}	
				}

				if (data.from == 'myds-core')
				{
					if (data.status == 'error')
					{	
						if (data.message != 'invalid passwordhash' && data.message != 'INVALID_LOGON')
						{
							eos.invoke('app-notify',
							{
								message: data.message,
								class: 'danger'
							});
						}
					}

					if (data.status == 'notify')
					{	
						eos.invoke('app-notify',
						{
							message: data.message
						});
					}
				}

				if (data.from == 'myds-auth')
				{
					if (data.status == 'error')
					{	
						var options = entityos._scope.app.options;
						options.notify = {message: 'You need to log on again.', class: 'danger'};
						mydigitalstructure._util.init(mydigitalstructure._scope.app)
					}
				}

				if (data.from == 'myds-send')
				{
					$('#app-working')[(data.status=='start'?'remove':'add') + 'Class']('hidden d-none');
				}

				if (data.from == 'myds-init')
				{
					if (data.status == 'uri-changed')
					{	
						mydigitalstructure._util.controller.invoke(
						{
							name: 'app-route-to'
						},
						{
							uri: entityos._scope.app.uri,
							uriContext: data.message
						});

						window.scrollTo(0, 0);
					}	
				}

				if (data.from == 'myds-logon-send')
				{
					if (data.status == 'error')
					{
						$('#app-auth-message').html('<div class="mt-3">' + data.message + '</div>');
					}

					if (data.status == 'start')
					{
						$('#app-auth-message').html('<span class="spinner mt-3"><i class="icon-spin icon-refresh"></i></span>');
					}
				}

				if (data.from == 'myds-view-access')
				{
					if (data.status == 'context-changed')
					{
						$(data.message.hide.join(',')).addClass('hidden d-none');
						$(data.message.show.join(',')).removeClass('hidden d-none');
					}
				}
			}
		}
	}
]);

window.app = {};
app._util = entityos._util;
app.invoke = app._util.controller.invoke;
app.add = app._util.controller.add;
app.view = app._util.view;
app.find = app._util.data.find;
app.set = app._util.data.set;
app.get = app._util.data.get;
app.refresh = app._util.view.refresh;
app.vq = app._util.view.queue;
app.show = app.vq.show;

$(function () {
	//Just a little break to make sure all the wallets have finished initialising.
	entityos._util.factory.core();
	setTimeout(communityInit, 2000);
});


$(document).on('visibilitychange', function (event)
{
	if (false && event.target.visibilityState == 'visible')
	{
		app.invoke('util-cloud-check', {onComplete: 'community-dashboard-show'});
	} 
});

function communityInit()
{
	eos.invoke('community-set-options');
	//eos.invoke('community-init');
	entityos._scope.app.viewUpdate = entityos._util.controller.code['app-update'];
	entityos._scope.app.options.auth = true;
	entityos._scope.app.options.startURI = '/commonlands';
	entityos._scope.app.options.startURIContext = '';
	entityos._scope.app.viewStart = 'community-dashboard-show';
	entityos._scope.app.options.deauthURI = 'https://learn.commonlands.org/commonlands';
	//app.invoke('util-cloud-check', {onComplete: 'community-dashboard-show'})
}