import { EntityOS } from '/site/2152/entityos.module.class-1.0.0.js';

const eos = new EntityOS();

// dSOCIETY | LEARN-BY-EXAMPLE

// Getting a "foot-hold" on Merkle Trees

// Code is free to use.
// It is only provided as to aid learning.

/* TODO

Implement MPT: https://chatgpt.com/share/67aeb5b8-d124-800d-92a2-e4263290eb7e

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
		name: 'learn-cryptography-merkletree-create',
		code: function ()
		{
			// Based on data
			var merkleTree = {};
			merkleTree.leaves = ["apple", "banana", "cherry", "orange"];

			function buildMerkleTree(leaves, algorithm)
			{
				if (leaves.length === 0) return Promise.resolve([]);

				var tree = [];
				return Promise.all(leaves.map(function(leaf) {
					return hashData(leaf, algorithm);
				})).then(function(level) {
					tree.push(level);
					function buildLevel() {
						if (level.length <= 1) {
							return tree;
						}
						var nextLevel = [];
						var promises = [];
						for (var i = 0; i < level.length; i += 2) {
							var left = level[i];
							var right = level[i + 1] || left;
							promises.push(hashData(left + right, algorithm).then(function(hash) {
								nextLevel.push(hash);
							}));
						}
						return Promise.all(promises).then(function() {
							level = nextLevel;
							tree.push(level);
							return buildLevel();
						});
					}
					return buildLevel();
				});
			}

			function generateMerkleTree()
			{
				const cryptoCurve = eos.get(
				{
					scope: 'learn-cryptography-merkletree',
					context: 'curve',
					valueDefault: 'sha256'
				});
				
				buildMerkleTree(merkleTree.leaves, cryptoCurve).then(function(tree)
				{
					merkleTree.tree = tree;
					merkleTree.root = merkleTree.tree[merkleTree.tree.length - 1][0];

					var learnMerkleTreeView = eos.view();

					learnMerkleTreeView.add(
					[
						'<div style="background-color:rgba(0,0,0,0.7); border-radius: 6px; padding:16px;" class="w-md-100 mt-2 mb-4">',
							'<h4 class="fw-bold mb-3 mt-1">Step 1 | Create Merkle Tree (', cryptoCurve, ')</h4>',
							'<div class="" style="color:#e8d5cf;">Dataset</div>',
							'<div style="font-family: PT Mono, monospace; font-size: 1rem; color:#baadab; word-break: break-all;" class="mb-1">',
								JSON.stringify(merkleTree.leaves),
							'</div>',
							'<div class="" style="color:#e8d5cf;">Root Hash</div>',
							'<div style="font-family: PT Mono, monospace; font-size: 1rem; color:#baadab; word-break: break-all;" class="mb-1">',
								merkleTree.root,
							'</div>',
							'<div class="" style="color:#e8d5cf;">Leaves</div>',
							'<div style="font-family: PT Mono, monospace; font-size: 1rem; color:#baadab; word-break: break-all;" class="mb-1">',
								JSON.stringify(merkleTree.tree),
							'</div>',
						'</div>'
					]);

					//$('#learn-cryptography-merkletree-view').html('Merkle Root (' + cryptoCurve + '): ' + merkleTree.root);

					learnMerkleTreeView.add(
					[
						'<div style="background-color:rgba(0,0,0,0.7); border-radius: 6px; padding:16px;" class="w-md-100 mt-2 mb-4">',
							'<h4 class="fw-bold mb-3 mt-1">Step 2 | Generate Proof for Data</h4>',
							'<div class="mb-1">',
								'<input class="form-control entityos-text border border-info" data-scope="learn-cryptography-merkletree-proof"',
									' data-context="leaf-data">',
							'</div>',	
						'</div>',
							'<button type="button" class="btn btn-sm btn-outline-primary text-light entityos-click mb-2"',
								' data-controller="learn-cryptography-merkletree-create-proof" style="width: 200px;">',
								'Generate a Proof ',
							'</button>',
						'<div id="learn-cryptography-merkletree-create-proof-view"></div>'
					]);

					learnMerkleTreeView.render('#learn-cryptography-merkletree-view');

					eos.set(
					{
						scope: 'learn-cryptography-merkletree',
						context: 'merkleTree',
						value: merkleTree
					});

					console.log(merkleTree);
					console.table(merkleTree);

				});
			}

			generateMerkleTree();
		}
	},
		{
		name: 'learn-cryptography-merkletree-create-proof',
		code: function ()
		{
			var merkleTree = eos.get(
			{
				scope: 'learn-cryptography-merkletree',
				context: 'merkleTree'
			});

			let merkletreeProof = eos.get(
			{
				scope: 'learn-cryptography-merkletree-proof',
				valueDefault: {}
			});

			const cryptoCurve = eos.get(
			{
				scope: 'learn-cryptography-merkletree-create',
				context: 'curve',
				valueDefault: 'sha256'
			});

			function generateProof(leaf, algorithm)
			{
				return hashData(leaf, algorithm).then(function(hashedLeaf)
				{
					merkletreeProof.hashedLeaf = hashedLeaf;
					console.log(hashedLeaf);

					var index = _.first(merkleTree.tree).indexOf(hashedLeaf);
					
					if (index != -1)
					{
						var proof = [];
						for (var i = 0; i < merkleTree.tree.length - 1; i++) {
							var level = merkleTree.tree[i];
							var isRightNode = index % 2 !== 0;
							var pairIndex = isRightNode ? index - 1 : index + 1;

							if (pairIndex < level.length) {
								proof.push({ hash: level[pairIndex], position: isRightNode ? "left" : "right" });
							}

							index = Math.floor(index / 2);
						}
					}

					merkletreeProof.proof = proof;

					if (!proof)
					{
						$('#learn-cryptography-merkletree-create-proof-view').html('Data not found in the dataset.');
					}
					else
					{
						var learnMerkleTreeProofView = eos.view();

						learnMerkleTreeProofView.add(
						[
							'<div style="background-color:rgba(0,0,0,0.7); border-radius: 6px; padding:16px;" class="w-md-100 mt-2 mb-4">',
								'<h4 class="fw-bold mb-3 mt-1">Step 3 | Verify Data & Proof</h4>',
								'<div class="" style="color:#e8d5cf;">Data</div>',
								'<div class="mb-1">',
									'<input class="form-control entityos-text border border-info" data-scope="learn-cryptography-merkletree-proof-verify"',
										' data-context="leaf-data">',
								'</div>',	
								'<div class="" style="color:#e8d5cf;">Proof</div>',
								'<div style="font-family: PT Mono, monospace; font-size: 1rem; color:#baadab; word-break: break-all;" class="mb-1">',
									JSON.stringify(proof),
								'</div>',
							'</div>',
							'<button type="button" class="btn btn-sm btn-outline-primary text-light entityos-click mb-2"',
								' data-controller="learn-cryptography-merkletree-verify-proof" style="width: 200px;">',
								'Verify Proof',
							'</button>',
							'<div id="learn-cryptography-merkletree-verify-proof-view"></div>'
						]);

						learnMerkleTreeProofView.render('#learn-cryptography-merkletree-create-proof-view');
					}

				 	eos.set(
					{
						scope: 'learn-cryptography-merkletree-proof',
						context: 'proof',
						value: merkletreeProof.proof
					});

					return proof;
				});
			}

			var inputLeaf = _.get(merkletreeProof, 'leaf-data');

			console.log(cryptoCurve);
			console.log(inputLeaf);

			generateProof(inputLeaf, cryptoCurve);
		}
	},
	{
		name: 'learn-cryptography-merkletree-verify-proof',
		code: function ()
		{
			var merkleTree = eos.get(
			{
				scope: 'learn-cryptography-merkletree',
				context: 'merkleTree'
			});

			let merkletreeProof = eos.get(
			{
				scope: 'learn-cryptography-merkletree-proof'
			});

			let merkletreeProofVerify = eos.get(
			{
				scope: 'learn-cryptography-merkletree-proof-verify'
			});

			const cryptoCurve = eos.get(
			{
				scope: 'learn-cryptography-merkletree',
				context: 'curve',
				valueDefault: 'sha256'
			});

			function verifyMerkleProof(leaf, proof, root, algorithm)
			{
				return hashData(leaf, algorithm).then(function(hash) {
					function processProofStep(i) {
						if (i >= proof.length) {
							return hash === root;
						}
						var siblingHash = proof[i].hash;
						var position = proof[i].position;

						return hashData(position === "left" ? (siblingHash + hash) : (hash + siblingHash), algorithm)
							.then(function(newHash) {
								hash = newHash;
								return processProofStep(i + 1);
							});
					}
					return processProofStep(0);
				});
			}

			const inputLeaf = _.get(merkletreeProofVerify, 'leaf-data');
			const proof = _.get(merkletreeProof, 'proof');

			verifyMerkleProof(inputLeaf, proof, merkleTree.root, cryptoCurve).then(function(isValid)
			{
				//$('#learn-cryptography-merkletree-verify-proof-view').html(isValid ? "Valid Proof!" : "Invalid Proof!");

				var learnMerkleTreeProofVerifyView = eos.view();

				if (!isValid)
				{
					learnMerkleTreeProofVerifyView.add(
					[
						'<div style="background-color:rgba(0,0,0,0.7); border-radius: 6px; padding:16px;" class="w-md-100 mt-2 mb-4">',
							'<h4 class="fw-bold mb-3 mt-1 text-danger">Step 4 | NOT VERIFIED</h4>',
							'<div class="mb-1">',
								'<div style="font-family: PT Mono, monospace; font-size: 1rem; color:#baadab; word-break: break-all;" class="mb-1">',
									'This is not a valid data, proof, root-hash combination!',
								'</div>',
							'</div>',	
							'<div class="" style="color:#e8d5cf;">Curve</div>',
							'<div class="mb-1">',
								'<div style="font-family: PT Mono, monospace; font-size: 1rem; color:#baadab; word-break: break-all;" class="mb-1">',
									cryptoCurve,
								'</div>',
							'</div>',	
							'<div class="" style="color:#e8d5cf;">Data</div>',
							'<div class="mb-1">',
								'<div style="font-family: PT Mono, monospace; font-size: 1rem; color:#baadab; word-break: break-all;" class="mb-1">',
									inputLeaf,
								'</div>',
							'</div>',	
						'</div>'
					]);
				}
				else
				{
					learnMerkleTreeProofVerifyView.add(
					[
						'<div style="background-color:rgba(0,0,0,0.7); border-radius: 6px; padding:16px;" class="w-md-100 mt-2 mb-4">',
							'<h4 class="fw-bold mb-3 mt-1 text-success">Step 4 | Verified Data & Proof</h4>',
							'<div class="" style="color:#e8d5cf;">Curve</div>',
							'<div class="mb-1">',
								'<div style="font-family: PT Mono, monospace; font-size: 1rem; color:#baadab; word-break: break-all;" class="mb-1">',
									cryptoCurve,
								'</div>',
							'</div>',	
							'<div class="" style="color:#e8d5cf;">Data</div>',
							'<div class="mb-1">',
								'<div style="font-family: PT Mono, monospace; font-size: 1rem; color:#baadab; word-break: break-all;" class="mb-1">',
									inputLeaf,
								'</div>',
							'</div>',	
							'<div class="" style="color:#e8d5cf;">Root Hash</div>',
								'<div style="font-family: PT Mono, monospace; font-size: 1rem; color:#baadab; word-break: break-all;" class="mb-1">',
									merkleTree.root,
								'</div>',
							'<div class="" style="color:#e8d5cf;">Proof</div>',
							'<div style="font-family: PT Mono, monospace; font-size: 1rem; color:#baadab; word-break: break-all;" class="mb-1">',
								JSON.stringify(proof),
							'</div>',
							'<hr/>',
							'<pre style="font-family: PT Mono, monospace; font-size: 1rem; color:#baadab; word-break: break-all;" class="mb-1">',
								JSON.stringify(
								{
									"curve": cryptoCurve,
									"data": inputLeaf,
									"root": merkleTree.root,
									"proof": proof
								}, null, 2),
							'</div>',

						'</div>',
						'<button type="button" class="d-none btn btn-sm btn-outline-primary text-light entityos-click mb-2"',
							' data-controller="learn-cryptography-merkletree-verify-proof" style="width: 400px;">',
							'Download as File (JSON)',
						'</button>',
						'<div id="learn-cryptography-merkletree-verify-proof-download-view"></div>'
					]);
				}

				learnMerkleTreeProofVerifyView.render('#learn-cryptography-merkletree-verify-proof-view');
			});
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

function hashData(data, algorithm)
{
	var encoder = new TextEncoder();
	var encodedData = encoder.encode(data);

	if (algorithm == 'sha256')
	{
		return crypto.subtle.digest('SHA-256', encodedData).then(function(hashBuffer) {
			return Array.from(new Uint8Array(hashBuffer))
				.map(function(b) { return b.toString(16).padStart(2, '0'); })
				.join("");
		});
	} 
	else if (algorithm == 'sha3256') {
		return Promise.resolve(sha3_256(data)); // Using js-sha3
	} 
	else if (algorithm === "blake2b") {
        var hashBytes = blake2b(encodedData, null, 32); // 32-byte output
        return Promise.resolve(Array.from(hashBytes).map(b => b.toString(16).padStart(2, "0")).join(""));
    }
}

$(function ()
{
	eos.invoke('learn-cryptography-init');
});
