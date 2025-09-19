app.add(
{
	name: 'util-actions-initialise',
	code: function (param)
	{	
		var context = app._util.param.get(param, 'context', {default: 'util-actions', set: true}).value;
		var object = app._util.param.get(param, 'object').value;
		var objectContext = app._util.param.get(param, 'objectContext').value;
		var headerCaption = app._util.param.get(param, 'headerCaption', {default: 'Search for Actions / Activity', set: true}).value;
		var selector = app._util.param.get(param, 'selector').value;
		var onlyIfEmpty = app._util.param.get(param, 'onlyIfEmpty', {default: true}).value;

		var showLink = app._util.param.get(param, 'showLink', {default: true}).value;
		var showAdd = app._util.param.get(param, 'showAdd', {default: true}).value;

		var showTypes = app._util.param.get(param, 'showTypes', {default: true}).value;
		var collapseClass = app._util.param.get(param, 'collapseClass', {default: ''}).value;

		var typeids = app._util.param.get(param, 'typeIDs', {default: ''}).value;

		var types = app._util.param.get(param, 'types').value;
		var collapsible = app._util.param.get(param, 'collapsible').value;
		if (collapsible == undefined)
		{
			var collapsible = app._util.param.get(param, 'collapsable', {default: true}).value;
		}

		if (selector == undefined)
		{
			selector = '#' + context + '-actions-container'
		}

		param.container = context + '-actions-view'

		param.showaddclass = (showAdd?'': ' d-none');
		param.showtypesclass = (showTypes?'': ' d-none');
		param.showlistchevronclass = '';
		
		if (!showAdd)
		{
			param.showlistchevronclass = ' mt-2';
		}

		if (object == undefined || objectContext == undefined || selector == undefined)
		{}
		else
		{
			var template = app.vq.init({queue: 'template'})

			template.add('<div class="card">');

			template.add(
			[
				'<div class="card-header">',
					'<form autocomplete="off">',
						'<div class="input-group input-group-flush input-group-merge input-group-reverse">',
							'<input type="text" class="form-control myds-text" placeholder="{{headercaption}}"',
							' data-controller="util-actions-show"',
							' data-context="search"',
							' data-object="{{object}}"',
							' data-typeids="{{typeids}}"',
							' data-objectcontext="{{objectcontext}}"',
							' data-container="{{container}}"',
							'>',
							'<div class="input-group-text">',
								'<span class="fe fe-search"></span>',
							'</div>',
						'</div>',
					'</form>',
					'<form>',
						'<div class="btn-group btn-group-sm">',
							'<a class="btn btn-primary btn-sm {{showaddclass}}" role="button" data-toggle="collapse"',
								'href="#{{context}}-actions-edit-collapse">',
								'<i class="fa fa-plus fa-fw"></i>',
							'</a>',
						'</div>'
			]);

			if (collapsible)
			{
				template.add(
				[
						'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button"',
							'href="#{{context}}-actions-collapse">',
							'<i class="fa fa-chevron-down text-muted ml-1{{showlistchevronclass}}"></i>',
						'</a>'
				]);
			}

			template.add(
			[
					'</form>',
				'</div>'
			]);
		
			template.add(
			[
					'<div class="collapse myds-collapse ' + collapseClass + '"',
						' id="{{context}}-actions-edit-collapse"',
						' data-controller="util-action-edit-initialise"',
						' data-object="{{object}}"',
						' data-objectcontext="{{objectcontext}}"',
						' data-typeids="{{typeids}}"',
						' data-context="{{context}}"',
					'>',
						'<div class="card-body py-2 px-4">',
							'<form autocomplete="off">',
								'<div class="form-group mt-2">',
									'<h4><label class="text-muted mb-1" for="{{context}}-action-edit-subject">Subject</label></h4>',
									'<input type="text" class="form-control myds-text"',
									' id="{{context}}-action-edit-subject"',
									' data-scope="{{context}}-action-edit"',
									' data-context="subject"',
									'>',
								'</div>'
			]);

			if (types != undefined)
			{
				template.add(
				[
						'<div class="form-group">',
			             '<h4><label class="text-muted" for="{{context}}-actions-edit-type">Type</label></h4>',
			   ]);

			   _.each(types, function (type)
			   {
			   	template.add(
					[
						'<div class="radio-inline radio-lg mb-1">',
							'<input type="radio" class="myds-check" id="{{context}}-action-edit-type-', type.id, '-{{id}}"',
								' name="{{context}}-action-edit-type-{{id}}" value="', type.id, '" data-id="', type.id, '"',
								' data-scope="{{context}}-action-edit" data-context="type">',
								type.text,
						'</div>'
					]);
			   });           
			                
         		template.add(
				[
								'</div>',
			   ]);
         	}

         	if (showTypes != undefined)
			{
				template.add(
				[		'<div class="form-group {{showtypesclass}}">',
                    			'<h4><label class="text-muted mb-1" for="{{context}}-action-edit-type">Type</label></h4>',
									'<select class="form-control input-lg myds-text-select w-100"',
										' id="{{context}}-action-edit-type"',
										' data-id=""',
										' data-text=""',
										' data-scope="{{context}}-action-edit"',
										' data-context="type">',
									'</select>',
								'</div>',
				]);
			}

			template.add(
			[
								'<div class="form-group">',
									'<h4><label class="text-muted mb-1" for="{{context}}-action-edit-description">Description (optional)</label></h4>',
									'<textarea style="height:150px;" class="form-control myds-text myds-validate" data-validate-mandatory ',
										' id="{{context}}-action-edit-description"',
										' data-scope="{{context}}-action-edit"',
										' data-context="description">',
									'</textarea>',
								'</div>',
							'</form>',
							'<div class="text-center form-group">',
								'<button type="button" class="btn btn-default btn-outline btn-sm mr-2 myds-click"',
									' data-object="{{object}}"',
									' data-objectcontext="{{objectcontext}}"',
									' data-context="{{context}}"',
									' data-controller="util-action-edit-save"',
								'>',
									'Save',
								'</button>',
							'</div>',
						'</div>',
					'</div>'
				]);

				template.add(
				[
					'<div class="', (collapsible?'collapse ':''), 'myds-collapse" id="{{context}}-actions-collapse"',
						' data-controller="util-actions-show"',
						' data-object="{{object}}"',
						' data-objectcontext="{{objectcontext}}"',
						' data-context="{{context}}"',
					'>',
						'<div id="{{context}}-actions-view">',
						'</div>',
					'</div>'
				]);

			template.add(
			[
				'</div>'
			]);

			var templateHTML = template.get();
		
			var actions = app.vq.init({queue: 'actions'});
			actions.template(templateHTML);
			actions.add({useTemplate: true}, param);

			if (selector != undefined)
			{
				var render = true;

				if (onlyIfEmpty)
				{
					render = ($(selector).html() == '') 
				}

				if (render)
				{
					actions.render(selector)
				}

				/*if (!collapsible)
				{
					app.invoke('util-actions-show', param)
				}*/
			}
		}
	}
});

app.add(
{
	name: 'util-action-edit-initialise',
	code: function (param)
	{	
		var context = app._util.param.get(param.dataContext, 'context').value;

		if (context != undefined)
		{
			app.invoke('util-view-select',
			{
				container: context + '-actions-edit-type',
				object: 'setup_action_type',
				fields: [{name: 'title'}],
				rows: 99999
			});
		}
	}
});

app.add(
{
	name: 'util-actions-show',
	code: function (param, response)
	{
		var dataContext = app._util.param.get(param, 'dataContext', {'default': {}}).value;
		var objectID = app._util.param.get(dataContext, 'object').value;
		var objectContext = app._util.param.get(dataContext, 'objectcontext').value;
		var typeIDs = app._util.param.get(dataContext, 'typeids').value;

		var formatController = app._util.param.get(dataContext, 'formatcontroller', {default: 'util-actions-show-row'}).value;
		var editController = app._util.param.get(dataContext, 'editcontroller', {'default': 'util-action-edit'}).value;

		var contactBusiness = app._util.param.get(dataContext, 'contactbusiness').value;
		var contactPerson = app._util.param.get(dataContext, 'contactperson').value;
		
		var scope = app._util.param.get(dataContext, 'scope').value;
		var context = app._util.param.get(dataContext, 'context').value;

		if (scope == undefined)
		{
			scope = context
		}

		var container = app._util.param.get(dataContext, 'container').value;
		if (container == undefined)
		{
			container = scope + '-actions-view'
		}

		if (param.status == 'shown')
		{
			var tableParams = app.get({scope: scope, context: 'tableParams', valueDefault: {}});
			var filters = _.clone(app._util.param.get(tableParams, 'filters', {'default': []}).value);

			var noDataText = app._util.param.get(dataContext, 'nodatatext').value;
			if (noDataText == undefined)
			{
				noDataText  = app._util.param.get(tableParams, 'noDataText', {'default': '<div class="p-4">Sorry, there is nothing to show you.</div>'}).value;
			}

			if (_.first(noDataText) != '<') {noDataText = '<div class="p-4">' + noDataText + '</div>'}

			var columns = app._util.param.get(tableParams, 'columns', {'default': 
			[
				{
					caption: 'Info',
					name: 'info',
					sortBy: true,
					class: 'col-9 col-sm-6',
					data: 'data-context="{{id}}" data-id="{{id}}" ' +
							'data-controller="' + editController + '" data-scope="' + scope + '" ' +
							'data-target="#' + scope + '-{{id}}-container" data-toggle="collapse"'
				},
				{
					caption: 'Date',
					field: 'createddate',
					sortBy: true,
					defaultSort: true,
					defaultSortDirection: 'desc',
					class: 'col-3 col-sm-2',
					data: 'data-context="{{id}}" data-id="{{id}}" ' +
							'data-controller="' + editController + '" data-scope="' + scope + '" ' +
							'data-target="#' + scope + '-{{id}}-container" data-toggle="collapse"'
				},
				{
					caption: 'Update By',
					field: 'actionbytext',
					sortBy: true,
					class: 'col-0 col-sm-4 d-none d-sm-block',
					data: 'data-context="{{id}}" data-id="{{id}}" ' +
							'data-controller="' + editController + '" data-scope="' + scope + '" ' +
							'data-target="#' + scope + '-{{id}}-container" data-toggle="collapse"'
				},
				
				{
					fields:
					['subject', 'duedate', 'description', 'statustext', 'object', 'objectcontext', 'actionby', 'actionbytext',
					 'contactbusiness', 'contactbusinesstext', 'contactperson', 'contactpersontext',
					 'actiontype', 'actiontypetext', 'status', 
					 'modifieddate', 'modifieduser', 'modifiedusertext', 'modifieddate', 'modifieduser', 'modifiedusertext']
				}
			]}).value;

			/*
			{
					caption: 'Subject',
					field: 'subject',
					sortBy: true,
					class: 'col-sm-4 myds-click',
					data: 'id="' + scope + '-actions-{{id}}" data-context="{{id}}" data-id="{{id}}" ' +
							'data-controller="' + editController + '" data-scope="' + scope + '" ' +
							'data-target="#' + scope + '-{{id}}-container" data-toggle="collapse"'
			},
			{
					html: '<button class="btn btn-primary btn-outline btn-xs myds-navigate" ' +
	           			' id="' + scope + '-action-view-{{id}}" data-context="{{id}}" data-id="{{id}}"' +
	           			' data-controller="' + editController + '"><i class="fa fa-trash"></i></button>',
					caption: '&nbsp;',
					class: 'col-sm-2 text-right'
			},
			*/

			var data = app.get({scope: 'util-actions-show', valueDefault: {}})

			if (objectID != undefined && container != undefined)
			{
				filters.push(
				{	
					field: 'object',
					comparison: 'EQUAL_TO',
					value: objectID
				});

				if (objectContext != undefined)
				{
					filters.push(
					{	
						field: 'objectcontext',
						comparison: 'EQUAL_TO',
						value: objectContext
					});
				}

				if (typeIDs != undefined && typeIDs != '')
				{
					filters.push(
					{	
						field: 'type',
						comparison: 'IN_LIST',
						value: typeIDs
					});
				}

				if (!_.isUndefined(contactBusiness) || !_.isUndefined(contactPerson))
				{
					filters.push({name: '('});

					if (!_.isUndefined(contactBusiness))
					{
						filters.push({name: 'contactbusiness', comparison: 'EQUAL_TO', value1: contactBusiness});
					}
					
					if (!_.isUndefined(contactPerson))
					{
						if (!_.isUndefined(contactBusiness))
						{
							filters.push({name: 'or'});
						}

						filters.push({name: 'contactperson', comparison: 'EQUAL_TO', value1: contactPerson});
					}
					
					filters.push({name: ')'});
				}

				if (data.actionstatus == 'open')
				{
					filters.push({name: 'status', comparison: 'IN_LIST', value1: '2,4'});	// Not Started / In Progress
				}
				else if (!_.isUndefined(data.actionstatus) && data.actionstatus != '' && data.actionstatus != '-1')
				{
					filters.push({name: 'status', comparison: 'EQUAL_TO', value1: data.actionstatus});	
				}

				var data = app.get({scope: 'util-actions-show', valueDefault: {}});

				if (_.isSet(data.search))
				{
					filters = _.concat(filters,
					[
						{ name: '(' },
						{	
							field: 'subject',
							comparison: 'TEXT_IS_LIKE',
							value: data.search
						},
						{ name: 'or' },
						{	
							field: 'description',
							comparison: 'TEXT_IS_LIKE',
							value: data.search
						},
						{ name: ')' }
						
					]);
				}

				app.invoke('util-view-table',
				{
					object: 'action',
					container: container,
					context: scope + '-actions',
					filters: filters,
					options:
					{
						noDataText: noDataText,
						rows: 20,
						orientation: 'vertical',
						progressive: true,
						class: 'table-condensed',
						deleteConfirm:
						{
							text: 'Are you sure you want to delete this action?',
							position: 'left'
						},
						showFooter: false,
						containerController: scope
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
							controller: formatController
						},

						columns: columns
					}
				});
			}
		}
	}
});

app.add(
{
	name: 'util-actions-show-row',
	code: function (row)
	{
		if (row.createddate != undefined)
		{
			row.createddate = app.invoke('util-date', {date: row.createddate, format: 'D MMM YYYY'});
		}

		row.info = '<div>' + row.subject + '</div>' +
					'<div class="text-secondary">' + row.description + '</div>';
	}
});


/* ------ CHECK */

app.add(
{
	name: 'util-action-edit',
	code: function (param, response)
	{
		var elementData = app.get({scope: 'util-action-edit', valueDefault: {}});
		var context = app._util.param.get(elementData, 'id').value;
		var scope = app._util.param.get(elementData, 'scope').value;
		var containerElementID = elementData.scope + '-' + (context || '') + '-container';
		var editElementID = elementData.scope + '-' + (context || '') + '-container-view';
		var viewStatus = app._util.param.get(param, 'status', {'default': 'shown'}).value;
		var object = app._util.param.get(elementData, 'object').value;
		var objectcontext = app._util.param.get(elementData, 'objectcontext').value;
		var contactBusiness = app._util.param.get(elementData, 'contactBusiness').value;
		var contactBusinessText = app._util.param.get(elementData, 'contactBusinessText').value;
		var contactPerson = app._util.param.get(elementData, 'contactPerson').value;
		var contactPersonText = app._util.param.get(elementData, 'contactPersonText').value;
		var actionTypes = app.invoke('util-setup-action-types', {object: object});
		var statusText = 
		[
			{id: '2', title: 'Not started'},
			{id: '4', title: 'In progress'},
			{id: '1', title: 'Completed'},
			{id: '3', title: 'Cancelled'}
		];
		var data = {};

		if (viewStatus == 'shown')
		{
			// We have to make sure the parent element is visible otherwise the edit won't display
			$('#' + scope + '-view').show();

			if (!_.isUndefined(context))
			{
				data = _.filter(app.get({scope: scope + '-util-actions', context: 'all', valueDefault: []}),
								function(x) {return x.id == context}).shift();

				$('#' + containerElementID).show();
			}
			else
			{
				if (_.isUndefined(object) || _.isUndefined(objectcontext))
				{
					console.log('No object or objectcontext set:' + scope);
				}

				if (!$('#' + containerElementID).is('*'))
				{
					var html = '<div id="' + containerElementID + '" class="d-none hide">' +
									'<div id="' + editElementID + '"></div></div>';
					if ($('#' + scope + '-view').children().length > 0)
					{
						$($('#' + scope + '-view').children().first()).before(html);
					}
					else
					{
						$('#' + containerElementID).html(html);
					}
				}
				data =
				{
					id: '',
					object: (object || ''),
					objectcontext: (objectcontext || ''),
					contactbusiness: (contactBusiness || ''),
					contactbusinesstext: (contactBusinessText || ''),
					contactperson: (contactPerson || ''),
					contactpersontext: (contactPersonText || ''),
					duedate: moment().format('DD MMM YYYY'),
					actionby: mydigitalstructure._scope.user.user,
					actionbytext: mydigitalstructure._scope.user.firstname + ' ' + mydigitalstructure._scope.user.surname,
					actiontype: '4',
					actiontypetext: 'File Note',
					actionreference: '',
					description: '',
					status: '1',
					statustext: 'Completed'
				};
		
				$('#' + containerElementID)
					.toggleClass('d-none')
					.toggleClass('hide');
			}

			app.set({scope: 'util-action-edit', context: 'orgData', value: data});

			var sourceContext = scope;
			var sourceContainer = scope + '-view';
			object = object || data.object;
			objectcontext = objectcontext || data.objectcontext;

			app.vq.init('#' + editElementID);
			app.vq.add(
			[
				'<div class="card">' +
					'<div class="card-header"><div class="pull-left">' + (data.id != '' ? 'Edit' : 'Add') + ' action</div><div class="row pull-right">' +
						'<button class="btn btn-light myds-click" data-controller="util-action-edit-actions"' +
							' id="util-action-edit-cancel-' + data.id + '" data-id="' + data.id + '" data-action="cancel"' +
							' data-container="' + editElementID + '">Cancel' +
						'</button>' +
						'<button class="btn btn-default btn-outline myds-click" data-controller="util-action-edit-actions"' +
							' id="util-action-edit-save-' + data.id + '" data-id="' + data.id + '" data-action="save"' +
							' data-container="' + editElementID + '" data-sourcecontainer="' + sourceContainer + '"' +
							' data-sourcecontext="' + sourceContext + '" data-object="' + object + '" data-objectcontext="'+ objectcontext + '">' +
						  'Save' +
						'</button>' +
					'</div></div>' +
					'<div class="card-body col-sm-12">' +
						'<form role="form" autocomplete="off">' +
							'<div class="form-group">' +
								'<h4><label class="text-muted mb-0 mt-1" for="util-action-edit-actionreference-' + data.id + '">' +
									'Title / Reference</label></h4>' +
								'<input type="text" class="form-control input-lg myds-text" value="' + data.actionreference + '"' +
									'id="util-action-edit-actionreference-' + data.id + '" data-value="' + data.actionreference + '"' +
									'data-scope="util-action-edit-' + data.id + '" data-context="actionreference">' +
							'</div>' +	
							'<div class="form-group">' +
								'<h4><label class="text-muted mb-0 mt-1" for="util-action-edit-contactbusiness-' + data.id + '">' +
									'Business</label></h4>' +
								'<select class="form-control input-lg myds-select"' +
									'id="util-action-edit-contactbusiness-' + data.id + '" style="width:100%;"' +
									'data-id="' + data.contactbusiness + '"' +
									'data-scope="util-action-edit-' + data.id + '" data-context="contactbusiness" ' +
									'data-text="' + data.contactbusinesstext + '" data-object="contact_business">' +
								'</select>' +
							'</div>' +
							'<div class="form-group">' +
								'<h4><label class="text-muted mb-0 mt-1" for="util-action-edit-contactperson-' + data.id + '">' +
									'Person</label></h4>' +
								'<select class="form-control input-lg myds-select"' +
									'id="util-action-edit-contactperson-' + data.id + '" style="width:100%;"' +
									'data-id="' + data.contactperson + '" data-businesscolumn="contactbusiness"' +
									'data-scope="util-action-edit-' + data.id + '" data-context="contactperson" ' +
									'data-text="' + data.contactpersontext + '" data-object="contact_person">' +
								'</select>' +
							'</div>' +
							'<div class="form-group">' +
								'<h4><label class="text-muted mb-0 mt-1" for="util-action-edit-duedate-' + data.id + '">' +
									'Date</label></h4>' +
					      		'<div class="input-group date myds-date" data-target-input="nearest" id="util-action-edit-duedate-' + data.id + '-view">' +
						    		'<input type="text" class="form-control input-lg datepicker-input myds-validate" data-validate-mandatory ' +
						    			'data-target="#util-action-edit-duedate-' + data.id + '-view" ' +
						    			'id="util-action-edit-duedate-' + data.id + '" ' +
						    			'data-scope="util-action-edit-' + data.id + '" data-context="duedate" ' +
						    			'value="'+ data.duedate + '" data-value="' + data.duedate + '" />' +
					    			'<div class="input-group-append" data-target="#util-action-edit-duedate-' + data.id + '-view" ' +
					    				'data-toggle="datetimepicker">' +
					        			'<div class="input-group-text"><i class="fa fa-calendar"></i>' +
					        			'</div>' +
					        		'</div>' +
					        	'</div>' +
					        '</div>' +
							'<div class="form-group">' +
								'<h4><label class="text-muted mb-0 mt-1" for="util-action-edit-actionby-' + data.id + '">' +
									'By</label></h4>' +
								'<select class="form-control input-lg myds-select"' +
									'id="util-action-edit-actionby-' + data.id + '" style="width:100%;"' +
									'data-id="' + data.actionby + '"' +
									'data-scope="util-action-edit-' + data.id + '" data-context="actionby" ' +
									'data-text="' + data.actionbytext + '" data-object="setup_user">' +
								'</select>' +
							'</div>' +
							'<div class="row">' +
							  '<div class="col-sm-6">' +
								'<div class="form-group">' +
								  '<h4><label class="text-muted mb-0 mt-1" for="util-action-edit-actiontype-' + data.id + '">' +
									'Type</label></h4>'
			]);

			_.each(actionTypes, function(type)
			{
				app.vq.add(
				[
				                  '<div class="form-radio-inline radio-lg">' +
				                    '<input type="radio" class="myds-check" id="util-action-edit-actiontype-' + type.id + '-' + data.id + '" ' +
				                      'name="util-action-edit-actiontype-' + data.id + '" value="' + type.title + '" data-id="' + type.id + '" ' +
				                      (data.actiontype == type.id ? 'checked="checked"' : '') +
				                      'data-scope="util-action-edit-' + data.id + '" ' +
				                      'data-context="actiontype">' + type.title +
				                  '</div>' 
				]);
			});

			app.vq.add(
			[
								'</div>' +
							  '</div>' +
							  '<div class="col-sm-6">' +
								'<div class="form-group">' +
								  '<h4><label class="text-muted mb-0 mt-1" for="util-action-edit-status-' + data.id + '">' +
									'Status</label></h4>'
			]);

			_.each(statusText, function(status)
			{
				app.vq.add(
				[
					              '<div class="form-radio-inline radio-lg">' +
					                '<input type="radio" class="myds-check" id="util-action-edit-status-' + status.id + '-' + data.id + '" ' +
					                    'name="util-action-edit-status-' + data.id + '" value="' + status.title + '" data-id="' + status.id + '" ' +
					                    (data.status == status.id ? 'checked="checked"' : '') +
					                    'data-scope="util-action-edit-' + data.id + '" ' +
					                    'data-context="status">' + status.title +
					              '</div>'
				]);
			});
			app.vq.add(
			[					
								'</div>' +
							  '</div>' +
							'</div>' + 
							'<div class="form-group">' +
							  '<h4><label class="text-muted mb-0 mt-1" for="util-action-edit-actionreference-' + data.id + '">' +
								'Description</label></h4>' +
							  '<textarea style="height:150px;" class="form-control myds-text" value="' + data.description + '"' +
								'id="util-action-edit-description-' + data.id + '" data-value="' + data.description + '"' +
								'data-scope="util-action-edit-' + data.id + '" data-context="description">' + data.description +
							  '</textarea>' +
							'</div>' +	
						  '</div>' +
						'</form>' +
					'</div>' +
				'</div>'
			]);
			app.vq.render('#' + editElementID);

			app.invoke('util-view-select', 
			{
				container: 'util-action-edit-contactbusiness-' + data.id,
				queryController: 'util-businesses-contactbusiness-query',
				responseController: 'util-businesses-contactbusiness-response'
			});

			app.invoke('util-view-select', 
			{
				container: 'util-action-edit-contactperson-' + data.id,
				queryController: 'util-businesses-contactperson-query',
				responseController: 'util-businesses-contactperson-response'
			});

			app.invoke('util-view-select',
			{
				container: 'util-action-edit-actionby-' + data.id,
				queryController: 'util-user-query',
				responseController: 'util-user-response'
			});
		}
	}
});

app.add(
{
	name: 'util-action-edit-save',
	code: function (param, response)
	{	
		var context = app._util.param.get(param.dataContext, 'context').value;
		var object = app._util.param.get(param.dataContext, 'object').value;
		var objectContext = app._util.param.get(param.dataContext, 'objectcontext').value;

		//CHECK
		var id = app.get(
		{
			controller: 'util-action-edit',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: context + '-action-edit',
			cleanForCloudStorage: true,
			valueDefault: {}
		});

		if (id == '')
		{
			data.object = object;
			data.objectcontext = objectContext;
		}
		else
		{
			data.id = id;
		}

		if (_.isUndefined(response))
		{
			mydigitalstructure.update(
			{
				object: 'action',
				data: data,
				callback: 'util-action-edit-save',
				callbackParam: param
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Action added to the project.');
				app.invoke('util-view-collapse', {context: context + '-actions-edit'})
				app.invoke('util-actions-show', param)
			}
		}
	}
});

app.add(
{
	name: 'util-user-query',
	code: function(param)
	{
		var query =
		{
			fields: [{name: 'username'}, {name: 'user.contactperson.firstname'}, {name: 'user.contactperson.surname'}],
			filters: [{name: 'disabled', comparison: 'EQUAL_TO', value1: 'N'}]
		}

		if (param.search)
		{
			query.filters = query.filters.concat(
			[
				{name: '('},
				{name: 'username', comparison: 'TEXT_IS_LIKE', value1: param.search},
				{name: 'or'},
				{name: 'user.contactperson.', comparison: 'TEXT_IS_LIKE', value1: param.search},
				{name: 'or'},
				{name: 'user.contactperson.', comparison: 'TEXT_IS_LIKE', value1: param.search},
				{name: ')'}

			]);
		}
	}
});

app.add(
{
	name: 'util-user-response',
	code: function(param, response)
	{
		var data = _.map(response.data.rows, function(row)
		{
			return {id: row.id, text: row['user.contactperson.firstname'] + ' ' + row['user.contactperson.surname'] + ' (' + row.username + ')'}
		});
		return data;
	}
});

app.add(
{
	name: 'util-actions-show-delete-ok',
	code: function (param, response)
	{
		if (_.isUndefined(response))
		{
			if (!_.isUndefined(param.dataContext))
			{
				mydigitalstructure.delete(
				{
					object: 'action',
					data:
					{
						id: param.dataContext.id,
					},
					callback: 'util-attachments-show-delete-ok'
				});
			}	
		}
		else
		{
			app.notify('Action removed.');

			$('tr[data-id="' + param.data.id + '"] > td').addClass('d-none hidden')
		}
	}
});

app.add(
{
	name: 'util-action-edit-actions',
	code: function(param, response)
	{
		var context = app._util.param.get(param, 'context').value;
		var dataContext = app.get({scope: 'util-action-edit-actions', valueDefault: {}});
		var action = app._util.param.get(dataContext, 'action', {'default': 'cancel'}).value;
		var actionID = app._util.param.get(dataContext, 'id', {'default': ''}).value;
		var orgData;
	
		var editElementID = dataContext.container;

		if (action == 'save')
		{
			if (_.isUndefined(response))
			{
				var data = app.get(
				{
					scope: 'util-action-edit-' + actionID,
					clean: true,
					valueDefault: {}
				});
				delete(data.validate);
				data.id = actionID;

				orgData = app.get({scope: 'util-action-edit', context: 'orgData', valueDefault: {}});
				orgData = app.invoke('util-merge-objects', {source: orgData, merge: data});

				// Check mandatory data
				param.okToSave = app.invoke('util-myds-validate-process', {scope: 'util-action-edit-' + actionID});

				if (param.okToSave)
				{
					mydigitalstructure.cloud.save(
					{
						object: 'action',
						data: (actionID == '' ? orgData : data),
						callback: 'util-action-edit-actions',
						callbackParam: param
					});
				}
			}
			else
			{
				$('#' + editElementID.replace('-view', ''))
					.toggleClass('d-none')
					.toggleClass('hide');

				app.invoke('util-actions-show',
				{
					container: dataContext.sourcecontainer,
					context: dataContext.sourcecontext,
					objectID: dataContext.object,
					objectContext: dataContext.objectcontext
				});
			}
		}

		else if (action == 'cancel')
		{
			$('#' + editElementID.replace('-view', ''))
				.toggleClass('d-none')
				.toggleClass('hide');
		}
	}
});