/*
	{
    	title: "Learner; Skills", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
		todo: "Convert to -achievements"
  	}
*/

app.add(
	{
		name: 'learner-achievements',
		code: function (param, response)
		{		
			app.invoke('learner-skills-dashboard');
		}
	});

app.add(
{
	name: 'learner-skills',
	code: function (param, response)
	{		
		app.invoke('learner-skills-dashboard');
	}
});

app.add(
{
	name: 'learner-skills-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learner-skills-dashboard',
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
				callback: 'learner-skills-dashboard'
			})
		}
		else
		{
			var skillsView = app.vq.init({queue: 'learner-skills-dashboard'});

			if (response.data.rows.length == 0)
			{
				skillsView.add(
				[
					'<div class="text-muted text-center">',
						'You do not have any registered skills that match this search.',
					'</div>'
				]);
			}
			else 
			{
				skillsView.template(
				[
					'<div class="col-sm-6 mb-3 mt-1">',
						'<div class="card">',
							'<div class="card-body py-3">',
								'<div class="row mr-0">',
									'<div class="col-11">',
										'<h3 class="mt-1 mb-2">{{attributetext}}</h3>',
										'<div class="mb-2">{{notes}}</div>',
										'<div class="text-muted">{{attribute.createduser.contactpersontext}}, {{createddate}}</div>',
									'</div>',
									'<div class="col-1 text-right pr-0 d-none">',
										'<a class="btn btn-link btn-sm text-muted myds-collapse-toggle"',
											' data-toggle="collapse" role="button"',
											' href="#learner-skills-dashboard-collapse-{{id}}"',
										'>',
											'<i class="fa fa-chevron-down text-muted"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="collapse myds-collapse" id="learner-skills-dashboard-collapse-{{guid}}"',
								'data-controller="learner-skills-dashboard-show"',
								'data-skill="{{guid}}">',
								'<div class="card-body pt-1 pb-4 px-4" id="learner-skills-dashboard-view-{{guid}}">',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);

				skillsView.add(
				[
					'<div class="container-fluid px-0">',
						'<div class="row">'
				]);

				_.each(response.data.rows, function (row)
				{
					row.createddate = app.invoke('util-date', {date: row.createddate, format: 'DD MMM YYYY'});
					skillsView.add({useTemplate: true}, row)
				});

				skillsView.add('</div></div>');
			}

			skillsView.render('#learner-skills-view');
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
			dataController: 'learner-skills',
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

