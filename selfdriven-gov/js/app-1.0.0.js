/*
	ECC App

	- Generate X509 Key Pair using Ed25519 and save to .pem file based on members:
		- First Name
		- Last Name
		- Unique ID

	- Create a certificate request and save to file as .csr using the same filename format

	- Sign a transaction hash

	- Back up private PEM (Key) File
	- Restore private PEM (Key) File.

	-- UI @ app.html on an offline computer that has never been online.

	!! IMPORTANT
	- This is internal code to be used by a known group of users.
	- It is not production ready to the point where it can be used by unknown users.
	- With that in minde, this code favours understandability over maintainablity - in that you can see the functions for auditing / security checks.

	TODO
	- Keys generation direct to backup/encrypted file
	- Use keys direct from backup/encrypted file
	- Check if online by attempting to fetch "https://github.com" - error == offline, else "!!" warning
*/

window.app =
{
	x509: { data: {} },
	x509b: { data: {} },
	crypto: {},
	backup: {},
	util: {}
}

window.app.x509b.arrayToHex = function (array) {
	return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

window.app.x509b.hexToArrayBuffer = function (hex) {
	const bytes = new Uint8Array(hex.length / 2);
	for (let i = 0; i < hex.length; i += 2) {
		bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
	}
	return bytes.buffer;
}

window.app.x509b.generateCSR = function () {
	const keyPair = app.x509.data.keyPair;
	const privateKey = keyPair.secretKey;
	const publicKey = keyPair.publicKey;

	const info =
	{
		commonName: app.x509.data.info.firstname.toLowerCase() + "." + app.x509.data.info.lastname.toLowerCase() + "." + app.x509.data.info.code + ".council.eastern.cardano",
		countryName: app.x509.data.info.country,
		stateName: app.x509.data.info.state,
		locationName: app.x509.data.info.location,
		organizationName: "Eastern Cardano Council",
		organizationalUnitName: "Operations"
	};

	const subject = new KJUR.asn1.x509.X500Name({
		array: [
			[{ type: 'C', value: info.countryName }],
			[{ type: 'ST', value: info.stateName }],
			[{ type: 'L', value: info.locationName }],
			[{ type: 'O', value: info.organizationName }],
			[{ type: 'OU', value: info.organizationalUnitName }],
			[{ type: 'CN', value: info.commonName }]
		]
	});

	const ed25519Oid = new KJUR.asn1.DERObjectIdentifier({ oid: '1.3.101.112' }); // OID for Ed25519
	const publicKeyAlg = new KJUR.asn1.DERSequence({ array: [ed25519Oid] });
	const publicKeyBitString = new KJUR.asn1.DERBitString({
		hex: '00' + window.app.x509b.arrayToHex(publicKey)
	});

	const subjectPublicKeyInfo = new KJUR.asn1.DERSequence({
		array: [
			publicKeyAlg,
			publicKeyBitString
		]
	});

	const csrInfo = new KJUR.asn1.DERSequence({
		array: [
			new KJUR.asn1.DERInteger({ 'int': 0 }),
			subject,
			subjectPublicKeyInfo,
			// Removed the NULL attribute
		]
	});

	const csrInfoHex = csrInfo.getEncodedHex();
	const signature = nacl.sign.detached(new Uint8Array(window.app.x509b.hexToArrayBuffer(csrInfoHex)), privateKey);

	const csr = new KJUR.asn1.DERSequence({
		array: [
			csrInfo,
			new KJUR.asn1.DERSequence({ array: [ed25519Oid] }),
			new KJUR.asn1.DERBitString({
				hex: '00' + window.app.x509b.arrayToHex(signature)
			})
		]
	});

	const csrPEM = KJUR.asn1.ASN1Util.getPEMStringFromHex(csr.getEncodedHex(), 'CERTIFICATE REQUEST');

	window.app.x509b.data.csrPEM = csrPEM;

	window.app.util.saveCSRToFile(csrPEM);
}

window.app.util.debugLog = function (step, data) {
	console.log(`${step}:`, app.util.arrayBufferToHex(data));
};

window.app.util.arrayBufferToBase64 = function (arrayBuffer) {
	const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
	return base64;
}

window.app.util.arrayBufferToPem = function (arrayBuffer, label) {
	const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
	return "-----BEGIN " + label + "-----\n" + base64.match(/.{1,64}/g).join('\n') + "\n-----END " + label + "-----";
}

window.app.util.arrayBufferToPem2 = function (arrayBuffer, label) {
	const binary = new Uint8Array(arrayBuffer);
	let base64 = '';
	for (let i = 0; i < binary.length; i++) {
		base64 += String.fromCharCode(binary[i]);
	}
	base64 = btoa(base64);

	const pemString =
		"-----BEGIN " + label + "-----\n" +
		base64.match(/.{1,64}/g).join('\n') +
		"\n-----END " + label + "-----\n";
	return pemString;
};

window.app.util.convertToPEM = function (keyData, label) {
	const base64Key = app.util.arrayBufferToBase64(keyData);
	const formattedKey = base64Key.match(/.{1,64}/g).join('\n');
	return "-----BEGIN " + label + "-----\n" + formattedKey + "\n-----END " + label + "-----\n";
}

window.app.util.convertPrivateKeyToPKCS8 = function (secretKey) {
	const oidEd25519 = [0x2B, 0x65, 0x70]; // 1.3.101.112 (Ed25519)

	const pkcs8Header = [
		0x30, 0x2E, // SEQUENCE, length 46
		0x02, 0x01, 0x00, // INTEGER, version 0
		0x30, 0x05, // SEQUENCE, length 5
		0x06, oidEd25519.length, ...oidEd25519, // OID, Ed25519
		0x04, 0x22, // OCTET STRING, length 34
		0x04, 0x20, // OCTET STRING, length 32
	];

	const pkcs8Key = new Uint8Array([
		...pkcs8Header,
		...secretKey.subarray(0, 32), // Ed25519 private key is first 32 bytes of secretKey
	]);

	return app.util.arrayBufferToPem(pkcs8Key, "PRIVATE KEY");
}

window.app.util.convertPublicKeyToSPKI = function (publicKey) {
	const oidEd25519 = [0x2B, 0x65, 0x70]; // 1.3.101.112 (Ed25519)

	const spkiHeader = [
		0x30, 0x2A, // SEQUENCE, length 42
		0x30, 0x05, // SEQUENCE, length 5
		0x06, oidEd25519.length, ...oidEd25519, // OID, Ed25519
		0x03, 0x21, 0x00, // BIT STRING, length 33
	];

	const spkiKey = new Uint8Array([
		...spkiHeader,
		...publicKey, // Ed25519 public key
	]);

	return app.util.arrayBufferToPem(spkiKey, "PUBLIC KEY");
}

window.app.util.createCSR = function (keyPair, subject) {
	try {
		// OIDs
		const oidCommonName = new Uint8Array([0x55, 0x04, 0x03]);
		const oidCountryName = new Uint8Array([0x55, 0x04, 0x06]);
		const oidStateName = new Uint8Array([0x55, 0x04, 0x08]);
		const oidLocalityName = new Uint8Array([0x55, 0x04, 0x07]);
		const oidOrganizationName = new Uint8Array([0x55, 0x04, 0x0A]);
		const oidOrganizationalUnitName = new Uint8Array([0x55, 0x04, 0x0B]);
		const oidEd25519 = new Uint8Array([0x2B, 0x65, 0x70]);

		// Create subject
		const subjectAttributes = [
			{ oid: oidCountryName, value: subject.countryName },
			{ oid: oidStateName, value: subject.stateName },
			{ oid: oidLocalityName, value: subject.locationName },
			{ oid: oidOrganizationName, value: subject.organizationName },
			{ oid: oidOrganizationalUnitName, value: subject.organizationalUnitName },
			{ oid: oidCommonName, value: subject.commonName }
		].filter(attr => attr.value); // Filter out any undefined values

		const subjectSequence = asn1Sequence(
			subjectAttributes.map(attr =>
				asn1Set([asn1Sequence([
					asn1ObjectIdentifier(attr.oid),
					asn1Utf8String(attr.value)
				])])
			)
		);

		const publicKeyInfo = asn1Sequence([
			asn1Sequence([asn1ObjectIdentifier(oidEd25519)]),
			new Uint8Array([0x03, 0x21, 0x00, ...keyPair.publicKey]) // BIT STRING
		]);

		const csrInfo = asn1Sequence([
			asn1Integer(0),
			subjectSequence,
			publicKeyInfo,
			asn1Sequence([])
		]);

		const signature = nacl.sign.detached(csrInfo, keyPair.secretKey);

		const csr = asn1Sequence([
			csrInfo,
			asn1Sequence([asn1ObjectIdentifier(oidEd25519)]),
			asn1OctetString(signature)
		]);

		return csr;
	} catch (error) {
		console.error('Error in createCSR:', error);
		throw error;
	}
};

window.app.util.arrayBufferToHex = function (buffer) {
	return Array.from(new Uint8Array(buffer))
		.map(b => b.toString(16).padStart(2, '0'))
		.join('');
}

window.app.util.createSubjectDer = function (subject) {
	const oidCommonName = [0x55, 0x04, 0x03];
	const oidCountryName = [0x55, 0x04, 0x06];
	const oidOrganizationName = [0x55, 0x04, 0x0A];
	const oidOrganizationalUnitName = [0x55, 0x04, 0x0B];
	const oidLocationName = [0x55, 0x04, 0x07];
	const oidStateName = [0x55, 0x04, 0x08];

	const createAttributeTypeAndValue = (oid, value) => {
		const encodedValue = new TextEncoder().encode(value);
		return [
			0x30, encodedValue.length + oid.length + 4, // SEQUENCE
			0x06, oid.length, ...oid, // OID
			0x0C, encodedValue.length, ...encodedValue // UTF8String
		];
	};

	const subjectAttributes = [
		createAttributeTypeAndValue(oidCountryName, subject.countryName),
		createAttributeTypeAndValue(oidStateName, subject.stateName),
		createAttributeTypeAndValue(oidLocationName, subject.locationName),
		createAttributeTypeAndValue(oidOrganizationName, subject.organizationName),
		createAttributeTypeAndValue(oidOrganizationalUnitName, subject.organizationalUnitName),
		createAttributeTypeAndValue(oidCommonName, subject.commonName)
	].filter(attr => attr[2] > 0); // Remove any empty attributes

	const subjectSequence = new Uint8Array(subjectAttributes.flat());
	return new Uint8Array([0x30, ...app.util.toLengthBytes(subjectSequence.length), ...subjectSequence]);
};

window.app.util.createNameField = function (oid, value) {
	const valueBytes = new TextEncoder().encode(value);
	const oidEncoded = new Uint8Array([0x06, oid.length, ...oid]);
	const valueEncoded = new Uint8Array([0x13, valueBytes.length, ...valueBytes]);
	const sequenceLength = oidEncoded.length + valueEncoded.length;
	return new Uint8Array([
		0x31, sequenceLength + 2, // SET
		0x30, sequenceLength, // SEQUENCE
		...oidEncoded,
		...valueEncoded
	]);
}

window.app.util.createSPKI = function (publicKey) {
	const oidEd25519 = [0x2B, 0x65, 0x70]; // OID for Ed25519

	return new Uint8Array([
		0x30, 0x2A, // SEQUENCE, length 42
		0x30, 0x05, // SEQUENCE, length 5
		0x06, oidEd25519.length, ...oidEd25519, // OID, Ed25519
		0x03, 0x21, 0x00, // BIT STRING, length 33
		...publicKey, // Ed25519 public key
	]);
}

window.app.util.toLengthBytes = function (len) {
	if (len < 128) return [len];
	let lenBytes = [];
	while (len > 0) {
		lenBytes.unshift(len & 0xFF);
		len >>= 8;
	}
	return [0x80 | lenBytes.length, ...lenBytes];
}

window.app.util.validateCSR = function (csr) {
	try {
		if (csr[0] !== 0x30) throw new Error("CSR doesn't start with SEQUENCE");
		console.log("CSR structure seems valid");
		return true;
	} catch (error) {
		console.error("CSR validation failed:", error);
		return false;
	}
}

window.app.util.savePEMToFile = function (pemData) {
	const blob = new Blob([pemData], { type: 'text/plain' });
	const link = document.createElement('a');

	let role = app.x509.data.info.role;

	if (role == undefined || role == '') {
		role = 'voter'
	}

	role = role.toLowerCase();

	const filename = 'member-' +
		app.x509.data.info.firstname.toLowerCase() +
		'-' + app.x509.data.info.lastname.toLowerCase() +
		'-' + app.x509.data.info.code +
		'-' + role + '.pem';

	link.download = filename;
	link.href = window.URL.createObjectURL(blob);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

window.app.util.saveCSRToFile = function (csrData) {
	const blob = new Blob([csrData], { type: 'text/plain' });
	const link = document.createElement('a');

	let role = app.x509.data.info.role;

	if (role == undefined || role == '') {
		role = 'voter'
	}

	role = role.toLowerCase();

	const filename = 'member-' +
		app.x509.data.info.firstname.toLowerCase() +
		'-' + app.x509.data.info.lastname.toLowerCase() +
		'-' + app.x509.data.info.code +
		'-' + role + '.csr'

	link.download = filename;
	link.href = window.URL.createObjectURL(blob);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

// X509

window.app.x509.generateKeys = function () {
	// Generate an Ed25519 key pair using tweetnacl.js
	app.x509.data.keyPair = nacl.sign.keyPair();

	app.x509.data.publicKey = app.x509.data.keyPair.publicKey;
	app.x509.data.privateKey = app.x509.data.keyPair.secretKey;

	app.x509.data.privateKeyPKCS8 = window.app.util.convertPrivateKeyToPKCS8(app.x509.data.keyPair.secretKey);
}

window.app.x509.convertKeysToPEM = function () {
	app.x509.data.publicKeyPEM = app.util.convertToPEM(app.x509.data.publicKey, "PUBLIC KEY");
	app.x509.data.privateKeyPEM = app.util.convertToPEM(app.x509.data.privateKey.subarray(0, 32), "PRIVATE KEY");
}

window.app.x509.generatePEMs = function () {
	app.x509.generateKeys();
	app.x509.convertKeysToPEM();

	app.x509.data.info =
	{
		firstname: document.getElementById("selfdriven-gov-app-firstname").value,
		lastname: document.getElementById("selfdriven-gov-app-lastname").value,
		code: document.getElementById("selfdriven-gov-app-code").value,
		country: document.getElementById("selfdriven-gov-app-country").value,
		state: document.getElementById("selfdriven-gov-app-state").value,
		location: document.getElementById("selfdriven-gov-app-location").value,
		role: document.getElementById("selfdriven-gov-app-role").value
	}

	app.util.savePEMToFile(app.x509.data.privateKeyPKCS8)
}

window.app.x509.generateCSR = function () {
	try {
		if (!app.x509.data || !app.x509.data.keyPair) {
			throw new Error('Key pair not found. Please generate keys first.');
		}

		const keyPair = app.x509.data.keyPair;

		const subject = {
			commonName: app.x509.data.info.firstname.toLowerCase() + "." + app.x509.data.info.lastname.toLowerCase() + "." + app.x509.data.info.code + ".council.eastern.cardano",
			countryName: app.x509.data.info.country,
			stateName: app.x509.data.info.state,
			locationName: app.x509.data.info.location,
			organizationName: "Eastern Cardano Council",
			organizationalUnitName: "Operations"
		};

		const csr = app.util.createCSR(keyPair, subject);

		const csrPEM = app.util.arrayBufferToPem2(csr, "CERTIFICATE REQUEST");

		const blob = new Blob([csrPEM], { type: 'text/plain' });
		const link = document.createElement('a');
		const filename = 'member-' +
			app.x509.data.info.firstname.toLowerCase() +
			'-' + app.x509.data.info.lastname.toLowerCase() +
			'-' + app.x509.data.info.code + '.csr';
		link.download = filename;
		link.href = window.URL.createObjectURL(blob);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

	} catch (error) {
		console.error('Error in generateCSR:', error);
		alert('Error generating CSR: ' + error.message);
	}
};

// CRYPTO - CARDANO TRANSACTIONS

window.app.crypto.extractPrivateKeyFromPEM = function (pemString) {
	const base64 = pemString
		.replace('-----BEGIN PRIVATE KEY-----', '')
		.replace('-----END PRIVATE KEY-----', '')
		.replace(/\s/g, '');

	const keyBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

	return keyBytes.slice(-32);
}

window.app.crypto.extractCardanoKey = function (jsonKey) {
	const keyData = typeof jsonKey === 'string' ? JSON.parse(jsonKey) : jsonKey;

	if (keyData.type !== "PaymentSigningKeyShelley_ed25519") {
		throw new Error("Unsupported key type");
	}

	const cborHex = keyData.cborHex;
	const keyHex = cborHex.startsWith('5820') ? cborHex.slice(4) : cborHex;
	const keyBytes = new Uint8Array(keyHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

	return keyBytes;
}

window.app.crypto.expandPrivateKey = function (privateKey) {
	const secretKey = new Uint8Array(64);
	secretKey.set(privateKey);
	secretKey.set(nacl.sign.keyPair.fromSeed(privateKey).publicKey, 32);
	return secretKey;
}


window.app.crypto.hexToUint8Array = function (hexString) {
	return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}

window.app.crypto.arrayBufferToHex = function (buffer) {
	return Array.from(new Uint8Array(buffer))
		.map(b => b.toString(16).padStart(2, '0'))
		.join('');
}

window.app.crypto.hexToBuffer = function (base16Text) {
	return new Uint8Array(base16Text.match(/../g).map(h => parseInt(h, 16))).buffer
}

window.app.crypto.CBORtoArray = function (param) {
	var data = '!! CBOR Not Available [https://github.com/paroga/cbor-js]'

	if (window.CBOR != undefined) {
		var dataAsBuffer = app.crypto.hexToBuffer(param);
		data = CBOR.decode(dataAsBuffer);
	}

	return data;
}

window.app.crypto.arrayToHex = function (uint8Array) {
	return Array.from(uint8Array)
		.map(byte => byte.toString(16).padStart(2, '0'))
		.join('');
}

window.app.crypto.bufferToHex = function bufferToHex(buffer) {
	return Array.from(buffer)
		.map(b => b.toString(16).padStart(2, '0'))
		.join('');
}

window.app.crypto.witnessTransactionHash = function (privateKey, transactionHashHex) {
	if (transactionHashHex != undefined) {
		var keyPair = nacl.sign.keyPair.fromSeed(privateKey); // Derive public key from the private key
		transactionHash = window.app.crypto.hexToUint8Array(transactionHashHex);
	}
	else {
		throw new Error("No transaction hash!");
	}

	const signature = nacl.sign.detached(transactionHash, keyPair.secretKey);
	const publicKey = keyPair.publicKey;
	const witnessCBORHex = '8200825820' + app.crypto.bufferToHex(publicKey) +
		'5840' + app.crypto.bufferToHex(signature);

	return {
		type: "TxWitness ConwayEra",
		description: "Key Witness ShelleyEra",
		cborHex: witnessCBORHex
	};
}

async function handleFiles() {
	// See code below for update.
	const privateKeyFile = document.getElementById('privateKeyFile').files[0];
	const privateKeyFileCardano = document.getElementById('privateKeyFileCardano').files[0];
	const transactionFile = document.getElementById('transactionFile').files[0];
	const transactionHashFile = document.getElementById('transactionHashFile').files[0];

	if ((!privateKeyFile && !privateKeyFileCardano) || (!transactionFile && !transactionHashFile)) {
		alert('Please select both private key (.pem) and transaction hash file (.hash).');
		return;
	}

	if ((!privateKeyFile && !privateKeyFileCardano) || (!transactionFile && !transactionHashFile)) {
		alert('Please select both private key (.pem) and transactionfile (.hash or .json)');
		return;
	}

	let privateKey;
	let privateKeyPEM;

	console.log('Loading Private Key From File')

	if (privateKeyFile != undefined) {
		if (privateKeyFile.text != undefined) {
			privateKeyPEM = await privateKeyFile.text();
		}
		else {
			console.log('Loading Private Key From File: Using FileReader');

			privateKeyPEM = await new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result);
				reader.onerror = () => reject(reader.error);
				reader.readAsText(privateKeyFile);
			});
		}
	}

	if (privateKeyFileCardano != undefined) {
		const privateKeyCardano = await privateKeyFileCardano.text();
		privateKey = app.crypto.extractCardanoKey(privateKeyCardano);
	}

	if (privateKeyPEM == undefined) {
		console.log('Error Loading the PEM File')
	}
	else {
		privateKey = app.crypto.extractPrivateKeyFromPEM(privateKeyPEM);

		console.log('Private Key Loaded');

		let witnessedTx;
		let witnessFileName;

		console.log('Loading Hash File to be Witnessed');

		let transactionHash;

		if (transactionHashFile != undefined) {
			if (transactionHashFile) {
				if (transactionHashFile.text != undefined) {
					transactionHash = await transactionHashFile.text();
				}
				else {
					console.log('Transaction Hash To Be Witness Loaded: Using FileReader');

					transactionHash = await new Promise((resolve, reject) => {
						const reader = new FileReader();
						reader.onload = () => resolve(reader.result);
						reader.onerror = () => reject(reader.error);
						reader.readAsText(transactionHashFile);
					});
				}

				console.log('Transaction Hash To Be Witness Loaded');
				console.log(transactionHash);
			}

			console.log('Witnessing Hash');

			witnessedTx = app.crypto.witnessTransactionHash(privateKey, transactionHash);
			witnessFileName = transactionHashFile.name.replace('.hash', '')
				+ '-' + privateKeyFile.name.replace('.pem', '').replace('member-', '') + '.witness';
		}

		console.log('Save Witnessed Hash To File');
		console.log(witnessFileName);

		let path = '/mainnet';

		if (witnessFileName.indexOf('sancho') != -1) {
			path = '/sanchonet'
		}

		$('#voting-notes-view').html(
			[
				'<div class="font-weight-bold">You Just Signed as a Witness Vote Tx ID (Hash)</div>',
				'<div class="mb-3">', transactionHash, '</div>',
				'<div class="font-weight-bold">Next Steps:</div>',
				'<ol>',
				'<li class="mt-2">Copy the <em>' + witnessFileName + '</em> file to your USB-T drive.</li>',
				'<li class="mt-2">Insert the USB-T into your online computer.</li>',
				'<li class="mt-2">Copy the <em>' + witnessFileName + '</em> file to the "<em>' + transactionHashFile.name.replace('.hash', '') + '</em>" folder at "selfdriven Foundation Shared Drive" /organisation/foundation/governance/voting' + path + '.</li>',
				'</ol>',
				'<div class="font-weight-bold mt-2 text-danger">[!] Once all steps have been completed, power down your computer, so as to clear all private key data from memory.</div>',
			].join(''))

		const blob = new Blob([JSON.stringify(witnessedTx, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = witnessFileName;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
}

// BACK UP

window.app.backup.encryptData = function (data, password) {
	return CryptoJS.AES.encrypt(data, password).toString();
}

window.app.backup.decryptData = function (encryptedData, password) {
	var bytes = CryptoJS.AES.decrypt(encryptedData, password);
	return bytes.toString(CryptoJS.enc.Utf8);
}

async function backupFile() {
	const privateKeyFile = document.getElementById('privateKeyFileToBackup').files[0];

	if (!privateKeyFile) {
		alert('Please select a private key PEM file.');
		return;
	}

	let privateKey;

	console.log('Loading Private Key From File')

	if (privateKeyFile != undefined) {
		if (privateKeyFile.text != undefined) {
			privateKey = await privateKeyFile.text();
		}
		else {
			console.log('Loading Private Key From File: Using FileReader');

			privateKey = await new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result);
				reader.onerror = () => reject(reader.error);
				reader.readAsText(privateKeyFile);
			});
		}
	}

	if (privateKey == undefined) {
		console.log('Error loading the Private Key PEM File')
	}
	else {
		console.log('Private Key Loaded');

		encryptPassword = document.getElementById('encryptionPassword').value;

		const encryptedData = window.app.backup.encryptData(privateKey, encryptPassword);

		let backupFilename = privateKeyFile.name + '.backup'

		console.log('Filename: ' + backupFilename);

		// Save the witnessed transaction to a file
		const blob = new Blob([encryptedData], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = backupFilename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
}

async function recoverFile() {
	const encryptedPrivateKeyFile = document.getElementById('backupKeyFile').files[0];

	if (!encryptedPrivateKeyFile) {
		alert('Please select a private key backup file.');
		return;
	}

	let encryptedPrivateKey;

	console.log('Loading Encrypted Private Key From File')

	if (encryptedPrivateKeyFile != undefined) {
		if (encryptedPrivateKeyFile.text != undefined) {
			encryptedPrivateKey = await encryptedPrivateKeyFile.text();
		}
		else {
			console.log('Loading Private Key From File: Using FileReader');

			encryptedPrivateKey = await new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result);
				reader.onerror = () => reject(reader.error);
				reader.readAsText(encryptedPrivateKeyFile);
			});
		}
	}

	if (encryptedPrivateKey == undefined) {
		console.log('Error loading the Encyptred Private Key PEM File')
	}
	else {
		console.log('Private Key Loaded');

		decryptPassword = document.getElementById('decryptionPassword').value;

		const decryptedData = window.app.backup.decryptData(encryptedPrivateKey, decryptPassword);

		let keyFilename = encryptedPrivateKeyFile.name.replace('.backup', '');

		console.log('Filename: ' + keyFilename);

		// Save the witnessed transaction to a file
		const blob = new Blob([decryptedData], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = keyFilename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
}

window.app.checkIfOnline = function () {
	fetch('https://jsonplaceholder.typicode.com/posts/1')
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok ' + response.statusText);
			}
			return response.json();
		})
		.then(data => {
			$('#selfdriven-gov-app-status-message').html('<h4 class="font-weight-bold text-danger mt-3">This computer appears to be online!!</h4>');
		})
		.catch(error => {
			$('#selfdriven-gov-app-status-message').html('<div class="font-weight-bold text-success mt-1">This computer appears to be offline.  Good to use.</div>')
		});
}

// VIEW TRANSACTION

async function viewTransactionGovernanceFile()
{
	const transactionGovFile = document.getElementById('transactionGovernanceFile').files[0];

	if (!transactionGovFile) {
		alert('Please select a transaction file (.json).');
		return;
	}

	let transactionFileJSON;

	console.log('Loading Transaction JSON From File')

	if (transactionGovFile != undefined) {
		if (transactionGovFile.text != undefined) {
			transactionFileJSON = await transactionGovFile.text();
		}
		else {
			transactionFileJSON = await new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result);
				reader.onerror = () => reject(reader.error);
				reader.readAsText(transactionGovFile);
			});
		}
	}

	if (transactionFileJSON == undefined) {
		console.log('Error loading the JSON from File')
	}
	else {
		//console.log(transactionFileJSON)
		data = JSON.parse(transactionFileJSON);

		const cborHex = data.cborHex;

		const cborBytes = Uint8Array.from(cborHex.match(/.{2}/g).map(byte => parseInt(byte, 16)));

		// Decode the CBOR structure using cbor-web library to get accurate positions
		const decoded = cbor.decode(cborBytes.buffer, {useMaps: true});

		// Transaction structure: [txBody, witnesses, metadata, isValid]
		// We want the first element (txBody)
		const txBody = decoded[0];

		// Re-encode only txBody to exactly match the original CBOR encoding
		const txBodyEncoded = cbor.encode(txBody);

		// Compute Blake2b-256 hash
		const txHashBytes = blake2b(new Uint8Array(txBodyEncoded), null, 32);
		const txHashHex = Array.from(txHashBytes).map(b => b.toString(16).padStart(2, '0')).join('');

		console.log("Correct Tx Body Hash:", txHashHex);

		// Extract and decode CBOR hex data
		const cborBuffer = Uint8Array.from(data.cborHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
		const decodedData = CBOR.decode(cborBuffer.buffer);

		console.log(decodedData);

		const tranGovData = decodedData[0]['19'];

		console.log(tranGovData);

		const eccCCKeyBytes = Object.keys(tranGovData)[0];
		console.log(eccCCKeyBytes)

		const byteArray = eccCCKeyBytes.split(',').slice(1).map(byte => parseInt(byte, 10));
		const eccCCKeyHex = byteArray.map(b => b.toString(16).padStart(2, '0')).join('');

		//let eccCCKeyHex = bytesToHex(Object.keys(tranGovData)[0].split(','));

		console.log('CC Key Hex: ' + eccCCKeyHex);

		const eccCCKeyData = tranGovData[eccCCKeyBytes];
		const _eccCCKeyData = Object.keys(eccCCKeyData);

		console.log(_eccCCKeyData);

		const govActionsCount = _eccCCKeyData.length;
		console.log('govActionsCount', govActionsCount);

		var voteTxHash;
		var voteCCKey;

		let html = [];

		_eccCCKeyData.forEach(function (data, index)
		{
			const txIdBytes = Object.keys(eccCCKeyData)[index];

			const txIdByteArray = txIdBytes.split(',').map(byte => parseInt(byte, 10));
			const txIdHex = txIdByteArray.map(b => b.toString(16).padStart(2, '0')).join('');

			console.log("Gov Action Tx-ID:", txIdHex);

			const voteData = eccCCKeyData[txIdBytes];

			console.log("Vote Choice:", voteData[0]);
			console.log("Vote URL:", voteData[1][0]);

			let voteDecision = 'Unknown';

			if (voteData[0] == 0) {voteDecision = 'No  (Unconstitutional)'};
			if (voteData[0] == 1) {voteDecision = 'Yes (Constitutional)'};
			if (voteData[0] == 2) {voteDecision = 'Abstain'};
			
			const voteTransaction =
			{
				url: voteData[1][0],
				ccKey: eccCCKeyHex,
				govTxID: txIdHex.slice(0, -2),
				hash: txHashHex,
				vote: voteDecision
			}

			html.push('<div class="font-weight-bold">Gov Action Tx ID (Hash)</div>' +
					'<div class="mb-3">' + voteTransaction.govTxID + '</div>' +
					'<div class="font-weight-bold">Rational URL</div>' +
					'<div class="mb-3">' + voteTransaction.url + '</div>' +
					'<div class="font-weight-bold">Vote</div>' +
					'<div class="mb-3">' + voteTransaction.vote + '</div><hr/>');

			voteTxHash = voteTransaction.hash;
			voteCCKey = voteTransaction.ccKey;
		});

		html.push('<div class="font-weight-bold">Public Certificate Key</div>' +
					'<div class="mb-3">' + voteCCKey + '</div>' +
					'<div class="font-weight-bold">Vote Tx ID (Hash)</div>' +
					'<div class="">' + voteTxHash + '</div>')
		
		$('#view-transaction-notes-view')
			.html(html.join(''));
	}
}

// INIT

window.app.init = function () {
	console.log('selfdriven Gov App Version 1.0.0');

	document.getElementById('selfdriven-gov-app-create-x509-identity').addEventListener('click', function () {
		$('#selfdriven-gov-app-create-x509-identity').addClass('disabled');
		window.app.x509.generatePEMs();
		$('#selfdriven-gov-app-create-x509-csr').removeClass('disabled');
		$('#selfdriven-gov-app-create-x509-csr-view').removeClass('d-none');
	});

	document.getElementById('selfdriven-gov-app-create-x509-csr').addEventListener('click', function () {
		$('#selfdriven-gov-app-create-x509-csr').addClass('disabled');
		window.app.x509b.generateCSR();
	});

	app.checkIfOnline();
}

window.app.init();
