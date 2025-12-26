import React from 'react';
import PassDesignTable from './PassDesignTable';

export default function PassDesignTab({
  tableData,
  setTableData,
  loading,
  runSimulation
}) {
  const addRow = () => {
    const newId = Math.max(...tableData.map(r => r.id)) + 1;
    setTableData([...tableData, {
      id: newId,
      type: 'TwoRollPass',
      gap: 0,
      nominal_radius: 0,
      velocity: 0,
      grooveType: 'BoxGroove',
      groove: {r1: 0, r2: 0, depth: 0, pad_angle: 0}
    }]);
  };

  return (
    <div>
      <h2 style={{color: '#555'}}>Pass Design Configuration and Mill Layout</h2>

      <PassDesignTable
        tableData={tableData}
        setTableData={setTableData}
      />

      <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
        <button
          onClick={addRow}
          style={{
            padding: '10px 20px',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background 0.3s'
          }}
        >
          + Add Unit
        </button>

        <button
          onClick={runSimulation}
          disabled={loading}
          style={{
            padding: '12px 32px',
            background: loading ? '#ccc' : '#FFDD00',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.3s'
          }}
        >
          {loading ? 'Simulation running' : 'Start Simulation'}
        </button>
      </div>
    </div>
  );
}