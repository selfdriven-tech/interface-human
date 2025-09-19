// --- UTIL; LEARNING PARTNERS
//TODO!!!

app.add(
{
	name: 'util-community-learning-partners-show',
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
			scope = app.whoami().thisInstanceOfMe.userRole + '-community-member-summary'
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
					context: app.whoami().thisInstanceOfMe.userRole + '-community-members-skills',
					filters: filters,
					options:
					{
						noDataText: 'There are no skills assigned to this member.',
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
							controller: 'util-community-member-skill-delete-ok'
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
			               			' id="admin-community-members-delete-{{id}}" data-id="{{id}}"><i class="fa fa-trash"></i></button>',
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
	name: 'util-community-member-skill-edit',
	code: function (param)
	{	
		app.invoke('util-view-select',
		{
			container: 'admin-community-member-summary-skill-edit-attribute',
			object: 'setup_contact_attribute',
			fields: [{name: 'title'}]
		});
	}
});

app.add(
{
	name: 'util-community-member-skill-edit-save',
	code: function (param, response)
	{	
		var dataContext = app.get(
		{
			controller: 'admin-community-member-summary',
			context: 'dataContext',
			valueDefault: {}
		});

		var id = app.get(
		{
			controller: 'admin-community-member-skill-show',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'admin-community-member-summary-skill-edit',
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
			mydigitalstructure.update(
			{
				object: 'contact_attribute',
				data: data,
				callback: 'util-community-member-skill-edit-save'
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Skill assigned to the member.');
				$('#admin-community-member-summary-skill-edit-collapse').removeClass('show');
				app.invoke('util-community-member-skills-show', {status: 'shown'})
			}
		}
	}
});

app.add(
{
	name: 'util-community-member-skill-delete-ok',
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
					callback: 'util-community-member-skill-delete-ok',
					callbackParam: param
				});
			}	
		}
		else
		{
			if (response.status == 'OK')
			{
				app.notify('Skill removed.');
				app.invoke('util-community-member-skills-show', {status: 'shown'});
			}
			else if (response.status == 'ER')
			{
				app.notify('Skill can not be removed from this member. (' + response.error.errornotes + ')');
			}
		}
	}
});

