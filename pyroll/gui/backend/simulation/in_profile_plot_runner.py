from typing import Dict, Any
from pyroll.core import Profile


def get_in_profile_contour(profile_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate contour data for the input profile using PyRoll Profile objects.

    Args:
        profile_data: Dictionary containing profile configuration
            - shape: 'round', 'square', 'box', 'hexagon'
            - diameter: for round profiles
            - side_length: for square profiles
            - width, height: for box profiles
            - diameter: for hexagon profiles

    Returns:
        Dictionary with success status and contour coordinates
    """
    try:
        shape = profile_data.get('shape', 'round').lower()

        if shape == 'round':
            diameter = profile_data.get('diameter', 0)
            profile = Profile.round(
                diameter=diameter,
                temperature=profile_data.get('temperature', 1200),
                material=profile_data.get('material'),
                flow_stress=profile_data.get('flow_stress')
            )

        elif shape == 'square':
            side_length = profile_data.get('side', 0)  # Changed from 'side_length' to 'side'
            corner_radius = profile_data.get('corner_radius', 0)
            profile = Profile.square(
                side=side_length,
                corner_radius=corner_radius,
                temperature=profile_data.get('temperature', 1200),
                material=profile_data.get('material'),
                flow_stress=profile_data.get('flow_stress')
            )

        elif shape == 'box':
            width = profile_data.get('width', 0)
            height = profile_data.get('height', 0)
            corner_radius = profile_data.get('corner_radius', 0)
            profile = Profile.box(
                width=width,
                height=height,
                corner_radius=corner_radius,
                temperature=profile_data.get('temperature', 1200),
                material=profile_data.get('material'),
                flow_stress=profile_data.get('flow_stress')
            )

        elif shape == 'hexagon':
            side_length = profile_data.get('side', 0)  # Changed to use 'side' parameter
            corner_radius = profile_data.get('corner_radius', 0)
            profile = Profile.hexagon(
                side=side_length,  # Hexagon uses side, not diameter
                corner_radius=corner_radius,
                temperature=profile_data.get('temperature', 1200),
                material=profile_data.get('material'),
                flow_stress=profile_data.get('flow_stress')
            )

        else:
            return {
                "success": False,
                "error": f"Unknown shape type: {shape}"
            }

        # Get contour from profile
        if not hasattr(profile, 'cross_section') or not hasattr(profile.cross_section, 'boundary'):
            return {
                "success": False,
                "error": "Profile has no cross_section boundary"
            }

        contour = profile.cross_section.boundary
        x_coords = [p[0] for p in contour.coords]
        y_coords = [p[1] for p in contour.coords]

        return {
            "success": True,
            "contour": {
                "x": x_coords,
                "y": y_coords
            },
            "shape": shape,
            "area": float(profile.cross_section.area) if hasattr(profile.cross_section, 'area') else None
        }

    except Exception as e:
        import traceback
        return {
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc()
        }