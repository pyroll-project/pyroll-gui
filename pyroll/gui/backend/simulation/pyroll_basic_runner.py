import numpy as np
import pyroll.basic

from typing import Dict, List, Any
from pyroll.core import Profile, PassSequence, RollPass, Transport, CoolingPipe

from .helpers import create_roll_pass, create_transport, create_cooling_pipe, create_initial_profile


def run_pyroll_simulation(
        units: List[Dict[str, Any]],
        in_profile_data: Dict[str, Any]
) -> Dict[str, Any]:
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

        sequence.solve(initial_profile)

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
            pass_result['roll_force'] = float(unit.roll_force),
            pass_result['roll_torque'] = float(unit.roll.roll_torque),
            pass_result['power'] = float(unit.power)

        pass_result['in_strain'] = float(unit.in_profile.strain)
        pass_result['in_temperature'] =  float(unit.in_profile.temperature)

        pass_result['out_strain'] = float(unit.out_profile.strain)
        pass_result['out_temperature'] = float(unit.out_profile.temperature)
        pass_result['out_height'] = float(unit.out_profile.height)
        pass_result['out_width'] = float(unit.out_profile.width)
        pass_result['out_cross_section_area'] = float(unit.out_profile.cross_section.area)
        pass_result['filling_ratio'] = float(unit.out_profile.filling_ratio)


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