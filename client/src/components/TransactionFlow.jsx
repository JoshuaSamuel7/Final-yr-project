import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TransactionFlow = ({ campaigns, simulateTx, connectWallet, account }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const campaign = campaigns[Number(id)];
  const [amount, setAmount] = useState('0.1');
  const [connecting, setConnecting] = useState(false);
  const [connectedThisVisit, setConnectedThisVisit] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setConnectedThisVisit(false);
    setStatus(null);
  }, [id]);

  async function handleConnect() {
    setConnecting(true);
    try {
      await connectWallet();
      // mark session-connected; parent will update `account` as appropriate
      setConnectedThisVisit(true);
    } catch (e) { console.error(e); alert('Connect failed'); }
    setConnecting(false);
  }

  async function handleFund() {
    if (!connectedThisVisit) return alert('Please connect first');
    setStatus('pending');
    try {
      await simulateTx(Number(id), amount);
      setStatus('confirmed');
      setTimeout(()=>{ navigate('/dashboard'); }, 1000);
    } catch (e) {
      setStatus('failed');
      setTimeout(()=>{ navigate('/dashboard'); }, 1000);
    }
  }

  if (!campaign) return <div style={{padding:12}}>Startup not found</div>;

  return (
    <div style={{padding:16}}>
      <h2>Fund {campaign.name}</h2>
      <p>{campaign.description}</p>
      <div style={{marginTop:12}}>
        <div style={{marginBottom:8}}>Amount (ETH)</div>
        <input value={amount} onChange={(e)=>setAmount(e.target.value)} style={{padding:8, borderRadius:8}} />
      </div>
      <div style={{marginTop:12}}>
        {!connectedThisVisit ? (
          <div>
            <div>Please connect wallet to continue.</div>
            <div style={{marginTop:8}}>
              <button onClick={handleConnect} disabled={connecting}>{connecting ? 'Connecting…' : 'Connect Wallet'}</button>
            </div>
          </div>
        ) : (
          <div>
            <button onClick={handleFund} disabled={status==='pending'}>{status==='pending' ? 'Processing…' : 'Confirm and Send'}</button>
            {status && <div style={{marginTop:8}}>Status: {status}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionFlow;
