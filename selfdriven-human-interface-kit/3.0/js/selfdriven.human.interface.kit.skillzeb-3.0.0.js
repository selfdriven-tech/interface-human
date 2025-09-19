// Adds a template to a community
// Can also be used in the Studio app & heyOcto.ai/selfdriven.ai

entityos._util.controller.add(
{
    name: 'util-skillzeb-template-to-project-template',
    code: function (param)
    {
       	var templateName = app._util.param.get(param.dataContext, 'context').value;
        var templatesSet = app.get({scope: 'skillzeb-templates', context: 'templates-set'});

		var template = _.find(templatesSet, function (_template)
		{
			return (_template.name == templateName)
		});

		if (_.isNotSet(template))
		{}
		else
		{
			template._url = template.url;
			if (!_.includes(template._url, 'http'))
			{
				if (!_.startsWith(template._url, '/'))
				{
					template._url = '/' + template._url;
				}

				template._url = '/site/6b2beaea-f5ef-45f7-bec0-4c679d314d71/data' + template._url;
			}

			template._url = _.replace(template._url, 'https://raw.githubusercontent.com/selfdriven-foundation/skillzeb/main/templates/json', '/site/6b2beaea-f5ef-45f7-bec0-4c679d314d71/data')
					
            $.ajax(
            {
                type: 'GET',
                url: template._url,
                dataType: 'json',
                success: function(data)
                {
					const sourceTemplate = 
					{
						_file: data,
						name: templateName,
						templateFile: template._url 
					}

					app.set(
					{
						scope: 'util-skillzeb-template-clone',
						context: 'source-template',
						value: sourceTemplate
					});

					app.invoke('util-skillzeb-template-to-project-template-save', param);
                }
            });
		}
	}
});

app.add(
{
	name: 'util-skillzeb-template-to-project-template-save',
	code: function (param, response)
	{			
		var sourceTemplate = app.get( 
		{
			scope: 'util-skillzeb-template-clone',
			context: 'source-template'
		});

		if (sourceTemplate == undefined)
		{
			app.notify('No source template')
		}
		else
		{
			if (response == undefined)
			{
				const sourceTemplateDefinition = _.get(sourceTemplate, '_file.template.definition');

				var data =
				{
					template: 'Y',
					restrictedtoteam: 'N',
					contactbusiness: app.whoami().thisInstanceOfMe.user.contactbusiness,
					referencemask: 'T-?????',
					description: sourceTemplateDefinition.title,
					notes: sourceTemplateDefinition.description,
					type: app.whoami().mySetup.projectTypes[(sourceTemplateDefinition.type=='verification'?'verification':'learning')],
					status: app.whoami().mySetup.projectStatuses.completed
				}
		
				entityos.cloud.save(
				{
					object: 'project',
					data: data,
					callback: 'util-skillzeb-template-to-project-template-save'
				});
			}
			else
			{
				if (response.status == 'OK')
				{
					app.set(
					{
						scope: 'util-skillzeb-template-clone',
						context: 'project',
						value: {id: response.id}
					});

					app.invoke('util-skillzeb-template-to-project-template-attach', {id: response.id})
				}
			}
		}	
	}
});

app.add(
{
	name: 'util-skillzeb-template-to-project-template-attach',
	code: function (param, response)
	{			
		var sourceTemplate = app.get( 
		{
			scope: 'util-skillzeb-template-clone',
			context: 'source-template'
		});

		const sourceTemplateProject = app.get( 
		{
			scope: 'util-skillzeb-template-clone',
			context: 'project'
		});

		if (response == undefined)
		{
			const fileDateBase64 = Base64.encode(JSON.stringify(_.get(sourceTemplate, '_file')));

			const fileName = _.last(_.split(sourceTemplate.templateFile, '/'))

			var data =
			{
				object: app.whoami().mySetup.objects.project,
				objectcontext: sourceTemplateProject.id,
				base64: fileDateBase64,
				filename: fileName
			}
	
			entityos.cloud.invoke(
			{
				method: 'core_attachment_from_base64',
				data: data,
				callback: 'util-skillzeb-template-to-project-template-attach'
			});
		}
		else
		{
			if (response.status == 'OK')
			{
				app.notify('Template added.')
			}
		}
	}
});