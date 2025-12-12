import React from 'react';

const short = (s = '') => (s.length > 10 ? s.slice(0, 6) + '...' + s.slice(-4) : s);

const TransactionLog = ({ txs }) => {
  return (
    <div className="tx-log">
      <h4>Transactions</h4>
      {txs.length === 0 && <div className="tx-empty">No transactions yet</div>}
      <ul>
        {txs.slice().reverse().map((t) => (
          <li key={t.id} className={`tx-item tx-${t.status}`}>
            <div style={{display:'flex',flexDirection:'column'}}>
              <span className="tx-type">{t.type} {t.amount ? `• ${t.amount} ETH` : ''}</span>
              <span style={{fontSize:'0.8rem', color:'#666'}}>{t.hash ? short(t.hash) : ''}</span>
            </div>
            <span className="tx-status">{t.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionLog;
