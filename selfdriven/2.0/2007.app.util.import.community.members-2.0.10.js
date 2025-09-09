// ** EXCEL IMPORT; COMMUNITY MEMBERS; APP INITIALISATION

app.add(
{
	name: 'util-import-initialise-community-members',
	build:
	[
		{
			date: '01OCT2020',
			by: 'MNB',
			note: 'Excel Import For Communty Members.',
		}
	],
	code: function ()
	{	
		var utilSetup = app.get(
		{
			scope: 'util-setup',
			valueDefault: {}
		});

		var importCommunityMembers =
		{
			name: 'community-members',
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
					},
					{
						object: 'contact_relationship',
						name: 'members-communities',
						fields:
						[
							{name: 'contactperson'},
							{name: 'contactpersontext'},
							{name: 'othercontactbusiness'},
							{name: 'othercontactbusinesstext'}
						],
						filters:
						[
							{
								name: 'type',
								value: utilSetup.relationshipTypes.learnerCommunity
							}
						]
					},
					{
						object: 'setup_contact_status',
						name: 'community-member-statuses',
						fields:
						[
							{name: 'title'},
							{name: 'guid'}
						]
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
								caption: 'First Name',
								name: 'memberFirstName',
								column: 'B'
							},
							{
								caption: 'Last Name',
								name: 'memberLastName',
								column: 'C',
								defaultValue: ''
							},
							{
								caption: 'Email',
								name: 'memberEmail',
								column: 'D',
								defaultValue: ''
							},
							{
								caption: 'Mobile',
								name: 'memberMobile',
								column: 'E',
								defaultValue: ''
							},
							{
								caption: 'Member Since',
								name: 'memberSince',
								column: 'F',
								defaultValue: ''
							},
							{
								caption: 'Primary Group',
								name: 'memberPrimaryGroup',
								column: 'G',
								defaultValue: 'Learner'
							},
							{
								caption: 'Groups',
								name: 'memberGroups',
								column: 'H',
								defaultValue: ''
							},
							{
								caption: 'Status',
								name: 'memberStatus',
								column: 'I',
								defaultValue: 'Active'
							},
							{
								caption: 'Notes',
								name: 'memberNotes',
								column: 'J',
								defaultValue: ''
							},
							{
								caption: 'Community SDID',
								name: 'communitySDID',
								column: 'K',
								defaultValue: ''
							},
							{
								caption: 'Member SDID',
								name: 'memberSDID',
								column: 'L',
								defaultValue: ''
							}
						]
					},
					storage:
					{
						object: 'community-members',
						field: 'all'
					}	
				}
			]
		}

		app.set(
		{
			scope: 'util-import-sheet',
			context: 'community-members',
			name: 'import-format',
			value: importCommunityMembers
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
			value: _.concat(imports, importCommunityMembers)
		});
	}
});

app.add(
{
	name: 'util-community-members-import-upload-show',
	code: function (param)
	{	
		var userrole = app._util.param.get(param, 'userRole',
		{
			default: app.whoami().thisInstanceOfMe.userRole
		}).value;
	
		if (userrole != undefined)
		{
			$('#' + userrole + '-community-members-import-upload-file').val(null);
			mydigitalstructure._util.import.sheet.data = {};
			$('#' + userrole + '-community-members-import-review-show-view').html('');
			$('#' + userrole + '-community-members-import-update-show-view').html('');
		}
	}
});

app.add(
{
	name: 'util-community-members-import-upload-error',
	code: function (param, importData)
	{	
		var userrole = app._util.param.get(param, 'userRole',
		{
			default: app.whoami().thisInstanceOfMe.userRole
		}).value;

		$('#' + userrole + '-community-members-import-upload-file').val(null);

		var errorView = app.vq.init();

		errorView.add(
		[
			'<div class="alert alert-danger mx-1 mb-3 row">',
			  	'<div style="font-size:0.9rem;"><i class="fa fa-exclamation-circle text-larger mr-2""></i> This is not a valid import file.</div>', 
			'</div>'
		]);

		errorView.render('#' + userrole + '-community-members-import-upload-view');
	}
});


app.add(
{
	name: 'util-community-members-import-upload-process',
	code: function (param, importData)
	{	
		var importCommunityMembers = app.get(
		{
			scope: 'util-import-sheet',
			context: 'community-members',
			name: 'import-format'
		});

		var userrole = app._util.param.get(param, 'userRole',
		{
			default: app.whoami().thisInstanceOfMe.userRole
		}).value;

		$('#' + userrole + '-community-members-import-upload-file').val(null);

		var defaultSheet = importData.defaultSheetName.toLowerCase();

		var rawData = importData.processed[defaultSheet]['data'];
		var communityMembers = [];

		_.each(rawData, function (data)
		{
			communityMembers.push(_.mapValues(_.keyBy(data, 'name'), 'value'))
		})

		app.set(
		{
			scope: 'util-community-members-import-upload-process',
			context: 'community-members',
			value: communityMembers
		});

		var importView = app.vq.init({queue: 'import-view'});

		if (communityMembers.length == 0)
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
				  	'<div class="col mt-2"><i class="fa fa-info-circle text-larger mr-2"></i> The following community members have been found in the Excel file.</div>', 
				  	'<div class="col-auto">',
				  		'<button class="btn btn-primary btn-outline myds-navigate-to" target="#' + userrole + '-community-members-import-review">Continue</button>',
				  	'</div>',
				'</div>'
			]);

			importCommunityMembers

			importView.add(
			[
				'<table class="table table-responsive border mt-4">',
					'<thead>',
						'<tr>'
			])

			var importCommunityMembersFields = _.first(importCommunityMembers.fields).range.fields;

			_.each(importCommunityMembersFields, function (importCommunityMembersField)
			{
				importView.add(['<th>', importCommunityMembersField.caption, '</th>']);
			});
				
			importView.add(
			[
						'</tr>',
					'</thead>',
					'<tbody>'
			]);

			importView.template(_.concat('<tr>',
				_.map(importCommunityMembersFields, function (importCommunityMember)
				{
					return '<td>{{' + importCommunityMember.name.toLowerCase() + '}}</td>'
				}),
				'</tr>'));

			_.each(communityMembers, function (communityMember)
			{
				importView.add({useTemplate: true}, communityMember);
			});

			importView.add(
			[
					'</tbody>',
				'</table>'
			]);
		}

		importView.render('#' + userrole + '-community-members-import-upload-view')
	}
});

app.add(
{
	name: 'util-community-members-import-review-show',
	code: function (param)
	{	
		app.invoke('util-import-retrieve-from-storage',
		{
			context: 'community-members',
			callback: 'util-community-members-import-review-process'
		});
	}
});

app.add(
{
	name: 'util-community-members-import-review-process',
	code: function (param)
	{	
		var userrole = app._util.param.get(param, 'userRole',
		{
			default: app.whoami().thisInstanceOfMe.userRole
		}).value;

		app.show('#' + userrole + '-community-members-import-review-view', '<div class="my-4 text-muted">Reviewing data...</div>');

		var importCommunityMembers = app.get(
		{
			scope: 'util-community-members-import-upload-process',
			context: 'community-members'
		});

		var inStorage = app.get(
		{
			scope: 'util-import',
			context: 'in-cloud-storage'
		});

		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		var saveToCloudStorage = [];
		var saveToCloudStorageErrors = [];
		var whoami = app.whoami()
		var contactbusinessCommunity;

		if (app.invoke('util-security-access-check', 'Community'))
		{
			contactbusinessCommunity = whoami.thisInstanceOfMe.user.contactbusiness;
		}
		
		_.each(importCommunityMembers, function (importCommunityMember, importCommunityMemberIndex)
		{
			var errors = [];

			//TODO; Member Groups - Also as separate load like teams / tokens
			
			//MATCH TO EXISTING COMMUNITY

			if (contactbusinessCommunity == undefined)
			{
				importCommunityMember._community = _.find(inStorage['communities'], function (inStorageCommunity)
				{  
					var match =
					(
						inStorageCommunity['tradename'].toLowerCase() == importCommunityMember['communityName'].toLowerCase()
					)

					if (!match && _.isSet(importCommunityMember['communitySDID']))
					{
						match =
						(
							inStorageCommunity['guid'].toLowerCase() == importCommunityMember['communitySDID'].toLowerCase()
						)
					}

					return match;
				});

				if (importCommunityMember._community != undefined)
				{
					contactbusinessCommunity = importCommunityMember._community.id;
				}
			}

			if (_.isNotSet(importCommunityMember['memberSince']))
			{
				importCommunityMember['memberSince'] = app.invoke('util-date');
			}
			else
			{
				importCommunityMember['memberSince'] = app.invoke('util-date', {date: importCommunityMember['memberSince'], format: 'D MMM YYYY'});
			}

			importCommunityMember._communityMember = _.find(inStorage['community-members'], function (inStorageCommunityMember)
			{  
				var match = false;

				if (_.isSet(importCommunityMember['memberSDID']))
				{
					match = ((importCommunityMember['memberSDID'] == inStorageCommunityMember['guid']))
				}

				if (!match)
				{
				 	match = (
								importCommunityMember['memberFirstName'].toLowerCase() == inStorageCommunityMember['firstname'].toLowerCase()
								&& importCommunityMember['memberLastName'].toLowerCase() == inStorageCommunityMember['surname'].toLowerCase()
								&& importCommunityMember['memberEmail'].toLowerCase() == inStorageCommunityMember['email'].toLowerCase()
							)
					 }

				return match;
			});

			importCommunityMember._primaryGroup = app.whoami().mySetup.personGroups[importCommunityMember['memberPrimaryGroup'].toLowerCase()];

			importCommunityMember._communityMemberStatus = _.find(inStorage['community-member-statuses'], function (communityMemberStatus)
			{
				return importCommunityMember['memberStatus'] == communityMemberStatus['title'];
			});
			
			importCommunityMember.validate = {};

			if (contactbusinessCommunity == undefined)
			{	
				errors.push('Can not match the community; ' + importCommunityMember['communityName']);
				importCommunityMember.validate.community = false;
			}
		
			if (importCommunityMember['memberFirstName'] == '')
			{	
				errors.push('First name is required');
				importCommunityMember.validate.communityMemberFirstName = false;
			}

			if (importCommunityMember['memberLastName'] == '')
			{	
				errors.push('Last name is required');
				importCommunityMember.validate.communityMemberLastName = false;
			}

			if (importCommunityMember._communityMember != undefined)
			{
				errors.push('Community Member is already registered.');
				importCommunityMember.validate.communityMember = false;
			}

			if (importCommunityMember._primaryGroup == undefined)
			{
				errors.push('Can not match the member primary group; ' + importCommunityMember['memberPrimaryGroup']);
				importCommunityMember.validate.primaryGroup = false;
			}

			if (importCommunityMember._communityMemberStatus == undefined)
			{
				errors.push('Can not match the member status; ' + importCommunityMember['memberStatus']);
				importCommunityMember.validate.primaryGroup = false;
			}

			if (errors.length != 0)
			{
				saveToCloudStorageErrors.push(
				{
					errors: errors,
					index: importCommunityMemberIndex,
					data: importCommunityMember
				});
			}
			else
			{
				var dataContactPerson =
				{
					status: 1,
					firstname: importCommunityMember['memberFirstName'],
					surname: importCommunityMember['memberLastName'],
					email: importCommunityMember['memberEmail'],
					mobile: importCommunityMember['memberMobile'],
					notes: importCommunityMember['memberNotes'],
					primarygroup: importCommunityMember._primaryGroup,
					status: importCommunityMember._communityMemberStatus.id,
					contactsince: importCommunityMember['memberSince']
				}

				if (importCommunityMember._communityMember != undefined)
				{
					dataContactPerson.id = importCommunityMember._communityMember.id;
				}
				else
				{
					dataContactPerson.contactbusiness = contactbusinessCommunity;
				}

				var caption = importCommunityMember['memberFirstName'] + ' ' + importCommunityMember['memberLastName'];
				
				saveToCloudStorage.push(
				{
					caption: caption,
					object: 'contact_person',
					objectName: 'contact_person',
					data: dataContactPerson,
					index: importCommunityMemberIndex
				});

				//relationship

				if (importCommunityMember._communityMember != undefined && contactbusinessCommunity != undefined)
				{
					importCommunityMember._relationshipCommunity = _.find(inStorage['members-communities'], function (memberCommunity)
					{  
						return 	(
										memberCommunity['othercontactbusiness'] == contactbusinessCommunity &&
										memberCommunity['contactperson'] == importCommunityMember._communityMember.id
									)
					});
				}

				if (importCommunityMember._relationshipCommunity == undefined)
				{
					var dataCommunityMemberRelationship =
					{
						othercontactbusiness: contactbusinessCommunity,
						type: app.whoami().mySetup.relationshipTypes.learnerCommunity,
						startdate: app.invoke('util-date')
					}

					if (importCommunityMember._communityMember != undefined)
					{
						dataCommunityMemberRelationship.contactperson = importCommunityMember._communityMember.id
					}
					else
					{
						dataCommunityMemberRelationship.contactperson =
						{
							object: 'contact_person',
							field: 'id'
						}
					}

					saveToCloudStorage.push(
					{
						caption: caption + ' link to community ' + importCommunityMember['communityName'],
						object: 'contact_relationship',
						objectName: 'contact_relationship',
						data: dataCommunityMemberRelationship,
						index: importCommunityMemberIndex
					});
				}
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

			app.vq.render('#' + userrole + '-community-members-import-review-view');
		}
		else
		{
			app.vq.init();

			app.vq.add(
			[
				'<div class="alert alert-info mx-1 mb-3 row">',
				  	'<div class="col mt-2"><i class="fa fa-check-circle text-larger mr-2" style="color:green;"></i> No errors where found within the file data.  Click Continue to upload the community members to selfdriven.</div>', 
					 '<div class="col-auto">',
				  		'<button class="btn btn-primary btn-outline myds-navigate-to" target="#' + userrole + '-community-members-import-update">Continue</button>',
				  	'</div>',
				'</div>'
			]);

			app.vq.add(
			[
				'<table class="table border mt-4">',
					'<thead>',
						'<tr>',
							'<th>Excel File Row</th>',
							'<th>Community Member</th>',
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

			app.vq.render('#' + userrole + '-community-members-import-review-view');
		}
	}
});

app.add(
{
	name: 'util-community-members-import-update-show',
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

		app.invoke('util-community-members-import-update-save', param)
	}
});

app.add(
{
	name: 'util-community-members-import-update-save',
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
				app.show('#' + userrole + '-community-members-import-update-view', '<div class="my-4 text-muted">Importing community member ' + saveToCloudStorage.caption + ' ...</div>');
			}

			_.each(saveToCloudStorage.data, function (value, key)
			{
				if (_.isObject(value))
				{
					if (value.object == 'contact_person')
					{
						var importCommunityMembers = app.get(
						{
							scope: 'util-community-members-import-upload-process',
							context: 'community-members'
						});

						var importCommunityMember = importCommunityMembers[saveToCloudStorage.index]

						saveToCloudStorage.data[key] = importCommunityMember[value.field]
					}
				}
			});
	
			mydigitalstructure.cloud.save(
			{
				object: saveToCloudStorage.object,
				data: saveToCloudStorage.data,
				callback: 'util-community-members-import-update-save-next',
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

				app.vq.render('#' + userrole + '-community-members-import-update-view');
			}
			else
			{
				app.vq.init();

				app.vq.add(
				[
					'<div class="alert alert-info mx-1 mb-3 row">',
					  	'<div class="mt-1"><i class="fa fa-check-circle text-larger mr-2" style="color:green;"></i> Community member(s) have been imported.</div>',
					'</div>',
					'<div class="mt-4 ml-2">',
				  		'<a class="btn btn-default btn-outline" href="#' + userrole + '-community-members">',
	          				'View Community Members',
	          			'</a>',
	          			
				  	'</div>',
				]);

				app.vq.render('#' + userrole + '-community-members-import-update-view');
			}
		}
	}
});

app.add(
{
	name: 'util-community-members-import-update-save-next',
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

		var importCommunityMembers = app.get(
		{
			scope: 'util-community-members-import-upload-process',
			context: 'community-members'
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
				if (importCommunityMembers != undefined && saveToCloudStorage.object == 'contact_person')
				{
					var field = saveToCloudStorage.objectField;
					if (field == undefined) {field = 'id'}

					importCommunityMember = importCommunityMembers[saveToCloudStorage.index];

					if (importCommunityMember != undefined)
					{
						importCommunityMember[field] = response.id;
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

		app.invoke('util-community-members-import-update-save', param)
	}
});
