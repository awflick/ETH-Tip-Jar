// ==========================================
// 📜 ABI for TipJar Smart Contract (lib/tipJarAbi.js)
// ==========================================

// This file exports the ABI (Application Binary Interface) for the TipJar.sol contract.
// The ABI defines the structure of the contract’s public functions,
// allowing the frontend to interact with the contract via wagmi/viem.

// NOTE: This ABI is manually defined for a minimal frontend build.
// If your contract changes, remember to update this file accordingly.

export const abi = [
  // Function: tip(string message)
  // Accepts ETH and an optional message. Payable function.
  {
    inputs: [{ internalType: 'string', name: 'message', type: 'string' }],
    name: 'tip',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },

  // Function: tipToken(address tokenAddress, uint256 amount, string message)
  // Sends an ERC-20 token tip with an optional message.
  {
    inputs: [
      { internalType: 'address', name: 'tokenAddress', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'string', name: 'message', type: 'string' },
    ],
    name: 'tipToken',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
