/*
	{
    	title: "Supporter; Dashboard",
    	design: ""
  	}
*/

app.add(
[
	{
		name: 'supporter-dashboard',
		code: function ()
		{
			var utilSetup = app.get({scope: 'util-setup'});

			var whoAmI = app.whoami().thisInstanceOfMe.user;

			//app.invoke('supporter-dashboard-profile-image');

			/*
			{
						name: 'supporter-feed',
						containerSelector: '#supporter-dashboard-feed',
						template: '{{count}}',
						storage:
						{
							object: 'project_task',
							fields:
							[
								{name: 'count(id) count'}
							],
							filters:
							[
								{
									field: 'modifieduser',
									comparison: 'NOT_EQUAL_TO',
									value: app.whoami().thisInstanceOfMe.user.id
								},
								{
									field: 'projecttask.project.id',
									comparison: 'IS_NOT_NULL'
								},
								{
									field: 'projecttask.taskbyuser.contactperson',
									comparison: 'EQUAL_TO',
									value: app.whoami().thisInstanceOfMe.user.contactperson
								},
								{
									field: 'status',
									comparison: 'NOT_IN_LIST',
									value: utilSetup.taskStatuses.closed
								}
							]
						},
						styles:
						[
							{
								when: function (data)
								{
									return (data.count != 0)
								},
								class: 'text-warning'
							}
						]
					},
			*/

			app.invoke('util-dashboard',
			{
				dashboards:
				[
					{
						name: 'supporter-dashboard-liquidity',
						containerSelector: '#supporter-dashboard-liquidity',
						template: '{{total}}',
						formatController: 'supporter-dashboard-tokens-format',
						storage:
						{
							object: 'action',
							fields:
							[
								{name: 'sum(amount) total'}
							],
							filters:
							[
								{
									field: 'contactperson',
									value: app.whoami().thisInstanceOfMe.user.contactperson
								},
								{
									field: 'type',
									comparison: 'IN_LIST',
									value: app.whoami().mySetup.actionTypes.environmentEnergyIn
								}
							]
						}
					},
					{
						name: 'supporter-projects',
						containerSelector: '#supporter-dashboard-projects',
						template: '{{count}}',
						storage:
						{
							object: 'project',
							fields:
							[
								{name: 'count(id) count'}
							],
							filters:
							[
								{
									field: 'restrictedtoteam',
									value: 'Y'
								}
							]
						}
					},
					{
						name: 'supporter-dashboard-communities',
						containerSelector: '#supporter-dashboard-communities',
						template: '{{count}}',
						storage:
						{
							object: 'contact_relationship',
							fields:
							[
								{name: 'count(id) count'}
							],
							filters:
							[
								{
									field: 'contactperson',
									value: whoAmI.contactperson
								},
								{
									field: 'type',
									value: app.whoami().mySetup.relationshipTypes.learnerCommunity
								}
							]
						}
					},
					{
						name: 'supporter-dashboard-my-tokens',
						containerSelector: '#supporter-dashboard-my-tokens',
						template: '{{total}}',
						formatController: 'supporter-dashboard-tokens-format',
						storage:
						{
							object: 'action',
							fields:
							[
								{name: 'sum(amount) total'}
							],
							filters:
							[
								{
									field: 'contactperson',
									value: app.whoami().thisInstanceOfMe.user.contactperson
								},
								{
									field: 'type',
									comparison: 'IN_LIST',
									value: app.whoami().mySetup.actionTypes.sdcs
								}
							]
						}
					},
				]
			});
		}
	}
]);

app.add(
{
	name: 'supporter-dashboard-tokens-format',
	code: function (param, data)
	{
		data.total = numeral(data.total).format('0');
	}
});
	
app.add(
{
	name: 'supporter-dashboard-profile-image',
	code: function (param)
	{
		if (_.has(app.whoami().mySetup, 'images.profile'))
		{
			var profileImage = app.vq.init();

			var whoamiProfile = app.get(
			{
				scope: 'learner-me',
				context: 'whoami'
			});
		
			if (whoamiProfile._profileimage == '' || whoamiProfile._profileimage == undefined)
			{
				profileImage.add('<div class="text-center py-2"><a href="#learner-me" class="text-muted"><i class="fas fa-portrait mr-1"></i> Add a profile image...</a></div>')
			}
			else
			{
				profileImage.add(['<a href="#learner-me"><img class="img-fluid w-100 float-left" src="', whoamiProfile._profileimage, '"></a>'])
			}

			profileImage.render('#supporter-dashboard-profile-image-view');
		}
	}
});
