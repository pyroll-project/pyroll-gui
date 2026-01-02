import pyroll.basic
from pyroll.basic import PassSequence, ThreeRollPass, RollPass

from typing import Dict, List, Any, Union
from .helpers import create_roll_pass, create_transport, create_cooling_pipe, create_initial_profile, \
    create_roll_pass_contour

def extract_profile_contour(cross_section):
    x_coords, y_coords = cross_section.boundary.xy

    return {
        'x': [float(x) for x in x_coords],
        'y': [float(y) for y in y_coords]
    }


def extract_results(pass_sequence: PassSequence) -> Dict[str, Any]:
    results = {
        "success": True,
        "units": len(pass_sequence),
        "passes": []
    }

    for i, unit in enumerate(pass_sequence):

        unit_type = type(unit).__name__

        pass_result = {"pass": i + 1,
                       "label": unit.label if hasattr(unit, 'label') else f"Pass {i + 1}",
                       "type": unit_type,
                       'in_profile_strain': unit.in_profile.strain,
                       'out_profile_strain': unit.out_profile.strain,
                       'in_profile_temperature': unit.in_profile.temperature,
                       'out_profile_temperature': unit.out_profile.temperature,
                       'in_profile_height': unit.in_profile.height,
                       'out_profile_height': unit.out_profile.height,
                       'in_profile_width': unit.in_profile.width,
                       'out_profile_width': unit.out_profile.width,
                       'in_profile_cross_section_area': unit.in_profile.cross_section.area,
                       'out_profile_cross_section_area': unit.out_profile.cross_section.area}

        if isinstance(unit, RollPass) or isinstance(unit, ThreeRollPass):

            reduction = (pass_result['in_profile_cross_section_area'] - pass_result['out_profile_cross_section_area']) / \
                        pass_result['in_profile_cross_section_area']
            pass_result['roll_force'] = unit.roll_force
            pass_result['roll_torque'] = unit.roll.roll_torque
            pass_result['elongation_efficiency'] = unit.elongation_efficiency
            pass_result['power'] = unit.power
            pass_result['out_profile_filling_error'] = unit.out_profile.filling_error
            pass_result['in_profile_velocity'] = unit.in_profile.velocity
            pass_result['out_profile_velocity'] = unit.out_profile.velocity
            pass_result['filling_ratio'] = unit.out_profile.filling_ratio
            pass_result['nominal_radius'] = unit.roll.nominal_radius
            pass_result['working_radius'] = unit.roll.working_radius
            pass_result['velocity'] = unit.velocity
            pass_result['gap'] = unit.gap
            pass_result['bite_angle'] = unit.bite_angle
            pass_result['reduction'] = reduction
            pass_result['in_profile_flow_stress'] = unit.in_profile.flow_stress
            pass_result['out_profile_flow_stress'] = unit.out_profile.flow_stress
            pass_result['in_profile_contour'] = extract_profile_contour(unit.in_profile.technologically_orientated_cross_section)
            pass_result['out_profile_contour'] = extract_profile_contour(unit.out_profile.technologically_orientated_cross_section)


            roll_contour_data = create_roll_pass_contour(unit)
            pass_result['roll_contour'] = roll_contour_data


        results['passes'].append(pass_result)

    return results


def run_pyroll_simulation(
        units: List[Dict[str, Any]],
        in_profile_data: Dict[str, Any],
        solve_method: str = "solve",
        solve_params: Union[Dict, Any] = None
):
    try:
        sequence_list = []
        for unit in units:
            unit_type = unit.get('type')
            if unit_type == 'TwoRollPass':
                sequence_list.append(create_roll_pass(unit))
            elif unit_type == 'ThreeRollPass':
                sequence_list.append(create_roll_pass(unit))
            elif unit_type == 'Transport':
                sequence_list.append(create_transport(unit))
            elif unit_type == 'CoolingPipe':
                sequence_list.append(create_cooling_pipe(unit))
        sequence = PassSequence(sequence_list)

        initial_profile = create_initial_profile(in_profile_data)

        if solve_method == "solve":
            sequence.solve(in_profile=initial_profile)


        elif solve_method == "solve_forward":
            if not solve_params or not hasattr(solve_params, 'in_velocity'):
                raise ValueError("Method requires incoming profile velocity.")

            in_velocity = solve_params.in_velocity
            sequence.solve_velocities_forward(in_profile=initial_profile,
                                              initial_speed=in_velocity)

        elif solve_method == "solve_backward":
            if not solve_params or not hasattr(solve_params, 'out_cross_section') or not hasattr(solve_params,
                                                                                                 'out_velocity'):
                raise ValueError("Method requires final profile cross-section area and velocity.")

            out_cross_section = solve_params.out_cross_section
            out_velocity = solve_params.out_velocity
            sequence.solve_velocities_backward(in_profile=initial_profile,
                                               final_cross_section_area=out_cross_section,
                                               final_speed=out_velocity
                                               )

        else:
            raise ValueError(f"Unknown solve method: {solve_method}")

        results = extract_results(sequence)

        return results

    except Exception as e:
        import traceback
        print(f"Simulation Error: {str(e)}")
        print(traceback.format_exc())
        raise
