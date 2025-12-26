import React from 'react';
import { getUnitForField } from '../../data/PassTypeDefinitions';
import { getGrooveFields } from '../../data/GrooveDefinitions';
import GrooveParametersBox from './GrooveParameterBox';
import RollPassPlot from './RollPassPlot';

export default function PassTypeFields({ row, fields, tableData, setTableData }) {
  const handleInputChange = (field, value) => {
    setTableData(prevData =>
      prevData.map(r =>
        r.id === row.id ? {...r, [field]: value} : r
      )
    );
  };

  const handleGrooveTypeChange = (newGrooveType) => {
    setTableData(prevData =>
      prevData.map(r => {
        if (r.id === row.id) {
          const grooveFields = getGrooveFields(newGrooveType);
          const newGroove = {};

          grooveFields.required.forEach(field => {
            newGroove[field.key] = field.default !== undefined ? field.default : 0;
          });

          return {...r, grooveType: newGrooveType, groove: newGroove};
        }
        return r;
      })
    );
  };

  const isRollPass = row.type === 'TwoRollPass' || row.type === 'ThreeRollPass';

  return (
    <div>
      <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
        {fields.map(field => {
          if (field.type === 'groove') {
            return (
              <GrooveParametersBox
                key={field.key}
                row={row}
                tableData={tableData}
                setTableData={setTableData}
              />
            );
          }

          return (
            <div key={field.key} style={{display: 'flex', flexDirection: 'column', minWidth: '150px'}}>
              <label style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>
                {field.label} {field.key === 'transportValue' || field.key === 'coolingValue' ? `(${getUnitForField(row, field)})` : ''}
              </label>
              {field.type === 'select' ? (
                <select
                  value={field.key === 'grooveType' ? row.grooveType : (row[field.key] || field.options[0])}
                  onChange={(e) => {
                    if (field.key === 'grooveType') {
                      handleGrooveTypeChange(e.target.value);
                    } else {
                      handleInputChange(field.key, e.target.value);
                    }
                  }}
                  style={{
                    padding: '6px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  {field.options.map(option => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={row[field.key] || 0}
                  onChange={(e) => handleInputChange(field.key, parseFloat(e.target.value) || 0)}
                  style={{
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

      {/* Roll Pass Visualization - nur für TwoRollPass und ThreeRollPass */}
      {isRollPass && <RollPassPlot row={row} />}
    </div>
  );
}