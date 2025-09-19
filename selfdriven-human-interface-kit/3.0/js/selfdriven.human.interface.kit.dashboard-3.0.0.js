app.add(
{
	name: 'util-dashboard-tasks-show',
	code: function (param)
	{
		var context = app._util.param.get(param, 'context').value;
		var filters = app._util.param.get(param, 'filters', {default: []}).value;
		var utilSetup = app.get({scope: 'util-setup'});

		if (context != undefined)
		{
			app.vq.init({queue: 'dashboard'});

			app.vq.add(
			[
				'<div class="row mt-3">',
					'<div class="col-2 text-center">',
						'<div class="card">',
							'<div class="card-body card-body py-2 px-3">',
								'<h1 class="no-margins"',
								' id="', context, '-dashboard-tasks-due-soon"></h1>',
								'<div class="text-muted small">Due Soon</div>',
							'</div>',
						'</div>',
					'</div>',
					'<div class="col-2 text-center">',
						'<div class="card">',
							'<div class="card-body card-body py-2 px-3">',
								'<h1 class="no-margins"',
								' id="', context, '-dashboard-tasks-overdue"></h1>',
								'<div class="text-muted small">Overdue</div>',
							'</div>',
						'</div>',
					'</div>',
				'</div>'
			], {queue: 'dashboard'});

			app.vq.render('#' + context + '-dashboard-view', {queue: 'dashboard'});
			
			app.invoke('util-dashboard',
			{
				dashboards:
				[
					{
						name: context + '-dashboard-tasks-overdue',
						template: '{{count}}',
						storage:
						{
							object: 'project_task',
							fields:
							[
								{name: 'count(id) count'}
							],
							filters:
							_.concat(
							[
								{
									field: 'status',
									comparison: 'NOT_IN_LIST',
									value: utilSetup.taskStatuses.closed
								},
								{
									field: 'startdate',
									comparison: 'LESS_THAN',
									value: app.invoke('util-date')
								}
							], filters)
						},
						styles:
						[
							{
								when: function (data)
								{
									return (data.count != 0)
								},
								class: 'text-danger'
							}
						]
					},
					{
						name: context + '-dashboard-tasks-due-soon',
						template: '{{count}}',
						storage:
						{
							object: 'project_task',
							fields:
							[
								{name: 'count(id) count'}
							],
							filters:
							[
								{
									field: 'status',
									comparison: 'NOT_IN_LIST',
									value: utilSetup.taskStatuses.closed
								},
								{
									field: 'startdate',
									comparison: 'GREATER_THAN',
									value: app.invoke('util-date', {set: {duration: -5}})
								},
								{
									field: 'startdate',
									comparison: 'LESS_THAN',
									value: app.invoke('util-date')
								}
							]
						},
						styles:
						[
							{
								when: function (data)
								{
									return (data.count != 0)
								},
								class: 'text-warning'
							}
						]
					}
				]
			});
		}
	}
});






