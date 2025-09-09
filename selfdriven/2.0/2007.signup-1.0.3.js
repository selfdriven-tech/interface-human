var app =
{
	build:
	{
		name: 'selfdriven-sign-up',
		version: '1.0.1',
		description: "selfdriven Sign Up",
		prefix: 'selfdriven-sign-up',
		author: 'selfdriven Foundation',
		repository:
		{
			type: 'git',
			url: 'https://github.com/selfdriven-foundation'
		},
		docs:
			[
				''
			],
		dependancies:
		{
			mydigitalstructure: '3.4.0',
			lodash: '4.17.15',
			moment: '*'
		},
		help:
		{
			user: 'https://selfdriven.foundation/connect'
		},
		options:
		{
			auth:
				[
					{
						uris:
						[
							'signup-lab.selfdriven.cloud'
						],
						signup: true,
						logonSuffix: '-selfdriven',
						caption: '[lab]',
						note: 'For app building',
						site: 2172,
						signUpRoles:
						{
							learner: 199,
							learningPartner: 255,
							communityFacilitator: 256
						},
						personGroups:
						{
							learner: 7673,
							learningPartner: 7672,
							communityFacilitator: 8039
						},
						memberships:
						{
							learner: 364,
							learningPartner: 364,
							communityFacilitator: 364
						},
						documents:
						{
							terms: 191379,
							signUpEmail: 191380
						},
						contactBusiness:
						{
							guid: 'cb7c2b2f-238d-4058-82a7-b2543a44cd72d'
						}
					},
					{
						uris:
							[
								'signup-next.selfdriven.cloud',
								'signup-next.slfdrvn.app',
								'signup-next.slfdrvn.io'
							],
						signup: true,
						caption: '[next]',
						note: 'Next version (Production)',
						site: 2173,
						signUpRoles:
						{
							learner: 261,
							learningPartner: 262,
							communityFacilitator: 260
						},
						personGroups:
						{
							learner: 8052,
							learningPartner: 8053,
							communityFacilitator: 8054
						},
						memberships:
						{
							learner: 365,
							learningPartner: 365,
							communityFacilitator: 365
						},
						documents:
						{	
							terms: 191384,
							signUpEmail: 191385
						},
						contactBusiness:
						{
							guid: 'bce5418c-376c-4a7c-8520-88bfb23584d1'
						}
					},
					{
						uris:
							[
								'signup.selfdriven.cloud',
								'signup.slfdrvn.app',
								'signup.slfdrvn.io'
							],
						signup: false,
						caption: '',
						note: 'Production',
						site: 2121,
						signUpRoles:
						{
							learner: 261,
							learningPartner: 262,
							communityFacilitator: 260
						},
						personGroups:
						{
							learner: 8052,
							learningPartner: 8053,
							communityFacilitator: 8054
						},
						memberships:
						{
							learner: 365,
							learningPartner: 365,
							communityFacilitator: 365
						},
						documents:
						{	
							terms: 191388,
							signUpEmail: 191387
						},
						contactBusiness:
						{
							guid: 'bce5418c-376c-4a7c-8520-88bfb23584d1'
						}

					}
				]
		}
	},

	controller: entityos._util.controller.code,
	data: entityos._scope.data
};

_.set(app, '.data.auth.context', window.location.hash.replace('#', ''));

entityos._util.controller.add(
{
	name: 'auth-get-auth-options',
	code: function (param) {
		var authOptions = app.build.options.auth;
		var uri = window.location.hostname;

		var authOption = _.find(authOptions, function (authOption) {
			return (_.includes(authOption.uris, uri))
		});

		if (authOption == undefined)
		{
			authOption = {}
		}

		return authOption
	}
});

entityos._util.controller.add(
[
	{
		name: 'auth-register',
		code: function (param) {
			entityos._util.data.clear(
				{
					controller: 'auth-register-1'
				});

			$('.myds-view-auth-register').addClass('d-none');
			$('#auth-register-view').carousel(0);
		}
	},
	{
		name: 'auth-register-1',
		code: function (param) {
			var sourceType = entityos._util.param.get(param, '_type').value;

			var data = entityos._util.data.get(
			{
				scope: 'auth-register-1',
				valueDefault: {}
			});

			if (sourceType != 'keyup')
			{
				var dataAuth = _.get(entityos, '_scope.data.auth', {})

				var dataRegister;

				if (dataAuth.context != '' && dataAuth.context != undefined)
				{
					dataRegister = entityos._util.controller.invoke('util-data-clean', dataAuth.context)
				}

				$('.myds-view-auth-register').addClass('d-none');

				var type = data.id;
				if (type == undefined) { type = 'learner' }

				$('#auth-register-' + type + '-view').removeClass('d-none');

				if (dataRegister != undefined)
				{
					if (dataRegister.surname == undefined) {dataRegister.surname = dataRegister.lastname}
					$('#register-firstname').val(dataRegister.firstname);
					$('#register-surname').val(dataRegister.surname);
					$('#register-email').val(dataRegister.email);

					$('.auth-register-organisation-name').html(dataRegister.contactbusinesstext)
					$('#auth-register-learner-invite-view').html('<h1 class="pt-2 text-center font-bold" style="color:#9ecbed !important;">' + dataRegister.contactbusinesstext + '</h1>');

					entityos._util.data.set(
					{
						scope: 'auth-register-1',
						value: dataRegister
					});

					//$('.auth-register-next:visible')['removeClass']('disabled');
				}
			}
			else
			{
				var validated = false;

				var messageView = entityos._util.view.queue.init({queue: 'signup-message'})

				if (data != undefined)
				{
					validated = true;
					validated = validated && (data.firstname != '' && data.firstname != undefined);
					validated = validated && (data.surname != '' && data.surname != undefined);
					validated = validated && (data.email != '' && data.email != undefined);

					if (data.id == 'request')
					{
						validated = validated && (data['organisation-name'] != '' && data['organisation-name'] != undefined);
					}

					if (data.contactbusinessguid == undefined)
					{
						validated = false;
						messageView.add('<i class="fa fa-exclamation-triangle text-danger mr-2"></i>No community key specified, please contact your community facilator.');
					}
					else
					{
						const checkText = entityos._util.controller.invoke('util-check-text',
						{
							text: data.userpassword,
							minimumLength: 8
						});

						console.log(checkText)

						if (!checkText.ok)
						{
							validated = false;
							
							messageView.add('<i class="fa fa-exclamation-triangle text-warning mr-2"></i>' + checkText.error)
						}
						else
						{
							if (data.userpassword !=
								data.userpasswordverify)
							{
								validated = false;
								messageView.add('<i class="fa fa-exclamation-triangle text-warning mr-2"></i>Passwords do not match');
							}
						}
					}
				}

				messageView.render('#auth-register-message-view');

				$('.auth-register-next:visible')[(validated ? 'remove' : 'add') + 'Class']('disabled');
			}
		}
	},
	{
		name: 'auth-register-router',
		code: function (param, response)
		{
			var data = entityos._util.data.get(
			{
				scope: 'auth-register-1',
				valueDefault: {}
			});

			//!!! Do email for all cases during set up phase.
			//data.id = 'request'
			if (data.id == 'request')
			{
				$('#auth-register-view').carousel(4);
			}
			else
			{
				$('#auth-register-view').carousel(1)
			}
		}
	},
	{
		name: 'auth-register-2',
		code: function (param, response)
		{
			var data = entityos._util.data.get(
			{
				scope: 'auth-register-1',
				valueDefault: {}
			});

			if (response == undefined)
			{				
				if (data.id == 'request')
				{
					$('#auth-register-view').carousel(3);
				}
				else
				{
					var authOptions = entityos._util.controller.invoke('auth-get-auth-options');

					if (authOptions == undefined)
					{
						console.log('!! No options set up.');
					}
					else
					{
						entityos.cloud.search(
						{
							object: 'site_document',
							data: {id: authOptions.documents.terms},
							callback: 'auth-register-2'
						});
					}
				}
			}
			else
			{
				if (response.data.rows.length != 0)
				{
					var html = _.unescape(_.first(response.data.rows)['document.content']);
					entityos._util.view.queue.show('#auth-register-terms', html)
				}
				else
				{
					console.log('!! No terms set up [' + authOptions.documents.terms + ']');
				}
			}
		}
	},
	{
		name: 'auth-register-3',
		code: function (param, response)
		{
			var data = entityos._util.data.get(
			{
				scope: 'auth-register-1',
				valueDefault: {}
			});

			if (response == undefined)
			{
				$('#auth-register-3-ER').addClass('d-none');
				$('#auth-register-3-OK').addClass('d-none');

				let _context = 'selfdriven-signup';
				let communitykey = data.contactbusinessguid;
				
				if (_.includes(window.location.host.toLowerCase(), '-lab'))
				{
					_context = 'selfdriven-signup-lab';
				}

				let invokeData =
				{
					method: 'add-community-member',
					data:
					{
						_context: _context,
						source: data.source,
						communitykey: communitykey,
						memberrole: 'learner',
						memberfirstname: data.firstname,
						memberlastname: data.surname,
						memberemail: data.email,
						memberusername: data.email,
						memberuserpassword: data.userpassword
					}
				}

				console.log(invokeData)

				entityos.cloud.invoke(
				{
					url: 'https://api.slfdrvn.io',
					data: JSON.stringify(invokeData),
					type: 'POST',
					callback: 'auth-register-3',
					callbackParam: param
				});
			}
			else
			{
				$('#auth-register-3-working').addClass('d-none')

				if (response.status == 'ER')
				{
					if (response.error.errornotes == 'This email address is already used.' ||
						response.error.errornotes == 'contactperson linked to user') {
						$('#auth-register-3-ER-already-user').removeClass('d-none');
					}
					else
					{
						$('#auth-register-3-ER').removeClass('d-none')
					}
				}
				else
				{
					$('#auth-register-3-OK').removeClass('d-none');

					entityos._util.view.queue.init({queue: 'auth-register-3-OK'});

					if (_.has(data, 'origin'))
					{
						entityos._util.view.queue.add(
						[
							'<div class="text-white mt-1 mb-2"><a href="' + data.origin + '">' + _.replace( data.origin, 'https://', '') + '</a></div>'
						]);
					}

					if (_.has(data, 'sourcecontact'))
					{
						entityos._util.view.queue.add(
						[
							'<div class="text-muted">' + data.sourcecontact  + '</div>'
						]);
					}

					entityos._util.view.queue.render('#auth-register-3-OK-view')

				}
			}
		}
	},
	{
		name: 'auth-register-4',
		notes: 'Send Email',
		code: function (param, response)
		{
			if (response == undefined)
			{
				var data = entityos._util.data.get(
				{
					scope: 'auth-register-1',
					valueDefault: {}
				});

				var email = data['email'];
				var firstname = data['firstname'];
				var surname = data['surname'];
				var organisationName = data['organisation-name'];
				var organisationNameLearning = data['learning-organisation-name'];

				var message = [];

				if (organisationName != undefined)
				{
					message.push('Organisation: ' + organisationName);
				}

				if (organisationNameLearning != undefined)
				{
					message.push('Learning Organisation (For Learner): ' + organisationNameLearning);
				}

				message.push('First name: ' + firstname);
				message.push('Last name: ' + surname);
				message.push('Email: ' + email);

				var site = entityos._util.controller.invoke('auth-get-auth-options')['site'];

				var data =
				{
					fromemail: 'team@selfdriven.foundation',
					to: 'team@elfdriven.foundation',
					subject: 'selfdriven Sign Up Request: ' + firstname + ' ' + surname,
					message: message.join('<br /><br />'),
					site: site
				}

				$.ajax(
				{
					type: 'POST',
					url: '/rpc/site/?method=SITE_EMAIL_SEND',
					data: data,
					dataType: 'json',
					success: function (response)
					{
						app.controller['auth-register-4'](param, response)
					}
				});
			}
			else
			{
				$('#auth-register-4-working').addClass('d-none')

				if (response.status == 'ER')
				{
					$('#auth-register-4-ER').removeClass('d-none');
				}
				else
				{
					$('#auth-register-4-OK').removeClass('d-none');
				}
			}
		}
	}
]);

entityos._util.controller.invoke('auth-register-1');
