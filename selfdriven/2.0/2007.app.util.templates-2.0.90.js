app.add(
{
	name: 'util-template-setup-edit',
	code: function (param, response)
	{
		var template = app._util.param.get(param, 'template').value;
		var viewScope = app._util.param.get(param, 'viewScope').value;

		if (_.isSet(viewScope))
		{
			viewScope = viewScope + '-edit';
		}
		else
		{
			viewScope = 'util-template-setup-edit';
		}

		app.set(
		{
			scope: 'util-template-setup-edit',
			context: 'viewScope',
			value: viewScope
		});
	
		if (response == undefined)
		{
			entityos.cloud.search(
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
						value: template.id
					},
					{
						field: 'filename',
						comparison: 'TEXT_IS_LIKE',
						value: '.template.'
					}
				],
				sorts:
				[
					{
						field: 'modifieddate',
						direction: 'desc'
					}
				],
				customOptions: [{name: 'object', value: app.whoami().mySetup.objects.project}],
				rows: 1,
				callback: 'util-template-setup-edit',
				callbackParam: param
			});
		}
		else
		{	
			template.file = _.first(response.data.rows)

			app.set(
			{
				scope: 'util-template-setup-edit',
				context: 'source-template',
				value: template
			});

			console.log(template)

			app.invoke('util-template-file-get', 
			{
				templateFile: template.file,
				onComplete: 'util-template-get-schema',
				onCompleteWhenCan: 'util-template-setup-edit-show'
			});
		}
	}
});

app.add(
{
	name: 'util-template-setup-edit-by-context',
	code: function (param)
	{
		var type = app._util.param.get(param.dataContext, 'type', {default: 'add'}).value;
		var name = app._util.param.get(param.dataContext, 'name').value; //e.g. template.definition.outcomes
		var context = app._util.param.get(param.dataContext, 'context').value; //e.g. outcomes

		var template = app.get(
		{
			scope: 'util-template-setup-edit',
			context: 'source-template'
		});
		
		var templateFile = template._file;
		
		var contextData = _.get(templateFile, name);

		if (_.isNotSet(contextData))
		{
			_.set(templateFile, name, []);
			contextData = _.get(templateFile, name);
		}

		if (contextData != undefined)
		{
			if (type == 'add')
			{
				let data = {};

				if (context == 'outcomes')
				{
					data =
					{
						by: '',
						description: ''
					}
				}

				if (context == 'team')
				{
					data =
					{
						notes: '',
						roles: [],
						members: []
					}
				}

				if (context == 'team-members')
				{
					data =
					{
						name : '',
						sdi: '',
						type: ''
					}
				}

				if (context == 'team-roles')
				{
					data =
					{
						name : '',
						caption: ''
					}
				}

				if (context == 'rules')
				{
					data =
					{
						for: '',
						subject: '',
						description: ''
					}
				}

				if (context == 'resources')
				{
					data =
					{
						subject: '',
						description: '',
						imageurl: '',
						for: ''
					}
				}

				if (context == 'spaces')
				{
					data =
					{
						type: '',
						reference: '',
						name: '',
						url: ''
					}
				}

				if (context == 'milestones')
				{
					data =
					{
						reference: (contextData.length + 1),
						subject: '',
						description: "",
						durationdays: {},
						tasks: []
					}
				}

				if (context == 'milestones-tasks')
				{
					const milestoneReference = (parseInt(_.replace(_.replace(name, 'template.definition.milestones.', ''), '.tasks', '')) + 1)

					const reference = milestoneReference + '-' + (contextData.length + 1)

					data =
					{
						reference: reference,
						subject: '',
						description: '',
						by: '',
						durationdays: {},
						resources: [],
						reflections: [],
						supportitems: []
					}
				}

				if (context == 'milestones-tasks-resources')
				{
					data =
					{
						subject: '',
						url: ''
					}
				}

				if (context == 'milestones-tasks-reflections')
				{
					data =
					{
						by: '',
						method: '',
						type: '',
						description: ''
					}
				}

				if (context == 'milestones-tasks-supportitems')
				{
					data =
					{
						for: '',
						description: ''
					}
				}

				if (context == 'milestones-tasks-reflections-structure-options')
				{
					data =
					{
						name: '',
						caption: '',
						points: '',
						sequence: ''
					}
				}

				if (context == 'milestones-tasks-reflections-structure-controllers')
				{
					data =
					{
						type: 'if',
						comparison: 'equal-to',
						points: '',
						status: ''
					}
				}

				contextData.push(data);

				param.showIndex = (contextData.length - 1)
			}
			else if (type == 'remove')
			{
				app.invoke('util-template-setup-edit-by-context-remove', param);
			}
			else
			{}
		}

		param.status = 'shown';
		app.invoke('util-template-setup-edit-by-context-show', param);
	}
});

app.add(
{
	name: 'util-template-setup-edit-by-context-remove',
	code: function (param)
	{
		var name = app._util.param.get(param.dataContext, 'name').value; //e.g. template.definition.outcomes
		var context = app._util.param.get(param.dataContext, 'context').value; //e.g. outcomes
		var viewContext = app._util.param.get(param.dataContext, 'viewContext').value; //e.g. outcomes
		var contextIndex = app._util.param.get(param.dataContext, 'contextIndex', {default: 0}).value;
		const index = app._util.param.get(param.dataContext, 'index', {default: 0}).value;

		var template = app.get(
		{
			scope: 'util-template-setup-edit',
			context: 'source-template'
		});

		var templateEditLog = app.get(
		{
			scope: 'util-template-setup-edit',
			context: 'log',
			valueDefault: []
		});
		
		var templateFile = template._file;

		var contextData = _.get(templateFile, name);

		templateEditLog.push(
		{
			type: 'remove',
			data: contextData,
			dataContext:
			{
				name: name,
				index: index,
				context: context,
				contextIndex: contextIndex,
				viewContext: viewContext
			},
			uuid: app.invoke('util-uuid')
		});

		app.set(
		{
			scope: 'util-template-setup-edit',
			context: 'log',
			value: templateEditLog
		});

		var contextDataNew = _.filter(contextData, function (data, index)
		{
			return (index != contextIndex)
		})

		console.log(param);
		console.log(contextData);
		console.log(contextDataNew);

		_.set(templateFile, name, contextDataNew);

		param.status = 'shown';
		app.invoke('util-template-setup-edit-by-context-show', param);
	}
});

app.add(
{
	name: 'util-template-setup-edit-by-context-add',
	code: function (param)
	{
		let name = app._util.param.get(param.dataContext, 'name').value; //e.g. template.definition.outcomes
		const uuid = app._util.param.get(param.dataContext, 'uuid').value;

		var template = app.get(
		{
			scope: 'util-template-setup-edit',
			context: 'source-template'
		});

		const templateEditLog = app.get(
		{
			scope: 'util-template-setup-edit',
			context: 'log',
			valueDefault: []
		});

		const _templateEditLog = _.find(templateEditLog, function (log)
		{
			return (log.uuid == uuid)
		});

		if (_.isSet(_templateEditLog))
		{
			param.dataContext = _templateEditLog.dataContext;

			var templateFile = template._file;

			if (_.isSet(name))
			{
				param.dataContext.name = name;
			}

			if (_.isNotSet(name))
			{
				name = _templateEditLog.dataContext.name;
			}

			var contextData = _.get(templateFile, name);
			if (contextData == undefined) {contextData = []}
			
			const contextDataAdd = _templateEditLog.data;
			contextData.push(contextDataAdd)

			_.set(templateFile, name, contextData);

			param.status = 'shown';
			app.invoke('util-template-setup-edit-by-context-show', param);
		}
	}
});

app.add(
{
	name: 'util-template-setup-edit-by-context-show',
	code: function (param)
	{		
		if (_.get(param, 'status') == 'shown')
		{
			var template = app.get(
			{
				scope: 'util-template-setup-edit',
				context: 'source-template'
			});

			var templateFile = template._file;
			var projectTemplate = templateFile.template.definition;

			var context = app._util.param.get(param.dataContext, 'context').value;
			var name = app._util.param.get(param.dataContext, 'name').value;
			var nameIndex = app._util.param.get(param.dataContext, 'nameIndex', {default: 0}).value;
			var contextIndex = app._util.param.get(param.dataContext, 'index').value;
			var _name = _.replace(name, 'template.definition', '');
			var _nameContext = _.replaceAll(_name, /\./g, '-');

			var viewScope = app.get(
			{
				scope: 'util-template-setup-edit',
				context: 'viewScope'
			});

			let viewContext = app._util.param.get(param.dataContext, 'viewContext').value;
			if (_.isNotSet(viewContext)) {viewContext = context}

			let _contextIndex = '';
			if (_.isSet(contextIndex))
			{
				_contextIndex = '-' + contextIndex;
			}

			if (_.isSet(context))
			{
				var templateEditContextView = app.vq.init({queue: 'util-template-setup-edit-by-context-show'});

				templateEditContextView.add(
				[
					'<div class="row pt-1">',
						'<div class="col-2 pt-1 pl-3 x-border-right">',
							'<div class="nav flex-column nav-pills border rounded entityos-tab" id="' + viewScope + '-', context, _contextIndex, '-pills-tab"',
								'role="tablist" aria-orientation="vertical">'
				]);

				var showIndex = app._util.param.get(param, 'showIndex', {default: 0}).value;

				// Side Tabs

				let contextDataLength = 0;
				const contextData = app.invoke('util-param-get', name, templateFile);
				if (_.isSet(contextData)) {contextDataLength = contextData.length }

				app.vq.show('#' + viewScope + '-' + context + '-header-count',
				[
					'(' + contextDataLength + ')'
				]);

				_.each(contextData, function (data, index)
				{
					var activeClass = (index==showIndex?' active':'');

					templateEditContextView.add(
					[
								'<a class="nav-link text-center fw-bold', activeClass, '"',
									' id="' + viewScope + '-', context, '-pills-', index ,'-tab" ',
									' data-toggle="pill" href="#' + viewScope + '-', viewContext, '-', index, '-pills" role="tab"',
									' aria-controls="' + viewScope + '-', viewContext, '-', index, '-pills" aria-selected="true"',
									' data-context="', context, '"',
									' data-view-context="', viewContext, '"',
									' data-index="', index, '"',
									' data-name="', name, '"',
									' data-name-index="', index, '"',
									' data-controller="util-template-setup-edit-set-header">',
										(index + 1),
								'</a>'
					]);
				});

				templateEditContextView.add(
				[
								'<button class="btn btn-sm btn-light myds-click mt-2" data-controller="util-template-setup-edit-by-context" role="button"',
									' data-name="', name, '"',
									' data-context="', context, '"',
									' data-type="add" data-prevent="true"',
									' data-index="', contextDataLength, '"',
									' data-reference-format="', (nameIndex + 1), '-?"',
									' data-context-index="', contextIndex, '"',
									' data-view-context="', viewContext, '">',
										'<i class="fe fe-plus"></i>',
								'</button>',		
							'</div>',
						'</div>',
						'<div class="col-10 pt-0 pl-3">',
							'<div id="' + viewScope + '-', viewContext, '-header-view"></div>',
							'<div class="tab-content" id="' + viewScope + '-', viewContext, '-pills-tabcontent">',
				]);

				// Tab Containers

				_.each(contextData, function (data, index)
				{
					var activeClass = (index==showIndex?' show active':'');

					templateEditContextView.add(
					[
								'<div class="tab-pane fade', activeClass, '"',
									' id="' + viewScope + '-', viewContext, '-', index, '-pills" role="tabpanel"',
									' aria-labelledby="' + viewScope + '-', viewContext, '-', index ,'-pills-tab">',
									'<form autocomplete="off">'
					]);

					if (context == 'outcomes')
					{
						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: 'outcomes.' + index + '.description',
								caption: 'Description',
								type: 'textarea',
								context: 'outcomes'
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: 'outcomes.' + index + '.by',
								context: 'outcomes',
								caption: 'By',
								type: 'select',
								data:
								[
									{
										id: 'learner',
										text: 'Learner'
									},
									{
										id: 'learning-partner',
										text: 'Learning Partner'
									}
								]
							},
							projectTemplate)
						);
					}

					if (context == 'spaces')
					{
						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: 'spaces.' + index + '.by',
								context: 'spaces',
								caption: 'Type',
								type: 'select',
								data:
								[
									{
										id: 'physical',
										text: 'Physical'
									},
									{
										id: 'virtual',
										text: 'Virtual'
									}
								]
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: 'spaces.' + index + '.reference',
								caption: 'Reference',
								type: 'input',
								context: 'spaces'
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: 'spaces.' + index + '.name',
								caption: 'Name',
								type: 'input',
								context: 'spaces'
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: 'spaces.' + index + '.url',
								caption: 'URL',
								type: 'input',
								context: 'spaces'
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: 'spaces.' + index + '.milestone-reference',
								caption: 'Milestone Reference (use * for all)',
								type: 'input',
								context: 'spaces'
							},
							projectTemplate)
						);
					}

					if (context == 'rules')
					{
						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: 'rules.' + index + '.subject',
								caption: 'Subject',
								type: 'input'
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: 'rules.' + index + '.description',
								caption: 'Rule Description',
								type: 'textarea'
							},
							projectTemplate)
						);
					}

					if (context == 'resources')
					{
						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: 'resources.' + index + '.subject',
								caption: 'Subject',
								type: 'input'
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: 'resources.' + index + '.description',
								caption: 'Description',
								type: 'textarea'
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: 'resources.' + index + '.url',
								caption: 'URL',
								type: 'input'
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: 'resources.' + index + '.imageurl',
								caption: 'Image URL',
								type: 'input'
							},
							projectTemplate)
						);
					}

					// TEAM

					if (context == 'xeam')
					{
						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: 'team.notes',
								caption: 'Notes',
								type: 'input'
							},
							projectTemplate)
						);

						templateEditContextView.add(
						[
							'<div class="card mt-4">',
								'<div class="card-header bg-light">',
									'<div class="row align-items-end">',
										'<div class="col">',
											'<h4 class="mb-1" style="font-size:1.2rem;">',
												'<a class="myds-collapse-toggle" data-toggle="collapse" role="button" ',
													' data-related-selector="#' + viewScope + '-team-members-collapse-container"',
													' href="#' + viewScope + '-team-members-collapse">',
													'Members ',
														app.invoke('util-template-setup-edit-set-header-count',
															{
																context: 'team-members',
																name: 'template.definition.team.members'
															},
															templateFile),
												'</a>',
											'</h4>',
										'</div>',
										'<div class="col-auto pb-1">',
											'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button"',
											' href="' + viewScope + '-team-members-collapse"',
											' id="' + viewScope + '-team-members-collapse-container"',
											'>',
												'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
											'</a>',
										'</div>',
									'</div>',
								'</div>',
								'<div class="card-body collapse myds-collapse pt-3" id="' + viewScope + '-team-members-collapse"',
									' data-controller="util-template-setup-edit-by-context-show"',
									' data-context="team-members" ',
									' data-view-context="team-members" ',
									' data-name="template.definition.team.members"',
									' data-index="', index, '">',
									'<div id="' + viewScope + '-team-members-view">',
									'</div>',
								'</div>',
							'</div>'
						]);
					}

					if (context == 'team-members')
					{
						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: _name + '.' + index + '.name',
								caption: 'Name',
								type: 'input'
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name:  _name + '.' + index + '.sdi',
								caption: 'SDI #',
								type: 'input'
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name:  _name + '.' + index + '.type',
								caption: 'Type (eg mentor',
								type: 'input'
							},
							projectTemplate)
						);
					}

					// MILESTONES

					if (context == 'milestones')
					{
						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: 'milestones.' + index + '.reference',
								caption: 'Reference # (e.g. 1)',
								type: 'input'
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: 'milestones.' + index + '.subject',
								caption: 'Subject',
								type: 'input'
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: 'milestones.' + index + '.description',
								caption: 'Description',
								type: 'textarea'
							},
							projectTemplate)
						);

						templateEditContextView.add(
						[
							'<div class="card mt-4">',
								'<div class="card-header bg-light">',
									'<div class="row align-items-end">',
										'<div class="col">',
											'<h4 class="mb-1" style="font-size:1.2rem;">',
												'<a class="myds-collapse-toggle" data-toggle="collapse" role="button" ',
													' data-related-selector="#' + viewScope + '-milestones-', index, '-tasks-collapse-container"',
													' href="#' + viewScope + '-milestones-', index, '-tasks-collapse">',
													'Tasks | Units ',
														app.invoke('util-template-setup-edit-set-header-count',
															{
																context: 'milestones-tasks',
																name: 'template.definition.milestones.' + index + '.tasks'
															},
															templateFile),
												'</a>',
											'</h4>',
										'</div>',
										'<div class="col-auto pb-1">',
											'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button"',
											' href="' + viewScope + '-milestones-', index, '-tasks-collapse"',
											' id="' + viewScope + '-milestones-', index, '-tasks-collapse-container"',
											'>',
												'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
											'</a>',
										'</div>',
									'</div>',
								'</div>',
								'<div class="card-body collapse myds-collapse pt-3" id="' + viewScope + '-milestones-', index, '-tasks-collapse"',
									' data-controller="util-template-setup-edit-by-context-show"',
									' data-context="milestones-tasks" ',
									' data-view-context="milestones-', index, '-tasks" ',
									' data-name="template.definition.milestones.', index, '.tasks"',
									' data-index="', index, '">',
									'<div id="' + viewScope + '-milestones-', index, '-tasks-view">',
									'</div>',
								'</div>',
							'</div>'
						]);
					}

					if (context == 'milestones-tasks')
					{
						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: _name + '.' + index + '.reference',
								caption: 'Reference # (e.g. 1-1)',
								type: 'input'
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name:  _name + '.' + index + '.subject',
								caption: 'Subject',
								type: 'input'
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: _name + '.' + index + '.description',
								caption: 'Description',
								type: 'textarea'
							},
							projectTemplate)
						);

						templateEditContextView.add(
						[
							'<div class="card mt-4">',
								'<div class="card-header bg-light">',
									'<div class="row align-items-end">',
										'<div class="col">',
											'<h4 class="mb-1" style="font-size:1.1rem;">',
												'<a class="myds-collapse-toggle" data-toggle="collapse" role="button" ',
													' data-related-selector="#' + viewScope, _nameContext, '-', index, '-resources-collapse-container"',
													' href="#' + viewScope, _nameContext, '-', index, '-resources-collapse">',
													' Resources ',
														app.invoke('util-template-setup-edit-set-header-count',
															{
																context: 'milestones-tasks-resources',
																name: name + '.' + index + '.resources'
															},
															templateFile),
												'</a>',
											'</h4>',
										'</div>',
										'<div class="col-auto pb-1">',
											'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button"',
											' href="#' + viewScope, _nameContext, '-', index, '-resources-collapse"',
												'id=' + viewScope, _nameContext, '-', index, '-resources-collapse-container"',
											'>',
												'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
											'</a>',
										'</div>',
									'</div>',
								'</div>',
								'<div class="card-body collapse myds-collapse pt-3" id="util-template-setup-edit', _nameContext, '-', index, '-resources-collapse"',
									' data-controller="util-template-setup-edit-by-context-show"',
									' data-context="milestones-tasks-resources" data-name="', name, '.', index, '.resources"',
									' data-view-context="', _nameContext, '-', index, '-resources" ',
									'>',
									'<div id="' + viewScope, _nameContext, '-', index, '-resources-view">',
									'</div>',
								'</div>',
							'</div>'
						]);

						templateEditContextView.add(
						[
							'<div class="card mt-4">',
								'<div class="card-header bg-light">',
									'<div class="row align-items-end">',
										'<div class="col">',
											'<h4 class="mb-1" style="font-size:1.1rem;">',
												'<a class="myds-collapse-toggle" data-toggle="collapse" role="button" ',
													' data-related-selector="#' + viewScope, _nameContext, '-', index, '-supportitems-collapse-container"',
													' href="#' + viewScope, _nameContext, '-', index, '-supportitems-collapse">',
													' Support Items ',
														app.invoke('util-template-setup-edit-set-header-count',
															{
																context: 'milestones-tasks-supportitems',
																name: name + '.' + index + '.supportitems'
															},
															templateFile),
												'</a>',
											'</h4>',
										'</div>',
										'<div class="col-auto pb-1">',
											'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button"',
											' id="' + viewScope, _nameContext, '-', index, '-supportitems-collapse-container"',
											' href="#' + viewScope, _nameContext, '-', index, '-supportitems-collapse">',
												'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
											'</a>',
										'</div>',
									'</div>',
								'</div>',
								'<div class="card-body collapse myds-collapse pt-3" id="util-template-setup-edit', _nameContext, '-', index, '-supportitems-collapse"',
									' data-controller="util-template-setup-edit-by-context-show"',
									' data-context="milestones-tasks-supportitems" data-name="', name, '.', index, '.supportitems"',
									' data-view-context="', _nameContext, '-', index, '-supportitems" ',
									'>',
									'<div id="' + viewScope, _nameContext, '-', index, '-supportitems-view">',
									'</div>',
								'</div>',
							'</div>'
						]);

						templateEditContextView.add(
						[
							'<div class="card mt-4">',
								'<div class="card-header bg-light">',
									'<div class="row align-items-end">',
										'<div class="col">',
											'<h4 class="mb-1" style="font-size:1.1rem;">',
												'<a class="myds-collapse-toggle" data-toggle="collapse" role="button" ',
													' data-related-selector="#' + viewScope, _nameContext, '-', index, '-reflections-collapse-container"',
													' href="#' + viewScope, _nameContext, '-', index, '-reflections-collapse">',
													'Reflections | Quizzes ',
														app.invoke('util-template-setup-edit-set-header-count',
															{
																context: 'milestones-tasks-reflections',
																name: name + '.' + index + '.reflections'
															},
															templateFile),
												'</a>',
											'</h4>',
										'</div>',
										'<div class="col-auto pb-1">',
											'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button"',
											' href="#' + viewScope, _nameContext, '-', index, '-reflections-collapse"',
											' id="' + viewScope, _nameContext, '-', index, '-reflections-collapse-container"',
											'>',
												'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
											'</a>',
										'</div>',
									'</div>',
								'</div>',
								'<div class="card-body collapse myds-collapse" id="util-template-setup-edit', _nameContext, '-', index, '-reflections-collapse"',
									' data-controller="util-template-setup-edit-by-context-show"',
									' data-context="milestones-tasks-reflections" data-name="', name, '.', index, '.reflections"',
									' data-view-context="', _nameContext, '-', index, '-reflections" ',
									'>',
									'<div id="' + viewScope, _nameContext, '-', index, '-reflections-view">',
									'</div>',
								'</div>',
							'</div>'
						]);
					}

					if (context == 'milestones-tasks-resources')
					{
						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: _name + '.' + index + '.subject',
								caption: 'Subject',
								type: 'input'
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: _name + '.' + index + '.description',
								caption: 'Description',
								type: 'textarea'
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: _name + '.' + index + '.url',
								caption: 'URL',
								type: 'input'
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: _name + '.' + index + '.imageurl',
								caption: 'Image URL',
								type: 'input'
							},
							projectTemplate)
						);
					}

					if (context == 'milestones-tasks-supportitems')
					{
						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: _name + '.' + index + '.subject',
								caption: 'Subject',
								type: 'input'
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: _name + '.' + index + '.description',
								caption: 'Description',
								type: 'textarea'
							},
							projectTemplate)
						);
					}

					if (context == 'milestones-tasks-reflections')
					{
						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: _name + '.' + index + '.method',
								caption: 'Type',
								type: 'select',
								data:
								[
									{
										id: 'observation',
										text: 'Freeform Text'
									},
									{
										id: 'structured',
										text: 'Selectable Options'
									},
									{
										id: 'attachment',
										text: 'Attach a File'
									},
									{
										id: 'url',
										text: 'Link to a URL'
									},
									{
										id: 'onchain',
										text: 'On-Chain Verifiable Credential/Token'
									}
								]
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: _name + '.' + index + '.subject',
								caption: 'Subject',
								type: 'input'
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: _name + '.' + index + '.description',
								caption: 'Description',
								type: 'textarea',
								editor: true
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: _name + '.' + index + '.controller',
								caption: 'Options Sort <span style="font-weight:100;" class="small text-muted">(If Type is Selectable Options)</span>',
								type: 'select',
								data:
								[
									{
										id: 'sort:randomise',
										text: 'Randomise/Shuffle'
									},
									{
										id: 'sort:asis',
										text: 'Not Sorted'
									},
									{
										id: 'sort:caption',
										text: 'Sort By Caption'
									},
									{
										id: 'sort:sequence',
										text: 'Sort By Sequence'
									}
								]
							},
							projectTemplate)
						);

						templateEditContextView.add(
						[
							'<div class="card mt-4">',
								'<div class="card-header bg-light">',
									'<div class="row align-items-end">',
										'<div class="col">',
											'<h4 class="mb-1" style="font-size:1.1rem;">',
												'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" ',
													' data-related-selector="#' + viewScope, _nameContext, '-', index, '-structure-options-collapse-container"',
													' href="#' + viewScope, _nameContext, '-', index, '-structure-options-collapse">',
													'Options ',
														app.invoke('util-template-setup-edit-set-header-count',
															{
																context: 'milestones-tasks-reflections-structure-options',
																name: name + '.' + index + '.structure.options'
															},
															templateFile),
												'</a>',
											'</h4>',
										'</div>',
										'<div class="col-auto pb-1">',
											'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#' + viewScope, _nameContext, '-', index, '-structure-options-collapse"',
												' id="' + viewScope, _nameContext, '-', index, '-structure-options-collapse-container"',
											'>',
												'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
											'</a>',
										'</div>',
									'</div>',
								'</div>',
								'<div class="card-body collapse myds-collapse" id="util-template-setup-edit', _nameContext, '-', index, '-structure-options-collapse"',
									' data-controller="util-template-setup-edit-by-context-show"',
									' data-context="milestones-tasks-reflections-structure-options"',
									' data-name="', name, '.', index, '.structure.options"',
									' data-view-context="', _nameContext, '-', index, '-structure-options" ',
									'>',
									'<div id="' + viewScope, _nameContext, '-', index, '-structure-options-view">',
									'</div>',
								'</div>',
							'</div>'
						]);

						templateEditContextView.add(
						[
							'<div class="card mt-4">',
								'<div class="card-header bg-light">',
									'<div class="row align-items-end">',
										'<div class="col">',
											'<h4 class="mb-1" style="font-size:1.1rem;">',
												'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" ',
													' data-related-selector="#' + viewScope, _nameContext, '-', index, '-structure-options-collapse-container"',
													' href="#' + viewScope, _nameContext, '-', index, '-structure-controllers-collapse">',
													'Controllers <span class="text-muted small">[Advanced]</span> ',
														app.invoke('util-template-setup-edit-set-header-count',
															{
																context: 'milestones-tasks-reflections-structure-controllers',
																name: name + '.' + index + '.structure.controllers'
															},
															templateFile),
												'</a>',
											'</h4>',
										'</div>',
										'<div class="col-auto pb-1">',
											'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-template-setup-edit', _nameContext, '-', index, '-structure-controllers-collapse"',
												' id="util-template-setup-edit', _nameContext, '-', index, '-structure-controllers-collapse-container"',
											'>',
												'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
											'</a>',
										'</div>',
									'</div>',
								'</div>',
								'<div class="card-body collapse myds-collapse" id="' + viewScope, _nameContext, '-', index, '-structure-controllers-collapse"',
									' data-controller="util-template-setup-edit-by-context-show"',
									' data-context="milestones-tasks-reflections-structure-controllers"',
									' data-name="', name, '.', index, '.structure.controllers"',
									' data-view-context="', _nameContext, '-', index, '-structure-controllers" ',
									'>',
									'<div id="' + viewScope, _nameContext, '-', index, '-structure-controllers-view">',
									'</div>',
								'</div>',
							'</div>'
						]);
					}

					if (context == 'milestones-tasks-reflections-structure-options')
					{
						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: _name + '.' + index + '.caption',
								caption: 'Caption',
								type: 'input'
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: _name + '.' + index + '.points',
								caption: 'Points',
								type: 'input'
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: _name + '.' + index + '.name',
								caption: 'Name',
								type: 'input'
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: _name + '.' + index + '.sequence',
								caption: 'Sequence Number<br/><span style="font-weight:100;" class="small text-muted">(If Options Display is Sort By Sequence)</span>',
								type: 'input'
							},
							projectTemplate)
						);

						templateEditContextView.add(
						[
							 '<div class="mb-3 small text-secondary">For basic use, set the Points value on correct options to "1", leave blank for other options.</div>'
						]);
					}

					if (context == 'milestones-tasks-reflections-structure-controllers')
					{
						/*templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: _name + '.' + index + '.type',
								caption: 'Type',
								type: 'select',
								data:
								[
									{
										id: 'if',
										text: 'If'
									}
								]
							},
							projectTemplate)
						);*/

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: _name + '.' + index + '.comparison',
								caption: 'Comparison',
								type: 'select',
								data:
								[
									{
										id: 'equalto',
										text: 'Equal To'
									},
									{
										id: 'notequalto',
										text: 'Not Equal To'
									}
								]
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: _name + '.' + index + '.points',
								caption: 'Points',
								type: 'input'
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: _name + '.' + index + '.status',
								caption: 'Set Status To',
								type: 'select',
								data:
								[
									{
										id: 'complete',
										text: 'Correct | Complete'
									},
									{
										id: 'inprogress',
										text: 'In-Correct | In Progress'
									}
								]
							},
							projectTemplate)
						);
					}

					// SKILLS GAINED

					if (context == 'skills-gained')
					{
						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: 'skills.gained.' + index + '.uri',
								caption: 'URI',
								type: 'input'
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: 'skills.gained.' + index + '.name',
								caption: 'Name',
								type: 'input'
							},
							projectTemplate)
						);

						templateEditContextView.add(
							app.invoke('util-template-setup-edit-element',
							{
								name: 'skills.gained.' + index + '.sdi',
								caption: 'SDI',
								type: 'input'
							},
							projectTemplate)
						);
					}

					templateEditContextView.add(
					[
						'<button class="btn btn-sm btn-light myds-click mt-0 float-right" role="button"',
							' data-controller="util-template-setup-edit-by-context-remove"',
							' data-name="', name, '"',
							' data-context="', context, '"',
							' data-prevent="true"',
							' data-index="', index, '"',
							' data-context-index="', contextIndex, '"',
							' data-view-context="', viewContext, '">',
								'<i class="fe fe-trash text-danger"></i>',
						'</button>'
					]);	

					templateEditContextView.add(
					[
									'</form>',	
								'</div>'
					]);
				});

				templateEditContextView.add(
				[		
							'</div>',
						'</div>',
					'</div>'
				]);

				if (_.startsWith(viewContext, '-'))
				{
					templateEditContextView.render('#' + viewScope + viewContext + '-view');
				}
				else
				{
					templateEditContextView.render('#' + viewScope + '-' + viewContext + '-view');
				}

				// Header
				app.invoke('util-template-setup-edit-set-header',
				{
					status: 'shown',
					dataContext:
					{
						index: showIndex,
						context: context,
						viewContext: viewContext,
						name: name
					} 
				});

				// Editors

				if (context == 'milestones-tasks')
				{
					_.each(contextData, function (_contextData, _contextDataIndex)
					{
						var inputElementName = _.replaceAll(_name + '.' + _contextDataIndex + '.description', '\\.', '-');

						app.invoke('util-view-editor',
						{
							selector: '#util-template-setup-edit-template-project' + inputElementName,
							height: '340px',
							simple: true
						});
					});

					//content: data.notes
				}
			}
		}
	}
});

app.add(
{
	name: 'util-template-setup-edit-show',
	code: function (param)
	{
		var containerSelector = app._util.param.get(param, 'containerSelector', {default: '#util-template-structure-edit'}).value;
		if ($(containerSelector).length == 0)
		{
			containerSelector = app.whoami().thisInstanceOfMe.view.uriContext + '-information-edit';
		}

		var viewScope = app.get(
		{
			scope: 'util-template-setup-edit',
			context: 'viewScope'
		});

		var template = app.get(
		{
			scope: 'util-template-setup-edit',
			context: 'source-template'
		});

		var templateFile = app._util.param.get(param, '_file').value;
		
		if (_.isNotSet(templateFile))
		{
			templateFile = template._file;
		}
		else
		{
			template._file = templateFile;
		}
		
		/*app._util.data.clear(
		{
			scope: 'util-template-setup-edit-show-milestone-tasks',
			context: 'tasks'
		});*/

		var templateFileView = app.vq.init({queue: 'util-template-setup-edit-show'});

		if (templateFile == undefined)
		{
			templateFileView.add(
			[
				'<div class="card mt-2">',
					'<div class="card-body">',
						'<div class="text-secondary">No template definition file.</div>',
					'</div>',
				'</div>'
			]);

			templateFileView.render(containerSelector);
		}
		else
		{
			if (_.has(templateFile, 'template.definition'))
			{
				templateFileView.add(
				[	
					'<div class="card mt-2">',
						'<div class="card-header bg-light">',
							'<div class="float-left">',
								'<h3 class="fw-bold mt-2 mb-0">Edit ', template.file.filename, '</h3>',
							'</div>',
							'<div class="float-right">',
								'<button class="btn btn-default btn-outline myds-click" ',
									' data-controller="util-template-setup-edit-save" id="util-template-setup-edit-',
									template.file.id, '"',
									' data-context="', template.file.id, '" data-id="', template.file.id, '">Save</button>',
							'</div>',
						'</div>',
						'<div class="card-body">'
				]);

				var projectTemplate = templateFile.template.definition;
				//if (projectTemplate == undefined) {projectTemplate = templateFile.template.project};

				// ABOUT

				templateFileView.add(
				[
					'<div class="card mt-0">',
						'<div class="card-header bg-light">',
							'<div class="row align-items-end">',
								'<div class="col">',
									'<h3 class="mb-0" style="font-size:1.4rem;">',
										'<a class="myds-collapse-toggle" data-toggle="collapse" role="button" ',
											' data-related-selector="#' + viewScope + '-root-collapse-container"',
											' href="#' + viewScope + '-root-collapse">',
											'About',
										'</a>',
									'</h3>',
								'</div>',
								'<div class="col-auto pb-1">',
									'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#' + viewScope + '-root-collapse"',
										' id="' + viewScope + '-root-collapse-container"',
									'>',
										'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
									'</a>',
								'</div>',
							'</div>',
						'</div>',
						'<div class="collapse myds-collapse" id="' + viewScope + '-root-collapse">',
							'<div class="card-body">',
								'<form autocomplete="off">'
				]);

							templateFileView.add(
								app.invoke('util-template-setup-edit-element',
								{
									name: 'name',
									caption: 'Name',
									type: 'input'
								},
								projectTemplate)
							);

							templateFileView.add(
								app.invoke('util-template-setup-edit-element',
								{
									name: 'type',
									caption: 'Type',
									type: 'select',
									data:
									[
										{
											id: 'learning',
											text: 'Learning'
										},
										{
											id: 'project',
											text: 'Project'
										},
										{
											id: 'nextsteps',
											text: 'Next Steps'
										},
										{
											id: 'community',
											text: 'Community'
										}
									]
								},
								projectTemplate)
							);

							templateFileView.add(
								app.invoke('util-template-setup-edit-element',
								{
									name: 'title',
									caption: 'Title',
									type: 'input'
								},
								projectTemplate)
							);

							templateFileView.add(
								app.invoke('util-template-setup-edit-element',
								{
									name: 'summary',
									caption: 'Summary',
									type: 'textarea'
								},
								projectTemplate)
							);

							templateFileView.add(
								app.invoke('util-template-setup-edit-element',
								{
									name: 'description',
									caption: 'Description',
									type: 'textarea'
								},
								projectTemplate)
							);

							templateFileView.add(
								app.invoke('util-template-setup-edit-element',
								{
									name: 'url',
									caption: 'More Information URL',
									type: 'input'
								},
								projectTemplate)
							);

							templateFileView.add(
								app.invoke('util-template-setup-edit-element',
								{
									name: 'urlcaption',
									caption: 'More Information URL Captions',
									type: 'input'
								},
								projectTemplate)
							);

							templateFileView.add(
								app.invoke('util-template-setup-edit-element',
								{
									name: 'controller',
									caption: 'Mode',
									type: 'select',
									data:
									[
										{
											id: 'default',
											text: 'Default (As Per Type)'
										},
										{
											id: 'do:ordered',
											text: 'Ordered (Task By Task)'
										},
										{
											id: 'do:unordered',
											text: 'Unordered (No Task Interdependence)'
										}
									]
								},
								projectTemplate)
							);

							templateFileView.add(
								app.invoke('util-template-setup-edit-element',
								{
									name: 'version.number',
									caption: 'Version Number',
									type: 'input'
								},
								projectTemplate)
							);

							templateFileView.add(
								app.invoke('util-template-setup-edit-element',
								{
									name: 'version.date',
									caption: 'Version Date',
									type: 'input'
								},
								projectTemplate)
							);

							templateFileView.add(
								app.invoke('util-template-setup-edit-element',
								{
									name: 'version.notes',
									caption: 'Version Notes',
									type: 'input'
								},
								projectTemplate)
							);

				templateFileView.add(
				[
								'</form>',
							'</div>',
						'</div>',
					'</div>'
				]);

				// OUTCOMES

				var contextData = app.invoke('util-param-get', {name: 'template.definition.outcomes', options: {default: []}}, templateFile);

				app.vq.show('#' + viewScope + '-outcomes-header-count',
				[
					'(' + contextData.length + ')'
				]);

				templateFileView.add(
				[
					'<div class="card mt-4">',
						'<div class="card-header bg-light">',
							'<div class="row align-items-end">',
								'<div class="col">',
									'<h3 class="mb-0" style="font-size:1.4rem;">',
										'<a class="myds-collapse-toggle" data-toggle="collapse" role="button" ',
											' data-related-selector="#' + viewScope + '-outcomes-collapse-container"',
											' href="#' + viewScope + '-outcomes-collapse">',
											'Outcomes ',
												app.invoke('util-template-setup-edit-set-header-count',
													{name: 'template.definition.outcomes'},
													templateFile),
										'</a>',
									'</h3>',
								'</div>',
								'<div class="col-auto pb-1">',
									'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#' + viewScope + '-outcomes-collapse"',
										' id="' + viewScope + '-outcomes-collapse-container"',
									'>',
										'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
									'</a>',
								'</div>',
							'</div>',
						'</div>',
						'<div class="card-body collapse myds-collapse pt-3" id="' + viewScope + '-outcomes-collapse"',
							' data-controller="util-template-setup-edit-by-context-show"',
							' data-context="outcomes" data-name="template.definition.outcomes"',
							'>',
							'<div id="' + viewScope + '-outcomes-view">',
							'</div>',
						'</div>',
					'</div>'
				]);

				// SPACES

				var contextData = app.invoke('util-param-get', {name: 'template.definition.spaces', options: {default: []}}, templateFile);

				app.vq.show('#' + viewScope + '-spaces-header-count',
				[
					'(' + contextData.length + ')'
				]);

				templateFileView.add(
				[
					'<div class="card mt-4">',
						'<div class="card-header bg-light">',
							'<div class="row align-items-end">',
								'<div class="col">',
									'<h3 class="mb-0" style="font-size:1.4rem;">',
										'<a class="myds-collapse-toggle" data-toggle="collapse" role="button" ',
											' data-related-selector="#' + viewScope + '-spaces-collapse-container"',
											' href="#' + viewScope + '-spaces-collapse">',
											'Spaces ',
												app.invoke('util-template-setup-edit-set-header-count',
													{name: 'template.definition.spaces'},
													templateFile),
										'</a>',
									'</h3>',
								'</div>',
								'<div class="col-auto pb-1">',
									'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#' + viewScope + '-spaces-collapse"',
										' id="' + viewScope + '-spaces-collapse-container"',
									'>',
										'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
									'</a>',
								'</div>',
							'</div>',
						'</div>',
						'<div class="card-body collapse myds-collapse pt-3" id="' + viewScope + '-spaces-collapse"',
							' data-controller="util-template-setup-edit-by-context-show"',
							' data-context="spaces" data-name="template.definition.spaces"',
							'>',
							'<div id="' + viewScope + '-spaces-view">',
							'</div>',
						'</div>',
					'</div>'
				]);
			
				// RULES

				templateFileView.add(
				[
					'<div class="card mt-4">',
						'<div class="card-header bg-light">',
							'<div class="row align-items-end">',
								'<div class="col">',
									'<h3 class="mb-0" style="font-size:1.4rem;">',
										'<a class="myds-collapse-toggle" data-toggle="collapse" role="button" ',
											' data-related-selector="#' + viewScope + '-rules-collapse-container"',
											' href="#' + viewScope + '-rules-collapse">',
											'Rules ',
												app.invoke('util-template-setup-edit-set-header-count',
													{name: 'template.definition.rules'},
													templateFile),
										'</a>',
									'</h3>',
								'</div>',
								'<div class="col-auto pb-1">',
									'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#' + viewScope + '-rules-collapse"',
										' id="' + viewScope + '-rules-collapse-container"',
									'>',
										'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
									'</a>',
								'</div>',
							'</div>',
						'</div>',
						'<div class="card-body collapse myds-collapse pt-3" id="' + viewScope + '-rules-collapse"',
							' data-controller="util-template-setup-edit-by-context-show"',
							' data-context="rules" data-name="template.definition.rules"',
							'>',
							'<div id="' + viewScope + '-rules-view">',
							'</div>',
						'</div>',
					'</div>'
				]);
				
				// RESOURCES

				templateFileView.add(
				[
					'<div class="card mt-4">',
						'<div class="card-header bg-light">',
							'<div class="row align-items-end">',
								'<div class="col">',
									'<h3 class="mb-0" style="font-size:1.4rem;">',
										'<a class="myds-collapse-toggle" data-toggle="collapse" role="button" ',
											' data-related-selector="#' + viewScope + '-resources-collapse-container"',
											' href="#' + viewScope + '-resources-collapse">',
											'Resources ',
												app.invoke('util-template-setup-edit-set-header-count',
													{name: 'template.definition.resources'},
													templateFile),
										'</a>',
									'</h3>',
								'</div>',
								'<div class="col-auto pb-1">',
									'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#' + viewScope + '-resources-collapse"',
									' id="' + viewScope + '-resources-collapse-container"',
									'>',
										'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
									'</a>',
								'</div>',
							'</div>',
						'</div>',
						'<div class="card-body collapse myds-collapse pt-3" id="' + viewScope + '-resources-collapse"',
							' data-controller="util-template-setup-edit-by-context-show"',
							' data-context="resources" data-name="template.definition.resources"',
								'>',
							'<div id="' + viewScope + '-resources-view">',
							'</div>',
						'</div>',
					'</div>'
				]);

				// SUPPORT-ITEMS

				templateFileView.add(
				[
					'<div class="card mt-4">',
						'<div class="card-header bg-light">',
							'<div class="row align-items-end">',
								'<div class="col">',
									'<h3 class="mb-0" style="font-size:1.4rem;">',
										'<a class="myds-collapse-toggle" data-toggle="collapse" role="button" ',
											' data-related-selector="#' + viewScope + '-support-items-collapse-container"',
											' href="#' + viewScope + '-support-items-collapse">',
											'Support Items ',
												app.invoke('util-template-setup-edit-set-header-count',
													{name: 'template.definition.support-items'},
													templateFile),
										'</a>',
									'</h3>',
								'</div>',
								'<div class="col-auto pb-1">',
									'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#' + viewScope + '-support-items-collapse"',
									' id="' + viewScope + '-support-items-collapse-container"',
									'>',
										'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
									'</a>',
								'</div>',
							'</div>',
						'</div>',
						'<div class="card-body collapse myds-collapse pt-3" id="' + viewScope + '-support-items-collapse"',
							' data-controller="util-template-setup-edit-by-context-show"',
							' data-context="resources" data-name="template.definition.support-items"',
								'>',
							'<div id="' + viewScope + '-support-items-view">',
							'</div>',
						'</div>',
					'</div>'
				]);
				
				// TEAM

				templateFileView.add(
				[
					'<div class="card mt-4">',
						'<div class="card-header bg-light">',
							'<div class="row align-items-end">',
								'<div class="col">',
									'<h3 class="mb-0" style="font-size:1.4rem;">',
										'<a class="myds-collapse-toggle" data-toggle="collapse" role="button" ',
											' data-related-selector="#' + viewScope + '-team-collapse-container"',
											' href="#' + viewScope + '-team-collapse">',
											'Team',
										'</a>',
									'</h3>',
								'</div>',
								'<div class="col-auto pb-1">',
									'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#' + viewScope + '-team-collapse"',
										' id="' + viewScope + '-team-collapse-container">',
										'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
									'</a>',
								'</div>',
							'</div>',
						'</div>',
						'<div class="card-body collapse myds-collapse pt-3" id="' + viewScope + '-team-collapse"',
							' data-controller="util-template-setup-edit-by-context-show"',
							' data-context="team" data-name="template.definition.team"',
							'>',
								app.invoke('util-template-setup-edit-element',
								{
									name: 'team.notes',
									caption: 'Notes',
									type: 'textarea',
									asText: true
								},
								projectTemplate),
								'<div class="card mt-4">',
									'<div class="card-header bg-light">',
										'<div class="row align-items-end">',
											'<div class="col">',
												'<h4 class="mb-1" style="font-size:1.2rem;">',
													'<a class="myds-collapse-toggle" data-toggle="collapse" role="button" ',
														' data-related-selector="#' + viewScope + '-team-members-collapse-container"',
														' href="#' + viewScope + '-team-members-collapse">',
														'Members ',
															app.invoke('util-template-setup-edit-set-header-count',
																{
																	context: 'team-members',
																	name: 'template.definition.team.members'
																},
																templateFile),
													'</a>',
												'</h4>',
											'</div>',
											'<div class="col-auto pb-1">',
												'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button"',
												' href="' + viewScope + '-team-members-collapse"',
												' id="' + viewScope + '-team-members-collapse-container"',
												'>',
													'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
												'</a>',
											'</div>',
										'</div>',
									'</div>',
									'<div class="card-body collapse myds-collapse pt-3" id="' + viewScope + '-team-members-collapse"',
										' data-controller="util-template-setup-edit-by-context-show"',
										' data-context="team-members" ',
										' data-view-context="team-members" ',
										' data-name="template.definition.team.members"',
										'>',
										'<div id="' + viewScope + '-team-members-view">',
									'</div>',
										
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				]);

				// MILESTONES

				templateFileView.add(
				[
					'<div class="card mt-4">',
						'<div class="card-header bg-light">',
							'<div class="row align-items-end">',
								'<div class="col">',
									'<h3 class="mb-0" style="font-size:1.4rem;">',
										'<a class="myds-collapse-toggle" data-toggle="collapse" role="button" ',
											' data-related-selector="#' + viewScope + '-milestones-collapse-container"',
											' href="#' + viewScope + '-milestones-collapse">',
											'Milestones | Modules ',
												app.invoke('util-template-setup-edit-set-header-count',
													{name: 'template.definition.milestones'},
													templateFile),
										'</a>',
									'</h3>',
								'</div>',
								'<div class="col-auto pb-1">',
									'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#' + viewScope + '-milestones-collapse"',
										' id="' + viewScope + '-milestones-collapse-container">',
										'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
									'</a>',
								'</div>',
							'</div>',
						'</div>',
						'<div class="card-body collapse myds-collapse pt-3" id="' + viewScope + '-milestones-collapse"',
							' data-controller="util-template-setup-edit-by-context-show"',
							' data-context="milestones" data-name="template.definition.milestones"',
							'>',
							'<div id="' + viewScope + '-milestones-view">',
							'</div>',
						'</div>',
					'</div>'
				]);

				//SKILLS GAINED

				templateFileView.add(
				[
					'<div class="card mt-4">',
						'<div class="card-header bg-light">',
							'<div class="row align-items-end">',
								'<div class="col">',
									'<h3 class="mb-0" style="font-size:1.4rem;">',
										'<a class="myds-collapse-toggle" data-toggle="collapse" role="button" ',
											' data-related-selector="#' + viewScope + '-skills-gained-collapse-container"',
											' href="#' + viewScope + '-skills-gained-collapse">',
											'Skills Gained ',
												app.invoke('util-template-setup-edit-set-header-count',
													{
														context: 'skills-gained',
														name: 'template.definition.skills.gained'
													},
													templateFile),
										'</a>',
									'</h3>',
									
								'</div>',
								'<div class="col-auto pb-1">',
									'<a class="ml-1 mr-1" href="https://skillzeb.io/skillset-explorer" target="_blank">',
										'<i class="far fa-info-circle text-muted ml-2 mt-2"></i>',
									'</a>',
									'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" ',
										' id="' + viewScope + '-skills-gained-collapse-container"',
										' href="#' + viewScope + '-skills-gained-collapse">',
										'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
									'</a>',
								'</div>',
							'</div>',
						'</div>',
						'<div class="card-body collapse myds-collapse pt-3" id="' + viewScope + '-skills-gained-collapse"',
							' data-controller="util-template-setup-edit-by-context-show"',
							' data-context="skills-gained" data-name="template.definition.skills.gained"',
							'>',
							'<div id="' + viewScope + '-skills-gained-view">',
							'</div>',
						'</div>',
					'</div>'
				]);

				if (_.has(projectTemplate, 'version'))
				{
					templateFileView.add(
					[
						'<div class="card mt-4">',
							'<div class="card-header bg-light">',
								'<div class="row align-items-end">',
										'<div class="col">',
											'<h3 class="mb-0" style="font-size:1.4rem;">',
												'<a class="myds-collapse-toggle" data-toggle="collapse" role="button" ',
													' data-related-selector="#' + viewScope + '-template-info-collapse-container"',
													' href="#' + viewScope + '-template-info-collapse">',
													'Template Info',
												'</a>',
											'</h3>',
										'</div>',
										'<div class="col-auto pb-1">',
											'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#' + viewScope + '-template-info-collapse"',
												' id="' + viewScope + '-template-info-collapse-container"',
											'>',
												'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
											'</a>',
										'</div>',
									'</div>',
							'</div>',
							'<div class="card-body py-2 collapse myds-collapse" id="' + viewScope + '-template-info-collapse">',
								'<div class="row mt-3">',
									'<div class="col-12 text-center">',
										'<div class="text-secondary">',
											projectTemplate.usage,
										'</div>',
									'</div>',
								'</div>',
								'<div class="row">'
					]);

					templateFileView.add(
					[
						'<div class="col-6">',
							'<div class="card mt-4">',
								'<div class="card-body">',
									'<h4 class="">',
										'Version ', projectTemplate.version.number, ' (', projectTemplate.version.date, ')', 
									'</h4>'
					]);

					if (_.has(projectTemplate, 'sharing'))
					{
						templateFileView.add(
						[
									'<div class="text-secondary">',
										'Share As ', projectTemplate.sharing.type, 
									'</div>',
									'<div class="text-secondary mt-2">',
										projectTemplate.sharing.notes,
									'</div>'
						]);
					}

					templateFileView.add(
					[
								'</div>',
							'</div>',
						'</div>'
					]);

					if (_.has(projectTemplate, 'source'))
					{
						templateFileView.add(
						[
							'<div class="col-6">',
								'<div class="card mt-4">',
									'<div class="card-body">',
										'<h4 class="">Source; ', projectTemplate.source.name, '</h4>',
										'<div class="text-secondary">Shared by source as ', projectTemplate.source.sharing.type, '</div>',
										'<div class="text-secondary mt-2">', projectTemplate.source.notes, '</div>',
									'</div>',
								'</div>',
							'</div>'
						]);
					}
								
					templateFileView.add(
					[		
								'</div>',
							'</div>',
						'</div>'
					]);
				}
			}

			templateFileView.add(
			[
				'</div>'
			]);

			templateFileView.add(
			[	
				'</div>'
			]);

			templateFileView.render(containerSelector);

			//app.invoke('util-template-setup-edit-show-skills-status');
		}
	}
});

app.add(
{
	name: 'util-template-setup-edit-set-header-count',
	code: function (param, templateFile)
	{
		var viewScope = app.get(
		{
			scope: 'util-template-setup-edit',
			context: 'viewScope'
		});

		const name = app._util.param.get(param, 'name').value;
		const contextData = app.invoke('util-param-get', name, templateFile);
		let context = app._util.param.get(param, 'context').value;
		let contextDataLength = 0;

		if (_.isNotSet(context))
		{
			context = _.last(_.split(name, '.'));
		}

		let headerView = app.vq.init({queue: 'util-template-setup-edit-set-header-count'});
		
		if (_.isSet(contextData))
		{
			contextDataLength = contextData.length;
		}

		headerView.add(
		[
			'<span class="text-muted small"',
				' id="' + viewScope + '-', context, '-header-count">',
					'(' + contextDataLength + ')',
			'</span>'
		]);

		return headerView.get();
	}
});

app.add(
{
	name: 'util-template-setup-edit-set-header',
	code: function (param)
	{
		var viewScope = app.get(
		{
			scope: 'util-template-setup-edit',
			context: 'viewScope'
		});

		const viewContext = app._util.param.get(param.dataContext, 'viewContext').value;
		var template = app.get(
		{
			scope: 'util-template-setup-edit',
			context: 'source-template'
		});

		const templateFile = template._file;
		const name = app._util.param.get(param.dataContext, 'name').value;
		const index = app._util.param.get(param.dataContext, 'index').value;
		const _data = _.get(templateFile, name);

		let headerView = app.vq.init({queue: 'header-view'});

		if (_data != undefined)
		{
			const data = _data[index];

			if (data != undefined)
			{
				headerView.add(
				[
					'<div class="text-primary fw-bold lead mb-3">', data.subject, '</div>'
				]);
			}
		}

		headerView.render(_.join(['#' + viewScope + '-', viewContext ,'-header-view'], ''));
	}
});

app.add(
{
	name: 'util-template-setup-edit-element',
	code: function (param, templateData)
	{
		var inputName = app._util.param.get(param, 'name').value;

		if (_.startsWith(inputName, '.'))
		{
			inputName = _.replace(inputName, '.', '')
		}
		
		var inputCaption = app._util.param.get(param, 'caption').value;
		var inputType = app._util.param.get(param, 'type', {default: 'input'}).value;
		var inputData = app._util.param.get(param, 'data').value;
		var inputValue = app.invoke('util-param-get', inputName, templateData);
		var inputElementName = _.replaceAll(inputName, '\\.', '-');
		var asText = app._util.param.get(param, 'asText', {default: false}).value;

		var viewScope = app.get(
		{
			scope: 'util-template-setup-edit',
			context: 'viewScope'
		});

		var context = app._util.param.get(param, 'context').value;

		if (_.isNotSet(context))
		{
			context = _.first(_.split(inputElementName, '-'))
		}

		var inputHTML = 
		[
			'<div class="form-group ' + viewScope + '-', context, '">',
				'<h4 class="mb-1">',
					'<label class="mb-0 text-secondary for="' + viewScope + '-template-project-', inputElementName,'">',
					inputCaption,
					'</label>',
				'</h4>'
		]

		if (inputType == 'input')
		{
			inputHTML = _.concat(inputHTML,
			[
				'<input type="text" class="form-control input-lg myds-text"',
					' id="' + viewScope + '-template-project-', inputElementName,'"',
					' value="', inputValue, '"',
					' data-value="', inputValue, '" data-id="template.definition.', inputName,'"',
					' data-scope="' + viewScope + '-data"',
					' data-context="template.definition.', inputName,'"',
					' data-controller="util-template-setup-edit-update">'
			]);
		}

		if (inputType == 'textarea')
		{
			//' value="', inputValue, '"',
			//' data-value="', inputValue, '"',

			inputHTML = _.concat(inputHTML,
			[
				'<textarea style="height:80px;" class="form-control input-lg myds-text"',
					' id="' + viewScope + '-template-project-', inputElementName,'"',
					' data-id="template.definition.', inputName,'"',
					' data-scope="' + viewScope + '-data"',
					' data-context="template.definition.', inputName,'"',
					' data-controller="util-template-setup-edit-update">',
					inputValue,
				'</textarea>'
			]);
		}

		if (inputType == 'select' && _.isSet(inputData))
		{
			const selectData = _.find(inputData, function (data) {return (data.id == inputValue)});
			
			let selectText = 'Select ...';
			if (_.isSet(selectData))
			{
				selectText = selectData.text;
			}

			let selectHTML = 
			[
				'<button type="button" class="btn btn-white dropdown-toggle form-control text-left" data-toggle="dropdown" ',
					' ',
					' data-value="', inputValue, '"',
					' data-id="template.definition.', inputName,'"',
					' data-scope="' + viewScope + '-data"',
					' data-context="template.definition.', inputName,'"',
					' data-controller="util-template-setup-edit-update"',
					' aria-expanded="false">',
					'<span class="dropdown-text">', selectText, '</span>',
				'</button>',
				'<ul class="dropdown-menu mt-1"',
					' data-context="template.definition.', inputName, '"',
					' data-scope="' + viewScope + '-data"',
						'data-controller="util-template-setup-edit-update"',
				'>'
			];
			
			_.each(inputData, function (data)
			{
				selectHTML = _.concat(selectHTML,
				[
					'<li>',
						'<a class="entityos-dropdown myds-dropdown" data-id="', data.id + '">',
						data.text,
						'</a>',
					'</li>'
				]);
			});

			selectHTML = _.concat(selectHTML,
			[
				'</ul>'
			]);

			inputHTML = _.concat(inputHTML, selectHTML);
		}

		inputHTML = _.concat(inputHTML, ['</div>']);

		if (asText)
		{
			inputHTML = _.join(inputHTML, '')
		}

		return inputHTML;
	}
});

app.add(
{
	name: 'util-template-setup-edit-show-milestone',
	code: function (param)
	{
		var viewScope = app.get(
		{
			scope: 'util-template-setup-edit',
			context: 'viewScope'
		});

		var userRole = app.whoami().thisInstanceOfMe._userRole;

		var template = app.get(
		{
			scope: 'util-template-setup-edit',
			context: 'source-template'
		});

		var templateFile = template._file;
		var projectTemplate = templateFile.template.definition;
		
		var milestoneReference = app._util.param.get(param.dataContext, 'reference').value;

		var milestone = _.find(projectTemplate.milestones, function (milestone)
						{
							return milestone.reference == milestoneReference
						});

		if (_.isSet(milestone))
		{
			var milestoneView = app.vq.init({queue: 'util-template-setup-edit-show-milestone'});
			
			milestoneView.add(
			[
				'<div class="card-body pt-0">',
					'<div class="row pb-4 pl-2">',
						'<div class="col-12 text-secondary mb-3">',
							'<h4 class="w-75">', milestone['description'], '</h4>',

							'<div class="form-group">',
								'<input type="text" class="form-control input-lg myds-text"',
									' id="' + viewScope + '-template-project-description"',
									' value="', milestone.description, '"',
									' data-value="', milestone.description, '" data-id="template.definition.milestones.', index, '.description"',
									' data-scope="' + viewScope + '-data"',
									' data-context="template.definition.milestones.', index, '.description"',
									' data-controller="util-template-setup-edit-update">',
							'</div>',
						'</div>',
						'<div class="col-12 text-secondary">',
							milestone['duration-days'].minimum, ' to ',
							milestone['duration-days'].maximum, ' days.',	
						'</div>',
					'</div>',
					'<div class="row">',
						'<div class="col-12">',
							'<div class="d-none" id="' + viewScope + '-milestone-', milestone.reference, '-support-items-container">',
							'</div>',
							'<div class="d-none" id="' + viewScope + '-milestone-', milestone.reference, '-resources-container">',
							'</div>',
							'<div class="d-none" id="' + viewScope + '-milestone-', milestone.reference, '-tasks-container">',
							'</div>',
						'</div>',
					'</div>',
				'</div>'
			]);

			milestoneView.render('#' + viewScope + '-milestone-' + milestone.reference);

			// MILESTONE; TASKS

			var refresh = {};
			refresh[(milestone.tasks.length==0?'hide':'show')] = '#' + viewScope + '-milestone-' + milestone.reference + '-tasks-container';
			app.refresh(refresh);

			milestoneView.template(
			[
				'<div class="card">',
					'<div class="card-body">',
						'<div class="row align-items-end">',
							'<div class="col">',
								'<h4>{{subject}}</h4>',
								'<div class="text-secondary">{{description}}</div>',
							'</div>',
							'<div class="col-auto pb-1 text-muted">',
								'{{_by}}',
							'</div>',
						'</div>',	
						'<div class="mt-3" id="' + viewScope + '-milestone-', milestone.reference, '-{{hash}}">',
					'</div>',
				'</div>'
			]);

			if (milestone.tasks.length != 0)
			{
				milestoneView.add(
				[
					'<h4 class="ml-2" style="font-size: 1.1rem;">Tasks</h4>',
				]);

				_.each(milestone.tasks, function (task)
				{
					task._by = _.capitalize(task.by);

					task._hash = task.id;
					if (task._hash == undefined)
					{
						task._hash = task.subject;
					}

					task._hash = milestone.reference + '--' + task._hash;

					task.hash = app.invoke('util-protect-hash', {data: task._hash}).dataHashed;

					milestoneView.add({useTemplate: true}, task);
				});
			}

			milestoneView.render('#' + viewScope + '-milestone-' + milestone.reference + '-tasks-container');

			if (app.whoami().thisInstanceOfMe.view.uriContext != '#learning-partner-setup-project-template-summary')
			{
				app.invoke('util-template-setup-edit-show-milestone-tasks', param);
			}

			// MILESTONE; RESOURCES

			var refresh = {};

			milestone.hasResources = false;
			if (milestone.notes != undefined) {milestone.hasResources = (milestone.notes.length != 0)}
			if (!milestone.hasResources && milestone.resources != undefined) {milestone.hasResources = (milestone.resources.length != 0)}

			refresh[(milestone.hasResources?'show':'hide')] = '#' + viewScope + '-milestone-' + milestone.reference + '-resources-container';
			app.refresh(refresh);

			var resources = milestone.resources;

			if (_.isSet(milestone.notes))
			{
				resources = _.assign(resources, milestone.notes);
			}

			resources = _.filter(resources, function (resource)
			{
				return (_.includes(resource.for, userRole) || resource.for == undefined);
			});

			if (resources.length != 0)
			{
				milestoneView.add(
				[
					'<h4 class="ml-2" style="font-size: 1.1rem;">Resources</h4>',
				]);

				_.each(resources, function (resource)
				{
					if (resource.description == undefined) {resource.description = ''};
					if (_.isArray(resource.description)) {resource.description = _.join(resource.description, '')}

					if (_.isSet(resource.url))
					{
						milestoneView.add(
						[
							'<div class="card">',
								'<div class="card-body">',
									'<h4>', resource.subject, '</h4>',
									'<div><a href="', resource.url, '" target="_blank">', resource.description, ' <i class="far fa-external-link"></i></a></div>',
								'</div>',
							'</div>'
						]);
					}
					else if (_.isSet(resource['image-url']))
					{
						milestoneView.add(
						[
							'<div class="card">',
								'<div class="card-body">',
									'<div class="row align-items-end">',
										'<div class="col">',
											'<h4>', resource.subject, '</h4>',
										'</div>',
										'<div class="col-auto pb-1">',
											'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#' + viewScope + '-resource-', _.kebabCase(resource.subject), '-collapse">',
												'<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
											'</a>',
										'</div>',
									'</div>',							
								'</div>',
								'<div class="p-4 pt-0 collapse myds-collapse" id="' + viewScope + '-resource-', _.kebabCase(resource.subject), '-collapse"',
									' data-subject="', resource.subject, '">',
									'<div id="' + viewContext + '-resource-', _.kebabCase(resource.subject), '">',
										'<div class="text-secondary mb-4">', resource.description, '</div>',
										'<img src="', resource['image-url'], '" class="img-responsive w-100">',
									'</div>',
								'</div>',
							'</div>'
						]);
					}
					else if (_.isSet(resource.description))
					{
						milestoneView.add(
						[
							'<div class="card">',
								'<div class="card-body">',
									'<h4>', resource.subject, '</h4>',
									'<div class="text-secondary">', resource.description, '</div>',
								'</div>',
							'</div>'
						]);
					}
					
				});

				milestoneView.render('#' + viewScope + '-milestone-' + milestone.reference + '-resources-container');
			}

			// SUPPORT ITEMS

			var refresh = {};

			milestone.hasSupportItems = false;

			if (milestone['support-items'] != undefined) {milestone.hasSupportItems = (milestone['support-items'].length != 0)}
			if (!milestone.hasSupportItems && milestone['learner-support-items'] != undefined) {milestone.hasSupportItems = (milestone['learner-support-items'].length != 0)}

			refresh[(milestone.hasSupportItems?'show':'hide')] = '#' + viewScope + '-milestone-' + milestone.reference + '-support-items-container';
			app.refresh(refresh);

			var supportItems = milestone['support-items'];

			if (_.isSet(milestone['learner-support-items']))
			{
				supportItems = _.assign(supportItems, milestone.notes);
			}

			supportItems = _.filter(supportItems, function (supportItem)
			{
				return (_.includes(supportItem.for, userRole) || supportItem.for == undefined);
			});

			if (supportItems.length != 0)
			{
				milestoneView.template(
				[
					'<div class="card">',
						'<div class="card-body">',
							'<div class="mb-3">{{subject}}</div>',
							'<div class="text-secondary">{{description}}</div>',
						'</div>',
					'</div>'
				]);

				milestoneView.add(
				[
					'<h4 class="ml-2" style="font-size: 1.1rem;">Items</h4>',
				]);

				_.each(supportItems, function (item)
				{
					if (item.description == undefined) {item.description = ''}
					if (_.isArray(item.description)) {item.description = _.join(item.description, '')}
					milestoneView.add({useTemplate: true}, item);
				});
			}

			milestoneView.render('#' + viewScope + '-milestone-' + milestone.reference + '-support-items-container');
		}
	}
});

app.add(
{
	name: 'util-template-setup-edit-update',
	code: function (param)
	{
		var viewScope = app.get(
		{
			scope: 'util-template-setup-edit',
			context: 'viewScope'
		});

		var template = app.get(
		{
			scope: 'util-template-setup-edit',
			context: 'source-template'
		});

		var templateFile = template._file;

		var data = app.get(
		{
			scope: viewScope + '-data'
		});

		console.log(data)

		_.each(data, function (dataValue, dataKey)
		{
			if (!_.startsWith(dataKey, '_'))
			{
				if (true || _.has(templateFile, dataKey))
				{
					_.set(templateFile, dataKey, dataValue)
				}
			}
		});

		console.log(templateFile)

		var fileDataBase64 = app.invoke('util-convert-to-base64', JSON.stringify(templateFile));

		app.invoke('util-local-cache-save',
		{
			key: 'util-template-setup-edit-' + template.file.filename,
			persist: true,
			data: fileDataBase64 + '|' + btoa(moment().utc().format())
		});

		app.invoke('util-template-setup-edit-auto-save-set');
	}
});

app.add(
{
	name: 'util-template-setup-edit-auto-save-set',
	code: function (param, response)
	{
		const autoSaveEnabled = app.get(
		{
			scope: 'util-template-setup-edit-auto-save',
			context: 'enabled',
			valueDefault: true
		});

		app.set(
		{
			scope: 'util-template-setup-edit-auto-save',
			context: 'save-required',
			value: true
		});

		if (autoSaveEnabled)
		{
			app.show('#side-menu-status-view',
			[
				'<div class="mt-2 mb-0 alert alert-info text-center small px-3">',
					'<div>Your edits will be automatically saved 8 seconds after your most recent edit.</div>',

					'<div class="mt-2">',
						'<a class="text-muted small myds-click" data-controller="util-template-setup-edit-auto-save-stop">Stop Auto-Save</a>',,
					'</div>',

					'<div class="mt-2">',
						'<button class="btn btn-default btn-sm btn-outline myds-click" data-controller="util-template-setup-edit-save">Save Now</button>',
					'</div>',
				'<div>'
			]);

			let autoSaveTime = app.get(
			{
				scope: 'util-template-setup-edit-auto-save',
				context: 'timer'
			});

			if (autoSaveTime != 0) {clearTimeout(autoSaveTime)};

			autoSaveTime = setTimeout('entityos._util.controller.code["util-template-setup-edit-save"]({silent:true})', 8000);

			app.set(
			{
				scope: 'util-template-setup-edit-auto-save',
				context: 'timer',
				value: autoSaveTime
			});
		}
		else
		{
			app.show('#side-menu-status-view',
			[
				'<div class="mt-2 mb-0 alert alert-info text-center small px-3">',
					'<div>You have made edits to this template.</div>',

					'<div class="mt-2">',
						'<a class="text-muted small myds-click" data-controller="util-template-setup-edit-auto-save-start">Start Auto-Save</a>',,
					'</div>',

					'<div class="mt-2">',
						'<button class="btn btn-default btn-sm btn-outline myds-click" data-controller="util-template-setup-edit-save">Save Now</button>',
					'</div>',
				'<div>'
			]);
		}
	}
});

app.add(
{
	name: 'util-template-setup-edit-auto-save-start',
	code: function (param, response)
	{
		app.set(
		{
			scope: 'util-template-setup-edit-auto-save',
			context: 'enabled',
			value: true
		});

		app.invoke('util-template-setup-edit-auto-save-set');
	}
});

app.add(
{
	name: 'util-template-setup-edit-auto-save-stop',
	code: function (param, response)
	{
		app.set(
		{
			scope: 'util-template-setup-edit-auto-save',
			context: 'enabled',
			value: false
		});

		const autoSaveTime = app.get(
		{
			scope: 'util-template-setup-edit-auto-save',
			context: 'timer'
		});

		if (autoSaveTime != 0) {clearTimeout(autoSaveTime)};

		app.invoke('util-template-setup-edit-auto-save-set');
	}
});

app.add(
{
	name: 'util-template-setup-edit-auto-save-clear',
	code: function (param, response)
	{
		app.show('#side-menu-status-view', '');

		app.set(
		{
			scope: 'util-template-setup-edit-auto-save',
			context: 'save-required',
			value: false
		});

		let autoSaveTime = app.get(
		{
			scope: 'util-template-setup-edit-auto-save',
			context: 'timer'
		});

		if (autoSaveTime != 0) {clearTimeout(autoSaveTime)};
	}
});

app.add(
{
	name: 'util-template-setup-edit-save',
	code: function (param, response)
	{
		var template = app.get(
		{
			scope: 'util-template-setup-edit',
			context: 'source-template'
		});

		if (response == undefined)
		{
			var fileDataBase64 = app.invoke('util-convert-to-base64', JSON.stringify(template._file));

			entityos.cloud.invoke(
			{
				method: 'core_attachment_from_base64',
				data:
				{
					object: 1,
					objectcontext: template.id,
					base64: fileDataBase64,
					filename: template.file.filename,
					id: template.file.id
				},
				callback: 'util-template-setup-edit-save',
				callbackParam: param
			});
		}
		else
		{
			if (response.status == 'OK')
			{
				const silent = app._util.param.get(param, 'silent', {default: false}).value;

				if (!silent)
				{
					app.notify('Template File Saved.');
				}

				app.invoke('util-template-setup-edit-auto-save-clear');
			}
			else
			{
				app.notify({type: 'error', message: response.error.errornotes})
			}
		}
	}
});

/*
btoa('{"hello": "world"}')
'eyJoZWxsbyI6ICJ3b3JsZCJ9'

entityos.cloud.invoke({
	method: 'core_attachment_from_base64',
	data:
	{
		filename: 'hello.json',
		base64: 'eyJoZWxsbyI6ICJ3b3JsZCJ9',
		object: 1,
		objectcontext: 56457
	}
})

*/

// UTILS FOR USING A TEMPLATE

app.add(
{
	name: 'util-template-get-definition-from-file',
	code: function (param, response)
	{	
		var object = app._util.param.get(param, 'object', {default: app.whoami().mySetup.objects.project}).value;
		var objectContext = app._util.param.get(param, 'objectContext').value;
		var templateContext = app._util.param.get(param, 'templateContext', {default: 'selfdriven.template'}).value;

		if (_.isSet(objectContext))
		{
			if (response == undefined)
			{
				entityos.cloud.search(
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
							value: object
						},
						{
							field: 'objectcontext',
							comparison: 'EQUAL_TO',
							value: objectContext
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
							direction: 'desc'
						}
					],
					customOptions:
					[
						{
							name: 'object',
							value: object
						}
					],
					rows: 9999,
					callback: 'util-template-get-definition-from-file',
					callbackParam: param
				});
			}
			else
			{
				if (response.status == 'OK')
				{
					 var templateFile = _.find(response.data.rows, function (file)
					{
						return _.includes(file.filename, templateContext)
					});

					app.set(
					{
						scope: 'util-template-get-definition-from-file',
						context: 'attachment',
						value: templateFile
					});

					param = app._util.param.set(param, 'templateFile', templateFile);

					app.invoke('util-template-definition-get', param);
				}
			}
		}
	}	
});

app.add(
{
	name: 'util-template-definition-get',
	code: function (param, response)
	{
		var templateFile = app._util.param.get(param, 'templateFile').value;
		
		if (templateFile == undefined)
		{
			app.invoke('util-on-complete', param);
		}
		else
		{
			if (response == undefined)
			{
				entityos.cloud.invoke(
				{
					method: 'core_file_read',
					data:
					{
						id: templateFile.id,
						dataonly: 'Y'
					},
					callback: 'util-template-definition-get',
					callbackParam: param
				});
			}
			else
			{
				if (!_.has(response, 'template.definition'))
				{
					response.template.definition = _.clone(response.template.project);
					delete response.template.project
				}
				
				if (!_.has(response, 'template.definition'))
				{
					app.notify({type: 'error', message: 'Not a valid template file'})
				}
				else
				{
					app._util.param.set(param, '_file', response);
					app._util.param.set(param, 'templateDefinition', response);

					app.set(
					{
						scope: 'util-template-definition-get',
						context: 'template-definition',
						value: response
					});
			
					app.invoke('util-on-complete', param);
				}
			}
		}
	}
});

app.add(
{
	name: 'util-template-file-get',
	code: function (param)
	{
		var templateFile = app._util.param.get(param, 'templateFile').value;
		
		if (templateFile == undefined)
		{
			var template = app.get(
			{
				scope: 'util-template-setup-edit',
				context: 'source-template'
			});

			if (template != undefined)
			{
				templateFile = template.file;
			}

			param = app._util.param.set(param, 'templateFile', templateFile)
		}

		app.invoke('util-template-definition-get', param)
	}
});

app.add(
{
	name: 'util-template-get-schema',
	code: function (param, response)
	{
		var templateURL = app._util.param.get(param, 'templateURL', {default: '/site/2007/selfdriven.template.schema-2.0.0.json'}).value;

		var templateSchema = app.get(
		{
			scope: 'util-template-setupt',
			context: 'template-schema'
		});

		if (templateSchema != undefined)
		{
			app.invoke('util-on-complete', param);
		}
		else
		{
			if (response == undefined)
			{
				app.invoke('util-cloud-invoke',
				{
					url: templateURL,
					type: 'GET',
					callback: 'util-template-get-schema',
					callbackParam: param
				});
			}
			else
			{
				app.set(
				{
					scope: 'util-template-setup',
					context: 'template-schema',
					value: response
				});
					
				app.invoke('util-on-complete', param);
			}
		}
	}
});

app.add(
{
	name: 'util-templates-task-hash',
	code: function (param, response)
	{	
        var task = app._util.param.get(param, 'task').value;
        var milestone = app._util.param.get(param, 'milestone').value;

        task._hash = task.id;

        if (task._hash == undefined && _.isSet(task.reference))
        {
            task._hash = task.reference;
        }

        if (task._hash == undefined && _.isSet(task.subject))
        {
            task._hash = task.subject;
        }

        task._hash = milestone.reference + '--' + task._hash;

        task.hash = app.invoke('util-protect-hash', {data: task._hash}).dataHashed;

        return task;
	}
});
