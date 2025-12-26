import numpy as np
import pyroll.basic

from typing import Dict, List, Any
from pyroll.core import Profile, PassSequence, RollPass, Transport, CoolingPipe

from .helpers import create_roll_pass, create_transport, create_cooling_pipe


def run_pyroll_simulation(units: List[Dict[str, Any]]) -> Dict[str, Any]:

    try:
        sequence = PassSequence([])

        for unit in units:
            unit_type = unit['type']

            if unit_type == 'TwoRollPass':
                sequence.append(create_roll_pass(unit))
            elif unit_type == 'ThreeRollPass':
                sequence.append(create_roll_pass(unit))
            elif unit_type == 'Transport':
                sequence.append(create_transport(unit))
            elif unit_type == 'CoolingPipe':
                sequence.append(create_cooling_pipe(unit))

        sequence.flatten()

        # Initiales Profil definieren
        # TODO: Diese Werte sollten vom Frontend kommen oder konfigurierbar sein
        initial_profile = Profile(
            # Beispiel für rundes Profil
            # temperature=1200,  # °C
            # strain=0,
            # ... weitere Initialisierungswerte
        )

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
        pass_result = {
            "pass_nr": i + 1,
            "label": unit.label if hasattr(unit, 'label') else f"Pass {i + 1}",
            "type": type(unit).__name__,
        }

        if hasattr(unit, 'roll_force'):
            pass_result['roll_force'] = float(unit.roll_force)
        if hasattr(unit, 'roll_torque'):
            pass_result['roll_torque'] = float(unit.roll.roll_torque)
        if hasattr(unit, 'power'):
            pass_result['power'] = float(unit.roll.power)

        # Profil-Informationen
        if hasattr(unit, 'out_profile'):
            profile = unit.out_profile
            if hasattr(profile, 'temperature'):
                pass_result['out_temperature'] = float(profile.temperature)
            if hasattr(profile, 'height'):
                pass_result['out_height'] = float(profile.height)
            if hasattr(profile, 'width'):
                pass_result['out_width'] = float(profile.width)

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

            # Validiere Groove-Parameter
            groove_params = unit['groove']
            if groove_params.get('r1', 0) <= 0:
                return False, f"Unit {i + 1}: R1 muss größer als 0 sein"

    return True, ""