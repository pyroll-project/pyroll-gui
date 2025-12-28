import React from 'react';
import PassDesignRow from './PassDesignRow';


const typeOptions = ['TwoRollPass', 'ThreeRollPass', 'Transport', 'CoolingPipe'];

export default function PassDesignTable({tableData, setTableData}) {
    const deleteRow = (id) => {
        if (tableData.length > 1) {
            setTableData(tableData.filter(row => row.id !== id));
        }
    };

    return (
        <div style={{overflowX: 'auto'}}>
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                minWidth: '800px'
            }}>
                <thead>
                <tr style={{background: '#FFDD00', color: '#333'}}>
                    <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', minWidth: '150px'}}>
                        Unit
                    </th>
                    <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd'}}>
                        Parameters
                    </th>
                </tr>
                </thead>
                <tbody>
                {tableData.map((row, index) => (
                    <PassDesignRow
                        key={row.id}
                        row={row}
                        index={index}
                        typeOptions={typeOptions}
                        tableData={tableData}
                        setTableData={setTableData}
                        onDelete={() => deleteRow(row.id)}
                        canDelete={tableData.length > 1}
                    />
                ))}
                </tbody>
            </table>
        </div>
    );
}