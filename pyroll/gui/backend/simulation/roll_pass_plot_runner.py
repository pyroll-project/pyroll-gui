from typing import Dict, Any
from pyroll.core import RollPass, Roll

from .helpers import create_groove


def get_rollpass_contour(pass_data: Dict[str, Any]) -> Dict[str, Any]:
    try:
        groove_type = pass_data.get('grooveType')
        groove_params = pass_data.get('groove', {})
        gap = pass_data.get('gap', 0)
        orientation = pass_data.get('orientation')

        groove = create_groove(groove_type, groove_params)

        roll_pass = RollPass(
            orientation=orientation,
            roll=Roll(
                groove = groove,
                nominal_radius = 1
            ),
            gap=gap,
            velocity=1,
            coulomb_friction_coefficient = 0.2
        )

        if not hasattr(groove, 'contour_line'):
            return {"success": False, "error": "Groove has no contour_line"}

        upper_contour = roll_pass.technologically_orientated_contour_lines.geoms[0]
        upper_x = [p[0] for p in upper_contour.coords]
        upper_y = [p[1] for p in upper_contour.coords]

        lower_contour = roll_pass.technologically_orientated_contour_lines.geoms[1]
        lower_x = [p[0] for p in lower_contour.coords]
        lower_y = [p[1] for p in lower_contour.coords]

        return {
            "success": True,
            "upper": {
                "x": upper_x,
                "y": upper_y
            },
            "lower": {
                "x": lower_x,
                "y": lower_y
            },
            "gap": gap,
            "groove_type": groove_type,
            "usable_width": float(groove.usable_width) if hasattr(groove, 'usable_width') else None,
            "depth": float(groove.depth) if hasattr(groove, 'depth') else None
        }

    except Exception as e:
        import traceback
        return {
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc()
        }