/*
	{
    	title: "Admin; Community; Members", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
  	}
*/

// ADMIN; COMMUNITY MEMBERS

app.add(
{
	name: 'admin-community-members',
	code: function (param, response)
	{
		var groups = app.get(
		{
			scope: 'admin-community-members',
			context: 'groups'
		});

		var utilSetup = app.get({scope: 'util-setup'});

		if (response == undefined && groups == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'setup_contact_person_group',
				fields: ['title'],
				set:
				{
					scope: 'admin-community-members',
					context: 'groups'
				},
				callback: 'admin-community-members'
			});
		}
		else
		{
			var groupsView = app.vq.init({queue: 'admin-community-member-groups'});

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
					'data-controller="admin-community-members-dashboard"',
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

			groupsView.render('#admin-community-members-dashboard-groups');

			app.invoke('admin-community-members-dashboard');
		}
	}
});

app.add(
{
	name: 'admin-community-members-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'admin-community-members-dashboard',
			valueDefault: {}
		});

		var filters = [];

		if (!_.isEmpty(data.search))
		{
			filters = _.concat(
			[
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
					field: 'email',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{
					name: 'or'
				},
				{	
					field: 'contactperson.contactbusiness.tradename',
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

		/*app.invoke('util-dashboard-members-show',
		{
			context: 'admin-community-members',
			filters: filters
		});
		*/

		app.invoke('util-view-table',
		{
			object: 'contact_person',
			container: 'admin-community-members-dashboard-view',
			context: 'admin-community-members',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">There are no members that match this search.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this project task?',
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
					data: 'data-id="{{id}} data-context="{{guid}}"',
					class: 'd-flex',
					controller: 'admin-community-members-dashboard-format'
				},

				columns:
				[
					{
						caption: 'First Name',
						field: 'firstname',
						defaultSort: true,
						sortBy: true,
						class: 'col-sm-2 myds-navigate',
						data: 'data-context="{{guid}}" data-controller="admin-community-member-summary"'
					},

					{
						caption: 'Last Name',
						field: 'surname', 	
						sortBy: true,
						class: 'col-sm-2',
						data: 'data-context="{{guid}}" data-controller="admin-community-member-summary"'
					},
					{
						caption: 'Email',
						field: 'email', 	
						sortBy: true,
						class: 'col-sm-5 myds-navigate',
						data: 'data-context="{{guid}}" data-controller="admin-community-member-summary"'
					},
					{
						caption: 'Info',
						name: 'memberinfo', 	
						sortBy: true,
						class: 'col-sm-2 myds-navigate text-muted',
						data: 'data-context="{{guid}}" data-controller="admin-community-member-summary"'
					},
					{
						html: '<button class="btn btn-danger btn-outline btn-sm myds-delete"' +
	               			' id="admin-community-members-delete-{{id}}" data-id="{{id}}"><i class="fa fa-trash"></i></button>',
						caption: '&nbsp;',
						class: 'col-sm-1 text-right'
					},
					{	
						fields:
						[
							'guid', 'customerstatus', 'customerstatustext', 'contactbusiness',
							'createddate', 'modifieddate', 'contactperson.user.id', 'primarygroup', 'contactsince', 'contactbusinesstext', 'primarygrouptext'
						]
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'admin-community-members-dashboard-format',
	code: function (data)
	{
		data.createddate = app.invoke('util-date', data.startdate);
		data.modifieddate = app.invoke('util-date', data.modifieddate);
		data.userinfo = (data['contactperson.user.id']==''?'Does not have user account':'Has user account');
		data.userid = data['contactperson.user.id'];
		data.usersignup = (data['contactperson.user.id']==''?'signup':'');
		data.memberinfo = '<div>' + data.primarygrouptext + '</div>' +
								'<div>' + data.contactbusinesstext + '</div>';
	}
});

app.add(
{
	name: 'admin-community-members-board',
	code: function (param, response)
	{
		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'contact_person',
				filters: filters,
				fields:
				[
					'guid'
				],
				callback: 'admin-community-members-board'
			});
		}
		else
		{
			app.invoke('admin-community-members-board-show')
		}
	}
});

app.add(
{
	name: 'admin-community-members-board-show',
	code: function (param, response)
	{	
		/*
		var tasksByProject = app.get(
		{
			scope: 'admin-community-tasks-board',
			context: 'tasks-by-project',
			value: tasksByProject
		});

		app.vq.init({queue: 'board-project'});

		app.vq.add('<div class="container-fluid"><div class="row">',
			{queue: 'board-project'});

		app.vq.add(['<div class="col-4 mb-4"><div class="card"><div class="card-body">',
			'<h4>{{projecttask.project.description}}</h4>'],
			{type: 'template', queue: 'board-project'});

		_.each(tasksByProject, function (projectTasks)
		{
			var _project = _.first(projectTasks);

			app.vq.add({useTemplate: true, queue: 'board-project'}, _project);

				app.vq.add('<ul class="sortable-list connectList agile-list ui-sortable">',
					{queue: 'board-project-tasks'});

				app.vq.add(				
				[
			 		'<li class="{{class}}-element ui-sortable-handle myds-navigate"',
			 			' data-controller="admin-community-task-summary"',
			 			' data-context="{{id}}"',
			 			'>',
						'{{description}}',
                        '<div class="agile-detail">',
							'<div>{{startdate}}</div>',
							'<div class="mt-2">{{taskbyusertext}}</div>',
							'<div class="d-none"><a href="#" class="btn btn-xs btn-white">Action</a></div>',
						'</div>',
					'</li>'
				],
				{type: 'template', queue: 'board-project-tasks'});

				_.each(projectTasks, function (projectTask)
				{
					projectTask.startdate = moment(projectTask.startdate, 'D MMM YYYY LT').format('D MMM YYYY');
					projectTask.class = utilSetup.taskStatusClasses[projectTask.statustext];
					app.vq.add({useTemplate: true, queue: 'board-project-tasks'}, projectTask);
				});
				
				app.vq.add('</ul></div></div></div>',
					{queue: 'board-project-tasks'});

			app.vq.add(app.vq.get({queue: 'board-project-tasks'}),
				{queue: 'board-project'});

		});

		app.vq.add('</div></div>',
			{queue: 'board-project'});
		*/

		app.vq.render('#admin-community-members-board-view', {queue: 'board-project'});
	}
});

app.add(
{
	name: 'admin-community-members-delete-ok',
	code: function (param, response)
	{
		if (_.isUndefined(response))
		{
			if (!_.isUndefined(param.dataContext))
			{
				mydigitalstructure.cloud.delete(
				{
					object: 'contact_person',
					data:
					{
						id: param.dataContext.id,
					},
					callback: 'admin-community-members-delete-ok'
				});
			}	
		}
		else
		{
			if (response.status == 'OK')
			{
				app.notify({message: 'Member deleted.', persist: false});
				app.invoke('admin-community-members');
			}
		}
	}
});

app.add(
{
	name: 'admin-community-member-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'admin-community-member-summary',
			context: 'id'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'admin-community-members'});
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
						'firstname', 'surname', 'email',
						'customerstatus', 'customerstatustext',
						'primarygroup', 'primarygrouptext',
						'createddate', 'modifieddate',
						'guid', 'contactperson.user.id', 'contactperson.user.username',
						'notes', 'contactsince', 'contactbusiness', 'contactbusinesstext',
						'contactperson.contactbusiness.guid'
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
						scope: 'admin-community-members',
						context: 'all'
					},
					callback: 'admin-community-member-summary'
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
						app.invoke('admin-community-members-dashboard-format', data);

						app.set(
						{
							scope: 'admin-community-member-summary',
							context: 'dataContext',
							value: data
						});

						app.invoke('util-attachments-initialise',
						{
							context: 'admin-community-member-summary',
							object: app.whoami().mySetup.objects.contactPerson,
							objectContext: data.id,
							showTypes: false
						});

						app.view.refresh(
						{
							scope: 'admin-community-member-summary',
							selector: '#admin-community-member-summary',
							data: data,
							collapse: {contexts: ['attachments', 'learning-partners', 'learning-partner-edit', 'skills', 'skill-edit', 'endorsements', 'endorsement-edit', 'reflections', 'reflection-edit', 'teams', 'teams-edit', 'identifiers']}
						});

						app.invoke('util-view-select',
						{
							container: 'admin-community-member-summary-status',
							object: 'setup_contact_status',
							fields: [{name: 'title'}]
						});
					}
				}
			}
		}
	}	
});

app.add(
{
	name: 'admin-community-member-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataScope: 'admin-community-members',
			dataContext: 'all',
			scope: 'admin-community-member-edit',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				firstname: '',
				surname: '',
				primarygrouptext: '',
				customerstatustext: ''
			}
		}

		app.view.refresh(
		{
			scope: 'admin-community-member-edit',
			selector: '#admin-community-member-edit',
			data: data
		});

		app.invoke('util-view-select',
		{
			container: 'admin-community-member-edit-status-' + data.id,
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
			container: 'admin-community-member-edit-primarygroup-' + data.id,
			object: 'setup_contact_person_group',
			fields: [{name: 'title'}],
			filters:
			[]
		});

		app.invoke('util-view-select',
		{
			container: 'admin-community-member-edit-contactbusiness-' + data.id,
			object: 'contact_business',
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
	}	
});

app.add(
{
	name: 'admin-community-member-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'admin-community-member-edit',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'admin-community-member-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values:
				{
					contactbusiness: app.whoami().thisInstanceOfMe.user.contactbusiness
				}
			}
		});

		if (_.isUndefined(response))
		{		
			mydigitalstructure.cloud.save(
			{
				object: 'contact_person',
				data: data,
				callback: 'admin-community-member-edit-save',
				set: {scope: 'admin-community-member-edit', data: true, guid: true},
				notify: 'Community member has been ' + (id==''?'added':'updated') + '.'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.refresh(
				{
					dataScope: 'admin-community-members',
					data: data
				});

				app.invoke('app-navigate-to', {controller: 'admin-community-member-summary', context: data.guid});
			}
		}
	}
});

app.add(
{
	name: 'admin-community-members-upload',
	code: function (param, response)
	{
		app.invoke('util-import-initialise-community-members');
	}
});