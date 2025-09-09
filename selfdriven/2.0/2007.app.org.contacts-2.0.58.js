/*
	{
    	title: "Org | Contacts", 	
    	design: "https://slfdrvn.io/apps/#org"
  	}
*/

app.add(
{
	name: 'org-contacts',
	code: function (param)
	{
		var id = app._util.param.get(param, 'id', {default: 'business'}).value;

		if (id == 'business')
		{
			app.invoke('util-view-tab-show', '#org-contacts-dashboard-business');
		}

		if (id == 'person')
		{
			app.invoke('util-view-tab-show', '#org-contacts-dashboard-person');
		}

		app.set(
		{
			scope: 'org-contacts-dashboard',
			merge: true,
			value: {dataContext: {type: id}}
		});

		app.invoke('org-contacts-' + id + '-dashboard', param)
	}
});

// -- CONTACT BUSINESS (ORGANISATION)

app.add(
{
	name: 'org-contacts-business-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'org-contacts-business-dashboard',
			valueDefault: {}
		});

		var filters =
		[];

		if (!_.isEmpty(data.search))
		{
			filters = _.concat(filters,
			[
				{
					name: '('
				},
				{	
					field: 'tradename',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{
					name: 'or'
				},
				{	
					field: 'legalname',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{
					name: ')'
				}
			]);
		}

		app.invoke('util-view-table',
		{
			object: 'contact_business',
			container: 'org-contacts-business-dashboard-view',
			context: 'org-contacts-business',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">You have no organisation contacts that match this search.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				footer: false,
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this organisation contact?',
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
					controller: 'org-contacts-business-dashboard-format'
				},
				columns:
				[
					{
						caption: 'Name',
						field: 'tradename',
						class: 'col-12 col-sm-5 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="org-contact-business-summary"'
					},
					{
						caption: 'Notes',
						field: 'notes', 	
						sortBy: true,
						defaultSort: true,
						defaultSortDirection: 'desc', 
						class: 'col-0 col-sm-7 d-none d-sm-block myds-navigate text-muted',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="contact-business-summary"'
					},
					{	
						fields:
						[
							'guid'
						]
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'org-contacts-business-dashboard-format',
	code: function (row)
	{}
});

app.add(
{
	name: 'org-contact-business-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'org-contact-business-summary',
			context: 'id'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'org-contacts'});
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'contact_business',
					fields: 
					[
						'reference',
						'tradename',
						'webaddress',
						'notes',
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
						scope: 'org-contacts-business',
						context: 'all'
					},
					callback: 'org-contact-business-summary',
					callbackParam: param
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
	
						app.set(
						{
							scope: 'org-contact-business-summary',
							context: 'dataContext',
							value: data
						});

						app.view.refresh(
						{
							scope: 'org-contact-business-summary',
							selector: '#org-contact-business-summary',
							data: data,
							collapse:
							{
								contexts:
								[
									'attachments', 'actions'
								]
							}
						});
						
						app.invoke('util-attachments-initialise',
						{
							context: 'org-contact-business-summary',
							object: app.whoami().mySetup.objects.contactBusiness,
							objectContext: data.id,
							showTypes: false,
							collapsible: false
						});
								
						app.invoke('util-actions-initialise',
						{
							context: 'org-contact-business-summary-action',
							object: app.whoami().mySetup.objects.contactBusiness,
							objectContext: data.id,
							showTypes: true,
							collapsible: false,
							headerCaption: 'Search for Actions & Activity'
						});
					}
				}
			}
		}
	}	
});

app.add(
{
	name: 'org-contact-business-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataScope: 'org-contacts-business',
			dataContext: 'all',
			scope: 'org-contact-business-edit',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				reference: '',
				tradename: '',
				webaddress: '',
				notes: ''
			}
		}

		app.view.refresh(
		{
			scope: 'org-contact-business-edit',
			selector: '#org-contact-business-edit',
			data: data
		});

		/*app.invoke('util-view-select',
		{
			container: 'org-contact-business-edit-status-' + data.id,
			object: 'setup_contact_status',
			fields: [{name: 'title'}]
		});*/
	}	
});

app.add(
{
	name: 'org-contact-business-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			controller: 'org-contact-business-edit',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'org-contact-business-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values:
				{
					status: 1
				}
			}
		});

		if (_.isUndefined(response))
		{
			entityos.cloud.save(
			{
				object: 'contact_business',
				data: data,
				set: {scope: 'admin-contact-business-edit', data: true, guid: true},
				callback: 'org-contact-business-edit-save',
				callbackParam: param
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify({message: 'Contact business has been ' + (id==''?'added':'updated') + '.'});

				app.invoke('util-view-refresh',
				{
					dataScope: 'org-contacts-business',
					data: data
				});

				app.invoke('app-navigate-to', {controller: 'org-contact-business-summary', context: data.guid});
			}
		}
	}
});

// -- CONTACT PERSON

app.add(
{
	name: 'org-contacts-person-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'org-contacts-person-dashboard',
			valueDefault: {}
		});

		var filters =
		[];

		if (!_.isEmpty(data.search))
		{
			filters = _.concat(filters,
			[
				{
					name: '('
				},
				{	
					field: 'firstname',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{
					name: 'or'
				},
				{	
					field: 'surname',
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

		app.invoke('util-view-table',
		{
			object: 'contact_person',
			container: 'org-contacts-person-dashboard-view',
			context: 'org-contacts-person',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">You have no person contacts that match this search.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				footer: false,
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this organisation contact?',
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
					controller: 'org-contacts-business-dashboard-format'
				},
				columns:
				[
					{
						caption: 'First Name',
						field: 'firstname',
						defaultSort: true,
						defaultSortDirection: 'desc', 
						class: 'col-2 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="org-contact-person-summary"'
					},
					{
						caption: 'Last Name',
						field: 'surname', 	
						sortBy: true,
						class: 'col-2 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="org-contact-person-summary"'
					},
					{
						caption: 'Notes',
						field: 'notes', 	
						sortBy: true,
						class: 'col-5 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="org-contact-person-summary"'
					},
					{
						caption: 'Organisation',
						field: 'contactbusinesstext', 	
						sortBy: true,
						class: 'col-3 myds-navigate text-muted',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="org-contact-person-summary"'
					},
					{	
						fields:
						[
							'guid'
						]
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'org-contacts-person-dashboard-format',
	code: function (row)
	{}
});

app.add(
{
	name: 'org-contact-person-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'org-contact-person-summary',
			context: 'id'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'org-contacts'});
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'contact_person',
					fields: 
					[
						'contactbusinesstext',
						'contactbusiness',
						'reference',
						'firstname',
						'surname',
						'email',
						'notes',
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
						scope: 'org-contacts-person',
						context: 'all'
					},
					callback: 'org-contact-person-summary',
					callbackParam: param
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
	
						app.set(
						{
							scope: 'org-contact-person-summary',
							context: 'dataContext',
							value: data
						});

						app.view.refresh(
						{
							scope: 'org-contact-person-summary',
							selector: '#org-contact-person-summary',
							data: data,
							collapse:
							{
								contexts:
								[
									'attachments', 'actions', 'teams-edit'
								]
							}
						});
						
						app.invoke('util-attachments-initialise',
						{
							context: 'org-contact-person-summary',
							object: app.whoami().mySetup.objects.contactPerson,
							objectContext: data.id,
							showTypes: false,
							collapsible: false
						});
								
						app.invoke('util-actions-initialise',
						{
							context: 'org-contact-person-summary-action',
							object: app.whoami().mySetup.objects.contactPerson,
							objectContext: data.id,
							showTypes: true,
							collapsible: false,
							headerCaption: 'Search for Actions & Activity'
						});
					}
				}
			}
		}
	}	
});

app.add(
{
	name: 'org-contact-person-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataScope: 'org-contacts-person',
			dataContext: 'all',
			scope: 'org-contact-person-edit',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				reference: '',
				firstname: '',
				surname: '',
				email: '',
				notes: ''
			}
		}

		app.view.refresh(
		{
			scope: 'org-contact-person-edit',
			selector: '#org-contact-person-edit',
			data: data
		});

		/*app.invoke('util-view-select',
		{
			container: 'org-contact-business-edit-status-' + data.id,
			object: 'setup_contact_status',
			fields: [{name: 'title'}]
		});*/
	}	
});

app.add(
{
	name: 'org-contact-person-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			controller: 'org-contact-person-edit',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'org-contact-person-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values:
				{
					contactbusiness: app.whoami().thisInstanceOfMe.user.contactbusiness,
					status: 1
				}
			}
		});

		if (_.isUndefined(response))
		{
			entityos.cloud.save(
			{
				object: 'contact_person',
				data: data,
				set: {scope: 'admin-contact-person-edit', data: true, guid: true},
				callback: 'org-contact-person-edit-save',
				callbackParam: param
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify({message: 'Contact person has been ' + (id==''?'added':'updated') + '.'});

				app.invoke('util-view-refresh',
				{
					dataScope: 'org-contacts-person',
					data: data
				});

				app.invoke('app-navigate-to', {controller: 'org-contact-person-summary', context: data.guid});
			}
		}
	}
});