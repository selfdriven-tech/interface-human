// --- UTIL | CONTACT | PERSON

app.add(
{
	name: 'util-contact-person-identifiers-show',
	code: function (param, response)
	{	
		var memberID = app._util.param.get(param.dataContext, 'member').value;
		var scope = app._util.param.get(param.dataContext, 'scope').value;
		var context = app._util.param.get(param.dataContext, 'context').value;
		var selector = app._util.param.get(param.dataContext, 'selector').value;

		if (scope == undefined)
		{
			scope = context
		}

		if (scope == undefined)
		{
			scope = app.whoami().thisInstanceOfMe.userRole + '-contact-person-summary'
		}

		if (memberID == undefined)
		{
			memberID = app.get(
			{
				scope: scope,
				context: 'dataContext',
				name: 'id',
				valueDefault: ''
			});
		}

		if (selector == undefined)
		{
			selector = scope + '-identifiers-view'
		}

		if (param.status == 'shown' || param.status == undefined)
		{
			if (memberID != undefined && selector != undefined)
			{
				var filters =
				[
					{
						field: 'object',
						value: app.whoami().mySetup.objects.contactPerson
					},
					{	
						field: 'objectcontext',
						comparison: 'EQUAL_TO',
						value: memberID
					}
				]
	
				app.invoke('util-view-table',
				{
					object: 'core_url_link',
					container: selector,
					context: app.whoami().thisInstanceOfMe.userRole + '-contact-persons-identifiers',
					filters: filters,
					options:
					{
						noDataText: '<div class="p-4">There are no identifiers assigned to this member.</div>',
						rows: 20,
						orientation: 'vertical',
						progressive: true,
						class: 'table-condensed fadeInDown',
						deleteConfirm:
						{
							text: 'Are you sure you want to delete this identifier?',
							position: 'left',
							headerText: 'Delete Identifier',
							buttonText: 'Delete',
							controller: 'util-contact-person-identifier-delete-ok'
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
							method: function (row)
							{}
						},

						columns:
						[
							{
								caption: 'Type',
								field: 'urltext',
								sortBy: true,
								defaultSort: true,
								class: 'col-4 text-break text-wrap',
								data: 'data-context="{{guid}}"'
							},
							{
								caption: 'ID #',
								field: 'urlreference',
								sortBy: true,
								defaultSort: true,
								class: 'col-sm-4 text-break text-wrap',
								data: 'data-context="{{guid}}"'
							},
							{
								caption: 'Date Assigned',
								field: 'createddate',
								sortBy: true,
								class: 'col-sm-3 text-muted'
							},
							{
								html: '<button class="btn btn-danger btn-outline btn-sm myds-delete"' +
										' id="admin-contact-person-identifier-delete-{{id}}" data-id="{{id}}"><i class="fa fa-trash"></i></button>',
								caption: '&nbsp;',
								class: 'col-sm-1 text-right'
							},
							{
								fields:
								[
									'guid', 'notes'
								]
							}
						]	
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
	name: 'util-contact-person-identifier-edit',
	code: function (param)
	{	
		app.invoke('util-view-select',
		{
			container: 'admin-contact-person-summary-identifier-edit-url',
			object: 'core_url',
			fields: [{name: 'title'}],
			filters: [{field: 'type', comparison: 'EQUAL_TO', value: 5}]
		});
	}
});

app.add(
{
	name: 'util-contact-person-identifier-edit-save',
	code: function (param, response)
	{	
		var dataContext = app.get(
		{
			controller: 'admin-contact-person-summary',
			context: 'dataContext',
			valueDefault: {}
		});

		var id = app.get(
		{
			controller: 'admin-contact-person-identifier-show',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'admin-contact-person-summary-identifier-edit',
			cleanForCloudStorage: true,
			valueDefault: {}
		});

		if (id == '')
		{
			data.object = app.whoami().mySetup.objects.contactPerson,
			data.objectcontext = dataContext.id;
		}
		else
		{
			data.id = id;
		}

		if (_.isUndefined(response))
		{
			mydigitalstructure.cloud.save(
			{
				object: 'core_url_link',
				data: data,
				callback: 'util-contact-person-identifier-edit-save'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Identifier assigned to the member.');
				$('#admin-contact-person-summary-identifier-edit-collapse').removeClass('show');
				app.invoke('util-contact-person-identifiers-show', {status: 'shown'})
			}
		}
	}
});

app.add(
{
	name: 'util-contact-person-skill-delete-ok',
	code: function (param, response)
	{
		if (_.isUndefined(response))
		{
			if (!_.isUndefined(param.dataContext))
			{
				mydigitalstructure.cloud.delete(
				{
					object: 'contact_attribute',
					data:
					{
						id: param.dataContext.id,
					},
					callback: 'util-contact-person-skill-delete-ok',
					callbackParam: param
				});
			}	
		}
		else
		{
			if (response.status == 'OK')
			{
				app.notify('Skill removed.');
				app.invoke('util-contact-person-skills-show', {status: 'shown'});
			}
			else if (response.status == 'ER')
			{
				app.notify('Skill can not be removed from this member. (' + response.error.errornotes + ')');
			}
		}
	}
});
	
// --- UTIL | CONTACT | PERSON | TEAMS

app.add(
{
	name: 'util-contact-person-summary-teams-show',
	code: function (param, response)
	{	
		var contactPersonID = app._util.param.get(param.dataContext, 'person').value;
		var scope = app._util.param.get(param.dataContext, 'scope').value;
		var context = app._util.param.get(param.dataContext, 'context').value;
		var selector = app._util.param.get(param.dataContext, 'selector').value;

		if (scope == undefined)
		{
			scope = context
		}

		if (scope == undefined)
		{
			scope = app.whoami().thisInstanceOfMe.userRole + '-contact-person-summary'
		}

		if (contactPersonID == undefined)
		{
			contactPersonID = app.get(
			{
				scope: scope,
				context: 'dataContext',
				name: 'guid',
				valueDefault: ''
			});
		}

		if (selector == undefined)
		{
			selector = scope + '-teams-view'
		}

		if (param.status == 'shown' || param.status == undefined)
		{
			if (contactPersonID != undefined && selector != undefined)
			{
				var filters =
				[
					{	
						field: 'projectteam.contactperson.guid',
						comparison: 'EQUAL_TO',
						value: contactPersonID
					}
				]
	
				app.invoke('util-view-table',
				{
					object: 'project_team',
					container: selector,
					context: app.whoami().thisInstanceOfMe._userRole + '-contact-person-summary-teams',
					filters: filters,
					options:
					{
						noDataText: '<div class="p-4">This contact person is not a member of any project teams.</div>',
						rows: 20,
						orientation: 'vertical',
						progressive: true,
						class: 'table-condensed fadeInDown',
						deleteConfirm:
						{
							text: 'Are you sure you want to remove this contact person from this team?',
							position: 'left',
							headerText: 'Remove from team',
							buttonText: 'Remove',
							controller: 'util-contact-person-summary-teams-delete-ok'
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
							controller: 'util-contact-person-summary-teams-show-format'
						},

						columns:
						[
							{
								caption: 'Team Name',
								field: 'projectteam.project.description',
								sortBy: true,
								defaultSort: true,
								class: 'col-sm-4 text-break text-wrap',
								data: 'data-context="{{guid}}"'
							},
							{
								caption: 'Role',
								field: 'projectroletext',
								sortBy: true,
								class: 'col-sm-3 text-break text-wrap',
								data: 'data-context="{{guid}}"'
							},
							{
								caption: 'Date Joined',
								field: 'startdate',
								sortBy: true,
								class: 'col-sm-2 text-break text-wrap text-muted',
								data: 'data-context="{{guid}}"'
							},
							{
								caption: 'Date Left',
								name: 'dateleft-leaveteam',
								sortBy: true,
								class: 'col-sm-2 text-break text-wrap text-muted',
								data: 'data-context="{{guid}}"'
							},
							{
								html: '<button class="btn btn-danger btn-outline btn-sm myds-delete"' +
			               			' id="admin-contact-persons-teams-delete-{{id}}" data-id="{{id}}"><i class="fa fa-trash"></i></button>',
								caption: '&nbsp;',
								class: 'col-sm-1 text-right'
							},
							{
								fields:
								[
									'guid', 'createddate', 'enddate', 'projectrole'
								]
							}
						]	
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
	name: 'util-contact-person-summary-teams-show-format',
	code: function (row)
	{
		row['dateleft-leaveteam'] = row.enddate;
		
		if (_.isNotSet(row['dateleft-leaveteam']))
		{
			row['dateleft-leaveteam'] = '<button class="btn btn-white btn-sm myds-click"' +
										' id="admin-contact-person-summary-teams-leave-team-' + row.id +
										'" data-id="' + row.id + '"' +
										'" data-controller="util-contact-person-summary-teams-leave-ok"' +
										'">Leave</button>';
		}
	}
});

app.add(
{
	name: 'util-contact-person-summary-teams-edit',
	code: function (param)
	{	
		app._util.data.clear({scope: 'util-contact-person-summary-teams-edit'});

		app.invoke('util-view-select',
		{
			container: 'util-contact-person-summary-teams-edit-project',
			object: 'project',
			fields: [{name: 'description'}]
		});

		app.invoke('util-view-select',
		{
			container: 'util-contact-person-summary-teams-edit-projectrole',
			object: 'setup_project_role',
			fields: [{name: 'title'}]
		});
	}
});

app.add(
{
	name: 'util-contact-person-summary-teams-edit-save', 
	code: function (param, response)
	{	
		var appContext = entityos._util.param.get(param.dataContext, 'appContext').value;

		if (_.isNotSet(appContext))
		{
			appContext = app.whoami().thisInstanceOfMe._userRole;
		}

		var dataContactPerson= app.get(
		{
			controller: appContext + '-contact-person-summary',
			context: 'dataContext',
			valueDefault: {}
		});

		var dataTeam = app.get(
		{
			scope: 'util-contact-person-summary-teams-edit',
			cleanForCloudStorage: true,
			valueDefault: {}
		});

		if (_.isNotSet(dataTeam.id))
		{
			dataTeam.startdate = moment().format('D MMM YYYY');
			dataTeam.contactperson = dataContactPerson.id
		}
		else
		{
			dataTeam.id = dataTeam.id;
		}

		if (_.isUndefined(response))
		{
			entityos.cloud.save(
			{
				object: 'project_team',
				data: dataTeam,
				callback: 'util-contact-person-summary-teams-edit-save'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Contact person added to the team.');
				$('#' + appContext + '-contact-person-summary-teams-edit-collapse').removeClass('show');
				app.invoke('util-contact-person-summary-teams-show', {status: 'shown'})
			}
		}
	}
});

app.add(
{
	name: 'util-contact-person-summary-teams-delete-ok',
	code: function (param, response)
	{
		if (_.isUndefined(response))
		{
			if (!_.isUndefined(param.dataContext))
			{
				entityos.cloud.delete(
				{
					object: 'project_team',
					data:
					{
						id: param.dataContext.id
					},
					callback: 'util-contact-person-summary-teams-delete-ok',
					callbackParam: param
				});
			}	
		}
		else
		{
			if (response.status == 'OK')
			{
				app.notify('Community member removed from this team.');
				app.invoke('util-contact-person-summary-teams-show', {status: 'shown'});
			}
			else if (response.status == 'ER')
			{
				app.notify('Member can not be removed from this team. (' + response.error.errornotes + ')');
			}
		}
	}
});

app.add(
{
	name: 'util-contact-person-summary-teams-leave-ok',
	code: function (param, response)
	{
		if (_.isUndefined(response))
		{
			if (!_.isUndefined(param.dataContext))
			{
				mydigitalstructure.cloud.save(
				{
					object: 'project_team',
					data:
					{
						id: param.dataContext.id,
						enddate: moment().format('D MMM YYYY')
					},
					callback: 'util-contact-person-summary-teams-leave-ok',
					callbackParam: param
				});
			}	
		}
		else
		{
			if (response.status == 'OK')
			{
				app.notify('Community member set as having left this team.');
				app.invoke('util-contact-person-summary-teams-show', {status: 'shown'});
			}
			else if (response.status == 'ER')
			{
				app.notify('Member can not leave this team. (' + response.error.errornotes + ')');
			}
		}
	}
});
	
// --- ADMIN; COMMUNITY; MEMBER; LEARNING PARTNERS

app.add(
{
	name: 'util-contact-person-learning-partners-show',
	code: function (param, response)
	{	
		var memberID = app._util.param.get(param.dataContext, 'member').value;
		var scope = app._util.param.get(param.dataContext, 'scope').value;
		var context = app._util.param.get(param.dataContext, 'context').value;
		var selector = app._util.param.get(param.dataContext, 'selector').value;

		if (scope == undefined)
		{
			scope = context
		}

		if (scope == undefined)
		{
			scope = app.whoami().thisInstanceOfMe.userRole + '-contact-person-summary'
		}

		if (memberID == undefined)
		{
			memberID = app.get(
			{
				scope: scope,
				context: 'dataContext',
				name: 'id',
				valueDefault: ''
			});
		}

		if (selector == undefined)
		{
			selector = scope + '-learning-partners-view'
		}

		if (param.status == 'shown' || param.status == undefined)
		{
			if (memberID != undefined && selector != undefined)
			{
				var filters =
				[
					{	
						field: 'contactperson',
						comparison: 'EQUAL_TO',
						value: memberID
					},
					{
						field: 'type',
						comparison: 'IN_LIST',
						value: app.whoami().mySetup.relationshipTypes.learningPartner
					}
				]
	
				app.invoke('util-view-table',
				{
					object: 'contact_relationship',
					container: selector,
					context: app.whoami().thisInstanceOfMe.userRole + '-contact-persons-learning-partners',
					filters: filters,
					options:
					{
						noDataText: '<div class="p-4">There are no learning partners linked to this member.</div>',
						rows: 20,
						orientation: 'vertical',
						progressive: true,
						class: 'table-condensed fadeInDown',
						deleteConfirm:
						{
							text: 'Are you sure you want to unlink this learning-partner?',
							position: 'left',
							headerText: 'Delete Skill',
							buttonText: 'Delete',
							controller: 'util-contact-person-learning-partner-delete-ok'
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
							controller: 'util-contact-person-learning-partners-show-format'
						},

						columns:
						[
							{
								caption: 'Name & Contact Info',
								name: 'contactinfo',
								sortBy: true,
								defaultSort: true,
								class: 'col-sm-3 text-break text-wrap',
								data: 'data-context="{{guid}}"'
							},
							{
								caption: 'Type',
								name: 'typeInfo',
								sortBy: true,
								class: 'col-sm-3 text-break text-wrap',
								data: 'data-context="{{guid}}"'
							},
							{
								caption: 'Notes',
								field: 'notes',
								sortBy: true,
								class: 'col-sm-3 text-break text-wrap',
								data: 'data-context="{{guid}}"'
							},
							{
								caption: 'Date Assigned',
								field: 'createddate',
								sortBy: true,
								class: 'col-sm-2 text-muted'
							},
							{
								html: '<button class="btn btn-danger btn-outline btn-sm myds-delete"' +
			               			' id="admin-contact-persons-learning-partners-delete-{{id}}" data-id="{{id}}"><i class="fa fa-trash"></i></button>',
								caption: '&nbsp;',
								class: 'col-sm-1 text-right'
							},
							{
								fields:
								[
									'guid', 'notes',
									'relationship.othercontactperson.firstname',
									'relationship.othercontactperson.surname',
									'relationship.othercontactperson.email',
									'typetext', 'type'
								]
							}
						]	
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
	name: 'util-contact-person-learning-partners-show-format',
	code: function (row)
	{
		row.contactinfo = 
			'<div>' + row['relationship.othercontactperson.firstname'] +
							' ' + row['relationship.othercontactperson.surname'] + '</div>'

		if (row['relationship.othercontactperson.email'] != undefined)
		{
			row.contactInfo += '<div class="text-muted small">' + row['relationship.othercontactperson.email'] + '</div>'
		}

		if (row['typetext'] != undefined)
		{
			row.typeInfo = _.replace(row['typetext'], 'Learning Partner; ', '')
		}
	}

});

app.add(
{
	name: 'util-contact-person-learning-partner-edit',
	code: function (param)
	{	
		app.invoke('util-view-select',
		{
			container: 'admin-contact-person-summary-learning-partner-edit-type',
			object: 'setup_contact_relationship_type',
			fields:
			[
				{
					name: 'title',
					removeText: 'Learning Partner; '
				}
			],
			filters:
			[
				{
					field: 'id',
					comparison: 'IN_LIST',
					value: app.whoami().mySetup.relationshipTypes.learningPartner
				}
			]
		});

		app.invoke('util-view-select',
		{
			container: 'admin-contact-person-summary-learning-partner-edit-othercontactperson',
			object: 'contact_person',
			fields:
			[
				{
					name: 'firstname'
				},
				{
					name: 'surname'
				},
				{
					name: 'contactbusiness',
					noSearch: true,
					hidden: true
				}
			],
			filters: []
		});
	}
});

app.add(
{
	name: 'util-contact-person-learning-partner-edit-save',
	code: function (param, response)
	{	
		var dataContext = app.get(
		{
			controller: 'admin-contact-person-summary',
			context: 'dataContext',
			valueDefault: {}
		});

		var id = app.get(
		{
			controller: 'admin-contact-person-learning-partner-show',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'admin-contact-person-summary-learning-partner-edit',
			cleanForCloudStorage: true,
			valueDefault: {}
		});

		if (id == '')
		{
			var otherContactPersons = app.get({scope: 'admin-contact-person-summary-learning-partner-edit-othercontactperson', context: '_data'});
			var otherContactPerson = _.find(otherContactPersons, function (contactPerson)
			{
				return (contactPerson.id == data.othercontactperson)
			});

			if (_.isSet(otherContactPerson))
			{
				data.othercontactbusiness = otherContactPerson.contactbusiness;
			}

			data.contactperson = dataContext.id;
			data.contactbusiness = dataContext.contactbusiness;
		}
		else
		{
			data.id = id;
		}

		if (_.isUndefined(response))
		{
			mydigitalstructure.cloud.save(
			{
				object: 'contact_relationship',
				data: data,
				callback: 'util-contact-person-learning-partner-edit-save'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Learning partner linked to this member.');
				$('#admin-contact-person-summary-learning-partner-edit-collapse').removeClass('show');
				app.invoke('util-contact-person-learning-partners-show', {status: 'shown'})
			}
		}
	}
});

app.add(
{
	name: 'util-contact-person-learning-partner-delete-ok',
	code: function (param, response)
	{
		if (_.isUndefined(response))
		{
			if (!_.isUndefined(param.dataContext))
			{
				mydigitalstructure.cloud.delete(
				{
					object: 'contact_relationship',
					data:
					{
						id: param.dataContext.id,
					},
					callback: 'util-contact-person-learning-partner-delete-ok',
					callbackParam: param
				});
			}	
		}
		else
		{
			if (response.status == 'OK')
			{
				app.notify('Learning partner unlinked.');
				app.invoke('util-contact-person-learning-partners-show', {status: 'shown'});
			}
			else if (response.status == 'ER')
			{
				app.notify('Learning partner can not be removed from this member. (' + response.error.errornotes + ')');
			}
		}
	}
});

// --- ADMIN; COMMUNITY; MEMBER; SKILLS

app.add(
{
	name: 'util-contact-person-skills-show',
	code: function (param, response)
	{	
		var memberID = app._util.param.get(param.dataContext, 'member').value;
		var scope = app._util.param.get(param.dataContext, 'scope').value;
		var context = app._util.param.get(param.dataContext, 'context').value;
		var selector = app._util.param.get(param.dataContext, 'selector').value;

		if (scope == undefined)
		{
			scope = context
		}

		if (scope == undefined)
		{
			scope = app.whoami().thisInstanceOfMe.userRole + '-contact-person-summary'
		}

		if (memberID == undefined)
		{
			memberID = app.get(
			{
				scope: scope,
				context: 'dataContext',
				name: 'id',
				valueDefault: ''
			});
		}

		if (selector == undefined)
		{
			selector = scope + '-skills-view'
		}

		if (param.status == 'shown' || param.status == undefined)
		{
			if (memberID != undefined && selector != undefined)
			{
				var filters =
				[
					{	
						field: 'contactperson',
						comparison: 'EQUAL_TO',
						value: memberID
					}
				]
	
				app.invoke('util-view-table',
				{
					object: 'contact_attribute',
					container: selector,
					context: app.whoami().thisInstanceOfMe.userRole + '-contact-persons-skills',
					filters: filters,
					options:
					{
						noDataText: '<div class="p-4">There are no skills assigned to this member.</div>',
						rows: 20,
						orientation: 'vertical',
						progressive: true,
						class: 'table-condensed fadeInDown',
						deleteConfirm:
						{
							text: 'Are you sure you want to delete this skill?',
							position: 'left',
							headerText: 'Delete Skill',
							buttonText: 'Delete',
							controller: 'util-contact-person-skill-delete-ok'
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
							method: function (row)
							{}
						},

						columns:
						[
							{
								caption: 'Name',
								field: 'attributetext',
								sortBy: true,
								defaultSort: true,
								class: 'col-sm-7 text-break text-wrap',
								data: 'data-context="{{guid}}"'
							},
							{
								caption: 'Date Assigned',
								field: 'createddate',
								sortBy: true,
								class: 'col-sm-4 text-muted'
							},
							{
								html: '<button class="btn btn-danger btn-outline btn-sm myds-delete"' +
			               			' id="admin-contact-persons-delete-{{id}}" data-id="{{id}}"><i class="fa fa-trash"></i></button>',
								caption: '&nbsp;',
								class: 'col-sm-1 text-right'
							},
							{
								fields:
								[
									'guid', 'notes'
								]
							}
						]	
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
	name: 'util-contact-person-skill-edit',
	code: function (param)
	{	
		app.invoke('util-view-select',
		{
			container: 'admin-contact-person-summary-skill-edit-attribute',
			object: 'setup_contact_attribute',
			fields: [{name: 'title'}]
		});
	}
});

app.add(
{
	name: 'util-contact-person-skill-edit-save',
	code: function (param, response)
	{	
		var dataContext = app.get(
		{
			controller: 'admin-contact-person-summary',
			context: 'dataContext',
			valueDefault: {}
		});

		var id = app.get(
		{
			controller: 'admin-contact-person-skill-show',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'admin-contact-person-summary-skill-edit',
			cleanForCloudStorage: true,
			valueDefault: {}
		});

		if (id == '')
		{
			data.contactperson = dataContext.id;
		}
		else
		{
			data.id = id;
		}

		if (_.isUndefined(response))
		{
			mydigitalstructure.cloud.save(
			{
				object: 'contact_attribute',
				data: data,
				callback: 'util-contact-person-skill-edit-save'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Skill assigned to the member.');
				$('#admin-contact-person-summary-skill-edit-collapse').removeClass('show');
				app.invoke('util-contact-person-skills-show', {status: 'shown'})
			}
		}
	}
});

app.add(
{
	name: 'util-contact-person-skill-delete-ok',
	code: function (param, response)
	{
		if (_.isUndefined(response))
		{
			if (!_.isUndefined(param.dataContext))
			{
				mydigitalstructure.cloud.delete(
				{
					object: 'contact_attribute',
					data:
					{
						id: param.dataContext.id,
					},
					callback: 'util-contact-person-skill-delete-ok',
					callbackParam: param
				});
			}	
		}
		else
		{
			if (response.status == 'OK')
			{
				app.notify('Skill removed.');
				app.invoke('util-contact-person-skills-show', {status: 'shown'});
			}
			else if (response.status == 'ER')
			{
				app.notify('Skill can not be removed from this member. (' + response.error.errornotes + ')');
			}
		}
	}
});

// --- ADMIN; COMMUNITY; MEMBER; REFLECTIONS

app.add(
{
	name: 'util-contact-person-reflections-show',
	code: function (param, response)
	{	
		var memberID = app._util.param.get(param.dataContext, 'member').value;
		var scope = app._util.param.get(param.dataContext, 'scope').value;
		var context = app._util.param.get(param.dataContext, 'context').value;
		var selector = app._util.param.get(param.dataContext, 'selector').value;

		if (scope == undefined)
		{
			scope = context
		}

		if (scope == undefined)
		{
			scope = app.whoami().thisInstanceOfMe.userRole + '-contact-person-summary'
		}

		if (memberID == undefined)
		{
			memberID = app.get(
			{
				scope: scope,
				context: 'dataContext',
				name: 'id',
				valueDefault: ''
			});
		}

		if (selector == undefined)
		{
			selector = scope + '-reflections-view'
		}

		if (param.status == 'shown' || param.status == undefined)
		{
			if (memberID != undefined && selector != undefined)
			{
				var filters =
				[
					{	
						field: 'contactperson',
						comparison: 'EQUAL_TO',
						value: memberID
					},
					{	
						field: 'actiontype',
						comparison: 'IN_LIST',
						value: app.whoami().mySetup.actionTypes.reflectionByLearningPartnerOnGrowth
					}
				]
	
				app.invoke('util-view-table',
				{
					object: 'action',
					container: selector,
					context: app.whoami().thisInstanceOfMe.userRole + '-contact-persons-reflections',
					filters: filters,
					options:
					{
						noDataText: '<div class="p-4">There are no learning partner reflections on or for growth assigned to this community member.</div>',
						rows: 20,
						orientation: 'vertical',
						progressive: true,
						class: 'table-condensed fadeInDown',
						deleteConfirm:
						{
							text: 'Are you sure you want to delete this reflection?',
							position: 'left',
							headerText: 'Delete Reflection',
							buttonText: 'Delete',
							controller: 'util-contact-person-reflection-delete-ok'
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
							method: function (row)
							{}
						},

						columns:
						[
							{
								caption: 'Reflection By',
								field: 'actionbytext',
								sortBy: true,
								defaultSort: true,
								class: 'col-sm-3',
								data: 'data-context="{{guid}}"'
							},
							{
								caption: 'Date',
								field: 'createddate',
								sortBy: true,
								class: 'col-sm-2 text-muted'
							},
							{
								caption: 'Note',
								field: 'text',
								class: 'col-sm-6 text-break text-wrap',
								data: 'data-context="{{guid}}"'
							},
							
							{
								html: '<button class="btn btn-danger btn-outline btn-sm myds-delete"' +
			               			' id="admin-community-reflections-delete-{{id}}" data-id="{{id}}"><i class="fa fa-trash"></i></button>',
								caption: '&nbsp;',
								class: 'col-sm-1 text-right'
							},
							{
								fields:
								[
									'guid'
								]
							}
						]	
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
	name: 'util-contact-person-reflection-edit',
	code: function (param)
	{	
		app.invoke('util-view-select',
		{
			container: 'admin-contact-person-summary-reflection-edit-type',
			object: 'setup_action_type',
			fields: [{name: 'title'}],
			filters:
			[
				{	
					field: 'id',
					comparison: 'IN_LIST',
					value: app.whoami().mySetup.actionTypes.reflectionByLearningPartner
				}
			]

		});
	}
});

app.add(
{
	name: 'util-contact-person-reflection-edit-save',
	code: function (param, response)
	{	
		var dataContext = app.get(
		{
			controller: 'admin-contact-person-summary',
			context: 'dataContext',
			valueDefault: {}
		});

		var id = app.get(
		{
			controller: 'admin-contact-person-reflection-show',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'admin-contact-person-summary-reflection-edit',
			cleanForCloudStorage: true,
			valueDefault: {}
		});

		if (id == '')
		{
			data.contactperson = dataContext.id;
		}
		else
		{
			data.id = id;
		}

		if (_.isUndefined(response))
		{
			mydigitalstructure.cloud.save(
			{
				object: 'action',
				data: data,
				callback: 'util-contact-person-reflection-edit-save'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Relection assigned to the community member.');
				$('#admin-contact-person-summary-reflection-edit-collapse').removeClass('show');
				app.invoke('util-contact-person-reflections-show', {status: 'shown'})
			}
		}
	}
});

app.add(
{
	name: 'util-contact-person-reflection-delete-ok',
	code: function (param, response)
	{
		if (_.isUndefined(response))
		{
			if (!_.isUndefined(param.dataContext))
			{
				mydigitalstructure.cloud.delete(
				{
					object: 'action',
					data:
					{
						id: param.dataContext.id,
					},
					callback: 'util-contact-person-reflection-delete-ok',
					callbackParam: param
				});
			}	
		}
		else
		{
			if (response.status == 'OK')
			{
				app.notify('Reflection removed.');
				app.invoke('util-contact-person-reflections-show', {status: 'shown'});
			}
			else if (response.status == 'ER')
			{
				app.notify('Reflection can not be removed from this member. (' + response.error.errornotes + ')');
			}
		}
	}
});

// --- ADMIN; COMMUNITY; MEMBER; ENDORSEMENTS

app.add(
{
	name: 'util-contact-person-endorsements-show',
	code: function (param, response)
	{	
		var memberID = app._util.param.get(param.dataContext, 'member').value;
		var scope = app._util.param.get(param.dataContext, 'scope').value;
		var context = app._util.param.get(param.dataContext, 'context').value;
		var selector = app._util.param.get(param.dataContext, 'selector').value;

		if (scope == undefined)
		{
			scope = context
		}

		if (scope == undefined)
		{
			scope = app.whoami().thisInstanceOfMe.userRole + '-contact-person-summary'
		}

		if (memberID == undefined)
		{
			memberID = app.get(
			{
				scope: scope,
				context: 'dataContext',
				name: 'id',
				valueDefault: ''
			});
		}

		if (selector == undefined)
		{
			selector = scope + '-endorsements-view'
		}

		if (param.status == 'shown' || param.status == undefined)
		{
			if (memberID != undefined && selector != undefined)
			{
				var filters =
				[
					{	
						field: 'contactperson',
						comparison: 'EQUAL_TO',
						value: memberID
					},
					{	
						field: 'actiontype',
						value: app.whoami().mySetup.actionTypes.recognitionGrowth
					}
				]
	
				app.invoke('util-view-table',
				{
					object: 'action',
					container: selector,
					context: app.whoami().thisInstanceOfMe.userRole + '-contact-persons-endorsements',
					filters: filters,
					options:
					{
						noDataText: '<div class="p-4">There are no learning partner endorsements for this community member.</div>',
						rows: 20,
						orientation: 'vertical',
						progressive: true,
						class: 'table-condensed fadeInDown',
						deleteConfirm:
						{
							text: 'Are you sure you want to delete this endorsement?',
							position: 'left',
							headerText: 'Delete endorsement',
							buttonText: 'Delete',
							controller: 'util-contact-person-endorsement-delete-ok'
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
							method: function (row)
							{}
						},

						columns:
						[
							{
								caption: 'Endorsement By',
								field: 'actionbytext',
								sortBy: true,
								defaultSort: true,
								class: 'col-sm-3',
								data: 'data-context="{{guid}}"'
							},
							{
								caption: 'Date',
								field: 'createddate',
								sortBy: true,
								class: 'col-sm-2 text-muted'
							},
							{
								caption: 'Note',
								field: 'text',
								class: 'col-sm-6 text-break text-wrap',
								data: 'data-context="{{guid}}"'
							},
							
							{
								html: '<button class="btn btn-danger btn-outline btn-sm myds-delete"' +
			               			' id="admin-community-endorsements-delete-{{id}}" data-id="{{id}}"><i class="fa fa-trash"></i></button>',
								caption: '&nbsp;',
								class: 'col-sm-1 text-right'
							},
							{
								fields:
								[
									'guid'
								]
							}
						]	
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
	name: 'util-contact-person-endorsement-edit',
	code: function (param)
	{	
		app.invoke('util-view-select',
		{
			container: 'admin-contact-person-summary-endorsement-edit-type',
			object: 'setup_action_type',
			fields: [{name: 'title'}],
			filters:
			[
				{	
					field: 'id',
					value: app.whoami().mySetup.actionTypes.recognitionGrowth
				}
			]
		});
	}
});

app.add(
{
	name: 'util-contact-person-endorsement-edit-save',
	code: function (param, response)
	{	
		var dataContext = app.get(
		{
			controller: 'admin-contact-person-summary',
			context: 'dataContext',
			valueDefault: {}
		});

		var id = app.get(
		{
			controller: 'admin-contact-person-endorsement-show',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'admin-contact-person-summary-endorsement-edit',
			cleanForCloudStorage: true,
			valueDefault: {}
		});

		if (id == '')
		{
			data.contactperson = dataContext.id;
		}
		else
		{
			data.id = id;
		}

		if (_.isUndefined(response))
		{
			mydigitalstructure.cloud.save(
			{
				object: 'action',
				data: data,
				callback: 'util-contact-person-endorsement-edit-save'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Endorsement assigned to the community member.');
				$('#admin-contact-person-summary-endorsement-edit-collapse').removeClass('show');
				app.invoke('util-contact-person-endorsements-show', {status: 'shown'})
			}
		}
	}
});

app.add(
{
	name: 'util-contact-person-endorsement-delete-ok',
	code: function (param, response)
	{
		if (_.isUndefined(response))
		{
			if (!_.isUndefined(param.dataContext))
			{
				mydigitalstructure.cloud.delete(
				{
					object: 'action',
					data:
					{
						id: param.dataContext.id,
					},
					callback: 'util-contact-person-endorsement-delete-ok',
					callbackParam: param
				});
			}	
		}
		else
		{
			if (response.status == 'OK')
			{
				app.notify('endorsement removed.');
				app.invoke('util-contact-person-endorsements-show', {status: 'shown'});
			}
			else if (response.status == 'ER')
			{
				app.notify('Endorsement can not be removed from this member. (' + response.error.errornotes + ')');
			}
		}
	}
});

