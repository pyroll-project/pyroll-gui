import React from 'react';
import {getGrooveFields} from '../../data/GrooveDefinitions';

export default function GrooveParametersBox({row, tableData, setTableData}) {
    const grooveFields = getGrooveFields(row.grooveType);

    const activeAdditionalGrooveParameterCount = (grooveFields.optional || []).filter(
        f => row.groove && row.groove[f.key] !== undefined
    ).length;

    const getValidationStatus = () => {
        if (!grooveFields.rule || !grooveFields.optional || grooveFields.optional.length === 0) {
            return {isValid: true, message: ''};
        }

        const rule = grooveFields.rule.toLowerCase();

        if (rule.includes('exactly two')) {
            return {
                isValid: activeAdditionalGrooveParameterCount === 2,
                message: activeAdditionalGrooveParameterCount === 2
                    ? '✓ Valid: Exactly two additional parameters selected'
                    : `⚠ ${activeAdditionalGrooveParameterCount} additional parameter(s) selected (need exactly two)`
            };
        }

        if (rule.includes('exactly one')) {
            return {
                isValid: activeAdditionalGrooveParameterCount === 1,
                message: activeAdditionalGrooveParameterCount === 1
                    ? '✓ Valid: Exactly one additional parameter selected'
                    : `⚠ ${activeAdditionalGrooveParameterCount} optional parameter(s) selected (need exactly one)`
            };
        }

        return {
            isValid: null,
            message: `Selected: ${activeAdditionalGrooveParameterCount} additional parameter(s)`
        };
    };

    const validation = getValidationStatus();

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
            {grooveFields.rule && (
                <div style={{marginBottom: '10px', fontSize: '13px', color: '#666', fontStyle: 'italic'}}>
                    {grooveFields.rule}
                </div>
            )}

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

            {grooveFields.optional && grooveFields.optional.length > 0 && (
                <>
                    <div style={{fontWeight: 'bold', marginBottom: '8px', color: '#333'}}>
                        Additional Parameters:
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

                    {validation.message && (
                        <div style={{
                            marginTop: '10px',
                            padding: '8px',
                            background: validation.isValid === true ? '#d4edda'
                                : validation.isValid === false ? '#f8d7da'
                                    : '#fff3cd',
                            borderRadius: '4px',
                            fontSize: '12px',
                            color: validation.isValid === true ? '#155724'
                                : validation.isValid === false ? '#721c24'
                                    : '#856404'
                        }}>
                            {validation.message}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}