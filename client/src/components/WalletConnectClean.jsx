import React from 'react';

const WalletConnect = ({ connectWallet, account, balance, simulateMode }) => {
  return (
    <div className="wallet-connect-page">
      <div className="wallet-connect-card">
        <h2>🔐 Connect Your Wallet</h2>
        <p className="wallet-connect-description">
          Connect your MetaMask wallet to invest in startups and create campaigns securely on the blockchain.
        </p>
        
        <div className="wallet-info-box">
          <div className="wallet-info-title">📌 What happens next:</div>
          <ul className="wallet-info-list">
            <li>✅ MetaMask wallet extension will open</li>
            <li>✅ You'll review and approve the connection request</li>
            <li>✅ Your account will be securely connected</li>
            <li>✅ You can transact with the smart contract</li>
            <li>✅ Your wallet balance will be displayed</li>
          </ul>
        </div>

        <div className="wallet-requirements">
          <div className="requirement-title">📋 Requirements:</div>
          <ul className="requirement-list">
            <li>MetaMask extension installed</li>
            <li>Ethereum account created</li>
            <li>Connected to a supported network</li>
          </ul>
        </div>

        <div className="wallet-connect-actions">
          <button 
            onClick={connectWallet}
            className="btn-primary btn-large"
          >
            🔗 Connect MetaMask Wallet
          </button>
          {simulateMode && (
            <div className="demo-mode-badge">
              <span>Demo mode: Wallet is optional for testing</span>
            </div>
          )}
        </div>

        {account && (
          <div className="wallet-connected-status">
            <div className="status-badge status-success">
              ✓ Connected
            </div>
            <div className="account-info">
              <div className="account-address-label">Account:</div>
              <code className="account-address">{account}</code>
            </div>
            {balance && balance !== '0' && (
              <div className="account-balance">
                <div className="balance-label">Balance:</div>
                <div className="balance-amount">{parseFloat(balance).toFixed(4)} ETH</div>
              </div>
            )}
          </div>
        )}

        {!account && (
          <div className="wallet-connect-hint">
            <div className="hint-icon">🛠️</div>
            <p><strong>Don't have MetaMask?</strong></p>
            <p>MetaMask is a browser extension that lets you interact with blockchain applications.</p>
            <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="link">
              Download MetaMask →
            </a>
          </div>
        )}

        <div className="wallet-security-notice">
          <strong>🔒 Security Notice:</strong> We will never ask for your private keys or seed phrase. MetaMask manages them securely.
        </div>
      </div>
    </div>
  );
}

export default WalletConnect;
