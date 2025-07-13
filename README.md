# ETH Tip Jar

A simple decentralized tip jar dApp built with Solidity, Ethers.js, and HTML/CSS. Users can connect their MetaMask wallet and send ETH tips along with a message. This project is deployed to the Sepolia testnet and styled with a modern cyberpunk/terminal-inspired UI.

---

## Live Demo

👉 [**View Live on Netlify**](https://your-netlify-link.netlify.app)  
*(Replace with your actual link after deployment)*

---

## Tech Stack

- **Smart Contract:** Solidity (0.8.28)
- **Frontend:** HTML, CSS, Vanilla JS
- **Wallet Integration:** MetaMask via Ethers.js
- **Hosting:** Netlify

---

## Features

- Connect MetaMask wallet
- Send ETH with a custom message
- Random funny feedback on each tip
- Responsive design for mobile
- Fully verified contract on Sepolia Etherscan

---

## Folder Structure

```
ETH-TipJar/
├── contracts/
│   └── TipJar.sol        # Solidity smart contract
├── frontend/
│   ├── index.html        # Main HTML UI
│   ├── app.js            # Frontend logic using Ethers.js
│   └── style.css         # Cyberpunk-inspired styles
├── script/
│   └── Deploy.s.sol      # Optional deploy script (not used in final deployment)
├── test/
│   └── TipJar.t.sol      # Contract tests
├── .env                  # Environment variables (private, ignored by git)
├── .gitignore            # Files and folders excluded from git tracking
├── .gitmodules           # (Optional) Git submodules, if used
├── foundry.toml          # Foundry configuration file
├── README.md             # Project documentation
```

---

## Deploying to Sepolia

Export environment variables:

```bash
export $(grep -v '^#' .env | xargs)
```

Deploy with contract verification:

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

## Local Development

To test the frontend locally before hosting:

1. Make sure you have [Visual Studio Code](https://code.visualstudio.com/) installed.
2. Install the **Live Server extension** in VS Code (by Ritwick Dey).
3. In VS Code, **right-click `index.html`** (inside the `frontend` folder) and choose:  
   **“Open with Live Server”**
4. Your default browser will open `http://127.0.0.1:5500/frontend/index.html` or similar.
5. Connect your MetaMask wallet and start tipping in ETH!

---

## Deploying Frontend

You can deploy the frontend via:

- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)
- [GitHub Pages](https://pages.github.com/)

These services are free and mobile-ready. Just push this project to GitHub and link the repo in Netlify or Vercel.

---

## Security Notes

- Never expose your `.env` or private keys in this repo.
- `.env` should include:  
  ```
  METAMASK_PRIVATE_KEY=your-private-key
  SEPOLIA_RPC_URL=your-alchemy-or-infura-url
  ```

---

## ✅ Roadmap / To-Do

- [x] Smart contract deployment  
- [x] Frontend integration  
- [x] MetaMask tip functionality  
- [x] Custom tip messages  
- [x] Cyberpunk design (CSS)  
- [ ] Optional: Multi-token support (ERC-20)  
- [ ] Optional: RainbowKit or Web3Modal UI  
- [ ] Optional: Show live recent tips
- [ ] Launch to mainnet!  

---

## License

MIT — free to fork, remix, and build on 

---

## Credits

Built by [@Adam Flick](https://github.com/awflick) as part of a Web3 development journey.  
Design inspired by terminal aesthetics, cyberpunk culture, and modern UX.

