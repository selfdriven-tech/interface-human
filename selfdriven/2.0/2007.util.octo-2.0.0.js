/*

- Create conversation with Octo

*/

// CREATE CONVERSATION WITH OCTO

app.add(
[
	{
		name: 'util-octo-conversation-init',
		code: function (param, response)
		{
			//Search to see if user already has a conversation with Octo already.
			//Search by
			//object = 22
			//objectcontext = current user
			//notes = '[conversation-with-octo]'

			if (response == undefined)
			{
				entityos.cloud.search(
				{
					object: 'messaging_conversation',
					fields: [{name: 'owner'}],
					filters:
					[
						{
							field: 'notes',
							comparison: 'EQUAL_TO',
							value: '[conversation-with-octo]'
						},
						{
							field: 'sharing',
							comparison: 'EQUAL_TO',
							value: 1
						},
						{
							field: 'object',
							comparison: 'EQUAL_TO',
							value: 22
						},
						{
							field: 'objectcontext',
							comparison: 'EQUAL_TO',
							value: app.whoami().thisInstanceOfMe.user.id
						}
					],
					callback: 'util-octo-conversation-init',
					callbackParam: param
				});
			}
			else
			{
				if (response.data.rows.length == 0)
				{
					app.invoke('util-octo-conversation-init-save');
				}
				else
				{
					app.set(
					{
						scope: 'util-octo-conversation-init',
						context: 'conversation',
						value: _.first(response.data.rows)
					});

					app.invoke('util-octo-conversation-init-participant');
				}
			}
		}
	},
	{
		name: 'util-octo-conversation-init-save',
		code: function (param, response)
		{
			if (response == undefined)
			{
				const data =
				{
					title: 'Conversation with Octo',
					notes: '[conversation-with-octo]',
					sharing: 1,
					object: 22,
					objectcontext: app.whoami().thisInstanceOfMe.user.id
				}

				entityos.cloud.save(
				{
					object: 'messaging_conversation',
					data: data,
					responseFields: 'guid',
					callback: 'util-octo-conversation-init-save',
					callbackParam: param
				});
			}
			else
			{
				app.set(
				{
					scope: 'util-setup',
					context: 'octo',
					name: 'conversation',
					value: {id: response.id, guid: _.first(response.data.rows).guid}
				});

				app.invoke('util-octo-conversation-init-participant');
			}
		}
	},
	{
		name: 'util-octo-conversation-init-participant',
		code: function (param, response)
		{
			if (response == undefined)
			{
				const conversation = app.get(
				{
					scope: 'util-setup',
					context: 'octo',
					name: 'conversation'
				});

				entityos.cloud.search(
				{
					object: 'messaging_conversation_participant',
					fields: [{name: 'guid'}],
					customOptions:
					[
						{
							name: 'conversation',
							value: conversation.id
						}
					],
					filters:
					[
						{
							field: 'conversation',
							comparison: 'EQUAL_TO',
							value: conversation.id
						},
						{
							field: 'user',
							comparison: 'EQUAL_TO',
							value: (app.whoami().mySetup.isLab?44066:44068)
						}
					],
					callback: 'util-octo-conversation-init-participant',
					callbackParam: param
				});
			}
			else
			{
				if (response.data.rows.length == 0)
				{
					app.invoke('util-octo-conversation-init-participant-save');
				}
				else
				{
					app.invoke('util-on-complete', param);
				}
			}
		}
	},
	{
		name: 'util-octo-conversation-init-participant-save',
		code: function (param, response)
		{
			const conversation = app.get(
			{
				scope: 'util-setup',
				context: 'octo',
				name: 'conversation'
			});

			if (response == undefined)
			{
				const data =
				{
					conversation: conversation.id,
					emailalert: 'N',
					user: (app.whoami().mySetup.isLab?44066:44068)
				}

				entityos.cloud.save(
				{
					object: 'messaging_conversation_participant',
					data: data,
					callback: 'util-octo-conversation-init-participant-save',
					callbackParam: param
				});
			}
			else
			{
				app.invoke('util-on-complete', param);
			}
		}
	}
]);

app.add(
{
	name: 'util-octo-conversation-post-save', 
	code: function (param, response)
	{	
		let octo = app.get(
		{
			scope: 'util-setup',
			context: 'octo'
		});

		if (_.isNotSet(_.get(octo, 'conversation.id')))
		{
			app.set(
			{
				scope: 'util-setup',
				context: 'octo',
				name: 'initialisingConversation',
				value: true
			});

			if (_.isNotSet(_.get(octo, 'initialisingConversation')))
			{
				param = _.set(param, 'onComplete', 'util-octo-conversation-post-save')
				app.invoke('util-octo-conversation-init', param);
			}
			else
			{
				console.log('!! [OCTO] Can not initialise conversation.')
			}
		}

		var dataConversation = _.get(octo, 'conversation');

		const subject = _.get(param, 'subject', '');
		const messaging = _.get(param, 'messaging', '')

        var data =
		{
			conversation: dataConversation.id,
			subject: subject,
			message: messaging,
			noalerts: 'Y'
		}

		if (_.isUndefined(response))
		{
			entityos.cloud.save(
			{
				object: 'messaging_conversation_post',
				data: data,
				callback: 'util-octo-conversation-post-save',
				callbackParam: param
			});
		}
		else
		{	
			param = _.set(param, 'status', response.status)
			app.invoke('util-on-complete', param);
		}
	}
});
