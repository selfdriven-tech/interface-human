"use strict";

$(function()
{
	if (app.options.httpsOnly && window.location.protocol == 'http:')
	{
		window.location.href = window.location.href.replace('http', 'https')
	}
	else
	{
		mydigitalstructure._util.controller.invoke(
		{
			name: 'app-init'
		})
	}	
});

var app =
{
	build:
	{
		name: 'selfdriven',
		version: '1.1.8',
		description: "selfdriven",
		author: 'Mark Byers',
		repository:
		{
		    type: 'git',
		    url: 'https://github.com/ibcom/apps.git'
		},
		docs:
		[],
		dependancies:
		{
			mydigitalstructure: '3.4.0',
			lodash: '4.17.15',
			moment: '*'
		}
	},

	controller: mydigitalstructure._util.controller.code
};

app.options = 
{
	httpsOnly: true,
	container: '#main',
	assistWithBehavior: false,
	objects: false,
	registerDocument: undefined,
	authURIIsHome: true,
	authURI: '/auth',
	authURIContext: '#auth',
	spinner: '/site/1901/1901.working.gif',
	working: '<div class="m-a-md text-center"><img src="/site/1901/1901.working.gif" style="height:25px;"></div>',
	rows: 50,
	namespace: 'app',
	styles:
	{
		button: 'btn btn-primary btn-outline btn-sm',
		toast:
		{
			class: 'info',
			showDismiss: true,
			time: 3000,
			annimation: true
		},
		datePicker:
		{
			icons:
			{
				time: 'far fa-clock',
				date: 'far fa-calendar-alt',
				up: 'far fa-arrow-up',
				down: 'far fa-arrow-down',
				previous: 'fas fa-chevron-left',
				next: 'fas fa-chevron-right',
				today: 'far fa-calendar-check-o',
				clear: 'far fa-trash',
				close: 'far fa-times'
			},
			options:
			{
				debug: false
			}
		}
	},
	startURI: '/app-{{role}}',
	startURIContext: '#{{role}}-dashboard',
	start:
	[
		{
			default: true,
			uri: '/app-{{role}}',
			uriContext: '#{{role}}-dashboard'
		},
		{
			urlContains: 'levelup',
			uri: '/app-level-up',
			uriContext: '#level-up-dashboard',
		},
		{
			urlContains: 'nextsteps',
			uri: '/app-next-steps',
			uriContext: '#next-steps-dashboard',
		},
		{
			urlContains: 'projects',
			uri: '/app-projects',
			uriContext: '#projects-dashboard',
		},
		{
			urlContains: 'supporter',
			uri: '/app-supporter',
			uriContext: '#supporter-dashboard',
		},
		{
			urlContains: 'you',
			uri: '/app-you',
			uriContext: '#you-dashboard',
		}
	],
	password:
	{
		minimumLength: 6
	},
	routing:
	{
		toURI:
		[
			{
				uri: '/app',
				uriContext:
				[
					'#dashboard'
				],
				onlyApplyIfURIDataContextSet: false,
				applyEvenIfReload: true
			}
		],

		toStart:
		[
			{
				uri: '*',
				uriContext:
				[
					'*'
				]
			}
		]	
	}
}

app._util = mydigitalstructure._util;

app.invoke = app._util.controller.invoke;
app.add = app._util.controller.add;
app.view = app._util.view;
app.find = app._util.data.find;
app.set = app._util.data.set;
app.get = app._util.data.get;
app.refresh = app._util.view.refresh;
app.vq = app._util.view.queue;
app.show = app.vq.show;

app.views =
[
	{
		uri: '/auth',
		controller: 'auth'
	}
]

app.add(
{
	name: 'app-init-set-uri',
	code: function (param)
	{
		var role = '';

		if (_.has(entityos, '_scope.user.roles.rows'))
		{
			if (entityos._scope.user.roles.rows.length != 0)
			{
				role = _.kebabCase(_.lowerCase(_.first(mydigitalstructure._scope.user.roles.rows).title));
				app.options.startURIContext = '#' + role + '-dashboard';
				app.options.startURI = '/app-' + role;
			}
		};

		app.set(
		{
			controller: 'util-setup',
			context: 'userRole',
			value: role
		});

		if (_.has(app, 'options.start'))
		{
			var locationHost = window.location.host;
			var start = _.find(app.options.start, function (_start)
			{
				return _.includes(locationHost, _start.urlContains)
			});

			if (start != undefined)
			{
				app.options.startURI = start.uri;
				app.options.startURIContext = start.uriContext;
			}
		}

		if (param != undefined)
		{
			param.uri = app.options.startURI;
			param.uriContext = app.options.startURIContext;
		}	
	}
});
	
app.add(
[
	{
		name: 'app-init',
		code: function ()
		{	
			if (mydigitalstructure.compatible)
			{
				app.invoke('app-init-set-uri');
				
				mydigitalstructure.init(
				{
					viewStart: app.controller['app-start'],
					viewUpdate: app.controller['app-update'],
					viewNavigation: app.controller['app-navigation'],
					viewStarted: app.controller['app-started'],
					options: app.options,
					views: app.views,
					viewAssemblySupport: true,
					build: app.build
				});
			}
			else
			{
				window.location.href = '/compatiblilty'
			}
		}
	},
	{
		name: 'app-start',
		code: function (param)
		{
			if (!_.isEmpty(param))
			{
				delete param.logon;
				delete param.password;

				app._util.data.set(
				{
					controller: 'app-start',
					context: '_param',
					value: param
				});
			}
			else
			{
				param = app._util.data.get(
				{
					controller: 'app-start',
					context: '_param'
				});
			}
			
			if (param.isLoggedOn == false)
			{
				mydigitalstructure._scope.user = undefined;
				app.controller['app-router'](param);
			}
			else
			{	
				if (param.passwordstatus == 'EXPIRED' && $('#auth-password').length != 0)
				{
					$('#auth-password').modal('show')
				}
				else
				{
					app.invoke('app-init-set-uri', param);

					/*var role = '';

					if (mydigitalstructure._scope.user.roles.rows.length != 0)
					{
						role = _.kebabCase(_.lowerCase(_.first(mydigitalstructure._scope.user.roles.rows).title));
						
						param.uriContext = '#' + role + '-dashboard';
						param.uri = '/app-' + role;
						mydigitalstructure._scope.app.options.startURIContext = '#' + role + '-dashboard';
						mydigitalstructure._scope.app.options.startURI = '/app-' + role;
					}

					app.set(
					{
						controller: 'util-setup',
						context: 'userRole',
						value: role
					});*/
					
					app.controller['app-router'](param);

					$('.myds-logon-first-name').html(mydigitalstructure._scope.user.firstname);
					$('.myds-logon-surname').html(mydigitalstructure._scope.user.surname);
					$('.myds-logon-name').html(mydigitalstructure._scope.user.userlogonname);
					$('.myds-logon-space').html(mydigitalstructure._scope.user.contactbusinesstext);

					app.invoke('app-navigation-side');
				}	
			}	
		}
	},
	{
		name: 'app-started',
		code: function (param)
		{
			param = param || {};
			app._util.notify = app.controller['app-notify'];
			param.onCompleteWhenCan = 'app-update';
			app.invoke('util-setup', param);
		}
	},
	{
		name: 'app-update',
		code:	function (data)
		{
			if (data)
			{
				if (data.from == 'myds-logon-init')
				{
					if (data.status == 'start')
					{	
						$('#app-auth-message').html('');
						$('#myds-logoncode-view').addClass('hidden d-none');
					}

					if (data.status == 'need-code')
					{	
						$('#myds-logoncode-view').removeClass('hidden d-none');
						$('#app-auth-message').html('<div class="mt-3">A code has been sent to you via ' + data.message + '.</div>');
						$('#myds-logoncode').focus();
					}

					if (data.status == 'need-totp-code')
					{	
						var logonTOTPName = 'your TOTP client (eg Google Authenticator)';

						if (_.has(mydigitalstructure.options, 'logonTOTP'))
						{
							if (mydigitalstructure.options.logonTOTP.name != undefined)
							{
								logonTOTPName = mydigitalstructure.options.logonTOTP.name;
							}
						}

						$('#myds-logoncode-view').removeClass('d-none hidden');
						$('#app-auth-message').html('<div class="mt-3">Please enter the code from ' + logonTOTPName + ' and then press Logon again.</div>');
						$('#myds-logoncode').focus();
					}
				}

				if (data.from == 'myds-logon-send')
				{
					if (data.status == 'error')
					{	
						$('#myds-logon-status').html('<div class="mt-3">' + data.message + '</div>');
					}
					else
					{
						$('#myds-logon-status').html('');
					}	
				}

				if (data.from == 'myds-core')
				{
					if (data.status == 'error')
					{	
						if (data.message != 'invalid passwordhash' && data.message != 'INVALID_LOGON')
						{
							app.controller['app-notify'](
							{
								message: data.message,
								class: 'danger'
							});
						}
					}

					if (data.status == 'notify')
					{	
						app.controller['app-notify'](
						{
							message: data.message
						});
					}
				}

				if (data.from == 'myds-auth')
				{
					if (data.status == 'error')
					{	
						var options = mydigitalstructure._scope.app.options;
						options.notify = {message: 'You need to log on again.', class: 'danger'};
						mydigitalstructure._util.init(mydigitalstructure._scope.app)
					}
				}

				if (data.from == 'myds-send')
				{
					$('#app-working')[(data.status=='start'?'remove':'add') + 'Class']('hidden d-none');
				}

				if (data.from == 'myds-init')
				{
					if (data.status == 'uri-changed')
					{	
						mydigitalstructure._util.controller.invoke(
						{
							name: 'app-route-to'
						},
						{
							uri: mydigitalstructure._scope.app.uri,
							uriContext: data.message
						});

						window.scrollTo(0, 0);
					}	
				}

				if (data.from == 'myds-logon-send')
				{
					if (data.status == 'error')
					{
						$('#app-auth-message').html('<div class="mt-3">' + data.message + '</div>');
					}

					if (data.status == 'start')
					{
						$('#app-auth-message').html('<span class="spinner mt-3"><i class="icon-spin icon-refresh"></i></span>');
					}
				}

				if (data.from == 'myds-view-access')
				{
					if (data.status == 'context-changed')
					{
						$(data.message.hide.join(',')).addClass('hidden d-none');
						$(data.message.show.join(',')).removeClass('hidden d-none');
					}
				}
			}
		}
	},
	{
		name: 'app-navigation',
		code:	function (param)
		{
			if (mydigitalstructure._scope.user != undefined)
			{
				app.invoke('app-notifications');
			}

			app.invoke('util-view-menu-set-active', param);
		}
	},
	{
		name: 'app-navigation-side',
		code:	function ()
		{
			if (mydigitalstructure._scope.user != undefined)
			{
				//show side menu based on user role.
				var role = '';

				if (mydigitalstructure._scope.user.roles.rows.length != 0)
				{
					role = _.kebabCase(_.lowerCase(_.first(mydigitalstructure._scope.user.roles.rows).title));
				}

				app.set(
				{
					controller: 'util-setup',
					context: 'userRole',
					value: role
				});

				//$('#side-menu-view-' + role).removeClass('d-none');

				$('.metismenu').find('li').not($(this).parents('li')).removeClass('active');
				$('.metismenu [href="' + location.pathname  + location.hash + '"]').parent().addClass('active');
				$('.metismenu [href="' + location.pathname  + location.hash + '"]').parent().siblings().find('ul').removeClass('in');
			}
		}
	}
]);

