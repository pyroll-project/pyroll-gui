import React, {useState} from 'react';
import InProfileTab from './components/InProfileTab/InProfileTab';
import PassDesignTab from './components/PassDesignTab/PassDesignTab';
import ResultsTab from './components/ResultsTab/ResultsTab';
import PassSequenceVisualizationTab from './components/PassSequenceVisualizationTab/PassSequenceVisualizationTab';
import {runSimulation} from './utils/api';

function App() {
    const [activeTab, setActiveTab] = useState('inprofile');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

    const [solveConfig, setSolveConfig] = useState({
        solve_method: 'solve',
        solve_params: {}
    });

    // Initial Profile State
    const [inProfile, setInProfile] = useState({
        shape: 'round',
        diameter: 0,
        temperature: 1200,
        density: 0,
        specific_heat_capacity: 0,
        thermal_conductivity: 0,
        pre_strain: 0,
        material: 'C45',
        materialType: '',
        flowStressParams: {
            a: 0,
            m1: 0,
            m2: 0,
            m3: 0,
            m4: 0,
            m5: 0,
            m6: 0,
            m7: 0,
            m8: 0,
            m9: 0,
            baseStrain: 0.1,
            baseStrainRate: 0.1
        }
    });

    // Pass Design State
    const [tableData, setTableData] = useState([
        {
            id: 1,
            type: 'TwoRollPass',
            label: 'Stand 1',
            gap: 0,
            nominal_radius: 0,
            velocity: 0,
            coulomb_friction_coefficient: 0,
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

    console.log('Current solveConfig:', solveConfig);


    const handleRunSimulation = async () => {
        setLoading(true);

        const result = await runSimulation(inProfile, tableData, solveConfig);

        if (result.success) {
            setResults(result.data);
            setActiveTab('results');
        } else {
            alert(`Simulation Failed: ${result.error}\nCheck if Backend is running.`);
        }

        setLoading(false);
    };

    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '20px'
        }}>
            <h1 style={{
                color: '#333',
                borderBottom: '3px solid #FFDD00',
                paddingBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}>
                <svg
                    version="1.1"
                    width="40"
                    height="40"
                    viewBox="0 0 210.8 210.877"
                    style={{flexShrink: 0}}
                >
                    <g transform="translate(-141.65831,-27.428261)">
                        <path
                            style={{fill: '#ffffff', fillOpacity: 1, stroke: '#ffffff', strokeWidth: 3.77953}}
                            d="m 215.26858,75.661123 c -23.06596,29.823367 -19.85232,70.017267 -12.35039,105.453737 -4.98032,0.86805 -11.34738,2.06028 -21.25973,9.68851 l 15.58899,88.40958 93.96451,-16.56848 c 1.18787,-20.49722 -0.56621,-42.19292 -5.81139,-65.04744 -1.38521,-6.03558 -1.021,-11.55619 3.07775,-15.19696 7.41408,-6.58566 17.46781,-14.55994 23.04182,-27.52084 21.51417,-4.09863 45.21805,-3.33513 64.85042,0.19096 -12.92857,-7.46334 -26.8312,-19.39321 -51.50921,-18.19919 24.10905,-1.91792 38.62987,6.33498 60.6369,17.33742 C 373.91154,130.90772 345.3281,119.5681 320.45218,112.05653 310.23719,45.650945 232.94263,52.809271 215.26858,75.661123 Z"
                            transform="rotate(10,414.98637,-49.079111)"
                        />
                    </g>
                    <g transform="translate(-185.53868,-5.6956442)">
                        <g transform="rotate(10,199.68807,227.2766)">
                            <path
                                style={{fill: '#ffdd00', fillOpacity: 1}}
                                d="m 186.40835,217.74132 10.8391,61.47163 93.96451,-16.56848 c 1.18787,-20.49724 -0.5662,-42.1929 -5.81139,-65.04744 -1.38521,-6.03559 -1.02101,-11.55618 3.07775,-15.19696 7.41408,-6.58566 17.4678,-14.55993 23.04182,-27.52084 l 8.93204,-42.8227 C 310.44781,47.020087 233.86329,51.618897 215.26858,75.661123 191.63088,106.22375 195.57831,147.69136 203.47086,183.7543 c -4.8448,8.12929 -10.6784,19.80683 -17.06251,33.98702 z"
                                transform="translate(-11.819628,-62.209889)"
                            />
                            <path
                                style={{fill: '#d4691e'}}
                                d="m 320.45169,112.05625 c -2.91466,11.38637 -8.1639,19.56889 -19.08754,28.56489 5.2456,3.3297 8.63951,7.95743 10.1555,14.25781 21.51419,-4.09864 45.21803,-3.33514 64.85042,0.19096 -12.92858,-7.46335 -26.83127,-19.39187 -51.5093,-18.19785 24.10907,-1.91792 38.62995,6.33363 60.63701,17.33608 -11.58673,-23.30073 -40.17014,-34.64032 -65.04609,-42.15189 z"
                                transform="translate(-11.819629,-62.209889)"
                            />
                            <path
                                style={{fill: '#1a1a1a', fillOpacity: 1}}
                                d="m 326.54611,120.04225 c 1.73906,-1.73936 4.51945,-1.56299 6.2114,0.38552 l 0.52187,0.5952 -0.62023,0.6217 c -1.69149,1.68523 -4.39651,1.51966 -6.04136,-0.36894 l -0.60116,-0.69819 z"
                                transform="translate(-11.819629,-62.209889)"
                            />
                            <path
                                style={{fill: '#1a1a1a', fillOpacity: 1}}
                                d="m 271.41169,87.912335 c -10.12501,0.263686 -22.26354,15.262175 -32.71061,18.714515 -1.97454,0.65249 -2.19154,4.51285 0,5.16015 11.09415,3.27676 25.85719,18.35703 37.2118,15.78144 22.80167,-5.17217 25.28444,-7.04001 39.5037,-2.77143 2.37271,-1.42937 7.43616,-11.30287 5.06345,-12.73221 -20.21561,-3.76888 -34.13472,-24.541389 -49.06834,-24.152465 z"
                                transform="translate(-11.819629,-62.209889)"
                            />
                            <ellipse
                                style={{fill: '#d4691e', fillOpacity: 1}}
                                cx="262.07318"
                                cy="131.59364"
                                rx="14"
                                ry="16"
                                transform="rotate(-5,-718.33017,104.25206)"
                            />
                            <ellipse
                                style={{fill: '#000000', fillOpacity: 1}}
                                cx="262.07318"
                                cy="131.59364"
                                rx="10"
                                ry="12"
                                transform="rotate(-5,-718.33017,104.25206)"
                            />
                            <ellipse
                                style={{fill: '#ffffff'}}
                                cx="237.37843"
                                cy="175.65837"
                                rx="3.87"
                                ry="4.21"
                                transform="rotate(-15,-242.17532,13.784553)"
                            />
                            <path
                                style={{fill: '#1a1a1a', fillOpacity: 1}}
                                d="m 181.65846,190.80337 15.58899,88.40958 74.04331,-13.05584 c 4.32758,-15.2772 5.12095,-30.11965 1.10961,-44.05137 -9.28437,-32.24539 -42.24236,-48.4186 -75.15176,-39.77303 -5.02834,1.32099 -10.24487,4.35711 -15.59015,8.47066 z"
                                transform="translate(-11.819629,-62.209889)"
                            />
                        </g>
                    </g>
                </svg>
                PyRolL Basic WebGUI - Beta
            </h1>

            {/* Tab Navigation */}
            <div style={{
                display: 'flex',
                borderBottom: '2px solid #ddd',
                marginBottom: '20px'
            }}>
                <button
                    onClick={() => setActiveTab('inprofile')}
                    style={{
                        padding: '12px 24px',
                        border: 'none',
                        background: activeTab === 'inprofile' ? '#FFDD00' : '#f1f1f1',
                        color: '#333',
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
                        background: activeTab === 'passdesign' ? '#FFDD00' : '#f1f1f1',
                        color: '#333',
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
                        background: activeTab === 'results' ? '#FFDD00' : '#f1f1f1',
                        color: '#333',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        borderRadius: '5px 5px 0 0',
                        transition: 'background 0.3s'
                    }}
                >
                    Results
                </button>
                <button
                    onClick={() => setActiveTab('visualization')}
                    style={{
                        padding: '12px 24px',
                        border: 'none',
                        background: activeTab === 'visualization' ? '#FFDD00' : '#f1f1f1',
                        color: '#333',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        borderRadius: '5px 5px 0 0',
                        marginLeft: '5px',
                        transition: 'background 0.3s'
                    }}
                >
                    Result Visualization
                </button>
            </div>

            {activeTab === 'inprofile' && (
                <InProfileTab
                    inProfile={inProfile}
                    setInProfile={setInProfile}
                />
            )}

            {activeTab === 'passdesign' && (
                <PassDesignTab
                    tableData={tableData}
                    setTableData={setTableData}
                    loading={loading}
                    runSimulation={handleRunSimulation}
                    solveConfig={solveConfig}
                    setSolveConfig={setSolveConfig}
                />
            )}
            {activeTab === 'results' && (
                <ResultsTab results={results}/>
            )}

            {activeTab === 'visualization' && (
                <PassSequenceVisualizationTab
                    passSequence={tableData}
                    simulationResults={results}
                />
            )}
        </div>
    );
}

export default App;