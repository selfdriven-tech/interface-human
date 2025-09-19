app.add(
{
	name: 'util-setup-user-signup-invite-generate-link',
	code: function (param, response)
	{	
		app.invoke('util-view-select',
		{
			container: 'util-setup-users-invite-generate-link-contactbusiness',
			object: 'contact_business',
			fields: [{name: 'tradename'}, {name: 'guid', hidden: true}],
			invokeChange: false
		});
	}
});

app.add(
{
	name: 'util-setup-user-signup-invite-generate-link-process',
	code: function (param)
	{	
		let contactbusinessGUID = _.get(param, 'dataContext.contactbusinessguid');
		let contactbusinessText = _.get(param, 'dataContext.contactbusinesstext');

		let contactpersonFirstName = _.get(param, 'dataContext.contactpersonfirstname', '');
		let contactpersonLastName = _.get(param, 'dataContext.contactpersonlastname', '');
		let contactpersonEmail = _.get(param, 'dataContext.contactpersonemail', '');

		let linkContext = _.get(param, 'dataContext.context', '');
		if (_.isSet(linkContext)) {linkContext = '-' + linkContext}

		const data = app.get(
		{
			scope: 'util-setup-users-invite-generate-link',
			valueDefault: {}
		});

		if (_.isNotSet(contactbusinessGUID) || _.isNotSet(contactbusinessText))
		{
			const contactBusinesses = app.get(
			{
				scope: 'util-setup-users-invite-generate-link-contactbusiness',
				context: '_data'
			});

			const contactBusiness = _.find(contactBusinesses, function (contactBusiness)
			{
				return (contactBusiness.id == data.contactbusiness)
			});

			if (_.isSet(contactBusiness))
			{
				contactbusinessGUID = contactBusiness.guid;
				contactbusinessText = contactBusiness.tradename;
			}
		}

		if (_.isNotSet(contactpersonFirstName))
		{
			contactpersonFirstName = data.contactpersonfirstname;
		}

		if (_.isNotSet(contactpersonLastName))
		{
			contactpersonLastName = data.contactpersonlastname;
		}

		if (_.isNotSet(contactpersonEmail))
		{
			contactpersonEmail = data.contactpersonemail;
		}

		var linkView = app.vq.init({queue: 'util-setup-user-signup-invite-generate-link'});

		if (_.isNotSet(contactbusinessGUID))
		{
			linkView.add('<div class="text-warning mt-3">Please select an organisation.</div>')
		}
		else
		{
			var context = 
			'{' +
				'"contactbusinesstext":"' + contactbusinessText + '",' +
				'"contactbusinessguid":"' + contactbusinessGUID  + '",' +
				'"firstname":"' + contactpersonFirstName + '",' +
				'"lastname":"' + contactpersonLastName + '",' +
				'"email":"' + contactpersonEmail + '"' +
			'}'

			let url = 'https://' + (app.whoami().mySetup.isLab?'signup-lab.selfdriven.cloud':'signup.slfdrvn.app')

			var contextBase58 = app.invoke('util-convert-to-base58', {text: context});

			url += '/signup#:z' + contextBase58; // z prefix means it is base58

			app.set(
			{
				scope: 'util-setup-users-invite-generate-link',
				context: 'url',
				value: url
			});

			const urlCaption = _.truncate(url, {length: 64});

			linkView.add(
			[
				'<div class="text-left mt-3">',
					'<a href="', url, '" target="_blank">', urlCaption, '</a>',
					'<a class="entityos-click text-secondary ms-2" data-controller="util-setup-users-invite-generate-link-share"><i class="fa fa-copy fe fe-copy text-secondary"></i></a>',
				'</div>'
			]);
		}

		linkView.render('#util-setup-users-invite-generate-link-view' + linkContext)
	}
});

entityos._util.controller.add(
{
    name: 'util-setup-users-invite-generate-link-share',
    code: function (param)
    {
		const url = app.get(
		{
			scope: 'util-setup-users-invite-generate-link',
			context: 'url'
		});

		navigator.clipboard.writeText(url)
        .then(() => {
            app.notify('Copied to Clipboard')
        })
        .catch(err => {
           app.notify('Could Not Copy')
        });
	}
});