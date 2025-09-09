/*
	{
    	title: "Supporter; Energy"
  	}
*/

app.add(
{
	name: 'supporter-energy',
	code: function (param, response)
	{
		app.invoke('util-dashboard',
		{
			dashboards:
			[
				{
					name: 'supporter-energy-dashboard-total-in',
					containerSelector: '#supporter-energy-dashboard-total-in',
					template: '{{total}}',
					formatController: 'supporter-tokens-format',
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
								value: app.whoami().mySetup.actionTypes.environmentEnergyIn
							},
							{
								field: 'createduser',
								value: app.whoami().thisInstanceOfMe.user.id
							}
						]
					}
				},
				{
					name: 'supporter-energy-dashboard-total-out',
					containerSelector: '#supporter-energy-dashboard-total-out',
					template: '{{total}}',
					formatController: 'supporter-tokens-format',
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
								value: app.whoami().mySetup.actionTypes.environmentEnergyOut
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

		app.invoke('supporter-energy-dashboard-transactions');
	}
});

app.add(
{
	name: 'supporter-tokens-format',
	code: function (param, data)
	{
		data.total = numeral(data.total).format('0');
	}
});

app.add(
{
	name: 'supporter-energy-dashboard-transactions',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'supporter-energy-dashboard',
			valueDefault: {}
		});

		var filters =
		[
			{
				field: 'type',
				comparison: 'IN_LIST',
				value: [app.whoami().mySetup.actionTypes.environmentEnergyIn, app.whoami().mySetup.actionTypes.environmentEnergyOut]
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
			container: 'supporter-energy-dashboard-transactions-view',
			context: 'supporter-energy-dashboard-transactions',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">No liquidity has been provided by you.</div>',
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
					controller: 'supporter-energy-tokens-format'
				},

				columns:
				[
					{
						caption: 'For',
						name: 'forinfo',
						class: 'col-5 col-sm-4 myds-navigate',
						data: 'data-controller="supporter-token-summary" data-context="{{guid}}" data-id="{{guid}}"'
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
	name: 'supporter-energy-tokens-format',
	code: function (row)
	{
		row.date = app.invoke('util-view-date-clean', row.date)

		row.forinfo = '<div>' + row.contactpersontext + '</div>' +
						'<div class="text-muted small">' + row.subject;

		/*
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
		*/	
	}
});

app.add(
{
	name: 'supporter-energy-token-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'supporter-token-summary',
			context: 'id'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'supporter-tokens'});
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
						scope: 'supporter-tokens',
						context: 'all'
					},
					callback: 'supporter-token-summary'
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

						app.invoke('supporter-tokens-dashboard-transactions-format', data);

						app.set(
						{
							scope: 'supporter-token-summary',
							context: 'dataContext',
							value: data
						});

						app.invoke('util-attachments-initialise',
						{
							context: 'supporter-token-summary',
							object: app.whoami().mySetup.objects.action,
							objectContext: data.id,
							showTypes: false
						});

						app.view.refresh(
						{
							scope: 'supporter-token-summary',
							selector: '#supporter-token-summary',
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
	name: 'supporter-energy-token-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataScope: 'supporter-energy-tokens',
			dataContext: 'all',
			scope: 'supporter-energy-token-edit',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				subject: '',
				description: '',
				contactbusinesstext: '',
				unlockissuedbytext: '',
				unlocksendtokenstotext: '',
				date: moment().format('D MMM YYYY'),
				billingstatus: app.whoami().mySetup.actionBillingStatuses.nonBillable
			}
		}

		data['actiontype-sdax'] = app.whoami().mySetup.actionTypes.sdax;
		data['actiontype-sdaxuse'] = app.whoami().mySetup.actionTypes.sdaxUse;

		app.view.refresh(
		{
			scope: 'supporter-energy-token-edit',
			selector: '#supporter-energy-token-edit',
			data: data
		});

		app.invoke('util-view-select',
		{
			container: 'supporter-energy-token-edit-contactbusiness',
			object: 'contact_business',
			fields: [{name: 'tradename'}]
		});

		app.invoke('util-view-select',
		{
			container: 'supporter-energy-token-edit-unlockissuedby',
			object: 'contact_person',
			fields: [{name: 'firstname'}, {name: 'surname'}],
			filters:
			[
				{
					field: 'primarygroup',
					value: app.whoami().mySetup.personGroups.learningPartner
				}
			]
		});

		app.invoke('util-view-select',
		{
			container: 'supporter-energy-token-edit-unlocksendtokensto',
			object: 'contact_person',
			fields: [{name: 'firstname'}, {name: 'surname'}],
			filters:
			[
				{
					field: 'primarygroup',
					value: app.whoami().mySetup.personGroups.learner
				}
			]
		});
	}	
});

app.add(
{
	name: 'supporter-energy-token-edit-type',
	code: function (param)
	{
		console.log(param)
	}
});

app.add(
{
	name: 'supporter-energy-token-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'supporter-energy-token-edit',
			context: 'id',
			valueDefault: ''
		});

		var data = app.get(
		{
			scope: 'supporter-energy-token-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values:
				{
					type: app.whoami().mySetup.actionTypes.sdax
				}
			}
		});

		// transfer the "unlock..." into parameters stored in "text"

		var unlock = {}

		if (_.isSet(data['unlockissuedby']))
		{
			unlock['unlockissuedby'] = data['unlockissuedby'];
		}

		data.text = JSON.stringify({paramters: {unlock: unlock}})
			
		if (_.isUndefined(response))
		{		
			mydigitalstructure.cloud.save(
			{
				object: 'action',
				data: data,
				callback: 'supporter-token-edit-save',
				set: {scope: 'supporter-token-edit', data: true, guid: true},
				notify: 'Token has been ' + (id==''?'added':'updated') + '.'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.refresh(
				{
					dataScope: 'supporter-tokens',
					data: data
				});

				app.invoke('app-navigate-to', {controller: 'supporter-token-summary', context: data.guid});
			}
		}
	}
});
	
	

