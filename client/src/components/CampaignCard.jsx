import React, { useState } from 'react';
import { ethers } from 'ethers';

const CampaignCard = ({ campaign, onDonate, openDonateModal, onView }) => {
  const [amount, setAmount] = useState('');

  const rawRaised = (() => {
    try { return campaign?.amountRaised ? BigInt(campaign.amountRaised) : 0n } catch { return 0n }
  })();
  const rawGoal = (() => {
    try { return campaign?.goal ? BigInt(campaign.goal) : 0n } catch { return 0n }
  })();

  const raisedDisplay = (() => {
    try { return ethers.formatEther(rawRaised) } catch { return '0' }
  })();
  const goalDisplay = (() => {
    try { return ethers.formatEther(rawGoal) } catch { return '0' }
  })();

  let percent = 0;
  try {
    if (rawGoal > 0n) {
      // compute percent with two-decimal precision using integer math
      const p = Number((rawRaised * 10000n) / rawGoal) / 100;
      percent = Math.max(0, Math.min(100, p));
    }
  } catch (e) { percent = 0 }

  const ownerShort = campaign?.owner ? `${campaign.owner.slice(0,6)}...${campaign.owner.slice(-4)}` : '—';

  return (
    <div className="card">
      <h3 style={{margin:'0 0 6px 0'}}>{campaign?.name || 'Untitled'}</h3>
      <p style={{margin:0, color:'rgba(255,255,255,0.8)'}}>{campaign?.description || 'No description'}</p>

      <div className="meta">
        <div style={{fontSize:'.85rem'}}>{ownerShort}</div>
        <div style={{fontWeight:700}}>{raisedDisplay} / {goalDisplay} ETH</div>
      </div>

      <div className="progress" aria-hidden>
        <div className="progress-fill" style={{width: `${percent}%`}} />
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14}}>
        <input
          type="number"
          placeholder="Amount (ETH)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{flex:1, padding:'0.7rem 0.8rem', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.03)', color:'inherit', fontSize: '0.9rem', transition: 'border-color 0.2s'}}
        />
        <div style={{display:'flex', gap:8}}>
          <button onClick={() => openDonateModal ? openDonateModal(campaign, amount) : onDonate(amount)} style={{flex:1, padding: '10px 16px', fontSize: '0.9rem'}}>{campaign?.goal ? 'Donate' : 'Invest'}</button>
          {onView ? <button onClick={() => onView(campaign)} style={{background:'transparent', border:'1px solid rgba(96,165,250,0.2)', padding: '10px 16px', fontSize: '0.9rem'}}>View</button> : null}
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
