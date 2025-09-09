/*
	{
    	title: "Admin; Community; Tokens", 	
    	design: "https://www.selfdriven.foundation/design"
  	}
*/

app.add(
{
	name: 'admin-community-tokens',
	code: function (param, response)
	{
		app.invoke('admin-community-tokens-dashboard');
	}
});

app.add(
{
	name: 'admin-community-tokens-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'admin-community-tokens-dashboard',
			valueDefault: {}
		});

		var filters =
		[
			{
				name: 'type',
				comparison: 'IN_LIST',
				value: app.whoami().mySetup.actionTypes.sdcs
			}
		];

		if (!_.isEmpty(data.search))
		{
			filters = _.concat(filters,
			[
				{	
					field: 'subject',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{
					name: 'or'
				},
				{	
					field: 'action.contactperson.surname',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{
					name: 'or'
				},
				{	
					field: 'email',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				}
			]);
		}

		app.invoke('util-view-table',
		{
			object: 'action',
			container: 'admin-community-tokens-dashboard-view',
			context: 'admin-community-tokens',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">There are no tokens that match this search.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this token?',
					position: 'left'
				},
				select:
				{
					controller: 'learner-tokens-use-spend-move-process',
					caption: 'Export',
					selected: true,
					data: 'data-id={{id}} data-billingstatus="{{billingstatus}}"',
					containerClass: 'col-1 text-center'
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
					controller: 'admin-community-tokens-dashboard-format'
				},

				columns:
				[
					{
						caption: 'Issued Date',
						field: 'date',
						defaultSort: true,
						defaultSortDirection: 'desc',
						sortBy: true,
						class: 'col-2',
						data: 'data-context="{{guid}}" data-controller="admin-community-token-summary"'
					},
					{
						caption: 'Subject',
						field: 'subject',
						sortBy: true,
						class: 'col-2',
						data: 'data-context="{{guid}}" data-controller="admin-community-token-summary"'
					},
					{
						caption: 'Name',
						field: 'action.contactperson.firstname',
						sortBy: true,
						class: 'col-1',
						data: 'data-context="{{guid}}" data-controller="admin-community-token-summary"'
					},
					{
						caption: 'Last Name',
						field: 'action.contactperson.surname',
						sortBy: true,
						class: 'col-2',
						data: 'data-context="{{guid}}" data-controller="admin-community-token-summary"'
					},
					{
						caption: 'Info',
						name: 'tokeninfo', 	
						class: 'col-2 text-left',
						data: 'data-context="{{guid}}" data-controller="admin-community-token-summary"'
					},
					{
						caption: 'Amount',
						field: 'totaltimehrs', 	
						sortBy: true,
						class: 'col-1 text-center',
						data: 'data-context="{{guid}}" data-controller="admin-community-token-summary"'
					},
					{
						html: '<button class="btn btn-danger btn-outline btn-sm myds-delete"' +
	               			' id="admin-community-tokens-delete-{{id}}" data-id="{{id}}"><i class="fa fa-trash"></i></button>',
						caption: '&nbsp;',
						class: 'col-1 text-right'
					},
					{	
						fields:
						[
							'guid', 'type',
							'createddate', 'modifieddate', 'billingstatus', 'totaltimehrs', 'statustext', 'status',
							'billingstatustext', 'billingstatus', 'createdusertext', 'contactbusiness', 'contactbusinesstext', 'action.contactperson.id', 'action.contactperson.contactbusiness'
						]
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'admin-community-tokens-dashboard-format',
	code: function (row)
	{
		row.modifieddate = app.invoke('util-date', row.modifieddate);
		row.date = app.invoke('util-view-date-clean', row.date)

		row.forinfo = '<div>' + row.subject; 
		row.billingstatusinfo = (row.billingstatus == app.whoami().mySetup.actionBillingStatuses.nonBillable?'':'Can be used on community services');

		if (row.billingstatus != app.whoami().mySetup.actionBillingStatuses.nonBillable)
		{
			row.forinfo = row.forinfo + '<span class="text-superscript">*</span>';
			row.billingstatusinfo = (row.billingstatus == app.whoami().mySetup.actionBillingStatuses.nonBillable?'':'Used on community services');
		}

		row.forinfo = row.forinfo + '</div>' +
						'<div class="text-muted small">' + row['action.createduser.contactpersontext'] + '</div>'
				
		row.typeinfo = 'Earned';
		if (row.type == app.whoami().mySetup.actionTypes.sdcUse) {row.typeinfo = 'Used';}

		row.statusinfo = '';

		if (row.status == app.whoami().mySetup.actionStatuses.inProgress)
		{
			row.statusinfo = 'Spendable'
		}

		if (row.status == app.whoami().mySetup.actionStatuses.completed)
		{
			row.statusinfo = 'Spent'
		}

		row.billingstatusinfo = (row.billingstatus == app.whoami().mySetup.actionBillingStatuses.nonBillable?'':'Can be used on community services');

		row.tokeninfo = 
			'<div class="fw-bold">' + row.typeinfo + '</div>' +
			'<div>' + row.statusinfo + '</div>' +
			'<div class="text-secondary small">' + row.billingstatusinfo + '</div>' +
			'<div class="text-secondary small">' + row.createdusertext + '</div>';

		row.totaltimehrs = numeral(row.totaltimehrs).format('0');
	}
});

app.add(
{
	name: 'admin-community-tokens-delete-ok',
	code: function (param, response)
	{
		if (_.isUndefined(response))
		{
			if (!_.isUndefined(param.dataContext))
			{
				mydigitalstructure.cloud.delete(
				{
					object: 'action',
					data:
					{
						id: param.dataContext.id,
					},
					callback: 'admin-community-tokens-delete-ok'
				});
			}	
		}
		else
		{
			if (response.status == 'OK')
			{
				app.notify({message: 'Token deleted.', persist: false});
				app.invoke('admin-community-tokens');
			}
		}
	}
});

app.add(
{
	name: 'admin-community-tokens-use-spend-move-init',
	code: function (param, response)
	{
		var inputs = app.set(
		{
			scope: 'admin-community-tokens-use-spend-move',
			context: 'inputs',
			value: $('[data-context="admin-community-tokens"] input.myds-view-table-select[data-billingstatus="' + app.whoami().mySetup.actionBillingStatuses.billable + '"]:checked')
		});

		app.set(
		{
			scope: 'admin-community-tokens-use-spend-move',
			context: 'input-ids',
			value: _.map(inputs, function (input) {return $(input).attr('data-id')})
		});

		app.set(
		{
			scope: 'admin-community-tokens-use-spend-move',
			context: 'index',
			value: 0
		});

		app.invoke('admin-community-tokens-use-spend-move-process');
	}
});

app.add(
{
	name: 'admin-community-tokens-use-spend-move-process',
	code: function (param, response)
	{
		var index = app.get(
		{
			scope: 'admin-community-tokens-use-spend-move',
			context: 'index'
		});

		var inputIDs = app.get(
		{
			scope: 'admin-community-tokens-use-spend-move',
			context: 'input-ids'
		});

		if (index < inputIDs.length)
		{
			var id = inputIDs[index];

			mydigitalstructure.cloud.save(
			{
				object: 'action',
				data:
				{ 
					id: id,
					status: app.whoami().mySetup.actionStatuses.inProgress 
				},
				callback: 'admin-community-tokens-use-spend-move-next'
			});
		}
		else
		{
			app.notify('Tokens marked as spendable i.e. moved to spending account.')
			app.invoke('admin-community-tokens-dashboard');
		}
	}
});

app.add(
{
	name: 'admin-community-tokens-use-spend-move-next',
	code: function (param, response)
	{
		var index = app.get(
		{
			scope: 'admin-community-tokens-use-spend-move',
			context: 'index'
		});

		app.set(
		{
			scope: 'admin-community-tokens-use-spend-move',
			context: 'index',
			value: index + 1
		});

		app.invoke('admin-community-tokens-use-spend-move-process');
	}
});
	
// UPLOAD

app.add(
{
	name: 'admin-community-tokens-upload',
	code: function (param, response)
	{
		app.invoke('util-import-initialise-community-tokens');
	}
});

// EXPORT

app.add(
{
	name: 'admin-community-tokens-export',
	code: function (param)
	{
		app.invoke('admin-community-tokens-export-dashboard');
	}
});

app.add(
{
	name: 'admin-community-tokens-export-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'admin-community-tokens-dashboard',
			valueDefault: {}
		});

		var filters =
		[
			{
				name: 'type',
				value: app.whoami().mySetup.actionTypes.sdc
			},
			{
				field: 'status',
				value: app.whoami().mySetup.actionStatuses.inProgress
			},
			{
				field: 'billingstatus',
				value: app.whoami().mySetup.actionBillingStatuses.billable
			}
		];

		if (!_.isEmpty(data.search))
		{
			filters = _.concat(filters,
			[
				{	
					field: 'subject',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{
					name: 'or'
				},
				{	
					field: 'action.contactperson.surname',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{
					name: 'or'
				},
				{	
					field: 'email',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				}
			]);
		}

		app.invoke('util-view-table',
		{
			object: 'action',
			container: 'admin-community-tokens-export-dashboard-view',
			context: 'admin-community-tokens-export',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">There are no spendable SDC tokens that match this search.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				select:
				{
					controller: 'learner-tokens-use-spend-move-process',
					caption: 'Export',
					selected: true,
					data: 'data-id={{id}}',
					containerClass: 'col-1 text-center'
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
					controller: 'admin-community-tokens-dashboard-format'
				},

				columns:
				[
					{
						caption: 'Date',
						field: 'date',
						defaultSort: true,
						defaultSortDirection: 'desc',
						sortBy: true,
						class: 'col-2',
						data: 'data-context="{{guid}}" data-controller="admin-community-token-summary"'
					},
					{
						caption: 'Name',
						exportCaption: 'Member Name',
						field: 'action.contactperson.firstname',
						sortBy: true,
						class: 'col-1',
						data: 'data-context="{{guid}}" data-controller="admin-community-token-summary"'
					},
					{
						caption: 'Last Name',
						exportCaption: 'Member Last Name',
						field: 'action.contactperson.surname',
						sortBy: true,
						class: 'col-2',
						data: 'data-context="{{guid}}" data-controller="admin-community-token-summary"'
					},
					{
						exportCaption: 'Member Email',
						field: 'action.contactperson.email'
					},
					{
						exportCaption: 'Member selfdriven ID',
						field: 'action.contactperson.guid',
					},
					{
						caption: 'Transaction ID',
						exportCaption: 'Token Transaction ID',
						field: 'guid',
						sortBy: true,
						class: 'col-4',
						data: 'data-context="{{guid}}" data-controller="admin-community-token-summary"'
					},
					{
						caption: 'Tokens',
						field: 'totaltimehrs', 	
						sortBy: true,
						class: 'col-2 text-center',
						data: 'data-context="{{guid}}" data-controller="admin-community-token-summary"'
					},
					{
						exportCaption: 'Subject',
						field: 'subject',
						
					},
					{	
						fields:
						[
							'guid', 'type',
							'createddate', 'modifieddate', 'billingstatus', 'contactbusiness', 'contactperson', 'totaltimehrs'
						]
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'admin-community-tokens-export-convert-download',
	code: function (param, response)
	{
		var inputs = app.set(
		{
			scope: 'admin-community-tokens-export-convert-download',
			context: 'inputs',
			value: $('[data-context="admin-community-tokens-export"] input.myds-view-table-select:checked')
		});

		app.set(
		{
			scope: 'admin-community-tokens-export-convert-download',
			context: 'input-ids',
			value: _.map(inputs, function (input) {return $(input).attr('data-id')})
		});

		app.invoke('admin-community-tokens-export-convert-download-process');
	}
});

app.add(
{
	name: 'admin-community-tokens-export-convert-download-process',
	code: function (param, response)
	{
		if (response == undefined)
		{
			var ids = app.get(
			{
				scope: 'admin-community-tokens-export-convert-download',
				context: 'input-ids'
			});

			if (ids.length == 0) {ids = [-1]}

			var filters =
			[
				{
					name: 'type',
					value: app.whoami().mySetup.actionTypes.sdc
				},
				{
					field: 'status',
					value: app.whoami().mySetup.actionStatuses.inProgress
				},
				{
					field: 'billingstatus',
					value: app.whoami().mySetup.actionBillingStatuses.billable
				},
				{	
					field: 'id',
					comparison: 'IN_LIST',
					value: ids
				}
			];

			mydigitalstructure.cloud.search(
			{
				object: 'action',
				fields: ['date', 'guid', 'totaltimehrs', 'action.contactperson.firstname', 'action.contactperson.surname', 'action.contactperson.guid'],
				filters: filters,
				sorts:
				[
					{
						field: 'date',
						direction: 'asc'
					}
				],
				rows: 9999,
				callback: 'admin-community-tokens-export-convert-download-process'
			});
		}
		else
		{
			app.set(
			{
				scope: 'admin-community-tokens-export-convert-download-process',
				context: 'actions',
				value: response.data.rows
			});

			app.invoke('admin-community-tokens-export-convert-download-save')
		}
	}
});

app.add(
{
	name: 'admin-community-tokens-export-convert-download-save',
	code: function (param, response)
	{
		var multiplier = app.get(
		{
			scope: 'admin-community-tokens-export-convert',
			context: 'token-multiplier',
		});

		var _multiplier = numeral(multiplier).value();

		var actions = app.get(
		{
			scope: 'admin-community-tokens-export-convert-download-process',
			context: 'actions',
		});

		var exportActions = [];

		_.each(actions, function (action)
		{
			action._tokens = numeral(action.totaltimehrs).value();
			action.convertedTokenAmount = action._tokens * _multiplier;

			var exportAction =
			{
				firstname: action['action.contactperson.firstname'],
				lastname: action['action.contactperson.surname'],
				amount: action.convertedTokenAmount,
				transactionid: action.guid
			}

			exportActions.push(exportAction);
		});

		var filename = 'selfdriven-tokens-converted-' + _.replace(_multiplier, '.', '_') + '-' +
							moment().format('D-MMM-YYYY') + 
							'.csv'

		app.invoke('util-export-data-as-is-to-csv',
		{
			fileData: exportActions,
			filename: filename
		});
	}
});

// MARK AS SPENT & ADD USED ACTION

app.add(
{
	name: 'admin-community-tokens-export-mark-as-spent-init',
	code: function (param, response)
	{
		var inputs = app.set(
		{
			scope: 'admin-community-tokens-export-mark-as-spent',
			context: 'inputs',
			value: $('[data-context="admin-community-tokens-export"] input.myds-view-table-select:checked')
		});

		app.set(
		{
			scope: 'admin-community-tokens-export-mark-as-spent',
			context: 'input-ids',
			value: _.map(inputs, function (input) {return $(input).attr('data-id')})
		});

		app.set(
		{
			scope: 'admin-community-tokens-export-mark-as-spent',
			context: 'index',
			value: 0
		});

		app.invoke('admin-community-tokens-export-mark-as-spent-process');
	}
});

app.add(
{
	name: 'admin-community-tokens-export-mark-as-spent-process',
	code: function (param, response)
	{
		var index = app.get(
		{
			scope: 'admin-community-tokens-export-mark-as-spent',
			context: 'index'
		});

		var inputIDs = app.get(
		{
			scope: 'admin-community-tokens-export-mark-as-spent',
			context: 'input-ids'
		});

		if (index < inputIDs.length)
		{
			var id = inputIDs[index];

			mydigitalstructure.cloud.save(
			{
				object: 'action',
				data:
				{ 
					id: id,
					status: app.whoami().mySetup.actionStatuses.completed
				},
				callback: 'admin-community-tokens-export-mark-as-spent-use'
			});
		}
		else
		{
			app.notify('Tokens marked as spent.')
			app.invoke('admin-community-tokens-export-dashboard');
		}
	}
});

app.add(
{
	name: 'admin-community-tokens-export-mark-as-spent-use',
	code: function (param, response)
	{
		var index = app.get(
		{
			scope: 'admin-community-tokens-export-mark-as-spent',
			context: 'index'
		});

		var inputIDs = app.get(
		{
			scope: 'admin-community-tokens-export-mark-as-spent',
			context: 'input-ids'
		});

		var actions = app.get(
		{
			scope: 'admin-community-tokens-export',
			context: 'all'
		});

		var id = inputIDs[index];

		var action = _.find(actions, function (action)
		{
			return action.id = id;
		})

		if (action != undefined)
		{
			mydigitalstructure.cloud.save(
			{
				object: 'action',
				data:
				{ 
					contactbusiness: action.contactbusiness,
					contactperson: action.contactperson,
					totaltimehrs: action.totaltimehrs,
					date: moment().format('D MMM YYYY'),
					billingstatus: 1,
					sourceaction: id,
					subject: 'Spent on community services, e.g. buying food',
					type: app.whoami().mySetup.actionTypes.sdcUse,
					status: app.whoami().mySetup.actionStatuses.completed
				},
				callback: 'admin-community-tokens-export-mark-as-spent-next'
			});

		}
		else
		{
			app.invoke('admin-community-tokens-export-mark-as-spent-next', param)
		}
	}
});

app.add(
{
	name: 'admin-community-tokens-export-mark-as-spent-next',
	code: function (param, response)
	{
		var index = app.get(
		{
			scope: 'admin-community-tokens-export-mark-as-spent',
			context: 'index'
		});

		app.set(
		{
			scope: 'admin-community-tokens-export-mark-as-spent',
			context: 'index',
			value: index + 1
		});

		app.invoke('admin-community-tokens-export-mark-as-spent-process');
	}
});