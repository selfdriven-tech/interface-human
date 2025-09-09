/*
	{
    	title: "Learing Partner; Me; On-Chain", 	
    	design: "https://selfdriven.foundation/design"
  	}
*/

app.add(
{
	name: 'learning-partner-me-on-chain',
	code: function (param, response)
	{}
});

app.add(
{
	name: 'learning-partner-me-on-chain-edit',
	code: function (param, response)
	{	
		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'core_protect_key',
				fields:
				[
					'key', 'categorytext', 'guid', 'modifieddate'
				],
				filters:
				[
					{	
						field: 'object',
						comparison: 'IN_LIST',
						value: app.whoami().mySetup.objects.user
					},
					{	
						field: 'objectcontext',
						comparison: 'EQUAL_TO',
						value: app.whoami().thisInstanceOfMe.user.id
					}
				],
				sorts:
				[
					{
						field: 'modifieddate',
						direction: 'desc'
					}
				],
				callback: 'learning-partner-me-on-chain-edit'
			});
		}
		else
		{
			var data = _.first(response.data.rows);

			data = _.assign(data,
			{
				firstname: app.whoami().thisInstanceOfMe.user.firstname,
				surname: app.whoami().thisInstanceOfMe.user.surname,
				id: app.whoami().thisInstanceOfMe.user.id,
			});

			data['cardano-primary-address'] = data['key'];
			
			app.set(
			{
				scope: 'learning-partner-me-on-chain-summary',
				context: 'dataContext',
				value: data
			});

			app.view.refresh(
			{
				scope: 'learning-partner-me-on-chain-edit',
				selector: '#learning-partner-me-on-chain-edit',
				data: data
			});
		}		
	}	
});

app.add(
{
	name: 'learning-partner-me-on-chain-edit-save',
	code: function (param, response)
	{	
		var data = app.get(
		{
			scope: 'learning-partner-me-on-chain-edit-' + app.whoami().thisInstanceOfMe.user.id,
			cleanForCloudStorage: true,
			valueDefault: {}
		});

		if (_.isSet(data['cardano-primary-address']))
		{
			if (_.isUndefined(response))
			{
				var saveData = 
				{
					object: app.whoami().mySetup.objects.user,
					objectcontext: app.whoami().thisInstanceOfMe.user.id,
					category: 6,
					title: 'Cardano Primary Address',
					key: data['cardano-primary-address']
				}

				mydigitalstructure.cloud.save(
				{
					object: 'core_protect_key',
					data: saveData,
					callback: 'learning-partner-me-on-chain-edit-save'
				});
			}
			else
			{	
				if (response.status == 'OK')
				{
					app.notify('On-Chain profile updated.');
					app.invoke('app-navigate-to', {controller: 'learning-partner-me'});
				}
			}
		}
	}
});

