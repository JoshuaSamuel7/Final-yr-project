import React from 'react';

const ShareCertificate = ({ 
  companyName, 
  investmentAmount, 
  equityPercentage, 
  investmentDate, 
  txHash,
  userName,
  walletAddress,
  onContinue 
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.getElementById('certificate-content');
    if (!element) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1200;
    canvas.height = 800;
    
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Border
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    // Inner decorative border
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    
    // Title
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('EQUITY SHARE CERTIFICATE', canvas.width / 2, 120);
    
    // Subtitle
    ctx.fillStyle = '#3b82f6';
    ctx.font = '20px Arial';
    ctx.fillText('Certificate of Startup Equity Ownership', canvas.width / 2, 160);
    
    // Certificate content
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    
    ctx.font = 'bold 16px Arial';
    ctx.fillText('This certifies that:', 80, 250);
    
    ctx.font = '14px Arial';
    ctx.fillText(userName || 'Investor', 80, 290);
    
    ctx.font = 'bold 16px Arial';
    ctx.fillText('is the registered owner of:', 80, 350);
    
    ctx.font = '20px Arial';
    ctx.fillStyle = '#1e40af';
    ctx.fillText(`${equityPercentage.toFixed(2)}%`, 80, 400);
    
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.fillText(`equity stake in ${companyName}`, 200, 400);
    
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Investment Details:', 80, 480);
    
    ctx.font = '13px Arial';
    const details = [
      `Investment Amount: ${investmentAmount} ETH`,
      `Company: ${companyName}`,
      `Equity Percentage: ${equityPercentage.toFixed(2)}%`,
      `Date of Investment: ${investmentDate}`,
      `Wallet Address: ${walletAddress.slice(0, 10)}...${walletAddress.slice(-8)}`,
      `Transaction Hash: ${(txHash || '').slice(0, 10)}...${(txHash || '').slice(-8)}`
    ];
    
    let y = 520;
    details.forEach(detail => {
      ctx.fillText(detail, 80, y);
      y += 30;
    });
    
    // Footer
    ctx.fillStyle = '#3b82f6';
    ctx.font = '11px Arial';
    ctx.fillText('This is a digital certificate of equity ownership on the DeStartup platform.', 80, canvas.height - 60);
    ctx.fillText('For official records and legal verification, please retain this certificate.', 80, canvas.height - 35);
    
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${companyName.replace(/\s+/g, '-')}-share-certificate.png`;
    link.click();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.98))',
        border: '2px solid rgba(59,130,246,0.5)',
        boxShadow: '0 20px 60px rgba(59,130,246,0.3)',
        padding: '40px'
      }}>
        {/* Success Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '12px'
          }}>✅</div>
          <h2 style={{
            color: '#60a5fa',
            fontSize: '28px',
            margin: '0 0 8px 0',
            fontWeight: 700
          }}>Investment Confirmed!</h2>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            margin: '0',
            fontSize: '14px'
          }}>Your equity certificate has been issued</p>
        </div>

        {/* Certificate Container */}
        <div id="certificate-content" style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,245,255,0.95))',
          padding: '40px 50px',
          borderRadius: '12px',
          marginBottom: '30px',
          border: '3px solid rgba(30,58,138,0.3)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          color: '#000'
        }}>
          {/* Certificate Title */}
          <div style={{
            textAlign: 'center',
            marginBottom: '30px',
            paddingBottom: '20px',
            borderBottom: '2px solid rgba(30,58,138,0.2)'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#1e3a8a',
              marginBottom: '8px',
              letterSpacing: '1px'
            }}>
              EQUITY SHARE CERTIFICATE
            </div>
            <div style={{
              fontSize: '14px',
              color: 'rgba(30,58,138,0.7)',
              fontStyle: 'italic'
            }}>
              Certificate of Startup Equity Ownership
            </div>
          </div>

          {/* Certificate Body */}
          <div style={{ lineHeight: '1.8', fontSize: '14px', color: '#1f2937', marginBottom: '30px' }}>
            <p style={{ margin: '0 0 15px 0' }}>
              <span style={{ fontWeight: 600, color: '#1e3a8a' }}>This certifies that</span>
            </p>
            <p style={{
              margin: '0 0 20px 0',
              fontSize: '16px',
              fontWeight: 600,
              color: '#1e3a8a',
              padding: '10px 15px',
              background: 'rgba(59,130,246,0.1)',
              borderRadius: '6px'
            }}>
              {userName || 'Investor'}
            </p>

            <p style={{ margin: '0 0 15px 0' }}>
              <span style={{ fontWeight: 600, color: '#1e3a8a' }}>is the registered owner of</span>
            </p>

            {/* Main Equity Display */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(30,58,138,0.08), rgba(59,130,246,0.08))',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '25px',
              border: '1px solid rgba(59,130,246,0.3)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '36px',
                fontWeight: 700,
                color: '#1e40af',
                marginBottom: '8px'
              }}>
                {equityPercentage.toFixed(2)}%
              </div>
              <div style={{
                fontSize: '18px',
                color: '#1f2937',
                fontWeight: 600
              }}>
                Equity Stake in <span style={{ color: '#1e40af' }}>{companyName}</span>
              </div>
            </div>

            {/* Investment Details */}
            <div style={{
              background: 'rgba(0,0,0,0.02)',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <p style={{ margin: '0 0 12px 0', fontWeight: 600, color: '#1e3a8a' }}>Investment Details:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: 'rgba(0,0,0,0.6)' }}>Investment Amount:</span><br />
                  <span style={{ fontWeight: 600, color: '#1e3a8a' }}>{investmentAmount} ETH</span>
                </div>
                <div>
                  <span style={{ color: 'rgba(0,0,0,0.6)' }}>Company:</span><br />
                  <span style={{ fontWeight: 600, color: '#1e3a8a' }}>{companyName}</span>
                </div>
                <div>
                  <span style={{ color: 'rgba(0,0,0,0.6)' }}>Date of Investment:</span><br />
                  <span style={{ fontWeight: 600, color: '#1e3a8a' }}>{investmentDate}</span>
                </div>
                <div>
                  <span style={{ color: 'rgba(0,0,0,0.6)' }}>Equity Percentage:</span><br />
                  <span style={{ fontWeight: 600, color: '#1e3a8a' }}>{equityPercentage.toFixed(2)}%</span>
                </div>
              </div>
            </div>

            {/* Wallet & Transaction Info */}
            <div style={{
              fontSize: '12px',
              color: 'rgba(0,0,0,0.7)',
              padding: '12px',
              background: 'rgba(59,130,246,0.05)',
              borderRadius: '6px',
              borderLeft: '3px solid rgba(59,130,246,0.3)',
              marginBottom: '20px'
            }}>
              <p style={{ margin: '0 0 6px 0' }}>
                <span style={{ fontWeight: 600 }}>Wallet Address:</span> {walletAddress}
              </p>
              <p style={{ margin: '0' }}>
                <span style={{ fontWeight: 600 }}>Transaction Hash:</span> {txHash || 'Pending'}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            textAlign: 'center',
            paddingTop: '20px',
            borderTop: '1px solid rgba(30,58,138,0.2)',
            fontSize: '11px',
            color: 'rgba(0,0,0,0.6)',
            fontStyle: 'italic'
          }}>
            <p style={{ margin: '0 0 6px 0' }}>
              This is a digital certificate of equity ownership on the DeStartup platform.
            </p>
            <p style={{ margin: 0 }}>
              For official records and legal verification, please retain this certificate.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handlePrint}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: '1px solid rgba(59,130,246,0.5)',
              background: 'rgba(59,130,246,0.1)',
              color: '#60a5fa',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              minWidth: '140px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(59,130,246,0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(59,130,246,0.1)';
            }}
          >
            🖨️ Print Certificate
          </button>
          <button
            onClick={handleDownload}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: '1px solid rgba(59,130,246,0.5)',
              background: 'rgba(59,130,246,0.1)',
              color: '#60a5fa',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              minWidth: '140px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(59,130,246,0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(59,130,246,0.1)';
            }}
          >
            ⬇️ Download
          </button>
          <button
            onClick={onContinue}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              minWidth: '140px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 20px rgba(59,130,246,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            ✓ Continue to Dashboard
          </button>
        </div>

        {/* Legal Notice */}
        <div style={{
          marginTop: '25px',
          padding: '15px',
          background: 'rgba(239,68,68,0.05)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '8px',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.6)',
          textAlign: 'center'
        }}>
          ⚠️ Important: This certificate represents your equity stake in the startup on the DeStartup platform. 
          For legal verification and official agreements, please contact the company directly.
        </div>
      </div>
    </div>
  );
};

export default ShareCertificate;
