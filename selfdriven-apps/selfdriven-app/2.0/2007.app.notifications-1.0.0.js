app.add(
{
	name: 'app-notifications',
	code: function (param, response)
	{
		if (_.isUndefined(response))
		{
			mydigitalstructure.cloud.retrieve(
			{
				object: 'action',
				data:
				{
					criteria:
					{
						fields:
						[
							{
								name: 'count(id) count'
							}
						],
						filters:
						[
							{
								field: 'status',
								comparison: 'IN_LIST',
								value: '2,4'
							}
						]
					}
				},
				callback: 'app-notifications'
			});
		}
		else
		{
			app.show(
			{
				selector: '#app-notification-actions-count',
				content: _.first(response.data.rows).count
			});
		}
	}
})

app.add(
[
	{
		name: 'app-notification-actions',
		code: function (param, response)
		{
			if (_.isUndefined(response))
			{
				app.vq.init(
				{
					queue: 'app-notification-actions',
					selector: 'app-notification-actions-view'
				});

				mydigitalstructure.cloud.retrieve(
				{
					object: 'action',
					data:
					{
						criteria:
						{
							fields:
							[
								{"name":"subject"},
								{"name":"date"}
							],
							filters:
							[
								{
									field: 'status',
									comparison: 'IN_LIST',
									value: '2,4'
								}
							]
						}
					},
					callback: 'app-notification-actions'
				});
			}
			else
			{
				var rows = app.set(
				{
					scope: 'app-notification-actions',
					context: 'all',
					value: response.data.rows
				});

				if (_.size(rows) == 0)
				{
					app.vq.add('<li><div class="text-muted">No actions</div></li>',
					{
						queue: 'app-notification-actions'
					});
				}
				else
				{
					app.vq.add(	'<li class="">' +
										'<i class="fa fa-clock-o fa-fw"></i> {{subject}}' +
										'<span class="pull-right text-muted small">{{date}}</span></li>',
					{
						queue: 'app-notification-actions',
						type: 'template'
					});

					app.vq.add( [
										'<li>',
											'<div class="card" style="width:380px;">',
												'<div class="card-body">',
													'<ul class="todo-list small-list">'
									],
					{
						queue: 'app-notification-actions'
					});

					_.each(rows, function (row)
					{
						app.vq.add({useTemplate: true, queue: 'app-notification-actions'}, row);
					});

					app.vq.add( [
													'</ul>',
													'<button href="/app/#action-dashboard" class="btn btn-default btn-outline btn-xs myds-navigate mt-3 pull-right">',
														'View Actions</button>',
												'</div>',
												
											'</div>',
										'</li>'
									],
					{
						queue: 'app-notification-actions'
					});
				}

				app.vq.render({selector: '#app-notification-actions-view', queue: 'app-notification-actions'});

				app.show(
				{
					selector: 'app-notification-actions-count',
					content: _.size(rows)
				});
			}
		}
	}
]);

