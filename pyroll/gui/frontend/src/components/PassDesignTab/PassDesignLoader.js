import React, {useRef} from 'react';

export default function PassDesignLoader({setTableData, onNotification}) {
    const fileInputRef = useRef(null);

    const parseNumericValue = (value) => {
        if (value === undefined || value === null || value === '') {
            return '';
        }

        const numValue = Number(value);
        return !isNaN(numValue) ? numValue : value;
    };

    const getElementText = (parent, tagName) => {
        const element = parent.getElementsByTagName(tagName)[0];
        return element ? element.textContent : '';
    };

    const parseGrooveFromXML = (unit) => {
        const grooveElement = unit.getElementsByTagName('Groove')[0];
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

    const parseParametersFromXML = (unit) => {
        const parameters = {};
        const paramElements = unit.getElementsByTagName('Parameter');

        for (let i = 0; i < paramElements.length; i++) {
            const param = paramElements[i];
            const paramName = param.getAttribute('name');
            const paramValue = parseNumericValue(param.textContent);

            if (paramName && paramValue !== '' && paramValue !== null && paramValue !== undefined) {
                parameters[paramName] = paramValue;
            }
        }

        return parameters;
    };

    const parseXML = (xmlDoc) => {
        const units = xmlDoc.getElementsByTagName('Unit');
        const parsedData = [];

        for (let i = 0; i < units.length; i++) {
            const unit = units[i];

            const idAttr = unit.getAttribute('id');
            const id = idAttr ? parseInt(idAttr) : undefined;
            const type = getElementText(unit, 'Type');

            const parameters = parseParametersFromXML(unit);

            const grooveType = getElementText(unit, 'GrooveType');
            const groove = parseGrooveFromXML(unit);

            const rowData = {};

            if (id !== undefined) rowData.id = id;
            if (type) rowData.type = type;
            if (grooveType) rowData.grooveType = grooveType;

            Object.assign(rowData, parameters);

            if (groove) {
                rowData.groove = groove;
            }

            parsedData.push(rowData);
        }

        return parsedData;
    };


    const validateXML = (xmlDoc) => {
        if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
            throw new Error("Invalid XML format");
        }

        const passDesign = xmlDoc.getElementsByTagName('PassDesign')[0];
        if (!passDesign) {
            throw new Error("XML must contain <PassDesign> root-element.");
        }

        const units = xmlDoc.getElementsByTagName('Units')[0];
        if (!units) {
            throw new Error("XML must contain at least one <Units> element.");
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

                const importedData = parseXML(xmlDoc);
                setTableData(importedData);

                if (onNotification) {
                    onNotification(
                        `Pass Design loaded. (${importedData.length} Unit${importedData.length !== 1 ? 's' : ''})`,
                        'success'
                    );
                }
            } catch (error) {
                console.error('Import error:', error);
                if (onNotification) {
                    onNotification('Error during import: ' + error.message, 'error');
                }
            }
        };

        reader.onerror = () => {
            if (onNotification) {
                onNotification('Error when reading file.', 'error');
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
                aria-label="XML-Datei laden"
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
                title="Load Pass Design from XML-file."
            >
                Load from XML
            </button>
        </>
    );
}
