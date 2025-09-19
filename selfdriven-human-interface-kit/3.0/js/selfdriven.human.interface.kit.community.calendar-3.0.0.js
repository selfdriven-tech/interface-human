app.add(
[
	{
		name: 'admin-community-calendar',
		code: function (param, response)
		{	
			app.invoke('util-community-calendar-show', {dataContext: {}});
		}
	}
]);

app.add(
[
	{
		name: 'util-community-calendar-show',
		code: function (param, response)
		{	
			var utilSetup = app.get(
			{
				scope: 'util-setup'
			});

			var scope = app._util.param.get(param.dataContext, 'scope', {default: 'util-community-calendar'}).value;

			var data = app.get({scope: scope});

			var calendarData =
			{
				startdate: moment().format('DD MMM YYYY'),
				enddate: moment().add('day', 7).format('DD MMM YYYY')
			}

			if (data != undefined)
			{
				if (data.startdate != undefined)
				{
					calendarData.startdate = data.startdate
				}

				if (data.enddate != undefined)
				{
					calendarData.enddate = data.enddate
				}
			}

			if (_.isEmpty(calendarData.startdate))
			{	
				calendarData.startdate = moment().weekday(1).format('DD MMM YYYY');
				calendarData._startdate = moment().weekday(1);
				calendarData.enddate = calendarData._startdate.add('day', 6).format('DD MMM YYYY');
				calendarData._enddate = calendarData._startdate.add('day', 6);
			}

			app.set(
			{
				scope: 'util-community-calendar-show',
				value: calendarData
			});

			app.invoke('util-community-calendar-events', param);
		}
	},
	{
		name: 'util-community-calendar-events',
		code: function (param, response)
		{	
			var utilSetup = app.get(
			{
				scope: 'util-setup'
			});

			var calendarData = app.get(
			{
				scope: 'util-community-calendar-show',
				valueDefault: {}
			});

			if (response == undefined)
			{
				var filters = [];

				if (!_.isEmpty(calendarData.startdate))
				{
					filters.push(
					{
						field: 'startdate',
						comparison: 'GREATER_THAN_OR_EQUAL_TO',
						value: calendarData.startdate
					});
				}

				if (!_.isEmpty(calendarData.enddate))
				{
					filters.push(
					{
						field: 'startdate',
						comparison: 'LESS_THAN_OR_EQUAL_TO',
						value: calendarData.enddate
					});
				}

				mydigitalstructure.cloud.search(
				{
					object: 'event',
					fields: ['reference', 'description', 'startdate', 'type', 'typetext', 'guid'],
					filters: filters,
					callback: 'util-community-calendar-events'
				});
			}
			else
			{
				_.each(response.data.rows, function (row)
				{
					row.startdate = app.invoke('util-view-date-format', {date: row.startdate, clean: true});
				});

				app.set(
				{
					scope: 'util-community-calendar-show',
					context: 'events',
					value: response.data.rows
				});

				app.invoke('util-community-calendar-tasks', param)
			}
		}
	},
	{
		name: 'util-community-calendar-tasks',
		code: function (param, response)
		{	
			var utilSetup = app.get(
			{
				scope: 'util-setup'
			});

			var calendarData = app.get(
			{
				scope: 'util-community-calendar-show',
				valueDefault: {}
			});

			if (response == undefined)
			{
				var filters = [];

				if (!_.isEmpty(calendarData.startdate))
				{
					filters.push(
					{
						field: 'startdate',
						comparison: 'GREATER_THAN_OR_EQUAL_TO',
						value: calendarData.startdate
					});
				}

				if (!_.isEmpty(calendarData.enddate))
				{
					filters.push(
					{
						field: 'startdate',
						comparison: 'LESS_THAN_OR_EQUAL_TO',
						value: calendarData.enddate
					});
				}

				mydigitalstructure.cloud.search(
				{
					object: 'project_task',
					fields: ['reference', 'description', 'startdate', 'typetext', 'statustext', 'guid', 'taskbyusertext'],
					filters: filters,
					callback: 'util-community-calendar-tasks'
				});
			}
			else
			{
				_.each(response.data.rows, function (row)
				{
					row.startdate = app.invoke('util-view-date-format', {date: row.startdate, clean: true});
				});

				app.set(
				{
					scope: 'util-community-calendar-show',
					context: 'tasks',
					value: response.data.rows
				});

				var calendarData = app.get(
				{
					scope: 'util-community-calendar-show'
				});

				app.invoke('util-community-calendar-show-render', param)
			}
		}
	},
	{
		name: 'util-community-calendar-show-render',
		code: function (param, response)
		{	
			var utilSetup = app.get(
			{
				scope: 'util-setup'
			});

			var calendarData = app.get(
			{
				scope: 'util-community-calendar-show',
				valueDefault: {}
			});

			var dateFormats = app.whoami().buildingMe.options.dateFormats;

			var startDate = moment(calendarData.startdate, dateFormats);
			var endDate = moment(calendarData.enddate, dateFormats);

			calendarData.days = (endDate.diff(startDate, 'days') + 1);

			calendarData.dates = [];

			_.each(_.range(0, calendarData.days), function (day)
			{
				calendarData.dates.push(
				{
					_date: moment(startDate).add('days', day),
					date: moment(startDate).add('days', day).format('D MMM YYYY'),
					dayname: moment(startDate).add('days', day).format('dddd'),
					id: moment(startDate).add('days', day).format('X'),
					addclass: (moment(startDate).add('days', day).isSameOrAfter(moment(), 'day')?'':'d-none')
				});
			});

			_.each(calendarData.dates, function (date)
			{
				// TASKS
				date.tasks = _.filter(calendarData.tasks, function (task)
				{
					return (task.startdate == date.date)
				});

				date.taskscount = date.tasks.length;

				app.vq.init({queue: 'tasks'});

				app.vq.add('<ul class="sortable-list connectList agile-list ui-sortable">',
					{queue: 'tasks'});

				_.each(date.tasks, function (task)
				{
					app.vq.add(				
					[
				 		'<li class="{{class}}-element ui-sortable-handle myds-navigate"',
				 			' data-controller="admin-community-task-summary"',
				 			' data-context="{{guid}}"',
				 			'>',
							'<div class="font-weight-bold">{{description}}</div>',
							'<div class="agile-detail">',
								'<div>{{startdate}}</div>',
								'<div class="mt-2">{{taskbyusertext}}</div>',
								'<div class="d-none"><a href="#" class="btn btn-xs btn-white">Action</a></div>',
							'</div>',
						'</li>'
					],
					{type: 'template', queue: 'tasks'});

					task.class = utilSetup.taskStatusClasses[task.statustext];
					app.vq.add({useTemplate: true, queue: 'tasks'}, task);
				
				});	
					
				app.vq.add('</ul>',
					{queue: 'tasks'});

				date.tasksrendered = app.vq.get({queue: 'tasks'});

				// COMMUNITY EVENTS
				date.communityevents = _.filter(calendarData.events, function (event)
				{
					return (event.type == utilSetup.eventTypes['All of Community'] && event.startdate == date.date)
				});

				date.communityeventscount = date.communityevents.length;

				app.vq.init({queue: 'events'});

				app.vq.add('<ul class="sortable-list connectList agile-list ui-sortable">',
					{queue: 'events'});

				_.each(date.communityevents, function (event)
				{
					app.vq.add(				
					[
				 		'<li class="{{class}}-element ui-sortable-handle myds-navigate"',
				 			' data-controller="admin-community-event-summary"',
				 			' data-context="{{guid}}"',
				 			'>',
							'<div class="font-weight-bold">{{reference}}</div>',
							'<div class="agile-detail">',
								'<div>{{startdate}}</div>',
								'<div class="d-none"><a href="#" class="btn btn-xs btn-white">Action</a></div>',
							'</div>',
						'</li>'
					],
					{type: 'template', queue: 'events'});

					event.class = utilSetup.taskStatusClasses[event.statustext];
					app.vq.add({useTemplate: true, queue: 'events'}, event);
				
				});	
					
				app.vq.add('</ul>',
					{queue: 'events'});

				date.communityeventsrendered = app.vq.get({queue: 'events'});

				// TEAM MEETINGS
				date.teammeetingevents = _.filter(calendarData.events, function (event)
				{
					return (event.type == utilSetup.eventTypes['Team Meeting'] && event.startdate == date.date)
				});

				date.teammeetingeventscount = date.teammeetingevents.length;

				app.vq.init({queue: 'events'});

				app.vq.add('<ul class="sortable-list connectList agile-list ui-sortable">',
					{queue: 'events'});

				_.each(date.teammeetingevents, function (event)
				{
					app.vq.add(				
					[
				 		'<li class="{{class}}-element ui-sortable-handle myds-navigate"',
				 			' data-controller="admin-community-event-summary"',
				 			' data-context="{{guid}}"',
				 			'>',
							'<div class="font-weight-bold">{{reference}}</div>',
	                  '<div class="agile-detail">',
								'<div>{{startdate}}</div>',
								'<div class="d-none"><a href="#" class="btn btn-xs btn-white">Action</a></div>',
							'</div>',
						'</li>'
					],
					{type: 'template', queue: 'events'});

					task.class = utilSetup.taskStatusClasses[task.statustext];
					app.vq.add({useTemplate: true, queue: 'events'}, event);
				
				});	
					
				app.vq.add('</ul>',
					{queue: 'events'});

				date.teammeetingeventsrendered = app.vq.get({queue: 'events'});
			})

			app.vq.init({queue: 'days'});

			app.vq.add(
			[
				'<div class="card mb-3 w-100"><div class="card-body">',
					'<div class="row">',
						'<div class="col-2">',
							'<h3 class="mb-0">{{date}}</h3>',
							'<div class="text-muted">{{dayname}}</div>',
						'</div>',
						'<div class="col-10">',
							'<div class="container-fluid">',
								'<div class="row">',
									'<div class="col-4">',
										'<div class="card">',
											'<div class="card-header p-2 px-3">',
												'<h4 class="my-0">Tasks</h4>',
											'</div>',
											'<div class="card-body py-1 px-3 border-bottom bg-light">',
												'<small class="label label-success">{{taskscount}}</small>',
												'<button class="btn btn-xs btn-link {{addclass}}" data-toggle="collapse" data-target="#util-community-calendar-task-add-{{id}}">' +
													'<i class="fa fa-plus text-muted"></i>',
												'</button>',
											'</div>',
											'<div class="card-body py-1 px-3">',
												'{{tasksrendered}}',
											'</div>',
										'</div>',
									'</div>',
									'<div class="col-4">',
										'<div class="card">',
											'<div class="card-header p-2 px-3">',
												'<h4 class="my-0">All of Community</h4>',
											'</div>',
											'<div class="card-body py-1 px-3 border-bottom bg-light">',
												'<small class="label label-success">{{communityeventscount}}</small>',
												'<button class="btn btn-xs btn-link" data-toggle="collapse" data-target="#util-community-calendar-event-all-add-{{id}}">',
													'<i class="fa fa-plus text-muted"></i>',
												'</button>',
											'</div>',
											'<div id="util-community-calendar-community-event-add-{{id}}" class="collapse myds-collapse">',
												'<div id="util-community-calendar-community-event-add-{{id}}-view" class="card-body py-1 px-3 border-bottom">',
													'...',
												'</div>',
											'</div>',
											'<div class="card-body py-1 px-3">',
											'{{communityeventsrendered}}',
											'</div>',
										'</div>',
									'</div>',
									'<div class="col-4">',
										'<div class="card">',
											'<div class="card-header p-2 px-3">',
												'<h4 class="my-0">Team Meetings</h4>',
											'</div>',
											'<div class="card-body py-1 px-3 border-bottom bg-light">',
												'<small class="label label-success">{{teammeetingeventscount}}</small>',
												'<button class="btn btn-xs btn-link" data-toggle="collapse" data-target="#util-community-calendar-event-team-add-{{id}}">',
													'<i class="fa fa-plus text-muted"></i>',
												'</button>',
											'</div>',
											'<div id="util-community-calendar-team-meeting-event-add-{{id}}" class="collapse">',
												'<div id="util-community-calendar-team-meeting-event-add-{{id}}-view" class="card-body py-1 px-3 border-bottom">',
													'...',
												'</div>',
											'</div>',
											'<div class="card-body py-1 px-3">',
											'{{teammeetingeventsrendered}}',
											'</div>',
										'</div>',
									'</div>',
								'</div>',
								'<div id="util-community-calendar-task-add-{{id}}" data-dateid="{{id}}" data-date="{{date}}" class="row collapse myds-collapse mt-3"',
									' data-controller="util-community-calendar-task-add">',
									'<div id="util-community-calendar-task-add-{{id}}-view" class="card-body py-1 px-3">',
									'</div>',
								'</div>',
								'<div id="util-community-calendar-event-all-add-{{id}}" data-dateid="{{id}}" data-date="{{date}}" data-event-type="all"',
										' class="row collapse myds-collapse mt-3" data-controller="util-community-calendar-event-add">',
									'<div id="util-community-calendar-event-add-{{id}}-view" class="card-body py-1 px-3">',
									'</div>',
								'</div>',
								'<div id="util-community-calendar-event-team-add-{{id}}" data-dateid="{{id}}" data-date="{{date}}" data-event-type="team"',
										' class="row collapse myds-collapse mt-3" data-controller="util-community-calendar-event-add">',
									'<div id="util-community-calendar-event-add-{{id}}-view" class="card-body py-1 px-3">',
									'</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>',
				'</div></div>'

			], {type: 'template', queue: 'days'});

			_.each(calendarData.dates, function (calendarDate)
			{
				app.vq.add({queue: 'days', useTemplate: true}, calendarDate)
			});

			app.vq.render('#admin-community-calendar-view', {queue: 'days'})

			console.log(calendarData)
		}
	},
	{
		name: 'util-community-calendar-task-add',
		code: function (param)
		{	
			console.log(param);

			var dateID = app._util.param.get(param.dataContext, 'dateid').value;
			var date = app._util.param.get(param.dataContext, 'date').value;

			if (dateID != undefined)
			{
				var queueTask = app.vq.init({queue: 'add-task'});

				queueTask.template(
				[
					'<form autocomplete="off">',
						'<div class="form-group">',
							'<h4><label class="text-muted mb-1" for="util-community-calendar-task-add-description">Add Task</label></h4>',
							'<textarea style="height:150px;" class="form-control myds-text myds-validate myds-validate-error" ',
							'data-validate-mandatory="" id="util-community-calendar-task-add-{{dateid}}" data-dateid="{{dateid}}" ',
							'data-scope="util-community-calendar-task-add-{{dateid}}" data-context="description"></textarea>',
						'</div>',
						'<div class="form-group">',
							'<h4><label class="text-muted mb-1" for="util-community-calendar-task-add-project-{{dateid}}">Project</label></h4>',
							'<select class="form-control input-lg myds-select"',
								' id="util-community-calendar-task-add-project-{{dateid}}" style="width:100%;"',
								' data-scope="util-community-calendar-task-add-{{dateid}}"',
								' data-context="project">',
							'</select>',
						'</div>',
                	'<div class="form-group">',
							'<h4><label class="text-muted mb-1" for="util-community-calendar-task-add-type-{{dateid}}">Type</label></h4>',
							'<select class="form-control input-lg myds-select"',
								' id="util-community-calendar-task-add-type-{{dateid}}" style="width:100%;"',
								' data-scope="util-community-calendar-task-add-{{dateid}}"',
								' data-context="type">',
							'</select>',
						'</div>',
						'<div class="form-group">',
							'<h4><label class="text-muted mb-1" for="util-community-calendar-task-add-taskbyuser-{{dateid}}">Task By (User)</label></h4>',
							'<select class="form-control input-lg myds-select"',
								' id="util-community-calendar-task-add-taskbyuser-{{dateid}}" style="width:100%;"',
								' data-id=""',
								' data-scope="util-community-calendar-task-add-{{dateid}}"',
								' data-context="taskbyuser">',
							'</select>',
						'</div>',
						'<div class="form-group">',
							'<h4><label class="text-muted mb-1 mt-1" for="util-community-calendar-task-add-startdate">Start date</label></h4>',

							'<div class="input-group date myds-date" data-target-input="nearest" id="util-community-calendar-task-add-startdate-view-{{dateid}}">',
								'<input type="text" class="form-control input-lg datetimepicker-input"',
									' data-target="#util-community-calendar-task-add-startdate-view-{{dateid}}"',
									' id="util-community-calendar-task-add-startdate-{{dateid}}" data-id=""',
									' data-scope="util-community-calendar-task-add-{{dateid}}" data-context="startdate" value="{{startdate}}" data-value="{{startdate}}" />',
								'<div class="input-group-append" data-target="#util-community-calendar-task-add-startdate-view-{{dateid}}" data-toggle="datetimepicker">',
									'<div class="input-group-text"><i class="far fa-calendar-alt"></i></div>',
								'</div>',
							'</div>',
						'</div>',
						'<div class="form-group">',
							'<h4><label class="text-muted mb-1 mt-1" for="util-community-calendar-task-add-enddate">Due date</label></h4>',

							'<div class="input-group date myds-date" data-target-input="nearest" id="util-community-calendar-task-add-enddate-view-{{dateid}}">',
								'<input type="text" class="form-control input-lg datetimepicker-input"',
									' data-target="#util-community-calendar-task-add-enddate-view-{{dateid}}"',
									' id="util-community-calendar-task-add-enddate-{{dateid}}" data-id=""',
									' data-scope="util-community-calendar-task-add-{{dateid}}" data-context="enddate" value="{{enddate}}" data-value="{{enddate}}" />',
								'<div class="input-group-append" data-target="#util-community-calendar-task-add-enddate-view-{{dateid}}" data-toggle="datetimepicker">',
								'<div class="input-group-text"><i class="far fa-calendar-alt"></i></div>',
							'</div>',
						'</div>',
					'</form>',
					'<div class="form-group text-center mb-0 mt-4">',
						'<button type="button" class="btn btn-link text-muted btn-sm mr-2 myds-click"',
							' data-controller="util-community-calendar-task-add-cancel"',
							' data-dateid="{{dateid}}"',
						'>',
							'Cancel',
						'</button>',
						'<button type="button" class="btn btn-default btn-outline btn-sm mr-2 myds-click"',
							' data-controller="util-community-calendar-task-add-save"',
							' data-dateid="{{dateid}}"',
						'>',
							'Save',
						'</button>',
					'</div>'
				]);

				var data = app.set(
				{
					scope: 'util-community-calendar-task-add-' + dateID,
					value:
					{
						dateid: dateID,
						startdate: moment().format('DD MMM YYYY'),
						enddate: date
					}
				});

				queueTask.add({useTemplate: true}, data);

				queueTask.render('#util-community-calendar-task-add-' + dateID + '-view');

				app.invoke('util-view-select',
				{
					container: 'util-community-calendar-task-add-taskbyuser-' + dateID,
					object: 'setup_user',
					fields: [{name: 'user.contactperson.firstname'}, {name: 'user.contactperson.surname'}]
				});

				app.invoke('util-view-select',
				{
					container: 'util-community-calendar-task-add-type-' + dateID,
					object: 'setup_project_task_type',
					fields: [{name: 'title'}]
				});

				app.invoke('util-view-select',
				{
					container: 'util-community-calendar-task-add-project-' + dateID,
					object: 'project',
					fields: [{name: 'description'}]
				});
			}
		}
	}
]);

app.add(
{
	name: 'util-community-calendar-task-add-save',
	code: function (param, response)
	{	
		console.log(param);

		var dateID = app._util.param.get(param.dataContext, 'dateid').value;
	
		var data = app.get(
		{
			controller: 'util-community-calendar-task-add-' + id,
			cleanForCloudStorage: true,
			valueDefault: {}
		});

		if (_.isUndefined(response))
		{
			mydigitalstructure.update(
			{
				object: 'project_task',
				data: data,
				callback: 'util-community-calendar-task-add-save',
				callbackParam: param
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Task added.');
				$('#util-community-calendar-task-add-' + dateID).removeClass('show');

				//refresh the date tasks
			}
		}
	}
});

app.add(
{
	name: 'util-community-calendar-task-add-cancel',
	code: function (param, response)
	{
		var dateID = app._util.param.get(param.dataContext, 'dateid').value;
		$('#util-community-calendar-task-add-' + dateID).removeClass('show');
	}
});

// EVENTS

app.add(
{
	name: 'util-community-calendar-event-add',
	code: function (param)
	{	
		console.log(param);

		var dateID = app._util.param.get(param.dataContext, 'dateid').value;
		var date = app._util.param.get(param.dataContext, 'date').value;
		var eventType = app._util.param.get(param.dataContext, 'eventType').value;

		if (dateID != undefined)
		{
			var queueEvent = app.vq.init({queue: 'add-task'});

			queueEvent.template(
			[
				'<form autocomplete="off">',
					'<div class="form-group">',
						'<h4><label class="text-muted mb-1" for="util-community-calendar-event-add-description">Add Event</label></h4>',
						'<textarea style="height:150px;" class="form-control myds-text myds-validate myds-validate-error" ',
						'data-validate-mandatory="" id="util-community-calendar-event-add-{{dateid}}" data-dateid="{{dateid}}" ',
						'data-scope="util-community-calendar-event-add-{{dateid}}" data-context="description"></textarea>',
					'</div>',
					'<div class="form-group">',
						'<h4><label class="text-muted mb-1 mt-1" for="util-community-calendar-event-add-startdate">Date</label></h4>',
						'<div class="input-group date myds-date" data-target-input="nearest" id="util-community-calendar-event-add-startdate-view-{{dateid}}">',
							'<input type="text" class="form-control input-lg datetimepicker-input"',
								' data-target="#util-community-calendar-event-add-startdate-view-{{dateid}}"',
								' id="util-community-calendar-event-add-startdate-{{dateid}}" data-id=""',
								' data-scope="util-community-calendar-event-add-{{dateid}}" data-context="startdate" value="{{startdate}}" data-value="{{startdate}}" />',
							'<div class="input-group-append" data-target="#util-community-calendar-event-add-startdate-view-{{dateid}}" data-toggle="datetimepicker">',
								'<div class="input-group-text"><i class="far fa-calendar-alt"></i></div>',
							'</div>',
						'</div>',
					'</div>',
				'</form>',
				'<div class="form-group text-center mb-0 mt-4">',
					'<button type="button" class="btn btn-link text-muted btn-sm mr-2 myds-click"',
						' data-controller="util-community-calendar-event-add-cancel"',
						' data-dateid="{{dateid}}"',
					'>',
						'Cancel',
					'</button>',
					'<button type="button" class="btn btn-default btn-outline btn-sm mr-2 myds-click"',
						' data-controller="util-community-calendar-event-add-save"',
						' data-dateid="{{dateid}}"',
					'>',
						'Save',
					'</button>',
				'</div>'
			]);

			var data = app.set(
			{
				scope: 'util-community-calendar-event-add-' + dateID,
				value:
				{
					dateid: dateID,
					startdate: moment().format('DD MMM YYYY'),
					enddate: date
				}
			});

			queueEvent.add({useTemplate: true}, data);

			queueEvent.render('#util-community-calendar-event-add-' + dateID + '-view');

			app.invoke('util-view-select',
			{
				container: 'util-community-calendar-event-add-type-' + dateID,
				object: 'setup_event_type',
				fields: [{name: 'title'}]
			});
		}
	}
});

app.add(
{
	name: 'util-community-calendar-event-add-save',
	code: function (param, response)
	{	
		console.log(param);

		var dateID = app._util.param.get(param.dataContext, 'dateid').value;
	
		var data = app.get(
		{
			controller: 'util-community-calendar-event-add-' + id,
			cleanForCloudStorage: true,
			valueDefault: {}
		});

		if (_.isUndefined(response))
		{
			mydigitalstructure.update(
			{
				object: 'project_task',
				data: data,
				callback: 'util-community-calendar-task-add-save',
				callbackParam: param
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Task added.');
				$('#util-community-calendar-task-add-' + dateID).removeClass('show');

				//refresh the date tasks
			}
		}
	}
});

app.add(
{
	name: 'util-community-calendar-event-add-cancel',
	code: function (param, response)
	{
		var dateID = app._util.param.get(param.dataContext, 'dateid').value;
		$('#util-community-calendar-task-add-' + dateID).removeClass('show');
	}
});


