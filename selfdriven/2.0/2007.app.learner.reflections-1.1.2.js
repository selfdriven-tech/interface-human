/*
	{
    	title: "Learner; Reflections", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
  	}
*/

app.add(
{
	name: 'learner-reflections',
	code: function (param, response)
	{		
		var reflectionActionTypes = app.get(
		{
			scope: 'util-setup',
			context: '_reflectionActionTypes'
		});

		if (response == undefined && reflectionActionTypes == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'setup_action_type',
				fields: ['title'],
				filters: [{field: 'id', comparison: 'IN_LIST', value: app.whoami().mySetup.actionTypes.reflection}],
				sorts: [{name: 'title', direction: 'asc'}],
				set:
				{
					scope: 'util-setup',
					context: '_reflectionActionTypes'
				},
				callback: 'learner-reflections'
			});
		}
		else
		{
			var typesView = app.vq.init({queue: 'learner-reflections-types'});

			typesView.template(
			[
				'<li>',
					'<a href="#" class="myds-dropdown" data-id="{{id}}">',
					'{{title}}',
					'</a>',
				'</li>'
			]);

			typesView.add(
			[
				'<button type="button" class="btn btn-white dropdown-toggle" data-toggle="dropdown" aria-expanded="false">',
					'<span class="dropdown-text">All</span>',
				'</button>',
				'<ul class="dropdown-menu mt-1"',
					'data-controller="learner-reflections-dashboard"',
					'data-context="type"',
				'>',
				'<li>',
					'<a href="#" class="myds-dropdown" data-id="-1">',
					'All',
					'</a>',
				'</li>'
			]);

			_.each(reflectionActionTypes, function (reflectionActionType)
			{
				reflectionActionType.title = reflectionActionType.title.replace('Reflection; ', '')
				typesView.add({useTemplate: true}, reflectionActionType)
			});

			typesView.add('</ul>');

			typesView.render('#learner-reflections-dashboard-types');

			app.invoke('learner-reflections-dashboard');
		}
	}
});

app.add(
{
	name: 'learner-reflections-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learner-reflections-dashboard',
			valueDefault: {}
		});

		var filters = [];

		if (response == undefined)
		{
			if (!_.isEmpty(data.search))
			{
				filters = _.concat(
				[
					{
						name: '('
					},
					{	
						field: 'subject',
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
					},
					{
						name: ')'
					}
				]);
			}

			if (!_.isUndefined(data.type))
			{
				if (data.type != -1)
				{
					filters = _.concat(filters,
					[
						{	
							field: 'actiontype',
							value: data.type
						}
					]);
				}
			}

			filters.push(
			{	
				field: 'actiontype',
				comparison: 'IN_LIST',
				value: app.whoami().mySetup.actionTypes.reflection
			});

			filters.push(
			{
				field: 'contactperson',
				value: app.whoami().thisInstanceOfMe.user.contactperson
			});

			mydigitalstructure.cloud.search(
			{
				object: 'action',
				fields:
				[
					'subject',
					'text',
					'duedate',
					'actiontypetext',
					'guid',
					'createddate',
					'action.createduser.contactpersontext'
				],
				filters: filters,
				sorts:
				[
					{
						field: 'createddate',
						direction: 'desc'
					}
				],
				callback: 'learner-reflections-dashboard'
			})
		}
		else
		{
			var reflectionsView = app.vq.init({queue: 'learner-reflections-dashboard'});

			if (response.data.rows.length == 0)
			{
				reflectionsView.add(
				[
					'<div class="text-muted text-center">',
						'You do not have any reflections that match this search.',
					'</div>'
				]);
			}
			else 
			{
				reflectionsView.template(
				[
					'<div class="col-sm-6 mb-3 mt-1">',
						'<div class="card">',
							'<div class="card-body py-3">',
								'<div class="row mr-0">',
									'<div class="col-11">',
										'<h3 class="mt-1 mb-2">{{text}}</h3>',
										'<div class="text-muted">{{actiontypetext}}</div>',
										'<div class="text-muted">{{action.createduser.contactpersontext}}, {{createddate}}</div>',
									'</div>',
									'<div class="col-1 text-right d-none">',
										'<a class="btn btn-link btn-sm text-muted myds-collapse-toggle"',
											' data-toggle="collapse" role="button"',
											' href="#learner-reflections-dashboard-collapse-{{id}}"',
										'>',
											'<i class="fa fa-chevron-down text-muted"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="collapse myds-collapse" id="learner-reflections-dashboard-collapse-{{guid}}"',
								'data-controller="learner-reflections-dashboard-show"',
								'data-connection="{{guid}}">',
								'<div class="card-body pt-1 pb-4 px-4" id="learner-reflections-dashboard-view-{{guid}}">',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);

				reflectionsView.add(
				[
					'<div class="container-fluid px-0">',
						'<div class="row">'
				]);

				_.each(response.data.rows, function (row)
				{
					row.createddate = app.invoke('util-date', {date: row.createddate, format: 'DD MMM YYYY'});
					row.actiontypetext = row.actiontypetext.replace('Reflection; ', '');
					reflectionsView.add({useTemplate: true}, row)
				});

				reflectionsView.add('</div></div>');
			}

			reflectionsView.render('#learner-reflections-dashboard-view');
		}
	}
});

app.add(
{
	name: 'learner-reflection-summary',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learner-reflection-summary',
			context: 'id',
			valueDefault: ''
		});

		var data = app.find(
		{
			dataController: 'reflections',
			dataContext: 'all',
			controller: 'learner-reflection-summary',
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
			scope: 'learner--reflection-summary',
			selector: '#learner-reflection-summary',
			data: data
		});
	}	
});

