/*
	{
    	title: "Learner; Well-being (How Going)"
  	}
*/

app.add(
{
	name: 'learner-wellbeing-how-going',
	code: function (param, response)
	{
		app.invoke('learner-wellbeing-how-going-for-me-mentors');

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
		$('#learner-wellbeing-how-going-slider').val(howgoing)

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
	name: 'learner-wellbeing-how-going-for-me-mentors',
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
				callback: 'learner-wellbeing-how-going-for-me-mentors'
			})
		}
		else
		{
			var mentorsView = app.vq.init({queue: 'learner-wellbeing-how-going-for-me-mentors'});

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

			mentorsView.render('#learner-wellbeing-how-going-for-me-mentors');
		}
	}
});

app.add(
{
	name: 'learner-wellbeing-how-going-save',
	code: function (param, response)
	{
		var howgoing = app._util.param.get(param, 'howgoing').value;

		if (howgoing == undefined)
		{
			howgoing = app.get(
			{
				scope: 'learner-wellbeing-how-going',
				context: '_howgoing'
			});
		}

		var whoami = app.get(
		{
			scope: 'learner-me',
			context: 'whoami'
		});

		if (_.isUndefined(response))
		{
			if (howgoing != undefined)
			{
				app.set(
				{
					scope: 'learner-me',
					context: 'whoami',
					name: '_howgoing',
					value: howgoing
				});

				app.invoke('learner-wellbeing-how-going');

				mydigitalstructure.update(
				{
					object: 'contact_person',
					data: {id: whoami.id, _howgoing: howgoing},
					callback: 'learner-wellbeing-how-going-save'
				});
			}
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.notify('How you going updated.');
				app.invoke('learner-wellbeing-how-going-action-save')
			}
		}
	}
});

app.add(
{
	name: 'learner-wellbeing-how-going-action-save',
	code: function (param, response)
	{	

		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		var elements = app.get(
		{
			scope: 'util-setup',
			context: 'structureElements'
		});

		var category = app.whoami().mySetup.structures.me.categories['wellbeing'];
		elements = _.filter(elements, function (element) {return element.category == category});

		var whoami = app.get(
		{
			scope: 'learner-me',
			context: 'whoami'
		});

		var data =
		{
			object: 32,
			objectcontext: whoami.id,
			actionreference: 'How Going Update',
			actiontype: utilSetup.actionTypes.wellbeingHowGoingUpdate,
			contactperson: whoami.id,
			completed: moment().format('D MMM YYYY'),
			date: moment().format('D MMM YYYY'),
			status: 1
		};

		var description = [];

		_.each(elements, function (element)
		{	
			//data[element.alias] = whoami[element.alias];
			if (whoami[element.alias] != undefined)
			{
				data[element.alias] = whoami[element.alias];
				description.push(element.title + ' is now ' + whoami[element.alias] + '%;')
			}
		});

		data.description = description.join(' ');

		mydigitalstructure.update(
		{
			object: 'action',
			data: data
		});
	}
});

app.add(
{
	name: 'learner-wellbeing-how-going-history',
	code: function (param, response)
	{
		var utilSetup = app.get(
		{
			scope: 'util-setup'
		});

		if (response == undefined)
		{
			app.view.clear('#learner-wellbeing-how-going-history-view');
			app.view.clear('#learner-wellbeing-how-going-history-dates-view');

			var whoami = app.get(
			{
				scope: 'learner-me',
				context: 'whoami'
			});

			var whoamiUser = app.whoami().thisInstanceOfMe.user;

			var elements = app.get(
			{
				scope: 'util-setup',
				context: 'structureElements'
			});

			var category = app.whoami().mySetup.structures.me.categories['wellbeing'];
			elements = _.filter(elements, function (element) {return element.category == category})

			var fields = ['id', 'createddate', 'date']

			if (elements != undefined)
			{
				fields = _.concat(fields, _.map(elements, 'alias'))
			}

			mydigitalstructure.cloud.search(
			{
				object: 'action',
				fields: fields,
				filters:
				[
					{
						field: 'contactperson',
						value: whoamiUser.contactperson
					},
					{
						field: 'type',
						value: app.whoami().mySetup.actionTypes.wellbeingHowGoingUpdate
					},
				],
				sorts:
				[
					{
						field: 'date',
						direction: 'desc'
					}
				],
				callback: 'learner-wellbeing-how-going-history'
			});
		}
		else
		{
			var whoami = {};

			if (response.status == 'OK')
			{
				learnerWellBeingHowGoingView = app.vq.init({queue: 'learner-wellbeing-how-going-history'});

				learnerWellBeingHowGoingView.add(
				[
					'<div class="badge badge-warning">', response.data.rows.length, '</div>'
				]);

				learnerWellBeingHowGoingView.render('#learner-wellbeing-how-going-history-dates-count-view');

				app.set(
				{
					scope: 'learner-wellbeing-how-going-history',
					context: 'howgoings',
					value: response.data.rows
				});

				if (response.data.rows.length != 0)
				{
					app.invoke('learner-wellbeing-how-going-history-show')
				}
			}
		}
	}
});

app.add(
{
	name: 'learner-wellbeing-how-going-history-show',
	code: function (param, response)
	{	
		var whoami = app.get(
		{
			scope: 'learner-me',
			context: 'whoami'
		});

		var elements = app.get(
		{
			scope: 'util-setup',
			context: 'structureElements'
		});

		var category = app.whoami().mySetup.structures.me.categories['wellbeing'];
		elements = _.filter(elements, function (element) {return element.category == category})

		var howgoings = app.get(
		{
			scope: 'learner-wellbeing-how-going-history',
			context: 'howgoings',
		});

		//SHOW DATES

		learnerWellBeingHowGoingHistoryDatesView = app.vq.init({queue: 'learner-wellbeing-how-going-history-show'});

		learnerWellBeingHowGoingHistoryDatesView.add('<ul class="list-group">');

		_.each(howgoings, function (howgoing)
		{
			if (howgoing['_howgoing'] != '')
			{	
				howgoing.formattedDate = app.invoke('util-date', {date: howgoing.date, format: 'DD MMM YYYY'});
				howgoing._date = moment(howgoing.formattedDate, 'DD MMM YYYY');
				howgoing.dayOfWeek = howgoing._date.format('dddd')

				learnerWellBeingHowGoingHistoryDatesView.add(
				[
					'<li class="list-group-item">',
						howgoing.formattedDate, ' (', howgoing.dayOfWeek, ')',
					'</li>'
				]);
			}
		});

		app.set(
		{
			scope: 'learner-wellbeing-how-going-history',
			context: 'howgoings',
			value: howgoings
		});

		learnerWellBeingHowGoingHistoryDatesView.add('</ul>');

		learnerWellBeingHowGoingHistoryDatesView.render('#learner-wellbeing-how-going-history-dates-view');

		//SHOW

		learnerWellBeingHowGoingHistoryView = app.vq.init({queue: 'learner-wellbeing-how-going-history-show'});

		learnerWellBeingHowGoingHistoryView.add(
		[
			'<div class="mb-3">',
				'<div>',
					'{{progressbars}}',
				'</div>',
			'</div>'
		],
		{
			type: 'template'
		});

		_.each(elements, function (element)
		{
			element.progressbars = '';

			_.each(howgoings, function (howgoing)
			{
				if (howgoing[element.alias] != '')
				{
					element.progressbars += 
						'<div class="progress progress-small">' +
								'<div class="progress-bar" style="width: ' + howgoing[element.alias] + '%;" role="progressbar" aria-valuenow="' + howgoing[element.alias] + '" aria-valuemin="0" aria-valuemax="100"></div>' +
						'</div>';
				}
			});
			
			//element.value = whoami[element.alias] || 0;
			element.meid = whoami.id;
			learnerWellBeingHowGoingHistoryView.add({useTemplate: true}, element)
		});

		learnerWellBeingHowGoingHistoryView.render('#learner-wellbeing-how-going-history-howgoing-view');
	}
});

//VISUALS

app.add(
{
	name: 'learner-wellbeing-how-going-visual',
	code: function (param, response)
	{
		if (response == undefined)
		{
			var whoamiUser = app.whoami().thisInstanceOfMe.user;

			var elements = app.get(
			{
				scope: 'util-setup',
				context: 'structureElements'
			});

			var category = app.whoami().mySetup.structures.me.categories['wellbeing'];
			elements = _.filter(elements, function (element) {return element.category == category})

			var fields = ['id', 'createddate', 'date']

			if (elements != undefined)
			{
				fields = _.concat(fields, _.map(elements, 'alias'))
			}

			mydigitalstructure.cloud.search(
			{
				object: 'action',
				fields: fields,
				filters:
				[
					{
						field: 'contactperson',
						value: whoamiUser.contactperson
					},
					{
						field: 'type',
						value: app.whoami().mySetup.actionTypes.wellbeingHowGoingUpdate
					},
				],
				sorts:
				[
					{
						field: 'date',
						direction: 'desc'
					}
				],
				callback: 'learner-wellbeing-how-going-visual'
			});
		}
		else
		{
			if (response.status == 'OK')
			{
				var howgoings = response.data.rows;

				_.each(howgoings, function (howgoing)
				{
					if (howgoing['_howgoing'] != '')
					{	
						howgoing.formattedDate = app.invoke('util-date', {date: howgoing.date, format: 'DD MMM YYYY'});
						howgoing._date = moment(howgoing.formattedDate, 'DD MMM YYYY');
						howgoing.dayOfWeek = howgoing._date.format('dddd')
					}
				});

				app.set(
				{
					scope: 'learner-wellbeing-how-going-visual',
					context: 'howgoings',
					value: howgoings
				});

				if (response.data.rows.length != 0)
				{
					app.invoke('learner-wellbeing-how-going-visual-by-day')
				}
				else
				{
					//no data
				}
			}
		}
	}
});

app.add(
	{
		name: 'learner-wellbeing-how-going-visual-by-day',
		code: function (param, response)
		{	
			app.set(
			{
				scope: 'learner-wellbeing-how-going-visual',
				context: 'perspective',
				value: 'by-day'
			})
	
			app.invoke('util-visual-wellbeing-how-going-visual-by-day-chart-show');
		}
	});