/*
	{
    	title: "Org; Opportunities", 	
    	design: "https://slfdrvn.io/improvement-cycle"
  	}
*/

app.add(
{
	name: 'org-opportunities',
	code: function (param, response)
	{
		/*app.invoke('util-level-up-profile-challenges-project-check',
		{
			viewSelector: '#org-opportunities-dashboard-level-up-profile-challenges-check',
			viewType: 'vertical'
		});*/

		var id = app._util.param.get(param, 'id', {default: 'current'}).value;

		if (id == 'current')
		{
			app.invoke('util-view-tab-show', '#org-opportunities-dashboard-current');
		}

		if (id == 'all')
		{
			app.invoke('util-view-tab-show', '#org-opportunities-dashboard-all');
		}

		app.set(
		{
			scope: 'org-opportunities-dashboard',
			merge: true,
			value: {dataContext: {type: id}}
		});

		app.invoke('org-opportunities-dashboard-' + id, param)
	}
});

// -- CURRENT

app.add(
{
	name: 'org-opportunities-dashboard-current',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'org-opportunities-dashboard-current',
			valueDefault: {}
		});

		var filters =
		[
			{
				field: 'status',
				value: '1'
			}
		];

		if (!_.isEmpty(data.search))
		{
			filters = _.concat(filters,
			[
				{
					name: '('
				},
				{	
					field: 'reference',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{
					name: 'or'
				},
				{	
					field: 'notes',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{
					name: ')'
				}
			]);
		}
	
		app.invoke('util-view-table',
		{
			object: 'opportunity',
			container: 'org-opportunities-dashboard-view-current',
			context: 'org-opportunities',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">You have no current oppportunities that match this search.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				footer: false,
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this opportunity?',
					position: 'left'
				}
			},
			sorts:
			[
				{
					name: 'startdate',
					direction: 'desc'
				}
			],
			format:
			{
				header:
				{
					class: 'd-flex'
				},
				row:
				{
					data: 'data-id="{{id}}"',
					class: 'd-flex',
					controller: 'org-opportunities-dashboard-format'
				},
				columns:
				[
					{
						caption: 'Organisation',
						field: 'requestbycontactbusinesstext',
						class: 'col-12 col-sm-3 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="org-opportunity-summary"'
					},
					{
						caption: 'Subject',
						field: 'sourcenote',
						class: 'col-12 col-sm-6 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="org-opportunity-summary"'
					},
					{
						caption: 'Date',
						field: 'startdate', 	
						sortBy: true,
						class: 'col-0 col-sm-3 d-none d-sm-block myds-navigate text-secondary text-center',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="org-opportunity-summary"'
					},
					{	
						fields:
						[
							'guid'
						]
					}
				]
			}
		});
	}
});

// -- ALL

app.add(
{
	name: 'org-opportunities-dashboard-all',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'org-opportunities-dashboard-all',
			valueDefault: {}
		});

		var filters =
		[];

		if (!_.isEmpty(data.search))
		{
			filters = _.concat(filters,
			[
				{
					name: '('
				},
				{	
					field: 'reference',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{
					name: 'or'
				},
				{	
					field: 'notes',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{
					name: ')'
				}
			]);
		}
	
		app.invoke('util-view-table',
		{
			object: 'opportunity',
			container: 'org-opportunities-dashboard-view-all',
			context: 'org-opportunities',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">You have no opportunities that match this search.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				footer: false,
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this opportunity?',
					position: 'left'
				}
			},
			sorts:
			[
				{
					name: 'startdate',
					direction: 'desc'
				}
			],
			format:
			{
				header:
				{
					class: 'd-flex'
				},
				row:
				{
					data: 'data-id="{{id}}"',
					class: 'd-flex',
					controller: 'org-opportunities-dashboard-format'
				},
				columns:
				[
					{
						caption: 'Organisation',
						field: 'requestbycontactbusinesstext',
						class: 'col-12 col-sm-3 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="org-opportunity-summary"'
					},
					{
						caption: 'Subject',
						field: 'sourcenote',
						class: 'col-12 col-sm-6 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="org-opportunity-summary"'
					},
					{
						caption: 'Date',
						field: 'startdate', 	
						sortBy: true,
						class: 'col-0 col-sm-3 d-none d-sm-block myds-navigate text-secondary text-center',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="org-opportunity-summary"'
					},
					{	
						fields:
						[
							'guid'
						]
					}
				]
			}
		});
	}
});

// -- BOTH

app.add(
{
	name: 'org-opportunities-dashboard-format',
	code: function (row)
	{
		row.classNotes = (row.notes==''?'d-none':'');

		row.projectIcon = '<i class="fa fa-user fa-fw"></i>'
		if (row['createduser'] != app.whoami().thisInstanceOfMe.user.id)
		{
			row.projectIcon = '<i class="fa fa-users fa-fw"></i>'
		}

		row.projectInfo = '<span class="mr-1">' + row.description + '</span>' +
									'<span class="text-muted small" style="font-size: 0.7rem;">' + row.projectIcon + '</span>';
	}
});

app.add(
{
	name: 'org-opportunity-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'org-opportunity-summary',
			context: 'id'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'org-opportunities'});
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'opportunity',
					fields: 
					[
						'reference',
						'sourcenote',
						'details',
						'notes',
						'requestbycontactbusiness',
						'requestbycontactbusinesstext',
						'guid'
					],
					filters:
					[
						{
							field: 'guid',
							value: guid
						}
					],
					set: 
					{
						scope: 'org-opportunities',
						context: 'all'
					},
					callback: 'org-opportunity-summary',
					callbackParam: param
				});
			}
			else
			{
				if (response.status == 'OK')
				{
					if (response.data.rows.length == 0)
					{}
					else
					{
						var data = _.first(response.data.rows);
						data.startdate = app.invoke('util-date', data.startdate);

						app.set(
						{
							scope: 'org-opportunity-summary',
							context: 'dataContext',
							value: data
						});

						app.view.refresh(
						{
							scope: 'org-opportunity-summary',
							selector: '#org-opportunity-summary',
							data: data,
							collapse:
							{
								contexts:
								[
									'attachments', 'actions'
								]
							}
						});
						
						app.invoke('util-attachments-initialise',
						{
							context: 'org-opportunity-summary',
							object: app.whoami().mySetup.objects.opportunity,
							objectContext: data.id,
							showTypes: false,
							collapsible: false
						});
								
						app.invoke('util-actions-initialise',
						{
							context: 'org-opportunity-summary-actions',
							object: app.whoami().mySetup.objects.opportunity,
							objectContext: data.id,
							showTypes: true,
							collapsible: false,
							headerCaption: 'Search for Actions & Activity'
						});
					}
				}
			}
		}
	}	
});

app.add(
{
	name: 'org-opportunity-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataScope: 'org-opportunities',
			dataContext: 'all',
			scope: 'org-opportunity-edit',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				reference: '',
				sourcenotes: '',
				details: '',
				notes: '',
				requestbycontactbusiness: '',
				requestbycontactbusinesstext: ''
			}
		}

		app.view.refresh(
		{
			scope: 'org-opportunity-edit',
			selector: '#org-opportunity-edit',
			data: data
		});

		app.invoke('util-view-select',
		{
			container: 'org-opportunity-edit-requestbycontactbusiness-' + data.id,
			object: 'contact_business',
			fields: [{name: 'tradename'}]
		});
	}	
});

app.add(
{
	name: 'org-opportunity-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			controller: 'org-opportunity-edit',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'org-opportunity-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values:
				{
					ownercontactbusiness: app.whoami().thisInstanceOfMe.user.contactbusiness,
					manageruser: app.whoami().thisInstanceOfMe.user.id,
					status: 1
				}
			}
		});

		if (_.isUndefined(response))
		{
			entityos.cloud.save(
			{
				object: 'opportunity',
				data: data,
				set: {scope: 'admin-community-member-edit', data: true, guid: true},
				callback: 'org-opportunity-edit-save',
				callbackParam: param
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify({message: 'Opportunity has been ' + (id==''?'added':'updated') + '.'});

				app.invoke('util-view-refresh',
				{
					dataScope: 'org-opportunities',
					data: data
				});

				app.invoke('app-navigate-to', {controller: 'org-opportunity-summary', context: data.guid});
			}
		}
	}
});