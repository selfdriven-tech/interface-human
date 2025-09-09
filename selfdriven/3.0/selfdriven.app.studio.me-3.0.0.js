/*
	{
    	title: "Studio; Me", 	
    	design: "https://selfdriven.foundation/apps"
  	}
*/

app.add(
{
	name: 'studio-me',
	code: function (param, response)
	{
		app.invoke('util-identity-webauthn-passkey');

		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		if (response == undefined)
		{
			app.view.clear('#studio-me');

			var whoami = app.get(
			{
				scope: 'studio-me',
				context: 'whoami'
			});

			if (whoami != undefined)
			{
				app.invoke('studio-me-dashboard-projects');
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
					callback: 'studio-me'
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
				scope: 'studio-me',
				context: 'whoami',
				value: whoami
			});

			//Count of projects by type
			app.invoke('studio-me-dashboard-projects');
		}
	}
});

app.add(
{
	name: 'studio-me-dashboard-projects',
	code: function (param, response)
	{
		var whoami = app.get(
		{
			scope: 'studio-me',
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
				callback: 'studio-me-dashboard-projects'
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
				scope: 'studio-me',
				context: 'whoami',
				value: whoami
			});

			app.invoke('studio-me-teams');
		}
	}
});

app.add(
{
	name: 'studio-me-summary',
	code: function (param, response)
	{	
		var whoamiUser = app.whoami().thisInstanceOfMe.user;

		var whoami = app.get(
		{
			scope: 'studio-me',
			context: 'whoami'
		});

		whoami.logonname = app.whoami().thisInstanceOfMe.user.userlogonname;
		whoami.lastlogon = app.whoami().thisInstanceOfMe.user.lastlogon;
		whoami['util-whoami-version'] = app.whoami().buildingMe.about.version;

		app.view.refresh(
		{
			scope: 'studio-me-summary',
			selector: '#studio-me',
			data: whoami
		});

		var attributesCategory = app.get(
		{
			scope: 'studio-me-summary-attributes',
			context: 'category',
			valueDefault: 'general',
			set: true
		});

		app.invoke('util-view-button-set-active', {selector: '#studio-me-attributes-' + attributesCategory});

		app.invoke('studio-me-identifiers');
		
		app.invoke('studio-me-summary-learning-partners');
		app.invoke('studio-me-summary-attributes');
		app.invoke('studio-me-summary-skills');
		app.invoke('studio-me-summary-endorsements');
		
		app.invoke('studio-me-summary-tokens');
	}	
});

app.add(
{
	name: 'studio-me-identifiers',
	code: function (param, response)
	{	
		var whoami = app.get(
		{
			scope: 'studio-me',
			context: 'whoami'
		});

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'core_url_link',
				fields: 
				[
					'urltext',
					'urlreference'
				],
				filters:
				[
					{
						field: 'object',
						value: app.whoami().mySetup.objects.contactPerson
					},
					{	
						field: 'objectcontext',
						comparison: 'EQUAL_TO',
						value: whoami.id
					}
				],
				callback: 'studio-me-identifiers',
				set:
				{
					scope: 'studio-me',
					context: 'identifiers'
				}
			});
		}
		else
		{
			var identifiers = response.data.rows;

			if (identifiers.length != 0)
			{
				var identifiersView = app.vq.init({queue: 'studio-me-summary-identifiers'});

				identifiersView.template(
				[
					'<h4>{{urltext}}</h4>',
	            	'<div class="text-muted mb-3">{{urlreference}}</div>',
				]);

				identifiersView.add('<div class="card mt-3"><div class="card-body text-center pb-2">');

				_.each(identifiers, function (identifier)
				{
					identifiersView.add({useTemplate: true}, identifier)
				});

				identifiersView.add('</div></div>');

				identifiersView.render('#studio-me-summary-identifiers-view');
			}
		}
	}
});
	
app.add(
{
	name: 'studio-me-teams',
	code: function (param, response)
	{	
		var whoami = app.get(
		{
			scope: 'studio-me',
			context: 'whoami'
		});

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'project_team',
				fields: 
				[
					'projectteam.project.title',
					'role'
				],
				filters:
				[
					{
						field: 'projectteam.contactperson.guid',
						value: whoami.guid
					}
				],
				callback: 'studio-me-teams',
				set:
				{
					scope: 'studio-me',
					context: 'teams'
				}
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

			app.invoke('studio-me-tasks');
		}
	}
});

app.add(
{
	name: 'studio-me-tasks',
	code: function (param, response)
	{	
		var whoami = app.get(
		{
			scope: 'studio-me',
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
				app.invoke('studio-me-summary');
			}
			else
			{
				mydigitalstructure.cloud.search(
				{
					object: 'project_task',
					fields: 
					[
						'description',
						'enddate',
						'guid'
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
					callback: 'studio-me-tasks',
					set:
					{
						scope: 'studio-me',
						context: 'tasks'
					}
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
					_.join(_.map(response.data.rows, function (row)
							{
								return '<li class="mt-2"><a href="#studio-community-task-summary/' + row['guid'] + '">' + row['description'] + '</a></li>'

							}), '') +
					'</ul>'
			}

			app.invoke('studio-me-summary');
		}
	}
});

app.add(
{
	name: 'studio-me-summary-attributes',
	code: function (param, response)
	{	
		var whoami = app.get(
		{
			scope: 'studio-me',
			context: 'whoami'
		});

		var elements = app.get(
		{
			scope: 'util-setup',
			context: 'structureElements'
		});

		var visualAttributesCategory = app.get(
		{
			scope: 'studio-me-summary',
			context: 'category',
			valueDefault: 'general'
		});

		var category = app.whoami().mySetup.structures.me.categories[visualAttributesCategory];
		elements = _.filter(elements, function (element) {return element.category == category})

		app.vq.init();

		app.vq.add(
		[
			'<div class="mb-3">',
				'<label class="form-check-label mb-0" for="studio-me-edit-attributes-{{meid}}">',
            	'<div class="font-weight-bold">{{title}}</div>',
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

      app.set(
		{
			scope: 'studio-me',
			context: 'elements',
			value: elements
		})

      _.each(elements, function (element)
      {
      	element.value = whoami[element.alias] || 0;
      	element.meid = whoami.id;
      	app.vq.add({useTemplate: true}, element)
      });

      app.vq.render('#studio-me-summary-attributes-view')	
	}
});

app.add(
{
	name: 'studio-me-summary-skills',
	code: function (param, response)
	{	
		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'contact_attribute',
				fields: ['attributetext', 'attribute', 'createddate', 'guid', 'notes'],
				filters:
				[
					{	
						field: 'contactperson',
						comparison: 'EQUAL_TO',
						value: app.whoami().thisInstanceOfMe.user.contactperson
					}
				],
				callback: 'studio-me-summary-skills',
				set:
				{
					scope: 'studio-me',
					context: 'skills'
				}
			})
		}
		else
		{
			var skills = response.data.rows;

			var skillsView = app.vq.init({queue: 'studio-me-summary-skills'});

			if (skills.length == 0)
			{
				skillsView.add(
				[
					'<div class="mb-3 text-muted">',
	            		'No registered achievements at the moment.',
					'</div>'
				]);
			}
			else
			{
				skillsView.template(
				[
					'<li class="mb-2">',
	            	'<div>{{attributetext}}</div>',
					'</li>'
				]);

				skillsView.add('<ul class="pl-4 mb-1">');

				_.each(skills, function (skill)
				{
					skillsView.add({useTemplate: true}, skill)
				});

				skillsView.add('</ul>');
			}

	      	skillsView.render('#studio-me-summary-skills-view');

			var whoamiContractAttributes = app.get(
			{
				scope: 'util-setup',
				context: 'contactAttributes',
				name: 'whoami'
			});
			
			_.each(whoamiContractAttributes, function (whoamiContractAttribute)
			{
				if (whoamiContractAttribute.url == '00010000230000')
				{
					var _whoamiContractAttributeSkill = _.find(skills, function (skill)
					{
						return (skill.attribute == whoamiContractAttribute.id)
					});

					if (_.isSet(_whoamiContractAttributeSkill))
					{
						$('#studio-me-summary-' + whoamiContractAttribute.url + '-view').html(_whoamiContractAttributeSkill.notes)
					}
				}
			});
	   }
	}
});

app.add(
{
	name: 'studio-me-summary-endorsements',
	code: function (param, response)
	{	
		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'action',
				fields: ['createdusertext', 'createddate', 'guid', 'description', 'subject', 'action.createduser.contactpersontext'],
				filters:
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
				],
				callback: 'studio-me-summary-endorsements',
				set:
				{
					scope: 'studio-me',
					context: 'endorsements'
				}
			});
		}
		else
		{
			var endorsements = response.data.rows;

			var endorsementsView = app.vq.init({queue: 'studio-me-summary-endorsements'});

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
	            	'<div>{{description}}</div>',
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

	      endorsementsView.render('#studio-me-summary-endorsements-view')	
	   }
	}
});

app.add(
{
	name: 'studio-me-summary-tokens',
	code: function (param, response)
	{	
		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'action',
				fields:
				[
					{name: 'sum(totaltimehrs) total'}
				],
				filters:
				[
					{
						field: 'type',
						value: app.whoami().mySetup.actionTypes.sdc
					},
					{
						field: 'contactperson',
						value: app.whoami().thisInstanceOfMe.user.contactperson
					}
				],
				callback: 'studio-me-summary-tokens'
			});
		}
		else
		{
			var tokensSummary = response.data.rows;

			var tokensSummaryView = app.vq.init({queue: 'studio-me-summary-tokens'});

			if (tokensSummary.length == 0)
			{
				tokensSummaryView.add(
				[
					'<div class="mt-3 text-muted">',
					'No tokens.',
					'</div>'
				]);
			}
			else
			{
				/*tokensSummaryView.add(
				[
					'<div class="text-center mt-3">',
					'<h1 class="p-0 mb-2" style="font-size:3em;"><a href="#studio-tokens-" id="studio-me-summary-tokens-total-community" style="color:#9ecbed;">',
						numeral(_.first(tokensSummary).total).format('0'),
					'</h1>',
					'<small class="text-muted">Total Community Tokens</small>',
					'</div>'
				]);*/
				tokensSummaryView.add(numeral(_.first(tokensSummary).total).format('0'));
			}

			tokensSummaryView.render('#studio-me-summary-tokens-view')	
		}
	}
});


app.add(
{
	name: 'studio-me-summary-learning-partners',
	code: function (param, response)
	{	
		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'contact_relationship',
				fields:
				[
					'createdusertext', 'createddate', 'guid', 'typetext',
					'startdate', 'enddate', 'status', 'statustext', 'notes',
					'relationship.othercontactperson.firstname',
					'relationship.othercontactperson.surname',
					'relationship.othercontactperson.email'
				],
				filters:
				[
					{	
						field: 'contactperson',
						comparison: 'EQUAL_TO',
						value: app.whoami().thisInstanceOfMe.user.contactperson
					},
					{	
						field: 'type',
						comparison: 'IN_LIST',
						value: app.whoami().mySetup.relationshipTypes.learningPartner
					}
				],
				callback: 'studio-me-summary-learning-partners',
				set:
				{
					scope: 'studio-me',
					context: 'learningPartners'
				}
			})
		}
		else
		{
			var learningPartners = response.data.rows;

			var learningPartnersView = app.vq.init({queue: 'studio-me-summary-learning-partners'});

			if (learningPartners.length == 0)
			{
				learningPartnersView.add(
				[
					'<div class="mb-3 text-muted">',
	            	'No registered learning partners at the moment.',
					'</div>'
				]);
			}
			else
			{
				learningPartnersView.template(
				[
					'<li class="mb-2">',
	            	'<div>{{relationship.othercontactperson.firstname}} {{relationship.othercontactperson.surname}}</div>',
	            	'<div class="text-muted small">{{typetext}}</div>',
	             	'<div class="text-muted small">{{contactInfo}}</div>',
					'</li>'
				]);

				learningPartnersView.add('<ul class="pl-4 mb-1">');

		      _.each(learningPartners, function (learningPartner)
		      {
		      	learningPartner.typetext = learningPartner.typetext.replace('Learning Partner; ', '');
		      	learningPartner.createddate = app.invoke('util-date', {date: learningPartner.createddate, format: 'DD MMM YYYY'});
		      	
		      	learningPartner.contactInfo = '';

		      	if (learningPartner['relationship.othercontactperson.email'] != '')
		      	{
		      		learningPartner['contactInfo'] = 
		      			'<a href="mailto:' + learningPartner['relationship.othercontactperson.email'] + '">' +
		      				learningPartner['relationship.othercontactperson.email'] + '</a>';
		      	}

		      	learningPartnersView.add({useTemplate: true}, learningPartner)
		      });

		      learningPartnersView.add('</ul>');
			}

	      learningPartnersView.render('#studio-me-summary-learning-partners-view')	
	   }
	}
});

app.add(
{
	name: 'studio-me-edit',
	code: function (param, response)
	{	
		var data = app.get(
		{
			scope: 'studio-me',
			context: 'whoami'
		});

		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		data.profileimagetype = utilSetup.attachmentTypes.profileImage;

		app.view.refresh(
		{
			scope: 'studio-me-edit',
			selector: '#studio-me-edit',
			data: data
		});

		var attributesCategory = app.get(
		{
			scope: 'studio-me-summary-attributes',
			context: 'category'
		});

		if (attributesCategory == undefined)
		{
			app.set(
			{
				scope: 'studio-me-edit-attributes',
				context: 'category',
				value: attributesCategory
			});
		}

		var whoamiContractAttributes = app.get(
		{
			scope: 'util-setup',
			context: 'contactAttributes',
			name: 'whoami'
		});

		var skills = app.get(
		{
			scope: 'studio-me',
			context: 'skills'
		});

		_.each(whoamiContractAttributes, function (whoamiContractAttribute)
		{
			var _whoamiContractAttributeSkill = _.find(skills, function (skill)
			{
				return (skill.attribute == whoamiContractAttribute.id)
			});

			if (_.isSet(_whoamiContractAttributeSkill))
			{
				$('#studio-me-edit-attribute-note-' + whoamiContractAttribute.url).val(_whoamiContractAttributeSkill.notes)
			}
		});

		app.invoke('studio-me-edit-attributes');
	}	
});

app.add(
{
	name: 'studio-me-edit-attributes',
	code: function (param, response)
	{	
		var whoami = app.get(
		{
			scope: 'studio-me',
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
			scope: 'studio-me-edit',
			context: 'category',
			valueDefault: 'general'
		});

		var category = app.whoami().mySetup.structures.me.categories[visualAttributesCategory];
		elements = _.filter(elements, function (element) {return element.category == category});

		app.vq.init();

		app.vq.add(
		[
			'<div class="form-group">',
           	'<label class="form-check-label mb-1" for="studio-me-edit-attributes-{{meid}}">',
            	'<div>{{title}}</div>',
             	'<div class="text-muted small">{{caption}}</div>',
           	'</label>',
           	'<input type="range" min="0" max="100" value="{{value}}" step="10" class="form-control-range myds-range"',
           		' data-scope="studio-me-edit-{{meid}}"',
           		' data-context="{{alias}}"',
           		' id="studio-me-edit-attributes-{{id}}-{{meid}}">',
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

      app.vq.render('#studio-me-edit-attributes-view')
	}
});

app.add(
{
	name: 'studio-me-edit-image-upload',
	code: function (param)
	{	
		mydigitalstructure._util.attachment.upload(
		{
		  context: 'myds-util-attachment-upload-image',
		  callback: 'studio-me-edit-image-upload-process'
		});
	}
});

app.add(
{
	name: 'studio-me-edit-image-upload-process',
	code: function (param, response)
	{
		var whoami = app.get(
		{
			scope: 'studio-me',
			context: 'whoami'
		});

		if (response == undefined)
		{
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
					callback: 'studio-me-edit-image-upload-process'
				});
			}
		}
		else
		{
			$('#myds-logon-image').attr('src', whoami._profileimage);
			app.notify('Profile image updated');
			app.invoke('util-view-spinner-remove', {controller: 'studio-me-edit-image-upload'});
		}
	}
});

app.add(
{
	name: 'studio-me-edit-save',
	code: function (param, response)
	{	
		var whoami = app.get(
		{
			scope: 'studio-me',
			context: 'whoami'
		});

		var data = app.get(
		{
			scope: 'studio-me-edit-' + whoami.id,
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
				callback: 'studio-me-edit-save'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.invoke('studio-me-edit-attributes-save');
				app.invoke('studio-me-edit-action-save')
				app.notify('Profile updated.');
				app.invoke('app-navigate-to', {controller: 'studio-me'});
			}
		}
	}
});

app.add(
{
	name: 'studio-me-edit-attributes-save',
	code: function (param, response)
	{	
		// About me = URI: 00010000230000 (Understanding of Self)
		// Greatest Strengths = URI: 00010000250000 (Believe in Self)

		var whoami = app.get(
		{
			scope: 'studio-me',
			context: 'whoami'
		});

		var dataMeAttributes = app.get(
		{
			scope: 'studio-me-edit-attributes-' + whoami.id,
			cleanForCloudStorage: true,
			valueDefault: {}
		});

		var whoamiContractAttributes = app.get(
		{
			scope: 'util-setup',
			context: 'contactAttributes',
			name: 'whoami'
		});

		var skills = app.get(
		{
			scope: 'studio-me',
			context: 'skills'
		});

		_.each(dataMeAttributes, function (attributeValue, attributeURI)
		{
			var _whoamiContractAttribute = _.find(whoamiContractAttributes, function (whoamiContractAttribute)
			{
				return (attributeURI == whoamiContractAttribute.url)
			});

			if (_.isSet(_whoamiContractAttribute))
			{
				var _whoamiContractAttributeSkill = _.find(skills, function (skill)
				{
					return (skill.attribute == _whoamiContractAttribute.id)
				});

				var data = 
				{
					attribute: _whoamiContractAttribute.id,
					contactbusiness: app.whoami().thisInstanceOfMe.user.contactbusiness,
					contactperson: app.whoami().thisInstanceOfMe.user.contactperson,
					notes: attributeValue,
					startdate: moment().format('DD MMM YYYY')
				}

				if (_.isSet(_whoamiContractAttributeSkill))
				{
					data.id = _whoamiContractAttributeSkill.id;
				}

				entityos.cloud.save(
				{
					object: 'contact_attribute',
					data: data
				});
			}
		});
	}
});

app.add(
{
	name: 'studio-me-edit-action-save',
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

		var visualAttributesCategory = app.get(
		{
			scope: 'studio-me-edit',
			context: 'category',
			valueDefault: 'general'
		});

		var category = app.whoami().mySetup.structures.me.categories[visualAttributesCategory];
		elements = _.filter(elements, function (element) {return element.category == category})

		var whoami = app.get(
		{
			scope: 'studio-me',
			context: 'whoami'
		});

		var dataMe = app.get(
		{
			scope: 'studio-me-edit-' + whoami.id,
			cleanForCloudStorage: true,
			valueDefault: {}
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
				description.push(element.title + ' is now ' + dataMe[element.alias] + '%;')
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

//LEARER; ME; EDIT; ON-CHAIN
app.add(
{
	name: 'studio-me-edit-on-chain',
	code: function (param, response)
	{	
		var data = app.get(
		{
			scope: 'studio-me',
			context: 'whoami'
		});

		app.view.refresh(
		{
			scope: 'studio-me-edit-on-chain',
			selector: '#studio-me-edit-on-chain',
			data: data
		});
	}	
});


app.add(
{
	name: 'studio-me-security-setup-2ndfactor',
	code: function (param, response)
	{	
		var user = app.whoami().thisInstanceOfMe.user;

		app.invoke('util-security-totp-init',
		{
			id: user.id,
			user: user,
			selector: '#studio-me-summary-security-2ndfactor-view',
			text: 'Open your TOTP client (eg Google Authenticator, authy) and either enter the key manually or scan the QR code.'
		})
	}	
});

//-- org; ME; HISTORY

app.add(
{
	name: 'studio-me-history',
	code: function (param, response)
	{
		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		if (response == undefined)
		{
			app.view.clear('#studio-me-history-view');
			app.view.clear('#studio-me-history-attributes-view');

			var whoami = app.get(
			{
				scope: 'studio-me',
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
				callback: 'studio-me-history'
			});
		}
		else
		{
			if (response.status == 'OK')
			{
				orgMeHistoryView = app.vq.init({queue: 'studio-me-history'});

				orgMeHistoryView.add(
				[
					'<div class="badge badge-warning">', response.data.rows.length, '</div>'
				]);

				orgMeHistoryView.render('#studio-me-history-dates-count-view');

				app.set(
				{
					scope: 'studio-me-history',
					context: 'attributes',
					value: response.data.rows
				});

				if (response.data.rows.length != 0)
				{
					app.invoke('studio-me-history-attributes')
				}
			}
		}
	}
});

app.add(
{
	name: 'studio-me-history-attributes',
	code: function (param, response)
	{	
		var whoami = app.get(
		{
			scope: 'studio-me',
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
			scope: 'studio-me-history',
			context: 'attributes'
		});

		orgMeHistoryDatesView = app.vq.init({queue: 'studio-me-history-dates'});

		orgMeHistoryDatesView.add('<ul class="list-group">');

		_.each(attributes, function (attribute)
		{
			orgMeHistoryDatesView.add(
			[
				'<li class="list-group-item">',
					app.invoke('util-date', {date: attribute.createddate, format: 'DD MMM YYYY'}),
				'</li>'
			])
		});

		orgMeHistoryDatesView.add('</ul>');

		orgMeHistoryDatesView.render('#studio-me-history-dates-view');

		var visualAttributesCategory = app.get(
		{
			scope: 'studio-me-history',
			context: 'category',
			valueDefault: 'general'
		});

		var category = app.whoami().mySetup.structures.me.categories[visualAttributesCategory];
		elements = _.filter(elements, function (element) {return element.category == category})

		app.vq.init();

		app.vq.add(
		[
			'<div class="mb-3">',
				'<label class="form-check-label mb-0" for="studio-me-edit-attributes-{{meid}}">',
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
			scope: 'studio-me-history',
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

      app.vq.render('#studio-me-history-attributes-view')	
	}
});

//-- org; ME; VISUAL

app.add(
{
	name: 'studio-me-visual',
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
				scope: 'studio-me-summary-attributes',
				context: 'category',
				valueDefault: 'general'
			});

			app.set(
			{
				scope: 'studio-me-visual',
				context: 'category',
				value: attributesCategory
			});
		
			app.invoke('util-view-button-set-active', {selector: '#studio-me-visual-for-' + attributesCategory});
 
			app.view.clear('#studio-me-visual-view');
			app.view.clear('#studio-me-visual-attributes-view');

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
				callback: 'studio-me-visual',
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
					scope: 'studio-me-visual',
					context: 'attributes',
					value: attributes
				});

				app.set(
				{
					scope: 'studio-me-visual',
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
					scope: 'studio-me-visual',
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
					scope: 'studio-me-visual',
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
					scope: 'studio-me-visual',
					context: 'attributes-as-at-reversed',
					value: attributesAsAtReversed
				});

				orgMeVisualDatesView = app.vq.init({queue: 'studio-visual-dates-count'});

				orgMeVisualDatesView.add(
				[
					'<div class="badge badge-warning">', attributesAsAt.length, '</div>'
				]);

				orgMeVisualDatesView.render('#studio-me-visual-dates-count-view');

				//if (attributes.length != 0)
				//{
					app.invoke('studio-me-visual-refresh')
				//}
			}
		}
	}
});

app.add(
{
	name: 'studio-me-visual-refresh',
	code: function (param, response)
	{	
		var perspective = app.get(
		{
			scope: 'studio-me-visual',
			context: 'perspective',
			valueDefault: 'growth'
		});

		if (perspective == 'growth')
		{
			app.invoke('studio-me-visual-attributes')
		}

		if (perspective == 'balance')
		{
			app.invoke('studio-me-visual-attributes-balance')
		}

		if (perspective == 'balance-growth')
		{
			app.invoke('studio-me-visual-attributes-growth')
		}

		if (perspective == 'balance-radar')
		{
			app.invoke('studio-me-visual-attributes-balance-radar')
		}
	}
});

app.add(
{
	name: 'studio-me-visual-attributes',
	code: function (param, response)
	{	
		app.set(
		{
			scope: 'studio-me-visual',
			context: 'perspective',
			value: 'growth'
		});

		var attributes = app.get(
		{
			scope: 'studio-me-visual',
			context: 'attributes-as-at-reversed'
		});

		app.invoke('util-visual-attributes-chart-show');

		orgMeVisualDatesView = app.vq.init({queue: 'studio-me-visual-dates'});

		orgMeVisualDatesView.add('<ul class="list-group">');

		_.each(attributes, function (attribute)
		{
			orgMeVisualDatesView.add(
			[
				'<li class="list-group-item">',
					'<div class="font-weight-bold">' + app.invoke('util-date', {date: attribute.createddate, format: 'DD MMM YYYY'}) + '</div>',
					(_.isSet(attribute.caption)?'<div class="text-muted">' + attribute.caption + '</div>':''),
				'</li>'
			])
		});

		orgMeVisualDatesView.add('</ul>');

		orgMeVisualDatesView.render('#studio-me-visual-dates-view');
	}
});

app.add(
{
	name: 'studio-me-visual-attributes-balance',
	code: function (param, response)
	{	
		app.set(
		{
			scope: 'studio-me-visual',
			context: 'perspective',
			value: 'balance'
		})

		if (response == undefined)
		{
			var whoami = app.get(
			{
				scope: 'studio-me',
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
				scope: 'studio-me-visual',
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
				callback: 'studio-me-visual-attributes-balance',
				callbackParam: param
			});
		}
		else
		{
			app.set(
			{
				scope: 'studio-me-visual',
				context: 'myAttributes',
				value: _.first(response.data.rows)
			});

			app.invoke('util-visual-attributes-balance-chart-show');
		}
	}
});

app.add(
{
	name: 'studio-me-visual-attributes-growth',
	code: function (param, response)
	{	
		app.set(
		{
			scope: 'studio-me-visual',
			context: 'perspective',
			value: 'balance-growth'
		})

		app.invoke('util-visual-attributes-growth-chart-show');
	}
});

app.add(
{
	name: 'studio-me-visual-attributes-balance-radar',
	code: function (param, response)
	{	
		app.set(
		{
			scope: 'studio-me-visual',
			context: 'perspective',
			value: 'balance-radar'
		})

		app.invoke('util-visual-attributes-balance-radar-chart-show');
	}
});


/*
ns1blankspace.setup.space.export =
{
	roles:
	{
		data: {},

		init: function (oParam, oResponse)
		{
			var iRole = ns1blankspace.util.getParam(oParam, 'role').value

			if (iRole != undefined)
			{
				if (oResponse == undefined)
				{
					var oSearch = new AdvancedSearch();
					oSearch.method = 'SETUP_ROLE_SEARCH';
					oSearch.addField('title,notes,modifieddate,selfsignupavailable');
					oSearch.addFilter('id', 'EQUAL_TO', iRole);
					oSearch.getResults(function(data) {ns1blankspace.setup.space.export.roles.init(oParam, data)});
				}
				else
				{
					if (oResponse.data.rows.length != 0)
					{
						ns1blankspace.setup.space.export.roles.data.role = oResponse.data.rows[0];
						ns1blankspace.setup.space.export.roles.properties(oParam);
					}
				}
			}
		},

		properties: function (oParam, oResponse)
		{
			if (oResponse == undefined)
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = 'SETUP_ROLE_PARAMETER_ACCESS_SEARCH';
				oSearch.addField('accessmethod,accessmethodtext,allowedvalues,disallowedvalues,id,notes,parameter,role,roletext,type');
				oSearch.addFilter('role', 'EQUAL_TO', ns1blankspace.setup.space.export.roles.data.role.id);
				oSearch.rows = 99999;
				oSearch.sort('accessmethodtext', 'asc');
				oSearch.getResults(function(data) {ns1blankspace.setup.space.export.roles.properties(oParam, data)});
			}
			else
			{
				ns1blankspace.setup.space.export.roles.data.properties = oResponse.data.rows;
				ns1blankspace.setup.space.export.roles.process(oParam);
			}
		},

		process: function (oParam, oResponse)
		{
			if (oResponse == undefined)
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = 'SETUP_ROLE_METHOD_ACCESS_SEARCH';
				oSearch.addField('accessmethod,accessmethodtext,canadd,canremove,canupdate,canuse,guidmandatory,allowedparameters,disallowedparameters');
				oSearch.addFilter('role', 'EQUAL_TO', ns1blankspace.setup.space.export.roles.data.role.id);
				oSearch.rows = 99999;
				oSearch.sort('accessmethodtext', 'asc');
				oSearch.getResults(function(data) {ns1blankspace.setup.space.export.roles.process(oParam, data)});
			}
			else
			{
				ns1blankspace.setup.space.export.roles.data.methods = oResponse.data.rows;
				ns1blankspace.setup.space.export.roles.data.file = [];
				var aFile = ns1blankspace.setup.space.export.roles.data.file;

				aFile.push('{');
				aFile.push('\t"template":');
				aFile.push('\t{');
				aFile.push('\t\t"roles":');
				aFile.push('\t\t[');
				aFile.push('\t\t\t{');
				aFile.push('\t\t\t\t"title": "' + ns1blankspace.setup.space.export.roles.data.role.title + '",');

				aFile.push('\t\t\t\t"methods":');
				aFile.push('\t\t\t\t[');

				var aFileMethods = [];

				$.each(ns1blankspace.setup.space.export.roles.data.methods, function (m, method)
				{
					aFileMethods.push('\t\t\t\t\t{"title": "' + method.accessmethodtext + '", "canuse": "' + method.canuse + '",' +
												' "canadd": "' + method.canadd + '",' +
												' "canupdate": "' + method.canupdate + '",' +
												' "canremove": "' + method.canremove + '",' +
												' "guidmandatory": "' + method.guidmandatory + '"' +
												' "allowedproperties": "' + method.allowedparameters + '"' +
												' "disallowedproperties": "' + method.disallowedparameters + '"' +
												'}');
				});

				aFile.push(aFileMethods.join(',\n'));

				aFile.push('\t\t\t\t],');

				aFile.push('\t\t\t\t"properties":');
				aFile.push('\t\t\t\t[');

				var aFileMethods = [];

				$.each(ns1blankspace.setup.space.export.roles.data.properties, function (p, property)
				{
					aFileMethods.push('\t\t\t\t\t{"name": "' + property.parameter + '", ' +
												' "methodtitle": "' + property.accessmethodtext + '", ' +
												' "method": "' + property.accessmethod + '",' +
												' "allowedvalues": "' + property.allowedvalues + '",' +
												' "disallowedvalues": "' + property.disallowedvalues + '",' +
												' "notes": "' + property.notes + '",' +
												' "type": "' + property.type + '"' +
												'}');
				});

				aFile.push(aFileMethods.join(',\n'));

				aFile.push('\t\t\t\t]');

				aFile.push('\t\t\t}');
				aFile.push('\t\t]');
				aFile.push('\t}');
				aFile.push('}');

				ns1blankspace.setup.file.export.saveToFile(
				{
					data: aFile.join('\n'),
					filename: 'setup-role-access-' + _.kebabCase(ns1blankspace.setup.space.export.roles.data.role.title) + '.json'
				});
			}
		}
	}
}

*/