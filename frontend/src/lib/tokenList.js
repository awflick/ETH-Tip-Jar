// lib/tokenList.js

// ==============================
// 🪙 Token List for ETH Tip Jar
// ==============================

// This list defines the supported tokens for tipping.
// Each entry includes:
// - symbol: the shorthand token name for UI display
// - address: the ERC-20 contract address (null for ETH)
// - decimals: used to parse units (important for token transfers)

// NOTE: The keys are the token contract addresses (or "ETH" as a special case).
// This allows us to easily map dropdown selections to token metadata.

export const tokenList = {
    ETH: {
        symbol: 'ETH',
        address: null,         // native ETH has no contract address
        decimals: 18,          // ETH uses 18 decimals
    },

    // Chainlink Token (Sepolia)
    '0x779877A7B0D9E8603169DdbD7836e478b4624789': {
        symbol: 'LINK',
        address: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
        decimals: 18,
    },

    // USDC Token (Sepolia)
    '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238': {
        symbol: 'USDC',
        address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
        decimals: 6,
    },

    // Wrapped ETH Token (Sepolia)
    '0xdd13E55209Fd76AfE204dBda4007C227904f0a81': {
        symbol: 'WETH',
        address: '0xdd13E55209Fd76AfE204dBda4007C227904f0a81',
        decimals: 18,
    },
};
