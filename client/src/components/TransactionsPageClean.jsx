import React from 'react';

const short = (s = '') => (s.length > 10 ? s.slice(0, 6) + '...' + s.slice(-4) : s);

const getStatusColor = (status) => {
  switch(status) {
    case 'confirmed': return '#10b981';
    case 'pending': return '#f59e0b';
    case 'failed': return '#ef4444';
    default: return '#60a5fa';
  }
};

const getStatusBg = (status) => {
  switch(status) {
    case 'confirmed': return 'rgba(16,185,129,0.1)';
    case 'pending': return 'rgba(245,158,11,0.1)';
    case 'failed': return 'rgba(239,68,68,0.1)';
    default: return 'rgba(96,165,250,0.1)';
  }
};

export default function TransactionsPageClean({ txs = [], addTx, connectWallet, account }) {
  // Separate investment transactions from other transactions
  const investmentTxs = txs.filter(t => t.type === 'investment' || t.type === 'donation').slice().reverse();
  const otherTxs = txs.filter(t => !['investment', 'donation'].includes(t.type)).slice().reverse();

  return (
    <div style={{padding: '1.5rem'}}>
      <h2 style={{margin: '0 0 1.5rem 0', fontSize: '1.8rem'}}>Transactions & Investments</h2>

      {/* Portfolio Summary */}
      {investmentTxs.length > 0 && (
        <div style={{marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px'}}>
          <div style={{padding: '20px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.05))', border: '1px solid rgba(16,185,129,0.2)'}}>
            <div style={{fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600'}}>Total Invested</div>
            <div style={{fontSize: '2rem', fontWeight: '700', color: '#10b981'}}>{investmentTxs.reduce((sum, t) => sum + (Number(t.amount) || 0), 0).toFixed(2)} ETH</div>
          </div>
          <div style={{padding: '20px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(96,165,250,0.1), rgba(6,182,212,0.05))', border: '1px solid rgba(96,165,250,0.2)'}}>
            <div style={{fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600'}}>Active Investments</div>
            <div style={{fontSize: '2rem', fontWeight: '700', color: '#60a5fa'}}>{investmentTxs.filter(t => t.status === 'confirmed').length}</div>
          </div>
          <div style={{padding: '20px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(6,182,212,0.05))', border: '1px solid rgba(245,158,11,0.2)'}}>
            <div style={{fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600'}}>Total Equity</div>
            <div style={{fontSize: '2rem', fontWeight: '700', color: '#f59e0b'}}>{investmentTxs.reduce((sum, t) => sum + (t.equityPercentage || 0), 0).toFixed(2)}%</div>
          </div>
        </div>
      )}

      {/* Investment Transactions Section */}
      <div style={{marginBottom: '2rem'}}>
        <div style={{marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <h3 style={{margin: 0, fontSize: '1.3rem'}}>💰 Your Investments</h3>
          <span style={{fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', background: 'rgba(96,165,250,0.1)', padding: '4px 8px', borderRadius: '4px'}}>
            {investmentTxs.length} transaction{investmentTxs.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        {investmentTxs.length === 0 ? (
          <div style={{padding: '2rem', textAlign: 'center', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(15,23,42,0.6), rgba(30,41,59,0.6))', border: '1px solid rgba(96,165,250,0.1)'}}>
            <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>🚀</div>
            <div style={{fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem'}}>No investments yet</div>
            <div style={{fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)'}}>Start investing in startups to see your equity stakes here</div>
          </div>
        ) : (
          <div style={{display: 'grid', gap: '12px'}}>
            {investmentTxs.map((t) => (
              <div key={t.id} style={{padding: '16px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(15,23,42,0.7), rgba(30,41,59,0.7))', border: `1px solid ${getStatusColor(t.status)}25`, transition: 'all 0.3s ease', cursor: 'pointer'}}
                onMouseEnter={(e) => {e.currentTarget.style.background = 'linear-gradient(135deg, rgba(15,23,42,0.85), rgba(30,41,59,0.85))';}}
                onMouseLeave={(e) => {e.currentTarget.style.background = 'linear-gradient(135deg, rgba(15,23,42,0.7), rgba(30,41,59,0.7))';}}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'center'}}>
                  {/* Company & Amount */}
                  <div>
                    <div style={{fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', textTransform: 'uppercase'}}>Company</div>
                    <div style={{fontSize: '1.1rem', fontWeight: '600', color: '#60a5fa'}}>{t.campaignName || 'Unknown'}</div>
                    <div style={{fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginTop: '6px'}}>📅 {t.investmentDate}</div>
                  </div>

                  {/* Investment Amount */}
                  <div>
                    <div style={{fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', textTransform: 'uppercase'}}>Amount</div>
                    <div style={{fontSize: '1.1rem', fontWeight: '600', color: '#10b981'}}>{t.amount || '-'} ETH</div>
                  </div>

                  {/* Equity Percentage */}
                  <div style={{background: getStatusBg(t.status), padding: '12px', borderRadius: '8px', textAlign: 'center', border: `1px solid ${getStatusColor(t.status)}40`}}>
                    <div style={{fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', textTransform: 'uppercase'}}>Your Equity</div>
                    <div style={{fontSize: '1.4rem', fontWeight: '700', color: getStatusColor(t.status)}}>{(t.equityPercentage || 0).toFixed(2)}%</div>
                    <div style={{fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px'}}>of company</div>
                  </div>

                  {/* Status Badge */}
                  <div style={{textAlign: 'center'}}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: getStatusBg(t.status),
                      color: getStatusColor(t.status),
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      textTransform: 'capitalize',
                      border: `1px solid ${getStatusColor(t.status)}40`
                    }}>
                      {t.status === 'confirmed' ? '✓ Confirmed' : t.status === 'pending' ? '⏳ Pending' : '✗ Failed'}
                    </span>
                  </div>
                </div>

                {/* Transaction Details */}
                <div style={{marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8rem'}}>
                  <div>
                    <span style={{color: 'rgba(255,255,255,0.6)'}}>Transaction Hash:</span>
                    <div style={{fontWeight: '600', color: 'rgba(255,255,255,0.9)', fontFamily: 'monospace', marginTop: '4px'}}>
                      {t.hash ? short(t.hash) : '—'}
                    </div>
                  </div>
                  <div>
                    <span style={{color: 'rgba(255,255,255,0.6)'}}>📊 Investment Summary:</span>
                    <div style={{fontWeight: '600', color: '#60a5fa', marginTop: '4px'}}>
                      {t.amount} ETH = {(t.equityPercentage || 0).toFixed(2)}% of {t.campaignName}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
