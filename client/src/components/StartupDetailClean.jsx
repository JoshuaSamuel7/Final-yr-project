import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

const StartupDetail = ({ campaigns = [], txs = [] }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const idx = Number(id);
  const campaign = campaigns[idx];
  const [activeTab, setActiveTab] = useState('overview');
  if (!campaign) return <div style={{ padding: 12 }}>Startup not found</div>;

  // Find user's investment in this startup
  const userInvestment = txs.find(
    t => ['investment', 'donation'].includes(t.type) && 
         t.campaignId === idx && 
         t.status === 'confirmed'
  );

  // Calculate metrics
  const rawGoal = BigInt(campaign.goal || '0');
  const rawRaised = BigInt(campaign.amountRaised || '0');
  const goalEth = ethers.formatEther(rawGoal);
  const raisedEth = ethers.formatEther(rawRaised);
  const fundingPercent = rawGoal > 0n ? Number((rawRaised * 10000n) / rawGoal) / 100 : 0;

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', background: 'rgba(15,23,42,0.5)' }}>
      {/* Navigation Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => navigate('/startups')}
          style={{
            padding: '8px 16px',
            background: 'rgba(96,165,250,0.1)',
            border: '1px solid rgba(96,165,250,0.3)',
            borderRadius: '6px',
            color: '#60a5fa',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          ← Back to Startups
        </button>
        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', display: 'flex', gap: '12px' }}>
          <span>📊 Funding Stage: <strong>{campaign.stage}</strong></span>
          <span>•</span>
          <span>🏙️ Founded: <strong>{campaign.founded}</strong></span>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          alignItems: 'center'
        }}>
          {/* Hero Image */}
          <div>
            {campaign.image && (
              <div style={{
                width: '100%',
                height: '450px',
                borderRadius: '20px',
                background: `linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url(${campaign.image}) center/cover`,
                border: '2px solid rgba(96,165,250,0.3)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 30px 80px rgba(0,0,0,0.4)'
              }} />
            )}
          </div>

          {/* Hero Content */}
          <div>
            <h1 style={{ margin: '0 0 1rem 0', fontSize: '2.8rem', fontWeight: '700', lineHeight: '1.2' }}>
              {campaign.name}
            </h1>
            <p style={{ margin: '0 0 1.5rem 0', color: 'rgba(255,255,255,0.8)', fontSize: '1.15rem', lineHeight: '1.6' }}>
              {campaign.description}
            </p>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {campaign.tags && campaign.tags.slice(0, 4).map((tag, i) => (
                <span key={i} style={{ padding: '8px 16px', background: 'rgba(96,165,250,0.15)', borderRadius: '20px', fontSize: '0.85rem', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa' }}>
                  {tag}
                </span>
              ))}
            </div>
            <button
              onClick={() => navigate(`/fund/${idx}`)}
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontWeight: '700',
                fontSize: '1.05rem',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(59,130,246,0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 15px 40px rgba(59,130,246,0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 30px rgba(59,130,246,0.3)';
              }}
            >
              {userInvestment ? '📈 Invest More' : '💰 Invest Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Key Stats Bar */}
      <div style={{ marginBottom: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        <div style={{
          padding: '20px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))',
          border: '1px solid rgba(59,130,246,0.3)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>Funding Raised</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#60a5fa' }}>{parseFloat(ethers.formatEther(BigInt(campaign.amountRaised || '0'))).toFixed(2)} ETH</div>
        </div>
        <div style={{
          padding: '20px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))',
          border: '1px solid rgba(16,185,129,0.3)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>Target Goal</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#10b981' }}>{parseFloat(ethers.formatEther(BigInt(campaign.goal || '0'))).toFixed(2)} ETH</div>
        </div>
        <div style={{
          padding: '20px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.05))',
          border: '1px solid rgba(168,85,247,0.3)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>Total Investors</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#d8b4fe' }}>{campaign.investors}+</div>
        </div>
        <div style={{
          padding: '20px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(251,146,60,0.15), rgba(251,146,60,0.05))',
          border: '1px solid rgba(251,146,60,0.3)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>Expected ROI</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#fb923c' }}>{campaign.roi}</div>
        </div>
      </div>

      {/* User Investment Section - Enhanced */}
      {userInvestment && (
        <div style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.08))',
          border: '2px solid rgba(16,185,129,0.4)',
          marginBottom: '3rem',
          boxShadow: '0 10px 30px rgba(16,185,129,0.1)'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>✓ Your Investment</div>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>You're invested in this opportunity</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600' }}>Your Investment Amount</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>{userInvestment.amount} ETH</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Active investment</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600' }}>Your Ownership Stake</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>{(userInvestment.equityPercentage || 0).toFixed(2)}%</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>of this company</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600' }}>Investment Date</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '4px' }}>{userInvestment.investmentDate}</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Status: Confirmed</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(96,165,250,0.2)' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['overview', 'business', 'team', 'financials'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? '3px solid #3b82f6' : '3px solid transparent',
                color: activeTab === tab ? '#3b82f6' : 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                fontWeight: activeTab === tab ? '700' : '600',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'overview' && '📊 Overview'}
              {tab === 'business' && '💼 Business'}
              {tab === 'team' && '👥 Team'}
              {tab === 'financials' && '💰 Financials'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      {activeTab === 'overview' && (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
        <div>
          {/* Company Overview */}
          <div style={{ marginBottom: '2rem', padding: '24px', borderRadius: '14px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(96,165,250,0.1)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.3rem' }}>About {campaign.name}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>Industry</div>
                <div style={{ fontWeight: '600', fontSize: '1.05rem' }}>{campaign.category}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>Stage</div>
                <div style={{ fontWeight: '600', fontSize: '1.05rem' }}>{campaign.stage}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>Team Size</div>
                <div style={{ fontWeight: '600', fontSize: '1.05rem' }}>{campaign.team} members</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>Active Users</div>
                <div style={{ fontWeight: '600', fontSize: '1.05rem' }}>{campaign.users}</div>
              </div>
            </div>
          </div>

          {/* Funding Progress - Enhanced */}
          <div style={{ marginBottom: '2rem', padding: '24px', borderRadius: '14px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(96,165,250,0.1)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.3rem' }}>🎯 Funding Progress</h3>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '600', fontSize: '1rem' }}>Campaign Progress</span>
                <span style={{ fontWeight: '700', color: '#10b981', fontSize: '1.3rem' }}>
                  {(() => {
                    const rawGoal = BigInt(campaign.goal || '0');
                    const rawRaised = BigInt(campaign.amountRaised || '0');
                    return rawGoal > 0n ? Number((rawRaised * 10000n) / rawGoal) / 100 : 0;
                  })().toFixed(1)}%
                </span>
              </div>
              <div style={{ height: '20px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden', border: '1px solid rgba(96,165,250,0.2)' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, (() => {
                    const rawGoal = BigInt(campaign.goal || '0');
                    const rawRaised = BigInt(campaign.amountRaised || '0');
                    return rawGoal > 0n ? Number((rawRaised * 10000n) / rawGoal) / 100 : 0;
                  })())}%`,
                  background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 100%)',
                  transition: 'width 0.5s ease',
                  boxShadow: '0 0 20px rgba(16,185,129,0.5)'
                }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div style={{ padding: '16px', background: 'rgba(59,130,246,0.1)', borderRadius: '10px', border: '1px solid rgba(59,130,246,0.3)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>💰 Raised</div>
                <div style={{ fontWeight: '700', color: '#60a5fa', fontSize: '1.2rem' }}>{parseFloat(ethers.formatEther(BigInt(campaign.amountRaised || '0'))).toFixed(2)} ETH</div>
              </div>
              <div style={{ padding: '16px', background: 'rgba(100,116,139,0.1)', borderRadius: '10px', border: '1px solid rgba(100,116,139,0.3)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>🎯 Goal</div>
                <div style={{ fontWeight: '700', color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem' }}>{parseFloat(ethers.formatEther(BigInt(campaign.goal || '0'))).toFixed(2)} ETH</div>
              </div>
              <div style={{ padding: '16px', background: 'rgba(168,85,247,0.1)', borderRadius: '10px', border: '1px solid rgba(168,85,247,0.3)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>👥 Backers</div>
                <div style={{ fontWeight: '700', color: '#d8b4fe', fontSize: '1.2rem' }}>{campaign.investors}+</div>
              </div>
            </div>
          </div>

          {/* Customer Base */}
          {campaign.customerBase && (
            <div style={{ marginBottom: '2rem', padding: '24px', borderRadius: '14px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(96,165,250,0.1)' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.3rem' }}>👥 Customer Base</h3>
              <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                <div style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.7' }}>
                  {campaign.customerBase}
                </div>
              </div>
            </div>
          )}

          {/* Market Size & Revenue */}
          {(campaign.marketSize || campaign.monthlyRecurring) && (
            <div style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {campaign.marketSize && (
                <div style={{ padding: '20px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))', border: '2px solid rgba(59,130,246,0.3)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '10px', fontWeight: '600', textTransform: 'uppercase' }}>📊 Addressable Market</div>
                  <div style={{ fontWeight: '700', fontSize: '1.3rem', color: '#60a5fa', lineHeight: '1.4' }}>{campaign.marketSize}</div>
                </div>
              )}
              {campaign.monthlyRecurring && (
                <div style={{ padding: '20px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))', border: '2px solid rgba(16,185,129,0.3)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '10px', fontWeight: '600', textTransform: 'uppercase' }}>💵 Monthly Revenue</div>
                  <div style={{ fontWeight: '700', fontSize: '1.3rem', color: '#10b981', lineHeight: '1.4' }}>{campaign.monthlyRecurring}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* CTA Button */}
          <button
            onClick={() => navigate(`/fund/${idx}`)}
            style={{
              width: '100%',
              padding: '16px 20px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontWeight: '700',
              fontSize: '1.05rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 30px rgba(59,130,246,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {userInvestment ? '📈 Invest More' : '💰 Invest Now'}
          </button>

          {/* Quick Info Cards */}
          <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(96,165,250,0.1)' }}>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '0.95rem', fontWeight: '700' }}>Quick Info</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px', fontWeight: '600' }}>FOUNDER/OWNER</div>
                <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{campaign.owner || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px', fontWeight: '600' }}>FOUNDED</div>
                <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{campaign.founded || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px', fontWeight: '600' }}>ROI POTENTIAL</div>
                <div style={{ fontWeight: '700', fontSize: '1rem', color: '#10b981' }}>{campaign.roi}</div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          {campaign.certifications && campaign.certifications.length > 0 && (
            <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(96,165,250,0.1)' }}>
              <h4 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '0.95rem', fontWeight: '700' }}>🏆 Certifications</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {campaign.certifications.slice(0, 4).map((cert, i) => (
                  <div key={i} style={{ fontSize: '0.85rem', color: '#86efac', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span>✓</span>
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What You Get Section */}
          <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(96,165,250,0.1)' }}>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '0.95rem', fontWeight: '700' }}>📋 What You Get</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: '#60a5fa' }}>✓</span>
                <span>Equity stake in company</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: '#60a5fa' }}>✓</span>
                <span>Access to updates & reports</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: '#60a5fa' }}>✓</span>
                <span>Investor dashboard</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: '#60a5fa' }}>✓</span>
                <span>Liquidity events info</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Business Tab */}
      {activeTab === 'business' && (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
        <div>
          {/* Funding Use */}
          {campaign.fundingUse && campaign.fundingUse.length > 0 && (
            <div style={{ marginBottom: '2rem', padding: '24px', borderRadius: '14px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(96,165,250,0.1)' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.3rem' }}>💼 How We'll Use Your Investment</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {campaign.fundingUse.map((use, i) => {
                  const percentValue = parseInt(use.match(/\d+/)?.[0] || 0);
                  const label = use.split(' -')[0].trim();
                  return (
                    <div key={i} style={{
                      padding: '16px',
                      borderRadius: '10px',
                      background: 'rgba(96,165,250,0.05)',
                      border: '1px solid rgba(96,165,250,0.2)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: `${percentValue}%`,
                        background: 'rgba(59,130,246,0.15)',
                        zIndex: 0,
                        transition: 'width 0.3s ease'
                      }} />
                      <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginBottom: '4px' }}>
                          {label}
                        </div>
                        <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#60a5fa' }}>
                          {percentValue}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Business Model */}
          <div style={{ marginBottom: '2rem', padding: '24px', borderRadius: '14px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(96,165,250,0.1)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.3rem' }}>📊 Business Model</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600' }}>💡 Revenue Model</div>
                <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                  {campaign.revenueModel || 'Subscription & B2B Sales'}
                </div>
              </div>
              <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600' }}>📈 Growth Strategy</div>
                <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                  {campaign.growthStrategy || 'Product-Led Growth & Partnerships'}
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          {campaign.metrics && (
            <div style={{ marginBottom: '2rem', padding: '24px', borderRadius: '14px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(96,165,250,0.1)' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.3rem' }}>📈 Key Metrics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                {Object.entries(campaign.metrics).map(([key, value]) => (
                  <div key={key} style={{
                    padding: '16px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05))',
                    border: '1px solid rgba(96,165,250,0.2)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600' }}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div style={{ fontWeight: '700', color: '#60a5fa', fontSize: '1.2rem' }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div>
          {/* Competitive Advantage */}
          <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(96,165,250,0.1)', marginBottom: '20px' }}>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '0.95rem', fontWeight: '700' }}>🏆 Competitive Advantage</h4>
            <ul style={{ margin: 0, paddingLeft: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
              {campaign.competitiveAdvantage && campaign.competitiveAdvantage.length > 0 ? (
                campaign.competitiveAdvantage.map((adv, i) => (
                  <li key={i} style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: '#10b981', fontWeight: '700' }}>✓</span>
                    <span>{adv}</span>
                  </li>
                ))
              ) : (
                <>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: '#10b981', fontWeight: '700' }}>✓</span>
                    <span>Experienced founding team</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: '#10b981', fontWeight: '700' }}>✓</span>
                    <span>Proprietary technology</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: '#10b981', fontWeight: '700' }}>✓</span>
                    <span>Strong market traction</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Market Opportunity */}
          <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(96,165,250,0.1)' }}>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '0.95rem', fontWeight: '700' }}>🎯 Market Opportunity</h4>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
              {campaign.marketOpportunity || 'Large and growing market with multiple expansion opportunities and strong demand signals.'}
            </div>
          </div>
        </div>
      </div>
      )}
      {/* Team Tab */}
      {activeTab === 'team' && (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
        <div>
          {/* Team Members */}
          {campaign.teamMembers && campaign.teamMembers.length > 0 && (
            <div style={{ marginBottom: '2rem', padding: '24px', borderRadius: '14px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(96,165,250,0.1)' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.3rem' }}>👥 Core Team</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                {campaign.teamMembers.map((member, i) => (
                  <div key={i} style={{
                    padding: '20px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(96,165,250,0.1), rgba(96,165,250,0.05))',
                    border: '1px solid rgba(96,165,250,0.2)',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>Team Member</div>
                    <div style={{ fontWeight: '700', color: '#60a5fa', marginBottom: '8px', fontSize: '1.15rem' }}>{member.name}</div>
                    <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', fontWeight: '600' }}>{member.role}</div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>{member.experience}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technology Stack */}
          {campaign.technology && campaign.technology.length > 0 && (
            <div style={{ marginBottom: '2rem', padding: '24px', borderRadius: '14px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(96,165,250,0.1)' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.3rem' }}>🔧 Technology Stack</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {campaign.technology.map((tech, i) => (
                  <span key={i} style={{
                    padding: '10px 16px',
                    background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.05))',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    border: '1px solid rgba(168,85,247,0.3)',
                    color: '#d8b4fe',
                    fontWeight: '600'
                  }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div>
          {/* Team Size Overview */}
          <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(96,165,250,0.1)', marginBottom: '20px' }}>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '0.95rem', fontWeight: '700' }}>👥 Team Stats</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px', fontWeight: '600' }}>TOTAL TEAM SIZE</div>
                <div style={{ fontWeight: '700', fontSize: '1.5rem', color: '#60a5fa' }}>{campaign.team}</div>
              </div>
              <div style={{ height: '1px', background: 'rgba(96,165,250,0.2)' }} />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px', fontWeight: '600' }}>KEY ROLES</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                  <div>• Founder/CEO</div>
                  <div>• CTO/Technical Lead</div>
                  <div>• Business Development</div>
                </div>
              </div>
            </div>
          </div>

          {/* Expertise */}
          <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(96,165,250,0.1)' }}>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '0.95rem', fontWeight: '700' }}>💡 Team Expertise</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#60a5fa' }}>✓</span>
                <span>Industry experience 10+ years</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#60a5fa' }}>✓</span>
                <span>Previous successful exits</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#60a5fa' }}>✓</span>
                <span>Technical excellence</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#60a5fa' }}>✓</span>
                <span>Strong network & mentors</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Financials Tab */}
      {activeTab === 'financials' && (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
        <div>
          {/* Financial Summary */}
          <div style={{ marginBottom: '2rem', padding: '24px', borderRadius: '14px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(96,165,250,0.1)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.3rem' }}>💰 Financial Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>Monthly Revenue</div>
                <div style={{ fontWeight: '700', color: '#60a5fa', fontSize: '1.3rem' }}>{campaign.monthlyRecurring}</div>
              </div>
              <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>Market Size</div>
                <div style={{ fontWeight: '700', color: '#10b981', fontSize: '1.3rem' }}>{campaign.marketSize}</div>
              </div>
              <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.2)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>Expected ROI</div>
                <div style={{ fontWeight: '700', color: '#fb923c', fontSize: '1.3rem' }}>{campaign.roi}</div>
              </div>
            </div>
          </div>

          {/* Fund Allocation */}
          {campaign.fundingUse && campaign.fundingUse.length > 0 && (
            <div style={{ marginBottom: '2rem', padding: '24px', borderRadius: '14px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(96,165,250,0.1)' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.3rem' }}>💼 Fund Allocation</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {campaign.fundingUse.map((use, i) => {
                  const percentValue = parseInt(use.match(/\d+/)?.[0] || 0);
                  const label = use.split(' -')[0].trim();
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                        <span style={{ fontWeight: '600' }}>{label}</span>
                        <span style={{ color: '#60a5fa', fontWeight: '700' }}>{percentValue}%</span>
                      </div>
                      <div style={{ height: '12px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(96,165,250,0.2)', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${percentValue}%`,
                          background: `linear-gradient(90deg, #3b82f6, #10b981)`,
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Return Projections */}
          <div style={{ marginBottom: '2rem', padding: '24px', borderRadius: '14px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(96,165,250,0.1)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.3rem' }}>📊 Return Projections</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>3-Year Target</div>
                <div style={{ fontWeight: '700', color: '#60a5fa', fontSize: '1.3rem' }}>{campaign.projection3Y || '3-5x'}</div>
              </div>
              <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>5-Year Target</div>
                <div style={{ fontWeight: '700', color: '#10b981', fontSize: '1.3rem' }}>{campaign.projection5Y || '8-10x'}</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          {/* Investor Terms */}
          <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(96,165,250,0.1)', marginBottom: '20px' }}>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '0.95rem', fontWeight: '700' }}>📋 Investment Terms</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px', fontWeight: '600' }}>MINIMUM INVESTMENT</div>
                <div style={{ fontWeight: '600' }}>{campaign.minInvestment || '0.1 ETH'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px', fontWeight: '600' }}>EQUITY STAKE</div>
                <div style={{ fontWeight: '600' }}>Pro-rata equity</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px', fontWeight: '600' }}>EXIT STRATEGY</div>
                <div style={{ fontWeight: '600' }}>IPO or acquisition</div>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(96,165,250,0.1)' }}>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '0.95rem', fontWeight: '700' }}>⚠️ Risk Level</h4>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: '#fb923c' }}>Moderate-High</div>
              <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(251,146,60,0.3)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '65%', background: 'linear-gradient(90deg, #fbbf24, #fb923c)', transition: 'width 0.3s ease' }} />
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>
              Early-stage startups carry inherent risk. Diversify investments across multiple startups.
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default StartupDetail;
