/*
	{
    	title: "Learner; Endorsements", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
  	}
*/

app.add(
{
	name: 'learner-endorsements',
	code: function (param, response)
	{		
		app.invoke('learner-endorsements-dashboard');
	}
});

app.add(
{
	name: 'learner-endorsements-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learner-endorsements-dashboard',
			valueDefault: {}
		});

		var filters =
		[
			{	
				field: 'contactperson',
				comparison: 'EQUAL_TO',
				value: app.whoami().thisInstanceOfMe.user.contactperson
			},
			{	
				field: 'actiontype',
				comparison: 'IN_LIST',
				value: app.whoami().mySetup.actionTypes.recognition
			}
		];

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
						field: 'text',
						comparison: 'TEXT_IS_LIKE',
						value: data.search
					},
					{
						name: 'or'
					},
					{	
						field: 'action.createduser.contactpersontext',
						comparison: 'TEXT_IS_LIKE',
						value: data.search
					},
					{
						name: ')'
					}
				]);
			}

			mydigitalstructure.cloud.search(
			{
				object: 'action',
				fields: ['createdusertext', 'createddate', 'guid', 'text', 'subject', 'action.createduser.contactpersontext'],
				filters: filters,
				sorts:
				[
					{
						field: 'createddate',
						direction: 'desc'
					}
				],
				callback: 'learner-endorsements-dashboard'
			})
		}
		else
		{
			var endorsementsView = app.vq.init({queue: 'learner-endorsements-dashboard'});

			if (response.data.rows.length == 0)
			{
				endorsementsView.add(
				[
					'<div class="text-muted text-center">',
						'You do not have any registered endorsements that match this search.',
					'</div>'
				]);
			}
			else 
			{
				endorsementsView.template(
				[
					'<div class="col-sm-6 mb-3 mt-1">',
						'<div class="card">',
							'<div class="card-body py-3">',
								'<div class="row mr-0">',
									'<div class="col-11">',
										'<h3 class="mt-1 mb-2">{{subject}}</h3>',
										'<div class="text-muted">{{action.createduser.contactpersontext}}, {{createddate}}</div>',
									'</div>',
									'<div class="col-1 text-right pr-0 d-none">',
										'<a class="btn btn-link btn-sm text-muted myds-collapse-toggle"',
											' data-toggle="collapse" role="button"',
											' href="#learner-endorsements-dashboard-collapse-{{id}}"',
										'>',
											'<i class="fa fa-chevron-down text-muted"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="collapse myds-collapse" id="learner-endorsements-dashboard-collapse-{{guid}}"',
								'data-controller="learner-endorsements-dashboard-show"',
								'data-skill="{{guid}}">',
								'<div class="card-body pt-1 pb-4 px-4" id="learner-endorsements-dashboard-view-{{guid}}">',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);

				endorsementsView.add(
				[
					'<div class="container-fluid px-0">',
						'<div class="row">'
				]);

				_.each(response.data.rows, function (row)
				{
					row.createddate = app.invoke('util-date', {date: row.createddate, format: 'DD MMM YYYY'});
					endorsementsView.add({useTemplate: true}, row)
				});

				endorsementsView.add('</div></div>');
			}

			endorsementsView.render('#learner-endorsements-view');
		}
	}
});

app.add(
{
	name: 'learner-endorsement-summary',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learner-endorsement-summary',
			context: 'id',
			valueDefault: ''
		});

		var data = app.find(
		{
			dataController: 'learner-endorsements',
			dataContext: 'all',
			controller: 'learner-endorsement-summary',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				notes: ''
			}
		}

		app.view.refresh(
		{
			scope: 'learner-endorsement-summary',
			selector: '#learner-endorsement-summary',
			data: data
		});
	}	
});

