import React from 'react';

const short = (s = '') => (s.length > 10 ? s.slice(0, 6) + '...' + s.slice(-4) : s);

const TransactionLog = ({ txs = [] }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'failed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusBadge = (status) => {
    const icons = {
      confirmed: '✓',
      pending: '⏳',
      failed: '✕'
    };
    return icons[status] || '?';
  };

  if (!txs || txs.length === 0) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.6)',
        fontSize: '0.9rem'
      }}>
        No transactions yet
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1.5fr 1fr 1.2fr 0.8fr 0.6fr',
        gap: '12px',
        padding: '12px',
        background: 'rgba(59,130,246,0.1)',
        borderRadius: '6px',
        borderBottom: '1px solid rgba(96,165,250,0.2)',
        fontSize: '0.85rem',
        fontWeight: '600',
        color: 'rgba(255,255,255,0.7)'
      }}>
        <div>Campaign</div>
        <div>Investor</div>
        <div>Amount (ETH)</div>
        <div>Date</div>
        <div>Hash</div>
        <div>Status</div>
      </div>

      {/* Transaction rows */}
      {txs.map((tx) => (
        <div
          key={tx.id}
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1.5fr 1fr 1.2fr 0.6fr 0.6fr',
            gap: '12px',
            padding: '12px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '6px',
            border: '1px solid rgba(96,165,250,0.1)',
            transition: 'all 0.2s ease',
            alignItems: 'center',
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.8)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(59,130,246,0.15)';
            e.currentTarget.style.borderColor = 'rgba(96,165,250,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.3)';
            e.currentTarget.style.borderColor = 'rgba(96,165,250,0.1)';
          }}
        >
          {/* Campaign Name */}
          <div style={{
            fontWeight: '600',
            color: '#60a5fa'
          }}>
            {tx.campaign || 'Unknown'}
          </div>

          {/* Investor Address */}
          <div style={{
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.6)'
          }}>
            {tx.investor ? short(tx.investor) : short(tx.from || '')}
          </div>

          {/* Amount */}
          <div style={{
            fontWeight: '600',
            color: '#34d399'
          }}>
            {parseFloat(tx.amount).toFixed(2)} ETH
          </div>

          {/* Date */}
          <div style={{
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.5)'
          }}>
            {formatDate(tx.timestamp)}
          </div>

          {/* Transaction Hash */}
          <div style={{
            fontFamily: 'monospace',
            fontSize: '0.7rem',
            color: 'rgba(96,165,250,0.8)',
            cursor: 'pointer',
            wordBreak: 'break-all'
          }}>
            {short(tx.hash || tx.txHash || 'N/A')}
          </div>

          {/* Status Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 8px',
            background: `${getStatusColor(tx.status)}20`,
            borderRadius: '4px',
            color: getStatusColor(tx.status),
            fontWeight: '600',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            justifyContent: 'center'
          }}>
            <span>{getStatusBadge(tx.status)}</span>
            <span>{tx.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionLog;
