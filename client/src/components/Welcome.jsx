import React, { useEffect, useState, useRef } from 'react';

const AnimatedStat = ({ label, value, suffix = '' }) => {
  const [num, setNum] = useState(0);
  const rafRef = useRef();

  useEffect(() => {
    let start = null;
    const target = Number(String(value).replace(/,/g, '')) || 0;
    const duration = 1100 + Math.random() * 600;
    function step(ts) {
      if (!start) start = ts;
      const t = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setNum(Math.floor(eased * target));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return (
    <div className="stat-item">
      <div className="counter">{num.toLocaleString()}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

const Welcome = ({ onGetStarted }) => {
  const stats = [
    { label: 'ETH simulated', value: '1234' , suffix: ' ETH'},
    { label: 'Campaigns', value: '128' },
    { label: 'Backers', value: '3452' }
  ];

  const testimonials = [
    { name: 'Alex P.', body: 'Great for demos — my pitch felt real and got attention.' },
    { name: 'Maya R.', body: 'We used this to prototype funding and it helped us refine our pitch.' },
    { name: 'Jin K.', body: 'Simple, beautiful and reliable for show-and-tell.' }
  ];

  return (
    <div style={{padding: '2rem'}}>
      <div className="welcome-hero">
        <div className="hero-left">
          <div className="badge">New • Demo</div>
          <h1>Launch, showcase, and fund your startup — without friction</h1>
          <p className="lead">DeStartup is a lightweight demo launchpad that simulates investment flows and on-chain interactions. Create campaigns, invite backers, and collect mock contributions for presentations and pitches — all without gas in demo mode.</p>
          <div style={{display:'flex', gap:12, marginTop:16}}>
            <button className="cta" onClick={() => onGetStarted && onGetStarted()}>Get Started — It's Free</button>
            <button className="cta ghost" onClick={() => window.scrollTo({top:800, behavior:'smooth'})}>Browse Startups</button>
          </div>
          <ul className="features">
            <li>Simulate funding rounds</li>
            <li>Local & on-chain modes</li>
            <li>Beautiful, shareable demos</li>
          </ul>

          <div className="stats" aria-hidden>
            {stats.map((s, i) => <AnimatedStat key={i} label={s.label} value={s.value} suffix={s.suffix} />)}
          </div>
        </div>
        <div className="hero-right">
          <div className="graphic-wrapper">
            <img className="hero-img" src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=1a" alt="pitch" />
            <div className="spark" />
            <svg className="blob" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#06b6d4" d="M43.7,-72.8C56.1,-64.4,66.6,-56.2,72.7,-44.8C78.8,-33.4,80.6,-18.8,78.8,-4.6C77.1,9.6,71.9,23.9,64.8,35.6C57.7,47.4,48.8,56.6,37.9,64.3C27,71.9,13.5,78.1,-0.9,79.6C-15.3,81.1,-30.6,78.1,-44.4,71.6C-58.1,65,-70.3,55,-76.5,41.8C-82.7,28.6,-82.9,12.3,-80.9,-3.8C-78.9,-19.9,-74.6,-35.9,-63.6,-46.8C-52.6,-57.7,-34.8,-63.6,-18.2,-67.3C-1.6,-71,13.8,-72.6,29.3,-71.9C44.8,-71.3,60.4,-68.6,43.7,-72.8Z" transform="translate(100 100)" />
            </svg>
          </div>
        </div>
      </div>

      <div className="how-section">
        <h3 style={{marginTop:36}}>How it works</h3>
        <div className="step-list">
          <div className="step">
            <div className="step-icon">1</div>
            <div>
              <div className="step-title">Create a campaign</div>
              <div className="step-desc">Describe your startup and set a funding goal.</div>
            </div>
          </div>
          <div className="step">
            <div className="step-icon">2</div>
            <div>
              <div className="step-title">Share with backers</div>
              <div className="step-desc">Invite friends or use demo mode for no-gas presentations.</div>
            </div>
          </div>
          <div className="step">
            <div className="step-icon">3</div>
            <div>
              <div className="step-title">Collect contributions</div>
              <div className="step-desc">Track contributions and show progress in real time.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="testimonial-list">
        {testimonials.map((t, i) => (
          <div key={i} className="testimonial">
            <div className="quote">“{t.body}”</div>
            <div className="who">— {t.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Welcome;
