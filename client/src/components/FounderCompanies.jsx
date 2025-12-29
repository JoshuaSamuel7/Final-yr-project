import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

const FounderCompanies = ({ campaigns = [], account, user, onUpdate }) => {
  const navigate = useNavigate();
  const [editingIdx, setEditingIdx] = useState(null);
  const [editData, setEditData] = useState({});

  // Show all campaigns that have a creator field (shared founder demos) PLUS campaigns this founder created
  // This allows all founders to see and work with the mock founder campaigns
  const founderCampaigns = campaigns.filter(c => {
    // Show shared founder demo campaigns (those with creator field) to all founders
    if (c.creator) return true;
    // Also show campaigns owned by this founder's wallet
    if (account && c.owner?.toLowerCase() === account?.toLowerCase()) return true;
    return false;
  });

  const startEdit = (idx, campaign) => {
    setEditingIdx(idx);
    setEditData({
      description: campaign.description,
      team: campaign.team,
      users: campaign.users,
      roi: campaign.roi,
      investors: campaign.investors,
      tags: campaign.tags?.join(', ') || ''
    });
  };

  const saveEdit = (idx) => {
    if (onUpdate) {
      onUpdate(idx, {
        ...founderCampaigns[idx],
        ...editData,
        tags: editData.tags ? editData.tags.split(',').map(t => t.trim()) : []
      });
    }
    setEditingIdx(null);
  };

  const getStageColor = (stage) => {
    switch(stage) {
      case 'Seed': return { bg: '#10b981', border: 'rgba(16,185,129,0.4)' };
      case 'Series A': return { bg: '#3b82f6', border: 'rgba(59,130,246,0.4)' };
      case 'Series B': return { bg: '#f59e0b', border: 'rgba(245,158,11,0.4)' };
      default: return { bg: '#60a5fa', border: 'rgba(96,165,250,0.4)' };
    }
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '2rem', fontWeight: '700' }}>My Companies</h1>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>Manage your company campaigns and investor data</p>
      </div>

      {founderCampaigns.length === 0 ? (
        <div style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(15,23,42,0.6), rgba(30,41,59,0.6))',
          border: '1px solid rgba(96,165,250,0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏢</div>
          <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>No companies yet</div>
          <p style={{ margin: '0 0 1.5rem 0', color: 'rgba(255,255,255,0.6)' }}>Create your first company campaign to start raising funds</p>
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
            Create Company
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {founderCampaigns.map((campaign, idx) => {
            const isEditing = editingIdx === idx;
            const raised = Number(ethers.formatEther(campaign.amountRaised || 0));
            const goal = Number(ethers.formatEther(campaign.goal || 0));
            const percent = goal > 0 ? (raised / goal) * 100 : 0;
            const stageStyle = getStageColor(campaign.stage);

            return (
              <div key={idx} style={{
                borderRadius: '12px',
                background: isEditing ? 'linear-gradient(135deg, rgba(96,165,250,0.1), rgba(6,182,212,0.05))' : 'linear-gradient(135deg, rgba(15,23,42,0.7), rgba(30,41,59,0.6))',
                border: isEditing ? '1px solid rgba(96,165,250,0.3)' : '1px solid rgba(96,165,250,0.15)',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}>
                {/* Header */}
                <div style={{
                  padding: '20px',
                  background: `linear-gradient(135deg, ${stageStyle.bg}22, ${stageStyle.bg}11)`,
                  borderBottom: `1px solid ${stageStyle.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700' }}>{campaign.name}</h3>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: stageStyle.bg + '20',
                        color: stageStyle.bg,
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        border: `1px solid ${stageStyle.border}`
                      }}>
                        {campaign.stage || 'Seed'}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)' }}>{campaign.category}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/startup/${founderCampaigns.indexOf(campaign)}`)}
                    style={{
                      padding: '10px 20px',
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
                    View Page
                  </button>
                </div>

                {/* Content */}
                <div style={{ padding: '20px' }}>
                  {isEditing ? (
                    // Edit Mode
                    <div style={{ display: 'grid', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>Description</label>
                        <textarea
                          value={editData.description || ''}
                          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(96,165,250,0.3)',
                            background: 'rgba(255,255,255,0.02)',
                            color: 'white',
                            fontFamily: 'inherit',
                            fontSize: '0.95rem',
                            boxSizing: 'border-box',
                            minHeight: '100px'
                          }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>Team Size</label>
                          <input
                            type="number"
                            value={editData.team || 0}
                            onChange={(e) => setEditData({ ...editData, team: Number(e.target.value) })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              borderRadius: '6px',
                              border: '1px solid rgba(96,165,250,0.3)',
                              background: 'rgba(255,255,255,0.02)',
                              color: 'white',
                              fontSize: '0.95rem',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>Active Users</label>
                          <input
                            value={editData.users || ''}
                            onChange={(e) => setEditData({ ...editData, users: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              borderRadius: '6px',
                              border: '1px solid rgba(96,165,250,0.3)',
                              background: 'rgba(255,255,255,0.02)',
                              color: 'white',
                              fontSize: '0.95rem',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>Expected ROI</label>
                          <input
                            value={editData.roi || ''}
                            onChange={(e) => setEditData({ ...editData, roi: e.target.value })}
                            placeholder="+250%"
                            style={{
                              width: '100%',
                              padding: '10px',
                              borderRadius: '6px',
                              border: '1px solid rgba(96,165,250,0.3)',
                              background: 'rgba(255,255,255,0.02)',
                              color: 'white',
                              fontSize: '0.95rem',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>Tags (comma-separated)</label>
                        <input
                          value={editData.tags || ''}
                          onChange={(e) => setEditData({ ...editData, tags: e.target.value })}
                          placeholder="AI, HealthTech, Wellness"
                          style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid rgba(96,165,250,0.3)',
                            background: 'rgba(255,255,255,0.02)',
                            color: 'white',
                            fontSize: '0.95rem',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={() => saveEdit(idx)}
                          style={{
                            flex: 1,
                            padding: '12px',
                            background: '#10b981',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#059669'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#10b981'; }}
                        >
                          ✓ Save Changes
                        </button>
                        <button
                          onClick={() => setEditingIdx(null)}
                          style={{
                            flex: 1,
                            padding: '12px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '6px',
                            color: 'rgba(255,255,255,0.8)',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div style={{ display: 'grid', gap: '20px' }}>
                      <div>
                        <p style={{ margin: '0 0 12px 0', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                          {campaign.description}
                        </p>
                      </div>

                      {/* Metrics */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                        <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Total Raised</div>
                          <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#10b981' }}>{raised.toFixed(2)} ETH</div>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>of {goal.toFixed(2)} ETH</div>
                        </div>
                        <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Investors</div>
                          <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#3b82f6' }}>{campaign.investors || 0}</div>
                        </div>
                        <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Team Size</div>
                          <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#f59e0b' }}>{campaign.team || 0}</div>
                        </div>
                        <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Expected ROI</div>
                          <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#a855f7' }}>{campaign.roi || 'TBD'}</div>
                        </div>
                      </div>

                      {/* Tags */}
                      {campaign.tags && campaign.tags.length > 0 && (
                        <div>
                          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600' }}>Tags</div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {campaign.tags.map((tag, i) => (
                              <span key={i} style={{
                                fontSize: '0.8rem',
                                background: 'rgba(96,165,250,0.15)',
                                color: '#60a5fa',
                                padding: '4px 12px',
                                borderRadius: '6px'
                              }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Funding Progress */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
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

                      {/* Active Users */}
                      {campaign.users && (
                        <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(96,165,250,0.05)', border: '1px solid rgba(96,165,250,0.1)' }}>
                          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Active Users</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#60a5fa' }}>{campaign.users}</div>
                        </div>
                      )}

                      {/* Edit Button */}
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={() => navigate(`/startups/${campaigns.indexOf(campaign)}`)}
                          style={{
                            flex: 1,
                            padding: '12px',
                            background: 'rgba(16,185,129,0.1)',
                            border: '1px solid rgba(16,185,129,0.3)',
                            borderRadius: '6px',
                            color: '#10b981',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(16,185,129,0.2)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(16,185,129,0.1)'; }}
                        >
                          👁️ View Details
                        </button>
                        <button
                          onClick={() => startEdit(idx, campaign)}
                          style={{
                            flex: 1,
                            padding: '12px',
                            background: 'rgba(96,165,250,0.1)',
                            border: '1px solid rgba(96,165,250,0.3)',
                            borderRadius: '6px',
                            color: '#60a5fa',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(96,165,250,0.2)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(96,165,250,0.1)'; }}
                        >
                          ✏️ Edit Details
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FounderCompanies;
