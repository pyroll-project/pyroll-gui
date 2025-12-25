import React, {useState} from 'react';

function App() {
    const [activeTab, setActiveTab] = useState('inprofile');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

    const [inProfile, setInProfile] = useState({
        shape: 'round',
        diameter: 0,
        temperature: 1200,
        density: 7850,
        material: 'C45',
    });

    const [tableData, setTableData] = useState([
        {
            id: 1,
            type: 'TwoRollPass',
            label: 'Stand 1',
            gap: 0,
            nominal_radius: 0,
            velocity: 0,
            grooveType: 'BoxGroove',
            groove: {
                r1: 0,
                r2: 0,
                depth: 0,
                pad_angle: 0,
                ground_width: 0,
                usable_width: 0
            }
        }
    ]);

    const typeOptions = ['TwoRollPass', 'ThreeRollPass', 'Transport', 'CoolingPipe'];

    const getFieldsForType = (type) => {
        switch (type) {
            case 'TwoRollPass':
                return [
                    {key: 'label', label: 'Label', type: 'string'},
                    {key: 'gap', label: 'Gap', type: 'number'},
                    {key: 'nominal_radius', label: 'Nominal Radius', type: 'number'},
                    {key: 'velocity', label: 'Velocity', type: 'number'},
                    {key: 'coulomb_friction_coefficient', label: 'Coulomb Friction Coefficient', type: 'number'},
                    {
                        key: 'grooveType', label: 'Groove Type', type: 'select', options: [
                            'BoxGroove',
                            'ConstrictedBoxGroove',
                            'DiamondGroove',
                            'GothicGroove',
                            'SquareGroove',
                            'CircularOvalGroove',
                            'ConstrictedCircularOvalGroove',
                            'ConstrictedSwedishOvalGroove',
                            'FlatOvalGroove',
                            'Oval3RadiiGroove',
                            'Oval3RadiiFlankedGroove',
                            'SwedishOvalGroove',
                            'UpsetOvalGroove',
                            'RoundGroove',
                            'FalseRoundGroove'
                        ]
                    },
                    {key: 'groove', label: 'Groove Parameters', type: 'groove'},
                ];
            case 'ThreeRollPass':
                return [
                    {key: 'label', label: 'Label', type: 'string'},
                    {key: 'inscribed_circle_diameter', label: 'Inscribed Circle Diameter (ICD)', type: 'number'},
                    {key: 'nominal_radius', label: 'Nominal Radius', type: 'number'},
                    {key: 'velocity', label: 'Velocity', type: 'number'},
                    {key: 'coulomb_friction_coefficient', label: 'Coulob Friction Coefficient', type: 'number'},
                    {key: 'orientation', label: 'Orientation', type: 'string'},
                    {
                        key: 'grooveType', label: 'Groove Type', type: 'select', options: [
                            'CircularOvalGroove',
                            'RoundGroove',
                            'FalseRoundGroove'
                        ]
                    },
                    {key: 'groove', label: 'Groove Parameters', type: 'groove'},
                ];
            case 'Transport':
                return [
                    {key: 'label', label: 'Label', type: 'string'},
                    {key: 'transportDefineBy', label: 'Define by', type: 'select', options: ['length', 'duration']},
                    { key: 'transportValue', label: 'Value', type: 'number', unit: '' },
                    {key: 'environment_temperature', label: 'Environment Temperature', type: 'number'},
                    {key: 'heat_transfer_coefficient', label: 'Heat Transfer Coefficient', type: 'number'}
                ];
            case 'CoolingPipe':
                return [
                    {key: 'label', label: 'Label', type: 'string'},
                    {key: 'coolingDefineBy', label: 'Define by', type: 'select', options: ['length', 'duration']},
                    { key: 'coolingValue', label: 'Value', type: 'number', unit: '' },
                    {key: 'inner_radius', label: 'Inner Radius', type: 'number'},
                    {key: 'coolant_temperature', label: 'Coolant Temperature', type: 'number'},
                    {key: 'coolant_volume_flux', label: 'Coolant Volume Flux', type: 'number'},
                ];
            default:
                return [];
        }
    };

    const getGrooveFields = (grooveType) => {
        switch (grooveType) {
            case 'BoxGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {key: 'depth', label: 'Depth', tooltip: 'Maximum depth'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        },
                    ],
                    optional: [
                        {key: 'ground_width', label: 'Ground Width', tooltip: 'Width of the groove ground'},
                        {
                            key: 'even_ground_width',
                            label: 'Even Ground Width',
                            tooltip: 'Width of the even ground line'
                        },
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the groove'},
                        {key: 'flank_angle', label: 'Flank Angle', tooltip: 'Inclination angle of the flanks'},
                    ],
                    rule: 'Exactly 2 of the Optional Parameters must be set (not Ground Width and Even Ground Width together)'
                };
            case 'ConstrictedBoxGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {key: 'r4', label: 'R4', tooltip: 'Radius 4 (indent)'},
                        {key: 'depth', label: 'Depth', tooltip: 'Maximum depth'},
                        {key: 'indent', label: 'Indent', tooltip: 'Indentation depth'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        },
                    ],
                    optional: [
                        {key: 'ground_width', label: 'Ground Width', tooltip: 'Width of the groove ground'},
                        {
                            key: 'even_ground_width',
                            label: 'Even Ground Width',
                            tooltip: 'Width of the even ground'
                        },
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the groove'},
                        {key: 'flank_angle', label: 'Flank Angle', tooltip: 'Inclination angle of the flanks'},
                    ],
                    rule: 'Exactly 2 of the Optional Parameters must be set (not Ground Width and Even Ground Width together)'
                };
            case 'DiamondGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        }
                    ],
                    optional: [
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the groove'},
                        {
                            key: 'tip_depth',
                            label: 'Tip Depth',
                            tooltip: 'Depth of the intersection of the extrapolated flanks'
                        },
                        {key: 'tip_angle', label: 'Tip Angle', tooltip: 'Angle between the flanks'},
                    ],
                    rule: 'Exactly two of Usable Width, Tip Depth and Tip Angle must be given.'
                };
            case 'GothicGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {key: 'r3', label: 'R3', tooltip: 'Radius 3 (ground)'},
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the groove'},
                        {key: 'depth', label: 'Depth', tooltip: 'Maximum depth'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        }
                    ],
                optional: [],
                    rule: ''
                };
            case 'SquareGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        }
                    ],
                    optional: [
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the groove'},
                        {
                            key: 'tip_depth',
                            label: 'Tip Depth',
                            tooltip: 'Depth of the intersection of the extrapolated flanks'
                        },
                        {key: 'tip_angle', label: 'Tip Angle', tooltip: 'Angle between the flanks'},
                    ],
                    rule: 'Exactly two of Usable Width, Tip Depth and Tip Angle must be given. Tip angle is <85° or >95° (no matter if given or calculated internally)'
                };
            case 'CircularOvalGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        }
                    ],
                    optional: [
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the groove'},
                        {key: 'depth', label: 'Depth', tooltip: 'Maximum depth'},
                    ],
                    rule: 'Exactly two of R2, Usable Width and Depth must be given.'
                };
            case 'ConstrictedCircularOvalGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {key: 'r3', label: 'R3', tooltip: 'Radius 3 (ground)'},
                        {key: 'r4', label: 'R4', tooltip: 'Radius 4 (indent)'},
                        {key: 'depth', label: 'Depth', tooltip: 'Maximum depth'},
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the groove'},
                        {key: 'even_ground_width',  label: 'Even Ground Width', tooltip: 'Width of the even ground'},
                        {key: 'indent', label: 'Indent', tooltip: 'Indentation depth'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        },
                    ],
                    optional: [],
                    rule: ''
                };
            case 'ConstrictedSwedishOvalGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {key: 'r4', label: 'R4', tooltip: 'Radius 4 (indent)'},
                        {key: 'depth', label: 'Depth', tooltip: 'Maximum depth'},
                        {key: 'indent', label: 'Indent', tooltip: 'Indentation depth'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        },
                    ],
                    optional: [
                        {key: 'ground_width', label: 'Ground Width', tooltip: 'Width of the groove ground'},
                        {
                            key: 'even_ground_width',
                            label: 'Even Ground Width',
                            tooltip: 'Width of the even ground'
                        },
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the groove'},
                        {key: 'flank_angle', label: 'Flank Angle', tooltip: 'Inclination angle of the flanks'},
                    ],
                    rule: 'Exactly 2 of the Optional Parameters must be set (not Ground Width and Even Ground Width together)'
                };
            case 'FlatOvalGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {key: 'depth', label: 'Depth', tooltip: 'Maximum depth'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        },
                    ],
                    optional: [
                        {
                            key: 'even_ground_width',
                            label: 'Even Ground Width',
                            tooltip: 'Width of the even ground'
                        },
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the groove'},
                    ],
                    rule: 'Exactly one of the Optional Parameters must be set'
                };
            case 'Oval3RadiiGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {key: 'r3', label: 'R3', tooltip: 'Radius 3 (ground)'},
                        {key: 'depth', label: 'Depth', tooltip: 'Maximum depth'},
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the groove'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        },
                    ],
                    optional: [],
                    rule: ''
                };
            case 'Oval3RadiiFlankedGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {key: 'r3', label: 'R3', tooltip: 'Radius 3 (ground)'},
                        {key: 'depth', label: 'Depth', tooltip: 'Maximum depth'},
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the groove'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        },
                    ],
                    optional: [
                        {key: 'flank_angle', label: 'Flank Angle',tooltip: 'Inclination angle of the flanks'},
                        {key: 'flank_width', label: 'Flank Width',tooltip: 'Horizontal extent of the flanks'},
                        {key: 'flank_height', label: 'Flank Height',tooltip: 'Vertical extent of the flanks'},
                        {key: 'flank_length', label: 'Flank Length',tooltip: 'Length of the flanks'},
                    ],
                    rule: ''
                };
            case 'SwedishOvalGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {key: 'depth', label: 'Depth', tooltip: 'Maximum depth'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        },
                    ],
                    optional: [
                        {key: 'ground_width', label: 'Ground Width', tooltip: 'Width of the groove ground'},
                        {key: 'even_ground_width', label: 'Even Ground Width', tooltip: 'Width of the even ground'},
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the groove'},
                        {key: 'flank_angle', label: 'Flank Angle', tooltip: 'Inclination angle of the flanks'},
                    ],
                    rule: 'Exactly one of the Optional Parameters must be set (not Ground Width and Even Ground Width together)'
                };
            case 'UpsetOvalGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {key: 'r3', label: 'R3', tooltip: 'Radius 3 (ground)'},
                        {key: 'depth', label: 'Depth', tooltip: 'Maximum depth'},
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the groove'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        },
                    ],
                    optional: [],
                    rule: ''
                };
            case 'RoundGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        },
                    ],
                    optional: [
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {key: 'depth', label: 'Depth', tooltip: 'Maximum depth'},
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width'},
                    ],
                    rule: 'Exactly two of the Optional Parameters must be set'
                };
            case 'FalseRoundGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        },
                    ],
                    optional: [
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {key: 'depth', label: 'Depth', tooltip: 'Maximum depth'},
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width'},
                        {key: 'flank_angle', label: 'Flank Angle',tooltip: 'Inclination angle of the flanks'},
                        {key: 'flank_width', label: 'Flank Width',tooltip: 'Horizontal extent of the flanks'},
                        {key: 'flank_height', label: 'Flank Height',tooltip: 'Vertical extent of the flanks'},
                        {key: 'flank_length', label: 'Flank Length',tooltip: 'Length of the flanks'},
                    ],
                    rule: 'Exactly two of R2, Depth or Usable Width must be set. Exactly one of Flank Angle, Width, Height or Length must be set.'
                };
            default:
                return {required: [], optional: [], rule: ''};
        }
    };

    const handleTypeChange = (id, newType) => {
        setTableData(prevData =>
            prevData.map(row => {
                if (row.id === id) {
                    const newRow = {id: row.id, type: newType};

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
                return row;
            })
        );
    };

    const handleGrooveTypeChange = (id, newGrooveType) => {
        setTableData(prevData =>
            prevData.map(row => {
                if (row.id === id) {
                    const grooveFields = getGrooveFields(newGrooveType);
                    const newGroove = {};

                    grooveFields.required.forEach(field => {
                        newGroove[field.key] = field.default !== undefined ? field.default : 0;
                    });

                    return {...row, grooveType: newGrooveType, groove: newGroove};
                }
                return row;
            })
        );
    };

    const handleGrooveParamChange = (id, paramKey, value) => {
        setTableData(prevData =>
            prevData.map(row => {
                if (row.id === id) {
                    return {
                        ...row,
                        groove: {
                            ...row.groove,
                            [paramKey]: value
                        }
                    };
                }
                return row;
            })
        );
    };

    const toggleGrooveOptionalParam = (id, paramKey) => {
        setTableData(prevData =>
            prevData.map(row => {
                if (row.id === id) {
                    const newGroove = {...row.groove};
                    if (newGroove[paramKey] !== undefined) {
                        delete newGroove[paramKey];
                    } else {
                        newGroove[paramKey] = 0;
                    }
                    return {...row, groove: newGroove};
                }
                return row;
            })
        );
    };

    const handleInputChange = (id, field, value) => {
        setTableData(prevData =>
            prevData.map(row =>
                row.id === id ? {...row, [field]: value} : row
            )
        );
    };

    const addRow = () => {
        const newId = Math.max(...tableData.map(r => r.id)) + 1;
        setTableData([...tableData, {
            id: newId,
            type: 'TwoRollPass',
            gap: 0,
            nominal_radius: 0,
            velocity: 0,
            grooveType: 'BoxGroove',
            groove: {r1: 0, r2: 0, depth: 0, pad_angle: 0}
        }]);
    };

    const getUnitForField = (row, field) => {
        if (row.type === 'Transport' && field.key === 'transportValue') {
            return row.transportDefineBy === 'length' ? 'mm' : 's';
        }
        if (row.type === 'CoolingPipe' && field.key === 'coolingValue') {
            return row.coolingDefineBy === 'length' ? 'mm' : '°C/s';
        }
        return '';
    };

    const deleteRow = (id) => {
        if (tableData.length > 1) {
            setTableData(tableData.filter(row => row.id !== id));
        }
    };

    const runSimulation = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/simulate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    passDesignData: tableData
                })
            });

            if (!response.ok) {
                throw new Error('Simulation Failed');
            }

            const data = await response.json();
            setResults(data);
            setActiveTab('results');
        } catch (error) {
            console.error('Error:', error);
            alert('Simulation Failed. Check if Backend is running.');
        }
        setLoading(false);
    };

    return (
        <div style={{fontFamily: 'Arial, sans-serif', maxWidth: '1400px', margin: '0 auto', padding: '20px'}}>
            <h1 style={{color: '#333', borderBottom: '3px solid #4CAF50', paddingBottom: '10px'}}>
                PyRoll Simulation
            </h1>

            {/* Tab Navigation */}
            <div style={{display: 'flex', borderBottom: '2px solid #ddd', marginBottom: '20px'}}>
                <button
                    onClick={() => setActiveTab('inprofile')}
                    style={{
                        padding: '12px 24px',
                        border: 'none',
                        background: activeTab === 'inprofile' ? '#4CAF50' : '#f1f1f1',
                        color: activeTab === 'inprofile' ? 'white' : '#333',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        borderRadius: '5px 5px 0 0',
                        marginRight: '5px',
                        transition: 'background 0.3s'
                    }}
                >
                    In Profile
                </button>
                <button
                    onClick={() => setActiveTab('passdesign')}
                    style={{
                        padding: '12px 24px',
                        border: 'none',
                        background: activeTab === 'passdesign' ? '#4CAF50' : '#f1f1f1',
                        color: activeTab === 'passdesign' ? 'white' : '#333',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        borderRadius: '5px 5px 0 0',
                        marginRight: '5px',
                        transition: 'background 0.3s'
                    }}
                >
                    Pass Design
                </button>
                <button
                    onClick={() => setActiveTab('results')}
                    style={{
                        padding: '12px 24px',
                        border: 'none',
                        background: activeTab === 'results' ? '#4CAF50' : '#f1f1f1',
                        color: activeTab === 'results' ? 'white' : '#333',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        borderRadius: '5px 5px 0 0',
                        transition: 'background 0.3s'
                    }}
                >
                    Results
                </button>
            </div>

           {/* In Profile Tab */}
            {activeTab === 'inprofile' && (
                <div>
                    <h2 style={{color: '#555'}}>Initial Profile Configuration</h2>

                    <div style={{overflowX: 'auto'}}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            marginTop: '20px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}>
                            <thead>
                            <tr style={{background: '#2196F3', color: 'white'}}>
                                <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', minWidth: '150px'}}>Shape</th>
                                <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd'}}>Parameters</th>
                                <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', minWidth: '150px'}}>Temperature (°C)</th>
                                <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', minWidth: '150px'}}>Density (kg/m³)</th>
                                <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', minWidth: '150px'}}>Material</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr style={{background: '#f9f9f9'}}>
                                <td style={{padding: '10px', borderBottom: '1px solid #ddd'}}>
                                    <select
                                        value={inProfile.shape}
                                        onChange={(e) => setInProfile({...inProfile, shape: e.target.value})}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            fontSize: '14px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="round">Round</option>
                                        <option value="square">Square</option>
                                        <option value="box">Box</option>
                                        <option value="hexagon">Hexagon</option>
                                    </select>
                                </td>
                                <td style={{padding: '10px', borderBottom: '1px solid #ddd'}}>
                                    <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                                        {inProfile.shape === 'round' && (
                                            <div style={{minWidth: '150px'}}>
                                                <label style={{fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px'}}>
                                                    Diameter (mm)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={inProfile.diameter || 0}
                                                    onChange={(e) => setInProfile({...inProfile, diameter: parseFloat(e.target.value) || 0})}
                                                    style={{
                                                        width: '100%',
                                                        padding: '8px',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        fontSize: '14px'
                                                    }}
                                                />
                                            </div>
                                        )}
                                        {inProfile.shape === 'square' && (
                                            <>
                                                <div style={{minWidth: '150px'}}>
                                                    <label style={{fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px'}}>
                                                        Side (mm)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={inProfile.side || 0}
                                                        onChange={(e) => setInProfile({...inProfile, side: parseFloat(e.target.value) || 0})}
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px',
                                                            border: '1px solid #ddd',
                                                            borderRadius: '4px',
                                                            fontSize: '14px'
                                                        }}
                                                    />
                                                </div>
                                                <div style={{minWidth: '150px'}}>
                                                    <label style={{fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px'}}>
                                                        Corner Radius (mm)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={inProfile.corner_radius || 0}
                                                        onChange={(e) => setInProfile({...inProfile, corner_radius: parseFloat(e.target.value) || 0})}
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px',
                                                            border: '1px solid #ddd',
                                                            borderRadius: '4px',
                                                            fontSize: '14px'
                                                        }}
                                                    />
                                                </div>
                                            </>
                                        )}
                                        {inProfile.shape === 'box' && (
                                            <>
                                                <div style={{minWidth: '150px'}}>
                                                    <label style={{fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px'}}>
                                                        Height (mm)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={inProfile.height || 0}
                                                        onChange={(e) => setInProfile({...inProfile, height: parseFloat(e.target.value) || 0})}
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px',
                                                            border: '1px solid #ddd',
                                                            borderRadius: '4px',
                                                            fontSize: '14px'
                                                        }}
                                                    />
                                                </div>
                                                <div style={{minWidth: '150px'}}>
                                                    <label style={{fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px'}}>
                                                        Width (mm)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={inProfile.width || 0}
                                                        onChange={(e) => setInProfile({...inProfile, width: parseFloat(e.target.value) || 0})}
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px',
                                                            border: '1px solid #ddd',
                                                            borderRadius: '4px',
                                                            fontSize: '14px'
                                                        }}
                                                    />
                                                </div>
                                                <div style={{minWidth: '150px'}}>
                                                    <label style={{fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px'}}>
                                                        Corner Radius (mm)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={inProfile.corner_radius || 0}
                                                        onChange={(e) => setInProfile({...inProfile, corner_radius: parseFloat(e.target.value) || 0})}
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px',
                                                            border: '1px solid #ddd',
                                                            borderRadius: '4px',
                                                            fontSize: '14px'
                                                        }}
                                                    />
                                                </div>
                                            </>
                                        )}
                                        {inProfile.shape === 'hexagon' && (
                                            <>
                                                <div style={{minWidth: '150px'}}>
                                                    <label style={{fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px'}}>
                                                        Side (mm)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={inProfile.side || 0}
                                                        onChange={(e) => setInProfile({...inProfile, side: parseFloat(e.target.value) || 0})}
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px',
                                                            border: '1px solid #ddd',
                                                            borderRadius: '4px',
                                                            fontSize: '14px'
                                                        }}
                                                    />
                                                </div>
                                                <div style={{minWidth: '150px'}}>
                                                    <label style={{fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px'}}>
                                                        Corner Radius (mm)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={inProfile.corner_radius || 0}
                                                        onChange={(e) => setInProfile({...inProfile, corner_radius: parseFloat(e.target.value) || 0})}
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px',
                                                            border: '1px solid #ddd',
                                                            borderRadius: '4px',
                                                            fontSize: '14px'
                                                        }}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td style={{padding: '10px', borderBottom: '1px solid #ddd'}}>
                                    <input
                                        type="number"
                                        value={inProfile.temperature}
                                        onChange={(e) => setInProfile({...inProfile, temperature: parseFloat(e.target.value) || 0})}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            fontSize: '14px'
                                        }}
                                    />
                                </td>
                                <td style={{padding: '10px', borderBottom: '1px solid #ddd'}}>
                                    <input
                                        type="number"
                                        value={inProfile.density}
                                        onChange={(e) => setInProfile({...inProfile, density: parseFloat(e.target.value) || 0})}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            fontSize: '14px'
                                        }}
                                    />
                                </td>
                                <td style={{padding: '10px', borderBottom: '1px solid #ddd'}}>
                                    <input
                                        type="text"
                                        value={inProfile.material}
                                        onChange={(e) => setInProfile({...inProfile, material: e.target.value})}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            fontSize: '14px'
                                        }}
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* PassDesign Tab */}
            {activeTab === 'passdesign' && (
                <div>
                    <h2 style={{color: '#555'}}>Pass Design Configuration and Mill Layout</h2>

                    <div style={{overflowX: 'auto'}}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            marginTop: '20px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            minWidth: '800px'
                        }}>
                            <thead>
                            <tr style={{background: '#4CAF50', color: 'white'}}>
                                <th style={{
                                    padding: '12px',
                                    textAlign: 'left',
                                    borderBottom: '2px solid #ddd',
                                    minWidth: '60px'
                                }}>Unit Nr.
                                </th>
                                <th style={{
                                    padding: '12px',
                                    textAlign: 'left',
                                    borderBottom: '2px solid #ddd',
                                    minWidth: '150px'
                                }}>Type
                                </th>
                                <th style={{
                                    padding: '12px',
                                    textAlign: 'left',
                                    borderBottom: '2px solid #ddd'
                                }}>Parameters
                                </th>
                                <th style={{
                                    padding: '12px',
                                    textAlign: 'center',
                                    borderBottom: '2px solid #ddd',
                                    minWidth: '80px'
                                }}>Action
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {tableData.map((row, index) => {
                                const fields = getFieldsForType(row.type);
                                return (
                                    <tr key={row.id} style={{background: index % 2 === 0 ? '#f9f9f9' : 'white'}}>
                                        <td style={{
                                            padding: '10px',
                                            borderBottom: '1px solid #ddd',
                                            fontWeight: 'bold'
                                        }}>
                                            {row.id}
                                        </td>
                                        <td style={{padding: '10px', borderBottom: '1px solid #ddd'}}>
                                            <select
                                                value={row.type}
                                                onChange={(e) => handleTypeChange(row.id, e.target.value)}
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
                                            <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                                                {fields.map(field => {
                                                    if (field.type === 'groove') {
                                                        const grooveFields = getGrooveFields(row.grooveType);
                                                        const activeOptionalCount = grooveFields.optional.filter(
                                                            f => row.groove && row.groove[f.key] !== undefined
                                                        ).length;

                                                        return (
                                                            <div key={field.key} style={{
                                                                width: '100%',
                                                                padding: '10px',
                                                                background: '#f0f8ff',
                                                                borderRadius: '8px',
                                                                border: '1px solid #ccc'
                                                            }}>
                                                                <div style={{
                                                                    marginBottom: '10px',
                                                                    fontSize: '13px',
                                                                    color: '#666',
                                                                    fontStyle: 'italic'
                                                                }}>
                                                                    {grooveFields.rule}
                                                                </div>

                                                                <div style={{
                                                                    fontWeight: 'bold',
                                                                    marginBottom: '8px',
                                                                    color: '#333'
                                                                }}>
                                                                    Required Parameters:
                                                                </div>
                                                                <div style={{
                                                                    display: 'flex',
                                                                    gap: '10px',
                                                                    flexWrap: 'wrap',
                                                                    marginBottom: '15px'
                                                                }}>
                                                                    {grooveFields.required.map(gf => (
                                                                        <div key={gf.key} style={{minWidth: '140px'}}>
                                                                            <label style={{
                                                                                fontSize: '12px',
                                                                                color: '#666',
                                                                                display: 'block',
                                                                                marginBottom: '4px'
                                                                            }}>
                                                                                {gf.label}
                                                                            </label>
                                                                            <input
                                                                                type="number"
                                                                                value={row.groove?.[gf.key] ?? (gf.default || 0)}
                                                                                onChange={(e) => handleGrooveParamChange(row.id, gf.key, parseFloat(e.target.value) || 0)}
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

                                                                <div style={{
                                                                    fontWeight: 'bold',
                                                                    marginBottom: '8px',
                                                                    color: '#333'
                                                                }}>
                                                                    Optional Parameters:
                                                                </div>
                                                                <div style={{
                                                                    display: 'flex',
                                                                    gap: '10px',
                                                                    flexWrap: 'wrap'
                                                                }}>
                                                                    {grooveFields.optional.map(gf => {
                                                                        const isActive = row.groove?.[gf.key] !== undefined;
                                                                        return (
                                                                            <div key={gf.key} style={{
                                                                                minWidth: '140px',
                                                                                opacity: isActive ? 1 : 0.6
                                                                            }}>
                                                                                <div style={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    marginBottom: '4px'
                                                                                }}>
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={isActive}
                                                                                        onChange={() => toggleGrooveOptionalParam(row.id, gf.key)}
                                                                                        style={{
                                                                                            marginRight: '6px',
                                                                                            cursor: 'pointer'
                                                                                        }}
                                                                                    />
                                                                                    <label style={{
                                                                                        fontSize: '12px',
                                                                                        color: '#666',
                                                                                        cursor: 'pointer'
                                                                                    }}>
                                                                                        {gf.label}
                                                                                    </label>
                                                                                </div>
                                                                                {isActive && (
                                                                                    <input
                                                                                        type="number"
                                                                                        value={row.groove[gf.key] || 0}
                                                                                        onChange={(e) => handleGrooveParamChange(row.id, gf.key, parseFloat(e.target.value) || 0)}
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

                                                    return (
                                                        <div key={field.key} style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            minWidth: '150px'
                                                        }}>
                                                            <label style={{
                                                                fontSize: '12px',
                                                                color: '#666',
                                                                marginBottom: '4px'
                                                            }}>
                                                                {field.label} {field.key === 'transportValue' || field.key === 'coolingValue' ? `(${getUnitForField(row, field)})` : ''}
                                                            </label>
                                                            {field.type === 'select' ? (
                                                                <select
                                                                    value={field.key === 'grooveType' ? row.grooveType : (row[field.key] || field.options[0])}
                                                                    onChange={(e) => {
                                                                        if (field.key === 'grooveType') {
                                                                            handleGrooveTypeChange(row.id, e.target.value);
                                                                        } else {
                                                                            handleInputChange(row.id, field.key, e.target.value);
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
                                                                    onChange={(e) => handleInputChange(row.id, field.key, parseFloat(e.target.value) || 0)}
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
                                        </td>
                                        <td style={{
                                            padding: '10px',
                                            borderBottom: '1px solid #ddd',
                                            textAlign: 'center'
                                        }}>
                                            <button
                                                onClick={() => deleteRow(row.id)}
                                                disabled={tableData.length === 1}
                                                style={{
                                                    padding: '6px 12px',
                                                    background: tableData.length === 1 ? '#ccc' : '#f44336',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: tableData.length === 1 ? 'not-allowed' : 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>

                    <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                        <button
                            onClick={addRow}
                            style={{
                                padding: '10px 20px',
                                background: '#2196F3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'background 0.3s'
                            }}
                        >
                            + Add Unit
                        </button>

                        <button
                            onClick={runSimulation}
                            disabled={loading}
                            style={{
                                padding: '12px 32px',
                                background: loading ? '#ccc' : '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'background 0.3s'
                            }}
                        >
                            {loading ? 'Simulation running' : 'Start Simulation'}
                        </button>
                    </div>
                </div>
            )}

            {/* Results Tab */}
            {activeTab === 'results' && (
                <div>
                    <h2 style={{color: '#555'}}>Simulation Results</h2>

                    {results ? (
                        <div style={{
                            background: '#f9f9f9',
                            padding: '20px',
                            borderRadius: '8px',
                            marginTop: '20px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <h3 style={{color: '#4CAF50'}}>Result:</h3>
                            <pre style={{
                                background: 'white',
                                padding: '15px',
                                borderRadius: '5px',
                                overflow: 'auto',
                                maxHeight: '600px'
                            }}>
                {JSON.stringify(results, null, 2)}
              </pre>
                        </div>
                    ) : (
                        <div style={{
                            background: '#fff3cd',
                            padding: '20px',
                            borderRadius: '8px',
                            marginTop: '20px',
                            border: '1px solid #ffc107'
                        }}>
                            <p style={{margin: 0, color: '#856404'}}>
                                No Results ready. Run Simulation.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;