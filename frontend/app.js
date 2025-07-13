// frontend/app.js

let contract;
let signer;

const contractAddress = "0xB0c1bc96E82E9Cfe938F3b23caa787771D18fbce";
const abi = [
    {
        "inputs": [{ "internalType": "string", "name": "message", "type": "string" }],
        "name": "tip",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
];

// ✅ Fun success messages
const successMessages = [
    "You dropped that ETH like a boss.",
    "You ain't a player, you just tip a lot.",
    "This wallet has more juice now, thanks to you.",
    "Cash rules everything around me... Thanks playa.",
    "Tip game strong. Your generosity is appreciated.",
    "No forks, no fakes — just real ones.",
    "Your ETH just passed the vibe check.",
    "Big drip energy.",
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

async function connectWallet() {
    if (window.ethereum) {
        try {
            await ethereum.request({ method: "eth_requestAccounts" });

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, abi, signer);

            document.getElementById("status").innerText = "🟢 Wallet connected!";
        } catch (err) {
            console.error("Connection error:", err);
            document.getElementById("status").innerText = "❌ Wallet connection failed.";
        }
    } else {
        alert("Please install MetaMask to use this site.");
    }
}

async function sendTip() {
    const ethAmount = document.getElementById("amountInput").value;
    const message = document.getElementById("messageInput").value;

    if (!ethAmount || isNaN(ethAmount)) {
        alert("Please enter a valid ETH amount.");
        return;
    }

    try {
        const tx = await contract.tip(message, {
            value: ethers.utils.parseEther(ethAmount)
        });
        document.getElementById("status").innerText = "⏳ Waiting for confirmation...";
        await tx.wait();

        const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
        document.getElementById("status").innerText = randomMessage;
    } catch (err) {
        console.error("Tip failed:", err);
        document.getElementById("status").innerText = "❌ Tip failed.";
    }
}

// Moved outside the function scope so they register immediately
document.getElementById("connectButton").addEventListener("click", connectWallet);
document.getElementById("tipButton").addEventListener("click", sendTip);

