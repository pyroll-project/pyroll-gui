export const getGrooveFields = (grooveType) => {
        switch (grooveType) {
            case 'BoxGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {key: 'depth', label: 'Depth', tooltip: 'Maximum depth'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        },
                    ],
                    optional: [
                        {key: 'ground_width', label: 'Ground Width', tooltip: 'Width of the groove ground'},
                        {
                            key: 'even_ground_width',
                            label: 'Even Ground Width',
                            tooltip: 'Width of the even ground line'
                        },
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the groove'},
                        {key: 'flank_angle', label: 'Flank Angle', tooltip: 'Inclination angle of the flanks'},
                    ],
                    rule: 'Exactly 2 of the Other Parameters must be set (not Ground Width and Even Ground Width together)'
                };
            case 'ConstrictedBoxGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {key: 'r4', label: 'R4', tooltip: 'Radius 4 (indent)'},
                        {key: 'depth', label: 'Depth', tooltip: 'Maximum depth'},
                        {key: 'indent', label: 'Indent', tooltip: 'Indentation depth'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        },
                    ],
                    optional: [
                        {key: 'ground_width', label: 'Ground Width', tooltip: 'Width of the groove ground'},
                        {
                            key: 'even_ground_width',
                            label: 'Even Ground Width',
                            tooltip: 'Width of the even ground'
                        },
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the groove'},
                        {key: 'flank_angle', label: 'Flank Angle', tooltip: 'Inclination angle of the flanks'},
                    ],
                    rule: 'Exactly 2 of the Other Parameters must be set (not Ground Width and Even Ground Width together)'
                };
            case 'DiamondGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        }
                    ],
                    optional: [
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the groove'},
                        {
                            key: 'tip_depth',
                            label: 'Tip Depth',
                            tooltip: 'Depth of the intersection of the extrapolated flanks'
                        },
                        {key: 'tip_angle', label: 'Tip Angle', tooltip: 'Angle between the flanks'},
                    ],
                    rule: 'Exactly two of Usable Width, Tip Depth and Tip Angle must be given.'
                };
            case 'GothicGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {key: 'r3', label: 'R3', tooltip: 'Radius 3 (ground)'},
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the groove'},
                        {key: 'depth', label: 'Depth', tooltip: 'Maximum depth'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        }
                    ]
                };
            case 'SquareGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        }
                    ],
                    optional: [
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the groove'},
                        {
                            key: 'tip_depth',
                            label: 'Tip Depth',
                            tooltip: 'Depth of the intersection of the extrapolated flanks'
                        },
                        {key: 'tip_angle', label: 'Tip Angle', tooltip: 'Angle between the flanks'},
                    ],
                    rule: 'Exactly two of Usable Width, Tip Depth and Tip Angle must be given. Tip angle is <85° or >95° (no matter if given or calculated internally)'
                };
            case 'CircularOvalGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        }
                    ],
                    optional: [
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the groove'},
                        {key: 'depth', label: 'Depth', tooltip: 'Maximum depth'},
                    ],
                    rule: 'Exactly two of R2, Usable Width and Depth must be given.'
                };
            case 'ConstrictedCircularOvalGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {key: 'r3', label: 'R3', tooltip: 'Radius 3 (ground)'},
                        {key: 'r4', label: 'R4', tooltip: 'Radius 4 (indent)'},
                        {key: 'depth', label: 'Depth', tooltip: 'Maximum depth'},
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the groove'},
                        {key: 'even_ground_width',  label: 'Even Ground Width', tooltip: 'Width of the even ground'},
                        {key: 'indent', label: 'Indent', tooltip: 'Indentation depth'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        },
                    ]
                };
            case 'ConstrictedSwedishOvalGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {key: 'r4', label: 'R4', tooltip: 'Radius 4 (indent)'},
                        {key: 'depth', label: 'Depth', tooltip: 'Maximum depth'},
                        {key: 'indent', label: 'Indent', tooltip: 'Indentation depth'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        },
                    ],
                    optional: [
                        {key: 'ground_width', label: 'Ground Width', tooltip: 'Width of the groove ground'},
                        {
                            key: 'even_ground_width',
                            label: 'Even Ground Width',
                            tooltip: 'Width of the even ground'
                        },
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the groove'},
                        {key: 'flank_angle', label: 'Flank Angle', tooltip: 'Inclination angle of the flanks'},
                    ],
                    rule: 'Exactly 2 of the Other Parameters must be set (not Ground Width and Even Ground Width together)'
                };
            case 'FlatOvalGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {key: 'depth', label: 'Depth', tooltip: 'Maximum depth'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        },
                    ],
                    optional: [
                        {
                            key: 'even_ground_width',
                            label: 'Even Ground Width',
                            tooltip: 'Width of the even ground'
                        },
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the groove'},
                    ],
                    rule: 'Exactly one of the Other Parameters must be set'
                };
            case 'Oval3RadiiGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {key: 'r3', label: 'R3', tooltip: 'Radius 3 (ground)'},
                        {key: 'depth', label: 'Depth', tooltip: 'Maximum depth'},
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the groove'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        },
                    ]
                };
            case 'Oval3RadiiFlankedGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {key: 'r3', label: 'R3', tooltip: 'Radius 3 (ground)'},
                        {key: 'depth', label: 'Depth', tooltip: 'Maximum depth'},
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the groove'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        },
                    ],
                    optional: [
                        {key: 'flank_angle', label: 'Flank Angle',tooltip: 'Inclination angle of the flanks'},
                        {key: 'flank_width', label: 'Flank Width',tooltip: 'Horizontal extent of the flanks'},
                        {key: 'flank_height', label: 'Flank Height',tooltip: 'Vertical extent of the flanks'},
                        {key: 'flank_length', label: 'Flank Length',tooltip: 'Length of the flanks'},
                    ]
                };
            case 'SwedishOvalGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {key: 'depth', label: 'Depth', tooltip: 'Maximum depth'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        },
                    ],
                    optional: [
                        {key: 'ground_width', label: 'Ground Width', tooltip: 'Width of the groove ground'},
                        {key: 'even_ground_width', label: 'Even Ground Width', tooltip: 'Width of the even ground'},
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the groove'},
                        {key: 'flank_angle', label: 'Flank Angle', tooltip: 'Inclination angle of the flanks'},
                    ],
                    rule: 'Exactly one of the Optional Parameters must be set (not Ground Width and Even Ground Width together)'
                };
            case 'UpsetOvalGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {key: 'r3', label: 'R3', tooltip: 'Radius 3 (ground)'},
                        {key: 'depth', label: 'Depth', tooltip: 'Maximum depth'},
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the groove'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        },
                    ]
                };
            case 'RoundGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        },
                    ],
                    optional: [
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {key: 'depth', label: 'Depth', tooltip: 'Maximum depth'},
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width'},
                    ],
                    rule: 'Exactly two of the Optional Parameters must be set'
                };
            case 'FalseRoundGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        },
                    ],
                    optional: [
                        {key: 'r2', label: 'R2', tooltip: 'Radius 2 (flank/ground)'},
                        {key: 'depth', label: 'Depth', tooltip: 'Maximum depth'},
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width'},
                        {key: 'flank_angle', label: 'Flank Angle',tooltip: 'Inclination angle of the flanks'},
                        {key: 'flank_width', label: 'Flank Width',tooltip: 'Horizontal extent of the flanks'},
                        {key: 'flank_height', label: 'Flank Height',tooltip: 'Vertical extent of the flanks'},
                        {key: 'flank_length', label: 'Flank Length',tooltip: 'Length of the flanks'},
                    ],
                    rule: 'Exactly two of R2, Depth or Usable Width must be set. Exactly one of Flank Angle, Width, Height or Length must be set.'
                };
                case 'FlatGroove':
                return {
                    required: [
                        {key: 'r1', label: 'R1', tooltip: 'Radius 1 (face/flank)'},
                        {key: 'usable_width', label: 'Usable Width', tooltip: 'Usable width of the rolls barrel width'},
                        {
                            key: 'pad_angle',
                            label: 'Pad Angle (°)',
                            tooltip: 'Angle between z-axis and roll face padding',
                            default: 0
                        }
                    ]
                };
            default:
                return {required: [], optional: [], rule: ''};
        }
    };