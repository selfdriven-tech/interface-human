import { EntityOS } from '/site/2152/entityos.module.class-1.0.0.js';

const eos = new EntityOS();

// dSOCIETY | LEARN-BY-EXAMPLE

// Getting a "foot-hold" on twith Self-Sovereign Identity (SSI) tech by creating a DID.

// Code is free to use.
// It is only provided as to aid learning .

eos.add(
[
	{
		name: 'learn-ssi-init',
		code: function ()
		{
			console.log('We have an opportunity to descentralise & rehumanise our society.');
			console.log('https://dsociety.io\n\n')
		}
	},
	{
		name: 'learn-ssi-create-did',
		code: function ()
		{
			//Examples:
			//https://github.com/IAMXID/did-spec-registries/tree/main/methods

			console.log('Step 1 | Create DID.');

			const cryptoCurve = eos.get(
			{
				scope: 'learn-ssi-create-did',
				context: 'curve',
				valueDefault: 'secp256k1'
			});

			console.log(cryptoCurve + ' Key Pair:')

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

            learnSSIView.add(
			[
				'<div style="background-color:rgba(0,0,0,0.7); border-radius: 6px; padding:16px;" class="w-md-100 mt-4 mb-4">',
					'<h4 class="fw-bold mb-3 mt-1">Step 3 | DID based on dSociety SSI Method Specification</h4>',
					'<div class="" style="color:#e8d5cf;">Decentralised ID (DID) | Public Key | SHA256 Hash | Hex</div>',
					'<div style="font-family: PT Mono, monospace; font-size: 1rem; color:#baadab; word-break: break-all;" class="mb-1">',
						did,
					'</div>',
					'<div class="mt-2" style="color:#e8d5cf;">DID Document</div>',
					'<div style="font-family: PT Mono, monospace; font-size: 1rem; color:#baadab; word-break: break-all;" class="mb-1">',
						'<pre>',
						didDocumentFormatted,
						'</pre>',
					'</div>',
                '</div>'
			]);

            // Create proof - hash the message and then sign/encrypt with secp

            learnSSIView.add(
			[
				'<div style="background-color:rgba(0,0,0,0.7); border-radius: 6px; padding:16px;" class="w-md-100 mt-2 mb-4">',
					'<h4 class="fw-bold mb-3 mt-1">Step 4 | Hash & Sign Data (e.g. Verifiable Credential)</h4>',
					'<div class="mb-1">',
						'<textarea id="url-text" class="form-control entityos-text w-100 border border-info"',
                            ' style="height:180px;" data-scope="learn-ssi"',
                            ' data-context="data-to-sign"></textarea>',
                    '</div>',
                '</div>',
				'<button type="button" class="btn btn-sm btn-outline-primary text-light entityos-click mb-2"',
					' data-controller="learn-ssi-create-signature" style="width: 200px;">',
					'Create Signature',
				'</button>',
				'<div id="learn-ssi-create-signature-view"></div>'
			]);

			learnSSIView.render('#learn-view')
		}
	},
	{
		name: 'learn-ssi-create-did-doc',
		code: function ()
		{
			const cryptoCurve = eos.get(
			{
				scope: 'learn-ssi-create-did',
				context: 'curve',
				valueDefault: 'secp256k1'
			});

			const data = eos.get(
			{
				scope: 'learn-ssi'
			});

			const verificationKeyTypes = {
				secp256k1: 'EcdsaSecp256k1VerificationKey2019',
				ed25519: 'Ed25519SignatureAuthentication2018'
			}

			const multibasePrefixes =
			{
				base58: 'z',
				base16: 'f',
				hex: 'f',
				base32: 'b'
			}
			
			const curveSSISpecs = 
			[
				{
					curve: 'secp256k1',
					keyVerificationType: 'EcdsaSecp256k1VerificationKey2019',
					keyAuthenticationType: 'EcdsaSecp256k1SignatureAuthentication2019',
					publicKey:
					{
						name: 'publicKeyHex',
						encoding: 'hex'
					}
				},
				{
					curve: 'ed25519',
					keyVerificationType: 'Ed25519VerificationKey2020',
					keyAuthenticationType: 'Ed25519SignatureAuthentication2020',
					publicKey:
					{
						name: 'publicKeyMultibase',
						encoding: 'base58'
					}
				}
			]

			const curveSSISpec = _.find(curveSSISpecs, function (spec)
			{
				return (spec.curve == cryptoCurve)
			});

			let didDocument = {error: 'Not a valid crypto curve'}

			if (curveSSISpec != undefined)
			{
				didDocument = {
					'@context': 'https://www.w3.org/ns/did/v1',
					id: data.did,
					verificationMethod:
					[
						{
							id: data.did + '#keys-1',
							type: curveSSISpec.keyVerificationType,
							controller: data.did
					}],
					authentication: [{
						type: curveSSISpec.keyAuthenticationType,
						publicKey: data.did + '#keys-1'
					}],
					service: []
				}

				_.each(didDocument.verificationMethod, function (method)
				{
					if (_.includes(curveSSISpec.publicKey.name, 'Multibase'))
					{
						method[curveSSISpec.publicKey.name] =
							multibasePrefixes[curveSSISpec.publicKey.encoding] +
							data['public-key-' + curveSSISpec.publicKey.encoding];
					}
					else
					{
						method[curveSSISpec.publicKey.name] = data['public-key-' + curveSSISpec.publicKey.encoding];
					}
				});

				didDocument.service.push(
				{
					id: data.did + '#did-resolver',
					type: 'DIDResolver',
					serviceEndpoint: 'http://ssi.dsociety.io'
				});
			}


			eos.set(
			{
				scope: 'learn-ssi',
				context: 'did-document',
				value: didDocument
			});

			console.log('DID Document:');
			console.log(JSON.stringify(didDocument, null, 2));

			return didDocument
		}
	},
    {
		name: 'learn-ssi-create-signature',
		code: function ()
		{
			const data = eos.get(
			{
				scope: 'learn-ssi'
			});

			console.log(data);

			let dataHash = entityos._util.protect.hash({data: data['data-to-sign']}).dataHashed;

			const cryptoCurve = eos.get(
			{
				scope: 'learn-ssi-create-did',
				context: 'curve',
				valueDefault: 'secp256k1'
			});

			const ec = new elliptic.ec(cryptoCurve);
			const keyPair = ec.keyFromPrivate(data['private-key-hex']);
			const signature = keyPair.sign(dataHash, { canonical: true }); // Use canonical for better compatibility

			eos.set(
			{
				scope: 'learn-ssi',
				context: 'signature',
				value: signature
			});

			console.log('Signature:', signature.toDER('hex')); // DER encoding for verification

			let learnSSIView = eos.view();

			learnSSIView.add(
			[
				'<div style="background-color:rgba(0,0,0,0.7); border-radius: 6px; padding:16px;" class="w-md-100 mt-2 mb-4">',
					'<h4 class="fw-bold mb-3 mt-1">Step 5 | ', cryptoCurve, ' Private Key Signature of SHA256 Hash of the Data</h4>',
					'<div class="" style="color:#e8d5cf;">Signature</div>',
					'<div style="font-family: PT Mono, monospace; font-size: 1rem; color:#baadab; word-break: break-all;" class="mb-1">',
						signature.toDER('hex'),
					'</div>',
                '</div>',
				'<button type="button" class="btn btn-sm btn-outline-primary text-light entityos-click mb-2"',
					' data-controller="learn-ssi-verify-signature" style="width: 200px;">',
					'Verify Signature',
				'</button>',
				'<div id="learn-ssi-verify-signature-view"></div>'
			]);

			learnSSIView.render('#learn-ssi-create-signature-view')
		}
	},
	 {
		name: 'learn-ssi-verify-signature',
		code: function ()
		{
			const data = eos.get(
			{
				scope: 'learn-ssi'
			});

			console.log(data);

			let dataHashed = entityos._util.protect.hash({data: data['data-to-sign']}).dataHashed;

			const cryptoCurve = eos.get(
			{
				scope: 'learn-ssi-create-did',
				context: 'curve',
				valueDefault: 'secp256k1'
			});

			const ec = new elliptic.ec(cryptoCurve);

			 const keyBytes = new Uint8Array(data['public-key-hex'].match(/[\da-f]{2}/gi).map(byte => parseInt(byte, 16)));
            // Assuming the key format is correct, adjust based on your DER format
            const publicKey = ec.keyFromPublic(keyBytes, 'hex');
			const verified = ec.verify(dataHashed, data.signature, publicKey);

			console.log('Verified:', verified);

			let learnSSIView = eos.view();

			learnSSIView.add(
			[
				'<div style="background-color:rgba(0,0,0,0.7); border-radius: 6px; padding:16px;" class="w-md-100 mt-2 mb-4">',
					'<h4 class="fw-bold mb-3 mt-1">Step 6 | Verify Data with Signature & ', cryptoCurve, ' Public Key</h4>',
					'<div class="" style="color:#e8d5cf;">It will always verify in this learning example.</div>',
					'<div class="" style="color:#e8d5cf;">If you want to test it not verifying then change the data in Step 4 and then click Verify Signature.</div>',

					'<div style="font-family: PT Mono, monospace; font-size: 1rem; color:#baadab; word-break: break-all;" class="mb-1">',
						(verified?'Verified':'Not Verified'),
					'</div>',
                '</div>',
			]);

			learnSSIView.render('#learn-ssi-verify-signature-view')
		}
	},
    {
		name: 'learn-ssi-hex-to-base58',
		code: function (data)
		{
			return eos.invoke('util-convert-hex-to-base58', data);
		}
	}
]);

$(function ()
{
	eos.invoke('learn-ssi-init');
});
