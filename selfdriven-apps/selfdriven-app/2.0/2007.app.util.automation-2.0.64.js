/*
	{
    	title: "App Utility Automation Services"
  	}

  	1. Registered automation tasks
  	2. Run task
  	3. Get template if set/exists
  	4. Run the automation controller
  	5. Record as action if set including actiontype etc
*/

app.add(
{
	name: 'util-automation-setup',
	notes: 'Can also be set up in util-setup controller.',
	code: function (param)
	{
		var tasks = app.get(
		{
			scope: 'util-automation',
			context: 'tasks'
		});

		if (_.isUndefined(tasks))
		{
			app.set(
			{
				scope: 'util-automation',
				context: 'tasks',
				value:
				[
					{
						name: 'welcome-to-selfdriven-email-send',
						caption: 'Welcome to selfdriven!',
						controller: 'util-automation-welcome-to-selfdriven-email-send',
						document:
						{
							url: '/welcome-to-selfdriven'
						}
					}
				]
			});
		}

		app.invoke('util-automation');
	}
});

app.add(
{
	name: 'util-automation-task',
	code: function (param)
	{
		app.invoke('util-automation', param)
	}
});

app.add(
{
	name: 'util-automation',
	code: function (param, response)
	{
		var tasks = app.get(
		{
			scope: 'util-automation',
			context: 'tasks'
		});

		if (_.isUndefined(tasks))
		{
			app.invoke('util-automation-setup', param)
		}
		else
		{
			var name = app._util.param.get(param, 'name').value;
			var controller = app._util.param.get(param, 'controller').value;

			if (name == undefined) {name = controller}
			if (controller == undefined) {controller = name}

			var task = _.find(tasks, function (_task)
			{
				_task.active = false;

				if (_task.name != undefined)
				{
					_task.active = (_task.name == name)
				}

				if (_task.controller != undefined && controller != undefined && !_task.active)
				{
					_task.active = (_task.controller == controller)
				}

				return _task.active
			});

			app._util.data.clear(
			{
				scope: 'util-automation',
				context: 'task'
			})

			if (task != undefined)
			{
				var data = app._util.param.get(param, 'data').value;
				var caption = app._util.param.get(param, 'caption').value;
				
				task.data = _.assign(task.data, data);

				if (task.caption == undefined) {task.caption = caption}
				if (task.caption == undefined) {task.caption = 'beHub Message'}

				task.captionRendered = app.vq.apply({template: task.caption, data: task.data});

				app.set(
				{
					scope: 'util-automation',
					context: 'task',
					value: task
				});

				param = app._util.param.set(param, 'task', task);
				
				if (task.document != undefined)
				{
					app.invoke('util-automation-document', param)
				}
				else
				{
					app.invoke('util-automation-process', param);
				}
			}
			else
			{
				app.notify({message: 'No matching task found.', type: 'error'})
			}
		}
	}
});

app.add(
{
	name: 'util-automation-document',
	note: 'Get the document',
	code: function (param, response)
	{
		var task = app._util.param.get(param, 'task').value;

		if (task == undefined)
		{
			task = app.get(
			{
				scope: 'util-automation',
				context: 'task'
			});
		}

		var documents = app.get(
		{
			scope: 'util-automation',
			context: 'documents'
		});

		if (task != undefined)
		{
			var automationDocument;

			if (task.document != undefined)
			{
				if (automationDocument == undefined && _.has(task, 'document.title'))
				{
				 	automationDocument = _.find(documents, function (document)
					{
						return ( document.title == task.document.title )
					});
				}

				if (automationDocument == undefined && _.has(task, 'document.id'))
				{
				 	automationDocument = _.find(documents, function (document)
					{
						return ( document.id == task.document.id )
					});
				}

				if (automationDocument == undefined && _.has(task, 'document.url'))
				{
				 	automationDocument = _.find(documents, function (document)
					{
						return ( document.url == task.document.url )
					});
				}
			}

			if (automationDocument != undefined)
			{
				task.document.content = automationDocument.content;
				app._util.param.set(param, 'documentContent', task.document.content);
				app.invoke('util-automation-process', param);
			}
			else
			{
				if (_.isUndefined(response))
				{
					var filters = [];

					if (_.has(task, 'document.title'))
					{
						filters.push(
						{
							field: 'title',
							value: task.document.title
						});
					}

					if (_.has(task, 'document.id'))
					{
						filters.push(
						{
							field: 'id',
							value: task.document.id
						});
					}

					if (_.has(task, 'document.url'))
					{
						filters.push(
						{
							field: 'url',
							value: task.document.url
						});
					}

					if (filters.length == 0)
					{}
					else
					{
						var fields = [{name: 'content'}, {name: 'url'}, {name: 'title'}];
						
						mydigitalstructure.cloud.search(
						{
							object: 'document',
							fields: fields,
							filters: filters,
							callback: 'util-automation-document',
							callbackParam: param
						});
					} 
				}
				else
				{
					if (response.data.rows.length > 0)
					{
						if (_.has(task, 'document'))
						{
							task.document.content = _.first(response.data.rows).content;
							app._util.param.set(param, 'documentContent', task.document.content);

							var documents = app.get(
							{
								scope: 'util-automation',
								context: 'documents',
								valueDefault: []
							});

							documents.push(task.document)

							app.set(
							{
								scope: 'util-automation',
								context: 'documents',
								value: documents
							});
						}

						app.invoke('util-automation-process', param);
					}
					else
					{
						app.notify('Unable to find template document: ' + task.document.title, {type: 'error'});
					}
				}
			}
		}
	}
});

app.add(
{
	name: 'util-automation-process',
	note: 'Process the document',
	code: function (param, response)
	{
		var task = app._util.param.get(param, 'task').value;

		if (task == undefined)
		{
			task = app.get(
			{
				scope: 'util-automation',
				context: 'task'
			});
		}

		if (_.has(task, 'data'))
		{ 
			task.document.rendered = app.vq.apply({template: task.document.content, data: task.data});
		}

		if (task.email)
		{
			app._util.param.set(param, 'subject', task.captionRendered);
			app._util.param.set(param, 'message', task.document.rendered);
			
			var to = app._util.param.get(param, 'to').value;
			if (to == undefined)
			{
				app._util.param.set(param, 'to', task.data.to);
			}

			var cc = app._util.param.get(param, 'cc').value;
			if (cc == undefined)
			{
				app._util.param.set(param, 'cc', task.data.cc);
			}

			var bcc = app._util.param.get(param, 'bcc').value;
			if (bcc == undefined)
			{
				app._util.param.set(param, 'bcc', task.data.bcc);
			}

			app.invoke('util-automation-email-send', param);
		}
		else
		{
			app._util.param.set(param, 'documentContentRendered', task.document.rendered);
			app.invoke(task.controller, param);
		}
	}
});

app.add(
{
	name: 'util-automation-email-send',
	note: 'Send an email',
	code: function (param, response)
	{
		var fromEmail = app._util.param.get(param, 'fromEmail', {default: 'noreply@selfdriven.cloud'}).value;
		var replyTo = fromEmail;
		var whoami = app.invoke('util-whoami');
		var isLab = app.get({scope: 'util-setup', context: 'isLab', valueDefault: false});

		var subject = app._util.param.get(param, 'subject', {default: 'beHub Message'}).value;
		var message = app._util.param.get(param, 'message').value;
		var to = app._util.param.get(param, 'to').value;
		var cc = app._util.param.get(param, 'cc').value;
		var bcc = app._util.param.get(param, 'bcc').value;

		var callback = app._util.param.get(param, 'callback', {default: 'util-automation-finalise'}).value;

		if (_.has(whoami, 'buildingMe.options.email.from'))
		{
			replyTo = whoami.buildingMe.options.email.from
		}

		if (isLab && _.has(whoami, 'buildingMe.options.email.to'))
		{
			to = whoami.buildingMe.options.email.to
		}

		//set save as action

		mydigitalstructure.cloud.invoke(
		{
			method: 'messaging_email_send',
			data:
			{
				fromemail: fromEmail,
				subject: subject,
				message: message,
				to: to,
				cc: cc,
				bcc: bcc,
				replyto: replyTo
			},
			callback: callback,
			callbackParam: param
		});
		
	}
});

app.add(
{
	name: 'util-automation-finalise',
	code: function (param, response)
	{
		console.log(param);
		app.invoke('util-view-spinner-remove-all'); //or see if set on task
	}
});

app.add(
{
	name: 'util-automation-welcome-to-selfdriven-email-send',
	note: 'Send password etc to a user',
	code: function (param, response)
	{
		var task = app._util.param.get(param, 'task').value;

		if (task == undefined)
		{
			task = app.get(
			{
				scope: 'util-automation',
				context: 'task'
			});
		}

		if (task != undefined)
		{
			if (_.isUndefined(response))
			{
				if (_.has(task, 'document.rendered'))
				{
					var fromEmail = 'noreply@selfdriven.cloud';
					var replyTo = fromEmail;

					var data =
					{
						fromemail: fromEmail,
						subject: task.captionRendered,
						message: _.unescapeHTML(task.document.rendered),
						to: task.data.to,
						cc: task.data.cc,
						replyto: replyTo,
						saveagainstobject: task.data.object,
						saveagainstobjectcontext: task.data.objectcontext
					}

					console.log(data)
					/*entityos.cloud.invoke(
					{
						method: 'messaging_email_send',
						data: data,
						callback: 'util-automation-welcome-to-selfdriven-email-send',
						callbackParam: param
					});*/
				}
			}
			else
			{
				if (response.status == 'OK')
				{
					app.notify('Email sent to ' + task.data.to);
				}
				else
				{
					app.notify('Error sending email: ' + response.error.errornotes);
				}

				app.invoke('util-view-spinner-remove-all');
			}
		}
	}
});
