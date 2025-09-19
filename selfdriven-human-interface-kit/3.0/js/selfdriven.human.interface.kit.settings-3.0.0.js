/*
	namespace: "selfdriven.human.interface.kit", 	
    context: "settings"
    url: "https://github.com/selfdriven-tech/interface-human"
*/

app.add(
{
	name: 'human-interface-settings',
	code: function (param, response)
	{
		app.invoke('util-identity-webauthn-passkey');
	}
});