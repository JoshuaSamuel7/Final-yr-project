import React from 'react';
import CampaignCard from './CampaignCard';

const Dashboard = ({ campaigns = [], onDonate, onSeed, simulateMode, balance = '0', txs = [] }) => {
  // compute some mock metrics
  const totalStartups = campaigns.length;
  const totalFunded = campaigns.filter(c => {
    try { return BigInt(c.amountRaised || '0') > 0n; } catch { return false }
  }).length;
  const totalRaised = (() => {
    try {
      const sum = campaigns.reduce((acc, c) => acc + BigInt(c.amountRaised || '0'), 0n);
      // format to ETH
      return String(sum);
    } catch (e) { return '0' }
  })();

  const recentTxs = txs.slice(-5).reverse();

  return (
    <div className="dashboard" style={{padding: 0}}>
      <div style={{marginBottom: '2rem'}}>
        <h2 style={{margin: '0 0 0.5rem 0', fontSize: '1.8rem'}}>Dashboard</h2>
        <p style={{margin: 0, color: 'rgba(255,255,255,0.7)'}}>Your portfolio and campaign overview</p>
      </div>

      <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: '2rem'}}>
        <div style={{padding: 16, borderRadius: 12, background:'linear-gradient(135deg, rgba(96,165,250,0.1), rgba(6,182,212,0.05))', border:'1px solid rgba(96,165,250,0.15)'}}>
          <div style={{fontSize: 12, color:'rgba(255,255,255,0.7)', marginBottom: 8}}>Wallet Balance</div>
          <div style={{fontWeight: 700, fontSize: '1.3rem'}}>{balance ?? '0'} ETH</div>
        </div>
        <div style={{padding: 16, borderRadius: 12, background:'linear-gradient(135deg, rgba(96,165,250,0.05), rgba(6,182,212,0.05))', border:'1px solid rgba(96,165,250,0.08)'}}>
          <div style={{fontSize: 12, color:'rgba(255,255,255,0.7)', marginBottom: 8}}>Total Startups</div>
          <div style={{fontWeight: 700, fontSize: '1.3rem'}}>{totalStartups}</div>
        </div>
        <div style={{padding: 16, borderRadius: 12, background:'linear-gradient(135deg, rgba(96,165,250,0.05), rgba(6,182,212,0.05))', border:'1px solid rgba(96,165,250,0.08)'}}>
          <div style={{fontSize: 12, color:'rgba(255,255,255,0.7)', marginBottom: 8}}>Funded</div>
          <div style={{fontWeight: 700, fontSize: '1.3rem'}}>{totalFunded}</div>
        </div>
        <div style={{padding: 16, borderRadius: 12, background:'linear-gradient(135deg, rgba(96,165,250,0.05), rgba(6,182,212,0.05))', border:'1px solid rgba(96,165,250,0.08)'}}>
          <div style={{fontSize: 12, color:'rgba(255,255,255,0.7)', marginBottom: 8}}>Mode</div>
          <div style={{fontWeight: 700, fontSize: '1rem'}}>{simulateMode ? '🔧 Demo' : '⛓️ Live'}</div>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns: '1fr 320px', gap: 20}}>
        <div>
          <h3 style={{marginTop:0, marginBottom: '1rem'}}>Startups</h3>
          <div className="campaigns">
            {campaigns.map((c, i) => (
              <CampaignCard key={i} campaign={c} onDonate={(amt) => onDonate(i, amt)} onView={() => window.location.assign(`/startup/${i}`)} />
            ))}
          </div>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          <div>
            <h3 style={{marginTop:0, marginBottom: '1rem'}}>Controls</h3>
            <button onClick={onSeed} style={{width: '100%', padding: '12px 16px'}}>{campaigns.length < 7 ? 'Seed More' : 'Seed'}</button>
          </div>

          <div>
            <h3 style={{marginTop:0, marginBottom: '1rem'}}>Recent activity</h3>
            <div style={{padding:12, borderRadius:12, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(96,165,250,0.08)', maxHeight: '240px', overflowY: 'auto'}}>
              {recentTxs.length === 0 ? <div style={{color:'rgba(255,255,255,0.6)', fontSize: '0.9rem'}}>No transactions yet</div> : (
                <ul style={{listStyle:'none', padding:0, margin:0}}>
                  {recentTxs.map((t, idx) => (
                    <li key={idx} style={{padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.03)', fontSize: '0.85rem'}}>
                      <div style={{color:'rgba(255,255,255,0.7)'}}>{t.type}</div>
                      <div style={{fontWeight:700, color:'#34d399'}}>{t.amount || '-'} ETH</div>
                      <div style={{fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)'}}>{t.status}</div>
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
};;

export default Dashboard;
