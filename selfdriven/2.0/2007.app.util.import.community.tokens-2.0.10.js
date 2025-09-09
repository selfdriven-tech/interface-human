// ** EXCEL IMPORT; COMMUNITY TOKENS; 

app.add(
{
	name: 'util-import-initialise-community-tokens',
	build:
	[
		{
			date: '01OCT2020',
			by: 'MNB',
			note: 'Excel Import For Community Tokens for Members.',
		}
	],
	code: function ()
	{	
		var utilSetup = app.get(
		{
			scope: 'util-setup',
			valueDefault: {}
		});

		var importCommunityTokens =
		{
			name: 'community-tokens',
			initialise:
			{
				storage:
				[
					{
						object: 'contact_business',
						name: 'communities',
						fields:
						[
							{name: 'tradename'},
							{name: 'legalname'},
							{name: 'guid'}
						],
						filters:
						[
							{
								name: 'primarygroup',
								value: utilSetup.businessGroups.community
							}
						]
					},
					{
						object: 'action',
						name: 'community-tokens',
						fields:
						[
							{name: 'subject'},
							{name: 'contactperson'},
							{name: 'date'},
							{name: 'totaltimehrs'},
							{name: 'guid'}
						],
						filters:
						[
							{
								name: 'type',
								value: app.whoami().mySetup.actionTypes.sdc
							},
							{
								name: 'date',
								comparison: 'GREATER_THAN',
								value: app.invoke('util-date', {modify: {days: -14}})
							}
						]
					},
					{
						object: 'contact_person',
						name: 'community-members',
						fields:
						[
							{name: 'firstname'},
							{name: 'surname'},
							{name: 'email'},
							{name: 'mobile'},
							{name: 'guid'}
						],
						filters:
						[]
					}
				]
			},
			fields:
			[
				{
					caption: 'Data',
					name: 'data',
					range: 
					{
						header:
						{
							firstRow: true,
							firstRowColumn: 'A'
						},
						footer:
						{
							lastRow: true,
							lastRowColumn: 'A'
						},
						fields:
						[
							{
								caption: 'Community Name',
								name: 'communityName',
								column: 'A'
							},
							{
								caption: 'Email',
								name: 'memberEmail',
								column: 'B',
								defaultValue: ''
							},
							{
								caption: 'Token Subject',
								name: 'tokenSubject',
								column: 'C',
								defaultValue: ''
							},
							{
								caption: 'Token Issued Date',
								name: 'tokenIssuedDate',
								column: 'D',
								defaultValue: ''
							},
							{
								caption: 'Amount of Tokens',
								name: 'tokenAmount',
								column: 'E',
								defaultValue: '1'
							},
							{
								caption: 'Token Type',
								name: 'tokenType',
								column: 'F',
								defaultValue: 'Earned'
							},
							{
								caption: 'Use on Community Services?',
								name: 'tokenUseCommunityServices',
								column: 'G',
								defaultValue: 'No'
							},
							{
								caption: 'Notes',
								name: 'tokenNotes',
								column: 'H',
								defaultValue: ''
							},
							{
								caption: 'Community SDID',
								name: 'communitySDID',
								column: 'I',
								defaultValue: ''
							},
							{
								caption: 'Member SDID',
								name: 'memberSDID',
								column: 'J',
								defaultValue: ''
							},
							{
								caption: 'Token SDID',
								name: 'tokenSDID',
								column: 'K',
								defaultValue: ''
							}
						]
					},
					storage:
					{
						object: 'community-tokens',
						field: 'all'
					}	
				}
			]
		}

		app.set(
		{
			scope: 'util-import-sheet',
			context: 'community-tokens',
			name: 'import-format',
			value: importCommunityTokens
		});

		var imports = app.get(
		{
			scope: 'util-import',
			context: 'imports',
			valueDefault: []
		});

		app.set(
		{
			scope: 'util-import',
			context: 'imports',
			value: _.concat(imports, importCommunityTokens)
		});
	}
});

app.add(
{
	name: 'util-community-tokens-import-upload-show',
	code: function (param)
	{	
		var userrole = app._util.param.get(param, 'userRole',
		{
			default: app.whoami().thisInstanceOfMe.userRole
		}).value;
	
		if (userrole != undefined)
		{
			$('#' + userrole + '-community-tokens-import-upload-file').val(null);
			mydigitalstructure._util.import.sheet.data = {};
			$('#' + userrole + '-community-tokens-import-review-show-view').html('');
			$('#' + userrole + '-community-tokens-import-update-show-view').html('');
		}
	}
});

app.add(
{
	name: 'util-community-tokens-import-upload-error',
	code: function (param, importData)
	{	
		var userrole = app._util.param.get(param, 'userRole',
		{
			default: app.whoami().thisInstanceOfMe.userRole
		}).value;

		$('#' + userrole + '-community-tokens-import-upload-file').val(null);

		var errorView = app.vq.init();

		errorView.add(
		[
			'<div class="alert alert-danger mx-1 mb-3 row">',
			  	'<div style="font-size:0.9rem;"><i class="fa fa-exclamation-circle text-larger mr-2""></i> This is not a valid import file.</div>', 
			'</div>'
		]);

		errorView.render('#' + userrole + '-community-tokens-import-upload-view');
	}
});


app.add(
{
	name: 'util-community-tokens-import-upload-process',
	code: function (param, importData)
	{	
		var importCommunityTokens = app.get(
		{
			scope: 'util-import-sheet',
			context: 'community-tokens',
			name: 'import-format'
		});

		var userrole = app._util.param.get(param, 'userRole',
		{
			default: app.whoami().thisInstanceOfMe.userRole
		}).value;

		$('#' + userrole + '-community-tokens-import-upload-file').val(null);

		var defaultSheet = importData.defaultSheetName.toLowerCase();

		var rawData = importData.processed[defaultSheet]['data'];
		var communityTokens = [];

		_.each(rawData, function (data)
		{
			communityTokens.push(_.mapValues(_.keyBy(data, 'name'), 'value'))
		})

		app.set(
		{
			scope: 'util-community-tokens-import-upload-process',
			context: 'community-tokens',
			value: communityTokens
		});

		var importView = app.vq.init({queue: 'import-view'});

		if (communityTokens.length == 0)
		{
			importView.add(
			[
				'<div class="alert alert-danger mx-1 mb-3 row">',
				  	'<div style="font-size:0.9rem;"><i class="fa fa-exclamation-circle text-larger mr-2"></i> There is no data in the import file.</div>', 
				'</div>'
			]);
		}
		else
		{
			importView.add(
			[
				'<div class="alert alert-info mx-1 mb-3 row">',
				  	'<div class="col mt-2"><i class="fa fa-info-circle text-larger mr-2"></i> The following community tokens have been found in the Excel file.</div>', 
				  	'<div class="col-auto">',
				  		'<button class="btn btn-primary btn-outline myds-navigate-to" target="#' + userrole + '-community-tokens-import-review">Continue</button>',
				  	'</div>',
				'</div>'
			]);

			importView.add(
			[
				'<table class="table table-responsive border mt-4">',
					'<thead>',
						'<tr>'
			])

			var importCommunityTokensFields = _.first(importCommunityTokens.fields).range.fields;

			_.each(importCommunityTokensFields, function (importCommunityTokensField)
			{
				importView.add(['<th>', importCommunityTokensField.caption, '</th>']);
			});
				
			importView.add(
			[
						'</tr>',
					'</thead>',
					'<tbody>'
			]);

			importView.template(_.concat('<tr>',
				_.map(importCommunityTokensFields, function (importCommunityToken)
				{
					return '<td>{{' + importCommunityToken.name.toLowerCase() + '}}</td>'
				}),
				'</tr>'));

			_.each(communityTokens, function (communityToken)
			{
				importView.add({useTemplate: true}, communityToken);
			});

			importView.add(
			[
					'</tbody>',
				'</table>'
			]);
		}

		importView.render('#' + userrole + '-community-tokens-import-upload-view')
	}
});

app.add(
{
	name: 'util-community-tokens-import-review-show',
	code: function (param)
	{	
		app.invoke('util-import-retrieve-from-storage',
		{
			context: 'community-tokens',
			callback: 'util-community-tokens-import-review-process'
		});
	}
});

app.add(
{
	name: 'util-community-tokens-import-review-process',
	code: function (param)
	{	
		var userrole = app._util.param.get(param, 'userRole',
		{
			default: app.whoami().thisInstanceOfMe.userRole
		}).value;

		app.show('#' + userrole + '-community-tokens-import-review-view', '<div class="my-4 text-muted">Reviewing data...</div>');

		var importCommunityTokens = app.get(
		{
			scope: 'util-community-tokens-import-upload-process',
			context: 'community-tokens'
		});

		var inStorage = app.get(
		{
			scope: 'util-import',
			context: 'in-cloud-storage'
		});

		var saveToCloudStorage = [];
		var saveToCloudStorageErrors = [];
		var whoami = app.whoami()
		var contactbusinessCommunity;

		if (app.invoke('util-security-access-check', 'Community'))
		{
			contactbusinessCommunity = whoami.thisInstanceOfMe.user.contactbusiness;
		}
		
		_.each(importCommunityTokens, function (importCommunityToken, importCommunityTokenIndex)
		{
			var errors = [];
			
			//MATCH TO EXISTING COMMUNITY

			if (contactbusinessCommunity == undefined)
			{
				importCommunityToken._community = _.find(inStorage['communities'], function (inStorageCommunity)
				{  
					var match =
					(
						inStorageCommunity['tradename'].toLowerCase() == importCommunityToken['communityName'].toLowerCase()
					)

					if (!match && _.isSet(importCommunityToken['communitySDID']))
					{
						match =
						(
							inStorageCommunity['guid'].toLowerCase() == importCommunityToken['communitySDID'].toLowerCase()
						)
					}

					return match;
				});

				if (importCommunityToken._community != undefined)
				{
					contactbusinessCommunity = importCommunityToken._community.id;
				}
			}

			if (_.isNotSet(importCommunityToken['tokenIssuedDate']))
			{
				importCommunityToken['tokenIssuedDate'] = app.invoke('util-date');
			}
			else
			{
				importCommunityToken['tokenIssuedDate'] = app.invoke('util-date', {date: importCommunityToken['tokenIssuedDate'], format: 'D MMM YYYY'});
			}

			importCommunityToken._communityMember = _.find(inStorage['community-members'], function (inStorageCommunityMember)
			{  
				var match = false;

				if (_.isSet(importCommunityToken['memberSDID']))
				{
					match = ((importCommunityToken['memberSDID'] == inStorageCommunityMember['guid']))
				}

				if (!match)
				{
				 	match = (importCommunityToken['memberEmail'].toLowerCase() == inStorageCommunityMember['email'].toLowerCase())
				}

				return match;
			});

			if (importCommunityToken._communityMember != undefined)
			{
				importCommunityToken._communityToken = _.find(inStorage['community-tokens'], function (inStorageCommunityToken)
				{  
					var match = false;

					if (_.isSet(importCommunityToken['tokenSDID']))
					{
						match = ((importCommunityToken['tokenSDID'] == inStorageCommunityToken['guid']))
					}

					inStorageCommunityToken['date'] = app.invoke('util-view-date-clean', inStorageCommunityToken['date'])
					inStorageCommunityToken['totaltimehrs'] = numeral(inStorageCommunityToken['totaltimehrs']).format('0');

					if (!match)
					{
						match = (
									importCommunityToken._communityMember.id == inStorageCommunityToken['contactperson'] &&
									importCommunityToken['tokenIssuedDate'] == inStorageCommunityToken['date'] &&
									importCommunityToken['tokenAmount'] == inStorageCommunityToken['totaltimehrs']
								)
					}

					return match;
				});
			}

			importCommunityToken._actionType = app.whoami().mySetup.actionTypes.sdc;
			if (importCommunityToken['tokenType'].toLowerCase() == 'used')
			{
				importCommunityToken._actionType = app.whoami().mySetup.actionTypes.sdcUse;
			}
				
			importCommunityToken._billingStatus = app.whoami().mySetup.actionBillingStatuses.nonBillable;
			if (importCommunityToken['tokenUseCommunityServices'].toLowerCase() == 'yes')
			{
				importCommunityToken._billingStatus = app.whoami().mySetup.actionBillingStatuses.billable;
			}
			
			importCommunityToken.validate = {};

			if (contactbusinessCommunity == undefined)
			{	
				errors.push('Can not match the community; ' + importCommunityToken['communityName']);
				importCommunityToken.validate.community = false;
			}
		
			if (importCommunityToken['memberEmail'] == '')
			{	
				errors.push('Member email is required');
				importCommunityToken.validate.communityMemberEmail = false;
			}

			if (importCommunityToken._communityMember == undefined)
			{
				errors.push('Can not find community member; ' + importCommunityToken['memberEmail'] + ' / ' + importCommunityToken['memberSDID']);
				importCommunityToken.validate.communityMember = false;
			}

			if (importCommunityToken._communityToken != undefined)
			{
				errors.push('Token has already been imported.');
				importCommunityToken.validate.communityToken = false;
			}

			if (errors.length != 0)
			{
				saveToCloudStorageErrors.push(
				{
					errors: errors,
					index: importCommunityTokenIndex,
					data: importCommunityToken
				});
			}
			else
			{
				var dataAction =
				{
					contactperson: importCommunityToken._communityMember.id,
					subject: importCommunityToken['tokenSubject'],
					status: app.whoami().mySetup.actionStatuses.notStarted,
					notes: importCommunityToken['tokenNotes'],
					date: importCommunityToken['tokenIssuedDate'],
					type: importCommunityToken._actionType,
					totaltimehrs: importCommunityToken['tokenAmount'],
					billingstatus: importCommunityToken._billingStatus
				}

				if (importCommunityToken._communityToken != undefined)
				{
					dataAction.id = importCommunityToken._communityToken.id;
				}
				else
				{
					dataAction.contactbusiness = contactbusinessCommunity;
				}

				var caption = importCommunityToken['memberEmail'] + '; ' + importCommunityToken['tokenSubject'];
				
				saveToCloudStorage.push(
				{
					caption: caption,
					object: 'action',
					objectName: 'action',
					data: dataAction,
					index: importCommunityTokenIndex
				});
			}
		});

		app.set(
		{
			scope: 'util-import',
			context: 'save-to-cloud-storage',
			value: saveToCloudStorage
		});

		app.set(
		{
			scope: 'util-import',
			context: 'save-to-cloud-storage-errors',
			value: saveToCloudStorageErrors
		});

		if (saveToCloudStorageErrors.length != 0)
		{
			app.vq.init();

			app.vq.add(
			[
				'<div class="alert alert-info mx-1 mb-3 row">',
				  	'<div class=""><i class="fa fa-exclamation-circle text-larger mr-2" style="color:red;"></i> The following errors have been found in the Excel file.  Please correct the errors and upload the file again.</div>', 
				'</div>'
			]);

			app.vq.add(
			[
				'<table class="table border mt-4">',
					'<thead>',
						'<tr>',
							'<th>Excel File Row</th>',
							'<th>Errors</th>',
						'</tr>',
					'</thead>',
					'<tbody>'
			]);

			_.each(saveToCloudStorageErrors, function (saveToCloudStorageError)
			{
				app.vq.add(
				[
					'<tr>',
						'<td>' + (numeral(saveToCloudStorageError.index).value() + 2) + '</td>',
						'<td>' + _.join(_.map(saveToCloudStorageError.errors, function (error) {return '<div>' + error + '</div>'}), '') + '</td>',
					'</tr>'
				]);
			});

			app.vq.add(
			[
					'</tbody>',
				'</table>'
			]);

			app.vq.render('#' + userrole + '-community-tokens-import-review-view');
		}
		else
		{
			app.vq.init();

			app.vq.add(
			[
				'<div class="alert alert-info mx-1 mb-3 row">',
				  	'<div class="col mt-2"><i class="fa fa-check-circle text-larger mr-2" style="color:green;"></i> No errors where found within the file data.  Click Continue to upload the community tokens to selfdriven.</div>', 
					 '<div class="col-auto">',
				  		'<button class="btn btn-primary btn-outline myds-navigate-to" target="#' + userrole + '-community-tokens-import-update">Continue</button>',
				  	'</div>',
				'</div>'
			]);

			app.vq.add(
			[
				'<table class="table border mt-4">',
					'<thead>',
						'<tr>',
							'<th>Excel File Row</th>',
							'<th>Community Token</th>',
							'<th>Action</th>',
						'</tr>',
					'</thead>',
					'<tbody>'
			]);

			_.each(saveToCloudStorage, function (saveToCloud)
			{
				if (saveToCloud.caption != undefined)
				{
					app.vq.add(
					[
						'<tr>',
							'<td>', (numeral(saveToCloud.index).value() + 2), '</td>',
							'<td>', saveToCloud.caption, '</td>',
							'<td>', (saveToCloud.data.id!=undefined?'Updating':'Adding'), '</td>',
						'</tr>'
					]);
				}
			});

			app.vq.add(
			[
					'</tbody>',
				'</table>'
			]);

			app.vq.render('#' + userrole + '-community-tokens-import-review-view');
		}
	}
});

app.add(
{
	name: 'util-community-tokens-import-update-show',
	code: function (param)
	{	
		app._util.data.clear(
		{
			scope: 'util-import',
			context: 'saveToCloudStorageIndex'
		});

		app.set(
		{
			scope: 'util-import',
			context: 'save-to-cloud-storage-errors',
			value: []
		});

		app.invoke('util-community-tokens-import-update-save', param)
	}
});

app.add(
{
	name: 'util-community-tokens-import-update-save',
	code: function (param)
	{	
		var saveToCloudStorages = app.get(
		{
			scope: 'util-import',
			context: 'save-to-cloud-storage',
			valueDefault: []
		});

		var saveToCloudStorageIndex = app.get(
		{
			scope: 'util-import',
			context: 'saveToCloudStorageIndex',
			valueDefault: 0
		});

		var userrole = app._util.param.get(param, 'userRole',
		{
			default: app.whoami().thisInstanceOfMe.userRole
		}).value;

		if (saveToCloudStorageIndex < saveToCloudStorages.length)
		{
			var saveToCloudStorage = saveToCloudStorages[saveToCloudStorageIndex];

			if (saveToCloudStorage.caption != undefined)
			{
				app.show('#' + userrole + '-community-tokens-import-update-view', '<div class="my-4 text-muted">Importing community token ' + saveToCloudStorage.caption + ' ...</div>');
			}

			_.each(saveToCloudStorage.data, function (value, key)
			{
				if (_.isObject(value))
				{
					if (value.object == 'contact_person')
					{
						var importCommunityTokens = app.get(
						{
							scope: 'util-community-tokens-import-upload-process',
							context: 'community-tokens'
						});

						var importCommunityToken = importCommunityTokens[saveToCloudStorage.index]

						saveToCloudStorage.data[key] = importCommunityToken[value.field]
					}
				}
			});
	
			mydigitalstructure.cloud.save(
			{
				object: saveToCloudStorage.object,
				data: saveToCloudStorage.data,
				callback: 'util-community-tokens-import-update-save-next',
				callbackParam: param
			});
		}
		else
		{
			var saveToCloudStorageErrors = app.get(
			{
				scope: 'util-import',
				context: 'save-to-cloud-storage-errors'
			});

			var saveToCloudStorages = app.get(
			{
				scope: 'util-import',
				context: 'save-to-cloud-storage',
				valueDefault: []
			});

			if (saveToCloudStorageErrors.length != 0)
			{
				app.vq.init();

				app.vq.add(
				[
					'<div class="alert alert-info mx-1 mb-3 row">',
					  	'<div class="mt-2"><i class="fa fa-exclamation-circle text-larger mr-2" style="color:red;"></i> The following errors occured when importing into selfdriven.</div>',
					'</div>'
				]);

				app.vq.add(
				[
					'<table class="table">',
						'<thead>',
							'<tr>',
								'<th>Excel File Row</th>',
								'<th>Error</th>',
							'</tr>',
						'</thead>',
						'<tbody>'
				]);

				_.each(saveToCloudStorageErrors, function (saveToCloudStorageError)
				{
					app.vq.add(
					[
						'<tr>',
							'<td>', (numeral(saveToCloudStorageError.saveToCloudStorage.index).value() + 2), '</td>',
							'<td>', saveToCloudStorageError.saveToCloudStorage.object, ' [', saveToCloudStorageError.error.errornotes, ']</td>',
						'</tr>'
					]);
				});

				app.vq.add(
				[
						'</tbody>',
					'</table>'
				]);

				app.vq.render('#' + userrole + '-community-tokens-import-update-view');
			}
			else
			{
				app.vq.init();

				app.vq.add(
				[
					'<div class="alert alert-info mx-1 mb-3 row">',
					  	'<div class="mt-1"><i class="fa fa-check-circle text-larger mr-2" style="color:green;"></i> Community token(s) have been imported.</div>',
					'</div>',
					'<div class="mt-4 ml-2">',
				  		'<a class="btn btn-default btn-outline" href="#' + userrole + '-community-tokens">',
	          				'View Community Tokens',
	          			'</a>',
	          			
				  	'</div>',
				]);

				app.vq.render('#' + userrole + '-community-tokens-import-update-view');
			}
		}
	}
});

app.add(
{
	name: 'util-community-tokens-import-update-save-next',
	code: function (param, response)
	{	
		var userrole = app._util.param.get(param, 'userRole',
		{
			default: app.whoami().thisInstanceOfMe.userRole
		}).value;

		var saveToCloudStorages = app.get(
		{
			scope: 'util-import',
			context: 'save-to-cloud-storage',
			valueDefault: []
		});

		var saveToCloudStorageIndex = app.get(
		{
			scope: 'util-import',
			context: 'saveToCloudStorageIndex',
			valueDefault: 0
		});

		var importCommunityTokens = app.get(
		{
			scope: 'util-community-tokens-import-upload-process',
			context: 'community-tokens'
		});

		var saveToCloudStorageErrors = app.get(
		{
			scope: 'util-import',
			context: 'save-to-cloud-storage-errors'
		});

		var saveToCloudStorage = saveToCloudStorages[saveToCloudStorageIndex];

		if (response != undefined)
		{		
			if (response.status == 'OK')
			{
				if (importCommunityTokens != undefined && saveToCloudStorage.object == 'contact_person')
				{
					var field = saveToCloudStorage.objectField;
					if (field == undefined) {field = 'id'}

					importCommunityToken = importCommunityTokens[saveToCloudStorage.index];

					if (importCommunityToken != undefined)
					{
						importCommunityToken[field] = response.id;
					}
				}
			}
			else
			{
				saveToCloudStorageErrors.push(
				{
					error: response.error,
					saveToCloudStorageIndex: saveToCloudStorageIndex,
					saveToCloudStorage: saveToCloudStorage
				});
			}
		}
				
		app.set(
		{
			scope: 'util-import',
			context: 'saveToCloudStorageIndex',
			value: saveToCloudStorageIndex + 1
		});	

		app.set(
		{
			scope: 'util-import',
			context: 'save-to-cloud-storage-errors',
			value: saveToCloudStorageErrors
		});

		app.invoke('util-community-tokens-import-update-save', param)
	}
});
