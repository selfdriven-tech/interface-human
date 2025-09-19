/*
	{
    	title: "Org | Financials", 	
    	design: "https://slfdrvn.io/apps/#org"
  	}
*/

app.add(
{
	name: 'org-financials',
	code: function (param)
	{
		var id = app._util.param.get(param, 'id', {default: 'expense'}).value;

		if (id == 'expense')
		{
			app.invoke('util-view-tab-show', '#org-financials-dashboard-expense');
		}

		if (id == 'invoice')
		{
			app.invoke('util-view-tab-show', '#org-financials-dashboard-invoice');
		}

		app.set(
		{
			scope: 'org-financials-dashboard',
			merge: true,
			value: {dataContext: {type: id}}
		});

		app.invoke('org-financials-' + id + '-dashboard', param)
	}
});

// -- EXPENSES --

app.add(
{
	name: 'org-financials-expense-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'org-financials-expenses-dashboard',
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
					field: 'contactbusinesspaidtotext',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{
					name: 'or'
				},
				{	
					field: 'contactpersonpaidtotext',
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
			object: 'financial_expense',
			container: 'org-financials-expenses-dashboard-view',
			context: 'org-financials-expenses',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">You have no expenses that match this search.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				footer: false,
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this expense?',
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
					controller: 'org-financials-expense-dashboard-format'
				},
				columns:
				[
					{
						caption: 'Name',
						field: 'contactbusinesspaidtotext',
						class: 'col-12 col-sm-5 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="org-financials-expense-summary"'
					},
					{
						caption: 'Notes',
						field: 'notes', 	
						sortBy: true,
						defaultSort: true,
						defaultSortDirection: 'desc', 
						class: 'col-0 col-sm-7 d-none d-sm-block myds-navigate text-secondary',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="financials-expense-summary"'
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
	name: 'org-financials-expense-dashboard-format',
	code: function (row)
	{}
});

app.add(
{
	name: 'org-financials-expense-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'org-project-summary',
			context: 'id'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'org-financials'});
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'contact_expenses',
					fields: 
					[
						'guid',
					],
					filters:
					[
						{
							field: 'guid',
							value: guid
						}
					],
					callback: 'org-contact-expenses-summary',
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
						data.enddate = app.invoke('util-date', data.enddate);

						data.achievementtypeids = app.whoami().mySetup.actionTypes.achievement;
						data.reflectiontypeids = app.whoami().mySetup.actionTypes.reflection;

						app.set(
						{
							scope: 'org-project-summary',
							context: 'dataContext',
							value: data
						});

						app.view.refresh(
						{
							scope: 'org-project-summary',
							selector: '#org-project-summary',
							data: data,
							collapse:
							{
								contexts:
								[
									'tasks', 'linked-financials', 'attachments', 'actions',
									'team-edit', 'tasks-edit', 'linked-financials-edit', 'attachments-edit', 'actions-edit'
								]
							}
						});

						app.invoke('org-project-summary-source-template-show');
						
						app.invoke('util-attachments-initialise',
						{
							context: 'org-project-summary',
							object: app.whoami().mySetup.objects.project,
							objectContext: data.id,
							showTypes: false,
							collapsible: false
						});
				
						var actionTypes = app.whoami().mySetup.actionTypes;
				
						app.invoke('util-actions-initialise',
						{
							context: 'org-project-summary-reflections',
							object: app.whoami().mySetup.objects.project,
							objectContext: data.id,
							showTypes: false,
							collapsible: false,
							headerCaption: 'Search for Reflections & Feedback',
							typeIDs: actionTypes.reflection,
							types:
							[
								{
									id: actionTypes.reflectionBySelfOnGrowth,
									text: 'Reflection by Self On Growth'
								},
								{
									id: actionTypes.reflectionBySelfForGrowth,
									text: 'Reflection by Self For Growth'
								},
								{
									id: actionTypes.accountabilityFitForPurpose,
									text: 'Fit for Purpose Feedback'
								},
								{
									id: actionTypes.accountabilityUnfitForPurpose,
									text: 'Unfit for Purpose Feedback'
								}
							]
						});

						app.invoke('util-actions-initialise',
						{
							context: 'org-project-summary-achievements',
							object: app.whoami().mySetup.objects.project,
							objectContext: data.id,
							showTypes: false,
							collapsible: false,
							showAdd: false,
							headerCaption: 'Search for Achievements',
							typeIDs: actionTypes.achievement
						});
					}
				}
			}
		}
	}	
});

// -- INVOICES --

app.add(
{
	name: 'org-financials-invoice-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'org-financials-expenses-dashboard',
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
					field: 'contactbusinesssenttotext',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{
					name: 'or'
				},
				{	
					field: 'contactpersonsenttotext',
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
			object: 'financial_invoice',
			container: 'org-financials-invoices-dashboard-view',
			context: 'org-financials-invoices',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">You have no invoices that match this search.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				footer: false,
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this invoice?',
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
					controller: 'org-financials-invoice-dashboard-format'
				},
				columns:
				[
					{
						caption: 'Name',
						field: 'contactbusinesssenttotext',
						class: 'col-12 col-sm-5 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="org-financials-invoice-summary"'
					},
					{
						caption: 'Notes',
						field: 'notes', 	
						sortBy: true,
						defaultSort: true,
						defaultSortDirection: 'desc', 
						class: 'col-0 col-sm-7 d-none d-sm-block myds-navigate text-secondary',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="financials-invoice-summary"'
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
	name: 'org-financials-invoice-dashboard-format',
	code: function (row)
	{}
});

app.add(
{
	name: 'org-financials-invoice-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'org-project-summary',
			context: 'id'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'org-financials'});
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'financial_invoice',
					fields: 
					[
						'guid',
					],
					filters:
					[
						{
							field: 'guid',
							value: guid
						}
					],
					callback: 'org-contact-expenses-summary',
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
						data.enddate = app.invoke('util-date', data.enddate);

						data.achievementtypeids = app.whoami().mySetup.actionTypes.achievement;
						data.reflectiontypeids = app.whoami().mySetup.actionTypes.reflection;

						app.set(
						{
							scope: 'org-project-summary',
							context: 'dataContext',
							value: data
						});

						app.view.refresh(
						{
							scope: 'org-project-summary',
							selector: '#org-project-summary',
							data: data,
							collapse:
							{
								contexts:
								[
									'tasks', 'linked-financials', 'attachments', 'actions',
									'team-edit', 'tasks-edit', 'linked-financials-edit', 'attachments-edit', 'actions-edit'
								]
							}
						});

						app.invoke('org-project-summary-source-template-show');
						
						app.invoke('util-attachments-initialise',
						{
							context: 'org-project-summary',
							object: app.whoami().mySetup.objects.project,
							objectContext: data.id,
							showTypes: false,
							collapsible: false
						});
				
						var actionTypes = app.whoami().mySetup.actionTypes;
				
						app.invoke('util-actions-initialise',
						{
							context: 'org-project-summary-reflections',
							object: app.whoami().mySetup.objects.project,
							objectContext: data.id,
							showTypes: false,
							collapsible: false,
							headerCaption: 'Search for Reflections & Feedback',
							typeIDs: actionTypes.reflection,
							types:
							[
								{
									id: actionTypes.reflectionBySelfOnGrowth,
									text: 'Reflection by Self On Growth'
								},
								{
									id: actionTypes.reflectionBySelfForGrowth,
									text: 'Reflection by Self For Growth'
								},
								{
									id: actionTypes.accountabilityFitForPurpose,
									text: 'Fit for Purpose Feedback'
								},
								{
									id: actionTypes.accountabilityUnfitForPurpose,
									text: 'Unfit for Purpose Feedback'
								}
							]
						});

						app.invoke('util-actions-initialise',
						{
							context: 'org-project-summary-achievements',
							object: app.whoami().mySetup.objects.project,
							objectContext: data.id,
							showTypes: false,
							collapsible: false,
							showAdd: false,
							headerCaption: 'Search for Achievements',
							typeIDs: actionTypes.achievement
						});
					}
				}
			}
		}
	}	
});
