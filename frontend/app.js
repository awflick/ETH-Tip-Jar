// frontend/app.js

let contract;
let signer;

const contractAddress = "0xE6788218F75AF067271601B03a9040B7a18cA35c";
const abi = [
    {
        "inputs": [{ "internalType": "string", "name": "message", "type": "string" }],
        "name": "tip",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "tokenAddress", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "internalType": "string", "name": "message", "type": "string" }
        ],
        "name": "tipToken",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const tokenList = {
    ETH: {
        symbol: "ETH",
        address: null,
        decimals: 18
    },
    "0x779877A7B0D9E8603169DdbD7836e478b4624789": {
        symbol: "LINK",
        address: "0x779877A7B0D9E8603169DdbD7836e478b4624789", // Sepolia LINK
        decimals: 18
    },
    "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238": {
        symbol: "USDC",
        address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // Sepolia USDC
        decimals: 6
    },
    "0xdd13E55209Fd76AfE204dBda4007C227904f0a81": {
        symbol: "WETH",
        address: "0xdd13E55209Fd76AfE204dBda4007C227904f0a81", // Sepolia WETH
        decimals: 18
    }
};

// Dynamically populate dropdown
const tokenSelect = document.getElementById("tokenSelect");
Object.values(tokenList).forEach(token => {
    const option = document.createElement("option");
    option.value = token.address ?? "ETH";
    option.textContent = token.symbol;
    tokenSelect.appendChild(option);
});


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

window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("connectButton").addEventListener("click", connectWallet);
    document.getElementById("tipButton").addEventListener("click", sendTip);
});

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
    const amountInput = document.getElementById("amountInput").value;
    const message = document.getElementById("messageInput").value;
    const selectedValue = document.getElementById("tokenSelect").value;

    if (!amountInput || isNaN(amountInput)) {
        alert("Please enter a valid amount.");
        return;
    }

    if (selectedValue === "ETH") {
        // ETH tip
        const amountInWei = ethers.utils.parseEther(amountInput);
        try {
            document.getElementById("status").innerText = "⏳ Waiting for confirmation...";
            const tx = await contract.tip(message, { value: amountInWei });
            await tx.wait();
            showSuccess();
        } catch (err) {
            console.error("Tip failed:", err);
            document.getElementById("status").innerText = "❌ Tip failed.";
        }
    } else {
        // Token tip
        const token = tokenList[selectedValue];
        if (!token) {
            alert("Unsupported token selected.");
            return;
        }

        const amountInWei = ethers.utils.parseUnits(amountInput, token.decimals);

        try {
            document.getElementById("status").innerText = "⏳ Approving token...";

            const tokenContract = new ethers.Contract(token.address, [
                // approve
                {
                    "constant": false,
                    "inputs": [
                        { "name": "spender", "type": "address" },
                        { "name": "amount", "type": "uint256" }
                    ],
                    "name": "approve",
                    "outputs": [{ "name": "", "type": "bool" }],
                    "type": "function"
                },
                // allowance
                {
                    "constant": true,
                    "inputs": [
                        { "name": "owner", "type": "address" },
                        { "name": "spender", "type": "address" }
                    ],
                    "name": "allowance",
                    "outputs": [{ "name": "", "type": "uint256" }],
                    "type": "function"
                }
            ], signer);


            const approval = await tokenContract.approve(contractAddress, amountInWei);
            await approval.wait();

            document.getElementById("status").innerText = "✅ Approval confirmed, waiting for allowance...";


            // Wait until allowance is updated (max 10 tries)
            let tries = 0;
            let allowance;
            while (tries < 10) {
                allowance = await tokenContract.allowance(await signer.getAddress(), contractAddress);
                if (allowance.gte(amountInWei)) break;
                await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1s
                tries++;
            }

            if (!allowance || allowance.lt(amountInWei)) {
                document.getElementById("status").innerText = "❌ Token approval not registered. Try again.";
                return;
            }

            console.log("Allowance is:", allowance.toString());

            // Estimate gas with fallback
            let gasLimit;
            try {
                gasLimit = await contract.estimateGas.tipToken(token.address, amountInWei, message);
            } catch (e) {
                console.warn("Gas estimation failed, using fallback:", e);
                gasLimit = 300000; // fallback
            }

            const tx = await contract.tipToken(token.address, amountInWei, message, { gasLimit });
            await tx.wait();
            showSuccess();
        } catch (err) {
            console.error("Tip failed:", err);
            document.getElementById("status").innerText = "❌ Tip failed.";
        }
    }
}

// outside so it’s accessible globally
function showSuccess() {
    const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
    document.getElementById("status").innerText = randomMessage;
}


