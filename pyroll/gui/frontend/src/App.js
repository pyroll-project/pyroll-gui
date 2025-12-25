import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('passdesign');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  // Initiale Tabellendaten
  const [tableData, setTableData] = useState([
    { id: 1, type: 'TwoRollPass', grooveDepth: 10, grooveWidth: 50, rollRadius: 100 },
    { id: 2, type: 'ThreeRollPass', grooveDepth: 8, grooveWidth: 45, rollRadius: 95, roll3Offset: 20 },
    { id: 3, type: 'Transport', length: 500, duration: 2.5 },
    { id: 4, type: 'CoolingPipe', length: 1000, coolingRate: 15, temperature: 800 },
    { id: 5, type: 'TwoRollPass', grooveDepth: 12, grooveWidth: 55, rollRadius: 105 },
    { id: 6, type: 'Transport', length: 300, duration: 1.5 },
  ]);

  const typeOptions = ['TwoRollPass', 'ThreeRollPass', 'Transport', 'CoolingPipe'];

  // Felder je nach Type
  const getFieldsForType = (type) => {
    switch (type) {
      case 'TwoRollPass':
        return [
          { key: 'groove', label: 'Groove', type: 'number' },
          { key: 'gap', label: 'Roll Gap', type: 'number' },
          { key: 'nominal_roll_radius', label: 'Nominal Roll Radius', type: 'number' },
          { key: 'velocity', label: 'Velocity', type: 'number'},
          { key: 'front_tension', label: 'Front Tension', type: 'number' },
          { key: 'back_tension', label: 'Back Tension', type: 'number' },
          { key: 'coulomb_friction_coefficient', label: 'Friction Coefficient', type: 'number'}

        ];
      case 'ThreeRollPass':
        return [
          { key: 'groove', label: 'Groove', type: 'number' },
          { key: 'inscribed_circle_diameter', label: 'Inscribed Circle Diameter (ICD)', type: 'number' },
          { key: 'nominal_roll_radius', label: 'Nominal Roll Radius', type: 'number' },
          { key: 'velocity', label: 'Velocity', type: 'number'},
          { key: 'front_tension', label: 'Front Tension', type: 'number' },
          { key: 'back_tension', label: 'Back Tension', type: 'number' },
          { key: 'coulomb_friction_coefficient', label: 'Friction Coefficient', type: 'number'}
        ];
      case 'Transport':
        return [
          { key: 'length', label: 'Length (mm)', type: 'number' },
          { key: 'duration', label: 'Duration (s)', type: 'number' },
          {key: 'heat_transfer_coefficient', label: 'Heat Transfer Coefficient', type: 'number'}
        ];
      case 'CoolingPipe':

        return [
          { key: 'length', label: 'Length', type: 'number' },
          { key: 'coolant_temperature', label: 'Coolant Temperature', type: 'number' },
          { key: 'coolant_volume_flux', label: 'Volume Flux', type: 'number' },
          {key: 'heat_transfer_coefficient', label: 'Heat Transfer Coefficient', type: 'number'}

        ];
      default:
        return [];
    }
  };

  const handleTypeChange = (id, newType) => {
    setTableData(prevData =>
      prevData.map(row => {
        if (row.id === id) {
          // Nur ID und Type behalten, Rest entfernen
          const newRow = { id: row.id, type: newType };

          // Default-Werte für den neuen Type setzen
          const fields = getFieldsForType(newType);
          fields.forEach(field => {
            newRow[field.key] = 0;
          });

          return newRow;
        }
        return row;
      })
    );
  };

  const handleInputChange = (id, field, value) => {
    setTableData(prevData =>
      prevData.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const addRow = () => {
    const newId = Math.max(...tableData.map(r => r.id)) + 1;
    setTableData([...tableData, {
      id: newId,
      type: 'TwoRollPass',
      grooveDepth: 0,
      grooveWidth: 0,
      rollRadius: 0
    }]);
  };

  const deleteRow = (id) => {
    if (tableData.length > 1) {
      setTableData(tableData.filter(row => row.id !== id));
    }
  };

  const runSimulation = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          passDesignData: tableData
        })
      });

      if (!response.ok) {
        throw new Error('Simulation fehlgeschlagen');
      }

      const data = await response.json();
      setResults(data);
      setActiveTab('results');
    } catch (error) {
      console.error('Fehler:', error);
      alert('Simulation fehlgeschlagen. Stelle sicher, dass das Backend läuft.');
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: '#333', borderBottom: '3px solid #4CAF50', paddingBottom: '10px' }}>
        PyRoll Simulation
      </h1>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', borderBottom: '2px solid #ddd', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('passdesign')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: activeTab === 'passdesign' ? '#4CAF50' : '#f1f1f1',
            color: activeTab === 'passdesign' ? 'white' : '#333',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '5px 5px 0 0',
            marginRight: '5px',
            transition: 'background 0.3s'
          }}
        >
          PassDesign
        </button>
        <button
          onClick={() => setActiveTab('results')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: activeTab === 'results' ? '#4CAF50' : '#f1f1f1',
            color: activeTab === 'results' ? 'white' : '#333',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '5px 5px 0 0',
            transition: 'background 0.3s'
          }}
        >
          Results
        </button>
      </div>

      {/* PassDesign Tab */}
      {activeTab === 'passdesign' && (
        <div>
          <h2 style={{ color: '#555' }}>Pass Design Configuration</h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: '#4CAF50', color: 'white' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', minWidth: '60px' }}>Unit Nr.</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', minWidth: '150px' }}>Type</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Parameters</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd', minWidth: '80px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => {
                  const fields = getFieldsForType(row.type);
                  return (
                    <tr key={row.id} style={{ background: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
                        {row.id}
                      </td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        <select
                          value={row.type}
                          onChange={(e) => handleTypeChange(row.id, e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            cursor: 'pointer'
                          }}
                        >
                          {typeOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          {fields.map(field => (
                            <div key={field.key} style={{ display: 'flex', flexDirection: 'column', minWidth: '150px' }}>
                              <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                                {field.label}
                              </label>
                              <input
                                type={field.type}
                                value={row[field.key] || 0}
                                onChange={(e) => handleInputChange(row.id, field.key, parseFloat(e.target.value) || 0)}
                                style={{
                                  padding: '6px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                        <button
                          onClick={() => deleteRow(row.id)}
                          disabled={tableData.length === 1}
                          style={{
                            padding: '6px 12px',
                            background: tableData.length === 1 ? '#ccc' : '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: tableData.length === 1 ? 'not-allowed' : 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
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
                background: loading ? '#ccc' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.3s'
              }}
            >
              {loading ? 'Simulation läuft...' : 'Simulation starten'}
            </button>
          </div>
        </div>
      )}

      {/* Results Tab */}
      {activeTab === 'results' && (
        <div>
          <h2 style={{ color: '#555' }}>Simulationsergebnisse</h2>

          {results ? (
            <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginTop: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#4CAF50' }}>Ergebnis:</h3>
              <pre style={{ background: 'white', padding: '15px', borderRadius: '5px', overflow: 'auto', maxHeight: '600px' }}>
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          ) : (
            <div style={{ background: '#fff3cd', padding: '20px', borderRadius: '8px', marginTop: '20px', border: '1px solid #ffc107' }}>
              <p style={{ margin: 0, color: '#856404' }}>
                Noch keine Ergebnisse vorhanden. Bitte führe zuerst eine Simulation im PassDesign Tab aus.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;