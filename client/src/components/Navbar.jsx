import { NavLink } from 'react-router-dom';

const Navbar = ({ account, onConnect, simulateMode, toggleSimulate, balance, user, onLogout, connectedThisVisit, onDisconnect }) => {
  const userRole = user ? (localStorage.getItem(`user_role_${user}`) || 'INVESTOR') : null;
  const isFounder = userRole === 'FOUNDER' || userRole === 'ADMIN';
  const isInvestor = userRole === 'INVESTOR';

  return (
  <nav className="navbar">
    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
      <h1 style={{margin:0}}>DeStartup</h1>
      <div style={{display:'flex', gap:12, alignItems:'center'}}>
        {!user ? (
          <>
            <NavLink to="/" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
            <NavLink to="/auth" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Login / Signup</NavLink>
          </>
        ) : isFounder ? (
          <>
            <NavLink to="/founder-dashboard" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>📊 Dashboard</NavLink>
            <NavLink to="/founder-companies" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>🏢 My Companies</NavLink>
            <NavLink to="/create-campaign" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>➕ New Campaign</NavLink>
          </>
        ) : isInvestor ? (
          <>
            <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>📊 Dashboard</NavLink>
            <NavLink to="/startups" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>🚀 Startups</NavLink>
            <NavLink to="/transactions" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>💰 Transactions</NavLink>
          </>
        ) : null}
      </div>
    </div>
      <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
      <div style={{textAlign: 'right'}}>
        <div style={{fontSize: '0.85rem', color: '#e6eef6'}}>{user ? `@${user}` : ''}</div>
        <div style={{fontSize: '0.75rem', color: '#cbd5e0'}}>{user && userRole ? `${userRole}` : ''}</div>
        <div style={{fontSize: '0.8rem', color: '#cde7ff'}}>{user && balance !== null && balance !== undefined ? `${parseFloat(balance).toFixed(4)} ETH` : ''}</div>
      </div>
      {user ? (
        <div style={{display:'flex', gap:8, alignItems: 'center'}}>
          <button onClick={onConnect} style={{whiteSpace: 'nowrap'}}>{connectedThisVisit || account ? '✓ Connected' : 'Connect'}</button>
          {(connectedThisVisit || account) && (
            <button 
              onClick={onDisconnect}
              className="btn-disconnect"
              title="Disconnect wallet"
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '0.4rem 0.6rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                minWidth: 'auto'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.3)';
                e.target.style.borderColor = 'rgba(239, 68, 68, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                e.target.style.borderColor = 'rgba(239, 68, 68, 0.3)';
              }}
            >
              🔌
            </button>
          )}
          <button onClick={onLogout}>Logout</button>
        </div>
      ) : null}
    </div>
  </nav>
  );
};

export default Navbar;
