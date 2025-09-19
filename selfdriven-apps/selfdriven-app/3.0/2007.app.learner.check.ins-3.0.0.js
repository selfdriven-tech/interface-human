/*
	{
    	title: "Learner; Check-Ins (Projects)", 	
    	design: "https://www.selfdriven.foundation"
  	}
*/

app.add(
{
	name: 'learner-check-ins',
	code: function (param, response)
	{
		app.invoke('learner-check-ins-dashboard')
	}
});

app.add(
{
	name: 'learner-check-ins-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learner-check-ins-dashboard',
			valueDefault: {}
		});

		var filters =
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
		];

		if (!_.isEmpty(data.search))
		{
			filters = _.concat(filters,
			[
				{	
					field: 'reference',
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
				}
			]);
		}

		app.invoke('util-view-table',
		{
			object: 'project',
			container: 'learner-check-ins-dashboard-view',
			context: 'learner-check-ins',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">You have no check-ins that match this search.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this check-in?',
					position: 'left'
				}
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
					method: function (row)
					{
						row.startdate = app.invoke('util-view-date-clean', row.startdate);
					}
				},

				columns:
				[
					{
						caption: 'Description',
						field: 'description',
						defaultSort: true,
						sortBy: true,
						class: 'col-8 col-sm-4 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="learner-check-in-summary"'
					},
					{
						caption: 'Date',
						field: 'startdate', 	
						sortBy: true,
						class: 'col-4 col-sm-3 text-center myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="learner-check-in-summary"'
					},
					{
						caption: 'Status',
						field: 'statustext', 	
						sortBy: true,
						class: 'col-0 col-sm-3 d-none d-sm-block myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="learner-check-in-summary"'
					},
					{
						caption: 'Check ID',
						field: 'reference', 	
						sortBy: true,
						class: 'col-0 col-sm-2 d-none d-sm-block myds-navigate text-muted',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="learner-check-in-summary"'
					},
					{	
						fields:
						[
							'type', 'notes', 'guid', 'typetext', 'category', 
							'parentproject', 'parentprojecttext', 'projectmanager', 'restrictedtoteam',
							'project.parentproject.description', 'status', 'subtypetext'
						]
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'learner-check-in-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'learner-check-in-summary',
			context: 'id'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'learner-check-ins'});
		}
		else
		{
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
						'parentproject', 'parentprojecttext', 'projectmanager', 'restrictedtoteam',
						'project.parentproject.description',
						'startdate', 'enddate', 'sourceprojecttemplate',
						'guid', 'status', 'statustext'
					],
					filters:
					[
						{
							field: 'guid',
							value: guid
						}
					],
					set: 
					{
						scope: 'learner-project-check-ins',
						context: 'all'
					},
					callback: 'learner-check-in-summary'
				});
			}
			else
			{
				if (response.status == 'OK')
				{
					if (response.data.rows.length == 0)
					{}
					else
					{
						var data = _.first(response.data.rows);
						data.startdate = app.invoke('util-view-date-clean', data.startdate);

						app.set(
						{
							scope: 'learner-check-in-summary',
							context: 'dataContext',
							value: data
						});

						app.view.refresh(
						{
							scope: 'learner-check-in-summary',
							selector: '#learner-check-in-summary',
							data: data,
							collapse:
							{
								contexts:
								[
									'tasks', 'linked-projects', 'attachments', 'actions',
									'team-edit', 'tasks-edit', 'linked-projects-edit', 'attachments-edit', 'actions-edit'
								]
							}
						});

						app.invoke('learner-check-in-summary-reflections');

						/*
						app.invoke('util-attachments-initialise',
						{
							context: 'learner-check-in-summary',
							object: app.whoami().mySetup.objects.project,
							objectContext: data.id,
							showTypes: false
						});
				
						var actionTypes = app.whoami().mySetup.actionTypes;
				
						app.invoke('util-actions-initialise',
						{
							context: 'learner-check-in-summary',
							object: app.whoami().mySetup.objects.project,
							objectContext: data.id,
							showTypes: false,
							headerCaption: 'Updates, Reflections & Fitness Feedback',
							types:
							[
								{
									id: actionTypes.reflectionBySelfOnGrowth,
									text: 'Reflection by self on growth'
								},
								{
									id: actionTypes.reflectionBySelfForGrowth,
									text: 'Reflection by self for growth'
								},
								{
									id: actionTypes.accountabilityFitForPurpose,
									text: 'Fit for Purpose Feedback'
								},
								{
									id: actionTypes.accountabilityUnfitForPurpose,
									text: 'Unfit for Purpose Feedback'
								}
							]
						});
						*/
					}
				}
			}
		}
	}	
});

app.add(
{
	name: 'learner-check-in-summary-team',
	code: function (param, response)
	{	
		var projectID = app._util.param.get(param.dataContext, 'project').value;
		var scope = app._util.param.get(param.dataContext, 'scope').value;
		var context = app._util.param.get(param.dataContext, 'context').value;
		var selector = app._util.param.get(param.dataContext, 'selector').value;
		var viewStatus = app._util.param.get(param, 'status', {default: 'shown'}).value;
		var show = (viewStatus == 'shown');

		var userRole = app.whoami().thisInstanceOfMe.userRole;
		if (context == undefined) {context = 'learner-check-in-summary'}
		
		var project;

		if (context != undefined)
		{
			project = app.get({scope: context, context: 'dataContext'})
		}

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
			scope = 'learner-check-in-summary-team'
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
			selector = 'learner-check-in-summary-team-view'
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
						class: 'col-4 col-sm-2 text-break text-wrap myds-click'
					},
					{
						caption: 'Last Name',
						field: 'projectteam.contactperson.surname',
						sortBy: true,
						class: 'col-4 col-sm-2 text-break text-wrap myds-click'
					},
					{
						caption: 'Role',
						field: 'projectroletext',
						sortBy: true,
						defaultSort: true,
						class: 'col-4 col-sm-3 text-break text-wrap myds-click'
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
						class: 'col-sm-1 text-center'
					});
				}
				else
				{
					columns = _.concat(columns,
					{
						caption: 'Left The Team',
						field: 'enddate',
						sortBy: true,
						class: 'col-0 col-sm-2 d-none d-sm-block text-break text-wrap myds-click'
					});
				}
	
				app.invoke('util-view-table',
				{
					object: 'project_team',
					container: selector,
					context: 'util-project-team',
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
							controller: 'learner-check-in-summary-team-delete-ok'
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
							controller: 'learner-check-in-summary-team-format'
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
	name: 'learner-check-in-summary-team-format',
	code: function (row)
	{
		row.name = row['projectteam.contactperson.firstname'] + ' ' +
					row['projectteam.contactperson.surname'];

		row['dateleft-leaveteam'] = row.enddate;
		
		if (_.isNotSet(row['dateleft-leaveteam']))
		{
			row['dateleft-leaveteam'] = '<button class="btn btn-white btn-sm myds-click"' +
										' id="learner-check-in-summary-team-leave-team-' + row.id +
										'" data-id="' + row.id + '"' +
										'" data-controller="learner-check-in-summary-team-leave-ok"' +
										'">Leave</button>';
		}
	}
});

app.add(
{
	name: 'learner-check-in-summary-team-edit',
	code: function (param)
	{	
		var context = app._util.param.get(param.dataContext, 'context').value;

		app.invoke('util-view-select',
		{
			container: 'learner-check-in-summary-team-edit-contactperson',
			object: 'contact_person',
			fields: [{name: 'firstname'}, {name: 'surname'}]
		});

		app.invoke('util-view-select',
		{
			container: 'learner-check-in-summary-team-edit-projectrole',
			object: 'setup_project_role',
			fields: [{name: 'title'}]
		});
	}
});

app.add(
{
	name: 'learner-check-in-summary-team-edit-save',
	code: function (param, response)
	{	
		var context = app._util.param.get(param.dataContext, 'context').value;

		var projectID = app.get(
		{
			scope: context,
			context: 'dataContext',
			name: 'id',
			valueDefault: ''
		});

		var id = app.get(
		{
			controller: 'learner-check-in-summary-team',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			controller: 'learner-check-in-summary-team-edit',
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
				callback: 'learner-check-in-summary-team-edit-save',
				callbackParam: param
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Added to this check-in team.');
				//$('#admin-community-project-summary-team-edit-collapse').removeClass('show');
				//app.invoke('app-navigate-to', {controller: 'admin-community-project-summary', context: data.project});
				//app.invoke('app-navigate-to', {controller: 'admin-community-projects', context: data.project});
				app.invoke('learner-check-in-summary-team', param)
			}
		}
	}
});
	
app.add(
{
	name: 'learner-check-in-summary-team-delete-ok',
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
					callback: 'learner-check-in-summary-team-delete-ok'
				});
			}	
		}
		else
		{
			if (response.status == 'OK')
			{
				app.notify('Removed from team.');
				app.invoke('learner-check-in-summary-team', {});
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
	name: 'learner-check-in-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataScope: 'learner-check-ins',
			dataContext: 'all',
			scope: 'learner-check-in-edit',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				reference: '',
				type: '',
				typetext: '',
				description: '',
				category: '',
				categorytext: '',
				parentproject: '',
				parentprojecttext: '',
				status: '',
				statustext: ''
			}
		}

		app.view.refresh(
		{
			scope: 'learner-check-in-edit',
			selector: '#learner-check-in-edit',
			data: data
		});

		app.invoke('util-view-select',
		{
			container: 'learner-check-in-edit-status-' + data.id,
			object: 'setup_project_status',
			fields: [{name: 'title'}]
		});
	}	
});

app.add(
{
	name: 'learner-check-in-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			controller: 'learner-check-in-edit',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'learner-check-in-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values:
				{
					datareturn: 'reference,typetext',
					restrictedtoteam: 'Y',
					type: app.whoami().mySetup.projectTypes.management,
					subtype: app.whoami().mySetup.projectSubTypes.managementCheckIn,
					projectmanager: app.whoami().thisInstanceOfMe.user.id,
					contactperson: app.whoami().thisInstanceOfMe.user.contactperson,
					status: app.whoami().mySetup.projectStatuses.inProgress
				}
			}
		});

		if (_.isUndefined(response))
		{
			mydigitalstructure.cloud.save(
			{
				object: 'project',
				data: data,
				callback: 'learner-check-in-edit-save'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				if (_.has(response, 'data'))
				{
					app.invoke('learner-check-in-edit-save-reference', param, response)
				}
				else
				{
					app.invoke('learner-check-in-edit-save-finalise')
				}
			}
		}
	}
});

app.add(
{
	name: 'learner-check-in-edit-save-reference',
	code: function (param, response)
	{	
		if (response != undefined)
		{
			var data =
			{
				id: response.id
			}

			var dataReturn = _.first(response.data.rows);
			
			data.reference = _.replace(dataReturn.reference, 'PRJ00', _.first(dataReturn.typetext));

			mydigitalstructure.cloud.save(
			{
				object: 'project',
				data: data,
				callback: 'learner-check-in-edit-save-finalise',
				set: {scope: 'learner-check-in-edit'}
			});
		}
	}
});

app.add(
{
	name: 'learner-check-in-edit-save-finalise',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learner-check-in-edit',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'learner-check-in-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values: {datareturn: 'reference,typetext,guid'}
			}
		});

		app.notify({message: 'Check-in has been ' + (id==''?'added':'updated') + '.'});

		app.invoke('util-view-refresh',
		{
			dataScope: 'learner-check-ins',
			data: data
		});

		app.invoke('app-navigate-to', {controller: 'learner-check-in-summary', context: data.guid});
	}
});

// LEARNER; CHECK-INS; REFLECTIONS

app.add(
{
	name: 'learner-check-in-summary-reflections',
	code: function (param, response)
	{
		var checkInView = app.get(
		{
			scope: 'learner-check-in-summary-reflections',
			context: 'view',
			valueDefault: 'list'
		});
		
		app.invoke('learner-check-in-summary-reflections-' + checkInView)
	}
});

app.add(
{
	name: 'learner-check-in-summary-reflections-list',
	code: function (param, response)
	{
		var checkIn = app.get(
		{	
			scope: 'learner-check-in-summary',
			context: 'dataContext'
		});

		var checkInCategory = app.get(
		{
			scope: 'learner-check-in-summary-reflections-attributes-category',
			context: 'category',
			valueDefault: 'general'
		});

		var category = app.whoami().mySetup.structures.me.categories[checkInCategory];
		var elements = _.filter(app.whoami().mySetup.structureElements, function (element) {return element.category == category});

		var whoamiUser = app.whoami().thisInstanceOfMe.user;

		if (response == undefined)
		{
			var fields = ['id', 'createddate', 'createdusertext', 'createduser', 'action.createduser.contactpersontext']

			if (elements != undefined)
			{
				fields = _.concat(fields, _.map(elements, 'alias'))
			}

			var filters =
			[
				{
					field: 'contactperson',
					value: whoamiUser.contactperson
				},
				{
					field: 'type',
					comparison: 'IN_LIST',
					value: app.whoami().mySetup.actionTypes.profileAttributesUpdate + ',' +
								app.whoami().mySetup.actionTypes.reflection
				}
			]

			if (_.isSet(checkIn.startdate))
			{
				filters = _.concat(filters,
				[
					{
						field: 'createddate',
						comparison: 'LESS_THAN_OR_EQUAL_TO',
						value: checkIn.startdate
					},
					{
						field: 'createddate',
						comparison: 'GREATER_THAN_OR_EQUAL_TO',
						value: app.invoke('util-date', {modify: {months: -6}})
					}
				])
			}

			mydigitalstructure.cloud.search(
			{
				object: 'action',
				fields: fields,
				filters: filters,
				sorts:
				[
					{
						field: 'createddate'
					}
				],
				callback: 'learner-check-in-summary-reflections-list'
			});
		}
		else
		{
			if (response.status == 'OK')
			{
				var reflections = app.set(
				{
					scope: 'learner-check-in-summary-reflections',
					context: 'all',
					value: response.data.rows
				});

				reflectionsView = app.vq.init({queue: 'learner-check-in-summary-reflections'});

				reflectionsView.template(
				[
					'<tr class="d-flex">',
						'<td class="text-center col-4">{{attribute}}</td>',
						'<td class="text-center col-4 px-5" id="learner-check-in-summary-reflections-by-self-{{id}}">{{reflectionsBySelf}}</td>',
						'<td class="text-center col-4 px-5" id="learner-check-in-summary-reflections-by-other-{{id}}">{{reflectionsByOthers}}</td>',
					'</tr>'
				]);

				reflectionsView.add(
				[
					'<table class="table">',
						'<thead>',
							'<tr class="d-flex">',
								'<th class="text-center col-4">Attribute</th>',
								'<th class="text-center col-4">By Self</th>',
								'<th class="text-center col-4">By Learning Partners</th>',
							'</tr>',
						'</thead>',
						'<tbody>'
				]);

				_.each(elements, function (element)
				{
					element.attribute = 
						'<div>' + element['title'] + '</div>';

					if (element['title'] != element['caption'])
					{
						element.attribute += '<div class="text-muted small">' + element['caption'] + '</div>';
					}

					element._reflectionsByOthers = _.filter(reflections, function (reflection)
					{
						return reflection[element.alias] != '' && reflection.createduser != whoamiUser.id;
					});

					element.reflectionsByOthers =
					_.join(
						_.map(element._reflectionsByOthers, function (reflection) 
						{
							return '<div class="progress progress-small w-100 mx-auto">' +
										'<div class="progress-bar" style="width:' + reflection[element.alias] + '%;" role="progressbar"' +
											' aria-valuenow="' + reflection[element.alias] + '" aria-valuemin="0" aria-valuemax="100"></div>' +
									'</div>' +
									'<div class="text-muted small d-none">' +
										reflection['action.createduser.contactpersontext'] + ', ' + app.invoke('util-view-date-format', {date: reflection['createddate'], format: 'D MMM YYYY'}) +
									'</div>'
						}),
					'');

					element._reflectionsByOthersValues = _.map(element._reflectionsByOthers, function (reflection) 
					{
						return numeral(reflection[element.alias]).value();
					});

					if (element._reflectionsByOthers.length != 0)
					{
						element._reflectionsByOthersValue = _.mean(element._reflectionsByOthersValues);
					}

					element._reflectionsBySelf = _.filter(reflections, function (reflection)
					{
						return reflection[element.alias] != '' && reflection.createduser == whoamiUser.id;
					});

					if (element._reflectionsBySelf.length != 0)
					{
						element.reflectionsBySelfValue = _.last(element._reflectionsBySelf)[element.alias];
						element._reflectionsBySelfValue = numeral(element.reflectionsBySelfValue).value();

						element.class = '';

						if (element._reflectionsByOthersValue != undefined)
						{
							if (Math.abs(element._reflectionsBySelfValue - element._reflectionsByOthersValue) > 20)
							{
								element.class = 'bg-warning'
							}

							if (Math.abs(element._reflectionsBySelfValue - element._reflectionsByOthersValue) > 50)
							{
								element.class = 'bg-danger'
							}
						}

						element.reflectionsBySelf =
								'<div class="progress progress-small w-100 mx-auto">' +
									'<div class="progress-bar ' + element.class + '" style="width:' + element.reflectionsBySelfValue + '%;" role="progressbar"' +
									' aria-valuenow="' + element.reflectionsBySelfValue + '" aria-valuemin="0" aria-valuemax="100"></div>' +
								'</div>';
					}
					else
					{
						element.reflectionsBySelf = '<div class="text-muted">-</div>'
					}

					reflectionsView.add({useTemplate: true}, element);
				})

				reflectionsView.add('</tbody></table>');

				app.set(
				{
					scope: 'learner-check-in-summary-reflections',
					context: 'elements-reflections',
					value: elements
				});
	
				reflectionsView.render('#learner-check-in-summary-reflections-view');
			}
		}
	}
});

app.add(
{
	name: 'learner-check-in-summary-reflections-visual',
	notes: 'https://gionkunz.github.io/chartist-js/api-documentation.html#chartistbar-function-bar',
	code: function (param, response)
	{
		var containerSelector = '#learner-check-in-summary-reflections-view';
		var data = app.get(
		{	
			scope: 'learner-check-in-summary',
			context: 'dataContext'
		});

		var elementsReflections = app.get(
		{
			scope: 'learner-check-in-summary-reflections',
			context: 'elements-reflections'
		});
		
		var checkInCategory = app.get(
		{
			scope: 'learner-check-in-summary-reflections-attributes-category',
			context: 'category',
			valueDefault: 'general'
		});

		var category = app.whoami().mySetup.structures.me.categories[checkInCategory];
		var elementsReflections = _.filter(elementsReflections, function (element) {return element.category == category});

		var labels = [];

		var series =
		[
			{name: 'self', caption: 'By Self', data: [], color: 'blue'},
			{name: 'others', caption: 'By Others', data: []}
		];

		//seriesData = _.reverse(seriesData)
		
		_.each(elementsReflections, function (elementsReflection)
		{
			labels.push(elementsReflection.title)
			series[0].data.push(elementsReflection._reflectionsBySelfValue);
			series[1].data.push(elementsReflection._reflectionsByOthersValue)
		});

		var chartData =
		{
			labels: labels,
  			series: series
		};

		var chartOptions =
		{
			type: 'Line',
			height: 600,
			chartPadding: 30,
			fullwidth: true,
			axisY:
			{
				onlyInteger: true,
				high: 100
			},
			axisX:
			{
				offset: 20
			},
			series: {}
		}

		_.each(series, function (_series, s)
		{
			if (s==0)
			{
				chartOptions.series[_series.name] =
				{
					showArea: true
				}
			}
		})

		app.invoke('util-view-chart-show',
		{	
			containerSelector: containerSelector,
			chartOptions: chartOptions,
			chartData: chartData,
			foreignObjects: true,
			legend: true,
			reverseLegend: false,
			reverseLegendView: false
		},
		data);
	}
});
	
app.add(
{
	name: 'learner-check-in-summary-notes-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learner-check-in-summary',
			context: 'dataContext',
			name: 'id'
		});
	
		var data = app.get(
		{
			scope: 'learner-check-in-summary',
			cleanForCloudStorage: true
		});

		if (data.notes != undefined)
		{
			if (_.isUndefined(response))
			{
				mydigitalstructure.cloud.save(
				{
					object: 'project',
					data: {id: id, notes: data.notes},
					callback: 'learner-check-in-summary-notes-save'
				});
			}
			else
			{	
				if (response.status == 'OK')
				{
					app.invoke('util-view-refresh',
					{
						dataScope: 'learner-check-ins',
						data: {id: id, notes: data.notes}
					});

					app.notify({message: 'Notes updated for this check-in.'})
				}
			}
		}
	}
});

app.add(
{
	name: 'learner-check-in-summary-finalise-init',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learner-check-in-summary',
			context: 'dataContext',
			name: 'id'
		});

		if (_.isUndefined(response))
		{
				var filters =
				[
					{	
						field: 'actiontype',
						value: app.whoami().mySetup.actionTypes.accountabilityCheckIn
					},
					{
						field: 'object',
						value: app.whoami().mySetup.objects.project
					},
					{
						field: 'objectcontext',
						value: id
					}
				]
	
				mydigitalstructure.cloud.search(
				{
					object: 'action',
					fields:
					[
						'subject',
						'description',
						'guid',
						'createddate',
					],
					filters: filters,
					callback: 'learner-check-in-summary-finalise-init'
				})
		}
		else
		{
			var checkInFinaliseView = app.vq.init({queue: 'learner-check-in-summary-finalise'});

			if (response.data.rows.length == 0)
			{
				checkInFinaliseView.add(
				[
					'<h4 class="text-muted mb-1 mt-1">Finalise this check-in</h4>',
					'<div class="mt-3">',
						'Once you have reviewed with the learnering partners involved in this check-in you can can finalise it.',
					'</div>',
					'<div class="mt-3">',
						'<button class="btn btn-default btn-outline btn-sm myds-click" data-controller="learner-check-in-summary-finalise-save" id="learner-check-in-summary-finalise-save" data-context="{{id}}" data-id="{{id}}">Finalise</button>',
					'</div>'
				]);
			}
			else
			{
				checkInFinaliseView.add(
				[
					'<h4 class="text-muted mb-1 mt-1">This check-in has been finalised.</h4>',
					'<div class="mt-3">',
						'You can download it as a PDF or create a new check-in.',
					'</div>',
					'<div class="mt-3">',
						'<button class="btn btn-default btn-outline btn-sm myds-click" data-controller="learner-check-in-summary-finalise-download-pdf" id="learner-check-in-summary-finalise-download-pdf" data-context="{{id}}" data-id="{{id}}">Download</button>',
					'</div>'
				]);
			}

			checkInFinaliseView.render('#learner-check-in-summary-finalise-view')
		}
	}
});
			
app.add(
{
	name: 'learner-check-in-summary-finalise-save',
	code: function (param, response)
	{	
		var checkIn = app.get(
		{
			scope: 'learner-check-in-summary',
			context: 'dataContext'
		});
	
		var data = 
		{
			type: app.whoami().mySetup.actionTypes.accountabilityCheckIn,
			object: app.whoami().mySetup.objects.project,
			objectcontext: checkIn.id,
			date: app.invoke('util-date'),
			status: app.whoami().mySetup.actionStatuses.notStarted,
			text: checkIn.notes,
			subject: 'Check-In; ' + checkIn.startdate,
			contactperson: app.whoami().thisInstanceOfMe.user.contactperson,
			totaltimehrs: 1
		}
	
		if (_.isUndefined(response))
		{
			mydigitalstructure.cloud.save(
			{
				object: 'action',
				data: data,
				callback: 'learner-check-in-summary-finalise-save'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.set(
				{
					scope: 'learner-check-in-summary-finalise-save',
					context: 'action',
					value: response.id
				});

				app.invoke('learner-check-in-summary-finalise-save-sdc');
			}
		}
		
	}
});

app.add(
{
	name: 'learner-check-in-summary-finalise-save-sdc',
	code: function (param, response)
	{	
		var checkIn = app.get(
		{
			scope: 'learner-check-in-summary',
			context: 'dataContext'
		});

		var sourceAction = app.get(
		{
			scope: 'learner-check-in-summary-finalise-save',
			context: 'action'
		});
	
		var data = 
		{
			sourceaction: sourceAction,
			type: app.whoami().mySetup.actionTypes.sdc,
			object: app.whoami().mySetup.objects.project,
			objectcontext: checkIn.id,
			date: app.invoke('util-date'),
			status: app.whoami().mySetup.actionStatuses.notStarted,
			text: checkIn.notes,
			description: 'SDC Token For Check-In; ' + checkIn.startdate,
			subject: 'Check-In; ' + checkIn.startdate,
			contactperson: app.whoami().thisInstanceOfMe.user.contactperson,
			totaltimehrs: 1  //eventually based on team count / verified time etc
		}
	
		if (_.isUndefined(response))
		{
			mydigitalstructure.cloud.save(
			{
				object: 'action',
				data: data,
				callback: 'learner-check-in-summary-finalise-save-sdc'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.invoke('learner-check-in-summary-finalise-save-project');
			}
		}	
	}
});

app.add(
{
	name: 'learner-check-in-summary-finalise-save-project',
	code: function (param, response)
	{	
		var checkIn = app.get(
		{
			scope: 'learner-check-in-summary',
			context: 'dataContext'
		});

		var data = 
		{
			id: checkIn.id,
			status: app.whoami().mySetup.projectStatuses.completed,
			enddate: app.invoke('util-date')
		}
	
		if (_.isUndefined(response))
		{
			mydigitalstructure.cloud.save(
			{
				object: 'project',
				data: data,
				callback: 'learner-check-in-summary-finalise-save-project'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify({message: 'Check-in finalised.'});
				app.invoke('app-navigate-to', {controller: 'learner-check-ins'});
			}
		}
		
	}
});

app.add(
{
	name: 'learner-check-in-summary-finalise-download-pdf',
	code: function (param, response)
	{
		app.notify('Being built.')
	}
});	