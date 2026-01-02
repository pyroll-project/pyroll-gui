import React from 'react';

export default function PassDesignSaver({tableData, onNotification}) {

    const escapeXML = (text) => {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    };

    const generateGrooveXML = (groove, indent = '        ') => {
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


    const generateXML = (data) => {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<PassDesign>\n';
        xml += '  <Metadata>\n';
        xml += '    <Version>1.0</Version>\n';
        xml += `    <CreatedDate>${new Date().toISOString()}</CreatedDate>\n`;
        xml += '    <Application>PyRolL-Basic WebGUI</Application>\n';
        xml += '  </Metadata>\n';
        xml += '  <Units>\n';

        data.forEach((row, index) => {
            xml += `    <Unit id="${row.id}">\n`;
            xml += `      <Index>${index}</Index>\n`;
            xml += `      <Type>${escapeXML(row.type)}</Type>\n`;

            xml += '      <Parameters>\n';

            const specialFields = ['id', 'type', 'grooveType', 'groove'];

            Object.keys(row).forEach(key => {
                if (!specialFields.includes(key)) {
                    const value = row[key];
                    if (value !== undefined && value !== null && value !== '') {
                        xml += `        <Parameter name="${escapeXML(key)}">${escapeXML(String(value))}</Parameter>\n`;
                    }
                }
            });

            xml += '      </Parameters>\n';

            if (row.grooveType) {
                xml += `      <GrooveType>${escapeXML(row.grooveType)}</GrooveType>\n`;
            }

            if (row.groove) {
                xml += generateGrooveXML(row.groove, '      ');
            }

            xml += '    </Unit>\n';
        });

        xml += '  </Units>\n';
        xml += '</PassDesign>';

        return xml;
    };


    const handleExport = () => {
        try {
            if (!tableData || tableData.length === 0) {
                if (onNotification) {
                    onNotification('No Data for Export available.', 'error');
                }
                return;
            }

            const defaultName = `pass-design-${new Date().toISOString().slice(0, 10)}`;
            const fileName = prompt('File name for XML export:', defaultName);

            if (fileName === null) {
                return;
            }

            const finalFileName = fileName.trim() || defaultName;

            const fileNameWithExt = finalFileName.endsWith('.xml')
                ? finalFileName
                : `${finalFileName}.xml`;

            const xmlContent = generateXML(tableData);

            const blob = new Blob([xmlContent], {type: 'application/xml'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileNameWithExt;

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            if (onNotification) {
                onNotification(`Pass Design saved as "${fileNameWithExt}".`, 'success');
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
            title="Save Pass Design as XML."
        >
            Save as XML
        </button>
    );
}