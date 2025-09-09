/*
	{
    	title: "Level Up; Skills"
  	}
*/

app.add(
{
	name: 'level-up-skills',
	code: function (param, response)
	{		
		app.invoke('level-up-my-skills-dashboard');
	}
});

app.add(
{
	name: 'level-up-my-skills-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'level-up-my-skills-dashboard',
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
						field: 'attributetext',
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

			filters.push(
			{
				field: 'contactperson',
				value: app.whoami().thisInstanceOfMe.user.contactperson
			});

			mydigitalstructure.cloud.search(
			{
				object: 'contact_attribute',
				fields:
				[
					'attributetext',
					'attribute',
					'notes',
					'guid',
					'createddate',
					'createdusertext',
					'attribute.createduser.contactperson.guid',
					'attribute.createduser.contactpersontext'
				],
				filters: filters,
				sorts:
				[
					{
						field: 'attributetext',
						direction: 'asc'
					}
				],
				callback: 'level-up-my-skills-dashboard'
			})
		}
		else
		{
			var skillsView = app.vq.init({queue: 'level-up-my-skills-dashboard'});

			if (response.data.rows.length == 0)
			{
				skillsView.add(
				[
					'<div class="text-muted text-center p-4">',
						'You do not have any registered skills that match this search.',
					'</div>'
				]);
			}
			else 
			{
				skillsView.template(
				[
					'<div class="col-sm-6 mb-3 mt-1">',
						'<div class="card shadow-lg">',
							'<div class="card-body py-3">',
								'<div class="row mr-0">',
									'<div class="col-11">',
										'<h3 class="mt-1 mb-2">{{attributetext}}</h3>',
										'<div class="mb-2">{{notes}}</div>',
										'<div class="text-secondary">Issued By {{attribute.createduser.contactpersontext}}, {{createddate}}</div>',
									'</div>',
									'<div class="col-1 text-right pr-0 d-none">',
										'<a class="btn btn-link btn-sm text-muted myds-collapse-toggle"',
											' data-toggle="collapse" role="button"',
											' href="#level-up-my-skills-dashboard-collapse-{{id}}"',
										'>',
											'<i class="fa fa-chevron-down text-muted"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="collapse myds-collapse" id="level-up-my-skills-dashboard-collapse-{{guid}}"',
								'data-controller="level-up-my-skills-dashboard-show"',
								'data-skill="{{guid}}">',
								'<div class="card-body pt-1 pb-4 px-4" id="level-up-my-skills-dashboard-view-{{guid}}">',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);

				skillsView.add(
				[
					'<div class="x-container-fluid px-0">',
						'<div class="row">'
				]);

				_.each(response.data.rows, function (row)
				{
					row.createddate = app.invoke('util-date', {date: row.createddate, format: 'DD MMM YYYY'});
					skillsView.add({useTemplate: true}, row)
				});

				skillsView.add('</div></div>');
			}

			skillsView.render('#level-up-my-skills-dashboard-view');
		}
	}
});

app.add(
{
	name: 'learner-skill-summary',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learner-skill-summary',
			context: 'id',
			valueDefault: ''
		});

		var data = app.find(
		{
			dataController: 'level-up-skills',
			dataContext: 'all',
			controller: 'learner-skill-summary',
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
			scope: 'learner-community-skill-summary',
			selector: '#learner-community-skill-summary',
			data: data
		});
	}	
});


app.add(
{
	name: 'level-up-my-skills-add',
	notes: 'Has the project being initiated?',
	code: function (param, response)
	{		
		app.invoke('level-up-my-skills-dashboard');
	}
});
