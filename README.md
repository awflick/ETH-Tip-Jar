# ETH Tip Jar

A sleek decentralized tip jar dApp built with **Solidity, React, and Web3Modal**. Users can connect their MetaMask wallet and send **ETH or any ERC-20 token** along with a message. Styled with a bold, cyberpunk-inspired UI and designed for both desktop and mobile users.

Currently deployed to the **Sepolia testnet**.  
Mainnet-ready build is coming soon.

---

## Live Demo

[View Live on Netlify](https://ethtipjar.netlify.app/)  

---

## Tech Stack

- Smart Contract: Solidity (^0.8.28)
- Frontend: React (Vite) + Wagmi + viem
- Wallet Integration: Web3Modal v3 (WalletConnect)
- QR Code Fallback: Manual tip via `qrcode.react`
- Styling: Custom CSS with terminal/cyberpunk aesthetics
- Testing/Deployment: Foundry (forge)
- Hosting: Netlify

---

## Features

- Connect MetaMask (desktop or mobile)
- Send tips in ETH or supported ERC-20 tokens
- Add a message with each tip
- Token approval and allowance flow for ERC-20
- Supports: ETH, LINK, USDC, WETH
- Randomized success feedback per tip
- Fully responsive UI (mobile and desktop)
- WalletConnect QR code and mobile browser support
- Verified smart contract (Sepolia)

---

## Project Structure

    ETH-TipJar/
    ├── contracts/
    │   └── TipJar.sol                 # Solidity contract
    ├── frontend/
    │   ├── index.html                 # Entry point
    │   ├── vite.config.js             # Vite config
    │   ├── package.json               # Frontend dependencies
    │   └── src/
    │       ├── App.jsx                # Main React component
    │       ├── main.jsx               # App entry
    │       ├── index.css              # Global styles
    │       └── lib/
    │           ├── tipJarAbi.js       # Contract ABI
    │           └── tokenList.js       # Token metadata
    ├── script/
    │   └── Deploy.s.sol               # Foundry deploy script
    ├── test/
    │   └── TipJar.t.sol               # Contract tests
    ├── .env                           # Environment variables (gitignored)
    ├── foundry.toml                   # Foundry config
    ├── README.md                      # This file

---

## Smart Contract Deployment (Sepolia)

To deploy and verify the contract using Foundry:

1. Load environment variables:

    ```bash
    export $(grep -v '^#' .env | xargs)
    ```

2. Deploy and verify:

    ```bash
    forge create \
      ./contracts/TipJar.sol:TipJar \
      --rpc-url $SEPOLIA_RPC_URL \
      --private-key $METAMASK_PRIVATE_KEY \
      --etherscan-api-key $ETHERSCAN_API_KEY \
      --verify \
      --broadcast
    ```

---

## Local Frontend Development

To run the frontend locally with Vite:

1. Navigate to the frontend directory:

    ```bash
    cd frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```

4. Open your browser to:

    ```
    http://localhost:5173
    ```

---

## Deploying the Frontend

You can deploy using:

- Netlify (recommended for HTTPS and mobile compatibility)
- Vercel
- GitHub Pages

Netlify is ideal for wallet connections and QR functionality out of the box.

---

## Environment & Security Notes

- It is safe to expose your Web3Modal `projectId` in the frontend
- Never commit your private key or `.env` file to version control

Example `.env` file (not included in repo):

    SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your-key
    METAMASK_PRIVATE_KEY=0xabc123...
    ETHERSCAN_API_KEY=your-etherscan-key

---

## Smart Contract Functions

| Function | Description |
|----------|-------------|
| `receive()` | Accepts plain ETH tips |
| `tip(string message)` | Sends ETH tip with message |
| `tipToken(address token, uint256 amount, string message)` | Sends ERC-20 tip with message |

---

## UI Logic Overview

- Uses Wagmi to detect connection state
- Shows QR code + copy address fallback when not connected
- Once connected, shows tip form (message, amount, token)
- Automatically handles token approval and allowance
- Shows success or error status below the Send Tip button

---

## Completed Milestones

- [x] Smart contract deployed and verified
- [x] ETH and ERC-20 token support
- [x] WalletConnect v2 QR support
- [x] Fully responsive frontend (mobile and desktop)
- [x] Token approval and allowance flow
- [x] Web3Modal v3 integration
- [x] Cyberpunk UI completed

---

## Roadmap

- [ ] Add recent tip history (UI or backend)
- [ ] ENS address resolution (optional)
- [ ] Launch to Ethereum Mainnet
- [ ] Add a stats view for total tips per token
- [ ] Light/dark mode toggle

---

## License

MIT — free to fork, remix, and build upon.

---

## Credits

Built by [@Adam Flick](https://github.com/awflick) as part of a Web3 developer journey.  
Inspired by retro terminal interfaces, cyberpunk design, and Ethereum tipping culture.
