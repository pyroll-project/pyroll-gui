import React, {useState} from 'react';
import PassDesignTable from './PassDesignTable';
import PassDesignLoader from './PassDesignLoader';
import PassDesignSaver from './PassDesignSaver';
import Notification from '../../helpers/Notification';

export default function PassDesignTab({
                                          tableData,
                                          setTableData,
                                          loading,
                                          runSimulation
                                      }) {
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: 'success'
    });


    const showNotification = (message, type = 'success') => {
        setNotification({
            show: true,
            message,
            type
        });
    };


    const closeNotification = () => {
        setNotification({
            show: false,
            message: '',
            type: 'success'
        });
    };

    const addRow = () => {
        const newId = tableData.length > 0
            ? Math.max(...tableData.map(r => r.id)) + 1
            : 1;
    };

    return (
        <div>
            <Notification
                show={notification.show}
                message={notification.message}
                type={notification.type}
                onClose={closeNotification}
                duration={3000}
            />

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                flexWrap: 'wrap',
                gap: '10px'
            }}>
                <h2 style={{color: '#555', margin: 0}}>
                    Pass Design and Mill Layout
                </h2>

                <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                    <PassDesignLoader
                        setTableData={setTableData}
                        onNotification={showNotification}
                    />

                    <PassDesignSaver
                        tableData={tableData}
                        onNotification={showNotification}
                    />
                </div>
            </div>

            <PassDesignTable
                tableData={tableData}
                setTableData={setTableData}
            />

            <div style={{
                marginTop: '20px',
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                <button
                    onClick={addRow}
                    style={{
                        padding: '10px 20px',
                        background: '#FFDD00',
                        color: 'black',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'background 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#FFEE77'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#FFDD00'}
                >
                    Add Unit
                </button>

                <div style={{
                    width: '2px',
                    height: '40px',
                    background: '#ddd',
                    margin: '0 5px'
                }}/>

                <button
                    onClick={runSimulation}
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        background: loading ? '#ccc' : '#FFDD00',
                        color: loading ? '#666' : '#333',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'background 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                    onMouseOver={(e) => {
                        if (!loading) e.currentTarget.style.background = '#FFEE77';
                    }}
                    onMouseOut={(e) => {
                        if (!loading) e.currentTarget.style.background = '#FFDD00';
                    }}
                >
                    {loading ? (
                        <>
              <span style={{
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  border: '3px solid #666',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
              }}/>
                            Simulation running...
                        </>
                    ) : (
                        <>
                            <span>▶</span>
                            Start Simulation
                        </>
                    )}
                </button>
            </div>

            <div style={{
                marginTop: '20px',
                padding: '15px',
                background: '#f5f5f5',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '14px',
                color: '#666'
            }}>
                <strong style={{color: '#333'}}>Note:</strong> You can save and load a Pass Design from a XML file.
                The XML file contains all units with set parameters and groove definitions.
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `
            }}/>
        </div>
    );
}