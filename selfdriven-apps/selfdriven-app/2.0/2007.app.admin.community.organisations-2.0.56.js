/*
	{
    	title: "Admin; Community; Organisations", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
  	}
*/

// ADMIN; COMMUNITY ORGANISATIONS

app.add(
{
	name: 'admin-community-organisations',
	code: function (param, response)
	{
		var groups = app.get(
		{
			scope: 'admin-community-organisations',
			context: 'groups'
		});

		if (response == undefined && groups == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'setup_contact_business_group',
				fields: ['title'],
				set:
				{
					scope: 'admin-community-organisations',
					context: 'groups'
				},
				callback: 'admin-community-organisations'
			});
		}
		else
		{
			var groupsView = app.vq.init({queue: 'admin-community-organisation-groups'});

			groupsView.template(
			[
				'<li>',
					'<a href="#" class="myds-dropdown" data-id="{{id}}">',
					'{{title}}',
					'</a>',
				'</li>'
			]);

			groupsView.add(
			[
				'<button type="button" class="btn btn-white dropdown-toggle" data-toggle="dropdown" aria-expanded="false">',
					'<span class="dropdown-text">Group</span>',
				'</button>',
				'<ul class="dropdown-menu mt-1"',
					'data-controller="admin-community-organisations-dashboard"',
					'data-context="group"',
				'<li>',
					'<h6 class="dropdown-header mt-2">Group</h6>',
				'</li>',
				'<li>',
					'<a href="#" class="myds-dropdown" data-id="-1">',
					'All',
					'</a>',
				'</li>'
			]);

			_.each(groups, function (group)
			{
				groupsView.add({useTemplate: true}, group)
			});

			groupsView.add('</ul>');

			groupsView.render('#admin-community-organisations-dashboard-groups');

			app.invoke('admin-community-organisations-dashboard');
		}
	}
});

app.add(
{
	name: 'admin-community-organisations-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'admin-community-organisations-dashboard',
			valueDefault: {}
		});

		var filters = [];

		if (!_.isEmpty(data.search))
		{
			filters = _.concat(
			[
				{	
					field: 'tradename',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{	
					field: 'guid',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				}
			]);
		}

		if (!_.isUndefined(data.group))
		{
			if (data.group != -1)
			{
				filters = _.concat(
				[
					{	
						field: 'group',
						value: data.group
					}
				]);
			}
		}

		app.invoke('util-view-table',
		{
			object: 'contact_business',
			container: 'admin-community-organisations-dashboard-view',
			context: 'admin-community-organisations',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">There are no organisations that match this search.</div>',
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
					data: 'data-id="{{id}} data-context="{{guid}}"',
					class: 'd-flex',
					controller: 'admin-community-organisations-dashboard-format'
				},

				columns:
				[
					{
						caption: 'Name',
						field: 'tradename',
						defaultSort: true,
						sortBy: true,
						class: 'col-5 myds-navigate',
						data: 'data-context="{{guid}}" data-controller="admin-community-organisation-summary"'
					},
					{
						caption: 'Primary Group',
						field: 'primarygrouptext', 	
						sortBy: true,
						class: 'col-sm-3 myds-navigate text-muted',
						data: 'data-context="{{guid}}" data-controller="admin-community-organisation-summary"'
					},
					{
						caption: 'selfdriven ID',
						field: 'guid', 	
						sortBy: true,
						class: 'col-sm-4 myds-navigate',
						data: 'data-context="{{guid}}" data-controller="admin-community-organisation-summary"'
					},
					
					{	
						fields: ['createddate', 'modifieddate']
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'admin-community-organisations-dashboard-format',
	code: function (data)
	{
		data.createddate = app.invoke('util-date', data.createddate);
		data.modifieddate = app.invoke('util-date', data.modifieddate);
	}
});

app.add(
{
	name: 'admin-community-organisation-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'admin-community-organisation-summary',
			context: 'id'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'admin-community-organisations'});
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
						'tradename',
						'customerstatus', 'customerstatustext',
						'primarygroup', 'primarygrouptext',
						'createddate', 'modifieddate', 'notes', 'webaddress',
						'guid', 'imageattachment', 'contactbusiness.imageattachment.download'
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
						scope: 'admin-community-organisations',
						context: 'all'
					},
					callback: 'admin-community-organisation-summary'
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
						app.invoke('admin-community-organisations-dashboard-format', data);

						data.profileimagetype = app.whoami().mySetup.attachmentTypes.profileImageOrganisation;

						if (_.isSet(data['contactbusiness.imageattachment.download']))
						{
							data.logoattachmentdownload = _.replace(data['contactbusiness.imageattachment.download'],
								'/download/', '/rpc/core/?method=CORE_ATTACHMENT_DOWNLOAD&id=');
						}

						app.set(
						{
							scope: 'admin-community-organisation-summary',
							context: 'dataContext',
							value: data
						});

						app.invoke('util-attachments-initialise',
						{
							context: 'admin-community-organisation-summary',
							object: app.whoami().mySetup.objects.contactBusiness,
							objectContext: data.id,
							showTypes: false
						});

						app.view.refresh(
						{
							scope: 'admin-community-organisation-summary',
							selector: '#admin-community-organisation-summary',
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
	name: 'admin-community-organisation-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataScope: 'admin-community-organisations',
			dataContext: 'all',
			scope: 'admin-community-organisation-edit',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				tradename: '',
				legalname: '',
				email: '',
				primarygrouptext: '',
				customerstatustext: ''
			}
		}

		app.view.refresh(
		{
			scope: 'admin-community-organisation-edit',
			selector: '#admin-community-organisation-edit',
			data: data
		});

		app.invoke('util-view-select',
		{
			container: 'admin-community-organisation-edit-status-' + data.id,
			object: 'setup_contact_status',
			fields: [{name: 'title'}],
			filters:
			[
				{	
					name: 'id',
					comparison: 'IN_LIST',
					value: '1,3,5'
				}
			]
		});

		app.invoke('util-view-select',
		{
			container: 'admin-community-organisation-edit-primarygroup-' + data.id,
			object: 'setup_contact_business_group',
			fields: [{name: 'title'}],
			filters:
			[]
		});

		/*app.invoke('util-view-select',
		{
			container: 'admin-community-organisation-edit-primarycontact-' + data.id,
			object: 'contact_person',
			fields: [{name: 'tradename'}],
			filters:
			[
				{	
					name: 'primarygroup',
					comparison: 'IN_LIST',
					value: app.whoami().mySetup.businessGroups.community + ',' + app.whoami().mySetup.businessGroups.organisation
				}
			]
		});
		*/
	}	
});

app.add(
{
	name: 'admin-community-organisation-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'admin-community-organisation-edit',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'admin-community-organisation-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values:
				{
					primarygroup: app.whoami().mySetup.businessGroups.community
				}
			}
		});

		if (_.isUndefined(response))
		{		
			mydigitalstructure.cloud.save(
			{
				object: 'contact_business',
				data: data,
				callback: 'admin-community-organisation-edit-save',
				set: {scope: 'admin-community-organisation-edit', data: true, guid: true},
				notify: 'Community organisation has been ' + (id==''?'added':'updated') + '.'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.refresh(
				{
					dataScope: 'admin-community-organisations',
					data: data
				});

				app.invoke('app-navigate-to', {controller: 'admin-community-organisation-summary', context: data.guid});
			}
		}
	}
});

// PROFILE LOGO

app.add(
{
	name: 'admin-community-organisation-profile-logo-upload',
	code: function (param)
	{	
		entityos._util.attachment.upload(
		{
		  context: 'myds-util-attachment-upload-logo',
		  callback: 'admin-community-organisation-profile-logo-upload-process'
		});
	}
});

app.add(
{
	name: 'admin-community-organisation-profile-logo-upload-process',
	code: function (param, response)
	{
		var communityOrganisation = app.get(
		{
			scope: 'admin-community-organisation-summary',
			context: 'dataContext'
		})

		if (response == undefined)
		{
			var whoami = app.whoami();

			if (param.attachments.length != 0)
			{
				var _attachment = _.first(param.attachments);
				_attachment.download = '/rpc/core/?method=CORE_ATTACHMENT_DOWNLOAD&id=' + _attachment.attachmentlink;

				$('#admin-community-organisation-profile-logo').attr('src', _attachment.download);
				$('#admin-community-organisation-profile-logo').removeClass('d-none');
				$('#admin-community-organisation-profile-logo-remove-view').removeClass('d-none');

				var data =
				{
					id: communityOrganisation.id,
					imageattachment: _attachment.attachment
				}

				mydigitalstructure.cloud.save(
				{
					object: 'contact_business',
					data: data,
					callback: 'admin-community-organisation-profile-logo-upload-process'
				});
			}
		}
		else
		{
			app.notify('Logo image updated');
			app.invoke('util-view-spinner-remove', {controller: 'admin-community-organisation-profile-logo-upload'});
		}
	}
});

app.add(
{
	name: 'admin-community-organisation-profile-logo-remove',
	code: function (param, response)
	{
		if (response == undefined)
		{
			var whoami = app.whoami();

			$('#admin-community-organisation-profile-logo').addClass('d-none');
			$('#admin-community-organisation-profile-logo-remove-view').addClass('d-none');

			mydigitalstructure._scope.space.logoattachment = '';
			mydigitalstructure._scope.space.logoattachmentdownload = '';

			var data =
			{
				id: whoami.thisInstanceOfMe.user.contactbusiness,
				imageattachment: ''
			}

			mydigitalstructure.cloud.save(
			{
				object: 'contact_business',
				data: data,
				callback: 'admin-community-organisation-profile-logo-remove'
			});
		}
		else
		{
			app.notify('Logo image removed');
		}
	}
});
