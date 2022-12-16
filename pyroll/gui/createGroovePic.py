from typing import Optional, Union
from pyroll.gui.groove_options import SelectedGrooveOption
from pyroll.gui.text_processing import prettify
from pyroll.core import (
    DiamondGroove,
    SquareGroove,
    RoundGroove,
    BoxGroove,
)


def createGroovePic(groove_option: SelectedGrooveOption) -> Optional[Union[str, None]]:
    """Tries to construct the groove from the given groove option. Returns the path to the created picture."""

    groove_name = groove_option.groove_option.name
    groove_name_final = prettify(groove_name).replace(" ", "") + "Groove"
    groove_class = globals()[groove_name_final]
    try:
        groove = groove_class(**groove_option.selected_values)
    except Exception as e:
        print(e)
        return None
    print(groove)
    print(groove.contour_line)

    raise NotImplementedError("TODO: Create groove picture")


if __name__ == "__main__":
    from pyroll.gui.groove_options import DEFAULT_GROOVE_OPTIONS

    groove_option = DEFAULT_GROOVE_OPTIONS.get_groove_option("round")
    go = SelectedGrooveOption(groove_option, {"r1": 1, "r2": 2, "depth": 3})
    createGroovePic(go)
