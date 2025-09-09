/*
	{
    	title: "Learner; Projects", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
  	}
*/

app.add(
{
	name: 'admin-projects',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'admin-projects',
			valueDefault: {}
		});

		var utilSetup = app.get(
		{
			scope: 'util-setup',
			valueDefault: {}
		});

		var filters = [];

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

		app.invoke('util-view-table',
		{
			object: 'project',
			container: 'admin-projects-view',
			context: 'admin-projects',
			filters: filters,
			options:
			{
				noDataText: 'There are no projects that match this search.',
				rows: 20,
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
						row.classNotes = (row.notes==''?'d-none':'')
					}
				},

				columns:
				[
					{
						caption: 'Description',
						field: 'description',
						defaultSort: true,
						sortBy: true,
						class: 'col-sm-8 myds-navigate',
						data: 'id="admin-device-summary-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="admin-project-summary"'
					},
					{
						caption: 'Type',
						field: 'typetext', 	
						sortBy: true,
						class: 'col-sm-2 myds-navigate',
						data: 'id="admin-project-summary-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="admin-project-summary"'
					},
					{
						caption: 'Project ID',
						field: 'reference', 	
						sortBy: true,
						class: 'col-sm-2 myds-navigate',
						data: 'id="admin-project-summary-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="admin-project-summary"'
					},
					{	
						fields:
						['type', 'notes']
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'admin-project-summary',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'admin-project-summary',
			context: 'id',
			valueDefault: ''
		});

		var data = app.find(
		{
			dataController: 'admin-projects',
			dataContext: 'all',
			controller: 'admin-project-summary',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				firstname: '',
				surname: '',
				email: '',
				streetstate: ''
			}
		}

		app.view.refresh(
		{
			scope: 'admin-project-summary',
			selector: '#admin-project-summary',
			data: data
		});
	}	
});

app.add(
{
	name: 'admin-project-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataScope: 'admin-projects',
			dataContext: 'all',
			scope: 'admin-project-edit',
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
			scope: 'admin-project-edit',
			selector: '#admin-project-edit',
			data: data
		});

		app.invoke('util-view-select',
		{
			container: 'admin-project-edit-type-' + data.id,
			object: 'setup_project_type',
			fields: [{name: 'title'}]
		});
	}	
});

app.add(
{
	name: 'admin-project-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			controller: 'admin-project-summary',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			controller: 'admin-project-edit-' + id,
			cleanForCloudStorage: true,
			valueDefault: {}
		});

		if (id == '')
		{}
		else
		{
			data.id = id;
		}

		if (_.isUndefined(response))
		{
			mydigitalstructure.cloud.save(
			{
				object: 'project',
				data: data,
				callback: 'admin-project-edit-save'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Project added/updated.');

				if (id == '')
				{
					app.invoke('app-navigate-to', {controller: 'admin-projects'});
				}
				else
				{
					app.invoke('app-navigate-to', {controller: 'admin-project-summary', context: data.id});
				}
			}
		}
	}
});