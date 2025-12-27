/**
 * InProfileSaver.js
 * Komponente für den Export von Input-Profilen als XML-Datei
 */

import React from 'react';

export default function InProfileSaver({ inProfile, onNotification }) {
  /**
   * Escaped XML-Sonderzeichen für sichere XML-Generierung
   */
  const escapeXML = (text) => {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  /**
   * Generiert Groove-Parameter XML
   */
  const generateGrooveXML = (groove, indent = '    ') => {
    if (!groove || typeof groove !== 'object') return '';

    let xml = `${indent}<Groove>\n`;
    Object.keys(groove).forEach(key => {
      const value = groove[key];
      if (value !== undefined && value !== null && value !== '') {
        xml += `${indent}  <${escapeXML(key)}>${escapeXML(String(value))}</${escapeXML(key)}>\n`;
      }
    });
    xml += `${indent}</Groove>\n`;
    return xml;
  };

  /**
   * Generiert vollständiges XML aus inProfile
   */
  const generateXML = (profile) => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<InProfile>\n';
    xml += '  <Metadata>\n';
    xml += '    <Version>1.0</Version>\n';
    xml += `    <CreatedDate>${new Date().toISOString()}</CreatedDate>\n`;
    xml += '    <Application>PyRolL WebGUI</Application>\n';
    xml += '  </Metadata>\n';

    // Profile Type
    if (profile.profileType) {
      xml += `  <ProfileType>${escapeXML(profile.profileType)}</ProfileType>\n`;
    }

    // Temperature
    if (profile.temperature !== undefined && profile.temperature !== null && profile.temperature !== '') {
      xml += `  <Temperature>${escapeXML(String(profile.temperature))}</Temperature>\n`;
    }

    // Strain
    if (profile.strain !== undefined && profile.strain !== null && profile.strain !== '') {
      xml += `  <Strain>${escapeXML(String(profile.strain))}</Strain>\n`;
    }

    // Material
    if (profile.material) {
      xml += `  <Material>${escapeXML(profile.material)}</Material>\n`;
    }

    // Flow Stress
    if (profile.flow_stress !== undefined && profile.flow_stress !== null && profile.flow_stress !== '') {
      xml += `  <FlowStress>${escapeXML(String(profile.flow_stress))}</FlowStress>\n`;
    }

    // Density
    if (profile.density !== undefined && profile.density !== null && profile.density !== '') {
      xml += `  <Density>${escapeXML(String(profile.density))}</Density>\n`;
    }

    // Thermal Capacity
    if (profile.thermal_capacity !== undefined && profile.thermal_capacity !== null && profile.thermal_capacity !== '') {
      xml += `  <ThermalCapacity>${escapeXML(String(profile.thermal_capacity))}</ThermalCapacity>\n`;
    }

    // Groove Type (falls vorhanden)
    if (profile.grooveType) {
      xml += `  <GrooveType>${escapeXML(profile.grooveType)}</GrooveType>\n`;
    }

    // Groove (falls vorhanden)
    if (profile.groove) {
      xml += generateGrooveXML(profile.groove, '  ');
    }

    // Geometry-spezifische Parameter
    const geometryFields = ['width', 'height', 'diameter', 'corner_radius', 'fillet_radius'];
    const hasGeometry = geometryFields.some(field =>
      profile[field] !== undefined && profile[field] !== null && profile[field] !== ''
    );

    if (hasGeometry) {
      xml += '  <Geometry>\n';
      geometryFields.forEach(field => {
        const value = profile[field];
        if (value !== undefined && value !== null && value !== '') {
          const fieldName = field.split('_').map((word, i) =>
            i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word.charAt(0).toUpperCase() + word.slice(1)
          ).join('');
          xml += `    <${fieldName}>${escapeXML(String(value))}</${fieldName}>\n`;
        }
      });
      xml += '  </Geometry>\n';
    }

    xml += '</InProfile>';

    return xml;
  };

  /**
   * Exportiert inProfile als XML-Datei
   */
  const handleExport = () => {
    try {
      if (!inProfile || Object.keys(inProfile).length === 0) {
        if (onNotification) {
          onNotification('No Input Profile data for export available.', 'error');
        }
        return;
      }

      // Frage nach Dateinamen
      const defaultName = `in-profile-${new Date().toISOString().slice(0, 10)}`;
      const fileName = prompt('File name for XML export:', defaultName);

      // Abbruch wenn Dialog geschlossen wurde
      if (fileName === null) {
        return;
      }

      // Verwende Default wenn leer
      const finalFileName = fileName.trim() || defaultName;

      // Stelle sicher dass .xml Endung vorhanden ist
      const fileNameWithExt = finalFileName.endsWith('.xml')
        ? finalFileName
        : `${finalFileName}.xml`;

      const xmlContent = generateXML(inProfile);

      // XML-Datei erstellen und herunterladen
      const blob = new Blob([xmlContent], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileNameWithExt;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (onNotification) {
        onNotification(`Input Profile saved as "${fileNameWithExt}".`, 'success');
      }
    } catch (error) {
      console.error('Export error:', error);
      if (onNotification) {
        onNotification('Error during exporting: ' + error.message, 'error');
      }
    }
  };

  return (
    <button
      onClick={handleExport}
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
      title="Save Input Profile as XML."
    >
      Save as XML
    </button>
  );
}