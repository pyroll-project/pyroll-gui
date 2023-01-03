from typing import Optional, Union
from pyroll.gui.groove_options import SelectedGrooveOption
from pyroll.gui.text_processing import prettify
from pyroll.core import (
    DiamondGroove,
    SquareGroove,
    RoundGroove,
    BoxGroove,
)
from shapely.geometry import LineString
import matplotlib.pyplot as plt


def createGroovePic(groove_option: SelectedGrooveOption) -> Optional[Union[str, None]]:
    """Tries to construct the groove from the given groove option. Returns the path to the created picture."""
    FILENAME = "groove.png"
    groove_name = groove_option.groove_option.name
    groove_name_final = prettify(groove_name).replace(" ", "") + "Groove"
    groove_class = globals()[groove_name_final]
    try:
        groove = groove_class(**groove_option.selected_values)
    except Exception as e:
        print(e)
        return None
    print(groove)
    countour_line: LineString = groove.contour_line
    fig, ax = plt.subplots()
    ax.plot(countour_line.xy[0], countour_line.xy[1])
    x, y = countour_line.xy
    # Plot the countour line with matplotlib
    plt.plot(x, y)
    # Save the figure
    plt.savefig(FILENAME)
    return FILENAME


if __name__ == "__main__":
    from pyroll.gui.groove_options import DEFAULT_GROOVE_OPTIONS

    groove_option = DEFAULT_GROOVE_OPTIONS.get_groove_option("round")
    go = SelectedGrooveOption(groove_option, {"r1": 1, "r2": 2, "depth": 3})
    createGroovePic(go)
