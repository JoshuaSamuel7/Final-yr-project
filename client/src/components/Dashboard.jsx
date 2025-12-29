import React from 'react';
import { ethers } from 'ethers';
import CampaignCard from './CampaignCard';

const Dashboard = ({ campaigns = [], user = null, onDonate, onSeed, balance = '0', txs = [] }) => {
  // Get user's invested campaigns based on transaction history
  const userInvestments = txs
    .filter(t => ['investment', 'fund'].includes(t.type) && t.status === 'confirmed')
    .map(t => t.campaignId)
    .filter((v, i, a) => a.indexOf(v) === i); // unique campaignIds

  const investedCampaigns = campaigns.filter((c, idx) => userInvestments.includes(idx));

  // Calculate user metrics
  const totalInvested = investedCampaigns.length;
  const totalInvestedAmount = investedCampaigns.reduce((acc, c) => {
    try {
      return acc + BigInt(c.amountRaised || '0');
    } catch {
      return acc;
    }
  }, 0n);

  const investmentAmount = ethers.formatEther(totalInvestedAmount);
  const avgPerStartup = totalInvested > 0 ? (Number(investmentAmount) / totalInvested).toFixed(2) : '0';

  // Calculate user's total equity across all investments
  const totalEquity = txs
    .filter(t => ['investment', 'fund'].includes(t.type) && t.status === 'confirmed')
    .reduce((acc, t) => acc + (t.equityPercentage || 0), 0)
    .toFixed(2);

  // Mock estimated portfolio value (based on average startup valuation growth)
  const estimatedPortfolioValue = (Number(investmentAmount) * 2.45).toFixed(2);

  // Get invested startups by category
  const investedByCategory = investedCampaigns.reduce((acc, c) => {
    const cat = c.category || 'Other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const sectorColors = {
    'HealthTech': '#ef4444',
    'FinTech': '#f59e0b',
    'AgriTech': '#10b981',
    'ClimaTech': '#06b6d4',
    'CyberSecurity': '#8b5cf6',
    'LogisticsTech': '#3b82f6',
    'DeepTech': '#ec4899',
    'E-commerce': '#6366f1',
    'SaaS': '#14b8a6',
    'Other': '#6b7280'
  };

  const recentInvestments = txs
    .filter(t => ['investment', 'fund'].includes(t.type) && t.status === 'confirmed')
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  const allRecentTxs = txs.slice(-5).reverse();

  return (
    <div className="dashboard" style={{padding: 0}}>
      <div style={{marginBottom: '2rem'}}>
        <h2 style={{margin: '0 0 0.5rem 0', fontSize: '1.8rem'}}>Your Investment Portfolio</h2>
        <p style={{margin: 0, color: 'rgba(255,255,255,0.7)'}}>Track your invested startups and portfolio performance</p>
      </div>

      {/* User Info Card */}
      <div style={{padding: '20px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(96,165,250,0.05))', border: '2px solid rgba(96,165,250,0.2)', marginBottom: '2rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <div style={{fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase'}}>Investor Profile</div>
            <h3 style={{margin: 0, fontSize: '1.5rem'}}>Welcome back, Investor 👋</h3>
            <p style={{margin: '8px 0 0 0', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem'}}>You have invested in {totalInvested} {totalInvested === 1 ? 'startup' : 'startups'}</p>
          </div>
          <div style={{textAlign: 'right'}}>
            <div style={{fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600'}}>WALLET</div>
            <div style={{fontSize: '1.3rem', fontWeight: '700', color: '#60a5fa'}}>{balance} ETH</div>
            <div style={{fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px'}}>Available balance</div>
          </div>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: '2rem'}}>
        <div style={{padding: 16, borderRadius: 12, background:'linear-gradient(135deg, rgba(96,165,250,0.1), rgba(6,182,212,0.05))', border:'1px solid rgba(96,165,250,0.15)'}}>
          <div style={{fontSize: 12, color:'rgba(255,255,255,0.7)', marginBottom: 8}}>💰 Invested Amount</div>
          <div style={{fontWeight: 700, fontSize: '1.3rem'}}>{Number(investmentAmount).toFixed(2)} ETH</div>
          <div style={{fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px'}}>Total capital deployed</div>
        </div>
        <div style={{padding: 16, borderRadius: 12, background:'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.05))', border:'1px solid rgba(34,197,94,0.15)'}}>
          <div style={{fontSize: 12, color:'rgba(255,255,255,0.7)', marginBottom: 8}}>📊 Portfolio Value</div>
          <div style={{fontWeight: 700, fontSize: '1.3rem'}}>{estimatedPortfolioValue} ETH</div>
          <div style={{fontSize: '0.75rem', color: '#10b981', marginTop: '4px'}}>Est. +{((estimatedPortfolioValue / investmentAmount) * 100 - 100).toFixed(0)}% growth</div>
        </div>
        <div style={{padding: 16, borderRadius: 12, background:'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05))', border:'1px solid rgba(59,130,246,0.15)'}}>
          <div style={{fontSize: 12, color:'rgba(255,255,255,0.7)', marginBottom: 8}}>🎯 Investments</div>
          <div style={{fontWeight: 700, fontSize: '1.3rem'}}>{totalInvested}</div>
          <div style={{fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px'}}>Active positions</div>
        </div>
        <div style={{padding: 16, borderRadius: 12, background:'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.05))', border:'1px solid rgba(245,158,11,0.15)'}}>
          <div style={{fontSize: 12, color:'rgba(255,255,255,0.7)', marginBottom: 8}}>💵 Avg Per Startup</div>
          <div style={{fontWeight: 700, fontSize: '1.3rem'}}>{avgPerStartup} ETH</div>
          <div style={{fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px'}}>Average investment size</div>
        </div>
        <div style={{padding: 16, borderRadius: 12, background:'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.05))', border:'1px solid rgba(139,92,246,0.15)'}}>
          <div style={{fontSize: 12, color:'rgba(255,255,255,0.7)', marginBottom: 8}}>💎 Total Equity</div>
          <div style={{fontWeight: 700, fontSize: '1.3rem'}}>{totalEquity}%</div>
          <div style={{fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px'}}>Combined ownership</div>
        </div>
        <div style={{padding: 16, borderRadius: 12, background:'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.05))', border:'1px solid rgba(99,102,241,0.15)'}}>
          <div style={{fontSize: 12, color:'rgba(255,255,255,0.7)', marginBottom: 8}}>📈 ROI</div>
          <div style={{fontWeight: 700, fontSize: '1.3rem', color: '#10b981'}}>+245%</div>
          <div style={{fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px'}}>Average expected return</div>
        </div>
      </div>

      {/* Analytics and Investments Section */}
      <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: '2rem'}}>
        {/* Sector Distribution */}
        <div style={{padding: 20, borderRadius: 12, background:'rgba(15,23,42,0.6)', border:'1px solid rgba(96,165,250,0.1)'}}>
          <h3 style={{marginTop:0, marginBottom: '1rem', fontSize: '1.1rem'}}>📊 Investment Distribution</h3>
          {totalInvested === 0 ? (
            <p style={{color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '0.9rem'}}>You haven't invested in any startups yet. Explore opportunities to start building your portfolio!</p>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
              {Object.entries(investedByCategory).map(([category, count]) => (
                <div key={category} style={{display: 'flex', alignItems: 'center', gap: 10}}>
                  <div style={{width: 16, height: 16, borderRadius: '50%', background: sectorColors[category] || '#6b7280'}} />
                  <div style={{flex: 1, display: 'flex', justifyContent: 'space-between'}}>
                    <span style={{color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem'}}>{category}</span>
                    <span style={{fontWeight: '600', color: sectorColors[category] || '#6b7280'}}>{count} {count === 1 ? 'company' : 'companies'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Investments */}
        <div style={{padding: 20, borderRadius: 12, background:'rgba(15,23,42,0.6)', border:'1px solid rgba(96,165,250,0.1)'}}>
          <h3 style={{marginTop:0, marginBottom: '1rem', fontSize: '1.1rem'}}>💼 Recent Investments</h3>
          {recentInvestments.length === 0 ? (
            <p style={{color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '0.9rem'}}>No recent investments. Start investing to grow your portfolio!</p>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
              {recentInvestments.map((tx, idx) => (
                <div key={idx} style={{padding: 12, background: 'rgba(59,130,246,0.08)', borderRadius: '8px', borderLeft: '3px solid #3b82f6'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px'}}>
                    <span style={{color: 'rgba(255,255,255,0.9)', fontWeight: '600', fontSize: '0.95rem'}}>{tx.campaign}</span>
                    <span style={{color: '#10b981', fontWeight: '700'}}>{tx.amount} ETH</span>
                  </div>
                  <div style={{fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)'}}>
                    {new Date(tx.timestamp).toLocaleDateString()} • {((tx.equityPercentage || 0).toFixed(2))}% equity
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invested Startups Performance */}
        <div style={{padding: 20, borderRadius: 12, background:'rgba(15,23,42,0.6)', border:'1px solid rgba(96,165,250,0.1)'}}>
          <h3 style={{marginTop:0, marginBottom: '1rem', fontSize: '1.1rem'}}>🚀 Top Performers</h3>
          {investedCampaigns.length === 0 ? (
            <p style={{color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '0.9rem'}}>No invested startups yet. Start exploring!</p>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
              {investedCampaigns.slice(0, 3).map((campaign, idx) => {
                try {
                  const raised = Number(ethers.formatEther(BigInt(campaign.amountRaised || '0')));
                  const goal = Number(ethers.formatEther(BigInt(campaign.goal || '0')));
                  const progress = (raised / goal) * 100;
                  return (
                    <div key={idx}>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem'}}>
                        <span style={{color: 'rgba(255,255,255,0.9)', fontWeight: '600'}}>{campaign.name}</span>
                        <span style={{color: '#10b981', fontWeight: '600'}}>{progress.toFixed(0)}%</span>
                      </div>
                      <div style={{height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden'}}>
                        <div style={{height: '100%', width: `${Math.min(100, progress)}%`, background: 'linear-gradient(90deg, #3b82f6, #10b981)'}} />
                      </div>
                    </div>
                  );
                } catch {
                  return null;
                }
              })}
            </div>
          )}
        </div>
      </div>

      {/* Invested Startups Section */}
      <div style={{marginBottom: '2rem'}}>
        <h3 style={{marginTop:0, marginBottom: '1rem'}}>💰 Your Invested Startups</h3>
        {investedCampaigns.length === 0 ? (
          <div style={{padding: '40px 20px', borderRadius: '12px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(96,165,250,0.1)', textAlign: 'center'}}>
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🚀</div>
            <h3 style={{margin: '0 0 0.5rem 0', fontSize: '1.2rem'}}>No Investments Yet</h3>
            <p style={{margin: 0, color: 'rgba(255,255,255,0.7)'}}>Start building your investment portfolio by exploring our startup opportunities</p>
          </div>
        ) : (
          <div className="campaigns">
            {investedCampaigns.map((c, i) => {
              const actualIndex = campaigns.findIndex(camp => camp.name === c.name);
              return (
                <CampaignCard 
                  key={i} 
                  campaign={c} 
                  campaignIndex={actualIndex} 
                  onView={() => window.location.assign(`/startup/${actualIndex}`)}
                  isInvested={true}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Sidebar with Activity */}
      <div style={{display:'grid', gridTemplateColumns: '1fr 320px', gap: 20}}>
        <div />
        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          <div>
            <h3 style={{marginTop:0, marginBottom: '1rem'}}>📋 Recent Activity</h3>
            <div style={{padding:12, borderRadius:12, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(96,165,250,0.08)', maxHeight: '400px', overflowY: 'auto'}}>
              {allRecentTxs.length === 0 ? (
                <div style={{color:'rgba(255,255,255,0.6)', fontSize: '0.9rem'}}>No transactions yet</div>
              ) : (
                <ul style={{listStyle:'none', padding:0, margin:0}}>
                  {allRecentTxs.map((t, idx) => (
                    <li key={idx} style={{padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.03)', fontSize: '0.85rem'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px'}}>
                        <span style={{color:'rgba(255,255,255,0.7)', fontWeight: '600'}}>{t.campaign}</span>
                        <span style={{background: 'rgba(34,197,94,0.2)', color: '#10b981', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600'}}>{t.status}</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
                        <span style={{color: 'rgba(255,255,255,0.6)'}}>Invested</span>
                        <span style={{fontWeight:'700', color:'#60a5fa'}}>{t.amount} ETH</span>
                      </div>
                      {t.timestamp && (
                        <div style={{fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)'}}>
                          {new Date(t.timestamp).toLocaleDateString()}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
