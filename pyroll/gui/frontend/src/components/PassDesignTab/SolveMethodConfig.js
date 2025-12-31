import React, { useState, useEffect } from 'react';

const SolveMethodConfig = ({ value, onChange }) => {
  const [method, setMethod] = useState('solve');
  const [params, setParams] = useState({});

  const methods = [
    {
      id: 'solve',
      label: 'Standard',
      description: 'Standard Simulation',
      params: []
    },
    {
      id: 'solve_forward',
      label: 'Forward Velocity Simulation',
      description: 'Solves and calculates RollPass velocities from given initial velocity.',
      params: [
        {
          key: 'in_velocity',
          label: 'Initial Profile Velocity Simulation',
          type: 'number',
          min: 0,
          step: 0.1
        }
      ]
    },
    {
      id: 'solve_backward',
      label: 'Backward Velocity Simulation',
      description: 'Solves and calculates RollPass velocities from given final velocity and final area.',
      params: [
        {
          key: 'out_cross_section',
          label: 'Final Cross Section Area',
          type: 'number',
          min: 0,
          step: 1
        },
        {
          key: 'out_velocity',
          label: 'Final Profile Velocity',
          type: 'number',
          min: 0,
          step: 0.1
        }
      ]
    }
  ];

  const currentMethod = methods.find(m => m.id === method);

  useEffect(() => {
    const newParams = {};
    currentMethod?.params.forEach(param => {
      newParams[param.key] = params[param.key] || 0;
    });
    setParams(newParams);
  }, [method]);

  useEffect(() => {
    onChange({
      solve_method: method,
      solve_params: params
    });
  }, [method, params]);

  const handleParamChange = (key, value) => {
    setParams(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="solve-method-config card">
      <div className="card-body">
        <h6 className="card-title">Solve Methode</h6>

        <div className="mb-3">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="form-control"
          >
            {methods.map(m => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
          <small className="form-text text-muted">
            {currentMethod?.description}
          </small>
        </div>

        {currentMethod?.params.length > 0 && (
          <div className="method-params">
            <hr />
            <h6 className="text-muted">Parameter</h6>
            {currentMethod.params.map(param => (
              <div key={param.key} className="mb-3">
                <label className="form-label">
                  {param.label}
                  {param.unit && <span className="text-muted"> ({param.unit})</span>}
                </label>
                <input
                  type={param.type}
                  className="form-control"
                  value={params[param.key] || ''}
                  onChange={(e) => handleParamChange(param.key, e.target.value)}
                  min={param.min}
                  step={param.step}
                  placeholder={`z.B. ${param.step === 0.1 ? '1.5' : '100'}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SolveMethodConfig;