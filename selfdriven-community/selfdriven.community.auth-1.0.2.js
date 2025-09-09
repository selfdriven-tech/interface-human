import { EntityOS } from '/site/2186/entityos.module.class-1.0.0.js';
const eos = new EntityOS();

eos.add(
[
	{
		name: 'auth-reset',
		code: function (param)
		{
			$('#auth-reset-2').addClass('hidden d-none');
			$('#auth-reset-1').removeClass('hidden d-none');

			$('#auth-reset-username').val($('#myds-logonname').val());
			eos._util.data.set(
			{
				controller: 'auth-reset-1',
				context: 'username',
				value: $('#myds-logonname').val()
			});

			eos.controller['auth-reset-1']();
		}
	},	
	{
		name: 'auth-reset-1',
		code: function (param)
		{
			var validated = false;

			var data = eos._util.data.get(
			{
				controller: 'auth-reset-1'
			});

			if (data)
			{
				validated = true;
				validated = validated && !_.isEmpty(data.username);
			}

			$('#auth-reset-send:visible')[(validated?'remove':'add') + 'Class']('disabled');
		}
	},
	{
		name: 'auth-reset-send',
		code: function (param, response)
		{
			if (_.isUndefined(response))
			{
				$('#auth-reset-1').addClass('hidden d-none');
				$('#auth-reset-2').removeClass('hidden d-none');

				var username = $('#auth-reset-username').val();

				var site = mydigitalstructure._scope.eos.site;
				if (site == undefined)
				{
					site = 2068
				}

				var data =
				{
					document: '184253',
					logon: username,
					template_logon: username,
					expirepassword: 'Y',
					site: site
				}

				$.ajax(
				{
					type: 'POST',
					url: '/rpc/site/?method=SITE_SEND_PASSWORD',
					data: data,
					dataType: 'json',
					global: false,
					success: function(response)
					{
						eos.controller['auth-reset-send'](param, response)
					}
				});	
			}
			else
			{	
				$('#auth-reset-1').addClass('hidden d-none');
				$('#auth-reset-2').removeClass('hidden d-none');
			}
		}
	}
]);

eos.add(
[
	{
		name: 'auth-password',
		code: function (param, response)
		{
			$('.auth-password').addClass('hidden d-none');
			$('#auth-password-1').removeClass('hidden d-none');
		}
	},
	{
		name: 'auth-password-change',
		code: function (param, response)
		{
			if (response == undefined)
			{
				var existingpassword = $('#auth-password-existing').val();
				var newpassword = $('#auth-password-new').val();
				var newpasswordconfirm = $('#auth-password-new-confirm').val();

				if (newpassword != newpasswordconfirm)
				{	
					eos._util.notify(
					{
						message: 'New passwords do not match!',
						class: 'danger'
					});
				}
				else if (newpassword == '' || newpasswordconfirm == '' || existingpassword == '')
				{
					eos._util.notify(
					{
						message: 'Can not have a blank password.',
						class: 'danger'
					});
				}
				else
				{
					mydigitalstructure.cloud.invoke(
					{
						method: 'site_user_password_manage',
						data:
						{
							expiredays: 3650,
							site: mydigitalstructure._scope.eos.site,
							currentpassword: existingpassword,
							newpassword: newpassword
						},
						callback: eos.controller['auth-password-change']
					});
				}
			}
			else
			{		
				if (response.status == 'ER')
				{
					eos._util.notify(
					{
						message: 'Existing password is not correct.',
						class: 'danger'
					});
				}
				else
				{
					$('#auth-password-1').addClass('hidden d-none');
					$('#auth-password-2').removeClass('hidden d-none');
				}
			}
		}
	},	
	{
		name: 'auth-password-final',
		code: function (param, response)
		{
			var dataContext = eos._util.data.get(
			{
				controller: 'auth-password',
				context: 'dataContext'
			});

			if (dataContext != undefined)
			{
				if (dataContext.source == 'expired')
				{
					//eos.invoke('app-route-to', {uri: '', uriContext: ''})
					window.location.href = '/';
				}
			}
			else
			{
				$('#auth-password').modal('close');
			}
		}
	}
]);

eos.add(
[
	{
		name: 'auth-trust',
		code: function (param, response)
		{
			$('.auth-trust').addClass('hidden');
			
			if (mydigitalstructure._scope.user.authenticationusingaccesstoken == 1 || mydigitalstructure._scope.user.authenticationusingaccesstoken == 3
					|| mydigitalstructure._scope.user.authenticationusingaccesstoken == undefined)
			{
				eos.refresh(
				{
					show: '#auth-trust-ER',
					hide: '#auth-trust-OK'
				});
			}
			else
			{
				eos.refresh(
				{
					show: '#auth-trust-OK',
					hide: '#auth-trust-ER'
				});

				if (_.isUndefined(response))
				{
					mydigitalstructure.retrieve(
					{
						object: 'core_secure_token',
						callback: 'auth-trust'
					})
				}
				else
				{
					var accessToken = response.access_token;

					var localAccessToken = eos.invoke('util-local-cache-search',
					{
						persist: true,
						key: 'myds.access-token-' + window.btoa(mydigitalstructure._scope.user.userlogonname)
					});

					var trustSet = false;

					if (accessToken != undefined && localAccessToken != undefined)
					{
						trustSet = true;	
					}

					if (trustSet)
					{
						eos.refresh(
						{
							show: '#auth-trust-1-remove',
							hide: '#auth-trust-1-set'
						});
					}
					else
					{
						eos.refresh(
						{
							show: '#auth-trust-1-set',
							hide: '#auth-trust-1-remove'
						});
					}
				}
			}
		}
	},
	{
		name: 'auth-trust-set',
		code: function (param, response)
		{
			if (_.isUndefined(response))
			{
				mydigitalstructure.retrieve(
				{
					object: 'core_secure_token',
					callback: 'auth-trust-set'
				})
			}
			else
			{
				var accessToken = response.access_token;

				if (accessToken == undefined)
				{
					mydigitalstructure.create(
					{
						object: 'core_secure_token',
						callback: 'auth-trust-set-save',
						callbackIncludeResponse: true
					})
				}
				else
				{
					eos.invoke('auth-trust-set-save', {}, {access_token: accessToken, status: 'OK'})
				}
			}
		}
	},
	{
		name: 'auth-trust-set-save',
		code: function (param, response)
		{
			if (!_.isUndefined(response))
			{
				if (response.status == 'OK')
				{
					var accessToken = response.access_token;

					eos.invoke('util-local-cache-save',
					{
						persist: true,
						key: 'myds.access-token-' + window.btoa(mydigitalstructure._scope.user.userlogonname),
						data: accessToken
					});

					eos.invoke('auth-trust', {}, {access_token: accessToken})
				}
				else
				{
					eos.refresh(
					{
						show: '#auth-trust-ER',
						hide: '#auth-trust-OK'
					});
				}
			}
		}
	},	
	{
		name: 'auth-trust-remove',
		code: function (param, response)
		{
			eos.invoke('util-local-cache-remove',
			{
				persist: true,
				key: 'myds.access-token-' + window.btoa(entityos._scope.user.userlogonname)
			});

			eos.invoke('auth-trust', {}, {access_token: undefined})
		}
	}
]);

$(function()
{
	if (window.location.protocol == 'http:')
	{
		window.location.href = window.location.href.replace('http', 'https')
	}
	else
	{
		console.log('init');

		entityos.init(
		{
			viewStart: app.controller['app-start'],
			viewUpdate: app.controller['app-update'],
			viewStarted: app.controller['app-started'],
			options: {}
		});
	}	
});

$(document).on('visibilitychange', function (event)
{
	if (event.target.visibilityState == 'visible')
	{
		//eos.invoke('util-cloud-check')
	} 
});