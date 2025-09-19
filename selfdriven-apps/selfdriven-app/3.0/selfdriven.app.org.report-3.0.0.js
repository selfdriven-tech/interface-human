/*
	{
    	title: "ORG; Reports",
    	design: "https://slfdrvn.io/apps"
  	}
*/

app.add(
{
	name: 'org-reports',
	code: function (param)
	{
		var reportID = app._util.param.get(param, 'id').value;
		var autoShow = false;

		app._util.data.clear(
		{
			scope: 'util-view-search-show',
			context: 'name'
		});

		app._util.data.clear(
		{
			scope: 'util-view-search-show',
			context: 'nameUserFilterValues'
		});

		if (reportID != undefined)
		{
			autoShow = true;

			app.set(
			{
				scope: 'util-view-search-show',
				context: 'name',
				value: _.first(_.split(reportID, ','))
			});

			if (_.split(reportID, ',').length > 1)
			{
				app.set(
				{
					scope: 'util-view-search-show',
					context: 'nameUserFilterValues',
					value: _.last(_.split(reportID, ','))
				});
			}
		}

		app.invoke('util-view-search-initialise',
		{
			selector: '#org-reports',
			context: 'org-report',
			autoShow: autoShow,
			options:
			{
				rows: 20,
				orientation: 'vertical',
				progressive: true
			},
			searches:
			[
				{
					caption: 'Organisations',
					name: 'org-report-contact-organisations',
					notes: 'All organisations (Businesses etc)',
					icon: '<i class="fe fe-users"></i>',
					object: 'contact_business',
					searchOnChange: true,
					options:
					{
						noDataText: 'There are no contact organisations that match this search.',
					},
					userFilters:
					[
						{
							caption: 'Name',
							name: 'name',
							storage:
							{
								field: 'tradename'
							}
						},
						{
							caption: 'Legal Name',
							name: 'legalname',
							storage:
							{
								field: 'legalname'
							}
						},
						{
							caption: 'Email',
							name: 'email',
							storage:
							{
								field: 'email'
							}
						}
					],
					filters:
					[],
					format:
					{
						row:
						{
							data: 'id="org-contact-business-summary-{{id}}" data-context="{{guid}}" data-id="{{guid}}" data-controller="org-contact-business-summary"',
							class: 'myds-navigate'
						},
						columns:
						[
							{
								caption: 'Name',
								field: 'tradename',
								sortBy: true,
								defaultSort: true,
								defaultSortDirection: 'asc',
							},
							{
								caption: 'Legal Name',
								field: 'legalname',
								sortBy: true,
								defaultSort: true,
								defaultSortDirection: 'asc',
							},
							{
								caption: 'Email',
								field: 'email', 	
								sortBy: true
							},
							{
								caption: 'Phone',
								field: 'phonenumber',
								sortBy: true,
								defaultSort: true,
								defaultSortDirection: 'asc',
							},
							{
								caption: 'Suburb',
								field: 'streetsuburb', 	
								sortBy: true
							},
							{
								caption: 'State',
								field: 'streetstate', 	
								sortBy: true
							},
							{
								caption: 'Country',
								field: 'streetcountry', 	
								sortBy: true
							},
							{
								caption: 'Status',
								field: 'customerstatustext', 	
								sortBy: true
							},
							{	
								fields: ['guid']
							}
						]
					}
				},
				{
					caption: 'Products',
					notes: 'All products',
					icon: '<i class="fe fe-package"></i>',
					object: 'product',
					options:
					{
						noDataText: 'There are no products that match this search.',
					},
					userFilters:
					[
						{
							caption: 'Name',
							name: 'name',
							storage:
							{
								field: 'title'
							}
						},
						{
							caption: 'Reference',
							name: 'reference',
							storage:
							{
								field: 'reference'
							}
						},
						{
							caption: 'Organisation',
							name: 'organisation',
							storage:
							{
								field: 'contactbusinesstext'
							}
						},
						{
							caption: 'Bar Code',
							name: 'barcode',
							storage:
							{
								field: 'barcode'
							}
						}
					],
					filters:
					[
						{
							field: 'status',
							comparison: 'NOT_EQUAL_TO',
							value: 7
						}
					],
					format:
					{
						row:
						{
							data: 'id="org-operations-product-summary-{{id}}" data-context="{{guid}}" data-id="{{guid}}" data-controller="org-operations-product-summary"',
							class: 'myds-navigate'
						},
						columns:
						[
							{
								caption: 'Name',
								field: 'title',
								sortBy: true,
								defaultSort: true,
								defaultSortDirection: 'asc'
							},
							{
								caption: 'Reference',
								field: 'reference',
								sortBy: true
							},
							{
								caption: 'Organisation',
								field: 'contactbusinesstext',
								sortBy: true
							},
							{
								caption: 'Bar Code',
								field: 'barcode', 	
								sortBy: true
							},
							{
								caption: 'Status',
								field: 'statustext', 	
								sortBy: true
							},
							{	
								fields: ['guid']
							}
						]
					}
				},
				{
					caption: 'People',
					notes: 'All people',
					icon: '<i class="fa fa-user"></i>',
					object: 'contact_person',
					options:
					{
						noDataText: 'There are no people that match this search.',
					},
					userFilters:
					[
						{
							caption: 'First Name',
							name: 'name',
							storage:
							{
								field: 'firstname'
							}
						},
						{
							caption: 'Last Name',
							name: 'name',
							storage:
							{
								field: 'surname'
							}
						},
						{
							caption: 'Email',
							name: 'email',
							storage:
							{
								field: 'email'
							}
						},
						{
							caption: 'Organisation',
							name: 'organisation',
							storage:
							{
								field: 'contactbusinesstext'
							}
						}
					],
					filters:
					[],
					format:
					{
						row:
						{
							data: 'data-id="{{guid}}" data-context="{{guid}}" data-controller="org-contact-person-summary"',
							class: 'myds-navigate'
						},
						columns:
						[
							{
								caption: 'First Name',
								field: 'firstname',
								sortBy: true,
								defaultSort: true,
								defaultSortDirection: 'asc'
							},
							{
								caption: 'Last Name',
								field: 'surname',
								sortBy: true
							},
							{
								caption: 'Email',
								field: 'email', 	
								sortBy: true
							},
							{
								caption: 'Organisation',
								field: 'contactbusinesstext', 	
								sortBy: true
							},
							{
								caption: 'Created Date',
								field: 'createddate', 	
								sortBy: true,
								class: "text-secondary"
							},
							{	
								fields: ['guid']
							}
						]
					}
				}
			]
		});
	}
});

