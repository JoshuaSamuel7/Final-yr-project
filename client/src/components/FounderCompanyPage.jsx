import React, { useState } from 'react';
import { ethers } from 'ethers';

const FounderCompanyPage = ({ campaigns, user, account, onCreateCampaign, txs }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [company, setCompany] = useState(() => {
    const stored = localStorage.getItem(`founder_company_${user}`);
    return stored ? JSON.parse(stored) : {
      name: '',
      description: '',
      mission: '',
      team: [],
      stage: 'Seed',
      website: '',
      founded: new Date().getFullYear(),
      images: [],
      updates: [],
      metrics: {
        totalRaised: '0',
        teamSize: 0,
        users: 0,
        mrr: 0
      }
    };
  });
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateContent, setUpdateContent] = useState('');
  const [newTeamMember, setNewTeamMember] = useState({ name: '', role: '' });

  // Get company's campaigns
  const companyCampaigns = campaigns.filter(c => c.owner === account);
  
  // Calculate total raised from transactions
  const totalRaisedFromTxs = txs
    .filter(t => companyCampaigns.some(camp => camp.name === t.campaignName) && t.status === 'confirmed')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const saveCompany = () => {
    localStorage.setItem(`founder_company_${user}`, JSON.stringify(company));
    alert('Company info saved!');
  };

  const addUpdate = () => {
    if (!updateTitle.trim() || !updateContent.trim()) return alert('Please fill in all fields');
    const newUpdate = {
      id: Date.now(),
      title: updateTitle,
      content: updateContent,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now()
    };
    setCompany({ ...company, updates: [newUpdate, ...company.updates] });
    setUpdateTitle('');
    setUpdateContent('');
    alert('Update posted!');
  };

  const addTeamMember = () => {
    if (!newTeamMember.name.trim() || !newTeamMember.role.trim()) return alert('Please fill in all fields');
    setCompany({
      ...company,
      team: [...company.team, { ...newTeamMember, id: Date.now() }]
    });
    setNewTeamMember({ name: '', role: '' });
  };

  const removeTeamMember = (id) => {
    setCompany({
      ...company,
      team: company.team.filter(m => m.id !== id)
    });
  };

  const updateMetric = (key, value) => {
    setCompany({
      ...company,
      metrics: { ...company.metrics, [key]: value }
    });
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2.2rem' }}>🏢 Founder Dashboard</h1>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)' }}>Manage your company profile, campaigns, and investor relations</p>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {['overview', 'team', 'updates', 'metrics', 'campaigns'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 16px',
              background: activeTab === tab ? 'transparent' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #3b82f6' : 'none',
              color: activeTab === tab ? '#3b82f6' : 'rgba(255,255,255,0.6)',
              fontWeight: activeTab === tab ? '600' : '500',
              cursor: 'pointer',
              fontSize: '0.95rem',
              textTransform: 'capitalize',
              transition: 'all 0.2s ease'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ padding: '20px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(15,23,42,0.7), rgba(30,41,59,0.7))', border: '1px solid rgba(96,165,250,0.15)' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>Company Info</h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Company Name</label>
              <input
                value={company.name}
                onChange={(e) => setCompany({ ...company, name: e.target.value })}
                placeholder="Your company name"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(96,165,250,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Stage</label>
              <select
                value={company.stage}
                onChange={(e) => setCompany({ ...company, stage: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(96,165,250,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
              >
                <option>Seed</option>
                <option>Series A</option>
                <option>Series B</option>
                <option>Series C</option>
              </select>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Founded Year</label>
              <input
                type="number"
                value={company.founded}
                onChange={(e) => setCompany({ ...company, founded: parseInt(e.target.value) })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(96,165,250,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Website</label>
              <input
                value={company.website}
                onChange={(e) => setCompany({ ...company, website: e.target.value })}
                placeholder="https://yourcompany.com"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(96,165,250,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white', boxSizing: 'border-box' }}
              />
            </div>
            <button
              onClick={saveCompany}
              style={{
                width: '100%',
                padding: '12px',
                background: '#3b82f6',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '12px'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#2563eb'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#3b82f6'; }}
            >
              Save Company Info
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '16px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.05))', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', fontWeight: '600' }}>Total Raised</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#10b981' }}>{totalRaisedFromTxs.toFixed(2)} ETH</div>
              {companyCampaigns.length > 0 && (
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>From {companyCampaigns.length} campaign{companyCampaigns.length !== 1 ? 's' : ''}</div>
              )}
            </div>
            <div style={{ padding: '16px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(96,165,250,0.1), rgba(6,182,212,0.05))', border: '1px solid rgba(96,165,250,0.2)' }}>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', fontWeight: '600' }}>Active Campaigns</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#60a5fa' }}>{companyCampaigns.length}</div>
            </div>
            <div style={{ padding: '16px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(6,182,212,0.05))', border: '1px solid rgba(245,158,11,0.2)' }}>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', fontWeight: '600' }}>Team Size</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#f59e0b' }}>{company.team.length}</div>
            </div>
          </div>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ padding: '20px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(15,23,42,0.7), rgba(30,41,59,0.7))', border: '1px solid rgba(96,165,250,0.15)' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>Add Team Member</h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Name</label>
              <input
                value={newTeamMember.name}
                onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                placeholder="Member name"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(96,165,250,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Role</label>
              <input
                value={newTeamMember.role}
                onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
                placeholder="e.g., CEO, CTO, COO"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(96,165,250,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white', boxSizing: 'border-box' }}
              />
            </div>
            <button
              onClick={addTeamMember}
              style={{
                width: '100%',
                padding: '12px',
                background: '#3b82f6',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '12px'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#2563eb'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#3b82f6'; }}
            >
              Add Member
            </button>
          </div>

          <div style={{ padding: '20px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(15,23,42,0.7), rgba(30,41,59,0.7))', border: '1px solid rgba(96,165,250,0.15)' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>Team Members ({company.team.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
              {company.team.length === 0 ? (
                <div style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '2rem 0' }}>No team members yet</div>
              ) : (
                company.team.map(member => (
                  <div
                    key={member.id}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'rgba(96,165,250,0.1)',
                      border: '1px solid rgba(96,165,250,0.2)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '600', color: '#60a5fa' }}>{member.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{member.role}</div>
                    </div>
                    <button
                      onClick={() => removeTeamMember(member.id)}
                      style={{
                        padding: '6px 10px',
                        background: 'rgba(239,68,68,0.2)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '4px',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Updates Tab */}
      {activeTab === 'updates' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ padding: '20px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(15,23,42,0.7), rgba(30,41,59,0.7))', border: '1px solid rgba(96,165,250,0.15)' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>Post Update</h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Title</label>
              <input
                value={updateTitle}
                onChange={(e) => setUpdateTitle(e.target.value)}
                placeholder="Update title"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(96,165,250,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Content</label>
              <textarea
                value={updateContent}
                onChange={(e) => setUpdateContent(e.target.value)}
                placeholder="What's new with your company?"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(96,165,250,0.2)',
                  background: 'rgba(0,0,0,0.2)',
                  color: 'white',
                  boxSizing: 'border-box',
                  minHeight: '100px',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem'
                }}
              />
            </div>
            <button
              onClick={addUpdate}
              style={{
                width: '100%',
                padding: '12px',
                background: '#3b82f6',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '12px'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#2563eb'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#3b82f6'; }}
            >
              Post Update
            </button>
          </div>

          <div style={{ padding: '20px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(15,23,42,0.7), rgba(30,41,59,0.7))', border: '1px solid rgba(96,165,250,0.15)' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>Recent Updates ({company.updates.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto' }}>
              {company.updates.length === 0 ? (
                <div style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '2rem 0' }}>No updates yet</div>
              ) : (
                company.updates.map(update => (
                  <div
                    key={update.id}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'rgba(96,165,250,0.1)',
                      border: '1px solid rgba(96,165,250,0.2)'
                    }}
                  >
                    <div style={{ fontWeight: '600', color: '#60a5fa', marginBottom: '6px' }}>{update.title}</div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>{update.content}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>📅 {update.date}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Metrics Tab */}
      {activeTab === 'metrics' && (
        <div style={{ padding: '20px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(15,23,42,0.7), rgba(30,41,59,0.7))', border: '1px solid rgba(96,165,250,0.15)' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem' }}>Company Metrics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Total Raised (ETH)</label>
              <input
                type="number"
                value={company.metrics.totalRaised}
                onChange={(e) => updateMetric('totalRaised', e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid rgba(96,165,250,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Users</label>
              <input
                type="number"
                value={company.metrics.users}
                onChange={(e) => updateMetric('users', parseInt(e.target.value))}
                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid rgba(96,165,250,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Monthly Recurring Revenue (USD)</label>
              <input
                type="number"
                value={company.metrics.mrr}
                onChange={(e) => updateMetric('mrr', parseInt(e.target.value))}
                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid rgba(96,165,250,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white', boxSizing: 'border-box' }}
              />
            </div>
          </div>
          <button
            onClick={saveCompany}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              background: '#3b82f6',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#2563eb'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#3b82f6'; }}
          >
            Save Metrics
          </button>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem' }}>Your Campaigns ({companyCampaigns.length})</h3>
          {companyCampaigns.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(15,23,42,0.6), rgba(30,41,59,0.6))', border: '1px solid rgba(96,165,250,0.1)' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>No campaigns yet</div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>Create your first funding campaign to start raising capital</div>
              <button
                onClick={() => window.location.href = '/create-campaign'}
                style={{
                  padding: '10px 20px',
                  background: '#3b82f6',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#2563eb'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#3b82f6'; }}
              >
                Create Campaign
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {companyCampaigns.map((campaign, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(15,23,42,0.7), rgba(30,41,59,0.7))',
                    border: '1px solid rgba(96,165,250,0.15)'
                  }}
                >
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#60a5fa' }}>{campaign.name}</h4>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{campaign.description}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Raised</div>
                      <div style={{ fontWeight: '600', color: '#10b981' }}>{ethers.formatEther(campaign.amountRaised).slice(0, 6)} ETH</div>
                    </div>
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Goal</div>
                      <div style={{ fontWeight: '600', color: '#60a5fa' }}>{ethers.formatEther(campaign.goal).slice(0, 6)} ETH</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FounderCompanyPage;
