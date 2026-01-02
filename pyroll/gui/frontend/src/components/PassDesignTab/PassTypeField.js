import React, {useState} from 'react';
import {getGrooveFields} from '../../data/GrooveDefinitions';
import {parseNumberInput} from '../../helpers/DataConverter';
import GrooveParametersBox from './GrooveParameterBox';
import RollPassPlot from './RollPassPlot';

const isValidNumberInput = (value) => {
    if (value === '') {
        return true;
    }

    if (value === '-' || value === '+' || value === '.') {
        return true;
    }

    const pattern = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d*)?$/;

    return pattern.test(value);
};


export default function PassTypeFields({row, fields, tableData, setTableData}) {
    const [isGrooveExpanded, setIsGrooveExpanded] = useState(true);
    const [isPlotExpanded, setIsPlotExpanded] = useState(true);

    const handleInputChange = (field, value) => {
        setTableData(prevData =>
            prevData.map(r => {
                if (r.id === row.id) {
                    const newRow = {...r, [field]: value};

                    const fieldObj = fields.find(f => f.key === field);
                    if (fieldObj?.mutuallyExclusive && value !== '' && value !== 0 && value !== null) {
                        delete newRow[fieldObj.mutuallyExclusive];
                    }

                    return newRow;
                }
                return r;
            })
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
                            <div key={field.key} style={{width: '100%'}}>
                                <div
                                    onClick={() => setIsGrooveExpanded(!isGrooveExpanded)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 12px',
                                        background: '#f5f5f5',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        marginBottom: isGrooveExpanded ? '10px' : '0',
                                        userSelect: 'none',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#ebebeb'}
                                    onMouseOut={(e) => e.currentTarget.style.background = '#f5f5f5'}
                                >
                  <span style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      transition: 'transform 0.2s',
                      transform: isGrooveExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      display: 'inline-block'
                  }}>
                    ▶
                  </span>
                                    <span style={{fontWeight: 'bold', fontSize: '14px'}}>
                    Groove Parameters
                  </span>
                                </div>
                                {isGrooveExpanded && (
                                    <GrooveParametersBox
                                        row={row}
                                        tableData={tableData}
                                        setTableData={setTableData}
                                    />
                                )}
                            </div>
                        );
                    }

                    const isDisabled = field.mutuallyExclusive &&
                                     row[field.mutuallyExclusive] !== undefined &&
                                     row[field.mutuallyExclusive] !== null &&
                                     row[field.mutuallyExclusive] !== '' &&
                                     row[field.mutuallyExclusive] !== 0;

                    return (
                        <div key={field.key} style={{display: 'flex', flexDirection: 'column', minWidth: '150px'}}>
                            <label style={{
                                fontSize: '12px',
                                color: isDisabled ? '#999' : '#666',
                                marginBottom: '4px'
                            }}>
                                {field.label}
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
                                    disabled={isDisabled}
                                    style={{
                                        padding: '6px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                                        opacity: isDisabled ? 0.5 : 1,
                                        background: isDisabled ? '#f5f5f5' : 'white'
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

                                        if (isValidNumberInput(inputValue)) {
                                            handleInputChange(field.key, inputValue);
                                        }
                                    }}
                                    onBlur={(e) => {
                                        const inputValue = e.target.value;
                                        const numValue = parseNumberInput(inputValue);
                                        handleInputChange(field.key, numValue);
                                    }}
                                    disabled={isDisabled}
                                    placeholder=""
                                    style={{
                                        padding: '6px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        cursor: isDisabled ? 'not-allowed' : 'text',
                                        opacity: isDisabled ? 0.5 : 1,
                                        background: isDisabled ? '#f5f5f5' : 'white'
                                    }}
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    value={row[field.key] || ''}
                                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                                    disabled={isDisabled}
                                    style={{
                                        padding: '6px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        cursor: isDisabled ? 'not-allowed' : 'text',
                                        opacity: isDisabled ? 0.5 : 1,
                                        background: isDisabled ? '#f5f5f5' : 'white'
                                    }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {isRollPass && (
                <div style={{marginTop: '20px', width: '100%'}}>
                    <div
                        onClick={() => setIsPlotExpanded(!isPlotExpanded)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            background: '#f5f5f5',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginBottom: isPlotExpanded ? '10px' : '0',
                            userSelect: 'none',
                            transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#ebebeb'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#f5f5f5'}
                    >
            <span style={{
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'transform 0.2s',
                transform: isPlotExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                display: 'inline-block'
            }}>
              ▶
            </span>
                        <span style={{fontWeight: 'bold', fontSize: '14px'}}>
              Roll Pass Visualization
            </span>
                    </div>
                    {isPlotExpanded && <RollPassPlot row={row}/>}
                </div>
            )}
        </div>
    );
}