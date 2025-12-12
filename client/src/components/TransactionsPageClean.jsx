import React from 'react';

const short = (s = '') => (s.length > 10 ? s.slice(0, 6) + '...' + s.slice(-4) : s);

export default function TransactionsPageClean({ txs = [], addTx, connectWallet, account }) {
  const [connectedThisVisit, setConnectedThisVisit] = React.useState(false);
  const [addr, setAddr] = React.useState(() => account || ('0x' + Math.random().toString(16).slice(2, 10)));
  const [balance, setBalance] = React.useState(10);
  const [sending, setSending] = React.useState(false);
  const [to, setTo] = React.useState('0x' + 'f'.repeat(40));
  const [amount, setAmount] = React.useState('0.1');

  React.useEffect(() => {
    setConnectedThisVisit(false);
    setAddr(account || ('0x' + Math.random().toString(16).slice(2, 10)));
  }, [account]);

  async function ensureConnect() {
    try {
      await connectWallet();
      setConnectedThisVisit(true);
      setAddr(account || ('0x' + Math.random().toString(16).slice(2, 10)));
    } catch (e) {
      console.error('connect failed', e);
      alert('Wallet connect failed');
    }
  }

  function simulateSend() {
    if (Number(amount) <= 0 || Number(amount) > balance) return alert('Invalid amount');
    setSending(true);
    addTx({ type: 'send', amount, status: 'pending' });
    setTimeout(() => {
      const ok = Math.random() > 0.15;
      addTx({ type: 'send', amount, status: ok ? 'success' : 'failed' });
      if (ok) alert('Simulated send ' + (ok ? 'success' : 'failure'));
      setBalance((b) => +(b - Number(amount)).toFixed(4));
      setSending(false);
    }, 1400);
  }

  return (
    <div style={{padding: '1rem'}}>
      <h2>Transactions</h2>

      {!connectedThisVisit && (
        <div style={{marginTop:12, padding:12, borderRadius:10, background:'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))'}}>
          <div style={{fontWeight:700}}>Connect Wallet</div>
          <div style={{marginTop:8}}>For security and realism, please connect your wallet to perform transactions on this page. You will be prompted to connect each time you visit this page.</div>
          <div style={{marginTop:12}}>
            <button onClick={ensureConnect}>Connect Wallet</button>
            <button onClick={()=>{ setConnectedThisVisit(true); }}>Use demo only</button>
          </div>
        </div>
      )}

      <div style={{display:'flex', gap:16, alignItems:'flex-start', marginTop:12, opacity: connectedThisVisit ? 1 : 0.35}}>
        <div style={{width:320, padding:12, borderRadius:10, background:'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))'}}>
          <div style={{fontSize:12, color:'rgba(255,255,255,0.7)'}}>{connectedThisVisit ? 'Active Wallet' : 'Wallet (connect first)'}</div>
          <div style={{marginTop:8, fontWeight:700}}>{connectedThisVisit ? addr : '—'}</div>
          <div style={{marginTop:8, fontSize:14}}><span style={{fontWeight:600}}>{balance}</span> ETH</div>
          <div style={{marginTop:12}}>
            <input placeholder="To address" value={to} onChange={(e)=>setTo(e.target.value)} style={{width:'100%', padding:8, borderRadius:8, border:'1px solid rgba(255,255,255,0.04)'}} />
            <input placeholder="Amount (ETH)" value={amount} onChange={(e)=>setAmount(e.target.value)} style={{width:'100%', padding:8, borderRadius:8, border:'1px solid rgba(255,255,255,0.04)', marginTop:8}} />
            <div style={{display:'flex', gap:8, marginTop:8}}>
              <button className={`btn-sending ${sending ? 'sending' : ''}`} onClick={() => { if (!connectedThisVisit) return alert('Please connect wallet first'); simulateSend(); }} disabled={sending || !connectedThisVisit}>
                {sending ? (<><span className="spinner" style={{marginRight:8}}></span>Sending…</>) : 'Send ETH'}
              </button>
              <button onClick={()=>{ setBalance((b)=>+(b+1).toFixed(4)); }}>Faucet +1</button>
            </div>
          </div>
        </div>

        <div style={{flex:1}}>
          <div style={{marginBottom:8}}>Recent activity</div>
          <div style={{background:'linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.00))', padding:12, borderRadius:8}}>
            {txs.length === 0 && <div className="tx-empty">No transactions recorded</div>}
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{textAlign: 'left'}}><th>Type</th><th>Amount (ETH)</th><th>Hash</th><th>Status</th></tr>
              </thead>
              <tbody>
                {txs.slice().reverse().map((t) => (
                  <tr key={t.id} style={{borderTop: '1px solid rgba(255,255,255,0.03)'}}>
                    <td style={{padding: '8px'}}>{t.type}</td>
                    <td style={{padding: '8px'}}>{t.amount ? t.amount : '-'}</td>
                    <td style={{padding: '8px'}}>{t.hash ? (<span>{short(t.hash)}</span>) : '-'}</td>
                    <td style={{padding: '8px'}}>{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
