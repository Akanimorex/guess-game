
# Deploy a simple Guess the Number telegram mini DApp on Core Testnet

A decentralized application (DApp) that generates a random number between 1 and 10 on the blockchain. Users can connect their wallets, make guesses, and win if they guess the correct number.

## Table of Contents

1. [Smart Contract](#smart-contract)
   - Overview
   - Implementation
2. [Frontend](#frontend)
   - Overview
   - Setup
   - RainbowKit & Wagmi Integration
   - Game Logic
3. [Deploying on Core Chain](#deploying-on-core-chain)
   - Smart Contract Deployment
   - Frontend Deployment
4. [Running the DApp](#running-the-dapp)

5. [Deploying on Core Chain](#deploying-on-core-chain)

---

## Smart Contract

### Overview

The smart contract is written in Solidity. It generates a random number between 1 and 10, which the player must guess. If the player guesses correctly, they win; otherwise, they lose and try again.

### Implementation

```// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract GuessTheNumber {
    address public owner;
    uint256 private randomNumber;
    bool public isGameActive;
    
    event GameResult(bool win, uint256 guessedNumber, uint256 correctNumber);
    
    constructor() {
        owner = msg.sender;
        isGameActive = true;
        generateRandomNumber();
    }

    // Function to generate a pseudo-random number between 1 and 10
    function generateRandomNumber() public {
        // Uses block timestamp and difficulty to generate pseudo-randomness
        randomNumber = (uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) % 10) + 1;
    }

     function getRandomNumber() public view returns (uint256) {
        return randomNumber;
    }

    // Function for the player to guess the number
    function guess(uint256 _guess) public returns (string memory) {
        require(isGameActive, "The game is not active.");
        require(_guess >= 1 && _guess <= 10, "Guess must be between 1 and 10.");

        if (_guess == randomNumber) {
            emit GameResult(true, _guess, randomNumber);
            generateRandomNumber();  // Generate a new number for the next round
            return "Congratulations, you guessed the correct number!";
        } else {
            emit GameResult(false, _guess, randomNumber);
            return "Sorry, wrong guess. Try again!";
        }
    }

    // Function for the owner to end the game
    function endGame() public {
        require(msg.sender == owner, "Only the owner can end the game.");
        isGameActive = false;
    }

    // Function for the owner to restart the game with a new random number
    function restartGame() public {
        require(msg.sender == owner, "Only the owner can restart the game.");
        isGameActive = true;
        generateRandomNumber();
    }
}

```

### Steps to Implement:

1. **Deploy the contract** on the Core Testnet 
2. Go to the `hardhat.config.ts` file and paste the following config.
```
    import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv';
dotenv.config();





module.exports = {
  defaultNetwork: 'testnet',

  networks: {
     hardhat: {
     },
     testnet: {
        url: 'https://rpc.test.btcs.network',
        accounts: [process.env.PRIVATE_KEY!],
        chainId: 1115,
     },
     mainnet: {
       url: 'https://rpc.coredao.org',
       accounts: [process.env.PRIVATE_KEY],
       chainId: 1116,
    },
  },
  etherscan: {
   apiKey: {
     testnet: process.env.CORE_TEST_SCAN_KEY!,
     mainnet: process.env.CORE_MAIN_SCAN_KEY!,
   },
   customChains: [
     {
       network: "testnet",
       chainId: 1115,
       urls: {
         apiURL: "https://api.test.btcs.network/api",
         browserURL: "https://scan.test.btcs.network/"
       }
     },
     {
       network: "mainnet",
       chainId: 1116,
       urls: {
         apiURL: "https://openapi.coredao.org/api",
         browserURL: "https://scan.coredao.org/"
       }
     }
   ]
 },

 solidity: {
  compilers: [
    {
       version: '0.8.19',
       settings: {
          evmVersion: 'paris',
          optimizer: {
             enabled: true,
             runs: 200,
          },
       },
    },
  ],
},
paths: {
     sources: './contracts',
     cache: './cache',
     artifacts: './artifacts',
  },
  mocha: {
     timeout: 20000,
  },
};

```

**Make sure to replace the private key, and other following details with your own**

Let's write the deployment script in the `scripts/deploy.ts` file.

```
// scripts/deploy.js

import { ethers } from "hardhat";

async function main() {
  // Get the contract factory
  const GuessTheNumber = await ethers.getContractFactory("GuessTheNumber");
  
  // Deploy the contract (no constructor parameters needed)
  const tx = await GuessTheNumber.deploy();

  // Wait for the deployment to finish
  const  guessTheNumber = await tx.waitForDeployment();

  console.log("GuessTheNumber contract deployed to:", guessTheNumber.target);
}

// Main deployment function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

    
 ```

Run the following command to deploy the contract:

```
npx hardhat run scripts/deploy.ts --network testnet
```


2. The contract contains two main functions:
   - `generateRandomNumber`: Called by the owner to generate a random number.
   -`getRandomNumber`: Called by the player to get the current random number.
   - `guessNumber`: Called by the player to submit a guess. The result is emitted via an event.

---

## Frontend

### Overview

The frontend is built using **React** and **Tailwind CSS** for styling. **RainbowKit** and **Wagmi** are used for wallet connection and interaction with the blockchain.

### Setup

1. Create a new React project and install dependencies:

   ```bash
   npx create-react-app guess-the-number
   cd guess-the-number
   npm install tailwindcss wagmi rainbowkit ethers
   ```

2. Set up **Tailwind CSS** by adding it to your `tailwind.config.js` file:

   ```javascript
   // tailwind.config.js
   module.exports = {
     content: [
       './src/**/*.{js,jsx,ts,tsx}',
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   };
   ```

3. Create a `App.js` file with the wallet connection and game logic.

### RainbowKit & Wagmi Integration

1. **Install RainbowKit** and configure it for wallet connection:

   ```javascript
   import '@rainbow-me/rainbowkit/styles.css';
   import {
     getDefaultWallets,
     RainbowKitProvider,
     darkTheme,
   } from '@rainbow-me/rainbowkit';
   import { configureChains, createClient, WagmiConfig } from 'wagmi';
   import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
   import { publicProvider } from 'wagmi/providers/public';

   const { chains, provider } = configureChains(
     [mainnet, polygon, optimism, arbitrum],
     [publicProvider()]
   );

   const { connectors } = getDefaultWallets({
     appName: 'Guess The Number DApp',
     chains,
   });

   const wagmiClient = createClient({
     autoConnect: true,
     connectors,
     provider,
   });

   const App = () => {
     return (
       <WagmiConfig client={wagmiClient}>
         <RainbowKitProvider chains={chains} theme={darkTheme()}>
           <div className="flex items-center justify-center h-screen bg-gray-100">
             <Game />
           </div>
         </RainbowKitProvider>
       </WagmiConfig>
     );
   };

   export default App;
   ```

### Game Logic

2. **Connect the smart contract** using ethers.js:

   ```javascript
   import { ethers } from 'ethers';
   import { useState } from 'react';
   import abi from './GuessTheNumber.json';

   const contractAddress = '<DEPLOYED_CONTRACT_ADDRESS>';
   const contractABI = abi;

   const Game = () => {
     const [guess, setGuess] = useState(0);
     const [result, setResult] = useState('');

     // Function to interact with the contract and submit a guess
     const makeGuess = async () => {
       if (!window.ethereum) return alert('Install MetaMask first!');

       try {
         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = provider.getSigner();
         const contract = new ethers.Contract(contractAddress, contractABI, signer);

         const tx = await contract.guessNumber(guess);
         const receipt = await tx.wait();
         
         // Parse the event emitted from the contract
         const event = receipt.events.find(event => event.event === 'GuessResult');
         const success = event.args.success;

         if (success) {
           setResult('Congrats! You guessed the correct number.');
         } else {
           setResult('Sorry, wrong guess. Try again!');
         }
       } catch (err) {
         console.error(err);
         setResult('Transaction failed.');
       }
     };

     return (
       <div className="bg-white p-6 rounded-lg shadow-lg">
         <h1 className="text-2xl font-bold mb-4">Guess The Number</h1>
         <input
           type="number"
           min="1"
           max="10"
           value={guess}
           onChange={(e) => setGuess(e.target.value)}
           className="border-2 p-2 rounded mb-4"
         />
         <button
           onClick={makeGuess}
           className="bg-blue-500 text-white px-4 py-2 rounded-lg"
         >
           Submit Guess
         </button>
         <p className="mt-4">{result}</p>
       </div>
     );
   };

   export default Game;
   ```

---

## Deploying on Core Chain

### Smart Contract Deployment

1. **Compile and deploy** the smart contract using tools like **Remix IDE**, **Hardhat**, or **Truffle**.
2. Make sure to set the correct network in the config and get the contract address after deployment.

### Frontend Deployment

1. For deploying the frontend, you can use hosting platforms like **Vercel**, **Netlify**, or your preferred service.
2. Ensure that the deployed contract address is correctly inserted in the frontend.

---

## Running the DApp

1. **Clone the repository**:
   ```bash
   git clone <repository_url>
   cd guess-the-number
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm start
   ```

4. **Access the DApp** via your local environment at `http://localhost:3000`, connect your wallet, and start guessing the number!

