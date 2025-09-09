/*
	{
    	title: "Studio; Dashboard",
    	design: ""
  	}
*/

app.add(
[
	{
		name: 'studio-dashboard',
		code: function ()
		{
			app.invoke('studio-dashboard-show');
		}
	},
	{
		name: 'studio-dashboard-show',
		code: function ()
		{
			var dashboards =
			[
				{
					name: 'studio-setup-templates',
					containerSelector: '#studio-dashboard-setup-templates',
					template: '{{count}}',
					storage:
					{
						object: 'project',
						fields:
						[
							{name: 'count(id) count'}
						],
						filters:
						[				
							{
								field: 'template',
								value: 'Y'
							}
						]
					}
				}
			]

			app.invoke('util-dashboard',
			{
				dashboards: dashboards
			});
		}
	}
]);

app.add(
{
	name: 'studio-dashboard-tokens-format',
	code: function (param, data)
	{
		data.total = numeral(data.total).format('0');
	}
});
	
app.add(
{
	name: 'studio-community-dashboard-updates',
	code: function (param, rows)
	{
		app.vq.init('#studio-community-dashboard-updates',
		{
			queue: 'studio-community-dashboard-updates',
			working: true
		});

		var template =
		[
			'<div class="timeline-item">',
              '<div class="row">',
                '<div class="col-5 date">',
                  '<i class="far fa-calendar-alt text-muted"></i>',
                  '<div>{{completed}}</div>',
                  '<div class="text-muted small">{{action.contactperson.firstname}}</div>',
                  '<div class="text-muted small">{{action.contactperson.surname}}</div>',
                '</div>',
                '<div class="col content mb-2">',
                 	'<div class="font-weight-bold mb-1">{{description}}</div>',
                  '<div class="text-muted small mb-1">{{tasktext}}</div>',
                  '<div class="text-muted small">{{projecttext}}</div>',
                  '<button class="d-none mb-4 mt-2 btn btn-default btn-outline btn-xs myds-navigate" id="studio-dashboard-community-updates-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="studio-community-project-summary">View</button>',,
                '</div>',
              '</div>',
            '</div>'
      ];

		app.vq.add(template,
		{
			queue: 'studio-community-dashboard-updates',
			type: 'template'
		});

		if (rows.length == 0)
		{
			app.vq.add('<div class="text-muted">No updates.</div>',
			{
				queue: 'studio-community-dashboard-updates'
			});
		}
		else
		{
			_.each(rows, function (row)
			{
				row.dayssince = moment(row.completed, app.options.dateFormats).fromNow();
				row._actionreference = _.split(row.actionreference, '|');
				row.projecttext = '';
				row.tasktext = '';

				if (row._actionreference.length > 1)
				{
					row.projecttext = row._actionreference[1];
				}

				if (row._actionreference.length > 2)
				{
					row.tasktext = _.truncate(row._actionreference[2], {length: 70, separate: ' '});
				}

				app.vq.add(
				{
					queue: 'studio-community-dashboard-updates',
					useTemplate: true
				},
				row);
			});
		}

		app.vq.render('#studio-community-dashboard-updates',
		{
			queue: 'studio-community-dashboard-updates'
		});
	}
});

app.add(
{
	name: 'studio-dashboard-profile-image',
	code: function (param)
	{
		if (_.has(app.whoami().mySetup, 'images.profile'))
		{
			var profileImage = app.vq.init();

			var whoamiProfile = app.get(
			{
				scope: 'studio-me',
				context: 'whoami'
			});
		
			if (whoamiProfile._profileimage == '' || whoamiProfile._profileimage == undefined)
			{
				profileImage.add('<div class="text-center py-2"><a href="#studio-me" class="text-muted"><i class="fas fa-portrait mr-1"></i> Add a profile image...</a></div>')
			}
			else
			{
				profileImage.add(['<a href="#studio-me"><img class="img-fluid w-100 float-left" src="', whoamiProfile._profileimage, '"></a>'])
			}

			profileImage.render('#studio-dashboard-profile-image-view');
		}
	}
});

