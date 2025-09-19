import { EntityOS } from '/site/2152/entityos.module.class-1.0.0.js';

const eos = new EntityOS();

// dSOCIETY | LEARN-BY-EXAMPLE

// Getting a "foot-hold" on Merkle Trees

// Code is free to use.
// It is only provided as to aid learning.

/* TODO

Implement MPT: https://chatgpt.com/share/67aeb5b8-d124-800d-92a2-e4263290eb7e


// Patricia node creation
function createNode(key = "", value = "") {
  return { key, value, children: {}, nodeHash: null };
}

// Insert function
function insert(root, key, value) {
  let node = root;

  while (true) {
    let found = false;
    for (const k in node.children) {
      const commonPrefixLength = getCommonPrefixLength(k, key);
      if (commonPrefixLength > 0) {
        if (commonPrefixLength < k.length) {
          const existingChild = node.children[k];
          const newKeySuffix = k.slice(commonPrefixLength);
          const newChild = createNode(newKeySuffix, existingChild.value);
          newChild.children = existingChild.children;

          node.children[k.slice(0, commonPrefixLength)] = newChild;
          delete node.children[k];
        }

        key = key.slice(commonPrefixLength);
        node = node.children[k.slice(0, commonPrefixLength)];
        found = true;
        break;
      }
    }

    if (!found) {
      node.children[key] = createNode(key, value);
      break;
    }
  }
}

// Calculate hash function
function calculateHash(node) {
  const keys = Object.keys(node.children).sort();
  const childHashPromises = keys.map(k => calculateHash(node.children[k]));

  return Promise.all(childHashPromises).then(childHashes => {
    const dataToHash = node.key + node.value + childHashes.join("");
    return hash(dataToHash).then(result => {
      node.nodeHash = result;
      return node.nodeHash;
    });
  });
}

// Generate proof
function generateProof(node, key, path = []) {
  for (const k in node.children) {
    const commonPrefixLength = getCommonPrefixLength(k, key);
    if (commonPrefixLength === k.length) {
      path.push({ key: k, hash: node.children[k].nodeHash });
      if (commonPrefixLength === key.length) {
        return Promise.resolve(path);
      }
      return generateProof(node.children[k], key.slice(commonPrefixLength), path);
    }
  }
  return Promise.resolve(null);
}

// Verify proof
function verifyProof(proof, rootHash, value) {
  if (!proof) return Promise.resolve(false);

  let computedHashPromise = hash(proof[proof.length - 1].key + value);

  for (let i = proof.length - 2; i >= 0; i--) {
    computedHashPromise = computedHashPromise.then(computedHash => {
      return hash(proof[i].key + "" + computedHash);
    });
  }

  return computedHashPromise.then(computedHash => computedHash === rootHash);
}

// Example usage
const tree = createNode();

insert(tree, "apple", "fruit");
insert(tree, "applet", "software");
insert(tree, "banana", "fruit");

calculateHash(tree).then(rootHash => {
  console.log("Root hash:", rootHash);

  generateProof(tree, "apple").then(proof => {
    console.log("Proof for apple:", proof);

    verifyProof(proof, rootHash, "fruit").then(isValid => {
      console.log("Is proof valid?", isValid);
    });
  });
});

*/
// Patricia Merkle Tree Implementation with configurable radix
function createPatriciaMerkleTree(radix = 16) {
  // Node types
  const NodeType = {
    BRANCH: 'branch',
    EXTENSION: 'extension',
    LEAF: 'leaf'
  };
  
  // State
  let root = null;
  const nodeMap = new Map(); // Maps hash to node
  
  // Utility: Convert string key to digit array (in the given radix)
  function keyToDigits(key) {
    if (typeof key !== 'string') key = String(key);
    
    const bytes = new TextEncoder().encode(key);
    const digits = [];
    // Determine the number of digits per byte.
    const digitsPerByte = Math.ceil(Math.log(256) / Math.log(radix));
    
    for (let i = 0; i < bytes.length; i++) {
      // Convert the byte to a string in the given radix and pad with zeros.
      let digitStr = bytes[i].toString(radix);
      digitStr = digitStr.padStart(digitsPerByte, '0');
      // Convert each character back to a number
      for (let char of digitStr) {
        digits.push(parseInt(char, radix));
      }
    }
    
    return digits;
  }
  
  // Utility: Find common prefix length between two arrays
  function commonPrefixLength(a, b) {
    const minLength = Math.min(a.length, b.length);
    for (let i = 0; i < minLength; i++) {
      if (a[i] !== b[i]) return i;
    }
    return minLength;
  }
  
  // Hash a string using SHA-256
  function sha256(str) {
    const data = new TextEncoder().encode(str);
    return window.crypto.subtle.digest('SHA-256', data)
      .then(buffer => {
        const hashArray = Array.from(new Uint8Array(buffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      });
  }
  
  // Serialize a node to a JSON string
  function serializeNode(node) {
    if (!node) return 'null';
    return JSON.stringify(node);
  }
  
  // Create a branch node (with radix branches, one for each digit)
  function createBranchNode() {
    return {
      type: NodeType.BRANCH,
      branches: Array(radix).fill(null),
      value: null
    };
  }
  
  // Create an extension node (shared path prefix)
  function createExtensionNode(path, nextHash) {
    return {
      type: NodeType.EXTENSION,
      path: path,
      next: nextHash
    };
  }
  
  // Create a leaf node (terminal node with value)
  function createLeafNode(path, value) {
    return {
      type: NodeType.LEAF,
      path: path,
      value: value
    };
  }
  
  // Hash a node and store it in the node map
  function hashNode(node) {
    if (!node) return Promise.resolve(null);
    
    const serialized = serializeNode(node);
    return sha256(serialized)
      .then(hash => {
        nodeMap.set(hash, node);
        return hash;
      });
  }
  
  // Insert a key-value pair into the trie
  function insert(key, value) {
    const digits = keyToDigits(key);
    
    // Recursive helper function to insert at a specific node
    function insertAtNode(nodeHash, path) {
      // Case 1: Empty trie or null node - create a leaf
      if (!nodeHash) {
        const leaf = createLeafNode(path, value);
        return hashNode(leaf);
      }
      
      const node = nodeMap.get(nodeHash);
      
      // Case 2: Branch node
      if (node.type === NodeType.BRANCH) {
        // If at the end of the path, store value in the branch
        if (path.length === 0) {
          node.value = value;
          return hashNode(node);
        }
        
        // Otherwise, continue down the appropriate branch
        const digit = path[0];
        const remainingPath = path.slice(1);
        
        return insertAtNode(node.branches[digit], remainingPath)
          .then(newChildHash => {
            node.branches[digit] = newChildHash;
            return hashNode(node);
          });
      }
      
      // Case 3: Extension node
      if (node.type === NodeType.EXTENSION) {
        const prefix = commonPrefixLength(node.path, path);
        
        // Case 3a: No common prefix - convert to branch
        if (prefix === 0) {
          const branch = createBranchNode();
          
          // Add existing extension to the branch
          if (node.path.length === 1) {
            branch.branches[node.path[0]] = node.next;
          } else {
            // Create new extension with remaining path
            const newExt = createExtensionNode(node.path.slice(1), node.next);
            return hashNode(newExt)
              .then(newExtHash => {
                branch.branches[node.path[0]] = newExtHash;
                
                // Add new path to the branch
                if (path.length === 0) {
                  branch.value = value;
                  return hashNode(branch);
                } else {
                  const newLeaf = createLeafNode(path.slice(1), value);
                  return hashNode(newLeaf)
                    .then(leafHash => {
                      branch.branches[path[0]] = leafHash;
                      return hashNode(branch);
                    });
                }
              });
          }
        } 
        // Case 3b: Extension path is a prefix of the search path
        else if (prefix === node.path.length) {
          // Continue to the next node with remaining path
          return insertAtNode(node.next, path.slice(prefix))
            .then(newNextHash => {
              node.next = newNextHash;
              return hashNode(node);
            });
        } 
        // Case 3c: Partial match - split the extension
        else {
          const sharedPrefix = node.path.slice(0, prefix);
          const extensionRemainder = node.path.slice(prefix);
          const pathRemainder = path.slice(prefix);
          
          // Create a branch for the split point
          const branch = createBranchNode();
          
          // Add extension remainder to branch
          if (extensionRemainder.length === 1) {
            branch.branches[extensionRemainder[0]] = node.next;
          } else {
            const newExt = createExtensionNode(extensionRemainder.slice(1), node.next);
            return hashNode(newExt)
              .then(newExtHash => {
                branch.branches[extensionRemainder[0]] = newExtHash;
                
                // Add new path to branch
                if (pathRemainder.length === 0) {
                  branch.value = value;
                  return hashNode(branch)
                    .then(branchHash => {
                      if (sharedPrefix.length === 0) {
                        return branchHash;
                      } else {
                        const topExt = createExtensionNode(sharedPrefix, branchHash);
                        return hashNode(topExt);
                      }
                    });
                } else {
                  const newLeaf = createLeafNode(pathRemainder.slice(1), value);
                  return hashNode(newLeaf)
                    .then(leafHash => {
                      branch.branches[pathRemainder[0]] = leafHash;
                      return hashNode(branch)
                        .then(branchHash => {
                          if (sharedPrefix.length === 0) {
                            return branchHash;
                          } else {
                            const topExt = createExtensionNode(sharedPrefix, branchHash);
                            return hashNode(topExt);
                          }
                        });
                    });
                }
              });
          }
        }
      }
      
      // Case 4: Leaf node
      if (node.type === NodeType.LEAF) {
        const prefix = commonPrefixLength(node.path, path);
        
        // Case 4a: Exact match - update value
        if (prefix === node.path.length && prefix === path.length) {
          node.value = value;
          return hashNode(node);
        }
        
        // Case 4b: Need to create a branch
        const branch = createBranchNode();
        
        // Partial match or no match
        if (prefix < node.path.length || prefix < path.length) {
          // Add existing leaf to the branch
          if (node.path.length === prefix) {
            branch.value = node.value;
          } else {
            const leafDigit = node.path[prefix];
            const leafRemaining = node.path.slice(prefix + 1);
            
            const newLeaf = createLeafNode(leafRemaining, node.value);
            return hashNode(newLeaf)
              .then(leafHash => {
                branch.branches[leafDigit] = leafHash;
                
                // Add new path to the branch
                if (path.length === prefix) {
                  branch.value = value;
                  return hashNode(branch)
                    .then(branchHash => {
                      if (prefix === 0) {
                        return branchHash;
                      } else {
                        const ext = createExtensionNode(path.slice(0, prefix), branchHash);
                        return hashNode(ext);
                      }
                    });
                } else {
                  const pathDigit = path[prefix];
                  const pathRemaining = path.slice(prefix + 1);
                  
                  const pathLeaf = createLeafNode(pathRemaining, value);
                  return hashNode(pathLeaf)
                    .then(pathHash => {
                      branch.branches[pathDigit] = pathHash;
                      return hashNode(branch)
                        .then(branchHash => {
                          if (prefix === 0) {
                            return branchHash;
                          } else {
                            const ext = createExtensionNode(path.slice(0, prefix), branchHash);
                            return hashNode(ext);
                          }
                        });
                    });
                }
              });
          }
        }
        
        return hashNode(branch);
      }
      
      // Should never reach here
      return Promise.resolve(null);
    }
    
    return insertAtNode(root, digits)
      .then(newRoot => {
        root = newRoot;
        return root;
      });
  }
  
  // Get a value by key
  function get(key) {
    if (!root) return Promise.resolve(null);
    
    const digits = keyToDigits(key);
    
    // Helper function to get value from a specific node
    function getFromNode(nodeHash, path) {
      if (!nodeHash) return Promise.resolve(null);
      
      const node = nodeMap.get(nodeHash);
      
      // Branch node
      if (node.type === NodeType.BRANCH) {
        if (path.length === 0) {
          return Promise.resolve(node.value);
        }
        
        const branch = node.branches[path[0]];
        if (!branch) return Promise.resolve(null);
        
        return getFromNode(branch, path.slice(1));
      }
      
      // Extension node
      if (node.type === NodeType.EXTENSION) {
        // Check if path starts with extension path
        if (path.length < node.path.length) return Promise.resolve(null);
        
        for (let i = 0; i < node.path.length; i++) {
          if (path[i] !== node.path[i]) return Promise.resolve(null);
        }
        
        return getFromNode(node.next, path.slice(node.path.length));
      }
      
      // Leaf node
      if (node.type === NodeType.LEAF) {
        // Check if path matches leaf path exactly
        if (path.length !== node.path.length) return Promise.resolve(null);
        
        for (let i = 0; i < path.length; i++) {
          if (path[i] !== node.path[i]) return Promise.resolve(null);
        }
        
        return Promise.resolve(node.value);
      }
      
      return Promise.resolve(null);
    }
    
    return getFromNode(root, digits);
  }
  
  // Generate a Merkle proof for a key
  function generateProof(key) {
    if (!root) return Promise.resolve(null);
    
    const digits = keyToDigits(key);
    const proof = [];
    
    function collectProof(nodeHash, path) {
      if (!nodeHash) return Promise.resolve(false);
      
      const node = nodeMap.get(nodeHash);
      
      // Add this node to the proof
      proof.push({
        hash: nodeHash,
        node: serializeNode(node)
      });
      
      // Branch node
      if (node.type === NodeType.BRANCH) {
        if (path.length === 0) {
          return Promise.resolve(node.value !== null);
        }
        
        const branch = node.branches[path[0]];
        if (!branch) return Promise.resolve(false);
        
        return collectProof(branch, path.slice(1));
      }
      
      // Extension node
      if (node.type === NodeType.EXTENSION) {
        // Check if path starts with extension path
        if (path.length < node.path.length) return Promise.resolve(false);
        
        for (let i = 0; i < node.path.length; i++) {
          if (path[i] !== node.path[i]) return Promise.resolve(false);
        }
        
        return collectProof(node.next, path.slice(node.path.length));
      }
      
      // Leaf node
      if (node.type === NodeType.LEAF) {
        // Check if path matches leaf path exactly
        if (path.length !== node.path.length) return Promise.resolve(false);
        
        for (let i = 0; i < path.length; i++) {
          if (path[i] !== node.path[i]) return Promise.resolve(false);
        }
        
        return Promise.resolve(true);
      }
      
      return Promise.resolve(false);
    }
    
    return collectProof(root, digits)
      .then(exists => {
        if (!exists) return null;
        
        return get(key)
          .then(value => {
            return {
              rootHash: root,
              key: key,
              value: value,
              proof: proof
            };
          });
      });
  }
  
  // Verify a Merkle proof
  function verifyProof(rootHash, key, value, proof) {
    if (!proof || proof.length === 0) {
      return Promise.resolve(false);
    }
    
    const digits = keyToDigits(key);
    const proofMap = new Map();
    
    // Build a map of hash -> node from the proof
    proof.forEach(item => {
      proofMap.set(item.hash, JSON.parse(item.node));
    });
    
    // Verify all hashes in the proof
    const hashPromises = proof.map(item => {
      return sha256(item.node)
        .then(calculatedHash => {
          if (calculatedHash !== item.hash) {
            throw new Error('Proof hash mismatch');
          }
          return true;
        });
    });
    
    return Promise.all(hashPromises)
      .then(() => {
        // Verify the path from root to leaf
        function verifyPath(nodeHash, path) {
          if (!nodeHash) return Promise.resolve(false);
          
          const node = proofMap.get(nodeHash);
          if (!node) return Promise.resolve(false);
          
          // Branch node
          if (node.type === NodeType.BRANCH) {
            if (path.length === 0) {
              return Promise.resolve(node.value === value);
            }
            
            const branch = node.branches[path[0]];
            if (!branch) return Promise.resolve(false);
            
            return verifyPath(branch, path.slice(1));
          }
          
          // Extension node
          if (node.type === NodeType.EXTENSION) {
            // Check if path starts with extension path
            if (path.length < node.path.length) return Promise.resolve(false);
            
            for (let i = 0; i < node.path.length; i++) {
              if (path[i] !== node.path[i]) return Promise.resolve(false);
            }
            
            return verifyPath(node.next, path.slice(node.path.length));
          }
          
          // Leaf node
          if (node.type === NodeType.LEAF) {
            // Check if path matches leaf path exactly
            if (path.length !== node.path.length) return Promise.resolve(false);
            
            for (let i = 0; i < path.length; i++) {
              if (path[i] !== node.path[i]) return Promise.resolve(false);
            }
            
            return Promise.resolve(node.value === value);
          }
          
          return Promise.resolve(false);
        }
        
        return verifyPath(rootHash, digits);
      })
      .catch(error => {
        console.error('Proof verification error:', error);
        return false;
      });
  }
  
  // Public API
  return {
    insert: insert,
    get: get,
    generateProof: generateProof,
    verifyProof: verifyProof,
    getRootHash: () => root
  };
}

// Example usage
function exampleUsage() {
  // Create a tree with default base 16 (nibbles)
  const trie = createPatriciaMerkleTree();
  
  // Or create a tree with a different radix, for example base 2:
  // const trie = createPatriciaMerkleTree(2);
  
  // Insert some key-value pairs
  trie.insert('key1', 'value1')
    .then(() => trie.insert('key2', 'value2'))
    .then(() => trie.insert('key3', 'value3'))
    .then(() => {
      console.log('Trie populated');
      
      // Get a value
      return trie.get('key2')
        .then(value => {
          console.log('Value for key2:', value);
          
          // Generate a proof
          return trie.generateProof('key2');
        });
    })
    .then(proof => {
      console.log('Proof generated:', proof);
      
      if (!proof) {
        console.log('Failed to generate proof');
        return null;
      }
      
      // Verify the proof
      return trie.verifyProof(proof.rootHash, proof.key, proof.value, proof.proof)
        .then(isValid => {
          console.log('Proof valid:', isValid);
        });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

eos.add(
[
	{
		name: 'learn-cryptography-init',
		code: function ()
		{
			console.log('We have an opportunity to descentralise & rehumanise our society.');
			console.log('https://dsociety.io\n\n');
		}
	},
	{
		name: 'learn-cryptography-patriciamerkletree-create',
		code: function ()
		{

			exampleUsage()
/*
			patriciamerkletree.data = new Patriciamerkletree();

			patriciamerkletree.data.insert("apple", "fruit");
			patriciamerkletree.data.insert("applet", "software");
			patriciamerkletree.data.insert("banana", "fruit");

			console.log(patriciamerkletree)

			patriciamerkletree.data.getRootHash().then(rootHash => {
				console.log("Root hash:", rootHash);
			});*/
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
