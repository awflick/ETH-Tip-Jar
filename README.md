# ETH Tip Jar

A simple decentralized tip jar dApp built with **Solidity, React, and Web3Modal**. Users can connect their MetaMask wallet and send **ETH or any ERC-20 token** along with a message. Styled with a cyberpunk/terminal-inspired UI.  

This project is deployed to the **Sepolia testnet**.

---

## Live Demo

👉 [**View Live on Netlify**](https://ethtipjar.netlify.app/)  
*(Replace actual link after deployment)*

---

## 🛠 Tech Stack

- **Smart Contract:** Solidity (`0.8.28`)
- **Frontend:** React (Vite) + Wagmi + viem
- **Wallet Integration:** Web3Modal (WalletConnect v2)
- **Styling:** CSS with terminal/cyberpunk aesthetic
- **Testing/Deployment:** Foundry
- **Hosting:** Netlify

---

## Features

- Connect MetaMask (mobile or desktop)
- Send tips in **ETH or ERC-20 tokens**
- Custom messages included in tips
- Real token approval + allowance flow
- Supported tokens: ETH, LINK, USDC, WETH
- Randomized success feedback for each tip
- Fully responsive and styled UI
- WalletConnect QR code and mobile browser support
- Verified contract on Sepolia

---

## Folder Structure

```
ETH-TipJar/
├── contracts/
│   └── TipJar.sol                 # Solidity smart contract
├── frontend/
│   ├── index.html                 # Vite HTML entry point
│   ├── vite.config.js             # Vite build config
│   ├── package.json               # Frontend dependencies
│   └── src/
│       ├── App.jsx                # Main React component
│       ├── main.jsx              # App bootstrap
│       ├── index.css             # Global styling
│       └── lib/
│           ├── tipJarAbi.js      # ABI for TipJar contract
│           └── tokenList.js      # Token metadata (symbol, address, decimals)
├── script/
│   └── Deploy.s.sol              # (Optional) Foundry deploy script
├── test/
│   └── TipJar.t.sol              # Contract test file
├── .env                          # Environment variables (ignored by git)
├── foundry.toml                  # Foundry config
├── README.md                     # You are here
```

---

## Smart Contract Deployment (Sepolia)

```bash
# Load environment variables
export $(grep -v '^#' .env | xargs)

# Deploy and verify
forge create \
  ./contracts/TipJar.sol:TipJar \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $METAMASK_PRIVATE_KEY \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  --verify \
  --broadcast
```

---

## Local Frontend Dev (React + Vite)

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start local dev server:
   ```bash
   npm run dev
   ```

4. Open your browser to:
   ```
   http://localhost:5173
   ```

---

## Deploying Frontend

You can deploy this easily using:

- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)
- [GitHub Pages](https://pages.github.com/)

Recommended: Netlify for easiest wallet compatibility (QR codes, HTTPS, mobile fallback).

---

## Security Notes

- ✅ **It’s okay to expose your Web3Modal `projectId` in frontend** (not a secret)
- ❌ **Never expose your private keys in `.env` or public code**

Example `.env` (not committed to GitHub):

```env
SEPOLIA_RPC_URL=your-alchemy-or-infura-url
METAMASK_PRIVATE_KEY=your-wallet-private-key
ETHERSCAN_API_KEY=your-etherscan-api-key
```

---

## Smart Contract Functions

- `receive()` – Accepts plain ETH tips
- `tip(string message)` – Sends ETH + message
- `tipToken(address token, uint256 amount, string message)` – Sends ERC-20 + message

---

## Roadmap / To-Do

- [x] Smart contract deployed & verified  
- [x] ETH and ERC-20 token tips  
- [x] WalletConnect + Web3Modal v3  
- [x] React + Vite frontend  
- [x] Responsive cyberpunk CSS  
- [x] Token approval + allowance logic  
- [ ] Add recent tip history (UI or backend)  
- [ ] Optional: Add ENS integration  
- [ ] Mainnet launch! 🚀  

---

## License

MIT — free to fork, remix, and build on

---

## Credits

Built by [@Adam Flick](https://github.com/awflick) as part of a Web3 dev journey.  
Inspired by retro terminal UI, cyberpunk minimalism, and the Ethereum tipping culture.

