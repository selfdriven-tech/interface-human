/*
	{
    	title: "Learner; Achievements & Linked Skills", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
		todo: "Convert to -achievements"
  	}
*/

app.add(
{
	name: 'learner-achievements',
	code: function (param, response)
	{		
		app.invoke('learner-achievements-dashboard');
	}
});

app.add(
{
	name: 'learner-achievements-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learner-achievements-dashboard',
			valueDefault: {}
		});

		var filters =
		[
			{	
				field: 'contactperson',
				comparison: 'EQUAL_TO',
				value: app.whoami().thisInstanceOfMe.user.contactperson
			},
			{	
				field: 'type',
				comparison: 'IN_LIST',
				value: app.whoami().mySetup.actionTypes.achievement
			}
		];

		if (response == undefined)
		{
			if (!_.isEmpty(data.search))
			{
				filters = _.concat(
				[
					{
						name: '('
					},
					{	
						field: 'text',
						comparison: 'TEXT_IS_LIKE',
						value: data.search
					},
					{
						name: 'or'
					},
					{	
						field: 'subject',
						comparison: 'TEXT_IS_LIKE',
						value: data.search
					},
					{
						name: 'or'
					},
					{	
						field: 'action.createduser.contactpersontext',
						comparison: 'TEXT_IS_LIKE',
						value: data.search
					},
					{
						name: ')'
					}
				]);
			}

			entityos.cloud.search(
			{
				object: 'action',
				fields: ['createdusertext', 'createddate', 'guid', 'text', 'subject', 'action.createduser.contactpersontext', 'description', 'billingstatus'],
				filters: filters,
				sorts:
				[
					{
						field: 'createddate',
						direction: 'desc'
					}
				],
				rows: 100,
				callback: 'learner-achievements-dashboard',
				callbackParam: param
			})
		}
		else
		{
			var achievementsView = app.vq.init({queue: 'learner-achievements-dashboard'});

			app.set(
			{
				scope: 'learner-achievements-dashboard',
				context: 'all',
				value: response.data.rows
			});

			if (response.data.rows.length == 0)
			{
				achievementsView.add(
				[
					'<div class="text-muted text-center">',
						'You do not have any registered achievements that match this search.',
					'</div>'
				]);
			}
			else 
			{
				achievementsView.template(
				[
					'<div class="col-12 mb-3">',
						'<div class="card">',
							'<div class="card-body py-3">',
								'<div class="row mr-0">',
									'<div class="col-8">',
										'<h3 class="mt-1 mb-1">{{subject}}</h3>',
										'<div>{{_description}}</div>',
										'<div class="text-muted small mt-3">Issued By</div>',
										'<div class="text-secondary">{{action.createduser.contactpersontext}}, {{createddate}}</div>',
										'<div class="mt-2" id="learner-achievements-ssi-view-{{id}}">',
											'<button type="button" class="btn btn-default btn-sm btn-outline myds-click mt-1" data-spinner="prepend" data-context="{{guid}}" data-controller="learner-achievements-ssi-verifiable-credential">',
												'Generate SSI Verifiable Credential',
											'</button>',
										'</div>',
										'<div id="learner-achievements-dashboard-view-{{guid}}-ssi">',
										'</div>',
									'</div>',
									'<div class="col-4 text-right pr-0">',
									'{{skills}}',
									'</div>',
								'</div>',
								'<div class="row mr-0">',
									'<div class="col-12">',
										'<div id="learner-achievements-ssi-verifiable-credential-view-{{guid}}"></div>',
									'</div>',
								'</div>',
								'<div class="row mr-0">',
									'<div class="col-12">',
										'<div id="learner-achievements-ssi-verifiable-credential-view-{{guid}}-on-chain"></div>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="collapse myds-collapse" id="learner-achievements-dashboard-collapse-{{guid}}"',
								'data-controller="learner-achievements-dashboard-show"',
								'data-skill="{{guid}}">',
								'<div class="card-body pt-1 pb-4 px-4" id="learner-achievements-dashboard-view-{{guid}}">',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);

				achievementsView.add(
				[
					'<div class="px-0">',
						'<div class="row">'
				]);

				_.each(response.data.rows, function (row)
				{
					row.skills = '';

					row._description = '<div class="mb-2">' + row.description + '</div>';

					if (_.startsWith(row.text, '['))
					{
						row._skills = JSON.parse(row.text);
						row.skills = '<div class="text-secondary text-left fw-bold mt-1 mb-1">Related Skills</div>' + 
										'<div class="text-secondary text-left">' + _.join(_.map(row._skills, function (skill) {return '<div class="mb-1">' + skill.skilltext + '</div>'}), '') + '</div>';
						row._description = '';
					}

					row.createddate = app.invoke('util-date', {date: row.createddate, format: 'DD MMM YYYY'});
					achievementsView.add({useTemplate: true}, row)
				});

				achievementsView.add('</div></div>');
			}

			achievementsView.render('#learner-achievements-view');

			app.invoke('learner-achievements-dashboard-ssi', param);
		}
	}
});

app.add(
{
	name: 'learner-achievements-dashboard-ssi',
	code: function (param, response)
	{
		const actions =	app.get(
		{
			scope: 'learner-achievements-dashboard',
			context: 'all'
		});

		if (response == undefined)
		{
			if (actions.length > 0)
			{
				var filters =
				[
					{	
						field: 'objectcontext',
						comparison: 'IN_LIST',
						value: _.map(actions, 'id')
					},
					{	
						field: 'object',
						value: app.whoami().mySetup.objects.action
					},
					{	
						field: 'notes',
						comparison: 'TEXT_IS_LIKE',
						value: 'achievement-ssi'
					},
					{	
						field: 'type',
						value: 1
					}
				];

				entityos.cloud.search(
				{
					object: 'core_protect_ciphertext',
					fields: ['sourcetext', 'keytext', 'objectcontext', 'key', 'notes'],
					filters: filters,
					callback: 'learner-achievements-dashboard-ssi',
					callbackParam: param
				})
			}
		}
		else
		{
			app.set(
			{
				scope: 'learner-achievements-dashboard',
				context: 'ssi-verifiable-credentials',
				value: response.data.rows
			});

			_.each(response.data.rows, function (row)
			{
				$('#learner-achievements-ssi-view-' + row.objectcontext + ' button')
					.html('View SSI Verifiable Credential')
					.data('ssi', row.id);
			});
		}
	}
});

app.add(
{
	name: 'learner-achievement-summary',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learner-achievement-summary',
			context: 'id',
			valueDefault: ''
		});

		var data = app.find(
		{
			dataController: 'learner-achievements',
			dataContext: 'all',
			controller: 'learner-achievement-summary',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				notes: ''
			}
		}

		app.view.refresh(
		{
			scope: 'learner-achievement-summary',
			selector: '#learner-achievement-summary',
			data: data
		});
	}	
});
	
app.add(
{
	name: 'learner-achievements-skills-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learner-achievements-dashboard',
			valueDefault: {}
		});

		var filters = [];

		if (response == undefined)
		{
			if (!_.isEmpty(data.search))
			{
				filters = _.concat(
				[
					{
						name: '('
					},
					{	
						field: 'attributetext',
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

			filters.push(
			{
				field: 'contactperson',
				value: app.whoami().thisInstanceOfMe.user.contactperson
			});

			mydigitalstructure.cloud.search(
			{
				object: 'contact_attribute',
				fields:
				[
					'attributetext',
					'attribute',
					'notes',
					'guid',
					'createddate',
					'createdusertext',
					'attribute.createduser.contactperson.guid',
					'attribute.createduser.contactpersontext'
				],
				filters: filters,
				sorts:
				[
					{
						field: 'attributetext',
						direction: 'asc'
					}
				],
				callback: 'learner-achievements-dashboard'
			})
		}
		else
		{
			var skillsView = app.vq.init({queue: 'learner-achievements-dashboard'});

			if (response.data.rows.length == 0)
			{
				skillsView.add(
				[
					'<div class="text-muted text-center">',
						'You do not have any registered achievements that match this search.',
					'</div>'
				]);
			}
			else 
			{
				skillsView.template(
				[
					'<div class="col-sm-12 mb-3 mt-1">',
						'<div class="card">',
							'<div class="card-body py-3">',
								'<div class="row mr-0">',
									'<div class="col-11">',
										'<h3 class="mt-1 mb-2">{{attributetext}}</h3>',
										'<div class="mb-2">{{notes}}</div>',
										'<div class="text-muted small">{{attribute.createduser.contactpersontext}}, {{createddate}}</div>',
									'</div>',
									'<div class="col-1 text-right pr-0 d-none">',
										'<a class="btn btn-link btn-sm text-muted myds-collapse-toggle"',
											' data-toggle="collapse" role="button"',
											' href="#learner-achievements-dashboard-collapse-{{id}}"',
										'>',
											'<i class="fa fa-chevron-down text-muted"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="collapse myds-collapse" id="learner-achievements-dashboard-collapse-{{guid}}"',
								'data-controller="learner-achievements-dashboard-show"',
								'data-skill="{{guid}}">',
								'<div class="card-body pt-1 pb-4 px-4" id="learner-achievements-dashboard-view-{{guid}}">',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);

				skillsView.add(
				[
					'<div class="px-0">',
						'<div class="row">'
				]);

				_.each(response.data.rows, function (row)
				{
					row.createddate = app.invoke('util-date', {date: row.createddate, format: 'DD MMM YYYY'});
					skillsView.add({useTemplate: true}, row)
				});

				skillsView.add('</div></div>');
			}

			skillsView.render('#learner-achievements-skills-view');
		}
	}
});

app.add(
{
	name: 'learner-skill-summary',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learner-achievement-skill-summary',
			context: 'id',
			valueDefault: ''
		});

		var data = app.find(
		{
			dataController: 'learner-achievements',
			dataContext: 'all',
			controller: 'learner-skill-summary',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				notes: ''
			}
		}

		app.view.refresh(
		{
			scope: 'learner-achievement-skill-summary',
			selector: '#learner-achievement-skill-summary',
			data: data
		});
	}	
});


// SSI VERIFIABLE CREDENTIALS

app.add(
{
	name: 'learner-achievements-ssi-verifiable-credential',
	code: function (param, response)
	{
		if (response == undefined)
		{
			const actionGUID = _.get(param, 'dataContext.context')

			entityos.cloud.search(
			{
				object: 'action',
				fields: ['guid', 'text', 'action.contactperson.guid', 'modifieddate', 'billingstatus'],
				filters: {guid: actionGUID},
				callback: 'learner-achievements-ssi-verifiable-credential',
				callbackParam: param
			});
		}
		else
		{
			if (response.data.rows.length == 0)
			{
				app.notify({error: 'Can not find the achievement.'})
			}
			else
			{
				app.set(
				{
					scope: 'learner-achievements-ssi-verifiable-credential',
					context: 'action',
					value: _.first(response.data.rows)
				});

				app.invoke('learner-achievements-ssi-verifiable-credential-generate', param);
			}
		}
	}
})

app.add(
{
	name: 'learner-achievements-ssi-verifiable-credential-generate',
	code: function (param, response)
	{
		const ssiVCID = _.get(param, 'dataContext.ssi');
		let ssiVC;

		if (_.isSet(ssiVCID))
		{
			const ssiVerfiableCredentials = app.get(
			{
				scope: 'learner-achievements-dashboard',
				context: 'ssi-verifiable-credentials'
			});

			const ssiVerfiableCredential = _.find(ssiVerfiableCredentials, function (ssiVC)
			{
				return (ssiVC.id == ssiVCID)
			});

			if (_.isSet(ssiVerfiableCredential))
			{
				app.set(
				{
					scope: 'learner-achievements-dashboard',
					context: 'ssi-verifiable-credential',
					value: ssiVerfiableCredential
				});

				if (_.isSet(_.get(ssiVerfiableCredential, 'sourcetext')))
				{
					ssiVC = entityos._util.base64.from(ssiVerfiableCredential.sourcetext, {json: true});

					if (_.isSet(ssiVC))
					{
						_.set(param, 'cached', true);
						app.invoke('learner-achievements-ssi-verifiable-credential-generate-process', param,
						{
							data:
							{
								verifiableCredential: ssiVC
							}
						});
					}
				}
			}
		}

		if (_.isNotSet(ssiVC))
		{
			const action = app.get(
			{
				scope: 'learner-achievements-ssi-verifiable-credential',
				context: 'action'
			});

			let urlData =
			{
				method: 'ssi-generate-verifiable-credential',
				data:
				{	
					ssifrawework: 'selfdriven',
					achievementkey: action.guid,
					achievementtext: action.text,
					achievementbykey: action['action.contactperson.guid'],
					achievementdate: action.modifieddate,
					achievementid: action.id,
					saveproof: true
				}
			}
				
			if (app.whoami().mySetup.isLab)
			{
				urlData._context = 'selfdriven-lab'
			}
			else
			{
				urlData._context = 'selfdriven-prod'
			}

			var urlID = (app.whoami().mySetup.isLab?29295:29296) 

			entityos.cloud.invoke(
			{
				method: 'core_url_get',
				data:
				{
					urlid: urlID,
					headeroutname0: 'x-api-key',
					headeroutvalue0: '[[LOGON]]',
					headeroutname1: 'x-auth-key',
					headeroutvalue1: '[[PASSWORD]]',
					type: 'POST',
					data: JSON.stringify(urlData),
					asis: 'Y'
				},
				callback: 'learner-achievements-ssi-verifiable-credential-generate-process',
				callbackParam: param
			});
		}
	}
})

app.add(
{
	name: 'learner-achievements-ssi-verifiable-credential-generate-process',
	code: function (param, response)
	{
		app.invoke('util-view-spinner-remove-all');

		const action = app.get(
		{
			scope: 'learner-achievements-ssi-verifiable-credential',
			context: 'action'
		});

		var ssiView = app.vq.init({queue: 'learner-achievements-ssi-verifiable-credential'});

		if (_.isPlainObject(response.data))
		{
			app.set(
			{
				scope: 'learner-achievements-ssi-verifiable-credential-show',
				context: 'ssi-verifiable-credential',
				value: _.get(response, 'data.verifiableCredential')
			});

			let shareOnChainClass = '';
			if (action.billingstatus != app.whoami().mySetup.actionBillingStatuses.availableForBilling)
			{
				shareOnChainClass = ' disabled';
			}

			const cached = _.get(param, 'cached', false);
			if (!cached)
			{
				ssiView.add(
				[
					'<div class="mt-2 text-success">',
						'<i class="fe fe-check"></i> SSI Verifiable Credential generated successfully.',
					'</div>'
				]);
			}

			let ssiVCID = _.get(param, 'dataContext.ssi');

			if (_.isNotSet(ssiVCID))
			{
				ssiVCID = _.get(response.data, 'saveproofid', '');
			}

			let ssiVerifiableCredential = app.get(
			{
				scope: 'learner-achievements-dashboard',
				context: 'ssi-verifiable-credential',
				valueDefault: {}
			});

			ssiView.add(
			[
				'<div class="mt-3">',
					'<button type="button" class="btn btn-default btn-sm btn-outline myds-click me-2" data-controller="learner-achievements-ssi-verifiable-credential-show">',
						'<i class="fa fa-code"></i> Show',
					'</button>',
					'<button type="button" class="btn btn-default btn-sm btn-outline myds-click me-2" data-controller="learner-achievements-ssi-verifiable-credential-download">',
						'<i class="fa fa-cloud-download-alt"></i> Download',
					'</button>',
					'<button type="button" class="btn btn-default btn-sm btn-outline myds-click', shareOnChainClass, '"',
						' data-controller="learner-achievements-ssi-verifiable-credential-share-on-chain"',
						' id="learner-achievements-ssi-verifiable-credential-share-on-chain-', action.id, '"',
						' data-id="', action.id, '"',
						' data-ssi="', ssiVCID, '"',
						' data-spinner="prepend"',
						'>',
						'<i class="fa fa-link"></i> Share On-Chain',
					'</button>',
				'</div>',
				'<div class="mt-2">',
					'<button type="button" class="d-none btn btn-link btn-sm text-muted myds-click" data-controller="learner-achievements-ssi-verifiable-credential-download-sda">',
						'Download SDA SSI On-Chain Metadata',
					'</button>',
				'</div>'
			]);

			if (_.includes(ssiVerifiableCredential.notes, '[achievement-ssi-shared-on-chain'))
			{
				ssiVerifiableCredential._notes = _.split(ssiVerifiableCredential.notes, ':');
				if (ssiVerifiableCredential._notes.length > 1)
				{
					ssiVerifiableCredential.txID = _.replace(ssiVerifiableCredential._notes[1], ']', '')
				}			
			}

			/*ssiView.add(
			[
				'<div id="x-learner-achievements-ssi-verifiable-credential-view-', action.guid, '"></div>',
				'</div>'
			]);*/

			if (_.isSet(ssiVerifiableCredential.txID))
			{
				app.show('#learner-achievements-ssi-verifiable-credential-view-' + action.guid + '-on-chain',
				[
					'<div class="ml-0 mt-2">',
						'<a target="_blank" href="https://cexplorer.io/tx/', ssiVerifiableCredential.txID, '" class="small text-secondary">',
							'<i class="fa fa-external-link"></i> On-Chain Proof #',
							_.truncate(ssiVerifiableCredential.txID, {length: 30}),
						'</a>',
					'</div>'
				]);
			}
		}
		
		if (!_.isUndefined(response.warning))
		{
			ssiView.add(
			[
				'<div class="mt-4 text-warning">',
					response.error,
				'</div>'
			]);
		}

		ssiView.render('#learner-achievements-dashboard-view-' + action.guid + '-ssi');
	}
});

app.add(
{
	name: 'learner-achievements-ssi-verifiable-credential-show',
	code: function (param, response)
	{
		const verifiableCredential = app.get(
		{
			scope: 'learner-achievements-ssi-verifiable-credential-show',
			context: 'ssi-verifiable-credential'
		});

		const action = app.get(
		{
			scope: 'learner-achievements-ssi-verifiable-credential',
			context: 'action'
		});

		var data = JSON.stringify(verifiableCredential, null, 2);

		app.show('#learner-achievements-ssi-verifiable-credential-view-' + action.guid,
		[	
			'<div class="small mt-2">',
				'<pre class="mb-0">', data, '</pre>',
			'</div>'
		])
	}
});

app.add(
{
	name: 'learner-achievements-ssi-verifiable-credential-share-on-chain',
	code: function (param, response)
	{
		if (response == undefined)
		{
			const ssiID = _.get(param, 'dataContext.ssi');

			if (_.isNotSet(ssiID))
			{
				app.notify({type: 'error', message: 'Can not share this achievement on-chain'})
			}
			else
			{
				entityos.cloud.save(
				{
					object: 'core_protect_ciphertext',
					data:
					{ 
						id: ssiID,
						notes: '[achievement-ssi-share-on-chain]'
					},
					callback: 'learner-achievements-ssi-verifiable-credential-share-on-chain'
				});
			}
		}
		else
		{
			app.invoke('learner-achievements-ssi-verifiable-credential-share-on-chain-action', param);
		}
	}
});

app.add(
{
	name: 'learner-achievements-ssi-verifiable-credential-share-on-chain-action',
	code: function (param, response)
	{
		const action = app.get(
		{
			scope: 'learner-achievements-ssi-verifiable-credential',
			context: 'action'
		});

		if (response == undefined)
		{
			entityos.cloud.save(
			{
				object: 'action',
				data:
				{ 
					id: action.id,
					billingstatus: app.whoami().mySetup.actionBillingStatuses.billable
				},
				callback: 'learner-achievements-ssi-verifiable-credential-share-on-chain-action'
			});
		}
		else
		{
			app.notify('Achievement has been scheduled to be shared on-chain.');
			app.invoke('util-view-spinner-remove-all');
			$('#learner-achievements-ssi-verifiable-credential-share-on-chain-' + action.id).addClass('disabled');
		}
	}
});

app.add(
{
	name: 'learner-achievements-ssi-verifiable-credential-download',
	code: function (param, response)
	{
		const verifiableCredential = app.get(
		{
			scope: 'learner-achievements-ssi-verifiable-credential-show',
			context: 'ssi-verifiable-credential'
		});

		const action = app.get(
		{
			scope: 'learner-achievements-ssi-verifiable-credential',
			context: 'action'
		});

		var data = JSON.stringify(verifiableCredential, null, 2);
		var filename = 'selfdriven-verifiable-credential-' +
							action.guid +
							'.json'

		app.invoke('util-export-to-file',
		{
			data: data,
			filename: filename
		});
	}
});

app.add(
{
	name: 'learner-achievements-ssi-verifiable-credential-download-sda',
	code: function (param, response)
	{
		const verifiableCredential = app.get(
		{
			scope: 'learner-achievements-ssi-verifiable-credential-show',
			context: 'ssi-verifiable-credential'
		});

		const action = app.get(
		{
			scope: 'learner-achievements-ssi-verifiable-credential',
			context: 'action'
		});

		let sdaOnChainData = {
			"11510097": {
				"14302595916298c0ba104801034dbc784d1ece283c943dfab0524d0d": {
					"SSI":
					{
						"id": verifiableCredential.id,
						"issuer": verifiableCredential.issuer,
						"proof": verifiableCredential.proof
					}
				}
			}
		}

		var data = JSON.stringify(sdaOnChainData, null, 2);

		var filename = 'selfdriven-verifiable-credential-sda-on-chain-metadata-' +
							action.guid +
							'.json'

		app.invoke('util-export-to-file',
		{
			data: data,
			filename: filename
		});
	}
});