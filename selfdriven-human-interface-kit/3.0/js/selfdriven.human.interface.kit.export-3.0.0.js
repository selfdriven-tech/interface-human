/*
	{
    	title: "Util; PDF Creation",
    	design: "https://docs.google.com/document/d/1EvpCTyyn_U9J3tsUxV4U67WmoCWEWM6lLQMjLmXAcB4",
    	dependencies:
    	[
			'https://pdfmake.github.io/docs/getting-started/client-side/',
			'/site/1991/pdfmake.min.js',
			'/site/1991/vfs_fonts.js'
			'??? https://github.com/bpampuch/pdfmake/blob/master/examples/vectors.js'
    	]
  	}

	app.invoke('util-pdf-profile', {object: , objectcontext: , saveToCloudStorage: true})
  	
  	ns1blankspace.setup.space.export =
{
	roles:
	{
		data: {},

		init: function (oParam, oResponse)
		{
			var iRole = ns1blankspace.util.getParam(oParam, 'role').value

			if (iRole != undefined)
			{
				if (oResponse == undefined)
				{
					var oSearch = new AdvancedSearch();
					oSearch.method = 'SETUP_ROLE_SEARCH';
					oSearch.addField('title,notes,modifieddate,selfsignupavailable');
					oSearch.addFilter('id', 'EQUAL_TO', iRole);
					oSearch.getResults(function(data) {ns1blankspace.setup.space.export.roles.init(oParam, data)});
				}
				else
				{
					if (oResponse.data.rows.length != 0)
					{
						ns1blankspace.setup.space.export.roles.data.role = oResponse.data.rows[0];
						ns1blankspace.setup.space.export.roles.properties(oParam);
					}
				}
			}
		},

		properties: function (oParam, oResponse)
		{
			if (oResponse == undefined)
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = 'SETUP_ROLE_PARAMETER_ACCESS_SEARCH';
				oSearch.addField('accessmethod,accessmethodtext,allowedvalues,disallowedvalues,id,notes,parameter,role,roletext,type');
				oSearch.addFilter('role', 'EQUAL_TO', ns1blankspace.setup.space.export.roles.data.role.id);
				oSearch.rows = 99999;
				oSearch.sort('accessmethodtext', 'asc');
				oSearch.getResults(function(data) {ns1blankspace.setup.space.export.roles.properties(oParam, data)});
			}
			else
			{
				ns1blankspace.setup.space.export.roles.data.properties = oResponse.data.rows;
				ns1blankspace.setup.space.export.roles.process(oParam);
			}
		},

		process: function (oParam, oResponse)
		{
			if (oResponse == undefined)
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = 'SETUP_ROLE_METHOD_ACCESS_SEARCH';
				oSearch.addField('accessmethod,accessmethodtext,canadd,canremove,canupdate,canuse,guidmandatory,allowedparameters,disallowedparameters');
				oSearch.addFilter('role', 'EQUAL_TO', ns1blankspace.setup.space.export.roles.data.role.id);
				oSearch.rows = 99999;
				oSearch.sort('accessmethodtext', 'asc');
				oSearch.getResults(function(data) {ns1blankspace.setup.space.export.roles.process(oParam, data)});
			}
			else
			{
				ns1blankspace.setup.space.export.roles.data.methods = oResponse.data.rows;
				ns1blankspace.setup.space.export.roles.data.file = [];
				var aFile = ns1blankspace.setup.space.export.roles.data.file;

				aFile.push('{');
				aFile.push('\t"template":');
				aFile.push('\t{');
				aFile.push('\t\t"roles":');
				aFile.push('\t\t[');
				aFile.push('\t\t\t{');
				aFile.push('\t\t\t\t"title": "' + ns1blankspace.setup.space.export.roles.data.role.title + '",');

				aFile.push('\t\t\t\t"methods":');
				aFile.push('\t\t\t\t[');

				var aFileMethods = [];

				$.each(ns1blankspace.setup.space.export.roles.data.methods, function (m, method)
				{
					aFileMethods.push('\t\t\t\t\t{"title": "' + method.accessmethodtext + '", "canuse": "' + method.canuse + '",' +
												' "canadd": "' + method.canadd + '",' +
												' "canupdate": "' + method.canupdate + '",' +
												' "canremove": "' + method.canremove + '",' +
												' "guidmandatory": "' + method.guidmandatory + '"' +
												' "allowedproperties": "' + method.allowedparameters + '"' +
												' "disallowedproperties": "' + method.disallowedparameters + '"' +
												'}');
				});

				aFile.push(aFileMethods.join(',\n'));

				aFile.push('\t\t\t\t],');

				aFile.push('\t\t\t\t"properties":');
				aFile.push('\t\t\t\t[');

				var aFileMethods = [];

				$.each(ns1blankspace.setup.space.export.roles.data.properties, function (p, property)
				{
					aFileMethods.push('\t\t\t\t\t{"name": "' + property.parameter + '", ' +
												' "methodtitle": "' + property.accessmethodtext + '", ' +
												' "method": "' + property.accessmethod + '",' +
												' "allowedvalues": "' + property.allowedvalues + '",' +
												' "disallowedvalues": "' + property.disallowedvalues + '",' +
												' "notes": "' + property.notes + '",' +
												' "type": "' + property.type + '"' +
												'}');
				});

				aFile.push(aFileMethods.join(',\n'));

				aFile.push('\t\t\t\t]');

				aFile.push('\t\t\t}');
				aFile.push('\t\t]');
				aFile.push('\t}');
				aFile.push('}');

				ns1blankspace.setup.file.export.saveToFile(
				{
					data: aFile.join('\n'),
					filename: 'setup-role-access-' + _.kebabCase(ns1blankspace.setup.space.export.roles.data.role.title) + '.json'
				});
			}
		}
	}
}
*/

app.add(
[	
	{
		name: 'util-export-profile',
		code: function (param)
		{
			var subject = app._util.param.get(param, 'subject').value;
			var tableHeader = app._util.param.get(param, 'header').value;
			var tableRow = app._util.param.get(param, 'tableRow').value;
			var content = app._util.param.get(param, 'content').value;

			var audit = app._util.param.get(param, 'audit', {default: {}}).value;
			var data = app._util.param.get(param, 'data').value;

			if (data == undefined)
			{
				data = app.get(
				{
					scope: 'learner-me'
				});
			}

			if (subject == undefined)
			{
				subject = 'Profile (CONFIDENTIAL)'
				
				if (data != undefined)
				{
					if (data.date != undefined)
					{
						subject = subject + '; ' + data.date
					}

					if (data.name != undefined)
					{
						subject = subject + '; ' + data.name
					}
				}
			}

			var whoami = app.whoami();
			var whoamiUser = app.whoami().thisInstanceOfMe.user;
			var whoamiProfile = app.get(
			{
				scope: 'learner-me',
				context: 'whoami'
			});

			var name = whoamiUser.firstname + ' '
							+ whoamiUser.surname

			/*

			{
				source: "selfdriven",
				date: "",
				by: ""
				format: "selfdriven-profile",
				version: "1.0"
				data:
				{
					community: {name: "Turramurra High School", id: "[guid]"}
					me: {firstname: "", lastname: "", email: "", id: "[guid]", about: ""},
					teams: [{name: ""}],
					connections: [{type: "learning partner", firstname: "", lastname: "", email: ""}],
					endorsements: [{}],
					reflections: [{}],
					achievements: [{type: "skill"}],
					attributes:
					{
						latest: {},
						history [{}]
					},
					next: [{}]
				}
			}

			*/

			//app.invoke('util-export-download', param);
		}
	},
	{
		name: 'util-export-project-story',
		code: function (param)
		{
			app.notify({message: 'This will download the project story data in JSON format.'});

			app.invoke('util-view-spinner-remove-all');


			var subject = app._util.param.get(param, 'subject').value;
			var tableHeader = app._util.param.get(param, 'header').value;
			var tableRow = app._util.param.get(param, 'tableRow').value;
			var content = app._util.param.get(param, 'content').value;

			var audit = app._util.param.get(param, 'audit', {default: {}}).value;
			var data = app._util.param.get(param, 'data').value;

			if (data == undefined)
			{
				data = app.get(
				{
					scope: 'util-project-story-board',
					context: 'summary'
				});
			}

			if (subject == undefined)
			{
				subject = 'My Project (CONFIDENTIAL)'
				
				if (data != undefined)
				{
					if (data.date != undefined)
					{
						subject = subject + '; ' + data.date
					}

					if (data.name != undefined)
					{
						subject = subject + '; ' + data.name
					}
				}
			}

			var whoami = app.whoami();
			var whoamiUser = app.whoami().thisInstanceOfMe.user;
			var whoamiProfile = app.get(
			{
				scope: 'learner-me',
				context: 'whoami'
			});

			var name = whoamiUser.firstname + ' '
							+ whoamiUser.surname

			/*

			{
				source: "selfdriven",
				date: "",
				by: ""
				format: "selfdriven-project",
				version: "1.0"
				data:
				{
					community: {name: "Turramurra High School", id: "[guid]"}
					me: {firstname: "", lastname: "", email: "", id: "[guid]", about: ""},
					team: [{name: ""}],
					connections: [{type: "learning partner", firstname: "", lastname: "", email: ""}],
					task: [],
					activity: [],
					endorsements: [{}],
					reflections: [{}],
					achievements: [{type: "skill"}],
					attachments: [{type: 'link'}]
				}
			}

			*/

			//app.invoke('util-export-download', param);
		}
	}
])