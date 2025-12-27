import React, { useState } from "react";
import RoundProfile from "./RoundProfile";
import SquareProfile from "./SquareProfile";
import BoxProfile from "./BoxProfile";
import HexagonProfile from "./HexagonProfile";
import CommonParameters from "./CommonParameters";
import ProfilePlot from './InProfilePlot';
import InProfileLoader from './InProfileLoader';
import InProfileSaver from './InProfileSaver';
import Notification from '../../helpers/Notification';

export default function InProfileTab({ inProfile, setInProfile }) {
  // Notification State
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  /**
   * Zeigt eine Benachrichtigung an
   */
  const showNotification = (message, type = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });
  };

  /**
   * Schließt die Benachrichtigung
   */
  const closeNotification = () => {
    setNotification({
      show: false,
      message: '',
      type: 'success'
    });
  };

  return (
    <div>
      {/* Notification */}
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
        duration={3000}
      />

      {/* Header mit Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h2 style={{ color: '#555', margin: 0 }}>Initial Profile Configuration</h2>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {/* XML Loader */}
          <InProfileLoader
            setInProfile={setInProfile}
            onNotification={showNotification}
          />

          {/* XML Saver */}
          <InProfileSaver
            inProfile={inProfile}
            onNotification={showNotification}
          />
        </div>
      </div>

      <div style={{overflowX: 'auto'}}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <thead>
            <tr style={{background: '#FFDD00', color: 'black'}}>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', minWidth: '150px'}}>Type</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd'}}>Parameters</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{background: '#f9f9f9'}}>
              <td style={{padding: '10px', borderBottom: '1px solid #ddd', verticalAlign: 'top'}}>
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
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  {inProfile.shape === 'round' && (
                    <RoundProfile inProfile={inProfile} setInProfile={setInProfile} />
                  )}
                  {inProfile.shape === 'square' && (
                    <SquareProfile inProfile={inProfile} setInProfile={setInProfile} />
                  )}
                  {inProfile.shape === 'box' && (
                    <BoxProfile inProfile={inProfile} setInProfile={setInProfile} />
                  )}
                  {inProfile.shape === 'hexagon' && (
                    <HexagonProfile inProfile={inProfile} setInProfile={setInProfile} />
                  )}

                  {/* Common parameters for all shapes */}
                  <CommonParameters inProfile={inProfile} setInProfile={setInProfile} />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Profile Plot */}
      <ProfilePlot inProfile={inProfile} />
    </div>
  );
}