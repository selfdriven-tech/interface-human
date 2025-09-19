import { EntityOS } from '/site/2152/entityos.module.class-1.0.0.js';

const eos = new EntityOS();

// dSOCIETY | LEARN-BY-EXAMPLE

// Getting a "foot-hold" on PGP Crytography

// Code is free to use.
// It is only provided as to aid learning.

/* TODO
 - Show in UI - Add Encrypt/Decrypt Message // Add to cardanowallets.io (as a use of it for wallets that have backup: 'paper-pgp' - encrypt priv key wth AES encrypt and password.
 	new QRCode(document.getElementById("learn-view"), {
        text: 'xcLYBGexRM0BCAC9pOMwFJVMbw1Wtkq19mPuSM9U1jlHAFMemBzkEcGVFDKBy',
        width: 256,
        height: 256
    });
 - Create PGP Finger Print Index @ github for dsociety, selfdriven.social & cardanowallets.io (as a use of it)
*/

eos.add(
[
	{
		name: 'learn-cryptography-init',
		code: function ()
		{
			console.log('We have an opportunity to descentralise & rehumanise our society.');
			console.log('https://dsociety.io\n\n')
		}
	},
	{
		name: 'learn-cryptography-create-pgp',
		code: function ()
		{
			// Reference:
			// https://chatgpt.com/share/67a58d15-7590-800d-bde0-a3054ccd9a84

			console.log('Step 1 | Create PGP Keys.');

			const cryptoCurve = eos.get(
			{
				scope: 'learn-cryptography-create-pgp',
				context: 'curve',
				valueDefault: 'secp256r1'
			});

			console.log(cryptoCurve + ' Key Pair:');

			function generateCurveKeys(cryptoCurve)
			{
				let keys;

				if (cryptoCurve == 'secp256r1')
				{
					keys = window.crypto.subtle.generateKey(
					{
						name: "ECDSA",
						namedCurve: "P-256" // ECC Curve
					},
					true, // Keys should be exportable
					["sign", "verify"]);
				}

				if (cryptoCurve == 'rsa')
				{
					keys = window.crypto.subtle.generateKey(
					{
						name: "RSA-OAEP",
						modulusLength: 2048,
						publicExponent: new Uint8Array([1, 0, 1]),
						hash: "SHA-256"
					},
					true,
					["encrypt", "decrypt"]);
				}

				return keys;
			}

			 function exportKey(key, format)
			 {
				return window.crypto.subtle.exportKey(format, key)
					.then(exportedKey => new Uint8Array(exportedKey))
					.then(array => btoa(String.fromCharCode.apply(null, array)));
			}

			function generateAndConvertKeys(cryptoCurve)
			{
				let keyPair = {};

				generateCurveKeys(cryptoCurve)
					.then(function (keys)
					{
						keyPair = keys;
						return Promise.all([
							exportKey(keys.publicKey, "spki"),
							exportKey(keys.privateKey, "pkcs8")
						]);
					})
					.then(function(exportedKeys)
					{
						const publicKeyBase64 = exportedKeys[0];
						const privateKeyBase64 = exportedKeys[1];

						console.log('RSA Public Key (Base64):' + publicKeyBase64);
						console.log('RSA Private Key (Base64):' + privateKeyBase64);
						console.log('Converting to PGP...');

						return convertToPGP(publicKeyBase64, privateKeyBase64);
					})
					.then(function(pgpKeys)
					{
						return generatePGPFingerprint(pgpKeys.publicKey)
							.then(function(fingerprint)
							{
								let formattedFingerprint = fingerprint.match(/.{1,4}/g).join(" ");

								$('#learn-cryptography-pgp-view').html(
									'<h4 class="mt-4">PGP Public Key</h4><textarea style="font-family: monospace; height: 240px; width:100%">' + pgpKeys.publicKey + '</textarea>' +
									'</br><hr><h4>PGP Private Key</h4><textarea style="font-family: monospace; height: 240px; width:100%">' + pgpKeys.privateKey.armor() + '</textarea>' +
									'</br><hr><h4>PGP Fingerprint</h4><textarea style="font-family: monospace; height: 40px; width:100%">' + formattedFingerprint+ '</textarea>');
							});
					})
					.catch(error => console.error("Error:", error));
			}

			function convertToPGP(publicKeyBase64, privateKeyBase64) {
				if (!window.openpgp || !window.openpgp.generateKey) {
					console.error("OpenPGP.js is not loaded properly.");
					return Promise.reject("OpenPGP.js is not available.");
				}

				let convertedKeys = {};

				return window.openpgp.generateKey({
					type: "rsa",
					rsaBits: 2048,
					userIDs: [{ name: "User", email: "user@example.com" }],
					passphrase: "your-secure-passphrase"
				})
				.then(openpgpKey => {
					convertedKeys.publicKey = openpgpKey.publicKey;
					return window.openpgp.readPrivateKey({ armoredKey: openpgpKey.privateKey });
				})
				.then(privateKeyObject => {
					return window.openpgp.decryptKey({
						privateKey: privateKeyObject,
						passphrase: "your-secure-passphrase"
					});
				})
				.then(decryptedPrivateKey => {
					convertedKeys.privateKey = decryptedPrivateKey;
					return convertedKeys;
				})
				.catch(error => console.error("Error converting keys:", error));
			}

			function generatePGPFingerprint(publicKey) {
    if (!window.openpgp || !window.openpgp.readKey) {
        console.error("OpenPGP.js is not loaded properly.");
        return Promise.reject("OpenPGP.js is not available.");
    }

    return window.openpgp.readKey({ armoredKey: publicKey }) // Parse armored key
        .then(parsedKey => {
            console.log("Parsed Key Object:", parsedKey); // Debugging
            return parsedKey.getFingerprint().toUpperCase(); // Extract fingerprint
        })
        .catch(error => {
            console.error("Error generating fingerprint:", error);
        });
}

			generateAndConvertKeys(cryptoCurve);


//-- ENCRYPT / DECRYPT MESSAGE

/*

function encryptMessageWithFingerprint(fingerprint, publicKeysMap, message) {
    if (!window.openpgp || !window.openpgp.readKey || !window.openpgp.encrypt) {
        console.error("OpenPGP.js is not loaded properly.");
        return Promise.reject("OpenPGP.js is not available.");
    }

    // Step 1: Get the public key from the fingerprint
    let armoredPublicKey = publicKeysMap[fingerprint];

    if (!armoredPublicKey) {
        console.error("Public key not found for fingerprint:", fingerprint);
        return Promise.reject("Public key not found.");
    }

    console.log("Using Public Key:", armoredPublicKey);

    // Step 2: Convert armored key to OpenPGP.js key object
    return window.openpgp.readKey({ armoredKey: armoredPublicKey })
        .then(publicKey => {
            console.log("Parsed Public Key Object:", publicKey);
            
            // Step 3: Encrypt the message
            return window.openpgp.encrypt({
                message: window.openpgp.createMessage({ text: message }),
                encryptionKeys: publicKey
            });
        })
        .then(encryptedData => {
            console.log("Encrypted Message:", encryptedData);
            return encryptedData;
        })
        .catch(error => {
            console.error("Error encrypting message:", error);
        });
}

function decryptMessage(encryptedMessage, privateKeyArmored, passphrase) {
    if (!window.openpgp || !window.openpgp.readKey || !window.openpgp.decrypt) {
        console.error("OpenPGP.js is not loaded properly.");
        return Promise.reject("OpenPGP.js is not available.");
    }

    // Step 1: Convert armored private key to OpenPGP.js key object
    return window.openpgp.readPrivateKey({ armoredKey: privateKeyArmored })
        .then(privateKey => {
            // Step 2: Decrypt the private key using the passphrase
            return window.openpgp.decryptKey({
                privateKey: privateKey,
                passphrase: passphrase
            });
        })
        .then(decryptedPrivateKey => {
            console.log("Decrypted Private Key:", decryptedPrivateKey);

            // Step 3: Decrypt the message
            return window.openpgp.readMessage({ armoredMessage: encryptedMessage })
                .then(message => {
                    return window.openpgp.decrypt({
                        message: message,
                        decryptionKeys: decryptedPrivateKey
                    });
                });
        })
        .then(decryptedData => {
            console.log("Decrypted Message:", decryptedData.data);
            return decryptedData.data; // Return the decrypted message
        })
        .catch(error => {
            console.error("Error decrypting message:", error);
        });
}

//--- USE

// May put map up on github.com/selfdriven.foundation/dsociety/data/pgp-public-key-index.json

// Example map of fingerprints to public keys
let publicKeysMap = {
    "D4F2 3A1C 7D8A B9F4 8C9D 5E17 14B1 2F5D 3C56 9823": `-----BEGIN PGP PUBLIC KEY BLOCK-----
...
-----END PGP PUBLIC KEY BLOCK-----`
};

// Example fingerprint
let fingerprint = "D4F2 3A1C 7D8A B9F4 8C9D 5E17 14B1 2F5D 3C56 9823";

// Example private key (Must match the public key)
let privateKeyArmored = `-----BEGIN PGP PRIVATE KEY BLOCK-----
...
-----END PGP PRIVATE KEY BLOCK-----`;

// Passphrase used to unlock the private key
let passphrase = "your-secure-passphrase";

// Message to encrypt
let message = "Hello World";

// Encrypt the message
encryptMessageWithFingerprint(fingerprint, publicKeysMap, message)
    .then(encryptedMessage => {
        console.log("PGP Encrypted Message:", encryptedMessage);

        // Now decrypt the message
        return decryptMessage(encryptedMessage, privateKeyArmored, passphrase);
    })
    .then(decryptedMessage => {
        console.log("PGP Decrypted Message:", decryptedMessage);
    });

*/

//-- UI
			/*const keys = generateECCKeys(cryptoCurve);

			const ec = new elliptic.ec(cryptoCurve);
			const key = ec.genKeyPair();

			const publicKey = key.getPublic('hex');
			const privateKey = key.getPrivate('hex');

			console.log('Public Key (Hex):', publicKey);
			console.log('Private Key (Hex):', privateKey);

			eos.set(
			{
				scope: 'learn-ssi',
				context: 'public-key-hex',
				value: publicKey
			});

			const publicKeyBase58 = entityos._util.controller.invoke('learn-ssi-hex-to-base58', publicKey);

			console.log('Public Key (Base58):', publicKeyBase58);

			eos.set(
			{
				scope: 'learn-ssi',
				context: 'public-key-base58',
				value: publicKeyBase58
			});

			eos.set(
			{
				scope: 'learn-ssi',
				context: 'private-key-hex',
				value: privateKey
			});

			var learnSSIView = eos.view();

			learnSSIView.add(
			[
				'<div style="background-color:rgba(0,0,0,0.7); border-radius: 6px; padding:16px;" class="w-md-100 mt-2 mb-4">',
					'<h4 class="fw-bold mb-3 mt-1">Step 1 | Create ', cryptoCurve, ' Keys</h4>',
					'<div class="" style="color:#e8d5cf;">Public Key (Hex)</div>',
					'<div style="font-family: PT Mono, monospace; font-size: 1rem; color:#baadab; word-break: break-all;" class="mb-1">',
						publicKey,
					'</div>',
					'<div class="" style="color:#e8d5cf;">Public Key (Base58)</div>',
					'<div style="font-family: PT Mono, monospace; font-size: 1rem; color:#baadab; word-break: break-all;" class="mb-1">',
						publicKeyBase58,
					'</div>',
					'<div class="mt-4" style="color:#e8d5cf;">Private Key (Hex)</div>',
					'<div style="font-family: PT Mono, monospace; font-size: 1rem; color:#baadab; word-break: break-all;" class="mb-1">',
						privateKey,
					'</div>',
                '</div>'
			]);

            console.log('Step 2 | Create hash the public key as DID - HEX|64.');

            let publicKeyHashSHA256 = entityos._util.protect.hash({data: publicKey}).dataHashed;

			 let publicKeyHashBlake2b256 = entityos._util.protect.hash({data: publicKey, hashType: 'blake2b'}).dataHashed;

			console.log('Public Key Hash (SHA256):', publicKeyHashSHA256);
			console.log('Public Key Hash (Blake2b-256):', publicKeyHashBlake2b256);
			
			eos.set(
			{
				scope: 'learn-ssi',
				context: 'public-key-hex-hash',
				value: publicKeyHashSHA256
			});

			eos.set(
			{
				scope: 'learn-ssi',
				context: 'public-key-hex-hash-blake2b',
				value: publicKeyHashBlake2b256
			});

            learnSSIView.add(
			[
				'<div style="background-color:rgba(0,0,0,0.7); border-radius: 6px; padding:16px;" class="w-md-100 mt-4 mb-4">',
					'<h4 class="fw-bold mb-3 mt-1">Step 2 | Hash Public Key</h4>',
					'<div class="" style="color:#e8d5cf;">Public Key Hash (SHA256)</div>',
					'<div style="font-family: PT Mono, monospace; font-size: 1rem; color:#baadab; word-break: break-all;" class="mb-1">',
						publicKeyHashSHA256,
					'</div>',
					'<div class="" style="color:#e8d5cf;">Public Key Hash (Blake2b-256)</div>',
					'<div style="font-family: PT Mono, monospace; font-size: 1rem; color:#baadab; word-break: break-all;" class="mb-1">',
						publicKeyHashBlake2b256,
					'</div>',
                '</div>'
			]);

			const didCurveIndexes = 
			{
				secp256k1: '1',
				ed25519: '2'
			}

			const did = 'did:dsociety:' + didCurveIndexes[cryptoCurve] + ':1:' + publicKeyHashSHA256;

            console.log('DID:', did);

			eos.set(
			{
				scope: 'learn-ssi',
				context: 'did',
				value: did
			});

			const didDocument = eos.invoke('learn-ssi-create-did-doc');
			const didDocumentFormatted = JSON.stringify(didDocument, null, 2)

			learnSSIView.render('#learn-view')
			*/
		}
	},
    {
		name: 'learn-cryptography-hex-to-base58',
		code: function (data)
		{
			return eos.invoke('util-convert-hex-to-base58', data);
		}
	}
]);

$(function ()
{
	eos.invoke('learn-cryptography-init');
});
