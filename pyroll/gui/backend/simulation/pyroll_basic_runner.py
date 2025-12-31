import pyroll.basic
from pyroll.basic import PassSequence

from typing import Dict, List, Any, Union
from .helpers import create_roll_pass, create_transport, create_cooling_pipe, create_initial_profile


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
        print(solve_method)
        if solve_method == "solve":
            sequence.solve(in_profile=initial_profile)


        elif solve_method == "solve_forward":
            if not solve_params or not hasattr(solve_params, 'in_velocity'):
                raise ValueError("Method requires incoming profile velocity.")

            in_velocity = solve_params.in_velocity
            sequence.solve_velocities_forward(in_profile=initial_profile,
                                              initial_speed=in_velocity)

        elif solve_method == "solve_backward":
            print('Here')
            if not solve_params or not hasattr(solve_params, 'out_cross_section') or not hasattr(solve_params,
                                                                                                 'out_velocity'):
                raise ValueError("Method requires final profile cross-section area and velocity.")

            out_cross_section = solve_params.out_cross_section
            out_velocity = solve_params.out_velocity
            print(50*'=')
            print(out_cross_section)
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
                       }
        if unit_type in ("TwoRollPass", "ThreeRollPass"):
            out_cross_section_area = float(unit.out_profile.cross_section.area)
            in_cross_section_area = float(unit.in_profile.cross_section.area)

            reduction = (in_cross_section_area - out_cross_section_area) / in_cross_section_area

            pass_result['roll_force'] = float(unit.roll_force),
            pass_result['roll_torque'] = float(unit.roll.roll_torque),
            pass_result['power'] = float(unit.power)
            pass_result['filling_ratio'] = float(unit.out_profile.filling_ratio)
            pass_result['nominal_radius'] = float(unit.roll.nominal_radius),
            pass_result['working_radius'] = float(unit.roll.working_radius)
            pass_result['velocity'] = float(unit.velocity)
            pass_result['gap'] = float(unit.gap)
            pass_result['bite_angle'] = float(unit.bite_angle)
            pass_result['reduction'] = reduction
            pass_result['in_flow_stress'] = float(unit.in_profile.flow_stress)
            pass_result['out_flow_stress'] = float(unit.out_profile.flow_stress)

        pass_result['in_strain'] = float(unit.in_profile.strain)
        pass_result['out_strain'] = float(unit.out_profile.strain)
        pass_result['in_temperature'] = float(unit.in_profile.temperature)
        pass_result['out_temperature'] = float(unit.out_profile.temperature)

        pass_result['out_height'] = float(unit.out_profile.height)
        pass_result['out_width'] = float(unit.out_profile.width)
        pass_result['out_cross_section_area'] = float(unit.out_profile.cross_section.area)

        results['passes'].append(pass_result)

    return results


def validate_parameters(units: List[Dict[str, Any]]) -> tuple[bool, str]:
    if not units or len(units) == 0:
        return False, "No Units defined"

    for i, unit in enumerate(units):
        unit_type = unit.get('type')

        if not unit_type:
            return False, f"Unit {i + 1}: Type missing"

        if unit_type == 'TwoRollPass':
            if 'grooveType' not in unit:
                return False, f"Unit {i + 1}: Groove Type missing"
            if 'groove' not in unit or not unit['groove']:
                return False, f"Unit {i + 1}: Groove Parameter missing"

            groove_params = unit['groove']
            if groove_params.get('r1', 0) <= 0:
                return False, f"Unit {i + 1}: R1 must be greater than 0"

    return True, ""
