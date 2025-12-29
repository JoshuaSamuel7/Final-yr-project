import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TransactionSimulation = ({ campaigns, account, user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const campaign = campaigns[Number(id)];
  const [amount, setAmount] = useState('0.5');
  const [currentStep, setCurrentStep] = useState(0);
  const [txHash, setTxHash] = useState(null);
  const [gasPrice, setGasPrice] = useState('45');
  const [gasLimit] = useState('123456');
  const [error, setError] = useState(null);

  // Simulate transaction steps
  const steps = [
    {
      title: 'Wallet Connection Verified',
      description: 'Your wallet has been verified and connected to the Ethereum network.',
      details: [
        `Connected Account: ${account?.slice(0, 6)}...${account?.slice(-4) || 'N/A'}`,
        `Network: Ethereum Sepolia (Chain ID: 11155111)`,
        `Wallet Balance: ${(Math.random() * 10 + 0.5).toFixed(4)} ETH`,
        `Network Status: ✅ Connected`
      ]
    },
    {
      title: 'Transaction Parameters Validation',
      description: 'Validating investment amount and campaign details.',
      details: [
        `Campaign: ${campaign?.name}`,
        `Investment Amount: ${amount} ETH`,
        `Amount in USD: $${(parseFloat(amount) * 2450).toFixed(2)} (@ $2,450/ETH)`,
        `Recipient Address: ${campaign?.owner?.slice(0, 10)}...${campaign?.owner?.slice(-8) || 'N/A'}`,
        `Validation Status: ✅ All parameters valid`
      ]
    },
    {
      title: 'Smart Contract Interaction',
      description: 'Preparing smart contract call to StartupFunding.sol',
      details: [
        `Contract Address: 0x${Math.random().toString(16).slice(2, 42).toUpperCase()}`,
        `Function Call: donateToCampaign(${id})`,
        `Method Signature: 0x${Math.random().toString(16).slice(2, 10)}`,
        `Contract Status: ✅ Verified on Etherscan`,
        `Compiler Version: Solidity 0.8.19`
      ]
    },
    {
      title: 'Gas Estimation & Fee Calculation',
      description: 'Calculating optimal gas fees using Chainlink Gas Price Oracle.',
      details: [
        `Base Gas Required: ${gasLimit} units`,
        `Current Gas Price (Chainlink): ${gasPrice} Gwei`,
        `Safe Gas Price: ${gasPrice} Gwei (Standard)`,
        `Total Gas Cost: ${(parseInt(gasLimit) * parseInt(gasPrice) / 1e9).toFixed(4)} ETH`,
        `Estimated Total: ${(parseFloat(amount) + parseInt(gasLimit) * parseInt(gasPrice) / 1e9).toFixed(4)} ETH`,
        `Gas Tracker: EtherScan Gas Tracker ✅ Updated`
      ]
    },
    {
      title: 'Blockchain Submission',
      description: 'Broadcasting transaction to Ethereum mempool.',
      details: [
        `Broadcasting to: Sepolia Testnet`,
        `RPC Provider: Alchemy / Infura`,
        `Transaction Pool Status: Pending...`,
        `Transaction TTL: 300 seconds`,
        `Current Time: ${new Date().toISOString()}`,
        `Mempool Position: ✅ In queue`
      ]
    },
    {
      title: 'Chainlink Oracle Verification',
      description: 'Verifying transaction via Chainlink VRF and Price Oracles.',
      details: [
        `Chainlink VRF ID: 0x${Math.random().toString(16).slice(2, 18).toUpperCase()}`,
        `ETH/USD Oracle Response: $2,450.12`,
        `Oracle Confidence: 99.98%`,
        `Oracle Update Time: 12 seconds ago`,
        `Cross-Chain Verification: ✅ Confirmed`,
        `Randomness Seed: 0x${Math.random().toString(16).slice(2, 20).toUpperCase()}`
      ]
    },
    {
      title: 'Transaction Confirmation',
      description: 'Transaction is being confirmed by network validators.',
      details: [
        `Block Number: ${Math.floor(Math.random() * 100000 + 5000000)}`,
        `Confirmations: 3 / 12 required`,
        `Validators Confirming: 847 / 1200`,
        `Network Hash Rate: 742.35 TH/s`,
        `Estimated Time: ~45 seconds remaining`,
        `Status: 🟡 Confirming (60% complete)`
      ]
    },
    {
      title: 'Transaction Finalized',
      description: 'Transaction successfully confirmed and finalized on Ethereum.',
      details: [
        `Transaction Hash: ${txHash}`,
        `Block Confirmed: ${Math.floor(Math.random() * 100000 + 5000000)}`,
        `Total Confirmations: 12 / 12 ✅`,
        `Final Gas Used: ${(parseInt(gasLimit) * 0.85).toFixed(0)} units`,
        `Transaction Fee: ${(parseInt(gasLimit) * 0.85 * parseInt(gasPrice) / 1e9).toFixed(4)} ETH`,
        `Status: ✅ SUCCESS - View on Etherscan`,
        `Campaign Updated: Amount Raised increased by ${amount} ETH`,
        `Your Portfolio: ${amount} ETH invested`
      ]
    }
  ];

  useEffect(() => {
    if (!campaign) return;
    // Generate fake transaction hash on component mount
    const hash = '0x' + Math.random().toString(16).slice(2, 66).toUpperCase();
    setTxHash(hash);
  }, [campaign]);

  const handleStepPrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleStepNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleAutoPlay = () => {
    let step = 0;
    const interval = setInterval(() => {
      if (step < steps.length - 1) {
        step++;
        setCurrentStep(step);
      } else {
        clearInterval(interval);
      }
    }, 2000);
  };

  const getCurrentStep = () => steps[currentStep];

  if (!campaign) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Campaign not found</h2>
        <button onClick={() => navigate('/startups')}>Back to Startups</button>
      </div>
    );
  }

  const currentStepData = getCurrentStep();
  const isComplete = currentStep === steps.length - 1;

  return (
    <div style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem' }}>Transaction Simulation</h2>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)' }}>
          Complete 8-step process for investing in {campaign.name}
        </p>
      </div>

      {/* Campaign Summary */}
      <div style={{
        padding: '20px',
        borderRadius: '12px',
        background: 'rgba(15,23,42,0.5)',
        border: '1px solid rgba(96,165,250,0.1)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.3rem' }}>Campaign</div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{campaign.name}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.3rem' }}>Investment Amount</div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{amount} ETH</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.3rem' }}>USD Value</div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>${(parseFloat(amount) * 2450).toFixed(2)}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.3rem' }}>Network</div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Ethereum Sepolia</div>
          </div>
        </div>
      </div>

      {/* Step Progress Indicator */}
      <div style={{
        padding: '20px',
        borderRadius: '12px',
        background: 'rgba(15,23,42,0.5)',
        border: '1px solid rgba(96,165,250,0.1)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0 }}>Progress: Step {currentStep + 1} of {steps.length}</h3>
          <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
            {((currentStep + 1) / steps.length * 100).toFixed(0)}% Complete
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          height: '8px',
          borderRadius: '4px',
          background: 'rgba(96,165,250,0.1)',
          overflow: 'hidden',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            height: '100%',
            width: `${(currentStep + 1) / steps.length * 100}%`,
            background: 'linear-gradient(90deg, #3b82f6, #10b981)',
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Step Indicators */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '8px'
        }}>
          {steps.map((step, idx) => (
            <div
              key={idx}
              onClick={() => idx <= currentStep && setCurrentStep(idx)}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                background: idx === currentStep ? 'rgba(59,130,246,0.3)' : idx < currentStep ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${idx === currentStep ? 'rgba(59,130,246,0.5)' : idx < currentStep ? 'rgba(16,185,129,0.3)' : 'rgba(96,165,250,0.1)'}`,
                cursor: idx <= currentStep ? 'pointer' : 'default',
                textAlign: 'center',
                fontSize: '0.75rem',
                color: idx <= currentStep ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>
                {idx < currentStep ? '✅' : idx === currentStep ? '🔄' : '⏳'} Step {idx + 1}
              </div>
              <div style={{ fontSize: '0.65rem', opacity: 0.7 }}>{step.title.split(' ')[0]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Details */}
      <div style={{
        padding: '24px',
        borderRadius: '12px',
        background: 'rgba(15,23,42,0.5)',
        border: '1px solid rgba(96,165,250,0.1)',
        marginBottom: '2rem'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#60a5fa' }}>
            {currentStepData.title}
          </h3>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
            {currentStepData.description}
          </p>
        </div>

        {/* Step Details List */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '1.5rem'
        }}>
          {currentStepData.details.map((detail, idx) => (
            <div
              key={idx}
              style={{
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'rgba(96,165,250,0.05)',
                border: '1px solid rgba(96,165,250,0.15)',
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.85)',
                fontFamily: detail.includes('0x') ? 'monospace' : 'inherit'
              }}
            >
              {detail.includes('✅') ? (
                <span style={{ color: '#10b981' }}>{detail}</span>
              ) : detail.includes('🟡') ? (
                <span style={{ color: '#f59e0b' }}>{detail}</span>
              ) : detail.includes('0x') ? (
                <span style={{ color: '#60a5fa', wordBreak: 'break-all' }}>{detail}</span>
              ) : (
                detail
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons for Last Step */}
        {isComplete && (
          <div style={{
            padding: '16px',
            borderRadius: '8px',
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.3)',
            marginBottom: '1rem'
          }}>
            <p style={{ margin: 0, color: '#10b981', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              ✅ Transaction completed successfully!
            </p>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
              <strong>View Transaction:</strong>
              <div style={{
                marginTop: '0.5rem',
                padding: '8px 12px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                wordBreak: 'break-all',
                color: '#60a5fa',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
                  style={{ color: '#60a5fa', textDecoration: 'none' }}>
                  {txHash} ↗
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation and Controls */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleStepPrevious}
            disabled={currentStep === 0}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              background: currentStep === 0 ? 'rgba(255,255,255,0.05)' : 'transparent',
              border: '1px solid rgba(96,165,250,0.2)',
              color: currentStep === 0 ? 'rgba(255,255,255,0.4)' : '#60a5fa',
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'all 0.2s ease'
            }}
          >
            ← Previous Step
          </button>

          <button
            onClick={handleStepNext}
            disabled={isComplete}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              background: isComplete ? 'rgba(255,255,255,0.05)' : 'rgba(59,130,246,0.1)',
              border: '1px solid rgba(96,165,250,0.3)',
              color: isComplete ? 'rgba(255,255,255,0.4)' : '#60a5fa',
              cursor: isComplete ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'all 0.2s ease'
            }}
          >
            Next Step →
          </button>

          <button
            onClick={handleAutoPlay}
            disabled={isComplete}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              background: 'rgba(59,130,246,0.1)',
              border: '1px solid rgba(96,165,250,0.3)',
              color: '#60a5fa',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'all 0.2s ease'
            }}
          >
            ▶ Auto Play
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {isComplete && (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: '1px solid rgba(96,165,250,0.2)',
                  color: '#60a5fa',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease'
                }}
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate('/startups')}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  background: '#3b82f6',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
              >
                Invest More
              </button>
            </>
          )}
        </div>
      </div>

      {/* Transaction Details Card */}
      <div style={{
        marginTop: '2rem',
        padding: '16px',
        borderRadius: '12px',
        background: 'rgba(15,23,42,0.3)',
        border: '1px solid rgba(96,165,250,0.1)',
        fontSize: '0.85rem'
      }}>
        <h4 style={{ margin: '0 0 1rem 0', color: 'rgba(255,255,255,0.8)' }}>📊 Transaction Details</h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          <div>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Gas Price (Chainlink):</span>
            <div style={{ fontWeight: 600, marginTop: '0.3rem', color: '#60a5fa' }}>{gasPrice} Gwei</div>
          </div>
          <div>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Gas Limit:</span>
            <div style={{ fontWeight: 600, marginTop: '0.3rem', color: '#60a5fa' }}>{gasLimit} units</div>
          </div>
          <div>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Total Gas Cost:</span>
            <div style={{ fontWeight: 600, marginTop: '0.3rem', color: '#60a5fa' }}>
              {(parseInt(gasLimit) * parseInt(gasPrice) / 1e9).toFixed(4)} ETH
            </div>
          </div>
          <div>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Network:</span>
            <div style={{ fontWeight: 600, marginTop: '0.3rem', color: '#60a5fa' }}>Ethereum Sepolia (11155111)</div>
          </div>
          {txHash && (
            <div>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Block Explorer:</span>
              <div style={{ fontWeight: 600, marginTop: '0.3rem' }}>
                <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
                  style={{ color: '#60a5fa', textDecoration: 'none' }}>
                  View on EtherScan ↗
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionSimulation;
