/*
	{
    	title: "Learner; Well-being (How Going)"
  	}
*/

app.add(
{
	name: 'learning-partner-wellbeing-how-going',
	code: function (param, response)
	{
		app.invoke('learning-partner-wellbeing-how-going-for-me-mentors');

		var whoami = app.get(
		{
			scope: 'learner-me',
			context: 'whoami'
		});

		if (_.isNotSet(whoami._howgoing))
		{
			whoami._howgoing = 50
		}

		var howgoing = numeral(whoami._howgoing).value();
		$('#learning-partner-wellbeing-how-going-slider').val(howgoing)

		//HIGHLIGHT BOXES

		/*
		app.refresh(
		{
			hide: '#learner-community-dashboard-howgoing-reach-out-for-me, #learner-community-dashboard-howgoing-reach-out-for-community, #learner-community-dashboard-howgoing-stay-fit'
		});

		//0=Could be better
		//100=Going OK

		if (howgoing < 50) 
		{
			// reach out for others
			app.refresh(
			{
				show: '#learner-community-dashboard-howgoing-reach-out-for-me',
				hide: '#learner-community-dashboard-howgoing-reach-out-for-community, #learner-community-dashboard-howgoing-stay-fit'
			});
		}
		else if (howgoing > 80)  
		{
			// Can help others in community
			app.refresh(
			{
				show: '#learner-community-dashboard-howgoing-reach-out-for-community',
				hide: '#learner-community-dashboard-howgoing-reach-out-for-me, #learner-community-dashboard-howgoing-stay-fit'
			});
		}
		else
		{
			//stay mentally fit
			app.refresh(
			{
				show: '#learner-community-dashboard-howgoing-stay-fit',
				hide: '#learner-community-dashboard-howgoing-reach-out-for-me, #learner-community-dashboard-howgoing-reach-out-for-community'
			});
		}*/
	}
});

app.add(
{
	name: 'learning-partner-wellbeing-how-going-for-me-mentors',
	code: function (param, response)
	{
		if (response == undefined)
		{
			var filters = [
			{
				field: 'type',
				value: app.whoami().mySetup.relationshipTypes.learningPartnerMentor
			},
			{
				field: 'contactperson',
				value: app.whoami().thisInstanceOfMe.user.contactperson
			}];

			mydigitalstructure.cloud.search(
			{
				object: 'contact_relationship',
				fields:
				[
					'relationship.othercontactperson.firstname',
					'relationship.othercontactperson.surname',
					'relationship.othercontactperson.email',
					'relationship.othercontactperson.guid',
					'guid',
					'createddate',
					'startdate',
					'typetext'
				],
				filters: filters,
				sorts:
				[
					{
						field: 'relationship.othercontactperson.firstname',
						direction: 'asc'
					}
				],
				callback: 'learning-partner-wellbeing-how-going-for-me-mentors'
			})
		}
		else
		{
			var mentorsView = app.vq.init({queue: 'learning-partner-wellbeing-how-going-for-me-mentors'});

			if (response.data.rows.length == 0)
			{
				//Set the default mentor

				mentorsView.add(
				[
					''
				]);
			}
			else 
			{
				mentorsView.template(
				[
					'<div>{{relationship.othercontactperson.firstname}} {{relationship.othercontactperson.surname}}<div>',
					'{{contactinfo}}'
				]);

				mentorsView.add(
				[
					'<h4 style="color:#1c84c6">Mentors</h4>'
				]);

				_.each(response.data.rows, function (row)
				{
					row.contactinfo = '';

					if (row['relationship.othercontactperson.email'] != '')
					{
						row.contactinfo += '<div class="pt-1 pb-2 small">' + 
												'<i class="fa fa-envelope mr-1 text-muted"></i> <a class="text-muted" href="mailto:' + row['relationship.othercontactperson.email'] + '">' +
												row['relationship.othercontactperson.email'] + '</a>' +
											'</div>';
					}

					mentorsView.add({useTemplate: true}, row)
				});
			}

			mentorsView.render('#learning-partner-wellbeing-how-going-for-me-mentors');
		}
	}
});

app.add(
{
	name: 'learning-partner-wellbeing-how-going-save',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-wellbeing-how-going'
		});

		var whoami = app.get(
		{
			scope: 'learner-me',
			context: 'whoami'
		});

		if (_.isUndefined(response))
		{
			if (data._howgoing != undefined)
			{
				app.set(
				{
					scope: 'learner-me',
					context: 'whoami',
					name: '_howgoing',
					value: data._howgoing
				});

				app.invoke('learning-partner-wellbeing-how-going');

				mydigitalstructure.update(
				{
					object: 'contact_person',
					data: {id: whoami.id, _howgoing: data._howgoing},
					callback: 'learning-partner-wellbeing-how-going-save'
				});
			}
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('How you going updated.');
			}
		}
	}
});