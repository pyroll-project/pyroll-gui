import React, { useState } from 'react';
import PassDesignTable from './PassDesignTable';
import PassDesignLoader from './PassDesignLoader';
import PassDesignSaver from './PassDesignSaver';
import Notification from './Notification';

export default function PassDesignTab({
  tableData,
  setTableData,
  loading,
  runSimulation
}) {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });


  const showNotification = (message, type = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });
  };


  const closeNotification = () => {
    setNotification({
      show: false,
      message: '',
      type: 'success'
    });
  };

  const addRow = () => {
    const newId = tableData.length > 0
      ? Math.max(...tableData.map(r => r.id)) + 1
      : 1;

    setTableData([...tableData, {
      id: newId,
      type: 'TwoRollPass',
      gap: 0,
      nominal_radius: 0,
      velocity: 0,
      grooveType: 'BoxGroove',
      groove: { r1: 0, r2: 0, depth: 0, pad_angle: 0 }
    }]);
  };

  return (
    <div>
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
        duration={3000}
      />

      <h2 style={{ color: '#555', marginBottom: '20px' }}>
        Pass Design and Mill Layout
      </h2>

      <PassDesignTable
        tableData={tableData}
        setTableData={setTableData}
      />

      <div style={{
        marginTop: '20px',
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <button
          onClick={addRow}
          style={{
            padding: '10px 20px',
            background: '#9C27B0',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#7B1FA2'}
          onMouseOut={(e) => e.currentTarget.style.background = '#9C27B0'}
        >
          <span>➕</span>
          Add Unit
        </button>

        {/* XML Loader */}
        <PassDesignLoader
          setTableData={setTableData}
          onNotification={showNotification}
        />

        {/* XML Saver */}
        <PassDesignSaver
          tableData={tableData}
          onNotification={showNotification}
        />

        {/* Separator */}
        <div style={{
          width: '2px',
          height: '40px',
          background: '#ddd',
          margin: '0 5px'
        }} />

        {/* Start Simulation Button */}
        <button
          onClick={runSimulation}
          disabled={loading}
          style={{
            padding: '12px 32px',
            background: loading ? '#ccc' : '#FFDD00',
            color: loading ? '#666' : '#333',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => {
            if (!loading) e.currentTarget.style.background = '#FFD700';
          }}
          onMouseOut={(e) => {
            if (!loading) e.currentTarget.style.background = '#FFDD00';
          }}
        >
          {loading ? (
            <>
              <span style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                border: '3px solid #666',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Simulation running...
            </>
          ) : (
            <>
              <span>▶</span>
              Start Simulation
            </>
          )}
        </button>
      </div>

      {/* Info Box */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#f5f5f5',
        borderRadius: '6px',
        border: '1px solid #ddd',
        fontSize: '14px',
        color: '#666'
      }}>
        <strong style={{ color: '#333' }}>Note:</strong> You can save and load a Pass Design from a XML file.
        The XML file contains all units with set parameters and groove definitions.
      </div>

      {/* CSS for spinner animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}