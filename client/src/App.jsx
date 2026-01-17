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
import TransactionSimulation from './components/TransactionSimulation';
import Dashboard from './components/Dashboard';
import Modal from './components/Modal';
import Welcome from './components/Welcome';
import Auth from './components/Auth';
import Startups from './components/Startups';
import TransactionsPage from './components/TransactionsPageClean';
import CampaignCreation from './components/CampaignCreation';
import FounderDashboard from './components/FounderDashboard';
import FounderCompanies from './components/FounderCompanies';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import contractABI from './utils/StartupFunding.json';

// Config via Vite env. For production use real contract.
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";
const USE_LOCAL_SIGNER = import.meta.env.VITE_USE_LOCAL_SIGNER === 'true' ? true : false;  // Use MetaMask by default
const LOCAL_RPC = import.meta.env.VITE_LOCAL_RPC || 'http://127.0.0.1:8545';

// Demo data: 10+ realistic startups with comprehensive details for verification
const DEMO_STARTUPS = [
  {
    owner: '0x' + 'a'.repeat(40),
    name: 'NeuroFlow AI',
    description: 'AI-powered cognitive wellness platform with real-time mental health insights.',
    goal: ethers.parseEther('15').toString(),
    amountRaised: ethers.parseEther('8.5').toString(),
    docs: '/docs/startup-1.txt',
    image: 'https://www.neuroflow.com/wp-content/uploads/2020/09/45023264_908154582715032_5813582120282488832_n.png',
    category: 'HealthTech',
    stage: 'Series A',
    team: 4,
    users: '15K+',
    roi: '+250%',
    founded: 2023,
    investors: 12,
    tags: ['AI', 'Mental Health', 'Wellness'],
    teamMembers: [
      { name: 'Sarah Chen', role: 'CEO/Founder', experience: '10+ years AI/Healthcare' },
      { name: 'Michael Rodriguez', role: 'CTO', experience: '8+ years ML Engineering' },
      { name: 'Emily Watson', role: 'Product Lead', experience: '7+ years HealthTech' },
      { name: 'David Kim', role: 'Clinical Advisor', experience: 'MD, Psychiatry' }
    ],
    technology: ['TensorFlow', 'React', 'Node.js', 'AWS', 'HIPAA Compliant'],
    marketSize: '$4.2B annual opportunity in digital mental health',
    monthlyRecurring: '$85K MRR',
    fundingUse: ['30% Product Development', '25% Sales/Marketing', '25% Compliance/Ops', '20% Admin'],
    customerBase: 'B2B2C - Works with 150+ mental health clinics',
    certifications: ['HIPAA Certified', 'SOC 2 Type II', 'FDA Pre-cert'],
    metrics: { MAU: '15,234', CAC: '$45', LTV: '$1,200', NRR: '125%' }
  },
  {
    owner: '0x' + 'b'.repeat(40),
    name: 'GreenGrow Labs',
    description: 'Precision agriculture tech reducing crop water usage by 40% using IoT sensors.',
    goal: ethers.parseEther('12').toString(),
    amountRaised: ethers.parseEther('7.2').toString(),
    docs: '/docs/startup-2.txt',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=800&fit=crop&q=80',
    category: 'AgriTech',
    stage: 'Seed',
    team: 5,
    users: '250+ farms',
    roi: '+180%',
    founded: 2024,
    investors: 8,
    tags: ['Agriculture', 'IoT', 'Sustainability'],
    teamMembers: [
      { name: 'James Patterson', role: 'Founder', experience: '5th generation farmer' },
      { name: 'Dr. Lisa Green', role: 'Ag Tech Lead', experience: 'PhD in Soil Science' },
      { name: 'Tom Bradley', role: 'Hardware Engineer', experience: '12+ years IoT' }
    ],
    technology: ['Arduino', 'LoRaWAN', 'Python', 'Real-time data analytics'],
    marketSize: '$2.8B in precision agriculture market',
    monthlyRecurring: '$12K MRR',
    fundingUse: ['40% Hardware production', '30% Field trials', '20% Software', '10% Operations'],
    customerBase: 'Small-to-medium farms (100-500 acres)',
    certifications: ['EPA Compliant', 'Organic Approved'],
    metrics: { ActiveFarms: 250, AvgWaterSavings: '38%', SoilHealthImprovement: '+23%', ROI: '3.2x' }
  },
  {
    owner: '0x' + 'c'.repeat(40),
    name: 'FinEdge',
    description: 'Decentralized micro-lending platform enabling SMEs to access capital instantly.',
    goal: ethers.parseEther('20').toString(),
    amountRaised: ethers.parseEther('15.8').toString(),
    docs: '/docs/startup-3.txt',
    image: 'https://ugrocapital-docs.s3.ap-south-1.amazonaws.com/knowledge-series/wp-content/uploads/2025/03/28133027/How-AI-and-Big-Data-Are-Changing-the-MSME-Lending-Game-1.webp',
    category: 'FinTech',
    stage: 'Series B',
    team: 8,
    users: '50K+',
    roi: '+420%',
    founded: 2022,
    investors: 24,
    tags: ['DeFi', 'Lending', 'SME'],
    teamMembers: [
      { name: 'Priya Sharma', role: 'CEO', experience: '12+ years traditional finance' },
      { name: 'Alex Thompson', role: 'Blockchain Lead', experience: '6+ years crypto' },
      { name: 'Carmen Lopez', role: 'Risk Officer', experience: 'Former JPMorgan' },
      { name: 'Nathan Foster', role: 'Head of Partnerships', experience: '8+ years B2B' }
    ],
    technology: ['Solidity', 'Ethereum', 'React', 'Machine Learning Risk Models'],
    marketSize: '$1.7T addressable market in SME lending',
    monthlyRecurring: '$245K MRR',
    fundingUse: ['35% Smart contract development', '30% Marketing', '20% Compliance', '15% Team'],
    customerBase: 'SMEs with $100K-$2M annual revenue',
    certifications: ['SEC Registered', 'FinCEN Compliant', 'Multi-jurisdiction licenses'],
    metrics: { LoansIssued: '3250', AverageLoanSize: '$45K', DefaultRate: '1.2%', AnnualVolume: '$145M' }
  },
  {
    owner: '0x' + 'd'.repeat(40),
    name: 'HealthLoop',
    description: 'Virtual care platform connecting rural patients with specialist doctors.',
    goal: ethers.parseEther('10').toString(),
    amountRaised: ethers.parseEther('6.3').toString(),
    docs: '/docs/startup-4.txt',
    image: 'https://cdn.prod.website-files.com/6786af5bf302623fca248d08/6786af5bf302623fca2490a9_healthloop-logo.png',
    category: 'HealthTech',
    stage: 'Seed',
    team: 6,
    users: '30K+',
    roi: '+190%',
    founded: 2023,
    investors: 10,
    tags: ['Telemedicine', 'Rural Healthcare', 'Digital Health'],
    teamMembers: [
      { name: 'Dr. Rajesh Patel', role: 'Founder/CMO', experience: 'MD, 15+ years healthcare' },
      { name: 'Sophie Chen', role: 'CTO', experience: '8+ years health IT' }
    ],
    technology: ['Telemedicine Platform', 'Mobile-first', 'Low-bandwidth optimized'],
    marketSize: '$500M+ addressable market in rural telehealth',
    monthlyRecurring: '$32K MRR',
    fundingUse: ['40% Platform expansion', '35% Marketing', '25% Operations'],
    certifications: ['HIPAA Certified', 'GDPR Compliant'],
    metrics: { ActivePatients: '30000', MonthlyCalls: '45000', DoctorNetwork: '320+' }
  },
  {
    owner: '0x' + 'e'.repeat(40),
    name: 'CleanSea',
    description: 'Autonomous underwater drones for ocean cleanup and marine biodiversity restoration.',
    goal: ethers.parseEther('25').toString(),
    amountRaised: ethers.parseEther('12.1').toString(),
    docs: '/docs/startup-5.txt',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSit21zGawFyfAzAIwn8dGEvxwQaPoBDi23A&s',
    category: 'ClimaTech',
    stage: 'Series A',
    team: 9,
    users: '5 projects',
    roi: '+320%',
    founded: 2023,
    investors: 15,
    tags: ['Ocean', 'Robotics', 'Sustainability'],
    teamMembers: [
      { name: 'Marcus Johnson', role: 'CEO/Founder', experience: 'MIT Robotics PhD' },
      { name: 'Dr. Elena Rodriguez', role: 'Marine Biologist', experience: 'Oceanographer' }
    ],
    technology: ['Autonomous Robotics', 'AI Vision', 'Underwater sensors'],
    marketSize: '$2B+ ocean cleanup and restoration market',
    monthlyRecurring: '$18K MRR',
    fundingUse: ['45% R&D', '30% Deployment', '25% Operations'],
    certifications: ['ISO 26262', 'Marine approved'],
    metrics: { DepthCapacity: '500m', DronesBuilt: '12', DebrisCleaned: '50 tons' }
  },
  {
    owner: '0x' + 'f'.repeat(40),
    name: 'ByteShield',
    description: 'Quantum-resistant cybersecurity infrastructure for enterprise data protection.',
    goal: ethers.parseEther('18').toString(),
    amountRaised: ethers.parseEther('14.5').toString(),
    docs: '/docs/startup-6.txt',
    image: 'https://s3-us-west-2.amazonaws.com/cbi-image-service-prd/modified/e0c4afe0-773e-49e8-b292-6dc51f255f38.png',
    category: 'CyberSecurity',
    stage: 'Series A',
    team: 7,
    users: '100+ enterprises',
    roi: '+520%',
    founded: 2022,
    investors: 18,
    tags: ['Cybersecurity', 'Quantum', 'Enterprise'],
    teamMembers: [
      { name: 'Dr. Vladimir Petrov', role: 'CTO/Founder', experience: 'Cryptography expert, PhD' },
      { name: 'Jennifer Walsh', role: 'VP Sales', experience: '10+ years enterprise security' }
    ],
    technology: ['Quantum-resistant algorithms', 'PKI', 'Zero-trust architecture'],
    marketSize: '$12B+ enterprise cybersecurity market',
    monthlyRecurring: '$78K MRR',
    fundingUse: ['40% Product development', '35% Sales/Marketing', '25% Infrastructure'],
    certifications: ['SOC 2 Type II', 'ISO 27001', 'NSA Suite B'],
    metrics: { EnterpriseClients: '125', DataProtected: '2.5 TB', SecurityIncidents: '0' }
  },
  {
    owner: '0x' + '1'.repeat(40),
    name: 'EcoDrive',
    description: 'Last-mile delivery optimization using AI routing and electric vehicle fleet.',
    goal: ethers.parseEther('22').toString(),
    amountRaised: ethers.parseEther('18.9').toString(),
    docs: '/docs/startup-7.txt',
    image: 'https://seekvectorlogo.com/wp-content/uploads/2018/06/eco-drive-quality-alliance-vector-logo.png',
    category: 'LogisticsTech',
    stage: 'Series B',
    team: 12,
    users: '500K+ deliveries',
    roi: '+380%',
    founded: 2022,
    investors: 20,
    tags: ['AI', 'Logistics', 'EV'],
    teamMembers: [
      { name: 'Hassan Ahmed', role: 'CEO/Founder', experience: 'Former Tesla logistics' },
      { name: 'Lisa Zhang', role: 'ML Lead', experience: '12+ years AI/routing' },
      { name: 'Tom Schmidt', role: 'Fleet Ops', experience: 'UPS veteran' }
    ],
    technology: ['AI Route Optimization', 'EV Management', 'Real-time tracking'],
    marketSize: '$156B last-mile delivery market',
    monthlyRecurring: '$156K MRR',
    fundingUse: ['35% EV fleet expansion', '35% AI development', '30% Operations'],
    certifications: ['ISO 14001', 'Green fleet certified'],
    metrics: { DeliveriesCompleted: '500000', EVFleet: '342', CarbonReduced: '1200 tons' }
  },
  {
    owner: '0x' + '2'.repeat(40),
    name: 'QuantumLeap',
    description: 'Quantum computing optimization software for financial modeling and risk analysis.',
    goal: ethers.parseEther('30').toString(),
    amountRaised: ethers.parseEther('11.2').toString(),
    docs: '/docs/startup-8.txt',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaAiJLTvbSEiYLj12Ii6sx2QTtlE8z3dOkNYcjpKGLgbbQfvpUmmLPAPof-mhyNFWWshg&usqp=CAU',
    category: 'DeepTech',
    stage: 'Series A',
    team: 11,
    users: '20+ banks',
    roi: '+480%',
    founded: 2023,
    investors: 16,
    tags: ['Quantum', 'Finance', 'Deep Tech'],
    teamMembers: [
      { name: 'Dr. Yuki Tanaka', role: 'Founder/CQO', experience: 'Quantum computing PhD' },
      { name: 'Richard Goldman', role: 'VP Finance', experience: 'Goldman Sachs' }
    ],
    technology: ['Quantum algorithms', 'Financial modeling', 'Risk analytics'],
    marketSize: '$8B quantum software market opportunity',
    monthlyRecurring: '$45K MRR',
    fundingUse: ['50% Algorithm development', '30% Bank partnerships', '20% Infrastructure'],
    certifications: ['Quantum Ready', 'Financial sector approved'],
    metrics: { PartnerBanks: '23', SimulationsPerDay: '50000', AccuracyGain: '+340%' }
  },
  {
    owner: '0x' + '3'.repeat(40),
    name: 'MicroMart',
    description: 'AI-powered hyperlocal marketplace connecting consumers with neighborhood shops.',
    goal: ethers.parseEther('16').toString(),
    amountRaised: ethers.parseEther('9.8').toString(),
    docs: '/docs/startup-9.txt',
    image: 'https://mma.prnewswire.com/media/2443146/Micromart_Logo.jpg?p=facebook',
    category: 'E-commerce',
    stage: 'Seed',
    team: 5,
    users: '100K+',
    roi: '+210%',
    founded: 2024,
    investors: 9,
    tags: ['E-commerce', 'Local', 'AI'],
    teamMembers: [
      { name: 'Aisha Mohammed', role: 'Founder/CEO', experience: '6+ years e-commerce' },
      { name: 'Kevin Liu', role: 'Head of Ops', experience: 'Amazon logistics' }
    ],
    technology: ['Hyperlocal matching AI', 'Real-time inventory', 'Mobile-first platform'],
    marketSize: '$156B hyperlocal commerce market',
    monthlyRecurring: '$28K MRR',
    fundingUse: ['35% Community outreach', '35% Tech development', '30% Marketing'],
    certifications: ['Fair trade certified'],
    metrics: { ActiveShops: '1250', DailyOrders: '3400', AverageDelivery: '18 mins' }
  },
  {
    owner: '0x' + '4'.repeat(40),
    name: 'SleepSense',
    description: 'Wearable-powered sleep optimization platform using personalized neurofeedback.',
    goal: ethers.parseEther('14').toString(),
    amountRaised: ethers.parseEther('10.5').toString(),
    docs: '/docs/startup-10.txt',
    image: 'https://images.unsplash.com/photo-1587905140708-dfaf72ae4b04?w=1200&h=800&fit=crop&q=80',
    category: 'HealthTech',
    stage: 'Seed',
    team: 4,
    users: '50K+',
    roi: '+290%',
    founded: 2023,
    investors: 11,
    tags: ['Wearables', 'Sleep', 'Health'],
    teamMembers: [
      { name: 'Dr. Rebecca Stone', role: 'Founder/Sleep researcher', experience: 'Sleep medicine specialist' },
      { name: 'Alex Park', role: 'Hardware lead', experience: '8+ years wearables' }
    ],
    technology: ['EEG sensors', 'Biofeedback', 'Mobile app', 'Machine learning'],
    marketSize: '$4.2B sleep tech market',
    monthlyRecurring: '$52K MRR',
    fundingUse: ['40% Hardware refinement', '30% Clinical trials', '30% Marketing'],
    certifications: ['FDA clearance pending', 'CE marked'],
    metrics: { ActiveUsers: '52000', AvgSleepImprovement: '+47%', Retention: '85%' }
  }
];

// Mock founder campaigns with comprehensive data
const FOUNDER_DEMO_CAMPAIGNS = [
  {
    owner: '0x' + 'd'.repeat(40),
    creator: 'founder1',
    name: 'TechFlow Pro',
    description: 'Next-generation workflow automation platform for enterprises.',
    goal: ethers.parseEther('25').toString(),
    amountRaised: ethers.parseEther('18.5').toString(),
    docs: '/docs/startup-1.txt',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop&q=80',
    category: 'SaaS',
    stage: 'Series A',
    team: 8,
    users: '5K+',
    roi: '+380%',
    founded: 2023,
    investors: 14,
    tags: ['Automation', 'Enterprise', 'SaaS'],
    teamMembers: [
      { name: 'John Smith', role: 'Founder/CEO', experience: '10+ years enterprise software' },
      { name: 'Maria Garcia', role: 'CTO', experience: 'Apple/Microsoft' },
      { name: 'David Wilson', role: 'VP Sales', experience: 'Salesforce veteran' }
    ],
    technology: ['Node.js', 'React', 'PostgreSQL', 'AWS', 'Kubernetes'],
    marketSize: '$8.5B enterprise automation market',
    monthlyRecurring: '$95K MRR',
    fundingUse: ['35% R&D', '35% Sales team', '20% Infrastructure', '10% Operations'],
    customerBase: '125+ enterprise customers with 500+ employees',
    certifications: ['SOC 2 Type II', 'ISO 27001', 'GDPR Compliant'],
    metrics: { EnterpriseClients: '125', AnnualRecurring: '1.14M', Retention: '95%' }
  },
  {
    owner: '0x' + 'd'.repeat(40),
    creator: 'founder1',
    name: 'DataVault Security',
    description: 'Zero-knowledge encrypted cloud storage for sensitive business data.',
    goal: ethers.parseEther('18').toString(),
    amountRaised: ethers.parseEther('12.3').toString(),
    docs: '/docs/startup-2.txt',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop&q=80',
    category: 'CyberSecurity',
    stage: 'Seed',
    team: 5,
    users: '2K+',
    roi: '+290%',
    founded: 2024,
    investors: 10,
    tags: ['Security', 'Cloud', 'Privacy'],
    teamMembers: [
      { name: 'Sarah Chen', role: 'Founder/CSecO', experience: 'Cryptography specialist, PhD' },
      { name: 'Michael Brown', role: 'Cloud architect', experience: 'AWS certified' }
    ],
    technology: ['End-to-end encryption', 'Zero-knowledge architecture', 'Cloud infrastructure'],
    marketSize: '$15B+ enterprise data security market',
    monthlyRecurring: '$28K MRR',
    fundingUse: ['40% Product security', '30% Compliance', '20% Sales', '10% Team'],
    customerBase: '2000+ users across 50+ companies',
    certifications: ['ISO 27001', 'HIPAA Ready', 'Enterprise compliance'],
    metrics: { StorageProtected: '50TB', EncryptionEvents: '2.5M daily', ZeroBreaches: 'Yes' }
  }
];

function App() {
  const [account, setAccount] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [user, setUser] = useState(() => localStorage.getItem('demo_user') || null);
  const [userRole, setUserRole] = useState(() => {
    const storedUser = localStorage.getItem('demo_user');
    return storedUser ? localStorage.getItem(`user_role_${storedUser}`) || 'INVESTOR' : null;
  });
  const [form, setForm] = useState({ name: '', description: '', goal: '' });
  // removed legacy `page` state; using React Router instead
  // Mock transaction data for demo
  const MOCK_TRANSACTIONS = [
    { id: 1, campaignId: 0, campaign: 'NeuroFlow AI', investor: '0x1234...5678', amount: '2.5', type: 'fund', status: 'confirmed', timestamp: Date.now() - 86400000 * 5, hash: '0xabc123...' },
    { id: 2, campaignId: 1, campaign: 'GreenGrow Labs', investor: '0x2345...6789', amount: '1.8', type: 'fund', status: 'confirmed', timestamp: Date.now() - 86400000 * 4, hash: '0xdef456...' },
    { id: 3, campaignId: 2, campaign: 'FinEdge', investor: '0x3456...7890', amount: '5.0', type: 'fund', status: 'confirmed', timestamp: Date.now() - 86400000 * 3, hash: '0xghi789...' },
    { id: 4, campaignId: 3, campaign: 'HealthLoop', investor: '0x4567...8901', amount: '1.2', type: 'fund', status: 'confirmed', timestamp: Date.now() - 86400000 * 2, hash: '0xjkl012...' },
    { id: 5, campaignId: 4, campaign: 'CleanSea', investor: '0x5678...9012', amount: '3.5', type: 'fund', status: 'confirmed', timestamp: Date.now() - 86400000, hash: '0xmno345...' },
    { id: 6, campaignId: 5, campaign: 'ByteShield', investor: '0x6789...0123', amount: '4.2', type: 'fund', status: 'confirmed', timestamp: Date.now() - 43200000, hash: '0xpqr678...' },
    { id: 7, campaignId: 6, campaign: 'EcoDrive', investor: '0x7890...1234', amount: '2.8', type: 'fund', status: 'confirmed', timestamp: Date.now() - 21600000, hash: '0xstu901...' },
    { id: 8, campaignId: 7, campaign: 'QuantumLeap', investor: '0x8901...2345', amount: '6.5', type: 'fund', status: 'pending', timestamp: Date.now() - 3600000, hash: '0xvwx234...' },
    { id: 9, campaignId: 8, campaign: 'MicroMart', investor: '0x9012...3456', amount: '1.5', type: 'fund', status: 'confirmed', timestamp: Date.now() - 1800000, hash: '0xyza567...' },
    { id: 10, campaignId: 9, campaign: 'SleepSense', investor: '0xddd...eeee', amount: '2.2', type: 'fund', status: 'confirmed', timestamp: Date.now() - 900000, hash: '0xbcd890...' }
  ];
  
  const [txs, setTxs] = useState(MOCK_TRANSACTIONS);
  const [balance, setBalance] = useState(null);
  const [connectedThisVisit, setConnectedThisVisit] = useState(false);
  const [modal, setModal] = useState({open:false, title:'', body:null});
  const [pendingRole, setPendingRole] = useState(null);
  const [showWalletPrompt, setShowWalletPrompt] = useState(false);
  const navigate = useNavigate();

  // Initialize demo users and campaigns on first load
  useEffect(() => {
    const existingUsers = localStorage.getItem('demo_users');
    if (!existingUsers) {
      const demoUsers = {
        investor1: { password: 'pass', role: 'INVESTOR' },
        founder1: { password: 'pass', role: 'FOUNDER' }
      };
      localStorage.setItem('demo_users', JSON.stringify(demoUsers));
    }
  }, []);

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
      // Check if MetaMask/wallet extension is installed
      if (!window.ethereum) {
        toast.error('❌ MetaMask not detected. Please install it from https://metamask.io');
        console.error('No Ethereum wallet extension found');
        return;
      }

      try {
        console.log('🔗 Requesting wallet connection...');
        
        // Request account access from wallet
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });

        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts returned from wallet');
        }

        const connectedAccount = accounts[0];
        console.log('✅ Wallet connected:', connectedAccount);
        
        // Set the connected account
        setAccount(connectedAccount);
        setConnectedThisVisit(true);

        // Fetch network and balance information
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          
          // Get balance
          const balance = await provider.getBalance(connectedAccount);
          const formattedBalance = ethers.formatEther(balance);
          setBalance(formattedBalance);
          
          // Get network info
          const network = await provider.getNetwork();
          console.log('🌐 Connected to network:', network.name, '(Chain ID:', network.chainId, ')');
          
          // Format account address for display
          const displayAddress = `${connectedAccount.slice(0, 6)}...${connectedAccount.slice(-4)}`;
          const balanceDisplay = parseFloat(formattedBalance).toFixed(4);
          
          toast.success(`✅ Connected to ${network.name}\n${displayAddress}\nBalance: ${balanceDisplay} ETH`);
        } catch (balErr) {
          console.warn('⚠️ Could not fetch balance:', balErr.message);
          const displayAddress = `${connectedAccount.slice(0, 6)}...${connectedAccount.slice(-4)}`;
          toast.success(`✅ Wallet Connected: ${displayAddress}`);
        }

        // Setup event listeners for account/chain changes
        setupWalletListeners();
        
      } catch (err) {
        // Handle specific error codes from MetaMask
        if (err.code === 4001) {
          console.log('❌ User rejected wallet connection request');
          toast.error('❌ Connection rejected. Please try again.');
        } else if (err.code === -32002) {
          console.log('⚠️ Wallet connection request already pending');
          toast.error('⚠️ Connection request already pending. Check your MetaMask window.');
        } else if (err.code === -32603) {
          console.error('Internal RPC error:', err.message);
          toast.error('❌ RPC error. Please check your network and try again.');
        } else {
          console.error('Wallet connection error:', err);
          toast.error(`❌ Failed to connect: ${err.message || 'Unknown error'}`);
        }
      }
    } catch (err) {
      console.error('connectWallet critical error:', err.message ?? err);
      toast.error('❌ Critical error: ' + (err.message || 'Unknown'));
    }
  }

  function disconnectWallet() {
    try {
      console.log('🔌 Disconnecting wallet...');
      setAccount(null);
      setBalance('0');
      setConnectedThisVisit(false);
      localStorage.removeItem('walletConnected');
      toast.success('✅ Wallet disconnected');
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      toast.error('Failed to disconnect wallet');
    }
  }

  function setupWalletListeners() {
    // Listen for account changes
    if (window.ethereum) {
      // Remove existing listeners to prevent duplicates
      window.ethereum.removeAllListeners?.();
      
      window.ethereum.on('accountsChanged', (newAccounts) => {
        console.log('🔄 Accounts changed:', newAccounts);
        if (newAccounts.length > 0) {
          const newAccount = newAccounts[0];
          setAccount(newAccount);
          
          // Fetch new balance for the account
          const provider = new ethers.BrowserProvider(window.ethereum);
          provider.getBalance(newAccount).then((balance) => {
            setBalance(ethers.formatEther(balance));
          }).catch(err => console.warn('Could not fetch balance:', err));
          
          toast.info(`🔄 Switched to account: ${newAccount.slice(0, 6)}...${newAccount.slice(-4)}`);
        } else {
          disconnectWallet();
        }
      });

      // Listen for network/chain changes
      window.ethereum.on('chainChanged', (chainId) => {
        console.log('🌍 Chain changed to:', chainId);
        toast.info('⚠️ Network changed. Please wait while we refresh...');
        // Reload to ensure all state is fresh with new network
        setTimeout(() => window.location.reload(), 1500);
      });

      // Listen for disconnect
      window.ethereum.on('disconnect', (error) => {
        console.log('❌ Wallet provider disconnected:', error);
        disconnectWallet();
      });
    }
  }

  async function getContract(forReadOnly = false) {
    if (!CONTRACT_ADDRESS) throw new Error('Contract address not configured');

    if (USE_LOCAL_SIGNER) {
      const provider = new ethers.JsonRpcProvider(LOCAL_RPC);
      const signer = provider.getSigner(0);
      return new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
    }

    if (!window.ethereum) throw new Error('No Ethereum provider found. Install MetaMask.');
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // For read-only operations, use just the provider
    if (forReadOnly) {
      return new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, provider);
    }
    
    // For write operations, use the signer
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
  }

  async function fetchCampaigns() {
    try {
      // load from localStorage or start with demo data
      const saved = localStorage.getItem('demo_campaigns');
      if (saved) {
        setCampaigns(JSON.parse(saved));
      } else {
        // Combine investor and founder demo campaigns
        const allCampaigns = [...DEMO_STARTUPS, ...FOUNDER_DEMO_CAMPAIGNS];
        setCampaigns(allCampaigns);
        localStorage.setItem('demo_campaigns', JSON.stringify(allCampaigns));
      }

      // Real contract mode
      if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === 'undefined' || CONTRACT_ADDRESS === '') {
        console.warn('⚠️  No contract address configured. Deploy contract first: npx hardhat run scripts/deploy.js --network localhost');
        // Fallback to demo data if contract not deployed
        const allCampaigns = [...DEMO_STARTUPS, ...FOUNDER_DEMO_CAMPAIGNS];
        setCampaigns(allCampaigns);
        return;
      }

      try {
        // Use read-only contract for fetching campaigns
        const contract = await getContract(true);
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
        const allCampaigns = [...DEMO_STARTUPS, ...FOUNDER_DEMO_CAMPAIGNS];
        setCampaigns(allCampaigns);
        console.log('📌 Using fallback demo data');
      }
    } catch (err) {
      console.error('❌ Failed to fetch campaigns:', err.message ?? err);
      // Final fallback to demo data
      setCampaigns(DEMO_STARTUPS);
    }
  }

  // Improved transaction handling with better state management
  async function simulateTx(index, amountEth) {
    const id = Date.now() + Math.random();
    const amtStr = String(amountEth);
    
    // Validate input
    if (!amountEth || parseFloat(amountEth) <= 0) {
      toast.error('Invalid amount');
      throw new Error('Invalid amount');
    }

    if (index < 0 || index >= campaigns.length) {
      toast.error('Invalid campaign');
      throw new Error('Invalid campaign index');
    }

    // Calculate equity percentage
    const campaign = campaigns[index];
    let equityPercentage = 0;
    try {
      const goalBigInt = BigInt(campaign.goal || '0');
      const amountBigInt = ethers.parseEther(amtStr);
      const goalEth = Number(ethers.formatEther(goalBigInt));
      const amountNum = Number(amtStr);
      equityPercentage = goalEth > 0 ? (amountNum / goalEth) * 100 : 0;
    } catch (e) {
      console.error('Equity calculation error:', e);
      equityPercentage = (Number(amtStr) / 50) * 100; // Fallback calculation
    }

    // Push pending transaction with equity info
    setTxs((s) => [...s, { 
      id, 
      type: 'investment', 
      status: 'pending', 
      amount: amtStr, 
      hash: null,
      campaignName: campaign.name,
      campaignId: index,
      equityPercentage: equityPercentage,
      investmentDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      timestamp: new Date().toISOString()
    }]);
    toast.info(`Submitting ${amtStr} ETH to ${campaign.name}`);

    // Simulate async processing
    await new Promise((res) => setTimeout(res, 1200));

    // 88% success rate for demo
    const success = Math.random() > 0.12;
    if (success) {
      const txHash = '0x' + Math.random().toString(16).slice(2, 18) + Math.random().toString(16).slice(2, 18);
      
      // Update transaction status with equity info
      setTxs((s) => s.map(x => x.id === id ? {
        ...x,
        status: 'confirmed',
        hash: txHash,
        confirmTime: new Date().toISOString(),
        equityPercentage: equityPercentage
      } : x));
      
      toast.success(`${amtStr} ETH received by ${campaign.name} - You own ${equityPercentage.toFixed(2)}%!`);

      // Update campaign amountRaised
      const next = campaigns.slice();
      try {
        const prev = BigInt(next[index].amountRaised || '0');
        const inc = BigInt(ethers.parseEther(amtStr).toString());
        next[index].amountRaised = (prev + inc).toString();
      } catch (e) {
        console.error('Parse error:', e);
        next[index].amountRaised = ((Number(next[index].amountRaised || 0) + Number(amtStr)) || amtStr).toString();
      }
      
      setCampaigns(next);
      localStorage.setItem('demo_campaigns', JSON.stringify(next));
      return true;
    } else {
      setTxs((s) => s.map(x => x.id === id ? {
        ...x,
        status: 'failed',
        errorMsg: 'Transaction reverted',
        timestamp: new Date().toISOString()
      } : x));
      
      toast.error(`Transaction failed: ${campaigns[index].name}`);
      throw new Error('Transaction failed');
    }
  }

  // Handler for creating campaigns from CampaignCreation component
  async function handleCreateCampaign(newCampaign) {
    try {
      const next = [...campaigns, newCampaign];
      setCampaigns(next);
      localStorage.setItem('demo_campaigns', JSON.stringify(next));
      
      // Add transaction log entry
      setTxs((s) => [...s, {
        id: Date.now() + Math.random(),
        type: 'campaign_created',
        status: 'confirmed',
        amount: ethers.formatEther(newCampaign.goal),
          campaignName: newCampaign.name,
          hash: '0x' + Math.random().toString(16).slice(2, 18),
          timestamp: new Date().toISOString()
        }]);
        
      // For real contract mode
      const contract = await getContract();
      const tx = await contract.createCampaign(
        newCampaign.name,
        newCampaign.description,
        BigInt(newCampaign.goal)
      );

      // Add pending transaction
      const id = Date.now() + Math.random();
      setTxs((s) => [...s, {
        id,
        type: 'campaign_created',
        status: 'pending',
        campaignName: newCampaign.name,
        hash: tx.hash || null,
        amount: '0',
        timestamp: new Date().toISOString()
      }]);
      
      toast.info(`Creating campaign "${newCampaign.name}"`);

      // Wait for confirmation
      const receipt = await tx.wait();
      
      setTxs((s) => s.map((x) => x.id === id ? {
        ...x,
        status: 'confirmed',
        hash: receipt.transactionHash || x.hash,
        confirmTime: new Date().toISOString()
      } : x));

      // Add campaign to local state
      const campaignNext = [...campaigns, newCampaign];
      setCampaigns(campaignNext);

      // Update balance
      try {
        const provider = USE_LOCAL_SIGNER ? new ethers.JsonRpcProvider(LOCAL_RPC) : new ethers.BrowserProvider(window.ethereum);
        const bal = await provider.getBalance(account);
        setBalance(ethers.formatEther(bal));
      } catch (e) {
        console.warn('Balance update failed:', e);
      }

      toast.success(`Campaign "${newCampaign.name}" created successfully!`);
      return true;
    } catch (err) {
      console.error('Create campaign failed:', err.message ?? err);
      
      // Add failed transaction
      setTxs((s) => [...s, {
        id: Date.now() + Math.random(),
        type: 'campaign_created',
        status: 'failed',
        campaignName: newCampaign.name,
        hash: null,
        errorMsg: err.message,
        timestamp: new Date().toISOString()
      }]);
      
      toast.error('Failed to create campaign: ' + (err.message || 'Unknown error'));
      throw err;
    }
  }

  async function createCampaign() {
    try {
      const newCampaign = { owner: account || ('0x' + 'd'.repeat(40)), name: form.name, description: form.description, goal: ethers.parseEther(form.goal).toString(), amountRaised: '0' };
      const next = [...campaigns, newCampaign];
      setCampaigns(next);
      localStorage.setItem('demo_campaigns', JSON.stringify(next));

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
      const next = campaigns.slice();
      const amt = ethers.parseEther(amount).toString();
      // amountRaised stored as string (wei) in simulate mode
      const prev = BigInt(next[index].amountRaised || '0');
      const sum = prev + BigInt(amt);
      next[index].amountRaised = sum.toString();
      setCampaigns(next);
      localStorage.setItem('demo_campaigns', JSON.stringify(next));

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
    // On login, set user and get user role
    const users = JSON.parse(localStorage.getItem('demo_users') || '{}');
    const role = users[username]?.role || 'INVESTOR';
    setUser(username);
    setUserRole(role);
    localStorage.setItem(`user_role_${username}`, role);
    setAccount(null);
    setConnectedThisVisit(false);
    setPendingRole(role);
    setShowWalletPrompt(true);
    toast.success(`🎉 Welcome, ${username}!`);
  }

  function handleWalletConnect() {
    connectWallet().then(() => {
      // After wallet connects, navigate
      if (pendingRole === 'FOUNDER') {
        navigate('/founder-dashboard');
      } else {
        navigate('/dashboard');
      }
      setShowWalletPrompt(false);
      setPendingRole(null);
    }).catch(() => {
      // If wallet connection fails, still navigate but wallet is not connected
      setShowWalletPrompt(false);
      setPendingRole(null);
    });
  }

  function handleSkipWallet() {
    // Skip wallet connection and navigate anyway
    if (pendingRole === 'FOUNDER') {
      navigate('/founder-dashboard');
    } else {
      navigate('/dashboard');
    }
    setShowWalletPrompt(false);
    setPendingRole(null);
    toast.info('Wallet connection skipped. You can connect later from the wallet page.');
  }

  function handleLogout() {
    setUser(null);
    setUserRole(null);
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
      <Navbar account={account} onConnect={connectWallet} onDisconnect={disconnectWallet} connectedThisVisit={connectedThisVisit} balance={balance} user={user} onLogout={handleLogout} />
      <div className="container">
      <Routes>
        <Route path="/welcome" element={!user ? <Welcome onGetStarted={() => navigate('/auth')} /> : <Navigate to={userRole === 'FOUNDER' ? '/founder-dashboard' : '/dashboard'} replace />} />
        
        {/* Investor Routes */}
        <Route path="/startups" element={user && userRole === 'INVESTOR' ? <Startups campaigns={campaigns} onDonate={donate} /> : <Navigate to="/auth" replace />} />
        <Route path="/startup/:id" element={user && userRole === 'INVESTOR' ? <StartupDetail campaigns={campaigns} txs={txs} onFund={(i,amt)=>navigate(`/simulate-tx/${i}`)} /> : <Navigate to="/auth" replace />} />
        <Route path="/fund/:id" element={user && userRole === 'INVESTOR' ? <TransactionFlow campaigns={campaigns} simulateTx={simulateTx} connectWallet={connectWallet} account={account} addTx={addTx} /> : <Navigate to="/auth" replace />} />
        <Route path="/simulate-tx/:id" element={user && userRole === 'INVESTOR' ? <TransactionSimulation campaigns={campaigns} account={account} user={user} /> : <Navigate to="/auth" replace />} />
        <Route path="/dashboard" element={user && userRole === 'INVESTOR' ? <Dashboard campaigns={campaigns} onDonate={donate} onSeed={() => {
          const seed = [
            { owner: '0x' + 'c'.repeat(40), name: 'Seed Startup X', description: 'Seed X', goal: ethers.parseEther('20').toString(), amountRaised: '0' },
            { owner: '0x' + 'e'.repeat(40), name: 'Seed Startup Y', description: 'Seed Y', goal: ethers.parseEther('3').toString(), amountRaised: '0' }
          ];
          const next = [...campaigns, ...seed];
          setCampaigns(next);
          localStorage.setItem('demo_campaigns', JSON.stringify(next));
        }} balance={balance} txs={txs} /> : <Navigate to="/auth" replace />} />
        <Route path="/transactions" element={user && userRole === 'INVESTOR' ? <TransactionsPage txs={txs} addTx={addTx} connectWallet={connectWallet} account={account} /> : <Navigate to="/auth" replace />} />
        
        {/* Founder Routes */}
        <Route path="/founder-dashboard" element={user && userRole === 'FOUNDER' ? <FounderDashboard campaigns={campaigns} account={account} user={user} /> : <Navigate to="/auth" replace />} />
        <Route path="/founder-companies" element={user && userRole === 'FOUNDER' ? <FounderCompanies campaigns={campaigns} account={account} user={user} onUpdate={(idx, updated) => {
          const newCampaigns = [...campaigns];
          newCampaigns[campaigns.findIndex(c => c.owner?.toLowerCase() === account?.toLowerCase() && campaigns.indexOf(c) === idx)] = updated;
          setCampaigns(newCampaigns);
          localStorage.setItem('demo_campaigns', JSON.stringify(newCampaigns));
        }} /> : <Navigate to="/auth" replace />} />
        <Route path="/create-campaign" element={user && userRole === 'FOUNDER' ? <CampaignCreation onCreateCampaign={handleCreateCampaign} user={user} account={account} /> : <Navigate to="/auth" replace />} />
        
        {/* Common Routes */}
        <Route path="/wallet" element={user ? <WalletConnect connectWallet={connectWallet} account={account} /> : <Navigate to="/auth" replace />} />
        <Route path="/auth" element={!user ? <Auth onLogin={(u) => { handleLogin(u); }} /> : <Navigate to={userRole === 'FOUNDER' ? '/founder-dashboard' : '/dashboard'} replace />} />
        
        {/* Home Route - Redirect to Welcome */}
        <Route path="/" element={<Navigate to="/welcome" replace />} />
      </Routes>

      {/* <TransactionLog txs={txs} /> */}
      </div>

        <Modal open={modal.open} title={modal.title} onClose={() => setModal({open:false})}>{modal.body}</Modal>

        {/* Wallet Connection Prompt Modal */}
        {showWalletPrompt && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(20,30,48,0.95) 100%)',
              border: '1px solid rgba(96,165,250,0.3)',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '400px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              textAlign: 'center'
            }}>
              <h2 style={{
                color: '#fff',
                marginBottom: '12px',
                fontSize: '1.5rem'
              }}>
                💼 Connect Your Wallet
              </h2>
              <p style={{
                color: 'rgba(255,255,255,0.7)',
                marginBottom: '24px',
                fontSize: '0.95rem',
                lineHeight: '1.5'
              }}>
                To invest in startups or manage your campaigns, please connect your Web3 wallet (MetaMask or similar).
              </p>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <button
                  onClick={handleWalletConnect}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Connect Wallet
                </button>
                
                <button
                  onClick={handleSkipWallet}
                  style={{
                    padding: '12px 24px',
                    background: 'rgba(96,165,250,0.1)',
                    color: '#60a5fa',
                    border: '1px solid rgba(96,165,250,0.3)',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(96,165,250,0.15)';
                    e.currentTarget.style.borderColor = 'rgba(96,165,250,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(96,165,250,0.1)';
                    e.currentTarget.style.borderColor = 'rgba(96,165,250,0.3)';
                  }}
                >
                  Skip for Now
                </button>
              </div>
              
              <p style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.8rem',
                marginTop: '16px'
              }}>
                You can connect your wallet later from the wallet page.
              </p>
            </div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export default App;
