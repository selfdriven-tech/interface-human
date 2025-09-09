app.add(
{
	name: 'util-files-show',
	code: function (param, response)
	{	
		var object = app._util.param.get(param.dataContext, 'object').value;
		var objectContext = app._util.param.get(param.dataContext, 'objectcontext').value;
		var scope = app._util.param.get(param.dataContext, 'scope').value;
		var context = app._util.param.get(param.dataContext, 'context').value;
		var selector = app._util.param.get(param.dataContext, 'selector').value;

		if (scope == undefined)
		{
			scope = context
		}

		if (scope == undefined)
		{
			scope = 'util-files-show'
		}

		if (objectContext == undefined)
		{
			objectContext = app.get(
			{
				scope: scope,
				context: 'id',
				valueDefault: ''
			});
		}

		if (selector == undefined)
		{
			selector = scope + '-attachments-view'
		}

		if (param.status == 'shown')
		{
			app.invoke('util-attachments-show',
			{
				objectID: object,
				objectContext: objectContext,
				container: selector,
				context: scope + '-attachments'
			});
		}
		else if (param.status == 'show')
		{
			app.invoke('util-working-show', '#' + selector);
		}
	}
});

app.add(
{
	name: 'util-files-upload-completed',
	code: function (param)
	{
		app.invoke('util-attachments-upload-completed', param);
	}
});

app.add(
{
	name: 'util-attachments-initialise',
	code: function (param)
	{	
		var context = app._util.param.get(param, 'context', {default: 'util-attachments', set: true}).value;
		var object = app._util.param.get(param, 'object').value;
		var objectContext = app._util.param.get(param, 'objectContext').value;
		var headerCaption = app._util.param.get(param, 'headerCaption', {default: 'Search for Files & Links', set: true}).value;
		var linkCaption = app._util.param.get(param, 'linkCaption', {default: 'Attachments (Files & Links)', set: true}).value;
		var selector = app._util.param.get(param, 'selector').value;
		var onlyIfEmpty = app._util.param.get(param, 'onlyIfEmpty', {default: true}).value;

		var showLink = app._util.param.get(param, 'showLink', {default: true}).value;
		var showUpload = app._util.param.get(param, 'showUpload', {default: true}).value;
		var showList = app._util.param.get(param, 'showList', {default: true}).value;

		var showTypes = app._util.param.get(param, 'showTypes', {default: true}).value;
		var collapsible = app._util.param.get(param, 'collapsible').value;
		if (collapsible == undefined)
		{
			var collapsible = app._util.param.get(param, 'collapsable', {default: true}).value;
		}

		if (selector == undefined)
		{
			selector = '#' + context + '-attachments-container'
		}

		param.container = context + '-attachments-view'

		param.showlinkclass = (showLink?'': ' d-none');
		param.showuploadclass = (showUpload?'': ' d-none');
		param.showlistclass = (showList?'': ' d-none');
		param.showtypesclass = (showTypes?'': ' d-none');
		param.showlistchevronclass = '';
		
		if (!showLink && !showUpload)
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
				'<div class="card-header', (collapsible?' pr-2':' pr-3') ,'">',
					'<form autocomplete="off">',
						'<div class="input-group input-group-flush input-group-merge input-group-reverse">',
							'<input type="text" class="form-control myds-text" placeholder="{{headercaption}}"',
							' data-controller="util-attachments-show"',
							' data-context="search"',
							' data-object="{{object}}"',
							' data-objectcontext="{{objectcontext}}"',
							' data-container="{{container}}"',
							'>',
							'<div class="input-group-text">',
								'<span class="fe fe-search"></span>',
							'</div>',
						'</div>',
					'</form>',
					'<form>',
						'<div class="btn-group" role="group">',
							'<a class="btn btn-primary btn-sm {{showlinkclass}}" role="button" data-toggle="collapse"',
								' href="#{{context}}-attachments-link">',
								'<i class="fa fa-link fa-fw"></i>',
							'</a>',
							'<a class="btn btn-primary btn-sm {{showuploadclass}}" role="button" data-toggle="collapse"',
								'href="#{{context}}-attachments-upload">',
								'<i class="fa fa-cloud-upload-alt fa-fw"></i>',
							'</a>',
						'</div>',
					'</form>',
			]);

			if (collapsible)
			{
				template.add(
				[
						'<a class="ml-1 mr-1 myds-collapse-toggle {{showlistclass}}" data-toggle="collapse" role="button"',
							'href="#{{context}}-attachments-collapse">',
							'<i class="fa fa-chevron-down text-muted ml-1 {{showlistchevronclass}}"></i>',
						'</a>'
				]);
			}

			template.add(
			[
				'</div>'
			]);

			template.add(
			[
					'<div class="collapse myds-collapse"',
						' id="{{context}}-attachments-link"',
						' data-controller="util-attachment-link-initialise"',
						' data-object="{{object}}"',
						' data-objectcontext="{{objectcontext}}"',
						' data-context="{{context}}"',
					'>',
						'<div class="card-body pt-4 pb-2 px-4">',
							'<form autocomplete="off">',
								'<div class="form-group mt-2">',
									'<h4><label class="text-muted mb-1" for="{{context}}-attachments-link-url">Link (URL)</label></h4>',
									'<input type="text" class="form-control myds-text"',
									' id="{{context}}-attachments-link-url"',
									' data-scope="{{context}}-attachments-link"',
									' data-context="url1"',
									'>',
								'</div>',
								'<div class="form-group">',
									'<h4><label class="text-muted mb-1" for="{{context}}-attachments-link-description">Description (optional)</label></h4>',
									'<input type="text" class="form-control myds-text"',
										' id="{{context}}-attachments-link"',
										' data-scope="{{context}}-attachments-link"',
										' data-context="title1"',
									'>',
								'</div>',
								'<div class="form-group {{showtypesclass}}">',
                    			'<h4><label class="text-muted mb-1" for="{{context}}-attachments-link-type">Type</label></h4>',
									'<select class="form-control input-lg myds-text-select w-100"',
										' id="{{context}}-attachments-link-type"',
										' data-id=""',
										' data-text=""',
										' data-scope="{{context}}-attachments-link"',
										' data-context="type1">',
									'</select>',
								'</div>',
							'</form>',
							'<div class="text-center form-group">',
								'<button type="button" class="btn btn-default btn-outline btn-sm mr-2 myds-click"',
									' data-object="{{object}}"',
									' data-objectcontext="{{objectcontext}}"',
									' data-context="{{context}}"',
									' data-controller="util-attachment-link-process"',
								'>',
									'Attach Link',
								'</button>',
							'</div>',
						'</div>',
					'</div>'
				]);

				template.add(
				[
	          	'<div class="collapse myds-collapse"',
	            	' id="{{context}}-attachments-upload"',
						' data-controller="util-attachments-upload-initialise"',
						' data-object="{{object}}"',
						' data-objectcontext="{{objectcontext}}"',
						' data-context="{{context}}"',
					'>',
						'<div class="card-body py-2">',
							'<form class="dropzone myds-dropzone mb-4 mt-4" id="{{context}}-attachments-upload-dropzone">',
								'<div class="row" id="{{context}}-attachments-upload-container-preview"></div>',
							'</form>',
							'<div class="form-group text-center {{showtypesclass}}">',
                 			'<h4><label class="text-muted mb-1" for="{{context}}-attachments-upload-type">Type</label></h4>',
								'<select class="form-control input-lg myds-text-select w-100"',
									' id="{{context}}-attachments-upload-type"',
									' data-id=""',
									' data-text=""',
									' data-scope="{{context}}-attachments-upload"',
									' data-context="type">',
								'</select>',
							'</div>',
						'</div>',
					'</div>'
				]);

				template.add(
				[
					'<div class="', (collapsible?'collapse ':''), 'myds-collapse" id="{{context}}-attachments-collapse"',
						' data-controller="util-files-show"',
						' data-object="{{object}}"',
						' data-objectcontext="{{objectcontext}}"',
						' data-context="{{context}}"',
					'>',
						'<div id="{{context}}-attachments-view" class="p-0">', //py-3
						'</div>',
					'</div>'
				]);

			template.add(
			[
				'</div>'
			]);

			var templateHTML = template.get();
		
			var attachments = app.vq.init({queue: 'attachments'});
			attachments.template(templateHTML);
			attachments.add({useTemplate: true}, param);

			if (selector != undefined)
			{
				var render = true;

				if (onlyIfEmpty)
				{
					render = ($(selector).html() == '') 
				}

				if (render)
				{
					attachments.render(selector)
				}

				if (!collapsible)
				{
					app.invoke('util-attachments-show', param);
				}
			}
		}
	}
});

app.add(
{
	name: 'util-attachment-link-initialise',
	code: function (param)
	{	
		var context = app._util.param.get(param.dataContext, 'context').value;

		if (context != undefined)
		{
			app.invoke('util-view-select',
			{
				container: context + '-attachments-link-type',
				object: 'setup_attachment_type',
				fields: [{name: 'title'}]
			});
		}
	}
});

app.add(
{
	name: 'util-files-upload-initialise',
	code: function (param, response)
	{
		app.invoke('util-attachments-upload-initialise', param)
	}
});

app.add(
{
	name: 'util-attachments-upload-initialise',
	code: function (param, response)
	{	
		var object = app._util.param.get(param.dataContext, 'object').value;
		var objectContext = app._util.param.get(param.dataContext, 'objectcontext').value;
		var objectScope = app._util.param.get(param.dataContext, 'scope').value;
		var selector = app._util.param.get(param.dataContext, 'selector').value;
		var selectorPreview = app._util.param.get(param.dataContext, 'selectorpreview').value;
		var callback = app._util.param.get(param.dataContext, 'callback').value;
		var context = app._util.param.get(param.dataContext, 'context').value;

		if (objectScope == undefined)
		{
			objectScope =  app._util.param.get(param.dataContext, 'context').value;
		}

		if (objectScope == undefined)
		{
			objectScope = 'util-files-upload'
		}

		var scope = objectScope + '-attachments'

		if (objectContext == undefined)
		{
			objectContext = app.get(
			{
				scope: objectScope,
				context: 'id',
				valueDefault: ''
			});
		}

		if (selector == undefined)
		{
			//selector = '#' + scope + '-attachments-upload-dropzone'
			selector = '#' + scope + '-upload-dropzone'
		}

		if (selectorPreview == undefined)
		{
			selectorPreview = '#' + scope + '-upload-container-preview'
		}

		if (callback == undefined)
		{
			callback = 'util-attachments-upload-completed'
		}

		if (param.status == 'shown')
		{
			app.invoke('util-view-select',
			{
				container: context + '-attachments-upload-type',
				object: 'setup_attachment_type',
				fields: [{name: 'title'}]
			});

			if (objectContext != '' && object != '')
			{
				var previewTemplate = [
					'<div class="col-lg-12">',
						'<div class="panel panel-default">',
							'<div class="panel-heading">',
								'<div class="dz-filename text-center">',
									'<span data-dz-name></span> <i class="far fa-times-circle ml-2 text-muted"></i>',
								'</div>',
							'</div>',
							'<div class="panel-body">',
								'<div class="progress m-b-0 active">',
	                       	'<div data-dz-uploadprogress class="progress-bar progress-bar-success" style="width: 0%" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>',
	                   	'</div>',
								'<div class="dz-error-message"><span data-dz-errormessage></span></div>',
							'</div>',
						'</div>',
					'</div>']

				app.invoke('util-attachment-upload-initialise',
				{
					url: '/rpc/attach/?method=ATTACH_FILE',
					selector: selector,
					object: object,
					objectContext: objectContext,
					selectors:
					{
						preview: selectorPreview
					},
					previewTemplate: previewTemplate,
					removeFileOnUpload: true,
					callback: callback,
					scope: scope
				});
			}
			else
			{
				mydigitalstructure._util.log.add({message: 'dropzone init: objectContext or object is not set'})
			}
		}
	}
});

app.add(
{
	name: 'util-attachments-upload-completed',
	code: function (param)
	{
		$('#' + param.scope + '-upload').collapse('hide');

		app.invoke('util-attachments-show',
		{
			context: param.scope,
			container: param.scope + '-view',
			objectID: param.object,
			objectContext: param.objectContext
		});
	}
});

app.add(
{
	name: 'util-attachments-show',
	code: function (param, response)
	{
		var objectID = app._util.param.get(param, 'objectID').value;
		if (objectID == undefined)
		{
			objectID = app._util.param.get(param, 'object').value;
		}
	
		if (objectID == 50)
		{
			app.invoke('util-attachments-show-conversation', param)
		}
		else
		{
			var objectContext = app._util.param.get(param, 'objectContext').value;
			var controller = app._util.param.get(param, 'controller', {default: 'util-attachments-show-format'}).value;
			var container = app._util.param.get(param, 'container').value;
			var context = app._util.param.get(param, 'context').value;
			var showUnlink = app._util.param.get(param, 'showUnlink', {default: true}).value;
			var showMedia = app._util.param.get(param, 'showMedia', {default: true}).value;
			var showUUID = app._util.param.get(param, 'showUUID', {default: false}).value;

			var sorts = app._util.param.get(param, 'sorts', {default: []}).value;

			if (_.has(param, '_dataContext'))
			{
				if (_.isNotSet(objectID))
				{
					objectID = app._util.param.get(param._dataContext, 'object').value;
					objectContext = app._util.param.get(param._dataContext, 'objectContext').value;
					container = app._util.param.get(param._dataContext, 'container').value;
				}
			}

			var data = app.get({scope: 'util-attachments-show', valueDefault: {}});
			
			if (objectID != undefined && container != undefined)
			{
				var filters =
				[
					{	
						field: 'object',
						comparison: 'EQUAL_TO',
						value: objectID
					}
				]

				if (objectContext != undefined)
				{
					filters.push(
					{	
						field: 'objectcontext',
						comparison: 'EQUAL_TO',
						value: objectContext
					});
				}

				if (_.isSet(data.search))
				{
					filters = _.concat(filters,
					[
						{ name: '(' },
						{	
							field: 'filename',
							comparison: 'TEXT_IS_LIKE',
							value: data.search
						},
						{ name: 'or' },
						{	
							field: 'url',
							comparison: 'TEXT_IS_LIKE',
							value: data.search
						},
						{ name: ')' }
						
					]);
				}

				var columns = [];

				if (showUnlink && showMedia)
				{
					if (showUUID)
					{
						columns = _.concat(columns,
						[
							{
								caption: 'Name',
								name: 'attachmentLink',
								sortBy: true,
								defaultSort: true,
								class: 'col-4 text-break text-wrap myds-click'
							},
							{
								caption: 'ID',
								field: 'guid',
								sortBy: true,
								defaultSort: true,
								class: 'col-4 text-break text-wrap text-muted small'
							}
						]);
					}
					else
					{
						columns = _.concat(columns,
						[
							{
								caption: 'Name',
								name: 'attachmentLink',
								sortBy: true,
								defaultSort: true,
								class: 'col-8 text-break text-wrap myds-click'
							}
						]);
					}
				}
				else if (showUnlink || showMedia)
				{
					if (showUUID)
					{
						columns = _.concat(columns,
						[
							{
								caption: 'Name',
								name: 'attachmentLink',
								sortBy: true,
								defaultSort: true,
								class: 'col-5 text-break text-wrap myds-click'
							},
							{
								caption: 'ID',
								field: 'guid',
								sortBy: true,
								defaultSort: true,
								class: 'col-4 text-break text-wrap text-muted small'
							}
						]);
					}
					else
					{
						columns = _.concat(columns,
						[
							{
								caption: 'Name',
								name: 'attachmentLink',
								sortBy: true,
								defaultSort: true,
								class: 'col-9 text-break text-wrap myds-click'
							}
						]);
					}
				}
				else 
				{
					if (showUUID)
					{
						columns = _.concat(columns,
						[
							{
								caption: 'Name',
								name: 'attachmentLink',
								sortBy: true,
								defaultSort: true,
								class: 'col-6 text-break text-wrap myds-click'
							},
							{
								caption: 'ID',
								field: 'guid',
								sortBy: true,
								defaultSort: true,
								class: 'col-4 text-break text-wrap text-muted small'
							}
						]);
					}
					else
					{
						columns = _.concat(columns,
						[
							{
								caption: 'Name',
								name: 'attachmentLink',
								sortBy: true,
								defaultSort: true,
								class: 'col-10 text-break text-wrap myds-click'
							}
						]);
					}
				}

				columns = _.concat(columns,
				[
					{
						caption: 'Date',
						name: 'date',
						sortBy: true,
						class: 'col-2 text-break text-wrap myds-click'
					}
				]);
				
				if (showUnlink && showMedia)
				{
					columns = _.concat(columns,
					[
						{
							html: '<a class="btn btn-default btn-outline btn-sm myds-collapse {{showMedia}}"' +
										' data-toggle="collapse" role="button"' +
										' href="#util-attachments-show-media-{{id}}-container"' +
								' id="util-attachments-show-video-{{attachment}}" data-id="{{attachment}}"' +
								' data-controller="util-attachments-show-media"' +
								' data-sourcetype="{{sourcetype}}" data-url="{{url}}"' +
								' data-link="{{download}}"' +
								'>' +
									'<i class="fa {{mediaclass}}"></i>' +
							'</a>' +
							'<button class="btn btn-danger btn-outline btn-sm myds-delete ml-2"' +
								' id="util-attachments-show-delete-{{attachment}}" data-id="{{attachment}}">' +
									'<i class="fa fa-unlink"></i>' +
							'</button>',
							caption: '&nbsp;',
							class: 'col-2 text-right pl-1'
						}
					]);
				}
				else if (showUnlink)
				{
					columns = _.concat(columns,
					[
						{
							html: '<button class="btn btn-danger btn-outline btn-sm myds-delete ml-2"' +
								' id="util-attachments-show-delete-{{attachment}}" data-id="{{attachment}}">' +
									'<i class="fa fa-unlink"></i>' +
							'</button>',
							caption: '&nbsp;',
							class: 'col-1 text-right'
						}
					]);
				}
				else if (showMedia)
				{
					columns = _.concat(columns,
					[
						{
							html: '<a class="btn btn-default btn-outline btn-sm myds-collapse {{showMedia}}"' +
										' data-toggle="collapse" role="button"' +
										' href="#util-attachments-show-media-{{id}}-container"' +
								' id="util-attachments-show-video-{{attachment}}" data-id="{{attachment}}"' +
								' data-controller="util-attachments-show-media"' +
								' data-sourcetype="{{sourcetype}}" data-url="{{url}}"' +
								' data-link="{{download}}"' +
								'>' +
									'<i class="fa {{mediaclass}}"></i>' +
							'</a>',
							caption: '&nbsp;',
							class: 'col-1 text-right'
						},
					]);
				}

				columns = _.concat(columns,
				[
					{
						fields: ['attachment', 'filename', 'download', 'title', 'url', 'sourcetype', 'type', 'typetext', 'modifieddate', 'guid']
					}
				]);
				
				app.invoke('util-view-table',
				{
					object: 'core_attachment',
					container: container,
					containerClass: '',
					context: 'util-attachments_' + context,
					filters: filters,
					sorts: sorts,
					options:
					{
						noDataText: '<div class="p-5">There are no attachment (files & links).</div>',
						rows: 20,
						orientation: 'vertical',
						progressive: true,
						class: 'table-condensed',
						deleteConfirm:
						{
							text: 'Are you sure you want to unlink this attachment?',
							position: 'left',
							headerText: 'Unlink attachment',
							buttonText: 'Unlink',
							controller: 'util-attachments-show-delete-ok'
						},
						footer: false,
						containerController: 'util-attachments-show-media',
						containerControllerData: 'data-sourcetype="{{sourcetype}}" data-url="{{url}}"' +
													' data-link="{{download}}" data-mediatype="{{mediatype}}"'
					},
					customoptions:
					[
						{
							name: 'object',
							value: objectID
						}
					],
					format:
					{
						header:
						{
							class: 'd-flex',
							controller: 'util-attachments-show-format'
						},

						row:
						{
							data: 'data-id="{{attachment}}"',
							dataAll: 'data-attachmentlink="{{id}}" data-id="{{attachment}}"',
							class: 'd-flex',
							controller: controller
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
	name: 'util-attachments-show-format',
	code: function (row)
	{
		if (row.sourcetype == 2)
		{
			if (row.title == '') {row.title = row.url}
				
			row.attachmentLink = '<a href="' + row.url + '" target="_blank" class="myds-no-warn">' + 
									row.title + '</a>' ;
		}
		else
		{
			row.attachmentLink = '<a href="' + row.download + '" class="myds-no-warn">' + 
								row.filename.replace(/_/g, ' ') + '</a>';
		}

		if (row.typetext != '')
		{
			row.attachmentLink = '<div>' + row.attachmentLink + '</div><div class="text-muted small">' + row.typetext + '</div>';
		}

		row.showMedia = 'd-none';
		row.isVideo = _.includes(row.typetext.toLowerCase(), 'video');
		row.isImage = _.includes(row.filename.toLowerCase(), '.png')
						|| _.includes(row.filename.toLowerCase(), '.jpg')
						|| _.includes(row.filename.toLowerCase(), '.jpeg');

		row.isMedia = row.isVideo || row.isImage;
		row.mediatype = '';

		if (row.isMedia)
		{
			row.showMedia = '';
		}

		if (row.isVideo)
		{
			row.mediaclass = 'fa-video';
			row.mediatype = 'video';
		}

		if (row.isImage)
		{
			row.mediaclass = 'fa-image';
			row.mediatype = 'image';
		}

		row._date = app.invoke('util-date', {date: row.modifieddate, format: 'D MMM YYYY'});
		row._time = app.invoke('util-date', {date: row.modifieddate, format: 'H:mm:ss'});
		row.date = '<div>' + row._date + '</div><div class="text-muted small">' + row._time + '</div>';		
	}
});

app.add(
{
	name: 'util-attachments-show-delete-ok',
	code: function (param, response)
	{
		if (_.isUndefined(response))
		{
			var data =
			{
				id: param.dataContext.id,
			}

			if (_.includes(param.context, 'project-') || _.includes(param.context, 'template-'))
			{
				data.object = app.whoami().mySetup.objects.project;
			}

            if (_.includes(param.context, 'conversation-'))
			{
				data.object = 50;
			}

			if (_.includes(param.context, 'resource-'))
			{
				data.object = app.whoami().mySetup.objects.product;
			}

			if (!_.isUndefined(param.dataContext))
			{
				mydigitalstructure.delete(
				{
					object: 'core_attachment',
					data: data,
					callback: 'util-attachments-show-delete-ok'
				});
			}	
		}
		else
		{
			app.notify('Attachment (file) unlinked.');

			$('tr[data-id="' + param.data.id + '"] > td').addClass('d-none hidden')
		}
	}
});

app.add(
{
	name: 'util-attachment-link-process',
	code: function (param, response)
	{	
		if (_.isUndefined(response))
		{
			var context = app._util.param.get(param, 'context', {default: 'util'}).value;

			$('#' + context + '-attachments-link').collapse('hide');

			var data = app.get(
			{
				controller: context + '-attachments-link',
				cleanForCloudStorage: true,
				valueDefault: {}
			});

			data.sourcetype1 = 1;
			data.object = param.dataContext.object;
			data.objectcontext = param.dataContext.objectcontext;
		
			mydigitalstructure.cloud.invoke(
			{
				method: 'attach_file',
				data: data,
				callback: 'util-attachment-link-process',
				callbackParam: param
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('URL attached.');
			}
		}
	}
});

app.add(
{
	name: 'util-attachments-show-media',
	code: function (param)
	{	
		var status = app._util.param.get(param, 'status').value;

		if (status == 'shown')
		{
			var id = app._util.param.get(param.dataContext, 'id').value;
			var controller = app._util.param.get(param.dataContext, 'controller').value;
			var sourceURL = app._util.param.get(param.dataContext, 'url').value;
			var sourceType = app._util.param.get(param.dataContext, 'sourcetype').value;
			var link = app._util.param.get(param.dataContext, 'link').value;
			var mediaType = app._util.param.get(param.dataContext, 'mediatype').value;

			if (sourceType == 1)
			{
				sourceURL = link;
			}

			if (controller != undefined)
			{
				var selector = '#' + controller + '-' + param.dataContext.id + '-container-view';

				var element = $(selector);

				if (mediaType == 'video')
				{
					if (_.includes(sourceURL, 'youtube'))
					{
						sourceURL = sourceURL.replace('/watch?v=', '/embed/');

						element.html('<div class="embed-responsive embed-responsive-16by9"><iframe width="420" height="315"' +
							' class="embed-responsive-item" src="' + sourceURL + '">' +
						'</iframe></div>');
					}
					else
					{
						sourceURL = '/rpc/core/?method=CORE_FILE_READ_BINARY&id=' + id + '&contenttype=video/mp4';

						element.html('<video width="320" height="240" controls>' +
								'<source src="' + sourceURL + '" type="video/mp4">' + 
									'Your browser is too old to display videos this way.' +
							'</video>');
					}
				}

				if (mediaType == 'image')
				{
					var url = sourceURL;
					if (_.isEmpty(sourceURL))
					{
						url = link;
					}
					
					element.html('<img class="img-responsive img-fluid rounded" src="' + url + '">');
				}
			}
		}
	}
});

app.add(
{
	name: 'util-attachments-show-conversation',
	code: function (param, response)
	{
		var objectID = app._util.param.get(param, 'objectID').value;
		if (objectID == undefined)
		{
			objectID = app._util.param.get(param, 'object').value;
		}
		var objectContext = app._util.param.get(param, 'objectContext').value;
		var controller = app._util.param.get(param, 'controller', {default: 'util-attachments-show-format-conversation'}).value;
		var container = app._util.param.get(param, 'container').value;
		var context = app._util.param.get(param, 'context').value;
		var showUnlink = app._util.param.get(param, 'showUnlink', {default: true}).value;
		var showMedia = app._util.param.get(param, 'showMedia', {default: true}).value;
		var showUUID = app._util.param.get(param, 'showUUID', {default: false}).value;

		if (_.has(param, '_dataContext'))
		{
			if (_.isNotSet(objectID))
			{
				objectID = app._util.param.get(param._dataContext, 'object').value;
				objectContext = app._util.param.get(param._dataContext, 'objectContext').value;
				container = app._util.param.get(param._dataContext, 'container').value;
			}
		}

		var data = app.get({scope: 'util-attachments-show', valueDefault: {}});
		
		if (objectID != undefined && container != undefined)
		{
			var filters =
			[
				{	
					field: 'id',
					comparison: 'EQUAL_TO',
					value: objectContext
				},
                {	
					field: 'conversation.attachment.id',
					comparison: 'IS_NOT_NULL'
				}
			]

			if (_.isSet(data.search))
			{
				filters = _.concat(filters,
				[
					{ name: '(' },
					{	
						field: 'conversation.attachment.filename',
						comparison: 'TEXT_IS_LIKE',
						value: data.search
					},
					{ name: 'or' },
					{	
						field: 'conversation.attachment.url',
						comparison: 'TEXT_IS_LIKE',
						value: data.search
					},
					{ name: ')' }
					
				]);
			}

			var columns = [];

			if (showUnlink && showMedia)
			{
				if (showUUID)
				{
					columns = _.concat(columns,
					[
						{
							caption: 'Name',
							name: 'attachmentLink',
							sortBy: true,
							defaultSort: true,
							class: 'col-4 text-break text-wrap myds-click'
						},
						{
							caption: 'ID',
							field: 'conversation.attachment.guid',
							sortBy: true,
							defaultSort: true,
							class: 'col-4 text-break text-wrap text-muted small'
						}
					]);
				}
				else
				{
					columns = _.concat(columns,
					[
						{
							caption: 'Name',
							name: 'attachmentLink',
							sortBy: true,
							defaultSort: true,
							class: 'col-8 text-break text-wrap myds-click'
						}
					]);
				}
			}
			else if (showUnlink || showMedia)
			{
				if (showUUID)
				{
					columns = _.concat(columns,
					[
						{
							caption: 'Name',
							name: 'attachmentLink',
							sortBy: true,
							defaultSort: true,
							class: 'col-5 text-break text-wrap myds-click'
						},
						{
							caption: 'ID',
							field: 'conversation.attachment.guid',
							sortBy: true,
							defaultSort: true,
							class: 'col-4 text-break text-wrap text-muted small'
						}
					]);
				}
				else
				{
					columns = _.concat(columns,
					[
						{
							caption: 'Name',
							name: 'attachmentLink',
							sortBy: true,
							defaultSort: true,
							class: 'col-9 text-break text-wrap myds-click'
						}
					]);
				}
			}
			else 
			{
				if (showUUID)
				{
					columns = _.concat(columns,
					[
						{
							caption: 'Name',
							name: 'attachmentLink',
							sortBy: true,
							defaultSort: true,
							class: 'col-6 text-break text-wrap myds-click'
						},
						{
							caption: 'ID',
							field: 'conversation.attachment.guid',
							sortBy: true,
							defaultSort: true,
							class: 'col-4 text-break text-wrap text-muted small'
						}
					]);
				}
				else
				{
					columns = _.concat(columns,
					[
						{
							caption: 'Name',
							name: 'attachmentLink',
							sortBy: true,
							defaultSort: true,
							class: 'col-10 text-break text-wrap myds-click'
						}
					]);
				}
			}

			columns = _.concat(columns,
			[
				{
					caption: 'Date',
					name: 'date',
					sortBy: true,
					class: 'col-2 text-break text-wrap myds-click'
				}
			]);
			
			if (showUnlink && showMedia)
			{
				columns = _.concat(columns,
				[
					{
						html: '<a class="btn btn-default btn-outline btn-sm myds-collapse {{showMedia}}"' +
									' data-toggle="collapse" role="button"' +
									' href="#util-attachments-show-media-{{id}}-container"' +
							' id="util-attachments-show-video-{{conversation.attachment.attachment}}" data-id="{{conversation.attachment.attachment}}"' +
							' data-controller="util-attachments-show-media"' +
							' data-sourcetype="{{conversation.attachment.sourcetype}}" data-url="{{url}}"' +
							' data-link="{{conversation.attachment.download}}"' +
							'>' +
								'<i class="fa {{mediaclass}}"></i>' +
						'</a>' +
						'<button class="btn btn-danger btn-outline btn-sm myds-delete ml-2"' +
							' id="util-attachments-show-delete-{{conversation.attachment.attachment}}" data-id="{{conversation.attachment.attachment}}">' +
								'<i class="fa fa-unlink"></i>' +
						'</button>',
						caption: '&nbsp;',
						class: 'col-2 text-right pl-1'
					}
				]);
			}
			else if (showUnlink)
			{
				columns = _.concat(columns,
				[
					{
						html: '<button class="btn btn-danger btn-outline btn-sm myds-delete ml-2"' +
							' id="util-attachments-show-delete-{{attachment}}" data-id="{{conversation.attachment.attachment}}">' +
								'<i class="fa fa-unlink"></i>' +
						'</button>',
						caption: '&nbsp;',
						class: 'col-1 text-right'
					}
				]);
			}
			else if (showMedia)
			{
				columns = _.concat(columns,
				[
					{
						html: '<a class="btn btn-default btn-outline btn-sm myds-collapse {{showMedia}}"' +
									' data-toggle="collapse" role="button"' +
									' href="#util-attachments-show-media-{{id}}-container"' +
							' id="util-attachments-show-video-{{conversation.attachment.attachment}}" data-id="{{conversation.attachment.attachment}}"' +
							' data-controller="util-attachments-show-media"' +
							' data-sourcetype="{{conversation.attachment.sourcetype}}" data-url="{{url}}"' +
							' data-link="{{conversation.attachment.download}}"' +
							'>' +
								'<i class="fa {{mediaclass}}"></i>' +
						'</a>',
						caption: '&nbsp;',
						class: 'col-1 text-right'
					},
				]);
			}

			columns = _.concat(columns,
			[
				{
					fields:
					[
						'conversation.attachment.attachment',
						'conversation.attachment.filename',
						'conversation.attachment.download',
						'conversation.attachment.title',
						'conversation.attachment.url',
						'conversation.attachment.sourcetype',
						'conversation.attachment.type',
						'conversation.attachment.typetext',
						'conversation.attachment.modifieddate',
						'conversation.attachment.guid',
                        'conversation.attachment.id'
                    ]
				}
			]);
			
			app.invoke('util-view-table',
			{
				object: 'messaging_conversation',
				container: container,
				containerClass: '',
				context: 'util-attachments_' + context,
				filters: filters,
				options:
				{
					noDataText: '<div class="p-5">There are no attachment (files & links).</div>',
					rows: 20,
					orientation: 'vertical',
					progressive: true,
					class: 'table-condensed',
					deleteConfirm:
					{
						text: 'Are you sure you want to unlink this attachment?',
						position: 'left',
						headerText: 'Unlink attachment',
						buttonText: 'Unlink',
						controller: 'util-attachments-show-delete-ok'
					},
					footer: false,
					containerController: 'util-attachments-show-media',
					containerControllerData: 'data-sourcetype="{{conversation.attachment.sourcetype}}" data-url="{{conversation.attachment.url}}"' +
		               							' data-link="{{conversation.attachment.download}}" data-mediatype="{{mediatype}}"'
				},
				customoptions:
				[
					{
						name: 'object',
						value: objectID
					}
				],
				format:
				{
					header:
					{
						class: 'd-flex',
						controller: 'util-attachments-show-format'
					},

					row:
					{
						data: 'data-id="{{conversation.attachment.attachment}}"',
						dataAll: 'data-attachmentlink="{{conversation.attachment.id}}" data-id="{{conversation.attachment.attachment}}"',
						class: 'd-flex',
						controller: controller
					},

					columns: columns	
				}
			});
		}
	}
});

app.add(
{
	name: 'util-attachments-show-format-conversation',
	code: function (row)
	{
		if (row['conversation.attachment.sourcetype'] == 2)
		{
			if (row['conversation.attachment.title'] == '') {row['conversation.attachment.title'] = row['conversation.attachment.url']}
				
			row.attachmentLink = '<a href="' + row['conversation.attachment.url'] + '" target="_blank" class="myds-no-warn">' + 
									row['conversation.attachment.title'] + '</a>' ;
		}
		else
		{
			row.attachmentLink = '<a href="' + row['conversation.attachment.download'] + '" class="myds-no-warn">' + 
								row['conversation.attachment.filename'].replace(/_/g, ' ') + '</a>';
		}

		if (row['conversation.attachment.typetext'] != '')
		{
			row.attachmentLink = '<div>' + row['conversation.attachment.attachmentLink'] + '</div><div class="text-muted small">' + row['conversation.attachment.typetext'] + '</div>';
		}

		row.showMedia = 'd-none';
		row.isVideo = _.includes(row['conversation.attachment.typetext'].toLowerCase(), 'video');
		row.isImage = _.includes(row['conversation.attachment.filename'].toLowerCase(), '.png')
						|| _.includes(row['conversation.attachment.filename'].toLowerCase(), '.jpg')
						|| _.includes(row['conversation.attachment.filename'].toLowerCase(), '.jpeg');

		row.isMedia = row.isVideo || row.isImage;
		row.mediatype = '';

		if (row.isMedia)
		{
			row.showMedia = '';
		}

		if (row.isVideo)
		{
			row.mediaclass = 'fa-video';
			row.mediatype = 'video';
		}

		if (row.isImage)
		{
			row.mediaclass = 'fa-image';
			row.mediatype = 'image';
		}

		row._date = app.invoke('util-date', {date: row['conversation.attachment.modifieddate'], format: 'D MMM YYYY'});
		row._time = app.invoke('util-date', {date: row['conversation.attachment.modifieddate'], format: 'H:mm:ss'});
		row.date = '<div>' + row._date + '</div><div class="text-muted small">' + row._time + '</div>';		
	}
});


