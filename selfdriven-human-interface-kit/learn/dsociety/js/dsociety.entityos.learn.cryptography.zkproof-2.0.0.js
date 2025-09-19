import { EntityOS } from '/site/2152/entityos.module.class-1.0.0.js';

const eos = new EntityOS();

// dSOCIETY | LEARN-BY-EXAMPLE

// Getting a "foot-hold" on Merkle Trees

// Code is free to use.
// It is only provided as to aid learning.

/* TODO

*/

eos.add(
[
	{
		name: 'learn-cryptography-zkproof-init',
		code: function ()
		{
			console.log('ZK Proofs.');
		}
	},
	{
		name: 'learn-cryptography-zkproof-create',
		code: function ()
		{
			console.log('Generating proof...');

			const input = { x: 3, y: 7 }; // Proving that x + y = 10

			let provingKey, verificationKey;

			// Fetch proving and verification keys
			fetch("proving_key.json")
				.then(res => res.json())
				.then(pk => {
					provingKey = pk;
					return fetch("verification_key.json");
				})
				.then(res => res.json())
				.then(vk => {
					verificationKey = vk;

					// Create witness (simulated private computation)
					const witness = { x: input.x, y: input.y, sum: input.x + input.y };

					// Generate proof using snarkjs
					return snarkjs.groth16.fullProve(witness, "circuit.wasm", provingKey);
				})
				.then(({ proof, publicSignals }) => {
					output.innerText = `Proof: ${JSON.stringify(proof, null, 2)}\n\nPublic Signals: ${JSON.stringify(publicSignals, null, 2)}`;

					// Verify the proof
					return snarkjs.groth16.verify(verificationKey, publicSignals, proof);
				})
				.then(verified => {
					if (verified) {
						output.innerText += "\n\n✅ Proof verified successfully!";
					} else {
						output.innerText += "\n\n❌ Proof verification failed!";
					}
				})
				.catch(err => {
					output.innerText = "Error: " + err.message;
					console.error(err);
				});
        
		}
	}
]);

$(function ()
{
	eos.invoke('learn-cryptography-zkproof-init');
});
