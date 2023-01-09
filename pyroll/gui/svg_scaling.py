from collections import namedtuple
from PySide6.QtSvgWidgets import QGraphicsSvgItem

# Named tuple containing width and height.
Size = namedtuple("Size", ["width", "height"])

def calculate_new_width_and_height(
    svg_path: str, max_width: float, max_height: float
) -> Size:
    """Calculates the scaling factor for the svg to fit the given width and height."""
    svg_item = QGraphicsSvgItem(svg_path)
    original_width = svg_item.boundingRect().width()
    original_height = svg_item.boundingRect().height()
    aspect_ratio = original_width / original_height

    # Calculate the scaling factor for the SVG
    if original_width > max_width:
        scaling_factor = max_width / original_width
    elif original_height > max_height:
        scaling_factor = max_height / original_height
    else:
        scaling_factor = 1
    new_width = original_width * scaling_factor
    new_height = original_height * scaling_factor
    return Size(new_width, new_height)
