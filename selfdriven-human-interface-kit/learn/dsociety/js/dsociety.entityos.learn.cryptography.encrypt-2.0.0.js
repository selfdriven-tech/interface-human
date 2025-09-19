import { EntityOS } from '/site/2152/entityos.module.class-1.0.0.js';

const eos = new EntityOS();

// dSOCIETY | LEARN-BY-EXAMPLE

// Getting a "foot-hold" on Merkle Trees

// Code is free to use.
// It is only provided as to aid learning.

/* TODO

https://chatgpt.com/share/67bd0f85-b1d8-800d-b41a-b2ec86764484

*/

eos.add(
	[
		{
			name: 'learn-cryptography-encrypt-init',
			code: function () {
				console.log('ZK Proofs.');
			}
		},
		{
			name: 'learn-cryptography-encrypt-data',
			code: function () {
				console.log('Generating proof...');

				function encryptData(password, jsonData) {
					const encoder = new TextEncoder();
					const keyMaterialPromise = window.crypto.subtle.importKey(
						"raw",
						encoder.encode(password),
						{ name: "PBKDF2" },
						false,
						["deriveKey"]
					);

					keyMaterialPromise.then(function (keyMaterial) {
						const salt = window.crypto.getRandomValues(new Uint8Array(16));
						const iv = window.crypto.getRandomValues(new Uint8Array(12));

						return window.crypto.subtle.deriveKey(
							{
								name: "PBKDF2",
								salt: salt,
								iterations: 100000,
								hash: "SHA-256",
							},
							keyMaterial,
							{ name: "AES-GCM", length: 256 },
							false,
							["encrypt", "decrypt"]
						).then(function (key) {
							const cborData = cborEncode(jsonData);
							return window.crypto.subtle.encrypt(
								{ name: "AES-GCM", iv: iv },
								key,
								cborData
							).then(function (encryptedData) {
								const storedData = {
									salt: Array.from(salt),
									iv: Array.from(iv),
									data: Array.from(new Uint8Array(encryptedData)),
								};
								localStorage.setItem("encryptedCBOR", JSON.stringify(storedData));
								console.log("Data saved to localStorage.");
							});
						});
					}).catch(function (error) {
						console.error("Encryption failed:", error);
					});
				}

				function decryptData(password) {
					const storedData = JSON.parse(localStorage.getItem("encryptedCBOR"));
					if (!storedData) {
						console.error("No data found.");
						return;
					}

					const encoder = new TextEncoder();
					const keyMaterialPromise = window.crypto.subtle.importKey(
						"raw",
						encoder.encode(password),
						{ name: "PBKDF2" },
						false,
						["deriveKey"]
					);

					keyMaterialPromise.then(function (keyMaterial) {
						const salt = new Uint8Array(storedData.salt);
						const iv = new Uint8Array(storedData.iv);
						const encryptedData = new Uint8Array(storedData.data);

						return window.crypto.subtle.deriveKey(
							{
								name: "PBKDF2",
								salt: salt,
								iterations: 100000,
								hash: "SHA-256",
							},
							keyMaterial,
							{ name: "AES-GCM", length: 256 },
							false,
							["decrypt"]
						).then(function (key) {
							return window.crypto.subtle.decrypt(
								{ name: "AES-GCM", iv: iv },
								key,
								encryptedData
							).then(function (decryptedData) {
								console.log("Decrypted Data:", cborDecode(decryptedData));
							}).catch(function (error) {
								console.error("Decryption failed:", error);
							});
						});
					}).catch(function (error) {
						console.error("Key derivation failed:", error);
					});
				}

				// Simple CBOR Encoding (No Module)
				//!!! CHANGE to JSON.encode
				function cborEncode(obj) {
					const jsonString = JSON.stringify(obj);
					const buffer = new TextEncoder().encode(jsonString);
					return buffer.buffer;
				}

				// Simple CBOR Decoding (No Module)
				//!!! CHANGE to JSON.decode
				function cborDecode(arrayBuffer) {
					const decoder = new TextDecoder();
					const jsonString = decoder.decode(arrayBuffer);
					return JSON.parse(jsonString);
				}

				// Example Usage
				const jsonData = { name: "Alice", age: 30, city: "Wonderland" };
				encryptData("myStrongPassword", jsonData);

				// Later, decrypt it:
				setTimeout(function () {
					decryptData("myStrongPassword");
				}, 2000);

			}
		}
	]);

$(function () {
	eos.invoke('learn-cryptography-zkproof-init');
});
