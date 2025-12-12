# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:


## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
Prototype run instructions

This frontend can run in two prototype modes:

1) Local Hardhat node unlocked signer (no MetaMask confirmations, uses Hardhat test ETH)
2) Normal MetaMask flow (MetaMask will prompt for transactions and fees)

Quick steps to demo locally (recommended for pitching):

- Start a Hardhat local node (provides unlocked accounts with test ETH):

```powershell
cd ..\smart-contract
npx hardhat node
```

- Deploy the contract to the running local node (open a new terminal):

```powershell
cd ..\smart-contract
npx hardhat run scripts/deploy.js --network localhost
```

- Start the frontend (client) in another terminal:

```powershell
cd client
npm install
npm run dev
```

Notes:
- The client already looks for `VITE_USE_LOCAL_SIGNER=true` in `client/.env`. With this enabled the UI will use the first unlocked Hardhat account as the signer so MetaMask is not required for the demo.
- If you prefer MetaMask, set `VITE_USE_LOCAL_SIGNER=false` and connect MetaMask to `http://127.0.0.1:8545` or to any testnet where you deployed the contract.

How to present this as a working prototype

- Tech demo flow (30-60 seconds):
	- Explain the problem and the value prop in one sentence.
	- Show the running UI (create a startup, show it appears in the list).
	- Click "Invest" to donate; the transaction will succeed immediately (on the local node) and the "Raised" amounts update.
	- Mention that on mainnet/testnet this would require a real wallet and gas — the demo uses a local node to simulate behaviour.

- Slide bullets for investors/customers:
	- Problem: Early-stage startups struggle to find aligned micro-investors.
	- Solution: A decentralised launchpad where founders create campaigns and investors support directly with transparent smart contracts.
	- Prototype: Working UI + local smart contract demonstrating create/donate flows, immediate feedback, and transparent state.
	- Next steps: UX polish, KYC/aml hooks, token incentives, and cross-chain deployment.

- Tips for an impressive live demo:
	- Pre-populate a few campaigns (or create them quickly) before the audience.
	- Use the local unlocked signer mode so there are no wallet pop-ups.
	- Prepare a short script: create campaign -> donate -> show updated totals.

If you want, I can:
- Add a small "Demo mode" toggle in the UI to switch between MetaMask and Local signer.
- Pre-seed a few campaigns from a script and add a button to load them.
- Create a short slide deck (3-5 slides) describing the opportunity and demo steps.

Tell me which of those you'd like next and I'll implement it.

---

On-chain demo (show blockchain activity)

To ensure real blockchain transactions are happening during the demo (so you can show TX hashes, receipts and state changes):

- Start a local Hardhat node (unlocked accounts):

```powershell
cd ..\smart-contract
npx hardhat node
```

- Deploy the contract to the running node:

```powershell
cd ..\smart-contract
npx hardhat run scripts/deploy.js --network localhost
```

- In `client/.env` set:

```
VITE_SIMULATE_STATE=false
VITE_USE_LOCAL_SIGNER=true
VITE_LOCAL_RPC=http://127.0.0.1:8545
```

- Start the frontend and open the app. The Navbar includes a Demo checkbox (turn it off for live on-chain), and a small Transactions widget (bottom-right) will show pending and confirmed transactions with hashes.

Notes:
- With `VITE_USE_LOCAL_SIGNER=true` the frontend uses the first unlocked Hardhat account to sign transactions — this avoids MetaMask popups but still creates on-chain transactions on the local node (you will see tx hashes in the Transaction log).
- If you prefer to demo with MetaMask, configure MetaMask to connect to `http://127.0.0.1:8545` or a testnet and set `VITE_USE_LOCAL_SIGNER=false`.

---

-- Simulate-only (no gas) demo mode

If you want a pure front-end demo that never touches a node or wallet (no gas, fastest for pitching), enable `VITE_SIMULATE_STATE=true` in `client/.env`.

When `VITE_SIMULATE_STATE=true` the UI will:
- Use a fake demo account and not call any smart contract methods.
- Store campaigns in `localStorage` and show them in the UI.
- Allow creating and donating to campaigns instantly without transactions or gas.

This is the recommended option for quick investor demos where you just want to show the flows without any blockchain overhead.

Example `.env` for simulate demo:

```
VITE_SIMULATE_STATE=true
VITE_USE_LOCAL_SIGNER=false
```

When you're ready to show an integrated on-chain prototype, set `VITE_SIMULATE_STATE=false` and either:
- Use `VITE_USE_LOCAL_SIGNER=true` and run a local Hardhat node (no MetaMask prompts, uses test ETH from the node), or
- Use MetaMask connected to a testnet / local RPC and set `VITE_USE_LOCAL_SIGNER=false`.
