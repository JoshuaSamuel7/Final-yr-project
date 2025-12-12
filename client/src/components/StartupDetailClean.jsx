import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const StartupDetail = ({ campaigns = [] }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const idx = Number(id);
  const campaign = campaigns[idx];
  if (!campaign) return <div style={{ padding: 12 }}>Startup not found</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>{campaign.name}</h2>
      <p>{campaign.description}</p>
      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <div style={{ flex: 1 }}>
          <div><strong>Owner:</strong> {campaign.owner}</div>
          <div><strong>Goal:</strong> {campaign.goal ?? 'N/A'}</div>
          <div style={{ marginTop: 8 }}><button onClick={() => navigate(`/fund/${idx}`)}>Fund this startup</button></div>
        </div>
        <div style={{ width: 260 }}>
          <div style={{ fontWeight: 700 }}>Official docs</div>
          {campaign.docs ? (
            <a href={campaign.docs} target="_blank" rel="noreferrer">Open mock official doc</a>
          ) : (
            <div>No docs available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartupDetail;
