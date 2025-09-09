/*
	{
    	title: "Org; Operations", 	
    	design: "https://slfdrvn.io/apps"
  	}
*/

app.add(
{
	name: 'org-operations',
	code: function (param, response)
	{
		var id = app._util.param.get(param, 'id', {default: 'resources'}).value;

		if (id == 'resources')
		{
			app.invoke('util-view-tab-show', '#org-operations-resources-dashboard');
		}

		if (id == 'products')
		{
			app.invoke('util-view-tab-show', '#org-operations-products-dashboard');
		}

		if (id == 'orders')
		{
			app.invoke('util-view-tab-show', '#org-operations-orders-dashboard');
		}

		app.set(
		{
			scope: 'org-operations-dashboard',
			merge: true,
			value: {dataContext: {type: id}}
		});

		app.invoke('org-operations-' + id + '-dashboard', param)
	}
});

// -- RESOURCES

app.add(
{
	name: 'org-operations-resources-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'org-operations-resources-dashboard',
			valueDefault: {}
		});

		var filters =
		[
			{
				field: 'status',
				value: '7'
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
					field: 'title',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{
					name: 'or'
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
					field: 'description',
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
			object: 'product',
			container: 'org-operations-resources-dashboard-view',
			context: 'org-operations-resources-dashboard',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">You have no operational resources that match this search.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				footer: false,
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this operational resource?',
					position: 'left'
				}
			},
			sorts:
			[
				{
					name: 'title',
					direction: 'asc'
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
					controller: 'org-operations-resources-dashboard-format'
				},
				columns:
				[
					{
						caption: 'Name',
						field: 'title',
						class: 'col-12 col-sm-3 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="org-operations-resource-summary"'
					},
					{
						caption: 'Description',
						field: 'description',
						class: 'col-12 col-sm-6 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="org-operations-resource-summary"'
					},
					{
						caption: 'Reference',
						field: 'reference', 	
						sortBy: true,
						class: 'col-0 col-sm-3 d-none d-sm-block myds-navigate text-secondary text-center',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="org-operations-resource-summary"'
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
	name: 'org-operations-resources-dashboard-format',
	code: function (row)
	{}
});

app.add(
{
	name: 'org-operations-resource-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'org-operations-resource-summary',
			context: 'id'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'org-operations'});
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'product',
					fields: 
					[
						'title',
						'description',
						'reference',
						'notes',
						'contactbusiness',
						'contactbusinesstext',
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
						scope: 'org-operations-resources',
						context: 'all'
					},
					callback: 'org-operations-resource-summary',
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
	
						app.set(
						{
							scope: 'org-operations-resource-summary',
							context: 'dataContext',
							value: data
						});

						app.view.refresh(
						{
							scope: 'org-operations-resource-summary',
							selector: '#org-operations-resource-summary',
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
							context: 'org-operations-resource-summary',
							object: app.whoami().mySetup.objects.product,
							objectContext: data.id,
							showTypes: false,
							collapsible: false
						});
								
						app.invoke('util-actions-initialise',
						{
							context: 'org-operations-resource-summary',
							object: app.whoami().mySetup.objects.product,
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
	name: 'org-operations-resource-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataScope: 'org-operations-resources',
			dataContext: 'all',
			scope: 'org-operations-resource-edit',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				reference: '',
				title: '',
				description: '',
				notes: ''
			}
		}

		app.view.refresh(
		{
			scope: 'org-operations-resource-edit',
			selector: '#org-operations-resource-edit',
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
	name: 'org-operations-resource-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			controller: 'org-operations-resource-edit',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'org-operations-resource-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values:
				{
					contactbusiness: app.whoami().thisInstanceOfMe.user.contactbusiness,
					status: 7
				}
			}
		});

		// Set category: also

		if (_.isUndefined(response))
		{
			entityos.cloud.save(
			{
				object: 'product',
				data: data,
				set: {scope: 'org-operations-resource-edit', data: true, guid: true},
				callback: 'org-operations-resource-edit-save',
				callbackParam: param
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify({message: 'Resource has been ' + (id==''?'added':'updated') + '.'});

				app.invoke('util-view-refresh',
				{
					dataScope: 'org-opportunities',
					data: data
				});

				app.invoke('app-navigate-to', {controller: 'org-operations-resource-summary', context: data.guid});
			}
		}
	}
});