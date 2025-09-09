/*
	{
    	title: "Learner; Feed Activity)", 	
    	design: "https://selfdriven.foundation/apps
  	}
*/

// GET All LEARNERS & LEARNING-PARTNERS IN THE COMMUNITY
// THEN IF HAVE PROFILE SETUP
// ON-CHAIN ADDRESS SET UP
// PROJECTS STARTED / COMPLETED

app.add(
{
	name: 'learner-feed-dashboard-activity',
	code: function (param, response)
	{
		const userRoleGroupOnly = app._util.param.get(param, 'userRoleGroupOnly', {default: false}).value;

		var data = app.get(
		{
			scope: 'learner-feed-dashboard-activity',
			valueDefault: {}
		});

		if (response == undefined)
		{
			const personGroups =
			[
				app.whoami().mySetup.personGroups.learner,
				app.whoami().mySetup.personGroups.learningPartner
			];

			let filters = 
			[
				{
					field: 'contactbusiness',
					value: app.whoami().thisInstanceOfMe.user.contactbusiness
				},
				{
					field: 'primarygroup',
					comparison: 'IN_LIST',
					value: personGroups
				}
			];

			if (!_.isEmpty(data.search))
			{
				if (!_.isEmpty(data.search))
				{
					filters = _.concat(filters,
					[
						{	
							field: 'firstname',
							comparison: 'TEXT_IS_LIKE',
							value: data.search
						},
						{	
							field: 'or'
						},
						{	
							field: 'surname',
							comparison: 'TEXT_IS_LIKE',
							value: data.search
						}
					]);
				}
			}

			entityos.cloud.search(
			{
				object: 'contact_person',
				fields:
				[
					'firstname',
					'surname',
					'primarygrouptext',
					'guid',
					'contactperson.user.id',
					'contactperson.user.lastlogon'
				],
				rows: 99999,
				filters: filters,
				sorts: [{name: 'firstname', direction: 'desc'}],
				callback: 'learner-feed-dashboard-activity',
				callbackParam: param
			})
		}
		else
		{
			const contactPersons = app.set(
			{
				scope: 'learner-feed-dashboard-activity',
				context: 'contact-persons',
				value: response.data.rows
			});

			if (contactPersons.length == 0)
			{
				app.show('#learner-feed-dashboard-activity-view', '<div class="p-5 text-secondary"><i class="fe fe-frown"></i> No activity.</div>')
			}
			else
			{
				app.invoke('learner-feed-dashboard-activity-on-chain-profile', param)
			}
		}
	}
});

app.add(
{
	name: 'learner-feed-dashboard-activity-on-chain-profile',
	code: function (param, response)
	{
		const contactPersons = app.get(
		{
			scope: 'learner-feed-dashboard-activity',
			context: 'contact-persons'
		});

		var data = app.get(
		{
			scope: 'learner-feed-dashboard-activity',
			valueDefault: {}
		});

		if (response == undefined)
		{
			const contactPersonUserIDs = _.map(_.filter(contactPersons, function (cp) {
				return _.isSet(cp['contactperson.user.id'])
			}), 'contactperson.user.id')

			if (contactPersonUserIDs.length == 0)
			{
				app.set(
				{
					scope: 'learner-feed-dashboard-activity',
					context: 'contact-person-on-chain-profiles',
					value: []
				});

				app.invoke('learner-feed-dashboard-activity-process', param)
			}
			else
			{
				let filters =
				[
					{	
						field: 'object',
						value: app.whoami().mySetup.objects.user
					},
					{	
						field: 'objectcontext',
						comparison: 'IN_LIST',
						value: contactPersonUserIDs
					},
					{	
						field: 'type',
						comparison: 'EQUAL_TO',
						value: 1
					},
					{	
						field: 'category',
						comparison: 'EQUAL_TO',
						value: 6
					}
				];

				entityos.cloud.search(
				{
					object: 'core_protect_key',
					fields:
					[
						'objectcontext'
					],
					filters: filters,
					rows: 99999,
					callback: 'learner-feed-dashboard-activity-on-chain-profile',
					callbackParam: param
				});
			}
		}
		else
		{
			app.set(
			{
				scope: 'learner-feed-dashboard-activity',
				context: 'contact-person-on-chain-profiles',
				value: response.data.rows
			});

			app.invoke('learner-feed-dashboard-activity-projects', param);
		}
	}
});

app.add(
{
	name: 'learner-feed-dashboard-activity-projects',
	code: function (param, response)
	{
		const contactPersons = app.get(
		{
			scope: 'learner-feed-dashboard-activity',
			context: 'contact-persons'
		});

		var data = app.get(
		{
			scope: 'learner-feed-dashboard-activity',
			valueDefault: {}
		});

		if (response == undefined)
		{
			const contactPersonUserIDs = _.map(_.filter(contactPersons, function (cp) {
				return _.isSet(cp['contactperson.user.id'])
			}), 'contactperson.user.id')

			if (contactPersonUserIDs.length == 0)
			{
				app.set(
				{
					scope: 'learner-feed-dashboard-activity',
					context: 'contact-person-projects',
					value: []
				});

				app.invoke('learner-feed-dashboard-activity-tokens', param)
			}
			else
			{
				let filters =
				[
					{
						field: 'restrictedtoteam',
						value: 'Y'
					},
					{
						field: 'projectmanager',
						comparison: 'IN_LIST',
						value: contactPersonUserIDs
					},
					{
						field: 'type',
						value: app.whoami().mySetup.projectTypes.learning
					},
					{
						field: 'sourceprojecttemplate',
						comparison: 'IS_NOT_NULL'
					}
				];

				entityos.cloud.search(
				{
					object: 'project',
					fields:
					[
						'projectmanager'
					],
					filters: filters,
					rows: 99999,
					callback: 'learner-feed-dashboard-activity-projects',
					callbackParam: param
				});
			}
		}
		else
		{
			app.set(
			{
				scope: 'learner-feed-dashboard-activity',
				context: 'contact-person-projects',
				value: response.data.rows
			});

			app.invoke('learner-feed-dashboard-activity-tokens', param);
		}
	}
});

app.add(
{
	name: 'learner-feed-dashboard-activity-tokens',
	code: function (param, response)
	{
		const contactPersons = app.get(
		{
			scope: 'learner-feed-dashboard-activity',
			context: 'contact-persons'
		});

		if (response == undefined)
		{
			const contactPersonIDs = _.map(_.filter(contactPersons, function (cp) {
				return _.isSet(cp['id'])
			}), 'id')

			if (contactPersonIDs.length == 0)
			{
				app.set(
				{
					scope: 'learner-feed-dashboard-activity',
					context: 'contact-person-tokens',
					value: []
				});

				app.invoke('learner-feed-dashboard-activity-process', param)
			}
			else
			{
				let filters =
				[
					{
						field: 'contactperson',
						comparison: 'IN_LIST',
						value: contactPersonIDs
					},
					{
						field: 'type',
						value: app.whoami().mySetup.actionTypes.sdc
					}
				];

				entityos.cloud.search(
				{
					object: 'action',
					fields:
					[
						'contactpersontext',
						'contactperson',
						'sum(totaltimehrs) total'
					],
					filters: filters,
					rows: 99999,
					callback: 'learner-feed-dashboard-activity-tokens',
					callbackParam: param
				});
			}
		}
		else
		{
			app.set(
			{
				scope: 'learner-feed-dashboard-activity',
				context: 'contact-person-tokens',
				value: response.data.rows
			});

			app.invoke('learner-feed-dashboard-activity-process', param);
		}
	}
});

app.add(
{
	name: 'learner-feed-dashboard-activity-process',
	code: function (param, response)
	{
		var learnerFeedActivity = app.get(
		{
			scope: 'learner-feed-dashboard-activity'
		});

		_.each(learnerFeedActivity['contact-persons'], function (contactPerson)
		{
			contactPerson.isMe = (contactPerson['contactperson.user.id'] == app.whoami().thisInstanceOfMe.user.id);

			// ON-CHAIN PROFILE
			contactPerson._onChainProfile = _.find(learnerFeedActivity['contact-person-on-chain-profiles'], function (onChainProfile)
			{
				return (onChainProfile.objectcontext == contactPerson['contactperson.user.id'])
			});

			contactPerson.hasOnChainProfile = _.isSet(contactPerson._onChainProfile);

			// PROJECTS

			contactPerson._projects = _.filter(learnerFeedActivity['contact-person-projects'], function (project)
			{
				return (project.projectmanager == contactPerson['contactperson.user.id'])
			});

			contactPerson.projectsCount = contactPerson._projects.length;

			// TOKENS / SDC

			contactPerson._tokens = _.filter(learnerFeedActivity['contact-person-tokens'], function (token)
			{
				return (token.contactperson == contactPerson['id'])
			});

			contactPerson.tokensCount = contactPerson._tokens.length;

			// LEVEL

			contactPerson.level = 0;

			if (contactPerson['contactperson.user.lastlogon'] != '')
			{
				contactPerson.level += 2;
			}

			if (contactPerson.hasOnChainProfile)
			{
				contactPerson.level += 4
			}

			contactPerson.level += contactPerson.projectsCount;

			if (contactPerson._tokens.length != 0)
			{
				_.each(contactPerson._tokens, function (token)
				{
					contactPerson.level += (numeral(token.total).value() / 10);
				});
			}

			// Octos Multiplier
			contactPerson.level = (contactPerson.level * 10);
		});

		learnerFeedActivity['contact-persons'] = _.reverse(_.sortBy(learnerFeedActivity['contact-persons'], 'level'));

		app.invoke('learner-feed-dashboard-activity-show', param);
	}
});

app.add(
{
	name: 'learner-feed-dashboard-activity-show',
	code: function (param, response)
	{
		var learnerFeedActivity = app.get(
		{
			scope: 'learner-feed-dashboard-activity'
		});
		
		var feedView = app.vq.init({queue: 'learner-feed-dashboard-level-up-profile'});

		feedView.add(
		[
			'<div class="list-group list-group-flush my-n3">'
		]);

		feedView.template(
		[
			'<div class="list-group-item pt-3 pb-0">',
				'<div class="row pb-2">',
					'<div class="col-auto">',
						'{{initialsinfo}}',
					'</div>',
					'<div class="col-3 ms-n2">',
						'<div class="pt-0">',
							'<div class="mb-0 font-weight-bold{{classisme}}">',
								'{{name}}',
							'</div>',
							'<div class="mb-0"',
								'>',
								'{{logoninfo}}',
							'</div>',
						'</div>',
					'</div>',
					'{{activityinfo}}',
				'</div>',
			'</div>'
		]);

		feedView.add(
		[
			'<div class="list-group-item pt-3 pb-0">',
				'<div class="row pb-2">',
					'<div class="col-auto fw-bold">',
						'<button class="btn btn-rounded-circle btn-light text-secondary">' + 
							'<i class="far fa-users"></i>' +
						'</button>',
					'</div>',
					'<div class="col-3 ms-n2 fw-bold text-secondary mt-2">',
						'Name',
					'</div>',
					'<div class="col text-left fw-bold text-secondary mt-2">',
						'Activity',
					'</div>',
					'<div class="col-3 text-left fw-bold text-secondary mt-2">',
						'Community Tokens',
					'</div>',
					'<div class="col-1 text-center fw-bold text-secondary mt-2 ">',
						'<a href="#learner-feed-activity-dashboard-info-collapse" class="text-secondary" data-toggle="collapse">Octos<sup>*</sup></a>',
					'</div>',
				'</div>',
			'</div>'
		]);

		_.each(learnerFeedActivity['contact-persons'], function (contactPerson)
		{
			contactPerson.initials = _.upperCase(_.first(contactPerson['firstname']) +
								_.first(contactPerson['surname']));

			if (contactPerson.isMe)
			{
				contactPerson.classisme = ' text-primary';
				contactPerson.initialsinfo = '<button class="btn btn-rounded-circle btn-light">' + 
							'<a class="fw-bold" href="#learner-me">' + contactPerson.initials + '</a>',
						'</button>';
			}
			else
			{
				if (contactPerson.primarygrouptext == 'Learner')
				{
					contactPerson.initials = '<i class="far fa-user"></i>'
				}
				else
				{
					contactPerson.initials = '<i class="far fa-chalkboard-teacher"></i>'
				}
				
				contactPerson.classisme = '';
				contactPerson.initialsinfo = '<button class="btn btn-rounded-circle btn-light text-secondary">' + 
						contactPerson.initials +
						'</button>';
			}
			
			contactPerson.name = contactPerson['firstname'] + ' ' +
								contactPerson['surname'];

			if (_.isNotSet(contactPerson['contactperson.user.lastlogon']))
			{
				contactPerson.lastlogondate = '<em>Never logged on.</em>';
			}
			else
			{
				contactPerson.lastlogondate = app.invoke('util-date', {date: contactPerson['contactperson.user.lastlogon'], format: 'ddd, D MMM YYYY'});
			}

			contactPerson.lastlogonfromnow = moment(contactPerson['contactperson.user.lastlogon'], 'D MMM YYYY hh:mm:ss').fromNow();

			contactPerson.logoninfo= '<span class="text-muted small">' + contactPerson.lastlogondate + '</span>';

			contactPerson.levelinfo = '';

			contactPerson._activityinfo = app.vq.init({queue: 'activityinfo'});

			contactPerson._activityinfo.add(
			[
				'<div class="col text-left lead">',
			]);

				contactPerson._activityinfo.add(
				[
					(contactPerson.hasOnChainProfile?'<span class="badge badge-light text-success border border-success me-2">On-Chain Wallet</span>':(contactPerson.isMe?'<span class="badge badge-light text-dark border border-muted me-2"><a class="text-secondary" href="#learner-me-on-chain-edit">Add On-Chain Wallet</a></span>':''))
				]);

				contactPerson._activityinfo.add(
				[
					(contactPerson.projectsCount!=0?'<span class="badge badge-light text-success border border-success me-2">' + contactPerson.projectsCount + ' project(s)</span>':(contactPerson.isMe?'<span class="badge badge-light text-dark border border-muted me-2"><a class="text-secondary" href="#learner-projects">Do First Project</a></span>':'')),
				]);

			contactPerson._activityinfo.add(
			[
				'</div>'
			]);

			//TOKENs
			
			contactPerson._activityinfo.add(
			[
				'<div class="col-3 text-left lead">',
			]);

			if (contactPerson._tokens.length == 0)
			{
				if (contactPerson.isMe)
				{
					contactPerson._activityinfo.add(
					[
						'&nbsp;'
					]);
				}
				else
				{
					contactPerson._activityinfo.add(
					[
						'&nbsp;'
					]);
				}
			}
			else
			{
				_.each(contactPerson._tokens, function (token)
				{
					contactPerson._activityinfo.add(
					[
						'<span class="badge badge-light text-warning border border-warning me-2">', parseInt(token.total) ,' SDC</span>',
					]);
				});
			}

			contactPerson._activityinfo.add(
			[
				'</div>'
			]);


			if (contactPerson.level == 0)
			{
				contactPerson._activityinfo.add(
				[
					'<div class="col-1 text-center lead">',
						'&nbsp;',
					'</div>'
				]);
			}
			else
			{
				contactPerson._activityinfo.add(
				[
					'<div class="col-1 text-center lead">',
						'<span class="border-success btn btn-rounded-circle btn-light text-success fw-bold shadow">', contactPerson.level, '</span>',
					'</div>'
				]);
			}

			contactPerson.activityinfo = contactPerson._activityinfo.get();
			

			feedView.add({useTemplate: true,}, contactPerson)
		});

		feedView.add('</div>')

		feedView.render('#learner-feed-dashboard-activity-view');
	}
});

app.add(
{
	name: 'learner-feed-activity-dashboard-info-show',
	code: function (param, response)
	{
		var infoView = app.vq.init({queue: 'learner-feed-dashboard-level-up-profile'});

		infoView.add(
		[
			'<ul class="text-secondary">',
				'<li class="mb-2">The date under the name is the last logon on date.</li>',
				'<li class="mb-2">SDCs are the selfdriven Community tokens issued for recognition of learning/project achievements.</li>',
				'<li class="mb-2"><span class="badge badge-light text-warning border border-warning me-2">Comming Soon</span>',
					'<ul class="mt-1">',
					'<li>Octos will be claimable tokens issued by <a class="text-secondary" href="https://selfdriven.foundation/octo" target="_blank">selfdrivenOcto</a> based on activity i.e. wallet setup, projects started, SDC tokens earned <a class="text-secondary" href="https://selfdriven.foundation/tokenomics/#octos" target="_blank"><i class="fe fe-external-link"></i></a></li>',
					'<li>Octos are issued as digital tokens on the <a class="text-secondary" href="https://selfdriven.foundation/on-chain" target="_blank">Cardano blockchain</a>.</li>',		
				'</ul></li>',
			'</ul>'
		]);

		infoView.render('#learner-feed-activity-dashboard-info-view');
	}
});


