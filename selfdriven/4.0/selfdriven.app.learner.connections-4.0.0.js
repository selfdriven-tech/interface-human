/*
	{
    	title: "Learner CONNECTIONS"
  	}
*/

app.add(
{
	name: 'learner-connections',
	code: function (param, response)
	{		
		var relationshipTypes = app.get(
		{
			scope: 'util-setup',
			context: '_relationshipTypes'
		});

		if (response == undefined && relationshipTypes == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'setup_contact_relationship_type',
				fields: ['title'],
				filters: [{field: 'id', comparison: 'IN_LIST', value: app.whoami().mySetup.relationshipTypes.learningPartner}],
				set:
				{
					scope: 'util-setup',
					context: '_relationshipTypes'
				},
				callback: 'learner-connections'
			});
		}
		else
		{
			var typesView = app.vq.init({queue: 'learner-connections-types'});
			typesView.template(
			[
				'<li>',
					'<a href="#" class="myds-dropdown dropdown-item" data-id="{{id}}">',
					'{{title}}',
					'</a>',
				'</li>'
			]);

			typesView.add(
			[
				'<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" id="learner-teams-types-filter" aria-expanded="false">',
					'<span class="dropdown-text">All</span>',
				'</button>',
				'<ul class="dropdown-menu mt-1"',
					'data-controller="learner-connections-dashboard"',
					'data-context="type"',
				'>',
				'<li>',
					'<a href="#" class="myds-dropdown dropdown-item" data-id="-1">',
					'All',
					'</a>',
				'</li>'
			]);

			_.each(relationshipTypes, function (relationshipType)
			{
				typesView.add({useTemplate: true}, relationshipType)
			});

			typesView.add('</ul>');

			typesView.render('#learner-connections-types');

			app.invoke('learner-connections-dashboard');
		}
	}
});

app.add(
{
	name: 'learner-connections-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learner-connections-dashboard',
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
						field: 'relationship.othercontactperson.firstname',
						comparison: 'TEXT_IS_LIKE',
						value: data.search
					},
					{
						name: 'or'
					},
					{	
						field: 'relationship.othercontactperson.surname',
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
							field: 'type',
							value: data.type
						}
					]);
				}
			}

			filters.push(
			{
				field: 'contactperson',
				value: app.whoami().thisInstanceOfMe.user.contactperson
			});

			mydigitalstructure.cloud.search(
			{
				object: 'contact_relationship',
				fields:
				[
					'relationship.othercontactperson.firstname',
					'relationship.othercontactperson.surname',
					'relationship.othercontactperson.email',
					'relationship.othercontactperson.guid',
					'guid',
					'createddate',
					'startdate',
					'typetext'
				],
				filters: filters,
				sorts:
				[
					{
						field: 'relationship.othercontactperson.firstname',
						direction: 'asc'
					}
				],
				callback: 'learner-connections-dashboard'
			})
		}
		else
		{
			var connectionsView = app.vq.init({queue: 'learner-connections-dashboard'});

			if (response.data.rows.length == 0)
			{
				connectionsView.add(
				[
					'<div class="text-muted text-center">',
						'You do not have any connections that match this search.',
					'</div>'
				]);
			}
			else 
			{
				connectionsView.template(
				[
					'<div class="col-sm-12 px-0 mb-3 mt-0">',
						'<div class="card">',
							'<div class="card-body py-3">',
								'<div class="row mr-0">',
									'<div class="col-10">',
										'<h3 class="mt-1 mb-1">{{relationship.othercontactperson.firstname}} {{relationship.othercontactperson.surname}}</h3>',
										'<div class="small">{{typetext}}</div>',
									'</div>',
									'<div class="col-2 text-right pr-0">',
										'<a class="btn btn-link btn-sm text-muted myds-collapse-toggle"',
											' data-toggle="collapse" role="button"',
											' href="#learner-connections-dashboard-collapse-{{relationship.othercontactperson.guid}}"',
										'>',
											'<i class="fa fa-chevron-down text-muted"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="collapse myds-collapse" id="learner-connections-dashboard-collapse-{{relationship.othercontactperson.guid}}"',
								'data-controller="learner-connections-dashboard-show"',
								'data-guid="{{relationship.othercontactperson.guid}}">',
								'{{contactinfo}}',
								'<div class="card-body pt-1 pb-2 px-4 border-top">',

									'<h3 class="mb-1 mt-4">Endorsements</h3>',
									'<div class="pt-3" id="learner-connections-dashboard-view-{{relationship.othercontactperson.guid}}-endorsements">',
									'</div>',

									'<h3 class="mt-4 mb-1">Reflections</h3>',
									'<div class="text-muted small mb-1">By learning partner for you; on your growth & for your growth.</div>',
									'<div class="pt-3" id="learner-connections-dashboard-view-{{relationship.othercontactperson.guid}}-reflections">',
									'</div>',
								
									'<h3 class="mb-1 mt-4">Skills</h3>',
									'<div class="text-muted small mb-1">Assigned by learning partner as achievements.</div>',
									'<div class="pt-3" id="learner-connections-dashboard-view-{{relationship.othercontactperson.guid}}-skills">',
									'</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);

				connectionsView.add(
				[
					'<div class="px-0">',
						'<div class="row">'
				]);

				_.each(response.data.rows, function (row)
				{
					row.contactinfo = '';

					if (row['relationship.othercontactperson.email'] != '')
					{
						row.contactinfo += '<div class="card-body pt-1 pb-4 px-4">' + 
												'<i class="fa fa-envelope mr-1 text-muted"></i><a class="text-muted" href="mailto:' + row['relationship.othercontactperson.email'] + '">' +
												row['relationship.othercontactperson.email'] + '</a>' +
											'</div>';
					}

					connectionsView.add({useTemplate: true}, row)
				});

				connectionsView.add('</div></div>');
			}

			connectionsView.render('#learner-connections-view');
		}
	}
});

app.add(
{
	name: 'learner-connections-dashboard-show',
	code: function (param, response)
	{
		var otherContactPersonGUID = app._util.param.get(param.dataContext, 'guid').value;

		if (response == undefined)
		{
			app.invoke('learner-connections-dashboard-show-reflections', param);
			app.invoke('learner-connections-dashboard-show-skills', param);

			mydigitalstructure.cloud.search(
			{
				object: 'action',
				fields: ['createdusertext', 'createddate', 'guid', 'text', 'description', 'action.createduser.contactpersontext', 'subject'],
				filters:
				[
					{	
						field: 'contactperson',
						comparison: 'EQUAL_TO',
						value: app.whoami().thisInstanceOfMe.user.contactperson
					},
					{	
						field: 'action.createduser.contactperson.guid',
						comparison: 'EQUAL_TO',
						value: otherContactPersonGUID
					},
					{	
						field: 'actiontype',
						comparison: 'IN_LIST',
						value: app.whoami().mySetup.actionTypes.recognition
					}
				],
				callback: 'learner-connections-dashboard-show',
				callbackParam: param
			});
		}
		else
		{
			var connectionsDashboardView = app.vq.init({queue: 'learner-connections-dashboard-show'});

			if (response.data.rows.length == 0)
			{
				connectionsDashboardView.add(
				[
					'<div class="mb-2 text-muted font-italic small">No endorsements at this moment.</div>'
				]);
			}
			else
			{
				connectionsDashboardView.template(
				[
					'<li class="mb-2">',
            		'<div class="font-weight-bold">{{subject}}</div>',
					'<div class="text-muted small">{{description}}</div>',
					'</li>'
				]);

				connectionsDashboardView.add('<ul class="list-group mb-2 ml-4 mt-0">')

				_.each(response.data.rows, function (row)
				{
					row.createddate = app.invoke('util-date', {date: row.createddate, format: 'DD MMM YYYY'});
					connectionsDashboardView.add({useTemplate: true}, row)
				});

				connectionsDashboardView.add('</ul>')
			}
           
         connectionsDashboardView.add(
			[
				  '<button type="button" class="btn btn-sm btn-link px-0 mb-2 myds-navigate" data-controller="learner-endorsements-request">',
				  		'Request',
              '</button>'
			]);
                                                    
			connectionsDashboardView.render('#learner-connections-dashboard-view-' + otherContactPersonGUID + '-endorsements');
		}
	}
});

app.add(
{
	name: 'learner-connections-dashboard-show-reflections',
	code: function (param, response)
	{
		var otherContactPersonGUID = app._util.param.get(param.dataContext, 'guid').value;

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'action',
				fields: ['createdusertext', 'createddate', 'description', 'guid', 'text', 'action.createduser.contactpersontext', 'subject'],
				filters:
				[
					{	
						field: 'contactperson',
						comparison: 'EQUAL_TO',
						value: app.whoami().thisInstanceOfMe.user.contactperson
					},
					{	
						field: 'action.createduser.contactperson.guid',
						comparison: 'EQUAL_TO',
						value: otherContactPersonGUID
					},
					{	
						field: 'actiontype',
						comparison: 'IN_LIST',
						value: app.whoami().mySetup.actionTypes.reflectionByLearningPartner
					}
				],
				callback: 'learner-connections-dashboard-show-reflections',
				callbackParam: param
			});
		}
		else
		{
			var connectionsDashboardReflectionsView = app.vq.init({queue: 'learner-connections-dashboard-show-reflections'});

			if (response.data.rows.length == 0)
			{
				connectionsDashboardReflectionsView.add(
				[
					'<div class="mb-2 text-muted font-italic small">No reflections at this moment.</div>'
				]);
			}
			else
			{
				connectionsDashboardReflectionsView.template(
				[
					'<li class="mb-2">',
            		'<div class="font-weight-bold">{{subject}}</div>',
					'<div class="text-muted small">{{description}}</div>',
					'</li>'
				]);

				connectionsDashboardReflectionsView.add('<ul class="list-group mb-2 ml-4 mt-0">')

				_.each(response.data.rows, function (row)
				{
					connectionsDashboardReflectionsView.add({useTemplate: true}, row)
				});

				connectionsDashboardReflectionsView.add('</ul>')
			}

			connectionsDashboardReflectionsView.add(
			[
				  '<button type="button" class="btn btn-sm btn-link px-0 mb-2 myds-navigate" data-controller="learner-reflections-request">',
				  		'Request',
              '</button>'
			]);
                                                  
			connectionsDashboardReflectionsView.render('#learner-connections-dashboard-view-' + otherContactPersonGUID + '-reflections');
		}
	}
});

app.add(
{
	name: 'learner-connections-dashboard-show-skills',
	code: function (param, response)
	{
		var otherContactPersonGUID = app._util.param.get(param.dataContext, 'guid').value;

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'contact_attribute',
				fields: ['attributetext', 'createddate', 'guid', 'notes'],
				filters:
				[
					{	
						field: 'attribute.createduser.contactperson.guid',
						comparison: 'EQUAL_TO',
						value: otherContactPersonGUID
					},
					{	
						field: 'attribute.contactperson',
						comparison: 'EQUAL_TO',
						value: app.whoami().thisInstanceOfMe.user.contactperson
					}
				],
				callback: 'learner-connections-dashboard-show-skills',
				callbackParam: param
			});
		}
		else
		{
			var connectionsDashboardSkillsView = app.vq.init({queue: 'learner-connections-dashboard-show-skills'});

			if (response.data.rows.length == 0)
			{
				connectionsDashboardSkillsView.add(
				[
					'<div class="mb-2 text-muted font-italic small">No registered achievements at this moment.</div>'
				]);
			}
			else
			{
				connectionsDashboardSkillsView.template(
				[
					'<li class="mb-2">',
	            	'<div class="font-weight-bold">{{attributetext}}</div>',
	             	'<div class="text-muted small">{{notes}}</div>',
					'</li>'
				]);

				connectionsDashboardSkillsView.add('<ul class="list-group mb-2 ml-4 mt-0">')

				_.each(response.data.rows, function (row)
				{
					connectionsDashboardSkillsView.add({useTemplate: true}, row)
				});

				connectionsDashboardSkillsView.add('</ul>')
			}

			connectionsDashboardSkillsView.add(
			[
				  '<button type="button" class="btn btn-sm btn-link px-0 mb-2 myds-navigate" data-controller="learner-achievements-request">',
				  		'Request',
              '</button>'
			]);
                                                  
			connectionsDashboardSkillsView.render('#learner-connections-dashboard-view-' + otherContactPersonGUID + '-skills');
		}
	}
});

app.add(
{
	name: 'learner-connection-summary',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learner-community-team-summary',
			context: 'id',
			valueDefault: ''
		});

		var data = app.find(
		{
			dataController: 'learner-teams',
			dataContext: 'all',
			controller: 'learner-community-team-summary',
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
			scope: 'learner-community-team-summary',
			selector: '#learner-community-team-summary',
			data: data
		});
	}	
});

// CONNECTIONS; REQUESTS;

app.add(
{
	name: 'learner-connections-request',
	code: function (param)
	{
		app.invoke('learner-connections-request-show');
	}
});

app.add(
{
	name: 'learner-connections-request-show',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learner-connections-request',
			valueDefault: {}
		});

		var filters =
		[
			{
				field: 'primarygroup',
				value: app.whoami().mySetup.personGroups.learningPartner
			}
		];

		if (!_.isEmpty(data.search))
		{
			filters = _.concat(
			[
				{	
					field: 'firstname',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{
					name: 'or'
				},
				{	
					field: 'lastname',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				}
			]);
		}

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'contact_person',
				fields:
				[
					'firstname',
					'surname',
					'notes',
					'email',
					'guid',
					'_profileimage',
					'contactperson.user.id'

				],
				filters: filters,
				rows: 99999,
				sorts:
				[
					{
						field: 'firstname',
						direction: 'asc'
					}
				],
				callback: 'learner-connections-request-show'
			});
		}
		else
		{
			var learningPartnersView = app.vq.init({queue: 'learner-connections-request-learning-partners'});

			if (response.data.rows.length == 0)
			{
				learningPartnersView.add(
				[
					'<div class="text-muted text-center">',
						'There are no learning partners that match this search.',
					'</div>'
				]);
			}
			else 
			{
				learningPartnersView.template(
				[
					'<div class="col-sm-6 mb-4 mt-1">',
						'<div class="card">',
							'<div class="card-body bg-light text-dark">',
								'<img style="height:30px; width:30px;" class="img-fluid rounded-circle float-left" src="{{_profileimage}}">',
								'<h3 class="my-0 float-left ml-2 mt-1 myds-navigate" ',
										'data-id="{{guid}}" data-controller="learner-profile"',
										'data-context="{{guid}}">',
									'{{firstname}} {{surname}}',
								'</h3>',
							'</div>',
							'<div class="card-body">',
								'<div class="mb-3 {{myds-hide-if-empty-emaillink}}">{{emaillink}}</div>',
								'<div class="mb-3 text-muted {{myds-hide-if-empty-notes}}">{{notes}}</div>',
								'{{requestaction}}',
							'</div>',
						'</div>',
					'</div>'
				]);

				learningPartnersView.add(
				[
					'<div class="px-0">',
						'<div class="row">'
				]);

				_.each(response.data.rows, function (row)
				{
					if (row['_profileimage'] == '')
					{
						row['_profileimage'] = app.whoami().mySetup.images.profileLearningPartner;
					}
				
					row._email = '';
					row.emailcaption = '';
					if (row.email != '')
					{
						row.emaillink = '<a href="mailto:' + row.email + '">' + row.email + '</a>';
						row._email = _.split(row.email, '@');
						row.emailcaption = '<div>' + _.first(row._email) + '</div>' +
													'<div>@' + _.last(row._email) + '</div>';
					}

					row.requestaction = '<div class="text-muted">This learning partner does not have a selfdriven.cloud account.</div>';

					if (row['contactperson.user.id'] != '')
					{
						row.requestaction = '<button type="button" class="btn btn-sm btn-white mb-2 myds-click" ' +
												' data-controller="learner-connections-request-send"' +
												' data-id="' + row.id + '"' +
												' data-context="' + row.guid + '" data-spinner' +
												'>Send Request To Connect</button>';
					}

					learningPartnersView.add({useTemplate: true}, row);
				});

				learningPartnersView.add('</div></div>');
			}

			learningPartnersView.render('#learner-connections-request-view');
		}
	}
});

app.add(
{
	name: 'learner-connections-request-send',
	code: function (param, response)
	{
		//Just do for now - email later
		console.log(param)

		var requestSendData = app.get(
		{
			scope: 'learner-connections-request-send'
		});

		if (response == undefined)
		{
			//todo; set type based on the type of learning partner
			var type = app.whoami().mySetup.relationshipTypes.learningPartnerProfessionalLearningFacilitator;

			var data =
			{
				othercontactperson: requestSendData.id,
				contactperson: app.whoami().thisInstanceOfMe.user.contactperson,
				type: type,
				startdate: moment().format('D MMM YYYY')
			}

			mydigitalstructure.cloud.save(
			{
				object: 'contact_relationship',
				data: data,
				callback: 'learner-connections-request-send'
			});
		}
		else
		{
			app.invoke('util-view-spinner-remove-all');
			app.invoke('learner-connections-request-show');
		}
	}
});

