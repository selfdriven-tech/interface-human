/*
	{
    	title: "Learner; Community; Projects", 	
    	design: "https://www.selfdriven.foundation"
  	}
*/

app.add(
{
	name: 'learner-community-projects',
	code: function (param, response)
	{
		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		var data = app.get(
		{
			scope: 'learner-community-projects',
			valueDefault: {}
		});

		var type =
		{
			id: -1,
			title: 'All'
		}

		if (_.isSet(data.uriContext))
		{
			var _type = _.find(utilSetup._projectTypes, function(projectType)
			{
				return (_.kebabCase(projectType.title).toLowerCase() == data.uriContext.toLowerCase())
			});

			if (_type != undefined)
			{
				type = _type;
			}
		}

		var data = app.set(
		{
			scope: 'learner-community-projects-dashboard',
			context: 'type',
			value: type.id
		});

		app.vq.init({queue: 'learner-community-projects-types'});

		app.vq.add(
		[
			'<li>',
				'<a href="#" class="myds-dropdown dropdown-item" data-id="{{id}}">',
				'{{title}}',
				'</a>',
			'</li>'
		],
		{
			type: 'template',
			queue: 'learner-community-projects-types'
		});

		app.vq.add(
		[
			'<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" id="learner-community-projects-types-filter" aria-expanded="false">',
				'<span class="dropdown-text">', type.title, '</span>',
			'</button>',
			'<ul class="dropdown-menu mt-1"',
				'data-controller="learner-community-projects-dashboard"',
				'data-context="type"',
			'>',
			'<li>',
				'<a href="#" class="myds-dropdown dropdown-item" data-id="-1">',
				'All',
				'</a>',
			'</li>'
		],
		{
			queue: 'learner-community-projects-types'
		});

		_.each(utilSetup._projectTypes, function (type)
		{
			app.vq.add({useTemplate: true, queue: 'learner-community-projects-types'}, type)
		});

		app.vq.add('</ul>',
		{
			queue: 'learner-community-projects'
		});

		app.vq.render('#learner-community-projects-dashboard-types',
		{
			queue: 'learner-community-projects-types'
		});

		app.invoke('learner-community-projects-dashboard');
	}
});

app.add(
{
	name: 'learner-community-projects-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learner-community-projects-dashboard',
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

		app.invoke('util-view-table',
		{
			object: 'project',
			container: 'learner-community-projects-dashboard-view',
			context: 'learner-community-projects',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">There are no projects that match this search.</div>',
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
						class: 'col-7 col-sm-6 myds-navigate',
						data: 'id="admin-device-summary-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="learner-community-project-summary"'
					},
					{
						caption: 'Type',
						field: 'typetext', 	
						sortBy: true,
						class: 'col-5 col-sm-4 myds-navigate text-muted',
						data: 'id="learner-community-project-summary-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="learner-community-project-summary"'
					},
					{
						caption: 'ID',
						field: 'reference', 	
						sortBy: true,
						class: 'col-0 col-sm-2 d-none d-sm-block myds-navigate text-muted',
						data: 'id="learner-community-project-summary-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="learner-community-project-summary"'
					},
					{	
						fields:
						['type', 'notes', 'typetext', 'statustext', 'restrictedtoteam', 'guid']
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'learner-community-project-summary',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learner-community-project-summary',
			context: 'id',
			valueDefault: ''
		});

		var data = app.find(
		{
			dataController: 'learner-community-projects',
			dataContext: 'all',
			controller: 'learner-community-project-summary',
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
			scope: 'learner-community-project-summary',
			selector: '#learner-community-project-summary',
			data: data
		});

		_.each(['tasks', 'team', 'attachments'], function (context)
		{
			$('#learner-community-project-summary-' + context + '-collapse').removeClass('show')
			$('[href="#learner-community-project-summary-' + context + '-collapse"] > i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
		});
	}	
});

app.add(
{
	name: 'learner-community-project-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataScope: 'learner-community-projects',
			dataContext: 'all',
			scope: 'learner-community-project-edit',
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
			scope: 'learner-community-project-edit',
			selector: '#learner-community-project-edit',
			data: data
		});

		app.invoke('util-view-select',
		{
			container: 'learner-community-project-edit-type-' + data.id,
			object: 'setup_project_type',
			fields: [{name: 'title'}]
		});
	}	
});

app.add(
{
	name: 'learner-community-project-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			controller: 'learner-community-project-summary',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			controller: 'learner-community-project-edit-' + id,
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
				callback: 'learner-community-project-edit-save'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Project added/updated.');

				if (id == '')
				{
					app.invoke('app-navigate-to', {controller: 'learner-community-projects'});
				}
				else
				{
					app.invoke('app-navigate-to', {controller: 'learner-community-project-summary', context: data.id});
				}
			}
		}
	}
});
