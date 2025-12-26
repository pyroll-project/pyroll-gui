from typing import Dict, List, Any
import numpy as np

from pyroll.core import Profile, PassSequence, Roll, RollPass, Transport, CoolingPipe, ThreeRollPass
from pyroll.core import grooves
from pyroll.core.roll.hookimpls import nominal_radius


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


def create_roll_pass(unit: Dict[str, Any]) -> RollPass:

    groove = create_groove(
        unit.get('grooveType', 'BoxGroove'),
        unit.get('groove', {})
    )


    if unit['type'] == 'TwoRollPass':
        roll_pass = RollPass(
            label=unit.get('label', ''),
            roll=Roll(
                groove=groove,
                nominal_radius=unit.get('nominal_radius', 0),
            ),
            gap=unit.get('gap', 0),
            velocity=unit.get('velocity', 0),
        )
    elif unit['type'] == 'ThreeRollPass':
        roll_pass = ThreeRollPass(
            label=unit.get('label', ''),
            orientation=unit.get('orientation', 0),
            roll=Roll(
                groove=groove,
                nominal_radius=unit.get('nominal_radius', 0),
            ),
            inscribed_circle_diameter=unit.get('inscribed_circle_diameter', 0),
            velocity=unit.get('velocity', 0),
            coulomb_friction_coefficient = unit.get('coulomb_friction_coefficient', 0),
        )
    return roll_pass


def create_transport(unit: Dict[str, Any]) -> Transport:

    define_by = unit.get('transportDefineBy', 'length')

    if define_by == 'length':
        transport = Transport(
            label=unit.get('label', ''),
            length=unit.get('transportValue', 0),
        )
    else:
        transport = Transport(
            label=unit.get('label', ''),
            duration=unit.get('transportValue', 0),
        )

    if 'environment_temperature' in unit:
        transport.environment_temperature = unit['environment_temperature']
    if 'heat_transfer_coefficient' in unit:
        transport.heat_transfer_coefficient = unit['heat_transfer_coefficient']

    return transport


def create_cooling_pipe(unit: Dict[str, Any]) -> CoolingPipe:
    define_by = unit.get('coolingDefineBy', 'length')

    if define_by == 'length':
        cooling = CoolingPipe(
            label=unit.get('label', ''),
            length=unit.get('coolingValue', 0),
            inner_radius = unit.get('inner_radius', 0),
            coolant_temperature = unit.get('coolant_temperature', 0),
            coolant_volume_flux = unit.get('coolant_volume_flux', 0)
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