from typing import Dict, Any
from pyroll.core import RollPass, Roll, ThreeRollPass

from .helpers import create_groove


def get_rollpass_contour(pass_data: Dict[str, Any]) -> Dict[str, Any]:
    try:
        groove_type = pass_data.get('grooveType')
        groove_params = pass_data.get('groove', {})
        gap = pass_data.get('gap')
        orientation = pass_data.get('orientation')
        pass_type = pass_data.get('type')

        groove = create_groove(groove_type, groove_params)

        if pass_type == 'ThreeRollPass':
            roll_pass = ThreeRollPass(
                orientation=orientation,
                roll=Roll(
                    groove=groove,
                    nominal_radius=1
                ),
                inscribed_circle_diameter=gap if gap else 0.1,
                velocity=1,
                coulomb_friction_coefficient=0.2
            )
        else:  # TwoRollPass
            roll_pass = RollPass(
                orientation=orientation,
                roll=Roll(
                    groove=groove,
                    nominal_radius=1
                ),
                gap=gap if gap else 0.05,
                velocity=1,
                coulomb_friction_coefficient=0.2
            )

        if not hasattr(groove, 'contour_line'):
            return {"success": False, "error": "Groove has no contour_line"}

        contours = roll_pass.technologically_orientated_contour_lines.geoms

        if pass_type == 'ThreeRollPass':
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
                "inscribed_circle_diameter": gap,
                "groove_type": groove_type,
                "usable_width": float(groove.usable_width) if hasattr(groove, 'usable_width') else None,
                "depth": float(groove.depth) if hasattr(groove, 'depth') else None
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
