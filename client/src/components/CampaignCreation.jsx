import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

const CampaignCreation = ({ onCreateCampaign, user, account, simulateMode }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    goal: '1',
    targetAudience: '',
    website: '',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    category: 'HealthTech',
    stage: 'Seed',
    team: 2,
    users: '0',
    roi: '+150%',
    tags: ['AI', 'Innovation']
  });
  const [milestones, setMilestones] = useState([
    { title: '', description: '', percentage: 50 },
    { title: '', description: '', percentage: 50 }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userRole = localStorage.getItem(`user_role_${user}`) || 'INVESTOR';

  if (userRole !== 'FOUNDER' && userRole !== 'ADMIN') {
    return (
      <div style={{padding: '3rem 2rem', textAlign: 'center', borderRadius: '12px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(96,165,250,0.1)', maxWidth: '500px', margin: '2rem auto'}}>
        <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🔐</div>
        <h2 style={{margin: '0 0 0.5rem 0'}}>Access Denied</h2>
        <p style={{color: 'rgba(255,255,255,0.7)', marginBottom: '1rem'}}>Only Founders and Admins can create campaigns.</p>
        <p style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1.5rem'}}>Your current role: <strong>{userRole}</strong></p>
        <button 
          onClick={() => navigate('/startups')}
          style={{padding: '10px 24px', background: '#3b82f6', border: 'none', borderRadius: '6px', color: 'white', fontWeight: '600', cursor: 'pointer'}}
        >
          Back to Startups
        </button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleMilestoneChange = (index, field, value) => {
    const newMilestones = [...milestones];
    newMilestones[index][field] = value;
    setMilestones(newMilestones);
  };

  const addMilestone = () => {
    setMilestones([...milestones, { title: '', description: '', percentage: 25 }]);
  };

  const removeMilestone = (index) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.name.trim()) return 'Campaign name is required';
      if (!formData.description.trim()) return 'Description is required';
      if (!formData.goal || parseFloat(formData.goal) <= 0) return 'Valid funding goal is required';
    } else if (step === 2) {
      if (milestones.some(m => !m.title.trim())) return 'All milestone titles are required';
      const totalPercentage = milestones.reduce((sum, m) => sum + parseFloat(m.percentage || 0), 0);
      if (Math.abs(totalPercentage - 100) > 0.1) return `Milestone percentages must total 100% (current: ${totalPercentage.toFixed(1)}%)`;
    }
    return null;
  };

  const handleNextStep = () => {
    const err = validateStep(currentStep);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setCurrentStep(currentStep + 1);
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    const err = validateStep(3);
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newCampaign = {
        owner: account || '0x' + 'd'.repeat(40),
        name: formData.name,
        description: formData.description,
        goal: ethers.parseEther(formData.goal).toString(),
        amountRaised: '0',
        creator: user,
        image: formData.image,
        category: formData.category,
        stage: formData.stage,
        team: parseInt(formData.team),
        users: formData.users,
        roi: formData.roi,
        tags: formData.tags,
        targetAudience: formData.targetAudience,
        website: formData.website,
        milestones: milestones,
        createdAt: new Date().toISOString(),
        status: 'ACTIVE',
        investors: 0
      };

      // Store locally without blockchain connection
      if (onCreateCampaign) {
        await onCreateCampaign(newCampaign);
      }

      alert(`Campaign "${formData.name}" created successfully! 🚀`);
      setLoading(false);
      setTimeout(() => navigate('/founder-companies'), 500);
    } catch (err) {
      setError(err.message || 'Failed to create campaign');
      console.error('Campaign creation error:', err);
      setLoading(false);
    }
  };

  return (
    <div style={{padding: '1.5rem', maxWidth: '900px', margin: '0 auto'}}>
      <div style={{marginBottom: '2rem'}}>
        <h1 style={{margin: '0 0 8px 0', fontSize: '2rem', fontWeight: '700'}}>Launch Your Campaign</h1>
        <p style={{margin: 0, color: 'rgba(255,255,255,0.6)'}}>Create a funding campaign for your startup</p>
      </div>

      {/* Progress Indicator */}
      <div style={{marginBottom: '2rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center'}}>
          {[1, 2, 3].map((step) => (
            <div key={step} style={{display: 'flex', alignItems: 'center', flex: 1}}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: step <= currentStep ? '#3b82f6' : 'rgba(96,165,250,0.1)',
                border: `2px solid ${step <= currentStep ? '#3b82f6' : 'rgba(96,165,250,0.3)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                color: step <= currentStep ? 'white' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.3s ease'
              }}>
                {step}
              </div>
              {step < 3 && (
                <div style={{flex: 1, height: '2px', background: step < currentStep ? '#3b82f6' : 'rgba(96,165,250,0.2)', margin: '0 8px'}} />
              )}
            </div>
          ))}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-around', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)'}}>
          <span style={{color: currentStep >= 1 ? '#60a5fa' : 'rgba(255,255,255,0.6)'}}>Campaign Info</span>
          <span style={{color: currentStep >= 2 ? '#60a5fa' : 'rgba(255,255,255,0.6)'}}>Milestones</span>
          <span style={{color: currentStep >= 3 ? '#60a5fa' : 'rgba(255,255,255,0.6)'}}>Details</span>
        </div>
      </div>

      {error && (
        <div style={{padding: '12px 16px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', marginBottom: '1.5rem', fontSize: '0.9rem'}}>
          {error}
        </div>
      )}

      <form onSubmit={handleCreateCampaign}>
        {/* Step 1: Campaign Info */}
        {currentStep === 1 && (
          <div style={{padding: '24px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(96,165,250,0.08), rgba(6,182,212,0.03))', border: '1px solid rgba(96,165,250,0.15)'}}>
            <h2 style={{marginTop: 0, marginBottom: '1.5rem'}}>Campaign Information</h2>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: '600'}}>Campaign Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., AI-powered Health Platform" style={{width: '100%', padding: '12px 14px', borderRadius: '8px', border: '2px solid rgba(96,165,250,0.2)', background: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '0.95rem', boxSizing: 'border-box', transition: 'all 0.2s'}} onFocus={(e) => {e.currentTarget.style.borderColor = 'rgba(96,165,250,0.5)'}} onBlur={(e) => {e.currentTarget.style.borderColor = 'rgba(96,165,250,0.2)'}} />
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: '600'}}>Description *</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Tell investors about your vision, problem, and solution" rows={4} style={{width: '100%', padding: '12px 14px', borderRadius: '8px', border: '2px solid rgba(96,165,250,0.2)', background: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '0.95rem', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'all 0.2s'}} onFocus={(e) => {e.currentTarget.style.borderColor = 'rgba(96,165,250,0.5)'}} onBlur={(e) => {e.currentTarget.style.borderColor = 'rgba(96,165,250,0.2)'}} />
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: '600'}}>Funding Goal (ETH) *</label>
                <input type="number" name="goal" value={formData.goal} onChange={handleInputChange} placeholder="5.5" step="0.1" min="0.1" style={{width: '100%', padding: '12px 14px', borderRadius: '8px', border: '2px solid rgba(96,165,250,0.2)', background: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '0.95rem', boxSizing: 'border-box'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: '600'}}>Funding Stage</label>
                <select name="stage" value={formData.stage} onChange={handleInputChange} style={{width: '100%', padding: '12px 14px', borderRadius: '8px', border: '2px solid rgba(96,165,250,0.2)', background: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '0.95rem', boxSizing: 'border-box'}}>
                  <option value="Seed">Seed</option>
                  <option value="Series A">Series A</option>
                  <option value="Series B">Series B</option>
                </select>
              </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: '600'}}>Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange} style={{width: '100%', padding: '12px 14px', borderRadius: '8px', border: '2px solid rgba(96,165,250,0.2)', background: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '0.95rem', boxSizing: 'border-box'}}>
                  <option value="HealthTech">HealthTech</option>
                  <option value="FinTech">FinTech</option>
                  <option value="AgriTech">AgriTech</option>
                  <option value="EdTech">EdTech</option>
                  <option value="AI/ML">AI/ML</option>
                </select>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: '600'}}>Target Audience</label>
                <input type="text" name="targetAudience" value={formData.targetAudience} onChange={handleInputChange} placeholder="Healthcare professionals" style={{width: '100%', padding: '12px 14px', borderRadius: '8px', border: '2px solid rgba(96,165,250,0.2)', background: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '0.95rem', boxSizing: 'border-box'}} />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Milestones */}
        {currentStep === 2 && (
          <div style={{padding: '24px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(96,165,250,0.08), rgba(6,182,212,0.03))', border: '1px solid rgba(96,165,250,0.15)'}}>
            <h2 style={{marginTop: 0, marginBottom: '1rem'}}>Funding Milestones *</h2>
            <p style={{color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem', fontSize: '0.9rem'}}>Define how funds will be allocated to reach your goals</p>

            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem'}}>
              <span style={{color: 'rgba(255,255,255,0.6)'}}>Total Allocation:</span>
              <span style={{fontWeight: '600', color: milestones.reduce((sum, m) => sum + parseFloat(m.percentage || 0), 0) === 100 ? '#10b981' : '#f59e0b'}}>{milestones.reduce((sum, m) => sum + parseFloat(m.percentage || 0), 0).toFixed(1)}%</span>
            </div>

            <div style={{display: 'grid', gap: '1rem', marginBottom: '1.5rem'}}>
              {milestones.map((milestone, idx) => (
                <div key={idx} style={{padding: '16px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(96,165,250,0.1)'}}>
                  <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                    <div style={{flex: 1}}>
                      <input type="text" placeholder="Milestone title" value={milestone.title} onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)} style={{width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(96,165,250,0.2)', background: 'rgba(255,255,255,0.01)', color: 'white', fontSize: '0.9rem', boxSizing: 'border-box'}} />
                    </div>
                    <div style={{width: '120px'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                        <input type="number" placeholder="%" value={milestone.percentage} onChange={(e) => handleMilestoneChange(idx, 'percentage', e.target.value)} min="0" max="100" style={{width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(96,165,250,0.2)', background: 'rgba(255,255,255,0.01)', color: 'white', fontSize: '0.9rem', boxSizing: 'border-box'}} />
                        <span style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem'}}>%</span>
                      </div>
                    </div>
                    {milestones.length > 1 && (
                      <button type="button" onClick={() => removeMilestone(idx)} style={{padding: '10px 14px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600'}}>Remove</button>
                    )}
                  </div>
                  <textarea placeholder="Describe what will be accomplished" value={milestone.description} onChange={(e) => handleMilestoneChange(idx, 'description', e.target.value)} rows={2} style={{width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(96,165,250,0.2)', background: 'rgba(255,255,255,0.01)', color: 'white', fontSize: '0.85rem', fontFamily: 'inherit', boxSizing: 'border-box'}} />
                </div>
              ))}
            </div>

            <button type="button" onClick={addMilestone} style={{width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(96,165,250,0.1)', border: '1px dashed rgba(96,165,250,0.4)', color: '#60a5fa', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s'}} onMouseEnter={(e) => {e.currentTarget.style.background = 'rgba(96,165,250,0.15)'}} onMouseLeave={(e) => {e.currentTarget.style.background = 'rgba(96,165,250,0.1)'}}>+ Add Milestone</button>
          </div>
        )}

        {/* Step 3: Additional Details */}
        {currentStep === 3 && (
          <div style={{padding: '24px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(96,165,250,0.08), rgba(6,182,212,0.03))', border: '1px solid rgba(96,165,250,0.15)'}}>
            <h2 style={{marginTop: 0, marginBottom: '1.5rem'}}>Company Details</h2>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: '600'}}>Team Size</label>
                <input type="number" name="team" value={formData.team} onChange={handleInputChange} min="1" style={{width: '100%', padding: '12px 14px', borderRadius: '8px', border: '2px solid rgba(96,165,250,0.2)', background: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '0.95rem', boxSizing: 'border-box'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: '600'}}>Active Users</label>
                <input type="text" name="users" value={formData.users} onChange={handleInputChange} placeholder="100+" style={{width: '100%', padding: '12px 14px', borderRadius: '8px', border: '2px solid rgba(96,165,250,0.2)', background: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '0.95rem', boxSizing: 'border-box'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: '600'}}>Expected ROI</label>
                <input type="text" name="roi" value={formData.roi} onChange={handleInputChange} placeholder="+150%" style={{width: '100%', padding: '12px 14px', borderRadius: '8px', border: '2px solid rgba(96,165,250,0.2)', background: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '0.95rem', boxSizing: 'border-box'}} />
              </div>
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: '600'}}>Website / Links</label>
              <input type="url" name="website" value={formData.website} onChange={handleInputChange} placeholder="https://example.com" style={{width: '100%', padding: '12px 14px', borderRadius: '8px', border: '2px solid rgba(96,165,250,0.2)', background: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '0.95rem', boxSizing: 'border-box'}} />
            </div>

            <div style={{padding: '16px', borderRadius: '8px', background: 'rgba(96,165,250,0.05)', border: '1px solid rgba(96,165,250,0.1)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)'}}>
              <strong>ℹ️ Summary:</strong>
              <div style={{marginTop: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px'}}>
                <div>📛 <strong>{formData.name || 'Your Campaign'}</strong></div>
                <div>🎯 Goal: <strong>{formData.goal} ETH</strong></div>
                <div>📊 Stage: <strong>{formData.stage}</strong></div>
                <div>👥 Team: <strong>{formData.team} people</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{display: 'flex', gap: '12px', marginTop: '2rem'}}>
          {currentStep > 1 && (
            <button type="button" onClick={() => setCurrentStep(currentStep - 1)} style={{flex: 1, padding: '12px 16px', borderRadius: '8px', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.2s'}} onMouseEnter={(e) => {e.currentTarget.style.background = 'rgba(96,165,250,0.2)'}} onMouseLeave={(e) => {e.currentTarget.style.background = 'rgba(96,165,250,0.1)'}}>← Back</button>
          )}
          
          {currentStep < 3 ? (
            <button type="button" onClick={handleNextStep} style={{flex: 1, padding: '12px 16px', borderRadius: '8px', background: '#3b82f6', border: 'none', color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.2s'}} onMouseEnter={(e) => {e.currentTarget.style.background = '#2563eb'}} onMouseLeave={(e) => {e.currentTarget.style.background = '#3b82f6'}}>Next →</button>
          ) : (
            <button type="submit" disabled={loading} style={{flex: 1, padding: '12px 16px', borderRadius: '8px', background: '#10b981', border: 'none', color: 'white', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.95rem', opacity: loading ? 0.7 : 1, transition: 'all 0.2s'}} onMouseEnter={(e) => {if (!loading) e.currentTarget.style.background = '#059669'}} onMouseLeave={(e) => {e.currentTarget.style.background = '#10b981'}}>
              {loading ? '⏳ Creating...' : '✓ Launch Campaign'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CampaignCreation;
