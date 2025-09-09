/*
	{
    	title: "Org | Dashboard",
    	design: ""
  	}
*/

app.add(
[
	{
		name: 'org-dashboard',
		code: function ()
		{
			app.invoke('org-dashboard-show');
		}
	},
	{
		name: 'org-dashboard-show',
		code: function ()
		{
			if (_.isSet(mydigitalstructure._scope.space.logoattachmentdownload))
			{
				$('#level-up-dashboard-header-view-1').addClass('col-md-9');
				$('#level-up-dashboard-header-view-2').addClass('col-md-3').html(
					'<a href="' + mydigitalstructure._scope.space.website + '" target="_blank">' +
						'<img class="img-fluid w-100 shadow-lg rounded-lg mb-4"' +
							' src="' + mydigitalstructure._scope.space.logoattachmentdownload + '">' +
					'</a>');				
			}
			
			var dashboards =
			[
				{
					name: 'org-dashboard-conversations',
					containerSelector: '#org-dashboard-conversations',
					template: '{{count}}',
					storage:
					{
						object: 'messaging_conversation',
						filters: [
							{
								field: 'status',
								comparison: 'NOT_EQUAL_TO',
								value: 2
							},
							{
								field: 'sharing',
								comparison: 'EQUAL_TO',
								value: 1
							}
						],
						fields:
						[
							{name: 'count(id) count'}
						]
					}
				},
				{
					name: 'org-dashboard-opportunities',
					containerSelector: '#org-dashboard-opportunities',
					template: '{{count}}',
					storage:
					{
						object: 'opportunity',
						filters: [
							{
								field: 'status',
								comparison: 'EQUAL_TO',
								value: 1
							}
						],
						fields:
						[
							{name: 'count(id) count'}
						]
					}
				},
				{
					name: 'org-dashboard-projects',
					containerSelector: '#org-dashboard-projects',
					template: '{{count}}',
					storage:
					{
						object: 'project',
						filters:
						[
							{
								field: 'restrictedtoteam',
								value: 'Y'
							},
							{
								name: '('
							},
							{	
								field: 'subtype',
								comparison: 'NOT_EQUAL_TO',
								value: app.whoami().mySetup.projectSubTypes.learningLevelUp
							},
							{
								name: 'or'
							},
							{	
								field: 'subtype',
								comparison: 'IS_NULL'
							},
							{
								name: ')'
							}
						],
						fields:
						[
							{name: 'count(id) count'}
						]
					}
				},
				{
					name: 'org-dashboard-tasks',
					containerSelector: '#org-dashboard-tasks',
					template: '{{count}}',
					storage:
					{
						object: 'project_task',
						fields:
						[
							{name: 'count(id) count'}
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
	name: 'org-dashboard-tokens-format',
	code: function (param, data)
	{
		data.total = numeral(data.total).format('0');
	}
});
	
app.add(
{
	name: 'org-community-dashboard-updates',
	code: function (param, rows)
	{
		app.vq.init('#org-community-dashboard-updates',
		{
			queue: 'org-community-dashboard-updates',
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
                  '<button class="d-none mb-4 mt-2 btn btn-default btn-outline btn-xs myds-navigate" id="org-dashboard-community-updates-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="org-community-project-summary">View</button>',,
                '</div>',
              '</div>',
            '</div>'
      ];

		app.vq.add(template,
		{
			queue: 'org-community-dashboard-updates',
			type: 'template'
		});

		if (rows.length == 0)
		{
			app.vq.add('<div class="text-muted">No updates.</div>',
			{
				queue: 'org-community-dashboard-updates'
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
					queue: 'org-community-dashboard-updates',
					useTemplate: true
				},
				row);
			});
		}

		app.vq.render('#org-community-dashboard-updates',
		{
			queue: 'org-community-dashboard-updates'
		});
	}
});

app.add(
{
	name: 'org-dashboard-profile-image',
	code: function (param)
	{
		if (_.has(app.whoami().mySetup, 'images.profile'))
		{
			var profileImage = app.vq.init();

			var whoamiProfile = app.get(
			{
				scope: 'org-me',
				context: 'whoami'
			});
		
			if (whoamiProfile._profileimage == '' || whoamiProfile._profileimage == undefined)
			{
				profileImage.add('<div class="text-center py-2"><a href="#org-me" class="text-muted"><i class="fas fa-portrait mr-1"></i> Add a profile image...</a></div>')
			}
			else
			{
				profileImage.add(['<a href="#org-me"><img class="img-fluid w-100 float-left" src="', whoamiProfile._profileimage, '"></a>'])
			}

			profileImage.render('#org-dashboard-profile-image-view');
		}
	}
});

