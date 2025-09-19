"use strict";

$(function()
{
	if (app.options.httpsOnly && window.location.protocol == 'http:')
	{
		window.location.href = window.location.href.replace('http', 'https')
	}
	else
	{
		entityos._util.controller.invoke(
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
		version: '3.0.0',
		description: "selfdriven",
		author: 'selfdriven Lab (Mark Byers)',
		repository:
		{
		    type: 'git',
		    url: 'https://github.com/selfdriven-foundation/tech.git'
		},
		docs:
		[],
		dependancies:
		{
			entityos: '3.4.0',
			lodash: '4.17.15',
			moment: '*'
		}
	},

	controller: entityos._util.controller.code
};

app.options = 
{
	httpsOnly: true,
	container: '#main',
	assistWithBehavior: false,
	objects: false,
	registerDocument: undefined,
	startURI: '/app',
	startURIContext: '#dashboard',
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

app._util = entityos._util;

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
[
	{
		name: 'app-init',
		code: function ()
		{	
			if (entityos.compatible)
			{
				entityos.init(
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
		name: 'app-init-trusted',
		code: function ()
		{	
			const webAuthnCredentialID = app.invoke('util-local-cache-search',
			{
				persist: true,
				key: 'entityos.webauthn.passkey.credential.id'
			});

			if (webAuthnCredentialID != undefined)
			{
				$('#app-auth-trusted-view').html('<a class="entityos-click mt-4 text-secondary" data-controller="util-identity-webauthn-passkey-auth-options" data-spinner>Log in using your Passkey</a>');
			}
		}
	},
	{
		name: 'app-start',
		code: function (param, response)
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
				app.invoke('app-init-trusted');
				entityos._scope.user = undefined;
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
					var role = '';

					if (_.includes(window.location.host, 'levelup'))
					{
						param.uriContext = '#levelup-dashboard';
						param.uri = '/app-level-up';
						entityos._scope.app.options.startURIContext = '#level-up-dashboard';
						entityos._scope.app.options.startURI = '/app-level-up';
					}
					else if (_.includes(window.location.host, 'studio'))
					{
						param.uriContext = '#studio-dashboard';
						param.uri = '/app-studio';
						entityos._scope.app.options.startURIContext = '#studio-dashboard';
						entityos._scope.app.options.startURI = '/app-studio';
					}
					else if (entityos._scope.user.roles.rows.length != 0)
					{
						role = _.kebabCase(_.lowerCase(_.first(entityos._scope.user.roles.rows).title));
						
						param.uriContext = '#' + role + '-dashboard';
						param.uri = '/app-' + role;
						entityos._scope.app.options.startURIContext = '#' + role + '-dashboard';
						entityos._scope.app.options.startURI = '/app-' + role;
					}

					app.set(
					{
						controller: 'util-setup',
						context: 'userRole',
						value: role
					});
					
					app.controller['app-router'](param);

					$('.myds-logon-first-name').html(entityos._scope.user.firstname);
					$('.myds-logon-surname').html(entityos._scope.user.surname);
					$('.myds-logon-name').html(entityos._scope.user.userlogonname);
					$('.myds-logon-space').html(entityos._scope.user.contactbusinesstext);

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
						$('#app-auth-message').html('A code has been sent to you via ' + data.message + '.');
						$('#myds-logoncode').focus();
					}

					if (data.status == 'need-totp-code')
					{	
						var logonTOTPName = 'your TOTP client (eg Google Authenticator)';

						if (_.has(entityos.options, 'logonTOTP'))
						{
							if (entityos.options.logonTOTP.name != undefined)
							{
								logonTOTPName = entityos.options.logonTOTP.name;
							}
						}

						$('#myds-logoncode-view').removeClass('d-none hidden');
						$('#app-auth-message').html('Please enter the code from ' + logonTOTPName + ' and then press Logon again.');
						$('#myds-logoncode').focus();
					}
				}

				if (data.from == 'myds-logon-send')
				{
					if (data.status == 'error')
					{	
						$('#myds-logon-status').html(data.message)
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
						var options = entityos._scope.app.options;
						options.notify = {message: 'You need to log on again.', class: 'danger'};
						entityos._util.init(entityos._scope.app)
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
						entityos._util.controller.invoke(
						{
							name: 'app-route-to'
						},
						{
							uri: entityos._scope.app.uri,
							uriContext: data.message
						});

						window.scrollTo(0, 0);
					}	
				}

				if (data.from == 'myds-logon-send')
				{
					if (data.status == 'error')
					{
						$('#app-auth-message').html(data.message);
					}

					if (data.status == 'start')
					{
						$('#app-auth-message').html('<span class="spinner"><i class="icon-spin icon-refresh"></i></span>');
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
			if (entityos._scope.user != undefined)
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
			if (entityos._scope.user != undefined)
			{
				//show side menu based on user role.
				var role = '';

				if (entityos._scope.user.roles.rows.length != 0)
				{
					role = _.kebabCase(_.lowerCase(_.first(entityos._scope.user.roles.rows).title));
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

