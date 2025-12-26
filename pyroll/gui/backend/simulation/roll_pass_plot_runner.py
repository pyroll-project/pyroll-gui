from typing import Dict, Any

from .helpers import create_groove


def get_rollpass_contour(pass_data: Dict[str, Any]) -> Dict[str, Any]:
    try:
        groove_type = pass_data.get('grooveType')
        groove_params = pass_data.get('groove', {})
        gap = pass_data.get('gap', 0)

        groove = create_groove(groove_type, groove_params)

        if not hasattr(groove, 'contour_line'):
            return {"success": False, "error": "Groove has no contour_line"}

        # Obere Kontur (Original)
        upper_contour = groove.contour_line
        upper_x = [p[0] for p in upper_contour.coords]
        upper_y = [p[1] + gap / 2 for p in upper_contour.coords]

        lower_x = upper_x.copy()
        lower_y = [-y for y in upper_y]

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