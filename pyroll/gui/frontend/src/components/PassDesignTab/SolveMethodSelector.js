import React, { useState, useEffect, useMemo } from 'react';

const SolveMethodSelector = ({ value, onChange }) => {
  const [method, setMethod] = useState('solve');
  const [params, setParams] = useState({});

  const methods = useMemo(() => [
    { id: 'solve', label: 'Standard Solve', params: [] },
    {
      id: 'solve_forward',
      label: 'Forward Solve',
      params: [
        { key: 'in_velocity', label: 'Incoming Profile Velocity', defaultValue: 1.0, step: 0.1 }
      ]
    },
    {
      id: 'solve_backward',
      label: 'Backward Solve',
      params: [
        { key: 'out_cross_section', label: 'Finished Profile Area', defaultValue: 100.0, step: 1 },
        { key: 'out_velocity', label: 'Finished Profile Velocity', defaultValue: 2.0, step: 0.1 }
      ]
    }
  ], []);

  const currentMethod = useMemo(() =>
    methods.find(m => m.id === method),
    [methods, method]
  );

  // Initialize params when method changes
  useEffect(() => {
    const newParams = {};
    if (currentMethod && currentMethod.params) {
      currentMethod.params.forEach(param => {
        newParams[param.key] = param.defaultValue;
      });
    }
    setParams(newParams);
  }, [method, currentMethod]);

  // Notify parent of changes
  useEffect(() => {
    onChange({
      solve_method: method,
      solve_params: params
    });
  }, [method, params, onChange]);

  const handleInputChange = (key, value) => {
    setParams(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleInputBlur = (key, value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setParams(prev => ({
        ...prev,
        [key]: numValue
      }));
    } else {
      const param = currentMethod?.params.find(p => p.key === key);
      setParams(prev => ({
        ...prev,
        [key]: param?.defaultValue ?? 0
      }));
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
      {/* Method Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label style={{ fontWeight: 'bold', color: '#555', whiteSpace: 'nowrap' }}>
          Solve Method:
        </label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            background: 'white',
            cursor: 'pointer'
          }}
        >
          {methods.map(m => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic Parameter Fields */}
      {currentMethod?.params.map(param => (
        <div key={param.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ color: '#555', fontSize: '14px', whiteSpace: 'nowrap' }}>
            {param.label}:
          </label>
          <input
            type="text"
            value={params[param.key] ?? param.defaultValue}
            onChange={(e) => handleInputChange(param.key, e.target.value)}
            onBlur={(e) => handleInputBlur(param.key, e.target.value)}
            style={{
              width: '100px',
              padding: '6px 10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px'
            }}
            placeholder={String(param.defaultValue)}
          />
        </div>
      ))}
    </div>
  );
};

export default SolveMethodSelector;