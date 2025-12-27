/**
 * InProfileLoader.js
 * Komponente für den Import von Input-Profilen aus XML-Dateien
 */

import React, { useRef } from 'react';

export default function InProfileLoader({ setInProfile, onNotification }) {
  const fileInputRef = useRef(null);

  /**
   * Hilfsfunktion zum sicheren Parsen von numerischen Werten
   */
  const parseNumericValue = (value) => {
    if (value === undefined || value === null || value === '') {
      return '';
    }

    const numValue = Number(value);
    return !isNaN(numValue) ? numValue : value;
  };

  /**
   * Extrahiert Text-Inhalt eines XML-Elements
   */
  const getElementText = (parent, tagName) => {
    const element = parent.getElementsByTagName(tagName)[0];
    return element ? element.textContent : '';
  };

  /**
   * Parsed Groove-Daten aus XML
   */
  const parseGrooveFromXML = (xmlDoc) => {
    const grooveElement = xmlDoc.getElementsByTagName('Groove')[0];
    if (!grooveElement) return null;

    const groove = {};
    const grooveChildren = grooveElement.children;

    for (let i = 0; i < grooveChildren.length; i++) {
      const child = grooveChildren[i];
      const key = child.tagName;
      const value = parseNumericValue(child.textContent);
      // Nur hinzufügen wenn Wert vorhanden
      if (value !== '' && value !== null && value !== undefined) {
        groove[key] = value;
      }
    }

    return Object.keys(groove).length > 0 ? groove : null;
  };

  /**
   * Parsed Geometry-Daten aus XML
   */
  const parseGeometryFromXML = (xmlDoc) => {
    const geometryElement = xmlDoc.getElementsByTagName('Geometry')[0];
    if (!geometryElement) return {};

    const geometry = {};
    const geometryChildren = geometryElement.children;

    for (let i = 0; i < geometryChildren.length; i++) {
      const child = geometryChildren[i];
      // Konvertiere CamelCase zurück zu snake_case
      const key = child.tagName.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
      const value = parseNumericValue(child.textContent);

      // Nur hinzufügen wenn Wert vorhanden
      if (value !== '' && value !== null && value !== undefined) {
        geometry[key] = value;
      }
    }

    return geometry;
  };

  /**
   * Parsed komplette XML-Datei zu inProfile-Format
   */
  const parseXML = (xmlDoc) => {
    const profile = {};

    // Profile Type
    const profileType = getElementText(xmlDoc, 'ProfileType');
    if (profileType) profile.profileType = profileType;

    // Temperature
    const temperature = getElementText(xmlDoc, 'Temperature');
    if (temperature) profile.temperature = parseNumericValue(temperature);

    // Strain
    const strain = getElementText(xmlDoc, 'Strain');
    if (strain) profile.strain = parseNumericValue(strain);

    // Material
    const material = getElementText(xmlDoc, 'Material');
    if (material) profile.material = material;

    // Flow Stress
    const flowStress = getElementText(xmlDoc, 'FlowStress');
    if (flowStress) profile.flow_stress = parseNumericValue(flowStress);

    // Density
    const density = getElementText(xmlDoc, 'Density');
    if (density) profile.density = parseNumericValue(density);

    // Thermal Capacity
    const thermalCapacity = getElementText(xmlDoc, 'ThermalCapacity');
    if (thermalCapacity) profile.thermal_capacity = parseNumericValue(thermalCapacity);

    // Groove Type
    const grooveType = getElementText(xmlDoc, 'GrooveType');
    if (grooveType) profile.grooveType = grooveType;

    // Groove
    const groove = parseGrooveFromXML(xmlDoc);
    if (groove) profile.groove = groove;

    // Geometry
    const geometry = parseGeometryFromXML(xmlDoc);
    Object.assign(profile, geometry);

    return profile;
  };

  /**
   * Validiert die XML-Struktur
   */
  const validateXML = (xmlDoc) => {
    // Prüfe auf Parser-Fehler
    if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
      throw new Error("Invalid XML format");
    }

    // Prüfe auf InProfile Root-Element
    const inProfile = xmlDoc.getElementsByTagName('InProfile')[0];
    if (!inProfile) {
      throw new Error("XML must have an <InProfile> root element");
    }

    return true;
  };

  /**
   * Behandelt den Datei-Import
   */
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const xmlText = e.target.result;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        // Validiere XML
        validateXML(xmlDoc);

        // Parse und setze Daten
        const importedProfile = parseXML(xmlDoc);

        if (Object.keys(importedProfile).length === 0) {
          throw new Error("No profile data found in XML");
        }

        setInProfile(importedProfile);

        if (onNotification) {
          onNotification('Input Profile loaded successfully!', 'success');
        }
      } catch (error) {
        console.error('Import error:', error);
        if (onNotification) {
          onNotification('Error loading XML: ' + error.message, 'error');
        }
      }
    };

    reader.onerror = () => {
      if (onNotification) {
        onNotification('Error reading file', 'error');
      }
    };

    reader.readAsText(file);

    // Reset file input für erneute Auswahl derselben Datei
    event.target.value = '';
  };

  /**
   * Öffnet Datei-Dialog
   */
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xml"
        onChange={handleImport}
        style={{ display: 'none' }}
        aria-label="Load XML file"
      />

      <button
        onClick={handleClick}
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
        title="Load Input Profile from XML file"
      >
        Load from XML
      </button>
    </>
  );
}