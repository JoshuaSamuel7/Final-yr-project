import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

const FounderDashboard = ({ campaigns = [], account, user }) => {
  const navigate = useNavigate();
  
  // Show all campaigns that have a creator field (shared founder demos) PLUS campaigns this founder created
  // This allows all founders to see and work with the mock founder campaigns
  const founderCampaigns = campaigns.filter(c => {
    // Show shared founder demo campaigns (those with creator field) to all founders
    if (c.creator) return true;
    // Also show campaigns owned by this founder's wallet
    if (account && c.owner?.toLowerCase() === account?.toLowerCase()) return true;
    return false;
  });
  
  // Calculate metrics
  const totalRaised = founderCampaigns.reduce((sum, c) => {
    try {
      return sum + Number(ethers.formatEther(c.amountRaised || 0));
    } catch {
      return sum;
    }
  }, 0);

  const totalGoal = founderCampaigns.reduce((sum, c) => {
    try {
      return sum + Number(ethers.formatEther(c.goal || 0));
    } catch {
      return sum;
    }
  }, 0);

  const totalInvestors = founderCampaigns.reduce((sum, c) => sum + (c.investors || 0), 0);
  const avgFundingPercent = founderCampaigns.length > 0 
    ? (totalRaised / (totalGoal || 1)) * 100 
    : 0;

  const getStageColor = (stage) => {
    switch(stage) {
      case 'Seed': return { bg: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'rgba(16,185,129,0.3)' };
      case 'Series A': return { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'rgba(59,130,246,0.3)' };
      case 'Series B': return { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' };
      default: return { bg: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: 'rgba(96,165,250,0.3)' };
    }
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '2rem', fontWeight: '700' }}>Founder Dashboard</h1>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>Manage your campaigns and track investor interest</p>
      </div>

      {/* Key Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '2rem' }}>
        <div style={{
          padding: '24px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.05))',
          border: '1px solid rgba(16,185,129,0.2)',
          transition: 'all 0.3s ease'
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.1))';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.05))';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600' }}>Total Raised</div>
          <div style={{ fontSize: '2.2rem', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>{totalRaised.toFixed(2)} ETH</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>of {totalGoal.toFixed(2)} ETH goal</div>
        </div>

        <div style={{
          padding: '24px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(6,182,212,0.05))',
          border: '1px solid rgba(59,130,246,0.2)',
          transition: 'all 0.3s ease'
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(6,182,212,0.1))';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(6,182,212,0.05))';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600' }}>Active Campaigns</div>
          <div style={{ fontSize: '2.2rem', fontWeight: '700', color: '#3b82f6', marginBottom: '4px' }}>{founderCampaigns.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>companies raising funds</div>
        </div>

        <div style={{
          padding: '24px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(6,182,212,0.05))',
          border: '1px solid rgba(245,158,11,0.2)',
          transition: 'all 0.3s ease'
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(6,182,212,0.1))';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(6,182,212,0.05))';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600' }}>Total Investors</div>
          <div style={{ fontSize: '2.2rem', fontWeight: '700', color: '#f59e0b', marginBottom: '4px' }}>{totalInvestors}</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>across all campaigns</div>
        </div>

        <div style={{
          padding: '24px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(6,182,212,0.05))',
          border: '1px solid rgba(168,85,247,0.2)',
          transition: 'all 0.3s ease'
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(6,182,212,0.1))';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(6,182,212,0.05))';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600' }}>Funding Progress</div>
          <div style={{ fontSize: '2.2rem', fontWeight: '700', color: '#a855f7', marginBottom: '4px' }}>{avgFundingPercent.toFixed(1)}%</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>average across campaigns</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '2rem', padding: '24px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(96,165,250,0.08), rgba(6,182,212,0.03))', border: '1px solid rgba(96,165,250,0.1)' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/create-campaign')}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(16,185,129,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            🚀 Launch New Campaign
          </button>
          <button
            onClick={() => navigate('/founder-companies')}
            style={{
              padding: '12px 24px',
              background: 'rgba(96,165,250,0.1)',
              border: '2px solid rgba(96,165,250,0.3)',
              borderRadius: '8px',
              color: '#60a5fa',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(96,165,250,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(96,165,250,0.1)';
            }}
          >
            📊 View My Companies
          </button>
        </div>
      </div>

      {/* Recent Campaigns */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.3rem', fontWeight: '600' }}>Your Campaigns</h3>
        {founderCampaigns.length === 0 ? (
          <div style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(15,23,42,0.6), rgba(30,41,59,0.6))',
            border: '1px solid rgba(96,165,250,0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>No campaigns yet</div>
            <p style={{ margin: '0 0 1.5rem 0', color: 'rgba(255,255,255,0.6)' }}>Create your first campaign to start raising funds from investors</p>
            <button
              onClick={() => navigate('/create-campaign')}
              style={{
                padding: '12px 28px',
                background: '#3b82f6',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.95rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#2563eb'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#3b82f6'; }}
            >
              Create Campaign
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {founderCampaigns.map((campaign, idx) => {
              const stageStyle = getStageColor(campaign.stage);
              const raised = Number(ethers.formatEther(campaign.amountRaised || 0));
              const goal = Number(ethers.formatEther(campaign.goal || 0));
              const percent = goal > 0 ? (raised / goal) * 100 : 0;

              return (
                <div key={idx} style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(15,23,42,0.6), rgba(30,41,59,0.5))',
                  border: '1px solid rgba(96,165,250,0.15)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(30,41,59,0.7))';
                    e.currentTarget.style.borderColor = 'rgba(96,165,250,0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(15,23,42,0.6), rgba(30,41,59,0.5))';
                    e.currentTarget.style.borderColor = 'rgba(96,165,250,0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'start', marginBottom: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>{campaign.name}</h4>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: stageStyle.bg,
                          color: stageStyle.color,
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          border: `1px solid ${stageStyle.border}`
                        }}>
                          {campaign.stage || 'Seed'}
                        </span>
                      </div>
                      <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>{campaign.description}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/startup/${idx}`)}
                      style={{
                        padding: '10px 20px',
                        background: '#3b82f6',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#2563eb'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#3b82f6'; }}
                    >
                      View Details
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Raised</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#10b981' }}>{raised.toFixed(2)} ETH</div>
                      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>of {goal.toFixed(2)} ETH</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Investors</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#f59e0b' }}>{campaign.investors || 0}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Team Size</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#60a5fa' }}>{campaign.team || 0}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                      <span>Funding Progress</span>
                      <span style={{ fontWeight: '600' }}>{percent.toFixed(1)}%</span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.min(percent, 100)}%`,
                        background: 'linear-gradient(90deg, #3b82f6, #10b981)',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FounderDashboard;
