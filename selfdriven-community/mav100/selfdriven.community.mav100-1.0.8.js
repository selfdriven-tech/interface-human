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
		name: 'community-set-options',
		code: function (param)
		{
			const isLab = _.includes(window.location.hostname, '-lab');

			if (isLab)
			{
				//SELFDRIVEN OCTO
				//learning-partner-lab
				//community-lab.selfdriven.cloud

				eos.set(
				{
					scope: 'community-wallet-auth-using-policy',
					context: 'auth',
					value: 
					{
						policy: 'bb143df7e6472b158014023d8a1c592d38be8771ce4c01f4fcd65c63',
						_policy: 'f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a',
						apikey: 'a3847801-1811-4667-8253-fdecaab8cac1',
						site: 'a210dba4-cd65-4a4f-a9e2-8432b2c01256'
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
						context: 'lab',
						conversations:
						{
							statusUpdates: 'dc91e102-51d2-4fd3-acd3-642bee319d47'
						}
					}
				});
			}
			else
			{
				//MAV100 MCA NFT
				//proxy@mav100.org
				//selfdriven.community

				eos.set(
				{
					scope: 'community-wallet-auth-using-policy',
					context: 'auth',
					value: 
					{
						policy: '09b1ae51b984fc1aa405d753a98a239ec4fcd2c199f0ea532e9139df',
						_policy: 'f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a',
						apikey: 'fad3bbe4-26c9-4750-87b9-c0d2c513efdc',
						site: 'f74bf2d4-3ff6-4b47-967d-80110e0cabf5'
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
						},
						conversations:
						{
							statusUpdates: '0eabcf06-e57e-4659-a38a-c683508fb162'
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
					'<div id="community-resources" class="card shadow-lg mt-3"',
						' style="background-color: rgba(255, 255, 255, 0.5);"',
						'>',
						'<div class="card-body border-bottom text-center pb-0">',
							'<h4 class="mb-0 font-weight-bold">Resources</h4>',
						'</div>',
						'<div class="card-body text-center" id="community-dashboard-resources-view">',
						'</div>',
					'</div>',
				'</div>'
			]);

			// COL 2 
			communityDashboardView.add(
			[
				'<div class="col-12 col-md-6 mt-3 mt-md-0">',
					'<div id="community-dashboard-status-updates-container" class="card shadow-lg mt-3"',
						'style="background-color: rgba(255, 255, 255, 0.5);"',
					'>',
						'<div class="card-body border-bottom text-center pb-0">',
							'<h4 class="mb-0 font-weight-bold">Status Updates</h4>',
						'</div>',
						'<div class="card-body" id="community-dashboard-status-updates-view">',
						'</div>',
					'</div>',
				
			]);

            communityDashboardView.add(
			[
					'<div id="community-learning-templates" class="card shadow-lg mt-4"',
						' style="background-color: rgba(255, 255, 255, 0.5);"',
						'>',
						'<div class="card-body border-bottom text-center pb-0">',
							'<h4 class="mb-0 font-weight-bold">Learning</h4>',
						'</div>',
						'<div class="card-body">',
							'<div class="row">',
								'<div class="d-none col-12 col-md-6 text-center">',
									'<div class="card shadow"><div class="card-body">',
										'<div><a href="https://skillzeb.io/template-explorer/mav100" target="_blank">',
											'The Tech Powering MAV100 (CBRS etc)',
										'</a></div>',
									'</div></div>',
								'</div>',
								'<div class="d-none col-12 col-md-6 mt-2 mt-md-0 text-center">',
									'<div class="card shadow"><div class="card-body">',
										'<div><a href="https://skillzeb.io/template-explorer/mav100" target="_blank">',
										'How The MAV100 MCA (Coop) Works',
										'</a></div>',
									'</div></div>',
								'</div>',
								'<div class="col-12 mb-3 text-center">',
									'<div class="card shadow"><div class="card-body">',
										'<div><a class="font-weight-bold" href="https://skillzeb.io/template-explorer/mav100" target="_blank">',
										'Becoming a MAV100 Reseller',
										'</a></div>',
										'<div class="text-muted mt-1" style="font-size: 0.6rem;">',
											'Powered by skillzeb',
										'</div>',
									'</div></div>',
								'</div>',
								'<div class="col-12 mb-3 text-center">',
									'<div class="card shadow"><div class="card-body">',
											'<div><a class="font-weight-bold" href="https://levelup.slfdrvn.app" target="_blank">',
												'Level Up App',
											'</a></div>',
											'<div class="text-muted mt-1" style="font-size: 0.6rem;">',
												'Powered by selfdriven',
											'</div>',
									'</div></div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>',
				
			]);

			communityDashboardView.add(
			[
					'<div id="community-learning-templates" class="card shadow-lg mt-4"',
							' style="background-color: rgba(255, 255, 255, 0.5);">',
						'<div class="card-body border-bottom text-center pb-0">',
							'<h4 class="mb-0 font-weight-bold">About</h4>',
						'</div>',
						'<div class="card-body">',
							'<div class="row">',
								'<div class="col-12 mb-3 text-center">',
									'<div class="card shadow"><div class="card-body">',
										'<div><a class="font-weight-bold"  href="https://mav100.com" target="_blank">',
											'MAV100',
										'</a></div>',
									'</div></div>',
								'</div>',
								'<div class="col-12 mb-3 text-center">',
									'<div class="card shadow"><div class="card-body">',
										'<div><a class="font-weight-bold" href="https://worldmobile.io" target="_blank">',
											'WORLD MOBILE',
									'</a></div>',
									'</div></div>',
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

			//eos.invoke('community-dashboard-learning-projects');
			eos.invoke('community-dashboard-conversations');
			eos.invoke('community-dashboard-resources');
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

eos.add(
{
	name: 'community-dashboard-conversations',
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
				object: 'messaging_conversation',
				fields: ['title', 'description', 'modifieddate'],
				filters:
				[
					{
						field: 'status',
						comparison: 'NOT_EQUAL_TO',
						value: 2
					},
					{
						field: 'sharing',
						comparison: 'EQUAL_TO',
						value: 1
					},
					{
						field: 'guid',
						comparison: 'EQUAL_TO',
						value: community.mySetup.conversations.statusUpdates
					}

				],
				callback: 'community-dashboard-conversations'
			})
		}
		else
		{
			if (response.data.rows == 0)
			{}
			else
			{
				eos.set(
				{
					scope: 'community-data',
					context: 'conversations',
					name: 'statusUpdates',
					value: _.first(response.data.rows)
				});
			}

			console.log(_.first(response.data.rows))

			eos.invoke('community-dashboard-conversations-posts');
		}
	}
});

eos.add(
{
	name: 'community-dashboard-conversations-posts',
	code: function (param, response)
	{
		if (response == undefined)
		{
			const communityData = eos.get(
			{
				scope: 'community-data'
			});

			entityos.cloud.search(
			{
				object: 'messaging_conversation_post',
				fields: ['subject', 'message', 'modifieddate'],
				filters:
				[
					{
						field: 'conversation',
						comparison: 'EQUAL_TO',
						value: communityData.conversations.statusUpdates.id
					}
				],
				customOptions:
				[
					{
						name: 'conversation',
						value: communityData.conversations.statusUpdates.id
					}
				],
				sorts:
				[
					{
						name: 'modifieddate',
						direction: 'desc'
					}
				],
				rows: 99,
				callback: 'community-dashboard-conversations-posts'
			});
		}
		else
		{
			var communityDashboardView = eos.view();

			communityDashboardView.add(
			[
				'<div class="row mt-0 mb-0">'
			]);

			_.each(response.data.rows, function (row)
			{
				communityDashboardView.add(
				[
					'<div class="col-12 text-center mb-3">',
						'<div class="card shadow">',
							'<div class="card-body">',
								'<div class="font-weight-bold lead">',
									row.subject,
								'</div>',
								'<div class="text-secondary mt-3">',
									row.message,
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

			communityDashboardView.render('#community-dashboard-status-updates-view');
		}
	}
});

eos.add(
{
	name: 'community-dashboard-resources',
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
				object: 'product',
				fields: ['reference', 'title', 'description', 'modifieddate', 'guid'],
				filters:
				[
					{
						field: 'contactbusiness',
						value: community.user.contactbusiness
					}
				],
				callback: 'community-dashboard-resources'
			})
		}
		else
		{
			eos.set(
			{
				scope: 'community-data',
				context: 'resources',
				value: response.data.rows
			});

			if (response.data.rows == 0)
			{
				communityDashboardView.add(
				[
					'<div class="row mt-0 mb-0">',
						'<div class="col-12 text-center mb-3">',
							'<div class="card shadow">',
								'<div class="card-body">',
									'There are no resources to show.',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				])		
			}
			else
			{
				var communityDashboardView = eos.view();

				communityDashboardView.add(
				[
					'<div class="row mt-0 mb-0">'
				]);

				_.each(response.data.rows, function (row)
				{
					communityDashboardView.add(
					[
						'<div class="col-12 text-center mb-3">',
							'<div class="card shadow">',
								'<div class="card-body">',
									'<div class="font-weight-bold lead">',
										row.title,
									'</div>',
									'<div class="text-secondary small mt-2">',
										'#', row.guid,
									'</div>',
									'<div class="text-secondary mt-2">',
										row.description,
									'</div>',
									'<div class="mt-2" id="community-dashboard-resources-images-', row.id, '-view">',
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
			}

			communityDashboardView.render('#community-dashboard-resources-view');

			eos.invoke('community-dashboard-resources-attachments');
		}
	}
});


eos.add(
{
	name: 'community-dashboard-resources-attachments',
	code: function (param, response)
	{
		if (response == undefined)
		{
			const community = eos.get(
			{
				scope: 'community'
			});

			const resources = eos.get(
			{
				scope: 'community-data',
				context: 'resources'
			});

			const resourceProductIDs = _.map(resources, 'id');
			if (resourceProductIDs.length == 0) {resourceProductIDs = [-1]}

			entityos.cloud.search(
			{
				object: 'core_attachment',
				fields: ['download', 'filename', 'type', 'typetext', 'url', 'sourcetype', 'objectcontext'],
				filters:
				[
					{
						field: 'object',
						value: 16
					},
					{
						field: 'objectcontext',
						comparison: 'IN_LIST',
						value: resourceProductIDs
					}
				],
				customOptions:
				[
					{
						name: 'object',
						value: 16
					}
				],
				callback: 'community-dashboard-resources-attachments'
			})
		}
		else
		{
			const attachments = eos.set(
			{
				scope: 'community-data',
				context: 'resources-attachments',
				value: response.data.rows
			});

			if (response.data.rows == 0)
			{}
			else
			{
				const attachmentsByResource = _.groupBy(attachments, 'objectcontext')

				_.each(attachmentsByResource, function (resourceAttachments, resourceID)
				{
					var communityDashboardView = eos.view();

					const colnumber = (resourceAttachments.length==1?12:6);
		
					communityDashboardView.template(
					[
						'<div class="col-', colnumber, ' mb-3 mt-1">',
							'<a href="{{download}}" target="_blank"><img class="img-fluid rounded float-left" src="{{download}}"></a>',
						'</div>'
					]);

					communityDashboardView.add(
					[
						'<div class="row mt-0 mb-0">'
					]);

					_.each(resourceAttachments, function (attachment)
					{
						if (attachment.sourcetype == 2)
						{
							attachment.download = row.url
						}

						communityDashboardView.add({useTemplate: true}, attachment)
					})

					communityDashboardView.add(
					[
						'</div>'
					]);

					communityDashboardView.render('#community-dashboard-resources-images-' + resourceID + '-view');
				});
			}
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