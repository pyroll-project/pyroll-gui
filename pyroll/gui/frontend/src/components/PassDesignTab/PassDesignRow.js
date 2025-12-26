import React from 'react';
import { getFieldsForType } from '../../data/PassTypeDefinitions';
import PassTypeFields from './PassTypeField';

export default function PassDesignRow({
  row,
  index,
  typeOptions,
  tableData,
  setTableData,
  onDelete,
  canDelete
}) {
  const fields = getFieldsForType(row.type);

  const handleTypeChange = (newType) => {
    setTableData(prevData =>
      prevData.map(r => {
        if (r.id === row.id) {
          const newRow = {id: r.id, type: newType};

          if (newType === 'TwoRollPass') {
            newRow.gap = 0;
            newRow.nominal_radius = 0;
            newRow.velocity = 0;
            newRow.grooveType = 'BoxGroove';
            newRow.groove = {r1: 0, r2: 0, depth: 0, pad_angle: 0};
          } else if (newType === 'ThreeRollPass') {
            newRow.inscribed_circle_diameter = 0;
            newRow.nominal_radius = 0;
            newRow.velocity = 0;
            newRow.grooveType = 'RoundGroove';
            newRow.groove = {r1: 0, pad_angle: 0};
          } else if (newType === 'Transport') {
            newRow.transportDefineBy = 'length';
          } else if (newType === 'CoolingPipe') {
            newRow.coolingDefineBy = 'length';
          }
          return newRow;
        }
        return r;
      })
    );
  };

  return (
    <tr style={{background: index % 2 === 0 ? '#f9f9f9' : 'white'}}>
      <td style={{padding: '10px', borderBottom: '1px solid #ddd', fontWeight: 'bold'}}>
        {row.id}
      </td>
      <td style={{padding: '10px', borderBottom: '1px solid #ddd'}}>
        <select
          value={row.type}
          onChange={(e) => handleTypeChange(e.target.value)}
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
      <td style={{padding: '10px', borderBottom: '1px solid #ddd'}}>
        <PassTypeFields
          row={row}
          fields={fields}
          tableData={tableData}
          setTableData={setTableData}
        />
      </td>
      <td style={{padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center'}}>
        <button
          onClick={onDelete}
          disabled={!canDelete}
          style={{
            padding: '6px 12px',
            background: !canDelete ? '#ccc' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: !canDelete ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}