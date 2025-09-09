/*
	{
    	title: "Admin; Community; Projects", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
  	}
*/

app.add(
{
	name: 'admin-community-projects',
	code: function (param, response)
	{
		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		app.vq.init({queue: 'admin-community-projects-types'});

		app.vq.add(
		[
			'<li>',
				'<a href="#" class="myds-dropdown" data-id="{{id}}">',
				'{{title}}',
				'</a>',
			'</li>'
		],
		{
			type: 'template',
			queue: 'admin-community-projects-types'
		});

		app.vq.add(
		[
			'<button type="button" class="btn btn-white dropdown-toggle" data-toggle="dropdown" id="admin-community-projects-types-filter" aria-expanded="false">',
				'<span class="dropdown-text">Type</span>',
			'</button>',
			'<ul class="dropdown-menu mt-1"',
				'data-controller="admin-community-projects-dashboard"',
				'data-context="type"',
			'>',
			'<li>',
				'<h6 class="dropdown-header mt-2">Type</h6>',
			'</li>',
			'<li>',
				'<a href="#" class="myds-dropdown" data-id="-1">',
				'All',
				'</a>',
			'</li>'
		],
		{
			queue: 'admin-community-projects-types'
		});

		//restrict to environment only

		_.each(utilSetup._projectTypes, function (type)
		{
			app.vq.add({useTemplate: true, queue: 'admin-community-projects-types'}, type)
		});

		app.vq.add('</ul>',
		{
			queue: 'admin-community-projects'
		});

		app.vq.render('#admin-community-projects-dashboard-types',
		{
			queue: 'admin-community-projects-types'
		});

		app.invoke('admin-community-projects-dashboard');
	}
});

app.add(
{
	name: 'admin-community-projects-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'admin-community-projects-dashboard',
			valueDefault: {}
		});

		var utilSetup = app.get(
		{
			scope: 'util-setup',
			valueDefault: {}
		});

		var filters =
		[
			{
				field: 'restrictedtoteam',
				value: 'N'
			}
		];

		if (!_.isEmpty(data.search))
		{
			filters = _.concat(
			[
				{	
					field: 'reference',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{
					name: 'or'
				},
				{	
					field: 'description',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				}
			]);
		}

		if (!_.isUndefined(data.type))
		{
			if (data.type != -1)
			{
				filters = _.concat(
				[
					{	
						field: 'type',
						value: data.type
					}
				]);
			}
		}
		else
		{
			filters = _.concat(
			[
				{	
					field: 'type',
					comparison: 'IN_LIST',
					value: utilSetup.projectTypes.environment
				}
			]);
		}

		app.invoke('util-view-table',
		{
			object: 'project',
			container: 'admin-community-projects-dashboard-view',
			context: 'admin-community-projects',
			filters: filters,
			options:
			{
				noDataText: 'There are no projects that match this search.',
				rows: 50,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this project?',
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
					method: function (row)
					{
						row.classNotes = (row.notes==''?'d-none':'');
						var date = moment(row.startdate, 'D MMM YYYY LT');
						if (date.isValid())
						{
							row.startdate = moment(row.startdate, 'D MMM YYYY LT').format('D MMM YYYY');
						}

						var date = moment(row.enddate, 'D MMM YYYY LT');
						if (date.isValid())
						{
							row.enddate = moment(row.enddate, 'D MMM YYYY LT').format('D MMM YYYY');
						}
					}
				},

				columns:
				[
					{
						caption: 'Description',
						field: 'description',
						defaultSort: true,
						sortBy: true,
						class: 'col-sm-7 myds-navigate',
						data: 'id="admin-device-summary-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="admin-community-project-summary"'
					},
					{
						caption: 'Type',
						field: 'typetext', 	
						sortBy: true,
						class: 'col-sm-4 myds-navigate',
						data: 'id="admin-community-project-summary-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="admin-community-project-summary"'
					},
					{
						caption: 'ID',
						field: 'reference', 	
						sortBy: true,
						class: 'col-sm-1 myds-navigate text-muted',
						data: 'id="admin-community-project-summary-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="admin-community-project-summary"'
					},
					{	
						fields:
						['type', 'notes', 'typetext', 'statustext', 'startdate', 'enddate']
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'admin-community-project-summary',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'admin-community-project-summary',
			context: 'id',
			valueDefault: ''
		});

		var utilSetup = app.get({scope: 'util-setup'});

		if (id == '')
		{
			app.invoke('app-navigate-to', {controller: 'admin-community-projects'});
		}
		else
		{
			var data = app.find(
			{
				dataController: 'admin-community-projects',
				dataContext: 'all',
				controller: 'admin-community-project-summary',
				context: 'id'
			});

			app.invoke('util-attachments-initialise',
			{
				context: 'admin-community-project-summary',
				object: utilSetup.objects.project,
				objectContext: data.id,
				showTypes: false
			});

			if (!_.isUndefined(data))
			{
				app.view.refresh(
				{
					scope: 'admin-community-project-summary',
					selector: '#admin-community-project-summary',
					data: data,
					collapse: {contexts: ['tasks', 'task-edit', 'team', 'team-edit', 'attachments']}
				});
			}
		}
	}	
});

app.add(
{
	name: 'admin-community-project-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataScope: 'admin-community-projects',
			dataContext: 'all',
			scope: 'admin-community-project-edit',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				reference: '',
				type: '',
				typetext: '',
				description: ''
			}
		}

		app.view.refresh(
		{
			scope: 'admin-community-project-edit',
			selector: '#admin-community-project-edit',
			data: data
		});

		app.invoke('util-view-select',
		{
			container: 'admin-community-project-edit-type-' + data.id,
			object: 'setup_project_type',
			fields: [{name: 'title'}]
		});
	}	
});

app.add(
{
	name: 'admin-community-project-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'admin-community-project-edit',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'admin-community-project-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values: {datareturn: 'reference,typetext'}
			}
		});

		if (_.isUndefined(response))
		{		
			mydigitalstructure.cloud.save(
			{
				object: 'project',
				data: data,
				callback: 'admin-community-project-edit-save',
				set: {scope: 'admin-community-project-edit'}
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				if (_.has(response, 'data'))
				{
					app.invoke('admin-community-project-edit-save-reference', param, response)
				}
				else
				{
					app.invoke('admin-community-project-edit-save-finalise')
				}
			}
		}
	}
});

app.add(
{
	name: 'admin-community-project-edit-save-reference',
	code: function (param, response)
	{	
		if (response != undefined)
		{
			var data =
			{
				id: response.id
			}

			var dataReturn = _.first(response.data.rows);
			
			data.reference = _.replace(dataReturn.reference, 'PRJ00', _.first(dataReturn.typetext));

			mydigitalstructure.cloud.save(
			{
				object: 'project',
				data: data,
				callback: 'admin-community-project-edit-save-finalise',
				set: {scope: 'admin-community-project-edit'}
			});
		}
	}
});

app.add(
{
	name: 'admin-community-project-edit-save-finalise',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'admin-community-project-edit',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'admin-community-project-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values: {datareturn: 'reference,typetext'}
			}
		});

		app.notify({message: 'Project has been ' + (id==''?'added':'updated') + '.'});

		app.invoke('util-view-refresh',
		{
			dataScope: 'admin-community-projects',
			data: data
		});

		app.invoke('app-navigate-to', {controller: 'admin-community-project-summary', context: data.id});
	}
});
