/*
	{
    	title: "Admin; Setup", 	
    	design: ""
  	}
*/

// --- SETUP; SKILLS

app.add(
{
	name: 'admin-setup-skills',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'admin-setup-skills',
			valueDefault: {}
		});

		var filters =
		[
			{
				field: 'hidden',
				value: 'N'
			}
		];

		if (!_.isEmpty(data.search))
		{
			filters.push({name: '('});

			if (_.includes(data.search, 'Source:'))
			{
				filters.push(
				{	
					field: 'categorytext',
					comparison: 'TEXT_IS_LIKE',
					value: _.trim(_.replace(data.search, 'Source:', ''))
				});
			}
			else
			{
				filters.push(
				{	
					field: 'title',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				});

				filters.push({name: 'or'});

				filters.push(
				{	
					field: 'typetext',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				});

				filters.push({name: 'or'});
				
				filters.push(
				{	
					field: 'guid',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				});

				filters.push({name: 'or'});
				
				filters.push(
				{	
					field: 'url',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				});
			}

			filters.push({name: ')'});
		}

		app.invoke('util-view-table',
		{
			object: 'setup_contact_attribute',
			container: 'admin-setup-skills-view',
			context: 'admin-setup-skills',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">There are no skills that match this search.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this skill?',
					position: 'left'
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
					controller: 'admin-setup-skills-row'
				},

				columns:
				[
					{
						exportCaption: 'Source',
						field: 'categorytext',
					},
					{
						caption: 'Name',
						field: 'title', 	
						sortBy: true,
						defaultSort: true,
						class: 'col-2 myds-navigate',
						data: 'data-context="{{guid}}" data-controller="admin-setup-skill-summary"'
					},
					{
						caption: 'Domain',
						field: 'typetext', 	
						sortBy: true,
						class: 'col-2 myds-navigate text-center',
						data: 'data-context="{{guid}}" data-controller="admin-setup-skill-summary"'
					},
					{
						caption: 'Code',
						field: 'reference', 	
						sortBy: true,
						class: 'col-2 myds-navigate text-center',
						data: 'data-context="{{guid}}" data-controller="admin-setup-skill-summary"'
					},
					{
						caption: 'Level-Capacity',
						name: '_levelcapacity', 	
						sortBy: false,
						export: false,
						class: 'col-2 myds-navigate text-center',
						data: 'data-context="{{guid}}" data-controller="admin-setup-skill-summary"'
					},
					{
						exportCaption: 'Level',
						field: 'leveltext', 	
						
					},
					{
						exportCaption: 'Capacity',
						field: 'capacitytext', 	
						
					},
					{
						caption: 'Identifiers',
						name: '_identifiers', 	
						sortBy: false,
						export: false,
						class: 'col-4 text-center text-muted',
						data: 'data-context="{{guid}}" data-controller="admin-setup-skill-summary"'
					},
					{
						exportCaption: 'Notes',
						field: 'notes', 	
						
					},
					{
						exportCaption: 'SDI',
						field: 'guid', 	
						
					},
					{
						exportCaption: 'URI',
						field: 'url', 	
						
					},
					{
						exportCaption: 'OnChainAssetName',
						name: '_onChainAssetName',
						export: true	
					},
					{	
						fields:
						['url', 'guid', 'hidden']
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'admin-setup-skills-row',
	code: function (row)
	{
		row._onChainAssetName = app.invoke('admin-setup-skill-on-chain-assetname',
		{
			sdi: row.guid
		});

		row._identifiers =
			'<div>' +
				row.url +
			'</div>' +
			'<div class="mt-1 small">' +
				row.guid +
			'</div>'

		row._levelcapacity = row.leveltext + '-' + row.capacitytext
			
	}
});


app.add(
{
	name: 'admin-setup-skill-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'admin-setup-skill-summary',
			context: 'context'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'admin-setup-skills'});
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'setup_contact_attribute',
					fields: 
					[
						'title',
						'reference',
						'notes',
						'url',
						'hidden',
						'displayorder',
						'guid',
						'parentattribute',
						'parentattributetext',
						'type',
						'typetext',
						'category',
						'categorytext',
						'level',
						'leveltext',
						'capacity',
						'capacitytext'
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
						scope: 'admin-setup-skills',
						context: 'all'
					},
					callback: 'admin-setup-skill-summary'
				});
			}
			else
			{
				if (response.status == 'OK')
				{
					if (response.data.rows.length == 0)
					{
						app.notify({type: 'error', message: 'Can not find this skill'});
						app.invoke('app-navigate-to', {controller: 'admin-setup-skills'});
					}
					else
					{

						var row = _.first(response.data.rows);
						row._onChainAssetName = app.invoke('admin-setup-skill-on-chain-assetname',
						{
							sdi: row.guid
						});
						
						var data = app.set(
						{
							scope: 'admin-setup-skill-summary',
							context: 'dataContext',
							value: row
						});

						app.view.refresh(
						{
							scope: 'admin-setup-skill-summary',
							selector: '#admin-setup-skill-summary',
							data: data,
							collapse:
							{
								contexts: []
							}
						});

						app.invoke('admin-setup-skill-summary-on-chain');
					}
				}
			}
		}
	}	
});

app.add(
{
	name: 'admin-setup-skill-on-chain-assetname',
	code: function (param, response)
	{	
		var sdi = app._util.param.get(param, 'sdi').value;
		var assetName = _.replaceAll(sdi, '-', '');
		assetName = entityos._util.hex.to(assetName);
		return assetName;
	}
});

/*
Convert form using URL once of object for setup_contact_attribute

app.add(
{
	name: 'admin-setup-skill-summary-on-chain',
	code: function (param, response)
	{
		//eg PolicyID; d3b10fe73d752b494c93eb91f21b9c8c3aff2c30ec7a8e427d9cf262

		var data = app.get(
		{
			scope: 'admin-setup-skill-summary-on-chain',
			valueDefault: {}
		});

		var filters =
		[
			{
				field: 'category',
				value: 10 // Blockchain policy
			}
		];

		if (!_.isEmpty(data.search))
		{
			filters.push(
			{	
				field: 'key',
				comparison: 'TEXT_IS_LIKE',
				value: data.search
			});
		}

		app.invoke('util-view-table',
		{
			object: 'core_protect_key',
			container: 'admin-setup-skill-summary-on-chain-view',
			context: 'admin-setup-skill-summary-on-chain',
			filters: filters,
			options:
			{
				noDataText: 'There are no on-chain details.',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this skill?',
					position: 'left'
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
					class: 'd-flex'
				},

				columns:
				[
					{
						caption: 'Policy ID',
						field: 'key', 	
						sortBy: true,
						class: 'col-12 myds-navigate',
						data: ''
					},
					{	
						fields:
						['guid']
					}
				]
			}
		});
	}
});

*/

app.add(
{
	name: 'admin-setup-skill-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataScope: 'admin-setup-skills',
			dataContext: 'all',
			scope: 'admin-setup-skill-edit',
			context: 'id',
			valueDefault:
			{
				id: '',
				title: '',
				reference: '',
				parentattribute: '',
				parentattributetext: '',
				type: '',
				typetext: '',
				category: '',
				categorytext: '',
				level: '',
				leveltext: '',
				capacity: '',
				capacitytext: '',
				notes: ''
			}
		});
	
		app.refresh(
		{
			scope: 'admin-setup-skill-edit',
			selector: '#admin-setup-skill-edit',
			data: data
		});

		app.invoke('util-view-select',
		{
			container: 'admin-setup-skill-edit-parentattribute-' + data.id,
			object: 'setup_contact_attribute',
			fields: [{name: 'title'}],
			filters:
			[
				{
					field: 'hidden',
					value: 'Y'
				}
			]
		});

		app.invoke('util-view-select',
		{
			container: 'admin-setup-skill-edit-category-' + data.id,
			object: 'setup_contact_attribute_category',
			fields: [{name: 'title'}]
		});

		app.invoke('util-view-select',
		{
			container: 'admin-setup-skill-edit-type-' + data.id,
			object: 'setup_contact_attribute_type',
			fields: [{name: 'title'}]
		});

		app.invoke('util-view-select',
		{
			container: 'admin-setup-skill-edit-level-' + data.id,
			object: 'setup_contact_attribute_level',
			fields: [{name: 'title'}]
		});

		app.invoke('util-view-select',
		{
			container: 'admin-setup-skill-edit-capacity-' + data.id,
			object: 'setup_contact_attribute_capacity',
			fields: [{name: 'title'}]
		});
	}	
});

app.add(
{
	name: 'admin-setup-skill-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'admin-setup-skill-edit',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'admin-setup-skill-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values: {}
			}
		});

		if (_.isUndefined(response))
		{		
			mydigitalstructure.cloud.save(
			{
				object: 'setup_contact_attribute',
				data: data,
				callback: 'admin-setup-skill-edit-save',
				set: {scope: 'admin-setup-skill-edit', data: true, guid: true},
				notify: 'Skill has been ' + (id==''?'added':'updated') + '.'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.refresh(
				{
					dataScope: 'admin-setup-skills',
					data: data
				});

				app.invoke('app-navigate-to', {controller: 'admin-setup-skill-summary', context: data.guid});
			}
		}
	}
});

// --- SETUP; PROJECT ROLES

app.add(
{
	name: 'admin-setup-project-roles',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'admin-setup-project-roles',
			valueDefault: {}
		});

		var filters = [];

		if (!_.isEmpty(data.search))
		{
			filters.push(
			{	
				field: 'title',
				comparison: 'TEXT_IS_LIKE',
				value: data.search
			});
		}

		app.invoke('util-view-table',
		{
			object: 'setup_project_role',
			container: 'admin-setup-project-roles-view',
			context: 'admin-setup-project-roles',
			filters: filters,
			options:
			{
				noDataText: 'There are no project roles that match this search.',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this project role?',
					position: 'left'
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
					class: 'd-flex'
				},

				columns:
				[
					{
						caption: 'Title',
						field: 'title', 	
						sortBy: true,
						class: 'col-12 myds-navigate',
						data: 'data-context="{{guid}}" data-controller="admin-setup-project-role-summary"'
					},
					{	
						fields:
						['guid']
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'admin-setup-project-role-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'admin-setup-project-role-summary',
			context: 'context'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'admin-setup-project-roles'});
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'setup_project_role',
					fields: 
					[
						'title',
						'notes',
						'url',
						'hidden',
						'displayorder',
						'guid'
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
						scope: 'admin-setup-project-roles',
						context: 'all'
					},
					callback: 'admin-setup-project-role-summary'
				});
			}
			else
			{
				if (response.status == 'OK')
				{
					if (response.data.rows.length == 0)
					{
						app.notify({type: 'error', message: 'Can not find this project role'});
						app.invoke('app-navigate-to', {controller: 'admin-setup-project-roles'});
					}
					else
					{
						var data = app.set(
						{
							scope: 'admin-setup-project-role-summary',
							context: 'dataContext',
							value: _.first(response.data.rows)
						});

						var utilSetup = app.get({scope: 'util-setup'});

						app.view.refresh(
						{
							scope: 'admin-setup-project-role-summary',
							selector: '#admin-setup-project-role-summary',
							data: data,
							collapse:
							{
								contexts: []
							}
						});
					}
				}
			}
		}
	}	
});

app.add(
{
	name: 'admin-setup-project-role-edit',
	code: function (param, response)
	{	
		var data = app.get(
		{
			scope: 'admin-setup-project-role-summary',
			context: 'dataContext',
			valueDefault:
			{
				id: '',
				title: ''
			}
		});

		app.refresh(
		{
			scope: 'admin-setup-project-role-edit',
			selector: '#admin-setup-project-role-edit',
			data: data
		});
	}	
});

app.add(
{
	name: 'admin-setup-project-role-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'admin-setup-project-role-edit',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'admin-setup-project-role-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values: {}
			}
		});

		if (_.isUndefined(response))
		{		
			mydigitalstructure.cloud.save(
			{
				object: 'setup_project_role',
				data: data,
				callback: 'admin-setup-project-role-edit-save',
				set: {scope: 'admin-setup-project-role-edit', data: true, guid: true},
				notify: 'Project role has been ' + (id==''?'added':'updated') + '.'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.refresh(
				{
					dataScope: 'admin-setup-project-roles',
					data: data
				});

				app.invoke('app-navigate-to', {controller: 'admin-setup-project-role-summary', context: data.guid});
			}
		}
	}
});

app.add(
{
	name: 'admin-skills-upload',
	code: function (param, response)
	{
		app.invoke('util-import-initialise-setup-skills');
	}
});