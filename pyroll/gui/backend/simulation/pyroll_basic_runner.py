from typing import Dict, List, Any
import numpy as np


def extract_parameters(params: List[Dict[str, Any]]) -> Dict[str, float]:
    """
    Extrahiert Parameter aus der Tabelle

    Args:
        params: Liste von Dicts mit {parameter, wert, einheit}

    Returns:
        Dictionary mit parametername: wert
    """
    param_dict = {}
    for p in params:
        param_name = p['parameter'].lower().replace(' ', '_')
        param_dict[param_name] = float(p['wert'])

    return param_dict


def run_pyroll_simulation(units: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Führt die PyRoll Simulation durch

    Args:
        units: Liste von Pass-Units aus dem Frontend
    """

    # Units durchgehen und verarbeiten
    pass_sequence = []

    for unit in units:
        unit_type = unit['type']

        if unit_type == 'TwoRollPass':
            # TODO: PyRoll TwoRollPass Objekt erstellen
            pass_data = {
                'type': 'TwoRollPass',
                'grooveDepth': unit['grooveDepth'],
                'grooveWidth': unit['grooveWidth'],
                'rollRadius': unit['rollRadius']
            }
            pass_sequence.append(pass_data)

        elif unit_type == 'ThreeRollPass':
            pass_data = {
                'type': 'ThreeRollPass',
                'grooveDepth': unit['grooveDepth'],
                'grooveWidth': unit['grooveWidth'],
                'rollRadius': unit['rollRadius'],
                'roll3Offset': unit['roll3Offset']
            }
            pass_sequence.append(pass_data)

        elif unit_type == 'Transport':
            pass_data = {
                'type': 'Transport',
                'length': unit['length'],
                'duration': unit['duration']
            }
            pass_sequence.append(pass_data)

        elif unit_type == 'CoolingPipe':
            pass_data = {
                'type': 'CoolingPipe',
                'length': unit['length'],
                'coolingRate': unit['coolingRate'],
                'temperature': unit['temperature']
            }
            pass_sequence.append(pass_data)

    # Dummy-Ergebnis
    result = {
        "erfolg": True,
        "anzahlUnits": len(pass_sequence),
        "passSequence": pass_sequence,
        "ausgabeParameter": {
            "gesamtKraft": 1250.5,
            "gesamtMoment": 450.3,
        }
    }

    return result


def generate_example_diagram(params: Dict[str, float]) -> Dict[str, List]:
    """
    Generiert Beispiel-Diagrammdaten
    In der echten Version würdest du hier die PyRoll-Ergebnisse visualisieren
    """
    x = np.linspace(0, 10, 50)
    faktor = params.get('durchmesser', 50) / 50.0
    y = faktor * (x ** 2 + np.sin(x) * 10)

    return {
        "x": x.tolist(),
        "y": y.tolist(),
        "label": "Kraft über Weg"
    }


def validate_parameters(params: List[Dict[str, Any]]) -> tuple[bool, str]:
    """
    Validiert die Eingabeparameter

    Returns:
        (is_valid, error_message)
    """
    required_params = ['durchmesser', 'geschwindigkeit', 'temperatur']
    param_dict = extract_parameters(params)

    for req in required_params:
        if req not in param_dict:
            return False, f"Fehlender Parameter: {req}"

        if param_dict[req] <= 0:
            return False, f"Parameter {req} muss größer als 0 sein"

    return True, ""