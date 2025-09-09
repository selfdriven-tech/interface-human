/*
	{
    	namespace: "selfdriven.app",
		scope: "org",
		context: "conversations", 	
    	notes: "https://selfdriven.foundation/apps"
  	}
*/

app.add(
{
	name: 'org-conversations',
	code: function (param)
	{
		var id = app._util.param.get(param, 'id', {default: 'recent'}).value;

		if (id == 'recent')
		{
			app.invoke('util-view-tab-show', '#org-conversations-dashboard-recent');
		}

		if (id == 'all')
		{
			app.invoke('util-view-tab-show', '#org-conversations-dashboard-all');
		}

		app.set(
		{
			scope: 'org-conversations-dashboard',
			merge: true,
			value: {dataContext: {type: id}}
		});

		app.invoke('org-conversations-dashboard', param)
	}
});

app.add(
{
	name: 'org-conversations-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'org-conversations-dashboard',
			valueDefault: {}
		});

		var filters =
		[
			{
				field: 'status',
				comparison: 'NOT_EQUAL_TO',
				value: 2
			},
			{
				field: 'sharing',
				comparison: 'EQUAL_TO',
				value: 1
			},
			{	
				field: 'title',
				comparison: 'NOT_EQUAL_TO',
				value: '[conversation-identity-webauthn-passkey]'
			}
		];

		if (!_.isEmpty(data.search))
		{
			filters = _.concat(filters,
			[
				{
					name: '('
				},
				{	
					field: 'title',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{
					name: ')'
				}
			]);
		}

		app.invoke('util-view-table',
		{
			object: 'messaging_conversation',
			container: 'org-conversations-dashboard-view',
			context: 'org-conversations',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">You have no conversations that match this search.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this conversation?',
					position: 'left'
				}
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
					controller: 'org-conversations-dashboard-format'
				},
				columns:
				[
					{
						caption: 'Title',
						field: 'title',
						class: 'col-12 col-sm-4 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="org-conversation-summary"'
					},
					{
						caption: 'Owner',
						field: 'ownertext',
						class: 'col-12 col-sm-5 myds-navigate',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="org-conversation-summary"'
					},
					{
						caption: 'Last Updated',
						field: 'modifieddate', 	
						sortBy: true,
						defaultSort: true,
						defaultSortDirection: 'desc', 
						class: 'col-0 col-sm-3 d-none d-sm-block myds-navigate text-secondary text-right',
						data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="org-conversation-summary"'
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
});

app.add(
{
	name: 'org-conversations-dashboard-format',
	code: function (row)
	{
		row.sharingtext = 'Select Participants';
		if (row.sharing == 2)
		{
			row.sharingtext = 'Public'
		}

		if (row.participantcan == 1)
		{
			row.participantcantext = 'Post & Comment'
		}
	}
});

app.add(
{
	name: 'org-conversation-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'org-conversation-summary',
			context: 'id'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'org-conversations'});
		}
		else
		{
			if (response == undefined)
			{
				entityos.cloud.search(
				{
					object: 'messaging_conversation',
					fields: 
					[
						'title',
						'description',
						'owner',
						'ownertext',
						'modifieddate',
						'sharing',
						'sharingtext',
						'alerturl',
						'lastcommentdate',
						'participantcan',
						'participantcantext',
                        'alertemailfrom',
                        'emailalertdefault',
                        'includemessageinemailalert',
                        'alertemailsubject',
						'guid'
					],
					filters:
					[
						{
							field: 'guid',
							value: guid
						}
					],
					set: 
					{
						scope: 'org-conversations',
						context: 'all'
					},
					callback: 'org-conversation-summary',
					callbackParam: param
				});
			}
			else
			{
				if (response.status == 'OK')
				{
					if (response.data.rows.length == 0)
					{}
					else
					{
						var data = _.first(response.data.rows);
						app.invoke('org-conversations-dashboard-format', data);
						data.startdate = app.invoke('util-date', data.startdate);
						data._isOwner = (data.owner == app.whoami().thisInstanceOfMe.user.id);
						data._ownerClass = (data._isOwner?'':' d-none');
						
						app.set(
						{
							scope: 'org-conversation-summary',
							context: 'dataContext',
							value: data
						});

						app.view.refresh(
						{
							scope: 'org-conversation-summary',
							selector: '#org-conversation-summary',
							data: data,
							collapse:
							{
								contexts:
								[
									'attachments'
								]
							}
						});
						
						
					}
				}
			}
		}
	}	
});

app.add(
{
	name: 'org-conversation-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataScope: 'org-conversations',
			dataContext: 'all',
			scope: 'org-conversation-edit',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				reference: '',
				title: '',
				description: '',
				alerturl: 'https://org.slfdrvn.app/app-org/#org-conversation-summary/id:[[CONVERSATION_ID]]',
				status: 1,
				sharing: 1,
				participantcan: 1,
				owner: app.whoami().thisInstanceOfMe.user.id
			}
		}

		app.view.refresh(
		{
			scope: 'org-conversation-edit',
			selector: '#org-conversation-edit',
			data: data
		});
	}	
});

app.add(
{
	name: 'org-conversation-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			controller: 'org-conversation-edit',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'org-conversation-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values:
				{
					ownercontactbusiness: app.whoami().thisInstanceOfMe.user.contactbusiness,
					manageruser: app.whoami().thisInstanceOfMe.user.id,
					status: 1,
                    alerturl: 'https://org.slfdrvn.app/app-org/#org-conversation-summary/id:[[CONVERSATION_ID]]',
                    alertemailfrom: 'messaging@slfdrvn.io',
                    emailalertdefault: 'Y',
                    includemessageinemailalert: 'Y'
				}
			}
		});

		if (_.isUndefined(response))
		{
			entityos.cloud.save(
			{
				object: 'messaging_conversation',
				data: data,
				set: {scope: 'org-conversation-edit', data: true, guid: true},
				callback: 'org-conversation-edit-save',
				callbackParam: param
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify({message: 'Conversation has been ' + (id==''?'added':'updated') + '.'});

				app.invoke('util-view-refresh',
				{
					dataScope: 'org-conversations',
					data: data
				});

				app.invoke('app-navigate-to', {controller: 'org-conversation-summary', context: data.guid});
			}
		}
	}
});

app.add(
{
	name: 'org-conversation-participant-profile-edit',
	code: function (param, response)
	{	
		var conversationID = app.get(
		{
			scope: 'org-conversation-participant-profile-edit',
			context: 'id'
		});

		if (response == undefined)
		{
			entityos.cloud.search(
			{
				object: 'messaging_conversation_participant',
				fields: 
				[
					'emailalert',
					'modifieddate',
					'conversation',
					'participant.conversation.title',
					'participant.conversation.guid'
				],
				filters:
				[
					{
						field: 'conversation',
						value: conversationID
					},
					{
						field: 'user',
						value: app.whoami().thisInstanceOfMe.user.id
					}
				],
				customOptions:
				[
					{
						name: 'conversation',
						value: conversationID
					}
				],
				callback: 'org-conversation-participant-profile-edit',
				callbackParam: param
			});
		}
		else
		{
			if (response.status == 'OK')
			{
				if (response.data.rows.length == 0)
				{}
				else
				{
					var data = _.first(response.data.rows);
					
					app.set(
					{
						scope: 'org-conversation-participant-profile-edit',
						context: 'participant',
						value: data
					});

					app.view.refresh(
					{
						scope: 'org-conversation-participant-profile-edit',
						selector: '#org-conversation-participant-profile-edit',
						data: data
					});
					
				}
			}
		}
	}	
});

app.add(
{
	name: 'org-conversation-participant-profile-edit-save',
	code: function (param, response)
	{	
		var participant = app.get(
		{
			controller: 'org-conversation-participant-profile-edit',
			context: 'participant',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'org-conversation-participant-profile-edit-' + participant.id,
			cleanForCloudStorage: true,
			merge:
			{
				values: {id: participant.id}
			}
		});

		if (_.isUndefined(response))
		{
			entityos.cloud.save(
			{
				object: 'messaging_conversation_participant',
				data: data,
				callback: 'org-conversation-participant-profile-edit-save',
				callbackParam: param
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify({message: 'Settings updated.'});

				app.invoke('app-navigate-to', {controller: 'org-conversation-summary', context: participant['participant.conversation.guid']});
			}
		}
	}
});


app.add(
{
	name: 'org-conversation-summary-posts',
	code: function (param)
	{	
		var conversationID = app._util.param.get(param.dataContext, 'conversation').value;
        var viewStatus = app._util.param.get(param, 'status', {default: 'shown'}).value;
        var show = (viewStatus == 'shown');

		if (show)
		{
			if (conversationID != undefined)
			{
				var filters =
				[
					{	
						field: 'conversation',
						comparison: 'EQUAL_TO',
						value: conversationID
					}
				]

				var columns =
				[
					{
						caption: 'Subject',
						field: 'subject',
						defaultSort: true,
						sortBy: true,
						class: 'col-4 text-break text-wrap myds-navigate',
					},
					{
						caption: 'By',
						field: 'createdusertext',
						defaultSort: true,
						sortBy: true,
						class: 'col-5 text-break text-wrap myds-navigate',
					},
					{
						caption: 'Last Updated',
						field: 'modifieddate',
						defaultSort: true,
						sortBy: true,
						class: 'col-3 text-break text-wrap myds-click text-muted'
					},
					{
						fields: ['guid']
					}
				];

				var sorts = 
				[
					{
						name: 'modifieddate',
						direction: 'desc'
					}
				]

				app.invoke('util-view-table',
				{
					object: 'messaging_conversation_post',
					container: 'org-conversation-summary-posts-view',
					context: 'org-conversation-summary-posts',
					filters: filters,
					options:
					{
						noDataText: '<div class="p-4">There are no posts for this conversation.</div>',
						rows: 20,
						orientation: 'vertical',
						progressive: true,
						class: 'table-condensed',
						deleteConfirm:
						{
							text: 'Are you sure you want to remove this post?',
							position: 'left',
							headerText: 'Remove Conversation Post',
							buttonText: 'Remove',
							controller: 'org-conversation-summary-post-ok'
						},
						showFooter: false
					},
					customOptions:
					[
						{
							name: 'conversation',
							value: conversationID
						}
					],
					sorts: sorts,
					format:
					{
						header:
						{
							class: 'd-flex'
						},

						row:
						{
							data: 'data-id="{{guid}}" data-context="{{guid}}" data-controller="org-conversation-post-summary"',
							class: 'd-flex',
							controller: 'org-conversation-summary-posts-format'
						},

						columns: columns
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
    name: 'org-conversation-summary-posts-format',
    code: function (row)
    {}
});

app.add(
{
	name: 'org-conversation-summary-files',
	code: function (param)
	{	
		var conversationID = app._util.param.get(param.dataContext, 'conversation').value;
        var viewStatus = app._util.param.get(param, 'status', {default: 'shown'}).value;
        var show = (viewStatus == 'shown');

		if (show)
		{
			if (conversationID != undefined)
			{
                app.invoke('util-attachments-initialise',
                {
                    context: 'org-conversation-summary',
                    object: app.whoami().mySetup.objects.messagingConversation,
                    objectContext: conversationID,
                    showTypes: false,
                    collapsible: false
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
	name: 'org-conversation-summary-comments',
	code: function (param)
	{	
		var conversationID = app._util.param.get(param.dataContext, 'conversation').value;
        var viewStatus = app._util.param.get(param, 'status', {default: 'shown'}).value;
        var show = (viewStatus == 'shown');

		if (show)
		{
			if (conversationID != undefined)
			{
				var filters =
				[
					{	
						field: 'conversation',
						comparison: 'EQUAL_TO',
						value: conversationID
					}
				]

				var columns =
				[
					{
						caption: 'Comment',
						field: 'message',
						defaultSort: true,
						sortBy: true,
						class: 'col-4 text-break text-wrap myds-click'
					},
                    {
						caption: 'By',
						field: 'createdusertext',
						defaultSort: true,
						sortBy: true,
						class: 'col-3 text-break text-wrap myds-click',
					},
					{
						caption: 'Date',
						field: 'modifieddate',
						defaultSort: true,
						sortBy: true,
						class: 'col-2 text-break text-wrap myds-click'
					},
                    {
						caption: 'Post',
						field: 'comment.post.subject',
						defaultSort: true,
						sortBy: true,
						class: 'col-3 text-break text-wrap text-muted myds-click'
					},
					{
						fields: ['guid', 'comment.post.id', 'conversation', 'createdusertext', 'modifieddate']
					}
				];

				app.invoke('util-view-table',
				{
					object: 'messaging_conversation_post_comment',
					container: 'org-conversation-summary-comments-view',
					context: 'org-conversation-summary-comments',
					filters: filters,
					options:
					{
						noDataText: '<div class="p-4">There are no post comments for this conversation.</div>',
						rows: 20,
						orientation: 'vertical',
						progressive: true,
						class: 'table-condensed',
						deleteConfirm:
						{
							text: 'Are you sure you want to remove this post comment?',
							position: 'left',
							headerText: 'Remove Conversation Post Comment',
							buttonText: 'Remove'
						},
						showFooter: false
					},
					customOptions:
					[
						{
							name: 'conversation',
							value: conversationID
						}
					],
					format:
					{
						header:
						{
							class: 'd-flex'
						},

						row:
						{
							data: 'data-id="{{comment.post.id}}" data-context="{{comment.post.id}}"  data-conversation="{{conversation}}" data-controller="org-conversation-summary-comments-post"',
							class: 'd-flex myds-click',
							controller: 'org-conversation-summary-comments-format'
						},

						columns: columns
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
    name: 'org-conversation-summary-comments-post',
    code: function (param, response)
    {
        var postID = app._util.param.get(param.dataContext, 'context').value;
        var conversationID = app._util.param.get(param.dataContext, 'conversation').value;

        if (response == undefined)
        {
            entityos.cloud.search(
            {
                object: 'messaging_conversation_post',
                fields: 
                [
                    'guid'
                ],
                filters:
                [
                    {
                        field: 'id',
                        value: postID
                    }
                ],
                customOptions:
                [
                    {
                        name: 'conversation',
                        value: conversationID
                    }
                ],
                callback: 'org-conversation-summary-comments-post',
                callbackParam: param
            });
        }
        else
        {
            var data = _.first(response.data.rows)
            if (_.isSet(data))
            {
               app.invoke('app-navigate-to', {controller: 'org-conversation-post-summary', context: data.guid});
            }
        }
    }
});

app.add(
{
    name: 'org-conversation-summary-comments-format',
    code: function (row)
    {
        row.byinfo =
            '<div>' + row.createdusertext + '</div>' +
            '<div class="text-secondary">' + row.modifieddate + '</div>';

        row.messageformatted = _.replaceAll(row.message, '\r', '');
        row.messageformatted = _.replaceAll(row.messageformatted, '\n', '</br>');
    }
});

app.add(
{
	name: 'org-conversation-summary-participants',
	code: function (param)
	{	
		var conversationID = app._util.param.get(param.dataContext, 'conversation').value;
        var viewStatus = app._util.param.get(param, 'status', {default: 'shown'}).value;
        var show = (viewStatus == 'shown');

        if (conversationID == undefined)
        {
            conversationID = app.get(
            {
                scope: 'org-conversation-summary',
                context: 'dataContext',
                name: 'id'
            });
        }

		if (show)
		{
			if (conversationID != undefined)
			{
				var filters =
				[
					{	
						field: 'conversation',
						comparison: 'EQUAL_TO',
						value: conversationID
					},
                    {	
						field: 'status',
						comparison: 'EQUAL_TO',
						value: 1
					}
				]

				var columns =
				[
					{
						caption: 'Username',
						field: 'username',
						defaultSort: true,
						sortBy: true,
						class: 'col-4 text-break text-wrap myds-click'
					},
					{
						caption: 'Email',
						field: 'email',
						sortBy: true,
						class: 'col-5 text-break text-wrap myds-click'
					},
					{
						caption: 'Email Alert',
						name: '_emailalert',
						class: 'col-2 text-break text-center text-wrap myds-click'
					},
                    {
						html: '<button class="btn btn-outline-danger btn-sm myds-delete"' +
	               			' id="org-conversation-summary-participants-delete-{{id}}" data-id="{{id}}"><i class="fa fa-trash"></i></button>',
						caption: '&nbsp;',
						class: 'col-sm-1 text-right'
					},
					{
						fields: ['guid', 'status', 'emailalert']
					}
				];

				app.invoke('util-view-table',
				{
					object: 'messaging_conversation_participant',
					container: 'org-conversation-summary-participants-view',
					context: 'org-conversation-summary-participants',
					filters: filters,
					options:
					{
						noDataText: '<div class="p-4">There are no participants for this conversation.</div>',
						rows: 20,
						orientation: 'vertical',
						progressive: true,
						class: 'table-condensed',
						deleteConfirm:
						{
							text: 'Are you sure you want to remove this participant?',
							position: 'left',
							headerText: 'Remove',
							buttonText: 'Remove'
						},
						showFooter: false
					},
					customOptions:
					[
						{
							name: 'conversation',
							value: conversationID
						}
					],
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
							controller: 'org-conversation-summary-participants-format'
						},

						columns: columns
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
    name: 'org-conversation-summary-participants-format',
    code: function (row)
    {
		row._emailalert = (row.emailalert=='Y'?'<i class="fe fe-check-circle text-success lead"></i>':'<i class="fe fe-x-circle text-danger lead"></i>')
	}
});

app.add(
{
	name: 'org-conversation-summary-participants-delete-ok',
	code: function (param, response)
	{
		if (_.isUndefined(response))
		{
			if (!_.isUndefined(param.dataContext))
			{
                var conversationID = app.get(
                {
                    scope: 'org-conversation-summary',
                    context: 'dataContext',
                    name: 'id'
                });

				entityos.cloud.delete(
				{
					object: 'messaging_conversation_participant',
					data:
					{
						id: param.dataContext.id,
                        conversation: conversationID
					},
					callback: 'org-conversation-summary-participants-delete-ok'
				});
			}	
		}
		else
		{
			if (response.status == 'OK')
			{
				app.notify({message: 'Participant removed from conversation.', persist: false});
				app.invoke('org-conversation-summary-participants', {status: 'shown'});
			}
		}
	}
});

app.add(
{
	name: 'org-conversation-participant-edit',
	code: function (param)
	{	
		var users = app.get(
		{
			scope: 'org-conversation',
			context: 'users'
		});

		if (users == undefined)
		{
			app.invoke('org-conversation-users')
		}
		else
		{
			app._util.data.clear({scope: 'org-conversation-participant-edit'});

			var userIDs = _.map(users, 'id');

			//Check already not participant

			app.invoke('util-view-select',
			{
				container: 'org-conversation-participant-edit-user',
				object: 'setup_messaging_account',
				idField: 'user',
				fields: [{name: 'usertext'}, {name: 'user', hidden: true, noSearch: true}],
				filters:
				[
					{
						name: 'user',
						comparison: 'IN_LIST',
						value: userIDs
					},
					{
						name: 'type',
						comparison: 'EQUAL_TO',
						value: 4
					}
				]
			});
		}
	}
});

app.add(
{
	name: 'org-conversation-users',
	code: function (param, response)
	{	
		entityos.cloud.search(
		{
			object: 'setup_user',
			fields: 
			[
				'username'
			],
			filters:
			[
				{
					field: 'contactbusiness',
					value: app.whoami().thisInstanceOfMe.user.contactbusiness
				}
			],
			set: 
			{
				scope: 'org-conversation',
				context: 'users'
			},
			callback: 'org-conversation-participant-edit',
			callbackParam: param
		});
	}	
});

app.add(
{
	name: 'org-conversation-participant-edit-save', 
	code: function (param, response)
	{	
		var appContext = entityos._util.param.get(param.dataContext, 'appContext', {default: 'org'}).value;

		var dataConversation = app.get(
		{
			controller: appContext + '-conversation-summary',
			context: 'dataContext',
			valueDefault: {}
		});

		var dataParticipant = app.get(
		{
			scope: 'org-conversation-participant-edit',
			cleanForCloudStorage: true,
			valueDefault: {}
		});

		if (_.isNotSet(dataParticipant.id))
		{
			dataParticipant.conversation = dataConversation.id;
			dataParticipant.emailalert = dataConversation.emailalertdefault;
		}
		
		if (_.isUndefined(response))
		{
			entityos.cloud.save(
			{
				object: 'messaging_conversation_participant',
				data: dataParticipant,
				callback: 'org-conversation-participant-edit-save',
				callbackParam: param
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('Participant added to the conversation.');
				$('#' + appContext + '-conversation-participants-edit-collapse').removeClass('show');
				app.invoke('org-conversation-summary-participants', {status: 'shown', conversation: dataConversation.id})
			}
		}
	}
});

//-- CONVERSATION | POSTS

app.add(
{
	name: 'org-conversation-post-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'org-conversation-post-summary',
			context: 'id'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'org-conversations'});
		}
		else
		{
			if (response == undefined)
			{
				var conversation = app.get(
				{
					scope: "org-conversation-summary",
					context: "dataContext"
				});
				
				entityos.cloud.search(
				{
					object: 'messaging_conversation_post',
					fields: 
					[
						'post.conversation.title',
                        'post.conversation.guid',
						'subject',
						'message',
						'createdusertext',
						'createduser',
						'createddate',
						'guid'
					],
					filters:
					[
						{
							field: 'guid',
							value: guid
						}
					],
					customOptions:
					[
						{
							name: 'conversation',
							value: conversation.id
						}
					],
					callback: 'org-conversation-post-summary',
					callbackParam: param
				});
			}
			else
			{
				if (response.status == 'OK')
				{
					if (response.data.rows.length == 0)
					{}
					else
					{
						var data = _.first(response.data.rows);
						data.message = _.unescapeHTML(data.message);

						//app.invoke('org-conversation-posts-format', data);
						//data.startdate = app.invoke('util-date', data.startdate);

						app.set(
						{
							scope: 'org-conversation-post-summary',
							context: 'dataContext',
							value: data
						});

						app.view.refresh(
						{
							scope: 'org-conversation-post-summary',
							selector: '#org-conversation-post-summary',
							data: data,
							collapse:
							{
								contexts:
								[
									'attachments'
								]
							}
						});
						
						app.invoke('util-attachments-initialise',
						{
							context: 'org-conversation-post-summary',
							object: 313,
							objectContext: data.id,
							showTypes: false,
							collapsible: false
						});

                        app.invoke('org-conversation-post-summary-comments')
					}
				}
			}
		}
	}	
});

app.add(
{
	name: 'org-conversation-post-add',
	code: function (param)
	{	
		app._util.data.clear({scope: 'org-conversation-post-edit'});

		var content = '';

		app.invoke('util-view-editor',
		{
			selector: '#org-conversation-post-add-message',
			height: '400px',
			content: content
		});
	}
});

app.add(
{
	name: 'org-conversation-post-add-save', 
	code: function (param, response)
	{	
		var appContext = entityos._util.param.get(param.dataContext, 'appContext', {default: 'org'}).value;

		var dataConversation = app.get(
		{
			controller: appContext + '-conversation-summary',
			context: 'dataContext',
			valueDefault: {}
		});

		var dataPost = app.get(
		{
			scope: 'org-conversation-post-add',
			cleanForCloudStorage: true,
			valueDefault: {}
		});

		if (_.isNotSet(dataPost.id))
		{
			dataPost.conversation = dataConversation.id;
		}

		//FOR TESTING
		//dataPost.noalerts = 'Y';

		if (_.isUndefined(response))
		{
			entityos.cloud.save(
			{
				object: 'messaging_conversation_post',
				data: dataPost,
				callback: 'org-conversation-post-add-save',
				callbackParam: param
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
                app.invoke('util-view-spinner-remove-all');
				app.notify('Post added to the conversation.');
				$('#' + appContext + '-conversation-posts-edit-collapse').removeClass('show');
				app.invoke('org-conversation-summary-posts', {status: 'shown', dataContext: {conversation: dataConversation.id}});
			}
		}
	}
});

app.add(
{
	name: 'org-conversation-post-edit',
	code: function (param, response)
	{	
		var data = app.get(
		{
			scope: 'org-conversation-post-summary',
			context: 'dataContext'
		});

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				subject: '',
				message: ''
			}
		}

		app.view.refresh(
		{
			scope: 'org-conversation-post-edit',
			selector: '#org-conversation-post-edit',
			data: data
		});

        app.invoke('util-view-editor',
		{
			selector: '#org-conversation-post-edit-message',
			height: '500px',
			content: data.message
		});
	}	
});

app.add(
{
	name: 'org-conversation-post-edit-save', 
	code: function (param, response)
	{	
		var dataConversation = app.get(
		{
			controller: 'org-conversation-summary',
			context: 'dataContext',
			valueDefault: {}
		});

        var dataPost = app.get(
		{
			controller: 'org-conversation-post-summary',
			valueDefault: {}
		});

        var id = app.get(
		{
			controller: 'org-conversation-post-edit',
			context: 'id',
			valueDefault: ''
		});
	
		var data = app.get(
		{
			scope: 'org-conversation-post-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values:
				{
					conversation: dataConversation.id,
				}
			}
		});

		//FOR TESTING
		//data.noalerts = 'Y';

		if (_.isUndefined(response))
		{
			entityos.cloud.save(
			{
				object: 'messaging_conversation_post',
				data: data,
				callback: 'org-conversation-post-edit-save',
				callbackParam: param
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
                app.invoke('util-view-spinner-remove-all');
				app.notify('Post updated.');
				app.invoke('util-view-refresh',
				{
					dataScope: 'org-conversation-summary-posts',
					data: data
				});

				app.invoke('app-navigate-to', {controller: 'org-conversation-post-summary', context: dataPost.context});
            }
		}
	}
});


//-- CONVERSATION | POST | COMMENTS

app.add(
{
	name: 'org-conversation-post-summary-comments',
	code: function (param)
	{	
        var conversation = app.get(
		{
			controller: 'org-conversation-summary',
			context: 'dataContext',
			valueDefault: {}
		});

        var post = app.get(
		{
			controller: 'org-conversation-post-summary',
			context: 'dataContext',
			valueDefault: {}
		});

        var viewStatus = app._util.param.get(param, 'status', {default: 'shown'}).value;
        var show = (viewStatus == 'shown');

		if (show)
		{
			if (conversation.id != undefined && post.id != undefined)
			{
				var filters =
				[
					{	
						field: 'conversation',
						comparison: 'EQUAL_TO',
						value: conversation.id
					},
                    {	
						field: 'post',
						comparison: 'EQUAL_TO',
						value: post.id
					}
				]

				var columns =
				[
					{
						caption: 'Comment',
						name: 'messageformatted',
						sortBy: true,
						class: 'col-9 text-break text-wrap myds-click'
					},
                    {
						caption: 'By',
						name: 'byinfo',
						sortBy: true,
						class: 'col-3 text-break text-wrap myds-navigate',
					},
					{
						fields: ['guid', 'createdusertext', 'modifieddate', 'message']
					}
				];

				app.invoke('util-view-table',
				{
					object: 'messaging_conversation_post_comment',
					container: 'util-messaging-conversation-post-summary-comments-view',
					context: 'org-conversation-summary-comments',
					filters: filters,
					options:
					{
						noDataText: '<div class="p-4">There are no post comments for this conversation.</div>',
						rows: 20,
						orientation: 'vertical',
						progressive: true,
						class: 'table-condensed',
						deleteConfirm:
						{
							text: 'Are you sure you want to remove this post comment?',
							position: 'left',
							headerText: 'Remove Conversation Post Comment',
							buttonText: 'Remove'
						},
						showFooter: false
					},
                    sorts:
                    [
                        {
                            name: 'modifieddate',
						    direction: 'desc'
                        }
                    ],
					customOptions:
					[
						{
							name: 'conversation',
							value: conversation.id
						}
					],
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
							controller: 'org-conversation-summary-comments-format'
						},

						columns: columns
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
	name: 'org-conversation-post-comment-edit-save', 
	code: function (param, response)
	{	
		var dataConversation = app.get(
		{
			controller: 'org-conversation-summary',
			context: 'dataContext',
			valueDefault: {}
		});

        var dataPost = app.get(
		{
			controller: 'org-conversation-post-summary',
			context: 'dataContext',
			valueDefault: {}
		});

		var dataComment = app.get(
		{
			scope: 'org-conversation-post-comment-edit',
			cleanForCloudStorage: true,
			valueDefault: {}
		});

		if (_.isNotSet(dataComment.id))
		{
			dataComment.conversation = dataConversation.id;
            dataComment.post = dataPost.id;
		}

		if (_.isUndefined(response))
		{
			entityos.cloud.save(
			{
				object: 'messaging_conversation_post_comment',
				data: dataComment,
				callback: 'org-conversation-post-comment-edit-save',
				callbackParam: param
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
                app.invoke('util-view-spinner-remove-all');
				app.notify('Comment added to the post.');
				$('#org-conversation-post-comments-edit-collapse').removeClass('show');
				app.invoke('org-conversation-post-summary-comments', {status: 'shown'});
			}
		}
	}
});
