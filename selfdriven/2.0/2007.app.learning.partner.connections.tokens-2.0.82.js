/*
	{
    	title: "Learning Partner; Connections; Tokens", 	
    	design: "https://selfdriven.foundation/design"
  	}
*/

app.add(
{
	name: 'learning-partner-connections-tokens',
	code: function (param, response)
	{
		app.invoke('util-dashboard',
		{
			dashboards:
			[
				{
					name: 'learning-partner-connections-tokens-community-dashboard-total-earned',
					containerSelector: '#learning-partner-connections-tokens-community-dashboard-total-earned',
					template: '{{total}}',
					formatController: 'learning-partner-connections-tokens-format',
					defaults:
					{
						total: 0
					},
					storage:
					{
						object: 'action',
						fields:
						[
							{name: 'sum(totaltimehrs) total'}
						],
						filters:
						[
							{
								field: 'type',
								value: app.whoami().mySetup.actionTypes.sdc
							},
							{
								field: 'createduser',
								value: app.whoami().thisInstanceOfMe.user.id
							}
						]
					}
				},
				{
					name: 'learning-partner-connections-tokens-community-dashboard-total-used',
					containerSelector: '#learning-partner-connections-tokens-community-dashboard-total-used',
					template: '{{total}}',
					formatController: 'learning-partner-connections-tokens-format',
					defaults:
					{
						total: 0
					},
					storage:
					{
						object: 'action',
						fields:
						[
							{name: 'sum(totaltimehrs) total'}
						],
						filters:
						[
							{
								field: 'type',
								value: app.whoami().mySetup.actionTypes.sdcUse
							},
							{
								field: 'createduser',
								value: app.whoami().thisInstanceOfMe.user.id
							}
						]
					}
				}
			]
		});

		app.invoke('learning-partner-connections-tokens-dashboard-transactions');
	}
});

app.add(
{
	name: 'learning-partner-connections-tokens-format',
	code: function (param, data)
	{
		data.total = numeral(data.total).format('0');
	}
});

app.add(
{
	name: 'learning-partner-connections-tokens-dashboard-transactions',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-tasks-dashboard',
			valueDefault: {}
		});

		var filters =
		[
			{
				field: 'type',
				comparison: 'IN_LIST',
				value: app.whoami().mySetup.actionTypes.sdcs
			},
			{
				field: 'createduser',
				value: app.whoami().thisInstanceOfMe.user.id
			}
		];

		if (!_.isEmpty(data.search))
		{
			filters = _.concat(filters,
			[
				{	
					field: 'reference',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				}
			]);
		}

		app.invoke('util-view-table',
		{
			object: 'action',
			container: 'learning-partner-connections-tokens-community-dashboard-transactions-view',
			context: 'learning-partner-connections-tokens-community-dashboard-transactions',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">No community token transactions added by you.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed'
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
					controller: 'learning-partner-connections-tokens-dashboard-transactions-format'
				},

				columns:
				[
					{
						caption: 'For',
						name: 'forinfo',
						class: 'col-5 col-sm-4 myds-navigate',
						data: 'data-controller="learning-partner-connections-token-summary" data-context="{{guid}}" data-id="{{guid}}"'
					},
					{
						caption: 'Type',
						name: 'typeinfo',
						class: 'col-4 col-sm-2 text-center',
						data: 'data-context="{{guid}}" data-id="{{guid}}"'
					},
					{
						caption: 'Date',
						field: 'date',
						defaultSort: true,
						defaultSortDirection: 'desc',
						sortBy: true,
						class: 'col-0 col-sm-3 d-none d-sm-block text-center',
						data: 'data-context="{{guid}}" data-id="{{guid}}"'
					},
					{
						caption: 'Amount',
						field: 'totaltimehrs',
						sortBy: false,
						class: 'col-3 text-center',
						data: 'data-context="{{guid}}" data-id="{{guid}}"'
					},
					{	
						fields:
						['guid', 'type', 'contactpersontext', 'subject', 'text', 'billingstatus']
					}

				]
			}
		});
	}
});

app.add(
{
	name: 'learning-partner-connections-tokens-dashboard-transactions-format',
	code: function (row)
	{
		row.date = app.invoke('util-view-date-clean', row.date)

		row.forinfo = '<div>' + row.contactpersontext + '</div>' +
						'<div class="text-muted small">' + row.subject;

		if (row.billingstatus != app.whoami().mySetup.actionBillingStatuses.nonBillable)
		{
			row.forinfo = row.forinfo + '<span class="text-muted text-superscript">*</span>'
		}

		row.forinfo = row.forinfo + '</div>'

		row.typeinfo = 'Earned';
		row.billingstatusinfo = (row.billingstatus == app.whoami().mySetup.actionBillingStatuses.nonBillable?'':'Can be used on community services');

		if (row.type == app.whoami().mySetup.actionTypes.sdcUse)
		{
			row.typeinfo = 'Used';
			row.billingstatusinfo = (row.billingstatus == app.whoami().mySetup.actionBillingStatuses.nonBillable?'':'Used on community services');
		}

		row.totaltimehrs = numeral(row.totaltimehrs).format('0');		
	}
});

app.add(
{
	name: 'learning-partner-connections-token-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'learning-partner-connections-token-summary',
			context: 'id'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'learning-partner-connections-tokens'});
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'action',
					fields: 
					[
						'subject',
						'createddate', 'modifieddate',
						'guid', 'contactperson', 'contactpersontext',
						'description', 'type', 'date', 'typetext', 'totaltimehrs', 'billingstatus'
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
						scope: 'learning-partner-connections-tokens',
						context: 'all'
					},
					callback: 'learning-partner-connections-token-summary'
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

						app.invoke('learning-partner-connections-tokens-dashboard-transactions-format', data);

						app.set(
						{
							scope: 'learning-partner-connections-token-summary',
							context: 'dataContext',
							value: data
						});

						app.invoke('util-attachments-initialise',
						{
							context: 'learning-partner-connections-token-summary',
							object: app.whoami().mySetup.objects.action,
							objectContext: data.id,
							showTypes: false
						});

						app.view.refresh(
						{
							scope: 'learning-partner-connections-token-summary',
							selector: '#learning-partner-connections-token-summary',
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
	name: 'learning-partner-connections-token-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataScope: 'learning-partner-connections-tokens',
			dataContext: 'all',
			scope: 'learning-partner-connections-token-edit',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				subject: '',
				description: '',
				contactpersontext: '',
				date: moment().format('D MMM YYYY'),
				billingstatus: app.whoami().mySetup.actionBillingStatuses.nonBillable
			}
		}

		data['actiontype-sdc'] = app.whoami().mySetup.actionTypes.sdc;
		data['actiontype-sdcuse'] = app.whoami().mySetup.actionTypes.sdcUse;

		data['billingstatusclass'] = (data.type == app.whoami().mySetup.actionTypes.sdcUse?'d-none':'');

		data['billingstatustext'] = (data.type == app.whoami().mySetup.actionTypes.sdcUse?'Has been used for community services':'Can be used for community services');

		app.view.refresh(
		{
			scope: 'learning-partner-connections-token-edit',
			selector: '#learning-partner-connections-token-edit',
			data: data
		});

		app.invoke('util-view-select',
		{
			container: 'learning-partner-connections-token-edit-contactperson',
			object: 'contact_person',
			fields: [{name: 'firstname'}, {name: 'surname'}, {name: 'contactbusiness', hidden: true}]
		});
	}	
});

app.add(
{
	name: 'learning-partner-connections-token-edit-type',
	code: function (param)
	{
		console.log(param)
	}
});

app.add(
{
	name: 'learning-partner-connections-token-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learning-partner-connections-token-edit',
			context: 'id',
			valueDefault: ''
		});

		var data = app.get(
		{
			scope: 'learning-partner-connections-token-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values:
				{
					type: app.whoami().mySetup.actionTypes.sdc
				}
			}
		});

		if (_.isUndefined(response))
		{		
			mydigitalstructure.cloud.save(
			{
				object: 'action',
				data: data,
				callback: 'learning-partner-connections-token-edit-save',
				set: {scope: 'learning-partner-connections-token-edit', data: true, guid: true},
				notify: 'Token has been ' + (id==''?'added':'updated') + '.'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.refresh(
				{
					dataScope: 'learning-partner-connections-tokens',
					data: data
				});

				app.invoke('app-navigate-to', {controller: 'learning-partner-connections-token-summary', context: data.guid});
			}
		}
	}
});
	
	

