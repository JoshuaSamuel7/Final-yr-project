import React, { useState } from 'react';

const Auth = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');

  function signup() {
    if (!username || !password) return alert('Provide username and password');
    const users = JSON.parse(localStorage.getItem('demo_users') || '{}');
    if (users[username]) return alert('User exists');
    users[username] = { password };
    localStorage.setItem('demo_users', JSON.stringify(users));
    // auto-login after signup for smoother demo flow
    localStorage.setItem('demo_user', username);
    onLogin && onLogin(username);
  }

  function login() {
    const users = JSON.parse(localStorage.getItem('demo_users') || '{}');
    if (users[username] && users[username].password === password) {
      localStorage.setItem('demo_user', username);
      onLogin && onLogin(username);
    } else alert('Invalid credentials');
  }

  return (
    <div className="form" style={{maxWidth: 520, margin: '1.25rem auto'}}>
      <h3 style={{marginTop:0}}>{mode === 'login' ? 'Login' : 'Create your account'}</h3>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <button onClick={()=>setMode('login')} style={{flex:1, background: mode==='login' ? undefined : 'transparent'}}>Login</button>
        <button onClick={()=>setMode('signup')} style={{flex:1, background: mode==='signup' ? undefined : 'transparent'}}>Signup</button>
      </div>

      <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <div style={{display: 'flex', gap: 8, marginTop:8}}>
        {mode === 'login' ? (
          <button onClick={login}>Login</button>
        ) : (
          <button onClick={signup}>Create account</button>
        )}
      </div>
      <div style={{marginTop:12, fontSize:12, color:'rgba(255,255,255,0.7)'}}>
        This is a demo authentication stored locally in your browser. Do not use real passwords.
      </div>
    </div>
  )
}

export default Auth;
