/*
	{
    	title: "Learning Partner; Community; Documents", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
  	}
*/

app.add(
{
	name: 'learning-partner-community-documents',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-community-documents',
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
				field: 'type',
				value: 5
			},
			{
				field: 'url',
				comparison: 'IS_NULL'
			}
		];

		if (!_.isEmpty(data.search))
		{
			filters = _.concat(filters,
			[
				{
					name: '('
				},
				{	
					field: 'title',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{
					name: 'or'
				},
				{	
					field: 'summary',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{
					name: ')'
				}
			]);
		}

		if (!_.isUndefined(data.status))
		{
			if (data.status != -1)
			{
				filters = _.concat(filters,
				[
					{	
						field: 'statys',
						value: data.status
					}
				]);
			}
		}

		app.invoke('util-view-table',
		{
			object: 'document',
			container: 'learning-partner-community-documents-view',
			context: 'learning-partner-community-documents',
			filters: filters,
			options:
			{
				noDataText: 'There are no documents that match this search.',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this document?',
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
						caption: 'Name',
						field: 'title',
						defaultSort: true,
						sortBy: true,
						class: 'col-sm-4 myds-navigate',
						data: 'id="learning-partner-community-document-summary-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="learning-partner-community-document-summary"'
					},
					{
						caption: 'Summary',
						field: 'summary', 	
						sortBy: true,
						class: 'col-sm-6 myds-navigate',
						data: 'id="learning-partner-community-document-summary-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="learning-partner-community-document-summary"'
					},
					{
						caption: 'Status',
						field: 'statustext', 	
						sortBy: true,
						class: 'col-sm-2 myds-navigate',
						data: 'id="learning-partner-community-document-summary-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="learning-partner-community-document-summary"'
					},
					{	
						fields:
						['type', 'content']
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'learning-partner-community-document-summary',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learning-partner-community-document-summary',
			context: 'id',
			valueDefault: ''
		});

		var data = app.find(
		{
			dataController: 'learning-partner-community-documents',
			dataContext: 'all',
			controller: 'learning-partner-community-document-summary',
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
			scope: 'learning-partner-community-document-summary',
			selector: '#learning-partner-community-document-summary',
			data: data
		});
	}	
});

app.add(
{
	name: 'learning-partner-community-document-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataScope: 'learning-partner-community-documents',
			dataContext: 'all',
			scope: 'learning-partner-community-document-edit',
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
			scope: 'learning-partner-community-document-edit',
			selector: '#learning-partner-community-document-edit',
			data: data
		});

		app.invoke('util-view-select',
		{
			container: 'learning-partner-community-document-edit-status-' + data.id,
			object: 'setup_document_status',
			fields: [{name: 'title'}]
		});
	}	
});

app.add(
{
	name: 'learning-partner-community-document-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			controller: 'learning-partner-community-document-summary',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			controller: 'learning-partner-community-document-edit-' + id,
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
			mydigitalstructure.update(
			{
				object: 'project',
				data: data,
				callback: 'learning-partner-community-document-edit-save'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Dcoument added/updated.');

				if (id == '')
				{
					app.invoke('app-navigate-to', {controller: 'learning-partner-community-documents'});
				}
				else
				{
					app.invoke('app-navigate-to', {controller: 'learning-partner-community-project-summary', context: data.id});
				}
			}
		}
	}
});