import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import ShareCertificate from './ShareCertificate';
import Toaster from './Toaster';

const TransactionFlow = ({ campaigns, account, addTx }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const campaign = campaigns[Number(id)];
  const [currentStep, setCurrentStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [investmentGoal, setInvestmentGoal] = useState('');
  const [riskTolerance, setRiskTolerance] = useState('');
  const [investmentPeriod, setInvestmentPeriod] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [equityAgreement, setEquityAgreement] = useState(false);
  const [agreement, setAgreement] = useState(false);
  const [status, setStatus] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [equityData, setEquityData] = useState(null);
  const [connectedThisVisit, setConnectedThisVisit] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const totalSteps = 4;
  const numAmount = Number(amount) || 0;
  const equityPercentage = campaign ? (numAmount / (ethers.formatEther(campaign.goal) || 1)) * 100 : 0;

  const handleConnect = async () => {
    setConnecting(true);
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setConnectedThisVisit(true);
      } else {
        setConnectedThisVisit(true);
      }
    } finally {
      setConnecting(false);
    }
  };

  const handleFund = async () => {
    if (!canSubmit()) return;
    
    setStatus('pending');
    setTimeout(() => {
      const txHash = '0x' + Math.random().toString(16).slice(2, 66);
      setStatus('confirmed');
      
      if (addTx) {
        addTx({
          id: Date.now(),
          type: 'investment',
          amount: numAmount,
          hash: txHash,
          status: 'confirmed',
          campaignName: campaign.name,
          equityPercentage: equityPercentage,
          investmentDate: new Date().toLocaleDateString(),
        });
      }

      setEquityData({
        companyName: campaign.name,
        investmentAmount: numAmount,
        equityPercentage: equityPercentage,
        investmentDate: new Date().toLocaleDateString(),
        txHash: txHash,
        userName: 'Investor',
        walletAddress: account || '0x' + 'd'.repeat(40),
        onContinue: () => {
          setShowCertificate(false);
          setTimeout(() => navigate('/dashboard'), 500);
        }
      });
      
      setShowCertificate(true);
    }, 2000);
  };

  const canGoToStep2 = () => Number(amount) > 0;
  const canGoToStep3 = () => investmentGoal && riskTolerance && investmentPeriod;
  const canGoToStep4 = () => connectedThisVisit || account;
  const canSubmit = () => termsAccepted && equityAgreement && agreement;

  if (!campaign) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Campaign not found</div>;
  }

  return (
    <div style={{ padding: 0, maxWidth: '900px', margin: '0 auto' }}>
      {showCertificate && equityData && (
        <ShareCertificate {...equityData} />
      )}

      {/* Progress Indicator */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700' }}>
            {currentStep === 1 && 'Select Investment Amount'}
            {currentStep === 2 && 'Choose Your Profile'}
            {currentStep === 3 && 'Connect Wallet'}
            {currentStep === 4 && 'Review & Confirm'}
          </h2>
          <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
            Step {currentStep} of {totalSteps}
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '1.5rem',
          height: '6px',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i}
              style={{
                flex: 1,
                height: '6px',
                borderRadius: '3px',
                background: i < currentStep ? 'linear-gradient(90deg, #3b82f6, #60a5fa)' : 
                            i === currentStep - 1 ? 'linear-gradient(90deg, #60a5fa, #3b82f6)' : 
                            'rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Startup Context Card - Always Visible */}
      <div style={{
        padding: 20,
        borderRadius: 12,
        background: 'rgba(15,23,42,0.8)',
        border: '1px solid rgba(96,165,250,0.15)',
        marginBottom: '2rem',
        display: 'grid',
        gridTemplateColumns: '120px 1fr',
        gap: 16,
        alignItems: 'start'
      }}>
        <div style={{
          height: '100px',
          borderRadius: '8px',
          background: `url('${campaign.image || 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid rgba(96,165,250,0.2)'
        }} />
        <div>
          <h3 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1.1rem' }}>{campaign.name}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: '0.8rem' }}>
            <div>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Goal: </span>
              <span style={{ fontWeight: '600', color: '#60a5fa' }}>{ethers.formatEther(campaign.goal).slice(0, 6)} ETH</span>
            </div>
            <div>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Raised: </span>
              <span style={{ fontWeight: '600', color: '#10b981' }}>{ethers.formatEther(campaign.amountRaised).slice(0, 6)} ETH</span>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 1: Investment Amount */}
      {currentStep === 1 && (
        <div style={{
          padding: 24,
          borderRadius: 12,
          background: 'linear-gradient(135deg, rgba(96,165,250,0.08), rgba(6,182,212,0.05))',
          border: '2px solid rgba(96,165,250,0.15)',
          marginBottom: '2rem',
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.3rem', color: '#e0f2fe' }}>💰 How much do you want to invest?</h3>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '12px',
              color: 'rgba(255,255,255,0.9)',
              fontWeight: '600',
              fontSize: '1rem',
            }}>
              Investment Amount (ETH)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 14px',
                borderRadius: '8px',
                border: '2px solid rgba(96,165,250,0.3)',
                background: 'rgba(255,255,255,0.02)',
                color: 'white',
                fontSize: '1.1rem',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(96,165,250,0.8)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(96,165,250,0.3)'; }}
            />
            <p style={{ margin: '12px 0 0 0', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
              Your equity stake: <span style={{ fontWeight: '700', color: '#10b981', fontSize: '1.1rem' }}>{equityPercentage.toFixed(2)}%</span>
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ margin: '0 0 12px 0', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: '600' }}>
              Quick select:
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['0.5', '1.0', '2.5', '5.0', '10.0'].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val)}
                  style={{
                    padding: '12px 18px',
                    background: amount === val ? '#3b82f6' : 'rgba(96,165,250,0.1)',
                    border: `2px solid ${amount === val ? '#3b82f6' : 'rgba(96,165,250,0.2)'}`,
                    borderRadius: '8px',
                    color: amount === val ? 'white' : '#60a5fa',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => { if (amount !== val) e.currentTarget.style.background = 'rgba(96,165,250,0.2)'; }}
                  onMouseLeave={(e) => { if (amount !== val) e.currentTarget.style.background = 'rgba(96,165,250,0.1)'; }}
                >
                  {val} ETH
                </button>
              ))}
            </div>
          </div>

          <div style={{
            padding: 16,
            background: 'rgba(59,130,246,0.1)',
            borderRadius: 8,
            border: '1px solid rgba(59,130,246,0.2)',
            marginBottom: '2rem',
          }}>
            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)' }}>
              <strong>Investment Summary:</strong>
              <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Amount:</div>
                  <div style={{ fontWeight: '700', color: '#60a5fa', fontSize: '1.1rem' }}>{numAmount.toFixed(2)} ETH</div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Your Equity:</div>
                  <div style={{ fontWeight: '700', color: '#10b981', fontSize: '1.1rem' }}>{equityPercentage.toFixed(2)}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Investment Profile */}
      {currentStep === 2 && (
        <div style={{
          padding: 24,
          borderRadius: 12,
          background: 'linear-gradient(135deg, rgba(96,165,250,0.08), rgba(6,182,212,0.05))',
          border: '2px solid rgba(96,165,250,0.15)',
          marginBottom: '2rem',
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.3rem', color: '#e0f2fe' }}>📊 Tell us about your investment profile</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: '1.5rem' }}>
            {/* Investment Goal */}
            <div>
              <label style={{ display: 'block', marginBottom: '12px', color: 'rgba(255,255,255,0.9)', fontWeight: '600', fontSize: '1rem' }}>
                🎯 Investment Goal
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { value: 'growth', label: 'Capital Growth', icon: '📈' },
                  { value: 'income', label: 'Income Generation', icon: '💰' },
                  { value: 'impact', label: 'Social Impact', icon: '🌍' },
                  { value: 'portfolio', label: 'Diversification', icon: '📊' },
                ].map((goal) => (
                  <label
                    key={goal.value}
                    style={{
                      padding: '14px',
                      borderRadius: '8px',
                      border: investmentGoal === goal.value ? '2px solid #3b82f6' : '1px solid rgba(96,165,250,0.2)',
                      background: investmentGoal === goal.value ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.01)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '0.95rem',
                    }}
                    onMouseEnter={(e) => { if (investmentGoal !== goal.value) e.currentTarget.style.background = 'rgba(96,165,250,0.05)'; }}
                    onMouseLeave={(e) => { if (investmentGoal !== goal.value) e.currentTarget.style.background = 'rgba(255,255,255,0.01)'; }}
                  >
                    <input
                      type="radio"
                      name="goal"
                      value={goal.value}
                      checked={investmentGoal === goal.value}
                      onChange={(e) => setInvestmentGoal(e.target.value)}
                      style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                    />
                    <span>{goal.icon} {goal.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Risk Tolerance */}
            <div>
              <label style={{ display: 'block', marginBottom: '12px', color: 'rgba(255,255,255,0.9)', fontWeight: '600', fontSize: '1rem' }}>
                ⚖️ Risk Tolerance
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { value: 'conservative', label: 'Conservative', icon: '🛡️' },
                  { value: 'medium', label: 'Moderate', icon: '⚖️' },
                  { value: 'aggressive', label: 'Aggressive', icon: '🚀' },
                ].map((risk) => (
                  <label
                    key={risk.value}
                    style={{
                      padding: '14px',
                      borderRadius: '8px',
                      border: riskTolerance === risk.value ? '2px solid #f59e0b' : '1px solid rgba(96,165,250,0.2)',
                      background: riskTolerance === risk.value ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.01)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '0.95rem',
                    }}
                    onMouseEnter={(e) => { if (riskTolerance !== risk.value) e.currentTarget.style.background = 'rgba(96,165,250,0.05)'; }}
                    onMouseLeave={(e) => { if (riskTolerance !== risk.value) e.currentTarget.style.background = 'rgba(255,255,255,0.01)'; }}
                  >
                    <input
                      type="radio"
                      name="risk"
                      value={risk.value}
                      checked={riskTolerance === risk.value}
                      onChange={(e) => setRiskTolerance(e.target.value)}
                      style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                    />
                    <span>{risk.icon} {risk.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Investment Period */}
          <div>
            <label style={{ display: 'block', marginBottom: '12px', color: 'rgba(255,255,255,0.9)', fontWeight: '600', fontSize: '1rem' }}>
              ⏱️ Investment Timeframe
            </label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {[
                { value: '1-2 years', label: '1-2 Years', icon: '⏲️' },
                { value: '3-5 years', label: '3-5 Years', icon: '📅' },
                { value: '5+ years', label: '5+ Years', icon: '🏛️' },
              ].map((period) => (
                <label
                  key={period.value}
                  style={{
                    flex: '1 1 calc(33.333% - 12px)',
                    padding: '14px',
                    borderRadius: '8px',
                    border: investmentPeriod === period.value ? '2px solid #10b981' : '1px solid rgba(96,165,250,0.2)',
                    background: investmentPeriod === period.value ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.01)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '0.95rem',
                    textAlign: 'center',
                  }}
                  onMouseEnter={(e) => { if (investmentPeriod !== period.value) e.currentTarget.style.background = 'rgba(96,165,250,0.05)'; }}
                  onMouseLeave={(e) => { if (investmentPeriod !== period.value) e.currentTarget.style.background = 'rgba(255,255,255,0.01)'; }}
                >
                  <input
                    type="radio"
                    name="period"
                    value={period.value}
                    checked={investmentPeriod === period.value}
                    onChange={(e) => setInvestmentPeriod(e.target.value)}
                    style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                  />
                  <span>{period.icon} {period.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Connect Wallet */}
      {currentStep === 3 && (
        <div style={{
          padding: 24,
          borderRadius: 12,
          background: 'linear-gradient(135deg, rgba(96,165,250,0.08), rgba(6,182,212,0.05))',
          border: '2px solid rgba(96,165,250,0.15)',
          marginBottom: '2rem',
          textAlign: 'center',
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.3rem', color: '#e0f2fe' }}>🔗 Connect Your Wallet</h3>

          <div style={{
            padding: 32,
            background: 'rgba(59,130,246,0.1)',
            borderRadius: 12,
            border: '2px solid rgba(59,130,246,0.2)',
            marginBottom: '2rem',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
            <p style={{ margin: '0 0 1rem 0', color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', fontWeight: '600' }}>
              {connectedThisVisit || account ? '✅ Wallet Connected!' : 'Connect your wallet to continue'}
            </p>
            {connectedThisVisit || account ? (
              <p style={{ margin: 0, color: '#10b981', fontSize: '0.95rem' }}>
                Account: {account?.slice(0, 10)}...{account?.slice(-8)}
              </p>
            ) : (
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>
                You'll need to sign a transaction to confirm your investment
              </p>
            )}
          </div>

          {!connectedThisVisit && !account && (
            <button
              onClick={handleConnect}
              disabled={connecting}
              style={{
                width: '100%',
                padding: '16px',
                background: '#f59e0b',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '700',
                cursor: connecting ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                opacity: connecting ? 0.6 : 1,
              }}
              onMouseEnter={(e) => { if (!connecting) e.currentTarget.style.background = '#d97706'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#f59e0b'; }}
            >
              {connecting ? '⏳ Connecting Wallet...' : '🔗 Connect Wallet'}
            </button>
          )}
        </div>
      )}

      {/* STEP 4: Review & Confirm */}
      {currentStep === 4 && (
        <div style={{
          padding: 24,
          borderRadius: 12,
          background: 'linear-gradient(135deg, rgba(96,165,250,0.08), rgba(6,182,212,0.05))',
          border: '2px solid rgba(96,165,250,0.15)',
          marginBottom: '2rem',
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.3rem', color: '#e0f2fe' }}>📋 Review & Confirm</h3>

          {/* Investment Summary */}
          <div style={{
            padding: 20,
            background: 'rgba(59,130,246,0.1)',
            borderRadius: 12,
            border: '1px solid rgba(59,130,246,0.2)',
            marginBottom: '1.5rem',
          }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', color: '#e0f2fe' }}>Investment Summary</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '4px' }}>Amount</div>
                <div style={{ fontWeight: '700', fontSize: '1.2rem', color: '#60a5fa' }}>{numAmount.toFixed(2)} ETH</div>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '4px' }}>Your Equity</div>
                <div style={{ fontWeight: '700', fontSize: '1.2rem', color: '#10b981' }}>{equityPercentage.toFixed(2)}%</div>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '4px' }}>Investment Goal</div>
                <div style={{ fontWeight: '700', fontSize: '1rem', color: 'rgba(255,255,255,0.9)' }}>
                  {investmentGoal === 'growth' && '📈 Capital Growth'}
                  {investmentGoal === 'income' && '💰 Income'}
                  {investmentGoal === 'impact' && '🌍 Social Impact'}
                  {investmentGoal === 'portfolio' && '📊 Diversification'}
                </div>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '4px' }}>Timeframe</div>
                <div style={{ fontWeight: '700', fontSize: '1rem', color: 'rgba(255,255,255,0.9)' }}>{investmentPeriod}</div>
              </div>
            </div>
          </div>

          {/* Legal Agreements */}
          <div style={{
            padding: 20,
            background: 'rgba(245,158,11,0.08)',
            borderRadius: 12,
            border: '1px solid rgba(245,158,11,0.2)',
            marginBottom: '1.5rem',
          }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', color: '#e0f2fe' }}>Legal Agreements</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ padding: '12px', borderRadius: '8px', border: termsAccepted ? '2px solid #3b82f6' : '1px solid rgba(96,165,250,0.2)', background: termsAccepted ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.01)', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.9rem' }}>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  style={{ marginTop: '4px', cursor: 'pointer', width: '18px', height: '18px' }}
                />
                <span style={{ color: 'rgba(255,255,255,0.8)' }}>✅ I have read and agree to the <strong>Investment Terms & Conditions</strong></span>
              </label>

              <label style={{ padding: '12px', borderRadius: '8px', border: equityAgreement ? '2px solid #10b981' : '1px solid rgba(96,165,250,0.2)', background: equityAgreement ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.01)', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.9rem' }}>
                <input
                  type="checkbox"
                  checked={equityAgreement}
                  onChange={(e) => setEquityAgreement(e.target.checked)}
                  style={{ marginTop: '4px', cursor: 'pointer', width: '18px', height: '18px' }}
                />
                <span style={{ color: 'rgba(255,255,255,0.8)' }}>💎 I understand I am acquiring <strong>{equityPercentage.toFixed(2)}% equity</strong> and acknowledge the risks</span>
              </label>

              <label style={{ padding: '12px', borderRadius: '8px', border: agreement ? '2px solid #f59e0b' : '1px solid rgba(96,165,250,0.2)', background: agreement ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.01)', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.9rem' }}>
                <input
                  type="checkbox"
                  checked={agreement}
                  onChange={(e) => setAgreement(e.target.checked)}
                  style={{ marginTop: '4px', cursor: 'pointer', width: '18px', height: '18px' }}
                />
                <span style={{ color: 'rgba(255,255,255,0.8)' }}>🏛️ I confirm all information is accurate and I am legally eligible to invest</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Status Message */}
      {status && (
        <div style={{
          padding: '1.2rem',
          borderRadius: '10px',
          background: status === 'confirmed' ? 'rgba(34,197,94,0.1)' : status === 'failed' ? 'rgba(239,68,68,0.1)' : 'rgba(96,165,250,0.1)',
          border: `2px solid ${status === 'confirmed' ? 'rgba(34,197,94,0.3)' : status === 'failed' ? 'rgba(239,68,68,0.3)' : 'rgba(96,165,250,0.3)'}`,
          color: status === 'confirmed' ? '#10b981' : status === 'failed' ? '#ef4444' : '#3b82f6',
          fontSize: '0.95rem',
          fontWeight: '600',
          marginBottom: '1.5rem',
        }}>
          {status === 'confirmed' ? '✅ Investment confirmed! Your share certificate is being generated...' : status === 'failed' ? '❌ Transaction failed. Please try again.' : '⏳ Processing your investment...'}
        </div>
      )}

      {/* Navigation Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: '2rem' }}>
        {currentStep > 1 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            style={{
              padding: '14px 16px',
              background: 'transparent',
              border: '2px solid rgba(96,165,250,0.3)',
              borderRadius: '8px',
              color: '#60a5fa',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(96,165,250,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            ← Back
          </button>
        )}

        {currentStep < totalSteps && (
          <button
            onClick={() => {
              if (currentStep === 1 && !canGoToStep2()) {
                alert('Please enter a valid investment amount');
                return;
              }
              if (currentStep === 2 && !canGoToStep3()) {
                alert('Please complete your investment profile');
                return;
              }
              if (currentStep === 3 && !canGoToStep4()) {
                alert('Please connect your wallet');
                return;
              }
              setCurrentStep(currentStep + 1);
            }}
            style={{
              padding: '14px 16px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(59,130,246,0.3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            Next →
          </button>
        )}

        {currentStep === totalSteps && (
          <button
            onClick={handleFund}
            disabled={status === 'pending' || !canSubmit()}
            style={{
              gridColumn: 'span 2',
              padding: '16px',
              background: !canSubmit() ? 'rgba(96,165,250,0.3)' : 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontWeight: '700',
              cursor: status === 'pending' || !canSubmit() ? 'not-allowed' : 'pointer',
              fontSize: '1.05rem',
              transition: 'all 0.2s ease',
              opacity: status === 'pending' || !canSubmit() ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!(status === 'pending' || !canSubmit())) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(16,185,129,0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {status === 'pending' ? '⏳ Processing...' : '✅ Complete Investment & Get Certificate'}
          </button>
        )}
      </div>

      <div style={{ padding: 20, background: 'rgba(96,165,250,0.05)', borderRadius: 8, border: '1px solid rgba(96,165,250,0.1)', textAlign: 'center' }}>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
          📋 Estimated time to complete: 2-3 minutes
        </p>
      </div>
    </div>
  );
};

export default TransactionFlow;
