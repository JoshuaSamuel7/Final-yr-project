import React, { useState } from 'react';

const Auth = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('INVESTOR');
  const [mode, setMode] = useState('login');

  function signup() {
    if (!username || !password) return alert('Provide username and password');
    const users = JSON.parse(localStorage.getItem('demo_users') || '{}');
    if (users[username]) return alert('User exists');
    users[username] = { password, role };
    localStorage.setItem('demo_users', JSON.stringify(users));
    // auto-login after signup for smoother demo flow
    localStorage.setItem('demo_user', username);
    localStorage.setItem(`user_role_${username}`, role);
    onLogin && onLogin(username);
  }

  function login() {
    const users = JSON.parse(localStorage.getItem('demo_users') || '{}');
    if (users[username] && users[username].password === password) {
      localStorage.setItem('demo_user', username);
      localStorage.setItem(`user_role_${username}`, users[username].role || 'INVESTOR');
      onLogin && onLogin(username);
    } else alert('Invalid credentials');
  }

  const roleDescriptions = {
    INVESTOR: '💰 Invest in startup campaigns and track your portfolio',
    FOUNDER: '🚀 Create and manage your own startup campaigns',
    ADMIN: '⚙️ Manage platform settings and users'
  };

  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
      <div style={{width: '100%', maxWidth: '500px'}}>
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <h1 style={{fontSize: '2.5rem', margin: '0 0 8px 0', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>DeStartup</h1>
          <p style={{margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '1rem'}}>Launch and fund the next great startup</p>
        </div>

        {/* Auth Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(30,41,59,0.8))',
          border: '1px solid rgba(96,165,250,0.2)',
          borderRadius: '16px',
          padding: '2rem',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Mode Tabs */}
          <div style={{display:'flex', gap: 8, marginBottom: '1.5rem', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '8px'}}>
            <button 
              onClick={()=>setMode('login')} 
              style={{
                flex:1, 
                padding: '12px',
                background: mode==='login' ? 'rgba(59,130,246,0.3)' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                color: mode==='login' ? '#3b82f6' : 'rgba(255,255,255,0.6)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { if (mode !== 'login') e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; }}
              onMouseLeave={(e) => { if (mode !== 'login') e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
            >
              Login
            </button>
            <button 
              onClick={()=>setMode('signup')} 
              style={{
                flex:1, 
                padding: '12px',
                background: mode==='signup' ? 'rgba(59,130,246,0.3)' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                color: mode==='signup' ? '#3b82f6' : 'rgba(255,255,255,0.6)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { if (mode !== 'signup') e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; }}
              onMouseLeave={(e) => { if (mode !== 'signup') e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
            >
              Sign Up
            </button>
          </div>

          {/* Form Title */}
          <h2 style={{margin: '0 0 1.5rem 0', fontSize: '1.5rem', fontWeight: '700', color: '#fff'}}>
            {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h2>

          {/* Input Fields */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.5rem'}}>
            <div>
              <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '6px', color: 'rgba(255,255,255,0.7)', fontWeight: '500'}}>Username</label>
              <input 
                placeholder="Enter your username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (mode === 'login' ? login() : signup())}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(96,165,250,0.2)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(96,165,250,0.5)'; e.currentTarget.style.background = 'rgba(0,0,0,0.4)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(96,165,250,0.2)'; e.currentTarget.style.background = 'rgba(0,0,0,0.3)'; }}
              />
            </div>

            <div>
              <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '6px', color: 'rgba(255,255,255,0.7)', fontWeight: '500'}}>Password</label>
              <input 
                placeholder="Enter your password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (mode === 'login' ? login() : signup())}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(96,165,250,0.2)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(96,165,250,0.5)'; e.currentTarget.style.background = 'rgba(0,0,0,0.4)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(96,165,250,0.2)'; e.currentTarget.style.background = 'rgba(0,0,0,0.3)'; }}
              />
            </div>
          </div>

          {/* Role Selection (Signup Only) */}
          {mode === 'signup' && (
            <div style={{marginBottom: '1.5rem', padding: '1rem', background: 'rgba(96,165,250,0.1)', borderRadius: '8px', border: '1px solid rgba(96,165,250,0.2)'}}>
              <label style={{display: 'block', marginBottom: '12px', color: 'rgba(255,255,255,0.8)', fontWeight: '600', fontSize: '0.9rem'}}>Select your role:</label>
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                {['INVESTOR', 'FOUNDER'].map(r => (
                  <label 
                    key={r} 
                    style={{
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px', 
                      padding: '10px 12px',
                      borderRadius: '6px',
                      background: role === r ? 'rgba(59,130,246,0.2)' : 'rgba(0,0,0,0.2)',
                      border: `1px solid ${role === r ? 'rgba(59,130,246,0.5)' : 'rgba(96,165,250,0.2)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input 
                      type="radio" 
                      name="role" 
                      value={r} 
                      checked={role === r}
                      onChange={(e) => setRole(e.target.value)}
                      style={{cursor: 'pointer', width: '16px', height: '16px'}}
                    />
                    <div>
                      <div style={{color: '#fff', fontWeight: '500'}}>{r}</div>
                      <div style={{fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)'}}>{roleDescriptions[r]}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button 
            onClick={mode === 'login' ? login : signup}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '1rem'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb, #1d4ed8)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Auth;
