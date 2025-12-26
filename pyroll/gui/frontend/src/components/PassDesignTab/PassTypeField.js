import React from 'react';
import { getUnitForField } from '../../data/PassTypeDefinitions';
import { getGrooveFields } from '../../data/GrooveDefinitions';
import GrooveParametersBox from './GrooveParameterBox';
import RollPassPlot from './RollPassPlot';

// KORRIGIERTE Validierungsfunktion - erlaubt alle Zwischenschritte beim Tippen
const isValidNumberInput = (value) => {
  // Leere Eingabe erlauben
  if (value === '') {
    return true;
  }

  // Einzelne Zeichen erlauben
  if (value === '-' || value === '+' || value === '.') {
    return true;
  }

  // Pattern erlaubt unvollständige wissenschaftliche Notation
  // Das '?' nach \d am Ende macht die Ziffer nach +/- optional
  const pattern = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d*)?$/;

  return pattern.test(value);
};

// Hilfsfunktion zum Parsen - nur für onBlur
const parseNumberInput = (value) => {
  if (!value || value === '-' || value === '.' || value === '+') {
    return 0;
  }

  // Unvollständige Eingaben wie "100e" oder "100e-" abfangen
  if (value.endsWith('e') || value.endsWith('e-') || value.endsWith('e+') ||
      value.endsWith('E') || value.endsWith('E-') || value.endsWith('E+')) {
    return 0;
  }

  try {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  } catch (error) {
    return 0;
  }
};

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
              ) : field.type === 'number' ? (
                <input
                  type="text"
                  value={row[field.key] !== undefined && row[field.key] !== null ? row[field.key] : ''}
                  onChange={(e) => {
                    const inputValue = e.target.value;

                    // Validierung - erlaubt wissenschaftliche Notation während des Tippens
                    if (isValidNumberInput(inputValue)) {
                      handleInputChange(field.key, inputValue);
                    }
                  }}
                  onBlur={(e) => {
                    // Bei Blur: Konvertiere zu Nummer
                    const inputValue = e.target.value;
                    const numValue = parseNumberInput(inputValue);
                    handleInputChange(field.key, numValue);
                  }}
                  placeholder="z.B. 100e-3"
                  style={{
                    padding: '6px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              ) : (
                <input
                  type={field.type}
                  value={row[field.key] || ''}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
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

      {isRollPass && <RollPassPlot row={row} />}
    </div>
  );
}