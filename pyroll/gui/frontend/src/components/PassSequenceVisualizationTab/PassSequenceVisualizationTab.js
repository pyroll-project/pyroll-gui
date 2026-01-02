import React, {useState, useEffect} from 'react';
import PassSequenceVisualizer from './PassSequenceVisualizer';

const PassSequenceVisualizationTab = ({passSequence, simulationResults}) => {
    const [selectedPassIndex, setSelectedPassIndex] = useState(0);

 ;
    const availablePasses = passSequence?.filter(item =>
        item.type === 'TwoRollPass' || item.type === 'ThreeRollPass'
    ) || [];

    useEffect(() => {
        if (selectedPassIndex >= availablePasses.length && availablePasses.length > 0) {
            setSelectedPassIndex(0);
        }
    }, [availablePasses.length, selectedPassIndex]);

    if (!simulationResults) {
        return (
            <div className="pass-sequence-visualization-tab">
                <div className="empty-state">
                    <p>No simulation results available</p>
                    <p>Please run a simulation in the Pass Design tab first.</p>
                </div>
            </div>
        );
    }

    if (availablePasses.length === 0) {
        return (
            <div className="pass-sequence-visualization-tab">
                <div className="empty-state">
                    <p>No passes defined in the sequence.</p>
                    <p>Please add at least one pass in the Pass Design tab.</p>
                </div>
            </div>
        );
    }

    const currentPass = availablePasses[selectedPassIndex];
    const currentResults = simulationResults?.passes?.find(p => p.label === currentPass.label && (p.type === 'TwoRollPass' || p.type === 'ThreeRollPass'));

    console.log('currentPass:', currentPass);
    console.log('currentResults:', currentResults);

    return (
        <div className="pass-sequence-visualization-tab">
            <div className="tab-header">
                <h2>Pass Sequence Visualization</h2>
                <div className="pass-selector">
                    <label>Select Pass: </label>
                    <select
                        value={selectedPassIndex}
                        onChange={(e) => setSelectedPassIndex(parseInt(e.target.value))}
                    >
                        {availablePasses.map((pass, index) => (
                            <option key={index} value={index}>
                                Pass {index + 1} ({pass.type})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <PassSequenceVisualizer
                pass={currentPass}
                results={currentResults}
            />
        </div>
    );
};

export default PassSequenceVisualizationTab;