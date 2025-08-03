// ==============================
// ETH Tip Jar Frontend (App.jsx)
// ==============================

// React + Wagmi + Web3Modal setup
import { useState, useEffect } from 'react';
import { WagmiProvider, useAccount, useWalletClient, usePublicClient } from 'wagmi';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { mainnet, sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { parseEther, parseUnits } from 'viem';

// TipJar contract ABI
import { abi } from './lib/tipJarAbi';

// Styles + Token List
import '@web3modal/wagmi/react';
import './index.css';
import { tokenList } from './lib/tokenList';

// ==============================
// Web3Modal + Wagmi Config
// ==============================

const projectId = '5cee068023ae827bbeac324056a4c977'; // WalletConnect project ID

const metadata = {
  name: 'ETH Tip Jar',
  description: 'Send ETH or select an ERC-20 token',
  url: 'http://localhost:5173',
  icons: ['http://localhost:5173/favicon.ico'],
};

const chains = [sepolia, mainnet];

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

// Create modal with styling theme
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeVariables: {
    '--w3m-accent': '#ff0040' // tip jar red theme
  }
});

// React Query Client
const queryClient = new QueryClient();

// Deployed TipJar contract address (on Sepolia)
const CONTRACT_ADDRESS = '0xE6788218F75AF067271601B03a9040B7a18cA35c';

// Fun success messages after tipping
const successMessages = [
  "Balance has been restored. The tip jar thanks you.",
  "You have tilted the scales toward virtue, oh kind soul.",
  "You made the gods happy, you will be rewarded in Valhalla!",
  "You made it rain, may the sun shine on you, kind soul.",
  "You are contributing to the continuation of techno wizardry.",
  "You have appeased the blockchain gods. You shall be rewarded.",
  "You’ve unlocked +10 karma with the Etherlords.",
  "Your generosity has opened a portal to Layer 2.",
  "One more sacrifice to the DeFi gods. Much appreciated."
];

// ==============================
// TipForm Component
// ==============================

function TipForm() {
  // Wagmi hooks to get account, signer, and public client
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  // UI state
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('ETH');
  const [status, setStatus] = useState('');

  // Pick a random success message
  const showSuccess = () => {
    const randomMsg =
      successMessages[Math.floor(Math.random() * successMessages.length)];
    setStatus(randomMsg);
  };

  // Send ETH or ERC-20 token tip
  const handleTip = async () => {
    if (!walletClient || !address) return;
    if (!amount || isNaN(amount)) {
      alert('Please enter a valid amount.');
      return;
    }

    const tokenObj = token === 'ETH' ? tokenList.ETH : tokenList[token];
    const parsedAmount =
      token === 'ETH'
        ? parseEther(amount)
        : parseUnits(amount, tokenObj.decimals);

    try {
      // ETH Tip
      if (token === 'ETH') {
        setStatus('⏳ Waiting for confirmation...');
        const hash = await walletClient.writeContract({
          address: CONTRACT_ADDRESS,
          abi,
          functionName: 'tip',
          args: [message],
          value: parsedAmount,
        });
        await publicClient.waitForTransactionReceipt({ hash });
        return showSuccess();
      }

      // ERC-20 Tip
      else {
        setStatus('⏳ Approving token...');

        // Step 1: Approve token transfer
        const approveHash = await walletClient.writeContract({
          address: tokenObj.address,
          abi: [
            {
              constant: false,
              inputs: [
                { name: 'spender', type: 'address' },
                { name: 'amount', type: 'uint256' },
              ],
              name: 'approve',
              outputs: [{ name: '', type: 'bool' }],
              type: 'function',
            },
          ],
          functionName: 'approve',
          args: [CONTRACT_ADDRESS, parsedAmount],
        });
        await publicClient.waitForTransactionReceipt({ hash: approveHash });

        // Step 2: Wait for allowance to reflect
        setStatus('⏳ Approval confirmed, waiting for allowance...');
        let tries = 0;
        let allowance = 0n;

        while (tries < 10) {
          allowance = await publicClient.readContract({
            address: tokenObj.address,
            abi: [
              {
                constant: true,
                inputs: [
                  { name: 'owner', type: 'address' },
                  { name: 'spender', type: 'address' },
                ],
                name: 'allowance',
                outputs: [{ name: '', type: 'uint256' }],
                type: 'function',
              },
            ],
            functionName: 'allowance',
            args: [address, CONTRACT_ADDRESS],
          });

          if (allowance >= parsedAmount) break;
          await new Promise((res) => setTimeout(res, 1000));
          tries++;
        }

        if (allowance < parsedAmount) {
          setStatus('❌ Token approval not registered. Try again.');
          return;
        }

        // Step 3: Call tipToken function
        const hash = await walletClient.writeContract({
          address: CONTRACT_ADDRESS,
          abi,
          functionName: 'tipToken',
          args: [tokenObj.address, parsedAmount, message],
        });
        await publicClient.waitForTransactionReceipt({ hash });
        return showSuccess();
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Tip failed.');
    }
  };

  // ==============================
  // User Interface
  // ==============================

  return (
    <div className="container">
      <h1>💰 ETH Tip Jar 💰</h1>
      <p className="subheading">Send ETH or select an ERC-20 token</p>

      {/* 🔌 Web3Modal Wallet Button */}
      <div className="wallet-button-wrapper">
        <w3m-button />
      </div>

      {/* Wallet Status */}
      <p id="status">
        {isConnected ? 'Connected' : 'Not connected'}
      </p>

      {/* Tip Form */}
      {isConnected && (
        <>
          <input
            type="text"
            placeholder="Your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            step="0.001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select value={token} onChange={(e) => setToken(e.target.value)}>
            {Object.values(tokenList).map((t) => (
              <option key={t.symbol} value={t.address ?? 'ETH'}>
                {t.symbol}
              </option>
            ))}
          </select>

          <button onClick={handleTip}>Send Tip</button>
          <p id="status">{status}</p>
        </>
      )}
    </div>
  );
}

// ==============================
// App Entry Point
// ==============================

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <TipForm />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

