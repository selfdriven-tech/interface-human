// WALLET: DATA STORAGE

// Persist in the Local Storage

entityos._util.controller.add(
[
	{
		name: 'wallet-storage-identity',
		notes: 'Store the user DID in plain text',
		code: function (param)
		{
			var whoami = entityos._util.controller.invoke('util-whoami');

			entityos._util.controller.invoke('util-local-cache-save',
			{
				key: 'wallet-identity',
				persist: true,
				data: 'test'
			});
		}
	}
]);