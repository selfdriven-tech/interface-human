/*
	{
    	title: "Learner; Next Steps", 	
    	design: "https://slfdrvn.io/next-steps"
  	}
*/

app.add(
{
	name: 'next-steps-next',
	code: function (param, response)
	{
		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		if (response == undefined)
		{
			app.view.clear('#next-steps-next');

			var whoami = app.get(
			{
				scope: 'next-steps-next',
				context: 'whoami'
			});
			
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
				callback: 'next-steps-next'
			});
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
				scope: 'next-steps-next',
				context: 'whoami',
				value: whoami
			});

			//Count of projects by type
			//app.invoke('next-steps-next-dashboard-projects');

			app.invoke('util-dashboard',
			{
				dashboards:
				[
					{
						name: 'next-steps-next-tokens-community',
						containerSelector: '#next-steps-next-tokens-community',
						template: '{{total}}',
						formatController: 'next-steps-tokens-format',
						defaults:
						{
							total: 0
						},
						storage:
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
							]
						}
					}
				]
			});

			app.invoke('next-steps-next-summary');
		}
	}
});

app.add(
{
	name: 'next-steps-next-summary',
	code: function (param, response)
	{	
		var whoamiUser = app.whoami().thisInstanceOfMe.user;

		var whoami = app.get(
		{
			scope: 'next-steps-next',
			context: 'whoami'
		});

		app.view.refresh(
		{
			scope: 'next-steps-next',
			selector: '#next-steps-next',
			data: whoami
		});

		app.invoke('next-steps-next-summary-skills');
		app.invoke('next-steps-next-summary-check-ins');
		app.invoke('next-steps-next-summary-learning-partners');
		app.invoke('next-steps-next-summary-thoughts');
	}	
});

app.add(
{
	name: 'next-steps-next-summary-check-ins',
	code: function (param, response)
	{	
		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'project',
				fields: ['description', 'createddate', 'guid', 'startdate', 'notes', 'statustext'],
				filters:
				[
					{
						field: 'createduser',
						value: app.whoami().thisInstanceOfMe.user.id
					},
					{
						field: 'restrictedtoteam',
						value: 'Y'
					},
					{
						field: 'type',
						value: app.whoami().mySetup.projectTypes.management
					},
					{
						field: 'subtype',
						value: app.whoami().mySetup.projectSubTypes.managementCheckIn
					}
				],
				sorts:
				[
					{
						field: 'startdate',
						direction: 'desc'
					}
				],
				callback: 'next-steps-next-summary-check-ins',
				set:
				{
					scope: 'next-steps-next',
					context: 'check-ins'
				}
			});
		}
		else
		{
			var checkIns = response.data.rows;

			var checkInsView = app.vq.init({queue: 'next-steps-next-summary-check-ins'});

			if (checkIns.length == 0)
			{
				checkInsView.add(
				[
					'<div class="mb-3 text-muted small">',
					'No check-ins.',
					'</div>'
				]);
			}
			else
			{
				checkInsView.template(
				[
					'<li class="mb-2">',
					'<div class="mb-0"><a href="#next-steps-check-in-summary/{{guid}}">{{description}}</a></div>',
					'<div class="text-muted small">{{startdate}}, {{statustext}}</div>',
					'</li>'
				]);

				checkInsView.add('<ul class="pl-4 mb-1">');

				_.each(checkIns, function (checkIn)
				{
					checkIn.startdate = app.invoke('util-date', {date: checkIn.startdate, format: 'DD MMM YYYY'});
					checkInsView.add({useTemplate: true}, checkIn)
				});

				checkInsView.add('</ul>');
			}

			checkInsView.render('#next-steps-next-summary-check-ins-view')	
		}
	}
});

app.add(
{
	name: 'next-steps-next-summary-endorsements',
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
				callback: 'next-steps-next-summary-endorsements',
				set:
				{
					scope: 'next-steps-next',
					context: 'endorsements'
				}
			});
		}
		else
		{
			var endorsements = response.data.rows;

			var endorsementsView = app.vq.init({queue: 'next-steps-next-summary-endorsements'});

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
					'<h4 class="mb-0">{{subject}}</h4>',
	            	'<div class="text-muted">{{description}}</div>',
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

	      endorsementsView.render('#next-steps-next-summary-endorsements-view')	
	   }
	}
});

app.add(
{
	name: 'next-steps-next-summary-thoughts',
	code: function (param, response)
	{	
		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'action',
				fields: ['createddate', 'guid', 'text'],
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
						value: app.whoami().mySetup.actionTypes.reflectionBySelfForGrowth
					},
					{	
						field: 'subject',
						comparison: 'EQUAL_TO',
						value: 'Next Steps; Thoughts'
					}
				],
				rows: 2,
				sorts:
				[
					{
						field: 'modifieddate',
						direction: 'desc'
					}
				],
				callback: 'next-steps-next-summary-thoughts',
				
			});
		}
		else
		{
			var reflectionsBySelfForGrowth = response.data.rows;

			var reflectionsBySelfForGrowthText = '';

			if (reflectionsBySelfForGrowth.length != 0)
			{
				reflectionBySelfForGrowth = _.first(reflectionsBySelfForGrowth)
				reflectionsBySelfForGrowthText = reflectionBySelfForGrowth.text;
			}

			app.show('#next-steps-next-summary-thoughts-view', reflectionsBySelfForGrowthText)	
		}
	}
});

app.add(
{
	name: 'next-steps-next-thoughts',
	code: function (param, response)
	{	
		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'action',
				fields: ['createddate', 'guid', 'text'],
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
						value: app.whoami().mySetup.actionTypes.reflectionBySelfForGrowth
					},
					{	
						field: 'subject',
						comparison: 'EQUAL_TO',
						value: 'Next Steps; Thoughts'
					}
				],
				rows: 2,
				sorts:
				[
					{
						field: 'modifieddate',
						direction: 'desc'
					}
				],
				callback: 'next-steps-next-thoughts',
				
			});
		}
		else
		{
			var reflectionsBySelfForGrowth = response.data.rows;

			var reflectionsView = app.vq.init({queue: 'next-steps-next-summary-reflections'});
			var reflectionsBySelfForGrowthText = '';
			var reflectionBySelfForGrowth = {}

			if (reflectionsBySelfForGrowth.length != 0)
			{
				reflectionBySelfForGrowth = _.first(reflectionsBySelfForGrowth)
				reflectionsBySelfForGrowthText = reflectionBySelfForGrowth.text;
			}

			app.set(
			{
				scope: 'next-steps-next-thoughts-edit',
				value: reflectionBySelfForGrowth
			});

			reflectionsView.add(
			[ 
				'<textarea style="height:350px;" class="form-control myds-text" id="next-steps-next-thoughts-edit" data-id="" data-scope="next-steps-next-thoughts-edit" data-context="text">',
					reflectionsBySelfForGrowthText,
				'</textarea>',
				'<div class="mt-4 text-right">',
					'<button class="btn btn-link text-muted myds-navigate" data-controller="next-steps-next" id="next-steps-next-thoughts-edit-cancel" data-context="" data-id="">Cancel</button>',
					'<button class="btn btn-default btn-outline myds-click ml-2" data-controller="next-steps-next-thoughts-edit-save" id="next-steps-next-thoughts-edit-save" data-context="{{id}}" data-id="{{id}}">Save</button>',
				'</div>'
			]);

	      	reflectionsView.render('#next-steps-next-thoughts-view')	
	   }
	}
});

app.add(
{
	name: 'next-steps-next-thoughts-edit-save',
	code: function (param, response)
	{	
		var reflectionBySelfForGrowth = app.get(
		{
			scope: 'next-steps-next-thoughts-edit'
		});
	
		var data = 
		{
			id: reflectionBySelfForGrowth.id,
			type: app.whoami().mySetup.actionTypes.reflectionBySelfForGrowth,
			date: app.invoke('util-date'),
			status: app.whoami().mySetup.actionStatuses.inProgress,
			text: reflectionBySelfForGrowth.text,
			subject: 'Next Steps; Thoughts',
			contactperson: app.whoami().thisInstanceOfMe.user.contactperson
		}
	
		if (_.isUndefined(response))
		{
			mydigitalstructure.cloud.save(
			{
				object: 'action',
				data: data,
				callback: 'next-steps-next-thoughts-edit-save'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Next steps thoughts updated.');
				app.invoke('app-navigate-to', {controller: 'next-steps-next'});
			}
		}
		
	}
});

app.add(
{
	name: 'next-steps-next-summary-attributes',
	code: function (param, response)
	{	
		var whoami = app.get(
		{
			scope: 'next-steps-next',
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

		var category = utilSetup.structures.me.categories.leadership;
		elements = _.filter(elements, function (element) {return element.category == category})

		app.vq.init();

		app.vq.add(
		[
			'<div class="mb-3">',
				'<label class="form-check-label mb-0" for="next-steps-next-edit-attributes-{{meid}}">',
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

      app.set(
		{
			scope: 'next-steps-next',
			context: 'elements',
			value: elements
		})

      _.each(elements, function (element)
      {
      	element.value = whoami[element.alias] || 0;
      	element.meid = whoami.id;
      	app.vq.add({useTemplate: true}, element)
      });

      app.vq.render('#next-steps-next-summary-attributes-view')	
	}
});

app.add(
{
	name: 'next-steps-next-summary-skills',
	code: function (param, response)
	{	
		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'contact_attribute',
				fields: ['attributetext', 'createddate', 'guid', 'notes'],
				filters:
				[
					{	
						field: 'contactperson',
						comparison: 'EQUAL_TO',
						value: app.whoami().thisInstanceOfMe.user.contactperson
					}
				],
				callback: 'next-steps-next-summary-skills',
				set:
				{
					scope: 'next-steps-next',
					context: 'skills'
				}
			})
		}
		else
		{
			var skills = response.data.rows;

			var skillsView = app.vq.init({queue: 'next-steps-next-summary-skills'});

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

	      skillsView.render('#next-steps-next-summary-achievements-view');	
	   }
	}
});


app.add(
{
	name: 'next-steps-next-summary-learning-partners',
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
				callback: 'next-steps-next-summary-learning-partners',
				set:
				{
					scope: 'next-steps-next',
					context: 'learningPartners'
				}
			});
		}
		else
		{
			var learningPartners = response.data.rows;

			var learningPartnersView = app.vq.init({queue: 'next-steps-next-summary-learning-partners'});

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

	      learningPartnersView.render('#next-steps-next-summary-learning-partners-view')	
	   }
	}
});

// NEXT; SHARE OFF-CHAIN; APPLICATION

app.add(
{
	name: 'next-steps-next-share-off-chain',
	code: function (param, response)
	{	
		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'project',
				fields: ['description', 'createddate', 'contactpersontext', 'guid', 'startdate', 'notes', 'statustext', 'sourceprojecttemplate', 'sourceprojecttemplatetext', 'restrictedtoteam', 'modifieddate', 'project.modifieduser.guid', 'project.createduser.guid', 'type', 'typetext', 'subtype', 'subtypetext', 'status'],
				filters:
				[
					{
						field: 'createduser',
						value: app.whoami().thisInstanceOfMe.user.id
					},
					{
						field: 'restrictedtoteam',
						value: 'Y'
					},
					{
						field: 'type',
						value: app.whoami().mySetup.projectTypes.management
					},
					{
						field: 'subtype',
						value: app.whoami().mySetup.projectSubTypes.managementNextSteps
					}
				],
				sorts:
				[
					{
						field: 'startdate',
						direction: 'desc'
					}
				],
				callback: 'next-steps-next-share-off-chain'
			});
		}
		else
		{
			var nextStepsApplications = app.set(
			{
				scope: 'next-steps-next-share-off-chain',
				context: 'applications',
				value: response.data.rows
			});

			var nextStepsApplication = app.set(
			{
				scope: 'next-steps-next-share-off-chain',
				context: 'application',
				value: _.first(nextStepsApplications)
			});

			app.invoke('next-steps-next-summary-skills');

			if (_.isNotSet(nextStepsApplication))
			{
				app.invoke('next-steps-next-share-off-chain-show');
			}
			else
			{
				if (_.isNotSet(nextStepsApplication.sourceprojecttemplate))
				{
					app.invoke('next-steps-next-share-off-chain-show');
				}
				else
				{
					app.invoke('next-steps-next-share-off-chain-source-template');
				}
			}
		}
	}
});

app.add(
{
	name: 'next-steps-next-share-off-chain-source-template',
	code: function (param, response)
	{	
		var nextStepsApplication = app.get(
		{
			scope: 'next-steps-next-share-off-chain',
			context: 'application'
		});

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'project',
				fields: 
				[
					'description', 'type', 'typetext',
					'category', 'categorytext',
					'reference', 'notes', 
					'guid',
				],
				filters:
				[
					{
						field: 'id',
						value: nextStepsApplication.sourceprojecttemplate
					}
				],
				callback: 'next-steps-next-share-off-chain-source-template'
			});
		}
		else
		{
			if (response.status == 'OK')
			{
				var sourceTemplateView = app.vq.init({queue: 'next-steps-next-share-off-chain-source-template'});
			
				if (response.data.rows.length != 0)
				{
					var sourceTemplate = _.first(response.data.rows);

					nextStepsApplication._sourceprojecttemplate = sourceTemplate;
					nextStepsApplication.sourceprojecttemplatedescription = sourceTemplate.description;
					nextStepsApplication.sourceprojecttemplateguid = sourceTemplate.guid;

					sourceTemplateView.add(
					[
						'<div class="card mt-4">',
							'<div class="card-body border-bottom pb-3">',
								'<div class="row">',
								'<div class="col-auto d-none"><i class="far fa-question-circle fa-lg mx-auto text-warning"></i></div>',
								'<div class="col">',
								'<h3 class="mb-1 text-warning">Project Help</h3>',
								'<div class="text-muted small mb-2">Based on ', sourceTemplate.description, '</div>',
								'</div>',
								'</div>',
							'</div>'
					]);
		
					sourceTemplateView.add(
					[
						'<div class="card-body">',
							'<div>', sourceTemplate.notes, '</div>',
						'</div>'
					]);

					sourceTemplateView.add(
					[
						'<div id="next-steps-next-share-off-chain-source-template-view-files"></div>'
					]);

					sourceTemplateView.add(
					[
						'</div>'
					]);
				}
			}

			nextStepsApplication.templateInfo = sourceTemplateView.get();

			app.set(
			{
				scope: 'next-steps-next-share-off-chain',
				context: 'application',
				value: nextStepsApplication
			});

			app.invoke('next-steps-next-share-off-chain-source-template-files');
		}
	}	
});

app.add(
{
	name: 'next-steps-next-share-off-chain-source-template-files',
	code: function (param, response)
	{	
		var nextStepsApplication = app.get(
		{
			scope: 'next-steps-next-share-off-chain',
			context: 'application',
		});

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'core_attachment',
				fields: 
				[
					'download',
					'url',
					'filename',
					'title'
				],
				filters:
				[
					{
						field: 'object',
						value: app.whoami().mySetup.objects.project
					},
					{
						field: 'objectcontext',
						comparison: 'EQUAL_TO',
						value: nextStepsApplication.sourceprojecttemplate
					}
				],
				sorts:
				[
					{
						field: 'type',
						direction: 'asc'
					},
					{
						field: 'createddate',
						direction: 'asc'
					}
				],
				customOptions: [{name: 'object', value: app.whoami().mySetup.objects.project}],
				callback: 'next-steps-next-share-off-chain-source-template-files'
			});
		}
		else
		{
			if (response.status == 'OK')
			{
				nextStepsApplication.moreinformation = '';
				nextStepsApplication.files = response.data.rows;
				nextStepsApplication.templateFile = _.find(nextStepsApplication.files, function (file)
				{
					return _.includes(file.filename, 'selfdriven.template.next.steps')
				});

				app.set(
				{
					scope: 'next-steps-next-share-off-chain',
					context: 'application',
					value: nextStepsApplication
				});

				if (_.isSet(nextStepsApplication.templateFile))
				{
					app.invoke('next-steps-next-share-off-chain-source-template-file-get')
				}
				else
				{
					app.invoke('next-steps-next-share-off-chain-show');
				}
			}
		}
	}	
});

app.add(
{
	name: 'next-steps-next-share-off-chain-source-template-file-get',
	code: function (param, response)
	{
		//CORE_FILE_READ

		var nextStepsApplication = app.get(
		{
			scope: 'next-steps-next-share-off-chain',
			context: 'application'
		});

		if (response == undefined)
		{
			mydigitalstructure.cloud.invoke(
			{
				method: 'core_file_read',
				data:
				{
					id: nextStepsApplication.templateFile.id,
					dataonly: 'Y'
				},
				callback: 'next-steps-next-share-off-chain-source-template-file-get'
			});
		}
		else
		{
			nextStepsApplication._file = response;

			app.set(
			{
				scope: 'next-steps-next-share-off-chain',
				context: 'application',
				value: nextStepsApplication
			});

			if (_.has(nextStepsApplication, '_file.template.nextsteps.url'))
			{
				nextStepsApplication.moreinformation = 
						'<a href="' + nextStepsApplication._file.template.nextsteps.url + '" target="_blank">More Information...</a>'
			}

			app.invoke('next-steps-next-share-off-chain-show');
		}
	}
});

app.add(
{
	name: 'next-steps-next-share-off-chain-show',
	code: function (param, response)
	{	
		var nextStepsApplication = app.get(
		{
			scope: 'next-steps-next-share-off-chain',
			context: 'application'
		});

		var nextStepsApplicationsView = app.vq.init({queue: 'next-steps-next-share-off-chain'});

		if (_.isNotSet(nextStepsApplication))
		{
			nextStepsApplicationsView.add(
			[
				'<div class="card mt-4">',
					'<div class="card-body pb-3 text-center">',
						'<h3 class="mb-1">Create Application</h3>',
						'<div class="text-muted mt-3">',
							'You can now create a generic application or a specific one for a learning opportunity for learning providers that have registered with selfdriven.',
						'</div>',
					'</div>',
					'<div class="card-body pt-0">',
						'<div class="text-center mt-2">',
							'<button class="btn btn-default btn-outline myds-click" data-controller="next-steps-next-share-off-chain-application-edit-save" id="next-steps-next-share-off-chain-application-edit-create" data-context="{{guid}}" data-id="{{guid}}">Create</button>',
						'</div>',
					'</div>',
				'</div>'
			]);
		}
		else
		{
			var attributesClass = (_.has(nextStepsApplication, '_file.template.nextsteps.attributes')?'':' d-none');
			var skillsRequiredClass = (_.has(nextStepsApplication, '_file.template.nextsteps.skills.required')?'':' d-none');

			nextStepsApplicationsView.add(
			[
				'<ul class="nav nav-tabs nav-overflow myds-tab">',
					'<li class="nav-item">',
						'<a href="#next-steps-next-share-off-chain-application-overview" data-toggle="tab" class="nav-link active" data-controller="next-steps-next-share-off-chain-application-overview">',
							'Application',
						'</a>',
					'</li>',
					'<li class="nav-item', skillsRequiredClass, '">',
						'<a href="#next-steps-next-share-off-chain-application-skills" data-toggle="tab" class="nav-link" data-controller="next-steps-next-share-off-chain-application-skills">',
							'Skills Required',
						'</a>',
					'</li>',
					'<li class="nav-item', attributesClass, '">',
						'<a href="#next-steps-next-share-off-chain-application-achievements" data-toggle="tab" class="nav-link"',
									'data-controller="next-steps-next-share-off-chain-application-achievements" data-object="1" data-objectcontext="', nextStepsApplication.id, '"', 
									' data-context="next-steps-next-share-off-chain-application-achievements"',
						'>',
							'Achievements',
						'</a>',
					'</li>',
					'<li class="nav-item', attributesClass, '">',
						'<a href="#next-steps-next-share-off-chain-application-information" data-toggle="tab" class="nav-link" data-controller="next-steps-next-share-off-chain-application-information">',
							'Information',
						'</a>',
					'</li>',
					'<li class="nav-item d-none">',
						'<a href="#next-steps-next-share-off-chain-application-check-ins" data-toggle="tab" class="nav-link" data-controller="next-steps-next-share-off-chain-application-check-ins">',
							'Check-Ins',
						'</a>',
					'</li>',
					'<li class="nav-item">',
						'<a href="#next-steps-next-share-off-chain-application-files" data-toggle="tab" class="nav-link"',
									'data-controller="util-files-show" data-object="1" data-objectcontext="', nextStepsApplication.id, '"', 
									' data-context="next-steps-next-share-off-chain-application-files"',
						'>',
							'Files',
						'</a>',
					'</li>',
					'<li class="nav-item">',
						'<a href="#next-steps-next-share-off-chain-application-notes" data-toggle="tab" class="nav-link">',
							'Notes',
						'</a>',
					'</li>',
					'<li class="nav-item">',
						'<a href="#next-steps-next-share-off-chain-application-team" data-toggle="tab" class="nav-link" data-controller="next-steps-next-share-off-chain-application-team"',
						' data-project="', nextStepsApplication.id, '"', 
						'>',
							'Team',
						'</a>',
					'</li>',
					'<li class="nav-item">',
						'<a href="#next-steps-next-share-off-chain-application-finalise" data-toggle="tab" class="nav-link" data-controller="next-steps-next-share-off-chain-application-finalise">',
							'Share',
						'</a>',
					'</li>',
				'</ul>',
				'<div class="tab-content px-0">',
					'<div class="tab-pane active" id="next-steps-next-share-off-chain-application-overview">',
						'<div class="row mt-4 px-3">',
							'<div class="card">',
								'<div class="card-body">',
									'<h2 class="d-none">', nextStepsApplication.description, '</h2>',
									'<div class="form-group mt-3">',
										'<h4><label class="text-muted mb-1 mt-1" for="next-steps-next-share-off-chain-application-overview-sourceprojecttemplate">Application For</label></h4>',
										'<select class="form-control input-lg myds-select" id="next-steps-next-share-off-chain-application-overview-sourceprojecttemplate" style="width:100%;" data-id="', nextStepsApplication.sourceprojecttemplate, '" data-scope="next-steps-next-share-off-chain" data-context="sourceprojecttemplate" data-text="',
										nextStepsApplication.sourceprojecttemplatedescription, '">',
										'</select>',
									'</div>',
									'<div class="text-center" id="next-steps-next-share-off-chain-application-overview-link">',
										nextStepsApplication.moreinformation,
									'</div>',
								'</div>',
								'<div class="card-body pt-0">',
									'<div class="text-center mt-2">',
										'<button class="btn btn-default btn-outline myds-click" data-controller="next-steps-next-share-off-chain-application-edit-save" id="next-steps-next-share-off-chain-application-edit-save" data-context="{{guid}}" data-id="{{guid}}">Save</button>',
									'</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>',
					'<div class="tab-pane" id="next-steps-next-share-off-chain-application-skills"></div>',
					'<div class="tab-pane" id="next-steps-next-share-off-chain-application-information"></div>',
					'<div class="tab-pane" id="next-steps-next-share-off-chain-application-achievements">',
						'<div class="card mt-4">',
							'<div class="card-header">',
								'<form autocomplete="off">',
									'<div class="input-group input-group-flush input-group-merge input-group-reverse">',
										'<input type="text" class="form-control myds-text" placeholder="Search for an achievement/skill"',
										'data-controller="next-steps-next-share-off-chain-application-achievements"',
										'data-context="search">',
										'<div class="input-group-text">',
											'<span class="fe fe-search"></span>',
										'</div>',
									'</div>',
									
								'</form>',
								'<div class="btn-group" role="group">',
								'<a class="btn btn-sm btn-primary" data-toggle="collapse" href="#next-steps-next-share-off-chain-application-achievement-edit-collapse"><i class="fa fa-plus mt-1"></i></a>',
								'</div>',
							'</div>',
						'</div>',
						'<div class="collapse myds-collapse"',
								' id="next-steps-next-share-off-chain-application-achievement-edit-collapse"',
								' data-controller="next-steps-next-share-off-chain-application-achievement-edit"',
								' data-objectcontext="', nextStepsApplication.id, '"',
								' data-context="next-steps-next-share-off-chain-application"',
							'>',
							'<div class="card mt-4">',
								'<div id="next-steps-next-share-off-chain-application-achievement-edit-view" class="card-body pb-3 pt-5 px-4">',
									'<form autocomplete="off">',
										'<div class="row">',
											'<div class="col-sm-6">',
												'<div class="form-group">',
													'<h4><label class="text-muted mb-1" for="next-steps-next-share-off-chain-application-achievement-edit-subject-{{id}}">Subject</label></h4>',
													'<input type="text" class="form-control input-lg myds-text" id="next-steps-next-share-off-chain-application-achievement-edit-subject-{{id}}" value="" data-value="" data-id="{{id}}" data-scope="next-steps-next-share-off-chain-application-achievement-edit-{{id}}" data-context="subject">',
												'</div>',
												'<div class="form-group">',
													'<h4><label class="text-muted mb-1 mt-1" for="next-steps-next-share-off-chain-application-achievement-edit-description">Description</label></h4>',
													'<textarea style="height:150px;" class="form-control myds-text myds-validate" data-validate-mandatory id="next-steps-next-share-off-chain-application-achievement-edit-description" data-id="{{id}}" data-scope="next-steps-next-share-off-chain-application-achievement-edit-{{id}}" data-context="description"></textarea>',
												'</div>',
											'</div>',
											'<div class="col-sm-6 pl-sm-5">',
												'<h4><label class="text-muted mb-1 mt-1" for="next-steps-next-share-off-chain-application-achievement-edit-attributes-view">Skills Relating To This Achievement</label></h4>',
												'<div id="next-steps-next-share-off-chain-application-achievement-edit-attributes-view"></div>',
											'</div>',
										'</div>',
									'</form>',
									'<div class="form-group text-center mt-2 mb-0">',
										'<a class="btn btn-link text-muted mr-1" data-toggle="collapse" href="#next-steps-next-share-off-chain-application-achievement-edit-collapse">Cancel</a>',
										'<button type="button" class="btn btn-default btn-outline mr-2 mb-3 myds-click"',
										' data-context="next-steps-next-share-off-chain-application"',
										' data-project="', nextStepsApplication.id, '"',
										' data-id="', nextStepsApplication.id, '"',
										' data-controller="next-steps-next-share-off-chain-application-achievement-edit-save"',
										'>',
										'Save',
										'</button>',
									'</div>',
								'</div>',
							'</div>',
						'</div>',
						'<div class="mt-4 px-0" id="next-steps-next-share-off-chain-application-achievements-view">',
						'</div>',
					'</div>',
					'<div class="tab-pane" id="next-steps-next-share-off-chain-application-files">',
						'<div class="mt-4" id="next-steps-next-share-off-chain-application-files-attachments-container">',
						'</div>',
					'</div>',
					'<div class="tab-pane" id="next-steps-next-share-off-chain-application-notes">',
						'<div class="form-group mt-4">',
							'<textarea style="height:350px;" class="form-control myds-text myds-validate" id="next-steps-next-share-off-chain-application-notes" data-id="49538" data-scope="next-steps-next-share-off-chain-application" data-context="notes"></textarea>',
						'</div>',
					'</div>',
					'<div class="tab-pane" id="next-steps-next-share-off-chain-application-team">',
						'<div class="mt-4">',
							'<div class="card">',
								'<div class="card-body p-0" id="next-steps-next-share-off-chain-application-team-view">',
								'</div>',
							'</div>',
							'<a class="btn btn-link" data-toggle="collapse" role="button"',
									' href="#next-steps-next-share-off-chain-application-team-edit-collapse"',
							'>',
								' Add Application Team Member',
							'</a>',
							'<div class="collapse myds-collapse"',
								' id="next-steps-next-share-off-chain-application-team-edit-collapse"',
								' data-controller="next-steps-next-share-off-chain-application-team-edit"',
								' data-objectcontext="', nextStepsApplication.id, '"',
								' data-context="next-steps-next-share-off-chain-application"',
							'>',
								'<div class="card mt-3">',
									'<div id="next-steps-next-share-off-chain-application-team-edit-view" class="card-body pb-3 pt-5 px-4">',
										'<div class="form-group">',
											'<select class="form-control input-lg myds-select"',
												'id="next-steps-next-share-off-chain-application-team-edit-contactperson" style="width:100%;"',
												' data-id=""',
												' data-scope="next-steps-next-share-off-chain-application-team-edit"',
												' data-context="contactperson">',
											'</select>',
										'</div>',
										'<div class="form-group">',
											'<select class="form-control input-lg myds-select"',
												'id="next-steps-next-share-off-chain-application-team-edit-projectrole" style="width:100%;"',
												' data-id=""',
												' data-scope="next-steps-next-share-off-chain-application-team-edit"',
												' data-context="projectrole">',
											'</select>',
										'</div>',
										'<div class="form-group text-center mb-0">',
											'<button type="button" class="btn btn-default btn-outline btn-sm mr-2 mb-3 myds-click"',
											' data-context="next-steps-next-share-off-chain-application"',
											' data-project="', nextStepsApplication.id, '"',
											' data-id="', nextStepsApplication.id, '"',
											' data-controller="next-steps-next-share-off-chain-application-team-edit-save"',
											'>',
											'Add to Team',
											'</button>',
										'</div>',
									'</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>',
					'<div class="tab-pane" id="next-steps-next-share-off-chain-application-check-ins"></div>',
					'<div class="tab-pane" id="next-steps-next-share-off-chain-application-finalise">',
						'<div class="row mt-4">',
							'<div class="card">',
								'<div class="card-body pb-3 text-center">',
									'<h3 class="mb-1 mt-2">Share With Learning Partners</h3>',
									'<div class="text-muted">',
										'Before finalising the application, you share information as a draft.',
									'</div>',
								'</div>',
								'<div class="card-body pt-0 border-bottom">',
									'<div class="text-center mt-2">',
										'<button class="btn btn-default btn-outline btn-sm myds-click" data-controller="next-steps-next-share-off-chain-application-for-sharing-save" data-context="', nextStepsApplication.id, '" data-id="', nextStepsApplication.id,
											'">Share As Draft</button>',
									'</div>',
								'</div>',

								'<div class="d-none card-body pb-3 text-center">',
									'<h3 class="mb-1">Seek Next Steps Endorsement</h3>',
									'<div class="text-muted">',
										'Based on your application, seek an endorsement from your pathways adviser and the principal.',
									'</div>',
								'</div>',
								'<div class="d-none card-body pt-0">',
									'<div class="text-center mt-2">',
										'<button class="btn btn-default btn-outline btn-sm myds-navigate" data-controller="next-steps-next-share-off-chain-profile-add" id="next-steps-next-share-off-chain-profile-add-{{id}}" data-context="{{guid}}" data-id="{{guid}}">Send Request</button>',
									'</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>',
				'</div>'
			]);
		}

		nextStepsApplicationsView.render('#next-steps-next-share-off-chain-application-view');

		if (_.isSet(nextStepsApplication))
		{
			app.invoke('util-view-select',
			{
				container: 'next-steps-next-share-off-chain-application-overview-sourceprojecttemplate',
				object: 'project',
				filters:
				[
					{
						field: 'template',
						value: 'Y'
					},
					{
						field: 'type',
						value: app.whoami().mySetup.projectTypes.facilitation
					}
				],
				fields: [{name: 'description'}]
			});

			app.invoke('util-attachments-initialise',
			{
				context: 'next-steps-next-share-off-chain-application-files',
				object: app.whoami().mySetup.objects.project,
				objectContext: nextStepsApplication.id,
				showTypes: false,
				collapsible: false
			});

			app.invoke('next-steps-next-share-off-chain-skills');
		}
	}
});

app.add(
{
	name: 'next-steps-next-share-off-chain-skills',
	code: function (param, response)
	{	
		if (response == undefined)
		{
			var filters = 
			[
				{
					field: 'hidden',
					value: 'N'
				}
			]

			mydigitalstructure.cloud.search(
			{
				object: 'setup_contact_attribute',
				fields: 
				[
					'title', 'guid', 'notes'
				],
				sorts:
				[
					{
						field: 'displayorder'
					},
					{
						field: 'title'
					},
				],
				filters: filters,
				rows: 99999,
				callback: 'next-steps-next-share-off-chain-skills',
				callbackParam: param
			});
		}
		else
		{
			app.set(
			{
				scope: 'util-setup',
				context: 'skills',
				value: response.data.rows
			});
		}
	}
});

app.add(
{
	name: 'next-steps-next-share-off-chain-application-edit-save',
	code: function (param, response)
	{	
		var nextStepsApplication = app.get(
		{
			scope: 'next-steps-next-share-off-chain',
			context: 'application',
			valueDefault: {}
		});

		var nextStepsTemplate = app.get(
		{
			scope: 'next-steps-next-share-off-chain',
			context: 'sourceprojecttemplate',
			valueDefault: {}
		});

		var data;

		if (_.isNotSet(nextStepsApplication.id))
		{
			data =
			{		
				restrictedtoteam: 'Y',
				type: app.whoami().mySetup.projectTypes.management,
				subtype: app.whoami().mySetup.projectSubTypes.managementNextSteps,
				projectmanager: app.whoami().thisInstanceOfMe.user.id,
				contactperson: app.whoami().thisInstanceOfMe.user.contactperson,
				status: app.whoami().mySetup.projectStatuses.inProgress,
				referencemask: 'SDNS???????',
				notes: '{nextsteps:{}}',
				description: 'Next Steps Application By ' +
								app.whoami().thisInstanceOfMe.user.firstname + ' ' +
								app.whoami().thisInstanceOfMe.user.surname
			}
		}
		else
		{
			var data =
			{
				id: nextStepsApplication.id
			}

			if (_.isSet(nextStepsTemplate))
			{
				data.sourceprojecttemplate = nextStepsTemplate;
			}
		}
		
		if (_.isUndefined(response))
		{
			mydigitalstructure.cloud.save(
			{
				object: 'project',
				data: data,
				callback: 'next-steps-next-share-off-chain-application-edit-save'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				//Add team members - ie pathway advisers.

				if (_.isNotSet(nextStepsApplication.id))
				{
					app.notify({message: 'Application has been created.'});
				}
				else
				{
					app.notify({message: 'Application has been updated.'});
				}

				app.invoke('next-steps-next-share-off-chain')
			}
		}
	}
});

app.add(
{
	name: 'next-steps-next-share-off-chain-application-skills',
	code: function (param, response)
	{	
		var nextStepsApplication = app.get(
		{
			scope: 'next-steps-next-share-off-chain',
			context: 'application'
		});

		if (_.has(nextStepsApplication, '_file.template.nextsteps.skills.required'))
		{
			var _applicationNotes = {};

			if (_.startsWith(nextStepsApplication.notes, '{'))
			{
				_applicationNotes = JSON.parse(nextStepsApplication.notes)
			}

			var skillsView = app.vq.init({queue: 'next-steps-next-share-off-chain-application-skills'});

			skillsView.template(
			[
				'<div class="col-12 col-sm-4 mb-3 mt-0 text-center">',
					'<div class="card">',
						'<div class="card-body border-bottom">',
							'<h3 class="mt-0 mb-2 ml-2 mt-1 myds-navigate" ',
									'data-name="{{name}}" data-controller=""',
									'data-context="{{name}}">',
								'{{name}}',
							'</h3>',
						'</div>',
						'<div class="card-body text-center" id="next-steps-next-share-off-chain-application-information-skills-required-{{uri}}-view">',
							'<form autocomplete="off">',
								'<div class="form-group">',
									'<h4><label class="text-muted mb-1" for="next-steps-next-share-off-chain-application-information-skills-required-level-{{uri}}">Level</label></h4>',
									'<input type="text" class="form-control input-lg entityos-text entityos-focus text-center" id="next-steps-next-share-off-chain-application-information-skills-required-level-{{uri}}" value="{{levelValue}}" data-value="{{levelValue}}" data-id="{{uri}}"',
									' data-controller="next-steps-next-share-off-chain-application-skills-save"',
									' data-scope="next-steps-next-share-off-chain-application-information-skills-required" data-context="level-{{uri}}">',
								'</div>',
								'<button class="btn btn-default btn-outline myds-click {{evidenceClass}}" data-controller="" data-context="{{uri}}" data-id="{{uri}}">Upload <i class="fe fe-upload-cloud"></i></button>',
							'</form>',
						'</div>',
					'</div>',
				'</div>'
			]);
		
			skillsView.add(['<div class="row mt-4">']);

			_.each(nextStepsApplication._file.template.nextsteps.skills.required, function(skillRequired)
			{
				skillRequired.levelValue = '';
				if (_.has(_applicationNotes, 'skills.required'))
				{
					var _applicationNoteSkill = _.find(_applicationNotes.skills.required, function (noteSkillRequired)
					{
						return (noteSkillRequired.uri == skillRequired.uri)
					});

					if (_.isSet(_applicationNoteSkill))
					{
						skillRequired.levelValue = _applicationNoteSkill.level;
					}
				}
				skillRequired.evidenceClass = (_.isSet(skillRequired.evidence)?'':' d-none');
				skillsView.add({useTemplate: true}, skillRequired)
			});

			skillsView.add(['</div>']);

			skillsView.render('#next-steps-next-share-off-chain-application-skills');
		}
	}
});

app.add(
{
	name: 'next-steps-next-share-off-chain-application-skills-save',
	code: function (param, response)
	{	
		if (_.isUndefined(response))
		{
			var save = (param._type == 'focusout');
			if (!save && _.has(param, 'dataContext.name'))
			{
				save = (param.dataContext.name == '?')
			}

			if (save)
			{
				console.log(param);

				var dataSkillsRequired = app.get(
				{
					scope: 'next-steps-next-share-off-chain-application-information-skills-required',
					cleanForCloudStorage: true,
					valueDefault: {}
				});

				var application = app.get(
				{
					scope: 'next-steps-next-share-off-chain',
					context: 'application'
				});

				var _applicationNotes = {};

				if (_.startsWith(application.notes, '{'))
				{
					_applicationNotes = JSON.parse(application.notes)
				}

				_.each(dataSkillsRequired, function(skillRequiredValue, skillRequiredKey)
				{
					if (_.startsWith(skillRequiredKey, 'level-'))
					{
						var _skillRequiredKey = _.split(skillRequiredKey, '-');
						if (_skillRequiredKey.length > 1)
						{
							var _skillRequiredKeyIndex = _skillRequiredKey[1];

							if (_applicationNotes.skills == undefined) {_applicationNotes.skills = {}}
							if (_applicationNotes.skills.required == undefined) {_applicationNotes.skills.required = []}

							var _skill = _.find(_applicationNotes.skills.required, function (skill)
							{
								return skill.uri == _skillRequiredKeyIndex
							});

							if (_skill == undefined)
							{
								_applicationNotes.skills.required.push(
								{
									uri: _skillRequiredKeyIndex,
									level: skillRequiredValue
								})
							}
							else
							{
								_skill.level = skillRequiredValue;
							}
						}
					}	
				});

				console.log(_applicationNotes);

				var saveData = 
				{
					notes: JSON.stringify(_applicationNotes),
					id: application.id
				}
				
				mydigitalstructure.cloud.save(
				{
					object: 'project',
					data: saveData,
					callback: 'next-steps-next-share-off-chain-application-skills-save'
				});
			}
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Next Steps Application Updated.');
			}
		}
		
	}
});


app.add(
{
	name: 'next-steps-next-share-off-chain-application-information',
	code: function (param, response)
	{	
		var nextStepsApplication = app.get(
		{
			scope: 'next-steps-next-share-off-chain',
			context: 'application'
		});

		app.show('#next-steps-next-share-off-chain-application-help-view',
		[
			'<div class="card">',
				'<div class="card-body text-center px-3">',
					'<div class="font-weight-bold text-muted">',
						'SDN tokens are a way of representing your activity and attributes within your current learning community.',
					'</div>',
					'<div class="text-muted mt-3 small">',
						'Each learning partner assigns their own value to each of your activities and attributes recorded within selfdriven to assist them work out how suited you are to; their learning community and any particular area of learning you want to focus on.',
					'</div>',
				'</div>',
			'</div>',
			'<div class="card mt-3">',
				'<div class="card-body text-center px-3">',
					'<a class="" href="' + nextStepsApplication._file.template.nextsteps.url + '" target="_blank">',
							nextStepsApplication._file.template.nextsteps.urlCaption,
							'</a>',
				'</div>',
			'</div>'
		]);

		if (_.isSet(nextStepsApplication._file))
		{
			app.invoke('next-steps-next-share-off-chain-application-information-show');
		}
		else
		{
			app.show('#next-steps-next-share-off-chain-application-information', 
							'<div class="text-muted p-4">Sorry, no information to show.</div>');
		}
	}
});

app.add(
{
	name: 'next-steps-next-share-off-chain-application-information-show',
	code: function (param, response)
	{
		var nextStepsApplication = app.get(
		{
			scope: 'next-steps-next-share-off-chain',
			context: 'application'
		});

		var dashboards = app.get(
		{
			scope: 'util-dashboard'
		});

		var meAttributes = app.get(
		{
			scope: 'learner-me',
			context: 'whoami'
		});

		var sdnTokensTotal = 0;

		if (_.has(nextStepsApplication, '_file.template.nextsteps.attributes'))
		{
			var informationView = app.vq.init({queue: 'next-steps-next-share-off-chain-application-information-show'});

			informationView.template(
			[
				'<div class="col-12 col-sm-6 mb-3 mt-0 text-center">',
					'<div class="card">',
						'<div class="card-body border-bottom">',
							'<h3 class="mt-0 mb-2 ml-2 mt-1 myds-navigate" ',
									'data-name="{{name}}" data-controller=""',
									'data-context="{{name}}">',
								'{{caption}}',
							'</h3>',
							'<div class="text-muted small">{{notes}}</div>',
						'</div>',
						'<div class="card-body" id="next-steps-next-share-off-chain-application-information-attribute-{{name}}-view">',
							'{{info}}',
						'</div>',
					'</div>',
				'</div>'
			]);

			informationView.add(
			[
				'<div class="card mt-4">',
					'<div class="card-body" id="next-steps-next-share-off-chain-application-information-sdn-view">',
					'</div>',
					'<div class="d-none card-body text-center border-top">',
						'<a class="" href="' + nextStepsApplication._file.template.nextsteps.url + '" target="_blank">',
							nextStepsApplication._file.template.nextsteps.urlCaption,
							'</a>',
					'</div>',
				'</div>'
			]);

			informationView.add('<div class="row mt-4">');
			
			_.each(nextStepsApplication._file.template.nextsteps.attributes, function (attribute)
			{
				//Activity - based on dashboards

				attribute.sourceDashboardData = 0;
				if (_.has(attribute, 'source.dashboard.name'))
				{
					attribute._sourceDashboard = dashboards[attribute.source.dashboard.name];
					
					if (_.isSet(attribute._sourceDashboard))
					{
						attribute._sourceDashboardData = attribute._sourceDashboard.data.count;
						attribute.sourceDashboardData = numeral(attribute._sourceDashboardData).value();
					}
				}

				// Tokens - SDC (community) tokens

				attribute.sourceTokensData = 0;

				if (_.has(attribute, 'source.tokens.name'))
				{
					attribute._sourceTokens = dashboards[attribute.source.tokens.scope];
					
					if (_.isSet(attribute._sourceTokens))
					{
						attribute._sourceTokensData = attribute._sourceTokens.data.total;
						attribute.sourceTokensData = numeral(attribute._sourceTokensData).value();
					}
				}

				//Profile

				attribute.sourceProfileData = 0;

				if (_.has(attribute, 'source.profile.attributes'))
				{
					_.each(attribute.source.profile.attributes, function (profileAttribute)
					{
						//Get caption mySetup

						profileAttribute._value = meAttributes['_' + profileAttribute.name.toLowerCase()]
						profileAttribute.value = 0;

						if (_.isSet(profileAttribute._value))
						{
							profileAttribute.value = numeral(profileAttribute._value).value();
						}

						attribute.sourceProfileData += profileAttribute.value;
						attribute._structureElement = _.find(app.whoami().mySetup.structureElements, function (structureElement)
						{
							return ('_' + profileAttribute.name == structureElement.alias)
						});

						if (_.isSet(attribute._structureElement))
						{
							profileAttribute.title = attribute._structureElement.title;
							profileAttribute.caption = attribute._structureElement.caption;
						}
						else
						{
							profileAttribute.title = _.capitalize(profileAttribute.name);
							profileAttribute.caption = '';	
						}
					});
				}

				// Skills

				attribute.sourceSkillsData = 0;

				if (_.has(attribute, 'source.skills'))
				{
					var learnerSkills = app.get(
					{
						scope: 'next-steps-next',
						context: 'skills'
					});

					_.each(attribute.source.skills, function (skill)
					{
						skill._learnerSkill = _.find(learnerSkills, function (learnerSkill)
						{
							return skill.name == learnerSkill.attributetext;
						})

						skill.value = 0;

						if (_.isSet(skill._learnerSkill))
						{
							skill.value = numeral(skill.sdn.tokens).value();
						}

						attribute.sourceSkillsData += skill.value;				
					});
				}

				//Calculate SDN Tokens

				attribute._sdnTokens = 0;
				if (_.has(attribute, 'sdn.tokens'))
				{
					attribute._sdnTokens = numeral(attribute.sdn.tokens).value();
				}

				attribute.sdnTokensType = 
				{
					dashboard: attribute.sourceDashboardData * attribute._sdnTokens,
					tokens: attribute.sourceTokensData * attribute._sdnTokens,
					profile: attribute.sourceProfileData * 1,
					skills: attribute.sourceSkillsData
				}

				attribute.sdnTokens =
				(
					(	attribute.sourceDashboardData +
						attribute.sourceTokensData
					) * attribute._sdnTokens
				) +
				(
					attribute.sourceProfileData * 1
				) +
				attribute.sourceSkillsData;

				var informationAttributeView = app.vq.init({queue: 'next-steps-next-share-off-chain-application-information-show-attribute'});
				informationAttributeView.template(
				[
					'<div class="mt-3 w-75 mx-auto text-center">',
						'<label class="form-check-label mb-0">',
						'<div class="text-muted small">{{title}}</div>',
						'</label>',
						'<div class="progress progress-small">',
								'<div class="progress-bar" style="width: {{value}}%;" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="100"></div>',
						'</div>',
					'</div>'
				]);

				informationAttributeView.add(
					'<div class="col-12 text-center">' +
						'<h1 class="p-0 mb-2" style="font-size:3em;">' +
							'<a href="#" style="color:#9ecbed;">' +
								attribute.sdnTokens +
							'</a>' +
						'</h1>' +
						'<small class="text-muted">SDN Tokens</small>' +
					'</div>');

				var types =
				[
					{
						name: 'profile',
						caption: 'Attributes'
					},
					{
						name: 'dashboard',
						caption: 'Activity'
					},
					{
						name: 'tokens',
						caption: 'Community'
					},
					{
						name: 'skills',
						caption: 'Skills'
					}
				]

				informationAttributeView.add('<div class="row pt-3 px-1">');

				_.each(types, function (type)
				{
					informationAttributeView.add(
					[
						'<div class="col-3 px-0 text-center">' +
							'<h1 class="p-0 mb-0" style="font-size:1em;">' +
								'<a href="#" style="color:#9ecbed;">' +
									attribute.sdnTokensType[type.name] +
								'</a>' +
							'</h1>' +
							'<small class="text-muted">', type.caption, '</small>' +
						'</div>'
					]);	
				});

				informationAttributeView.add('</div>');

				if (_.has(attribute, 'source.profile.attributes'))
				{
					if (attribute.source.profile.attributes.length != 0)
					{
						informationAttributeView.add('<div class="mt-3 pt-2 border-top">');

						_.each(attribute.source.profile.attributes, function (profileAttribute)
						{
							//profileAttribute.value = meAttributes['_' + profileAttribute.name.toLowerCase()]
							
							//if (_.isSet(profileAttribute.value))
							//{
								if (profileAttribute.value == '') {profileAttribute.value = 0}
								informationAttributeView.add({useTemplate: true}, profileAttribute)
							//}
						});

						informationAttributeView.add('</div>');
					}
				}

				if (_.has(attribute, 'source.skills'))
				{
					if (attribute.source.skills.length != 0)
					{
						informationAttributeView.add('<div class="mt-3 pt-2 border-top">');

						_.each(attribute.source.skills, function (skill)
						{
							if (_.isSet(skill.value))
							{
								informationAttributeView.add(
								[
									'<div class="col-12 mt-2 text-center',
										(skill.value==0?' text-muted':' d-block'),
										' next-steps-application-skill"',
										' data-attribute-name="', attribute.name,'">',
										'<div',
											(skill.value==0?'':' style="color:#9ecbed;"'),
										'>',
											skill.value,
										'</div>',
										'<div class="text-muted">',
											skill.name,
										'</div>',
									'</div>'
								]);
							}
						});

						informationAttributeView.add('</div>');
					}
				}

				attribute.info = informationAttributeView.get();

				if (_.isNotSet(attribute.notes)) {attribute.notes = ''}

				informationView.add({useTemplate: true}, attribute);

				sdnTokensTotal += attribute.sdnTokens
			});

			informationView.add('</div>');
		
			informationView.render('#next-steps-next-share-off-chain-application-information');

			app.set(
			{
				scope: 'next-steps-next-share-off-chain',
				context: 'application',
				name: 'sdnTokensTotal',
				value: sdnTokensTotal
			});

			app.show('#next-steps-next-share-off-chain-application-information-sdn-view',
			[
				'<div class="col-12 text-center">' +
					'<h1 class="p-0 mb-2" style="font-size:4em;">' +
						'<a href="#" style="color:#9ecbed;">' +
						sdnTokensTotal +
						'</a>' +
					'</h1>' +
					'<small class="text-muted">selfdriven Next Steps (SDN) Tokens Total</small>' +
				'</div>'
			]);

			app.invoke('next-steps-next-share-off-chain-application-information-share-init');
		}
	}
});

app.add(
{
	name: 'next-steps-next-share-off-chain-application-information-share-init',
	code: function (param, response)
	{
		app.invoke('next-steps-next-share-off-chain-application-information-share-thoughts');
	}
});

app.add(
{
	name: 'next-steps-next-share-off-chain-application-information-share-thoughts',
	code: function (param, response)
	{	
		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'action',
				fields: ['createddate', 'guid', 'text'],
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
						value: app.whoami().mySetup.actionTypes.reflectionBySelfForGrowth
					},
					{	
						field: 'subject',
						comparison: 'EQUAL_TO',
						value: 'Next Steps; Thoughts'
					}
				],
				rows: 2,
				sorts:
				[
					{
						field: 'modifieddate',
						direction: 'desc'
					}
				],
				callback: 'next-steps-next-share-off-chain-application-information-share-thoughts',
				
			});
		}
		else
		{
			var reflectionsBySelfForGrowth = response.data.rows;

			var reflectionsBySelfForGrowthText = '';

			if (reflectionsBySelfForGrowth.length != 0)
			{
				reflectionBySelfForGrowth = _.first(reflectionsBySelfForGrowth)
				reflectionsBySelfForGrowthText = reflectionBySelfForGrowth.text;
			}

			app.set(
			{
				scope: 'next-steps-next-share-off-chain',
				context: 'application-for-sharing-thoughts',
				value: reflectionsBySelfForGrowthText
			});

			app.invoke('next-steps-next-share-off-chain-application-information-share-process');
		}
	}
});

app.add(
{
	name: 'next-steps-next-share-off-chain-application-information-share-process',
	code: function (param, response)
	{
		var nextStepsApplication = app.get(
		{
			scope: 'next-steps-next-share-off-chain',
			context: 'application'
		});

		var nextStepsApplicationThoughts = app.get(
		{
			scope: 'next-steps-next-share-off-chain',
			context: 'application-for-sharing-thoughts'
		});

		var learnerIdentifiers = app.get(
		{
			scope: 'learner-me',
			context: 'whoami',
			name: 'identifiers'
		});
			
		var applicationData = {attributes: []}

		//Application data for sharing with learning partner
		_.each(nextStepsApplication._file.template.nextsteps.attributes, function (attribute)
		{
			applicationData.attributes.push(
			{
				name: attribute.name,
				notes: attribute.notes,
				template:
				{
					sdn: attribute.sdn
				},
				source:
				{
					dashboard: attribute.source.dashboard,
					profile:
					{
						attributes: (_.has(attribute, 'source.profile.attributes')?_.map(attribute.source.profile.attributes, function (attr)
						{
							return {name: attr.name, value: attr.value, title: attr.title}
						}):[])
					},
					tokens:
					{
						sdc: attribute.sourceTokensData
					},
					skills: (_.has(attribute, 'source.skills')?_.map(attribute.source.skills, function (skill)
					{
						return {name: skill.name, value: skill.value}
					}):[])
				},
				sdn:
				{
					tokens:
					{ 
						total: attribute.sdnTokens,
						type:
						{
							
							dashboard: attribute.sdnTokensType.dashboard,
							profile: attribute.sdnTokensType.profile,
							tokens: attribute.sdnTokensType.tokens,
							skills: attribute.sdnTokensType.skills
						}
					}
				}
			});
		});

		var applicationInformationForSharing =
		{
			nextsteps:
			{
				learningpartner:
				{	
					application:
					{
						id: nextStepsApplication.sourceprojecttemplateguid,
						description: nextStepsApplication.sourceprojecttemplatedescription
					}
				},
				learner:
				{
					id: nextStepsApplication['project.createduser.guid'],
					identifiers: learnerIdentifiers,
					application:
					{ 
						id: nextStepsApplication.guid,
						learnername: nextStepsApplication.contactpersontext,
						learnerid: nextStepsApplication['project.createduser.guid'],
						description: nextStepsApplication.description,
						created: nextStepsApplication.createddate,
						lastupdated: moment().format('DD MMM YYYY'),
						lastupdatedby: nextStepsApplication['project.modifieduser.guid'],
						information: applicationData,
						thoughts: nextStepsApplicationThoughts,
						sdnTokens: nextStepsApplication.sdnTokensTotal
					}	
				}
			}
		};

		app.set(
		{
			scope: 'next-steps-next-share-off-chain',
			context: 'application-for-sharing',
			value: applicationInformationForSharing
		});
	}
});
	
app.add(
{
	name: 'next-steps-next-share-off-chain-source-template-files-show',
	code: function (param, response)
	{	
		var nextStepsApplication = app.get(
		{
			scope: 'next-steps-next-share-off-chain',
			context: 'application'
		});

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'core_attachment',
				fields: 
				[
					'download',
					'url',
					'filename',
					'title'
				],
				filters:
				[
					{
						field: 'object',
						value: app.whoami().mySetup.objects.project
					},
					{
						field: 'objectcontext',
						comparison: 'EQUAL_TO',
						value: nextStepsApplication.id
					}
				],
				sorts:
				[
					{
						field: 'type',
						direction: 'asc'
					},
					{
						field: 'createddate',
						direction: 'asc'
					}
				],
				customOptions: [{name: 'object', value: app.whoami().mySetup.objects.project}],
				callback: 'next-steps-next-share-off-chain-source-template-files'
			});
		}
		else
		{
			//get JSON file to get set up.

			var projectFilesView = app.vq.init({queue: 'util-project-story-board-files'});

			if (response.status == 'OK')
			{
				if (response.data.rows.length != 0)
				{
					projectFilesView.add(
					[
						'<div class="card-body border-top pb-2">',
							'<ul class="pb-0">'
					]);

					_.each(response.data.rows, function (row)
					{
						row.link = row.url;
						if (row.link == '') {row.link = row.download}
						row.linkname = row.title;
						if (row.linkname == '') {row.linkname = row.url}
						if (row.linkname == '') {row.linkname = row.filename}

						if (!_.includes(row.linkname, '.jpg'))
						{
							projectFilesView.add(
							[
								'<li><a href="', row.link, '" target="_blank">', row.linkname, '</li>'
							]);
						}
					});

					projectFilesView.add(
					[
							'</ul>',
						'</div>'
					]);

					_.each(response.data.rows, function (row)
					{
						row.link = row.download;
						row.linkname = row.filename;

						if (_.includes(row.linkname, '.jpg'))
						{
							projectFilesView.add(
							[
								'<div class="card-body border-top p-5">',
									'<img class="img-fluid rounded" src="', row.link, '">',
								'</div>'
							]);
						}
					});

					projectFilesView.render('#next-steps-next-share-off-chain-source-template-view-files');
				}
			}
		}
	}	
});

app.add(
{
	name: 'next-steps-next-share-off-chain-application-team',
	code: function (param, response)
	{	
		var projectID = app._util.param.get(param.dataContext, 'project').value;
		var scope = app._util.param.get(param.dataContext, 'scope').value;
		var context = app._util.param.get(param.dataContext, 'context').value;
		var selector = app._util.param.get(param.dataContext, 'selector').value;
		var viewStatus = app._util.param.get(param, 'status', {default: 'shown'}).value;
		var show = (viewStatus == 'shown');

		var userRole = app.whoami().thisInstanceOfMe.userRole;
		if (context == undefined) {context = 'next-steps-next-share-off-chain-application'}
		
		var project = app.get(
		{
			scope: 'next-steps-next-share-off-chain',
			context: 'application'
		});

		var isMyProject = false;
		
		if (project != undefined)
		{
			isMyProject = (project.restrictedtoteam == 'Y');
			if (projectID == undefined) {projectID = project.id}
		}

		if (!isMyProject)
		{
			isMyProject = (userRole == 'admin');
		}

		if (scope == undefined)
		{
			scope = context
		}

		if (scope == undefined)
		{
			scope = 'next-steps-next-share-off-chain-application-team'
		}

		if (projectID == undefined)
		{
			projectID = app.get(
			{
				scope: scope,
				context: 'id',
				valueDefault: ''
			});
		}

		if (selector == undefined)
		{
			selector = 'next-steps-next-share-off-chain-application-team-view'
		}

		if (show)
		{
			if (projectID != undefined && selector != undefined)
			{
				var filters =
				[
					{	
						field: 'project',
						comparison: 'EQUAL_TO',
						value: projectID
					}
				]

				var columns =
				[
					{
						caption: 'First Name',
						field: 'projectteam.contactperson.firstname',
						defaultSort: true,
						sortBy: true,
						class: 'col-6 col-sm-2 text-break text-wrap myds-click'
					},
					{
						caption: 'Last Name',
						field: 'projectteam.contactperson.surname',
						sortBy: true,
						class: 'col-6 col-sm-2 text-break text-wrap myds-click'
					},
					{
						caption: 'Role',
						field: 'projectroletext',
						sortBy: true,
						defaultSort: true,
						class: 'col-0 col-sm-3 d-none d-sm-block text-break text-wrap myds-click'
					},
					
					{
						caption: 'Joined The Team',
						field: 'startdate',
						sortBy: true,
						class: 'col-0 col-sm-2 d-none d-sm-block text-break text-wrap myds-click'
					},
					{
						fields: ['enddate', 'guid']
					}
				];

				if (isMyProject)
				{
					columns = _.concat(columns,
					{
						caption: 'Left The Team',
						name: 'dateleft-leaveteam',
						sortBy: true,
						class: 'col-0 col-sm-2 d-none d-sm-block text-break text-wrap myds-click'
					},
					{
						html: '<button class="btn btn-danger btn-outline btn-sm myds-delete"' +
								' id="util-project-team-delete-{{id}}" data-id="{{id}}">' +
									'<i class="fa fa-unlink"></i></button>',
						caption: '&nbsp;',
						class: 'col-0 col-sm-1 d-none d-sm-block text-center'
					});
				}
				else
				{
					columns = _.concat(columns,
					{
						caption: 'Left The Team',
						field: 'enddate',
						sortBy: true,
						class: 'col-0 col-sm-3 d-none d-sm-block text-break text-wrap myds-click'
					});
				}
	
				app.invoke('util-view-table',
				{
					object: 'project_team',
					container: selector,
					context: 'next-steps-next-share-off-chain-application-team',
					filters: filters,
					options:
					{
						noDataText: '<div class="p-4">There are no team members.</div>',
						rows: 20,
						orientation: 'vertical',
						progressive: true,
						class: 'table-condensed',
						deleteConfirm:
						{
							text: 'Are you sure you want to remove this team member?',
							position: 'left',
							headerText: 'Remove Project team member',
							buttonText: 'Remove',
							controller: 'next-steps-next-share-off-chain-application-team-delete-ok'
						},
						showFooter: false
					},
					format:
					{
						header:
						{
							class: 'd-flex'
						},

						row:
						{
							data: 'data-id="{{id}}"',
							class: 'd-flex',
							controller: 'next-steps-next-share-off-chain-application-team-format'
						},

						columns: columns
					}
				});
			}			
		}
		else if (param.status == 'hidden')
		{
			app.show('#' + selector, '');
		}
	}
});
	
app.add(
{
	name: 'next-steps-next-share-off-chain-application-team-format',
	code: function (row)
	{
		row.name = row['projectteam.contactperson.firstname'] + ' ' +
					row['projectteam.contactperson.surname'];

		row['dateleft-leaveteam'] = row.enddate;
		
		if (_.isNotSet(row['dateleft-leaveteam']))
		{
			row['dateleft-leaveteam'] = '<button class="btn btn-white btn-sm myds-click"' +
										' id="next-steps-next-share-off-chain-application-team-leave-team-' + row.id +
										'" data-id="' + row.id + '"' +
										'" data-controller="next-steps-next-share-off-chain-application-team-leave-ok"' +
										'">Leave</button>';
		}
	}
});

app.add(
{
	name: 'next-steps-next-share-off-chain-application-team-edit',
	code: function (param)
	{	
		var context = app._util.param.get(param.dataContext, 'context').value;

		app.invoke('util-view-select',
		{
			container: 'next-steps-next-share-off-chain-application-team-edit-contactperson',
			object: 'contact_person',
			fields: [{name: 'firstname'}, {name: 'surname'}]
		});

		app.invoke('util-view-select',
		{
			container: 'next-steps-next-share-off-chain-application-team-edit-projectrole',
			object: 'setup_project_role',
			fields: [{name: 'title'}]
		});
	}
});

app.add(
{
	name: 'next-steps-next-share-off-chain-application-team-edit-save',
	code: function (param, response)
	{	
		var context = app._util.param.get(param.dataContext, 'context').value;

		var nextStepsApplication = app.get(
		{
			scope: 'next-steps-next-share-off-chain',
			context: 'application'
		});

		var projectID = nextStepsApplication.id;

		var id = app.get(
		{
			controller: 'next-steps-next-share-off-chain-application-team',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			controller: 'next-steps-next-share-off-chain-application-team-edit',
			cleanForCloudStorage: true,
			valueDefault: {}
		});

		if (id == '')
		{
			data.project = projectID;
			data.startdate = moment().format('D MMM YYYY');
		}
		else
		{
			data.id = id;
		}

		if (_.isUndefined(response))
		{
			mydigitalstructure.update(
			{
				object: 'project_team',
				data: data,
				callback: 'next-steps-next-share-off-chain-application-team-edit-save',
				callbackParam: param
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Added to this next steps application team.');
				//$('#admin-community-project-summary-team-edit-collapse').removeClass('show');
				//app.invoke('app-navigate-to', {controller: 'admin-community-project-summary', context: data.project});
				//app.invoke('app-navigate-to', {controller: 'admin-community-projects', context: data.project});
				app.invoke('next-steps-next-share-off-chain-application-team', param)
			}
		}
	}
});
	
app.add(
{
	name: 'next-steps-next-share-off-chain-application-team-delete-ok',
	code: function (param, response)
	{
		if (_.isUndefined(response))
		{
			if (!_.isUndefined(param.dataContext))
			{
				mydigitalstructure.cloud.delete(
				{
					object: 'project_team',
					data:
					{
						id: param.dataContext.id,
					},
					callback: 'next-steps-next-share-off-chain-application-team-delete-ok'
				});
			}	
		}
		else
		{
			if (response.status == 'OK')
			{
				app.notify('Removed from team.');
				app.invoke('next-steps-next-share-off-chain-application-team', {});
			}
			else if (response.status == 'ER')
			{
				app.notify('Can not be removed from the team. (' + response.error.errornotes + ')');
			}
		}
	}
});
		
app.add(
{
	name: 'next-steps-next-share-off-chain-application-for-sharing-save',
	code: function (param, response)
	{
		var applicationInformationForSharing = app.get(
		{
			scope: 'next-steps-next-share-off-chain',
			context: 'application-for-sharing'
		});

		var nextStepsApplication = app.get(
		{
			scope: 'next-steps-next-share-off-chain',
			context: 'application'
		});

		if (applicationInformationForSharing == undefined)
		{
			app.notify({type: 'error', message: 'Please check the Information tab and then come back to Share / Finalise, thank you.'})
		}
		else
		{
			var project = app.get(
			{
				scope: 'next-steps-next-share-off-chain',
				context: 'application'
			});

			if (response == undefined)
			{
				var data =
				{
					subject: nextStepsApplication.description + ' @ ' + moment().format('D MMM YYYY'),
					object: app.whoami().mySetup.objects.project,
					objectcontext: project.id,
					type: app.whoami().mySetup.actionTypes.nextStepsApplication,
					contactperson: app.whoami().thisInstanceOfMe.user.contactperson,
					text: JSON.stringify(applicationInformationForSharing)
				}

				mydigitalstructure.cloud.save(
				{
					object: 'action',
					data: data,
					callback: 'next-steps-next-share-off-chain-application-for-sharing-save',
				});
			}
			else
			{
				app.notify({type: 'info', message: 'Latest application information shared!'});

				app.invoke('next-steps-next-share-off-chain-application-for-sharing-save-project-save')
			}
		}
	}
});


app.add(
{
	name: 'next-steps-next-share-off-chain-application-for-sharing-save-project-save',
	notes: 'To update the modified date.',
	code: function (param)
	{
		var nextStepsApplication = app.get(
		{
			scope: 'next-steps-next-share-off-chain',
			context: 'application'
		});

		var data =
		{
			id: nextStepsApplication.id
		}

		mydigitalstructure.cloud.save(
		{
			object: 'project',
			data: data
		});
	}
});

app.add(
{
	name: 'next-steps-next-share-off-chain-application-achievements',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'next-steps-next-share-off-chain-application-achievements',
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
				value: app.whoami().mySetup.actionTypes.achievement
			},

		];

		if (response == undefined)
		{
			if (!_.isEmpty(data.search))
			{
				filters = _.concat(filters,
				[
					{
						name: '('
					},
					{	
						field: 'description',
						comparison: 'TEXT_IS_LIKE',
						value: data.search
					},
					{
						name: 'or'
					},
					{	
						field: 'subject',
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
				fields: ['createdusertext', 'createddate', 'guid', 'text', 'subject', 'action.createduser.contactpersontext', 'description'],
				filters: filters,
				sorts:
				[
					{
						field: 'createddate',
						direction: 'desc'
					}
				],
				callback: 'next-steps-next-share-off-chain-application-achievements'
			})
		}
		else
		{
			var achievementsView = app.vq.init({queue: 'next-steps-achievements-dashboard'});

			if (response.data.rows.length == 0)
			{
				achievementsView.add(
				[
					'<div class="text-muted text-center">',
						'You do not have any registered achievements ',
						(_.isEmpty(data.search)?'at this moment.':'that match this search.'),
					'</div>'
				]);
			}
			else 
			{
				achievementsView.template(
				[
					'<div class="col-12 mb-3">',
						'<div class="card">',
							'<div class="card-body pb-2">',
								'<div class="row mr-0">',
									'<div class="col-6">',
										'<h3 class="mt-1 mb-1">{{subject}}</h3>',
										'<div class="mb-2">{{description}}</div>',
										'<div class="text-muted">{{createddate}}</div>',
									'</div>',
									'<div class="col-6">',
									'{{skills}}',
									'</div>',
									'<div class="col-1 text-right pr-0 d-none">',
										'<a class="btn btn-link btn-sm text-muted myds-collapse-toggle"',
											' data-toggle="collapse" role="button"',
											' href="#next-steps-achievements-dashboard-collapse-{{id}}"',
										'>',
											'<i class="fa fa-chevron-down text-muted"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="collapse myds-collapse" id="next-steps-achievements-dashboard-collapse-{{guid}}"',
								'data-controller="next-steps-achievements-dashboard-show"',
								'data-skill="{{guid}}">',
								'<div class="card-body pt-1 pb-4 px-4" id="next-steps-achievements-dashboard-view-{{guid}}">',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);

				achievementsView.add(
				[
					'<div class="px-0">',
						'<div class="row">'
				]);

				_.each(response.data.rows, function (row)
				{
					row.skills = '';

					if (_.startsWith(row.text, '['))
					{
						row._skills = JSON.parse(row.text);

						row.skills = '<div>';

						_.each(row._skills, function (achievmentSkill)
						{
							achievmentSkill._skill = _.find(app.whoami().mySetup.skills, function (skill) {return skill.id == achievmentSkill.skill});
							if (achievmentSkill._skill != undefined)
							{
								row.skills += '<div class="card"><div class="card-body"><div>' + achievmentSkill.skilltext + '</div>' +
												'<div class="text-muted small">' + achievmentSkill._skill.notes + '</div></div></div>'
							}
							
						})
										 
						row.skills += '</div>';
					}

					row.createddate = app.invoke('util-date', {date: row.createddate, format: 'DD MMM YYYY'});
					achievementsView.add({useTemplate: true}, row)
				});

				achievementsView.add('</div></div>');
			}

			achievementsView.render('#next-steps-next-share-off-chain-application-achievements-view');
		}
	}
});

app.add(
{
	name: 'next-steps-next-share-off-chain-application-achievement-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataScope: 'next-steps-next-share-off-chain-application-achievements',
			dataContext: 'all',
			scope: 'next-steps-next-share-off-chain-application-achievement-edit',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				subject: '',
				description: '',
				contactpersontext: '',
				object: '',
				objectcontext: '',
				skill: '',
				skilltext: '',
				billingstatus: 2
			}
		}

		app.view.refresh(
		{
			scope: 'next-steps-next-share-off-chain-application-achievement',
			selector: '#next-steps-next-share-off-chain-application-achievement-edit-view',
			data: data
		});

		app.invoke('util-view-select',
		{
			container: 'next-steps-next-share-off-chain-application-achievement-edit-skill',
			object: 'setup_contact_attribute',
			fields: [{name: 'title'}]
		});

		app.set(
		{
			scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills',
			context: 'action',
			value: data
		});

		app.invoke('next-steps-next-share-off-chain-application-achievement-edit-skills', param);
	}	
});
	
app.add(
{
	name: 'next-steps-next-share-off-chain-application-achievement-edit-skills',
	code: function (param, response)
	{	
		var achievementActionID = app.get(
		{
			scope: 'next-steps-next-share-off-chain-application-achievement-edit',
			context: 'id'
		});

		if (_.isNotSet(achievementActionID))
		{
			app.invoke('next-steps-next-share-off-chain-application-achievement-edit-skills-show');
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'core_object_link',
					fields: 
					[
						'objectcontext',
						'createddate', 'modifieddate',
						'guid', 'notes'
					],
					filters:
					[
						{
							field: 'object',
							value: app.whoami().mySetup.objects.contactAttribute
						},
						{
							field: 'parentobject',
							value: app.whoami().mySetup.objects.action
						},
						{
							field: 'parentobjectcontext',
							value: achievementActionID
						}
					],
					callback: 'next-steps-next-share-off-chain-application-achievement-edit-skills',
					callbackParam: param
				});
			}
			else
			{
				var skillsActionAttributesLinks = app.set(
				{
					scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills-' + achievementActionID,
					context: 'skills-action-attributes-links',
					value: response.data.rows
				});

				app.set(
				{
					scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills-' + achievementActionID,
					context: 'skills-action-attributes-ids',
					value: _.map(skillsActionAttributesLinks, function (link) {return _.first(_.split(link['notes'], ':'))})
				});

				app.invoke('next-steps-next-share-off-chain-application-achievement-edit-skills-show', param)
			}
		}
	}
});
	
app.add(
{
	name: 'next-steps-next-share-off-chain-application-achievement-edit-skills-show',
	code: function (param, response)
	{	
		var achievementAction = app.get(
		{
			scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills',
			context: 'action'
		});

		var skillsActionAttributesIDs = app.get(
		{
			scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills-' + achievementAction.id,
			context: 'skills-action-attributes-ids'
		});

		var nextStepsTemplate = app.get(
		{
			scope: 'next-steps-next-share-off-chain',
			context: 'application',
			name: '_file'
		});

		var templateSkills = [];

		if (nextStepsTemplate != undefined)
		{
			nextStepsTemplateAttributes = nextStepsTemplate.template.nextsteps.attributes;

			_.each(nextStepsTemplateAttributes, function (nextStepsTemplateAttribute)
			{
				if (_.has(nextStepsTemplateAttribute, 'source.skills'))
				{
					templateSkills = _.concat(templateSkills, _.map(nextStepsTemplateAttribute.source.skills, 'name'));
				}
			});
		}

		if (templateSkills.length == 0)
		{
			app.show('#next-steps-next-share-off-chain-application-achievement-edit-attributes-view',
						'<div class="text-muted p-4">There are no skills associated with this application.</div>');
		}
		else
		{
			if (response == undefined)
			{
				var filters = 
				[
					{
						field: 'hidden',
						value: 'N'
					},
					{
						field: 'title',
						comparison: 'IN_LIST',
						value: templateSkills
					}
				]

				mydigitalstructure.cloud.search(
				{
					object: 'setup_contact_attribute',
					fields: 
					[
						'title', 'guid', 'notes'
					],
					sorts:
					[
						{
							field: 'displayorder'
						},
						{
							field: 'title'
						},
					],
					filters: filters,
					rows: 99999,
					callback: 'next-steps-next-share-off-chain-application-achievement-edit-skills-show',
					callbackParam: param
				});
			}
			else
			{
				var achievementSkills = response.data.rows;

				var skillsView = app.vq.init({queue: 'next-steps-next-share-off-chain-application-achievement-edit-skills-show'});

				skillsView.template(
				[
					'<div class="form-group mb-2">',
						'<div class="row">',
							'<div class="col-1 text-right pt-1 pr-0">',
								'<input type="checkbox" class="myds-check" {{checked}}',
									' data-scope="next-steps-next-share-off-chain-application-achievement-edit-skills-' + achievementAction.id + '"',
									' data-context="attributes"',
									' data-id="{{id}}"',
									' data-action="{{action}}"',
									' data-contactperson="{{contactperson}}"',
									'>',
							'</div>',
							'<div class="col-11">',
								'<div>{{title}}</div>',
								'<div class="text-muted small mb-2">{{notes}}</div>',
							'</div>',
						'</div>',
					'</div>'
				]);

				_.each(achievementSkills, function (skill)
				{
					skill.contactperson = achievementAction.contactperson;
					skill.action = achievementAction.id;
					skill._attributes = _.find(skillsActionAttributesIDs, function (skillsActionAttributeID)
					{
						return (skillsActionAttributeID == skill.id)
					})

					skill.checked = (skill._attributes != undefined ?'checked="checked"':'');
					skillsView.add({useTemplate: true}, skill)
				});

				skillsView.render('#next-steps-next-share-off-chain-application-achievement-edit-attributes-view')
			}
		}
	}
});

app.add(
{
	name: 'next-steps-next-share-off-chain-application-achievement-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'next-steps-next-share-off-chain-application-achievement-edit',
			context: 'id',
			valueDefault: ''
		});

		var nextStepsApplication = app.get(
		{
			scope: 'next-steps-next-share-off-chain',
			context: 'application'
		});

		var data = app.get(
		{
			scope: 'next-steps-next-share-off-chain-application-achievement-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values:
				{
					type: app.whoami().mySetup.actionTypes.achievement,
					billingstatus: 2,
					contactperson: app.whoami().thisInstanceOfMe.user.contactperson,
					object: app.whoami().mySetup.objects.project,
					objectcontext: nextStepsApplication.id
				}
			}
		});

		if (_.isUndefined(response))
		{		
			mydigitalstructure.cloud.save(
			{
				object: 'action',
				data: data,
				callback: 'next-steps-next-share-off-chain-application-achievement-edit-save',
				set: {scope: 'next-steps-next-share-off-chain-application-achievement-edit', data: true, guid: true}
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				var actionID = app.get(
				{
					scope: 'next-steps-next-share-off-chain-application-achievement-edit',
					context: 'id'
				});

				var action = app.get(
				{
					scope: 'next-steps-next-share-off-chain-application-achievement-edit-' + actionID,
				});
	
				app.set(
				{
					scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills',
					context: 'action',
					value: action
				});

				app.invoke('next-steps-next-share-off-chain-application-achievement-edit-skills-save');	
			}
		}
	}
});

app.add(
{
	name: 'next-steps-next-share-off-chain-application-achievement-edit-skills-save',
	code: function (param, response)
	{
		var achievementAction = app.get(
		{
			scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills',
			context: 'action'
		});

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'contact_attribute',
				fields: 
				[
					'attribute'
				],
				filters:
				[
					{
						field: 'contactperson',
						value: achievementAction.contactperson
					}
				],
				callback: 'next-steps-next-share-off-chain-application-achievement-edit-skills-save',
				callbackParam: param
			});
		}
		else
		{
			app.set(
			{
				scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills-' + achievementAction.id,
				context: 'skills-action-contact-attributes',
				value: response.data.rows
			});

			app.set(
			{
				scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills-save-process',
				context: 'achievement-skills-all-index',
				value: 0
			});

			var achievementSkills = app.get(
			{
				scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills-', //+ achievementAction.id
				valueDefault: {}
			});
	
			var achievementSkillsAll = _.concat(
				_.map(achievementSkills['_attributes'], function (attribute) {return {type: 'save', attribute: attribute}}),
			);

			var removeSkills = false;

			if (removeSkills)
			{
				achievementSkillsAll = _.concat(
					_.map(achievementSkills['_attributes-unselected'], function (attribute) {return {type: 'remove', attribute: attribute}}));
			}
	
			app.set(
			{
				scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills-' + achievementAction.id,
				context: 'all',
				value: achievementSkillsAll
			});
		
			app.invoke('next-steps-next-share-off-chain-application-achievement-edit-skills-save-process')
		}
	}
});

app.add(
{
	name: 'next-steps-next-share-off-chain-application-achievement-edit-skills-save-process',
	code: function (param)
	{
		var achievementAction = app.get(
		{
			scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills',
			context: 'action'
		});

		var skillsActionContactAttributes = app.get(
		{
			scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills-' + achievementAction.id,
			context: 'skills-action-contact-attributes'
		});

		var achievementSkillsAll = app.get(
		{
			scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills-' + achievementAction.id,
			context: 'all'
		});

		var achievementSkillsAllIndex = app.get(
		{
			scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills-save-process',
			context: 'achievement-skills-all-index'
		});

		if (achievementSkillsAllIndex < achievementSkillsAll.length)
		{
			var achievementSkill = achievementSkillsAll[achievementSkillsAllIndex];

			var skillsActionContactAttribute = _.find(skillsActionContactAttributes, function (contactAttribute)
			{
				return (contactAttribute.attribute == achievementSkill.attribute)
			});

			if (achievementSkill.type == 'save' && skillsActionContactAttribute == undefined)
			{
				mydigitalstructure.cloud.save(
				{
					object: 'contact_attribute',
					data:
					{
						attribute: achievementSkill.attribute,
						contactperson: achievementAction.contactperson,
						startdate: moment().format('D MMM YYYY')
					},
					callback: 'next-steps-next-share-off-chain-application-achievement-edit-skills-save-next'
				}); 
			}
			else if (achievementSkill.type == 'remove' && skillsActionContactAttribute != undefined)
			{
				/* ONLY IF NOT LINKED BY OTHER ACHEIVEMENT ACTION
				mydigitalstructure.cloud.delete(
				{
					object: 'contact_attribute',
					data: {id: skillsActionContactAttribute['id']},
					callback: 'learning-partner-connections-achievement-edit-skills-save-next'
				}); 
				*/
				app.invoke('next-steps-next-share-off-chain-application-achievement-edit-skills-save-next')
			}
			else
			{
				app.invoke('next-steps-next-share-off-chain-application-achievement-edit-skills-save-next')
			}
		}
		else
		{
			app.invoke('next-steps-next-share-off-chain-application-achievement-edit-skills-save-links');
		}
	}
});

app.add(
{
	name: 'next-steps-next-share-off-chain-application-achievement-edit-skills-save-next',
	code: function (param, response)
	{
		app.set(
		{
			scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills-save-process',
			context: 'achievement-skills-all-index',
			value: function (value) { return numeral(value).value() + 1 }
		});

		app.invoke('next-steps-next-share-off-chain-application-achievement-edit-skills-save-process');
	}
});

app.add(
{
	name: 'next-steps-next-share-off-chain-application-achievement-edit-skills-save-links',
	code: function (param, response)
	{
		var achievementAction = app.get(
		{
			scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills',
			context: 'action'
		});

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'contact_attribute',
				fields: 
				[
					'attribute', 'attributetext'
				],
				filters:
				[
					{
						field: 'contactperson',
						value: achievementAction.contactperson
					}
				],
				callback: 'next-steps-next-share-off-chain-application-achievement-edit-skills-save-links',
				callbackParam: param
			});
		}
		else
		{
			app.set(
			{
				scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills-' + achievementAction.id,
				context: 'skills-action-contact-attributes',
				value: response.data.rows
			});

			app.set(
			{
				scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills-save-links-process',
				context: 'achievement-skills-all-index',
				value: 0
			});

			app.invoke('next-steps-next-share-off-chain-application-achievement-edit-skills-save-links-process');
		}
	}
});

app.add(
{
	name: 'next-steps-next-share-off-chain-application-achievement-edit-skills-save-links-process',
	code: function (param, response)
	{	
		var achievementAction = app.get(
		{
			scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills',
			context: 'action'
		});

		var skillsActionContactAttributes = app.get(
		{
			scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills-' + achievementAction.id,
			context: 'skills-action-contact-attributes'
		});

		var skillsActionAttributesLinks = app.get(
		{
			scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills-' + achievementAction.id,
			context: 'skills-action-attributes-links'
		});
			
		var achievementSkillsAll = app.get(
		{
			scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills-' + achievementAction.id,
			context: 'all'
		});

		var achievementSkillsAllIndex = app.get(
		{
			scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills-save-links-process',
			context: 'achievement-skills-all-index'
		});

		if (achievementSkillsAllIndex < achievementSkillsAll.length)
		{
			var achievementSkill = achievementSkillsAll[achievementSkillsAllIndex];

			var skillsActionContactAttribute = _.find(skillsActionContactAttributes, function (contactAttribute)
			{
				return contactAttribute.attribute == achievementSkill.attribute;
			})

			var skillsActionAttributesLink = _.find(skillsActionAttributesLinks, function (attributeLink)
			{
				return _.first(_.split(attributeLink['notes'], ':')) == achievementSkill.attribute;
			})

			if (achievementSkill.type == 'save' && skillsActionContactAttribute != undefined && skillsActionAttributesLink == undefined)
			{
				mydigitalstructure.cloud.save(
				{
					object: 'core_object_link',
					data:
					{
						object: app.whoami().mySetup.objects.contactAttribute,
						objectcontext: skillsActionContactAttribute['id'],
						parentobject: app.whoami().mySetup.objects.action,
						parentobjectcontext: achievementAction.id,
						notes: skillsActionContactAttribute['attribute'] + ':' + skillsActionContactAttribute['attributetext']
					},
					callback: 'next-steps-next-share-off-chain-application-achievement-edit-skills-save-links-next'
				}); 
			}
			else if (achievementSkill.type == 'remove' && skillsActionAttributesLink != undefined)
			{
				mydigitalstructure.cloud.delete(
				{
					object: 'core_object_link',
					data: {id: skillsActionAttributesLink['id']},
					callback: 'next-steps-next-share-off-chain-application-achievement-edit-skills-save-links-next'
				}); 
			}
			else
			{
				app.invoke('next-steps-next-share-off-chain-application-achievement-edit-skills-save-links-next')
			}
		}
		else
		{
			app.invoke('next-steps-next-share-off-chain-application-achievement-edit-save-finalise')
		}
	}
});
	
app.add(
{
	name: 'next-steps-next-share-off-chain-application-achievement-edit-skills-save-links-next',
	code: function (param, response)
	{
		app.set(
		{
			scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills-save-links-process',
			context: 'achievement-skills-all-index',
			value: function (value) { return numeral(value).value() + 1 }
		});

		app.invoke('next-steps-next-share-off-chain-application-achievement-edit-skills-save-links-process');
	}
});
	
app.add(
{
	name: 'next-steps-next-share-off-chain-application-achievement-edit-save-finalise',
	code: function (param, response)
	{	
		var achievementAction = app.get(
		{
			scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills',
			context: 'action'
		});

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'core_object_link',
				fields: 
				[
					'objectcontext',
					'createddate', 'modifieddate',
					'guid', 'notes', 'objectlink.createduser.guid', 'createdusertext',
					'objectlink.modifieduser.guid', 'modifiedusertext'
				],
				filters:
				[
					{
						field: 'object',
						value: app.whoami().mySetup.objects.contactAttribute
					},
					{
						field: 'parentobject',
						value: app.whoami().mySetup.objects.action
					},
					{
						field: 'parentobjectcontext',
						value: achievementAction.id
					}
				],
				callback: 'next-steps-next-share-off-chain-application-achievement-edit-save-finalise',
				callbackParam: param
			});
		}
		else
		{
			var skills = _.map(response.data.rows, function (row)
			{
				return {
					createddate: row.createddate,
					createdusertext: row.createdusertext,
					createduserguid: row['objectlink.createduser.guid'],
					modifieddate: row.modifieddate,
					modifiedusertext: row.modifiedusertext,
					modifieduserguid: row['objectlink.modifieduser.guid'],
					guid: row.guid,
					skill: _.first(_.split(row['notes'], ':')),
					skilltext: _.last(_.split(row['notes'], ':')),
				}
			});

			var data =
			{
				id: achievementAction.id,
				text: JSON.stringify(skills)
			}

			mydigitalstructure.cloud.save(
			{
				object: 'action',
				data: data,
				callback: 'next-steps-next-share-off-chain-application-achievement-edit-save-complete',
			});
		}
	}
});
	
app.add(
{
	name: 'next-steps-next-share-off-chain-application-achievement-edit-save-complete',
	code: function (param)
	{
		//also add core_protect_ciphertext with action data

		var achievementAction = app.get(
		{
			scope: 'next-steps-next-share-off-chain-application-achievement-edit-skills',
			context: 'action'
		});

		app.notify({message: 'Achievement has been added.'});
		app.invoke('next-steps-next-summary-skills');
		app.invoke('util-view-collapse', {selector: '#next-steps-next-share-off-chain-application-achievement-edit-collapse'})
		app.invoke('next-steps-next-share-off-chain-application-achievements');
	}
});	