/*
	{
    	title: "Admin; Community; Feedback", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
    	object: 'Opportunities'
  	}
*/

app.add(
{
	name: 'admin-community-feedback',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'admin-community-feedback',
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
				value: utilSetup.opportunityTypes.feedback
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
					field: 'email',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{
					name: 'or'
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

		if (!_.isUndefined(data.status))
		{
			if (data.status != -1)
			{
				filters = _.concat(filters,
				[
					{	
						field: 'status',
						value: data.status
					}
				]);
			}
		}

		app.invoke('util-view-table',
		{
			object: 'opportunity',
			container: 'admin-community-feedback-view',
			context: 'admin-community-feedback',
			filters: filters,
			options:
			{
				noDataText: 'There is no feedback that matches this search.',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this feedback?',
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
						row.contactinfo = '<div>' + row.firstname + ' ' + row.surname + '</div>';

						if (row.email != '')
						{
							row.contactinfo = row.contactinfo +
								'<div class="text-muted small"><a href="mailto:' + row.email + '" class="text-muted">' +
										'<i class="fa fa-envelope mr-1"></i>' + row.email + '</a></div>'
						}
					}
				},

				columns:
				[
					{
						caption: 'Feedback By',
						name: 'contactinfo',
						defaultSort: true,
						sortBy: true,
						class: 'col-sm-3 myds-navigate',
						data: 'data-context="{{id}}" data-id="{{id}}" data-controller="admin-community-feedback-summary"'
					},
					{
						caption: 'Date',
						field: 'startdate', 	
						sortBy: true,
						class: 'col-sm-2 myds-navigate',
						data: 'data-context="{{id}}" data-id="{{id}}" data-controller="admin-community-feedback-summary"'
					},
					{
						caption: 'Status',
						field: 'statustext', 	
						sortBy: true,
						class: 'col-sm-2 myds-navigate',
						data: 'data-context="{{id}}" data-id="{{id}}" data-controller="admin-community-feedback-summary"'
					},
					{
						caption: 'Notes',
						field: 'notes', 	
						sortBy: true,
						class: 'col-sm-5 myds-navigate',
						data: 'data-context="{{id}}" data-id="{{id}}" data-controller="admin-community-feedback-summary"'
					},
					{	
						fields:
						['firstname', 'surname', 'email', 'mobile', 'status']
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'admin-community-feedback-summary',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'admin-community-feedback-summary',
			context: 'id',
			valueDefault: ''
		});

		var data = app.find(
		{
			dataController: 'admin-community-feedback',
			dataContext: 'all',
			controller: 'admin-community-feedback-summary',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				subject: '',
				description: ''
			}
		}

		app.view.refresh(
		{
			scope: 'admin-community-feedback-summary',
			selector: '#admin-community-feedback-summary',
			data: data
		});
	}	
});

app.add(
{
	name: 'admin-community-feedback-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataScope: 'admin-community-feedback',
			dataContext: 'all',
			scope: 'admin-community-feedback-edit',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				title: '',
				status: '',
				statustext: '',
				content: ''
			}
		}

		app.view.refresh(
		{
			scope: 'admin-community-feedback-edit',
			selector: '#admin-community-feedback-edit',
			data: data
		});

		app.invoke('util-view-select',
		{
			container: 'admin-community-feedback-edit-status-' + data.id,
			object: 'setup_opportunity_status',
			fields: [{name: 'title'}]
		});

		/*app.invoke('util-view-editor',
		{
			selector: '#admin-community-feedback-edit-description-' + data.id,
			content: data.content
		});*/
	}	
});

app.add(
{
	name: 'admin-community-feedback-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			controller: 'admin-community-feedback-summary',
			context: 'id',
			valueDefault: ''
		});

		var utilSetup = app.get({scope: 'util-setup'});
	
		var data = app.get(
		{
			controller: 'admin-community-feedback-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values:
				{
					type: utilSetup.opportunityTypes.feedback
				}
			}
		});

		if (_.isUndefined(response))
		{
			mydigitalstructure.cloud.save(
			{
				object: 'opportunity',
				data: data,
				callback: 'admin-community-feedback-edit-save'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Feedback added/updated.');

				if (data.project != undefined)
				{
					app.invoke('admin-community-feedback-project-save', param)
				}

				if (id == '')
				{
					app.invoke('app-navigate-to', {controller: 'admin-community-feedback'});
				}
				else
				{
					app.invoke('app-navigate-to', {controller: 'admin-community-feedback-summary', context: data.id});
				}
			}
		}
	}
});

app.add(
{
	name: 'admin-community-feedback-project-link-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			controller: 'admin-community-feedback-summary',
			context: 'id',
			valueDefault: ''
		});

		var utilSetup = app.get({scope: 'util-setup'});
	
		var data = app.get(
		{
			controller: 'admin-community-feedback-edit-' + id,
			cleanForCloudStorage: true
		});

		if (data.project != undefined)
		{
			// check CORE_OBJECT_LINK
		}
	}
});

app.add(
{
	name: 'admin-community-feedback-project-link-save-finalise',
	code: function (param, response)
	{	
		//go back to event and show tasks - button Create Tasks

	}
});
