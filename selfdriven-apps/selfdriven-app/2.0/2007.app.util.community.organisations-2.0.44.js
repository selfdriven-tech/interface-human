// --- ADMIN; UTIL; COMMUNITY; ORGANISATIONS

app.add(
{
	name: 'util-community-organisation-members-show',
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
					context: app.whoami().thisInstanceOfMe.userRole + '-community-members-identifiers',
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
							controller: 'util-community-member-identifier-delete-ok'
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
										' id="admin-community-member-identifier-delete-{{id}}" data-id="{{id}}"><i class="fa fa-trash"></i></button>',
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

