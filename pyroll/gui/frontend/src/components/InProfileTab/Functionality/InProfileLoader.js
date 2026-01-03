import React, {useRef} from 'react';
import {parseNumericValue} from '../../../helpers/DataParser';

export default function InProfileLoader({setInProfile, onNotification}) {
    const fileInputRef = useRef(null);


    const getElementText = (parent, tagName) => {
        const element = parent.getElementsByTagName(tagName)[0];
        return element ? element.textContent : '';
    };


    const parseGeometryFromXML = (xmlDoc) => {
        const geometryElement = xmlDoc.getElementsByTagName('Geometry')[0];
        if (!geometryElement) return {};

        const geometry = {};
        const geometryChildren = geometryElement.children;

        for (let i = 0; i < geometryChildren.length; i++) {
            const child = geometryChildren[i];
            const key = child.tagName.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
            const value = parseNumericValue(child.textContent);

            if (value !== '' && value !== null && value !== undefined) {
                geometry[key] = value;
            }
        }

        return geometry;
    };

    const parseFlowStressParamsFromXML = (xmlDoc) => {
        const flowStressParamsElement = xmlDoc.getElementsByTagName('FlowStressParameters')[0];
        if (!flowStressParamsElement) return null;

        const params = {};
        const children = flowStressParamsElement.children;

        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const tagName = child.tagName;
            const value = parseNumericValue(child.textContent);

            if (value !== '' && value !== null && value !== undefined) {
                if (tagName === 'A') params.a = value;
                else if (tagName === 'M1') params.m1 = value;
                else if (tagName === 'M2') params.m2 = value;
                else if (tagName === 'M3') params.m3 = value;
                else if (tagName === 'M4') params.m4 = value;
                else if (tagName === 'M5') params.m5 = value;
                else if (tagName === 'M6') params.m6 = value;
                else if (tagName === 'M7') params.m7 = value;
                else if (tagName === 'M8') params.m8 = value;
                else if (tagName === 'M9') params.m9 = value;
                else if (tagName === 'BaseStrain') params.baseStrain = value;
                else if (tagName === 'BaseStrainRate') params.baseStrainRate = value;
            }
        }

        return Object.keys(params).length > 0 ? params : null;
    };

    const parseXML = (xmlDoc) => {
        const profile = {};

        const profileType = getElementText(xmlDoc, 'ProfileType');
        if (profileType) profile.shape = profileType;  // ← 'shape' nicht 'profileType'

        const temperature = getElementText(xmlDoc, 'Temperature');
        if (temperature) profile.temperature = parseNumericValue(temperature);

        const strain = getElementText(xmlDoc, 'Strain');
        if (strain) profile.strain = parseNumericValue(strain);

        const material = getElementText(xmlDoc, 'Material');
        if (material) profile.material = material;

        const materialType = getElementText(xmlDoc, 'MaterialType');
        if (materialType) profile.materialType = materialType;

        const flowStress = getElementText(xmlDoc, 'FlowStress');
        if (flowStress) profile.flow_stress = parseNumericValue(flowStress);

        const flowStressParams = parseFlowStressParamsFromXML(xmlDoc);
        if (flowStressParams) profile.flowStressParams = flowStressParams;

        const density = getElementText(xmlDoc, 'Density');
        if (density) profile.density = parseNumericValue(density);

        const specificHeatCapacity = getElementText(xmlDoc, 'SpecificHeatCapacity');
        if (specificHeatCapacity) profile.specific_heat_capacity = parseNumericValue(specificHeatCapacity);

        const thermalConductivity = getElementText(xmlDoc, 'ThermalConductivity');
        if (thermalConductivity) profile.thermal_conductivity = parseNumericValue(thermalConductivity);

        const geometry = parseGeometryFromXML(xmlDoc);
        Object.assign(profile, geometry);

        return profile;
    };

    const validateXML = (xmlDoc) => {
        if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
            throw new Error("Invalid XML format");
        }

        const inProfile = xmlDoc.getElementsByTagName('InProfile')[0];
        if (!inProfile) {
            throw new Error("XML must have an <InProfile> root element");
        }

        return true;
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const xmlText = e.target.result;
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlText, "text/xml");

                validateXML(xmlDoc);

                const importedProfile = parseXML(xmlDoc);

                console.log('Imported Profile:', importedProfile);  // ← HIER

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

        event.target.value = '';
    };

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
                style={{display: 'none'}}
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

