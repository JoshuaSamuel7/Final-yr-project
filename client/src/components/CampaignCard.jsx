import React from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';

const CampaignCard = ({ campaign, onView, campaignIndex }) => {
  const navigate = useNavigate();

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
    <div style={{
      borderRadius: '12px',
      background: 'rgba(15,23,42,0.6)',
      border: '1px solid rgba(96,165,250,0.15)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = 'rgba(15,23,42,0.8)';
      e.currentTarget.style.borderColor = 'rgba(96,165,250,0.3)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'rgba(15,23,42,0.6)';
      e.currentTarget.style.borderColor = 'rgba(96,165,250,0.15)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}>
      {/* Campaign Image */}
      <div style={{
        width: '100%',
        height: '200px',
        background: `url('${campaign?.image || 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '0',
          right: '0',
          background: campaign?.stage === 'Series B' ? '#ff6b6b' : campaign?.stage === 'Series A' ? '#4c6ef5' : '#51cf66',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '0 0 0 8px',
          fontSize: '0.75rem',
          fontWeight: '600'
        }}>
          {campaign?.stage || 'Seed'}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#e0f2fe' }}>{campaign?.name || 'Untitled'}</h3>
          {campaign?.roi && <span style={{ fontSize: '0.85rem', background: 'rgba(16,185,129,0.2)', color: '#10b981', padding: '4px 8px', borderRadius: '4px', fontWeight: '600' }}>{campaign.roi}</span>}
        </div>

        <p style={{ margin: '0 0 12px 0', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: '1.4' }}>{campaign?.description || 'No description'}</p>

        {/* Tags */}
        {campaign?.tags && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {campaign.tags.slice(0, 2).map((tag, i) => (
              <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(96,165,250,0.15)', color: '#60a5fa', padding: '4px 8px', borderRadius: '4px' }}>
                {tag}
              </span>
            ))}
            {campaign.tags.length > 2 && <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>+{campaign.tags.length - 2}</span>}
          </div>
        )}

        {/* Metrics Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px', fontSize: '0.85rem' }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Team</div>
            <div style={{ fontWeight: '600', color: '#60a5fa' }}>{campaign?.team || '—'}</div>
          </div>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Users</div>
            <div style={{ fontWeight: '600', color: '#10b981' }}>{campaign?.users || '—'}</div>
          </div>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Investors</div>
            <div style={{ fontWeight: '600', color: '#f59e0b' }}>{campaign?.investors || '—'}</div>
          </div>
        </div>

        {/* Funding Progress */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>{raisedDisplay} / {goalDisplay} ETH</span>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{percent.toFixed(1)}%</span>
          </div>
          <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${percent}%`, background: 'linear-gradient(90deg, #3b82f6, #10b981)', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => navigate(`/fund/${campaignIndex}`)}
            style={{
              flex: 1,
              padding: '10px 12px',
              background: '#3b82f6',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#2563eb'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#3b82f6'; }}
          >
            🚀 Invest
          </button>
          <button
            onClick={() => onView ? onView(campaign) : navigate(`/startup/${campaignIndex}`)}
            style={{
              flex: 1,
              padding: '10px 12px',
              background: 'transparent',
              border: '1px solid rgba(96,165,250,0.3)',
              borderRadius: '6px',
              color: '#60a5fa',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#60a5fa'; e.currentTarget.style.background = 'rgba(96,165,250,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(96,165,250,0.3)'; e.currentTarget.style.background = 'transparent'; }}
          >
            📋 View
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
