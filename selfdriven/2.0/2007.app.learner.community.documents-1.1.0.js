/*
	{
    	title: "Learner; Community; Documents", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
  	}
*/

app.add(
{
	name: 'learner-community-documents',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learner-community-documents',
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
				value: '5'
			},
			{
				field: 'url',
				comparison: 'IS_NULL'
			},
			{
				field: 'status',
				value: '2'
			},

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
			container: 'learner-community-documents-view',
			context: 'learner-community-documents',
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
						data: 'id="learner-community-document-summary-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="learner-community-document-summary"'
					},
					{
						caption: 'Summary',
						field: 'summary', 	
						sortBy: true,
						class: 'col-sm-6 myds-navigate',
						data: 'id="learner-community-document-summary-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="learner-community-document-summary"'
					},
					{
						caption: 'Status',
						field: 'statustext', 	
						sortBy: true,
						class: 'col-sm-2 myds-navigate',
						data: 'id="learner-community-document-summary-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="learner-community-document-summary"'
					},
					{	
						fields:
						['type', 'status', 'content']
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'learner-community-document-summary',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learner-community-document-summary',
			context: 'id',
			valueDefault: ''
		});

		var data = app.find(
		{
			dataController: 'learner-community-documents',
			dataContext: 'all',
			controller: 'learner-community-document-summary',
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
			scope: 'learner-community-document-summary',
			selector: '#learner-community-document-summary',
			data: data
		});
	}	
});

app.add(
{
	name: 'learner-community-document-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataScope: 'learner-community-documents',
			dataContext: 'all',
			scope: 'learner-community-document-edit',
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
			scope: 'learner-community-document-edit',
			selector: '#learner-community-document-edit',
			data: data
		});

		app.invoke('util-view-select',
		{
			container: 'learner-community-document-edit-status-' + data.id,
			object: 'setup_document_status',
			fields: [{name: 'title'}]
		});
	}	
});

app.add(
{
	name: 'learner-community-document-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			controller: 'learner-community-document-summary',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			controller: 'learner-community-document-edit-' + id,
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
				callback: 'learner-community-document-edit-save'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Dcoument added/updated.');

				if (id == '')
				{
					app.invoke('app-navigate-to', {controller: 'learner-community-documents'});
				}
				else
				{
					app.invoke('app-navigate-to', {controller: 'learner-community-project-summary', context: data.id});
				}
			}
		}
	}
});