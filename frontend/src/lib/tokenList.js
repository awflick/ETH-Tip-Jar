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

    // ===== Stablecoins =====

    // USDC Token (Mainnet)
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': {
        symbol: 'USDC',
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        decimals: 6,
    },

    // DAI Token (Mainnet)
    '0x6B175474E89094C44Da98b954EedeAC495271d0F': {
        symbol: 'DAI',
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        decimals: 18,
    },

    // ===== Blue Chips by Market Cap =====

    // Wrapped ETH Token (Mainnet)
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2': {
        symbol: 'WETH',
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        decimals: 18,
    },

    // Chainlink Token (Mainnet)
    '0x514910771AF9Ca656af840dff83E8264EcF986CA': {
        symbol: 'LINK',
        address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
        decimals: 18,
    },

    // Uniswap Token (Mainnet)
    '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984': {
        symbol: 'UNI',
        address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        decimals: 18,
    },

    // Polygon (MATIC) Token (ERC-20, Mainnet)
    '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0': {
        symbol: 'MATIC',
        address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
        decimals: 18,
    },

    // Aave Token (Mainnet)
    '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9': {
        symbol: 'AAVE',
        address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
        decimals: 18,
    },

    // Shiba Inu Token (Mainnet)
    '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE': {
        symbol: 'SHIB',
        address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
        decimals: 18,
    },
};
