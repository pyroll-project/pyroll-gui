import html2canvas from 'html2canvas';

export const exportResultsTableAsCSV = (results, filename) => {
    if (!results || !results.passes) {
        console.error('No results to export');
        return;
    }

    const rollPasses = results.passes.filter(pass =>
        pass.type === 'TwoRollPass' || pass.type === 'ThreeRollPass'
    );

    if (rollPasses.length === 0) {
        console.error('No RollPasses to export');
        return;
    }

    const headers = ['Parameter', ...rollPasses.map(pass => pass.label || `Pass ${pass.pass}`)];

    const rows = [
        ['Gap', ...rollPasses.map(pass =>
            pass.type === 'TwoRollPass' ? (pass.gap?.toFixed(4) || '') : '-'
        )],
        ['Inscribed Circle Diameter', ...rollPasses.map(pass =>
            pass.type === 'ThreeRollPass' ? (pass.inscribed_circle_diameter?.toFixed(4) || '') : '-'
        )],
        ['Bar Height', ...rollPasses.map(pass => pass.out_profile_height?.toFixed(4) || '')],
        ['Bar Width', ...rollPasses.map(pass => pass.out_profile_width?.toFixed(4) || '')],
        ['Bar Area', ...rollPasses.map(pass => pass.out_profile_cross_section_area?.toFixed(4) || '')],
        ['Reduction', ...rollPasses.map(pass => pass.reduction?.toFixed(4) || '')],
        ['Roll Radius', ...rollPasses.map(pass => {
            const radius = Array.isArray(pass.nominal_radius) ? pass.nominal_radius[0] : pass.nominal_radius;
            return radius?.toFixed(4) || '';
        })],
        ['Working Radius', ...rollPasses.map(pass => pass.working_radius?.toFixed(4) || '')],
        ['Entry Temperature', ...rollPasses.map(pass => pass.in_profile_temperature?.toFixed(4) || '')],
        ['Roll Force', ...rollPasses.map(pass => {
            const force = Array.isArray(pass.roll_force) ? pass.roll_force[0] : pass.roll_force;
            return force?.toFixed(4) || '';
        })],
        ['Roll Torque', ...rollPasses.map(pass => {
            const torque = Array.isArray(pass.roll_torque) ? pass.roll_torque[0] : pass.roll_torque;
            return torque?.toFixed(4) || '';
        })],
        ['Power', ...rollPasses.map(pass => pass.power?.toFixed(4) || '')],
        ['Flow Stress', ...rollPasses.map(pass => pass.out_profile_flow_stress?.toFixed(4) || '')],
        ['Filling Ratio', ...rollPasses.map(pass => pass.filling_ratio?.toFixed(4) || '')]
    ];

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_result_table.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportPlotAsPNG = async (plotElement, plotTitle, baseFilename) => {
    if (!plotElement) {
        console.error('No plot element to export');
        return;
    }

    try {
        const canvas = await html2canvas(plotElement, {
            backgroundColor: '#ffffff',
            scale: 2
        });

        canvas.toBlob((blob) => {
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            const sanitizedTitle = plotTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            link.setAttribute('href', url);
            link.setAttribute('download', `${baseFilename}_${sanitizedTitle}.png`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    } catch (error) {
        console.error('Error exporting plot:', error);
    }
};