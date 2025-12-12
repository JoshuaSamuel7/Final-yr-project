import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Navbar from './components/Navbar';
import CampaignCard from './components/CampaignCard';
import TransactionLog from './components/TransactionLog';
import WalletConnect from './components/WalletConnectClean';
import StartupDetail from './components/StartupDetailClean';
import TransactionFlow from './components/TransactionFlow';
import Dashboard from './components/Dashboard';
import Modal from './components/Modal';
import Welcome from './components/Welcome';
import Auth from './components/Auth';
import Startups from './components/Startups';
import TransactionsPage from './components/TransactionsPageClean';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import contractABI from './utils/StartupFunding.json';

// Config via Vite env. For production use real contract, for demo use simulate mode.
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";
const USE_LOCAL_SIGNER = import.meta.env.VITE_USE_LOCAL_SIGNER === 'true' || true;  // default to local signer
const LOCAL_RPC = import.meta.env.VITE_LOCAL_RPC || 'http://127.0.0.1:8545';
const SIMULATE_STATE = import.meta.env.VITE_SIMULATE_STATE === 'true' || false;  // default to real mode (not simulate)

// Demo data: 7 realistic startups with expanded details
const DEMO_STARTUPS = [
  {
    owner: '0x' + 'a'.repeat(40),
    name: 'NeuroFlow AI',
    description: 'AI-powered cognitive wellness platform with real-time mental health insights.',
    goal: ethers.parseEther('15').toString(),
    amountRaised: '0',
    docs: '/docs/startup-1.txt'
  },
  {
    owner: '0x' + 'b'.repeat(40),
    name: 'GreenGrow Labs',
    description: 'Precision agriculture tech reducing crop water usage by 40% using IoT sensors.',
    goal: ethers.parseEther('12').toString(),
    amountRaised: '0',
    docs: '/docs/startup-2.txt'
  },
  {
    owner: '0x' + 'c'.repeat(40),
    name: 'FinEdge',
    description: 'Decentralized micro-lending platform enabling SMEs to access capital instantly.',
    goal: ethers.parseEther('20').toString(),
    amountRaised: '0',
    docs: '/docs/startup-3.txt'
  },
  {
    owner: '0x' + 'd'.repeat(40),
    name: 'HealthLoop',
    description: 'Virtual care platform connecting rural patients with specialist doctors.',
    goal: ethers.parseEther('10').toString(),
    amountRaised: '0',
    docs: '/docs/startup-4.txt'
  },
  {
    owner: '0x' + 'e'.repeat(40),
    name: 'CleanSea',
    description: 'Autonomous underwater drones for ocean cleanup and marine biodiversity restoration.',
    goal: ethers.parseEther('25').toString(),
    amountRaised: '0',
    docs: '/docs/startup-5.txt'
  },
  {
    owner: '0x' + 'f'.repeat(40),
    name: 'ByteShield',
    description: 'Quantum-resistant cybersecurity infrastructure for enterprise data protection.',
    goal: ethers.parseEther('18').toString(),
    amountRaised: '0',
    docs: '/docs/startup-6.txt'
  },
  {
    owner: '0x' + '1'.repeat(40),
    name: 'EcoDrive',
    description: 'Last-mile delivery optimization using AI routing and electric vehicle fleet.',
    goal: ethers.parseEther('22').toString(),
    amountRaised: '0',
    docs: '/docs/startup-7.txt'
  }
];

function App() {
  const [account, setAccount] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [user, setUser] = useState(() => localStorage.getItem('demo_user') || null);
  const [form, setForm] = useState({ name: '', description: '', goal: '' });
  // removed legacy `page` state; using React Router instead
  const [simulateMode, setSimulateMode] = useState(() => {
    const stored = localStorage.getItem('simulate_mode');
    return stored ? stored === 'true' : SIMULATE_STATE;  // default: false (real mode)
  });
  const [txs, setTxs] = useState([]);
  const [balance, setBalance] = useState(null);
  const [connectedThisVisit, setConnectedThisVisit] = useState(false);
  const [modal, setModal] = useState({open:false, title:'', body:null});
  const navigate = useNavigate();

  useEffect(() => { fetchCampaigns(); }, []);

  useEffect(() => {
    // reflect user into localStorage
    if (user) localStorage.setItem('demo_user', user); else localStorage.removeItem('demo_user');
  }, [user]);

  useEffect(() => {
    // Refetch campaigns when wallet connects or account changes
    if (connectedThisVisit || account) {
      console.log('📱 Wallet connected or account changed, refetching campaigns...');
      fetchCampaigns();
    }
  }, [connectedThisVisit, account]);

  async function connectWallet() {
    try {
      if (simulateMode) {
        // In pure-simulate mode we generate a demo account id and do not use any wallet
        const demoAddr = '0x' + 'd'.repeat(40);
        setAccount(demoAddr);
        setConnectedThisVisit(true);
        toast.success('Demo wallet connected');
        navigate('/startups');
        return;
      }

      // Prioritize MetaMask/browser extension wallet
      if (!window.ethereum) {
        toast.error('No wallet extension detected. Please install MetaMask.');
        throw new Error('No wallet extension available');
      }

      try {
        // Request account access from wallet extension
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });

        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts available from wallet');
        }

        const connectedAccount = accounts[0];
        setAccount(connectedAccount);
        setConnectedThisVisit(true);

        // Get balance from the connected network
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const balance = await provider.getBalance(connectedAccount);
          setBalance(ethers.formatEther(balance));
          toast.success(`Connected: ${connectedAccount.slice(0, 6)}...${connectedAccount.slice(-4)}`);
        } catch (balErr) {
          console.warn('Balance fetch failed:', balErr);
          toast.success(`Connected: ${connectedAccount.slice(0, 6)}...${connectedAccount.slice(-4)}`);
        }

        // Listen for account/chain changes
        window.ethereum.on('accountsChanged', (newAccounts) => {
          if (newAccounts.length > 0) {
            setAccount(newAccounts[0]);
            toast.info(`Switched to: ${newAccounts[0].slice(0, 6)}...${newAccounts[0].slice(-4)}`);
          } else {
            setAccount(null);
            setConnectedThisVisit(false);
            toast.info('Wallet disconnected');
          }
        });

        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });

        // Redirect to startups page after successful connection
        setTimeout(() => {
          navigate('/startups');
        }, 800);
      } catch (err) {
        if (err.code === 4001) {
          toast.error('Connection rejected by wallet');
        } else if (err.code === -32002) {
          toast.error('Wallet connection already pending');
        } else {
          console.error('Wallet extension error:', err);
          toast.error('Failed to connect wallet: ' + (err.message || 'Unknown error'));
        }
        throw err;
      }
    } catch (err) {
      console.error('connectWallet error:', err.message ?? err);
    }
  }

  async function getContract() {
    if (simulateMode) throw new Error('No contract in simulate mode');

    if (!CONTRACT_ADDRESS) throw new Error('Contract address not configured');

    if (USE_LOCAL_SIGNER) {
      const provider = new ethers.JsonRpcProvider(LOCAL_RPC);
      const signer = provider.getSigner(0);
      return new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
    }

    if (!window.ethereum) throw new Error('No Ethereum provider found. Install MetaMask.');
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
  }

  async function fetchCampaigns() {
    try {
      if (simulateMode) {
        // load from localStorage or start with demo data
        const saved = localStorage.getItem('demo_campaigns');
        if (saved) {
          setCampaigns(JSON.parse(saved));
        } else {
          setCampaigns(DEMO_STARTUPS);
          localStorage.setItem('demo_campaigns', JSON.stringify(DEMO_STARTUPS));
        }
        return;
      }

      // Real contract mode
      if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === 'undefined' || CONTRACT_ADDRESS === '') {
        console.warn('⚠️  No contract address configured. Deploy contract first: npx hardhat run scripts/deploy.js --network localhost');
        // Fallback to demo data if contract not deployed
        setCampaigns(DEMO_STARTUPS);
        return;
      }

      try {
        const contract = await getContract();
        const rawData = await contract.getAllCampaigns();
        
        // Convert contract data and add mock docs field (index-based for now)
        const campaigns = rawData.map((camp, idx) => ({
          owner: camp.owner,
          name: camp.name,
          description: camp.description,
          goal: camp.goal.toString ? camp.goal.toString() : String(camp.goal),
          amountRaised: camp.amountRaised.toString ? camp.amountRaised.toString() : String(camp.amountRaised),
          docs: `/docs/startup-${(idx % 5) + 1}.txt` // Cycle through 1-5
        }));
        
        console.log('✅ Fetched', campaigns.length, 'campaigns from contract');
        setCampaigns(campaigns);
      } catch (contractErr) {
        console.warn('⚠️  Contract call failed:', contractErr.message);
        // Fallback to demo data if contract call fails
        setCampaigns(DEMO_STARTUPS);
        console.log('📌 Using fallback demo data');
      }
    } catch (err) {
      console.error('❌ Failed to fetch campaigns:', err.message ?? err);
      // Final fallback to demo data
      setCampaigns(DEMO_STARTUPS);
    }
  }

  // Simulate a transaction: update tx log and campaign amountRaised (even on failure show behavior)
  async function simulateTx(index, amountEth) {
    const id = Date.now() + Math.random();
    const amtStr = String(amountEth);
    // push pending
    setTxs((s)=>[...s, { id, type: 'donate', status: 'pending', amount: amtStr, hash: null }]);
    toast.info(`Submitting ${amtStr} ETH`);

    // simulate async processing
    await new Promise((res)=>setTimeout(res, 1200));

    // randomly decide success/failure for demo
    const success = Math.random() > 0.12;
    if (success) {
      setTxs((s)=>s.map(x=> x.id===id ? {...x, status:'confirmed', hash: '0x'+Math.random().toString(16).slice(2,18)} : x));
      toast.success(`${amtStr} ETH processed`);
      // update campaign amountRaised
      const next = campaigns.slice();
      try {
        const prev = BigInt(next[index].amountRaised || '0');
        const inc = BigInt(ethers.parseEther(amtStr).toString());
        next[index].amountRaised = (prev + inc).toString();
      } catch (e) {
        // fallback: if parse fails, add numeric string
        next[index].amountRaised = ((Number(next[index].amountRaised || 0) + Number(amtStr)) || amtStr).toString();
      }
      setCampaigns(next);
      localStorage.setItem('demo_campaigns', JSON.stringify(next));
    } else {
      setTxs((s)=>s.map(x=> x.id===id ? {...x, status:'failed'} : x));
      toast.error('Transaction failed (simulated)');
    }

    return success;
  }

  async function createCampaign() {
    try {
      if (simulateMode) {
        const newCampaign = { owner: account || ('0x' + 'd'.repeat(40)), name: form.name, description: form.description, goal: ethers.parseEther(form.goal).toString(), amountRaised: '0' };
        const next = [...campaigns, newCampaign];
        setCampaigns(next);
        localStorage.setItem('demo_campaigns', JSON.stringify(next));
        return;
      }

      const contract = await getContract();
      const tx = await contract.createCampaign(form.name, form.description, ethers.parseEther(form.goal));
      // push pending tx to log
      const id = Date.now() + Math.random();
      setTxs((s) => [...s, { id, type: 'create', status: 'pending', hash: tx.hash || null, amount: '0' }]);
      toast.info('Create campaign pending');
      const receipt = await tx.wait();
      setTxs((s) => s.map((x) => (x.id === id ? { ...x, status: 'confirmed', hash: receipt.transactionHash || x.hash } : x)));
      try { const provider = USE_LOCAL_SIGNER ? new ethers.JsonRpcProvider(LOCAL_RPC) : new ethers.BrowserProvider(window.ethereum); const bal = await provider.getBalance(account); setBalance(ethers.formatEther(bal)); } catch(e){}
      await fetchCampaigns();
      toast.success('Campaign created');
    } catch (err) {
      console.error('Create campaign failed:', err.message ?? err);
      // log failure
      setTxs((s) => [...s, { id: Date.now() + Math.random(), type: 'create', status: 'failed', hash: null }]);
      toast.error('Create campaign failed');
    }
  }

  async function donate(index, amount) {
    try {
      if (simulateMode) {
        const next = campaigns.slice();
        const amt = ethers.parseEther(amount).toString();
        // amountRaised stored as string (wei) in simulate mode
        const prev = BigInt(next[index].amountRaised || '0');
        const sum = prev + BigInt(amt);
        next[index].amountRaised = sum.toString();
        setCampaigns(next);
        localStorage.setItem('demo_campaigns', JSON.stringify(next));
        return;
      }

      const contract = await getContract();
      const tx = await contract.donateToCampaign(index, { value: ethers.parseEther(amount) });
      const id = Date.now() + Math.random();
      const amtStr = ethers.formatEther(ethers.parseEther(amount));
      setTxs((s) => [...s, { id, type: 'donate', status: 'pending', hash: tx.hash || null, amount: amtStr }]);
      toast.info(`Donating ${amtStr} ETH`);
      const receipt = await tx.wait();
      setTxs((s) => s.map((x) => (x.id === id ? { ...x, status: 'confirmed', hash: receipt.transactionHash || x.hash } : x)));
      try { const provider = USE_LOCAL_SIGNER ? new ethers.JsonRpcProvider(LOCAL_RPC) : new ethers.BrowserProvider(window.ethereum); const bal = await provider.getBalance(account); setBalance(ethers.formatEther(bal)); } catch(e){}
      await fetchCampaigns();
      toast.success(`${amtStr} ETH received`);
    } catch (err) {
      console.error('Donation failed:', err.message ?? err);
      setTxs((s) => [...s, { id: Date.now() + Math.random(), type: 'donate', status: 'failed', hash: null }]);
      toast.error(err.message ?? 'Donation failed');
    }
  }

  function handleLogin(username) {
    // On login, clear any prior account to require an explicit per-visit connect
    setUser(username);
    setAccount(null);
    setConnectedThisVisit(false);
    toast.success(`Hi ${username} — please connect your wallet for transactions`);
    // Navigate to wallet connect page so user explicitly connects each session
    navigate('/wallet');
  }

  function handleLogout() {
    setUser(null);
    setAccount(null);
    setConnectedThisVisit(false);
    localStorage.removeItem('demo_user');
    toast.info('You have been signed out');
    navigate('/welcome');
  }

  function addTx(tx) {
    setTxs((s)=>[...s, tx]);
  }

  return (
    <div className="app">
      <Navbar account={account} onConnect={connectWallet} connectedThisVisit={connectedThisVisit} simulateMode={simulateMode} toggleSimulate={(v) => { setSimulateMode(v); localStorage.setItem('simulate_mode', v ? 'true' : 'false'); if (v) { navigate('/'); } }} balance={balance} user={user} onLogout={handleLogout} />
      <div className="container">
      <Routes>
        <Route path="/welcome" element={<Welcome onGetStarted={() => navigate('/startups')} />} />
        <Route path="/startups" element={user ? <Startups campaigns={campaigns} onDonate={donate} /> : <Navigate to="/auth" replace />} />
        <Route path="/startup/:id" element={user ? <StartupDetail campaigns={campaigns} onFund={(i,amt)=>navigate(`/fund/${i}`)} /> : <Navigate to="/auth" replace />} />
        <Route path="/fund/:id" element={user ? <TransactionFlow campaigns={campaigns} simulateTx={simulateTx} connectWallet={connectWallet} account={account} /> : <Navigate to="/auth" replace />} />
        <Route path="/wallet" element={user ? <WalletConnect connectWallet={connectWallet} account={account} simulateMode={simulateMode} /> : <Navigate to="/auth" replace />} />
        <Route path="/dashboard" element={user ? <Dashboard campaigns={campaigns} onDonate={donate} onSeed={() => {
          const seed = [
            { owner: '0x' + 'c'.repeat(40), name: 'Seed Startup X', description: 'Seed X', goal: ethers.parseEther('20').toString(), amountRaised: '0' },
            { owner: '0x' + 'e'.repeat(40), name: 'Seed Startup Y', description: 'Seed Y', goal: ethers.parseEther('3').toString(), amountRaised: '0' }
          ];
          const next = [...campaigns, ...seed];
          setCampaigns(next);
          localStorage.setItem('demo_campaigns', JSON.stringify(next));
        }} simulateMode={simulateMode} balance={balance} txs={txs} /> : <Navigate to="/auth" replace />} />
        <Route path="/transactions" element={user ? <TransactionsPage txs={txs} addTx={addTx} connectWallet={connectWallet} account={account} simulateMode={simulateMode} /> : <Navigate to="/auth" replace />} />
        <Route path="/auth" element={<Auth onLogin={(u) => { handleLogin(u); }} />} />
        <Route path="/" element={<>
          <div className="form">
            <div style={{display:'flex', gap:16, alignItems:'center'}}>
              <div style={{flex:1}}>
                <h1 style={{margin:'0 0 8px 0'}}>Launch the next great startup</h1>
                <p style={{margin:'0 0 12px 0', color:'rgba(255,255,255,0.85)'}}>Create campaigns, attract investors, and run no-gas demos for your pitches. Sign up to get started.</p>
                <div style={{display:'flex', gap:8}}>
                  <button onClick={() => navigate('/auth')}>Sign Up / Login</button>
                  <button onClick={() => navigate('/startups')} style={{background:'transparent', color:'white', border:'1px solid rgba(255,255,255,0.06)'}}>Browse Startups</button>
                </div>
              </div>
              <div style={{width:360}}>
                <img src="https://images.unsplash.com/photo-1558016608-2f6d3b1e7d7e?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=1a" alt="startup" style={{width:'100%', borderRadius:12, boxShadow:'0 20px 40px rgba(2,6,23,0.28)'}}/>
              </div>
            </div>
          </div>
          <div style={{marginTop:20}}>
            <h3 style={{marginBottom:8}}>Featured startups</h3>
            <div className="campaigns">
              {campaigns.map((c, index) => (
                <CampaignCard key={index} campaign={c} onDonate={(amt) => donate(index, amt)} openDonateModal={(campaign, amt) => setModal({open:true, title:`Donate to ${campaign.name}`, body:(<>
                  <div style={{marginBottom:8}}>Donate to <b>{campaign.name}</b></div>
                  <input placeholder="Amount (ETH)" defaultValue={amt} onChange={(e)=>{ /* no-op, donor will type */ }} id="modal-amount" />
                  <div style={{display:'flex', gap:8, marginTop:8}}>
                    <button onClick={async ()=>{ const a = document.getElementById('modal-amount').value || amt; await donate(index, a); setModal({open:false}); }}>Send</button>
                    <button onClick={()=> setModal({open:false})}>Cancel</button>
                  </div>
                </>)})} />
              ))}
            </div>
          </div>
        </>} />
      </Routes>

      <TransactionLog txs={txs} />
      </div>

        <Modal open={modal.open} title={modal.title} onClose={() => setModal({open:false})}>{modal.body}</Modal>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export default App;
