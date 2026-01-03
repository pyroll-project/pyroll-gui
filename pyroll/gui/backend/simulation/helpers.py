from typing import Dict, Any, Union

from pyroll.core import Profile, Roll, RollPass, Transport, CoolingPipe, ThreeRollPass, TwoRollPass, PassSequence
from pyroll.core import grooves
from pyroll.freiberg_flow_stress import FreibergFlowStressCoefficients

def create_initial_profile(in_profile_data: Dict[str, Any]):
    shape = in_profile_data.get('shape')
    material_type = in_profile_data.get('materialType')

    if not shape:
        raise ValueError("Profile shape is required but was not provided")

    if shape == 'round':
        in_profile = Profile.round(
            diameter=in_profile_data.get('diameter'),
            temperature=in_profile_data.get('temperature'),
            strain=in_profile_data.get('strain'),
            material=in_profile_data.get('material'),
            density=in_profile_data.get('density'),
            specific_heat_capacity=in_profile_data.get('specific_heat_capacity'),
            thermal_conductivity=in_profile_data.get('thermal_conductivity'),
        )

    elif shape == 'square':
        in_profile = Profile.square(
            side=in_profile_data.get('side'),
            corner_radius=in_profile_data.get('corner_radius'),
            temperature=in_profile_data.get('temperature'),
            strain=in_profile_data.get('strain'),
            material=in_profile_data.get('material'),
            density=in_profile_data.get('density'),
            specific_heat_capacity=in_profile_data.get('specific_heat_capacity'),
            thermal_conductivity=in_profile_data.get('thermal_conductivity'),
        )

    elif shape == 'box':
        in_profile = Profile.box(
            height=in_profile_data.get('height'),
            width=in_profile_data.get('width'),
            corner_radius=in_profile_data.get('corner_radius'),
            temperature=in_profile_data.get('temperature'),
            strain=in_profile_data.get('strain'),
            material=in_profile_data.get('material'),
            density=in_profile_data.get('density'),
            specific_heat_capacity=in_profile_data.get('specific_heat_capacity'),
            thermal_conductivity=in_profile_data.get('thermal_conductivity'),
        )

    elif shape == 'hexagon':
        in_profile = Profile.hexagon(
            side=in_profile_data.get('side'),
            corner_radius=in_profile_data.get('corner_radius'),
            temperature=in_profile_data.get('temperature'),
            strain=in_profile_data.get('strain'),
            material=in_profile_data.get('material'),
            density=in_profile_data.get('density'),
            specific_heat_capacity=in_profile_data.get('specific_heat_capacity'),
            thermal_conductivity=in_profile_data.get('thermal_conductivity'),
        )

    else:
        raise ValueError(f"Unknown profile shape: '{shape}'. Must be one of: round, square, box, hexagon")

    if material_type:
        flow_stress_params = in_profile_data.get('flowStressParams')
        if flow_stress_params:
            flow_stress_coefficients = FreibergFlowStressCoefficients(**flow_stress_params)
            in_profile.freiberg_flow_stress_coefficients = flow_stress_coefficients

    return in_profile


def create_groove(groove_type: str, groove_params: Dict[str, Any]):
    try:
        groove_class = getattr(grooves, groove_type)
    except AttributeError:
        raise ValueError(f"Unknown groove type: {groove_type}")

    clean_params = {k: v for k, v in groove_params.items() if v is not None}

    try:
        groove = groove_class(**clean_params)
        return groove
    except Exception as e:
        raise ValueError(f"Error creating {groove_type}: {str(e)}")


def create_roll_pass_contour(roll_pass: Union[RollPass, ThreeRollPass]):
    groove_type = roll_pass.roll.groove.__class__.__name__
    contours = roll_pass.technologically_orientated_contour_lines.geoms

    if isinstance(roll_pass, ThreeRollPass):
        contour_data = []
        for i, contour in enumerate(contours):
            x_coords = [p[0] for p in contour.coords]
            y_coords = [p[1] for p in contour.coords]
            contour_data.append({
                "x": x_coords,
                "y": y_coords
            })

        return {
            "success": True,
            "pass_type": "ThreeRollPass",
            "contours": contour_data,
            "inscribed_circle_diameter": roll_pass.inscribed_circle_diameter,
            "groove_type": groove_type,
            "usable_width": float(roll_pass.usable_width) if hasattr(roll_pass, 'usable_width') else None,
            "depth": float(roll_pass.roll.groove.depth) if hasattr(roll_pass.roll.groove, 'depth') else None
        }
    else:
        upper_contour = contours[0]
        upper_x = [p[0] for p in upper_contour.coords]
        upper_y = [p[1] for p in upper_contour.coords]

        lower_contour = contours[1]
        lower_x = [p[0] for p in lower_contour.coords]
        lower_y = [p[1] for p in lower_contour.coords]

        return {
            "success": True,
            "pass_type": "TwoRollPass",
            "upper": {
                "x": upper_x,
                "y": upper_y
            },
            "lower": {
                "x": lower_x,
                "y": lower_y
            },
            "gap": roll_pass.gap,
            "groove_type": groove_type,
            "usable_width": float(roll_pass.roll.groove.usable_width) if hasattr(roll_pass.roll.groove,
                                                                                 'usable_width') else None,
            "depth": float(roll_pass.roll.groove.depth) if hasattr(roll_pass.roll.groove, 'depth') else None
        }


def create_roll_pass(unit: Dict[str, Any]) -> RollPass:
    groove = create_groove(
        unit.get('grooveType'),
        unit.get('groove')
    )
    velocity_define_by = unit.get('velocityDefineBy', 'velocity')

    if unit['type'] == 'TwoRollPass':
        if velocity_define_by == 'velocity':
            roll_pass = TwoRollPass(
                label=unit.get('label', ''),
                orientation=unit.get('orientation'),
                roll=Roll(
                    groove=groove,
                    nominal_radius=unit.get('nominal_radius')
                ),
                velocity=unit.get('velocityValue'),
                gap=unit.get('gap'),
                coulomb_friction_coefficient=unit.get('coulomb_friction_coefficient'),
            )
        else:
            roll_pass = TwoRollPass(
                label=unit.get('label', ''),
                orientation=unit.get('orientation'),
                roll=Roll(
                    groove=groove,
                    nominal_radius=unit.get('nominal_radius'),
                    rotational_frequency=unit.get('velocityValue')
                ),
                gap=unit.get('gap'),
                coulomb_friction_coefficient=unit.get('coulomb_friction_coefficient'),
            )

    elif unit['type'] == 'ThreeRollPass':
        if velocity_define_by == 'velocity':
            roll_pass = ThreeRollPass(
                label=unit.get('label', ''),
                orientation=unit.get('orientation'),
                roll=Roll(
                    groove=groove,
                    nominal_radius=unit.get('nominal_radius')
                ),
                velocity=unit.get('velocityValue'),
                inscribed_circle_diameter=unit.get('inscribed_circle_diameter'),
                coulomb_friction_coefficient=unit.get('coulomb_friction_coefficient'),
            )
        else:
            roll_pass = ThreeRollPass(
                label=unit.get('label', ''),
                orientation=unit.get('orientation'),
                roll=Roll(
                    groove=groove,
                    nominal_radius=unit.get('nominal_radius'),
                    rotational_frequency=unit.get('velocityValue')
                ),
                inscribed_circle_diameter=unit.get('inscribed_circle_diameter'),
                coulomb_friction_coefficient=unit.get('coulomb_friction_coefficient'),
            )

    return roll_pass


def create_transport(unit: Dict[str, Any]) -> Transport:
    define_by = unit.get('transportDefineBy', 'length')

    if define_by == 'length':
        transport = Transport(
            label=unit.get('label', ''),
            length=unit.get('transportValue'),
            environment_temperature=unit.get('environment_temperature', 293.15),
            heat_transfer_coefficient=unit.get('heat_transfer_coefficient', 15)
        )
    else:
        transport = Transport(
            label=unit.get('label', ''),
            duration=unit.get('transportValue'),
            environment_temperature=unit.get('environment_temperature', 293.15),
            heat_transfer_coefficient=unit.get('heat_transfer_coefficient', 15)
        )

    return transport


def create_cooling_pipe(unit: Dict[str, Any]) -> CoolingPipe:
    define_by = unit.get('coolingDefineBy', 'length')

    if define_by == 'length':
        cooling = CoolingPipe(
            label=unit.get('label', ''),
            length=unit.get('coolingValue', 0),
            inner_radius=unit.get('inner_radius', 0),
            coolant_temperature=unit.get('coolant_temperature', 0),
            coolant_volume_flux=unit.get('coolant_volume_flux', 0)
        )
    else:
        cooling = CoolingPipe(
            label=unit.get('label', ''),
            duration=unit.get('coolingValue', 0),
            inner_radius=unit.get('inner_radius', 0),
            coolant_temperature=unit.get('coolant_temperature', 0),
            coolant_volume_flux=unit.get('coolant_volume_flux', 0)
        )

    return cooling


def extract_profile_contour(cross_section):
    x_coords, y_coords = cross_section.boundary.xy

    return {
        'x': [float(x) for x in x_coords],
        'y': [float(y) for y in y_coords]
    }