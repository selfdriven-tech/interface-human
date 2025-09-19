/*
	{
    	title: "Admin; Community; Communications Projects", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
    	object: "messaging_conversation", "messaging_conversation_post"
  	}
*/

app.add(
{
	name: 'admin-community-communications',
	code: function (param, response)
	{
		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		app.invoke('admin-community-communications-dashboard');
	}
});

app.add(
{
	name: 'admin-community-communications-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'admin-community-communications-dashboard',
			valueDefault: {}
		});

		var utilSetup = app.get({scope: 'util-setup'});

		var filters = [];

		if (!_.isEmpty(data.search))
		{
			filters = _.concat(
			[
				{	
					field: 'subject',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				}
			]);
		}

		filters = _.concat(
		[
			{	
				field: 'conversation',
				comparison: 'EQUAL_TO',
				value: utilSetup.conversations.default
			}
		]);
		
		app.invoke('util-view-table',
		{
			object: 'messaging_conversation_post',
			container: 'admin-community-communications-dashboard-view',
			context: 'admin-community-communications',
			filters: filters,
			options:
			{
				noDataText: 'There is now news (communication posts) that match this search.',
				rows: 50,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this news (communication post)?',
					position: 'left'
				}
			},
			customOptions:
			[
				{
					name: 'conversation',
					value: utilSetup.conversations.default
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
					method: function (row)
					{}
				},

				columns:
				[
					{
						caption: 'Subject',
						field: 'subject',
						defaultSort: true,
						sortBy: true,
						class: 'col-sm-5 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="admin-community-communication-summary"'
					},
					{
						caption: 'By',
						field: 'ownerusertext', 	
						sortBy: true,
						class: 'col-sm-4 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="admin-community-communication-summary"'
					},
					{
						caption: 'Date',
						field: 'createddate', 	
						sortBy: true,
						class: 'col-sm-3 myds-navigate text-muted',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="admin-community-communication-summary"'
					},
					{	
						fields:
						['guid', 'message']
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'admin-community-communication-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'admin-community-communication-summary',
			context: 'id'
		});

		var utilSetup = app.get({scope: 'util-setup'});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'admin-community-communications'});
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'messaging_conversation_post',
					fields: 
					[
						'subject', 'ownerusertext', 'createddate', 'message'
					],
					filters:
					[
						{
							field: 'guid',
							value: guid
						}
					],
					customOptions:
					[
						{
							name: 'conversation',
							value: utilSetup.conversations.default
						}
					],
					set: 
					{
						scope: 'admin-community-communications',
						context: 'all'
					},
					callback: 'admin-community-communication-summary'
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

						app.set(
						{
							scope: 'admin-community-communication-summary',
							context: 'dataContext',
							value: data
						});

						app.view.refresh(
						{
							scope: 'admin-community-communication-summary',
							selector: '#admin-community-communication-summary',
							data: data,
							collapse: {contexts: ['attachments']}
						});
					}
				}
			}
		}
	}	
});

app.add(
{
	name: 'admin-community-communication-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataScope: 'admin-community-communications',
			dataContext: 'all',
			scope: 'admin-community-communication-edit',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				subject: ''
			}
		}

		app.view.refresh(
		{
			scope: 'admin-community-communication-edit',
			selector: '#admin-community-communication-edit',
			data: data
		});
	}	
});

app.add(
{
	name: 'admin-community-communication-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'admin-community-communication-edit',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'admin-community-communication-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values: {}
			}
		});

		if (_.isUndefined(response))
		{		
			mydigitalstructure.cloud.save(
			{
				object: 'messaging_conversation_post',
				data: data,
				callback: 'admin-community-communication-edit-save',
				set: {scope: 'admin-community-communication-edit'},
				notify: 'Community news (conversation post) has been ' + (id==''?'added':'updated') + '.'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.invoke('util-view-refresh',
				{
					dataScope: 'admin-community-communications',
					data: data
				});

				app.invoke('app-navigate-to', {controller: 'admin-community-communication-summary', context: data.id});
			}
		}
	}
});