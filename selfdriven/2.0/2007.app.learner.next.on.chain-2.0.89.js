/*
	{
    	title: "Learner; Next; On-Chain", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
  	}
*/

app.add(
{
	name: 'learner-next-on-chain',
	code: function (param, response)
	{
		app.invoke('util-dashboard',
		{
			dashboards:
			[
				{
					name: 'learner-next-on-chain-dashboard-total-achievements',
					containerSelector: '#learner-next-on-chain-dashboard-total-achievements',
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
							{name: 'count(id) total'}
						],
						filters:
						[
							{
								field: 'type',
								value: app.whoami().mySetup.actionTypes.achievement
							},
							{
								field: 'contactperson',
								value: app.whoami().thisInstanceOfMe.user.contactperson
							}
						]
					}
				},
				{
					name: 'learner-next-on-chain-dashboard-total-skils',
					containerSelector: '#learner-next-on-chain-dashboard-total-skills',
					template: '{{total}}',
					formatController: 'learner-tokens-format',
					defaults:
					{
						total: 0
					},
					storage:
					{
						object: 'contact_attribute',
						fields:
						[
							{name: 'count(id) total'}
						],
						filters:
						[
							{
								field: 'contactperson',
								value: app.whoami().thisInstanceOfMe.user.contactperson
							}
						]
					}
				}
			]
		});

		app.invoke('learner-next-on-chain-share-account');
		app.invoke('learner-next-on-chain-share');
	}
});

app.add(
{
	name: 'learner-next-on-chain-share-profile',
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
						value: app.whoami().thisInstanceOfMe.user.spacecontactbusiness
					},		
					{	
						field: 'type',
						value: 1
					},
					{	
						field: 'category',
						comparison: 'IN_LIST',
						value: '6,10'
					},
					{	
						field: 'reference',
						comparison: 'TEXT_IS_LIKE',
						value: 'SDA'
					},

				],
				sorts:
				[
					{
						field: 'modifieddate',
						direction: 'desc'
					}
				],
				callback: 'learner-next-on-chain-share-profile'
			});
		}
		else
		{
			var profileView = app.vq.init({queue: 'learner-next-on-chain-share-profile'});

			if (response.data.rows.length == 0)
			{
				const whoami = app.get(
				{
					scope: 'learner-me',
					context: 'whoami'
				});

				profileView.add(
				[
					'<div class="text-secondary mb-2">',
						'<div>',
							' Your achievement proofs will be shared using selfdrivenOcto\'s On-Chain Account.',
						'</div>',
						'<div class="mt-2">',
							' If you set up an <a href="/util-on-chain/#util-on-chain-account">On-Chain Account</a>, it can be also shared there.',
						'</div>',
					'</div>'
				])
			}
			else
			{
				var data = _.find(response.data.rows, function (row) {return row.category == 6});

				profileView.add(
				[
					'<h4 class="text-muted">selfdriven Achievements On-Chain</h4>',
				]);

				if (data != undefined)
				{
					profileView.add(
					[
						'<code>', data.key, '</code>',
						' <a href="https://cardanoscan.io/address/', data.key, '" target="_blank"><i class="fe fe-external-link text-muted"></i></a>',
						'<div class="text-muted small mb-2">Address</div>'	
					]);

					app.set(
					{
						scope: 'learner-next-on-chain-profile',
						context: 'address',
						value: data.key
					});
				}

				var data = _.find(response.data.rows, function (row) {return row.category == 10});

				if (data != undefined)
				{
					profileView.add(
					[
						'<code>', data.key, '</code>',
						' <a href="https://cardanoscan.io/tokenPolicy/', data.key, '" target="_blank"><i class="fe fe-external-link text-muted"></i></a>',
						'<div class="text-muted small">Policy ID</div>'
					]);

					app.set(
					{
						scope: 'learner-next-on-chain-profile',
						context: 'policyID',
						value: data.key
					});
				}
			}

			profileView.render('#learner-next-on-chain-profile');
		}		
	}	
});

app.add(
{
	name: 'learner-next-on-chain-share-account',
	code: function (param, response)
	{	
		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'core_protect_key',
				fields:
				[
					'key', 'categorytext', 'guid', 'modifieddate', 'category', 'type', 'object', 'objectcontext', 'notes'
				],
				filters:
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
						value: 1
					},
					{	
						field: 'category',
						comparison: 'IN_LIST',
						value: '6'
					},
					{
						field: 'title',
						comparison: 'EQUAL_TO',
						value: '[onchain-cardano-account-fully-managed]'
					}
				],
				sorts:
				[
					{
						field: 'modifieddate',
						direction: 'desc'
					}
				],
				callback: 'learner-next-on-chain-share-account'
			});
		}
		else
		{
			var profileView = app.vq.init({queue: 'learner-next-on-chain-share-profile'});

			if (response.data.rows.length == 0)
			{
				const whoami = app.get(
				{
					scope: 'learner-me',
					context: 'whoami'
				});

				profileView.add(
				[
					'<div class="text-secondary mb-2">',
						'<div>',
							' Your achievement proofs will be shared using selfdrivenOcto\'s On-Chain Account.',
						'</div>',
						'<div class="mt-2">',
							' If you set up an <a href="/util-on-chain/#util-on-chain-account">On-Chain Account</a>, it can be also shared there.',
						'</div>',
					'</div>'
				])
			}
			else
			{
				var data = _.find(response.data.rows, function (row) {return row.category == 6});

				profileView.add(
				[
					'<h4 class="text-secondary">On-Chain Account</h4>',
				]);

				if (data != undefined)
				{
					profileView.add(
					[
						'<code class="small">', data.key, '</code>',
						' <a href="https://cardanoscan.io/address/', data.key, '" target="_blank"><i class="fe fe-external-link text-secondary"></i></a>',
						'<div class="text-muted small mb-2">Account Address</div>'	
					]);

					profileView.add(
					[
						'<code class="small">', data.notes, '</code>',
						' <a href="https://cardanoscan.io/address/', data.notes, '" target="_blank"><i class="fe fe-external-link text-secondary"></i></a>',
						'<div class="text-muted small mb-2">Transaction Address</div>'	
					]);

					app.set(
					{
						scope: 'learner-next-on-chain-profile',
						context: 'address',
						value: data.key
					});
				}
			}

			profileView.render('#learner-next-on-chain-profile');
		}		
	}	
});


app.add(
{
	name: 'learner-next-on-chain-share',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learner-next-on-chain-share',
			valueDefault: {}
		});

		var filters =
		[
			{
				field: 'type',
				comparison: 'IN_LIST',
				value: app.whoami().mySetup.actionTypes.achievement
			},
			{
				field: 'contactperson',
				value: app.whoami().thisInstanceOfMe.user.contactperson
			},
			{
				field: 'billingstatus',
				value: app.whoami().mySetup.actionBillingStatuses.availableForBilling
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
			container: 'learner-next-on-chain-share-view',
			context: 'learner-next-on-chain-share',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">Hi, no achievements to share as this moment.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				select:
				{
					controller: 'learner-next-on-chain-share-move',
					caption: 'Share',
					selected: true,
					data: 'data-id={{id}}'
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
					controller: 'learner-next-on-chain-share-format'
				},

				columns:
				[
					{
						caption: 'Achievement',
						name: 'achievementinfo',
						class: 'col myds-navigate',
						data: 'data-controller="learner-token-summary" data-context="{{guid}}" data-id="{{guid}}"'
					},
					{
						caption: 'Issued By',
						field: 'action.createduser.contactpersontext',
						class: 'col',
						data: 'data-context="{{guid}}" data-id="{{guid}}"'
					},
					{
						caption: 'Issued Date',
						field: 'createddate',
						defaultSort: true,
						defaultSortDirection: 'desc',
						sortBy: true,
						class: 'col text-center',
						data: 'data-context="{{guid}}" data-id="{{guid}}"'
					},
					{
						caption: '# Skills',
						name: 'skillscount',
						class: 'col myds-navigate text-center',
						data: ''
					},
					{	
						fields:
						['guid', 'type', 'action.createduser.contactpersontext', 'subject', 'description', 'text', 'status', 'billingstatus']
					}

				]
			}
		});
	}
});

app.add(
{
	name: 'learner-next-on-chain-to-be-shared',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learner-next-on-chain-to-be-shared-undo',
			valueDefault: {}
		});

		var filters =
		[
			{
				field: 'type',
				comparison: 'IN_LIST',
				value: app.whoami().mySetup.actionTypes.achievement
			},
			{
				field: 'contactperson',
				value: app.whoami().thisInstanceOfMe.user.contactperson
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
					field: 'reference',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				}
			]);
		}

		app.invoke('util-view-table',
		{
			object: 'action',
			container: 'learner-next-on-chain-to-be-shared-view',
			context: 'learner-next-on-chain-to-be-shared',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">Hi, nothing is set to be shared as this moment.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				select:
				{
					controller: 'learner-next-on-chain-to-be-shared-undo',
					caption: 'Share',
					selected: true,
					data: 'data-id={{id}}'
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
					controller: 'learner-next-on-chain-share-format'
				},

				columns:
				[
					{
						caption: 'Achievement',
						name: 'achievementinfo',
						class: 'col myds-navigate',
						data: 'data-controller="learner-token-summary" data-context="{{guid}}" data-id="{{guid}}"'
					},
					{
						caption: 'Issued By',
						field: 'action.createduser.contactpersontext',
						class: 'col',
						data: 'data-context="{{guid}}" data-id="{{guid}}"'
					},
					{
						caption: 'Issued Date',
						field: 'createddate',
						defaultSort: true,
						defaultSortDirection: 'desc',
						sortBy: true,
						class: 'col text-center',
						data: 'data-context="{{guid}}" data-id="{{guid}}"'
					},
					{
						caption: '# Skills',
						name: 'skillscount',
						class: 'col myds-navigate text-center',
						data: ''
					},
					{	
						fields:
						['guid', 'type', 'action.createduser.contactpersontext', 'subject', 'description', 'text', 'status', 'billingstatus']
					}

				]
			}
		});
	}
});

app.add(
{
	name: 'learner-next-on-chain-share-format',
	code: function (row)
	{
		row.date = app.invoke('util-view-date-clean', row.date);
		row.createddate = app.invoke('util-view-date-format', {date: row.createddate, format: 'D MMM YYYY'});

		row.achievementinfo = '<div>' + row.subject + '</div>' +
						'<div class="text-muted small">' + row['description'] + '</div>';

		row.skillsinfo = '';
		row.skillscount = 0;

		if (_.startsWith(row.text, '['))
		{
			row._skills = JSON.parse(row.text);
			row.skillsinfo = '<ul class="text-muted small mt-2 mb-0 pl-4">' + _.join(_.map(row._skills, function (skill) {return '<li>' + skill.skilltext + '</li>'}), '') + '</ul>';

			row.achievementinfo = row.achievementinfo + row.skillsinfo;
			row.skillscount = row._skills.length
		}
	}
});

// SHARE

app.add(
{
	name: 'learner-next-on-chain-share-move-init',
	code: function (param, response)
	{
		var inputs = app.set(
		{
			scope: 'learner-next-on-chain-share-move',
			context: 'inputs',
			value: $('[data-context="learner-next-on-chain-share"] input.myds-view-table-select:checked')
		});

		app.set(
		{
			scope: 'learner-next-on-chain-share-move',
			context: 'input-ids',
			value: _.map(inputs, function (input) {return $(input).attr('data-id')})
		});

		app.set(
		{
			scope: 'learner-next-on-chain-share-move',
			context: 'index',
			value: 0
		});

		app.invoke('learner-next-on-chain-share-move-process');
	}
});

app.add(
{
	name: 'learner-next-on-chain-share-move-process',
	code: function (param, response)
	{
		var index = app.get(
		{
			scope: 'learner-next-on-chain-share-move',
			context: 'index'
		});

		var inputIDs = app.get(
		{
			scope: 'learner-next-on-chain-share-move',
			context: 'input-ids'
		});

		if (index < inputIDs.length)
		{
			var id = inputIDs[index];

			// Do the core_protect_ also notes=
			
			entityos.cloud.save(
			{
				object: 'action',
				data:
				{ 
					id: id,
					billingstatus: app.whoami().mySetup.actionBillingStatuses.billable
				},
				callback: 'learner-next-on-chain-share-move-next'
			});

			app.invoke('learner-next-on-chain-share-ssi-verifiable-credential-update',
			{
				object: app.whoami().mySetup.objects.action,
				objectContext: id,
				notes: '[achievement-ssi-share-on-chain]'
			});
		}
		else
		{
			app.notify('Achievements have been shared ready for creation on-chain.');
			app.invoke('learner-next-on-chain-share');
		}
	}
});

app.add(
{
	name: 'learner-next-on-chain-share-ssi-verifiable-credential-update',
	code: function (param, response)
	{
		if (response == undefined)
		{
			var filters =
			[
				{	
					field: 'objectcontext',
					value: _.get(param, 'objectContext', -1)
				},
				{	
					field: 'object',
					value:_.get(param, 'object', -1)
				},
				{	
					field: 'type',
					value: 1
				}
			];

			entityos.cloud.search(
			{
				object: 'core_protect_ciphertext',
				fields: ['id'],
				filters: filters,
				callback: 'learner-next-on-chain-share-ssi-verifiable-credential-update',
				callbackParam: param
			})
		}
		else
		{
			const ssiVC = _.first(response.data.rows);

			if (_.isSet(ssiVC))
			{
				entityos.cloud.save(
				{
					object: 'core_protect_ciphertext',
					data:
					{ 
						id: ssiVC.id,
						notes: _.get(param, 'notes', '[achievement-ssi]')
					}
				});
			}
		}
	}
});

app.add(
{
	name: 'learner-next-on-chain-share-move-process-ssi',
	code: function (param, response)
	{
		var index = app.get(
		{
			scope: 'learner-next-on-chain-share-move',
			context: 'index'
		});

		var inputIDs = app.get(
		{
			scope: 'learner-next-on-chain-share-move',
			context: 'input-ids'
		});

		if (index < inputIDs.length)
		{
			var id = inputIDs[index];

			// Do the core_protect_ also notes=
			
			entityos.cloud.save(
			{
				object: 'action',
				data:
				{ 
					id: id,
					billingstatus: app.whoami().mySetup.actionBillingStatuses.billable
				},
				callback: 'learner-next-on-chain-share-move-next'
			});
		}
		else
		{
			app.notify('Achievements have been shared ready for creation on-chain.')
			app.invoke('learner-next-on-chain-share');
		}
	}
});
	
app.add(
{
	name: 'learner-next-on-chain-share-move-next',
	code: function (param, response)
	{
		var index = app.get(
		{
			scope: 'learner-next-on-chain-share-move',
			context: 'index'
		});

		app.set(
		{
			scope: 'learner-next-on-chain-share-move',
			context: 'index',
			value: index + 1
		});

		app.invoke('learner-next-on-chain-share-move-process');
	}
});

// UNDO

app.add(
{
	name: 'learner-next-on-chain-to-be-shared-undo-init',
	code: function (param, response)
	{
		var inputs = app.set(
		{
			scope: 'learner-next-on-chain-to-be-shared-undo',
			context: 'inputs',
			value: $('[data-context="learner-next-on-chain-to-be-shared"] input.myds-view-table-select:checked')
		});

		app.set(
		{
			scope: 'learner-next-on-chain-to-be-shared-undo',
			context: 'input-ids',
			value: _.map(inputs, function (input) {return $(input).attr('data-id')})
		});

		app.set(
		{
			scope: 'learner-next-on-chain-to-be-shared-undo',
			context: 'index',
			value: 0
		});

		app.invoke('learner-next-on-chain-to-be-shared-undo-process');
	}
});

app.add(
{
	name: 'learner-next-on-chain-to-be-shared-undo-process',
	code: function (param, response)
	{
		var index = app.get(
		{
			scope: 'learner-next-on-chain-to-be-shared-undo',
			context: 'index'
		});

		var inputIDs = app.get(
		{
			scope: 'learner-next-on-chain-to-be-shared-undo',
			context: 'input-ids'
		});

		if (index < inputIDs.length)
		{
			var id = inputIDs[index];

			entityos.cloud.save(
			{
				object: 'action',
				data:
				{ 
					id: id,
					billingstatus: app.whoami().mySetup.actionBillingStatuses.availableForBilling
				},
				callback: 'learner-next-on-chain-to-be-shared-undo-next'
			});

			app.invoke('learner-next-on-chain-share-ssi-verifiable-credential-update',
			{
				object: app.whoami().mySetup.objects.action,
				objectContext: id,
				notes: '[achievement-ssi]'
			});
		}
		else
		{
			app.notify('Selected achievements have been unshared.')
			app.invoke('learner-next-on-chain-to-be-shared');
		}
	}
});
	
app.add(
{
	name: 'learner-next-on-chain-to-be-shared-undo-next',
	code: function (param, response)
	{
		var index = app.get(
		{
			scope: 'learner-next-on-chain-to-be-shared-undo',
			context: 'index'
		});

		app.set(
		{
			scope: 'learner-next-on-chain-to-be-shared-undo',
			context: 'index',
			value: index + 1
		});

		app.invoke('learner-next-on-chain-to-be-shared-undo-process');
	}
});


app.add(
{
	name: 'learner-next-on-chain-shared',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learner-next-on-chain-shared',
			valueDefault: {}
		});

		var filters =
		[
			{
				field: 'type',
				comparison: 'IN_LIST',
				value: app.whoami().mySetup.actionTypes.achievement
			},
			{
				field: 'contactperson',
				value: app.whoami().thisInstanceOfMe.user.contactperson
			},
			{
				field: 'billingstatus',
				value: app.whoami().mySetup.actionBillingStatuses.availableForBilling
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
			container: 'learner-next-on-chain-shared-view',
			context: 'learner-next-on-chain-shared',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">No achievements/skills have been shared on-chain.</div>',
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
					controller: 'learner-next-on-chain-share-format'
				},

				columns:
				[
					{
						caption: 'Achievement',
						name: 'achievementinfo',
						class: 'col-3 myds-navigate',
						data: 'data-controller="learner-token-summary" data-context="{{guid}}" data-id="{{guid}}"'
					},
					{
						caption: 'Issued By',
						field: 'action.createduser.contactpersontext',
						class: 'col-2',
						data: 'data-context="{{guid}}" data-id="{{guid}}"'
					},
					{
						caption: 'Issued Date',
						field: 'createddate',
						defaultSort: true,
						defaultSortDirection: 'desc',
						sortBy: true,
						class: 'col-2 text-center',
						data: 'data-context="{{guid}}" data-id="{{guid}}"'
					},
					{
						caption: '# Skills',
						name: 'skillscount',
						class: 'col-2 myds-navigate text-center',
						data: ''
					},
					{
						caption: 'SDA ID',
						field: 'guid',
						class: 'col-3 myds-navigate text-center text-muted',
						data: ''
					},
					{	
						fields:
						['type', 'action.createduser.contactpersontext', 'subject', 'description', 'text', 'status', 'billingstatus']
					}

				]
			}
		});
	}
});
	

app.add(
{
	name: 'learner-next-on-chain-query',
	code: function (param, response)
	{
		var address = app.get(
		{
			scope: 'learner-next-on-chain-profile',
			context: 'address',
		});

		var lambdaFunction = 'lab-mydigitalstructure-blockchain:lab'

		app.show('#learner-next-on-chain-query-view',
		[
			'<div class="card mt-4">',
				'<div class="card-body">',
					'<div class="text-center">',
						'<div class="mb-2 text-muted text-center"><span class="spinner-border spinner-border-sm text-primary mr-2" role="status"></span> Synchronising with the cardano blockchain... hold tight or,</div>',
						'<div class="text-muted">',
							' <a href="https://cardanoscan.io/address/', address, '" target="_blank" class="text-muted"><i class="fe fe-external-link text-muted"></i> View on cardanoscan.</a>',
						'</div>',
					'</div>',
				'</div>',
			'</div>'
		]);

		//"addr1q98ztnjfnwzyzakpcany4n60s76jy58k9hdde4sl68jyahexj04qy6cdqd5yktnvkytplxppw8a30tm0cu84kq8nymgssw53ld"
		//'lab-mydigitalstructure-blockchain'

		var onChainData = app.get(
		{
			scope: 'learner-next-on-chain-query-response',
			context: 'on-chain-data',
			valueDefault: {}
		});

		var refreshOnChainData = _.isNotSet(onChainData._asat)

		if (!refreshOnChainData)
		{
			refreshOnChainData = moment().isAfter(onChainData._asat.add(30, 'minute'))
		}

		if (refreshOnChainData)
		{
			mydigitalstructure.cloud.invoke(
			{
				method: 'core_other_service_aws_lambda',
				data:
				{
					account: 22,
					lambdafunction: lambdaFunction,
					lambdaeventdata:
					JSON.stringify({
						"site": "default",
						"namespace": "blockfrost",
						"controller": "blockchain-query",
						"address": address,
						"query":
						{
							"address": true,
							"latestBlock": false,
							"networkInfo": false,
							"latestEpoch" : false,
							"health": false,
							"pools": false
						}
					})
				},
				callback: 'learner-next-on-chain-query-response'
			});
		}
		else
		{
			app.invoke('learner-next-on-chain-query-show', param, onChainData)
		}	
	}
});

app.add(
{
	name: 'learner-next-on-chain-query-response',
	code: function (param, response)
	{
		if (response.status == 'ER')
		{
			var address = app.get(
			{
				scope: 'learner-next-on-chain-profile',
				context: 'address'
			});

			app.show('#learner-next-on-chain-query-view',
			[
				'<div class="card mt-4">',
					'<div class="card-body">',
						'<div class="text-center">',
							'<div class="text-danger mb-2">There is an issue with synchronising with the cardano blockchain... please try again later or,</div>',
							'<div class="text-muted">',
								' <a href="https://cardanoscan.io/address/', address, '" target="_blank" class="text-muted"><i class="fe fe-external-link text-muted"></i> View on cardanoscan.</a>',
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
				scope: 'llearner-next-on-chain-query-response',
				context: 'on-chain-data',
				value: onChainData
			});

			app.invoke('learner-next-on-chain-query-show', param, onChainData)
		}
	}
})

app.add(
{
	name: 'learner-next-on-chain-query-show',
	code: function (param, onChainData)
	{
		var policyID = app.get(
		{
			scope: 'learner-next-on-chain-profile',
			context: 'policyID'
		});

		var onChainQuery = app.vq.init({queue: 'learner-next-on-chain-query-view'});

		onChainQuery.add('<div class="row">');

		if (_.has(onChainData, 'address.amount'))
		{
			if (onChainData.address.amount != undefined)
			{
				_.each(onChainData.address.amount, function (amount)
				{
					amount._unit = amount.unit;
					if (amount.unit != 'lovelace')
					{
						if (amount.unit == 'd3b10fe73d752b494c93eb91f21b9c8c3aff2c30ec7a8e427d9cf262534446')
						{
							amount._unit = amount.unit;
							amount.unit = 'SDF';
							amount.imagesrc = '/site/2068/2068.image.selfdriven-token-F.png';
							amount.unithref = '<a href="https://cardanoscan.io/token/' + amount._unit + '" target="_blank">' +
												amount.unit + '</a>';
						}

						var tokenInfo = '';

						if (_.isSet(amount.imagesrc))
						{
							tokenInfo = '<img src="' + amount.imagesrc + '" class="mt-3" style="width:50px;">'
						}

						if (_.contains(amount.unit, policyID))
						{
							amount.unit = _.replace(amount.unit, policyID, '');

							if (amount.unit != '534446')
							{
								amount.assetName = mydigitalstructure._util.hex.from(amount.unit)
								amount.uuid = mydigitalstructure._util.format.asUUID(amount.assetName) 

								amount.assethref = '<a href="https://cardanoscan.io/token/' + policyID + '.' + amount.unit + '" target="_blank" class="text-muted">' +
												'View On-Chain <i class="fe fe-external-link text-muted"></i></a>';

								//tokenInfo = amount._unit
								
								onChainQuery.add(
								[
									'<div class="col-12 text-center">',
										'<div class="card">',
											'<div class="card-body">',
												'<h1 class="mb-1" style="color:#9ecbed;">', amount.uuid, '</h1>',
												'<div class="text-muted">', (_.isSet(amount.assethref)?amount.assethref:amount.assetName), '</div>',
												tokenInfo,
											'</div>',
										'</div>',
									'</div>'
								]);
							}
						}
					}
				});
			}
		}

		onChainQuery.add('</div>');

		onChainQuery.add(
		[
			'<div class="row mt-2"><div class="col-12 text-muted text-center">Last synchronised ',
					onChainData.asat, '</div></div>'
		]);

		onChainQuery.render('#learner-next-on-chain-query-view')
	}
});
	