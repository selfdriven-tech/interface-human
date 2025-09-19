/*
	{
    	title: "Learning Partner; Me", 	
    	design: "https://docs.google.com/document/d/1V3UmeYBKmc1D8p0EjsvtINKKJu5J9jjgZ5usgBKtx0s"
  	}
*/

app.add(
{
	name: 'learning-partner-me',
	code: function (param, response)
	{
		app.invoke('util-identity-webauthn-passkey');

		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		if (response == undefined)
		{
			app.view.clear('#learning-partner-me');

			var whoami = app.get(
			{
				scope: 'learning-partner-me',
				context: 'whoami'
			});

			if (whoami != undefined)
			{
				app.invoke('learning-partner-me-dashboard-projects');
			}
			else
			{
				var whoamiUser = app.whoami().thisInstanceOfMe.user;

				var elements = app.get(
				{
					scope: 'util-setup',
					context: 'structureElements'
				});

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
							field: 'id',
							value: whoamiUser.contactperson
						}
					],
					callback: 'learning-partner-me'
				});
			}
		}
		else
		{
			var whoami = {};

			if (response.status == 'OK')
			{
				if (response.data.rows.length != 0)
				{
					whoami = _.first(response.data.rows);
				}
			}

			if (whoami._profileimage == '')
			{
				whoami._profileimage = utilSetup.images.profile;
			}

			app.set(
			{
				scope: 'learning-partner-me',
				context: 'whoami',
				value: whoami
			});

			//Count of projects by type
			app.invoke('learning-partner-me-dashboard-projects');
		}
	}
});

app.add(
{
	name: 'learning-partner-me-dashboard-projects',
	code: function (param, response)
	{
		var whoami = app.get(
		{
			scope: 'learning-partner-me',
			context: 'whoami'
		});

		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		if (response == undefined)
		{	
			mydigitalstructure.cloud.search(
			{
				object: 'project_team',
				fields: ['projectteam.project.type', 'count(id) count'],
				filters:
				[
					{
						field: 'contactperson',
						value: whoami.id
					}
				],
				callback: 'learning-partner-me-dashboard-projects'
			});
		}
		else
		{
			if (response.status == 'OK')
			{
				var _dashboardCount;
				var dashboardCounts = {};
				var dashboardTotal = 0
				var dashboardCount;
				
				projectTypeCounts = response.data.rows;

				_.each(utilSetup.projectTypes, function (typeID, typeText)
				{
					dashboardCount = 0;

					if (projectTypeCounts.length != 0)
					{
						_dashboardCount = _.find(projectTypeCounts, function(projectTypeCount)
						{
							return (projectTypeCount['projectteam.project.type'] == typeID)
						});

						if (_dashboardCount != undefined)
						{
							dashboardCount = numeral(_dashboardCount.count).value();
						}
					}

					dashboardTotal = dashboardTotal + dashboardCount;

					dashboardCounts['dashboard-projects-' + typeText] = dashboardCount;
				});

				dashboardCounts['dashboard-projects-total'] = dashboardTotal;
			}

			whoami = _.assign(whoami, dashboardCounts);

			app.set(
			{
				scope: 'learning-partner-me',
				context: 'whoami',
				value: whoami
			});

			app.invoke('learning-partner-me-teams');
		}
	}
});

app.add(
{
	name: 'learning-partner-me-summary',
	code: function (param, response)
	{	
		var whoami = app.get(
		{
			scope: 'learning-partner-me',
			context: 'whoami'
		});

		whoami.logonname = app.whoami().thisInstanceOfMe.user.userlogonname;
		whoami.lastlogon = app.whoami().thisInstanceOfMe.user.lastlogon;
		whoami['util-whoami-version'] = app.whoami().buildingMe.about.version;

		app.view.refresh(
		{
			scope: 'learning-partner-me-summary',
			selector: '#learning-partner-me',
			data: whoami
		});

		app.invoke('learning-partner-me-summary-attributes')
	}	
});

app.add(
{
	name: 'learning-partner-me-teams',
	code: function (param, response)
	{	
		var whoami = app.get(
		{
			scope: 'learning-partner-me',
			context: 'whoami'
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
						value: whoami.guid
					}
				],
				callback: 'learning-partner-me-teams'
			});
		}
		else
		{
			whoami.teams = 'Not a member of any teams.'
			whoami['dashboard-teams-total'] = response.data.rows.length;
			
			if (response.data.rows.length != 0)
			{
				whoami.teams = 
					'<ul class="pl-4 mb-1">' +
					_.join(_.map(response.data.rows, function (row) { return '<li class="mt-2">' + row['projectteam.project.description'] + '</li>'}), '') +
					'</ul>'
			}

			app.invoke('learning-partner-me-tasks');
		}
	}
});

app.add(
{
	name: 'learning-partner-me-tasks',
	code: function (param, response)
	{	
		var whoami = app.get(
		{
			scope: 'learning-partner-me',
			context: 'whoami'
		});

		whoami['dashboard-tasks-total'] = 0;
		whoami.tasks = 'No tasks.'

		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		if (response == undefined)
		{
			var user = _.find(utilSetup.users, function(user)
			{
				return user['user.contactperson.guid'] == whoami.guid
			});

			if (_.isUndefined(user))
			{
				app.invoke('learning-partner-me-summary');
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
						},
						{
							field: 'status',
							comparison: 'IN_LIST',
							value: '1,2'
						},
					],
					callback: 'learning-partner-me-tasks'
				});
			}
		}
		else
		{
			whoami['dashboard-tasks-total'] = response.data.rows.length;
			
			if (response.data.rows.length != 0)
			{
				whoami.tasks = 
					'<ul class="pl-4 mb-1">' +
					_.join(_.map(response.data.rows, function (row) { return '<li class="mt-2">' + row['description'] + '</li>'}), '') +
					'</ul>'
			}

			app.invoke('learning-partner-me-summary');
		}
	}
});

app.add(
{
	name: 'learning-partner-me-summary-attributes',
	code: function (param, response)
	{	
		var whoami = app.get(
		{
			scope: 'learning-partner-me',
			context: 'whoami'
		});

		var elements = app.get(
		{
			scope: 'util-setup',
			context: 'structureElements'
		});

		var visualAttributesCategory = app.get(
		{
			scope: 'learning-partner-me-summary',
			context: 'category',
			valueDefault: 'general'
		});

		var category = app.whoami().mySetup.structures.me.categories[visualAttributesCategory];
		elements = _.filter(elements, function (element) {return element.category == category})

		app.vq.init();

		app.vq.add(
		[
			'<div class="mb-3">',
				'<label class="form-check-label mb-0" for="learning-partner-me-edit-attributes-{{meid}}">',
            	'<div>{{title}}</div>',
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
      	element.value = whoami[element.alias] || 0;
      	element.meid = whoami.id;
      	app.vq.add({useTemplate: true}, element)
      });

      app.vq.render('#learning-partner-me-summary-attributes-view')	
	}
});

app.add(
{
	name: 'learning-partner-me-edit',
	code: function (param, response)
	{	
		var data = app.get(
		{
			scope: 'learning-partner-me',
			context: 'whoami'
		});

		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		data.profileimagetype = utilSetup.attachmentTypes.profileImage;

		app.view.refresh(
		{
			scope: 'learning-partner-me-edit',
			selector: '#learning-partner-me-edit',
			data: data
		});

		app.invoke('learning-partner-me-edit-attributes');
	}	
});

 app.add(
{
	name: 'learning-partner-me-edit-attributes',
	code: function (param, response)
	{	
		var whoami = app.get(
		{
			scope: 'learning-partner-me',
			context: 'whoami'
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

		var visualAttributesCategory = app.get(
		{
			scope: 'learning-partner-me-edit',
			context: 'category',
			valueDefault: 'general'
		});

		var category = app.whoami().mySetup.structures.me.categories[visualAttributesCategory];
		elements = _.filter(elements, function (element) {return element.category == category});

		app.vq.init();

		app.vq.add(
		[
			'<div class="form-group">',
           	'<label class="form-check-label mb-1" for="learning-partner-me-edit-attributes-{{meid}}">',
            	'<div>{{title}}</div>',
             	'<div class="text-muted small">{{caption}}</div>',
           	'</label>',
           	'<input type="range" min="0" max="100" value="{{value}}" step="10" class="form-control-range myds-range"',
           		' data-scope="learning-partner-me-edit-{{meid}}"',
           		' data-context="{{alias}}"',
           		' id="learning-partner-me-edit-attributes-{{id}}-{{meid}}">',
         '</div>'
		],
      {
      	type: 'template'
      });

      _.each(elements, function (element)
      {
      	element.value = whoami[element.alias] || 0;
      	element.meid = whoami.id;
      	app.vq.add({useTemplate: true}, element)
      });

      app.vq.render('#learning-partner-me-edit-attributes-view')
	}
});

app.add(
{
	name: 'learning-partner-me-edit-image-upload',
	code: function (param)
	{	
		mydigitalstructure._util.attachment.upload(
		{
		  context: 'myds-util-attachment-upload-image',
		  callback: 'learning-partner-me-edit-image-upload-process'
		});
	}
});

app.add(
{
	name: 'learning-partner-me-edit-image-upload-process',
	code: function (param, response)
	{
		if (response == undefined)
		{
			var whoami = app.get(
			{
				scope: 'learning-partner-me',
				context: 'whoami'
			});

			if (param.attachments.length != 0)
			{
				whoami._profileimage = '/download/' + _.first(param.attachments)['attachmentlink'];

				mydigitalstructure.cloud.save(
				{
					object: 'contact_person',
					data:
					{
						id: whoami.id,
						_profileimage: whoami._profileimage
					},
					callback: 'learning-partner-me-edit-image-upload-process'
				});
			}
		}
		else
		{
			app.notify('Profile image updated');
			app.invoke('util-view-spinner-remove', {controller: 'learning-partner-me-edit-image-upload'});
		}
	}
});

app.add(
{
	name: 'learning-partner-me-edit-save',
	code: function (param, response)
	{	
		var whoami = app.get(
		{
			scope: 'learning-partner-me',
			context: 'whoami'
		});

		var data = app.get(
		{
			scope: 'learning-partner-me-edit-' + whoami.id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: whoami.id,
				values: {}
			}
		});

		if (_.isUndefined(response))
		{
			mydigitalstructure.update(
			{
				object: 'contact_person',
				data: data,
				callback: 'learning-partner-me-edit-save'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.invoke('learning-partner-me-edit-action-save')
				app.notify('Profile updated.');
				app.invoke('app-navigate-to', {controller: 'learning-partner-me'});
			}
		}
	}
});

app.add(
{
	name: 'learning-partner-me-edit-action-save',
	code: function (param, response)
	{	

		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		var elements = app.get(
		{
			scope: 'util-setup',
			context: 'structureElements'
		});

		var category = utilSetup.structures.me.categories.leadership;
		elements = _.filter(elements, function (element) {return element.category == category})

		var whoami = app.get(
		{
			scope: 'learning-partner-me',
			context: 'whoami'
		});

		var dataMe = app.get(
		{
			scope: 'learning-partner-me-edit-' + whoami.id,
			cleanForCloudStorage: true,
		});

		var data =
		{
			object: 32,
			objectcontext: whoami.id,
			actionreference: 'Profile Attributes Update',
			actiontype: utilSetup.actionTypes.profileAttributesUpdate,
			contactperson: whoami.id,
			completed: moment().format('D MMM YYYY'),
			status: 1
		};

		var description = [];

		_.each(elements, function (element)
		{	
			data[element.alias] = whoami[element.alias];
			if (dataMe[element.alias] != undefined)
			{
				data[element.alias] = dataMe[element.alias];
				description.push(element.caption + ' is now ' + dataMe[element.alias] + '%;')
			}
		});

		data.description = description.join(' ');

		mydigitalstructure.update(
		{
			object: 'action',
			data: data
		});
	}
});

app.add(
{
	name: 'learning-partner-profile',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'learning-partner-profile',
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
					callback: 'learning-partner-profile'
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
						scope: 'learning-partner-profile',
						context: 'profile',
						value: data
					})

					app.invoke('learning-partner-profile-teams');
				}

			}
		}
	}	
});

app.add(
{
	name: 'learning-partner-profile-teams',
	code: function (param, response)
	{	
		var data = app.get(
		{
			scope: 'learning-partner-profile'
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
				callback: 'learning-partner-profile-teams'
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

			app.invoke('learning-partner-profile-tasks');
		}
	}
});

app.add(
{
	name: 'learning-partner-profile-tasks',
	code: function (param, response)
	{	
		var data = app.get(
		{
			scope: 'learning-partner-profile'
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
				app.invoke('learning-partner-profile-show');
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
					callback: 'learning-partner-profile-tasks'
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

			app.invoke('learning-partner-profile-show');
		}
	}
});

app.add(
{
	name: 'learning-partner-profile-attributes',
	code: function (param, response)
	{	
		var profile = app.get(
		{
			scope: 'learning-partner-profile',
			context: 'profile'
		});

		var elements = app.get(
		{
			scope: 'util-setup',
			context: 'structureElements'
		});

		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		var category = utilSetup.structures.me.categories.leadership;
		elements = _.filter(elements, function (element) {return element.category == category})

		app.vq.init();

		app.vq.add(
		[
			'<div class="mb-3">',
				'<label class="form-check-label mb-0" for="learning-partner-profile-attributes-{{profileid}}">',
            	'<div>{{title}}</div>',
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

      app.vq.render('#learning-partner-profile-attributes-view')	
	}
});

app.add(
{
	name: 'learning-partner-profile-show',
	code: function (param, response)
	{	
		var data = app.get(
		{
			scope: 'learning-partner-profile'
		});

		app.view.refresh(
		{
			scope: 'learning-partner-profile',
			selector: '#learning-partner-profile',
			data: data.profile
		});

		app.invoke('learning-partner-profile-attributes');
	}
});

//-- LEARNING PARTNER; ME; HISTORY

app.add(
{
	name: 'learning-partner-me-history',
	code: function (param, response)
	{
		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		if (response == undefined)
		{
			app.view.clear('#learning-partner-me-history-view');
			app.view.clear('#learning-partner-me-history-attributes-view');

			var whoami = app.get(
			{
				scope: 'learner-me',
				context: 'whoami'
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
					},
					{
						field: 'type',
						value: app.whoami().mySetup.actionTypes.profileAttributesUpdate
					},
				],
				callback: 'learning-partner-me-history'
			});
		}
		else
		{
			var whoami = {};

			if (response.status == 'OK')
			{
				learnerMeHistoryView = app.vq.init({queue: 'learning-partner-me-history'});

				learnerMeHistoryView.add(
				[
					'<div class="badge badge-warning">', response.data.rows.length, '</div>'
				]);

				learnerMeHistoryView.render('#learning-partner-me-history-dates-count-view');

				app.set(
				{
					scope: 'learning-partner-me-history',
					context: 'attributes',
					value: response.data.rows
				});

				if (response.data.rows.length != 0)
				{
					app.invoke('learning-partner-me-history-attributes')
				}
			}
		}
	}
});

app.add(
{
	name: 'learning-partner-me-history-attributes',
	code: function (param, response)
	{	
		var whoami = app.get(
		{
			scope: 'learner-me',
			context: 'whoami'
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
			scope: 'learning-partner-me-history',
			context: 'attributes'
		});

		learnerMeHistoryDatesView = app.vq.init({queue: 'learning-partner-me-history-dates'});

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

		learnerMeHistoryDatesView.render('#learning-partner-me-history-dates-view');

		var visualAttributesCategory = app.get(
		{
			scope: 'learning-partner-me-history',
			context: 'category',
			valueDefault: 'general'
		});

		var category = app.whoami().mySetup.structures.me.categories[visualAttributesCategory];
		elements = _.filter(elements, function (element) {return element.category == category})

		app.vq.init();

		app.vq.add(
		[
			'<div class="mb-3">',
				'<label class="form-check-label mb-0" for="learning-partner-me-edit-attributes-{{meid}}">',
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
			scope: 'learning-partner-me-history',
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

      app.vq.render('#learning-partner-me-history-attributes-view')	
	}
});

//-- LEARNING PARTNER; ME; VISUAL

app.add(
{
	name: 'learning-partner-me-visual',
	code: function (param, response)
	{
		var whoamiUser = app.whoami().thisInstanceOfMe.user;

		var elements = app.get(
		{
			scope: 'util-setup',
			context: 'structureElements'
		});

		if (response == undefined)
		{
			var attributesCategory = app.get(
			{
				scope: 'learning-partner-me-summary-attributes',
				context: 'category',
				valueDefault: 'general'
			});

			app.set(
			{
				scope: 'learning-partner-me-visual',
				context: 'category',
				value: attributesCategory
			});
		
			app.invoke('util-view-button-set-active', {selector: '#learning-partner-me-visual-for-' + attributesCategory});
	
			app.view.clear('#learning-partner-me-visual-view');
			app.view.clear('#learning-partner-me-visual-attributes-view');

			var fields = ['id', 'createddate', 'guid']

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
					},
					{
						field: 'type',
						value: app.whoami().mySetup.actionTypes.profileAttributesUpdate
					},
				],
				rows: 9999,
				sorts:
				[
					{
						field: 'id',
						direction: 'desc'
					}
				],
				callback: 'learning-partner-me-visual',
				callbackParam: param
			});
		}
		else
		{
			var whoami = {};

			if (response.status == 'OK')
			{
				var attributes = [];
				var attributesReversed = [];

				_.each(response.data.rows, function (row)
				{
					attributes.push(row)
				});

				_.each(_.reverse(response.data.rows), function (row)
				{
					attributesReversed.push(row)
				});

				app.set(
				{
					scope: 'learning-partner-me-visual',
					context: 'attributes',
					value: attributes
				});

				app.set(
				{
					scope: 'learning-partner-me-visual',
					context: 'attributes-reversed',
					value: attributesReversed
				});

				//Reduce the attributes

				var _attributesAsAt = [];

				_attributesAsAt.push(
				{
					_date: moment(), 
					date: moment().format('DD MMM YYYY'),
					caption: 'Now',
					attributes: []
				})

				_attributesAsAt.push(
				{
					_date: moment().add(-6, 'months'), 
					date: moment().add(-6, 'months').format('DD MMM YYYY'),
					caption: '6 months ago',
					attributes: {}
				})
				
				_.each(_attributesAsAt, function (_attributeAsAt)
				{
					_.each(elements, function (element)
					{
						_attributeAsAt.attributes[element.alias] = 0;

						_.each(attributesReversed, function (attribute)
						{
							if (moment(attribute.createddate, app.options.dateFormats).isSameOrBefore(_attributeAsAt._date)
									&& attribute[element.alias] != '')
							{
								_attributeAsAt.attributes[element.alias] = numeral(attribute[element.alias]).value();
								_attributeAsAt.guid = attribute.guid;
							}
						})
					});
				});

				app.set(
				{
					scope: 'learning-partner-me-visual',
					context: '_attributes-as-at',
					value: _attributesAsAt
				});

				var attributesAsAt = [];

				_.each(_attributesAsAt, function (_attributeAsAt)
				{
					_attributeAsAt._seriesData = {guid: _attributeAsAt.guid, createddate: _attributeAsAt.date, caption: _attributeAsAt.caption}

					_.each(elements, function (element)
					{
						_attributeAsAt._seriesData[element.alias] = _attributeAsAt.attributes[element.alias];
					});

					attributesAsAt.push(_attributeAsAt._seriesData)
				});

				app.set(
				{
					scope: 'learning-partner-me-visual',
					context: 'attributes-as-at',
					value: attributesAsAt
				});

				var attributesAsAtReversed = [];

				_.each(_.reverse(_.clone(attributesAsAt)), function (row)
				{
					attributesAsAtReversed.push(_.clone(row));
				});

				app.set(
				{
					scope: 'learning-partner-me-visual',
					context: 'attributes-as-at-reversed',
					value: attributesAsAtReversed
				});

				learnerMeVisualDatesView = app.vq.init({queue: 'learner-visual-dates-count'});

				learnerMeVisualDatesView.add(
				[
					'<div class="badge badge-warning">', attributesAsAt.length, '</div>'
				]);

				learnerMeVisualDatesView.render('#learning-partner-me-visual-dates-count-view');

				//if (attributes.length != 0)
				//{
					app.invoke('learning-partner-me-visual-refresh')
				//}
			}
		}
	}
});

app.add(
{
	name: 'learning-partner-me-visual-refresh',
	code: function (param, response)
	{	
		var perspective = app.get(
		{
			scope: 'learning-partner-me-visual',
			context: 'perspective',
			valueDefault: 'growth'
		});

		if (perspective == 'growth')
		{
			app.invoke('learning-partner-me-visual-attributes')
		}

		if (perspective == 'balance')
		{
			app.invoke('learning-partner-me-visual-attributes-balance')
		}

		if (perspective == 'balance-growth')
		{
			app.invoke('learning-partner-me-visual-attributes-growth')
		}

		if (perspective == 'balance-radar')
		{
			app.invoke('learning-partner-me-visual-attributes-balance-radar')
		}
	}
});

app.add(
{
	name: 'learning-partner-me-visual-attributes',
	code: function (param, response)
	{	
		app.set(
		{
			scope: 'learning-partner-me-visual',
			context: 'perspective',
			value: 'growth'
		});

		var attributes = app.get(
		{
			scope: 'learning-partner-me-visual',
			context: 'attributes-as-at-reversed'
		});

		app.invoke('util-visual-attributes-chart-show', {context: 'learning-partner-me'});

		learnerMeVisualDatesView = app.vq.init({queue: 'learning-partner-me-visual-dates'});

		learnerMeVisualDatesView.add('<ul class="list-group">');

		_.each(attributes, function (attribute)
		{
			learnerMeVisualDatesView.add(
			[
				'<li class="list-group-item">',
					'<div class="font-weight-bold">' + app.invoke('util-date', {date: attribute.createddate, format: 'DD MMM YYYY'}) + '</div>',
					(_.isSet(attribute.caption)?'<div class="text-muted">' + attribute.caption + '</div>':''),
				'</li>'
			])
		});

		learnerMeVisualDatesView.add('</ul>');

		learnerMeVisualDatesView.render('#learning-partner-me-visual-dates-view');
	}
});

app.add(
{
	name: 'learning-partner-me-visual-attributes-balance',
	code: function (param, response)
	{	
		app.set(
		{
			scope: 'learning-partner-me-visual',
			context: 'perspective',
			value: 'balance'
		})

		if (response == undefined)
		{
			var whoami = app.get(
			{
				scope: 'learner-me',
				context: 'whoami'
			});

			var whoamiUser = app.whoami().thisInstanceOfMe.user;

			var elements = app.get(
			{
				scope: 'util-setup',
				context: 'structureElements'
			});

			var visualAttributesCategory = app.get(
			{
				scope: 'learning-partner-me-visual',
				context: 'category',
				valueDefault: 'general'
			});

			var category = app.whoami().mySetup.structures.me.categories[visualAttributesCategory];
			elements = _.filter(elements, function (element) {return element.category == category})

			var fields = ['id', 'createddate']

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
						field: 'id',
						value: whoamiUser.contactperson
					}
				],
				rows: 6,
				sorts:
				[
					{
						field: 'id',
						direction: 'asc'
					}
				],
				callback: 'learning-partner-me-visual-attributes-balance',
				callbackParam: param
			});
		}
		else
		{
			app.set(
			{
				scope: 'learning-partner-me-visual',
				context: 'myAttributes',
				value: _.first(response.data.rows)
			});

			app.invoke('util-visual-attributes-balance-chart-show', {context: 'learning-partner-me'});
		}
	}
});

app.add(
{
	name: 'learning-partner-me-visual-attributes-growth',
	code: function (param, response)
	{	
		app.set(
		{
			scope: 'learning-partner-me-visual',
			context: 'perspective',
			value: 'balance-growth'
		})

		app.invoke('util-visual-attributes-growth-chart-show', {context: 'learning-partner-me'});
	}
});

app.add(
{
	name: 'learning-partner-me-visual-attributes-balance-radar',
	code: function (param, response)
	{	
		app.set(
		{
			scope: 'learning-partner-me-visual',
			context: 'perspective',
			value: 'balance-radar'
		})

		app.invoke('util-visual-attributes-balance-radar-chart-show', {context: 'learning-partner-me'});
	}
});

app.add(
	{
		name: 'learning-partner-me-security-setup-2ndfactor',
		code: function (param, response)
		{	
			var user = app.whoami().thisInstanceOfMe.user;
	
			app.invoke('util-security-totp-init',
			{
				id: user.id,
				user: user,
				selector: '#learning-partner-me-summary-security-2ndfactor-view',
				text: 'Open your TOTP client (eg Google Authenticator, authy) and either enter the key manually or scan the QR code.'
			})
		}	
	});