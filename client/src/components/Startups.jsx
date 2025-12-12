import React from 'react';
import CampaignCard from './CampaignCard';
import { useNavigate } from 'react-router-dom';

const Startups = ({ campaigns, onDonate }) => {
  const navigate = useNavigate();
  return (
    <div style={{padding: '0'}}>
      <div style={{marginBottom: '2rem'}}>
        <h2 style={{margin: '0 0 0.5rem 0', fontSize: '1.8rem'}}>All Startups</h2>
        <p style={{margin: 0, color: 'rgba(255,255,255,0.7)'}}>Browse and support innovative founders building the future</p>
      </div>
      <div className="campaigns">
        {campaigns.map((c, i) => (
          <CampaignCard key={i} campaign={c} onDonate={(amt) => onDonate(i, amt)} onView={() => navigate(`/startup/${i}`)} />
        ))}
      </div>
    </div>
  );
}

export default Startups;
