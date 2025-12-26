import React from 'react';

export default function ResultsTab({ results }) {
  return (
    <div>
      <h2 style={{color: '#555'}}>Simulation Results</h2>

      {results ? (
        <div style={{
          background: '#f9f9f9',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{color: '#4CAF50'}}>Result:</h3>
          <pre style={{
            background: 'white',
            padding: '15px',
            borderRadius: '5px',
            overflow: 'auto',
            maxHeight: '600px',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      ) : (
        <div style={{
          background: '#fff3cd',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px',
          border: '1px solid #ffc107'
        }}>
          <p style={{margin: 0, color: '#856404'}}>
            No Results available. Please run a simulation first in the Pass Design tab.
          </p>
        </div>
      )}
    </div>
  );
}