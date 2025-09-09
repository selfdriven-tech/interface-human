app.add(
[
	{
		name: 'auth-reset',
		code: function (param)
		{
			$('#auth-reset-2').addClass('hidden d-none');
			$('#auth-reset-1').removeClass('hidden d-none');

			$('#auth-reset-username').val($('#myds-logonname').val());
			app._util.data.set(
			{
				controller: 'auth-reset-1',
				context: 'username',
				value: $('#myds-logonname').val()
			});

			app.controller['auth-reset-1']();
		}
	},	
	{
		name: 'auth-reset-1',
		code: function (param)
		{
			var validated = false;

			var data = app._util.data.get(
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

				var site = mydigitalstructure._scope.app.site;
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
						app.controller['auth-reset-send'](param, response)
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

app.add(
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
					app._util.notify(
					{
						message: 'New passwords do not match!',
						class: 'danger'
					});
				}
				else if (newpassword == '' || newpasswordconfirm == '' || existingpassword == '')
				{
					app._util.notify(
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
							site: mydigitalstructure._scope.app.site,
							currentpassword: existingpassword,
							newpassword: newpassword
						},
						callback: app.controller['auth-password-change']
					});
				}
			}
			else
			{		
				if (response.status == 'ER')
				{
					app._util.notify(
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
			var dataContext = app._util.data.get(
			{
				controller: 'auth-password',
				context: 'dataContext'
			});

			if (dataContext != undefined)
			{
				if (dataContext.source == 'expired')
				{
					//app.invoke('app-route-to', {uri: '', uriContext: ''})
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

app.add(
[
	{
		name: 'auth-trust',
		code: function (param, response)
		{
			$('.auth-trust').addClass('hidden');
			
			if (mydigitalstructure._scope.user.authenticationusingaccesstoken == 1 || mydigitalstructure._scope.user.authenticationusingaccesstoken == 3
					|| mydigitalstructure._scope.user.authenticationusingaccesstoken == undefined)
			{
				app.refresh(
				{
					show: '#auth-trust-ER',
					hide: '#auth-trust-OK'
				});
			}
			else
			{
				app.refresh(
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

					var localAccessToken = app.invoke('util-local-cache-search',
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
						app.refresh(
						{
							show: '#auth-trust-1-remove',
							hide: '#auth-trust-1-set'
						});
					}
					else
					{
						app.refresh(
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
					app.invoke('auth-trust-set-save', {}, {access_token: accessToken, status: 'OK'})
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

					app.invoke('util-local-cache-save',
					{
						persist: true,
						key: 'myds.access-token-' + window.btoa(mydigitalstructure._scope.user.userlogonname),
						data: accessToken
					});

					app.invoke('auth-trust', {}, {access_token: accessToken})
				}
				else
				{
					app.refresh(
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
			app.invoke('util-local-cache-remove',
			{
				persist: true,
				key: 'myds.access-token-' + window.btoa(mydigitalstructure._scope.user.userlogonname)
			});

			app.invoke('auth-trust', {}, {access_token: undefined})
		}
	}
]);

var googleOnSignIn = mydigitalstructure._util.security.trusted.google.onSignIn;
var googleSignOut = mydigitalstructure._util.security.trusted.google.signOut;
