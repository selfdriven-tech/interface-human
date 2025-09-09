/*
	{
    	title: "Learning Partner; Achievements", 	
    	design: "https://www.selfdriven.foundation/design"
  	}
*/

app.add(
{
	name: 'learning-partner-connections-achievements',
	code: function (param, response)
	{		
		app.invoke('learning-partner-connections-achievements-dashboard');
	}
});

app.add(
{
	name: 'learning-partner-connections-achievements-dashboard',
	code: function (param, response)
	{
		var data = app.get(
		{
			scope: 'learning-partner-connections-achievements-dashboard',
			valueDefault: {}
		});

		var filters =
		[
			{	
				field: 'createduser',
				comparison: 'EQUAL_TO',
				value: app.whoami().thisInstanceOfMe.user.id
			},
			{	
				field: 'actiontype',
				comparison: 'IN_LIST',
				value: app.whoami().mySetup.actionTypes.achievement
			}
		];

		if (!_.isEmpty(data.search))
		{
			filters = _.concat(filters,
			[
				{
					name: '('
				},
				{	
					field: 'subject',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{
					name: 'or'
				},
				{	
					field: 'contactpersontext',
					comparison: 'TEXT_IS_LIKE',
					value: data.search
				},
				{
					name: ')'
				}
			]);
		}

		app.invoke('util-view-table',
		{
			object: 'action',
			container: 'learning-partner-connections-achievements-view',
			context: 'learning-partner-connections-achievements',
			filters: filters,
			options:
			{
				noDataText: '<div class="p-4">There are no achievements that match this search.</div>',
				rows: 20,
				orientation: 'vertical',
				progressive: true,
				class: 'table-condensed',
				deleteConfirm:
				{
					text: 'Are you sure you want to delete this achievement?',
					position: 'left'
				}
			},
			format:
			{
				header:
				{
					class: 'd-flex'
				},

				row:
				{
					data: 'data-context="{{guid}}" data-id="{{guid}}" data-controller="learning-partner-connections-achievement-summary"',
					class: 'd-flex'
				},

				columns:
				[
					{
						caption: 'For',
						field: 'contactpersontext',
						defaultSort: true,
						sortBy: true,
						class: 'col-sm-3 myds-navigate'
					},
					{
						caption: 'Subject',
						field: 'subject', 	
						sortBy: true,
						class: 'col-sm-5 myds-navigate'
					},
					{
						caption: 'Date',
						field: 'createddate', 	
						sortBy: true,
						class: 'col-sm-3 myds-navigate'
					},
					{
						html: '<button class="btn btn-danger btn-outline btn-sm myds-delete"' +
	               			' id="learning-partner-connections-achievements-delete-{{id}}" data-id="{{id}}"><i class="fa fa-trash"></i></button>',
						caption: '&nbsp;',
						class: 'col-1 text-right'
					},
					{	
						fields:
						['guid']
					}
				]
			}
		});
	}
});

app.add(
{
	name: 'learning-partner-connections-achievements-delete-ok',
	code: function (param, response)
	{
		if (_.isUndefined(response))
		{
			if (!_.isUndefined(param.dataContext))
			{
				mydigitalstructure.cloud.delete(
				{
					object: 'action',
					data:
					{
						id: param.dataContext.id,
					},
					callback: 'learning-partner-connections-achievements-delete-ok'
				});
			}	
		}
		else
		{
			if (response.status == 'OK')
			{
				app.notify({message: 'Achievement deleted.', persist: false});
				app.invoke('learning-partner-connections-achievements-dashboard');
			}
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-achievement-summary',
	code: function (param, response)
	{	
		var guid = app.get(
		{
			scope: 'learning-partner-connections-achievement-summary',
			context: 'id'
		});

		if (guid == undefined || guid == '')
		{
			app.invoke('app-navigate-to', {controller: 'learning-partner-connections-achievements'});
		}
		else
		{
			if (response == undefined)
			{
				mydigitalstructure.cloud.search(
				{
					object: 'action',
					fields: 
					[
						'subject',
						'createddate', 'modifieddate',
						'guid', 'contactperson', 'contactpersontext',
						'description'
					],
					filters:
					[
						{
							field: 'guid',
							value: guid
						}
					],
					set: 
					{
						scope: 'learning-partner-connections-achievements',
						context: 'all'
					},
					callback: 'learning-partner-connections-achievement-summary'
				});
			}
			else
			{
				if (response.status == 'OK')
				{
					if (response.data.rows.length == 0)
					{}
					else
					{
						var data = _.first(response.data.rows);

						app.set(
						{
							scope: 'learning-partner-connections-achievement-summary',
							context: 'dataContext',
							value: data
						});

						app.invoke('util-attachments-initialise',
						{
							context: 'learning-partner-connections-achievement-summary',
							object: app.whoami().mySetup.objects.action,
							objectContext: data.id,
							showTypes: false,
							collapsible: false
						});

						app.view.refresh(
						{
							scope: 'learning-partner-connections-achievement-summary',
							selector: '#learning-partner-connections-achievement-summary',
							data: data,
							collapse: {contexts: ['attachments']}
						});

						app.invoke('learning-partner-connections-achievement-summary-skills')
					}
				}
			}
		}
	}	
});

app.add(
{
	name: 'learning-partner-connections-achievement-summary-skills',
	code: function (param, response)
	{
		var achievementAction = app.get(
		{
			scope: 'learning-partner-connections-achievement-summary',
			context: 'dataContext',
		});

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'core_object_link',
				fields: 
				[
					'objectcontext',
					'createddate', 'modifieddate',
					'guid', 'notes'
				],
				filters:
				[
					{
						field: 'object',
						value: app.whoami().mySetup.objects.contactAttribute
					},
					{
						field: 'parentobject',
						value: app.whoami().mySetup.objects.action
					},
					{
						field: 'parentobjectcontext',
						value: achievementAction.id
					}
				],
				callback: 'learning-partner-connections-achievement-summary-skills',
				callbackParam: param
			});
		}
		else
		{
			var skills = response.data.rows;
			
			if (skills.length == 0)
			{
				var skillsView = app.vq.init({queue: 'learning-partner-connections-achievement-summary-skills'});
				skillsView.add('<div class="card"><div class="card-body">');
				skillsView.add('<div class="text-muted">There are no skills related to this achievement.</div>');
				skillsView.add('</div></div>');
				skillsView.render('#learning-partner-connections-achievement-summary-skills-view');
			}
			else
			{
				var contactAttributeIDs = _.map(response.data.rows, 'objectcontext');

				mydigitalstructure.cloud.search(
				{
					object: 'contact_attribute',
					fields: 
					[
						'attributetext',
						'createddate', 'modifieddate',
						'guid'
					],
					filters:
					[
						{
							field: 'id',
							comparison: 'IN_LIST',
							value: contactAttributeIDs
						}
					],
					callback: 'learning-partner-connections-achievement-summary-skills-show',
					callbackParam: param
				});
			}
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-achievement-summary-skills-show',
	code: function (param, response)
	{
		var skills = response.data.rows;

		var skillsView = app.vq.init({queue: 'learning-partner-connections-achievement-summary-skills'});
	
		skillsView.add('<div class="card"><div class="card-body">');
		skillsView.add('<h4 class="text-muted mt-1">Skills Relating To This Achievement</h4>');
		skillsView.add('<ul>');

		skillsView.template('<li>{{text}}</li>');

		_.each(skills, function (skill)
		{
			skill.text = skill.attributetext;
			skillsView.add({ useTemplate: true }, skill);
		});

		skillsView.add('</ul>');
			
		skillsView.add('</div></div>');

		skillsView.render('#learning-partner-connections-achievement-summary-skills-view');
		
	}
});

app.add(
{
	name: 'learning-partner-connections-achievement-edit',
	code: function (param, response)
	{	
		var data = app.find(
		{
			dataScope: 'learning-partner-connections-achievements',
			dataContext: 'all',
			scope: 'learning-partner-connections-achievement-edit',
			context: 'id'
		});

		if (_.isUndefined(data))
		{
			data =
			{
				id: '',
				subject: '',
				description: '',
				contactpersontext: '',
				object: '',
				objectcontext: '',
				skill: '',
				skilltext: '',
				billingstatus: 2
			}
		}

		app.view.refresh(
		{
			scope: 'learning-partner-connections-achievement-edit',
			selector: '#learning-partner-connections-achievement-edit',
			data: data
		});

		app.invoke('util-view-select',
		{
			container: 'learning-partner-connections-achievement-edit-contactperson',
			object: 'contact_person',
			fields: [{name: 'firstname'}, {name: 'surname'}]
		});

		app.invoke('util-view-select',
		{
			container: 'learning-partner-connections-achievement-edit-skill',
			object: 'setup_contact_attribute',
			fields: [{name: 'title'}]
		});

		app.set(
		{
			scope: 'learning-partner-connections-achievement-edit-skills',
			context: 'action',
			value: data
		});

		app.invoke('learning-partner-connections-achievement-edit-skills', param);
	}	
});

app.add(
{
	name: 'learning-partner-connections-achievement-edit-skills',
	code: function (param, response)
	{	
		var achievementActionID = app.get(
		{
			scope: 'learning-partner-connections-achievement-edit',
			context: 'id'
		});

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'core_object_link',
				fields: 
				[
					'objectcontext',
					'createddate', 'modifieddate',
					'guid', 'notes'
				],
				filters:
				[
					{
						field: 'object',
						value: app.whoami().mySetup.objects.contactAttribute
					},
					{
						field: 'parentobject',
						value: app.whoami().mySetup.objects.action
					},
					{
						field: 'parentobjectcontext',
						value: achievementActionID
					}
				],
				callback: 'learning-partner-connections-achievement-edit-skills',
				callbackParam: param
			});
		}
		else
		{
			var skillsActionAttributesLinks = app.set(
			{
				scope: 'learning-partner-connections-achievement-edit-skills-' + achievementActionID,
				context: 'skills-action-attributes-links',
				value: response.data.rows
			});

			app.set(
			{
				scope: 'learning-partner-connections-achievement-edit-skills-' + achievementActionID,
				context: 'skills-action-attributes-ids',
				value: _.map(skillsActionAttributesLinks, function (link) {return _.first(_.split(link['notes'], ':'))})
			});

			app.invoke('learning-partner-connections-achievement-edit-skills-show', param)
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-achievement-edit-skills-show',
	code: function (param, response)
	{	
		var achievementAction = app.get(
		{
			scope: 'learning-partner-connections-achievement-edit-skills',
			context: 'action'
		});

		var skillsActionAttributesIDs = app.get(
		{
			scope: 'learning-partner-connections-achievement-edit-skills-' + achievementAction.id,
			context: 'skills-action-attributes-ids'
		});

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'setup_contact_attribute',
				fields: 
				[
					'title', 'guid'
				],
				sorts:
				[
					{
						field: 'displayorder'
					},
					{
						field: 'title'
					},
				],
				filters:
				[
					{
						field: 'hidden',
						value: 'N'
					}
				],
				rows: 99999,
				callback: 'learning-partner-connections-achievement-edit-skills-show',
				callbackParam: param
			});
		}
		else
		{
			var achievementSkills = response.data.rows;

			var skillsView = app.vq.init({queue: 'learning-partner-connections-achievement-edit-skills-show'});

			skillsView.template(
			[
				'<div class="form-group mb-2">',
					'<div class="row">',
						'<div class="col-1 text-right pt-1 pr-0">',
							'<input type="checkbox" class="myds-check" {{checked}}',
								' data-scope="learning-partner-connections-achievement-edit-skills-' + achievementAction.id + '"',
								' data-context="attributes"',
								' data-id="{{id}}"',
								' data-action="{{action}}"',
								' data-contactperson="{{contactperson}}"',
								'>',
						'</div>',
						'<div class="col-11">',
							'<div>{{title}}</div>',
						'</div>',
					'</div>',
				'</div>'
			]);

			_.each(achievementSkills, function (skill)
			{
				skill.contactperson = achievementAction.contactperson;
				skill.action = achievementAction.id;
				skill._attributes = _.find(skillsActionAttributesIDs, function (skillsActionAttributeID)
				{
					return (skillsActionAttributeID == skill.id)
				})

				skill.checked = (skill._attributes != undefined ?'checked="checked"':'');
				skillsView.add({useTemplate: true}, skill)
			});

			skillsView.render('#learning-partner-connections-achievement-edit-attributes-view')
		}
	}
});


app.add(
{
	name: 'learning-partner-connections-achievement-edit-save',
	code: function (param, response)
	{	
		var id = app.get(
		{
			scope: 'learning-partner-connections-achievement-edit',
			context: 'id',
			valueDefault: ''
		});

		var data = app.get(
		{
			scope: 'learning-partner-connections-achievement-edit-' + id,
			cleanForCloudStorage: true,
			mergeDefault:
			{
				id: id,
				values:
				{
					type: app.whoami().mySetup.actionTypes.achievement,
					billingstatus: 2
				}
			}
		});

		if (_.isUndefined(response))
		{		
			mydigitalstructure.cloud.save(
			{
				object: 'action',
				data: data,
				callback: 'learning-partner-connections-achievement-edit-save',
				set: {scope: 'learning-partner-connections-achievement-edit', data: true, guid: true}
			});
		}
		else
		{	
			if (response.status == 'OK')
			{
				app.invoke('learning-partner-connections-achievement-edit-skills-save');	
			}
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-achievement-edit-skills-save',
	code: function (param, response)
	{
		var achievementAction = app.get(
		{
			scope: 'learning-partner-connections-achievement-edit-skills',
			context: 'action'
		});

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'contact_attribute',
				fields: 
				[
					'attribute'
				],
				filters:
				[
					{
						field: 'contactperson',
						value: achievementAction.contactperson
					}
				],
				callback: 'learning-partner-connections-achievement-edit-skills-save',
				callbackParam: param
			});
		}
		else
		{
			app.set(
			{
				scope: 'learning-partner-connections-achievement-edit-skills-' + achievementAction.id,
				context: 'skills-action-contact-attributes',
				value: response.data.rows
			});

			app.set(
			{
				scope: 'learning-partner-connections-achievement-edit-skills-save-process',
				context: 'achievement-skills-all-index',
				value: 0
			});

			var achievementSkills = app.get(
			{
				scope: 'learning-partner-connections-achievement-edit-skills-' + achievementAction.id,
				valueDefault: {}
			});
	
			var achievementSkillsAll = _.concat(
				_.map(achievementSkills['_attributes'], function (attribute) {return {type: 'save', attribute: attribute}}),
				_.map(achievementSkills['_attributes-unselected'], function (attribute) {return {type: 'remove', attribute: attribute}})
			);
	
			app.set(
			{
				scope: 'learning-partner-connections-achievement-edit-skills-' + achievementAction.id,
				context: 'all',
				value: achievementSkillsAll
			});
		
			app.invoke('learning-partner-connections-achievement-edit-skills-save-process')
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-achievement-edit-skills-save-process',
	code: function (param)
	{
		var achievementAction = app.get(
		{
			scope: 'learning-partner-connections-achievement-edit-skills',
			context: 'action'
		});

		var skillsActionContactAttributes = app.get(
		{
			scope: 'learning-partner-connections-achievement-edit-skills-' + achievementAction.id,
			context: 'skills-action-contact-attributes'
		});

		var achievementSkillsAll = app.get(
		{
			scope: 'learning-partner-connections-achievement-edit-skills-' + achievementAction.id,
			context: 'all'
		});

		var achievementSkillsAllIndex = app.get(
		{
			scope: 'learning-partner-connections-achievement-edit-skills-save-process',
			context: 'achievement-skills-all-index'
		});

		if (achievementSkillsAllIndex < achievementSkillsAll.length)
		{
			var achievementSkill = achievementSkillsAll[achievementSkillsAllIndex];

			var skillsActionContactAttribute = _.find(skillsActionContactAttributes, function (contactAttribute)
			{
				return (contactAttribute.attribute == achievementSkill.attribute)
			});

			if (achievementSkill.type == 'save' && skillsActionContactAttribute == undefined)
			{
				mydigitalstructure.cloud.save(
				{
					object: 'contact_attribute',
					data:
					{
						attribute: achievementSkill.attribute,
						contactperson: achievementAction.contactperson,
						startdate: moment().format('D MMM YYYY')
					},
					callback: 'learning-partner-connections-achievement-edit-skills-save-next'
				}); 
			}
			else if (achievementSkill.type == 'remove' && skillsActionContactAttribute != undefined)
			{
				/* ONLY IF NOT LINKED BY OTHER ACHEIVEMENT ACTION
				mydigitalstructure.cloud.delete(
				{
					object: 'contact_attribute',
					data: {id: skillsActionContactAttribute['id']},
					callback: 'learning-partner-connections-achievement-edit-skills-save-next'
				}); 
				*/
				app.invoke('learning-partner-connections-achievement-edit-skills-save-next')
			}
			else
			{
				app.invoke('learning-partner-connections-achievement-edit-skills-save-next')
			}
		}
		else
		{
			app.invoke('learning-partner-connections-achievement-edit-skills-save-links');
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-achievement-edit-skills-save-next',
	code: function (param, response)
	{
		app.set(
		{
			scope: 'learning-partner-connections-achievement-edit-skills-save-process',
			context: 'achievement-skills-all-index',
			value: function (value) { return numeral(value).value() + 1 }
		});

		app.invoke('learning-partner-connections-achievement-edit-skills-save-process');
	}
});

app.add(
{
	name: 'learning-partner-connections-achievement-edit-skills-save-links',
	code: function (param, response)
	{
		var achievementAction = app.get(
		{
			scope: 'learning-partner-connections-achievement-edit-skills',
			context: 'action'
		});

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'contact_attribute',
				fields: 
				[
					'attribute', 'attributetext'
				],
				filters:
				[
					{
						field: 'contactperson',
						value: achievementAction.contactperson
					}
				],
				callback: 'learning-partner-connections-achievement-edit-skills-save-links',
				callbackParam: param
			});
		}
		else
		{
			app.set(
			{
				scope: 'learning-partner-connections-achievement-edit-skills-' + achievementAction.id,
				context: 'skills-action-contact-attributes',
				value: response.data.rows
			});

			app.set(
			{
				scope: 'learning-partner-connections-achievement-edit-skills-save-links-process',
				context: 'achievement-skills-all-index',
				value: 0
			});

			app.invoke('learning-partner-connections-achievement-edit-skills-save-links-process');
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-achievement-edit-skills-save-links-process',
	code: function (param, response)
	{	
		var achievementAction = app.get(
		{
			scope: 'learning-partner-connections-achievement-edit-skills',
			context: 'action'
		});

		var skillsActionContactAttributes = app.get(
		{
			scope: 'learning-partner-connections-achievement-edit-skills-' + achievementAction.id,
			context: 'skills-action-contact-attributes'
		});

		var skillsActionAttributesLinks = app.get(
		{
			scope: 'learning-partner-connections-achievement-edit-skills-' + achievementAction.id,
			context: 'skills-action-attributes-links'
		});
			
		var achievementSkillsAll = app.get(
		{
			scope: 'learning-partner-connections-achievement-edit-skills-' + achievementAction.id,
			context: 'all'
		});

		var achievementSkillsAllIndex = app.get(
		{
			scope: 'learning-partner-connections-achievement-edit-skills-save-links-process',
			context: 'achievement-skills-all-index'
		});

		if (achievementSkillsAllIndex < achievementSkillsAll.length)
		{
			var achievementSkill = achievementSkillsAll[achievementSkillsAllIndex];

			var skillsActionContactAttribute = _.find(skillsActionContactAttributes, function (contactAttribute)
			{
				return contactAttribute.attribute == achievementSkill.attribute;
			})

			var skillsActionAttributesLink = _.find(skillsActionAttributesLinks, function (attributeLink)
			{
				return _.first(_.split(attributeLink['notes'], ':')) == achievementSkill.attribute;
			})

			if (achievementSkill.type == 'save' && skillsActionContactAttribute != undefined && skillsActionAttributesLink == undefined)
			{
				mydigitalstructure.cloud.save(
				{
					object: 'core_object_link',
					data:
					{
						object: app.whoami().mySetup.objects.contactAttribute,
						objectcontext: skillsActionContactAttribute['id'],
						parentobject: app.whoami().mySetup.objects.action,
						parentobjectcontext: achievementAction.id,
						notes: skillsActionContactAttribute['attribute'] + ':' + skillsActionContactAttribute['attributetext']
					},
					callback: 'learning-partner-connections-achievement-edit-skills-save-links-next'
				}); 
			}
			else if (achievementSkill.type == 'remove' && skillsActionAttributesLink != undefined)
			{
				mydigitalstructure.cloud.delete(
				{
					object: 'core_object_link',
					data: {id: skillsActionAttributesLink['id']},
					callback: 'learning-partner-connections-achievement-edit-skills-save-links-next'
				}); 
			}
			else
			{
				app.invoke('learning-partner-connections-achievement-edit-skills-save-links-next')
			}
		}
		else
		{
			app.invoke('learning-partner-connections-achievement-edit-save-finalise')
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-achievement-edit-skills-save-links-next',
	code: function (param, response)
	{
		app.set(
		{
			scope: 'learning-partner-connections-achievement-edit-skills-save-links-process',
			context: 'achievement-skills-all-index',
			value: function (value) { return numeral(value).value() + 1 }
		});

		app.invoke('learning-partner-connections-achievement-edit-skills-save-links-process');
	}
});

app.add(
{
	name: 'learning-partner-connections-achievement-edit-save-finalise',
	code: function (param, response)
	{	
		var achievementAction = app.get(
		{
			scope: 'learning-partner-connections-achievement-summary',
			context: 'dataContext',
		});

		if (response == undefined)
		{
			mydigitalstructure.cloud.search(
			{
				object: 'core_object_link',
				fields: 
				[
					'objectcontext',
					'createddate', 'modifieddate',
					'guid', 'notes', 'objectlink.createduser.guid', 'createdusertext',
					'objectlink.modifieduser.guid', 'modifiedusertext'
				],
				filters:
				[
					{
						field: 'object',
						value: app.whoami().mySetup.objects.contactAttribute
					},
					{
						field: 'parentobject',
						value: app.whoami().mySetup.objects.action
					},
					{
						field: 'parentobjectcontext',
						value: achievementAction.id
					}
				],
				callback: 'learning-partner-connections-achievement-edit-save-finalise',
				callbackParam: param
			});
		}
		else
		{
			var skills = _.map(response.data.rows, function (row)
			{
				return {
					createddate: row.createddate,
					createdusertext: row.createdusertext,
					createduserguid: row['objectlink.createduser.guid'],
					modifieddate: row.modifieddate,
					modifiedusertext: row.modifiedusertext,
					modifieduserguid: row['objectlink.modifieduser.guid'],
					guid: row.guid,
					skill: _.first(_.split(row['notes'], ':')),
					skilltext: _.last(_.split(row['notes'], ':')),
				}
			});

			var data =
			{
				id: achievementAction.id,
				text: JSON.stringify(skills)
			}

			mydigitalstructure.cloud.save(
			{
				object: 'action',
				data: data,
				callback: 'learning-partner-connections-achievement-edit-save-complete',
			});
		}
	}
});

app.add(
{
	name: 'learning-partner-connections-achievement-edit-save-complete',
	code: function (param)
	{
		//also add core_protect_ciphertext with action data

		var achievementAction = app.get(
		{
			scope: 'learning-partner-connections-achievement-summary',
			context: 'dataContext',
		});

		app.notify({message: 'Achievement has been updated.'});
		app.invoke('app-navigate-to', {controller: 'learning-partner-connections-achievement-summary', context: achievementAction.guid});
	}
});	