/*
	{
    	title: "Org | Docs", 	
    	design: "https://slfdrvn.io/apps/#org"
  	}
*/

app.add(
{
	name: 'org-docs',
	code: function (param)
	{
		var id = app._util.param.get(param, 'id', {default: 'search'}).value;

		if (id == 'search')
		{
			app.invoke('util-view-tab-show', '#org-docs-search-dashboard');
		}

		if (id == 'folders')
		{
			app.invoke('util-view-tab-show', '#org-docs-folders-dashboard');
		}

		app.set(
		{
			scope: 'org-docs-dashboard',
			merge: true,
			value: {dataContext: {type: id}}
		});

		app.invoke('org-docs-' + id + '-dashboard', param)
	}
});

app.add(
{
	name: 'org-docs-search-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'org-docs-dashboard',
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
					field: 'title',
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
			object: 'document',
			container: 'org-docs-search-dashboard-view',
			context: 'org-docs',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">You have no organisation contacts that match this search.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				footer: false,
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this organisation contact?',
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
					controller: 'org-docs-dashboard-format'
				},
				columns:
				[
					{
						caption: 'Title',
						field: 'title',
						class: 'col-12 col-sm-9 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="org-decision-summary"'
					},
					{
						caption: 'Last Updated',
						field: 'modifieddate', 	
						sortBy: true,
						defaultSort: true,
						defaultSortDirection: 'desc', 
						class: 'col-0 col-sm-3 d-none d-sm-block myds-navigate text-muted text-right',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="org-decision-summary"'
					},
					{	
						fields:
						[
							'guid', 'type', 'typetext', 'document.documentfolderlink.folder.title'
						]
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'org-docs-dashboard-format',
	code: function (row)
	{}
});

app.add(
{
	name: 'org-docs-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'org-project-summary',
			context: 'id'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'org-docs'});
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'contact_business',
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
					callback: 'org-contact-business-summary',
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
									'tasks', 'linked-docs', 'attachments', 'actions',
									'team-edit', 'tasks-edit', 'linked-docs-edit', 'attachments-edit', 'actions-edit'
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
