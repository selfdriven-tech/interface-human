/*
	{
    	title: "Admin; Community; On-Chain", 	
    	design: "https://www.selfdriven.foundation/design"
  	}
*/

app.add(
{
	name: 'admin-community-on-chain',
	code: function (param, response)
	{
		app.invoke('admin-community-on-chain-dashboard');
	}
});

app.add(
{
	name: 'admin-community-on-chain-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'admin-community-on-chain-dashboard',
			valueDefault: {}
		});

		var filters =
		[
			{
				name: 'category',
				value: 6
			}
		];

		if (!_.isEmpty(data.search))
		{
			filters = _.concat(filters,
			[
				{	
					field: 'key',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{	
					field: 'object',
					value: app.whoami().mySetup.objects.user
				}
			]);
		}

		app.invoke('util-view-table',
		{
			object: 'core_protect_key',
			container: 'admin-community-on-chain-dashboard-view',
			context: 'admin-community-on-chain',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">There are no on-chain profiles that match this search.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this on-chain profile?',
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
					data: 'data-id="{{id}} data-context="{{guid}}"',
					class: 'd-flex',
					controller: 'admin-community-on-chain-dashboard-format'
				},
				columns:
				[
					{
						caption: 'Created Date',
						field: 'createddate',
						defaultSort: true,
						defaultSortDirection: 'desc',
						sortBy: true,
						class: 'col-2',
						data: 'data-context="{{guid}}" data-controller="admin-community-on-chain-summary"'
					},
					{
						caption: 'User Info',
						name: 'userinfo',
						defaultSort: true,
						defaultSortDirection: 'desc',
						sortBy: true,
						class: 'col-4',
						data: 'data-context="{{guid}}" data-controller="admin-community-on-chain-summary"'
					},
					{
						caption: 'Address',
						field: 'key',
						sortBy: true,
						class: 'col-5 text-break',
						data: 'data-context="{{guid}}" data-controller="admin-community-on-chain-summary"'
					},
					{
						html: '<button class="btn btn-danger btn-outline btn-sm myds-delete"' +
	               			' id="admin-community-on-chain-delete-{{id}}" data-id="{{id}}"><i class="fa fa-trash"></i></button>',
						caption: '&nbsp;',
						class: 'col-1 text-right'
					},
					{	
						fields:
						[
							'guid', 
							'createddate', 'objectcontext', 'object', 'createdusertext', 'key.createduser.contactperson.guid', 'key.createduser.contactperson.surname', 'key.createduser.contactperson.firstname'
						]
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'admin-community-on-chain-dashboard-format',
	code: function (row)
	{
		row.userinfo = '<div>' + row.createdusertext + '<div>' +
							'<div>' + row['key.createduser.contactperson.firstname'] + '<div>' +
							'<div>' + row['key.createduser.contactperson.surname'] + '<div>' +
							'<div>' + row['key.createduser.contactperson.guid'] + '<div>'
	}
});

app.add(
{
	name: 'admin-community-on-chain-delete-ok',
	code: function (param, response)
	{
		if (_.isUndefined(response))
		{
			if (!_.isUndefined(param.dataContext))
			{
				mydigitalstructure.cloud.delete(
				{
					object: 'core_protect_key',
					data:
					{
						id: param.dataContext.id,
					},
					callback: 'admin-community-on-chain-delete-ok'
				});
			}	
		}
		else
		{
			if (response.status == 'OK')
			{
				app.notify({message: 'On-Chain profile deleted.', persist: false});
				app.invoke('admin-community-on-chain');
			}
		}
	}
});
