import { NavLink } from 'react-router-dom';

const Navbar = ({ account, onConnect, simulateMode, toggleSimulate, balance, user, onLogout, connectedThisVisit }) => (
  <nav className="navbar">
    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
      <h1 style={{margin:0}}>DeStartup</h1>
      <div style={{display:'flex', gap:12, alignItems:'center'}}>
        <NavLink to="/welcome" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Welcome</NavLink>
        {user ? (
          <>
            <NavLink to="/startups" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Startups</NavLink>
            <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
            <NavLink to="/transactions" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Transactions</NavLink>
          </>
        ) : (
          <NavLink to="/auth" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Login / Signup</NavLink>
        )}
      </div>
    </div>
      <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
      <label style={{fontSize: '0.9rem', color: '#cfeafe', display:'flex', alignItems:'center', gap:8}}>
        Demo
        <input type="checkbox" checked={!!simulateMode} onChange={() => toggleSimulate && toggleSimulate(!simulateMode)} style={{marginLeft: '6px'}} />
      </label>
      <div style={{textAlign: 'right'}}>
        <div style={{fontSize: '0.85rem', color: '#e6eef6'}}>{user ? `@${user}` : ''}</div>
        <div style={{fontSize: '0.8rem', color: '#cde7ff'}}>{user && balance !== null && balance !== undefined ? `${balance} ETH` : ''}</div>
      </div>
      {user ? (
        <div style={{display:'flex', gap:8}}>
          <button onClick={onConnect}>{connectedThisVisit || account ? 'Connected' : 'Connect'}</button>
          <button onClick={onLogout}>Logout</button>
        </div>
      ) : null}
    </div>
  </nav>
);

export default Navbar;
