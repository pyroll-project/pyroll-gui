import React from 'react';
import { getGrooveFields } from '../../data/GrooveDefinitions';

export default function GrooveParametersBox({ row, tableData, setTableData }) {
  const grooveFields = getGrooveFields(row.grooveType);

  const activeOptionalCount = grooveFields.optional.filter(
    f => row.groove && row.groove[f.key] !== undefined
  ).length;

  const handleGrooveParamChange = (paramKey, value) => {
    setTableData(prevData =>
      prevData.map(r => {
        if (r.id === row.id) {
          return {
            ...r,
            groove: {
              ...r.groove,
              [paramKey]: value
            }
          };
        }
        return r;
      })
    );
  };

  const toggleGrooveOptionalParam = (paramKey) => {
    setTableData(prevData =>
      prevData.map(r => {
        if (r.id === row.id) {
          const newGroove = {...r.groove};
          if (newGroove[paramKey] !== undefined) {
            delete newGroove[paramKey];
          } else {
            newGroove[paramKey] = 0;
          }
          return {...r, groove: newGroove};
        }
        return r;
      })
    );
  };

  return (
    <div style={{
      width: '100%',
      padding: '10px',
      background: '#f0f8ff',
      borderRadius: '8px',
      border: '1px solid #ccc'
    }}>
      <div style={{marginBottom: '10px', fontSize: '13px', color: '#666', fontStyle: 'italic'}}>
        {grooveFields.rule}
      </div>

      <div style={{fontWeight: 'bold', marginBottom: '8px', color: '#333'}}>
        Required Parameters:
      </div>
      <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px'}}>
        {grooveFields.required.map(gf => (
          <div key={gf.key} style={{minWidth: '140px'}}>
            <label style={{fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px'}}>
              {gf.label}
            </label>
            <input
              type="number"
              value={row.groove?.[gf.key] ?? (gf.default || 0)}
              onChange={(e) => handleGrooveParamChange(gf.key, parseFloat(e.target.value) || 0)}
              style={{
                width: '100%',
                padding: '6px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        ))}
      </div>

      <div style={{fontWeight: 'bold', marginBottom: '8px', color: '#333'}}>
        Optional Parameters:
      </div>
      <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
        {grooveFields.optional.map(gf => {
          const isActive = row.groove?.[gf.key] !== undefined;
          return (
            <div key={gf.key} style={{minWidth: '140px', opacity: isActive ? 1 : 0.6}}>
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => toggleGrooveOptionalParam(gf.key)}
                  style={{marginRight: '6px', cursor: 'pointer'}}
                />
                <label style={{fontSize: '12px', color: '#666', cursor: 'pointer'}}>
                  {gf.label}
                </label>
              </div>
              {isActive && (
                <input
                  type="number"
                  value={row.groove[gf.key] || 0}
                  onChange={(e) => handleGrooveParamChange(gf.key, parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: '10px',
        padding: '8px',
        background: activeOptionalCount === 2 ? '#d4edda' : '#f8d7da',
        borderRadius: '4px',
        fontSize: '12px',
        color: activeOptionalCount === 2 ? '#155724' : '#721c24'
      }}>
        {activeOptionalCount === 2
          ? '✓ Valid: Exactly 2 optional parameters selected'
          : `⚠ ${activeOptionalCount} optional parameter(s) selected (need exactly 2)`
        }
      </div>
    </div>
  );
}