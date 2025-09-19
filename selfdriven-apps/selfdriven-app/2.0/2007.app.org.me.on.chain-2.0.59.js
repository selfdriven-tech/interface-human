/*
	{
    	title: "ORG; Me; On-Chain", 	
    	design: "https://slfdrvn.io/apps"
  	}
*/

app.add(
{
	name: 'org-me-on-chain',
	code: function (param, response)
	{
		
	}
});

app.add(
{
	name: 'org-me-on-chain-edit',
	code: function (param, response)
	{	
		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'core_protect_key',
				fields:
				[
					'key', 'categorytext', 'guid', 'modifieddate'
				],
				filters:
				[
					{	
						field: 'object',
						comparison: 'IN_LIST',
						value: app.whoami().mySetup.objects.user
					},
					{	
						field: 'objectcontext',
						comparison: 'EQUAL_TO',
						value: app.whoami().thisInstanceOfMe.user.id
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
				],
				sorts:
				[
					{
						field: 'modifieddate',
						direction: 'desc'
					}
				],
				callback: 'org-me-on-chain-edit'
			});
		}
		else
		{
			var data = _.first(response.data.rows);

			data = _.assign(data,
			{
				firstname: app.whoami().thisInstanceOfMe.user.firstname,
				surname: app.whoami().thisInstanceOfMe.user.surname,
				id: app.whoami().thisInstanceOfMe.user.id,
			});

			data['cardano-primary-address'] = data['key'];
			
			app.set(
			{
				scope: 'org-me-on-chain-summary',
				context: 'dataContext',
				value: data
			});

			app.view.refresh(
			{
				scope: 'org-me-on-chain-edit',
				selector: '#org-me-on-chain-edit',
				data: data
			});
		}		
	}	
});

app.add(
{
	name: 'org-me-on-chain-edit-save',
	code: function (param, response)
	{	
		var data = app.get(
		{
			scope: 'org-me-on-chain-edit-' + app.whoami().thisInstanceOfMe.user.id,
			cleanForCloudStorage: true,
			valueDefault: {}
		});

		if (_.isSet(data['cardano-primary-address']))
		{
			if (_.isUndefined(response))
			{
				var saveData = 
				{
					object: app.whoami().mySetup.objects.user,
					objectcontext: app.whoami().thisInstanceOfMe.user.id,
					category: 6,
					title: 'Cardano Primary Address',
					key: data['cardano-primary-address']
				}

				mydigitalstructure.cloud.save(
				{
					object: 'core_protect_key',
					data: saveData,
					callback: 'org-me-on-chain-edit-save'
				});
			}
			else
			{	
				if (response.status == 'OK')
				{
					app.notify('On-Chain profile updated.');
					app.invoke('app-navigate-to', {controller: 'org-me'});
				}
			}
		}
	}
});

// --- ORG | ME | ON-CHAIN | IDENTIFIERS

app.add(
{
	name: 'org-me-on-chain-edit-identifiers-show',
	code: function (param, response)
	{	
		if (param.status == 'shown' || param.status == undefined)
		{
			var filters =
			[
				{	
					field: 'object',
					comparison: 'EQUAL_TO',
					value: app.whoami().mySetup.objects.user
				},
				{	
					field: 'objectcontext',
					comparison: 'EQUAL_TO',
					value: app.whoami().thisInstanceOfMe.user.id
				},
				{	
					field: 'type',
					comparison: 'EQUAL_TO',
					value: 1
				},
				{	
					field: 'category',
					comparison: 'IN_LIST',
					value: [4, 6, 7, 8, 9, 10]
				}
			]

			app.invoke('util-view-table',
			{
				object: 'core_protect_key',
				container: 'org-me-on-chain-edit-identifiers-view',
				context: 'org-me-on-chain-edit-identifiers',
				filters: filters,
				options:
				{
					noDataText: '<div class="p-4">There are no on-chain identifiers assigned.</div>',
					rows: 20,
					orientation: 'vertical',
					progressive: true,
					class: 'table-condensed fadeInDown',
					deleteConfirm:
					{
						text: 'Are you sure you want to delete this identifier?',
						position: 'left',
						headerText: 'Delete Identifier',
						buttonText: 'Delete',
						controller: 'util-community-member-identifier-delete-ok'
					},
					showFooter: false
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
						method: function (row)
						{}
					},

					columns:
					[
						{
							caption: 'Category',
							field: 'categorytext',
							sortBy: true,
							defaultSort: true,
							class: 'col-3 text-break text-wrap',
							data: 'data-context="{{guid}}"'
						},
						{
							caption: 'ID (Address etc)',
							field: 'key',
							sortBy: true,
							class: 'col-sm-7 text-break text-wrap',
							data: 'data-context="{{guid}}"'
						},
						{
							html: '<button class="btn btn-danger btn-outline btn-sm myds-delete"' +
									' data-id="{{id}}"><i class="fa fa-trash"></i></button>',
							caption: '&nbsp;',
							class: 'col-sm-2 text-right'
						},
						{
							fields:
							[
								'guid', 'notes'
							]
						}
					]	
				}
			});
		}
		else if (param.status == 'hidden')
		{
			app.show('#' + selector, '');
		}
	}
});

app.add(
{
	name: 'org-me-on-chain-edit-identifier-edit',
	code: function (param)
	{	
		app.invoke('util-view-select',
		{
			container: 'org-me-on-chain-edit-identifier-edit-category',
			object: 'setup_core_protect_key_category',
			searchMinimumCharacters: 0,
			fields: [{name: 'title'}],
			filters: [{field: 'id', comparison: 'IN_LIST', value: '4,6,7,8,9,10'}]
		});
	}
});

app.add(
{
	name: 'org-me-on-chain-edit-identifier-edit-save',
	code: function (param, response)
	{	
		var dataContext = app.get(
		{
			controller: 'org-me-on-chain-edit-identifier-edit',
			context: 'dataContext',
			valueDefault: {}
		});

		var id = app.get(
		{
			controller: 'org-me-on-chain-edit-identifiers-show',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'org-me-on-chain-edit-identifier-edit',
			cleanForCloudStorage: true,
			valueDefault: {}
		});

		if (id == '')
		{
			data.object = app.whoami().mySetup.objects.user,
			data.objectcontext =  app.whoami().thisInstanceOfMe.user.id;
		}
		else
		{
			data.id = id;
		}

		if (_.isUndefined(response))
		{
			mydigitalstructure.cloud.save(
			{
				object: 'core_protect_key',
				data: data,
				callback: 'org-me-on-chain-edit-identifier-edit-save'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('On-Chain Identifier assigned.');
				$('#org-me-on-chain-edit-identifier-edit-collapse').removeClass('show');
				app.invoke('org-me-on-chain-edit-identifiers-show', {status: 'shown'})
			}
		}
	}
});
