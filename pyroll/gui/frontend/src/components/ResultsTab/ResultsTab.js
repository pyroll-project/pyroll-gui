import React, {useState, useRef} from 'react';
import ResultsTable from './ResultsTable';
import ResultCrossSectionPlot from './ResultCrossSectionPlot';
import ResultFillingRatioPlot from './ResultFillingRatioPlot';
import ResultStrainPlot from './ResultStrainPlot';
import ResultTemperaturePlot from "./ResultTemperaturePlot";
import ResultRollForcePlot from "./ResultRollForcePlot";
import ResultRollTorquePlot from "./ResultRollTorquePlot";
import {exportResultsTableAsCSV, exportPlotAsPNG} from '../../helpers/ResultsExport';

export default function ResultsTab({results}) {
    const [filename, setFilename] = useState('results');

    const crossSectionRef = useRef();
    const strainRef = useRef();
    const fillingRatioRef = useRef();
    const temperatureRef = useRef();
    const rollForceRef = useRef();
    const rollTorqueRef = useRef();

    const handleSaveResults = async () => {
        if (!results) {
            alert('No results to save');
            return;
        }

        exportResultsTableAsCSV(results, filename);

        const plots = [
            {ref: crossSectionRef, title: 'cross_section'},
            {ref: strainRef, title: 'strain'},
            {ref: fillingRatioRef, title: 'filling_ratio'},
            {ref: temperatureRef, title: 'temperature'},
            {ref: rollForceRef, title: 'roll_force'},
            {ref: rollTorqueRef, title: 'roll_torque'}
        ];

        for (const plot of plots) {
            if (plot.ref.current) {
                await exportPlotAsPNG(plot.ref.current, plot.title, filename);
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
    };

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
            }}>
                <h2 style={{color: '#555', margin: 0}}>Simulation Results</h2>

                {results && (
                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <input
                            type="text"
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                            placeholder="Filename"
                            style={{
                                padding: '8px 12px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                width: '200px'
                            }}
                        />
                        <button
                            onClick={handleSaveResults}
                            style={{
                                padding: '8px 16px',
                                background: '#FFDD00',
                                color: '#333',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 'bold'
                            }}
                        >
                            Save Results
                        </button>
                    </div>
                )}
            </div>

            {results ? (
                <div>
                    {/* Results Table */}
                    <ResultsTable results={results}/>

                    {/* Charts */}
                    <div ref={crossSectionRef}>
                        <ResultCrossSectionPlot results={results}/>
                    </div>
                    <div ref={strainRef}>
                        <ResultStrainPlot results={results}/>
                    </div>
                    <div ref={fillingRatioRef}>
                        <ResultFillingRatioPlot results={results}/>
                    </div>
                    <div ref={temperatureRef}>
                        <ResultTemperaturePlot results={results}/>
                    </div>
                    <div ref={rollForceRef}>
                        <ResultRollForcePlot results={results}/>
                    </div>
                    <div ref={rollTorqueRef}>
                        <ResultRollTorquePlot results={results}/>
                    </div>

                    {/* Raw Data */}
                    <div style={{
                        background: '#f9f9f9',
                        padding: '20px',
                        borderRadius: '8px',
                        marginTop: '20px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{color: '#FFDD00'}}>Raw Data:</h3>
                        <pre style={{
                            background: 'white',
                            padding: '15px',
                            borderRadius: '5px',
                            overflow: 'auto',
                            maxHeight: '600px',
                            fontSize: '14px',
                            lineHeight: '1.5'
                        }}>
              {JSON.stringify(results, null, 2)}
            </pre>
                    </div>
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
                        No Results available. Please run a simulation first in the Pass Design tab.
                    </p>
                </div>
            )}
        </div>
    );
}