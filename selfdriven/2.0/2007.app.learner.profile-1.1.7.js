/*
	{
    	title: "Learner; Profile", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
  	}
*/

app.add(
{
	name: 'learner-profile',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'learner-profile',
			context: 'id'
		});

		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		var elements = app.get(
		{
			scope: 'util-setup',
			context: 'structureElements'
		});

		if (guid != undefined)
		{
			if (response == undefined)
			{
				var fields = ['firstname', 'surname', 'email', 'notes', 'guid']

				if (elements != undefined)
				{
					fields = _.concat(fields, _.map(elements, 'alias'))
				}

				mydigitalstructure.cloud.search(
				{
					object: 'contact_person',
					fields: fields,
					filters:
					[
						{
							field: 'guid',
							value: guid
						}
					],
					callback: 'learner-profile'
				});
			}
			else
			{
				if (response.data.rows.length == 0)
				{
					app.notify({message: 'Can not find the profile!', type: 'danger'});
				}
				else
				{
					data = _.first(response.data.rows);
					data._classHasEmail = (data.email==''?'d-none':'');
					data._classHasNotes = (data.notes==''?'d-none':'')

					data._email = '';
					data.emailcaption = '';
					if (data.email != '')
					{
						data._email = _.split(data.email, '@');
						data.emailcaption = ('<div>' + _.first(data._email) + '</div>' +
													'<div>@' + _.last(data._email) + '</div>').toLowerCase();
					}

					if (data._profileimage == '')
					{
						data._profileimage = utilSetup.images.profile;
					}

					app.set(
					{
						scope: 'learner-profile',
						context: 'profile',
						value: data
					})

					app.invoke('learner-profile-teams');
				}

			}
		}
	}	
});

app.add(
{
	name: 'learner-profile-show',
	code: function (param, response)
	{	
		var data = app.get(
		{
			scope: 'learner-profile'
		});

		app.view.refresh(
		{
			scope: 'learner-profile',
			selector: '#learner-profile',
			data: data.profile
		});

		app.invoke('learner-profile-attributes');
		app.invoke('learner-profile-skills');
		app.invoke('learner-profile-endorsements');
	}
});


app.add(
{
	name: 'learner-profile-teams',
	code: function (param, response)
	{	
		var data = app.get(
		{
			scope: 'learner-profile'
		});

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'project_team',
				fields: 
				[
					'projectteam.project.description',
					'role'
				],
				filters:
				[
					{
						field: 'projectteam.contactperson.guid',
						value: data.id
					}
				],
				callback: 'learner-profile-teams'
			});
		}
		else
		{
			data.profile.teams = 'Not a member of any teams.'
			data.profile['dashboard-teams-total'] = response.data.rows.length;
			
			if (response.data.rows.length != 0)
			{
				data.profile.teams = 
					'<ul class="pl-4 mb-1">' +
					_.join(_.map(response.data.rows, function (row) { return '<li class="mt-2">' + row['projectteam.project.description'] + '</li>'}), '') +
					'</ul>'
			}

			app.invoke('learner-profile-tasks');
		}
	}
});

app.add(
{
	name: 'learner-profile-tasks',
	code: function (param, response)
	{	
		var data = app.get(
		{
			scope: 'learner-profile'
		});

		data.profile['dashboard-tasks-total'] = 0;
		data.profile.tasks = 'No tasks.'

		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		if (response == undefined)
		{
			var user = _.find(utilSetup.users, function(user)
			{
				return user['user.contactperson.guid'] == data.id
			});

			if (_.isUndefined(user))
			{
				app.invoke('learner-profile-show');
			}
			else
			{
				mydigitalstructure.cloud.search(
				{
					object: 'project_task',
					fields: 
					[
						'description',
						'enddate'
					],
					filters:
					[
						{
							field: 'taskbyuser',
							value: user.id
						}
					],
					callback: 'learner-profile-tasks'
				});
			}
		}
		else
		{
			
			data.profile['dashboard-tasks-total'] = response.data.rows.length;
			
			if (response.data.rows.length != 0)
			{
				data.profile.tasks = 
					'<ul class="pl-4 mb-1">' +
					_.join(_.map(response.data.rows, function (row) { return '<li class="mt-2">' + row['description'] + '</li>'}), '') +
					'</ul>'
			}

			app.invoke('learner-profile-show');
		}
	}
});

app.add(
{
	name: 'learner-profile-attributes',
	code: function (param, response)
	{	
		var profile = app.get(
		{
			scope: 'learner-profile',
			context: 'profile'
		});

		var elements = app.get(
		{
			scope: 'util-setup',
			context: 'structureElements'
		});

		var visualAttributesCategory = app.get(
		{
			scope: 'learner-profile',
			context: 'category',
			valueDefault: 'general'
		});

		var category = app.whoami().mySetup.structures.me.categories[visualAttributesCategory];

		elements = _.filter(elements, function (element) {return element.category == category})

		app.vq.init();

		app.vq.add(
		[
			'<div class="mb-3">',
				'<label class="form-check-label mb-0" for="learner-profile-attributes-{{profileid}}">',
            	'<div class="font-weight-bold text-muted">{{title}}</div>',
             	'<div class="text-muted small">{{caption}}</div>',
           	'</label>',
				'<div class="progress progress-small">',
	  				'<div class="progress-bar" style="width: {{value}}%;" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="100"></div>',
				'</div>',
			'</div>'
		],
      {
      	type: 'template'
      });

      _.each(elements, function (element)
      {
      	element.value = profile[element.alias] || 0;
      	element.profileid = profile.id;
      	app.vq.add({useTemplate: true}, element)
      });

      app.vq.render('#learner-profile-attributes-view')	
	}
});


app.add(
{
	name: 'learner-profile-skills',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'learner-profile',
			context: 'id'
		});

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'contact_attribute',
				fields: ['attributetext', 'createddate', 'guid', 'notes'],
				filters:
				[
					{	
						field: 'attribute.contactperson.guid',
						comparison: 'EQUAL_TO',
						value: guid
					}
				],
				callback: 'learner-profile-skills'
			});
		}
		else
		{
			var skills = response.data.rows;

			var skillsView = app.vq.init({queue: 'learner-profile-skills'});

			if (skills.length == 0)
			{
				skillsView.add(
				[
					'<div class="mb-3 text-muted">',
	            	'No assigned skills at the moment.',
					'</div>'
				]);
			}
			else
			{
				skillsView.template(
				[
					'<li class="mb-2">',
	            	'<div>{{attributetext}}</div>',
	             	'<div class="text-muted small">{{notes}}</div>',
					'</li>'
				]);

				skillsView.add('<ul class="pl-4 mb-1">');

		      _.each(skills, function (skill)
		      {
		      	skillsView.add({useTemplate: true}, skill)
		      });

				skillsView.add('</ul>');
			}

	      skillsView.render('#learner-profile-skills-view')	
	   }
	}
});

app.add(
{
	name: 'learner-profile-endorsements',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'learner-profile',
			context: 'id'
		});

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'action',
				fields: ['createdusertext', 'createddate', 'guid', 'text', 'action.createduser.contactpersontext'],
				filters:
				[
					{	
						field: 'action.contactperson.guid',
						comparison: 'EQUAL_TO',
						value: guid
					},
					{	
						field: 'actiontype',
						comparison: 'IN_LIST',
						value: app.whoami().mySetup.actionTypes.recognition
					}
				],
				callback: 'learner-profile-endorsements'
			})
		}
		else
		{
			var endorsements = response.data.rows;

			var endorsementsView = app.vq.init({queue: 'learner-profile-endorsements'});

			if (endorsements.length == 0)
			{
				endorsementsView.add(
				[
					'<div class="mb-3 text-muted">',
	            	'No registered endorsements at the moment.',
					'</div>'
				]);
			}
			else
			{
				endorsementsView.template(
				[
					'<li class="mb-2">',
	            	'<div>{{text}}</div>',
	             	'<div class="text-muted small">{{action.createduser.contactpersontext}}, {{createddate}}</div>',
					'</li>'
				]);

				endorsementsView.add('<ul class="pl-4 mb-1">');

		      _.each(endorsements, function (endorsement)
		      {
		      	endorsement.createddate = app.invoke('util-date', {date: endorsement.createddate, format: 'DD MMM YYYY'});
		      	endorsementsView.add({useTemplate: true}, endorsement)
		      });

		      endorsementsView.add('</ul>');
			}

	      endorsementsView.render('#learner-profile-endorsements-view')	
	   }
	}
});

app.add(
{
	name: 'learner-profile-download',
	code: function (param, response)
	{	
		app.invoke('util-pdf-profile');
	}
});


//CHECK CODE

app.add(
{
	name: 'learner-profile-history',
	code: function (param, response)
	{
		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		if (response == undefined)
		{
			app.view.clear('#learner-profile-history-view');
			app.view.clear('#learner-profile-history-attributes-view');

			var profile = app.get(
			{
				scope: 'learner-profile',
				context: 'profile'
			});

			var whoamiUser = app.whoami().thisInstanceOfMe.user;

			var elements = app.get(
			{
				scope: 'util-setup',
				context: 'structureElements'
			});

			var fields = ['id', 'createddate']

			if (elements != undefined)
			{
				fields = _.concat(fields, _.map(elements, 'alias'))
			}

			mydigitalstructure.cloud.search(
			{
				object: 'action',
				fields: fields,
				filters:
				[
					{
						field: 'contactperson',
						value: whoamiUser.contactperson
					}
				],
				callback: 'learner-profile-history'
			});
		}
		else
		{
			var whoami = {};

			if (response.status == 'OK')
			{
				learnerMeHistoryView = app.vq.init({queue: 'learner-me-history'});

				learnerMeHistoryView.add(
				[
					'<div class="badge badge-warning">', response.data.rows.length, '</div>'
				]);

				learnerMeHistoryView.render('#learner-me-history-dates-count-view');

				app.set(
				{
					scope: 'learner-profile-history',
					context: 'attributes',
					value: response.data.rows
				});

				if (response.data.rows.length != 0)
				{
					app.invoke('learner-profile-history-attributes')
				}
			}
		}
	}
});

app.add(
{
	name: 'learner-profile-history-attributes',
	code: function (param, response)
	{	
		var profile = app.get(
		{
			scope: 'learner-profile',
			context: 'profile'
		});

		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		var elements = app.get(
		{
			scope: 'util-setup',
			context: 'structureElements'
		});

		var attributes = app.get(
		{
			scope: 'learner-profile-history',
			context: 'attributes'
		});

		learnerMeHistoryDatesView = app.vq.init({queue: 'learner-profile-history-dates'});

		learnerMeHistoryDatesView.add('<ul class="list-group">');

		_.each(attributes, function (attribute)
		{
			learnerMeHistoryDatesView.add(
			[
				'<li class="list-group-item">',
					app.invoke('util-date', {date: attribute.createddate, format: 'DD MMM YYYY'}),
				'</li>'
			])
		});

		learnerMeHistoryDatesView.add('</ul>');

		learnerMeHistoryDatesView.render('#learner-profile-history-dates-view');

		var category = utilSetup.structures.me.categories.general;
		elements = _.filter(elements, function (element) {return element.category == category})

		app.vq.init();

		app.vq.add(
		[
			'<div class="mb-3">',
				'<label class="form-check-label mb-0" for="learner-profile-edit-attributes-{{meid}}">',
            	'<div class="font-weight-bold text-muted">{{title}}</div>',
             	'<div class="text-muted small">{{caption}}</div>',
           	'</label>',
				'<div>',
					'{{progressbars}}',
				'</div>',
			'</div>'
		],
      {
      	type: 'template'
      });

      app.set(
		{
			scope: 'learner-profile-history',
			context: 'elements',
			value: elements
		})

      _.each(elements, function (element)
      {
      	element.progressbars = '';

      	_.each(attributes, function (attribute)
      	{
      		element.progressbars += 
      			'<div class="progress progress-small">' +
	  					'<div class="progress-bar" style="width: ' + attribute[element.alias] + '%;" role="progressbar" aria-valuenow="' + attribute[element.alias] + '" aria-valuemin="0" aria-valuemax="100"></div>' +
					'</div>'
      	});
      	
      	//element.value = whoami[element.alias] || 0;
      	element.meid = whoami.id;
      	app.vq.add({useTemplate: true}, element)
      });

      app.vq.render('#learner-profile-history-attributes-view')	
	}
});