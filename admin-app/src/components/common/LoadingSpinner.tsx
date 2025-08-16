import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div style={{ textAlign: 'center', padding: '2rem' }}>
    <div className="spinner" style={{ width: 40, height: 40, border: '4px solid #ccc', borderTop: '4px solid #222', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default LoadingSpinner; 