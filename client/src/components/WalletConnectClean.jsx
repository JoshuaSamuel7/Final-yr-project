import React from 'react';

const WalletConnect = ({ connectWallet, account, simulateMode }) => {
  return (
    <div className="wallet-connect-page">
      <div className="wallet-connect-card">
        <h2>Connect Your Wallet</h2>
        <p className="wallet-connect-description">
          To proceed with creating campaigns and making donations, please connect your wallet extension.
        </p>
        
        <div className="wallet-info-box">
          <div className="wallet-info-title">📌 What happens next:</div>
          <ul className="wallet-info-list">
            <li>Your wallet extension (MetaMask) will open</li>
            <li>You'll approve the connection request</li>
            <li>Your account will be securely connected</li>
            <li>You can transact with the smart contract</li>
          </ul>
        </div>

        <div className="wallet-connect-actions">
          <button 
            onClick={connectWallet}
            className="btn-primary"
          >
            🔗 Connect Wallet
          </button>
          {simulateMode && (
            <div className="demo-mode-badge">Demo mode: Wallet is optional</div>
          )}
        </div>

        {account && (
          <div className="wallet-connected-status">
            <div className="status-badge status-success">✓ Connected</div>
            <div className="account-address">
              Account: <code>{account}</code>
            </div>
          </div>
        )}

        {!account && (
          <div className="wallet-connect-hint">
            <p>💡 Make sure you have MetaMask or another Ethereum wallet extension installed.</p>
            <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="link">
              Download MetaMask →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default WalletConnect;
