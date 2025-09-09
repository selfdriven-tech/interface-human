/*
	{
    	title: "Learner; Tokens", 	
    	design: "https://selfdriven.foundation/design"
  	}
*/

app.add(
{
	name: 'learner-tokens',
	code: function (param, response)
	{
		app.invoke('util-dashboard',
		{
			dashboards:
			[
				{
					name: 'learner-tokens-community-dashboard-total-earned',
					containerSelector: '#learner-tokens-community-dashboard-total-earned',
					template: '{{total}}',
					formatController: 'learner-tokens-format',
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
								field: 'contactperson',
								value: app.whoami().thisInstanceOfMe.user.contactperson
							}
						]
					}
				},
				{
					name: 'learner-tokens-community-dashboard-total-used',
					containerSelector: '#learner-tokens-community-dashboard-total-used',
					template: '{{total}}',
					formatController: 'learner-tokens-format',
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
								field: 'contactperson',
								value: app.whoami().thisInstanceOfMe.user.contactperson
							}
						]
					}
				}
			]
		});

		app.invoke('learner-tokens-community-dashboard-transactions');
	}
});

app.add(
{
	name: 'learner-tokens-format',
	code: function (param, data)
	{
		data.total = numeral(data.total).format('0');
	}
});

app.add(
{
	name: 'learner-tokens-community-dashboard-transactions',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learner-tasks-dashboard',
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
				field: 'contactperson',
				value: app.whoami().thisInstanceOfMe.user.contactperson
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
			container: 'learner-tokens-community-dashboard-transactions-view',
			context: 'learner-tokens-community-dashboard-transactions',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">No community token transactions.</div>',
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
					controller: 'learner-tokens-community-dashboard-transactions-format'
				},

				columns:
				[
					{
						caption: 'For',
						name: 'forinfo',
						class: 'col-6 col-sm-4 myds-navigate',
						data: 'data-controller="learner-token-summary" data-context="{{guid}}" data-id="{{guid}}"'
					},
					{
						caption: 'Type',
						name: 'typeinfo',
						class: 'col-3 text-center',
						data: 'data-context="{{guid}}" data-id="{{guid}}"'
					},
					{
						caption: 'Date',
						field: 'date',
						defaultSort: true,
						defaultSortDirection: 'desc',
						sortBy: true,
						class: 'col-0 col-sm-3 text-center d-none d-sm-block',
						data: 'data-context="{{guid}}" data-id="{{guid}}"'
					},
					{
						caption: 'Amount',
						field: 'totaltimehrs',
						sortBy: false,
						class: 'col-3 col-sm-2 text-center',
						data: 'data-context="{{guid}}" data-id="{{guid}}"'
					},
					{	
						fields:
						['guid', 'type', 'action.createduser.contactpersontext', 'subject', 'text', 'billingstatus']
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'learner-tokens-community-dashboard-transactions-format',
	code: function (row)
	{
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

		row.totaltimehrs = numeral(row.totaltimehrs).format('0');
	}
});

app.add(
{
	name: 'learner-tokens-use',
	code: function (param, response)
	{
		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'action',
				fields:
				[
					{name: 'type'},
					{name: 'sum(totaltimehrs) total'}
				],
				filters:
				[
					{
						field: 'type',
						comparison: 'IN_LIST',
						value: app.whoami().mySetup.actionTypes.sdcs
					},
					{
						field: 'contactperson',
						value: app.whoami().thisInstanceOfMe.user.contactperson
					},
					{
						field: 'status',
						value: app.whoami().mySetup.actionStatuses.notStarted
					}
				],
				callback: 'learner-tokens-use',
				callbackParam: param
			});
		}
		else
		{
			var earnedTokens = _.find(response.data.rows, function (row) {return row.type == app.whoami().mySetup.actionTypes.sdc});
			var usedTokens = _.find(response.data.rows, function (row) {return row.type == app.whoami().mySetup.actionTypes.sdcUse})
			if (earnedTokens == undefined) {earnedTokens = {type: app.whoami().mySetup.actionTypes.sdc, total: 0}}
			if (usedTokens == undefined) {usedTokens = {type: app.whoami().mySetup.actionTypes.sdcUse, total: 0}}

			var availableTokens = numeral(numeral(earnedTokens.total).value()).format('0');

			app.show('#learner-tokens-use-dashboard-on-chain', availableTokens);
			app.invoke('learner-tokens-use-dashboard-spend');
			app.invoke('learner-tokens-use-dashboard-vote');
		}
	}
});

app.add(
{
	name: 'learner-tokens-use-dashboard-spend',
	code: function (param, response)
	{
		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'action',
				fields:
				[
					{name: 'status'},
					{name: 'sum(totaltimehrs) total'}
				],
				filters:
				[
					{
						field: 'type',
						comparison: 'IN_LIST',
						value: app.whoami().mySetup.actionTypes.sdc
					},
					{
						field: 'contactperson',
						value: app.whoami().thisInstanceOfMe.user.contactperson
					},
					{
						field: 'billingstatus',
						value: app.whoami().mySetup.actionBillingStatuses.billable
					}
				],
				callback: 'learner-tokens-use-dashboard-spend',
				callbackParam: param
			});
		}
		else
		{
			var earnedTokens = _.find(response.data.rows, function (row) {return row.status == app.whoami().mySetup.actionStatuses.notStarted});
			var spendableTokens = _.find(response.data.rows, function (row) {return row.status == app.whoami().mySetup.actionStatuses.inProgress})
			if (earnedTokens == undefined) {earnedTokens = {status: app.whoami().mySetup.actionStatuses.notStarted, total: 0}}
			if (spendableTokens == undefined) {spendableTokens = {status: app.whoami().mySetup.actionStatuses.inProgress, total: 0}}

			var movableTokensTotal = numeral(numeral(earnedTokens.total).value()).format('0');
			var spendableTokensTotal = numeral(numeral(spendableTokens.total).value()).format('0');

			app.show('#learner-tokens-use-dashboard-spend', movableTokensTotal);
			app.show('#learner-tokens-use-dashboard-spend-spendable', spendableTokensTotal);
		}
	}
});

app.add(
{
	name: 'learner-tokens-use-dashboard-vote',
	code: function (param, response)
	{
		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'action',
				fields:
				[
					{name: 'type'},
					{name: 'sum(totaltimehrs) total'}
				],
				filters:
				[
					{
						field: 'type',
						comparison: 'IN_LIST',
						value: app.whoami().mySetup.actionTypes.sdc
					},
					{
						field: 'contactperson',
						value: app.whoami().thisInstanceOfMe.user.contactperson
					}
				],
				callback: 'learner-tokens-use-dashboard-vote',
				callbackParam: param
			});
		}
		else
		{
			var voteTokens = _.find(response.data.rows, function (row) {return row.type == app.whoami().mySetup.actionTypes.sdc});
			if (voteTokens == undefined) {voteTokens = {type: app.whoami().mySetup.actionTypes.sdc, total: 0}}

			var voteTokensTotal = numeral(numeral(voteTokens.total).value()).format('0');

			app.show('#learner-tokens-use-dashboard-vote', voteTokensTotal);
		}
	}
});

app.add(
{
	name: 'learner-tokens-use-on-chain',
	code: function (param, response)
	{
		app.invoke('learner-tokens-use-on-chain-profile');
		app.invoke('learner-tokens-use-on-chain-move');
	}
});

app.add(
{
	name: 'learner-tokens-use-on-chain-profile',
	code: function (param, response)
	{	
		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'core_protect_key',
				fields:
				[
					'key', 'categorytext', 'guid', 'modifieddate', 'category', 'type', 'object', 'objectcontext'
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
						value: app.whoami().thisInstanceOfMe.user.id
					},		
					{	
						field: 'type',
						value: 1
					},
					{	
						field: 'category',
						value: 6
					},

				],
				sorts:
				[
					{
						field: 'modifieddate',
						direction: 'desc'
					}
				],
				callback: 'learner-tokens-use-on-chain-profile'
			});
		}
		else
		{
			var profileView = app.vq.init({queue: 'learner-tokens-use-on-chain-profile'});

			profileView.add(
			[
				'<div class="row px-0">',
					'<div class="col-6">',
						'<div class="card">',
							'<div class="card-header text-center">',
								'<h4 class="mb-0">My Public Cardano Account / Address</h4>',
							'</div>',
							'<div class="card-body text-center">',
			]);

			if (response.data.rows.length == 0)
			{
				profileView.add('<div class="text-muted">You need to setup your on-chain profile.</div>')
			}
			else
			{
				var data = _.first(response.data.rows);
				profileView.add(
				[
					'<code>', data.key, '</code>'
					
				]);

				if (_.includes(data.key, 'stake'))
				{
					/*profileView.add(
					[
						' <a href="https://cardanoscan.io/stakekey/', data.key, '" target="_blank"><i class="fe fe-external-link text-muted"></i></a>'
					]);*/

					profileView.add(
					[
						' <a href="https://pool.pm/', data.key, '" target="_blank"><i class="fe fe-external-link text-muted"></i></a>'
					]);
				}
				else
				{
					/*
					profileView.add(
					[
						' <a href="https://cardanoscan.io/address/', data.key, '" target="_blank"><i class="fe fe-external-link text-muted"></i></a>'
					]);*/
					profileView.add(
					[
						' <a href="https://pool.pm/', data.key, '" target="_blank"><i class="fe fe-external-link text-muted"></i></a>'
					]);
				}
		
				app.set(
				{
					scope: 'learner-tokens-use-on-chain-profile',
					context: 'address',
					value: data.key
				});
			}

			profileView.add(
			[
							'</div>',
						'</div>',
					'</div>',
					'<div class="col-6">',
						'<div class="card">',
							'<div class="card-header text-center">',
								'<h4 class="mb-0">My Community\'s Public Cardano Account</h3>',
							'</div>',
							'<div class="card-body text-center" id="learner-tokens-use-on-chain-profile-community">',
			]);

			profileView.add(
			[
							'</div>',
						'</div>',
					'</div>',
				'</div>'
			]);

			profileView.render('#learner-tokens-use-on-chain-profile');

			app.invoke('learner-tokens-use-on-chain-profile-community');
		}		
	}	
});

app.add(
{
	name: 'learner-tokens-use-on-chain-profile-community',
	code: function (param, response)
	{	
		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'core_protect_key',
				fields:
				[
					'key', 'categorytext', 'guid', 'modifieddate', 'category', 'type', 'object', 'objectcontext'
				],
				filters:
				[
					{	
						field: 'object',
						comparison: 'IN_LIST',
						value: app.whoami().mySetup.objects.contactBusiness
					},
					{	
						field: 'objectcontext',
						value: app.whoami().thisInstanceOfMe.user.contactbusiness
					},		
					{	
						field: 'type',
						value: 1
					},
					{	
						field: 'category',
						value: 6
					},
				],
				sorts:
				[
					{
						field: 'modifieddate',
						direction: 'desc'
					}
				],
				callback: 'learner-tokens-use-on-chain-profile-community'
			});
		}
		else
		{
			var profileView = app.vq.init({queue: 'learner-tokens-use-on-chain-profile-community'});

			if (response.data.rows.length == 0)
			{
				profileView.add('<div class="text-muted">No community public key has been set up.</div>')
			}
			else
			{
				var data = _.first(response.data.rows);
				profileView.add(
				[
					'<code>', data.key, '</code>',
					' <a href="https://cardanoscan.io/address/', data.key, '" target="_blank"><i class="fe fe-external-link text-muted"></i></a>'
					
				]);
			}

			profileView.render('#learner-tokens-use-on-chain-profile-community');
		}		
	}	
});

app.add(
{
	name: 'learner-tokens-use-spend',
	code: function (param, response)
	{
		app.invoke('learner-tokens-use-spend-move');
	}
});

app.add(
{
	name: 'learner-tokens-use-spend-move',
	code: function (param, response)
	{
		var filters =
		[
			{
				field: 'contactperson',
				value: app.whoami().thisInstanceOfMe.user.contactperson
			},
			{
				field: 'type',
				value: app.whoami().mySetup.actionTypes.sdc
			},
			{
				field: 'status',
				value: app.whoami().mySetup.actionStatuses.notStarted
			},
			{
				field: 'billingstatus',
				value: app.whoami().mySetup.actionBillingStatuses.billable
			}
		];

		app.invoke('util-view-table',
		{
			object: 'action',
			container: 'learner-tokens-use-spend-move-view',
			context: 'learner-tokens-use-spend-move',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">No tokens available for moving.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				select:
				{
					controller: 'learner-tokens-use-spend-move-process',
					caption: 'Move',
					selected: true,
					data: 'data-id={{id}}'
				}
			},
			format:
			{
				header:
				{
					class: ''
				},

				row:
				{
					data: 'data-id="{{id}}"',
					class: '',
					controller: 'learner-tokens-use-spend-format'
				},

				columns:
				[
					{
						caption: 'For',
						name: 'forinfo',
						class: 'myds-navigate',
						data: 'data-controller="learner-token-summary" data-context="{{guid}}" data-id="{{guid}}"'
					},
					{
						caption: 'Date',
						field: 'date',
						defaultSort: true,
						defaultSortDirection: 'desc',
						sortBy: true,
						class: 'text-center',
						data: 'data-context="{{guid}}" data-id="{{guid}}"'
					},
					{
						caption: 'Amount',
						field: 'totaltimehrs',
						sortBy: true,
						class: 'text-center',
						data: 'data-context="{{guid}}" data-id="{{guid}}"'
					},
					{
						caption: 'Move To',
						name: 'accountinfo',
						class: 'text-center',
						data: 'data-context="{{guid}}" data-id="{{guid}}"'
					},
					{	
						fields:
						['guid', 'type', 'action.createduser.contactpersontext', 'subject', 'text', 'billingstatus']
					}

				]
			}
		});
	}
});
	
app.add(
{
	name: 'learner-tokens-use-spend-format',
	code: function (row)
	{
		row.date = app.invoke('util-view-date-clean', row.date)

		row.forinfo = '<div>' + row.subject; 
		row.billingstatusinfo = (row.billingstatus == app.whoami().mySetup.actionBillingStatuses.nonBillable?'':'Can be used on community services');
		row.accountinfo = 'Community Spend Account';

		if (row.billingstatus != app.whoami().mySetup.actionBillingStatuses.nonBillable)
		{
			row.forinfo = row.forinfo + '<span class="text-superscript">*</span>';
			row.billingstatusinfo = (row.billingstatus == app.whoami().mySetup.actionBillingStatuses.nonBillable?'':'Used on community services');
			row.accountinfo = "My Spend Account";
		}

		row.statusinfo = 'Spendable';

		if (row.status == app.whoami().mySetup.actionStatuses.completed)
		{
			row.statusinfo = 'Spent'
		}

		row.billingstatusinfo = (row.billingstatus == app.whoami().mySetup.actionBillingStatuses.nonBillable?'':'Used on community services');

		row.forinfo = row.forinfo + '</div>' +
						'<div class="text-muted small">' + row['action.createduser.contactpersontext'] + '</div>'
				
		row.typeinfo = 'Earned';
		if (row.type == app.whoami().mySetup.actionTypes.sdcUse) {row.typeinfo = 'Used';}

		row.totaltimehrs = numeral(row.totaltimehrs).format('0');
	}
});

app.add(
{
	name: 'learner-tokens-use-spend-move-init',
	code: function (param, response)
	{
		var inputs = app.set(
		{
			scope: 'learner-tokens-use-spend-move',
			context: 'inputs',
			value: $('[data-context="learner-tokens-use-spend-move"] input.myds-view-table-select:checked')
		});

		app.set(
		{
			scope: 'learner-tokens-use-spend-move',
			context: 'input-ids',
			value: _.map(inputs, function (input) {return $(input).attr('data-id')})
		});

		app.set(
		{
			scope: 'learner-tokens-use-spend-move',
			context: 'index',
			value: 0
		});

		app.invoke('learner-tokens-use-spend-move-process');
	}
});

app.add(
{
	name: 'learner-tokens-use-spend-move-process',
	code: function (param, response)
	{
		var index = app.get(
		{
			scope: 'learner-tokens-use-spend-move',
			context: 'index'
		});

		var inputIDs = app.get(
		{
			scope: 'learner-tokens-use-spend-move',
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
				callback: 'learner-tokens-use-spend-move-next'
			});
		}
		else
		{
			app.notify('Tokens moved to spending account.')
			app.invoke('learner-tokens-use-spend-move');
		}
	}
});

app.add(
{
	name: 'learner-tokens-use-spend-move-next',
	code: function (param, response)
	{
		var index = app.get(
		{
			scope: 'learner-tokens-use-spend-move',
			context: 'index'
		});

		app.set(
		{
			scope: 'learner-tokens-use-spend-move',
			context: 'index',
			value: index + 1
		});

		app.invoke('learner-tokens-use-spend-move-process');
	}
});
	
app.add(
{
	name: 'learner-tokens-use-spend-account',
	code: function (param, response)
	{
		var filters =
		[
			{
				field: 'contactperson',
				value: app.whoami().thisInstanceOfMe.user.contactperson
			},
			{
				field: 'type',
				value: app.whoami().mySetup.actionTypes.sdc
			},
			{
				field: 'status',
				comparison: 'NOT_EQUAL_TO',
				value: app.whoami().mySetup.actionStatuses.notStarted
			},
			{
				field: 'billingstatus',
				value: app.whoami().mySetup.actionBillingStatuses.billable
			}
		];

		app.invoke('util-view-table',
		{
			object: 'action',
			container: 'learner-tokens-use-spend-account-view',
			context: 'learner-tokens-use-spend-account',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">No tokens in your spend account.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed'
			},
			format:
			{
				header:
				{
					class: ''
				},

				row:
				{
					data: 'data-id="{{id}}"',
					class: '',
					controller: 'learner-tokens-use-spend-format'
				},

				columns:
				[
					{
						caption: 'For',
						name: 'forinfo',
						class: 'myds-navigate',
						data: 'data-controller="learner-token-summary" data-context="{{guid}}" data-id="{{guid}}"'
					},
					{
						caption: 'Date',
						field: 'date',
						defaultSort: true,
						defaultSortDirection: 'desc',
						sortBy: true,
						class: 'text-center',
						data: 'data-context="{{guid}}" data-id="{{guid}}"'
					},
					{
						caption: 'Amount',
						field: 'totaltimehrs',
						sortBy: true,
						class: 'text-center',
						data: 'data-context="{{guid}}" data-id="{{guid}}"'
					},
					{
						caption: 'Status',
						name: 'statusinfo',
						class: 'text-center',
						data: 'data-context="{{guid}}" data-id="{{guid}}"'
					},
					{	
						fields:
						['guid', 'type', 'action.createduser.contactpersontext', 'subject', 'text', 'billingstatus']
					}

				]
			}
		});
	}
});
	
app.add(
{
	name: 'learner-tokens-use-on-chain-move',
	code: function (param, response)
	{
		var filters =
		[
			{
				field: 'type',
				comparison: 'IN_LIST',
				value: app.whoami().mySetup.actionTypes.sdc
			},
			{
				field: 'status',
				value: app.whoami().mySetup.actionStatuses.notStarted
			},
			{
				field: 'contactperson',
				value: app.whoami().thisInstanceOfMe.user.contactperson
			}
		];

		app.invoke('util-view-table',
		{
			object: 'action',
			container: 'learner-tokens-use-on-chain-move-view',
			context: 'learner-tokens-use-on-chain-move',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">No tokens available for moving.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				select:
				{
					controller: 'learner-tokens-use-on-chain-move-process',
					caption: 'Move',
					selected: true,
					data: 'data-id={{id}}'
				},
			},
			format:
			{
				header:
				{
					class: ''
				},

				row:
				{
					data: 'data-id="{{id}}"',
					class: '',
					controller: 'learner-tokens-use-on-chain-move-format'
				},

				columns:
				[
					{
						caption: 'For',
						name: 'forinfo',
						class: 'myds-navigate',
						data: 'data-controller="learner-token-summary" data-context="{{guid}}" data-id="{{guid}}"'
					},
					{
						caption: 'Date',
						field: 'date',
						defaultSort: true,
						defaultSortDirection: 'desc',
						sortBy: true,
						class: 'text-center',
						data: 'data-context="{{guid}}" data-id="{{guid}}"'
					},
					{
						caption: 'Amount',
						field: 'totaltimehrs',
						sortBy: true,
						class: 'text-center',
						data: 'data-context="{{guid}}" data-id="{{guid}}"'
					},
					{
						caption: 'Move To',
						name: 'addressinfo',
						class: 'text-center',
						data: 'data-context="{{guid}}" data-id="{{guid}}"'
					},
					{	
						fields:
						['guid', 'type', 'action.createduser.contactpersontext', 'subject', 'text', 'billingstatus', 'typetext']
					}

				]
			}
		});
	}
});

app.add(
{
	name: 'learner-tokens-use-on-chain-move-format',
	code: function (row)
	{
		row.date = app.invoke('util-view-date-clean', row.date)

		row.forinfo = '<div>' + row.subject; 
		row.billingstatusinfo = (row.billingstatus == app.whoami().mySetup.actionBillingStatuses.nonBillable?'':'Can be used on community services');
		row.addressinfo = 'Community Address';

		if (row.billingstatus != app.whoami().mySetup.actionBillingStatuses.nonBillable)
		{
			row.forinfo = row.forinfo + '<span class="text-superscript">*</span>';
			row.billingstatusinfo = (row.billingstatus == app.whoami().mySetup.actionBillingStatuses.nonBillable?'':'Used on community services');
			row.addressinfo = "My Address";
		}

		row.forinfo = row.forinfo + '</div>' +
						'<div class="text-muted small">' + row['action.createduser.contactpersontext'] + '</div>' +
						'<div class="text-muted small">' + row['typetext'] + '</div>'
				
		row.typeinfo = 'Earned';
		if (row.type == app.whoami().mySetup.actionTypes.sdcUse) {row.typeinfo = 'Used';}

		row.totaltimehrs = numeral(row.totaltimehrs).format('0');
	}
});

app.add(
{
	name: 'learner-tokens-use-on-chain-query',
	code: function (param, response)
	{
		if (param.status == 'shown')
		{
			//aws function - blockfrost

			var address = app.get(
			{
				scope: 'learner-tokens-use-on-chain-profile',
				context: 'address'
			});

			var lambdaFunction = 'lab-mydigitalstructure-blockchain:lab'

			var address = app.get(
			{
				scope: 'learner-tokens-use-on-chain-profile',
				context: 'address'
			});

			app.show('#learner-tokens-use-on-chain-query-view',
			[
				'<div class="card mt-4">',
					'<div class="card-body">',
						'<div class="text-center">',
							'<div class="mb-2 text-muted text-center"><span class="spinner-border spinner-border-sm text-primary mr-2" role="status"></span> Synchronising with the Cardano blockchain... hold tight,</div>',
							'<div class="text-muted">',
								'or view on-chain <a href="https://pool.pm/', address, '" target="_blank" class="text-muted"><i class="fe fe-external-link text-muted"></i>.</a>',
							'</div>',
						'</div>',
					'</div>',
				'</div>'
			]);

			//"addr1q98ztnjfnwzyzakpcany4n60s76jy58k9hdde4sl68jyahexj04qy6cdqd5yktnvkytplxppw8a30tm0cu84kq8nymgssw53ld"
			//'lab-mydigitalstructure-blockchain'

			var onChainData = app.get(
			{
				scope: 'learner-tokens-use-on-chain-query-response',
				context: 'on-chain-data',
				valueDefault: {}
			});

			var refreshOnChainData = _.isNotSet(onChainData._asat)

			if (!refreshOnChainData)
			{
				refreshOnChainData = moment().isAfter(onChainData._asat.add(1, 'minute'))
			}

			if (refreshOnChainData)
			{
				var eventData =
				{
					"site": "default",
					"namespace": "blockfrost",
					"controller": "blockchain-query",
					"query": {}
				}

				if (_.isSet(address))
				{
					if (_.startsWith(address, 'stake'))
					{
						eventData["stakeAddress"] = address;
						eventData["query"]["accountAsset"] = true;
					}	
					else
					{
						eventData["address"] = address;
						eventData["query"]["address"] = true;
					}

					var account = app.whoami().mySetup.accounts.aws;
						
					mydigitalstructure.cloud.invoke(
					{
						method: 'core_other_service_aws_lambda',
						data:
						{
							account: account,
							lambdafunction: lambdaFunction,
							lambdaeventdata:
							JSON.stringify(eventData)
						},
						callback: 'learner-tokens-use-on-chain-query-response'
					});
				}
				else
				{
					app.show('#learner-tokens-use-on-chain-query-view',
					[
						'<div class="card mt-4">',
							'<div class="card-body">',
								'<div class="text-center">',
									'<div class="text-secondary mb-2">You need to set up your <a href="#learner-me-on-chain-edit">on-chain profile</a></div>',
								'</div>',
							'</div>',
						'</div>'
					]);
				}
			}
			else
			{
				app.invoke('learner-tokens-use-on-chain-query-show', param, onChainData)
			}	
		}
	}
});

app.add(
{
	name: 'learner-tokens-use-on-chain-query-response',
	code: function (param, response)
	{
		if (response.status == 'ER')
		{
			var address = app.get(
			{
				scope: 'learner-tokens-use-on-chain-profile',
				context: 'address'
			});

			app.show('#learner-tokens-use-on-chain-query-view',
			[
				'<div class="card mt-4">',
					'<div class="card-body">',
						'<div class="text-center">',
							'<div class="text-danger mb-2">There is an issue with synchronising with the Cardano blockchain... please try again later or,</div>',
							'<div class="text-muted">',
								' <a href="https://pool.pm/', address, '" target="_blank" class="text-muted"><i class="fe fe-external-link text-muted"></i> View on-chain.</a>',
							'</div>',
						'</div>',
					'</div>',
				'</div>'
			]);
		}
		else
		{
			var onChainData = JSON.parse(response.AWSResponse);

			onChainData._asat = moment();
			onChainData.asat = onChainData._asat.format('D MMM YYYY LT');

			app.set(
			{
				scope: 'learner-tokens-use-on-chain-query-response',
				context: 'on-chain-data',
				value: onChainData
			});

			app.invoke('learner-tokens-use-on-chain-query-show', param, onChainData)
		}
	}
})

app.add(
{
	name: 'learner-tokens-use-on-chain-query-show',
	code: function (param, onChainData)
	{
		var onChainQuery = app.vq.init({queue: 'learner-tokens-use-on-chain-query-view'});
		var tokensToShow = false;

		onChainQuery.add('<div class="row">');

		if (_.has(onChainData, 'address.amount'))
		{
			if (onChainData.address.amount != undefined)
			{
				_.each(onChainData.address.amount, function (amount)
				{
					if (amount.unit == 'lovelace')
					{
						amount.unit = 'ADA';
						amount.imagesrc = '/site/2068/2068.cardano.ada.icon.png';
						amount.quantity = numeral(numeral(amount.quantity).value() / 1000000).format('0.000000');
					}

					if (_.startsWith(amount.unit, '906ba07f6419a89d7b05cca88f0ff3ee2114936c373cb2156f8426ec'))
					{
						amount._unit = amount.unit;
						amount.unit = 'SDF';
						amount.imagesrc = '/site/2007/2007.image.selfdriven-token-SDF.png';
						amount.unithref = '<a href="https://cardanoscan.io/token/' + amount._unit + '" target="_blank">' +
							amount.unit + '</a>';
					}

					if (_.startsWith(amount.unit, 'e487d8ea06a917008df8822d65140cc933af324e805f4ddcae8fc089'))
					{
						amount._unit = amount.unit;
						amount.unit = 'SDC';
						amount.imagesrc = '/site/2007/2007.image.selfdriven-token-SDC.png';
						amount.unithref = '<a href="https://cardanoscan.io/token/' + amount._unit + '" target="_blank">' +
							amount.unit + '</a>';
					}

					if (_.startsWith(amount.unit, '6dd60b94e766e94ea3886d7631990db6d468d202c42a482090ee3a17'))
					{
						amount._unit = amount.unit;
						amount.unit = 'SDI';
						amount.imagesrc = '/site/2007/2007.image.selfdriven-token-SDI.png';
						amount.unithref = '<a href="https://cardanoscan.io/token/' + amount._unit + '" target="_blank">' +
							amount.unit + '</a>';
					}

					if (_.startsWith(amount.unit, '14302595916298c0ba104801034dbc784d1ece283c943dfab0524d0d'))
					{
						amount._unit = amount.unit;
						amount.unit = 'SDA';
						amount.imagesrc = '/site/2007/2007.image.selfdriven-token-SDA.png';
						amount.unithref = '<a href="https://cardanoscan.io/token/' + amount._unit + '" target="_blank">' +
							amount.unit + '</a>';
					}

					if (_.startsWith(amount.unit, 'df854b5a89069620f5f9ed0a3cddfea93e91ce346d5d6399da6a5e4e'))
					{
						amount._unit = amount.unit;
						amount.unit = 'SDD';
						amount.imagesrc = '/site/2007/2007.image.selfdriven-token-SDD.png';
						amount.unithref = '<a href="https://cardanoscan.io/token/' + amount._unit + '" target="_blank">' +
							amount.unit + '</a>';
					}

					if (_.startsWith(amount.unit, '6365c27f3ab76a7ebcc5646284dce0b874a07479727e74e40737b228'))
					{
						amount._unit = amount.unit;
						amount.unit = 'SDL';
						amount.imagesrc = '/site/2007/2007.image.selfdriven-token-SDL.png';
						amount.unithref = '<a href="https://cardanoscan.io/token/' + amount._unit + '" target="_blank">' +
							amount.unit + '</a>';
					}

					if (_.startsWith(amount.unit, 'efff17a2e610e5c9f46e33fe964c39602399f95aa367b37f039c1efc'))
					{
						amount._unit = amount.unit;
						amount.unit = '<i class="fe fe-book-open me-2"></i>Cardano For The Masses';
						amount.imagesrc = '/site/2007/booktoken-with-words.png';
						amount.unithref = '<a href="https://app.book.io/reader/' + amount._unit + '" target="_blank">' +
												amount.unit + '</a>';
						amount.notes = 'Click on the book link to read it using app.book.io.'
					}

					if (_.startsWith(amount.unit, '21b7da6aa32387769a00c1f0ce17db86f75b213281d79ff6b158c91f'))
					{
						amount._unit = amount.unit;
						amount.unit = '<i class="fe fe-book-open me-2"></i>Dr Jekyll & Mr Hyde';
						amount.imagesrc = '/site/2007/booktoken-with-words.png';
						amount.unithref = '<a href="https://app.book.io/reader/' + amount._unit + '" target="_blank">' +
												amount.unit + '</a>';
						amount.notes = 'Click on the book link to read it using app.book.io.'
					}

					if (_.startsWith(amount.unit, '09b1ae51b984fc1aa405d753a98a239ec4fcd2c199f0ea532e9139df'))
					{
						amount._unit = amount.unit;
						amount.unit = '<i class="fe fe-credit-card me-2"></i>MAV100 M.C.A. Membership';
						amount.imagesrc = '/site/2007/09b1ae51b984fc1aa405d753a98a239ec4fcd2c199f0ea532e9139df.png';
						amount.unithref = '<a href="https://mav100.com/beta-test/" target="_blank">' +
												'MAV100 M.C.A.</a>';
						amount.imageheight = '120px'
					}

					var tokenInfo = '';

					if (_.isSet(amount.imagesrc))
					{
						if (_.isNotSet(amount.imageheight))
						{
							amount.imageheight = '60px'
						}

						tokenInfo = '<img src="' + amount.imagesrc + '" class="mt-2" style="height:' + amount.imageheight + ';">'
					}
					
					if (tokenInfo != '')
					{
						tokensToShow = true;
		
						onChainQuery.add(
						[
							'<div class="col-12 col-md-4 text-center">',
								'<div class="card">',
									'<div class="card-body">',
										'<h1 class="mb-3" style="color:#9ecbed;">', amount.quantity, '</h1>',
										'<div class="text-muted">', (_.isSet(amount.unithref)?amount.unithref:amount.unit), '</div>',
										'<div class="text-secondary small mt-2">', amount.notes, '</div>',
										tokenInfo,
									'</div>',
								'</div>',
							'</div>'
						]);
					}
				});
			}
		}

		if (_.has(onChainData, 'account'))
		{
			_.each(onChainData.account, function (account)
			{
				if (account.unit == 'lovelace')
				{
					account.unit = 'ADA';
					account.imagesrc = '/site/2068/2068.cardano.ada.icon.png';
					account.quantity = numeral(numeral(account.quantity).value() / 1000000).format('0.000000');
				}

				if (_.startsWith(account.unit, '906ba07f6419a89d7b05cca88f0ff3ee2114936c373cb2156f8426ec'))
				{
					account._unit = account.unit;
					account.unit = 'SDF';
					account.imagesrc = '/site/2007/2007.image.selfdriven-token-SDF.png';
					account.unithref = '<a href="https://cardanoscan.io/token/' + account._unit + '" target="_blank">' +
						account.unit + '</a>';
				}

				if (_.startsWith(account.unit, 'e487d8ea06a917008df8822d65140cc933af324e805f4ddcae8fc089'))
				{
					account._unit = account.unit;
					account.unit = 'SDC';
					account.imagesrc = '/site/2007/2007.image.selfdriven-token-SDC.png';
					account.unithref = '<a href="https://cardanoscan.io/token/' + account._unit + '" target="_blank">' +
						account.unit + '</a>';
				}

				if (_.startsWith(account.unit, '6dd60b94e766e94ea3886d7631990db6d468d202c42a482090ee3a17'))
				{
					account._unit = account.unit;
					account.unit = 'SDI';
					account.imagesrc = '/site/2007/2007.image.selfdriven-token-SDI.png';
					account.unithref = '<a href="https://cardanoscan.io/token/' + account._unit + '" target="_blank">' +
						account.unit + '</a>';
				}

				if (_.startsWith(account.unit, '14302595916298c0ba104801034dbc784d1ece283c943dfab0524d0d'))
				{
					account._unit = account.unit;
					account.unit = 'SDA';
					account.imagesrc = '/site/2007/2007.image.selfdriven-token-SDA.png';
					account.unithref = '<a href="https://cardanoscan.io/token/' + account._unit + '" target="_blank">' +
						account.unit + '</a>';
				}

				if (account.unit == 'df854b5a89069620f5f9ed0a3cddfea93e91ce346d5d6399da6a5e4e')
				{
					account._unit = account.unit;
					account.unit = 'SDD';
					account.imagesrc = '/site/2007/2007.image.selfdriven-token-SDD.png';
					account.unithref = '<a href="https://cardanoscan.io/token/' + account._unit + '" target="_blank">' +
						account.unit + '</a>';
				}

				if (_.startsWith(account.unit, '6365c27f3ab76a7ebcc5646284dce0b874a07479727e74e40737b228'))
				{
					account._unit = account.unit;
					account.unit = 'SDL';
					account.imagesrc = '/site/2007/2007.image.selfdriven-token-SDL.png';
					account.unithref = '<a href="https://cardanoscan.io/token/' + account._unit + '" target="_blank">' +
						account.unit + '</a>';
				}

				if (_.startsWith(account.unit, 'efff17a2e610e5c9f46e33fe964c39602399f95aa367b37f039c1efc'))
				{
					account._unit = account.unit;
					account.unit = '<i class="fe fe-book-open me-2"></i>Cardano For The Masses';
					account.imagesrc = '/site/2007/booktoken-with-words.png';
					account.unithref = '<a href="https://app.book.io/reader/' + account._unit + '" target="_blank">' +
											account.unit + '</a>';
					account.notes = 'Click on the book link to read it using app.book.io.'
				}

				if (_.startsWith(account.unit, '21b7da6aa32387769a00c1f0ce17db86f75b213281d79ff6b158c91f'))
				{
					account._unit = account.unit;
					account.unit = '<i class="fe fe-book-open me-2"></i>Dr Jekyll & Mr Hyde';
					account.imagesrc = '/site/2007/booktoken-with-words.png';
					account.unithref = '<a href="https://app.book.io/reader/' + account._unit + '" target="_blank">' +
											account.unit + '</a>';
					account.notes = 'Click on the book link to read it using app.book.io.'
				}

				if (_.startsWith(account.unit, '09b1ae51b984fc1aa405d753a98a239ec4fcd2c199f0ea532e9139df'))
				{
					account._unit = account.unit;
					account.unit = '<i class="fe fe-credit-card me-2"></i>MAV100 M.C.A. Membership';
					account.imagesrc = '/site/2007/09b1ae51b984fc1aa405d753a98a239ec4fcd2c199f0ea532e9139df.png';
					account.unithref = '<a href="https://mav100.com/beta-test/" target="_blank">' +
											'MAV100 M.C.A.</a>';
					account.imageheight = '120px'
				}

				var tokenInfo = '';

				if (_.isSet(account.imagesrc))
				{
					if (_.isNotSet(account.imageheight))
					{
						account.imageheight = '120px'
					}

					tokenInfo = '<img src="' + account.imagesrc + '" class="mt-3" style="height:' + account.imageheight + ';">'
				}
				
				if (tokenInfo != '')
				{
					tokensToShow = true;

					onChainQuery.add(
					[
						'<div class="col-12 col-md-4 text-center">',
							'<div class="card">',
								'<div class="card-body">',
									'<h1 class="mb-3" style="color:#9ecbed;">', account.quantity, '</h1>',
									'<div class="text-muted">', (_.isSet(account.unithref)?account.unithref:account.unit), '</div>',
									'<div class="text-secondary small 3">', account.notes, '</div>',
									tokenInfo,
								'</div>',
							'</div>',
						'</div>'
					]);
				}
			});
		}

		if (!tokensToShow)
		{	
			onChainQuery.add(
			[
				'<div class="col-12 text-center">',
					'<div class="text-muted">',
						'No tokens to show.',
					'</div>',
				'</div>'
			]);
		}
		
		onChainQuery.add('</div>');

		onChainQuery.add(
		[
			'<div class="row mt-4"><div class="col-12 text-secondary text-center">Last synchronised ',
				 onChainData.asat, '</div></div>'
		]);

		var address = app.get(
		{
			scope: 'learner-tokens-use-on-chain-profile',
			context: 'address'
		});

		onChainQuery.add(
		[
			'<div class="row mt-2"><div class="col-12 text-muted text-secondary text-center">',
				'<a href="https://pool.pm/', address, '" target="_blank" class="text-secondary">View On-Chain <i class="fe fe-external-link text-muted"></i></a>',
			'</div>'
		]);
		
		onChainQuery.render('#learner-tokens-use-on-chain-query-view')
	}
});

app.add(
{
	name: 'learner-tokens-use-vote',
	code: function (param, response)
	{
		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'action',
				fields:
				[
					{name: 'type'},
					{name: 'sum(totaltimehrs) total'}
				],
				filters:
				[
					{
						field: 'type',
						comparison: 'IN_LIST',
						value: app.whoami().mySetup.actionTypes.sdc
					},
					{
						field: 'contactperson',
						value: app.whoami().thisInstanceOfMe.user.contactperson
					}
				],
				callback: 'learner-tokens-use-vote',
				callbackParam: param
			});
		}
		else
		{
			var voteTokens = _.find(response.data.rows, function (row) {return row.type == app.whoami().mySetup.actionTypes.sdc});
			if (voteTokens == undefined) {voteTokens = {type: app.whoami().mySetup.actionTypes.sdc, total: 0}}

			var voteTokensTotal = numeral(numeral(voteTokens.total).value()).format('0');
			
			app.set(
			{
				scope: 'learner-tokens-use-dashboard-use-vote',
				field: 'total',
				value: voteTokensTotal
			});

			app.show('#learner-tokens-use-dashboard-use-vote', voteTokensTotal);

			app.invoke('learner-tokens-use-vote-community')
		}
	}
});

app.add(
{
	name: 'learner-tokens-use-vote-community',
	code: function (param, response)
	{
		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'action',
				fields:
				[
					{name: 'type'},
					{name: 'sum(totaltimehrs) total'}
				],
				filters:
				[
					{
						field: 'type',
						comparison: 'IN_LIST',
						value: app.whoami().mySetup.actionTypes.sdc
					}
				],
				callback: 'learner-tokens-use-vote-community',
				callbackParam: param
			});
		}
		else
		{
			var voteTokensCommunity = _.find(response.data.rows, function (row) {return row.type == app.whoami().mySetup.actionTypes.sdc});
			if (voteTokensCommunity == undefined) {voteTokensCommunity = {type: app.whoami().mySetup.actionTypes.sdc, total: 0}}

			var voteTokensCommunityTotal = numeral(numeral(voteTokensCommunity.total).value()).format('0');

			var voteTokensTotal = app.get(
			{
				scope: 'learner-tokens-use-dashboard-use-vote',
				field: 'total'
			});

			app.show('#learner-tokens-use-dashboard-use-vote-community', voteTokensCommunityTotal);

			var allocation = '-';

			if (numeral(voteTokensCommunityTotal).value() != 0)
			{
				allocation = numeral(numeral(voteTokensTotal).value() / numeral(voteTokensCommunityTotal).value() * 100).format('0.00') + '%'
			}

			app.show('#learner-tokens-use-dashboard-use-vote-stake-allocation', allocation);
		}
	}
});


	
