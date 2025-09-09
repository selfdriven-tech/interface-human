// ** EXCEL IMPORT; SETUP SKILLS; 

app.add(
{
	name: 'util-import-initialise-setup-skills',
	build:
	[
		{
			date: '01JUN2022',
			by: 'MNB',
			note: 'Excel Import For Skills Setup.',
		}
	],
	code: function ()
	{	
		var utilSetup = app.get(
		{
			scope: 'util-setup',
			valueDefault: {}
		});

		var importSetupSkills =
		{
			name: 'setup-skills',
			initialise:
			{
				storage:
				[
					{
						object: 'setup_contact_attribute',
						name: 'contact-attribute-skills',
						fields:
						[
							{name: 'title'},
							{name: 'typetext'},
							{name: 'category'},
							{name: 'reference'},
							{name: 'url'},
							{name: 'guid'}
						],
						filters:
						[
							{
								name: 'hidden',
								value: 'N'
							}
						]
					},
					{
						object: 'setup_contact_attribute_category',
						name: 'contact-attribute-skills-category',
						fields:
						[
							{name: 'title'},
							{name: 'reference'}
						]
					},
					{
						object: 'setup_contact_attribute_type',
						name: 'contact-attribute-skills-type',
						fields:
						[
							{name: 'title'},
							{name: 'reference'}
						]
					},
					{
						object: 'setup_contact_attribute_level',
						name: 'contact-attribute-skills-level',
						fields:
						[
							{name: 'title'},
							{name: 'reference'}
						]
					},
					{
						object: 'setup_contact_attribute_capacity',
						name: 'contact-attribute-skills-capacity',
						fields:
						[
							{name: 'title'},
							{name: 'reference'}
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
								caption: 'Source Name',
								name: 'sourceName',
								column: 'A',
								defaultValue: ''
							},
							{
								caption: 'Source Code',
								name: 'sourceCode',
								column: 'B',
								defaultValue: ''
							},
							{
								caption: 'Domain Name',
								name: 'domainName',
								column: 'C',
								defaultValue: ''
							},
							{
								caption: 'Domain Code',
								name: 'domainCode',
								column: 'D',
								defaultValue: ''
							},
							{
								caption: 'Skill Name',
								name: 'skillName',
								column: 'E',
								defaultValue: ''
							},
							{
								caption: 'Skill Code',
								name: 'skillCode',
								column: 'F',
								defaultValue: ''
							},
							{
								caption: 'Level Name',
								name: 'levelName',
								column: 'G',
								defaultValue: ''
							},
							{
								caption: 'Level Code',
								name: 'levelCode',
								column: 'H',
								defaultValue: ''
							},
							{
								caption: 'Capacity Name',
								name: 'capacityName',
								column: 'I',
								defaultValue: ''
							},
							{
								caption: 'Capacity Code',
								name: 'capacityCode',
								column: 'J',
								defaultValue: ''
							},
							{
								caption: 'Self Driven Skill URI',
								name: 'skillURI',
								column: 'K',
								defaultValue: ''
							},
							{
								caption: 'Source Reference',
								name: 'sourceReference',
								column: 'L',
								defaultValue: ''
							},
							{
								caption: 'Notes',
								name: 'notes',
								column: 'M',
								defaultValue: ''
							},
							{
								caption: 'SDI',
								name: 'sdi',
								column: 'N',
								defaultValue: ''
							}
						]
					},
					storage:
					{
						object: 'setup-skills',
						field: 'all'
					}	
				}
			]
		}

		app.set(
		{
			scope: 'util-import-sheet',
			context: 'setup-skills',
			name: 'import-format',
			value: importSetupSkills
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
			value: _.concat(imports, importSetupSkills)
		});
	}
});

app.add(
{
	name: 'util-setup-skills-import-upload-show',
	code: function (param)
	{	
		var userrole = app._util.param.get(param, 'userRole',
		{
			default: app.whoami().thisInstanceOfMe.userRole
		}).value;
	
		if (userrole != undefined)
		{
			$('#' + userrole + '-setup-skills-import-upload-file').val(null);
			mydigitalstructure._util.import.sheet.data = {};
			$('#' + userrole + '-setup-skills-import-review-show-view').html('');
			$('#' + userrole + '-setup-skills-import-update-show-view').html('');
		}
	}
});

app.add(
{
	name: 'util-setup-skills-import-upload-error',
	code: function (param, importData)
	{	
		var userrole = app._util.param.get(param, 'userRole',
		{
			default: app.whoami().thisInstanceOfMe.userRole
		}).value;

		$('#' + userrole + '-setup-skills-import-upload-file').val(null);

		var errorView = app.vq.init();

		errorView.add(
		[
			'<div class="alert alert-danger mx-1 mb-3 row">',
			  	'<div style="font-size:0.9rem;"><i class="fa fa-exclamation-circle text-larger mr-2""></i> This is not a valid import file.</div>', 
			'</div>'
		]);

		errorView.render('#' + userrole + '-setup-skills-import-upload-view');
	}
});


app.add(
{
	name: 'util-setup-skills-import-upload-process',
	code: function (param, importData)
	{	
		var importsetupSkills = app.get(
		{
			scope: 'util-import-sheet',
			context: 'setup-skills',
			name: 'import-format'
		});

		var userrole = app._util.param.get(param, 'userRole',
		{
			default: app.whoami().thisInstanceOfMe.userRole
		}).value;

		$('#' + userrole + '-setup-skills-import-upload-file').val(null);

		var defaultSheet = importData.defaultSheetName.toLowerCase();

		var rawData = importData.processed[defaultSheet]['data'];
		var setupSkills = [];

		_.each(rawData, function (data)
		{
			setupSkills.push(_.mapValues(_.keyBy(data, 'name'), 'value'))
		})

		app.set(
		{
			scope: 'util-setup-skills-import-upload-process',
			context: 'setup-skills',
			value: setupSkills
		});

		var importView = app.vq.init({queue: 'import-view'});

		if (setupSkills.length == 0)
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
				  	'<div class="col mt-2"><i class="fa fa-info-circle text-larger mr-2"></i> The following skills have been found in the Excel file.</div>', 
				  	'<div class="col-auto">',
				  		'<button class="btn btn-primary btn-outline myds-navigate-to" target="#' + userrole + '-setup-skills-import-review">Continue</button>',
				  	'</div>',
				'</div>'
			]);

			importView.add(
			[
				'<table class="table table-responsive border mt-4">',
					'<thead>',
						'<tr>'
			])

			var importsetupSkillsFields = _.first(importsetupSkills.fields).range.fields;

			_.each(importsetupSkillsFields, function (importsetupSkillsField)
			{
				importView.add(['<th>', importsetupSkillsField.caption, '</th>']);
			});
				
			importView.add(
			[
						'</tr>',
					'</thead>',
					'<tbody>'
			]);

			importView.template(_.concat('<tr>',
				_.map(importsetupSkillsFields, function (importsetupSkill)
				{
					return '<td>{{' + importsetupSkill.name.toLowerCase() + '}}</td>'
				}),
				'</tr>'));

			_.each(setupSkills, function (setupSkill)
			{
				importView.add({useTemplate: true}, setupSkill);
			});

			importView.add(
			[
					'</tbody>',
				'</table>'
			]);
		}

		importView.render('#' + userrole + '-setup-skills-import-upload-view')
	}
});

app.add(
{
	name: 'util-setup-skills-import-review-show',
	code: function (param)
	{	
		app.invoke('util-import-retrieve-from-storage',
		{
			context: 'setup-skills',
			callback: 'util-setup-skills-import-review-process'
		});
	}
});

app.add(
{
	name: 'util-setup-skills-import-review-process',
	code: function (param)
	{	
		var userrole = app._util.param.get(param, 'userRole',
		{
			default: app.whoami().thisInstanceOfMe.userRole
		}).value;

		app.show('#' + userrole + '-setup-skills-import-review-view', '<div class="my-4 text-muted">Reviewing data...</div>');

		var importSetupSkills = app.get(
		{
			scope: 'util-setup-skills-import-upload-process',
			context: 'setup-skills'
		});

		var inStorage = app.get(
		{
			scope: 'util-import',
			context: 'in-cloud-storage'
		});

		var saveToCloudStorage = [];
		var saveToCloudStorageErrors = [];
		var whoami = app.whoami()

		_.each(importSetupSkills, function (importSetupSkill, importSetupSkillIndex)
		{
			var errors = [];
			
			//MATCH TO EXISTING SKILL SETUP

			if (_.isNotSet(importSetupSkill['skillURI']))
			{
				importSetupSkill['skillURI'] = 
					importSetupSkill['sourceCode'] +
					importSetupSkill['domainCode'] +
					importSetupSkill['levelCode'] +
					importSetupSkill['capacityCode'];
			}
		
			importSetupSkill._setupContactAttributeSkill = _.find(inStorage['contact-attribute-skills'], function (inStorageSetupSkill)
			{  
				var match = false;

				//FOR FIXES ONLY
				/*if (!match && _.isSet(importSetupSkill['skillCode']))
				{
					match = ((importSetupSkill['skillCode'] == inStorageSetupSkill['reference']) && (inStorageSetupSkill['category'] == 12))
				}
				*/

				if (!match && _.isSet(importSetupSkill['sdi']))
				{
					match = ((importSetupSkill['sdi'] == inStorageSetupSkill['guid']))
				}

				if (!match && _.isSet(inStorageSetupSkill['url']))
				{
					match = (importSetupSkill['skillURI'] == inStorageSetupSkill['url'])
				}

				return match;
			});
			
			importSetupSkill._category = _.find(inStorage['contact-attribute-skills-category'], function (category)
			{
				return (importSetupSkill['sourceCode'] == category.reference)
			});

			importSetupSkill._type = _.find(inStorage['contact-attribute-skills-type'], function (type)
			{
				return (importSetupSkill['domainCode'] == type.reference)
			});

			importSetupSkill._level = _.find(inStorage['contact-attribute-skills-level'], function (level)
			{
				return (importSetupSkill['levelCode'] == level.reference)
			});
		
			importSetupSkill._capacity = _.find(inStorage['contact-attribute-skills-capacity'], function (capacity)
			{
				return (importSetupSkill['capacityCode'] == capacity.reference)
			});

			if (_.isSet(importSetupSkill.sourceReference))
			{
				importSetupSkill.notes = '[' + importSetupSkill.sourceReference + '] ' + importSetupSkill.notes
			}

			if (!_.contains(importSetupSkill['skillName'], ' ['))
			{
				importSetupSkill['skillName'] = importSetupSkill['skillName'] + ' [' + importSetupSkill['levelCode'] + '-' + importSetupSkill['capacityName'] + ']'
			}
				
			importSetupSkill.validate = {};

			if (importSetupSkill['skillName'] == '')
			{	
				errors.push('Skill Name is required.');
				importSetupSkill.validate.skillName = false;
			}

			if (importSetupSkill['skillCode'] == '')
			{	
				errors.push('Skill Code is required.');
				importSetupSkill.validate.skillName = false;
			}
	
			if (_.isNotSet(importSetupSkill._category))
			{	
				errors.push('Source Code is not valid');
				importSetupSkill.validate.categoryCode = false;
			}

			if (_.isNotSet(importSetupSkill._type))
			{	
				errors.push('Domain Code is not valid.');
				importSetupSkill.validate.typeCode = false;
			}

			if (_.isNotSet(importSetupSkill._level))
			{	
				errors.push('Level Code is not valid.');
				importSetupSkill.validate.capacityCode = false;
			}

			if (_.isNotSet(importSetupSkill._capacity))
			{	
				errors.push('Capacity Code is not valid.');
				importSetupSkill.validate.capacityCode = false;
			}

			if (errors.length != 0)
			{
				saveToCloudStorageErrors.push(
				{
					errors: errors,
					index: importSetupSkillIndex,
					data: importSetupSkill
				});
			}
			else
			{
				var dataSkill =
				{
					category: importSetupSkill._category.id,
					type: importSetupSkill._type.id,
					level: importSetupSkill._level.id,
					capacity: importSetupSkill._capacity.id,
					reference: importSetupSkill['skillCode'],
					title: importSetupSkill['skillName'],
					url: importSetupSkill['skillURI'],
					notes: importSetupSkill['notes']
				}

				if (importSetupSkill._setupContactAttributeSkill != undefined)
				{
					dataSkill.id = importSetupSkill._setupContactAttributeSkill.id;
				}
				
				var caption = importSetupSkill['skillName'] + '; ' + importSetupSkill['skillCode'];
				
				saveToCloudStorage.push(
				{
					caption: caption,
					object: 'setup_contact_attribute',
					objectName: 'setup_contact_attribute',
					data: dataSkill,
					index: importSetupSkillIndex
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

			app.vq.render('#' + userrole + '-setup-skills-import-review-view');
		}
		else
		{
			app.vq.init();

			app.vq.add(
			[
				'<div class="alert alert-info mx-1 mb-3 row">',
				  	'<div class="col mt-2"><i class="fa fa-check-circle text-larger mr-2" style="color:green;"></i> No errors where found within the file data.  Click Continue to upload the skills to selfdriven.</div>', 
					 '<div class="col-auto">',
				  		'<button class="btn btn-primary btn-outline myds-navigate-to" target="#' + userrole + '-setup-skills-import-update">Continue</button>',
				  	'</div>',
				'</div>'
			]);

			app.vq.add(
			[
				'<table class="table border mt-4">',
					'<thead>',
						'<tr>',
							'<th>Excel File Row</th>',
							'<th>Skill</th>',
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

			app.vq.render('#' + userrole + '-setup-skills-import-review-view');
		}
	}
});

app.add(
{
	name: 'util-setup-skills-import-update-show',
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

		app.invoke('util-setup-skills-import-update-save', param)
	}
});

app.add(
{
	name: 'util-setup-skills-import-update-save',
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
				app.show('#' + userrole + '-setup-skills-import-update-view', '<div class="my-4 text-muted">Importing skill ' + saveToCloudStorage.caption + ' ...</div>');
			}

			_.each(saveToCloudStorage.data, function (value, key)
			{
				if (_.isObject(value))
				{
					if (value.object == 'contact_person')
					{
						var importsetupSkills = app.get(
						{
							scope: 'util-setup-skills-import-upload-process',
							context: 'setup-skills'
						});

						var importsetupSkill = importsetupSkills[saveToCloudStorage.index]

						saveToCloudStorage.data[key] = importsetupSkill[value.field]
					}
				}
			});
	
			mydigitalstructure.cloud.save(
			{
				object: saveToCloudStorage.object,
				data: saveToCloudStorage.data,
				callback: 'util-setup-skills-import-update-save-next',
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

				app.vq.render('#' + userrole + '-setup-skills-import-update-view');
			}
			else
			{
				app.vq.init();

				app.vq.add(
				[
					'<div class="alert alert-info mx-1 mb-3 row">',
					  	'<div class="mt-1"><i class="fa fa-check-circle text-larger mr-2" style="color:green;"></i> Skill(s) have been imported.</div>',
					'</div>',
					'<div class="mt-4 ml-2">',
				  		'<a class="btn btn-default btn-outline" href="#' + userrole + '-setup-skills">',
	          				'View Skills',
	          			'</a>',
	          			
				  	'</div>',
				]);

				app.vq.render('#' + userrole + '-setup-skills-import-update-view');
			}
		}
	}
});

app.add(
{
	name: 'util-setup-skills-import-update-save-next',
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

		var importsetupSkills = app.get(
		{
			scope: 'util-setup-skills-import-upload-process',
			context: 'setup-skills'
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
				if (importsetupSkills != undefined && saveToCloudStorage.object == 'contact_person')
				{
					var field = saveToCloudStorage.objectField;
					if (field == undefined) {field = 'id'}

					importsetupSkill = importsetupSkills[saveToCloudStorage.index];

					if (importsetupSkill != undefined)
					{
						importsetupSkill[field] = response.id;
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

		app.invoke('util-setup-skills-import-update-save', param)
	}
});
