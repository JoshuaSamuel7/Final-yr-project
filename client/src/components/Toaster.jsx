import React, { useState, useEffect } from 'react';

const Toaster = ({ messages }) => {
  const [list, setList] = useState(messages || []);

  useEffect(() => setList(messages || []), [messages]);

  if (!list || list.length === 0) return null;

  return (
    <div className="toaster">
      {list.slice().reverse().map((m, i) => (
        <div key={i} className={`toast toast-${m.type || 'info'}`}>
          <div className="toast-title">{m.title}</div>
          <div className="toast-body">{m.body}</div>
        </div>
      ))}
    </div>
  );
};

export default Toaster;
