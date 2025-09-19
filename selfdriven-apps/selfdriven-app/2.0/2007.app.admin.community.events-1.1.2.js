/*
	{
    	title: "Admin; Community; Events", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
  	}
*/

app.add(
{
	name: 'admin-community-events',
	code: function (param, response)
	{
		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		app.vq.init({queue: 'admin-community-events-types'});

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
			queue: 'admin-community-events-types'
		});

		app.vq.add(
		[
			'<button type="button" class="btn btn-white dropdown-toggle" data-toggle="dropdown" id="admin-community-events-types-filter" aria-expanded="false">',
				'<span class="dropdown-text">Type</span>',
			'</button>',
			'<ul class="dropdown-menu mt-1"',
				'data-controller="admin-community-events-dashboard"',
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
			queue: 'admin-community-events-types'
		});

		_.each(utilSetup._eventTypes, function (type)
		{
			app.vq.add({useTemplate: true, queue: 'admin-community-events-types'}, type)
		});

		app.vq.add('</ul>',
		{
			queue: 'admin-community-events'
		});

		app.vq.render('#admin-community-events-types',
		{
			queue: 'admin-community-events-types'
		});

		app.invoke('admin-community-events-dashboard');
	}
});

app.add(
{
	name: 'admin-community-events-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'admin-community-events-dashboard',
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

		app.invoke('util-view-table',
		{
			object: 'event',
			container: 'admin-community-events-dashboard-view',
			context: 'admin-community-events',
			filters: filters,
			options:
			{
				noDataText: 'There are no events that match this search.',
				rows: 50,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this event?',
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
						caption: 'Name',
						field: 'reference', 	
						sortBy: true,
						class: 'col-sm-2 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="admin-community-event-summary"'
					},
					{
						caption: 'Description',
						field: 'description',
						defaultSort: true,
						sortBy: true,
						class: 'col-sm-4 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="admin-community-event-summary"'
					},
					{
						caption: 'Date',
						field: 'startdate', 	
						sortBy: true,
						class: 'col-sm-3 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="admin-community-event-summary"'
					},
					{
						caption: 'Type',
						field: 'typetext', 	
						sortBy: true,
						class: 'col-sm-3 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="admin-community-event-summary"'
					},
					{	
						fields:
						['enddate', 'type', 'notes', 'guid']
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'admin-community-event-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'admin-community-event-summary',
			context: 'id'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'admin-community-events'});
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'event',
					fields: 
					[
						'reference', 'startdate', 'description',
						'enddate', 'type', 'typetext', 'notes'
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
						scope: 'admin-community-events',
						context: 'all'
					},
					callback: 'admin-community-event-summary'
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
						data.startdate = app.invoke('util-date', data.startdate);
						data.enddate = app.invoke('util-date', data.enddate);

						app.set(
						{
							scope: 'admin-community-event-summary',
							context: 'dataContext',
							value: data
						});

						app.view.refresh(
						{
							scope: 'admin-community-event-summary',
							selector: '#admin-community-event-summary',
							data: data,
							collapse: {contexts: ['attachments', 'actions']}
						});
					}
				}
			}
		}
	}	
});

app.add(
{
	name: 'admin-community-event-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataScope: 'admin-community-events',
			dataContext: 'all',
			scope: 'admin-community-event-edit',
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
				description: '',
				notes: ''
			}
		}

		app.view.refresh(
		{
			scope: 'admin-community-event-edit',
			selector: '#admin-community-event-edit',
			data: data
		});

		app.invoke('util-view-select',
		{
			container: 'admin-community-event-edit-type-' + data.id,
			scope: 'util-setup',
			context: '_eventTypes'
		});
	}	
});

app.add(
{
	name: 'admin-community-event-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'admin-community-event-edit',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'admin-community-event-edit-' + id,
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
				object: 'event',
				data: data,
				callback: 'admin-community-event-edit-save',
				set: {scope: 'admin-community-event-edit'},
				notify: 'Event has been ' + (id==''?'added':'updated') + '.'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.invoke('util-view-refresh',
				{
					dataScope: 'admin-community-events',
					data: data
				});

				app.invoke('app-navigate-to', {controller: 'admin-community-event-summary', context: data.id});
			}
		}
	}
});

app.add(
{
	name: 'admin-community-event-project-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'admin-community-event-edit',
			context: 'id',
			valueDefault: ''
		});

		var eventData = app.get(
		{
			scope: 'admin-community-event-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values: {}
			}
		});

		var utilSetup = app.get({scope: 'util-setup'});

		if (data.object == undefined)
		{
			if (_.isUndefined(response))
			{		
				var data =
				{
					title: eventData.reference + ' Project',
					type: utilSetup.projectTypes.event
				}

				mydigitalstructure.cloud.save(
				{
					object: 'project',
					data: data,
					callback: 'admin-community-event-project-save',
					set: {scope: 'admin-community-event-project'}
				});
			}
			else
			{	
				if (response.status == 'OK')
				{
					var data =
					{
						object: utilSetup.objects.project,
						objectcontext: response.id
					}

					mydigitalstructure.cloud.save(
					{
						object: 'event',
						data: data,
						callback: 'admin-community-event-project-save-finalise'
					});
				}
			}
		}
	}
});

app.add(
{
	name: 'admin-community-event-project-save-finalise',
	code: function (param, response)
	{	
		//go back to event and show tasks - button Create Tasks

	}
});


