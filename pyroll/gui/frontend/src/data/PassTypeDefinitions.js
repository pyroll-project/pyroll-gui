export const getFieldsForType = (type) => {
    switch (type) {
        case 'TwoRollPass':
            return [
                {key: 'label', label: 'Label', type: 'string'},
                {key: 'gap', label: 'Gap', type: 'number'},
                {key: 'nominal_radius', label: 'Nominal Radius', type: 'number'},
                {key: 'velocity', label: 'Velocity', type: 'number'},
                {key: 'coulomb_friction_coefficient', label: 'Coulomb Friction Coefficient', type: 'number'},
                {
                    key: 'orientation',
                    label: 'Orientation',
                    type: 'select',
                    options: ['horizontal', 'vertical']
                },
                {
                    key: 'grooveType', label: 'Groove Type', type: 'select', options: [
                        'BoxGroove',
                        'ConstrictedBoxGroove',
                        'DiamondGroove',
                        'GothicGroove',
                        'SquareGroove',
                        'CircularOvalGroove',
                        'ConstrictedCircularOvalGroove',
                        'ConstrictedSwedishOvalGroove',
                        'FlatOvalGroove',
                        'Oval3RadiiGroove',
                        'Oval3RadiiFlankedGroove',
                        'SwedishOvalGroove',
                        'UpsetOvalGroove',
                        'RoundGroove',
                        'FalseRoundGroove'
                    ]
                },
                {key: 'groove', label: 'Groove Parameters', type: 'groove'},
            ];
        case 'ThreeRollPass':
            return [
                {key: 'label', label: 'Label', type: 'string'},
                {key: 'inscribed_circle_diameter', label: 'Inscribed Circle Diameter (ICD)', type: 'number'},
                {key: 'nominal_radius', label: 'Nominal Radius', type: 'number'},
                {key: 'velocity', label: 'Velocity', type: 'number'},
                {key: 'coulomb_friction_coefficient', label: 'Coulomb Friction Coefficient', type: 'number'},
                {
                    key: 'orientation',
                    label: 'Orientation',
                    type: 'select',
                    options: ['Y', 'AntiY']
                },
                {
                    key: 'grooveType', label: 'Groove Type', type: 'select', options: [
                        'CircularOvalGroove',
                        'RoundGroove',
                        'FalseRoundGroove'
                    ]
                },
                {key: 'groove', label: 'Groove Parameters', type: 'groove'},
            ];
        case 'Transport':
            return [
                {key: 'label', label: 'Label', type: 'string'},
                {key: 'transportDefineBy', label: 'Define by', type: 'select', options: ['length', 'duration']},
                {key: 'transportValue', label: 'Value', type: 'number', unit: ''},
                {key: 'environment_temperature', label: 'Environment Temperature', type: 'number'},
                {key: 'heat_transfer_coefficient', label: 'Heat Transfer Coefficient', type: 'number'}
            ];
        case 'CoolingPipe':
            return [
                {key: 'label', label: 'Label', type: 'string'},
                {key: 'coolingDefineBy', label: 'Define by', type: 'select', options: ['length', 'duration']},
                {key: 'coolingValue', label: 'Value', type: 'number', unit: ''},
                {key: 'inner_radius', label: 'Inner Radius', type: 'number'},
                {key: 'coolant_temperature', label: 'Coolant Temperature', type: 'number'},
                {key: 'coolant_volume_flux', label: 'Coolant Volume Flux', type: 'number'},
            ];
        default:
            return [];
    }
};