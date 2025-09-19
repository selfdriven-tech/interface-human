//-- LEARNER; PROFILE; VISUAL

app.add(
{
	name: 'learner-profile-visual',
	code: function (param, response)
	{
		var whoamiUser = app.whoami().thisInstanceOfMe.user;

		var elements = app.get(
		{
			scope: 'util-setup',
			context: 'structureElements'
		});

		if (response == undefined)
		{
			var attributesCategory = app.get(
			{
				scope: 'learner-profile-summary-attributes',
				context: 'category',
				valueDefault: 'general'
			});

			app.set(
			{
				scope: 'learner-profile-visual',
				context: 'category',
				value: attributesCategory
			});
		
			app.invoke('util-view-button-set-active', {selector: '#learner-profile-visual-for-' + attributesCategory});
	
			app.view.clear('#learner-profile-visual-view');
			app.view.clear('#learner-profile-visual-attributes-view');

			var fields = ['id', 'createddate', 'guid']

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
						value: app.whoami().mySetup.actionTypes.profileAttributesUpdate
					},
				],
				rows: 9999,
				sorts:
				[
					{
						field: 'id',
						direction: 'desc'
					}
				],
				callback: 'learner-profile-visual',
				callbackParam: param
			});
		}
		else
		{
			var whoami = {};

			if (response.status == 'OK')
			{
				var attributes = [];
				var attributesReversed = [];

				_.each(response.data.rows, function (row)
				{
					attributes.push(row)
				});

				_.each(_.reverse(response.data.rows), function (row)
				{
					attributesReversed.push(row)
				});

				app.set(
				{
					scope: 'learner-profile-visual',
					context: 'attributes',
					value: attributes
				});

				app.set(
				{
					scope: 'learner-profile-visual',
					context: 'attributes-reversed',
					value: attributesReversed
				});

				//Reduce the attributes

				var _attributesAsAt = [];

				_attributesAsAt.push(
				{
					_date: moment(), 
					date: moment().format('DD MMM YYYY'),
					caption: 'Now',
					attributes: []
				})

				_attributesAsAt.push(
				{
					_date: moment().add(-6, 'months'), 
					date: moment().add(-6, 'months').format('DD MMM YYYY'),
					caption: '6 months ago',
					attributes: {}
				})
				
				_.each(_attributesAsAt, function (_attributeAsAt)
				{
					_.each(elements, function (element)
					{
						_attributeAsAt.attributes[element.alias] = 0;

						_.each(attributesReversed, function (attribute)
						{
							if (moment(attribute.createddate, app.options.dateFormats).isSameOrBefore(_attributeAsAt._date)
									&& attribute[element.alias] != '')
							{
								_attributeAsAt.attributes[element.alias] = numeral(attribute[element.alias]).value();
								_attributeAsAt.guid = attribute.guid;
							}
						})
					});
				});

				app.set(
				{
					scope: 'learner-profile-visual',
					context: '_attributes-as-at',
					value: _attributesAsAt
				});

				var attributesAsAt = [];

				_.each(_attributesAsAt, function (_attributeAsAt)
				{
					_attributeAsAt._seriesData = {guid: _attributeAsAt.guid, createddate: _attributeAsAt.date, caption: _attributeAsAt.caption}

					_.each(elements, function (element)
					{
						_attributeAsAt._seriesData[element.alias] = _attributeAsAt.attributes[element.alias];
					});

					attributesAsAt.push(_attributeAsAt._seriesData)
				});

				app.set(
				{
					scope: 'learner-profile-visual',
					context: 'attributes-as-at',
					value: attributesAsAt
				});

				var attributesAsAtReversed = [];

				_.each(_.reverse(_.clone(attributesAsAt)), function (row)
				{
					attributesAsAtReversed.push(_.clone(row));
				});

				app.set(
				{
					scope: 'learner-profile-visual',
					context: 'attributes-as-at-reversed',
					value: attributesAsAtReversed
				});

				learnerMeVisualDatesView = app.vq.init({queue: 'learner-visual-dates-count'});

				learnerMeVisualDatesView.add(
				[
					'<div class="badge badge-warning">', attributesAsAt.length, '</div>'
				]);

				learnerMeVisualDatesView.render('#learner-profile-visual-dates-count-view');

				//if (attributes.length != 0)
				//{
					app.invoke('learner-profile-visual-refresh')
				//}
			}
		}
	}
});

app.add(
{
	name: 'learner-profile-visual-refresh',
	code: function (param, response)
	{	
		var perspective = app.get(
		{
			scope: 'learner-profile-visual',
			context: 'perspective',
			valueDefault: 'growth'
		});

		if (perspective == 'growth')
		{
			app.invoke('learner-profile-visual-attributes')
		}

		if (perspective == 'balance')
		{
			app.invoke('learner-profile-visual-attributes-balance')
		}

		if (perspective == 'balance-growth')
		{
			app.invoke('learner-profile-visual-attributes-growth')
		}

		if (perspective == 'balance-radar')
		{
			app.invoke('learner-profile-visual-attributes-balance-radar')
		}
	}
});

app.add(
	{
		name: 'learner-profile-visual-profile',
		code: function (param)
		{	
			var profileID = app.get({scope: 'learner-profile', context: 'id'});
			app.invoke('app-navigate-to', {scope: 'learner-profile', context: profileID});
		}
	});

app.add(
{
	name: 'learner-profile-visual-attributes',
	code: function (param, response)
	{	
		app.set(
		{
			scope: 'learner-profile-visual',
			context: 'perspective',
			value: 'growth'
		});

		var attributes = app.get(
		{
			scope: 'learner-profile-visual',
			context: 'attributes-as-at-reversed'
		});

		app.invoke('util-visual-attributes-chart-show', {context: 'learner-profile'});

		learnerMeVisualDatesView = app.vq.init({queue: 'learner-profile-visual-dates'});

		learnerMeVisualDatesView.add('<ul class="list-group">');

		_.each(attributes, function (attribute)
		{
			learnerMeVisualDatesView.add(
			[
				'<li class="list-group-item">',
					'<div class="font-weight-bold">' + app.invoke('util-date', {date: attribute.createddate, format: 'DD MMM YYYY'}) + '</div>',
					(_.isSet(attribute.caption)?'<div class="text-muted">' + attribute.caption + '</div>':''),
				'</li>'
			])
		});

		learnerMeVisualDatesView.add('</ul>');

		learnerMeVisualDatesView.render('#learner-profile-visual-dates-view');
	}
});

app.add(
{
	name: 'learner-profile-visual-attributes-balance',
	code: function (param, response)
	{	
		app.set(
		{
			scope: 'learner-profile-visual',
			context: 'perspective',
			value: 'balance'
		})

		if (response == undefined)
		{
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

			var visualAttributesCategory = app.get(
			{
				scope: 'learner-profile-visual',
				context: 'category',
				valueDefault: 'general'
			});

			var category = app.whoami().mySetup.structures.me.categories[visualAttributesCategory];
			elements = _.filter(elements, function (element) {return element.category == category})

			var fields = ['id', 'createddate']

			if (elements != undefined)
			{
				fields = _.concat(fields, _.map(elements, 'alias'))
			}

			mydigitalstructure.cloud.search(
			{
				object: 'contact_person',
				fields: fields,
				filters:
				[
					{
						field: 'id',
						value: whoamiUser.contactperson
					}
				],
				rows: 6,
				sorts:
				[
					{
						field: 'id',
						direction: 'asc'
					}
				],
				callback: 'learner-profile-visual-attributes-balance',
				callbackParam: param
			});
		}
		else
		{
			app.set(
			{
				scope: 'learner-profile-visual',
				context: 'myAttributes',
				value: _.first(response.data.rows)
			});

			app.invoke('util-visual-attributes-balance-chart-show', {context: 'learner-profile'});
		}
	}
});

app.add(
{
	name: 'learner-profile-visual-attributes-growth',
	code: function (param, response)
	{	
		app.set(
		{
			scope: 'learner-profile-visual',
			context: 'perspective',
			value: 'balance-growth'
		})

		app.invoke('util-visual-attributes-growth-chart-show', {context: 'learner-profile'});
	}
});

app.add(
{
	name: 'learner-profile-visual-attributes-balance-radar',
	code: function (param, response)
	{	
		app.set(
		{
			scope: 'learner-profile-visual',
			context: 'perspective',
			value: 'balance-radar'
		})

		app.invoke('util-visual-attributes-balance-radar-chart-show', {context: 'learner-profile'});
	}
});