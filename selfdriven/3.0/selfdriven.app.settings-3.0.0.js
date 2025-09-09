/*
	{
    	title: "App | Settings", 	
    	design: "https://selfdriven.foundation/apps"
  	}
*/

app.add(
{
	name: 'settings',
	code: function (param, response)
	{
		app.invoke('util-identity-webauthn-passkey');
	}
});