/*
	{
    	title: "Util; Setup; templates", 	
    	design: "https://docs.google.com/document/d/1EvpCTyyn_U9J3tsUxV4U67WmoCWEWM6lLQMjLmXAcB4"
  	}
*/

app.add(
{
	name: 'util-setup-templates',
	code: function (param, response)
	{
		var data = app._util.data.get(
		{
			scope: 'util-setup-templates',
			valueDefault: {}
		});
		var emailTemplates = app.get({scope: 'util-setup', context: 'emailTemplates', valueDefault: {}});

		var templateIDs = [];
		_.each(Object.keys(emailTemplates), function(template) {templateIDs.push(template.id)});

		var filters = 
		[
			{field: 'type', value: '10'},
			{field: 'public', value: 'Y'}
		];

		if (!_.isEmpty(data.search))
		{
			filters = filters.concat(
			[
				{name: '('},
				{	
					name: 'title',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{name:'or'},
				{	
					name: 'url',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{name: ')'}
			]);
		}

		app.invoke('util-view-table',
		{
			object: 'document',
			container: 'util-setup-templates-view',
			context: 'util-setup-templates',
			filters: filters,
			options:
			{
				noDataText: 'There are no templates that match this search.',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this template?',
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
					controller: "util-setup-template-summary-format"
				},

				columns:
				[
					{
						caption: 'Title',
						field: 'title', 
						sortBy: true,
						class: 'col-sm-5 myds-navigate',
						data: 'id="util-setup-template-summary-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="util-setup-template-summary"'
					},
					{
						caption: 'URL',
						field: 'url',
						sortBy: true,
						class: 'col-sm-6 myds-navigate',
						data: 'id="util-setup-template-summary-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="util-setup-template-summary"'
					},
					{
						html: '<button class="btn btn-danger btn-outline btn-sm myds-delete"' +
	               			' id="util-setup-templates-delete-{{id}}" data-id="{{id}}"><i class="fa fa-trash"></i></button>',
						caption: '&nbsp;',
						class: 'col-sm-1 text-right'
					},
					{	
						fields: ['content', 'summary', 'guid']
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'util-setup-template-summary-format',
	code: function (row)
	{
		
	}
});

app.add(
{
	name: 'util-setup-template-summary',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'util-setup-template-summary',
			context: 'id',
			valueDefault: ''
		});

		var data = app.find(
		{
			dataController: 'util-setup-templates',
			dataContext: 'all',
			controller: 'util-setup-template-summary',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data = {};
			app.notify('Unable to find template.');
		}

		app.view.refresh(
		{
			scope: 'util-setup-template-summary',
			selector: '#util-setup-template-summary',
			data: data
		});
	}	
});

app.add(
{
	name: 'util-setup-templates-delete-ok',
	code: function (param, response)
	{
		var dataContext = app._util.param.get(param, 'dataContext', {'default': {}}).value;
		var id = app._util.param.get(dataContext, 'id').value;

		if (_.isUndefined(response))
		{
			if (!_.isUndefined(id))
			{
				mydigitalstructure.cloud.delete(
				{
					object: 'document',
					data:
					{
						id: param.dataContext.id,
					},
					callback: 'util-setup-templates-delete-ok'
				});
			}
			else
			{
				app.notify('Nothing to delete.');
			}
		}
		else
		{
			if (response.status == 'OK')
			{
				app.notify('Template deleted.');
				app.invoke('util-setup-templates', {});
			}
		}
	}
});

app.add(
{
	name: 'util-setup-template-edit',
	code: function (param)
	{
		var data = app.find(
		{
			dataScope: 'util-setup-templates',
			dataContext: 'all',
			scope: 'util-setup-template-edit',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				content: ''
			}
		}

		app.view.refresh(
		{
			scope: 'util-setup-template-edit',
			selector: '#util-setup-template-edit',
			data: data
		});

		app.invoke('util-view-editor',
		{
			selector: '#util-setup-template-edit-content-' + data.id,
			content: data.content
		});
	}
});


app.add(
{
	name: 'util-setup-template-edit-validate',
	code: function (param)
	{
		app.invoke('util-setup-template-edit-validate', param);
	}
});

app.add(
{
	name: 'util-setup-template-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'util-setup-template-edit',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'util-setup-template-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values: {public: 'Y', type: 10}
			}
		});

		if (_.isUndefined(response))
		{		
			mydigitalstructure.cloud.save(
			{
				object: 'document',
				data: data,
				callback: 'util-setup-template-edit-save',
				set: {scope: 'util-setup-template-edit'},
				notify: 'Template has been ' + (id==''?'added':'updated') + '.'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.refresh(
				{
					dataScope: 'util-setup-templates',
					data: data
				});

				app.invoke('app-navigate-to', {controller: 'util-setup-template-summary', context: data.id});
			}
		}
	}
});



