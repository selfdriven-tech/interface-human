app.add(
{
	name:	'util-setup-users',
	code: function (param, response)
	{
		app.invoke('util-setup-user-dashboard');
	}
});

app.add(
{
	name:	'util-setup-user-dashboard',
	code: function (param, response)
	{
		app.set(
		{
			scope: 'util-setup-user-dashboard',
			context: 'authenticationlevels',
			value: 
			{
				1: 'Basic (Username & Password)',
				2: 'Standard (Username, Password & Session Token)',
				3: 'Standard with 2nd factor'
			}
		});

		var data = app._util.data.get(
		{
			controller: 'util-setup-user-dashboard',
			valueDefault: {}
		});

		var filters = [];

		if (!_.isEmpty(data.search))
		{
			filters.push(
			{	
				field: 'username',
				comparison: 'TEXT_IS_LIKE',
				value: data.search
			});

			filters.push(
			{
				name: 'or'
			});

			filters.push(
			{	
				field: 'user.contactperson.firstname',
				comparison: 'TEXT_IS_LIKE',
				value: data.search
			});

			filters.push(
			{
				name: 'or'
			});

			filters.push(
			{	
				field: 'user.contactperson.surname',
				comparison: 'TEXT_IS_LIKE',
				value: data.search
			});

			filters.push(
			{
				name: 'or'
			});

			filters.push(
			{	
				field: 'user.contactperson.email',
				comparison: 'TEXT_IS_LIKE',
				value: data.search
			});

			filters.push(
			{
				name: 'or'
			});

			filters.push(
			{	
				field: 'guid',
				comparison: 'TEXT_IS_LIKE',
				value: data.search
			});

			filters.push(
			{
				name: 'or'
			});

			filters.push(
			{	
				field: 'user.contactbusiness.tradename',
				comparison: 'TEXT_IS_LIKE',
				value: data.search
			});
		}

		app.invoke('util-view-table',
		{
			object: 'setup_user',
			controller: 'util-setup-user',
			container: 'util-setup-user-dashboard-view',
			context: 'util-setup-user-dashboard',
			onComplete: undefined,
			filters: filters,
			customOptions: undefined,
			options:
			{
				noDataText: '<div class="p-4">There are no users that match this search.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed'
			},
			format:
			{
				header:
				{
					class: 'd-flex'
				},

				row:
				{
					class: 'd-flex',
					data: 'data-id="{{id}}"',
					controller: 'util-setup-user-dashboard-format'
				},

				columns:
				[
					{
						caption: 'Username',
						name: 'usernametext',
						sortBy: true,
						defaultSort: true,
						defaultSortDirection: 'asc',
						class: 'col-9 col-md-5 myds-navigate',
						data: 'id="contact-edit-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="util-setup-user-summary"'
					},
					{
						caption: 'Status',
						name: 'statustext',
						sortBy: true,
						class: 'col-3 col-md-2 text-center'
					},
					{
						caption: 'Data Access',
						name: 'relationaldataaccesstext',
						sortBy: true,
						class: 'col-md-2 text-center d-none d-md-block'
					},
					{
						caption: 'Last Logon',
						name: 'lastlogon',
						sortBy: true,
						class: 'col-md-3 text-center text-muted d-none d-md-block'
					},
					{
						fields:
						[
							'user.contactperson.firstname',
							'user.contactperson.surname',
							'user.contactperson.guid',
							'user.contactperson.contactbusiness',
							'user.contactbusiness.guid',
							'user.contactbusiness.id',
							'contactbusinesstext',
							'contactbusiness',
							'timezonetext',
							'passwordexpiry',
							'disabled',
							'authenticationlevel',
							'authenticationdeliverytext',
							'authenticationdelivery',
							'lastlogon',
							'user.contactperson.mobile',
							'user.contactperson.email',
							'contactperson',
							'unrestrictedaccess',
							'authenticationusingaccesstoken',
							'guid',
							'relationshipmanagersecuritytype',
							'user.contactperson.contactbusiness.tradename',
							'username',
							'contactpersontext',
							'urlaccesstype',
							'urlaccesstypetext',
							'canacceptsupportissues',
							'canbeaddedtoexternalconversations',
							'canswitchintootherspaces'
						]	
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'util-setup-user-dashboard-format',
	code: function (row)
	{
		row.statustext = (row.disabled=='Y'?'Disabled':'Enabled');

		var authenticationLevels = app.get(
		{
			scope: 'util-setup-user-dashboard',
			context: 'authenticationlevels',
		});

		row.authenticationleveltext = '<em>Not Set</em>';

		if (authenticationLevels != undefined)
		{
			row.authenticationleveltext = authenticationLevels[row.authenticationlevel];
		}

		if (row.authenticationlevel != 3)
		{
			row.authenticationdeliverytext = '<span class="text-muted">Not applicable</span>'
		}
		else
		{
			if (row.authenticationdelivery == '')
			{
				row.authenticationdeliverytext = '<em>Not applicable</em>';
			}

			if (row.authenticationdelivery == 1)
			{
				row.authenticationdeliverytext = 'Token sent as email';
			}

			if (row.authenticationdelivery == 2)
			{
				row.authenticationdeliverytext = 'Token sent as SMS';
			}

			if (row.authenticationdelivery == 3)
			{
				row.authenticationdeliverytext = 'Token generated using TOTP Client (eg authy, Google Authenticator)'
			}
		}

		row.authentiationotherfactor = (row.authenticationlevel == '3'?'2nd':'')

		if (row.unrestrictedaccess == 'Y')
		{
			row.authorisation = "Unresticted access"
		}
		else
		{
			row.authorisation = "Resticted by role"
		}

		row.mobileemailshow = '';

		if (row['user.contactperson.mobile'] == '' && row['user.contactperson.email'] == '')
		{
			row.mobileemailshow = 'hidden d-none'
		}

		if (row['user.contactperson.email'] == '')
		{
			row.emailshow = 'hidden d-none'
		}

		if (row['user.contactperson.mobile'] == '')
		{
			row.mobileshow = 'hidden d-none'
		}

		row.timezonetext = _.replaceAll(row.timezonetext,  /\./, '')

		row.relationaldataaccesstext = 'All';

		if (row.relationshipmanagersecuritytype != '1')
		{
			row.relationaldataaccesstext = 'Resticted by sharing'
		}

		row.usernametext = '<div>' + row.username + '</div>' +
								'<div class="small text-muted">' + row['user.contactperson.firstname'] + ' ' + row['user.contactperson.surname'];

		var whoami = app.whoami();

		if (row['contactbusinesstext'] != whoami.thisInstanceOfMe.spaceName)
		{					
			row.usernametext = row.usernametext + ' (' + row['contactbusinesstext'] + ')';
		}

		row.usernametext = row.usernametext + '</div>';

		if (row.lastlogon == '')
		{
			row.lastlogon = 'Never logged on'
		}

		row.urlaccesstypetext = 'Any URL';

		if (row.urlaccesstype == '2')
		{
			row.urlaccesstypetext = 'Only URLs linked to this space'
		}
	}
});


app.add(
{
	name: 'util-setup-user-summary',
	code: function (param, response)
	{	
		app.show('#util-setup-user-reset-password-view', '');

		var id = app.get(
		{
			scope: 'util-setup-user-summary',
			context: 'id',
			valueDefault: ''
		});

		var data = app.find(
		{
			dataScope: 'util-setup-user-dashboard',
			dataContext: 'all',
			controller: 'util-setup-user-summary',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data = {};
			app.notify('Can not find the user.');
		}
		else
		{
			data.dataaccessclass = (data.relationaldataaccesstext=='All'?'d-none':'')
			if (data.lastlogon == '')
			{
				data.lastlogon = '<div class="text-muted">Never logged on</div>'
			}

			app.view.refresh(
			{
				scope: 'util-setup-user-summary',
				selector: '#util-setup-user-summary',
				data: data
			});

			app.invoke('util-user-summary-roles-initialise');
			app.invoke('util-user-summary-roles');
			app.invoke('util-user-summary-shares');

			app.show('#util-setup-user-summary-status-change-' + id, (data.disabled!='Y'?'Disable Access':'Enable Access'));

			app.invoke('util-messaging-conversation-account-show',
			{
				user: id,
				title: data.guid,
				accountEnabledText: 'User can join conversations.',
				accountEnableText: 'This will allow the user to join conversations.'
			});
		}
	}
});

app.add(
{
	name: 'util-user-summary-roles',
	code: function (param, response)
	{
		var user = app.get(
		{
			scope: 'util-setup-user-summary',
			valueDefault: {}
		});

		var data = app.get(
		{
			scope: 'util-setup-user-summary-roles',
			valueDefault: {}
		});

		var filters = [];
		var id = user.id;

		if (_.isUndefined(id))
		{
			id = user.uriContext;
		}

		if (!_.isUndefined(id))
		{
			filters.push(
			{	
				name: 'user',
				comparison: 'EQUAL_TO',
				value1: id
			});
		}

		var noDataText = '<div class="p-4">This user has no roles assigned to them.</div>';

		if (!_.isEmpty(data.search))
		{
			filters.push(
			{	
				name: 'roletext',
				comparison: 'TEXT_IS_LIKE',
				value1: data.search
			});

			noDataText = '<div class="p-4">No role that match this search.</div>';
		}

		app.invoke('util-view-table',
		{
			object: 'setup_user_role',
			container: 'util-setup-user-summary-roles-view',
			context: 'util-setup-user-summary-roles',
			filters: filters,
			_onComplete: 'user-edit-roles-init',
			options:
			{
				noDataText: noDataText,
				_containerController: 'user-edit-roles-edit',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				deleteConfirm:
				{
					text: 'Are you sure you want to remove this role from this user?',
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
					class: 'd-flex',
					data: 'data-id="{{id}}"'
				},
				columns:
				[
					{
						caption: 'Name',
						param: 'roletext',
						sortBy: true,
						defaultSort: true,
						class: 'col-sm-4 text-left',
						data: 'id="util-setup-user-summary-role-edit-{{id}}"'
					},
					{
						caption: 'Date assigned to user',
						param: 'createddate',
						sortBy: true,
						class: 'col-sm-6 text-center text-muted'
					},
					{
						html: '<button class="btn btn-danger btn-outline btn-sm myds-delete"' +
				   			' id="util-setup-user-summary-delete-{{id}}" data-id="{{id}}"><i class="fa fa-times"></i></button>',
						caption: '&nbsp;',
						class: 'col-sm-2 text-right'
					},
					{
						paramList:
						[
							'role'
						]
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'util-user-summary-roles-initialise',
	code: function (param, response)
	{
		var roles = app.get({scope: 'util-setup-user-roles', context: 'all'});

		if (_.isUndefined(roles))
		{
			app.invoke('util-setup-user-roles-get', {callback: 'util-user-summary-roles-initialise'});
		}
		else
		{
			var userRoles = app.get({scope: 'user-edit-roles', context: 'all'});

			roles = _.filter(roles, function (role) {return _.isUndefined(_.find(userRoles, function (userRole) {return role.id == userRole.role}))});

			app.vq.init({setDefault: true});

			app.vq.add('<button type="button" class="btn btn-white btn-sm dropdown-toggle myds-dropdown" data-toggle="dropdown"' +
			  				'id="util-setup-user-summary-roles-assign">Assign role</button><ul class="dropdown-menu">');

			_.each(roles, function (role)
			{
				app.vq.add('<li><a href="#" class="myds-click" data-id="' + role.id + '" data-controller="util-setup-user-summary-roles-assign-save" ' +
								' data-context="role">' + role.title + '</a></li>');
			});
		
			app.vq.add('</ul>');

			app.vq.render('#util-setup-user-summary-roles-assign-view');
		}
	}
});

app.add(
{
	name: 'util-setup-user-summary-roles-assign-save',
	code: function (param, response)
	{	
		var user = app.get(
		{
			scope: 'util-setup-user-summary'
		});

		if (user != undefined)
		{
			if (response == undefined)
			{
				var data =
				{
					role: param.dataContext.id,
					user: user.id
				}

				mydigitalstructure.cloud.save(
				{
					object: 'setup_user_role',
					data: data,
					callback: 'util-setup-user-summary-roles-assign-save'
				});
			}
			else
			{	
				if (response.status == 'OK')
				{
					app.invoke('util-user-summary-roles')
				}
			}
		}
	}
});

app.add(
{
	name: 'util-setup-user-summary-roles-delete-ok',
	code: function (param, response)
	{
		if (_.isUndefined(response))
		{
			if (!_.isUndefined(param.dataContext))
			{
				mydigitalstructure.cloud.delete(
				{
					object: 'setup_user_role',
					data:
					{
						id: param.dataContext.id,
					},
					callback: 'util-setup-user-summary-roles-delete-ok'
				});
			}	
		}
		else
		{
			app.invoke('util-user-summary-roles');
		}
	}
});

app.add(
{
	name: 'util-setup-user-totp',
	code: function (param, response)
	{	
		var user = app.get(
		{
			scope: 'util-setup-user-totp'
		});

		if (_.isNotSet(user))
		{
			app.notify({message: 'No user!', type: 'error'})
		}
		else
		{
			app.invoke('util-security-totp-init',
			{
				id: user.id,
				user: user,
				selector: '#util-setup-user-totp-view',
				text: '<div class="font-weight-bold mb-2">Send the TOTP details to the user.</div><div>Using a TOTP client (eg Google Authenticator, authy) the user can either enter the key manually or scan the QR code.</div>'
			});
		}
	}	
});
	

app.add(
{
	name: 'util-user-summary-shares',
	code: function (param, response)
	{
		var user = app.get(
		{
			scope: 'util-setup-user-summary',
			context: 'dataContext',
			valueDefault: {}
		});

		var data = app.get(
		{
			scope: 'util-setup-user-summary-roles',
			valueDefault: {}
		});

		var filters = [];
		var id = user.id;

		if (_.isUndefined(id))
		{
			id = user.uriContext;
		}

		if (!_.isUndefined(id))
		{
			filters.push(
			{	
				name: 'user',
				comparison: 'EQUAL_TO',
				value1: id
			});
		}

		app.invoke('util-security-share-find',
		{
			shareType: 'shared_with_me',
			sharedWithContact:
			{
				user: user.id,
				contactbusiness: user.contactbusiness
			},
			container: 'util-setup-user-summary-shares-view'
		});
	}
});

app.add(
{
	name: 'util-setup-user-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataController: 'util-setup-user-dashboard',
			dataContext: 'all',
			controller: 'util-setup-user-edit',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data = app.set(
			{
				scope: 'util-setup-user-edit-',
				value:
				{
					id: '',
					username: '',
					contactpersontext: '',
					disabled: 'Y',
					relationshipmanagersecuritytype: '3',
					unrestrictedaccess: 'N',
					authenticationusingaccesstoken: '1',
					authenticationlevel: '2'
				}
			});
		}

		app.view.refresh(
		{
			scope: 'util-setup-user-edit',
			selector: '#util-setup-user-edit',
			data: data
		});

		app.invoke('util-view-select',
		{
			container: 'util-setup-user-edit-contactperson',
			object: 'contact_person',
			fields: [{name: 'firstname'}, {name: 'surname'}],
			invokeChange: false
		});
	}	
});

app.add(
{
	name: 'util-setup-user-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'util-setup-user-edit',
			context: 'id',
			valueDefault: ''
		});

		var data = app.get(
		{
			scope: 'util-setup-user-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				passive: true,
				values: {}
			}
		});

		if (response == undefined)
		{
			if (!_.isEmpty(data.contactperson))
			{
				mydigitalstructure.cloud.search(
				{
					object: 'contact_person',
					fields: ['contactbusiness', 'email'],
					filters:
					[
						{
							field: 'id',
							value: data.contactperson
						}
					],
					callback: 'util-setup-user-edit-save'
				})
			}
			else
			{
				app.invoke('util-setup-user-edit-save-finalise')
			}
		}
		else
		{
			if (response.status == 'OK')
			{
				if (response.data.rows.length != 0)
				{
					app.set(
					{
						scope: 'util-setup-user-edit-' + id,
						context: 'contactbusiness',
						value: _.first(response.data.rows)['contactbusiness']
					});

					app.set(
					{
						scope: 'util-setup-user-edit-' + id,
						context: 'email',
						value: _.first(response.data.rows)['email']
					});

					app.invoke('util-setup-user-edit-save-finalise');
				}
			}
		}
	}
});

app.add(
{
	name: 'util-setup-user-edit-save-finalise',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'util-setup-user-edit',
			context: 'id',
			valueDefault: ''
		});

		var data = app.get(
		{
			scope: 'util-setup-user-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				passive: true,
				values:
				{
					disabled: 'Y',
					relationshipmanagersecuritytype: '3',
					unrestrictedaccess: 'N',
					authenticationusingaccesstoken: '1',
					authenticationlevel: '2'
				}
			}
		});

		if (response == undefined)
		{
			data.id = id;

			if (data.id == '')
			{
				if (_.isEmpty(data.username))
				{
					data.username = _.toLower(data.email);
				}
			}

			if (data.id == '' && _.isEmpty(data.username))
			{
				app.notify('Both the username & email can not be blank!')
			}
			else
			{
				mydigitalstructure.cloud.save(
				{
					object: 'setup_user',
					data: data,
					callback: 'util-setup-user-edit-save-finalise',
					set: {scope: 'util-setup-user-edit', data: true},
					notify: 'User has been ' + (data.id==''?'added':'updated') + '.'
				});
			}
		}
		else
		{	
			if (response.status == 'OK')
			{
				//app.refresh(
				//{
				//	dataScope: 'util-setup-user-dashboard',
				//	data: data
				//});

				//util-setup-user-summary

				app.invoke('app-navigate-to', {controller: 'util-setup-users', context: data.id});
			}
		}
	}
});

//FACTORY

app.add(
{
	name: 'util-setup-user-roles-get',
	code: function (param, response)
	{
		var roles = app.get({scope: 'util-setup-user-roles', context: 'all'});
		
		if (_.isUndefined(response))
		{
			if (!_.isUndefined(roles))
			{
				app._util.doCallBack(param);
			}
			else
			{
				mydigitalstructure.retrieve(
				{
					object: 'setup_role',
					data:
					{
						criteria:
						{
							fields:
							[
								{name: 'title'}
							]
						}
					},
					callback: 'util-setup-user-roles-get',
					callbackParam: param
				});
			}
		}
		else
		{
			app.set({scope: 'util-setup-user-roles', context: 'all', value: response.data.rows});
			app._util.doCallBack(param);
		}
	}
});	

app.add(
{
	name: 'util-setup-user-reset-password',
	code: function (param, response)
	{
		if (_.isUndefined(response))
		{
			app.show('#util-setup-user-reset-password-view', '');

			var password = app.invoke('util-setup-user-password-generate');
			app._util.param.set(param, 'password', password);

			var user = app.get(
			{
				scope: 'util-setup-user-summary'
			});

			if (_.isObject(user))
			{
				if (_.has(app.options, 'password.suffix'))
				{
					password += app.options.password.suffix
				}

				var data =
				{
					userpassword: password,
					passwordexpiry: moment().subtract(1, 'days').format("DD-MMM-YYYY"),
					id: user.id
				}

				mydigitalstructure.cloud.save(
				{
					object: 'setup_user',
					data: data,
					callback: 'util-setup-user-reset-password',
					callbackParam: param
				});
			}
		}
		else
		{
			let password = app._util.param.get(param, 'password').value;
			param.password = app.invoke('util-setup-user-password-get', {userpassword: password})

			app.show('#util-setup-user-reset-password-view',
				'<div class="mt-3">New password is <strong>' + param.password + '</strong></div>');

			app.invoke('util-on-complete', param)
		}
	}
});

app.add(
[
	{
		name: 'util-setup-user-name-get',
		code: function (param)
		{
			var username = param;

			if (_.isObject(username))
			{
				username = app._util.param.get(username, 'username').value;
			}

			if (app.options.logonSuffix != undefined)
			{	
				if (_.startsWith(username, app.options.logonSuffix))
				{
					username = _.replace(username, app.options.logonSuffix, '');
				}
			}

			return username
		}
	},
	{
		name: 'util-setup-user-name-set',
		code: function (param)
		{
			var username = param;

			if (_.isObject(username))
			{
				username = app._util.param.get(username, 'username').value;
			}

			if (app.options.logonSuffix != undefined)
			{	
				if (_.startsWith(username, app.options.logonSuffix))
				{
					username = username + app.options.logonSuffix;
				}
			}

			return username
		}
	},
	{
		name: 'util-setup-user-password-get',
		code: function (param)
		{
			var userpassword = app._util.param.get(param, 'userpassword').value;

			if (app.options.passwordSuffix != undefined)
			{	
				if (_.endsWith(password, app.options.passwordSuffix))
				{
					userpassword = _.replace(userpassword, app.options.passwordSuffix, '');
				}
			}

			return userpassword
		}
	},
	{
		name: 'util-setup-user-password-set',
		code: function (param)
		{
			var userpassword = app._util.param.get(param, 'userpassword').value;

			if (app.options.passwordSuffix != undefined)
			{	
				if (_.startsWith(username, app.options.passwordSuffix))
				{
					userpassword = username + app.options.passwordSuffix;
				}
			}

			return userpassword
		}
	},
	{
		name: 'util-setup-user-password-generate',
		code: function (param)
		{
			if (_.isSet(app.controller['util-generate-random-text']))
			{
				return app.invoke('util-generate-random-text', param)
			}
			else
			{
				var length = app._util.param.get(param, 'length', {default: 8}).value;
				var string = "abcdefghijklmnopqrstuvwxyz";
				var numeric = '0123456789';
				var punctuation = '!@#$%^&*()_+~`|}{[]\:;?><,./-=';
				var password = "";
				var character = "";
				var crunch = true;

				while (password.length < length )
				{
					entity1 = Math.ceil(string.length * Math.random()*Math.random());
					entity2 = Math.ceil(numeric.length * Math.random()*Math.random());
					entity3 = Math.ceil(punctuation.length * Math.random()*Math.random());
					hold = string.charAt( entity1 );
					hold = (entity1%2==0)?(hold.toUpperCase()):(hold);
					character += hold;
					character += numeric.charAt( entity2 );
					character += punctuation.charAt( entity3 );
					password = character;
				}

				return password;
			}
		}
	},
	{
		name: 'util-setup-user-send-welcome-email',
		code: function (param)
		{
			var password = app._util.param.get(param, 'password').value;

			if (_.isNotSet(password))
			{
				app.invoke('util-setup-user-reset-password',
				{
					onComplete: 'util-setup-user-send-welcome-email'
				})
			}
			else
			{
				var user = app.get(
				{
					scope: 'util-setup-user-summary',
					context: 'dataContext'
				});
		
				var data = 
				{
					password: password,
					username: user.username,
					firstname: user['user.contactperson.firstname'],
					sdi: user['user.contactperson.guid'],
					to: user['user.contactperson.email'],
					emailfrom: app.whoami().thisInstanceOfMe.user.email 
				}

				app.invoke('util-automation-task',
				{
					name: 'welcome-to-selfdriven-email-send',
					data: data
				});
			}
		}
	}
]);

app.add(
{
	name:'util-setup-user-shares',
	code: function (param, response)
	{
		var data = app._util.data.get(
		{
			controller: 'util-setup-user-shares',
			valueDefault: {}
		});

		var filters = [];

		if (data.type == '' || data.type == undefined)
		{
			data.type = '1'
		}

		if (data.type == 1)
		{
			if (_.isEmpty(data.search))
			{
				filters.push(
				{	
					field: 'usertext',
					comparison: 'TEXT_IS_NOT_EMPTY'
				});
			}
			else
			{
				filters.push(
				{	
					field: 'usertext',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				});
			}
		}

		if (data.type == 4)
		{
			if (_.isEmpty(data.search))
			{
				filters.push(
				{	
					field: 'usercontactbusinesstext',
					comparison: 'TEXT_IS_NOT_EMPTY'
				});
			}
			else
			{
				filters.push(
				{	
					field: 'usercontactbusinesstext',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				});
			}
		}

		if (data.type == 2)
		{
			if (_.isEmpty(data.search))
			{
				filters.push(
				{	
					field: 'contactbusinesstext',
					comparison: 'TEXT_IS_NOT_EMPTY'
				});
			}
			else
			{
				filters.push(
				{	
					field: 'contactbusinesstext',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				});
			}
		}

		if (data.type == 3)
		{
			if (_.isEmpty(data.search))
			{
				filters.push(
				{	
					field: 'contactpersontext',
					comparison: 'TEXT_IS_NOT_EMPTY'
				});
			}
			else
			{
				filters.push(
				{	
					field: 'contactpersontext',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				});
			}
		}

		app.invoke('util-view-table',
		{
			object: 'setup_user_data_access',
			controller: 'util-setup-user-shares',
			container: 'util-setup-user-shares-view',
			context: 'util-setup-user-shares',
			onComplete: undefined,
			filters: filters,
			customOptions: undefined,
			options:
			{
				noDataText: '<div class="p-4">There is no sharing that matches this search.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				deleteConfirm:
				{
					text: 'Are you sure you want to remove this data sharing?',
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
					class: 'd-flex',
					data: 'data-id="{{id}}"',
					controller: 'util-setup-user-shares-format'
				},

				columns:
				[
					{
						caption: 'User / User Organisation',
						name: 'userinfo',
						sortBy: true,
						defaultSort: true,
						defaultSortDirection: 'asc',
						class: 'col-sm-4 myds-navigate',
						data: 'id="contact-edit-{{id}}" data-context="{{id}}" data-id="{{id}}" data-controller="util-setup-user-share-summary"'
					},
					{
						caption: 'Has access to data for',
						name: 'sharedbytext',
						sortBy: true,
						defaultSort: true,
						defaultSortDirection: 'asc',
						class: 'col-sm-3 myds-navigate',
						data: 'id="contact-edit-{{id}}" data-contact-business="{{contactbusiness}}" data-contact-person="{{contactperson}}" data-context="{{id}}" data-id="{{id}}" data-controller="util-setup-user-share-summary"'
					},
					{
						caption: 'Notes',
						field: 'notes',
						sortBy: true,
						class: 'col-sm-4 text-muted small'
					},
					{
						html: '<button class="btn btn-danger btn-outline btn-sm myds-delete"' +
				   			' id="util-setup-user-shares-delete-{{id}}" data-id="{{guid}}"><i class="fa fa-trash"></i></button>',
				   caption: '&nbsp;',
						class: 'col-sm-1 text-right'
					},
					{
						fields:
						[
							'contactbusiness', 'contactbusinesstext',
							'contactperson', 'contactpersontext',
							'user', 'usertext',
							'access.user.contactperson.firstname',
							'access.user.contactperson.surname',
							'access.user.contactperson.email',
							'usercontactbusiness', 'usercontactbusinesstext',
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
	name: 'util-setup-user-shares-format',
	code: function (row)
	{
		row.sharedbytext = '';
		
		if (row.contactbusinesstext != '')
		{
			row.sharedbytext = '<div>' + row.contactbusinesstext + '</div>';
			if (row.contactpersontext != '')
			{
				row.sharedbytext = row.sharedbytext + 
					'<div class="text-muted">' + row.contactpersontext + '</div>' +
							'<div class="text-muted small">Contact Person</div>';
			}
			else
			{
				row.sharedbytext = row.sharedbytext + 
					'<div class="text-muted small">Contact Business</div>';
			}
		}
		else if (row.contactpersontext != '')
		{
			row.sharedbytext = '<div>' + row.contactpersontext + '</div>' +
										'<div class="text-muted small">Contact Person</div>';
		}

		var username = row['usertext'].toLowerCase();

		if (username != '')
		{
			row.userinfo = '<div>' + username + '</div>' +
							'<div class="text-muted small">' +
								row['access.user.contactperson.firstname'] +
								' ' + row['access.user.contactperson.surname'] +
							'</div>';
		}
		else
		{
			row.userinfo = '<div>' + row.usercontactbusinesstext + '</div>';
		}
	}
});

app.add(
{
	name: 'util-setup-user-shares-delete-ok',
	code: function (param, response)
	{
		if (!_.isUndefined(param.dataContext))
		{
			app.invoke('util-security-share-remove',
			{
				shareGUID: param.dataContext.id,
				onCompleteWhenCan: 'util-setup-user-shares-delete-ok-complete'
			});
		}
	}
});

app.add(
{
	name: 'util-setup-user-shares-delete-ok-complete',
	code: function (param)
	{
		app.notify({message: 'Share removed'});
		app.invoke('util-setup-user-shares');
	}
});

app.add(
{
	name: 'util-setup-user-share-edit',
	code: function (row)
	{
		var data = 
		{
			contactbusinesstext: ''
		}

		app.view.refresh(
		{
			scope: 'util-setup-user-share-edit',
			selector: '#util-setup-user-share-edit',
			data: data,
			resetScope: false
		});

		app.invoke('util-view-select',
		{
			container: 'util-setup-user-share-edit-user',
			object: 'setup_user',
			fields: [{name: 'username'}, {name: 'guid', hidden: true}],
			idField: 'guid'
		});

		app.invoke('util-view-select',
		{
			container: 'util-setup-user-share-edit-usercontactbusiness',
			object: 'contact_business',
			fields: [{name: 'tradename'}]
		});

		app.invoke('util-view-select',
		{
			container: 'util-setup-user-share-edit-contactbusiness',
			object: 'contact_business',
			fields: [{name: 'tradename'}]
		});

		app.invoke('util-view-select',
		{
			container: 'util-setup-user-share-edit-contactperson',
			object: 'contact_person',
			fields: [{name: 'firstname'}, {name: 'surname'}]
		});
	}
});

app.add(
{
	name: 'util-setup-user-share-edit-save',
	code: function (param)
	{
		var data = app.get({scope: 'util-setup-user-share-edit-', clean: true, valueDefault: {}});

		app.invoke('util-security-share-add',
		{
			sharedByContact: {contactbusiness: data.contactbusiness, contactperson: data.contactperson},
			shareWithGUID: data.userguid,
			shareWithUsersContactBusiness: (data.samecontactbusiness == 'Y'),
			shareWithContactBusiness: data.usercontactbusiness,
			onCompleteWhenCan: 'util-setup-user-share-edit-save-complete'
		});
	}
});

app.add(
{
	name: 'util-setup-user-share-edit-save-complete',
	code: function (param)
	{
		app.notify({message: 'Share added'});
		app.invoke('app-navigate-to', {scope: 'util-setup-user-shares'});
	}
});