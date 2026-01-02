import React from 'react';

export default function InProfileSaver({ inProfile, onNotification }) {
  const escapeXML = (text) => {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const generateXML = (profile) => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<InProfile>\n';
    xml += '  <Metadata>\n';
    xml += '    <Version>1.0</Version>\n';
    xml += `    <CreatedDate>${new Date().toISOString()}</CreatedDate>\n`;
    xml += '    <Application>PyRolL-Basic WebGUI</Application>\n';
    xml += '  </Metadata>\n';

    if (profile.profileType) {
      xml += `  <ProfileType>${escapeXML(profile.profileType)}</ProfileType>\n`;
    }

    if (profile.temperature !== undefined && profile.temperature !== null && profile.temperature !== '') {
      xml += `  <Temperature>${escapeXML(String(profile.temperature))}</Temperature>\n`;
    }

    if (profile.strain !== undefined && profile.strain !== null && profile.strain !== '') {
      xml += `  <Strain>${escapeXML(String(profile.strain))}</Strain>\n`;
    }

    if (profile.material) {
      xml += `  <Material>${escapeXML(profile.material)}</Material>\n`;
    }

    if (profile.flow_stress !== undefined && profile.flow_stress !== null && profile.flow_stress !== '') {
      xml += `  <FlowStress>${escapeXML(String(profile.flow_stress))}</FlowStress>\n`;
    }

    if (profile.density !== undefined && profile.density !== null && profile.density !== '') {
      xml += `  <Density>${escapeXML(String(profile.density))}</Density>\n`;
    }

    if (profile.thermal_capacity !== undefined && profile.thermal_capacity !== null && profile.thermal_capacity !== '') {
      xml += `  <ThermalCapacity>${escapeXML(String(profile.thermal_capacity))}</ThermalCapacity>\n`;
    }

    if (profile.specific_heat_capacity !== undefined && profile.specific_heat_capacity !== null && profile.specific_heat_capacity !== '') {
      xml += `  <SpecificHeatCapacity>${escapeXML(String(profile.specific_heat_capacity))}</SpecificHeatCapacity>\n`;
    }

    if (profile.thermal_conductivity !== undefined && profile.thermal_conductivity !== null && profile.thermal_conductivity !== '') {
      xml += `  <ThermalConductivity>${escapeXML(String(profile.thermal_conductivity))}</ThermalConductivity>\n`;
    }

    const geometryFields = ['width', 'height', 'diameter', 'corner_radius'];
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

  const handleExport = () => {
    try {
      if (!inProfile || Object.keys(inProfile).length === 0) {
        if (onNotification) {
          onNotification('No Input Profile data for export available.', 'error');
        }
        return;
      }

      const defaultName = `in-profile-${new Date().toISOString().slice(0, 10)}`;
      const fileName = prompt('File name for XML export:', defaultName);

      if (fileName === null) {
        return;
      }

      const finalFileName = fileName.trim() || defaultName;

      const fileNameWithExt = finalFileName.endsWith('.xml')
        ? finalFileName
        : `${finalFileName}.xml`;

      const xmlContent = generateXML(inProfile);

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