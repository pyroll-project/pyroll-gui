export const parseNumberInput = (value) => {
    if (!value || value === '-' || value === '.' || value === '+') {
        return 0;
    }

    if (typeof value === 'number') {
        return value;
    }

    if (value.endsWith('e') || value.endsWith('e-') || value.endsWith('e+') ||
        value.endsWith('E') || value.endsWith('E-') || value.endsWith('E+')) {
        return 0;
    }

    try {
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    } catch (error) {
        return 0;
    }
};

export const prepareUnitsForBackend = (units) => {
    console.log('=== PREPARING UNITS FOR BACKEND ===');
    console.log('Original units:', units);

    const prepared = units.map(unit => {
        const preparedUnit = {...unit};

        const numericFields = [
            'nominal_radius', 'gap', 'velocityValue', 'inscribed_circle_diameter',
            'coulomb_friction_coefficient', 'transportValue', 'coolingValue',
            'environment_temperature', 'heat_transfer_coefficient', 'inner_radius',
            'coolant_temperature', 'coolant_volume_flux'
        ];

        numericFields.forEach(field => {
            if (preparedUnit[field] !== undefined && preparedUnit[field] !== null && preparedUnit[field] !== '') {
                const original = preparedUnit[field];
                preparedUnit[field] = typeof original === 'string'
                    ? parseNumberInput(original)
                    : original;

                if (original !== preparedUnit[field]) {
                    console.log(`  ${field}: "${original}" (${typeof original}) -> ${preparedUnit[field]} (${typeof preparedUnit[field]})`);
                }
            }
        });

        if (preparedUnit.groove && typeof preparedUnit.groove === 'object') {
            console.log('Converting groove parameters:');
            preparedUnit.groove = Object.fromEntries(
                Object.entries(preparedUnit.groove).map(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        const original = value;
                        const converted = typeof value === 'string' ? parseNumberInput(value) : value;
                        if (original !== converted) {
                            console.log(`    ${key}: "${original}" (${typeof original}) -> ${converted} (${typeof converted})`);
                        }
                        return [key, converted];
                    }
                    return [key, value];
                })
            );
        }

        return preparedUnit;
    });

    console.log('Prepared units:', prepared);
    console.log('=== END PREPARATION ===');

    return prepared;
};

export const prepareProfileForBackend = (profileData) => {
    console.log('=== PREPARING PROFILE FOR BACKEND ===');
    console.log('Original profile:', profileData);
    console.log('Original profile.shape:', profileData?.shape);  // ← NEU

    if (!profileData) {
        console.error('ERROR: profileData is null or undefined!');
        return {};
    }

    if (!profileData.shape) {
        console.error('ERROR: profileData.shape is missing!');
    }

    const prepared = {...profileData};

    const numericFields = [
        'diameter', 'side', 'height', 'width', 'corner_radius',
        'temperature', 'strain', 'density', 'specific_heat_capacity',
        'thermal_conductivity'
    ];

    numericFields.forEach(field => {
        if (prepared[field] !== undefined && prepared[field] !== null && prepared[field] !== '') {
            const original = prepared[field];
            prepared[field] = typeof original === 'string'
                ? parseNumberInput(original)
                : original;

            if (original !== prepared[field]) {
                console.log(`  ${field}: "${original}" (${typeof original}) -> ${prepared[field]} (${typeof prepared[field]})`);
            }
        }
    });

    if (prepared.flowStressParams && typeof prepared.flowStressParams === 'object') {
        console.log('  Converting flowStressParams:');
        prepared.flowStressParams = Object.fromEntries(
            Object.entries(prepared.flowStressParams).map(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    const original = value;
                    const converted = typeof value === 'string' ? parseNumberInput(value) : value;
                    if (original !== converted) {
                        console.log(`    ${key}: "${original}" (${typeof original}) -> ${converted} (${typeof converted})`);
                    }
                    return [key, converted];
                }
                return [key, value];
            })
        );
    }


    console.log('shape field:', prepared.shape);  // ← NEU
    console.log('Prepared profile:', prepared);
    console.log('=== END PREPARATION ===');

    return prepared;
};