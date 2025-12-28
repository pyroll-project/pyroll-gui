import React from 'react';

export default function ResultsTable({results}) {
    console.log('ResultsTable called with:', results);

    if (!results || !results.passes) {
        console.log('No results or passes found');
        return null;
    }

    // Filter only RollPass units (TwoRollPass and ThreeRollPass)
    const rollPasses = results.passes.filter(pass =>
        pass.type === 'TwoRollPass' || pass.type === 'ThreeRollPass'
    );

    console.log('Roll passes found:', rollPasses.length, rollPasses);

    if (rollPasses.length === 0) {
        console.log('No roll passes to display');
        return null;
    }

    const formatNumber = (value) => {
        if (value === null || value === undefined) return '-';
        if (typeof value === 'number') {
            return value.toFixed(4);
        }
        return value;
    };

    const getArrayValue = (value) => {
        if (Array.isArray(value)) return value[0];
        return value;
    };

    return (
        <div style={{marginBottom: '30px', overflowX: 'auto'}}>
            <h3 style={{marginBottom: '15px'}}>Roll Pass Results</h3>
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <thead>
                <tr style={{backgroundColor: '#FFDD00'}}>
                    <th style={headerStyleYellow}>Parameter</th>
                    {rollPasses.map((pass, index) => (
                        <th key={index} style={headerStyleYellow}>{pass.label || `Pass ${pass.pass}`}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                <tr style={{backgroundColor: 'white'}}>
                    <td style={labelStyleYellow}>Gap</td>
                    {rollPasses.map((pass, index) => (
                        <td key={index} style={cellStyle}>{formatNumber(pass.gap)}</td>
                    ))}
                </tr>
                <tr style={{backgroundColor: '#f9f9f9'}}>
                    <td style={labelStyleYellow}>Bar Height</td>
                    {rollPasses.map((pass, index) => (
                        <td key={index} style={cellStyle}>{formatNumber(pass.out_height)}</td>
                    ))}
                </tr>
                <tr style={{backgroundColor: 'white'}}>
                    <td style={labelStyleYellow}>Bar Width</td>
                    {rollPasses.map((pass, index) => (
                        <td key={index} style={cellStyle}>{formatNumber(pass.out_width)}</td>
                    ))}
                </tr>
                <tr style={{backgroundColor: '#f9f9f9'}}>
                    <td style={labelStyleYellow}>Bar Area</td>
                    {rollPasses.map((pass, index) => (
                        <td key={index} style={cellStyle}>{formatNumber(pass.out_cross_section_area)}</td>
                    ))}
                </tr>
                <tr style={{backgroundColor: 'white'}}>
                    <td style={labelStyleYellow}>Reduction</td>
                    {rollPasses.map((pass, index) => (
                        <td key={index} style={cellStyle}>{formatNumber(pass.reduction * -1 * 100)}</td>
                    ))}
                </tr>
                <tr style={{backgroundColor: '#f9f9f9'}}>
                    <td style={labelStyleYellow}>Roll Diameter</td>
                    {rollPasses.map((pass, index) => (
                        <td key={index} style={cellStyle}>{formatNumber(getArrayValue(pass.nominal_radius))}</td>
                    ))}
                </tr>
                <tr style={{backgroundColor: 'white'}}>
                    <td style={labelStyleYellow}>Working Diameter</td>
                    {rollPasses.map((pass, index) => (
                        <td key={index} style={cellStyle}>{formatNumber(pass.working_radius)}</td>
                    ))}
                </tr>
                <tr style={{backgroundColor: '#f9f9f9'}}>
                    <td style={labelStyleYellow}>Entry Temperature</td>
                    {rollPasses.map((pass, index) => (
                        <td key={index} style={cellStyle}>{formatNumber(pass.in_temperature)}</td>
                    ))}
                </tr>
                <tr style={{backgroundColor: '#f9f9f9'}}>
                    <td style={labelStyleYellow}>Bite Angle</td>
                    {rollPasses.map((pass, index) => (
                        <td key={index} style={cellStyle}>{formatNumber(pass.bite_angle * 100)}</td>
                    ))}
                </tr>
                <tr style={{backgroundColor: 'white'}}>
                    <td style={labelStyleYellow}>Roll Force</td>
                    {rollPasses.map((pass, index) => (
                        <td key={index} style={cellStyle}>{formatNumber(getArrayValue(pass.roll_force))}</td>
                    ))}
                </tr>
                <tr style={{backgroundColor: '#f9f9f9'}}>
                    <td style={labelStyleYellow}>Roll Torque</td>
                    {rollPasses.map((pass, index) => (
                        <td key={index} style={cellStyle}>{formatNumber(getArrayValue(pass.roll_torque))}</td>
                    ))}
                </tr>
                <tr style={{backgroundColor: 'white'}}>
                    <td style={labelStyleYellow}>Power</td>
                    {rollPasses.map((pass, index) => (
                        <td key={index} style={cellStyle}>{formatNumber(pass.power)}</td>
                    ))}
                </tr>
                <tr style={{backgroundColor: '#f9f9f9'}}>
                    <td style={labelStyleYellow}>Flow Stress</td>
                    {rollPasses.map((pass, index) => (
                        <td key={index} style={cellStyle}>{formatNumber(pass.out_flow_stress)}</td>
                    ))}
                </tr>
                <tr style={{backgroundColor: 'white'}}>
                    <td style={labelStyleYellow}>Filling Ratio</td>
                    {rollPasses.map((pass, index) => (
                        <td key={index} style={cellStyle}>{formatNumber(pass.filling_ratio)}</td>
                    ))}
                </tr>
                </tbody>
            </table>
        </div>
    );
}

const headerStyleYellow = {
    padding: '12px 8px',
    textAlign: 'center',
    borderBottom: '2px solid #ddd',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    backgroundColor: '#FFDD00'
};

const labelStyleYellow = {
    padding: '10px 8px',
    borderBottom: '1px solid #eee',
    textAlign: 'left',
    fontWeight: '600',
    backgroundColor: '#FFDD00'
};

const cellStyle = {
    padding: '10px 8px',
    borderBottom: '1px solid #eee',
    textAlign: 'center'
};