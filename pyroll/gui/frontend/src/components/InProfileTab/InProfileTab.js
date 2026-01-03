import React, {useState, useEffect} from "react";
import RoundProfile from "./InProfiles/RoundProfile";
import SquareProfile from "./InProfiles/SquareProfile";
import BoxProfile from "./InProfiles/BoxProfile";
import HexagonProfile from "./InProfiles/HexagonProfile";
import CommonParameters from "./InProfiles/CommonParameters";
import ProfilePlot from './InProfilePlot';
import InProfileLoader from './Functionality/InProfileLoader';
import InProfileSaver from './Functionality/InProfileSaver';
import Notification from '../../helpers/Notification';

export default function InProfileTab({inProfile, setInProfile}) {

    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: 'success'
    });

    // Initialize with defaults if null
    useEffect(() => {
        if (!inProfile) {
            setInProfile({
                shape: 'round',
                diameter: 0,
                temperature: 1200,
                strain: 0,
                material: 'C45',
                density: 0,
                specific_heat_capacity: 0,
                thermal_conductivity: 0
            });
        }
    }, [inProfile, setInProfile]);

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

    // Early return wenn inProfile noch null ist - VOR dem JSX!
    if (!inProfile) {
        return (
            <div style={{padding: '20px', textAlign: 'center', color: '#666'}}>
                Loading profile...
            </div>
        );
    }

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
                <h2 style={{color: '#555', margin: 0}}>Initial Profile Configuration</h2>

                <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                    <InProfileLoader
                        setInProfile={setInProfile}
                        onNotification={showNotification}
                    />

                    <InProfileSaver
                        inProfile={inProfile}
                        onNotification={showNotification}
                    />
                </div>
            </div>

            <div style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'flex-start',
                flexWrap: 'wrap'
            }}>
                <div style={{flex: '1 1 500px', minWidth: '400px'}}>
                    <div style={{
                        borderCollapse: 'collapse',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        background: 'white',
                        borderRadius: '4px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            background: '#FFDD00',
                            color: 'black',
                            padding: '12px',
                            fontWeight: 'bold',
                            borderBottom: '2px solid #ddd'
                        }}>
                            Profile Configuration
                        </div>
                        <div style={{padding: '20px'}}>
                            <div style={{marginBottom: '20px'}}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: 'bold',
                                    color: '#555'
                                }}>
                                    Type
                                </label>
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
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '12px',
                                    fontWeight: 'bold',
                                    color: '#555'
                                }}>
                                    Parameters
                                </label>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                                    {inProfile.shape === 'round' && (
                                        <RoundProfile inProfile={inProfile} setInProfile={setInProfile}/>
                                    )}
                                    {inProfile.shape === 'square' && (
                                        <SquareProfile inProfile={inProfile} setInProfile={setInProfile}/>
                                    )}
                                    {inProfile.shape === 'box' && (
                                        <BoxProfile inProfile={inProfile} setInProfile={setInProfile}/>
                                    )}
                                    {inProfile.shape === 'hexagon' && (
                                        <HexagonProfile inProfile={inProfile} setInProfile={setInProfile}/>
                                    )}
                                    <CommonParameters inProfile={inProfile} setInProfile={setInProfile}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{flex: '1 1 400px', minWidth: '350px'}}>
                    <ProfilePlot inProfile={inProfile}/>
                </div>
            </div>
        </div>
    );
}