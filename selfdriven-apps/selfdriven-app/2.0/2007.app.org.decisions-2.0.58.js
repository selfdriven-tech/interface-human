/*
	{
    	title: "Org; Decisions", 	
    	design: "https://slfdrvn.io/apps"
  	}
*/

app.add(
{
	name: 'org-decisions',
	code: function (param)
	{
		var id = app._util.param.get(param, 'id', {default: 'current'}).value;

		if (id == 'current')
		{
			app.invoke('util-view-tab-show', '#org-decisions-dashboard-current');
		}

		if (id == 'all')
		{
			app.invoke('util-view-tab-show', '#org-decisions-dashboard-all');
		}

		app.set(
		{
			scope: 'org-decisions-dashboard',
			merge: true,
			value: {dataContext: {type: id}}
		});

		app.invoke('org-decisions-dashboard', param)
	}
});

app.add(
{
	name: 'org-decisions-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'org-decisions-dashboard',
			valueDefault: {}
		});

		var filters =
		[
			{
				field: 'type',
				comparison: 'IN_LIST',
				value: [1]
			},
			{
				field: 'invitetype',
				comparison: 'IN_LIST',
				value: [1,2]
			},
			{
				field: 'hostcontactbusiness',
				comparison: 'IS_NOT_NULL'
			}
			,
			{
				field: 'public',
				value: 'N'
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
			object: 'event',
			container: 'org-decisions-dashboard-view',
			context: 'org-decisions',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">You have no decisions that match this search.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this decision?',
					position: 'left'
				}
			},
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
					controller: 'org-decisions-dashboard-format'
				},
				columns:
				[
					{
						caption: 'Subject',
						field: 'reference',
						class: 'col-12 col-sm-3 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="org-decision-summary"'
					},
					{
						caption: 'Notes',
						field: 'notes',
						class: 'col-12 col-sm-9 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="org-decision-summary"'
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

app.add(
{
	name: 'org-decisions-dashboard-format',
	code: function (row)
	{}
});

app.add(
{
	name: 'org-decision-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'org-decision-summary',
			context: 'id'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'org-decisions'});
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'setup_structure',
					fields: 
					[
						'reference',
						'notes',
						'guid',
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
						scope: 'org-decisions',
						context: 'all'
					},
					callback: 'org-decision-summary'
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
				
						app.set(
						{
							scope: 'org-decision-summary',
							context: 'dataContext',
							value: data
						});

						app.view.refresh(
						{
							scope: 'org-decision-summary',
							selector: '#org-decision-summary',
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
							context: 'org-decision-summary',
							object: 26, //app.whoami().mySetup.objects.structure,
							objectContext: data.id,
							showTypes: false,
							collapsible: false
						});
							
						app.invoke('util-actions-initialise',
						{
							context: 'org-decision-summary',
							object: 26, //app.whoami().mySetup.objects.structure,
							objectContext: data.id,
							showTypes: false,
							collapsible: false
						});
					}
				}
			}
		}
	}	
});

app.add(
{
	name: 'org-decision-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataScope: 'org-decisions',
			dataContext: 'all',
			scope: 'org-decision-edit',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				reference: '',
				title: '',
				notes: ''
			}
		}

		app.view.refresh(
		{
			scope: 'org-decision-edit',
			selector: '#org-decision-edit',
			data: data
		});

		/*app.invoke('util-view-select',
		{
			container: 'org-opportunity-edit-requestbycontactbusiness-' + data.id,
			object: 'contact_business',
			fields: [{name: 'tradename'}]
		});*/
	}	
});

app.add(
{
	name: 'org-decision-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			controller: 'org-decision-edit',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'org-decision-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values:
				{
					object: 26,
					type: 1
				}
			}
		});

		// Set category: also

		if (_.isUndefined(response))
		{
			entityos.cloud.save(
			{
				object: 'event',
				data: data,
				set: {scope: 'org-decision-edit', data: true, guid: true},
				callback: 'org-decision-edit-save',
				callbackParam: param
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify({message: 'Decision has been ' + (id==''?'added':'updated') + '.'});

				app.invoke('util-view-refresh',
				{
					dataScope: 'org-decisions',
					data: data
				});

				app.invoke('app-navigate-to', {controller: 'org-decision-summary', context: data.guid});
			}
		}
	}
});